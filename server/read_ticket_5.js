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
        // Tentar ler ticket 4 ou 5 (que sabemos que existem)
        const ticketId = 5; // Assumindo que 5 foi o ultimo criado
        console.log(`\n--- LENDO MENSAGENS DO TICKET #${ticketId} ---`);
        const res = await fetch(`${API_URL}/api/support/tickets/${ticketId}/messages`, { headers });
        const text = await res.text();
        console.log('RAW RESPONSE:', text);

        const data = JSON.parse(text);

        if (Array.isArray(data)) {
            console.log('⚠️ RECEBI UM ARRAY (ROTA DE LISTA ERRADA!)');
        } else if (data.messages) {
            console.log(`✅ RECEBI OBJETO CORRETO. Mensagens: ${data.messages.length}`);
        } else {
            console.log('⚠️ ESTRANHO:', data);
        }

    } catch (error) {
        console.error('❌ ERRO NO TESTE:', error.message);
    }
}

runTest();
