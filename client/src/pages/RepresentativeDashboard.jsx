import { useState, useEffect } from 'react';
import { Map, Building2, DollarSign, GraduationCap, TrendingUp, Menu } from 'lucide-react';
import Sidebar from '../components/Sidebar';
import RepresentativeTraining from '../components/RepresentativeTraining';
import api from '../api/axios';

export default function RepresentativeDashboard() {
    const [activeTab, setActiveTab] = useState('map');
    const [schools, setSchools] = useState([]);
    const [mySchools, setMySchools] = useState([]);
    const [selectedSchool, setSelectedSchool] = useState(null);
    const [visitForm, setVisitForm] = useState({
        status: '',
        notes: '',
        nextSteps: ''
    });
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [expandedMenus, setExpandedMenus] = useState({});

    const toggleMenu = (menuId) => {
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    useEffect(() => {
        document.body.classList.add('force-landscape');
        return () => document.body.classList.remove('force-landscape');
    }, []);

    const menuItems = [
        { id: 'map', label: 'Mapa de Escolas', icon: <Map size={20} /> },
        { id: 'myschools', label: 'Minhas Escolas', icon: <Building2 size={20} /> },
        { id: 'billing', label: 'Faturamento', icon: <DollarSign size={20} /> },
        { id: 'training', label: 'Treinamento', icon: <GraduationCap size={20} /> }
    ];

    const mockSchoolsMap = [
        { id: 1, name: 'Escola Municipal Centro', city: 'São Paulo', state: 'SP', visited: false },
        { id: 2, name: 'Colégio Estadual Norte', city: 'Rio de Janeiro', state: 'RJ', visited: false },
        { id: 3, name: 'Escola Técnica Sul', city: 'Belo Horizonte', state: 'MG', visited: true },
        { id: 4, name: 'Instituto Educacional Leste', city: 'Curitiba', state: 'PR', visited: false }
    ];

    const mockMySchools = [
        { id: 1, name: 'Escola Técnica Sul', students: 450, growth: 12 },
        { id: 2, name: 'Colégio Integrado', students: 320, growth: -5 }
    ];

    const handleMarkVisit = (school) => {
        setSelectedSchool(school);
    };

    const handleSaveVisit = () => {
        alert(`Visita registrada para ${selectedSchool.name}!\nStatus: ${visitForm.status}\nNotas: ${visitForm.notes}`);
        setSelectedSchool(null);
        setVisitForm({ status: '', notes: '', nextSteps: '' });
    };

    return (
        <div className="dashboard-layout">
            <button className="menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <Menu size={24} />
            </button>
            <div className={`sidebar-backdrop ${mobileMenuOpen ? 'visible' : ''}`} onClick={() => setMobileMenuOpen(false)} />

            <Sidebar
                menuItems={menuItems}
                activeTab={activeTab}
                setActiveTab={(tab) => { setActiveTab(tab); setMobileMenuOpen(false); }}
                isOpen={mobileMenuOpen}
                expandedMenus={expandedMenus}
                toggleMenu={toggleMenu}
            />

            <div className="main-content">
                {activeTab === 'map' && (
                    <div className="fade-in">
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Mapa de Escolas</h1>

                        <div style={{ marginBottom: '2rem' }}>
                            <input
                                className="input-field"
                                placeholder="Buscar escola por nome, cidade ou estado..."
                                style={{ maxWidth: '500px' }}
                            />
                        </div>

                        {selectedSchool && (
                            <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Registrar Visita - {selectedSchool.name}</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <select
                                        className="input-field"
                                        value={visitForm.status}
                                        onChange={(e) => setVisitForm({ ...visitForm, status: e.target.value })}
                                    >
                                        <option value="">Selecione o status da visita</option>
                                        <option value="interessado">Interessado</option>
                                        <option value="nao_interessado">Não Interessado</option>
                                        <option value="agendar_retorno">Agendar Retorno</option>
                                        <option value="fechado">Fechado</option>
                                    </select>

                                    <textarea
                                        className="input-field"
                                        rows="4"
                                        placeholder="Notas sobre a visita (o que foi discutido, interesse demonstrado...)"
                                        value={visitForm.notes}
                                        onChange={(e) => setVisitForm({ ...visitForm, notes: e.target.value })}
                                    />

                                    <textarea
                                        className="input-field"
                                        rows="3"
                                        placeholder="Próximos passos e planos de abordagem"
                                        value={visitForm.nextSteps}
                                        onChange={(e) => setVisitForm({ ...visitForm, nextSteps: e.target.value })}
                                    />

                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <button className="btn btn-primary" onClick={handleSaveVisit}>Salvar Visita</button>
                                        <button className="btn" style={{ background: 'var(--bg-secondary)' }} onClick={() => setSelectedSchool(null)}>Cancelar</button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {mockSchoolsMap.map(school => (
                                <div key={school.id} className="glass-panel" style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{school.name}</h3>
                                            <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                                <span>{school.city} - {school.state}</span>
                                                {school.visited && <span style={{ marginLeft: '1rem', color: 'var(--success)' }}>✓ Visitada</span>}
                                            </div>
                                        </div>
                                        <button
                                            className="btn btn-primary"
                                            onClick={() => handleMarkVisit(school)}
                                        >
                                            Marcar Visita
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'myschools' && (
                    <div className="fade-in">
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Minhas Escolas</h1>

                        <div className="card-grid">
                            {mockMySchools.map(school => (
                                <div key={school.id} className="glass-panel stat-card">
                                    <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '1rem' }}>{school.name}</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Alunos:</span>
                                            <strong>{school.students}</strong>
                                        </div>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <span style={{ color: 'var(--text-secondary)' }}>Crescimento:</span>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <TrendingUp size={16} style={{ color: school.growth > 0 ? 'var(--success)' : 'var(--danger)' }} />
                                                <strong style={{ color: school.growth > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                                    {school.growth > 0 ? '+' : ''}{school.growth}%
                                                </strong>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div className="fade-in">
                        <h1 style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '2rem' }}>Faturamento</h1>

                        <div className="card-grid" style={{ marginBottom: '2rem' }}>
                            <div className="glass-panel stat-card">
                                <div className="stat-label">Escolas Conquistadas</div>
                                <div className="stat-value">2</div>
                            </div>
                            <div className="glass-panel stat-card">
                                <div className="stat-label">Total de Alunos</div>
                                <div className="stat-value">770</div>
                            </div>
                            <div className="glass-panel stat-card">
                                <div className="stat-label">Previsão Próximo Mês</div>
                                <div className="stat-value">R$ 3.850</div>
                            </div>
                        </div>

                        <div className="glass-panel" style={{ padding: '2rem' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Detalhamento</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600' }}>Comissão por Escola</span>
                                        <span style={{ color: 'var(--success)' }}>10%</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        <span>2 escolas × R$ 500</span>
                                        <span>R$ 1.000</span>
                                    </div>
                                </div>

                                <div style={{ padding: '1rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: '600' }}>Residual por Aluno</span>
                                        <span style={{ color: 'var(--success)' }}>R$ 3,70/aluno</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                        <span>770 alunos × R$ 3,70</span>
                                        <span>R$ 2.850</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'training' && (
                    <RepresentativeTraining />
                )}
            </div>
        </div>
    );
}
