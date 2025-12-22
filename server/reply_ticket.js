const Database = require('better-sqlite3');
const path = require('path');

const DB_DIR = path.join(__dirname, '../database');
const systemDBPath = path.join(DB_DIR, 'system.db');

const db = new Database(systemDBPath);

try {
    console.log("=== ADICIONANDO RESPOSTA DO SUPORTE ===");

    // ID do ticket (assumindo 2 baseado na verificação anterior)
    const ticketId = 2;

    db.prepare(`
        INSERT INTO ticket_messages (ticket_id, user_type, user_id, message)
        VALUES (?, 'super_admin', 1, 'Olá! Recebemos sua solicitação. Em que posso ajudar especificamente?')
    `).run(ticketId);

    // Atualizar status para in_progress
    db.prepare(`
        UPDATE support_tickets 
        SET status = 'in_progress', updated_at = CURRENT_TIMESTAMP 
        WHERE id = ?
    `).run(ticketId);

    console.log("✅ Resposta do suporte adicionada ao ticket #2");

} catch (error) {
    console.error("Erro:", error.message);
}
