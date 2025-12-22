const Database = require('better-sqlite3');
const path = require('path');

const systemDB = new Database(path.join(__dirname, 'database/system.db'));

console.log('📋 LISTA COMPLETA DE GUARDIANS:\n');

const guardians = systemDB.prepare('SELECT * FROM guardians').all();

guardians.forEach(g => {
    console.log(`ID: ${g.id}`);
    console.log(`Nome: ${g.name}`);
    console.log(`Email: ${g.email}`);
    console.log(`Telefone: ${g.phone || 'N/A'}`);
    console.log('---');
});

systemDB.close();
