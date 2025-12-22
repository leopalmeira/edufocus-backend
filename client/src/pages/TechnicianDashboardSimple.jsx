import { useState } from 'react';

export default function TechnicianDashboard() {
    const [activeTab, setActiveTab] = useState('cameras');

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            color: 'white',
            padding: '2rem'
        }}>
            <h1 style={{ fontSize: '2rem', marginBottom: '2rem' }}>
                🔧 Dashboard do Técnico
            </h1>

            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                borderRadius: '12px',
                marginBottom: '2rem'
            }}>
                <h2 style={{ marginBottom: '1rem' }}>✅ Painel Carregado com Sucesso!</h2>
                <p>Se você está vendo esta mensagem, o dashboard do técnico está funcionando.</p>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('cameras')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'cameras' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    📹 Câmeras
                </button>
                <button
                    onClick={() => setActiveTab('billing')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'billing' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    💰 Faturamento
                </button>
                <button
                    onClick={() => setActiveTab('support')}
                    style={{
                        padding: '1rem 2rem',
                        background: activeTab === 'support' ? '#3b82f6' : 'rgba(255,255,255,0.1)',
                        border: 'none',
                        borderRadius: '8px',
                        color: 'white',
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                >
                    📞 Suporte
                </button>
            </div>

            <div style={{
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '2rem',
                borderRadius: '12px'
            }}>
                {activeTab === 'cameras' && (
                    <div>
                        <h2>📹 Gerenciar Câmeras</h2>
                        <p>Aqui você pode cadastrar e gerenciar câmeras.</p>
                    </div>
                )}

                {activeTab === 'billing' && (
                    <div>
                        <h2>💰 Faturamento</h2>
                        <p>Visualize seus ganhos e instalações.</p>
                    </div>
                )}

                {activeTab === 'support' && (
                    <div>
                        <h2>📞 Suporte</h2>
                        <p>Entre em contato com o suporte técnico.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
