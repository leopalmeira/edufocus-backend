import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import api from '../api/axios';
import { Camera } from 'lucide-react';

export default function EntranceCamera() {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastRecognized, setLastRecognized] = useState(null);
    const [students, setStudents] = useState([]);
    const [isMonitoring, setIsMonitoring] = useState(false);

    useEffect(() => {
        // Load students with face descriptors
        const loadStudents = async () => {
            try {
                const res = await api.get('/school/students/faces');
                setStudents(res.data);
                console.log('Loaded students for recognition:', res.data.length);
            } catch (err) {
                console.error('Error loading students:', err);
            }
        };
        loadStudents();

        return () => {
            stopCamera();
        };
    }, []);

    const startCamera = () => {
        setIsMonitoring(true);
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            })
            .catch(err => {
                console.error("Error accessing camera:", err);
                setIsMonitoring(false);
                alert("Erro ao acessar a câmera. Verifique as permissões.");
            });
    };

    const stopCamera = () => {
        setIsMonitoring(false);
        if (videoRef.current && videoRef.current.srcObject) {
            videoRef.current.srcObject.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
    };

    useEffect(() => {
        const interval = setInterval(async () => {
            if (!isMonitoring || isProcessing || !videoRef.current || students.length === 0) return;

            setIsProcessing(true);

            try {
                const detections = await faceapi.detectAllFaces(videoRef.current, new faceapi.SsdMobilenetv1Options())
                    .withFaceLandmarks()
                    .withFaceDescriptors();

                // Clear canvas
                const canvas = canvasRef.current;
                if (canvas && videoRef.current && !videoRef.current.paused && !videoRef.current.ended) {
                    const displaySize = { width: videoRef.current.videoWidth, height: videoRef.current.videoHeight };
                    faceapi.matchDimensions(canvas, displaySize);

                    const resizedDetections = faceapi.resizeResults(detections, displaySize);
                    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
                    faceapi.draw.drawDetections(canvas, resizedDetections);

                    // Match faces
                    if (detections.length > 0) {
                        const labeledDescriptors = students.map(student => {
                            return new faceapi.LabeledFaceDescriptors(
                                student.name,
                                [new Float32Array(student.face_descriptor)]
                            );
                        });

                        const faceMatcher = new faceapi.FaceMatcher(labeledDescriptors, 0.6);

                        resizedDetections.forEach(detection => {
                            const match = faceMatcher.findBestMatch(detection.descriptor);

                            if (match.label !== 'unknown') {
                                // Draw box with name
                                const box = detection.detection.box;
                                const drawBox = new faceapi.draw.DrawBox(box, { label: match.toString() });
                                drawBox.draw(canvas);

                                // Notify if not recently recognized (debounce)
                                if (lastRecognized !== match.label) {
                                    setLastRecognized(match.label);
                                    const student = students.find(s => s.name === match.label);
                                    if (student) sendNotification(student);

                                    // Reset last recognized after 10 seconds
                                    setTimeout(() => setLastRecognized(null), 10000);
                                }
                            }
                        });
                    }
                }
            } catch (err) {
                console.error('Recognition error:', err);
            }

            setIsProcessing(false);
        }, 1000); // Check every 1 second

        return () => clearInterval(interval);
    }, [students, isProcessing, lastRecognized, isMonitoring]);

    const sendNotification = async (student) => {
        console.log(`Sending WhatsApp to ${student.parent_email} for ${student.name}`);

        // Visual feedback
        const notification = document.createElement('div');
        notification.innerText = `✅ ${student.name} identificado! Notificação enviada.`;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.background = 'var(--success)';
        notification.style.color = 'white';
        notification.style.padding = '1rem';
        notification.style.borderRadius = 'var(--radius)';
        notification.style.zIndex = '1000';
        document.body.appendChild(notification);

        setTimeout(() => notification.remove(), 5000);
    };

    return (
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>📸 Monitoramento de Entrada</h3>
                {!isMonitoring ? (
                    <button className="btn btn-primary" onClick={startCamera}>
                        ▶ Iniciar Monitoramento
                    </button>
                ) : (
                    <button className="btn btn-danger" onClick={stopCamera}>
                        ⏹ Parar Monitoramento
                    </button>
                )}
            </div>

            {isMonitoring ? (
                <div style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto', background: 'black', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    <video ref={videoRef} autoPlay muted style={{ width: '100%', display: 'block' }} />
                    <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0 }} />
                </div>
            ) : (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.2)', borderRadius: 'var(--radius)' }}>
                    <Camera size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>Câmera desligada. Clique em "Iniciar Monitoramento" para ativar o reconhecimento facial.</p>
                </div>
            )}
        </div>
    );
}
