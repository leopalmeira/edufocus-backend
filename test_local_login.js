const axios = require('axios');

async function testLocalLogin() {
    console.log('🔍 Testando login local em http://localhost:5000/api/login\n');

    try {
        const res = await axios.post('http://localhost:5000/api/login', {
            email: 'admin@edufocus.com',
            password: 'admin123'
        });
        console.log('✅ LOGIN ADMIN SUCESSO!');
        console.log('Token:', res.data.token ? 'Recebido ✓' : 'Não recebido ✗');
        console.log('Role:', res.data.role);
        console.log('User:', res.data.user.email);
    } catch (error) {
        console.error('❌ Erro no login Admin:');
        console.error('Status:', error.response?.status);
        console.error('Mensagem:', error.response?.data?.message || error.message);
    }

    console.log('\n---\n');

    try {
        const res = await axios.post('http://localhost:5000/api/login', {
            email: 'escola1@test.com',
            password: 'escola123'
        });
        console.log('✅ LOGIN ESCOLA SUCESSO!');
        console.log('Token:', res.data.token ? 'Recebido ✓' : 'Não recebido ✗');
        console.log('Role:', res.data.role);
        console.log('User:', res.data.user.email);
    } catch (error) {
        console.error('❌ Erro no login Escola:');
        console.error('Status:', error.response?.status);
        console.error('Mensagem:', error.response?.data?.message || error.message);
    }
}

testLocalLogin();
