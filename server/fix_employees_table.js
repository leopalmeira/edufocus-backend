// Script para verificar e corrigir estrutura da tabela employees
const Database = require('better-sqlite3');
const path = require('path');

const dbDir = path.join(__dirname, 'databases');

function fixEmployeesTable(schoolId) {
    const dbPath = path.join(dbDir, `school_${schoolId}.db`);
    const db = new Database(dbPath);

    console.log(`📝 Verificando tabela employees para escola ${schoolId}...`);

    try {
        // Verificar estrutura atual
        const tableInfo = db.prepare("PRAGMA table_info(employees)").all();
        console.log('Colunas atuais:', tableInfo.map(col => col.name));

        const columns = tableInfo.map(col => col.name);

        // Adicionar colunas faltantes
        if (!columns.includes('employee_id')) {
            console.log('Adicionando coluna employee_id...');
            db.exec(`ALTER TABLE employees ADD COLUMN employee_id TEXT`);
        }

        if (!columns.includes('email')) {
            console.log('Adicionando coluna email...');
            db.exec(`ALTER TABLE employees ADD COLUMN email TEXT`);
        }

        if (!columns.includes('phone')) {
            console.log('Adicionando coluna phone...');
            db.exec(`ALTER TABLE employees ADD COLUMN phone TEXT`);
        }

        console.log('✅ Tabela employees verificada e corrigida!');

        // Mostrar estrutura final
        const finalInfo = db.prepare("PRAGMA table_info(employees)").all();
        console.log('Estrutura final:', finalInfo.map(col => `${col.name} (${col.type})`).join(', '));

    } catch (error) {
        console.error(`❌ Erro:`, error.message);
    }

    db.close();
}

// Corrigir para escola 1
fixEmployeesTable(1);

console.log('\n✅ Verificação concluída!');
