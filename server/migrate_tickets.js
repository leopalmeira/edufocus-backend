/**
 * Migração: Sistema de Tickets de Suporte Completo
 * - Tickets com título e status
 * - Mensagens/conversas dentro do ticket
 * - Histórico completo
 * - Finalização e exclusão automática
 */

const { getSystemDB } = require('./db');

function migrateTicketSystem() {
    console.log('🔄 Migrando sistema de tickets de suporte...\n');

    const db = getSystemDB();

    try {
        // 1. Recriar tabela de tickets com campos completos
        db.exec(`
            -- Remover tabela antiga se existir
            DROP TABLE IF EXISTS support_tickets_old;
            
            -- Renomear tabela atual para backup
            ALTER TABLE support_tickets RENAME TO support_tickets_old;
            
            -- Criar nova tabela de tickets
            CREATE TABLE support_tickets (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_type TEXT NOT NULL,           -- 'school', 'teacher', 'representative'
                user_id INTEGER NOT NULL,
                title TEXT NOT NULL,               -- Título do chamado
                category TEXT,                     -- Categoria (técnico, financeiro, etc)
                status TEXT DEFAULT 'open',        -- 'open', 'in_progress', 'resolved', 'closed'
                priority TEXT DEFAULT 'normal',    -- 'low', 'normal', 'high', 'urgent'
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                closed_at DATETIME,
                resolved_by INTEGER                -- ID do admin que resolveu
            );
            
            -- Criar tabela de mensagens do ticket
            CREATE TABLE IF NOT EXISTS ticket_messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                ticket_id INTEGER NOT NULL,
                user_type TEXT NOT NULL,           -- Quem enviou
                user_id INTEGER NOT NULL,
                message TEXT NOT NULL,
                is_internal BOOLEAN DEFAULT 0,     -- Nota interna (só admin vê)
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (ticket_id) REFERENCES support_tickets(id) ON DELETE CASCADE
            );
            
            -- Criar índices para performance
            CREATE INDEX IF NOT EXISTS idx_tickets_user ON support_tickets(user_type, user_id);
            CREATE INDEX IF NOT EXISTS idx_tickets_status ON support_tickets(status);
            CREATE INDEX IF NOT EXISTS idx_ticket_messages_ticket ON ticket_messages(ticket_id);
        `);

        console.log('✅ Tabelas de tickets criadas com sucesso');

        // 2. Migrar dados antigos se existirem
        const oldTickets = db.prepare('SELECT * FROM support_tickets_old').all();

        if (oldTickets.length > 0) {
            console.log(`📦 Migrando ${oldTickets.length} tickets antigos...`);

            for (const ticket of oldTickets) {
                // Inserir ticket na nova tabela
                const result = db.prepare(`
                    INSERT INTO support_tickets (user_type, user_id, title, status, created_at)
                    VALUES (?, ?, ?, ?, ?)
                `).run(
                    ticket.user_type,
                    ticket.user_id,
                    ticket.subject || 'Sem título',
                    ticket.status,
                    ticket.created_at
                );

                // Inserir mensagem inicial se existir
                if (ticket.message) {
                    db.prepare(`
                        INSERT INTO ticket_messages (ticket_id, user_type, user_id, message, created_at)
                        VALUES (?, ?, ?, ?, ?)
                    `).run(
                        result.lastInsertRowid,
                        ticket.user_type,
                        ticket.user_id,
                        ticket.message,
                        ticket.created_at
                    );
                }
            }

            console.log('✅ Dados migrados com sucesso');
        }

        // 3. Remover tabela antiga
        db.exec('DROP TABLE IF EXISTS support_tickets_old');

        console.log('\n🎉 Migração concluída com sucesso!\n');

        return true;

    } catch (error) {
        console.error('❌ Erro na migração:', error.message);
        console.error(error.stack);
        return false;
    }
}

// Executar migração
if (require.main === module) {
    migrateTicketSystem();
}

module.exports = { migrateTicketSystem };
