import React, { useState, useEffect } from 'react';
import { MessageSquare, Plus, X, Send, CheckCircle, Trash2, Clock, AlertCircle } from 'lucide-react';
import api from '../api/axios';

const SupportTickets = ({ userType, userId }) => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [showChatModal, setShowChatModal] = useState(false);
    const [newMessage, setNewMessage] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [loading, setLoading] = useState(false);

    // Formulário novo ticket
    const [newTicket, setNewTicket] = useState({
        title: '',
        category: 'geral',
        message: '',
        priority: 'normal'
    });

    useEffect(() => {
        loadTickets();
    }, [filterStatus]);

    useEffect(() => {
        // Scroll para o fim quando mensagens mudarem
        const messageContainer = document.getElementById('messages-container');
        if (messageContainer) {
            messageContainer.scrollTop = messageContainer.scrollHeight;
        }
    }, [messages, showChatModal]);

    useEffect(() => {
        let interval;
        if (showChatModal && selectedTicket) {
            // Função para buscar mensagens silenciosamente (sem loading spinner)
            const fetchMessages = async () => {
                try {
                    const res = await api.get(`/support/tickets/${selectedTicket.id}/messages`);
                    console.log('🔄 Chat atualizado:', res.data.messages.length, 'mensagens');
                    setMessages(res.data.messages);
                } catch (error) {
                    console.error('Erro no auto-update:', error);
                }
            };

            // Buscar imediatamente e depois a cada 1 segundo
            fetchMessages();
            interval = setInterval(fetchMessages, 1000);
        }
        return () => clearInterval(interval);
    }, [showChatModal, selectedTicket]);

    const loadTickets = async () => {
        try {
            setLoading(true);
            const params = filterStatus !== 'all' ? `?status=${filterStatus}` : '';
            const res = await api.get(`/support/tickets/${userType}/${userId}${params}`);
            setTickets(res.data);
        } catch (error) {
            console.error('Erro ao carregar tickets:', error);
        } finally {
            setLoading(false);
        }
    };

    const createTicket = async () => {
        if (!newTicket.title.trim() || !newTicket.message.trim()) {
            alert('Título e mensagem são obrigatórios');
            return;
        }

        try {
            await api.post('/support/tickets', {
                user_type: userType,
                user_id: userId,
                ...newTicket
            });

            alert('✅ Ticket criado com sucesso!');
            setNewTicket({ title: '', category: 'geral', message: '', priority: 'normal' });
            setShowNewTicketModal(false);
            loadTickets();
        } catch (error) {
            console.error('Erro ao criar ticket:', error);
            const errorMsg = error.response?.data?.error || 'Erro ao criar ticket';
            alert(`❌ ${errorMsg}`);
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
                user_type: userType,
                user_id: userId,
                message: newMessage.trim()
            });

            setNewMessage('');
            openChat(selectedTicket); // Recarregar mensagens
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            alert('❌ Erro ao enviar mensagem');
        }
    };

    const markAsResolved = async () => {
        if (!confirm('Marcar este ticket como resolvido?')) return;

        try {
            await api.patch(`/support/tickets/${selectedTicket.id}/status`, {
                status: 'resolved'
            });

            alert('✅ Ticket marcado como resolvido!');
            setShowChatModal(false);
            loadTickets();
        } catch (error) {
            console.error('Erro ao resolver ticket:', error);
            alert('❌ Erro ao atualizar status');
        }
    };

    const deleteTicket = async (ticketId) => {
        if (!confirm('Tem certeza que deseja excluir este ticket?\n\nEsta ação não pode ser desfeita!')) return;

        try {
            await api.delete(`/support/tickets/${ticketId}`);
            alert('✅ Ticket excluído com sucesso!');
            setShowChatModal(false);
            loadTickets();
        } catch (error) {
            console.error('Erro ao excluir ticket:', error);
            alert('❌ Erro ao excluir ticket. Certifique-se que está resolvido.');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'open': '#ef4444',
            'in_progress': '#f59e0b',
            'resolved': '#10b981',
            'closed': '#6b7280'
        };
        return colors[status] || '#6b7280';
    };

    const getStatusLabel = (status) => {
        const labels = {
            'open': 'Aberto',
            'in_progress': 'Em Atendimento',
            'resolved': 'Resolvido',
            'closed': 'Fechado'
        };
        return labels[status] || status;
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'urgent' || priority === 'high') {
            return <AlertCircle size={16} color="#ef4444" />;
        }
        return <Clock size={16} color="#6b7280" />;
    };

    return (
        <div style={{ padding: '2rem' }}>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <MessageSquare size={32} />
                    Suporte
                </h1>
                <button
                    onClick={() => setShowNewTicketModal(true)}
                    className="btn"
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Plus size={20} />
                    Novo Chamado
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
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                    <div className="spinner" style={{
                        width: '40px',
                        height: '40px',
                        border: '4px solid rgba(255,255,255,0.1)',
                        borderTop: '4px solid var(--accent-primary)',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite',
                        margin: '0 auto'
                    }}></div>
                </div>
            ) : tickets.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <MessageSquare size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {filterStatus === 'all' ? 'Nenhum chamado ainda.' : `Nenhum chamado ${getStatusLabel(filterStatus).toLowerCase()}.`}
                    </p>
                    <button
                        onClick={() => setShowNewTicketModal(true)}
                        className="btn"
                        style={{ marginTop: '1rem', background: 'var(--accent-primary)', color: 'white' }}
                    >
                        Criar Primeiro Chamado
                    </button>
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
                                border: '1px solid rgba(255, 255, 255, 0.1)'
                            }}
                            onClick={() => openChat(ticket)}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(99, 102, 241, 0.5)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {getPriorityIcon(ticket.priority)}
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>
                                        #{ticket.id} - {ticket.title}
                                    </h3>
                                </div>
                                <span style={{
                                    padding: '0.25rem 0.75rem',
                                    background: `${getStatusColor(ticket.status)}20`,
                                    border: `1px solid ${getStatusColor(ticket.status)}50`,
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    color: getStatusColor(ticket.status)
                                }}>
                                    {getStatusLabel(ticket.status)}
                                </span>
                            </div>

                            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                {ticket.category && <span>📁 {ticket.category} • </span>}
                                <span>{ticket.message_count} mensagem{ticket.message_count !== 1 ? 's' : ''}</span>
                            </div>

                            {ticket.last_message && (
                                <div style={{
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: '8px',
                                    fontSize: '0.875rem',
                                    color: 'var(--text-secondary)',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    whiteSpace: 'nowrap'
                                }}>
                                    💬 {ticket.last_message}
                                </div>
                            )}

                            <div style={{ marginTop: '0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                Criado em {new Date(ticket.created_at).toLocaleString('pt-BR')}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL NOVO TICKET */}
            {showNewTicketModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="glass-panel" style={{
                        width: '90%',
                        maxWidth: '600px',
                        padding: '2rem',
                        borderRadius: '16px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600' }}>Novo Chamado</h3>
                            <button onClick={() => setShowNewTicketModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                <X size={24} />
                            </button>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Título *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Ex: Problema com acesso ao sistema"
                                    value={newTicket.title}
                                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                                    style={{ width: '100%' }}
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Categoria</label>
                                    <select
                                        className="input-field"
                                        value={newTicket.category}
                                        onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="geral">Geral</option>
                                        <option value="tecnico">Técnico</option>
                                        <option value="financeiro">Financeiro</option>
                                        <option value="duvida">Dúvida</option>
                                    </select>
                                </div>

                                <div>
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Prioridade</label>
                                    <select
                                        className="input-field"
                                        value={newTicket.priority}
                                        onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value })}
                                        style={{ width: '100%' }}
                                    >
                                        <option value="low">Baixa</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">Alta</option>
                                        <option value="urgent">Urgente</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Descrição *</label>
                                <textarea
                                    className="input-field"
                                    placeholder="Descreva seu problema ou dúvida..."
                                    value={newTicket.message}
                                    onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
                                    rows="5"
                                    style={{ width: '100%', resize: 'vertical' }}
                                />
                            </div>

                            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                <button
                                    onClick={() => setShowNewTicketModal(false)}
                                    className="btn"
                                    style={{ flex: 1, padding: '0.75rem', background: 'rgba(255, 255, 255, 0.1)' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={createTicket}
                                    className="btn"
                                    style={{ flex: 1, padding: '0.75rem', background: 'var(--accent-primary)', color: 'white' }}
                                >
                                    Criar Chamado
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL CHAT */}
            {showChatModal && selectedTicket && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '2rem'
                }}>
                    <div className="glass-panel" style={{
                        width: '90%',
                        maxWidth: '800px',
                        maxHeight: '90vh',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: '16px'
                    }}>
                        {/* HEADER */}
                        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        #{selectedTicket.id} - {selectedTicket.title}
                                    </h3>
                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        <span style={{
                                            padding: '0.25rem 0.75rem',
                                            background: `${getStatusColor(selectedTicket.status)}20`,
                                            border: `1px solid ${getStatusColor(selectedTicket.status)}50`,
                                            borderRadius: '12px',
                                            color: getStatusColor(selectedTicket.status)
                                        }}>
                                            {getStatusLabel(selectedTicket.status)}
                                        </span>
                                        <span>📁 {selectedTicket.category}</span>
                                    </div>
                                </div>
                                <button onClick={() => setShowChatModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                                    <X size={24} />
                                </button>
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
                                background: '#f8fafc' // Fundo claro limpo
                            }}
                        >
                            {(!messages || messages.length === 0) ? (
                                <div style={{ textAlign: 'center', color: '#94a3b8', padding: '2rem' }}>
                                    Escreva a primeira mensagem deste ticket.
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    if (!msg) return null;
                                    const isMe = String(msg.user_type) === String(userType) && String(msg.user_id) === String(userId);

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
                                                background: isMe ? '#f97316' : '#3b82f6', // Eu = Laranja, Eles = Azul
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                color: 'white',
                                                fontWeight: 'bold',
                                                fontSize: '1.2rem',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                                flexShrink: 0
                                            }}>
                                                {isMe ? 'E' : 'S'}
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
                                                        {isMe ? 'Você' : (msg.user_type === 'admin' || msg.user_type === 'super_admin' ? 'Suporte' : msg.user_type)}
                                                    </span>
                                                    <span>{msg.created_at ? new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                                                </div>

                                                {/* BALÃO */}
                                                <div style={{
                                                    padding: '12px 16px',
                                                    background: isMe ? '#f97316' : '#3b82f6', // Laranja vs Azul
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
                        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
                            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                                <textarea
                                    className="input-field"
                                    placeholder="Digite sua mensagem..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    rows="3"
                                    style={{ flex: 1, resize: 'none' }}
                                />
                                <button
                                    onClick={sendMessage}
                                    className="btn"
                                    style={{
                                        padding: '1rem',
                                        background: 'var(--accent-primary)',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    <Send size={20} />
                                </button>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                {selectedTicket.status !== 'resolved' && selectedTicket.status !== 'closed' && (
                                    <button
                                        onClick={markAsResolved}
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: 'rgba(16, 185, 129, 0.2)',
                                            border: '1px solid rgba(16, 185, 129, 0.4)',
                                            color: '#10b981',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <CheckCircle size={18} />
                                        Marcar como Resolvido
                                    </button>
                                )}
                                {(selectedTicket.status === 'resolved' || selectedTicket.status === 'closed') && (
                                    <button
                                        onClick={() => deleteTicket(selectedTicket.id)}
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            border: '1px solid rgba(239, 68, 68, 0.4)',
                                            color: '#ef4444',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        <Trash2 size={18} />
                                        Excluir Chamado
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default SupportTickets;
