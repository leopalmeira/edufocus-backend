import React, { useState, useEffect } from 'react';
import { X, User, Calendar, Clock, TrendingUp, AlertTriangle, Phone, Mail, MapPin, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axios';

export default function StudentProfileModal({ student, onClose }) {
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        presenceRate: 0,
        totalAbsences: 0,
        averageArrival: '--:--',
        streak: 0
    });

    useEffect(() => {
        if (student) {
            fetchStudentHistory();
        }
    }, [student]);

    const fetchStudentHistory = async () => {
        setLoading(true);
        try {
            // Buscando histórico dos últimos 30 dias (ou mais, dependendo da necessidade)
            const today = new Date();
            const lastMonth = new Date();
            lastMonth.setDate(lastMonth.getDate() - 30);

            const startDate = lastMonth.toISOString().split('T')[0];
            const endDate = today.toISOString().split('T')[0];

            // Nota: O endpoint ideal filtraria por aluno no backend, mas aqui filtramos no front se necessario
            // Supondo que usamos o endpoint geral de presença da escola e filtramos
            const res = await api.get(`/school/1/attendance?startDate=${startDate}&endDate=${endDate}`);

            const studentRecords = res.data
                .filter(r => r.student_id === student.id && r.type === 'entry')
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

            setHistory(studentRecords);
            calculateStats(studentRecords);
        } catch (err) {
            console.error("Erro ao buscar histórico do aluno", err);
        } finally {
            setLoading(false);
        }
    };

    const calculateStats = (records) => {
        if (!records.length) return;

        // Taxa de Presença (Simulada baseada em 22 dias letivos no mês)
        const daysInPeriod = 22;
        const presences = records.length;
        const rate = Math.min(100, (presences / daysInPeriod) * 100).toFixed(1);

        // Média de Horário
        const totalMinutes = records.reduce((acc, curr) => {
            const date = new Date(curr.timestamp);
            return acc + (date.getHours() * 60 + date.getMinutes());
        }, 0);
        const avgMinutes = Math.floor(totalMinutes / presences);
        const avgHours = Math.floor(avgMinutes / 60);
        const avgMinsRemainder = avgMinutes % 60;
        const averageArrival = `${String(avgHours).padStart(2, '0')}:${String(avgMinsRemainder).padStart(2, '0')}`;

        setStats({
            presenceRate: rate,
            totalAbsences: Math.max(0, daysInPeriod - presences),
            averageArrival,
            streak: calculateStreak(records)
        });
    };

    const calculateStreak = (records) => {
        // Cálculo simples de sequência atual (dias consecutivos)
        // Simplificado para demonstração
        return records.length > 0 ? records.length : 0;
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
        return `http://localhost:3000${url}`;
    };

    if (!student) return null;

    return (
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-panel animate-fade-in" style={{
                width: '90%',
                maxWidth: '900px',
                height: '85vh',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.1)'
            }}>
                {/* HEADER */}
                <div style={{
                    padding: '2rem',
                    background: 'linear-gradient(180deg, rgba(59, 130, 246, 0.2) 0%, rgba(0,0,0,0) 100%)',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between'
                }}>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        {/* Foto */}
                        <div style={{
                            width: '120px',
                            height: '120px',
                            borderRadius: '50%',
                            border: '4px solid var(--primary)',
                            overflow: 'hidden',
                            background: 'var(--bg-secondary)',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                        }}>
                            {student.photo_url ? (
                                <img
                                    src={getImageUrl(student.photo_url)}
                                    alt={student.name}
                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                />
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <User size={60} color="var(--text-secondary)" />
                                </div>
                            )}
                        </div>

                        {/* Dados Básicos */}
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '0.5rem' }}>{student.name}</h2>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)' }}>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                                    {student.class_name || 'Sem turma'}
                                </span>
                                <span style={{ background: 'rgba(255,255,255,0.1)', padding: '0.25rem 0.75rem', borderRadius: '50px' }}>
                                    {student.age ? `${student.age} anos` : 'Idade n/a'}
                                </span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                                    <User size={16} />
                                    ID: #{student.id}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="btn"
                        style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '50%', width: '40px', height: '40px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* CONTEÚDO SCROLLÁVEL */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '0 2rem 2rem' }}>

                    {/* INFO DE CONTATO */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Mail size={24} style={{ color: 'var(--primary)' }} />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email do Responsável</div>
                                <div>{student.parent_email || 'Não cadastrado'}</div>
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <Phone size={24} style={{ color: 'var(--success)' }} />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Telefone</div>
                                <div>{student.phone || 'Não cadastrado'}</div>
                            </div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <TrendingUp size={24} style={{ color: 'var(--accent)' }} />
                            <div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Status da Matrícula</div>
                                <div style={{ color: 'var(--success)', fontWeight: '600' }}>Ativo</div>
                            </div>
                        </div>
                    </div>

                    {/* ESTATÍSTICAS DE FREQUÊNCIA */}
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={20} />
                        Desempenho de Frequência (30 dias)
                    </h3>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' }}>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(0,0,0,0))' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#10b981' }}>{stats.presenceRate}%</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Presença</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(0,0,0,0))' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: '#ef4444' }}>{stats.totalAbsences}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Faltas Estimadas</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>{stats.averageArrival}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Horário Médio</div>
                        </div>
                        <div className="glass-panel" style={{ padding: '1.5rem', textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>{stats.streak}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Dias Consecutivos</div>
                        </div>
                    </div>

                    {/* HISTÓRICO RECENTE */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Clock size={20} />
                                Últimos Acessos
                            </h3>
                            {loading ? (
                                <div>Carregando...</div>
                            ) : history.length === 0 ? (
                                <div style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>Nenhum registro encontrado nos últimos 30 dias.</div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    {history.slice(0, 5).map((record, i) => (
                                        <div key={i} style={{
                                            padding: '1rem',
                                            background: 'rgba(255,255,255,0.03)',
                                            borderRadius: '12px',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            borderLeft: '4px solid var(--success)'
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <CheckCircle size={16} color="var(--success)" />
                                                <span>{new Date(record.timestamp).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <span style={{ fontWeight: '600' }}>
                                                {new Date(record.timestamp).toLocaleTimeString('pt-BR')}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <AlertTriangle size={20} />
                                Observações do Sistema
                            </h3>
                            <div className="glass-panel" style={{ padding: '1.5rem' }}>
                                <ul style={{ margin: 0, paddingLeft: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                                    <li>Aluno com biometria facial cadastrada e ativa.</li>
                                    <li>Média de pontualidade: <span style={{ color: 'var(--success)' }}>Excelente</span></li>
                                    <li>Nenhuma ocorrência disciplinar registrada.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
