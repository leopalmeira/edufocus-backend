import { useState, useRef, useEffect } from 'react';
import { Camera, UserCheck, AlertCircle, ShieldCheck, Bell, User, Scan, Activity, CheckCircle, Database, Cpu } from 'lucide-react';
import api from '../api/axios';
import * as faceapi from 'face-api.js';

export default function FacialRecognitionCamera({
    schoolId,
    mode = 'attendance',
    onStatsUpdate,
    onNewArrival,
    studentsList = [],
    employeesList = [],
    onNewRecord // Callback para registro de funcionário
}) {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isActive, setIsActive] = useState(false);
    const [detections, setDetections] = useState([]);
    const [lastDetection, setLastDetection] = useState(null);
    const [debugInfo, setDebugInfo] = useState({ faces: 0, bestMatch: 'N/A', distance: 0 });
    const intervalRef = useRef(null);
    const [students, setStudents] = useState([]);
    const [modelsLoaded, setModelsLoaded] = useState(false);
    const faceMatcher = useRef(null);
    const lastRecognitionTime = useRef({});
    const initialized = useRef(false);

    // Carregar modelos face-api.js e pessoas (alunos ou funcionários)
    useEffect(() => {
        const loadResources = async () => {
            try {
                console.log('🔄 Iniciando carregamento do sistema...');
                const CDN_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';

                // 1. Carregar Modelos
                await Promise.all([
                    faceapi.nets.ssdMobilenetv1.loadFromUri(CDN_URL),
                    faceapi.nets.faceLandmark68Net.loadFromUri(CDN_URL),
                    faceapi.nets.faceRecognitionNet.loadFromUri(CDN_URL),
                    faceapi.nets.faceExpressionNet.loadFromUri(CDN_URL)
                ]);
                console.log('✅ Modelos IA carregados');
                setModelsLoaded(true);

                // 2. Carregar FUNCIONÁRIOS ou ALUNOS dependendo do modo
                if (mode === 'employee') {
                    console.log('👔 Modo FUNCIONÁRIO - Carregando funcionários...');

                    const employeesData = employeesList || [];
                    console.log(`📊 ${employeesData.length} funcionários recebidos`);

                    const employeesWithDescriptors = employeesData
                        .filter(e => e.face_descriptor)
                        .map(e => {
                            let descriptor = e.face_descriptor;

                            if (typeof descriptor === 'string') {
                                try {
                                    descriptor = JSON.parse(descriptor);
                                } catch (err) {
                                    console.error(`Erro ao parsear descritor do funcionário ${e.id}:`, err);
                                    return null;
                                }
                            }

                            if (!Array.isArray(descriptor) || descriptor.length !== 128) {
                                console.warn(`Descritor inválido para funcionário ${e.name} (${e.id}):`, descriptor?.length);
                                return null;
                            }

                            return { ...e, descriptor: new Float32Array(descriptor) };
                        })
                        .filter(e => e);

                    setStudents(employeesWithDescriptors); // Reutilizamos o state 'students' para funcionários

                    console.log(`📊 Funcionários carregados: ${employeesData.length} total, ${employeesWithDescriptors.length} com descritores válidos`);

                    if (employeesWithDescriptors.length > 0) {
                        console.log('👔 Funcionários com biometria:', employeesWithDescriptors.map(e => e.name));

                        const labeledDescriptors = employeesWithDescriptors.map(e =>
                            new faceapi.LabeledFaceDescriptors(e.name, [e.descriptor])
                        );
                        faceMatcher.current = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
                        console.log('✅ Matcher facial configurado com', labeledDescriptors.length, 'funcionários');
                    } else {
                        console.warn('⚠️ Nenhum funcionário com descritor facial válido encontrado!');
                    }

                } else {
                    // Modo ALUNO (attendance ou monitoring)
                    console.log('👨‍🎓 Modo ALUNO - Carregando alunos...');

                    let studentsData = [];

                    if (studentsList && studentsList.length > 0) {
                        console.log('🔄 Usando lista de alunos fornecida...');
                        studentsData = studentsList;
                    } else if (mode === 'monitoring') {
                        console.warn('⚠️ Modo monitoramento: Nenhum aluno fornecido.');
                        studentsData = [];
                    } else {
                        console.log('🔄 Buscando alunos do endpoint autenticado...');
                        try {
                            const res = await api.get('/school/students');
                            studentsData = res.data;
                            console.log(`📊 Endpoint /school/students retornou ${studentsData.length} alunos`);

                            const withDescriptors = studentsData.filter(s => s.face_descriptor);
                            if (withDescriptors.length === 0 && schoolId) {
                                console.log('🔄 Tentando endpoint de embeddings como backup...');
                                const embRes = await api.get(`/school/${schoolId}/students/embeddings`);
                                if (embRes.data.length > 0) {
                                    studentsData = embRes.data;
                                    console.log(`📊 Endpoint embeddings retornou ${studentsData.length} alunos`);
                                }
                            }
                        } catch (err) {
                            console.error('❌ Erro ao buscar alunos:', err);
                            studentsData = [];
                        }
                    }

                    const studentsWithDescriptors = studentsData
                        .filter(s => s.face_descriptor)
                        .map(s => {
                            let descriptor = s.face_descriptor;

                            if (typeof descriptor === 'string') {
                                try {
                                    descriptor = JSON.parse(descriptor);
                                } catch (e) {
                                    console.error(`Erro ao parsear descritor do aluno ${s.id}:`, e);
                                    return null;
                                }
                            }

                            if (!Array.isArray(descriptor) || descriptor.length !== 128) {
                                console.warn(`Descritor inválido para aluno ${s.name} (${s.id}):`, descriptor?.length);
                                return null;
                            }

                            return { ...s, descriptor: new Float32Array(descriptor) };
                        })
                        .filter(s => s);

                    setStudents(studentsWithDescriptors);

                    console.log(`📊 Alunos carregados: ${studentsData.length} total, ${studentsWithDescriptors.length} com descritores válidos`);

                    if (studentsWithDescriptors.length > 0) {
                        console.log('👥 Alunos com biometria configurada:', studentsWithDescriptors.map(s => s.name));

                        const labeledDescriptors = studentsWithDescriptors.map(s =>
                            new faceapi.LabeledFaceDescriptors(s.name, [s.descriptor])
                        );
                        faceMatcher.current = new faceapi.FaceMatcher(labeledDescriptors, 0.55);
                        console.log('✅ Matcher facial configurado com', labeledDescriptors.length, 'alunos');
                    } else {
                        console.warn('⚠️ Nenhum aluno com descritor facial válido encontrado!');
                    }
                }

            } catch (error) {
                console.error('❌ Erro ao carregar recursos:', error);
            }
        };

        if (!initialized.current) {
            initialized.current = true;
            loadResources();
        }

        return () => {
            // Cleanup handled by stopCamera call or component unmount
        };
    }, [studentsList, employeesList, mode]); // Dependências atualizadas

    // AUTO-START: Iniciar câmera automaticamente quando modelos estiverem carregados
    useEffect(() => {
        if (modelsLoaded && !isActive) {
            console.log('🚀 Iniciando câmera automaticamente...');
            startCamera();
        }
    }, [modelsLoaded]);

    const startCamera = async () => {
        setIsActive(true);
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (err) {
            console.error("Erro ao acessar câmera:", err);
            alert("Não foi possível acessar a câmera. Verifique as permissões.");
        }
    };

    const stopCamera = () => {
        setIsActive(false);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    // Cleanup: Parar câmera quando componente desmontar
    useEffect(() => {
        return () => {
            console.log('🛑 Desmontando câmera...');
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            }
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, []);

    const handleVideoPlay = () => {
        if (intervalRef.current) clearInterval(intervalRef.current);

        intervalRef.current = setInterval(async () => {
            if (videoRef.current && canvasRef.current) {
                // Executar detecção mesmo se não tiver matcher, para feedback visual
                await detectFaces();
            }
        }, 500); // 2 FPS para performance
    };

    const detectFaces = async () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas || video.paused || video.ended) return;

        if (canvas.width === 0 || canvas.height === 0) return;

        const context = canvas.getContext('2d');
        if (!context) return;

        try {
            // Limpar canvas
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Detectar rostos + expressões
            const detections = await faceapi
                .detectAllFaces(video, new faceapi.SsdMobilenetv1Options())
                .withFaceLandmarks()
                .withFaceDescriptors()
                .withFaceExpressions(); // Habilita detecção de emoções

            // Resize e Desenho
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);
            const resizedDetections = faceapi.resizeResults(detections, displaySize);

            // Atualizar contagem básica
            setDebugInfo(prev => ({ ...prev, faces: resizedDetections.length }));

            if (resizedDetections.length > 0) {
                // Desenhar caixas e expressões
                faceapi.draw.drawDetections(canvas, resizedDetections);
                if (mode === 'monitoring') {
                    faceapi.draw.drawFaceExpressions(canvas, resizedDetections);
                }

                // --- Lógica de MONITORAMENTO ou PRESENÇA ---
                let totalAttentionScore = 0;
                let happyCount = 0;
                let neutralCount = 0;
                let recognizedNames = [];

                for (const detection of resizedDetections) {
                    let bestMatch = null;

                    if (faceMatcher.current) {
                        bestMatch = faceMatcher.current.findBestMatch(detection.descriptor);

                        // Log para debug
                        console.log(`🔍 Match: ${bestMatch.label} (distância: ${bestMatch.distance.toFixed(3)})`);

                        const box = detection.detection.box;
                        const drawBox = new faceapi.draw.DrawBox(box, {
                            label: bestMatch.label !== 'unknown'
                                ? `${bestMatch.label} (${((1 - bestMatch.distance) * 100).toFixed(0)}%)`
                                : 'Desconhecido',
                            boxColor: bestMatch.label !== 'unknown' ? '#10b981' : '#ef4444',
                            lineWidth: 2
                        });
                        drawBox.draw(canvas);

                        if (bestMatch.label !== 'unknown') {
                            recognizedNames.push(bestMatch.label);
                        }
                    } else {
                        // Sem matcher configurado (nenhum aluno com foto válida)
                        const box = detection.detection.box;
                        const drawBox = new faceapi.draw.DrawBox(box, {
                            label: 'Sem Biometria',
                            boxColor: '#f59e0b', // Amarelo para alerta
                            lineWidth: 2
                        });
                        drawBox.draw(canvas);
                    }

                    // Lógica para PRESENÇA (Escola - Alunos)
                    if (mode === 'attendance' && bestMatch && bestMatch.label !== 'unknown') {
                        console.log('🎫 Chamando processAttendance para:', bestMatch.label, 'distância:', bestMatch.distance);
                        processAttendance(bestMatch);
                    } else if (mode === 'attendance' && bestMatch) {
                        console.log('⚠️ Match não reconhecido:', bestMatch.label, bestMatch.distance);
                    }

                    // Lógica para PONTO BIOMÉTRICO (Funcionários)
                    if (mode === 'employee' && bestMatch && bestMatch.label !== 'unknown') {
                        console.log('👔 Processando ponto de funcionário:', bestMatch.label, 'distância:', bestMatch.distance);
                        processEmployeeAttendance(bestMatch);
                    }

                    // Lógica para MONITORAMENTO (Professor)
                    if (mode === 'monitoring') {
                        const expressions = detection.expressions;
                        // Score simplificado: Neutral = Foco (100), Happy = Engajado (90), Surprised = Curioso (80), Sad/Angry = Baixo (40)
                        let score = 50;
                        if (expressions.neutral > 0.5) { score = 100; neutralCount++; }
                        else if (expressions.happy > 0.5) { score = 95; happyCount++; }
                        else if (expressions.surprised > 0.5) { score = 85; }
                        else if (expressions.sad > 0.5 || expressions.angry > 0.5 || expressions.disgusted > 0.5) { score = 30; }

                        totalAttentionScore += score;
                    }
                }

                // Atualizar debug info com nomes reconhecidos
                if (recognizedNames.length > 0) {
                    setDebugInfo(prev => ({
                        ...prev,
                        faces: resizedDetections.length,
                        recognized: recognizedNames.join(', ')
                    }));
                }

                // Enviar estatísticas para o Dashboard
                if (mode === 'monitoring' && onStatsUpdate && resizedDetections.length > 0) {
                    const avgAttention = Math.round(totalAttentionScore / resizedDetections.length);
                    const engagementLevel = happyCount > (resizedDetections.length * 0.3) ? 'ALTO' :
                        neutralCount > (resizedDetections.length * 0.5) ? 'FOCADO' : 'NORMAL';

                    onStatsUpdate({
                        attention: avgAttention,
                        facesDetected: resizedDetections.length,
                        engagement: engagementLevel,
                        recognizedStudents: recognizedNames
                    });
                }
            } else if (mode === 'monitoring' && onStatsUpdate) {
                // Sem rostos = 0 atenção
                onStatsUpdate({ attention: 0, facesDetected: 0, engagement: 'N/A' });
            }

        } catch (error) {
            console.error('❌ Erro frame:', error);
        }
    };

    const processAttendance = async (bestMatch) => {
        console.log('🔍 Buscando aluno:', bestMatch.label, 'na lista de', students.length, 'alunos');
        const student = students.find(s => s.name === bestMatch.label);

        if (!student) {
            console.error('❌ Aluno não encontrado na lista! Nome buscado:', bestMatch.label);
            console.log('📋 Alunos disponíveis:', students.map(s => s.name));
            return;
        }

        const now = Date.now();
        const lastTime = lastRecognitionTime.current[student.id] || 0;

        // Só processa se passaram mais de 5 segundos desde a última vez
        if ((now - lastTime) / 1000 > 5) {
            console.log(`🎯 Processando presença para: ${student.name} (ID: ${student.id})`);

            try {
                // Usar novo endpoint que envia WhatsApp automaticamente
                const response = await api.post('/attendance/register', {
                    student_id: student.id,
                    school_id: schoolId,
                    event_type: 'arrival'
                });

                lastRecognitionTime.current[student.id] = now;

                console.log('📤 Resposta do servidor:', response.data);

                // Verificar se WhatsApp foi enviado
                if (response.data.whatsapp?.success) {
                    console.log('📱 WhatsApp enviado com sucesso para:', student.phone);
                } else {
                    console.log('⚠️ WhatsApp não enviado:', response.data.whatsapp?.error);
                }

                // Se já estiver registrado, não mostra feedback visual de 'Novo Registro'
                if (response.data.alreadyRegistered) {
                    console.log('ℹ️ Aluno já registrado hoje, ignorando atualização visual.');
                    return;
                }

                const nowTime = new Date();
                const msg = {
                    student_id: student.id,
                    student_name: student.name,
                    class_name: student.class_name,
                    similarity: (1 - bestMatch.distance).toFixed(2),
                    timestamp: nowTime.toLocaleTimeString('pt-BR'),
                    date: nowTime.toLocaleDateString('pt-BR'),
                    student: student,
                    messageText: `Olá, responsável! ${student.name} entrou na escola às ${nowTime.toLocaleTimeString('pt-BR')} do dia ${nowTime.toLocaleDateString('pt-BR')}.`,
                    whatsappSent: response.data.whatsapp?.success || false
                };
                setLastDetection(msg);
                setDetections(prev => [msg, ...prev].slice(0, 10));

                // Notify parent component about new arrival
                // Chamar sempre para atualizar a UI, o painel lida com duplicatas
                if (onNewArrival) {
                    console.log('📢 Chamando onNewArrival callback...');
                    onNewArrival(msg);
                }
            } catch (e) {
                console.error('❌ Erro ao registrar presença:', e);
            }
        }
    };

    const processEmployeeAttendance = async (bestMatch) => {
        console.log('🔍 Buscando funcionário:', bestMatch.label, 'na lista de', students.length, 'funcionários');
        const employee = students.find(e => e.name === bestMatch.label);

        if (!employee) {
            console.error('❌ Funcionário não encontrado na lista! Nome buscado:', bestMatch.label);
            console.log('📋 Funcionários disponíveis:', students.map(e => e.name));
            return;
        }

        const now = Date.now();
        const lastTime = lastRecognitionTime.current[employee.id] || 0;

        // Só processa se passaram mais de 5 segundos desde a última vez
        if ((now - lastTime) / 1000 > 5) {
            console.log(`👔 Processando ponto para: ${employee.name} (ID: ${employee.id})`);

            lastRecognitionTime.current[employee.id] = now;

            const nowTime = new Date();
            const recordData = {
                employee_id: employee.id,
                employee_name: employee.name,
                employee_role: employee.role,
                similarity: (1 - bestMatch.distance).toFixed(2),
                timestamp: nowTime.toLocaleTimeString('pt-BR'),
                date: nowTime.toLocaleDateString('pt-BR')
            };

            // Chamar callback para o painel de funcionários processar
            if (onNewRecord) {
                console.log('📢 Chamando onNewRecord callback para funcionário...');
                onNewRecord(recordData);
            }
        }
    };

    const getImageUrl = (url) => {
        if (!url) return null;
        if (url.startsWith('http') || url.startsWith('blob:') || url.startsWith('data:')) return url;
        return `http://localhost:3000${url}`;
    };

    return (
        <div className="glass-panel" style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            {/* Header / Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            width: '12px', height: '12px', borderRadius: '50%',
                            backgroundColor: isActive ? '#10b981' : '#ef4444',
                            boxShadow: isActive ? '0 0 10px #10b981' : 'none'
                        }}></div>
                    </div>
                    <div>
                        <h2 style={{ fontSize: '1.2rem', fontWeight: '600', color: '#f8fafc', margin: 0 }}>
                            {mode === 'monitoring' ? 'Monitoramento Pedagógico IA' : 'Reconhecimento Facial'}
                        </h2>
                        <span style={{ fontSize: '0.85rem', color: isActive ? '#10b981' : '#64748b' }}>
                            {isActive ? (modelsLoaded ? 'Sistema Online e Detectando' : 'Carregando Modelos IA...') : 'Câmera Parada'}
                        </span>
                    </div>
                </div>

                <button
                    onClick={isActive ? stopCamera : startCamera}
                    disabled={!modelsLoaded}
                    style={{
                        background: isActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                        color: isActive ? '#ef4444' : '#10b981',
                        border: `1px solid ${isActive ? '#ef4444' : '#10b981'}`,
                        padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
                        transition: 'all 0.3s'
                    }}
                >
                    {isActive ? 'Parar Câmera' : 'Ativar Câmera'}
                </button>
            </div>

            {/* Video Area */}
            <div style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', background: '#000', border: '1px solid rgba(255,255,255,0.1)', aspectRatio: '4/3' }}>
                <video
                    ref={videoRef}
                    autoPlay
                    muted
                    onPlay={handleVideoPlay}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: isActive ? 1 : 0.5 }}
                />
                <canvas
                    ref={canvasRef}
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                />

                {!isActive && (
                    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                        <Camera size={48} color="#64748b" style={{ margin: '0 auto 10px' }} />
                        <p style={{ color: '#64748b' }}>Câmera Desativada</p>
                    </div>
                )}
            </div>

            {/* Attendance Mode - SUCCESS CARD */}
            {mode === 'attendance' && lastDetection && (
                <div style={{
                    marginTop: '20px',
                    padding: '20px',
                    background: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid #10b981',
                    borderRadius: '12px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    animation: 'fadeIn 0.5s ease-out'
                }}>
                    <CheckCircle size={48} color="#10b981" style={{ marginBottom: '10px' }} />
                    <h2 style={{ color: '#10b981', margin: '0 0 5px 0', fontSize: '1.5rem' }}>ALUNO CHEGOU À ESCOLA</h2>
                    <h3 style={{ color: '#fff', fontSize: '1.2rem', margin: '5px 0' }}>{lastDetection.student_name}</h3>
                    <p style={{ color: '#94a3b8', margin: 0 }}>{lastDetection.class_name} • {lastDetection.timestamp}</p>

                    <div style={{ marginTop: '15px', padding: '10px', background: 'rgba(0,0,0,0.3)', borderRadius: '8px', width: '100%' }}>
                        <p style={{ color: '#cbd5e1', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>
                            "Mensagem enviada aos responsáveis: {lastDetection.messageText}"
                        </p>
                    </div>
                </div>
            )}

            {/* Recent Detections List (Attendance Only) */}
            {mode === 'attendance' && detections.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                    <h3 style={{ fontSize: '1rem', color: '#94a3b8', marginBottom: '10px' }}>Últimos Registros</h3>
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {detections.slice(0, 3).map((det, idx) => (
                            <div key={idx} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
                                <img src={det.student.photo_url || `https://ui-avatars.com/api/?name=${det.student_name}`} style={{ width: '30px', height: '30px', borderRadius: '50%' }} alt="" />
                                <span style={{ color: '#f1f5f9' }}>{det.student_name}</span>
                                <span style={{ marginLeft: 'auto', color: '#64748b' }}>{det.timestamp}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
