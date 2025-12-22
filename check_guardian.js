const db = require('./server/db');

console.log('\n========================================');
console.log('VERIFICANDO RESPONSÁVEIS CADASTRADOS');
console.log('========================================\n');

try {
    const systemDB = db.getSystemDB();
    const guardians = systemDB.prepare('SELECT * FROM guardians ORDER BY id DESC LIMIT 5').all();

    if (guardians.length === 0) {
        console.log('❌ NENHUM RESPONSÁVEL ENCONTRADO!');
    } else {
        console.log(`✅ ${guardians.length} RESPONSÁVEL(IS) ENCONTRADO(S):\n`);
        guardians.forEach((g, i) => {
            console.log(`--- RESPONSÁVEL ${i + 1} ---`);
            console.log(`ID: ${g.id}`);
            console.log(`Email: ${g.email}`);
            console.log(`Nome: ${g.name || 'N/A'}`);
            console.log(`Telefone: ${g.phone || 'N/A'}`);
            console.log(`Criado em: ${g.created_at}`);
            console.log('');
        });
    }

    console.log('========================================\n');
} catch (error) {
    console.error('❌ ERRO:', error.message);
    console.error(error.stack);
}
