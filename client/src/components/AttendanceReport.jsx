import { useState, useEffect } from 'react';
import {
    Calendar, Users, TrendingUp, Clock, Download, CheckCircle,
    XCircle, AlertCircle, Search, ChevronDown, ChevronUp, Phone
} from 'lucide-react';
import api from '../api/axios';

export default function AttendanceReport({ schoolId }) {
    const [students, setStudents] = useState([]);
    const [attendanceData, setAttendanceData] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedStudent, setExpandedStudent] = useState(null);
    const [loading, setLoading] = useState(false);

    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    useEffect(() => {
        loadStudents();
        loadAttendanceData();
    }, [selectedMonth, selectedYear]);

    const loadStudents = async () => {
        try {
            const res = await api.get('/school/students');
            setStudents(res.data);
        } catch (err) {
            console.error('Erro ao carregar alunos:', err);
        }
    };

    const loadAttendanceData = async () => {
        setLoading(true);
        try {
            const startDate = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
            const endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];

            console.log('🔄 Carregando presença:', { startDate, endDate });

            const res = await api.get(`/school/attendance?startDate=${startDate}&endDate=${endDate}`);
            const data = res.data || [];

            // DEBUG: Log para ver os dados recebidos
            console.log('📊 DEBUG attendanceData loaded:', {
                startDate,
                endDate,
                totalRecords: data.length,
                records: data,
                sampleRecord: data[0]
            });

            setAttendanceData(data);
        } catch (err) {
            console.error('❌ Erro ao carregar presença:', err);
            console.error('Detalhes:', err.response?.data);
            setAttendanceData([]);
        } finally {
            setLoading(false);
        }
    };

    const getStudentAttendance = (studentId) => {
        return attendanceData.filter(a =>
            a.student_id === studentId &&
            (a.type === 'entry' || a.type === 'arrival')
        );
    };

    const getDaysInMonth = () => {
        return new Date(selectedYear, selectedMonth + 1, 0).getDate();
    };

    const getAttendanceForDay = (studentId, day) => {
        // Data alvo do calendário
        const targetDate = new Date(selectedYear, selectedMonth, day);

        const found = attendanceData.find(a => {
            // Timestamp do banco (UTC) convertido para objeto Date (Local)
            const attendanceDate = new Date(a.timestamp);

            // Comparar ano, mês e dia locais
            const matches = a.student_id === studentId &&
                attendanceDate.getDate() === day &&
                attendanceDate.getMonth() === selectedMonth &&
                attendanceDate.getFullYear() === selectedYear;

            return matches;
        });

        return found;
    };

    const calculateStudentStats = (studentId) => {
        const studentAttendance = getStudentAttendance(studentId);
        const daysInMonth = getDaysInMonth();
        const presences = studentAttendance.length;
        const absences = daysInMonth - presences;
        const rate = daysInMonth > 0 ? ((presences / daysInMonth) * 100).toFixed(1) : 0;

        // Calcular horário médio de chegada
        let avgTime = '--:--';
        if (presences > 0) {
            const totalMinutes = studentAttendance.reduce((acc, a) => {
                const date = new Date(a.timestamp);
                return acc + (date.getHours() * 60 + date.getMinutes());
            }, 0);
            const avgMinutes = Math.floor(totalMinutes / presences);
            const hours = Math.floor(avgMinutes / 60);
            const mins = avgMinutes % 60;
            avgTime = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
        }

        return { presences, absences, rate, avgTime };
    };

    const filteredStudents = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.class_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleStudent = (studentId) => {
        setExpandedStudent(expandedStudent === studentId ? null : studentId);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <Calendar size={32} style={{ color: 'var(--primary)' }} />
                        <div>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                                📊 Relatório de Frequência
                            </h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Busque e visualize a presença individual dos alunos
                            </p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <select
                            className="input-field"
                            value={selectedMonth}
                            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                            style={{ padding: '0.75rem', minWidth: '150px' }}
                        >
                            {months.map((month, index) => (
                                <option key={index} value={index}>{month}</option>
                            ))}
                        </select>

                        <select
                            className="input-field"
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                            style={{ padding: '0.75rem', minWidth: '120px' }}
                        >
                            {[2024, 2025, 2026].map(year => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                <div style={{ position: 'relative' }}>
                    <Search
                        size={20}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: 'var(--text-secondary)'
                        }}
                    />
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Buscar aluno por nome ou turma..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '1rem 1rem 1rem 3rem',
                            fontSize: '1rem'
                        }}
                    />
                </div>
                <p style={{
                    marginTop: '0.75rem',
                    fontSize: '0.875rem',
                    color: 'var(--text-secondary)'
                }}>
                    {filteredStudents.length} aluno(s) encontrado(s)
                </p>
            </div>

            {/* Students List */}
            {loading ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <div className="loading-spinner" style={{ margin: '0 auto 1rem' }}></div>
                    <p style={{ color: 'var(--text-secondary)' }}>Carregando dados...</p>
                </div>
            ) : filteredStudents.length === 0 ? (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <Users size={64} style={{ margin: '0 auto 1rem', opacity: 0.5, color: 'var(--text-secondary)' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>
                        {searchTerm ? 'Nenhum aluno encontrado com esse nome' : 'Nenhum aluno cadastrado'}
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {filteredStudents.map(student => {
                        const stats = calculateStudentStats(student.id);
                        const isExpanded = expandedStudent === student.id;
                        const studentAttendance = getStudentAttendance(student.id);

                        return (
                            <div key={student.id} className="glass-panel" style={{ overflow: 'hidden' }}>
                                {/* Student Header - Clickable */}
                                <div
                                    onClick={() => toggleStudent(student.id)}
                                    style={{
                                        padding: '1.5rem',
                                        cursor: 'pointer',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        transition: 'background 0.2s',
                                        background: isExpanded ? 'rgba(255,255,255,0.05)' : 'transparent'
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flex: 1 }}>
                                        {/* Avatar */}
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            borderRadius: '50%',
                                            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'white',
                                            fontSize: '1.5rem',
                                            fontWeight: '700'
                                        }}>
                                            {student.name.charAt(0)}
                                        </div>

                                        {/* Student Info */}
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.25rem' }}>
                                                {student.name}
                                            </h3>
                                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                                {student.class_name || 'Sem turma'} • {student.phone || 'Sem telefone'}
                                            </p>
                                        </div>

                                        {/* Quick Stats */}
                                        <div style={{ display: 'flex', gap: '2rem', marginRight: '1rem' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10b981' }}>
                                                    {stats.presences}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Presenças
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                                                    {stats.absences}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Faltas
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: '700',
                                                    color: stats.rate >= 75 ? '#10b981' : stats.rate >= 50 ? '#f59e0b' : '#ef4444'
                                                }}>
                                                    {stats.rate}%
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Frequência
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expand Icon */}
                                    {isExpanded ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                                </div>

                                {/* Expanded Content */}
                                {isExpanded && (
                                    <div style={{
                                        padding: '0 1.5rem 1.5rem 1.5rem',
                                        borderTop: '1px solid rgba(255,255,255,0.1)',
                                        animation: 'slideDown 0.3s ease-out'
                                    }}>
                                        {/* Additional Stats */}
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                                            gap: '1rem',
                                            marginTop: '1.5rem',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <div style={{
                                                padding: '1rem',
                                                background: 'rgba(139, 92, 246, 0.1)',
                                                borderRadius: '8px',
                                                textAlign: 'center'
                                            }}>
                                                <Clock size={24} style={{ color: '#8b5cf6', margin: '0 auto 0.5rem' }} />
                                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#8b5cf6' }}>
                                                    {stats.avgTime}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Horário Médio
                                                </div>
                                            </div>

                                            <div style={{
                                                padding: '1rem',
                                                background: 'rgba(59, 130, 246, 0.1)',
                                                borderRadius: '8px',
                                                textAlign: 'center'
                                            }}>
                                                <TrendingUp size={24} style={{ color: '#3b82f6', margin: '0 auto 0.5rem' }} />
                                                <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#3b82f6' }}>
                                                    {studentAttendance.length > 0 ? 'Ativo' : 'Inativo'}
                                                </div>
                                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                    Status
                                                </div>
                                            </div>
                                        </div>

                                        {/* Monthly Calendar */}
                                        <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                                            📅 Cronograma de {months[selectedMonth]}
                                        </h4>
                                        <div style={{
                                            display: 'grid',
                                            gridTemplateColumns: 'repeat(7, 1fr)',
                                            gap: '0.5rem',
                                            marginBottom: '1.5rem'
                                        }}>
                                            {['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((day, i) => (
                                                <div key={i} style={{
                                                    textAlign: 'center',
                                                    fontSize: '0.75rem',
                                                    fontWeight: '600',
                                                    color: 'var(--text-secondary)',
                                                    padding: '0.5rem'
                                                }}>
                                                    {day}
                                                </div>
                                            ))}

                                            {/* Empty cells for first week */}
                                            {Array.from({ length: new Date(selectedYear, selectedMonth, 1).getDay() }).map((_, i) => (
                                                <div key={`empty-${i}`} />
                                            ))}

                                            {/* Days of month */}
                                            {Array.from({ length: getDaysInMonth() }, (_, i) => i + 1).map(day => {
                                                const attendance = getAttendanceForDay(student.id, day);
                                                const dayOfWeek = new Date(selectedYear, selectedMonth, day).getDay();
                                                const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
                                                const isToday = day === new Date().getDate() &&
                                                    selectedMonth === new Date().getMonth() &&
                                                    selectedYear === new Date().getFullYear();

                                                return (
                                                    <div
                                                        key={day}
                                                        style={{
                                                            padding: '0.75rem',
                                                            borderRadius: '8px',
                                                            textAlign: 'center',
                                                            fontSize: '0.875rem',
                                                            fontWeight: '600',
                                                            background: isWeekend
                                                                ? 'rgba(255,255,255,0.02)'
                                                                : attendance
                                                                    ? 'rgba(16, 185, 129, 0.2)'
                                                                    : 'rgba(239, 68, 68, 0.1)',
                                                            border: isToday ? '2px solid var(--primary)' : 'none',
                                                            color: isWeekend
                                                                ? 'var(--text-secondary)'
                                                                : attendance
                                                                    ? '#10b981'
                                                                    : '#ef4444',
                                                            cursor: attendance ? 'pointer' : 'default'
                                                        }}
                                                        title={attendance ? `Chegou às ${new Date(attendance.timestamp).toLocaleTimeString('pt-BR')}` : isWeekend ? 'Fim de semana' : 'Falta'}
                                                    >
                                                        {day}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Recent Arrivals */}
                                        {studentAttendance.length > 0 && (
                                            <>
                                                <h4 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                                                    🕐 Últimas Chegadas
                                                </h4>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                                    {studentAttendance.slice(0, 5).map((entry, idx) => {
                                                        const date = new Date(entry.timestamp);
                                                        return (
                                                            <div
                                                                key={idx}
                                                                style={{
                                                                    padding: '0.75rem 1rem',
                                                                    background: 'rgba(16, 185, 129, 0.1)',
                                                                    borderRadius: '8px',
                                                                    display: 'flex',
                                                                    justifyContent: 'space-between',
                                                                    alignItems: 'center'
                                                                }}
                                                            >
                                                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                                    <CheckCircle size={16} style={{ color: '#10b981' }} />
                                                                    <span style={{ fontSize: '0.9rem' }}>
                                                                        {date.toLocaleDateString('pt-BR')}
                                                                    </span>
                                                                </div>
                                                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#10b981' }}>
                                                                    {date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}

            <style>{`
                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.1);
                    border-top: 4px solid var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                @keyframes slideDown {
                    from {
                        opacity: 0;
                        transform: translateY(-10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
