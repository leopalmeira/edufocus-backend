# 📹 Sistema Completo de Câmeras - EduFocus

## 🎯 Visão Geral

O EduFocus utiliza **TRÊS tipos de câmeras** com funções completamente diferentes:

1. 📸 **Câmera de Presença** - Entrada da escola (automática)
2. 🎓 **Câmera da Sala** - Dentro da sala (professor acompanha)
3. 🎥 **Câmera de Monitoramento** - Áreas comuns (administração)

---

## 📸 1. CÂMERA DE PRESENÇA (Entrada da Escola)

### Função
Registrar entrada e saída de alunos automaticamente através de reconhecimento facial.

### Localização
- **Entrada principal da escola**
- Posicionada para capturar rostos de quem entra/sai

### Características
- ✅ **Instalada pelo Técnico**
- ✅ **Funciona AUTOMATICAMENTE 24/7**
- ✅ **Reconhece alunos** cadastrados
- ✅ **Registra presença** no banco de dados
- ✅ **Envia WhatsApp** para responsável
- ❌ **Ninguém controla** manualmente

### Fluxo de Funcionamento

```
Aluno chega na escola
   ↓
Câmera reconhece rosto automaticamente
   ↓
Sistema registra presença (entry)
   ↓
Gera card visual (320x120px)
   ↓
Envia WhatsApp para responsável
   ↓
School Admin vê na lista de presenças
```

### Controle de Acesso

| Usuário | Instalar | Ver Presenças | Receber WhatsApp |
|---------|----------|---------------|------------------|
| **Técnico** | ✅ SIM | ❌ NÃO | ❌ NÃO |
| **Professor** | ❌ NÃO | ❌ NÃO | ❌ NÃO |
| **School Admin** | ❌ NÃO | ✅ SIM | ❌ NÃO |
| **Super Admin** | ❌ NÃO | ✅ SIM | ❌ NÃO |
| **Responsável** | ❌ NÃO | ❌ NÃO | ✅ SIM |

### Tecnologia
- Face-API.js - Reconhecimento facial
- TensorFlow.js - Machine Learning
- IP Camera - Sempre ligada
- WhatsApp - Notificações automáticas

---

## 🎓 2. CÂMERA DA SALA (Dentro da Sala de Aula)

### Função
Analisar emoções dos alunos em tempo real durante a aula para o professor acompanhar o engajamento.

### Localização
- **Dentro da sala de aula**
- Posicionada para capturar rostos dos alunos
- Uma câmera por sala

### Características
- ✅ **Instalada pelo Técnico**
- ✅ **Vinculada à sala específica**
- ✅ **Analisa emoções em tempo real**
- ✅ **Dados vão direto para dashboard do professor**
- ✅ **Apenas professor da sala vê**
- ❌ **Outros professores NÃO veem**

### Fluxo de Funcionamento

```
Aula está acontecendo
   ↓
Câmera analisa rostos continuamente
   ↓
Detecta 7 emoções (feliz, triste, raiva, medo, surpreso, nojo, neutro)
   ↓
Calcula métricas:
   - Atenção da turma
   - Disposição
   - Engajamento
   - Desempenho
   ↓
Atualiza dashboard do professor em tempo real
   ↓
Professor acompanha e ajusta aula conforme necessário
```

### O que o Professor VÊ no Dashboard

**Cards de Métricas:**
- 📊 **Atenção da Turma:** 85%
- 😊 **Disposição:** 72%
- 🎯 **Engajamento:** 90%
- 📈 **Desempenho:** 82%

**Distribuição de Emoções:**
- 😊 Feliz: 12 alunos
- 😐 Neutro: 8 alunos
- 😢 Triste: 2 alunos
- 😠 Raiva: 1 aluno

**Alertas Automáticos:**
- ⚠️ "3 alunos com emoções negativas"
- ⚠️ "Disposição abaixo de 65%"
- ⚠️ "Turma muito neutra - possível tédio"

### Controle de Acesso

| Usuário | Instalar | Ver Dados da Sala | Ver Outras Salas |
|---------|----------|-------------------|------------------|
| **Técnico** | ✅ SIM | ❌ NÃO | ❌ NÃO |
| **Professor (da sala)** | ❌ NÃO | ✅ SIM | ❌ NÃO |
| **Professor (outra sala)** | ❌ NÃO | ❌ NÃO | ❌ NÃO |
| **School Admin** | ❌ NÃO | ✅ SIM (todas) | ✅ SIM |
| **Super Admin** | ❌ NÃO | ✅ SIM (todas) | ✅ SIM |

### Privacidade
- ✅ Apenas emoções agregadas
- ✅ Não identifica alunos individualmente
- ✅ Dados não são armazenados
- ✅ Apenas análise em tempo real
- ✅ LGPD Compliant

### Tecnologia
- Face-API.js - Detecção de emoções
- TensorFlow.js - Machine Learning
- IP Camera - Streaming contínuo
- WebSocket - Atualização em tempo real

---

## 🎥 3. CÂMERA DE MONITORAMENTO (Áreas Comuns)

### Função
Monitorar segurança e comportamento geral em áreas comuns da escola.

### Localização
- **Corredores**
- **Pátio**
- **Refeitório**
- **Biblioteca**
- **Entrada/Saída**

### Características
- ✅ **Instalada pelo Técnico**
- ✅ **Vinculada à escola**
- ✅ **Análise de emoções agregadas**
- ✅ **Relatórios gerais**
- ❌ **Professor NÃO tem acesso**

### Controle de Acesso

