// Script para limpar TODAS as sessões WhatsApp antigas
const fs = require('fs');
const path = require('path');

const authBasePath = path.join(__dirname, 'whatsapp-auth');

console.log('🗑️ Limpando todas as sessões WhatsApp antigas...');
console.log(`📂 Pasta: ${authBasePath}`);

if (fs.existsSync(authBasePath)) {
    const folders = fs.readdirSync(authBasePath);
    console.log(`\n📁 Encontradas ${folders.length} pasta(s):`);

    folders.forEach(folder => {
        const folderPath = path.join(authBasePath, folder);
        console.log(`   - ${folder}`);

        try {
            fs.rmSync(folderPath, { recursive: true, force: true });
            console.log(`     ✅ Removida`);
        } catch (error) {
            console.log(`     ❌ Erro: ${error.message}`);
        }
    });

    console.log('\n✅ Limpeza concluída!');
    console.log('🔄 Agora você pode conectar o WhatsApp do zero.');
} else {
    console.log('ℹ️ Pasta whatsapp-auth não existe (nada para limpar)');
}
