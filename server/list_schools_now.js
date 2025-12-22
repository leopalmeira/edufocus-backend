const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '../database/system.db');
const db = new Database(dbPath);

console.log('📋 Listando escolas no system.db:\n');
const schools = db.prepare('SELECT id, name FROM schools').all();
schools.forEach(s => console.log(`[ID: ${s.id}] ${s.name}`));

db.close();
