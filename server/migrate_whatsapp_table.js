/**
 * Script de Migração - Adicionar Tabela whatsapp_notifications
 * Execute este script UMA VEZ para adicionar a tabela em todos os bancos de escola existentes
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_DIR = path.join(__dirname, '../database');

console.log('🔄 Iniciando migração: Adicionar tabela whatsapp_notifications...\n');

// Listar todos os bancos de dados de escola
const files = fs.readdirSync(DB_DIR);
const schoolDBs = files.filter(f => f.startsWith('school_') && f.endsWith('.db'));

console.log(`📊 Encontrados ${schoolDBs.length} bancos de escola para migrar\n`);

schoolDBs.forEach(dbFile => {
    const schoolId = dbFile.replace('school_', '').replace('.db', '');
    const dbPath = path.join(DB_DIR, dbFile);

    console.log(`🔧 Migrando escola ${schoolId}...`);

    try {
        const db = new Database(dbPath);

        // Verificar se a tabela já existe
        const tableExists = db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='whatsapp_notifications'
        `).get();

        if (tableExists) {
            console.log(`   ⚠️  Tabela já existe - pulando`);
        } else {
            // Criar tabela
            db.exec(`
                CREATE TABLE whatsapp_notifications (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    student_id INTEGER NOT NULL,
                    notification_type TEXT NOT NULL CHECK(notification_type IN ('arrival', 'departure')),
                    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                    phone TEXT,
                    success INTEGER DEFAULT 1,
                    FOREIGN KEY (student_id) REFERENCES students(id)
                );
                
                CREATE INDEX idx_whatsapp_notifications_date 
                ON whatsapp_notifications(student_id, notification_type, date(sent_at));
            `);

            console.log(`   ✅ Tabela criada com sucesso`);
        }

        db.close();
    } catch (error) {
        console.error(`   ❌ Erro ao migrar escola ${schoolId}:`, error.message);
    }
});

console.log('\n✅ Migração concluída!\n');
console.log('📝 Próximos passos:');
console.log('   1. Reinicie o servidor');
console.log('   2. Teste o envio de notificações WhatsApp');
console.log('   3. Verifique que apenas uma mensagem é enviada por dia\n');
