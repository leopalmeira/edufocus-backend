/**
 * Script de Diagnóstico WhatsApp
 * Verifica por que as mensagens não estão sendo enviadas
 */

const Database = require('better-sqlite3');
const path = require('path');
const { getWhatsAppService } = require('./whatsapp-service');

const DB_DIR = path.join(__dirname, '../database');
const systemDBPath = path.join(DB_DIR, 'system.db');

console.log('🔍 ===== DIAGNÓSTICO WHATSAPP =====\n');

// 1. Verificar escolas cadastradas
console.log('📋 1. ESCOLAS CADASTRADAS:');
const systemDB = new Database(systemDBPath);
const schools = systemDB.prepare('SELECT id, name FROM schools').all();
console.log(`   Total: ${schools.length} escolas`);
schools.forEach(s => console.log(`   - Escola ${s.id}: ${s.name}`));
console.log('');

// 2. Para cada escola, verificar status WhatsApp
console.log('📱 2. STATUS WHATSAPP POR ESCOLA:');
for (const school of schools) {
    try {
        const whatsappService = getWhatsAppService(school.id);
        const status = whatsappService.getStatus();

        console.log(`\n   Escola ${school.id} (${school.name}):`);
        console.log(`   ├─ Conectado: ${status.connected ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`   ├─ Tem autenticação salva: ${status.hasAuth ? '✅ SIM' : '❌ NÃO'}`);
        console.log(`   ├─ Telefone WhatsApp: ${status.phone || 'N/A'}`);
        console.log(`   └─ QR Code pendente: ${status.qrCode ? '⚠️ SIM (precisa escanear)' : 'Não'}`);

    } catch (error) {
        console.log(`   Escola ${school.id}: ❌ ERRO - ${error.message}`);
    }
}
console.log('\n');

// 3. Verificar alunos sem telefone
console.log('📞 3. ALUNOS SEM TELEFONE CADASTRADO:');
for (const school of schools) {
    const schoolDBPath = path.join(DB_DIR, `school_${school.id}.db`);
    try {
        const schoolDB = new Database(schoolDBPath);
        const studentsNoPhone = schoolDB.prepare(`
            SELECT id, name, class_name 
            FROM students 
            WHERE phone IS NULL OR phone = ''
        `).all();

        if (studentsNoPhone.length > 0) {
            console.log(`\n   Escola ${school.id} (${school.name}):`);
            studentsNoPhone.forEach(s => {
                console.log(`   ⚠️ ${s.name} (Turma: ${s.class_name}) - SEM TELEFONE`);
            });
        }
        schoolDB.close();
    } catch (error) {
        console.log(`   Escola ${school.id}: Erro ao acessar banco - ${error.message}`);
    }
}
console.log('');

// 4. Verificar registros de presença de HOJE
console.log('📅 4. REGISTROS DE PRESENÇA HOJE:');
const today = new Date().toISOString().split('T')[0];
for (const school of schools) {
    const schoolDBPath = path.join(DB_DIR, `school_${school.id}.db`);
    try {
        const schoolDB = new Database(schoolDBPath);
        const todayAttendance = schoolDB.prepare(`
            SELECT a.*, s.name, s.phone
            FROM attendance a
            JOIN students s ON a.student_id = s.id
            WHERE date(a.timestamp) = date(?)
            ORDER BY a.timestamp DESC
        `).all(today);

        if (todayAttendance.length > 0) {
            console.log(`\n   Escola ${school.id} (${school.name}):`);
            todayAttendance.forEach(a => {
                const time = new Date(a.timestamp).toLocaleTimeString('pt-BR');
                const hasPhone = a.phone ? '📱' : '❌';
                console.log(`   ${hasPhone} ${time} - ${a.name} (${a.type}) - Tel: ${a.phone || 'SEM TELEFONE'}`);
            });
        } else {
            console.log(`   Escola ${school.id}: Nenhum registro hoje`);
        }
        schoolDB.close();
    } catch (error) {
        console.log(`   Escola ${school.id}: Erro - ${error.message}`);
    }
}
console.log('');

// 5. Verificar notificações WhatsApp enviadas HOJE
console.log('💬 5. NOTIFICAÇÕES WHATSAPP ENVIADAS HOJE:');
for (const school of schools) {
    const schoolDBPath = path.join(DB_DIR, `school_${school.id}.db`);
    try {
        const schoolDB = new Database(schoolDBPath);

        // Verificar se tabela existe
        const tableExists = schoolDB.prepare(`
            SELECT name FROM sqlite_master 
            WHERE type='table' AND name='whatsapp_notifications'
        `).get();

        if (!tableExists) {
            console.log(`   Escola ${school.id}: ⚠️ Tabela whatsapp_notifications NÃO EXISTE`);
            schoolDB.close();
            continue;
        }

        const todayNotifications = schoolDB.prepare(`
            SELECT wn.*, s.name
            FROM whatsapp_notifications wn
            JOIN students s ON wn.student_id = s.id
            WHERE date(wn.sent_at) = date(?)
            ORDER BY wn.sent_at DESC
        `).all(today);

        if (todayNotifications.length > 0) {
            console.log(`\n   Escola ${school.id} (${school.name}):`);
            todayNotifications.forEach(n => {
                const time = new Date(n.sent_at).toLocaleTimeString('pt-BR');
                const status = n.success ? '✅ ENVIADA' : '❌ FALHOU';
                console.log(`   ${status} ${time} - ${n.name} (${n.notification_type}) - ${n.phone}`);
            });
        } else {
            console.log(`   Escola ${school.id}: ❌ NENHUMA notificação enviada hoje`);
        }
        schoolDB.close();
    } catch (error) {
        console.log(`   Escola ${school.id}: Erro - ${error.message}`);
    }
}
console.log('');

// 6. Resumo e Recomendações
console.log('📊 6. RESUMO E RECOMENDAÇÕES:\n');

let hasIssues = false;

// Verificar se algum WhatsApp está desconectado
for (const school of schools) {
    try {
        const whatsappService = getWhatsAppService(school.id);
        const status = whatsappService.getStatus();

        if (!status.connected) {
            hasIssues = true;
            console.log(`   ❌ PROBLEMA: WhatsApp da Escola ${school.id} está DESCONECTADO`);
            if (status.qrCode) {
                console.log(`      → Ação: Escanear QR Code no painel da escola`);
            } else if (!status.hasAuth) {
                console.log(`      → Ação: Conectar WhatsApp pela primeira vez no painel`);
            } else {
                console.log(`      → Ação: Reconectar WhatsApp no painel da escola`);
            }
        }
    } catch (error) {
        hasIssues = true;
        console.log(`   ❌ PROBLEMA: Erro ao verificar WhatsApp da Escola ${school.id}`);
    }
}

// Verificar alunos sem telefone
for (const school of schools) {
    const schoolDBPath = path.join(DB_DIR, `school_${school.id}.db`);
    try {
        const schoolDB = new Database(schoolDBPath);
        const count = schoolDB.prepare(`
            SELECT COUNT(*) as total 
            FROM students 
            WHERE phone IS NULL OR phone = ''
        `).get();

        if (count.total > 0) {
            hasIssues = true;
            console.log(`   ⚠️ AVISO: Escola ${school.id} tem ${count.total} aluno(s) sem telefone`);
            console.log(`      → Ação: Cadastrar telefones no painel de alunos`);
        }
        schoolDB.close();
    } catch (error) {
        // Ignorar
    }
}

if (!hasIssues) {
    console.log('   ✅ Tudo parece estar configurado corretamente!');
    console.log('   ℹ️ Se ainda não está enviando, verifique os logs do servidor em tempo real.');
}

console.log('\n🔍 ===== FIM DO DIAGNÓSTICO =====\n');

systemDB.close();
