import React, { useState } from 'react';
import { X, Send, MessageSquare } from 'lucide-react';
import api from '../api/axios';

const TeacherMessageModal = ({ teacher, schoolId, onClose }) => {
    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) {
            alert('Por favor, digite uma mensagem');
            return;
        }

        try {
            setSending(true);
            await api.post('/messages/send', {
                from_user_type: 'school_admin',
                from_user_id: schoolId,
                to_user_type: 'teacher',
                to_user_id: teacher.id,
                message: message.trim()
            });

            alert('✅ Mensagem enviada com sucesso!');
            setMessage('');
            onClose();
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            alert('❌ Erro ao enviar mensagem. Tente novamente.');
        } finally {
            setSending(false);
        }
    };

    return (
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
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <MessageSquare size={24} />
                        Enviar Mensagem
                    </h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* DESTINATÁRIO */}
                <div style={{
                    padding: '1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '12px',
                    marginBottom: '1.5rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.25rem',
                            fontWeight: '700'
                        }}>
                            {teacher.name?.charAt(0)}
                        </div>
                        <div>
                            <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>
                                Para: {teacher.name}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                {teacher.email}
                            </p>
                        </div>
                    </div>
                </div>

                {/* CAMPO DE MENSAGEM */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Mensagem:
                    </label>
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Digite sua mensagem aqui..."
                        className="input-field"
                        style={{
                            width: '100%',
                            minHeight: '150px',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            fontSize: '1rem',
                            padding: '1rem'
                        }}
                        disabled={sending}
                    />
                    <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.75rem',
                        color: 'var(--text-secondary)',
                        textAlign: 'right'
                    }}>
                        {message.length} caracteres
                    </div>
                </div>

                {/* BOTÕES */}
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={onClose}
                        className="btn"
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                        disabled={sending}
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSend}
                        className="btn"
                        style={{
                            flex: 1,
                            padding: '0.75rem',
                            background: sending ? 'rgba(16, 185, 129, 0.5)' : '#10b981',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            cursor: sending ? 'not-allowed' : 'pointer'
                        }}
                        disabled={sending}
                    >
                        {sending ? (
                            <>
                                <div className="spinner" style={{
                                    width: '16px',
                                    height: '16px',
                                    border: '2px solid rgba(255,255,255,0.3)',
                                    borderTop: '2px solid white',
                                    borderRadius: '50%',
                                    animation: 'spin 1s linear infinite'
                                }}></div>
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Send size={18} />
                                Enviar Mensagem
                            </>
                        )}
                    </button>
                </div>

                {/* DICA */}
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(59, 130, 246, 0.1)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    💡 <strong>Dica:</strong> O professor receberá esta mensagem em seu painel e por email.
                </div>
            </div>

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default TeacherMessageModal;
