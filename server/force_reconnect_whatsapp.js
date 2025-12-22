/**
 * Script para FORÇAR reconexão do WhatsApp e manter conectado
 * Execute este script para garantir que o WhatsApp está ativo
 */

const { getWhatsAppService } = require('./whatsapp-service');

async function forceReconnect() {
    console.log('🔄 FORÇANDO RECONEXÃO DO WHATSAPP...\n');

    const schoolId = 1;

    try {
        console.log('1️⃣ Obtendo serviço WhatsApp...');
        const whatsappService = getWhatsAppService(schoolId);

        if (!whatsappService) {
            console.error('❌ Serviço não encontrado!');
            return false;
        }

        console.log('2️⃣ Inicializando conexão...');
        await whatsappService.initialize();

        console.log('3️⃣ Aguardando estabilização (10 segundos)...');
        await new Promise(resolve => setTimeout(resolve, 10000));

        console.log('4️⃣ Verificando status...');
        const status = whatsappService.getStatus();

        console.log('\n📊 RESULTADO:');
        console.log('   ✓ Conectado:', status.connected);
        console.log('   ✓ isConnected:', whatsappService.isConnected);
        console.log('   ✓ Socket ativo:', !!whatsappService.sock?.user);

        if (status.connected && whatsappService.isConnected) {
            console.log('\n✅ WHATSAPP CONECTADO E PRONTO!');
            console.log('   O servidor agora pode enviar mensagens.');
            return true;
        } else {
            console.log('\n⚠️ WHATSAPP NÃO CONECTOU COMPLETAMENTE');
            console.log('   Verifique se escaneou o QR Code no terminal do servidor.');
            return false;
        }

    } catch (error) {
        console.error('\n❌ ERRO:', error.message);
        return false;
    }
}

// Executar
forceReconnect()
    .then(success => {
        if (success) {
            console.log('\n🎉 Processo concluído com sucesso!');
            console.log('   Agora teste detectando um aluno.');
        } else {
            console.log('\n⚠️ Processo concluído com avisos.');
            console.log('   Verifique o QR Code e tente novamente.');
        }
        process.exit(success ? 0 : 1);
    })
    .catch(error => {
        console.error('\n❌ Erro fatal:', error);
        process.exit(1);
    });
