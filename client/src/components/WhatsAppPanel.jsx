/**
 * ============================================================================
 * WHATSAPP PANEL - COMPONENTE FRONTEND
 * ============================================================================
 * 
 * Este componente gerencia a conexão WhatsApp da escola para envio automático
 * de notificações aos pais quando os alunos chegam na escola.
 * 
 * FUNCIONALIDADES:
 * 1. Conectar WhatsApp via QR Code
 * 2. Verificar status da conexão
 * 3. Desconectar WhatsApp
 * 4. Polling automático para atualizar status
 * 
 * FLUXO DE CONEXÃO:
 * 1. Usuário clica em "Conectar WhatsApp"
 * 2. Backend gera QR Code
 * 3. Usuário escaneia com WhatsApp
 * 4. Conexão é estabelecida
 * 5. Notificações automáticas são habilitadas
 * 
 * ============================================================================
 */

import { useState, useEffect, useRef } from 'react';
import { MessageCircle, Power, PowerOff, CheckCircle, XCircle, Loader, AlertTriangle } from 'lucide-react';
import api from '../api/axios';

export default function WhatsAppPanel() {
    // ========================================================================
    // ESTADOS DO COMPONENTE
    // ========================================================================

    /**
     * Status da conexão WhatsApp
     * @property {boolean} connected - Se está conectado
     * @property {string} message - Mensagem de status
     * @property {string|null} qrCode - Dados do QR Code para exibição
     */
    const [status, setStatus] = useState({
        connected: false,
        message: 'Verificando conexão...',
        qrCode: null
    });

    /**
     * Estado de carregamento para operações assíncronas
     */
    const [loading, setLoading] = useState(false);

    /**
     * Referência ao container do QR Code para renderização
     */
    const qrContainerRef = useRef(null);

    /**
     * Referência ao intervalo de polling para verificação de status
     */
    const pollingRef = useRef(null);

    // ========================================================================
    // EFEITOS (LIFECYCLE)
    // ========================================================================

    /**
     * Efeito executado ao montar o componente
     * - Verifica status inicial
     * - Inicia polling automático
     * - Limpa polling ao desmontar
     */
    useEffect(() => {
        console.log('📱 WhatsAppPanel montado - iniciando verificação');
        checkStatus();
        startPolling();

        // Cleanup ao desmontar
        return () => {
            console.log('📱 WhatsAppPanel desmontado - parando polling');
            stopPolling();
        };
    }, []);

    /**
     * Efeito para renderizar QR Code quando disponível
     */
    useEffect(() => {
        if (status.qrCode && qrContainerRef.current && window.QRCode) {
            console.log('🔄 Renderizando QR Code');
            renderQRCode(status.qrCode);
        }
    }, [status.qrCode]);

    // ========================================================================
    // FUNÇÕES DE API
    // ========================================================================

    /**
     * Verifica o status atual da conexão WhatsApp
     * Faz requisição GET para /api/whatsapp/status
     */
    const checkStatus = async () => {
        try {
            console.log('🔍 Verificando status do WhatsApp...');
            const res = await api.get('/whatsapp/status');
            console.log('✅ Status recebido:', res.data);

            setStatus(res.data);

            // Se conectado, parar loading
            if (res.data.connected) {
                setLoading(false);
            }
        } catch (err) {
            console.error('❌ Erro ao verificar status:', err);
            setStatus({
                connected: false,
                message: 'Erro ao verificar status: ' + (err.response?.data?.error || err.message),
                qrCode: null
            });
        }
    };

    /**
     * Inicia conexão com WhatsApp
     * Faz requisição POST para /api/whatsapp/connect
     */
    const handleConnect = async () => {
        setLoading(true);
        setStatus(prev => ({ ...prev, message: 'Iniciando conexão...' }));

        try {
            console.log('🔌 Iniciando conexão WhatsApp...');
            const res = await api.post('/whatsapp/connect');
            console.log('✅ Resposta de conexão:', res.data);

            // Iniciar polling para pegar QR Code e status
            startPolling();

        } catch (err) {
            console.error('❌ Erro ao conectar:', err);
            setLoading(false);
            const errorMsg = err.response?.data?.error || err.message;
            alert('Falha ao iniciar conexão: ' + errorMsg);
            setStatus(prev => ({ ...prev, message: 'Erro: ' + errorMsg }));
        }
    };

    /**
     * Desconecta do WhatsApp
     * Faz requisição POST para /api/whatsapp/disconnect
     */
    const handleDisconnect = async () => {
        // Confirmação do usuário
        if (!confirm('⚠️ Tem certeza que deseja desconectar?\n\nIsso irá parar o envio automático de notificações aos pais.')) {
            return;
        }

        setLoading(true);
        setStatus(prev => ({ ...prev, message: 'Desconectando...' }));

        try {
            console.log('🔌 Desconectando WhatsApp...');
            await api.post('/whatsapp/disconnect');
            console.log('✅ Desconectado com sucesso');

            // Atualizar estado local
            setStatus({
                connected: false,
                message: 'Desconectado com sucesso',
                qrCode: null
            });

            // Parar polling
            stopPolling();

        } catch (err) {
            console.error('❌ Erro ao desconectar:', err);
            const errorMsg = err.response?.data?.error || err.message;
            alert('Falha ao desconectar: ' + errorMsg);
            setStatus(prev => ({ ...prev, message: 'Erro ao desconectar: ' + errorMsg }));
        } finally {
            setLoading(false);
        }
    };

    // ========================================================================
    // FUNÇÕES AUXILIARES
    // ========================================================================

    /**
     * Renderiza o QR Code visualmente usando a biblioteca QRCode.js
     * @param {string} qrCodeData - Dados do QR Code
     */
    const renderQRCode = (qrCodeData) => {
        if (!qrContainerRef.current) {
            console.warn('⚠️ Container do QR Code não encontrado');
            return;
        }

        // Limpar QR Code anterior
        qrContainerRef.current.innerHTML = '';

        try {
            // Verificar se biblioteca QRCode está disponível
            if (window.QRCode) {
                new window.QRCode(qrContainerRef.current, {
                    text: qrCodeData,
                    width: 256,
                    height: 256,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: window.QRCode.CorrectLevel.H
                });
                console.log('✅ QR Code renderizado');
            } else {
                console.error('❌ Biblioteca QRCode.js não encontrada');
                qrContainerRef.current.innerHTML = '<p style="color: red;">Erro: Biblioteca QR Code não carregada.</p>';
            }
        } catch (e) {
            console.error('❌ Erro ao gerar QR Code visual:', e);
            qrContainerRef.current.innerHTML = '<p style="color: red;">Erro ao gerar QR Code</p>';
        }
    };

    /**
     * Inicia polling automático para verificar status
     * Verifica a cada 3 segundos
     */
    const startPolling = () => {
        // Evitar múltiplos intervalos
        if (pollingRef.current) {
            console.log('⚠️ Polling já está ativo');
            return;
        }

        console.log('🔄 Iniciando polling (3s)');
        pollingRef.current = setInterval(() => {
            checkStatus();
        }, 3000);
    };

    /**
     * Para o polling automático
     */
    const stopPolling = () => {
        if (pollingRef.current) {
            console.log('⏹️ Parando polling');
            clearInterval(pollingRef.current);
            pollingRef.current = null;
        }
    };

    // ========================================================================
    // RENDERIZAÇÃO
    // ========================================================================

    return (
        <div className="glass-panel" style={{ padding: '30px', maxWidth: '800px', margin: '0 auto' }}>

            {/* CABEÇALHO */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
                <MessageCircle size={32} style={{ color: '#25D366' }} />
                <div>
                    <h2 style={{ color: '#fff', margin: 0 }}>Integração WhatsApp</h2>
                    <p style={{ color: '#aaa', margin: '5px 0 0 0', fontSize: '0.9rem' }}>
                        Notificações automáticas para pais via WhatsApp
                    </p>
                </div>
            </div>

            {/* CARD DE STATUS */}
            <div style={{
                background: status.connected ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `2px solid ${status.connected ? '#10b981' : '#ef4444'}`,
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                    {status.connected ? (
                        <CheckCircle size={24} style={{ color: '#10b981' }} />
                    ) : (
                        <XCircle size={24} style={{ color: '#ef4444' }} />
                    )}
                    <h3 style={{ color: '#fff', margin: 0 }}>
                        Status: {status.connected ? 'Conectado ✅' : 'Desconectado ❌'}
                    </h3>
                </div>
                {status.message && (
                    <p style={{ color: '#aaa', margin: 0, fontSize: '0.9rem' }}>{status.message}</p>
                )}
            </div>

            {/* QR CODE (quando não conectado e QR disponível) */}
            {!status.connected && status.qrCode && (
                <div style={{
                    background: 'rgba(255, 255, 255, 0.95)',
                    borderRadius: '16px',
                    padding: '30px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>
                    <h3 style={{ color: '#000', marginTop: 0, marginBottom: '20px', fontSize: '1.3rem' }}>
                        📱 Escaneie o QR Code com WhatsApp
                    </h3>
                    <div
                        ref={qrContainerRef}
                        style={{
                            display: 'inline-block',
                            padding: '20px',
                            background: '#fff',
                            borderRadius: '12px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}
                    />
                    <div style={{ marginTop: '20px', color: '#666', fontSize: '0.9rem' }}>
                        <p style={{ margin: '5px 0' }}>1. Abra WhatsApp no celular</p>
                        <p style={{ margin: '5px 0' }}>2. Toque em <strong>Mais opções</strong> → <strong>Aparelhos conectados</strong></p>
                        <p style={{ margin: '5px 0' }}>3. Toque em <strong>Conectar um aparelho</strong></p>
                        <p style={{ margin: '5px 0' }}>4. Aponte a câmera para este QR Code</p>
                    </div>
                </div>
            )}

            {/* BOTÕES DE AÇÃO */}
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                {status.connected ? (
                    <button
                        onClick={handleDisconnect}
                        disabled={loading}
                        className="btn"
                        style={{
                            background: 'rgba(239, 68, 68, 0.2)',
                            color: '#ef4444',
                            border: '1px solid #ef4444',
                            padding: '15px 40px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? <Loader className="spin" size={20} /> : <PowerOff size={20} />}
                        {loading ? 'Desconectando...' : 'Desconectar'}
                    </button>
                ) : (
                    <button
                        onClick={handleConnect}
                        disabled={loading}
                        className="btn"
                        style={{
                            background: 'rgba(37, 211, 102, 0.2)',
                            color: '#25D366',
                            border: '1px solid #25D366',
                            padding: '15px 40px',
                            fontSize: '1.1rem',
                            fontWeight: '600',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.6 : 1
                        }}
                    >
                        {loading ? <Loader className="spin" size={20} /> : <Power size={20} />}
                        {loading ? 'Conectando...' : 'Conectar WhatsApp'}
                    </button>
                )}
            </div>

            {/* INSTRUÇÕES */}
            <div style={{
                marginTop: '30px',
                padding: '20px',
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '12px'
            }}>
                <h4 style={{ color: '#3b82f6', margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <AlertTriangle size={20} />
                    Como Funciona
                </h4>
                <ol style={{ color: '#aaa', margin: 0, paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>Clique em "Conectar WhatsApp"</li>
                    <li>O QR Code aparecerá <strong>aqui na tela</strong></li>
                    <li>Abra WhatsApp no celular → Configurações → Aparelhos Conectados</li>
                    <li>Escaneie o QR Code que apareceu acima</li>
                    <li>Aguarde a confirmação de conexão</li>
                    <li>As notificações serão enviadas automaticamente!</li>
                </ol>

                <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                    <p style={{ margin: 0, color: '#f59e0b', fontSize: '0.9rem' }}>
                        💡 <strong>Dica:</strong> Certifique-se de que os alunos têm números de telefone cadastrados (com DDD) para receber as notificações!
                    </p>
                </div>
            </div>

            {/* CSS para animação de loading */}
            <style>{`
                .spin {
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
