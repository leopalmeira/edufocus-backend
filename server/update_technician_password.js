const Database = require('better-sqlite3');
const bcrypt = require('bcryptjs');
const path = require('path');

const dbPath = path.join(__dirname, '../database/system.db');
const db = new Database(dbPath);

const email = 'tec1@test.com';
const newPassword = 'tec123';

console.log('🔄 Atualizando senha do técnico...\n');

async function updatePassword() {
    try {
        // Verificar se técnico existe
        const tech = db.prepare('SELECT * FROM technicians WHERE email = ?').get(email);

        if (!tech) {
            console.log('❌ Técnico não encontrado!');
            db.close();
            return;
        }

        console.log('✅ Técnico encontrado:', tech.name);
        console.log('📧 Email:', tech.email);
        console.log('\n🔐 Gerando novo hash para senha:', newPassword);

        // Gerar hash da nova senha
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        console.log('✅ Hash gerado:', hashedPassword.substring(0, 30) + '...');

        // Atualizar senha
        db.prepare('UPDATE technicians SET password = ? WHERE email = ?').run(hashedPassword, email);

        console.log('\n✅ Senha atualizada com sucesso!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📧 Email:', email);
        console.log('🔑 Senha:', newPassword);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
        console.log('🎯 Agora você pode fazer login com essas credenciais!');

    } catch (error) {
        console.error('❌ Erro:', error.message);
    } finally {
        db.close();
    }
}

updatePassword();
