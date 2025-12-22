# 🎯 GUIA RÁPIDO - RECONHECIMENTO FACIAL

## ⚡ INÍCIO RÁPIDO (3 Passos)

### 1️⃣ INSTALAR (Uma vez)
```bash
# Clique duas vezes no arquivo:
INSTALL_FACIAL_RECOGNITION.bat

# Aguarde a instalação terminar
# Edite o arquivo: facial-recognition\.env
# Cole seu WHAPI_TOKEN
```

### 2️⃣ INICIAR SERVIÇOS
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Python (IMPORTANTE!)
START_FACIAL_RECOGNITION.bat

# Terminal 3 - Frontend
cd client
npm start
```

### 3️⃣ USAR
```
1. Login na escola
2. Cadastrar aluno com FOTO
3. Abrir câmera de entrada
4. ✅ PRONTO! Sistema reconhece automaticamente
```

---

## 📸 CADASTRANDO ALUNO

### Passo a Passo:
```
1. Login → Painel da Escola
2. Clicar em "Alunos"
3. Clicar em "Cadastrar Aluno"
4. Preencher:
   ┌─────────────────────────────┐
   │ Nome: João Silva            │
   │ Email: mae@email.com        │
   │ Telefone: 5511999999999     │ ← IMPORTANTE!
   │ Turma: 6º Ano A             │
   │ Idade: 12                   │
   │ Foto: [Escolher arquivo]    │ ← IMPORTANTE!
   └─────────────────────────────┘
5. Escolher foto do aluno
6. Aguardar mensagem: "✅ Rosto detectado!"
7. Clicar em "Cadastrar"
8. ✅ Aluno pronto para reconhecimento!
```

### ⚠️ IMPORTANTE - Foto do Aluno:
```
✅ Rosto de frente
✅ Boa iluminação
✅ Apenas 1 pessoa
✅ Foto clara e nítida
✅ Sem óculos escuros
✅ Sem máscara
```

---

## 📹 USANDO CÂMERA DE ENTRADA

### Ativar:
```
1. Login → Painel da Escola
2. Clicar em "Câmeras"
3. Clicar em "📸 Abrir Câmera de Entrada"
4. Permitir acesso à webcam
5. ✅ Sistema ativo!
```

### O que acontece:
```
Aluno aparece na câmera
        ↓
┌──────────────────────────┐
│  [Retângulo Verde]       │  ← Rosto detectado
│  João Silva              │  ← Nome exibido
│  6º Ano A                │  ← Turma
│  07:30:15                │  ← Horário
└──────────────────────────┘
        ↓
✅ Entrada registrada
✅ WhatsApp enviado
✅ Histórico atualizado
```

---

## 📱 WHATSAPP - CONFIGURAÇÃO

### Obter Token:
```
1. Acessar: https://whapi.cloud
2. Criar conta (grátis)
3. Conectar WhatsApp
4. Copiar TOKEN
5. Colar em: facial-recognition\.env
   
   WHAPI_TOKEN=cole_aqui
   
6. Reiniciar serviço Python
7. ✅ Pronto!
```

### Formato do Telefone:
```
❌ ERRADO:
   (11) 99999-9999
   11 99999-9999
   11999999999

✅ CORRETO:
   5511999999999
   
   55 = Brasil
   11 = DDD
   999999999 = Número
```

---

## 🔍 VERIFICANDO SE ESTÁ FUNCIONANDO

### Checklist:
```
□ Serviço Python rodando?
  → Abrir: http://localhost:5001/health
  → Deve mostrar: {"status":"ok"}

□ Aluno cadastrado com foto?
  → Ver na lista de alunos
  → Foto deve estar visível

□ Telefone no formato correto?
  → 5511999999999

□ WHAPI_TOKEN configurado?
  → Ver arquivo: facial-recognition\.env

□ Câmera funcionando?
  → Deve mostrar vídeo ao vivo
```

---

## ⚠️ PROBLEMAS COMUNS

### "Serviço Offline"
```
SOLUÇÃO:
cd facial-recognition
venv\Scripts\activate
python app.py
```

### "Nenhum rosto detectado"
```
SOLUÇÃO:
- Melhorar iluminação
- Rosto de frente
- Foto mais clara
- Apenas 1 pessoa na foto
```

### "WhatsApp não envia"
```
SOLUÇÃO:
1. Verificar WHAPI_TOKEN no .env
2. Verificar telefone: 5511999999999
3. Testar em: https://whapi.cloud
```

### "Não reconhece o aluno"
```
SOLUÇÃO:
1. Recadastrar com foto melhor
2. Ajustar SIMILARITY_THRESHOLD em app.py
3. Verificar iluminação da câmera
```

---

## 📊 MONITORAMENTO

### Ver Logs:
```
PYTHON (Reconhecimento):
→ Console onde rodou: python app.py
→ Mostra: Detecções, WhatsApp enviados, erros

NODE.JS (Backend):
→ Console onde rodou: npm start
→ Mostra: Requisições, banco de dados

FRONTEND (React):
→ F12 → Console
→ Mostra: Erros de interface
```

### Histórico de Entrada:
```
1. Painel da Escola
2. Câmeras
3. Ver "Últimas Detecções"
   
   ┌────────────────────────┐
   │ João Silva             │
   │ 6º Ano A               │
   │ 04/12/2024 07:30:15    │
   │ Confiança: 85.3%       │
   └────────────────────────┘
```

---

## 🎯 RESUMO VISUAL

```
FLUXO COMPLETO:

1. CADASTRO (Uma vez)
   ┌──────────┐
   │  FOTO    │ → Python → Embedding → Banco
   └──────────┘

2. RECONHECIMENTO (Automático)
   ┌──────────┐
   │  CÂMERA  │ → Python → Compara → Reconhece
   └──────────┘
                              ↓
                    ┌─────────────────┐
                    │ 1. Registra     │
                    │ 2. WhatsApp     │
                    │ 3. Exibe tela   │
                    └─────────────────┘
```

---

## ✅ TUDO PRONTO!

```
Sistema 100% funcional!

✅ Cadastro com foto
✅ Reconhecimento automático
✅ WhatsApp para responsáveis
✅ Histórico de entradas
✅ Interface moderna

Basta configurar o WHAPI_TOKEN e usar!
```

---

**Dúvidas? Consulte:**
- `RESUMO_RECONHECIMENTO_FACIAL.md` - Resumo completo
- `CONFIGURACAO_WHATSAPP.md` - Guia WhatsApp
- `facial-recognition/README.md` - Documentação técnica
