/**
 * Conectar WhatsApp de UMA escola específica
 * Gera QR Code no terminal para escanear
 */

const { getWhatsAppService } = require('./whatsapp-service');

const SCHOOL_ID = 2; // Escola 2

async function connectSchool() {
    console.log(`\n🔄 Conectando WhatsApp da Escola ${SCHOOL_ID}...\n`);

    try {
        const whatsappService = getWhatsAppService(SCHOOL_ID);

        console.log('📱 Inicializando conexão...');
        console.log('⏳ Aguarde o QR Code aparecer abaixo:\n');

        await whatsappService.initialize();

        // Aguardar 5 segundos para conexão
        await new Promise(resolve => setTimeout(resolve, 5000));

        const status = whatsappService.getStatus();
        const isConnected = status.connected || !!(whatsappService.sock?.user);

        if (isConnected) {
            console.log('\n✅ CONECTADO COM SUCESSO!');
            console.log(`📞 Telefone: ${status.phone || 'N/A'}`);

            // Iniciar keep-alive
            whatsappService.startKeepAlive();
            console.log('🔄 Keep-alive iniciado');
            console.log('\n🎉 Escola 2 pronta para enviar mensagens!\n');
        } else if (status.qrCode) {
            console.log('\n⚠️  QR Code gerado acima ☝️');
            console.log('📱 Escaneie com WhatsApp para conectar');
            console.log('\nℹ️  Mantenha este terminal aberto até escanear o QR Code');
            console.log('   Após escanear, aguarde alguns segundos...\n');

            // Aguardar mais tempo para dar tempo de escanear
            console.log('⏳ Aguardando escaneamento do QR Code (60 segundos)...\n');
            await new Promise(resolve => setTimeout(resolve, 60000));

            const finalStatus = whatsappService.getStatus();
            const finalConnected = finalStatus.connected || !!(whatsappService.sock?.user);

            if (finalConnected) {
                console.log('✅ CONECTADO! QR Code escaneado com sucesso!');
                console.log(`📞 Telefone: ${finalStatus.phone || 'N/A'}`);
                whatsappService.startKeepAlive();
                console.log('🔄 Keep-alive iniciado\n');
            } else {
                console.log('⚠️  Ainda não conectado. Execute o script novamente se necessário.\n');
            }
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

console.log('╔════════════════════════════════════════╗');
console.log('║   CONECTAR WHATSAPP - ESCOLA 2        ║');
console.log('╚════════════════════════════════════════╝');

connectSchool().catch(err => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
});
