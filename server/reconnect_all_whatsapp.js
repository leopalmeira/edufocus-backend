/**
 * Script para RECONECTAR todos os WhatsApp
 * Execute este script quando o WhatsApp estiver desconectado
 */

const { getWhatsAppService } = require('./whatsapp-service');
const Database = require('better-sqlite3');
const path = require('path');

const DB_DIR = path.join(__dirname, '../database');
const systemDBPath = path.join(DB_DIR, 'system.db');

async function reconnectAll() {
    console.log('🔄 ===== RECONECTANDO WHATSAPP =====\n');

    const systemDB = new Database(systemDBPath);
    const schools = systemDB.prepare('SELECT id, name FROM schools').all();
    systemDB.close();

    console.log(`📋 Encontradas ${schools.length} escolas\n`);

    for (const school of schools) {
        try {
            console.log(`📱 Reconectando Escola ${school.id} (${school.name})...`);

            const whatsappService = getWhatsAppService(school.id);

            // Verificar status atual
            const statusBefore = whatsappService.getStatus();
            console.log(`   Status antes: ${statusBefore.connected ? '✅ Conectado' : '❌ Desconectado'}`);

            if (!statusBefore.connected) {
                console.log(`   🔄 Inicializando conexão...`);
                await whatsappService.initialize();

                // Aguardar 3 segundos para conexão estabilizar
                await new Promise(resolve => setTimeout(resolve, 3000));

                // Verificar status após reconexão
                const statusAfter = whatsappService.getStatus();

                if (statusAfter.connected) {
                    console.log(`   ✅ SUCESSO! WhatsApp conectado`);
                    console.log(`   📞 Telefone: ${statusAfter.phone || 'N/A'}`);

                    // Iniciar keep-alive
                    whatsappService.startKeepAlive();
                    console.log(`   🔄 Keep-alive iniciado`);
                } else if (statusAfter.qrCode) {
                    console.log(`   ⚠️ QR CODE GERADO - Escaneie no terminal ou no painel da escola`);
                } else {
                    console.log(`   ⚠️ Ainda desconectado - Verifique autenticação`);
                }
            } else {
                console.log(`   ✅ Já estava conectado`);

                // Garantir que keep-alive está rodando
                whatsappService.startKeepAlive();
                console.log(`   🔄 Keep-alive verificado`);
            }

            console.log('');

        } catch (error) {
            console.error(`   ❌ ERRO: ${error.message}\n`);
        }
    }

    console.log('✅ ===== RECONEXÃO CONCLUÍDA =====\n');
    console.log('ℹ️ Dica: Execute "node server/diagnose_whatsapp.js" para verificar o status\n');
}

// Executar
reconnectAll().catch(err => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
