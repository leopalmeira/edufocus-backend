const https = require('https');

const data = JSON.stringify({
    email: 'admin@edufocus.com',
    password: 'admin123'
});

const options = {
    hostname: 'edufocus-backend-novo.onrender.com',
    port: 443,
    path: '/api/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length
    }
};

console.log('🔍 Testando backend em produção...\n');

const req = https.request(options, (res) => {
    let body = '';

    res.on('data', (chunk) => {
        body += chunk;
    });

    res.on('end', () => {
        console.log('Status:', res.statusCode);
        console.log('Response:', body);

        if (res.statusCode === 200) {
            console.log('\n✅ BACKEND FUNCIONANDO! O problema é no frontend.');
        } else {
            console.log('\n❌ Backend com erro:', res.statusCode);
        }
    });
});

req.on('error', (error) => {
    console.error('❌ Erro na requisição:', error.message);
});

req.write(data);
req.end();
