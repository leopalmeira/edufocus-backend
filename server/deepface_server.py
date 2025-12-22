# Servidor de Análise Facial com DeepFace
# EduFocus - Sistema de Monitoramento de Emoções
# Autor: EduFocus Team

from flask import Flask, jsonify, request
from flask_cors import CORS
from deepface import DeepFace
import cv2
import numpy as np
import base64
import threading
import time
import os
import sqlite3
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Configurações
CAMERA_STREAMS = {}  # {room_id: camera_url}
ANALYSIS_THREADS = {}  # {room_id: thread}
CURRENT_ANALYSIS = {}  # {room_id: analysis_data}
STUDENT_FACES = {}  # {student_id: face_encoding}

# Banco de dados
def get_db_connection(school_id):
    """Conecta ao banco de dados da escola"""
    db_path = f'../databases/school_{school_id}.db'
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def load_student_faces(school_id):
    """Carrega fotos dos alunos cadastrados"""
    print(f"📚 Carregando rostos dos alunos da escola {school_id}...")
    
    conn = get_db_connection(school_id)
    cursor = conn.cursor()
    
    # Buscar alunos com foto
    cursor.execute("""
        SELECT id, name, photo_url, class_id 
        FROM students 
        WHERE photo_url IS NOT NULL AND photo_url != ''
    """)
    
    students = cursor.fetchall()
    conn.close()
    
    student_data = {}
    
    for student in students:
        student_id = student['id']
        name = student['name']
        photo_base64 = student['photo_url']
        class_id = student['class_id']
        
        try:
            # Decodificar base64 para imagem
            if photo_base64.startswith('data:image'):
                photo_base64 = photo_base64.split(',')[1]
            
            img_data = base64.b64decode(photo_base64)
            nparr = np.frombuffer(img_data, np.uint8)
            img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
            
            # Extrair embedding facial usando DeepFace
            embedding = DeepFace.represent(
                img_path=img,
                model_name='Facenet',
                enforce_detection=False
            )
            
            student_data[student_id] = {
                'name': name,
                'class_id': class_id,
                'embedding': embedding[0]['embedding']
            }
            
            print(f"  ✓ {name} (ID: {student_id})")
            
        except Exception as e:
            print(f"  ✗ Erro ao processar {name}: {e}")
    
    print(f"✅ {len(student_data)} alunos carregados")
    return student_data

def analyze_camera_stream(room_id, camera_url, school_id):
    """Analisa stream da câmera continuamente"""
    print(f"🎥 Iniciando análise da sala {room_id}")
    
    # Carregar rostos dos alunos
    student_faces = load_student_faces(school_id)
    
    # Conectar à câmera
    cap = cv2.VideoCapture(camera_url)
    
    if not cap.isOpened():
        print(f"❌ Erro ao conectar câmera da sala {room_id}")
        return
    
    frame_count = 0
    
    while room_id in ANALYSIS_THREADS:
        ret, frame = cap.read()
        
        if not ret:
            print(f"⚠️ Erro ao ler frame da sala {room_id}")
            time.sleep(1)
            continue
        
        # Analisar a cada 30 frames (1 vez por segundo em 30fps)
        frame_count += 1
        if frame_count % 30 != 0:
            continue
        
        try:
            # Detectar rostos no frame
            faces = DeepFace.extract_faces(
                img_path=frame,
                detector_backend='opencv',
                enforce_detection=False
            )
            
            analysis_results = []
            emotion_counts = {
                'happy': 0,
                'sad': 0,
                'angry': 0,
                'fear': 0,
                'surprise': 0,
                'disgust': 0,
                'neutral': 0
            }
            
            for face_data in faces:
                face_img = face_data['face']
                
                # Analisar emoção
                emotion_result = DeepFace.analyze(
                    img_path=face_img,
                    actions=['emotion'],
                    enforce_detection=False
                )
                
                dominant_emotion = emotion_result[0]['dominant_emotion']
                emotion_scores = emotion_result[0]['emotion']
                
                # Tentar reconhecer aluno
                student_id = None
                student_name = "Desconhecido"
                
                try:
                    # Extrair embedding do rosto detectado
                    face_embedding = DeepFace.represent(
                        img_path=face_img,
                        model_name='Facenet',
                        enforce_detection=False
                    )[0]['embedding']
                    
                    # Comparar com rostos cadastrados
                    min_distance = float('inf')
                    best_match = None
                    
                    for sid, sdata in student_faces.items():
                        # Calcular distância euclidiana
                        distance = np.linalg.norm(
                            np.array(face_embedding) - np.array(sdata['embedding'])
                        )
                        
                        if distance < min_distance and distance < 0.6:  # Threshold
                            min_distance = distance
                            best_match = sid
                    
                    if best_match:
                        student_id = best_match
                        student_name = student_faces[best_match]['name']
                
                except Exception as e:
                    print(f"⚠️ Erro ao reconhecer rosto: {e}")
                
                # Adicionar ao resultado
                analysis_results.append({
                    'student_id': student_id,
                    'student_name': student_name,
                    'emotion': dominant_emotion,
                    'emotion_scores': emotion_scores,
                    'confidence': max(emotion_scores.values())
                })
                
                # Contar emoção
                emotion_counts[dominant_emotion] += 1
            
            # Calcular métricas globais
            total_faces = len(faces)
            
            if total_faces > 0:
                # Atenção: baseada em emoções positivas
                positive = emotion_counts['happy'] + emotion_counts['surprise']
                negative = emotion_counts['sad'] + emotion_counts['angry'] + emotion_counts['fear']
                attention = round(((positive + emotion_counts['neutral']) / total_faces) * 100)
                
                # Disposição: baseada em felicidade
                disposition = round((emotion_counts['happy'] / total_faces) * 100)
                
                # Engajamento: inverso de neutro e negativo
                engagement = round((1 - ((emotion_counts['neutral'] + negative) / total_faces)) * 100)
                
                # Desempenho: média
                performance = round((attention + disposition + engagement) / 3)
                
                # Atualizar dados globais
                CURRENT_ANALYSIS[room_id] = {
                    'timestamp': datetime.now().isoformat(),
                    'total_faces': total_faces,
                    'students': analysis_results,
                    'emotion_counts': emotion_counts,
                    'metrics': {
                        'attention': attention,
                        'disposition': disposition,
                        'engagement': engagement,
                        'performance': performance
                    },
                    'distribution': {
                        'high': positive,
                        'medium': emotion_counts['neutral'],
                        'low': negative
                    }
                }
                
                print(f"📊 Sala {room_id}: {total_faces} rostos | Atenção: {attention}%")
        
        except Exception as e:
            print(f"❌ Erro na análise: {e}")
            time.sleep(1)
    
    cap.release()
    print(f"🛑 Análise da sala {room_id} finalizada")

