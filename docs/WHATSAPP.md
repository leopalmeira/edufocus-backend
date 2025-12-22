# 💬 Integração WhatsApp - EduFocus

## 📋 Visão Geral

O EduFocus permite enviar notificações automáticas para os responsáveis via WhatsApp quando:
- Aluno está ausente
- Aluno está desatento
- Aluno está com emoção negativa
- Mensagens personalizadas do professor

---

## 🚀 Configuração Inicial

### 1. Acessar Painel da Escola

1. Faça login como administrador da escola
2. Vá em **"Configurações"** → **"WhatsApp"**
3. Clique em **"Conectar WhatsApp"**

### 2. Escanear QR Code

1. Um QR Code aparecerá na tela
2. Abra o WhatsApp no seu celular
3. Vá em **Configurações** → **Aparelhos conectados**
4. Toque em **"Conectar um aparelho"**
5. Escaneie o QR Code na tela
6. Aguarde a confirmação

### 3. Verificar Conexão

Quando conectado com sucesso, você verá:
```
✅ WhatsApp Conectado
Número: +55 21 99999-9999
Status: Online
```

---

## 📱 Como Funciona

### Fluxo Automático

```
1. Professor inicia aula
   ↓
2. Sistema detecta ausências/emoções
   ↓
3. Sistema verifica se já enviou mensagem hoje
   ↓
4. Se não enviou, envia WhatsApp
   ↓
5. Registra envio no banco
   ↓
6. Responsável recebe mensagem
```

### Controle de Duplicatas

O sistema garante que:
- ✅ Apenas 1 mensagem por aluno por dia
- ✅ Não envia mensagens repetidas
- ✅ Registra todos os envios

---

## 📝 Tipos de Mensagens

### 1. Ausência

**Quando:** Aluno não foi detectado na chamada

**Mensagem:**
```
🔔 Notificação EduFocus

Olá! Informamos que o(a) aluno(a) [Nome] 
não foi detectado(a) na aula de hoje.

Turma: [Nome da Turma]
Data: [DD/MM/YYYY]
Horário: [HH:MM]

Qualquer dúvida, entre em contato com a escola.
```

### 2. Desatenção

**Quando:** Aluno está desatento por muito tempo

**Mensagem:**
```
⚠️ Alerta de Atenção - EduFocus

O(a) aluno(a) [Nome] apresentou baixa atenção 
durante a aula de hoje.

Turma: [Nome da Turma]
Nível de atenção: Baixo

Recomendamos conversar com o aluno.
```

### 3. Emoção Negativa

**Quando:** Aluno apresenta emoções negativas

**Mensagem:**
```
😟 Alerta Emocional - EduFocus

Detectamos que o(a) aluno(a) [Nome] pode estar 
passando por um momento difícil.

Turma: [Nome da Turma]
Emoção detectada: [Triste/Ansioso/Irritado]

Sugerimos uma conversa com o aluno.
```

### 4. Mensagem Personalizada

**Quando:** Professor envia manualmente

**Exemplo:**
```
📢 Mensagem do Professor

[Mensagem personalizada do professor]

Turma: [Nome da Turma]
Professor: [Nome do Professor]
```

---

## 🎯 Envio Manual

### Pelo Painel do Professor

1. Acesse a turma
2. Clique no aluno
3. Clique em **"Enviar Mensagem"**
4. Digite a mensagem
5. Clique em **"Enviar via WhatsApp"**

### Pelo Chat

1. Acesse **"Chat"**
2. Selecione o aluno
3. Digite a mensagem
4. Clique em **"Enviar"**

---

## ⚙️ Configurações

### Ativar/Desativar Notificações

**Por Escola:**
```
Painel Escola → Configurações → WhatsApp
[ ] Notificações de Ausência
[ ] Notificações de Desatenção
[ ] Notificações de Emoção
```

**Por Professor:**
```
Painel Professor → Configurações
[ ] Enviar notificações automáticas
```

### Horário de Envio

Configure o horário permitido para envio:
```
Início: 07:00
Fim: 19:00
```

Mensagens fora desse horário são enfileiradas.

---

## 🔍 Monitoramento

### Ver Mensagens Enviadas

**Painel da Escola:**
```
Relatórios → WhatsApp → Mensagens Enviadas

Filtros:
- Data
- Turma
- Aluno
- Tipo de mensagem
```

**Informações Exibidas:**
- Data e hora do envio
- Aluno
- Tipo de mensagem
- Status (Enviado/Erro)
- Responsável que recebeu

### Estatísticas

