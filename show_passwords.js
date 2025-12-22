const db = require('./server/db');


console.log('\n========================================');
console.log('📋 CREDENCIAIS DOS RESPONSÁVEIS');
console.log('========================================\n');

try {
    const systemDB = db.getSystemDB();
    const guardians = systemDB.prepare('SELECT * FROM guardians ORDER BY id DESC').all();

    if (guardians.length === 0) {
        console.log('❌ NENHUM RESPONSÁVEL ENCONTRADO!');
    } else {
        console.log(`✅ ${guardians.length} RESPONSÁVEL(IS) CADASTRADO(S):\n`);

        guardians.forEach((g, i) => {
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`📧 RESPONSÁVEL ${i + 1}`);
            console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
            console.log(`🆔 ID: ${g.id}`);
            console.log(`📧 EMAIL (LOGIN): ${g.email}`);
            console.log(`👤 NOME: ${g.name || 'N/A'}`);
            console.log(`📱 TELEFONE: ${g.phone || 'N/A'}`);
            console.log(`📅 CRIADO EM: ${g.created_at}`);
            console.log(`🔐 SENHA (HASH): ${g.password.substring(0, 30)}...`);
            console.log(`\n⚠️  ATENÇÃO: A senha está criptografada (bcrypt).`);
            console.log(`   Para fazer login, você precisa da senha ORIGINAL`);
            console.log(`   que foi gerada no momento do cadastro.`);
            console.log(`\n💡 SOLUÇÃO: Cadastre um NOVO aluno e anote a senha`);
            console.log(`   que aparecerá no popup!\n`);
        });

        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
        console.log(`📝 COMO OBTER AS SENHAS:\n`);
        console.log(`1. Vá no Dashboard da Escola (http://localhost:5173/dashboard)`);
        console.log(`2. Clique em "Cadastrar Aluno"`);
        console.log(`3. Preencha os dados e cadastre`);
        console.log(`4. Um POPUP aparecerá com o EMAIL e SENHA do responsável`);
        console.log(`5. ANOTE ou TIRE FOTO das credenciais!`);
        console.log(`\n========================================\n`);
    }
} catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error(error.stack);
}
