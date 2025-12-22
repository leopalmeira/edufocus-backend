"""
EduFocus - Facial Recognition Service
Sistema de reconhecimento facial para registro de entrada de alunos
"""

import os
import cv2
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit
import insightface
from insightface.app import FaceAnalysis
import requests
from datetime import datetime
from dotenv import load_dotenv
import base64
import json

load_dotenv()

app = Flask(__name__)
CORS(app, origins="*")
socketio = SocketIO(app, cors_allowed_origins="*")

# Configurações
EDUFOCUS_API = os.getenv('EDUFOCUS_API_URL', 'http://localhost:5000')
WHAPI_TOKEN = os.getenv('WHAPI_TOKEN', '')
WHAPI_URL = os.getenv('WHAPI_URL', 'https://gate.whapi.cloud')
EMBEDDINGS_DIR = 'embeddings_cache'
SIMILARITY_THRESHOLD = 0.4  # Quanto menor, mais rigoroso

# Criar diretórios
os.makedirs(EMBEDDINGS_DIR, exist_ok=True)

# Inicializar modelo InsightFace
print("🔄 Carregando modelo InsightFace...")
face_app = FaceAnalysis(name='buffalo_l', providers=['CPUExecutionProvider'])
face_app.prepare(ctx_id=0, det_size=(640, 640))
print("✅ Modelo carregado com sucesso!")

# Cache de embeddings
embeddings_cache = {}


def load_embeddings_from_api(school_id):
    """Carrega embeddings de alunos da API do EduFocus"""
    try:
        response = requests.get(f'{EDUFOCUS_API}/api/school/{school_id}/students/embeddings')
        if response.status_code == 200:
            students = response.json()
            cache = {}
            for student in students:
                if student.get('face_descriptor'):
                    # Converter string JSON para numpy array
                    embedding = np.array(json.loads(student['face_descriptor']))
                    cache[student['id']] = {
                        'name': student['name'],
                        'embedding': embedding,
                        'guardian_phone': student.get('guardian_phone', ''),
                        'class_name': student.get('class_name', '')
                    }
            return cache
        return {}
    except Exception as e:
        print(f"❌ Erro ao carregar embeddings: {e}")
        return {}


def find_matching_student(face_embedding, school_embeddings):
    """Encontra aluno correspondente comparando embeddings"""
    best_match = None
    best_similarity = -1
    
    for student_id, data in school_embeddings.items():
        # Calcular similaridade cosseno
        similarity = np.dot(face_embedding, data['embedding']) / (
            np.linalg.norm(face_embedding) * np.linalg.norm(data['embedding'])
        )
        
        if similarity > best_similarity and similarity > SIMILARITY_THRESHOLD:
            best_similarity = similarity
            best_match = {
                'id': student_id,
                'name': data['name'],
                'similarity': float(similarity),
                'guardian_phone': data['guardian_phone'],
                'class_name': data['class_name']
            }
    
    return best_match


