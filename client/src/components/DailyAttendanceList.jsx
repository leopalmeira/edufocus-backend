import { useState, useEffect } from 'react';
import { Clock, Users, Calendar, Filter } from 'lucide-react';
import api from '../api/axios';

export default function DailyAttendanceList({ schoolId }) {
    const [attendanceData, setAttendanceData] = useState({}); // { className: [students] }
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({ total: 0, classes: 0 });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        fetchDailyAttendance();

        // Polling para atualizar dados em tempo real (opcional)
        const interval = setInterval(fetchDailyAttendance, 30000); // 30s
        return () => clearInterval(interval);
    }, [selectedDate]);

    const fetchDailyAttendance = async () => {
        try {
            // Reutiliza o endpoint existente (talvez precise ajustar parâmetros)
            // Assumindo que o endpoint /attendance suporta filtro por data
            const res = await api.get(`/school/${schoolId}/attendance?startDate=${selectedDate}&endDate=${selectedDate}`);

            // Filtrar apenas entradas
            const entries = res.data.filter(r => r.type === 'entry');

            // Agrupar por turma
            const grouped = entries.reduce((acc, curr) => {
                const className = curr.class_name || 'Sem Turma';
                if (!acc[className]) {
                    acc[className] = [];
                }
                acc[className].push(curr);
                return acc;
            }, {});

            setAttendanceData(grouped);
            setStats({
                total: entries.length,
                classes: Object.keys(grouped).length
            });
            setLoading(false);
        } catch (err) {
            console.error('Erro ao buscar lista de presença diária:', err);
            setLoading(false);
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        📋 Lista de Presença Diária
                    </h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                        {new Date(selectedDate).toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px' }}>
                        <Users size={16} style={{ color: 'var(--primary)' }} />
                        <span style={{ fontWeight: '600' }}>{stats.total} Presentes</span>
                    </div>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="input-field"
                        style={{ padding: '0.5rem', width: 'auto' }}
                    />
                </div>
            </div>

            {loading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    Carregando lista de presença...
                </div>
            ) : Object.keys(attendanceData).length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', border: '2px dashed var(--border)', borderRadius: '12px' }}>
                    <Calendar size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                    <p style={{ color: 'var(--text-secondary)' }}>Nenhuma presença registrada nesta data.</p>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                    {Object.entries(attendanceData).map(([className, students]) => (
                        <div key={className} style={{
                            background: 'rgba(255,255,255,0.03)',
                            borderRadius: '12px',
                            overflow: 'hidden',
                            border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                            <div style={{
                                padding: '1rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <h4 style={{ fontWeight: '600', color: 'var(--accent-primary)' }}>{className}</h4>
                                <span style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', color: 'var(--text-secondary)' }}>
                                    {students.length} alunos
                                </span>
                            </div>

                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {students.map((record, idx) => (
                                    <div key={idx} style={{
                                        padding: '0.75rem 1rem',
                                        borderBottom: '1px solid rgba(255,255,255,0.02)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.75rem',
                                        fontSize: '0.9rem'
                                    }}>
                                        <div style={{ color: 'var(--success)' }}>
                                            <Clock size={14} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontWeight: '500' }}>{record.student_name}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                                Chegou às {new Date(record.timestamp).toLocaleTimeString('pt-BR')}
                                                <span style={{ color: 'var(--success)', marginLeft: '0.5rem' }}>• Notificado</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