| Usuário | Instalar | Ver Análises | Ver Relatórios |
|---------|----------|--------------|----------------|
| **Técnico** | ✅ SIM | ❌ NÃO | ❌ NÃO |
| **Professor** | ❌ NÃO | ❌ NÃO | ❌ NÃO |
| **School Admin** | ❌ NÃO | ✅ SIM | ✅ SIM |
| **Super Admin** | ❌ NÃO | ✅ SIM | ✅ SIM |

---

## 🔄 Comparação Completa

| Aspecto | Presença | Sala | Monitoramento |
|---------|----------|------|---------------|
| **Local** | Entrada | Sala de aula | Áreas comuns |
| **Função** | Reconhecer alunos | Analisar emoções | Segurança |
| **Instalação** | Técnico | Técnico | Técnico |
| **Funcionamento** | Automático 24/7 | Durante aula | Contínuo |
| **Professor vê** | ❌ NÃO | ✅ SIM (sua sala) | ❌ NÃO |
| **School Admin vê** | ✅ Presenças | ✅ Todas salas | ✅ Relatórios |
| **Identifica alunos** | ✅ SIM | ❌ NÃO | ❌ NÃO |
| **Analisa emoções** | ❌ NÃO | ✅ SIM | ✅ SIM |
| **Envia WhatsApp** | ✅ SIM | ❌ NÃO | ❌ NÃO |
| **Tempo real** | ✅ SIM | ✅ SIM | ✅ SIM |

---

## 📊 Banco de Dados

### Tabela: `cameras`

```sql
CREATE TABLE cameras (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    school_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    location TEXT,
    ip_address TEXT,
    stream_url TEXT,
    type TEXT NOT NULL,  -- 'presence', 'classroom', 'monitoring'
    room_id INTEGER,     -- ID da sala (se type='classroom')
    status TEXT DEFAULT 'active',
    installed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (room_id) REFERENCES rooms(id)
);
```

### Tipos de Câmera

```javascript
// Câmera de Presença
{
    type: 'presence',
    location: 'Entrada Principal',
    room_id: null
}

// Câmera da Sala
{
    type: 'classroom',
    location: 'Sala 101',
    room_id: 17  // Vinculada à sala específica
}

// Câmera de Monitoramento
{
    type: 'monitoring',
    location: 'Corredor A',
    room_id: null
}
```

---

## 🎯 Dashboard do Professor

### Aba: "Monitoramento da Sala"

**Componente EmotionMonitor:**
- Vídeo ao vivo da sala (opcional)
- Contador de rostos detectados
- Estatísticas de emoções em tempo real

**Cards de Métricas:**
- Atenção da Turma (%)
- Disposição da Turma (%)
- Desempenho (%)
- Engajamento (%)

**Distribuição:**
- Alta Atenção: X alunos
- Média Atenção: Y alunos
- Baixa Atenção: Z alunos

**Alertas:**
- Lista de alertas automáticos
- Recomendações pedagógicas

**Gráficos:**
- Evolução das métricas ao longo da aula
- Distribuição de emoções

---

## 🔐 Regras de Negócio

### RN011 - Câmera de Presença

**Regra:** Funciona automaticamente. School Admin vê presenças. Responsável recebe WhatsApp.

**Validações:**
- Câmera ativa
- Aluno cadastrado
- Foto cadastrada
- Similaridade > 60%
- Sem duplicata no dia

### RN012 - Câmera da Sala

**Regra:** Apenas professor da sala vê dados de emoções em tempo real no seu dashboard.

**Validações:**
- Professor está vinculado à sala
- Câmera está vinculada à mesma sala
- Horário de aula válido
- Dados apenas em tempo real (não armazenados)

### RN013 - Câmera de Monitoramento

**Regra:** Professor não tem acesso. Apenas School Admin e Super Admin.

**Validações:**
- Usuário é school_admin ou super_admin
- Escola corresponde ao usuário

---

## 🚀 Implementação

### Fase Atual (Desenvolvimento)

**Câmera de Presença:**
- ✅ Reconhecimento facial funcional
- ✅ Registro de presença
- ✅ Notificações WhatsApp
- ⏳ Aguardando câmera IP física

**Câmera da Sala:**
- ✅ Componente EmotionMonitor criado
- ✅ Análise de 7 emoções
- ✅ Métricas em tempo real
- ✅ Integrado no TeacherDashboard
- ⏳ Aguardando câmera IP física

**Câmera de Monitoramento:**
- ⏳ A implementar

### Fase Produção (Futuro)

- 🔄 Câmeras IP físicas instaladas
- 🔄 Streaming RTSP/WebRTC
- 🔄 Dashboard de monitoramento completo
- 🔄 Relatórios avançados
- 🔄 Histórico de métricas

---

## ⚠️ REGRAS QUE NUNCA MUDAM

1. ✅ **Câmera de presença** - Automática, escola vê, responsável recebe WhatsApp
2. ✅ **Câmera da sala** - Professor vê APENAS sua sala, dados em tempo real
3. ✅ **Câmera de monitoramento** - Professor NÃO vê
4. ✅ **Professor NÃO vê** outras salas
5. ✅ **Dados de emoções** não são armazenados (apenas tempo real)

---

## 📞 Suporte

Para dúvidas sobre câmeras:
- 📧 Email: cameras@edufocus.com
- 💬 Suporte: suporte@edufocus.com

---

**Desenvolvido com ❤️ pela equipe EduFocus**

**VERSÃO FINAL CORRETA - 17/12/2025**
