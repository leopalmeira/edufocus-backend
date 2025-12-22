const { initSystemDB, getSystemDB } = require('./db');

// Initialize system DB
initSystemDB();
const db = getSystemDB();

console.log('🔄 Criando tabela de solicitações de remoção de câmeras...\n');

try {
    // Criar tabela camera_removal_requests
    db.prepare(`
        CREATE TABLE IF NOT EXISTS camera_removal_requests (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_id INTEGER NOT NULL,
            requester_type TEXT NOT NULL,
            requester_id INTEGER NOT NULL,
            reason TEXT,
            status TEXT DEFAULT 'pending',
            requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            reviewed_by INTEGER,
            reviewed_at DATETIME,
            FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE
        )
    `).run();

    console.log('✅ Tabela camera_removal_requests criada\n');

    // Verificar estrutura
    const tableInfo = db.prepare(`PRAGMA table_info(camera_removal_requests)`).all();

    console.log('📊 Estrutura da tabela camera_removal_requests:');
    tableInfo.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
    });

    console.log('\n🎉 Migração concluída com sucesso!\n');

} catch (err) {
    console.error('❌ Erro na migração:', err);
    process.exit(1);
}
