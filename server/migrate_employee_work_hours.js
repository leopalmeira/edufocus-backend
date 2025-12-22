const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbDir = path.join(__dirname, '../database');

console.log('🔄 Iniciando migração: Adicionar horários de trabalho aos funcionários\n');

// Listar todos os bancos de dados de escolas
const dbFiles = fs.readdirSync(dbDir).filter(file => file.startsWith('school_') && file.endsWith('.db'));

console.log(`📁 Encontrados ${dbFiles.length} bancos de dados de escolas\n`);

let successCount = 0;
let errorCount = 0;

dbFiles.forEach(dbFile => {
    const dbPath = path.join(dbDir, dbFile);
    const schoolId = dbFile.match(/school_(\d+)\.db/)[1];

    console.log(`\n📊 Processando Escola ${schoolId} (${dbFile})...`);

    try {
        const db = new Database(dbPath);

        // Verificar se a tabela employees existe
        const tableExists = db.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='employees'
        `).get();

        if (!tableExists) {
            console.log(`  ⚠️ Tabela employees não existe, pulando...`);
            db.close();
            return;
        }

        // Verificar se as colunas já existem
        const columns = db.prepare('PRAGMA table_info(employees)').all();
        const hasWorkStartTime = columns.some(col => col.name === 'work_start_time');
        const hasWorkEndTime = columns.some(col => col.name === 'work_end_time');

        if (hasWorkStartTime && hasWorkEndTime) {
            console.log(`  ✅ Colunas já existem, pulando...`);
            db.close();
            return;
        }

        // Adicionar colunas
        if (!hasWorkStartTime) {
            console.log(`  🔧 Adicionando coluna work_start_time...`);
            db.exec(`ALTER TABLE employees ADD COLUMN work_start_time TEXT DEFAULT '08:00'`);
            console.log(`  ✅ Coluna work_start_time adicionada`);
        }

        if (!hasWorkEndTime) {
            console.log(`  🔧 Adicionando coluna work_end_time...`);
            db.exec(`ALTER TABLE employees ADD COLUMN work_end_time TEXT DEFAULT '17:00'`);
            console.log(`  ✅ Coluna work_end_time adicionada`);
        }

        // Atualizar funcionários existentes com horários padrão
        const updateResult = db.prepare(`
            UPDATE employees 
            SET work_start_time = '08:00', work_end_time = '17:00'
            WHERE work_start_time IS NULL OR work_end_time IS NULL
        `).run();

        if (updateResult.changes > 0) {
            console.log(`  📝 ${updateResult.changes} funcionário(s) atualizado(s) com horários padrão`);
        }

        db.close();
        successCount++;
        console.log(`  ✅ Escola ${schoolId} migrada com sucesso!`);

    } catch (error) {
        errorCount++;
        console.error(`  ❌ Erro na Escola ${schoolId}:`, error.message);
    }
});

console.log('\n\n📊 RESUMO DA MIGRAÇÃO:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(`Total de bancos: ${dbFiles.length}`);
console.log(`✅ Sucesso: ${successCount}`);
console.log(`❌ Erros: ${errorCount}`);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

if (errorCount === 0) {
    console.log('🎉 Migração concluída com sucesso!\n');
} else {
    console.log('⚠️ Migração concluída com alguns erros. Verifique os logs acima.\n');
}
