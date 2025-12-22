const Database = require('better-sqlite3');
const path = require('path');

const schoolDB = new Database(path.join(__dirname, 'database/school_3.db'));
const systemDB = new Database(path.join(__dirname, 'database/system.db'));

console.log('🔍 INVESTIGANDO ONDE ESTÁ student_guardians...\n');

try {
    const schoolCount = schoolDB.prepare('SELECT count(*) as count FROM student_guardians').get();
    console.log(`✅ Tabela student_guardians existe na ESCOLA (Total: ${schoolCount.count})`);

    // Verificar registros específicos
    const links = schoolDB.prepare('SELECT * FROM student_guardians WHERE guardian_id = 7').all();
    console.log('   Vínculos para Guardian 7 na ESCOLA:', links);
} catch (e) {
    console.log(`❌ Tabela student_guardians NÃO existe na ESCOLA: ${e.message}`);
}

console.log('\n----------------------------------------\n');

try {
    const systemCount = systemDB.prepare('SELECT count(*) as count FROM student_guardians').get();
    console.log(`✅ Tabela student_guardians existe no SISTEMA (Total: ${systemCount.count})`);

    // Verificar registros específicos
    const links = systemDB.prepare('SELECT * FROM student_guardians WHERE guardian_id = 7').all();
    console.log('   Vínculos para Guardian 7 no SISTEMA:', links);
} catch (e) {
    console.log(`❌ Tabela student_guardians NÃO existe no SISTEMA: ${e.message}`);
}
