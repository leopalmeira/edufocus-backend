const db = require('./server/db');
const fs = require('fs');
const path = require('path');

console.log('🔧 Criando tabela student_guardians em todos os bancos de escolas...\n');

const systemDB = db.getSystemDB();
const schools = systemDB.prepare('SELECT id, name FROM schools').all();

console.log(`📚 Encontradas ${schools.length} escolas\n`);

schools.forEach(school => {
    try {
        const schoolDB = db.getSchoolDB(school.id);

        // Criar tabela student_guardians
        schoolDB.exec(`
            CREATE TABLE IF NOT EXISTS student_guardians (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                guardian_id INTEGER NOT NULL,
                relationship TEXT DEFAULT 'Responsável',
                status TEXT DEFAULT 'active',
                linked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
                UNIQUE(student_id, guardian_id)
            );
            
            CREATE INDEX IF NOT EXISTS idx_student_guardians_student
            ON student_guardians(student_id);
            
            CREATE INDEX IF NOT EXISTS idx_student_guardians_guardian
            ON student_guardians(guardian_id);
        `);

        console.log(`✅ Escola ${school.id} (${school.name}): Tabela criada/verificada`);
    } catch (error) {
        console.error(`❌ Erro na escola ${school.id}:`, error.message);
    }
});

console.log('\n✅ Processo concluído!');
