# 🎓 EduFocus - Sistema de Reconhecimento Facial

## 📋 Pré-requisitos

### Backend Node.js (já instalado)
- Node.js 16+
- SQLite3

### Serviço de Reconhecimento Facial (Python)
- Python 3.10
- Visual Studio Build Tools (Windows)
- Webcam ou câmera IP

## 🚀 Instalação do Serviço de Reconhecimento Facial

### 1. Instalar Python 3.10
Baixe e instale do site oficial: https://www.python.org/downloads/

### 2. Instalar Visual Studio Build Tools (Windows)
```bash
# Baixe de: https://visualstudio.microsoft.com/visual-cpp-build-tools/
# Instale com: "Desktop development with C++"
```

### 3. Criar ambiente virtual Python
```bash
cd facial-recognition
python -m venv venv
```

### 4. Ativar ambiente virtual
```bash
# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 5. Instalar dependências
```bash
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt
```

### 6. Configurar variáveis de ambiente
Crie um arquivo `.env` na pasta `facial-recognition`:

```env
# URL da API do EduFocus
EDUFOCUS_API_URL=http://localhost:5000

# Credenciais WhatsApp (whapi.cloud)
WHAPI_TOKEN=seu_token_aqui
WHAPI_URL=https://gate.whapi.cloud
```

## 📱 Configurar WhatsApp (whapi.cloud)

### 1. Criar conta no whapi.cloud
- Acesse: https://whapi.cloud
- Crie uma conta gratuita
- Conecte seu número do WhatsApp

### 2. Obter Token
- No painel do whapi.cloud, copie seu token de API
- Cole no arquivo `.env` em `WHAPI_TOKEN`

## ▶️ Executar o Sistema

### 1. Iniciar Backend Node.js
```bash
cd server
npm start
```

### 2. Iniciar Serviço de Reconhecimento Facial
```bash
cd facial-recognition
venv\Scripts\activate  # Windows
python app.py
```

### 3. Iniciar Frontend React
```bash
cd client
npm start
```

## 🎯 Como Usar

### 1. Cadastrar Aluno com Foto
1. Faça login como administrador da escola
2. Vá em "Alunos" → "Adicionar Aluno"
3. Preencha os dados do aluno
4. **IMPORTANTE**: Tire uma foto do rosto do aluno (use a webcam)
5. O sistema irá automaticamente gerar o embedding facial

### 2. Ativar Câmera de Entrada
1. No painel da escola, vá em "Câmeras"
2. Clique em "Iniciar Monitoramento"
3. Permita acesso à webcam
4. O sistema começará a detectar rostos automaticamente

### 3. Funcionamento Automático
Quando um aluno chegar:
1. O sistema detecta o rosto via câmera
2. Compara com o banco de dados de alunos
3. Se reconhecido:
   - Registra a entrada no banco de dados
   - Envia notificação WhatsApp para o responsável
   - Exibe o nome do aluno na tela

## 🔧 Solução de Problemas

### Erro: "Serviço Offline"
- Verifique se o serviço Python está rodando na porta 5001
- Execute: `python app.py` na pasta `facial-recognition`

### Erro: "No face detected"
- Certifique-se de que há boa iluminação
- O rosto deve estar de frente para a câmera
- Apenas um rosto deve estar visível na foto

### WhatsApp não envia
- Verifique se o `WHAPI_TOKEN` está correto no `.env`
- Confirme que o número do responsável está no formato: `5511999999999`
- Verifique se sua conta whapi.cloud está ativa

### Baixa precisão de reconhecimento
- Ajuste o `SIMILARITY_THRESHOLD` em `facial-recognition/app.py`
- Valor padrão: 0.4 (quanto menor, mais rigoroso)
- Valores sugeridos: 0.3 (rigoroso) a 0.5 (flexível)

## 📊 Estrutura de Dados

### Embedding Facial
O sistema usa InsightFace para gerar um vetor de 512 dimensões que representa o rosto do aluno. Este vetor é armazenado no campo `face_descriptor` da tabela `students`.

### Tabela de Presença
```sql
CREATE TABLE attendance (
  id INTEGER PRIMARY KEY,
  student_id INTEGER,
  type TEXT,  -- 'entry' ou 'exit'
  timestamp DATETIME
);
```

## 🔒 Segurança

- Os embeddings faciais são armazenados de forma criptografada
- Apenas administradores da escola podem acessar os dados
- As imagens originais não são armazenadas (apenas embeddings)
- Comunicação com WhatsApp é criptografada (TLS)

## 📞 Suporte

Para dúvidas ou problemas:
- Email: suporte@edufocus.com
- WhatsApp: (11) 99999-9999

## 📝 Licença

Copyright © 2024 EduFocus. Todos os direitos reservados.
