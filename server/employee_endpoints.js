// ==================== ENDPOINTS DE FUNCIONÁRIOS ====================

// Listar funcionários da escola
app.get('/api/school/employees', authenticateToken, (req, res) => {
    if (req.user.role !== 'school_admin') return res.sendStatus(403);
    const schoolDB = getSchoolDB(req.user.id);

    try {
        const employees = schoolDB.prepare('SELECT * FROM employees ORDER BY name').all();
        res.json(employees);
    } catch (error) {
        console.error('Erro ao listar funcionários:', error);
        res.status(500).json({ error: 'Erro ao listar funcionários' });
    }
});

// Cadastrar funcionário
app.post('/api/school/employees', authenticateToken, (req, res) => {
    if (req.user.role !== 'school_admin') return res.sendStatus(403);
    const { name, role, email, phone, photo_url, face_descriptor, employee_id, work_start_time, work_end_time } = req.body;
    const schoolDB = getSchoolDB(req.user.id);

    try {
        const result = schoolDB.prepare(`
            INSERT INTO employees (name, role, email, phone, photo_url, face_descriptor, employee_id, work_start_time, work_end_time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(name, role, email, phone, photo_url, face_descriptor, employee_id, work_start_time || '08:00', work_end_time || '17:00');

        console.log(`✅ Funcionário ${name} cadastrado com ID ${result.lastInsertRowid} (Horário: ${work_start_time || '08:00'} - ${work_end_time || '17:00'})`);
        res.json({ id: result.lastInsertRowid, message: 'Funcionário cadastrado com sucesso' });
    } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error);
        res.status(500).json({ error: 'Erro ao cadastrar funcionário' });
    }
});

// Atualizar funcionário
app.put('/api/school/employees/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'school_admin') return res.sendStatus(403);
    const { id } = req.params;
    const { name, role, email, phone, photo_url, face_descriptor, employee_id, work_start_time, work_end_time } = req.body;
    const schoolDB = getSchoolDB(req.user.id);

    try {
        const result = schoolDB.prepare(`
            UPDATE employees 
            SET name = ?, role = ?, email = ?, phone = ?, photo_url = ?, 
                face_descriptor = ?, employee_id = ?, work_start_time = ?, work_end_time = ?
            WHERE id = ?
        `).run(name, role, email, phone, photo_url, face_descriptor, employee_id,
            work_start_time || '08:00', work_end_time || '17:00', id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        console.log(`✅ Funcionário ${name} (ID: ${id}) atualizado`);
        res.json({ message: 'Funcionário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar funcionário:', error);
        res.status(500).json({ error: 'Erro ao atualizar funcionário' });
    }
});

// Deletar funcionário
app.delete('/api/school/employees/:id', authenticateToken, (req, res) => {
    if (req.user.role !== 'school_admin') return res.sendStatus(403);
    const { id } = req.params;
    const schoolDB = getSchoolDB(req.user.id);

    try {
        // Deletar registros de ponto do funcionário
        schoolDB.prepare('DELETE FROM employee_attendance WHERE employee_id = ?').run(id);

        // Deletar funcionário
        const result = schoolDB.prepare('DELETE FROM employees WHERE id = ?').run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Funcionário não encontrado' });
        }

        console.log(`✅ Funcionário ID ${id} excluído`);
        res.json({ message: 'Funcionário excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir funcionário:', error);
        res.status(500).json({ error: 'Erro ao excluir funcionário' });
    }
});

// Registrar ponto de funcionário
app.post('/api/school/employee-attendance', authenticateToken, (req, res) => {
    if (req.user.role !== 'school_admin') return res.sendStatus(403);
    const { employee_id } = req.body;
    const schoolDB = getSchoolDB(req.user.id);

    try {
        // Verificar se já registrou hoje
        const today = new Date().toISOString().split('T')[0];
        const existing = schoolDB.prepare(`
            SELECT id FROM employee_attendance 
            WHERE employee_id = ? AND date(timestamp) = date(?)
        `).get(employee_id, today);

        if (existing) {
            return res.status(400).json({
                error: 'Funcionário já registrou ponto hoje',
                alreadyRegistered: true
            });
        }

        // Registrar ponto
        const result = schoolDB.prepare(`
            INSERT INTO employee_attendance (employee_id, timestamp)
            VALUES (?, datetime('now', 'localtime'))
        `).run(employee_id);

        console.log(`✅ Ponto registrado para funcionário ID ${employee_id}`);
        res.json({
            success: true,
            id: result.lastInsertRowid,
            message: 'Ponto registrado com sucesso'
        });
    } catch (error) {
        console.error('Erro ao registrar ponto:', error);
        res.status(500).json({ error: 'Erro ao registrar ponto' });
    }
});

// Buscar registros de ponto de funcionários
app.get('/api/school/employee-attendance', authenticateToken, (req, res) => {
    if (req.user.role !== 'school_admin') return res.sendStatus(403);
    const { date, startDate, endDate } = req.query;
    const schoolDB = getSchoolDB(req.user.id);

    try {
        let query = `
            SELECT 
                ea.*,
                e.name as employee_name,
                e.role as employee_role
            FROM employee_attendance ea
            JOIN employees e ON ea.employee_id = e.id
        `;

        const params = [];

        if (date) {
            query += ' WHERE date(ea.timestamp) = date(?)';
            params.push(date);
        } else if (startDate && endDate) {
            query += ' WHERE date(ea.timestamp) BETWEEN date(?) AND date(?)';
            params.push(startDate, endDate);
        }

        query += ' ORDER BY ea.timestamp DESC';

        const records = schoolDB.prepare(query).all(...params);
        res.json(records);
    } catch (error) {
        console.error('Erro ao buscar registros de ponto:', error);
        res.status(500).json({ error: 'Erro ao buscar registros' });
    }
});

// ==================== FIM DOS ENDPOINTS DE FUNCIONÁRIOS ====================
