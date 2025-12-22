/**
 * Script para salvar sessão do WhatsApp em base64
 * Para usar no Render como variável de ambiente
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const SCHOOL_ID = process.argv[2] || '1'; // Pode passar o ID da escola como argumento
const AUTH_FOLDER = path.join(__dirname, 'whatsapp-auth', `school-${SCHOOL_ID}`);
const OUTPUT_FILE = path.join(__dirname, '..', `whatsapp-session-school-${SCHOOL_ID}-base64.txt`);

console.log(`📱 Salvando sessão WhatsApp da Escola ${SCHOOL_ID}...`);

if (!fs.existsSync(AUTH_FOLDER)) {
    console.error(`❌ Pasta de autenticação não encontrada: ${AUTH_FOLDER}`);
    console.error(`⚠️  Certifique-se de que o WhatsApp está conectado primeiro!`);
    process.exit(1);
}

try {
    // Criar arquivo tar.gz da pasta de autenticação
    const tarFile = path.join(__dirname, `whatsapp-session-school-${SCHOOL_ID}.tar.gz`);

    console.log('📦 Compactando arquivos de autenticação...');

    // Usar tar para comprimir (funciona no Windows com Git Bash ou WSL)
    try {
        execSync(`tar -czf "${tarFile}" -C "${AUTH_FOLDER}" .`, { stdio: 'inherit' });
    } catch (error) {
        console.error('❌ Erro ao comprimir. Tentando método alternativo...');

        // Método alternativo: criar arquivo zip usando PowerShell (Windows)
        const zipFile = path.join(__dirname, `whatsapp-session-school-${SCHOOL_ID}.zip`);
        execSync(`powershell Compress-Archive -Path "${AUTH_FOLDER}\\*" -DestinationPath "${zipFile}" -Force`, { stdio: 'inherit' });

        // Converter ZIP para base64
        const zipContent = fs.readFileSync(zipFile);
        const base64 = zipContent.toString('base64');

        fs.writeFileSync(OUTPUT_FILE, base64);
        console.log(`✅ Sessão salva em: ${OUTPUT_FILE}`);
        console.log(`📝 Tamanho: ${(base64.length / 1024).toFixed(2)} KB`);

        // Limpar arquivo zip
        fs.unlinkSync(zipFile);

        console.log('\n🎯 Próximos passos:');
        console.log('1. Copie o conteúdo do arquivo gerado');
        console.log('2. No Render, vá em Environment Variables');
        console.log(`3. Adicione: WHATSAPP_SESSION_SCHOOL_${SCHOOL_ID}_BASE64 = [conteúdo copiado]`);
        console.log('4. Faça redeploy do projeto');

        process.exit(0);
    }

    // Converter para base64
    console.log('🔐 Convertendo para base64...');
    const tarContent = fs.readFileSync(tarFile);
    const base64 = tarContent.toString('base64');

    // Salvar em arquivo
    fs.writeFileSync(OUTPUT_FILE, base64);

    console.log(`✅ Sessão salva em: ${OUTPUT_FILE}`);
    console.log(`📝 Tamanho: ${(base64.length / 1024).toFixed(2)} KB`);

    // Limpar arquivo tar
    fs.unlinkSync(tarFile);

    console.log('\n🎯 Próximos passos:');
    console.log('1. Copie o conteúdo do arquivo gerado');
    console.log('2. No Render, vá em Environment Variables');
    console.log(`3. Adicione: WHATSAPP_SESSION_SCHOOL_${SCHOOL_ID}_BASE64 = [conteúdo copiado]`);
    console.log('4. Faça redeploy do projeto');

} catch (error) {
    console.error('❌ Erro ao salvar sessão:', error.message);
    process.exit(1);
}
