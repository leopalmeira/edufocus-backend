# 🚀 GUIA RÁPIDO - Como Deixar o WhatsApp Funcionando

## ⚠️ PROBLEMA ATUAL
Você precisa instalar o **Git** primeiro para poder instalar o Baileys.

---

## 📥 PASSO 1: INSTALAR O GIT

### Opção A - Download Direto (RECOMENDADO)
1. Acesse: https://git-scm.com/download/win
2. Baixe e instale (Next, Next, Next...)
3. **REINICIE o terminal/PowerShell**
4. Teste digitando: `git --version`

### Opção B - Via Winget (se tiver Windows 10/11)
```powershell
winget install --id Git.Git -e --source winget
```

---

## 📦 PASSO 2: INSTALAR DEPENDÊNCIAS DO WHATSAPP

Depois de instalar o Git e **REINICIAR O TERMINAL**:

```bash
cd c:\Users\User\Desktop\EDU03\server
npm install @whiskeysockets/baileys qrcode-terminal pino
```

---

## 🎯 PASSO 3: CONECTAR O WHATSAPP

### 3.1 - Reiniciar o Servidor
```bash
# Pare o servidor atual (Ctrl+C)
cd c:\Users\User\Desktop\EDU03
npm start
```

### 3.2 - Fazer Login no Sistema
1. Abra o navegador: http://localhost:5173
2. Login como **Super Admin**:
   - Email: `admin@edufocus.com`
   - Senha: `admin123`

### 3.3 - Conectar WhatsApp
1. No painel do Super Admin, procure a seção **"WhatsApp Integration"**
2. Clique no botão **"Conectar WhatsApp"**
3. **OLHE NO TERMINAL** onde o servidor está rodando
4. Vai aparecer um **QR CODE** assim:

```
📱 QR Code gerado! Escaneie com WhatsApp:
█▀▀▀▀▀█ ▀▀█ ▄▀ █▀▀▀▀▀█
█ ███ █ ▀▄█▀▀ █ ███ █
█ ▀▀▀ █ █▀▄▀█ █ ▀▀▀ █
▀▀▀▀▀▀▀ █ ▀ █ ▀▀▀▀▀▀▀
```

5. **Abra o WhatsApp no celular**
6. Vá em: **Configurações > Aparelhos Conectados > Conectar um aparelho**
7. **Escaneie o QR Code** que apareceu no terminal
8. Aguarde a mensagem: `✅ WhatsApp conectado com sucesso!`

---

## 🎓 PASSO 4: CADASTRAR ALUNOS COM TELEFONE

### 4.1 - Login como Admin da Escola
- Email: `escola1@test.com`
- Senha: `escola123`

### 4.2 - Cadastrar/Editar Aluno
1. Vá na aba **"Alunos"**
2. Clique em **"Cadastrar Aluno"** ou edite um existente
3. **IMPORTANTE**: Preencha o campo **"Telefone dos Pais"**
   - Formato: `11999999999` (DDD + número, SEM espaços ou traços)
   - Exemplo: `11987654321`

### 4.3 - Cadastrar Biometria Facial
1. Ainda na aba "Alunos"
2. Clique em **"Cadastrar Rosto"** do aluno
3. Escolha **"Câmera"** ou **"Upload Foto"**
4. Capture o rosto e clique em **"Salvar Biometria"**

---

## 🚀 PASSO 5: TESTAR O SISTEMA

### 5.1 - Login como Professor
- Email: `prof1@test.com`
- Senha: `prof123`

### 5.2 - Iniciar Monitoramento
1. Selecione a turma (ex: "3º Ano")
2. Vá na aba **"Dashboard"**
3. Clique em **"INICIAR AULA"**
4. Posicione o aluno na frente da câmera

### 5.3 - O que vai acontecer:
1. ✅ Sistema reconhece o aluno
2. ✅ Registra presença no banco de dados
3. ✅ **ENVIA WHATSAPP AUTOMÁTICO** para os pais
4. ✅ Você verá no console do servidor:
   ```
   📱 WhatsApp enviado com sucesso para: 11999999999
   ✅ Notificação enviada para João Silva (11999999999)
   ```

---

## 📱 MENSAGEM QUE OS PAIS VÃO RECEBER

```
🎒 *Notificação de Chegada - Escola Municipal São Paulo*

Olá! Seu(a) filho(a) *João Silva* chegou na escola.

📅 Data: 10/12/2025
🕐 Horário: 07:30

_Mensagem automática do sistema EduFocus_
```

---

## 🔧 TROUBLESHOOTING

### ❌ "WhatsApp não conectado"
**Solução:** Repita o PASSO 3 (conectar WhatsApp)

### ❌ "Mensagem não enviada"
**Verifique:**
- [ ] WhatsApp está conectado? (veja o painel)
- [ ] Aluno tem telefone cadastrado?
- [ ] Telefone está no formato correto? (11999999999)
- [ ] O número existe no WhatsApp?

### ❌ QR Code não aparece
**Solução:**
- Olhe no terminal/console onde o `npm start` está rodando
- Se não aparecer, desconecte e conecte novamente

### ❌ "Git error"
**Solução:**
- Instale o Git (PASSO 1)
- **REINICIE O TERMINAL**
- Tente novamente

---

## 🎯 RESUMO - ORDEM CORRETA

1. ✅ Instalar Git
2. ✅ Reiniciar terminal
3. ✅ `npm install @whiskeysockets/baileys qrcode-terminal pino`
4. ✅ Reiniciar servidor (`npm start`)
5. ✅ Login Super Admin → Conectar WhatsApp → Escanear QR
6. ✅ Login Escola → Cadastrar aluno com telefone + biometria
7. ✅ Login Professor → Iniciar monitoramento
8. ✅ PRONTO! WhatsApp automático funcionando! 🎉

---

## 💡 DICA PRO

Deixe o servidor rodando 24/7 para que o WhatsApp fique sempre conectado.
A autenticação fica salva em `server/whatsapp-auth/`, então você não precisa escanear o QR toda vez.

---

**Qualquer dúvida, me chama! 🚀**