# ========== ENDPOINTS DA API ==========

@app.route('/api/analysis/start', methods=['POST'])
def start_analysis():
    """Inicia análise de uma sala"""
    data = request.json
    room_id = data.get('room_id')
    camera_url = data.get('camera_url')
    school_id = data.get('school_id')
    
    if not all([room_id, camera_url, school_id]):
        return jsonify({'error': 'Parâmetros faltando'}), 400
    
    # Verificar se já está rodando
    if room_id in ANALYSIS_THREADS:
        return jsonify({'message': 'Análise já está rodando'}), 200
    
    # Iniciar thread de análise
    thread = threading.Thread(
        target=analyze_camera_stream,
        args=(room_id, camera_url, school_id),
        daemon=True
    )
    thread.start()
    
    ANALYSIS_THREADS[room_id] = thread
    CAMERA_STREAMS[room_id] = camera_url
    
    return jsonify({
        'success': True,
        'message': f'Análise iniciada para sala {room_id}'
    })

@app.route('/api/analysis/stop', methods=['POST'])
def stop_analysis():
    """Para análise de uma sala"""
    data = request.json
    room_id = data.get('room_id')
    
    if room_id in ANALYSIS_THREADS:
        del ANALYSIS_THREADS[room_id]
        del CAMERA_STREAMS[room_id]
        if room_id in CURRENT_ANALYSIS:
            del CURRENT_ANALYSIS[room_id]
        
        return jsonify({
            'success': True,
            'message': f'Análise parada para sala {room_id}'
        })
    
    return jsonify({'error': 'Análise não está rodando'}), 404

@app.route('/api/analysis/data/<int:room_id>', methods=['GET'])
def get_analysis_data(room_id):
    """Retorna dados de análise em tempo real"""
    if room_id in CURRENT_ANALYSIS:
        return jsonify(CURRENT_ANALYSIS[room_id])
    
    return jsonify({
        'error': 'Nenhuma análise disponível para esta sala'
    }), 404

@app.route('/api/analysis/status', methods=['GET'])
def get_status():
    """Retorna status de todas as análises"""
    return jsonify({
        'active_rooms': list(ANALYSIS_THREADS.keys()),
        'total_analyses': len(ANALYSIS_THREADS)
    })

@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'service': 'deepface-analysis'})

if __name__ == '__main__':
    print("🚀 Servidor DeepFace iniciando...")
    print("📡 Porta: 5001")
    print("🔗 Endpoints disponíveis:")
    print("   POST /api/analysis/start - Iniciar análise")
    print("   POST /api/analysis/stop - Parar análise")
    print("   GET /api/analysis/data/<room_id> - Obter dados")
    print("   GET /api/analysis/status - Status geral")
    print("")
    
    app.run(host='0.0.0.0', port=5001, debug=True, threaded=True)
