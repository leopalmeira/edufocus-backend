const Database = require('better-sqlite3');
const path = require('path');

const schoolDB = new Database(path.join(__dirname, 'database/school_3.db'));

console.log('🔍 VERIFICANDO access_logs DA ESCOLA 3:\n');

const logs = schoolDB.prepare(`
    SELECT 
        al.*,
        s.name as student_name
    FROM access_logs al
    JOIN students s ON al.student_id = s.id
    ORDER BY al.timestamp DESC
    LIMIT 10
`).all();

console.log(`📝 Total de registros: ${logs.length}\n`);

logs.forEach((log, i) => {
    console.log(`${i + 1}. ID: ${log.id}`);
    console.log(`   Aluno: ${log.student_name} (ID: ${log.student_id})`);
    console.log(`   Tipo: ${log.event_type}`);
    console.log(`   Horário: ${log.timestamp}`);
    console.log(`   Notificado: ${log.notified_guardian ? 'SIM' : 'NÃO'}`);
    console.log('');
});

schoolDB.close();
