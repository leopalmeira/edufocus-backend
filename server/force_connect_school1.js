/**
 * Script para forçar inicialização do WhatsApp para Escola 1
 */

const { getWhatsAppService } = require('./whatsapp-service');

async function forceConnect() {
    console.log('🔄 Forçando conexão WhatsApp para Escola 1...\n');

    try {
        const whatsappService = getWhatsAppService(1);

        console.log('1️⃣ Inicializando serviço...');
        await whatsappService.initialize();

        console.log('\n2️⃣ Aguardando conexão...');

        // Aguardar até 60 segundos
        for (let i = 0; i < 60; i++) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const status = whatsappService.getStatus();
            const isConnected = status.connected || whatsappService.isConnected || !!whatsappService.sock?.user;

            if (isConnected) {
                console.log('\n✅ WhatsApp CONECTADO!');
                console.log(`   Telefone: ${status.phone}`);
                return;
            }

            if (whatsappService.qrCode) {
                console.log('\n📱 QR Code disponível!');
                console.log('   Escaneie com WhatsApp do celular');
                console.log('   Aguardando...');
            }

            process.stdout.write('.');
        }

        console.log('\n\n⚠️  Timeout - WhatsApp não conectou em 60 segundos');

    } catch (error) {
        console.error('\n❌ Erro:', error.message);
        process.exit(1);
    }
}

forceConnect().then(() => {
    console.log('\n✅ Processo concluído');
    console.log('Pressione Ctrl+C para sair');
}).catch(error => {
    console.error('Erro fatal:', error);
    process.exit(1);
});
