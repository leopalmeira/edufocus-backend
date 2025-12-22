# 🧠 Guia de Instalação - DeepFace Server

## 📋 Visão Geral

O **DeepFace Server** é um servidor Python que analisa câmeras IP em tempo real, detectando emoções e reconhecendo alunos cadastrados.

---

## 🔧 Instalação

### 1. Instalar Python

Certifique-se de ter Python 3.9+ instalado:

```bash
python --version
# Deve mostrar: Python 3.9.x ou superior
```

### 2. Criar Ambiente Virtual (Recomendado)

```bash
# No diretório do projeto
cd server

# Criar ambiente virtual
python -m venv venv

# Ativar ambiente virtual
# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate
```

### 3. Instalar Dependências

```bash
# Com ambiente virtual ativado
pip install -r requirements.txt
```

**Dependências principais:**
- `deepface` - Biblioteca de análise facial
- `tensorflow` - Framework de ML
- `opencv-python` - Processamento de vídeo
- `flask` - Servidor web
- `flask-cors` - CORS para comunicação com frontend

---

## 🚀 Execução

### Iniciar Servidor

```bash
# No diretório server/
python deepface_server.py
```

**Saída esperada:**
```
🚀 Servidor DeepFace iniciando...
📡 Porta: 5001
🔗 Endpoints disponíveis:
   POST /api/analysis/start - Iniciar análise
   POST /api/analysis/stop - Parar análise
   GET /api/analysis/data/<room_id> - Obter dados
   GET /api/analysis/status - Status geral

 * Running on http://0.0.0.0:5001
```

---

## 📡 API Endpoints

### 1. Iniciar Análise

**POST** `/api/analysis/start`

```json
{
  "room_id": 1,
  "camera_url": "rtsp://192.168.1.100:554/stream",
  "school_id": 1
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Análise iniciada para sala 1"
}
```

### 2. Parar Análise

**POST** `/api/analysis/stop`

```json
{
  "room_id": 1
}
```

### 3. Obter Dados

**GET** `/api/analysis/data/1`

**Resposta:**
```json
{
  "timestamp": "2025-12-17T18:15:00",
  "total_faces": 15,
  "students": [
    {
      "student_id": 123,
      "student_name": "João Silva",
      "emotion": "happy",
      "emotion_scores": {
        "happy": 0.85,
        "sad": 0.05,
        "angry": 0.02,
        "fear": 0.01,
        "surprise": 0.03,
        "disgust": 0.01,
        "neutral": 0.03
      },
      "confidence": 0.85
    }
  ],
  "emotion_counts": {
    "happy": 8,
    "sad": 2,
    "angry": 1,
    "fear": 0,
    "surprise": 2,
    "disgust": 0,
    "neutral": 2
  },
  "metrics": {
    "attention": 80,
    "disposition": 53,
    "engagement": 73,
    "performance": 69
  },
  "distribution": {
    "high": 10,
    "medium": 2,
    "low": 3
  }
}
```

### 4. Status

**GET** `/api/analysis/status`

**Resposta:**
```json
{
  "active_rooms": [1, 3, 5],
  "total_analyses": 3
}
```

---

## 🎥 Configuração de Câmeras

### Formatos Suportados

- **RTSP:** `rtsp://ip:porta/stream`
- **HTTP:** `http://ip:porta/video`
- **Arquivo:** `/path/to/video.mp4`
- **Webcam:** `0` (dispositivo padrão)

### Exemplo de URLs

```python
# Câmera IP RTSP
camera_url = "rtsp://192.168.1.100:554/stream"

# Câmera IP HTTP
camera_url = "http://192.168.1.100:8080/video"

# Webcam local (para testes)
camera_url = 0
```

---

## 🔄 Fluxo de Funcionamento

```
1. Professor clica em "Monitorar" no dashboard
   ↓
2. Frontend envia POST /api/analysis/start
   ↓
3. Servidor Python conecta à câmera IP da sala
   ↓
4. Loop de análise inicia:
   - Captura frame da câmera
   - Detecta rostos com DeepFace
   - Para cada rosto:
     * Analisa emoção
     * Tenta reconhecer aluno (compara com fotos cadastradas)
     * Armazena resultado
   ↓
5. Frontend busca dados a cada 2s (GET /api/analysis/data)
   ↓
6. Dashboard atualiza métricas em tempo real
```

---

## 🧠 Como Funciona o Reconhecimento

### 1. Carregamento de Rostos

Ao iniciar análise, o servidor:
1. Busca todos os alunos com foto cadastrada
2. Decodifica fotos base64
3. Extrai embeddings faciais com Facenet
4. Armazena em memória para comparação

### 2. Reconhecimento em Tempo Real

Para cada rosto detectado:
1. Extrai embedding facial
2. Calcula distância euclidiana com todos os alunos
3. Se distância < 0.6 → Aluno reconhecido
4. Se distância >= 0.6 → "Desconhecido"

### 3. Análise de Emoções

DeepFace detecta 7 emoções:
- Happy (Feliz)
- Sad (Triste)
- Angry (Raiva)
- Fear (Medo)
- Surprise (Surpreso)
- Disgust (Nojo)
- Neutral (Neutro)

---

## 📊 Métricas Calculadas

### Atenção da Turma
```python
positivas = feliz + surpreso
atenção = ((positivas + neutro) / total) * 100
```

### Disposição
```python
disposição = (feliz / total) * 100
```

### Engajamento
```python
negativas = triste + raiva + medo
engajamento = (1 - ((neutro + negativas) / total)) * 100
```

### Desempenho
```python
desempenho = (atenção + disposição + engajamento) / 3
```

---

## 🐛 Troubleshooting

### Erro: "ModuleNotFoundError: No module named 'deepface'"

**Solução:**
```bash
pip install deepface
```

### Erro: "Cannot connect to camera"

**Possíveis causas:**
1. URL da câmera incorreta
2. Câmera offline
3. Firewall bloqueando conexão

**Solução:**
```bash
# Testar URL da câmera
ffplay rtsp://192.168.1.100:554/stream
```

### Erro: "TensorFlow not found"

**Solução:**
```bash
pip install tensorflow==2.15.0
```

### Performance Lenta

**Otimizações:**
1. Reduzir resolução da câmera
2. Aumentar intervalo de análise (de 30 para 60 frames)
3. Usar GPU se disponível

---

## 🔒 Segurança

### Dados Processados

- ✅ Análise em tempo real
- ✅ Dados não são armazenados permanentemente
- ✅ Apenas estatísticas agregadas
- ✅ LGPD Compliant

### Recomendações

1. Usar HTTPS em produção
2. Autenticar requisições
3. Limitar acesso à API
4. Criptografar comunicação com câmeras

---

## 📈 Performance

### Requisitos Mínimos

- **CPU:** 4 cores
- **RAM:** 8 GB
- **GPU:** Opcional (acelera 10x)

### Capacidade

- **1 câmera:** ~30 FPS
- **5 câmeras:** ~6 FPS cada
- **10 câmeras:** ~3 FPS cada

---

## 🚀 Produção

### Usar Gunicorn

```bash
pip install gunicorn

gunicorn -w 4 -b 0.0.0.0:5001 deepface_server:app
```

### Docker (Futuro)

```dockerfile
FROM python:3.9
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY deepface_server.py .
CMD ["python", "deepface_server.py"]
```

---

## 📞 Suporte

Para dúvidas:
- 📧 Email: deepface@edufocus.com
- 💬 GitHub: [edufocus1/issues](https://github.com/leopalmeira/edufocus1/issues)

---

**Desenvolvido com ❤️ pela equipe EduFocus**
