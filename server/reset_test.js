const { getSchoolDB, getSystemDB } = require('./db');
const path = require('path');

// Nome do Aluno para Resetar (Parcial ou total)
const STUDENT_NAME_QUERY = 'Leandro';
const GUARDIAN_EMAIL = 'eu@email.com';

function resetDailyStats() {
    try {
        console.log('🧹 Iniciando Limpeza de Testes...');

        const systemDB = getSystemDB();
        const schools = systemDB.prepare('SELECT id, name FROM schools').all();

        if (schools.length === 0) {
            console.log('❌ Nenhuma escola encontrada.');
            return;
        }

        // Busca ID do Guardian
        const guardian = systemDB.prepare('SELECT id, name FROM guardians WHERE email = ?').get(GUARDIAN_EMAIL);
        if (!guardian) {
            console.log(`❌ Responsável ${GUARDIAN_EMAIL} não encontrado. Rode o restore_guardian.js primeiro.`);
            return;
        }
        console.log(`👤 Responsável encontrado: ${guardian.name} (ID: ${guardian.id})`);

        schools.forEach(school => {
            console.log(`\n🏫 Verificando Escola: ${school.name} (ID: ${school.id})`);
            const db = getSchoolDB(school.id);

            // 1. Achar o aluno
            const student = db.prepare('SELECT id, name FROM students WHERE name LIKE ?').get(`%${STUDENT_NAME_QUERY}%`);

            if (student) {
                console.log(`   🎓 Aluno encontrado: ${student.name} (ID: ${student.id})`);

                // 2. Garantir Vínculo
                const link = db.prepare('SELECT id FROM student_guardians WHERE student_id = ? AND guardian_id = ?').get(student.id, guardian.id);
                if (!link) {
                    db.prepare('INSERT INTO student_guardians (student_id, guardian_id) VALUES (?, ?)').run(student.id, guardian.id);
                    console.log('   🔗 Vínculo criado com sucesso!');
                } else {
                    console.log('   🔗 Aluno já vinculado ao responsável.');
                }

                // 3. Limpar Presença de Hoje (attendance)
                const deletedAttendance = db.prepare(`
                    DELETE FROM attendance 
                    WHERE student_id = ? AND date(timestamp) = date('now')
                `).run(student.id);
                console.log(`   🗑️ Presenças deletadas hoje: ${deletedAttendance.changes}`);

                // 4. Limpar Logs de Notificação de Hoje (access_logs)
                // (Para garantir que o sistema gere um novo evento "fresco")
                const deletedLogs = db.prepare(`
                    DELETE FROM access_logs 
                    WHERE student_id = ? AND date(timestamp) = date('now')
                `).run(student.id);
                console.log(`   🗑️ Logs de notificação deletados hoje: ${deletedLogs.changes}`);

                console.log('   ✨ TUDO PRONTO PARA NOVO TESTE! Passe o rosto agora.');

            } else {
                console.log('   🔸 Aluno não encontrado nesta escola.');
            }
        });

    } catch (err) {
        console.error('❌ Erro:', err);
    }
}

resetDailyStats();
