const { initSystemDB, getSchoolDB } = require('./db');
const fs = require('fs');
const path = require('path');

// Inicializar DBs
initSystemDB();

// Assumindo escola ID 1 (padrão do teste seed) ou iterando
// Vamos limpar da escola 1 que é a que está sendo usada no teste
const schoolIds = [1, 2, 3, 4, 5];

for (const schoolId of schoolIds) {
    try {
        const schoolDB = getSchoolDB(schoolId);
        // Verificar se tabela existe
        try {
            schoolDB.prepare('SELECT 1 FROM attendance LIMIT 1').get();
        } catch (e) {
            console.log(`⚠️  Escola ${schoolId} não tem tabela attendance ou não existe.`);
            continue;
        }

        console.log(`\n🧹 LIMPANDO ESCOLA ${schoolId}...`);

        const todayStr = new Date().toISOString().split('T')[0];

        // Obter todas as entradas de hoje
        const entries = schoolDB.prepare(`
            SELECT id, student_id, timestamp, type 
            FROM attendance 
            WHERE timestamp LIKE ?
            ORDER BY timestamp ASC
        `).all(`${todayStr}%`);

        console.log(`📊 Encontradas ${entries.length} registros hoje.`);

        const seenEntry = new Set(); // Conjunto para Entradas (student_id + 'entry')
        const seenExit = new Set();  // Conjunto para Saídas (student_id + 'exit')
        let deletedCount = 0;

        const deleteStmt = schoolDB.prepare('DELETE FROM attendance WHERE id = ?');

        for (const entry of entries) {
            if (entry.type === 'entry') {
                if (seenEntry.has(entry.student_id)) {
                    deleteStmt.run(entry.id);
                    deletedCount++;
                } else {
                    seenEntry.add(entry.student_id);
                }
            } else if (entry.type === 'exit') {
                if (seenExit.has(entry.student_id)) {
                    deleteStmt.run(entry.id);
                    deletedCount++;
                } else {
                    seenExit.add(entry.student_id);
                }
            }
        }

        console.log(`✅ Limpeza na Escola ${schoolId}: ${deletedCount} duplicatas removidas.`);

    } catch (error) {
        console.error(`❌ Erro na escola ${schoolId}:`, error.message);
    }
}
