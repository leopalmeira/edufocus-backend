// Script para criar tabelas de funcionários e ponto biométrico
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, 'databases');
if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
}

// Função para criar tabelas em um banco de escola
function createEmployeeTables(schoolId) {
    const dbPath = path.join(dbDir, `school_${schoolId}.db`);
    const db = new Database(dbPath);

    console.log(`📝 Criando tabelas de funcionários para escola ${schoolId}...`);

    // Tabela de funcionários
    db.exec(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            role TEXT NOT NULL,
            email TEXT,
            phone TEXT,
            photo_url TEXT,
            face_descriptor TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // Tabela de registros de ponto
    db.exec(`
        CREATE TABLE IF NOT EXISTS employee_attendance (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
        )
    `);

    // Criar índices para melhor performance
    db.exec(`
        CREATE INDEX IF NOT EXISTS idx_employee_attendance_date 
        ON employee_attendance(date(timestamp));
        
        CREATE INDEX IF NOT EXISTS idx_employee_attendance_employee 
        ON employee_attendance(employee_id);
    `);

    console.log(`✅ Tabelas de funcionários criadas para escola ${schoolId}`);

    db.close();
}

// Criar para escola 1 (padrão)
createEmployeeTables(1);

console.log('\n✅ Migração de funcionários concluída!');
