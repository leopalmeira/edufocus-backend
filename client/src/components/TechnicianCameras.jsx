import { useState, useEffect } from 'react';
import { Camera, School, DoorOpen, Plus, Edit, Trash2, CheckCircle, XCircle, AlertCircle, Eye } from 'lucide-react';
import api from '../api/axios';

export default function TechnicianCameras() {
    const [schools, setSchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState('');
    const [classrooms, setClassrooms] = useState([]);
    const [selectedClassroom, setSelectedClassroom] = useState('');
    const [cameras, setCameras] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingCamera, setEditingCamera] = useState(null);
    const [testing, setTesting] = useState(false);
    const [testResult, setTestResult] = useState(null);

    const [formData, setFormData] = useState({
        camera_name: '',
        camera_type: 'IP',
        camera_ip: '',
        camera_url: '',
        camera_port: '80',
        camera_username: '',
        camera_password: '',
        notes: ''
    });

    // Carregar escolas
    useEffect(() => {
        loadSchools();
    }, []);

    // Carregar salas quando escola selecionada
    useEffect(() => {
        if (selectedSchool) {
            loadClassrooms(selectedSchool);
            loadCameras(selectedSchool);
        }
    }, [selectedSchool]);

    const loadSchools = async () => {
        try {
            const res = await api.get('/technician/schools');
            setSchools(res.data);
        } catch (err) {
            console.error('Erro ao carregar escolas:', err);
        }
    };

    const loadClassrooms = async (schoolId) => {
        try {
            const res = await api.get(`/technician/schools/${schoolId}/classrooms`);
            setClassrooms(res.data);
        } catch (err) {
            console.error('Erro ao carregar salas:', err);
        }
    };

    const loadCameras = async (schoolId) => {
        try {
            const res = await api.get(`/technician/cameras?school_id=${schoolId}`);
            setCameras(res.data);
        } catch (err) {
            console.error('Erro ao carregar câmeras:', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const data = {
                school_id: selectedSchool,
                classroom_id: selectedClassroom,
                ...formData
            };

            if (editingCamera) {
                await api.put(`/technician/cameras/${editingCamera.id}`, data);
                alert('✅ Câmera atualizada com sucesso!');
            } else {
                await api.post('/technician/cameras', data);
                alert('✅ Câmera configurada com sucesso!');
            }

            resetForm();
            loadCameras(selectedSchool);
        } catch (err) {
            console.error('Erro ao salvar câmera:', err);
            alert('❌ Erro ao salvar câmera');
        }
    };

    const testConnection = async () => {
        setTesting(true);
        setTestResult(null);

        try {
            const res = await api.post('/technician/cameras/test', formData);
            setTestResult({ success: true, message: res.data.message });
        } catch (err) {
            setTestResult({ success: false, message: err.response?.data?.message || 'Erro ao testar conexão' });
        } finally {
            setTesting(false);
        }
    };

    const editCamera = (camera) => {
        setEditingCamera(camera);
        setFormData({
            camera_name: camera.camera_name,
            camera_type: camera.camera_type,
            camera_ip: camera.camera_ip || '',
            camera_url: camera.camera_url,
            camera_port: camera.camera_port?.toString() || '80',
            camera_username: camera.camera_username || '',
            camera_password: '',
            notes: camera.notes || ''
        });
        setSelectedClassroom(camera.classroom_id);
        setShowForm(true);
    };

    const deleteCamera = async (id) => {
        if (!confirm('Deseja realmente remover esta câmera?')) return;

        try {
            await api.delete(`/technician/cameras/${id}`);
            alert('✅ Câmera removida com sucesso!');
            loadCameras(selectedSchool);
        } catch (err) {
            console.error('Erro ao remover câmera:', err);
            alert('❌ Erro ao remover câmera');
        }
    };

    const toggleStatus = async (camera) => {
        try {
            const newStatus = camera.status === 'active' ? 'inactive' : 'active';
            await api.put(`/technician/cameras/${camera.id}`, { status: newStatus });
            loadCameras(selectedSchool);
        } catch (err) {
            console.error('Erro ao alterar status:', err);
        }
    };

    const resetForm = () => {
        setFormData({
            camera_name: '',
            camera_type: 'IP',
            camera_ip: '',
            camera_url: '',
            camera_port: '80',
            camera_username: '',
            camera_password: '',
            notes: ''
        });
        setEditingCamera(null);
        setShowForm(false);
        setTestResult(null);
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '2rem' }}>
                <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <Camera size={32} style={{ color: 'var(--accent-primary)' }} />
                    Configuração de Câmeras
                </h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Configure câmeras para monitoramento de salas de aula
                </p>
            </div>

            {/* Seleção de Escola e Sala */}
            <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            <School size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Escola
                        </label>
                        <select
                            className="form-control"
                            value={selectedSchool}
                            onChange={(e) => {
                                setSelectedSchool(e.target.value);
                                setSelectedClassroom('');
                                setShowForm(false);
                            }}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                        >
                            <option value="">Selecione uma escola</option>
                            {schools.map(school => (
                                <option key={school.id} value={school.id}>
                                    {school.name} - {school.city}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>
                            <DoorOpen size={18} style={{ display: 'inline', marginRight: '0.5rem' }} />
                            Sala de Aula
                        </label>
                        <select
                            className="form-control"
                            value={selectedClassroom}
                            onChange={(e) => setSelectedClassroom(e.target.value)}
                            disabled={!selectedSchool}
                            style={{ width: '100%', padding: '0.75rem', borderRadius: '8px' }}
                        >
                            <option value="">Selecione uma sala</option>
                            {classrooms.map(classroom => (
                                <option key={classroom.id} value={classroom.id}>
                                    {classroom.name} ({classroom.capacity} alunos)
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {selectedSchool && selectedClassroom && !showForm && (
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowForm(true)}
                        style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                    >
                        <Plus size={18} /> Nova Câmera
                    </button>
                )}
            </div>

            {/* Formulário de Câmera */}
            {showForm && (
                <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem' }}>
                        {editingCamera ? 'Editar Câmera' : 'Nova Câmera'}
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label>Nome da Câmera *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.camera_name}
                                    onChange={(e) => setFormData({ ...formData, camera_name: e.target.value })}
                                    placeholder="Ex: Câmera Sala 1A"
                                    required
                                />
                            </div>

                            <div>
                                <label>Tipo de Câmera *</label>
                                <select
                                    className="form-control"
                                    value={formData.camera_type}
                                    onChange={(e) => setFormData({ ...formData, camera_type: e.target.value })}
                                >
                                    <option value="IP">IP Camera (HTTP/HTTPS)</option>
                                    <option value="RTSP">RTSP Stream</option>
                                    <option value="USB">USB Camera</option>
                                    <option value="HTTP">HTTP MJPEG</option>
                                </select>
                            </div>

                            <div>
                                <label>IP da Câmera</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.camera_ip}
                                    onChange={(e) => setFormData({ ...formData, camera_ip: e.target.value })}
                                    placeholder="192.168.1.100"
                                />
                            </div>

                            <div>
                                <label>Porta</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    value={formData.camera_port}
                                    onChange={(e) => setFormData({ ...formData, camera_port: e.target.value })}
                                    placeholder="80"
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>URL Completa *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.camera_url}
                                    onChange={(e) => setFormData({ ...formData, camera_url: e.target.value })}
                                    placeholder="http://192.168.1.100:80/video ou rtsp://192.168.1.100:554/stream"
                                    required
                                />
                            </div>

                            <div>
                                <label>Usuário</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={formData.camera_username}
                                    onChange={(e) => setFormData({ ...formData, camera_username: e.target.value })}
                                    placeholder="admin"
                                />
                            </div>

                            <div>
                                <label>Senha</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    value={formData.camera_password}
                                    onChange={(e) => setFormData({ ...formData, camera_password: e.target.value })}
                                    placeholder="••••••"
                                />
                            </div>

                            <div style={{ gridColumn: '1 / -1' }}>
                                <label>Observações</label>
                                <textarea
                                    className="form-control"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                    rows="3"
                                    placeholder="Informações adicionais sobre a câmera..."
                                />
                            </div>
                        </div>

                        {testResult && (
                            <div style={{
                                marginTop: '1rem',
                                padding: '1rem',
                                borderRadius: '8px',
                                background: testResult.success ? 'rgba(46, 204, 113, 0.1)' : 'rgba(231, 76, 60, 0.1)',
                                border: `1px solid ${testResult.success ? 'var(--success)' : 'var(--danger)'}`,
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}>
                                {testResult.success ? <CheckCircle size={20} color="var(--success)" /> : <XCircle size={20} color="var(--danger)" />}
                                {testResult.message}
                            </div>
                        )}

                        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={testConnection}
                                disabled={testing || !formData.camera_url}
                            >
                                {testing ? 'Testando...' : 'Testar Conexão'}
                            </button>
                            <button type="submit" className="btn btn-primary">
                                {editingCamera ? 'Atualizar' : 'Salvar'}
                            </button>
                            <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Lista de Câmeras */}
            {selectedSchool && cameras.length > 0 && (
                <div>
                    <h2 style={{ marginBottom: '1rem' }}>Câmeras Configuradas</h2>
                    <div style={{ display: 'grid', gap: '1rem' }}>
                        {cameras.map(camera => (
                            <div key={camera.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <Camera size={20} />
                                            {camera.camera_name}
                                            {camera.status === 'active' ? (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>✅ Ativa</span>
                                            ) : (
                                                <span style={{ fontSize: '0.8rem', color: 'var(--danger)' }}>❌ Inativa</span>
                                            )}
                                        </h3>
                                        <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>Sala:</strong> {classrooms.find(c => c.id === camera.classroom_id)?.name || 'N/A'}
                                            </p>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>Tipo:</strong> {camera.camera_type}
                                            </p>
                                            <p style={{ margin: '0.25rem 0' }}>
                                                <strong>URL:</strong> {camera.camera_url}
                                            </p>
                                            {camera.notes && (
                                                <p style={{ margin: '0.25rem 0' }}>
                                                    <strong>Obs:</strong> {camera.notes}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            className="btn-icon"
                                            title="Editar"
                                            onClick={() => editCamera(camera)}
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            className="btn-icon"
                                            title={camera.status === 'active' ? 'Desativar' : 'Ativar'}
                                            onClick={() => toggleStatus(camera)}
                                        >
                                            {camera.status === 'active' ? <XCircle size={18} /> : <CheckCircle size={18} />}
                                        </button>
                                        <button
                                            className="btn-icon"
                                            title="Remover"
                                            onClick={() => deleteCamera(camera.id)}
                                            style={{ color: 'var(--danger)' }}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {selectedSchool && cameras.length === 0 && !showForm && (
                <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
                    <AlertCircle size={48} style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }} />
                    <h3>Nenhuma câmera configurada</h3>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Selecione uma sala e clique em "Nova Câmera" para começar.
                    </p>
                </div>
            )}
        </div>
    );
}
