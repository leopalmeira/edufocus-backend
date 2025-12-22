const Database = require('better-sqlite3');
const path = require('path');

const schoolDB = new Database(path.join(__dirname, 'database/school_3.db'));

console.log('🔄 RESETANDO NOTIFICAÇÕES PARA "NÃO LIDAS"...\n');

const info = schoolDB.prepare(`
    UPDATE access_logs 
    SET notified_guardian = 0 
    WHERE notified_guardian = 1
`).run();

console.log(`✅ ${info.changes} notificações resetadas para "não lidas".`);

const logs = schoolDB.prepare('SELECT * FROM access_logs').all();
console.log(`📊 Total agora:`, logs);

schoolDB.close();
