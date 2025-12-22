import { useState, useEffect } from 'react';
import { Users, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import * as faceapi from 'face-api.js';

export default function ProcessStudentPhotos({ onComplete }) {
    const [students, setStudents] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState({ current: 0, total: 0 });
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const [results, setResults] = useState([]);

    useEffect(() => {
        loadModels();
        loadStudents();
    }, []);

    const loadModels = async () => {
        try {
            console.log('🔄 Carregando modelos para processar fotos...');
            const CDN_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

            await Promise.all([
                faceapi.nets.ssdMobilenetv1.loadFromUri(CDN_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(CDN_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(CDN_URL)
            ]);

            setModelsLoaded(true);
            console.log('✅ Modelos carregados!');
        } catch (err) {
            console.error('❌ Erro ao carregar modelos:', err);
        }
    };

    const loadStudents = async () => {
        try {
            const res = await api.get('/school/students');
            // Filtrar apenas alunos que TÊM foto mas NÃO têm descritor
            const studentsNeedingProcessing = res.data.filter(s =>
                s.photo_url && !s.face_descriptor
            );
            setStudents(studentsNeedingProcessing);
            console.log(`📊 ${studentsNeedingProcessing.length} alunos precisam ter fotos processadas`);
        } catch (err) {
            console.error('❌ Erro ao carregar alunos:', err);
        }
    };

    const processAllPhotos = async () => {
        if (!modelsLoaded) {
            alert('Aguarde os modelos carregarem...');
            return;
        }

        setProcessing(true);
        setProgress({ current: 0, total: students.length });
        const processResults = [];

        for (let i = 0; i < students.length; i++) {
            const student = students[i];
            setProgress({ current: i + 1, total: students.length });

            try {
                console.log(`🔄 Processando foto de ${student.name}...`);

                // Carregar imagem
                const img = await faceapi.fetchImage(student.photo_url);

                // Detectar rosto e extrair descritor
                const detection = await faceapi
                    .detectSingleFace(img, new faceapi.SsdMobilenetv1Options())
                    .withFaceLandmarks()
                    .withFaceDescriptor();

                if (detection) {
                    // Converter descritor para array
                    const descriptor = Array.from(detection.descriptor);

                    // Salvar no banco de dados
                    await api.put(`/school/students/${student.id}`, {
                        face_descriptor: JSON.stringify(descriptor)
                    });

                    console.log(`✅ Descritor extraído e salvo para ${student.name}`);
                    processResults.push({
                        student: student.name,
                        success: true,
                        message: 'Processado com sucesso'
                    });
                } else {
                    console.warn(`⚠️ Nenhum rosto detectado na foto de ${student.name}`);
                    processResults.push({
                        student: student.name,
                        success: false,
                        message: 'Nenhum rosto detectado na foto'
                    });
                }
            } catch (err) {
                console.error(`❌ Erro ao processar ${student.name}:`, err);
                processResults.push({
                    student: student.name,
                    success: false,
                    message: `Erro: ${err.message}`
                });
            }
        }

        setResults(processResults);
        setProcessing(false);

        const successCount = processResults.filter(r => r.success).length;
        alert(`Processamento concluído!\n${successCount}/${students.length} fotos processadas com sucesso.`);

        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className="glass-panel" style={{ padding: '2rem' }}>
            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '1.5rem',
                paddingBottom: '1rem',
                borderBottom: '2px solid var(--border)'
            }}>
                <Users size={32} style={{ color: 'var(--primary)' }} />
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.25rem' }}>
                        Processar Fotos dos Alunos
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Extrair descritores faciais das fotos cadastradas
                    </p>
                </div>
            </div>

            {/* Status dos Modelos */}
            <div style={{
                padding: '1rem',
                background: modelsLoaded ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: `1px solid ${modelsLoaded ? 'var(--success)' : 'var(--warning)'}`
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    {modelsLoaded ? (
                        <CheckCircle size={24} style={{ color: 'var(--success)' }} />
                    ) : (
                        <RefreshCw size={24} style={{ color: 'var(--warning)', animation: 'spin 2s linear infinite' }} />
                    )}
                    <div>
                        <div style={{ fontWeight: '600' }}>
                            {modelsLoaded ? 'Modelos Carregados' : 'Carregando Modelos...'}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {modelsLoaded
                                ? 'Pronto para processar fotos'
                                : 'Aguarde o carregamento dos modelos de IA'}
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1rem',
                marginBottom: '1.5rem'
            }}>
                <div style={{
                    padding: '1.5rem',
                    background: 'var(--bg-secondary)',
                    borderRadius: '12px',
                    textAlign: 'center'
                }}>
                    <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--primary)' }}>
                        {students.length}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        Alunos para Processar
                    </div>
                </div>

                {processing && (
                    <div style={{
                        padding: '1.5rem',
                        background: 'var(--bg-secondary)',
                        borderRadius: '12px',
                        textAlign: 'center'
                    }}>
                        <div style={{ fontSize: '2.5rem', fontWeight: '700', color: 'var(--accent)' }}>
                            {progress.current}/{progress.total}
                        </div>
                        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            Progresso
                        </div>
                    </div>
                )}
            </div>

            {/* Botão de Processar */}
            {students.length > 0 && (
                <button
                    className="btn btn-primary"
                    onClick={processAllPhotos}
                    disabled={!modelsLoaded || processing}
                    style={{
                        width: '100%',
                        opacity: (!modelsLoaded || processing) ? 0.6 : 1,
                        marginBottom: '1.5rem'
                    }}
                >
                    {processing ? (
                        <>
                            <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                            Processando {progress.current}/{progress.total}...
                        </>
                    ) : (
                        <>
                            <Users size={20} />
                            Processar {students.length} Foto{students.length !== 1 ? 's' : ''}
                        </>
                    )}
                </button>
            )}

            {students.length === 0 && (
                <div style={{
                    padding: '3rem',
                    textAlign: 'center',
                    color: 'var(--text-secondary)'
                }}>
                    <CheckCircle size={64} style={{ margin: '0 auto 1rem', color: 'var(--success)' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                        Tudo Pronto!
                    </h3>
                    <p>Todos os alunos com fotos já têm descritores faciais processados.</p>
                </div>
            )}

            {/* Resultados */}
            {results.length > 0 && (
                <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>
                        Resultados do Processamento
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {results.map((result, index) => (
                            <div
                                key={index}
                                style={{
                                    padding: '1rem',
                                    background: result.success ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                                    borderRadius: '8px',
                                    border: `1px solid ${result.success ? 'var(--success)' : 'var(--danger)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}
                            >
                                {result.success ? (
                                    <CheckCircle size={20} style={{ color: 'var(--success)' }} />
                                ) : (
                                    <AlertCircle size={20} style={{ color: 'var(--danger)' }} />
                                )}
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: '600' }}>{result.student}</div>
                                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {result.message}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
