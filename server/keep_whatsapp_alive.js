/**
 * Serviço de Monitoramento Contínuo do WhatsApp
 * Mantém TODAS as escolas sempre conectadas
 * Execute este script em paralelo com o servidor principal
 */

const { getWhatsAppService } = require('./whatsapp-service');
const Database = require('better-sqlite3');
const path = require('path');

const DB_DIR = path.join(__dirname, '../database');
const systemDBPath = path.join(DB_DIR, 'system.db');

// Configurações
const CHECK_INTERVAL = 2 * 60 * 1000; // Verificar a cada 2 minutos
const RECONNECT_DELAY = 5000; // Aguardar 5 segundos entre reconexões

let isRunning = true;
let schools = [];

// Carregar lista de escolas
function loadSchools() {
    try {
        const systemDB = new Database(systemDBPath);
        schools = systemDB.prepare('SELECT id, name FROM schools').all();
        systemDB.close();
        console.log(`📋 Carregadas ${schools.length} escolas para monitoramento\n`);
    } catch (error) {
        console.error('❌ Erro ao carregar escolas:', error.message);
        schools = [];
    }
}

// Verificar e reconectar uma escola
async function checkAndReconnect(school) {
    try {
        const whatsappService = getWhatsAppService(school.id);
        const status = whatsappService.getStatus();

        // Verificação dupla: flag connected E socket ativo
        const hasSocket = !!(whatsappService.sock?.user);
        const isConnected = status.connected || hasSocket;

        const now = new Date().toLocaleTimeString('pt-BR');

        if (!isConnected) {
            console.log(`⚠️  [${now}] Escola ${school.id} (${school.name}) DESCONECTADA`);
            console.log(`   🔄 Tentando reconectar...`);

            try {
                await whatsappService.initialize();
                await new Promise(resolve => setTimeout(resolve, 3000)); // Aguardar 3s

                const newStatus = whatsappService.getStatus();
                const reconnected = newStatus.connected || !!(whatsappService.sock?.user);

                if (reconnected) {
                    console.log(`   ✅ Escola ${school.id} RECONECTADA com sucesso!`);
                    console.log(`   📞 Telefone: ${newStatus.phone || 'N/A'}`);

                    // Garantir keep-alive está ativo
                    whatsappService.startKeepAlive();
                } else if (newStatus.qrCode) {
                    console.log(`   ⚠️  QR Code gerado - Escaneie no painel da escola`);
                } else {
                    console.log(`   ⚠️  Ainda desconectada - Tentará novamente no próximo ciclo`);
                }
            } catch (error) {
                console.error(`   ❌ Erro na reconexão: ${error.message}`);
            }
        } else {
            // Conectada - apenas log silencioso
            console.log(`✅ [${now}] Escola ${school.id} (${school.name}) - ONLINE`);
        }

    } catch (error) {
        console.error(`❌ Erro ao verificar Escola ${school.id}:`, error.message);
    }
}

// Ciclo principal de monitoramento
async function monitoringCycle() {
    console.log('\n🔍 ===== CICLO DE VERIFICAÇÃO =====');
    console.log(`⏰ ${new Date().toLocaleString('pt-BR')}\n`);

    for (const school of schools) {
        await checkAndReconnect(school);
        // Pequeno delay entre escolas para não sobrecarregar
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log('\n✅ Ciclo concluído. Próxima verificação em 2 minutos.\n');
}

// Loop principal
async function startMonitoring() {
    console.log('🚀 ===== MONITOR WHATSAPP INICIADO =====\n');
    console.log('📊 Configurações:');
    console.log(`   - Intervalo de verificação: 2 minutos`);
    console.log(`   - Reconexão automática: ATIVADA`);
    console.log(`   - Keep-alive: ATIVADO para cada escola\n`);

    // Carregar escolas
    loadSchools();

    if (schools.length === 0) {
        console.error('❌ Nenhuma escola encontrada. Encerrando...');
        process.exit(1);
    }

    // Primeira verificação imediata
    await monitoringCycle();

    // Loop contínuo
    while (isRunning) {
        await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));

        if (isRunning) {
            await monitoringCycle();
        }
    }
}

// Capturar Ctrl+C para encerramento gracioso
process.on('SIGINT', () => {
    console.log('\n\n🛑 Encerrando monitor WhatsApp...');
    isRunning = false;

    // Parar keep-alive de todas as escolas
    for (const school of schools) {
        try {
            const whatsappService = getWhatsAppService(school.id);
            whatsappService.stopKeepAlive();
        } catch (error) {
            // Ignorar erros no encerramento
        }
    }

    console.log('✅ Monitor encerrado com sucesso');
    process.exit(0);
});

// Capturar erros não tratados
process.on('unhandledRejection', (error) => {
    console.error('❌ Erro não tratado:', error);
});

// Iniciar
console.log('╔════════════════════════════════════════════╗');
console.log('║   MONITOR WHATSAPP - CONEXÃO PERMANENTE   ║');
console.log('╚════════════════════════════════════════════╝\n');

startMonitoring().catch(error => {
    console.error('❌ Erro fatal no monitor:', error);
    process.exit(1);
});
