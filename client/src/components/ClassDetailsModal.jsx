import React, { useState, useEffect } from 'react';
import { X, Users, GraduationCap, Calendar, TrendingUp, UserCheck, UserX, Award, BookOpen, Edit, Trash2 } from 'lucide-react';
import api from '../api/axios';

const ClassDetailsModal = ({ classData, schoolId, onClose, onUpdate }) => {
    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('students'); // students, teachers, stats

    useEffect(() => {
        loadClassDetails();
    }, [classData.id]);

    const loadClassDetails = async () => {
        try {
            setLoading(true);

            // Carregar alunos da turma
            const studentsRes = await api.get(`/school/${schoolId}/class/${classData.id}/students`);
            setStudents(studentsRes.data);

            // Carregar professores da turma
            const teachersRes = await api.get(`/school/${schoolId}/class/${classData.id}/teachers`);
            setTeachers(teachersRes.data);

            // Carregar estatísticas da turma
            const statsRes = await api.get(`/school/${schoolId}/class/${classData.id}/stats`);
            setStats(statsRes.data);

        } catch (error) {
            console.error('Erro ao carregar detalhes da turma:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClass = async () => {
        if (!confirm(`Tem certeza que deseja excluir a turma "${classData.name}"?\n\nEsta ação não pode ser desfeita!`)) {
            return;
        }

        try {
            await api.delete(`/school/${schoolId}/class/${classData.id}`);
            alert('✅ Turma excluída com sucesso!');
            onUpdate();
            onClose();
        } catch (error) {
            console.error('Erro ao excluir turma:', error);
            alert('❌ Erro ao excluir turma. Verifique se não há alunos vinculados.');
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
                maxWidth: '1000px',
                maxHeight: '90vh',
                overflow: 'auto',
                padding: '2rem',
                borderRadius: '16px'
            }}>
                {/* HEADER */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                            {classData.name}
                        </h3>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            ID: {classData.id} • {classData.grade || 'Sem série definida'}
                        </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                            onClick={handleDeleteClass}
                            className="btn"
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'rgba(239, 68, 68, 0.2)',
                                border: '1px solid rgba(239, 68, 68, 0.4)',
                                color: '#ef4444',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            <Trash2 size={16} />
                            Excluir Turma
                        </button>
                        <button
                            onClick={onClose}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                        >
                            <X size={24} />
                        </button>
                    </div>
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
                        <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Carregando...</p>
                    </div>
                ) : (
                    <>
                        {/* ESTATÍSTICAS RÁPIDAS */}
                        {stats && (
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <Users size={24} color="#3b82f6" style={{ margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                                        {stats.totalStudents || 0}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Alunos</p>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(16, 185, 129, 0.1)',
                                    border: '1px solid rgba(16, 185, 129, 0.3)',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <GraduationCap size={24} color="#10b981" style={{ margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                                        {stats.totalTeachers || 0}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Professores</p>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(245, 158, 11, 0.1)',
                                    border: '1px solid rgba(245, 158, 11, 0.3)',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <TrendingUp size={24} color="#f59e0b" style={{ margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                                        {stats.avgAttendance ? `${stats.avgAttendance.toFixed(1)}%` : 'N/A'}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Presença Média</p>
                                </div>

                                <div style={{
                                    padding: '1rem',
                                    background: 'rgba(168, 85, 247, 0.1)',
                                    border: '1px solid rgba(168, 85, 247, 0.3)',
                                    borderRadius: '12px',
                                    textAlign: 'center'
                                }}>
                                    <Award size={24} color="#a855f7" style={{ margin: '0 auto 0.5rem' }} />
                                    <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#a855f7' }}>
                                        {stats.avgPerformance ? `${stats.avgPerformance.toFixed(1)}%` : 'N/A'}
                                    </p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Desempenho</p>
                                </div>
                            </div>
                        )}

                        {/* TABS */}
                        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <button
                                onClick={() => setActiveTab('students')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === 'students' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                    color: activeTab === 'students' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Users size={18} />
                                Alunos ({students.length})
                            </button>

                            <button
                                onClick={() => setActiveTab('teachers')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === 'teachers' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                    color: activeTab === 'teachers' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <GraduationCap size={18} />
                                Professores ({teachers.length})
                            </button>

                            <button
                                onClick={() => setActiveTab('stats')}
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'none',
                                    border: 'none',
                                    borderBottom: activeTab === 'stats' ? '2px solid var(--accent-primary)' : '2px solid transparent',
                                    color: activeTab === 'stats' ? 'var(--accent-primary)' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <TrendingUp size={18} />
                                Estatísticas
                            </button>
                        </div>

                        {/* CONTEÚDO DAS TABS */}
                        <div style={{ minHeight: '300px' }}>
                            {/* TAB: ALUNOS */}
                            {activeTab === 'students' && (
                                <div>
                                    {students.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                            <Users size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                            <p>Nenhum aluno nesta turma ainda.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
                                            {students.map(student => (
                                                <div
                                                    key={student.id}
                                                    style={{
                                                        padding: '1rem',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem'
                                                    }}
                                                >
                                                    <div style={{
                                                        width: '50px',
                                                        height: '50px',
                                                        borderRadius: '50%',
                                                        background: student.photo_url
                                                            ? `url(${student.photo_url}) center/cover`
                                                            : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        color: 'white',
                                                        fontWeight: '700',
                                                        fontSize: '1.25rem',
                                                        flexShrink: 0
                                                    }}>
                                                        {!student.photo_url && student.name?.charAt(0)}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <p style={{ fontWeight: '600', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                            {student.name}
                                                        </p>
                                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                            {student.age} anos
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: PROFESSORES */}
                            {activeTab === 'teachers' && (
                                <div>
                                    {teachers.length === 0 ? (
                                        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                                            <GraduationCap size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                                            <p>Nenhum professor vinculado a esta turma.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {teachers.map(teacher => (
                                                <div
                                                    key={teacher.id}
                                                    style={{
                                                        padding: '1.5rem',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                                        borderRadius: '12px',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '1rem'
                                                    }}
                                                >
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
                                                        fontWeight: '700',
                                                        flexShrink: 0
                                                    }}>
                                                        {teacher.name?.charAt(0)}
                                                    </div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: '600', fontSize: '1.125rem', marginBottom: '0.25rem' }}>
                                                            {teacher.name}
                                                        </p>
                                                        <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                            {teacher.email}
                                                        </p>
                                                        {teacher.subject && (
                                                            <p style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
                                                                📚 {teacher.subject}
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* TAB: ESTATÍSTICAS */}
                            {activeTab === 'stats' && stats && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                    <div style={{
                                        padding: '1.5rem',
                                        background: 'rgba(59, 130, 246, 0.1)',
                                        border: '1px solid rgba(59, 130, 246, 0.3)',
                                        borderRadius: '12px'
                                    }}>
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <BookOpen size={20} />
                                            Informações Gerais
                                        </h4>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)' }}>Total de Alunos:</span>
                                                <strong style={{ marginLeft: '0.5rem' }}>{stats.totalStudents || 0}</strong>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)' }}>Total de Professores:</span>
                                                <strong style={{ marginLeft: '0.5rem' }}>{stats.totalTeachers || 0}</strong>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)' }}>Presença Média:</span>
                                                <strong style={{ marginLeft: '0.5rem', color: '#10b981' }}>
                                                    {stats.avgAttendance ? `${stats.avgAttendance.toFixed(1)}%` : 'N/A'}
                                                </strong>
                                            </div>
                                            <div>
                                                <span style={{ color: 'var(--text-secondary)' }}>Desempenho Médio:</span>
                                                <strong style={{ marginLeft: '0.5rem', color: '#a855f7' }}>
                                                    {stats.avgPerformance ? `${stats.avgPerformance.toFixed(1)}%` : 'N/A'}
                                                </strong>
                                            </div>
                                        </div>
                                    </div>

                                    {stats.recentActivity && stats.recentActivity.length > 0 && (
                                        <div style={{
                                            padding: '1.5rem',
                                            background: 'rgba(16, 185, 129, 0.1)',
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            borderRadius: '12px'
                                        }}>
                                            <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Calendar size={20} />
                                                Atividade Recente
                                            </h4>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                                {stats.recentActivity.map((activity, idx) => (
                                                    <div key={idx} style={{ fontSize: '0.875rem', paddingLeft: '1rem', borderLeft: '2px solid rgba(16, 185, 129, 0.5)' }}>
                                                        {activity}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </>
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

export default ClassDetailsModal;
