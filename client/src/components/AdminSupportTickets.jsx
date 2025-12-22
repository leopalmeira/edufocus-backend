import React, { useState, useEffect } from 'react';
import { MessageSquare, X, Send, CheckCircle, Trash2, Clock, AlertCircle, Filter } from 'lucide-react';
import api from '../api/axios';

const AdminSupportTickets = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showChatModal, setShowChatModal] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTickets();
    }, [filterStatus]);

    // Scroll automático
    useEffect(() => {
        const messageContainer = document.getElementById('messages-container');
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, [messages, showChatModal]);

    useEffect(() => {
        let interval;
        if (showChatModal && selectedTicket) {
            const fetchMessages = async () => {
                try {
                    const res = await api.get(`/support/tickets/${selectedTicket.id}/messages`);
                    console.log('🔄 Admin Chat atualizado:', res.data.messages.length, 'mensagens');
                    setMessages(res.data.messages);
                } catch (error) {
                    console.error('Erro no auto-update:', error);
                }
            };
            fetchMessages();
            interval = setInterval(fetchMessages, 1000);
        }
        return () => clearInterval(interval);
    }, [showChatModal, selectedTicket]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
            const res = await api.get(`/support/tickets/all${params}`);
            setTickets(res.data);
        } catch (error) {
            console.error('Erro ao carregar tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const openChat = async (ticket) => {
        try {
            setSelectedTicket(ticket);
            const res = await api.get(`/support/tickets/${ticket.id}/messages`);
            setMessages(res.data.messages);
            setShowChatModal(true);
        } catch (error) {
            console.error('Erro ao carregar mensagens:', error);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim()) return;

        try {
            await api.post(`/support/tickets/${selectedTicket.id}/messages`, {
                user_type: 'super_admin',
                user_id: 1,
                message: newMessage.trim(),
                is_internal: 0
            });

            setNewMessage('');
            openChat(selectedTicket);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            alert('❌ Erro ao enviar mensagem');
        }
    };

    const markAsResolved = async () => {
        if (!confirm('Marcar ticket como resolvido?')) return;
        try {
            await api.patch(`/support/tickets/${selectedTicket.id}/status`, { status: 'resolved' });
            alert('✅ Ticket resolvido!');
            setShowChatModal(false);
            loadTickets();
        } catch (error) {
            alert('❌ Erro ao atualizar status');
        }
    };

    const deleteTicket = async (ticketId) => {
        if (!confirm('Excluir este ticket permanentemente?')) return;
        try {
            await api.delete(`/support/tickets/${ticketId}`);
            alert('✅ Ticket excluído!');
            setShowChatModal(false);
            loadTickets();
        } catch (error) {
            alert('❌ Erro ao excluir ticket');
        }
    };

    const getStatusColor = (status) => {
        const colors = { 'open': '#ef4444', 'in_progress': '#f59e0b', 'resolved': '#10b981', 'closed': '#6b7280' };
        return colors[status] || '#6b7280';
    };

    const getStatusLabel = (status) => {
        const labels = { 'open': 'Aberto', 'in_progress': 'Em Atendimento', 'resolved': 'Resolvido', 'closed': 'Fechado' };
        return labels[status] || status;
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={32} />
                    Gestão de Suporte
                </h1>
                <button onClick={loadTickets} className="btn" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    Atualizar Lista
                </button>
            </div>

            {/* FILTROS */}
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {['all', 'open', 'in_progress', 'resolved'].map(status => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className="btn"
                        style={{
                            padding: '0.5rem 1rem',
                            background: filterStatus === status ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            border: `1px solid ${filterStatus === status ? 'rgba(99, 102, 241, 0.5)' : 'rgba(255, 255, 255, 0.1)'}`,
                            color: filterStatus === status ? '#6366f1' : 'var(--text-secondary)'
                        }}
                    >
                        {status === 'all' ? 'Todos' : getStatusLabel(status)}
                    </button>
                ))}
            </div>

            {/* LISTA DE TICKETS */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: '3rem' }}>Carregando...</div>
            ) : tickets.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    Nenhum chamado encontrado.
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {tickets.map(ticket => (
                        <div
                            key={ticket.id}
                            className="glass-panel"
                            style={{
                                padding: '1.5rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                borderLeft: `4px solid ${getStatusColor(ticket.status)}`
                            }}
                            onClick={() => openChat(ticket)}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        #{ticket.id} - {ticket.title}
                                    </h3>
                                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                                        Usuário: <span style={{ color: '#e2e8f0', fontWeight: '500' }}>{ticket.user_type === 'school' ? 'Escola' : 'Professor'} (ID: {ticket.user_id})</span>
                                    </div>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    background: `${getStatusColor(ticket.status)}20`,
                                    color: getStatusColor(ticket.status),
                                    borderRadius: '12px',
                                    fontSize: '0.75rem'
                                }}>
                                    {getStatusLabel(ticket.status)}
                                </span>
                            </div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {ticket.last_message ? `💬 ${ticket.last_message}` : 'Sem mensagens'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL CHAT (ADMIN) */}
            {showChatModal && selectedTicket && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '2rem'
                }}>
                    <div className="glass-panel" style={{
                        width: '90%', maxWidth: '800px', maxHeight: '90vh',
                        display: 'flex', flexDirection: 'column', borderRadius: '16px'
                    }}>
                        {/* HEADER */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', borderRadius: '16px 16px 0 0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>#{selectedTicket.id} - {selectedTicket.title}</h3>
                                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>Atendendo: {selectedTicket.user_type} (ID: {selectedTicket.user_id})</div>
                                </div>
                                <button onClick={() => setShowChatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'white' }}><X /></button>
                            </div>
                        </div>

                        {/* MENSAGENS - ESTILO VIBRANTE COM AVATAR (ZAP/TELEGRAM) */}
                        <div
                            id="messages-container"
                            style={{
                                flex: 1,
                                overflowY: 'auto',
                                padding: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1.5rem',
                                background: '#f8fafc' // Fundo claro limpo para contraste com os balões vibrantes
                            }}
                        >
                            {(!messages || messages.length === 0) ? (
                                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>Nenhuma mensagem neste ticket.</div>
                            ) : (
                                messages.map((msg, idx) => {
                                    if (!msg) return null;
                                    const isMe = msg.user_type === 'super_admin' || msg.user_type === 'admin';

                                    return (
                                        <div key={idx} style={{
                                            display: 'flex',
                                            flexDirection: isMe ? 'row-reverse' : 'row',
                                            alignItems: 'flex-start',
                                            gap: '12px'
                                        }}>
                                            {/* AVATAR */}
                                            <div style={{
                                                width: '40px',
                                                height: '40px',
                                                borderRadius: '50%',
                                                background: isMe ? '#f97316' : '#3b82f6',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                flexShrink: 0
                                            }}>
                                                {isMe ? 'S' : (msg.user_type === 'school' ? 'E' : 'U')}
                                            </div>

                                            {/* CONTEÚDO */}
                                            <div style={{
                                                maxWidth: '70%',
                                                display: 'flex',
                                                flexDirection: 'column',
                                                alignItems: isMe ? 'flex-end' : 'flex-start'
                                            }}>
                                                {/* NOME E DATA */}
                                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '4px', display: 'flex', gap: '8px' }}>
                                                    <span style={{ fontWeight: '600' }}>
                                                        {isMe ? 'Suporte' : (msg.user_type === 'school' ? 'Escola' : 'Usuário')}
                                                    </span>
                                                    <span>{new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                                </div>

                                                {/* BALÃO */}
                                                <div style={{
                                                    padding: '12px 16px',
                                                    background: isMe ? '#f97316' : '#3b82f6', // Laranja (Suporte) vs Azul (Usuário)
                                                    color: 'white',
                                                    borderRadius: isMe ? '12px 0 12px 12px' : '0 12px 12px 12px',
                                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                                    position: 'relative',
                                                    wordWrap: 'break-word',
                                                    lineHeight: '1.5'
                                                }}>
                                                    {msg.message || ''}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* INPUT */}
                        <div style={{ padding: '1.5rem', background: '#1e293b', borderTop: '1px solid rgba(255,255,255,0.1)', borderRadius: '0 0 16px 16px' }}>
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <textarea
                                    className="input-field"
                                    placeholder="Digite sua resposta..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                                    rows="2"
                                    style={{ flex: 1, resize: 'none' }}
                                />
                                <button onClick={sendMessage} className="btn" style={{ padding: '0 1.5rem', background: 'var(--accent-primary)', color: 'white' }}>
                                    <Send size={20} />
                                </button>
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                {selectedTicket.status !== 'resolved' && (
                                    <button onClick={markAsResolved} className="btn" style={{ flex: 1, background: 'rgba(16, 185, 129, 0.2)', color: '#10b981' }}>
                                        <CheckCircle size={18} style={{ marginRight: '0.5rem' }} /> Marcar Resolvido
                                    </button>
                                )}
                                <button onClick={() => deleteTicket(selectedTicket.id)} className="btn" style={{ flex: 1, background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>
                                    <Trash2 size={18} style={{ marginRight: '0.5rem' }} /> Excluir Ticket
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminSupportTickets;
