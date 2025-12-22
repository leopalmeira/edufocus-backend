/**
 * Script de Inicialização do WhatsApp
 * Execute ANTES de iniciar o servidor para garantir que todos os WhatsApp estejam conectados
 */

const { getWhatsAppService } = require('./whatsapp-service');
const Database = require('better-sqlite3');
const path = require('path');

const DB_DIR = path.join(__dirname, '../database');
const systemDBPath = path.join(DB_DIR, 'system.db');

async function initializeAllWhatsApp() {
    console.log('🚀 ===== INICIALIZAÇÃO WHATSAPP =====\n');

    const systemDB = new Database(systemDBPath);
    const schools = systemDB.prepare('SELECT id, name FROM schools').all();
    systemDB.close();

    console.log(`📋 Encontradas ${schools.length} escolas\n`);

    const results = {
        connected: [],
        needsQR: [],
        errors: []
    };

    for (const school of schools) {
        try {
            console.log(`📱 Inicializando Escola ${school.id} (${school.name})...`);

            const whatsappService = getWhatsAppService(school.id);

            // Tentar inicializar
            await whatsappService.initialize();

            // Aguardar 2 segundos para conexão estabilizar
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Verificar status
            const status = whatsappService.getStatus();
            const hasSocket = !!(whatsappService.sock?.user);
            const isConnected = status.connected || hasSocket;

            if (isConnected) {
                console.log(`   ✅ CONECTADO - Telefone: ${status.phone || 'N/A'}`);
                results.connected.push(school);

                // Iniciar keep-alive
                whatsappService.startKeepAlive();
                console.log(`   🔄 Keep-alive iniciado\n`);
            } else if (status.qrCode) {
                console.log(`   ⚠️  QR CODE NECESSÁRIO - Escaneie no painel\n`);
                results.needsQR.push(school);
            } else {
                console.log(`   ⚠️  Desconectado - Verificar autenticação\n`);
                results.needsQR.push(school);
            }

        } catch (error) {
            console.error(`   ❌ ERRO: ${error.message}\n`);
            results.errors.push({ school, error: error.message });
        }
    }

    // Resumo
    console.log('\n📊 ===== RESUMO DA INICIALIZAÇÃO =====\n');
    console.log(`✅ Conectadas: ${results.connected.length}/${schools.length}`);
    if (results.connected.length > 0) {
        results.connected.forEach(s => {
            console.log(`   - Escola ${s.id}: ${s.name}`);
        });
    }

    console.log(`\n⚠️  Precisam de QR Code: ${results.needsQR.length}/${schools.length}`);
    if (results.needsQR.length > 0) {
        results.needsQR.forEach(s => {
            console.log(`   - Escola ${s.id}: ${s.name}`);
        });
        console.log('\n   💡 Dica: Execute "node server/reconnect_all_whatsapp.js" para gerar QR Codes');
    }

    if (results.errors.length > 0) {
        console.log(`\n❌ Erros: ${results.errors.length}/${schools.length}`);
        results.errors.forEach(e => {
            console.log(`   - Escola ${e.school.id}: ${e.error}`);
        });
    }

    console.log('\n✅ ===== INICIALIZAÇÃO CONCLUÍDA =====\n');

    if (results.connected.length === schools.length) {
        console.log('🎉 TODAS as escolas estão conectadas e prontas!\n');
    } else {
        console.log('⚠️  Algumas escolas precisam de atenção. Verifique acima.\n');
    }

    return results;
}

// Executar
initializeAllWhatsApp()
    .then(results => {
        console.log('ℹ️  Dica: Para monitoramento contínuo, execute:');
        console.log('   node server/keep_whatsapp_alive.js\n');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Erro fatal:', error);
        process.exit(1);
    });
