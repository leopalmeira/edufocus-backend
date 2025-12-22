const { getSchoolDB } = require('./db');
const path = require('path');

// Simular busca da API
const SCHOOL_ID = 11; // ID da escola 'eu aprendo' (visto no reset_test.js)
const SEARCH_QUERY = 'Leandro';
const CLASS_NAME = null; // Tente null primeiro, depois tente filtrar

function testSearch() {
    try {
        console.log(`🔎 Testando busca para Escola ID: ${SCHOOL_ID}, Query: "${SEARCH_QUERY}"`);
        const db = getSchoolDB(SCHOOL_ID);

        // 1. Ver todas as turmas
        const classes = db.prepare('SELECT name FROM classes').all();
        console.log('📚 Turmas disponíveis:', classes.map(c => c.name));

        // 2. Buscar aluno SEM filtro de turma
        let query = `SELECT id, name, class_name FROM students WHERE name LIKE ?`;
        const students = db.prepare(query).all(`%${SEARCH_QUERY}%`);

        console.log(`\n🎓 Alunos encontrados (Sem filtro de turma): ${students.length}`);
        students.forEach(s => console.log(`   - ${s.name} (Turma: "${s.class_name}")`));

        // 3. Ver se bate com a lógica da API
        if (students.length > 0) {
            const student = students[0];
            // Se a API filtra por class_name, e o class_name for diferente...
            if (CLASS_NAME && student.class_name !== CLASS_NAME) {
                console.log(`\n⚠️ ATENÇÃO: Se o frontend filtrar pela turma "${CLASS_NAME}", este aluno NÃO aparecerá.`);
            }
        }

    } catch (err) {
        console.error('❌ Erro:', err);
    }
}

testSearch();
