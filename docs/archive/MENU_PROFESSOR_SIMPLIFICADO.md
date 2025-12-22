# 🎯 MENU DO PROFESSOR SIMPLIFICADO - 5 OPÇÕES

## ✅ Alterações Implementadas

### 📋 **Novo Menu Lateral**

O menu do professor foi simplificado para conter apenas **5 opções essenciais**:

1. **📊 Dashboard** - Visão geral com métricas em tempo real
2. **🔄 Rodízio de Carteiras** - Gestão inteligente de posições
3. **💬 Interatividade** - Sistema de enquetes com countdown
4. **👥 Alunos** - Visualização de todos os alunos
5. **🔔 Mensagens** - Mensagens da escola (NOVO)

---

## 🆕 NOVA FUNCIONALIDADE: MENSAGENS

### Descrição
Aba dedicada para o professor receber mensagens da administração da escola. Quando a escola enviar uma mensagem para o professor através do painel da escola, ela aparecerá aqui.

### Características
- ✅ **Badge de notificação** no menu (contador de não lidas)
- ✅ **Marcação visual** de mensagens novas (fundo azul)
- ✅ **Badge "NOVA"** em mensagens não lidas
- ✅ **Botão "Marcar como lida"** para cada mensagem
- ✅ **Atualização automática** do contador
- ✅ **Botão de atualizar** no header
- ✅ **Mensagem vazia** quando não há mensagens

### Interface
```
┌─────────────────────────────────────────┐
│  🔔 Mensagens (3)  ← Badge no menu      │
├─────────────────────────────────────────┤
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ [NOVA] Reunião Pedagógica         │ │
│  │ De: Administração • 12/12 08:30   │ │
│  │                                   │ │
│  │ Convocamos todos os professores   │ │
│  │ para reunião...                   │ │
│  │                                   │ │
│  │          [✓ Marcar como lida]    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │ Atualização de Horários           │ │
│  │ De: Coordenação • 11/12 14:20     │ │
│  │                                   │ │
│  │ Informamos que...                 │ │
│  └───────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 🔧 IMPLEMENTAÇÃO TÉCNICA

### Frontend (`TeacherDashboard.jsx`)

#### Estados Adicionados
```javascript
const [messages, setMessages] = useState([]);
const [unreadCount, setUnreadCount] = useState(0);
```

#### Funções Criadas
```javascript
// Carregar mensagens
const loadMessages = async () => {
    const res = await api.get('/teacher/messages');
    setMessages(res.data || []);
    const unread = (res.data || []).filter(m => !m.read).length;
    setUnreadCount(unread);
};

