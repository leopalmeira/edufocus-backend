// ============================================
// ENDPOINTS PARA TÉCNICO - CONFIGURAÇÃO DE CÂMERAS
// ============================================

// Listar todas as escolas
app.get('/api/technician/schools', authenticateToken, async (req, res) => {
    if (req.user.role !== 'technician' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    try {
        const [schools] = await db.query(
            'SELECT id, name, city, state FROM schools ORDER BY name'
        );
        res.json(schools);
    } catch (err) {
        console.error('Erro ao buscar escolas:', err);
        res.status(500).json({ message: 'Erro ao buscar escolas' });
    }
});

// Listar salas de uma escola
app.get('/api/technician/schools/:schoolId/classrooms', authenticateToken, async (req, res) => {
    if (req.user.role !== 'technician' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    try {
        const [classrooms] = await db.query(
            'SELECT id, name, capacity FROM classrooms WHERE school_id = ? ORDER BY name',
            [req.params.schoolId]
        );
        res.json(classrooms);
    } catch (err) {
        console.error('Erro ao buscar salas:', err);
        res.status(500).json({ message: 'Erro ao buscar salas' });
    }
});

// Listar câmeras de uma escola
app.get('/api/technician/cameras', authenticateToken, async (req, res) => {
    if (req.user.role !== 'technician' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    const { school_id } = req.query;

    try {
        let query = `
            SELECT c.*, cl.name as classroom_name, s.name as school_name
            FROM cameras c
            LEFT JOIN classrooms cl ON c.classroom_id = cl.id
            LEFT JOIN schools s ON c.school_id = s.id
        `;
        const params = [];

        if (school_id) {
            query += ' WHERE c.school_id = ?';
            params.push(school_id);
        }

        query += ' ORDER BY c.created_at DESC';

        const [cameras] = await db.query(query, params);
        res.json(cameras);
    } catch (err) {
        console.error('Erro ao buscar câmeras:', err);
        res.status(500).json({ message: 'Erro ao buscar câmeras' });
    }
});

// Criar nova câmera
app.post('/api/technician/cameras', authenticateToken, async (req, res) => {
    if (req.user.role !== 'technician' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    const {
        school_id,
        classroom_id,
        camera_name,
        camera_type,
        camera_ip,
        camera_url,
        camera_port,
        camera_username,
        camera_password,
        notes
    } = req.body;

    if (!school_id || !camera_name || !camera_url) {
        return res.status(400).json({ message: 'Dados obrigatórios faltando' });
    }

    try {
        // Criptografar senha se fornecida
        let encryptedPassword = null;
        if (camera_password) {
            encryptedPassword = await bcrypt.hash(camera_password, 10);
        }

        const [result] = await db.query(
            `INSERT INTO cameras (
                school_id, classroom_id, camera_name, camera_type,
                camera_ip, camera_url, camera_port,
                camera_username, camera_password,
                notes, installed_by, status
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
            [
                school_id,
                classroom_id || null,
                camera_name,
                camera_type || 'IP',
                camera_ip || null,
                camera_url,
                camera_port || 80,
                camera_username || null,
                encryptedPassword,
                notes || null,
                req.user.id
            ]
        );

        res.json({
            message: 'Câmera configurada com sucesso',
            cameraId: result.insertId
        });
    } catch (err) {
        console.error('Erro ao criar câmera:', err);
        res.status(500).json({ message: 'Erro ao criar câmera' });
    }
});

// Atualizar câmera
app.put('/api/technician/cameras/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'technician' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    const {
        camera_name,
        camera_type,
        camera_ip,
        camera_url,
        camera_port,
        camera_username,
        camera_password,
        notes,
        status
    } = req.body;

    try {
        const updates = [];
        const values = [];

        if (camera_name) {
            updates.push('camera_name = ?');
            values.push(camera_name);
        }
        if (camera_type) {
            updates.push('camera_type = ?');
            values.push(camera_type);
        }
        if (camera_ip !== undefined) {
            updates.push('camera_ip = ?');
            values.push(camera_ip || null);
        }
        if (camera_url) {
            updates.push('camera_url = ?');
            values.push(camera_url);
        }
        if (camera_port) {
            updates.push('camera_port = ?');
            values.push(camera_port);
        }
        if (camera_username !== undefined) {
            updates.push('camera_username = ?');
            values.push(camera_username || null);
        }
        if (camera_password) {
            const encryptedPassword = await bcrypt.hash(camera_password, 10);
            updates.push('camera_password = ?');
            values.push(encryptedPassword);
        }
        if (notes !== undefined) {
            updates.push('notes = ?');
            values.push(notes || null);
        }
        if (status) {
            updates.push('status = ?');
            values.push(status);
        }

        if (updates.length === 0) {
            return res.status(400).json({ message: 'Nenhum campo para atualizar' });
        }

        values.push(req.params.id);

        await db.query(
            `UPDATE cameras SET ${updates.join(', ')} WHERE id = ?`,
            values
        );

        res.json({ message: 'Câmera atualizada com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar câmera:', err);
        res.status(500).json({ message: 'Erro ao atualizar câmera' });
    }
});

// Deletar câmera
app.delete('/api/technician/cameras/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'technician' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    try {
        await db.query('DELETE FROM cameras WHERE id = ?', [req.params.id]);
        res.json({ message: 'Câmera removida com sucesso' });
    } catch (err) {
        console.error('Erro ao remover câmera:', err);
        res.status(500).json({ message: 'Erro ao remover câmera' });
    }
});

// Testar conexão com câmera
app.post('/api/technician/cameras/test', authenticateToken, async (req, res) => {
    if (req.user.role !== 'technician' && req.user.role !== 'superadmin') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    const { camera_url, camera_type } = req.body;

    if (!camera_url) {
        return res.status(400).json({ message: 'URL da câmera é obrigatória' });
    }

    try {
        // Aqui você pode implementar testes específicos por tipo
        // Por enquanto, vamos fazer um teste HTTP básico

        const axios = require('axios');

        try {
            const response = await axios.get(camera_url, {
                timeout: 5000,
                validateStatus: () => true // Aceita qualquer status
            });

            if (response.status === 200 || response.status === 401) {
                // 200 = OK, 401 = Precisa autenticação (mas câmera responde)
                res.json({
                    success: true,
                    message: '✅ Conexão bem-sucedida! Câmera está respondendo.'
                });
            } else {
                res.json({
                    success: false,
                    message: `⚠️ Câmera respondeu com status ${response.status}`
                });
            }
        } catch (error) {
            if (error.code === 'ECONNREFUSED') {
                res.json({
                    success: false,
                    message: '❌ Conexão recusada. Verifique IP e porta.'
                });
            } else if (error.code === 'ETIMEDOUT') {
                res.json({
                    success: false,
                    message: '❌ Tempo esgotado. Câmera não responde.'
                });
            } else {
                res.json({
                    success: false,
                    message: `❌ Erro: ${error.message}`
                });
            }
        }
    } catch (err) {
        console.error('Erro ao testar câmera:', err);
        res.status(500).json({
            success: false,
            message: 'Erro ao testar conexão'
        });
    }
});

// ============================================
// ENDPOINTS PARA PROFESSOR - VISUALIZAR CÂMERA
// ============================================

// Obter câmera de uma sala
app.get('/api/teacher/classroom/:id/camera', authenticateToken, async (req, res) => {
    if (req.user.role !== 'teacher') {
        return res.status(403).json({ message: 'Acesso negado' });
    }

    try {
        const [cameras] = await db.query(
            `SELECT id, camera_name, camera_url, camera_type, status
             FROM cameras
             WHERE classroom_id = ? AND status = 'active'
             LIMIT 1`,
            [req.params.id]
        );

        if (cameras.length === 0) {
            return res.status(404).json({
                message: 'Câmera não configurada para esta sala'
            });
        }

        res.json(cameras[0]);
    } catch (err) {
        console.error('Erro ao buscar câmera:', err);
        res.status(500).json({ message: 'Erro ao buscar câmera' });
    }
});
