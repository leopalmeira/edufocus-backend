const Database = require('better-sqlite3');
const path = require('path');

// 1. Get School by Email
const systemDB = new Database(path.join(__dirname, 'server/db/system.db'));

// Create tables if not exist (for reliability)
systemDB.exec(`
    CREATE TABLE IF NOT EXISTS schools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        password TEXT
    );
`);

let school = systemDB.prepare('SELECT id FROM schools WHERE email = ?').get('euclide@email.com');

if (!school) {
    console.log('Escola não encontrada, criando...');
    const result = systemDB.prepare('INSERT INTO schools (name, email, password) VALUES (?, ?, ?)').run('Escola Euclides', 'euclide@email.com', '$2b$10$abcdef');
    school = { id: result.lastInsertRowid };
}

console.log('ID da Escola:', school.id);

// 2. Access School DB
const schoolDBPath = path.join(__dirname, `server/db/school_${school.id}.db`);
const schoolDB = new Database(schoolDBPath);
console.log('Conectado do DB da escola:', schoolDBPath);

// Create tables if not exist
schoolDB.exec(`
    CREATE TABLE IF NOT EXISTS students (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        photo_url TEXT,
        class_name TEXT
    );
    CREATE TABLE IF NOT EXISTS access_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER,
        type TEXT,
        timestamp DATETIME,
        method TEXT
    );
`);

// 3. Find a student
let student = schoolDB.prepare('SELECT id, name, photo_url FROM students LIMIT 1').get();

if (!student) {
    console.log('Nenhum aluno encontrado, criando aluno de teste...');
    const result = schoolDB.prepare('INSERT INTO students (name, photo_url, class_name) VALUES (?, ?, ?)').run('Aluno Teste Foto', 'https://avatar.iran.liara.run/public/boy', '5º Ano A');
    student = { id: result.lastInsertRowid, name: 'Aluno Teste Foto', photo_url: 'https://avatar.iran.liara.run/public/boy' };
}

console.log(`Aluno Encontrado: ${student.name} (ID: ${student.id})`);
console.log(`Foto URL: ${student.photo_url}`);

// 4. Insert Access Log (Simulate Entry)
// Calculate time 1 minute ago for deletion check
const oneMinuteAgo = new Date(Date.now() - 60000).toISOString();
schoolDB.prepare('DELETE FROM access_logs WHERE student_id = ? AND timestamp > ?').run(student.id, oneMinuteAgo);

// Insert new log
schoolDB.prepare('INSERT INTO access_logs (student_id, type, timestamp, method) VALUES (?, ?, ?, ?)').run(student.id, 'entry', new Date().toISOString(), 'face_id');

console.log('✅ SUCESSO! Entrada registrada agora.');
console.log('👉 Olhe para o seu App PWA em 5 segundos!');
