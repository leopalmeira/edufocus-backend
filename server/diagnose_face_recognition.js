// Script para diagnosticar problemas de reconhecimento facial
const Database = require('better-sqlite3');
const path = require('path');

const dbDir = path.join(__dirname, '../database');

function checkStudentFaceDescriptors(schoolId) {
    const dbPath = path.join(dbDir, `school_${schoolId}.db`);
    const db = new Database(dbPath);

    console.log('🔍 DIAGNÓSTICO DE RECONHECIMENTO FACIAL\n');
    console.log(`📁 Banco: ${dbPath}\n`);

    try {
        // Buscar todos os alunos
        const students = db.prepare('SELECT * FROM students').all();
        console.log(`👥 Total de alunos cadastrados: ${students.length}\n`);

        let withPhoto = 0;
        let withDescriptor = 0;
        let withValidDescriptor = 0;

        students.forEach((student, index) => {
            console.log(`\n${index + 1}. ${student.name} (ID: ${student.id})`);
            console.log(`   Turma: ${student.class_name || 'Não informada'}`);

            // Verificar foto
            if (student.photo_url) {
                withPhoto++;
                const photoSize = student.photo_url.length;
                console.log(`   ✅ Foto: SIM (${photoSize} caracteres)`);
            } else {
                console.log(`   ❌ Foto: NÃO`);
            }

            // Verificar descritor facial
            if (student.face_descriptor) {
                withDescriptor++;
                console.log(`   ✅ Descritor facial: SIM`);

                try {
                    // Tentar parsear o descritor
                    let descriptor;
                    if (typeof student.face_descriptor === 'string') {
                        descriptor = JSON.parse(student.face_descriptor);
                    } else {
                        descriptor = student.face_descriptor;
                    }

                    if (Array.isArray(descriptor)) {
                        console.log(`   📊 Tamanho do descritor: ${descriptor.length} elementos`);

                        if (descriptor.length === 128) {
                            withValidDescriptor++;
                            console.log(`   ✅ Descritor VÁLIDO (128 elementos)`);

                            // Verificar se tem valores numéricos
                            const hasNumbers = descriptor.every(val => typeof val === 'number');
                            if (hasNumbers) {
                                console.log(`   ✅ Todos os valores são numéricos`);
                            } else {
                                console.log(`   ⚠️ Alguns valores NÃO são numéricos!`);
                            }
                        } else {
                            console.log(`   ❌ Descritor INVÁLIDO (deveria ter 128, tem ${descriptor.length})`);
                        }
                    } else {
                        console.log(`   ❌ Descritor não é um array!`);
                    }
                } catch (error) {
                    console.log(`   ❌ Erro ao parsear descritor: ${error.message}`);
                }
            } else {
                console.log(`   ❌ Descritor facial: NÃO`);
            }
        });

        console.log('\n\n📊 RESUMO:');
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
        console.log(`Total de alunos:              ${students.length}`);
        console.log(`Com foto cadastrada:          ${withPhoto} (${((withPhoto / students.length) * 100).toFixed(1)}%)`);
        console.log(`Com descritor facial:         ${withDescriptor} (${((withDescriptor / students.length) * 100).toFixed(1)}%)`);
        console.log(`Com descritor VÁLIDO:         ${withValidDescriptor} (${((withValidDescriptor / students.length) * 100).toFixed(1)}%)`);
        console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);

        if (withValidDescriptor === 0) {
            console.log('⚠️  PROBLEMA IDENTIFICADO:');
            console.log('   Nenhum aluno tem descritor facial válido!');
            console.log('\n💡 SOLUÇÃO:');
            console.log('   1. Vá em Gerenciar Alunos');
            console.log('   2. Edite cada aluno');
            console.log('   3. Faça upload da foto novamente');
            console.log('   4. Aguarde "✅ Rosto detectado!"');
            console.log('   5. Salve o aluno\n');
        } else if (withValidDescriptor < students.length) {
            console.log('⚠️  ATENÇÃO:');
            console.log(`   ${students.length - withValidDescriptor} aluno(s) sem descritor válido`);
            console.log('   Estes alunos NÃO serão reconhecidos pela câmera!\n');
        } else {
            console.log('✅ TUDO OK!');
            console.log('   Todos os alunos têm descritores faciais válidos\n');
        }

    } catch (error) {
        console.error('❌ Erro:', error.message);
    }

    db.close();
}

// Verificar escola 1 (padrão)
const schoolId = process.argv[2] || 1;
console.log(`🏫 Verificando escola ${schoolId}...\n`);
checkStudentFaceDescriptors(schoolId);
