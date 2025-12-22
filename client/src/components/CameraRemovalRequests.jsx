import { useState, useEffect } from 'react';
import { Camera, CheckCircle, XCircle, Clock } from 'lucide-react';
import api from '../api/axios';

export default function CameraRemovalRequests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadRequests();
    }, []);

    const loadRequests = async () => {
        try {
            setLoading(true);
            const res = await api.get('/admin/camera-removal-requests');
            setRequests(res.data);
        } catch (err) {
            console.error('Erro ao carregar solicitações:', err);
            alert('Erro ao carregar solicitações');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (requestId) => {
        if (!confirm('Confirma a aprovação desta remoção?\\nA câmera será permanentemente removida.')) {
            return;
        }

        try {
            await api.post(`/admin/camera-removal-requests/${requestId}/approve`);
            alert('✅ Câmera removida com sucesso!');
            loadRequests();
        } catch (err) {
            console.error('Erro ao aprovar:', err);
            alert(`❌ ${err.response?.data?.message || 'Erro ao aprovar remoção'}`);
        }
    };

    const handleReject = async (requestId) => {
        if (!confirm('Confirma a rejeição desta solicitação?\\nA solicitação será arquivada.')) {
            return;
        }

        try {
            await api.post(`/admin/camera-removal-requests/${requestId}/reject`);
            alert('❌ Solicitação rejeitada e arquivada');
            loadRequests();
        } catch (err) {
            console.error('Erro ao rejeitar:', err);
            alert(`❌ ${err.response?.data?.message || 'Erro ao rejeitar solicitação'}`);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '3rem' }}>
                <Clock size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
                <p style={{ color: 'var(--text-secondary)' }}>Carregando solicitações...</p>
            </div>
        );
    }

    return (
        <div className="fade-in">
            <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>
                📝 Solicitações de Remoção de Câmeras
            </h1>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {requests.map(request => (
                    <div key={request.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: '2rem' }}>
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    {request.camera_purpose === 'entrance' ? '🚪' : '📚'} {request.camera_name}
                                </h3>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                    <div><strong>Escola:</strong> {request.school_name}</div>
                                    <div><strong>Finalidade:</strong> {request.camera_purpose === 'entrance' ? 'Entrada (Reconhecimento Facial)' : 'Sala de Aula'}</div>
                                    <div><strong>Solicitante:</strong> {request.requester_type === 'technician' ? 'Técnico' : 'Escola'}</div>
                                    <div><strong>Data:</strong> {new Date(request.requested_at).toLocaleString('pt-BR')}</div>
                                    <div style={{ marginTop: '0.5rem', padding: '0.75rem', background: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius)' }}>
                                        <strong>Motivo:</strong> {request.reason}
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '150px' }}>
                                <button
                                    className="btn"
                                    style={{ background: '#10b981', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                                    onClick={() => handleApprove(request.id)}
                                >
                                    <CheckCircle size={16} /> Aprovar
                                </button>
                                <button
                                    className="btn"
                                    style={{ background: '#ef4444', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'center' }}
                                    onClick={() => handleReject(request.id)}
                                >
                                    <XCircle size={16} /> Rejeitar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {requests.length === 0 && (
                    <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                        <Camera size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem', opacity: 0.5 }} />
                        <h3 style={{ marginBottom: '0.5rem' }}>Nenhuma solicitação pendente</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>
                            Todas as solicitações de remoção foram processadas.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
