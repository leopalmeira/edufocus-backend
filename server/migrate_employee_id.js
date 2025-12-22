// Script para adicionar campo employee_id na tabela employees
const Database = require('better-sqlite3');
const path = require('path');

const dbDir = path.join(__dirname, 'databases');

function addEmployeeIdColumn(schoolId) {
    const dbPath = path.join(dbDir, `school_${schoolId}.db`);
    const db = new Database(dbPath);

    console.log(`📝 Adicionando coluna employee_id para escola ${schoolId}...`);

    try {
        // Verificar se a coluna já existe
        const tableInfo = db.prepare("PRAGMA table_info(employees)").all();
        const hasEmployeeId = tableInfo.some(col => col.name === 'employee_id');

        if (!hasEmployeeId) {
            db.exec(`ALTER TABLE employees ADD COLUMN employee_id TEXT`);
            console.log(`✅ Coluna employee_id adicionada para escola ${schoolId}`);
        } else {
            console.log(`ℹ️ Coluna employee_id já existe para escola ${schoolId}`);
        }
    } catch (error) {
        console.error(`❌ Erro ao adicionar coluna para escola ${schoolId}:`, error.message);
    }

    db.close();
}

// Adicionar para escola 1 (padrão)
addEmployeeIdColumn(1);

console.log('\n✅ Migração de employee_id concluída!');
