# 🚀 Deploy SEM Git - Usando GitHub Web Interface

## Passo 1: Criar Repositório no GitHub

1. Acesse: https://github.com
2. Faça login (ou crie uma conta gratuita)
3. Clique no botão **"+"** no canto superior direito → **"New repository"**
4. Preencha:
   - **Repository name:** `edufocus`
   - **Description:** "Sistema de Gestão Educacional EduFocus"
   - **Visibility:** Private (recomendado) ou Public
   - ✅ **Marque:** "Add a README file"
5. Clique em **"Create repository"**

---

## Passo 2: Fazer Upload dos Arquivos

### 2.1 Preparar Arquivos

1. Abra a pasta: `C:\Users\User\Desktop\EDU03`
2. **IMPORTANTE:** Delete estas pastas/arquivos se existirem:
   - `node_modules` (em client e server)
   - `database` (pasta inteira)
   - `*.db` (arquivos de banco de dados)
   - `package-lock.json` (em client e server)

### 2.2 Upload para GitHub

**Método A: Arrastar e Soltar (Mais Fácil)**

1. No repositório GitHub que você criou, clique em **"uploading an existing file"**
2. Abra a pasta `C:\Users\User\Desktop\EDU03` no Windows Explorer
3. Selecione TODOS os arquivos e pastas (Ctrl+A)
4. Arraste para a área de upload no GitHub
5. Aguarde o upload completar
6. No campo "Commit changes":
   - Escreva: `Initial commit - EduFocus project`
7. Clique em **"Commit changes"**

**Método B: Upload Manual por Pasta**

Se o Método A não funcionar (arquivos muito grandes):

1. No GitHub, clique em **"Add file"** → **"Upload files"**
2. Faça upload pasta por pasta:
   - Primeiro: `client` (toda a pasta)
   - Depois: `server` (toda a pasta)
   - Depois: arquivos da raiz (.gitignore, README.md, etc)
3. Para cada upload, clique em "Commit changes"

---

## Passo 3: Deploy no Render.com

### 3.1 Criar Conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Escolha **"Sign up with GitHub"**
4. Autorize o Render a acessar seus repositórios

### 3.2 Deploy do Backend

1. No Dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Encontre e selecione o repositório **edufocus**
3. Clique em **"Connect"**
4. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `edufocus-backend` |
| **Region** | Oregon (US West) |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node seed.js && node server.js` |
| **Instance Type** | `Free` |

5. Clique em **"Advanced"** e adicione variáveis de ambiente:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `edufocus_prod_2024_change_this_key` |
| `NODE_ENV` | `production` |

6. Clique em **"Create Web Service"**
7. Aguarde o deploy (5-10 minutos)
8. **📋 COPIE A URL DO BACKEND** (ex: `https://edufocus-backend.onrender.com`)

### 3.3 Deploy do Frontend

1. No Dashboard do Render, clique em **"New +"** → **"Static Site"**
2. Selecione o repositório **edufocus**
3. Configure:

| Campo | Valor |
|-------|-------|
| **Name** | `edufocus-frontend` |
| **Branch** | `main` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

4. Clique em **"Advanced"** e adicione variável de ambiente:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | Cole aqui a URL do backend + `/api` |

**Exemplo:** Se seu backend é `https://edufocus-backend.onrender.com`, então:
- `VITE_API_URL` = `https://edufocus-backend.onrender.com/api`

5. Clique em **"Create Static Site"**
6. Aguarde o build (5-10 minutos)
7. **📋 COPIE A URL DO FRONTEND** (ex: `https://edufocus-frontend.onrender.com`)

### 3.4 Configurar CORS

1. Volte ao serviço **edufocus-backend** no Render
2. Clique em **"Environment"** no menu lateral
3. Adicione nova variável:
   - **Key:** `FRONTEND_URL`
   - **Value:** Cole a URL do frontend (ex: `https://edufocus-frontend.onrender.com`)
4. Clique em **"Save Changes"**
5. Aguarde o redeploy automático (~2 minutos)

---

## Passo 4: Testar

1. Acesse a URL do frontend
2. Aguarde carregar (primeira vez pode demorar 30-60 segundos)
3. Faça login:
   - **Email:** `admin@edufocus.com`
   - **Senha:** `admin123`

### ✅ Se aparecer o dashboard, está tudo funcionando! 🎉

---

## 🆘 Problemas?

### Frontend não carrega
- Verifique os logs de build no Render
- Confirme que `VITE_API_URL` está correto

### Erro de CORS
- Verifique se `FRONTEND_URL` foi configurado no backend
- Aguarde o redeploy completar

### Página em branco
- Abra o Console do navegador (F12)
- Veja se há erros de conexão com a API

---

## 📞 Precisa de Ajuda?

Consulte o arquivo **DEPLOY_GUIDE.md** para mais detalhes!

---

## ⏱️ Tempo total: 20-30 minutos