// Marcar como lida
const markAsRead = async (messageId) => {
    await api.put(`/teacher/messages/${messageId}/read`);
    setMessages(prev => prev.map(m => 
        m.id === messageId ? { ...m, read: true } : m
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
};
```

#### Componente MessagesTab
```javascript
function MessagesTab({ messages, onMarkAsRead, onRefresh }) {
    // Renderiza lista de mensagens
    // Badge "NOVA" para não lidas
    // Botão "Marcar como lida"
    // Estado vazio quando sem mensagens
}
```

### CSS (`TeacherDashboardFixed.css`)

#### Badge do Menu
```css
.menu-badge {
    position: absolute;
    top: 10px;
    right: 10px;
    background: var(--danger);
    color: white;
    min-width: 20px;
    height: 20px;
    border-radius: 10px;
    font-size: 0.7rem;
    font-weight: bold;
}
```

---

## 🌐 ENDPOINTS NECESSÁRIOS (Backend)

### GET `/api/teacher/messages`
**Descrição**: Retorna todas as mensagens para o professor logado

**Resposta**:
```json
[
    {
        "id": 1,
        "subject": "Reunião Pedagógica",
        "message": "Convocamos todos os professores...",
        "from": "Administração",
        "read": false,
        "created_at": "2025-12-12T08:30:00Z"
    }
]
```

### PUT `/api/teacher/messages/:id/read`
**Descrição**: Marca uma mensagem como lida

**Resposta**:
```json
{
    "success": true
}
```

---

## 📊 ESTRUTURA DO MENU

### Ordem das Opções
1. **Dashboard** (📊 BarChart3)
2. **Rodízio de Carteiras** (🔄 Shuffle)
3. **Interatividade** (💬 MessageSquare)
4. **Alunos** (👥 Users)
5. **Mensagens** (🔔 Bell) + Badge

### Removidas
- ❌ Relatórios
- ❌ Planejamento
- ❌ Configurações
- ❌ Ajuda

---

## ✨ FUNCIONALIDADES POR ABA

### 1. Dashboard
- ✅ 4 métricas em tempo real (Atenção, Disposição, Desempenho, Engajamento)
- ✅ Sistema de monitoramento com botão INICIAR/PARAR
- ✅ Informações da turma (6 cards)
- ✅ Alertas recentes com badges
- ✅ Distribuição por nível (Alta/Média/Baixa)

### 2. Rodízio de Carteiras
- ✅ Status do rodízio (última mudança)
- ✅ Alerta após 15 dias
- ✅ Botão "Reorganizar Agora"
- ✅ Visualização da disposição atual
- ✅ Grid com fotos e posições

### 3. Interatividade
- ✅ Criar enquete (pergunta + 4 opções)
- ✅ Seleção de resposta correta
- ✅ Countdown de 5 segundos
- ✅ Captura automática de respostas
- ✅ Histórico de enquetes

### 4. Alunos
- ✅ Grid de alunos com fotos
- ✅ Emoção atual detectada
- ✅ Nome e idade
- ✅ Clique para ver relatório

### 5. Mensagens (NOVO)
- ✅ Lista de mensagens da escola
- ✅ Badge de contador no menu
- ✅ Marcação visual de novas
- ✅ Botão marcar como lida
- ✅ Atualização em tempo real

---

## 🎨 DESIGN

### Cores
- **Menu ativo**: Azul (#6366f1)
- **Badge não lida**: Vermelho (#ef4444)
- **Mensagem nova**: Fundo azul claro
- **Mensagem lida**: Fundo cinza escuro

### Ícones (Lucide React)
- BarChart3 - Dashboard
- Shuffle - Rodízio
- MessageSquare - Interatividade
- Users - Alunos
- Bell - Mensagens

---

## 📱 RESPONSIVIDADE

### Desktop
- ✅ Menu lateral sempre visível
- ✅ Badge posicionado no canto direito

### Tablet
- ✅ Menu retrátil com hover
- ✅ Badge visível mesmo retraído

### Mobile
- ✅ Menu em overlay
- ✅ Badge no botão toggle

---

## 🚀 COMO USAR

### Acessar Mensagens
1. Faça login como professor
2. Selecione uma turma
3. Clique em "Mensagens" no menu
4. Veja as mensagens da escola
5. Clique em "Marcar como lida" para remover o badge

### Enviar Mensagem (Escola)
1. Acesse o painel da escola
2. Vá em "Professores"
3. Clique em "Enviar Mensagem" no card do professor
4. Digite a mensagem
5. Envie
6. Professor verá no painel dele

---

## 📄 ARQUIVOS MODIFICADOS

### Frontend
- ✅ `client/src/pages/TeacherDashboard.jsx`
  - Adicionados estados de mensagens
  - Criadas funções loadMessages e markAsRead
  - Menu simplificado para 5 opções
  - Componente MessagesTab adicionado

- ✅ `client/src/styles/TeacherDashboardFixed.css`
  - Estilo .menu-badge adicionado

### Backend (Pendente)
- ⏳ `server/server.js`
  - Endpoint GET /api/teacher/messages
  - Endpoint PUT /api/teacher/messages/:id/read

### Banco de Dados (Pendente)
- ⏳ Tabela `teacher_messages` ou similar
  - id, teacher_id, subject, message, from, read, created_at

---

## ✅ CHECKLIST

### Frontend
- [x] Menu simplificado (5 opções)
- [x] Estados de mensagens
- [x] Função loadMessages
- [x] Função markAsRead
- [x] Componente MessagesTab
- [x] Badge no menu
- [x] Estilo CSS do badge

### Backend
- [ ] Endpoint GET /api/teacher/messages
- [ ] Endpoint PUT /api/teacher/messages/:id/read
- [ ] Tabela no banco de dados
- [ ] Integração com painel da escola

---

## 🎯 PRÓXIMOS PASSOS

1. **Criar endpoints no backend**
   - GET /api/teacher/messages
   - PUT /api/teacher/messages/:id/read

2. **Criar tabela no banco**
   - teacher_messages ou messages

3. **Integrar com painel da escola**
   - Botão "Enviar Mensagem" no card do professor
   - Modal para escrever mensagem
   - Salvar no banco

4. **Testar fluxo completo**
   - Escola envia mensagem
   - Professor recebe
   - Badge aparece
   - Professor marca como lida
   - Badge desaparece

---

**🎉 MENU SIMPLIFICADO E FUNCIONAL!**

5 opções essenciais + Sistema de Mensagens integrado! 📬

---

*Última atualização: 12/12/2025 08:51*
