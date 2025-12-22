const db = require('./server/db');
const bcrypt = require('bcryptjs');

async function createTestGuardian() {
    const systemDB = db.getSystemDB();

    const testEmail = `teste.${Date.now()}@email.com`;
    const password = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const result = systemDB.prepare(`
      INSERT INTO guardians (email, password, name, phone)
      VALUES (?, ?, ?, ?)
    `).run(testEmail, hashedPassword, 'Teste Responsável', '11999999999');

        console.log('\n========================================');
        console.log('✅ RESPONSÁVEL DE TESTE CRIADO!');
        console.log('========================================\n');
        console.log(`📧 EMAIL (LOGIN): ${testEmail}`);
        console.log(`🔑 SENHA: ${password}`);
        console.log('\n========================================');
        console.log('🎯 USE ESTAS CREDENCIAIS PARA FAZER LOGIN EM:');
        console.log('   http://localhost:5174');
        console.log('========================================\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }
}

createTestGuardian();
