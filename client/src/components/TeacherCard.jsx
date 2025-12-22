import React, { useState } from 'react';
import { Plus, MessageSquare, BarChart3, Trash2 } from 'lucide-react';

const TeacherCard = ({ teacher, onLinkClass, onMessage, onMetrics, onUnlink }) => {
    return (
        <div className="glass-panel" style={{ padding: '1.5rem', borderRadius: '16px' }}>
            {/* HEADER COM AVATAR */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '1.5rem',
                    fontWeight: '700'
                }}>
                    {teacher.name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                        {teacher.name}
                    </h3>
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {teacher.email}
                    </p>
                </div>
            </div>

            {/* MATÉRIA */}
            {teacher.subject && (
                <div style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(99, 102, 241, 0.1)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    borderRadius: '8px',
                    marginBottom: '1rem',
                    fontSize: '0.875rem'
                }}>
                    📚 {teacher.subject}
                </div>
            )}

            {/* STATUS */}
            <div style={{ marginBottom: '1rem' }}>
                <span style={{
                    padding: '0.25rem 0.75rem',
                    background: teacher.status === 'active' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                    border: `1px solid ${teacher.status === 'active' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    color: teacher.status === 'active' ? '#10b981' : '#f59e0b'
                }}>
                    {teacher.status === 'active' ? '✓ Ativo' : '⏳ Pendente'}
                </span>
            </div>

            {/* BOTÕES DE AÇÃO */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <button
                    onClick={() => onLinkClass(teacher)}
                    className="btn"
                    style={{
                        padding: '0.5rem',
                        background: 'rgba(99, 102, 241, 0.2)',
                        border: '1px solid rgba(99, 102, 241, 0.4)',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                    }}
                >
                    <Plus size={14} />
                    Vincular Turma
                </button>

                <button
                    onClick={() => onMessage(teacher)}
                    className="btn"
                    style={{
                        padding: '0.5rem',
                        background: 'rgba(16, 185, 129, 0.2)',
                        border: '1px solid rgba(16, 185, 129, 0.4)',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                    }}
                >
                    <MessageSquare size={14} />
                    Mensagem
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <button
                    onClick={() => onMetrics(teacher)}
                    className="btn"
                    style={{
                        padding: '0.5rem',
                        background: 'rgba(245, 158, 11, 0.2)',
                        border: '1px solid rgba(245, 158, 11, 0.4)',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem'
                    }}
                >
                    <BarChart3 size={14} />
                    Métricas
                </button>

                <button
                    onClick={() => onUnlink(teacher)}
                    className="btn"
                    style={{
                        padding: '0.5rem',
                        background: 'rgba(239, 68, 68, 0.2)',
                        border: '1px solid rgba(239, 68, 68, 0.4)',
                        fontSize: '0.75rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.25rem',
                        color: '#ef4444'
                    }}
                >
                    <Trash2 size={14} />
                    Desvincular
                </button>
            </div>
        </div>
    );
};

export default TeacherCard;
