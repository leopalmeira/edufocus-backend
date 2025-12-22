# 📹 SISTEMA DE PORTARIA - CÂMERA AUTOMÁTICA

## 🎯 COMO FUNCIONA:

### **CÂMERA NA PORTARIA DA ESCOLA**
- Computador/Tablet dedicado na entrada da escola
- Câmera rodando 24/7 (ou durante horário escolar)
- **TOTALMENTE AUTOMÁTICO** - não depende de professor
- Reconhece alunos e envia WhatsApp instantaneamente

---

## 🚀 CONFIGURAÇÃO INICIAL:

### **1. Preparar Computador/Tablet da Portaria**

**Requisitos:**
- Computador ou tablet com webcam
- Navegador Chrome/Edge atualizado
- Conexão com internet
- Deixar ligado durante horário escolar

### **2. Configurar Escola**

Antes de usar a portaria, configure no navegador:

```javascript
// Abra o Console do navegador (F12) e execute:
localStorage.setItem('gateway_school_id', '1');  // ID da escola
localStorage.setItem('gateway_school_name', 'Escola Municipal São Paulo');
```

Ou crie uma página de configuração simples.

---

## 📱 COMO USAR:

### **PASSO 1: Abrir Página da Portaria**

No computador da portaria, acesse:
```
http://localhost:5173/gateway
```

Ou em produção:
```
https://seudominio.com/gateway
```

### **PASSO 2: Ativar Câmera**

1. Clique em **"Ativar Câmera"**
2. Permita acesso à webcam
3. Câmera começa a funcionar **AUTOMATICAMENTE**

### **PASSO 3: Deixar Rodando**

**Pronto!** Agora é só deixar o computador ligado.

---

## ⚡ FLUXO AUTOMÁTICO:

```
07:25 - Porteiro liga computador e ativa câmera
   ↓
07:30 - João passa pela portaria
   ↓
07:30:02 - Câmera detecta e reconhece João
   ↓
07:30:03 - Sistema registra presença automaticamente
   ↓
07:30:04 - WhatsApp enviado para pais de João
   ↓
07:30:05 - Pais recebem: "João chegou às 07:30"
   ↓
07:35 - Maria passa pela portaria
   ↓
07:35:02 - Câmera detecta e reconhece Maria
   ↓
07:35:03 - Sistema registra presença automaticamente
   ↓
07:35:04 - WhatsApp enviado para pais de Maria
   ↓
... E ASSIM POR DIANTE, AUTOMÁTICO! ⚡
```

---

## 📊 PAINEL DA ESCOLA VÊ TUDO:

### **Aba "Presença" no Dashboard da Escola:**
- ✅ Vê todos os alunos que chegaram
- ✅ Horário de chegada de cada um
- ✅ Relatórios de presença
- ✅ Estatísticas em tempo real

### **Aba "Relatórios":**
- ✅ Relatório diário de presenças
- ✅ Filtrar por aluno
- ✅ Filtrar por data
- ✅ Exportar dados

---

## 🖥️ INTERFACE DA PORTARIA:

### **Tela Principal:**
```
┌─────────────────────────────────────────────────┐
│  📹 Portaria - Escola Municipal São Paulo       │
│  🟢 Online                    [Desativar Câmera]│
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌─────────────────────┐  ┌─────────────────┐ │
│  │                     │  │  📊 Estatísticas│ │
│  │   [VÍDEO CÂMERA]    │  │                 │ │
│  │                     │  │  Hoje: 45       │ │
│  │   João Silva ✅     │  │  Total: 320     │ │
│  │                     │  │                 │ │
│  └─────────────────────┘  ├─────────────────┤ │
│                           │  🕐 Últimas     │ │
│                           │                 │ │
│                           │  João - 07:30 📱│ │
│                           │  Maria - 07:35 📱│ │
│                           │  Pedro - 07:40 📱│ │
│                           └─────────────────┘ │
└─────────────────────────────────────────────────┘
```

---

## 🔄 SINCRONIZAÇÃO AUTOMÁTICA:

### **Portaria → Servidor → Escola:**

1. **Portaria detecta aluno** (câmera)
2. **Envia para servidor** (API)
3. **Servidor registra** (banco de dados)
4. **Servidor envia WhatsApp** (Baileys)
5. **Escola vê em tempo real** (dashboard)

**Tudo sincronizado automaticamente!** ⚡

---

## 🛡️ SEGURANÇA:

### **Proteção contra duplicatas:**
- Mesmo aluno só registra 1x a cada 10 segundos
- Evita múltiplos registros se aluno ficar parado na frente da câmera

### **Reconexão automática:**
- Se perder conexão, tenta reconectar automaticamente
- Mostra status "Offline" se sem internet

---

## 📋 CHECKLIST DE INSTALAÇÃO:

### **Pré-requisitos:**
- [ ] WhatsApp da escola conectado (aba WhatsApp no dashboard)
- [ ] Alunos cadastrados com telefone
- [ ] Biometria facial dos alunos registrada
- [ ] Computador/tablet com webcam na portaria

### **Instalação:**
- [ ] Configurar `gateway_school_id` no localStorage
- [ ] Configurar `gateway_school_name` no localStorage
- [ ] Abrir `/gateway` no navegador
- [ ] Ativar câmera
- [ ] Deixar rodando

### **Teste:**
- [ ] Aluno passa na frente da câmera
- [ ] Sistema reconhece (nome aparece na tela)
- [ ] Presença registrada (aparece na lista)
- [ ] WhatsApp enviado (📱 aparece ao lado do nome)
- [ ] Escola vê no dashboard (aba Presença)

---

## 🎯 VANTAGENS:

✅ **Totalmente automático** - não precisa de intervenção manual  
✅ **Independente** - não depende de professor ou sala de aula  
✅ **24/7** - pode ficar rodando o dia todo  
✅ **Instantâneo** - pais recebem notificação em segundos  
✅ **Centralizado** - escola vê tudo no dashboard  
✅ **Confiável** - reconexão automática se cair internet  

---

## 🔧 CONFIGURAÇÃO AVANÇADA:

### **Criar página de configuração:**

Você pode criar uma página `/gateway/setup` para configurar sem usar console:

```jsx
// Exemplo de formulário de setup
<input placeholder="ID da Escola" onChange={e => 
  localStorage.setItem('gateway_school_id', e.target.value)
} />

<input placeholder="Nome da Escola" onChange={e => 
  localStorage.setItem('gateway_school_name', e.target.value)
} />

<button onClick={() => window.location.href = '/gateway'}>
  Salvar e Ir para Portaria
</button>
```

---

## 📞 SUPORTE:

**Problemas comuns:**

1. **Câmera não ativa:**
   - Verifique permissões do navegador
   - Teste em outro navegador
   - Verifique se webcam está funcionando

2. **Não reconhece alunos:**
   - Verifique se biometria foi cadastrada
   - Verifique iluminação da portaria
   - Ajuste posição da câmera

3. **WhatsApp não envia:**
   - Verifique se WhatsApp está conectado (dashboard escola)
   - Verifique se aluno tem telefone cadastrado
   - Verifique conexão com internet

---

## 🎉 PRONTO!

**Sistema de Portaria Automático Funcionando!**

- Câmera na portaria ✅
- Reconhecimento automático ✅
- WhatsApp instantâneo ✅
- Escola vê tudo ✅

**100% AUTOMÁTICO! 🚀**