```
📊 Estatísticas WhatsApp

Mensagens enviadas hoje: 45
Mensagens esta semana: 234
Taxa de entrega: 98.5%
Tempo médio de resposta: 2h 15min
```

---

## 🐛 Solução de Problemas

### WhatsApp Desconectado

**Sintoma:** Status mostra "Desconectado"

**Solução:**
1. Clique em **"Reconectar"**
2. Escaneie o QR Code novamente
3. Aguarde confirmação

### Mensagens Não Enviadas

**Sintoma:** Mensagens ficam como "Pendente"

**Possíveis Causas:**
1. WhatsApp desconectado
2. Número inválido
3. Bloqueado pelo responsável

**Solução:**
1. Verificar conexão
2. Verificar número do responsável
3. Tentar enviar novamente

### QR Code Não Aparece

**Sintoma:** Tela fica em branco

**Solução:**
1. Recarregar a página (F5)
2. Limpar cache do navegador
3. Verificar se servidor está rodando
4. Verificar logs do servidor

### Erro: "Session Closed"

**Sintoma:** Conexão cai frequentemente

**Solução:**
1. Desconectar WhatsApp
2. Deletar pasta `whatsapp-auth/school-[ID]`
3. Conectar novamente

---

## 🔐 Segurança

### Dados Armazenados

O sistema armazena:
- ✅ Sessão do WhatsApp (criptografada)
- ✅ Histórico de mensagens
- ✅ Números dos responsáveis

**Não armazena:**
- ❌ Conversas completas
- ❌ Mídias enviadas
- ❌ Dados pessoais além do necessário

### Boas Práticas

1. **Use um número dedicado** para a escola
2. **Não compartilhe** o QR Code
3. **Mantenha** o celular conectado
4. **Verifique** regularmente a conexão
5. **Faça backup** da pasta `whatsapp-auth`

---

## 📊 Limites e Restrições

### Limites do WhatsApp

- **Mensagens por dia**: ~1000 (recomendado)
- **Mensagens por minuto**: ~20
- **Tamanho da mensagem**: 65.536 caracteres

### Recomendações

- ✅ Envie apenas mensagens importantes
- ✅ Respeite o horário comercial
- ✅ Não envie spam
- ✅ Personalize as mensagens

---

## 🔄 Backup e Restauração

### Fazer Backup

```bash
# Copiar pasta de autenticação
cp -r whatsapp-auth/ whatsapp-auth-backup/

# Ou comprimir
tar -czf whatsapp-backup.tar.gz whatsapp-auth/
```

### Restaurar Backup

```bash
# Parar servidor
# Ctrl+C

# Restaurar pasta
cp -r whatsapp-auth-backup/ whatsapp-auth/

# Reiniciar servidor
npm start
```

---

## 📞 API do WhatsApp

### Enviar Mensagem Programaticamente

```javascript
// POST /api/school/whatsapp/send
{
  "studentId": 123,
  "message": "Mensagem personalizada",
  "type": "custom"
}
```

### Verificar Status

```javascript
// GET /api/school/whatsapp/status
{
  "connected": true,
  "number": "+5521999999999",
  "qrCode": null
}
```

### Desconectar

```javascript
// POST /api/school/whatsapp/disconnect
```

---

## 📝 Logs

### Localização

```
server/logs/whatsapp-[school-id].log
```

### Exemplo de Log

```
[2025-12-12 10:00:00] INFO: WhatsApp conectado para escola 1
[2025-12-12 10:05:23] INFO: Mensagem enviada para +5521999999999
[2025-12-12 10:10:45] ERROR: Falha ao enviar mensagem: número inválido
[2025-12-12 10:15:00] WARN: Sessão expirada, reconectando...
```

---

## 🎓 Melhores Práticas

### Para Escolas

1. **Configure horários** adequados
2. **Treine professores** no uso
3. **Monitore** as estatísticas
4. **Responda** dúvidas dos responsáveis
5. **Mantenha** o sistema atualizado

### Para Professores

1. **Use com moderação** - não envie mensagens desnecessárias
2. **Seja claro** - mensagens objetivas
3. **Seja profissional** - mantenha o tom adequado
4. **Verifique** antes de enviar
5. **Acompanhe** as respostas

---

## 📞 Suporte

**Problemas com WhatsApp?**

1. Consulte este guia
2. Verifique os logs
3. Entre em contato: suporte@edufocus.com
4. WhatsApp: (21) 99587-9170

---

**WhatsApp configurado? Veja o [Guia de Uso](USO.md)!**
