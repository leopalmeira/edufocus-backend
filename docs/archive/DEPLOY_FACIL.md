# 🎯 DEPLOY SUPER FÁCIL - 3 PASSOS

## ✅ Preparação (JÁ FEITA!)

Seu projeto já está configurado e pronto para deploy!

---

## 📦 PASSO 1: Preparar Arquivos (2 minutos)

### 1.1 Limpar arquivos desnecessários

Abra a pasta `C:\Users\User\Desktop\EDU03` e **DELETE** estas pastas/arquivos se existirem:

**Na pasta `client`:**
- ❌ Pasta `node_modules` (se existir)
- ❌ Arquivo `package-lock.json` (se existir)

**Na pasta `server`:**
- ❌ Pasta `node_modules` (se existir)
- ❌ Arquivo `package-lock.json` (se existir)

**Na pasta `database`:**
- ❌ Todos os arquivos `.db` (se existirem)

**⚠️ NÃO DELETE:** As pastas `client` e `server` em si, apenas o conteúdo listado acima!

---

## 🌐 PASSO 2: Criar Repositório no GitHub (5 minutos)

### 2.1 Criar conta/fazer login no GitHub

1. Acesse: https://github.com
2. Se não tem conta:
   - Clique em "Sign up"
   - Crie uma conta gratuita
3. Se já tem conta, faça login

### 2.2 Criar novo repositório

1. Clique no botão **"+"** no canto superior direito
2. Selecione **"New repository"**
3. Preencha:
   - **Repository name:** `edufocus`
   - **Description:** `Sistema de Gestão Educacional`
   - **Visibility:** ⚪ Private (recomendado)
   - ✅ **MARQUE:** "Add a README file"
4. Clique em **"Create repository"**

### 2.3 Fazer upload dos arquivos

1. No repositório criado, clique em **"Add file"** → **"Upload files"**
2. Abra a pasta `C:\Users\User\Desktop\EDU03` no Windows Explorer
3. Selecione **TODOS** os arquivos e pastas (Ctrl+A)
4. **Arraste** para a área de upload no GitHub
5. Aguarde o upload completar (pode demorar alguns minutos)
6. No campo de commit, escreva: `Initial commit`
7. Clique em **"Commit changes"**

**✅ Pronto! Arquivos no GitHub!**

---

## 🚀 PASSO 3: Deploy no Render.com (15 minutos)

### 3.1 Criar conta no Render

1. Acesse: https://render.com
2. Clique em **"Get Started"**
3. Escolha **"Sign up with GitHub"**
4. Autorize o Render a acessar seus repositórios

### 3.2 Deploy do BACKEND (Servidor)

1. No Dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Encontre e selecione o repositório **edufocus**
3. Clique em **"Connect"**
4. Preencha EXATAMENTE assim:

```
Name: edufocus-backend
Region: Oregon (US West)
Branch: main
Root Directory: server
Environment: Node
Build Command: npm install
Start Command: node seed.js && node server.js
Instance Type: Free
```

5. Clique em **"Advanced"** e adicione estas variáveis:

```
SECRET_KEY = edufocus_production_2024_secure_key
NODE_ENV = production
```

6. Clique em **"Create Web Service"**
7. Aguarde o deploy (5-10 minutos) - você verá logs aparecendo
8. Quando aparecer "Live" em verde, **COPIE A URL** (algo como: `https://edufocus-backend-xxxx.onrender.com`)

**📋 ANOTE ESTA URL DO BACKEND!**

### 3.3 Deploy do FRONTEND (Interface)

1. No Dashboard do Render, clique em **"New +"** → **"Static Site"**
2. Selecione o repositório **edufocus** novamente
3. Clique em **"Connect"**
4. Preencha EXATAMENTE assim:

```
Name: edufocus-frontend
Branch: main
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
```

5. Clique em **"Advanced"** e adicione esta variável:

```
VITE_API_URL = [COLE AQUI A URL DO BACKEND]/api
```

**⚠️ IMPORTANTE:** Substitua `[COLE AQUI A URL DO BACKEND]` pela URL que você copiou no passo 3.2!

**Exemplo:** Se seu backend é `https://edufocus-backend-xxxx.onrender.com`, então:
```
VITE_API_URL = https://edufocus-backend-xxxx.onrender.com/api
```

6. Clique em **"Create Static Site"**
7. Aguarde o build (5-10 minutos)
8. Quando aparecer "Live" em verde, **COPIE A URL DO FRONTEND**

**📋 ANOTE ESTA URL DO FRONTEND!**

### 3.4 Configurar CORS (ÚLTIMO PASSO!)

1. Volte ao serviço **edufocus-backend** no Render
2. Clique em **"Environment"** no menu lateral esquerdo
3. Clique em **"Add Environment Variable"**
4. Adicione:

```
Key: FRONTEND_URL
Value: [COLE AQUI A URL DO FRONTEND]
```

**Exemplo:** `https://edufocus-frontend.onrender.com`

5. Clique em **"Save Changes"**
6. Aguarde o redeploy automático (~2 minutos)

---

## 🎉 PASSO 4: TESTAR!

1. Acesse a URL do frontend que você copiou
2. Aguarde carregar (primeira vez pode demorar 30-60 segundos)
3. Faça login:
   - **Email:** `admin@edufocus.com`
   - **Senha:** `admin123`

### ✅ Se aparecer o dashboard do Super Admin, FUNCIONOU! 🎊

---

## 📝 SUAS URLs (anote aqui):

**Backend:** `_________________________________`

**Frontend:** `_________________________________`

---

## 🆘 Problemas?

### Erro "Failed to fetch" ou "Network Error"
- Verifique se `VITE_API_URL` está correto no frontend
- Verifique se `FRONTEND_URL` está correto no backend
- Aguarde alguns minutos e tente novamente

### Página em branco
- Abra o Console do navegador (F12)
- Veja se há erros
- Verifique se o build do frontend completou com sucesso

### Backend com erro
- Veja os logs no Render Dashboard
- Verifique se o Start Command está correto

---

## ⏱️ Tempo Total: ~25 minutos

## 🎯 Credenciais de Acesso:

- **Super Admin:** admin@edufocus.com / admin123
- **Escola:** escola@exemplo.com / escola123
- **Professor:** professor@exemplo.com / prof123
- **Representante:** rep@exemplo.com / rep123

---

**Boa sorte! Qualquer dúvida, me chame! 🚀**
