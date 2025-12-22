# 📱 Integração WhatsApp - EduFocus

## Visão Geral

O sistema EduFocus agora possui integração completa com WhatsApp usando a biblioteca **Baileys**, permitindo enviar notificações automáticas aos pais quando seus filhos chegam ou saem da escola.

## 🎯 Funcionalidades

### 1. Notificação Automática de Chegada
Quando um aluno é reconhecido pela câmera facial na entrada da escola, o sistema:
- ✅ Registra a presença no banco de dados
- ✅ Envia automaticamente uma mensagem WhatsApp para o telefone cadastrado dos pais
- ✅ Inclui nome do aluno, data e horário de chegada

### 2. Notificação de Saída (Opcional)
O sistema também pode enviar notificações quando o aluno sai da escola.

### 3. Painel de Controle
Interface administrativa para:
- Conectar/desconectar o WhatsApp
- Verificar status da conexão
- Testar envio de mensagens

---

## 📋 Pré-requisitos

### 1. Instalar Dependências do Baileys

**IMPORTANTE:** Você precisa ter o Git instalado no sistema.

No terminal, navegue até a pasta `server` e execute:

```bash
cd server
npm install @whiskeysockets/baileys qrcode-terminal pino
```

### 2. Cadastrar Telefones dos Pais

Certifique-se de que os alunos têm números de telefone cadastrados no formato:
- **Com DDD:** `11999999999` (São Paulo)
- **Sem caracteres especiais:** apenas números

---

## 🚀 Como Usar

### Passo 1: Conectar o WhatsApp

1. **Login como Super Admin** no sistema
2. Acesse a seção **"WhatsApp Integration"**
3. Clique em **"Conectar WhatsApp"**
4. **Abra o terminal/console do servidor** onde o Node.js está rodando
5. **Escaneie o QR Code** que aparecerá no terminal com seu WhatsApp
6. Aguarde a mensagem de confirmação: `✅ WhatsApp conectado com sucesso!`

### Passo 2: Verificar Conexão

- O painel mostrará o status **"Conectado"** em verde
- A conexão permanece ativa mesmo após reiniciar o servidor (credenciais são salvas)

### Passo 3: Testar Notificações

1. Cadastre um aluno com telefone válido
2. Registre a biometria facial do aluno
3. Ative a câmera de reconhecimento
4. Quando o aluno for reconhecido, a notificação será enviada automaticamente

---

## 📱 Formato das Mensagens

### Mensagem de Chegada
```
🎒 *Notificação de Chegada - [Nome da Escola]*

Olá! Seu(a) filho(a) *João Silva* chegou na escola.

📅 Data: 10/12/2025
🕐 Horário: 07:30

_Mensagem automática do sistema EduFocus_
```

### Mensagem de Saída
```
🏠 *Notificação de Saída - [Nome da Escola]*

Olá! Seu(a) filho(a) *João Silva* saiu da escola.

📅 Data: 10/12/2025
🕐 Horário: 12:00

_Mensagem automática do sistema EduFocus_
```

---

## 🔧 Endpoints da API

### 1. Conectar WhatsApp
```http
POST /api/admin/whatsapp/connect
Authorization: Bearer {token}
Role: super_admin
```

### 2. Verificar Status
```http
GET /api/admin/whatsapp/status
Authorization: Bearer {token}
Role: super_admin, school_admin
```

### 3. Desconectar
```http
POST /api/admin/whatsapp/disconnect
Authorization: Bearer {token}
Role: super_admin
```

### 4. Registrar Presença + Enviar WhatsApp
```http
POST /api/attendance/register
Authorization: Bearer {token}
Content-Type: application/json

{
  "student_id": 123,
  "school_id": 1,
  "event_type": "arrival" // ou "departure"
}
```

**Resposta:**
```json
{
  "success": true,
  "message": "Presença registrada",
  "student": "João Silva",
  "timestamp": "2025-12-10T10:30:00.000Z",
  "whatsapp": {
    "success": true,
    "sentAt": "2025-12-10T10:30:00.000Z",
    "phone": "11999999999"
  }
}
```

### 5. Testar Envio de Mensagem
```http
POST /api/admin/whatsapp/test
Authorization: Bearer {token}
Content-Type: application/json

{
  "student_id": 123,
  "school_id": 1
}
```

---

## 🛠️ Arquitetura Técnica

### Arquivos Criados/Modificados

1. **`server/whatsapp-service.js`**
   - Serviço principal do WhatsApp
   - Gerencia conexão, autenticação e envio de mensagens
   - Usa padrão Singleton

2. **`server/server.js`**
   - Endpoints de API para WhatsApp
   - Integração com reconhecimento facial

3. **`client/src/components/WhatsAppPanel.jsx`**
   - Interface de controle para Super Admin
   - Gerenciamento de conexão

4. **`client/src/components/FacialRecognitionCamera.jsx`**
   - Modificado para chamar endpoint de registro com WhatsApp
   - Exibe status de envio no console

### Fluxo de Funcionamento

```
1. Aluno se aproxima da câmera
   ↓
2. Sistema detecta e reconhece o rosto
   ↓
3. FacialRecognitionCamera chama /api/attendance/register
   ↓
4. Backend registra presença no banco de dados
   ↓
5. Backend verifica se WhatsApp está conectado
   ↓
6. WhatsAppService formata e envia mensagem
   ↓
7. Pais recebem notificação no WhatsApp
```

---

## ⚠️ Troubleshooting

### Problema: "WhatsApp não conectado"
**Solução:** 
- Verifique se executou `npm install` das dependências
- Certifique-se de que escaneou o QR Code
- Verifique o console do servidor para mensagens de erro

### Problema: "Mensagem não enviada"
**Possíveis causas:**
- Aluno não tem telefone cadastrado
- Telefone em formato inválido (deve ser apenas números com DDD)
- WhatsApp desconectado
- Número não existe no WhatsApp

### Problema: "Git error" ao instalar Baileys
**Solução:**
- Instale o Git: https://git-scm.com/downloads
- Reinicie o terminal após instalação
- Execute novamente `npm install @whiskeysockets/baileys`

### Problema: QR Code não aparece
**Solução:**
- Verifique se está olhando o console/terminal correto (onde o servidor Node.js está rodando)
- Tente desconectar e conectar novamente

---

## 🔒 Segurança e Privacidade

- ✅ Autenticação é salva localmente em `server/whatsapp-auth/`
- ✅ Apenas Super Admin pode conectar/desconectar
- ✅ Mensagens são enviadas apenas para números cadastrados
- ✅ Não há armazenamento de histórico de mensagens
- ✅ Conexão criptografada end-to-end (padrão WhatsApp)

---

## 📊 Logs e Monitoramento

O sistema registra no console:
- ✅ Conexão/desconexão do WhatsApp
- ✅ Cada mensagem enviada (sucesso ou falha)
- ✅ Erros de autenticação ou envio

Exemplo de log:
```
✅ WhatsApp conectado com sucesso!
📱 WhatsApp enviado com sucesso para: 11999999999
✅ Notificação enviada para João Silva (11999999999)
```

---

## 🎓 Próximos Passos

1. **Instalar dependências** do Baileys
2. **Conectar WhatsApp** via painel de controle
3. **Cadastrar telefones** dos pais nos perfis dos alunos
4. **Testar** com um aluno de exemplo
5. **Monitorar** os logs para garantir funcionamento correto

---

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte a documentação do Baileys: https://baileys.wiki
- Verifique os logs do servidor
- Entre em contato com o suporte técnico

---

**Desenvolvido com ❤️ para EduFocus**
