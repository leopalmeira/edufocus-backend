// Script para adicionar tabelas de funcionários aos bancos de dados existentes
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');

console.log('🔧 Aplicando migração de funcionários...\n');

// Verificar se o diretório existe
if (!fs.existsSync(dbDir)) {
    console.log('❌ Diretório de banco de dados não encontrado!');
    process.exit(1);
}

// Listar todos os arquivos de banco de dados de escolas
const dbFiles = fs.readdirSync(dbDir).filter(file => file.startsWith('school_') && file.endsWith('.db'));

console.log(`📁 Encontrados ${dbFiles.length} banco(s) de dados de escolas\n`);

dbFiles.forEach(dbFile => {
    const dbPath = path.join(dbDir, dbFile);
    const schoolId = dbFile.replace('school_', '').replace('.db', '');

    console.log(`📝 Processando ${dbFile} (Escola ID: ${schoolId})...`);

    try {
        const db = new Database(dbPath);

        // Verificar se a tabela employees já existe
        const tableExists = db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='employees'
        `).get();

        if (tableExists) {
            console.log(`   ℹ️  Tabela employees já existe, verificando estrutura...`);

            // Verificar se tem a coluna employee_id
            const columns = db.prepare("PRAGMA table_info(employees)").all();
            const hasEmployeeId = columns.some(col => col.name === 'employee_id');

            if (!hasEmployeeId) {
                console.log(`   ➕ Adicionando coluna employee_id...`);
                db.exec(`ALTER TABLE employees ADD COLUMN employee_id TEXT`);
            }
        } else {
            console.log(`   ➕ Criando tabela employees...`);
            db.exec(`
                CREATE TABLE IF NOT EXISTS employees (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    employee_id TEXT,
                    name TEXT NOT NULL,
                    role TEXT NOT NULL,
                    email TEXT,
                    phone TEXT,
                    photo_url TEXT,
                    face_descriptor TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
        }

        // Verificar se a tabela employee_attendance existe
        const attendanceExists = db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='employee_attendance'
        `).get();

        if (!attendanceExists) {
            console.log(`   ➕ Criando tabela employee_attendance...`);
            db.exec(`
                CREATE TABLE IF NOT EXISTS employee_attendance (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    employee_id INTEGER NOT NULL,
                    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
                )
            `);

            // Criar índices
            db.exec(`
                CREATE INDEX IF NOT EXISTS idx_employee_attendance_date 
                ON employee_attendance(date(timestamp));
                
                CREATE INDEX IF NOT EXISTS idx_employee_attendance_employee 
                ON employee_attendance(employee_id);
            `);
        }

        console.log(`   ✅ Migração concluída para ${dbFile}\n`);
        db.close();

    } catch (error) {
        console.error(`   ❌ Erro ao processar ${dbFile}:`, error.message);
    }
});

console.log('✅ Migração de funcionários concluída para todos os bancos de dados!');
