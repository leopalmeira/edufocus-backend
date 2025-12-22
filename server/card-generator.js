/**
 * ============================================================================
 * GERADOR DE CARD VISUAL PARA WHATSAPP
 * ============================================================================
 * 
 * Cria um card HTML bonito com a foto do aluno e converte em imagem
 * para enviar no WhatsApp
 */

const nodeHtmlToImage = require('node-html-to-image');

/**
 * Gera card visual com foto do aluno
 * @param {Object} data - Dados para o card
 * @param {string} data.studentName - Nome do aluno
 * @param {string} data.studentPhoto - Foto em base64
 * @param {string} data.className - Nome da turma
 * @param {string} data.schoolName - Nome da escola
 * @param {string} data.date - Data formatada
 * @param {string} data.time - Hora formatada
 * @returns {Promise<Buffer>} - Imagem do card em buffer
 */
async function generateArrivalCard(data) {
    const { studentName, studentPhoto, className, schoolName, date, time } = data;

    // Template HTML do card - FORMATO COMPACTO HORIZONTAL
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                background: transparent;
                display: flex;
                justify-content: center;
                align-items: center;
                padding: 0;
                margin: 0;
                width: 320px;
                height: 120px;
            }
            
            .card {
                width: 320px;
                height: 120px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                border-radius: 15px;
                display: flex;
                align-items: center;
                padding: 15px;
                box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
                position: relative;
                overflow: hidden;
            }
            
            .card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
                pointer-events: none;
            }
            
            .photo-container {
                width: 63px;
                height: 63px;
                border-radius: 50%;
                overflow: hidden;
                border: 3px solid white;
                flex-shrink: 0;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                background: white;
            }
            
            .student-photo {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
            
            .info-container {
                flex: 1;
                margin-left: 12px;
                color: white;
            }
            
            .student-name {
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 3px;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                line-height: 1.2;
                max-width: 220px;
            }
            
            .school-name {
                font-size: 11px;
                opacity: 0.95;
                margin-bottom: 5px;
                font-weight: 600;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            
            .details {
                display: flex;
                gap: 10px;
                font-size: 10px;
                opacity: 0.9;
            }
            
            .detail-item {
                display: flex;
                align-items: center;
                gap: 3px;
            }
            
            .badge {
                position: absolute;
                top: 5px;
                right: 5px;
                background: rgba(16, 185, 129, 0.9);
                color: white;
                padding: 3px 8px;
                border-radius: 10px;
                font-size: 9px;
                font-weight: 700;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
            }
        </style>
    </head>
    <body>
        <div class="card">
            <div class="badge">✓ CHEGOU</div>
            
            <div class="photo-container">
                <img src="${studentPhoto}" alt="Foto" class="student-photo" />
            </div>
            
            <div class="info-container">
                <div class="student-name">${studentName}</div>
                <div class="school-name">🎓 ${schoolName}</div>
                <div class="details">
                    ${className ? `<div class="detail-item">📚 ${className}</div>` : ''}
                    <div class="detail-item">🕐 ${time}</div>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;

    // Gerar imagem do HTML
    const image = await nodeHtmlToImage({
        html: html,
        quality: 100,
        type: 'png',
        puppeteerArgs: {
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        },
        encoding: 'buffer'
    });

    return image;
}

module.exports = { generateArrivalCard };
