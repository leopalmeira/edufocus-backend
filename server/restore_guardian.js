const { initSystemDB, getSystemDB } = require('./db');
const bcrypt = require('bcryptjs');

async function restoreUser() {
    try {
        console.log('🔄 Restaurando conta de teste...');
        initSystemDB();
        const db = getSystemDB();

        const email = 'eu@email.com';
        const password = '123'; // Senha padrão simples, ou a que ele usou, mas vou resetar para 123
        const name = 'Responsável Teste';
        const phone = '11999999999';

        // Verifica se já existe
        const existing = db.prepare('SELECT id FROM guardians WHERE email = ?').get(email);
        if (existing) {
            console.log('⚠️ Usuário já existe. Resetando senha...');
            const hashedPassword = await bcrypt.hash(password, 10);
            db.prepare('UPDATE guardians SET password = ? WHERE id = ?').run(hashedPassword, existing.id);
            console.log('✅ Senha resetada para: 123');
        } else {
            console.log('✨ Criando novo usuário...');
            const hashedPassword = await bcrypt.hash(password, 10);
            db.prepare(`
                INSERT INTO guardians (email, password, name, phone)
                VALUES (?, ?, ?, ?)
            `).run(email, hashedPassword, name, phone);
            console.log('✅ Usuário criado: eu@email.com / Senha: 123');
        }

    } catch (err) {
        console.error('❌ Erro:', err);
    }
}

restoreUser();
