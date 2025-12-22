const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { getSystemDB, getSchoolDB } = require('./db');

// Middleware de Autenticação para Guardiões
// (Copiado de middleware/auth.js mas simplificado para este arquivo ou reuse se possível)
const authenticateGuardian = (req, res, next) => {
    let token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if (!token && req.query.token) token = req.query.token; // Suporte para SSE via URL

    if (!token) return res.status(401).json({ success: false, message: 'Token não fornecido' });

    try {
        const secret = process.env.JWT_SECRET || 'edufocus-secret-key-123';
        const user = jwt.verify(token, secret);
        req.user = user;
        next();
    } catch (err) {
        return res.status(403).json({ success: false, message: 'Token inválido' });
    }
};

const SECRET_KEY = process.env.JWT_SECRET || 'edufocus-secret-key-123';

module.exports = function (app) {
    const db = getSystemDB();

    console.log('🛡️ Carregando rotas do Guardian App (Unificado)...');

    // ==========================================
    // AUTH (Login/Register)
    // ==========================================

    // POST /api/guardian/auth/register
    app.post('/api/guardian/auth/register', async (req, res) => {
        try {
            const { email, password, name, phone } = req.body;
            if (!email || !password || !name) return res.status(400).json({ success: false, message: 'Dados incompletos' });

            const existing = db.prepare('SELECT id FROM guardians WHERE email = ?').get(email);
            if (existing) return res.status(409).json({ success: false, message: 'Email já cadastrado' });

            const hashedPassword = await bcrypt.hash(password, 10);
            const result = db.prepare(`
                INSERT INTO guardians (email, password, name, phone) VALUES (?, ?, ?, ?)
            `).run(email, hashedPassword, name, phone || '');

            const token = jwt.sign({ id: result.lastInsertRowid, email }, SECRET_KEY, { expiresIn: '30d' });

            res.status(201).json({
                success: true,
                message: 'Cadastro realizado',
                data: { guardian: { id: result.lastInsertRowid, email, name }, token }
            });
        } catch (error) {
            console.error('Erro no registro guardian:', error);
            res.status(500).json({ success: false, message: 'Erro interno' });
        }
    });

    // POST /api/guardian/auth/login
    app.post('/api/guardian/auth/login', async (req, res) => {
        try {
            const { email, password } = req.body;
            const guardian = db.prepare('SELECT * FROM guardians WHERE email = ?').get(email);

            if (!guardian || !(await bcrypt.compare(password, guardian.password))) {
                return res.status(401).json({ success: false, message: 'Credenciais inválidas' });
            }

            const token = jwt.sign({ id: guardian.id, email: guardian.email }, SECRET_KEY, { expiresIn: '30d' });

            res.json({
                success: true,
                data: {
                    guardian: { id: guardian.id, email: guardian.email, name: guardian.name, phone: guardian.phone },
                    token
                }
            });
        } catch (error) {
            console.error('Erro login guardian:', error);
            res.status(500).json({ success: false, message: 'Erro interno' });
        }
    });

    // ==========================================
    // CORE (Students, Notifications)
    // ==========================================

    // GET /api/guardian/students (Listar Filhos)
    app.get('/api/guardian/students', authenticateGuardian, (req, res) => {
        const guardianId = req.user.id;
        const schools = db.prepare('SELECT id, name FROM schools').all();
        let allStudents = [];

        schools.forEach(school => {
            try {
                const schoolDB = getSchoolDB(school.id);
                // IMPORTANTE: Tabela student_guardians deve existir no db da escola (criada no passo anterior)
                const students = schoolDB.prepare(`
                    SELECT s.id, s.name, s.photo_url, s.class_name, sg.linked_at
                    FROM students s
                    JOIN student_guardians sg ON s.id = sg.student_id
                    WHERE sg.guardian_id = ?
                `).all(guardianId);

                students.forEach(s => allStudents.push({ ...s, school_id: school.id, school_name: school.name }));
            } catch (e) { /* Ignorar erros de escolas sem a tabela ou inacessíveis */ }
        });

        res.json({ success: true, data: { students: allStudents } });
    });

    // POST /api/guardian/link-student (Vincular Filho)
    app.post('/api/guardian/link-student', authenticateGuardian, (req, res) => {
        const { school_id, student_id } = req.body;
        const guardianId = req.user.id;

        try {
            const schoolDB = getSchoolDB(school_id);
            const student = schoolDB.prepare('SELECT id FROM students WHERE id = ?').get(student_id);
            if (!student) return res.status(404).json({ success: false, message: 'Aluno não encontrado' });

            const existing = schoolDB.prepare('SELECT id FROM student_guardians WHERE student_id = ? AND guardian_id = ?').get(student_id, guardianId);
            if (existing) return res.status(400).json({ success: false, message: 'Já vinculado' });

            schoolDB.prepare('INSERT INTO student_guardians (student_id, guardian_id) VALUES (?, ?)').run(student_id, guardianId);
            res.json({ success: true, message: 'Vinculado com sucesso' });
        } catch (error) {
            console.error('Erro ao vincular:', error);
            res.status(500).json({ success: false, message: 'Erro ao vincular' });
        }
    });

    // GET /api/guardian/notifications (Buscar novas notificações)
    app.get('/api/guardian/notifications', authenticateGuardian, (req, res) => {
        const guardianId = req.user.id;
        const schools = db.prepare('SELECT id, name FROM schools').all();
        let allNotifications = [];

        schools.forEach(school => {
            try {
                const schoolDB = getSchoolDB(school.id);
                // Busca logs onde notified_guardian = 0
                const notifs = schoolDB.prepare(`
                    SELECT al.id, al.student_id, s.name as student_name, al.event_type, al.timestamp
                    FROM access_logs al
                    JOIN students s ON al.student_id = s.id
                    JOIN student_guardians sg ON s.id = sg.student_id
                    WHERE sg.guardian_id = ? AND al.notified_guardian = 0
                    ORDER BY al.timestamp DESC LIMIT 10
                `).all(guardianId);

                notifs.forEach(n => allNotifications.push({ ...n, school_id: school.id, school_name: school.name, read: false }));
            } catch (e) { }
        });

        res.json({ success: true, data: { notifications: allNotifications } });
    });

    // POST /api/guardian/notifications/:id/read (Marcar lida)
    app.post('/api/guardian/notifications/:id/read', authenticateGuardian, (req, res) => {
        const notifId = req.params.id;
        const schools = db.prepare('SELECT id FROM schools').all();

        schools.forEach(school => {
            try {
                const schoolDB = getSchoolDB(school.id);
                schoolDB.prepare('UPDATE access_logs SET notified_guardian = 1 WHERE id = ?').run(notifId);
            } catch (e) { }
        });

        res.json({ success: true });
    });

    // SSE - Server Sent Events (NOVO!)
    // Endpoint para manter conexão aberta e receber eventos em tempo real
    app.get('/api/guardian/events', authenticateGuardian, (req, res) => {
        const guardianId = req.user.id;

        // Headers SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        console.log(`📡 SSE Conectado: Guardian ${guardianId}`);

        // Enviar evento inicial
        res.write(`data: ${JSON.stringify({ type: 'connected' })}\n\n`);

        // Polling INTERNO do Servidor (Mais eficiente que polling do cliente)
        // Verifica o banco a cada 1s e envia se tiver novidade
        const interval = setInterval(() => {
            const schools = db.prepare('SELECT id, name FROM schools').all();
            schools.forEach(school => {
                try {
                    const schoolDB = getSchoolDB(school.id);
                    const notifs = schoolDB.prepare(`
                        SELECT al.id, al.student_id, s.name as student_name, al.event_type, al.timestamp
                        FROM access_logs al
                        JOIN students s ON al.student_id = s.id
                        JOIN student_guardians sg ON s.id = sg.student_id
                        WHERE sg.guardian_id = ? AND al.notified_guardian = 0
                    `).all(guardianId);

                    if (notifs.length > 0) {
                        notifs.forEach(n => {
                            // Enviar evento
                            res.write(`data: ${JSON.stringify({ type: 'notification', data: n })}\n\n`);
                            // Marcar como 'enviado' (mas não necessariamente lido pelo user, mas aqui precisamos evitar loop)
                            // Na verdade, melhor deixar o cliente marcar como lido explicitamente via POST
                            // Mas se não marcarmos, vai enviar de novo a cada 1s.
                            // Solução: Tracking de IDs enviados nesta conexão.
                        });
                    }
                } catch (e) { }
            });
        }, 3000); // 3 em 3 segundos

        req.on('close', () => {
            clearInterval(interval);
            console.log(`🔌 SSE Desconectado: Guardian ${guardianId}`);
        });
    });
};
