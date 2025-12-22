/**
 * Script para LIMPAR notificações WhatsApp antigas
 * Use este script para permitir novos testes de envio
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../database');

console.log('🧹 Limpando notificações WhatsApp antigas...\n');

// Listar todos os bancos de dados de escola
const files = fs.readdirSync(DB_DIR);
const schoolDBs = files.filter(f => f.startsWith('school_') && f.endsWith('.db'));

console.log(`📊 Encontrados ${schoolDBs.length} bancos de escola\n`);

schoolDBs.forEach(dbFile => {
    const schoolId = dbFile.replace('school_', '').replace('.db', '');
    const dbPath = path.join(DB_DIR, dbFile);

    console.log(`🧹 Limpando escola ${schoolId}...`);

    try {
        const db = new Database(dbPath);

        // Contar notificações antes
        const countBefore = db.prepare('SELECT COUNT(*) as count FROM whatsapp_notifications').get();

        // Limpar notificações de hoje (para permitir novos testes)
        const today = new Date().toISOString().split('T')[0];
        const result = db.prepare(`
            DELETE FROM whatsapp_notifications 
            WHERE date(sent_at) = date(?)
        `).run(today);

        console.log(`   ✅ ${result.changes} notificações de hoje removidas (total antes: ${countBefore.count})`);

        db.close();
    } catch (error) {
        console.error(`   ❌ Erro ao limpar escola ${schoolId}:`, error.message);
    }
});

console.log('\n✅ Limpeza concluída!');
console.log('\n📝 Agora você pode testar o envio de WhatsApp novamente.\n');
