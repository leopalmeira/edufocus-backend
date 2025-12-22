const Database = require('better-sqlite3');
const path = require('path');

const schoolDB = new Database(path.join(__dirname, 'database/school_3.db'));

console.log('🧪 TESTANDO QUERY SQL EXATA DA API...\n');

const guardianId = 7;

try {
    const notifications = schoolDB.prepare(`
        SELECT 
            al.id,
            al.student_id,
            s.name as student_name,
            s.photo_url,
            al.event_type,
            al.timestamp,
            al.notified_guardian
        FROM access_logs al
        JOIN students s ON al.student_id = s.id
        JOIN student_guardians sg ON s.id = sg.student_id
        WHERE sg.guardian_id = ? 
        AND sg.status = 'active'
        AND al.notified_guardian = 0
        ORDER BY al.timestamp DESC
        LIMIT 10
    `).all(guardianId);

    console.log(`📊 Resultado da Query: ${notifications.length} registros encontratos.`);
    console.log(notifications);
} catch (e) {
    console.error('❌ Erro na Query:', e.message);
}
