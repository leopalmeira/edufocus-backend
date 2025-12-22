import { useState, useEffect } from 'react';
import { BookOpen, Plus, Edit, Trash2, Users, X, GraduationCap } from 'lucide-react';
import api from '../api/axios';
import ClassDetailsModal from './ClassDetailsModal';

export default function ClassesPanel({ schoolId }) {
    const [classes, setClasses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingClass, setEditingClass] = useState(null);
    const [selectedClass, setSelectedClass] = useState(null);
    const [formData, setFormData] = useState({ name: '', grade: '' });

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            setLoading(true);
            console.log('🔄 Carregando turmas...');
            const res = await api.get('/school/classes');
            const classesData = res.data;
            console.log('📚 Turmas carregadas:', classesData);

            // Buscar alunos para cada turma
            const classesWithStudents = await Promise.all(
                classesData.map(async (classItem) => {
                    try {
                        console.log(`🔍 Buscando alunos da turma ${classItem.id} (${classItem.name})...`);
                        const studentsRes = await api.get(`/school/class/${classItem.id}/students`);
                        console.log(`👥 Alunos encontrados para ${classItem.name}:`, studentsRes.data);
                        return {
                            ...classItem,
                            students: studentsRes.data || []
                        };
                    } catch (error) {
                        console.error(`❌ Erro ao carregar alunos da turma ${classItem.id}:`, error);
                        return {
                            ...classItem,
                            students: []
                        };
                    }
                })
            );

            console.log('✅ Turmas com alunos:', classesWithStudents);
            setClasses(classesWithStudents);
        } catch (error) {
            console.error('❌ Erro ao carregar turmas:', error);
            alert('Erro ao carregar turmas');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.name.trim()) {
            alert('Nome da turma é obrigatório');
            return;
        }

        try {
            if (editingClass) {
                await api.put(`/school/classes/${editingClass.id}`, formData);
                alert('✅ Turma atualizada com sucesso!');
            } else {
                console.log('📝 Criando turma:', formData);
                const response = await api.post('/school/classes', formData);
                console.log('✅ Resposta:', response.data);
                alert('✅ Turma criada com sucesso!');
            }

            setFormData({ name: '', grade: '' });
            setShowForm(false);
            setEditingClass(null);
            loadClasses();
        } catch (error) {
            console.error('❌ Erro ao salvar turma:', error);
            console.error('Detalhes:', error.response?.data);
            alert(error.response?.data?.error || error.message || 'Erro ao salvar turma');
        }
    };

    const handleEdit = (classItem) => {
        setEditingClass(classItem);
        setFormData({ name: classItem.name, grade: classItem.grade || '' });
        setShowForm(true);
    };

    const handleDelete = async (classItem) => {
        const studentCount = classItem.student_count || 0;
        let confirmMessage = `Tem certeza que deseja excluir a turma "${classItem.name}"?`;

        if (studentCount > 0) {
            confirmMessage += `\n\n⚠️ ATENÇÃO: Esta turma possui ${studentCount} aluno(s) cadastrado(s).\nTodos os alunos também serão EXCLUÍDOS permanentemente!`;
        }

        confirmMessage += '\n\nEsta ação não pode ser desfeita!';

        if (!confirm(confirmMessage)) {
            return;
        }

        try {
            console.log('🗑️ Frontend: Deletando turma ID:', classItem.id);
            const response = await api.delete(`/school/classes/${classItem.id}`);

            if (response.data.studentsDeleted > 0) {
                alert(`✅ Turma deletada com sucesso!\n${response.data.studentsDeleted} aluno(s) também foram removidos.`);
            } else {
                alert('✅ Turma deletada com sucesso!');
            }

            loadClasses();
        } catch (error) {
            console.error('❌ Erro ao deletar turma:', error);
            console.error('Detalhes do erro:', error.response?.data);
            const errorMsg = error.response?.data?.error || 'Erro ao deletar turma';
            alert(`❌ ${errorMsg}`);
        }
    };

    const handleCardClick = (classItem) => {
        setSelectedClass(classItem);
    };

    const handleCloseForm = () => {
        setShowForm(false);
        setEditingClass(null);
        setFormData({ name: '', grade: '' });
    };

    if (loading) {
        return (
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
                <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Carregando turmas...</p>
            </div>
        );
    }

    return (
        <div>
            {/* HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.75rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                        Gerenciar Turmas
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        Crie e organize as turmas da sua escola
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="btn"
                    style={{
                        background: 'var(--accent-primary)',
                        color: '#fff',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}
                >
                    <Plus size={20} />
                    Nova Turma
                </button>
            </div>

            {/* FORMULÁRIO */}
            {showForm && (
                <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', borderRadius: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>
                            {editingClass ? 'Editar Turma' : 'Nova Turma'}
                        </h3>
                        <button
                            onClick={handleCloseForm}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)' }}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                                Nome da Turma *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="Ex: Turma 601A, 1º Ano A, 5ª Série B..."
                                required
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(255,255,255,0.05)',
                                    color: '#fff',
                                    fontSize: '1rem'
                                }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={handleCloseForm}
                                className="btn"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'rgba(255,255,255,0.1)',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                className="btn"
                                style={{
                                    padding: '0.75rem 1.5rem',
                                    background: 'var(--accent-primary)',
                                    color: '#fff',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '600',
                                    cursor: 'pointer'
                                }}
                            >
                                {editingClass ? 'Salvar Alterações' : 'Criar Turma'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* GRID DE TURMAS */}
            {classes.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
                    <GraduationCap size={64} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--text-secondary)' }} />
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Nenhuma turma cadastrada</h3>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                        Comece criando sua primeira turma
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="btn"
                        style={{
                            background: 'var(--accent-primary)',
                            color: '#fff',
                            border: 'none',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer'
                        }}
                    >
                        <Plus size={20} style={{ marginRight: '0.5rem', verticalAlign: 'middle' }} />
                        Criar Primeira Turma
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {classes.map((classItem) => (
                        <div
                            key={classItem.id}
                            className="glass-panel class-card"
                            onClick={() => handleCardClick(classItem)}
                            style={{
                                padding: '1.5rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                        >
                            {/* Ícone de fundo decorativo */}
                            <div style={{
                                position: 'absolute',
                                top: '-20px',
                                right: '-20px',
                                opacity: 0.1,
                                transform: 'rotate(-15deg)'
                            }}>
                                <BookOpen size={120} />
                            </div>

                            {/* Conteúdo */}
                            <div style={{ position: 'relative', zIndex: 1 }}>
                                <div style={{
                                    width: '60px',
                                    height: '60px',
                                    borderRadius: '12px',
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    marginBottom: '1rem'
                                }}>
                                    <BookOpen size={32} color="#fff" />
                                </div>

                                <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                                    {classItem.name}
                                </h3>

                                {classItem.grade && (
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem' }}>
                                        {classItem.grade}
                                    </p>
                                )}

                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem',
                                    padding: '0.75rem',
                                    background: 'rgba(59, 130, 246, 0.1)',
                                    border: '1px solid rgba(59, 130, 246, 0.3)',
                                    borderRadius: '8px',
                                    marginBottom: '1rem'
                                }}>
                                    <Users size={18} color="#3b82f6" />
                                    <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#3b82f6' }}>
                                        {classItem.student_count || 0} {classItem.student_count === 1 ? 'aluno' : 'alunos'}
                                    </span>
                                </div>

                                {/* Lista de Alunos */}
                                {classItem.students && classItem.students.length > 0 && (
                                    <div style={{
                                        marginBottom: '1rem',
                                        maxHeight: '200px',
                                        overflowY: 'auto',
                                        padding: '0.5rem',
                                        background: 'rgba(0, 0, 0, 0.2)',
                                        borderRadius: '8px'
                                    }}>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: '600' }}>
                                            Alunos cadastrados:
                                        </p>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                            {classItem.students.slice(0, 5).map((student) => (
                                                <div
                                                    key={student.id}
                                                    style={{
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        padding: '0.5rem',
                                                        background: 'rgba(255, 255, 255, 0.05)',
                                                        borderRadius: '6px',
                                                        fontSize: '0.75rem'
                                                    }}
                                                >
                                                    {student.photo_url ? (
                                                        <img
                                                            src={student.photo_url}
                                                            alt={student.name}
                                                            style={{
                                                                width: '24px',
                                                                height: '24px',
                                                                borderRadius: '50%',
                                                                objectFit: 'cover',
                                                                border: '1px solid rgba(255,255,255,0.2)'
                                                            }}
                                                        />
                                                    ) : (
                                                        <div style={{
                                                            width: '24px',
                                                            height: '24px',
                                                            borderRadius: '50%',
                                                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                                            display: 'flex',
                                                            alignItems: 'center',
                                                            justifyContent: 'center',
                                                            fontSize: '0.625rem',
                                                            fontWeight: '700',
                                                            color: '#fff'
                                                        }}>
                                                            {student.name?.charAt(0)}
                                                        </div>
                                                    )}
                                                    <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {student.name}
                                                    </span>
                                                </div>
                                            ))}
                                            {classItem.students.length > 5 && (
                                                <div style={{
                                                    textAlign: 'center',
                                                    fontSize: '0.75rem',
                                                    color: 'var(--text-secondary)',
                                                    padding: '0.25rem'
                                                }}>
                                                    +{classItem.students.length - 5} mais...
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {classItem.student_count === 0 && (
                                    <div style={{
                                        padding: '1rem',
                                        textAlign: 'center',
                                        fontSize: '0.75rem',
                                        color: 'var(--text-secondary)',
                                        background: 'rgba(255, 255, 255, 0.03)',
                                        borderRadius: '8px',
                                        marginBottom: '1rem'
                                    }}>
                                        Nenhum aluno cadastrado
                                    </div>
                                )}

                                {/* Botões de ação */}
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleEdit(classItem);
                                        }}
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            background: 'rgba(59, 130, 246, 0.2)',
                                            border: '1px solid rgba(59, 130, 246, 0.4)',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            color: '#3b82f6',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <Edit size={16} />
                                        Editar
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(classItem);
                                        }}
                                        className="btn"
                                        style={{
                                            flex: 1,
                                            padding: '0.5rem',
                                            background: 'rgba(239, 68, 68, 0.2)',
                                            border: '1px solid rgba(239, 68, 68, 0.4)',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            gap: '0.5rem',
                                            color: '#ef4444',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        <Trash2 size={16} />
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL DE DETALHES */}
            {selectedClass && (
                <ClassDetailsModal
                    classData={selectedClass}
                    schoolId={schoolId}
                    onClose={() => setSelectedClass(null)}
                    onUpdate={loadClasses}
                />
            )}

            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .class-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
                }

                .btn:hover {
                    opacity: 0.9;
                }
            `}</style>
        </div>
    );
}
