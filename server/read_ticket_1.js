const jwt = require('jsonwebtoken');

const SECRET_KEY = 'edufocus_secret_key_change_me';
const API_URL = 'http://localhost:5000';

const token = jwt.sign(
    { id: 6, username: 'educando', role: 'school' },
    SECRET_KEY,
    { expiresIn: '1h' }
);

const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
};

async function runTest() {
    try {
        console.log('\n--- LENDO MENSAGENS DO TICKET #1 ---');
        const res = await fetch(`${API_URL}/api/support/tickets/1/messages`, { headers });
        // Ler texto para garantir debug se não for JSON
        const text = await res.text();
        console.log('RAW RESPONSE:', text);

        const data = JSON.parse(text);

        if (!res.ok) throw new Error(JSON.stringify(data));

        if (data.messages) {
            console.log(`📜 Mensagens encontradas: ${data.messages.length}`);
            data.messages.forEach(m => console.log(`   - [${m.user_type}] ${m.message}`));
        } else {
            console.log('⚠️ CAMPO MESSAGES NÃO ENCONTRADO NO JSON');
        }

    } catch (error) {
        console.error('❌ ERRO NO TESTE:', error.message);
    }
}

runTest();
