const Database = require('better-sqlite3');
const path = require('path');

const systemDB = new Database(path.join(__dirname, 'database/system.db'));
const schools = systemDB.prepare('SELECT id, name FROM schools').all();

console.log('🔧 CRIANDO TABELA access_logs EM TODAS AS ESCOLAS\n');

schools.forEach(school => {
    console.log(`🏫 Escola ${school.id}: ${school.name}`);

    try {
        const schoolDB = new Database(path.join(__dirname, `database/school_${school.id}.db`));

        // Criar tabela access_logs
        schoolDB.exec(`
            CREATE TABLE IF NOT EXISTS access_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                student_id INTEGER NOT NULL,
                event_type TEXT NOT NULL CHECK(event_type IN ('arrival', 'departure')),
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                notified_guardian INTEGER DEFAULT 0,
                FOREIGN KEY (student_id) REFERENCES students(id)
            )
        `);

        console.log('   ✅ Tabela access_logs criada/verificada');

        schoolDB.close();
    } catch (error) {
        console.log(`   ❌ Erro: ${error.message}`);
    }
});

systemDB.close();
console.log('\n✅ Concluído!');
