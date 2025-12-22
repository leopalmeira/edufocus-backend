const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, 'database', 'system.db');
const db = new Database(dbPath);

// Senha: senha123 (já com hash bcrypt)
const hashedPassword = '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGa8aUPUekrP6hT.oa';
const testEmail = `teste${Date.now()}@email.com`;

try {
    const result = db.prepare(`
    INSERT INTO guardians (email, password, name, phone)
    VALUES (?, ?, ?, ?)
  `).run(testEmail, hashedPassword, 'Teste Responsável', '11999999999');

    console.log('\n========================================');
    console.log('✅ CREDENCIAIS CRIADAS COM SUCESSO!');
    console.log('========================================\n');
    console.log(`📧 EMAIL (LOGIN): ${testEmail}`);
    console.log(`🔑 SENHA: senha123`);
    console.log('\n🎯 ACESSE AGORA:');
    console.log('   http://localhost:5174');
    console.log('\n📝 INSTRUÇÕES:');
    console.log('   1. Abra http://localhost:5174');
    console.log('   2. Digite o email acima');
    console.log('   3. Digite a senha: senha123');
    console.log('   4. Clique em "Entrar"');
    console.log('========================================\n');

    db.close();
} catch (error) {
    console.error('❌ Erro:', error.message);
    db.close();
}
