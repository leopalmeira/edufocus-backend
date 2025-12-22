const axios = require('axios');

async function testLocal() {
    console.log('🔍 Testando servidor local em http://localhost:5000');

    try {
        const res = await axios.post('http://localhost:5000/login/superadmin', {
            email: 'admin@edufocus.com',
            password: 'admin123'
        });
        console.log('✅ LOGIN ADMIN SUCESSO!');
        console.log('Token:', res.data.token ? 'Recebido' : 'Não recebido');
    } catch (error) {
        console.error('❌ Erro:', error.response ? error.response.data : error.message);
    }
}

testLocal();
