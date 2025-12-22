const { initSystemDB, getSystemDB } = require('./db');

// Initialize system DB
initSystemDB();
const db = getSystemDB();

console.log('🔄 Iniciando migração do banco de dados...\n');

try {
    // 1. Adicionar coluna camera_purpose
    console.log('📝 Adicionando coluna camera_purpose...');
    try {
        db.prepare(`ALTER TABLE cameras ADD COLUMN camera_purpose TEXT DEFAULT 'classroom'`).run();
        console.log('✅ Coluna camera_purpose adicionada\n');
    } catch (err) {
        if (err.message.includes('duplicate column name')) {
            console.log('ℹ️  Coluna camera_purpose já existe\n');
        } else {
            throw err;
        }
    }

    // 2. Criar tabela camera_classes
    console.log('📝 Criando tabela camera_classes...');
    db.prepare(`
        CREATE TABLE IF NOT EXISTS camera_classes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            camera_id INTEGER NOT NULL,
            classroom_id INTEGER NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (camera_id) REFERENCES cameras(id) ON DELETE CASCADE,
            UNIQUE(camera_id, classroom_id)
        )
    `).run();
    console.log('✅ Tabela camera_classes criada\n');

    // 3. Migrar dados existentes
    console.log('📝 Migrando dados existentes...');
    const existingCameras = db.prepare(`
        SELECT id, classroom_id FROM cameras WHERE classroom_id IS NOT NULL
    `).all();

    if (existingCameras.length > 0) {
        const stmt = db.prepare(`
            INSERT OR IGNORE INTO camera_classes (camera_id, classroom_id)
            VALUES (?, ?)
        `);

        for (const camera of existingCameras) {
            stmt.run(camera.id, camera.classroom_id);
        }
        console.log(`✅ ${existingCameras.length} câmeras migradas para camera_classes\n`);
    } else {
        console.log('ℹ️  Nenhuma câmera existente para migrar\n');
    }

    // 4. Verificar estrutura
    console.log('📝 Verificando estrutura das tabelas...');
    const camerasInfo = db.prepare(`PRAGMA table_info(cameras)`).all();
    const cameraClassesInfo = db.prepare(`PRAGMA table_info(camera_classes)`).all();

    console.log('\n📊 Estrutura da tabela cameras:');
    camerasInfo.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
    });

    console.log('\n📊 Estrutura da tabela camera_classes:');
    cameraClassesInfo.forEach(col => {
        console.log(`   - ${col.name} (${col.type})`);
    });

    console.log('\n🎉 Migração concluída com sucesso!\n');

} catch (err) {
    console.error('❌ Erro na migração:', err);
    process.exit(1);
}
