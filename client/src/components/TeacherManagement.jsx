import React, { useState, useEffect } from 'react';
import { Users, Mail, BarChart3, BookOpen, MessageSquare, Plus, X, Send, TrendingUp, Award, Clock, CheckCircle } from 'lucide-react';
import api from '../services/api';

const TeacherManagement = ({ schoolId }) => {
    const [teachers, setTeachers] = useState([]);
    const [classes, setClasses] = useState([]);
    const [selectedTeacher, setSelectedTeacher] = useState(null);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState(false);
    const [showMetricsModal, setShowMetricsModal] = useState(false);
    const [messageText, setMessageText] = useState('');
    const [selectedClass, setSelectedClass] = useState('');
    const [teacherMetrics, setTeacherMetrics] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loadTeachers();
        loadClasses();
    }, [schoolId]);

    const loadTeachers = async () => {
        try {
            const res = await api.get(`/school/${schoolId}/teachers`);
            setTeachers(res.data);
        } catch (error) {
            console.error('Erro ao carregar professores:', error);
        }
    };

    const loadClasses = async () => {
        try {
            const res = await api.get(`/school/${schoolId}/classes`);
            setClasses(res.data);
        } catch (error) {
            console.error('Erro ao carregar turmas:', error);
        }
    };

    const loadTeacherMetrics = async (teacherId) => {
        try {
            setLoading(true);
            const res = await api.get(`/school/${schoolId}/teacher/${teacherId}/metrics`);
            setTeacherMetrics(res.data);
        } catch (error) {
            console.error('Erro ao carregar métricas:', error);
            alert('Erro ao carregar métricas do professor');
        } finally {
            setLoading(false);
        }
    };

    const linkTeacherToClass = async () => {
        if (!selectedClass) {
            alert('Selecione uma turma');
            return;
        }

        try {
            await api.post(`/school/${schoolId}/teacher/${selectedTeacher.id}/link-class`, {
                class_id: selectedClass
            });
            alert('Professor vinculado à turma com sucesso!');
            setShowLinkModal(false);
            setSelectedClass('');
            loadTeachers();
        } catch (error) {
            console.error('Erro ao vincular professor:', error);
            alert('Erro ao vincular professor à turma');
        }
    };

    const sendMessage = async () => {
        if (!messageText.trim()) {
            alert('Digite uma mensagem');
            return;
        }

        try {
            await api.post(`/messages/send`, {
                from_user_type: 'school_admin',
                from_user_id: schoolId,
                to_user_type: 'teacher',
                to_user_id: selectedTeacher.id,
                message: messageText
            });
            alert('Mensagem enviada com sucesso!');
            setMessageText('');
            setShowMessageModal(false);
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
            alert('Erro ao enviar mensagem');
        }
    };

    const openMetrics = (teacher) => {
        setSelectedTeacher(teacher);
        loadTeacherMetrics(teacher.id);
        setShowMetricsModal(true);
    };

    return (
        <div style={{ padding: '2rem' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                    Gerenciamento de Professores
                </h2>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Vincule professores às turmas, envie mensagens e acompanhe métricas de ensino
                </p>
            </div>

            {/* LISTA DE PROFESSORES */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                {teachers.map(teacher => (
                    <div
                        key={teacher.id}
                        className="glass-panel"
                        style={{
                            padding: '1.5rem',
                            borderRadius: '16px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {/* HEADER */}
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
                                marginBottom: '1rem'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <BookOpen size={16} />
                                    <span style={{ fontSize: '0.875rem' }}>{teacher.subject}</span>
                                </div>
                            </div>
                        )}

                        {/* TURMAS VINCULADAS */}
                        {teacher.classes && teacher.classes.length > 0 && (
                            <div style={{ marginBottom: '1rem' }}>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                    Turmas:
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                    {teacher.classes.map((cls, idx) => (
                                        <span
                                            key={idx}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                background: 'rgba(16, 185, 129, 0.1)',
                                                border: '1px solid rgba(16, 185, 129, 0.3)',
                                                borderRadius: '12px',
                                                fontSize: '0.75rem'
                                            }}
                                        >
                                            {cls}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* AÇÕES */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                            <button
                                onClick={() => {
                                    setSelectedTeacher(teacher);
                                    setShowLinkModal(true);
                                }}
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
                                title="Vincular à Turma"
                            >
                                <Plus size={14} />
                                Turma
                            </button>

                            <button
                                onClick={() => {
                                    setSelectedTeacher(teacher);
                                    setShowMessageModal(true);
                                }}
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
                                title="Enviar Mensagem"
                            >
                                <MessageSquare size={14} />
                                Msg
                            </button>

                            <button
                                onClick={() => openMetrics(teacher)}
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
                                title="Ver Métricas"
                            >
                                <BarChart3 size={14} />
                                Métricas
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* MODAL: VINCULAR À TURMA */}
            {showLinkModal && (
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
                        maxWidth: '500px',
                        padding: '2rem',
                        borderRadius: '16px'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                                Vincular à Turma
                            </h3>
                            <button
                                onClick={() => setShowLinkModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            Professor: <strong>{selectedTeacher?.name}</strong>
                        </p>

                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                            Selecione a Turma:
                        </label>
                        <select
                            value={selectedClass}
                            onChange={(e) => setSelectedClass(e.target.value)}
                            className="input-field"
                            style={{ width: '100%', marginBottom: '1.5rem' }}
                        >
                            <option value="">Selecione...</option>
                            {classes.map(cls => (
                                <option key={cls.id} value={cls.id}>
                                    {cls.name} - {cls.grade}
                                </option>
                            ))}
                        </select>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowLinkModal(false)}
                                className="btn"
                                style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={linkTeacherToClass}
                                className="btn"
                                style={{ flex: 1, background: 'var(--accent-primary)' }}
                            >
                                Vincular
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: ENVIAR MENSAGEM */}
            {showMessageModal && (
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
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <MessageSquare size={24} />
                                Enviar Mensagem
                            </h3>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        <p style={{ marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            Para: <strong>{selectedTeacher?.name}</strong> ({selectedTeacher?.email})
                        </p>

                        <textarea
                            value={messageText}
                            onChange={(e) => setMessageText(e.target.value)}
                            placeholder="Digite sua mensagem..."
                            className="input-field"
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                resize: 'vertical',
                                marginBottom: '1.5rem'
                            }}
                        />

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <button
                                onClick={() => setShowMessageModal(false)}
                                className="btn"
                                style={{ flex: 1, background: 'rgba(255, 255, 255, 0.1)' }}
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={sendMessage}
                                className="btn"
                                style={{
                                    flex: 1,
                                    background: '#10b981',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem'
                                }}
                            >
                                <Send size={18} />
                                Enviar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: MÉTRICAS DO PROFESSOR */}
            {showMetricsModal && (
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
                    overflow: 'auto',
                    padding: '2rem'
                }}>
                    <div className="glass-panel" style={{
                        width: '90%',
                        maxWidth: '900px',
                        padding: '2rem',
                        borderRadius: '16px',
                        maxHeight: '90vh',
                        overflow: 'auto'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <BarChart3 size={28} />
                                Métricas de Ensino
                            </h3>
                            <button
                                onClick={() => setShowMetricsModal(false)}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {loading ? (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <p>Carregando métricas...</p>
                            </div>
                        ) : teacherMetrics ? (
                            <>
                                {/* PROFESSOR INFO */}
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.3)',
                                    borderRadius: '12px',
                                    marginBottom: '2rem'
                                }}>
                                    <h4 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                                        {selectedTeacher?.name}
                                    </h4>
                                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                                        {selectedTeacher?.email}
                                    </p>
                                    {selectedTeacher?.subject && (
                                        <p style={{ fontSize: '0.875rem' }}>
                                            Matéria: <strong>{selectedTeacher.subject}</strong>
                                        </p>
                                    )}
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
                                        <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                                            {teacherMetrics.totalClasses || 0}
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
                                        <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                                            {teacherMetrics.totalStudents || 0}
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
                                        <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                                            {teacherMetrics.totalSessions || 0}
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
                                        <p style={{ fontSize: '2rem', fontWeight: '700' }}>
                                            {teacherMetrics.totalQuestions || 0}
                                        </p>
                                    </div>
                                </div>

                                {/* DESEMPENHO DAS TURMAS */}
                                {teacherMetrics.classPerformance && teacherMetrics.classPerformance.length > 0 && (
                                    <div>
                                        <h4 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>
                                            Desempenho por Turma
                                        </h4>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {teacherMetrics.classPerformance.map((cls, idx) => (
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
                                                        <span style={{ fontWeight: '600' }}>{cls.className}</span>
                                                        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                                            {cls.studentCount} alunos
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '1rem', fontSize: '0.875rem' }}>
                                                        <span>
                                                            Atenção Média: <strong style={{ color: '#10b981' }}>{cls.avgAttention?.toFixed(1) || 'N/A'}%</strong>
                                                        </span>
                                                        <span>
                                                            Foco: <strong style={{ color: '#3b82f6' }}>{cls.avgFocus?.toFixed(1) || 'N/A'}%</strong>
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : (
                            <div style={{ textAlign: 'center', padding: '3rem' }}>
                                <p>Nenhuma métrica disponível</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default TeacherManagement;
