const Database = require('better-sqlite3');
const path = require('path');

const schoolDB = new Database(path.join(__dirname, 'database/school_3.db'));

console.log('🕵️ DEPURAÇÃO DOS JOINS:\n');

// 1. Verificar Access Logs
const logs = schoolDB.prepare("SELECT * FROM access_logs WHERE notified_guardian = 0").all();
console.log(`1. access_logs (não notificados): ${logs.length}`, logs);

if (logs.length > 0) {
    const studentId = logs[0].student_id;

    // 2. Verificar Students
    const student = schoolDB.prepare("SELECT * FROM students WHERE id = ?").get(studentId);
    console.log(`\n2. student (ID ${studentId}):`, student ? "ENCONTRADO" : "NÃO ENCONTRADO");

    if (student) {
        // 3. Verificar Student Guardians
        const sg = schoolDB.prepare("SELECT * FROM student_guardians WHERE student_id = ? AND guardian_id = 7").all();
        console.log(`\n3. student_guardians (Student ${studentId} -> Guardian 7):`, sg);

        // 4. Testar JOIN Manualmente
        const joinTest = schoolDB.prepare(`
            SELECT al.id 
            FROM access_logs al
            JOIN students s ON al.student_id = s.id
            WHERE al.id = ?
        `).get(logs[0].id);
        console.log(`\n4. JOIN access_logs + students:`, joinTest ? "SUCESSO" : "FALHA");

        const joinTest2 = schoolDB.prepare(`
            SELECT s.id
            FROM students s
            JOIN student_guardians sg ON s.id = sg.student_id
            WHERE s.id = ? AND sg.guardian_id = 7
        `).get(studentId);
        console.log(`\n5. JOIN students + student_guardians:`, joinTest2 ? "SUCESSO" : "FALHA");
    }
}