def send_whatsapp_notification(phone, student_name, school_name, timestamp):
    """Envia notificação via WhatsApp usando whapi.cloud"""
    if not WHAPI_TOKEN or not phone:
        print("⚠️ WhatsApp não configurado ou telefone ausente")
        return False
    
    try:
        # Formatar telefone (remover caracteres especiais)
        phone_clean = ''.join(filter(str.isdigit, phone))
        if not phone_clean.startswith('55'):
            phone_clean = '55' + phone_clean
        
        message = f"""
🎓 *EduFocus - Notificação de Entrada*

✅ O aluno *{student_name}* chegou à escola!

🏫 Escola: {school_name}
🕐 Horário: {timestamp}

_Mensagem automática do sistema EduFocus_
        """.strip()
        
        headers = {
            'Authorization': f'Bearer {WHAPI_TOKEN}',
            'Content-Type': 'application/json'
        }
        
        payload = {
            'to': phone_clean,
            'body': message
        }
        
        response = requests.post(
            f'{WHAPI_URL}/messages/text',
            headers=headers,
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            print(f"✅ WhatsApp enviado para {phone_clean}")
            return True
        else:
            print(f"❌ Erro WhatsApp: {response.status_code} - {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao enviar WhatsApp: {e}")
        return False


def register_entry(school_id, student_id, student_name):
    """Registra entrada do aluno na API"""
    try:
        response = requests.post(
            f'{EDUFOCUS_API}/api/school/{school_id}/attendance',
            json={
                'student_id': student_id,
                'type': 'entry',
                'timestamp': datetime.now().isoformat()
            },
            timeout=5
        )
        return response.status_code == 200
    except Exception as e:
        print(f"❌ Erro ao registrar entrada: {e}")
        return False


@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({'status': 'ok', 'service': 'facial-recognition'})


@app.route('/process-frame', methods=['POST'])
def process_frame():
    """Processa frame de vídeo e detecta rostos"""
    try:
        data = request.json
        school_id = data.get('school_id')
        frame_base64 = data.get('frame')
        
        if not school_id or not frame_base64:
            return jsonify({'error': 'Missing school_id or frame'}), 400
        
        # Decodificar imagem
        img_data = base64.b64decode(frame_base64.split(',')[1] if ',' in frame_base64 else frame_base64)
        nparr = np.frombuffer(img_data, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detectar rostos
        faces = face_app.get(frame)
        
        if not faces:
            return jsonify({'detected': False, 'faces': []})
        
        # Carregar embeddings da escola (com cache)
        cache_key = f'school_{school_id}'
        if cache_key not in embeddings_cache:
            embeddings_cache[cache_key] = load_embeddings_from_api(school_id)
        
        school_embeddings = embeddings_cache[cache_key]
        
        results = []
        for face in faces:
            embedding = face.embedding
            
            # Buscar correspondência
            match = find_matching_student(embedding, school_embeddings)
            
            if match:
                # Registrar entrada
                register_entry(school_id, match['id'], match['name'])
                
                # Enviar WhatsApp
                timestamp = datetime.now().strftime('%d/%m/%Y %H:%M:%S')
                send_whatsapp_notification(
                    match['guardian_phone'],
                    match['name'],
                    f"Escola ID {school_id}",  # Pode buscar nome da escola da API
                    timestamp
                )
                
                results.append({
                    'detected': True,
                    'student_id': match['id'],
                    'student_name': match['name'],
                    'similarity': match['similarity'],
                    'class': match['class_name'],
                    'bbox': face.bbox.tolist(),
                    'timestamp': timestamp
                })
        
        return jsonify({
            'detected': len(results) > 0,
            'faces': results
        })
        
    except Exception as e:
        print(f"❌ Erro ao processar frame: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/register-face', methods=['POST'])
def register_face():
    """Registra novo rosto de aluno"""
    try:
        data = request.json
        student_id = data.get('student_id')
        image_base64 = data.get('image')
        
        if not student_id or not image_base64:
            return jsonify({'error': 'Missing student_id or image'}), 400
        
        # Decodificar imagem
        img_data = base64.b64decode(image_base64.split(',')[1] if ',' in image_base64 else image_base64)
        nparr = np.frombuffer(img_data, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        
        # Detectar rosto
        faces = face_app.get(img)
        
        if not faces:
            return jsonify({'error': 'No face detected'}), 400
        
        if len(faces) > 1:
            return jsonify({'error': 'Multiple faces detected. Please ensure only one face is visible.'}), 400
        
        # Extrair embedding
        embedding = faces[0].embedding
        
        # Converter para lista para JSON
        embedding_list = embedding.tolist()
        
        return jsonify({
            'success': True,
            'embedding': embedding_list,
            'message': 'Face registered successfully'
        })
        
    except Exception as e:
        print(f"❌ Erro ao registrar rosto: {e}")
        return jsonify({'error': str(e)}), 500


@app.route('/reload-embeddings/<school_id>', methods=['POST'])
def reload_embeddings(school_id):
    """Recarrega embeddings de uma escola"""
    try:
        cache_key = f'school_{school_id}'
        embeddings_cache[cache_key] = load_embeddings_from_api(school_id)
        return jsonify({
            'success': True,
            'count': len(embeddings_cache[cache_key])
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    print("🚀 Iniciando serviço de reconhecimento facial...")
    print(f"📡 EduFocus API: {EDUFOCUS_API}")
    print(f"📱 WhatsApp: {'Configurado' if WHAPI_TOKEN else 'Não configurado'}")
    socketio.run(app, host='0.0.0.0', port=5001, debug=True)
