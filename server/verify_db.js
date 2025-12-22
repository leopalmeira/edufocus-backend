const { initSystemDB, getSystemDB } = require('./db');

initSystemDB();
const db = getSystemDB();

console.log('--- TICKETS ---');
const tickets = db.prepare('SELECT * FROM support_tickets ORDER BY id DESC LIMIT 5').all();
console.log(JSON.stringify(tickets, null, 2));

console.log('\n--- MESSAGES ---');
const messages = db.prepare('SELECT * FROM ticket_messages ORDER BY id DESC LIMIT 10').all();
console.log(JSON.stringify(messages, null, 2));
