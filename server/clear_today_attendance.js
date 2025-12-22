/**
 * Script para limpar TODOS os registros de presença de hoje
 * Permite testar o envio de WhatsApp novamente
 */

const Database = require('better-sqlite3');
const path = require('path');

function clearTodayAttendance() {
    console.log('🧹 Limpando registros de presença de hoje...\n');

    try {
        const dbPath = path.join(__dirname, 'school-1.db');
        const db = new Database(dbPath);

        // Contar registros antes
        const countBefore = db.prepare('SELECT COUNT(*) as count FROM attendance WHERE date(timestamp) = date("now")').get();
        console.log(`📊 Registros de hoje antes: ${countBefore.count}`);

        // Deletar registros de hoje
        const result = db.prepare('DELETE FROM attendance WHERE date(timestamp) = date("now")').run();
        console.log(`✅ Removidos ${result.changes} registros de presença de hoje`);

        // Contar registros depois
        const countAfter = db.prepare('SELECT COUNT(*) as count FROM attendance WHERE date(timestamp) = date("now")').get();
        console.log(`📊 Registros de hoje depois: ${countAfter.count}`);

        db.close();

        console.log('\n✅ Limpeza concluída!');
        console.log('📝 Agora você pode testar novamente e o sistema vai registrar e enviar WhatsApp.\n');

    } catch (error) {
        console.error('❌ Erro:', error.message);
        process.exit(1);
    }
}

clearTodayAttendance();
