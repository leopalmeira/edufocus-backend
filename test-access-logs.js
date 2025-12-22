const Database = require('better-sqlite3');
const path = require('path');

const schoolDB = new Database(path.join(__dirname, 'database/school_3.db'));

console.log('🔍 ESTRUTURA DA TABELA access_logs:\n');

const tableInfo = schoolDB.prepare("PRAGMA table_info(access_logs)").all();

console.log('Colunas:');
tableInfo.forEach(col => {
    console.log(`  - ${col.name} (${col.type}) ${col.notnull ? 'NOT NULL' : ''} ${col.dflt_value ? `DEFAULT ${col.dflt_value}` : ''}`);
});

console.log('\n📝 Testando INSERT manual...');

try {
    const result = schoolDB.prepare(`
        INSERT INTO access_logs(student_id, event_type, timestamp, notified_guardian)
        VALUES(?, ?, ?, 0)
    `).run(11, 'arrival', new Date().toISOString());

    console.log('✅ INSERT bem-sucedido! ID:', result.lastInsertRowid);

    const logs = schoolDB.prepare('SELECT * FROM access_logs').all();
    console.log(`\n📊 Total de registros agora: ${logs.length}`);

    if (logs.length > 0) {
        console.log('\nÚltimo registro:');
        console.log(logs[logs.length - 1]);
    }
} catch (error) {
    console.error('❌ Erro no INSERT:', error.message);
}

schoolDB.close();
