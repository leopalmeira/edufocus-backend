const Database = require('better-sqlite3');

const db = new Database('./database/school_1.db');

console.log('📚 Turmas ANTES de deletar:');
const turmasAntes = db.prepare('SELECT * FROM classes').all();
console.log(turmasAntes);
console.log(`\nTotal: ${turmasAntes.length} turmas`);

// Desabilitar foreign keys temporariamente
console.log('\n🔓 Desabilitando foreign keys...');
db.prepare('PRAGMA foreign_keys = OFF').run();

console.log('\n🗑️ Deletando TODAS as turmas...');
const result = db.prepare('DELETE FROM classes').run();
console.log(`✅ ${result.changes} turma(s) deletada(s)`);

// Reabilitar foreign keys
console.log('\n🔒 Reabilitando foreign keys...');
db.prepare('PRAGMA foreign_keys = ON').run();

console.log('\n📚 Turmas DEPOIS de deletar:');
const turmasDepois = db.prepare('SELECT * FROM classes').all();
console.log(turmasDepois);
console.log(`Total: ${turmasDepois.length} turmas`);

db.close();
console.log('\n✅ PRONTO! Todas as turmas foram deletadas!');
console.log('🎯 Agora você pode criar turmas do ZERO no dashboard!');
