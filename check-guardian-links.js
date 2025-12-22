const Database = require('better-sqlite3');
const path = require('path');

// Conectar ao banco do sistema
const systemDB = new Database(path.join(__dirname, 'database/system.db'));

console.log('🔍 VERIFICANDO VÍNCULOS GUARDIAN-STUDENT\n');

// Buscar guardians
const guardians = systemDB.prepare('SELECT * FROM guardians').all();
console.log(`👥 ${guardians.length} responsáveis cadastrados:`);
guardians.forEach(g => {
    console.log(`   - ID: ${g.id}, Nome: ${g.name}, Email: ${g.email}`);
});

console.log('\n📚 Verificando vínculos em cada escola:\n');

// Buscar escolas
const schools = systemDB.prepare('SELECT id, name FROM schools').all();

schools.forEach(school => {
    console.log(`🏫 Escola ${school.id}: ${school.name}`);

    try {
        const schoolDB = new Database(path.join(__dirname, `database/school_${school.id}.db`));

        // Verificar se tabela existe
        const tables = schoolDB.prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='student_guardians'").all();

        if (tables.length === 0) {
            console.log('   ❌ Tabela student_guardians NÃO EXISTE!\n');
            schoolDB.close();
            return;
        }

        // Buscar vínculos
        const links = schoolDB.prepare('SELECT * FROM student_guardians').all();
        console.log(`   📎 ${links.length} vínculos encontrados:`);

        links.forEach(link => {
            const student = schoolDB.prepare('SELECT name FROM students WHERE id = ?').get(link.student_id);
            console.log(`      - Guardian ${link.guardian_id} → Student ${link.student_id} (${student?.name || 'NOME NÃO ENCONTRADO'}) - Status: ${link.status}`);
        });

        // Verificar access_logs
        const logs = schoolDB.prepare('SELECT COUNT(*) as count FROM access_logs').get();
        console.log(`   📝 ${logs.count} registros de acesso`);

        const unnotified = schoolDB.prepare('SELECT COUNT(*) as count FROM access_logs WHERE notified_guardian = 0').get();
        console.log(`   🔔 ${unnotified.count} notificações pendentes\n`);

        schoolDB.close();
    } catch (error) {
        console.log(`   ❌ Erro: ${error.message}\n`);
    }
});

systemDB.close();
console.log('✅ Verificação concluída!');
