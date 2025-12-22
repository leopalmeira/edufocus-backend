import React, { useState, useEffect } from 'react';
import { X, Users, BookOpen, Clock, Award, BarChart3, TrendingUp } from 'lucide-react';
import api from '../api/axios';

const TeacherMetricsModal = ({ teacher, schoolId, onClose }) => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadMetrics();
    }, [teacher.id]);

    const loadMetrics = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/school/${schoolId}/teacher/${teacher.id}/metrics`);
            setMetrics(res.data);
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
            alert('Erro ao carregar métricas do professor');
        } finally {
            setLoading(false);
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
            zIndex: 1000,
            padding: '2rem'
        }}>
            <div className="glass-panel" style={{
                width: '90%',
                maxWidth: '900px',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '2rem',
                borderRadius: '16px'
            }}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h3 style={{ fontSize: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <BarChart3 size={28} />
                        Métricas de Ensino
                    </h3>
                    <button
                        onClick={onClose}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                    >
                        <X size={24} />
                    </button>
                </div>

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
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Carregando métricas...</p>
                    </div>
                ) : metrics ? (
                    <>
                        {/* PROFESSOR INFO */}
                        <div style={{
                            padding: '1.5rem',
                            background: 'rgba(99, 102, 241, 0.1)',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            borderRadius: '12px',
                            marginBottom: '2rem'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
                                <div>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                        {teacher.name}
                                    </h4>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        {teacher.email}
                                    </p>
                                    {teacher.subject && (
                                        <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                            📚 {teacher.subject}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* CARDS DE MÉTRICAS */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(16, 185, 129, 0.1)',
                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Users size={20} color="#10b981" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Turmas</span>
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981' }}>
                                    {metrics.totalClasses || 0}
                                </p>
                            </div>

                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(59, 130, 246, 0.1)',
                                border: '1px solid rgba(59, 130, 246, 0.3)',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <BookOpen size={20} color="#3b82f6" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Alunos</span>
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6' }}>
                                    {metrics.totalStudents || 0}
                                </p>
                            </div>

                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(245, 158, 11, 0.1)',
                                border: '1px solid rgba(245, 158, 11, 0.3)',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Clock size={20} color="#f59e0b" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Aulas</span>
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b' }}>
                                    {metrics.totalSessions || 0}
                                </p>
                            </div>

                            <div style={{
                                padding: '1.5rem',
                                background: 'rgba(168, 85, 247, 0.1)',
                                border: '1px solid rgba(168, 85, 247, 0.3)',
                                borderRadius: '12px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                    <Award size={20} color="#a855f7" />
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Questões</span>
                                </div>
                                <p style={{ fontSize: '2rem', fontWeight: '700', color: '#a855f7' }}>
                                    {metrics.totalQuestions || 0}
                                </p>
                            </div>
                        </div>

                        {/* DESEMPENHO DAS TURMAS */}
                        {metrics.classPerformance && metrics.classPerformance.length > 0 ? (
                            <div>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <TrendingUp size={20} />
                                    Desempenho por Turma
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    {metrics.classPerformance.map((cls, idx) => (
                                        <div
                                            key={idx}
                                            style={{
                                                padding: '1rem',
                                                background: 'rgba(255, 255, 255, 0.05)',
                                                border: '1px solid rgba(255, 255, 255, 0.1)',
                                                borderRadius: '12px'
                                            }}
                                        >
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                                <span style={{ fontWeight: '600', fontSize: '1rem' }}>{cls.className}</span>
                                                <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                    {cls.studentCount} aluno{cls.studentCount !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div style={{ display: 'flex', gap: '2rem', fontSize: '0.875rem' }}>
                                                <div>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Atenção Média: </span>
                                                    <strong style={{ color: '#10b981' }}>
                                                        {cls.avgAttention ? `${cls.avgAttention.toFixed(1)}%` : 'N/A'}
                                                    </strong>
                                                </div>
                                                <div>
                                                    <span style={{ color: 'var(--text-secondary)' }}>Foco Médio: </span>
                                                    <strong style={{ color: '#3b82f6' }}>
                                                        {cls.avgFocus ? `${cls.avgFocus.toFixed(1)}%` : 'N/A'}
                                                    </strong>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div style={{
                                padding: '2rem',
                                textAlign: 'center',
                                background: 'rgba(255, 255, 255, 0.05)',
                                borderRadius: '12px',
                                color: 'var(--text-secondary)'
                            }}>
                                <TrendingUp size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                <p>Nenhum dado de desempenho disponível ainda.</p>
                                <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>
                                    As métricas aparecerão quando houver aulas registradas.
                                </p>
                            </div>
                        )}
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                        <p>Nenhuma métrica disponível</p>
                    </div>
                )}

                {/* BOTÃO FECHAR */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <button
                        onClick={onClose}
                        className="btn"
                        style={{
                            padding: '0.75rem 2rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.2)'
                        }}
                    >
                        Fechar
                    </button>
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

export default TeacherMetricsModal;
