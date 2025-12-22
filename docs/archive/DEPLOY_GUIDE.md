# 🚀 Guia Completo de Deploy - EduFocus

## ✅ Pré-requisitos

Antes de começar, você precisa:
- [ ] Conta no GitHub (gratuita)
- [ ] Conta no Render.com (gratuita)
- [ ] Git instalado no seu computador

---

## 📦 Passo 1: Preparar o Repositório GitHub

### 1.1 Criar Repositório no GitHub

1. Acesse [https://github.com](https://github.com)
2. Clique no botão **"+"** no canto superior direito → **"New repository"**
3. Preencha:
   - **Repository name:** `edufocus` (ou o nome que preferir)
   - **Description:** "Sistema de Gestão Educacional EduFocus"
   - **Visibility:** Private ou Public (sua escolha)
4. **NÃO** marque "Initialize this repository with a README"
5. Clique em **"Create repository"**

### 1.2 Fazer Upload do Projeto

Abra o PowerShell na pasta do projeto (`C:\Users\User\Desktop\EDU03`) e execute:

```powershell
# Inicializar repositório Git
git init

# Adicionar todos os arquivos
git add .

# Fazer o primeiro commit
git commit -m "Initial commit - EduFocus project"

# Adicionar o repositório remoto (substitua YOUR_USERNAME pelo seu usuário do GitHub)
git remote add origin https://github.com/YOUR_USERNAME/edufocus.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

**⚠️ IMPORTANTE:** Substitua `YOUR_USERNAME` pelo seu nome de usuário do GitHub!

---

## 🌐 Passo 2: Deploy no Render.com

### 2.1 Criar Conta e Conectar GitHub

1. Acesse [https://render.com](https://render.com)
2. Clique em **"Get Started"** ou **"Sign Up"**
3. Escolha **"Sign up with GitHub"**
4. Autorize o Render a acessar seus repositórios

### 2.2 Deploy do Backend (Servidor)

1. No Dashboard do Render, clique em **"New +"** → **"Web Service"**
2. Encontre e selecione o repositório **edufocus**
3. Clique em **"Connect"**

#### Configurações do Backend:

Preencha os campos conforme abaixo:

| Campo | Valor |
|-------|-------|
| **Name** | `edufocus-backend` |
| **Region** | Oregon (US West) ou a mais próxima |
| **Branch** | `main` |
| **Root Directory** | `server` |
| **Environment** | `Node` |
| **Build Command** | `npm install` |
| **Start Command** | `node seed.js && node server.js` |
| **Instance Type** | `Free` |

#### Variáveis de Ambiente do Backend:

Clique em **"Advanced"** e adicione:

| Key | Value |
|-----|-------|
| `SECRET_KEY` | `edufocus_production_secret_key_2024_change_me` |
| `NODE_ENV` | `production` |

**⚠️ IMPORTANTE:** Anote a SECRET_KEY que você definir!

4. Clique em **"Create Web Service"**
5. Aguarde o deploy (5-10 minutos)
6. **COPIE A URL DO BACKEND** que aparecerá no topo (ex: `https://edufocus-backend.onrender.com`)

### 2.3 Deploy do Frontend (Interface)

1. No Dashboard do Render, clique em **"New +"** → **"Static Site"**
2. Selecione o mesmo repositório **edufocus**
3. Clique em **"Connect"**

#### Configurações do Frontend:

| Campo | Valor |
|-------|-------|
| **Name** | `edufocus-frontend` |
| **Branch** | `main` |
| **Root Directory** | `client` |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

#### Variáveis de Ambiente do Frontend:

Clique em **"Advanced"** e adicione:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://edufocus-backend.onrender.com/api` |

**⚠️ IMPORTANTE:** Substitua `edufocus-backend.onrender.com` pela URL REAL do seu backend copiada no passo 2.2!

4. Clique em **"Create Static Site"**
5. Aguarde o build e deploy (5-10 minutos)
6. **COPIE A URL DO FRONTEND** (ex: `https://edufocus-frontend.onrender.com`)

---

## 🔧 Passo 3: Configurar CORS

Agora você precisa atualizar o backend para aceitar requisições do frontend.

### 3.1 Atualizar Variável de Ambiente

1. Acesse o **Dashboard do Render**
2. Clique no serviço **edufocus-backend**
3. Vá em **"Environment"** no menu lateral
4. Adicione uma nova variável:
   - **Key:** `FRONTEND_URL`
   - **Value:** `https://edufocus-frontend.onrender.com` (sua URL do frontend)
5. Clique em **"Save Changes"**
6. O Render fará redeploy automático

---

## 🎉 Passo 4: Testar o Sistema

1. Acesse a URL do frontend: `https://edufocus-frontend.onrender.com`
2. Aguarde carregar (primeira vez pode demorar 30-60 segundos)
3. Faça login com as credenciais padrão:
   - **Email:** `admin@edufocus.com`
   - **Senha:** `admin123`

### ✅ Credenciais de Acesso

O sistema vem com usuários pré-cadastrados:

#### Super Admin
- **Email:** admin@edufocus.com
- **Senha:** admin123

#### Escola (Colégio Exemplo)
- **Email:** escola@exemplo.com
- **Senha:** escola123

#### Professor
- **Email:** professor@exemplo.com
- **Senha:** prof123

#### Representante
- **Email:** rep@exemplo.com
- **Senha:** rep123

---

## 📝 Informações Importantes

### ⚠️ Limitações do Plano Gratuito

- **Sleep Mode:** Após 15 minutos sem uso, o serviço "dorme"
- **Primeiro Acesso:** Pode levar 30-60 segundos para "acordar"
- **Banco de Dados:** SQLite pode perder dados em redeploys
- **Horas Mensais:** 750 horas gratuitas por mês

### 💡 Dicas

1. **Manter Ativo:** Use [UptimeRobot](https://uptimerobot.com) para fazer ping a cada 5 minutos
2. **Banco Persistente:** Para produção real, migre para PostgreSQL
3. **Monitoramento:** Acompanhe os logs no Dashboard do Render

---

## 🔍 Troubleshooting

### Erro: "Application failed to respond"
- Verifique os logs no Render Dashboard
- Confirme que todas as variáveis de ambiente estão corretas
- Verifique se o Start Command está correto

### Frontend não conecta ao Backend
- Confirme que `VITE_API_URL` está correto
- Verifique se `FRONTEND_URL` foi configurado no backend
- Teste a API diretamente: `https://seu-backend.onrender.com/api/login`

### Página em branco no Frontend
- Verifique os logs de build no Render
- Confirme que o Build Command executou sem erros
- Verifique se a pasta `dist` foi gerada corretamente

### Banco de dados vazio
- O comando `node seed.js` deve estar no Start Command
- Verifique os logs para ver se o seed executou
- Se necessário, force um redeploy

---

## 🆘 Precisa de Ajuda?

- **Documentação Render:** [https://render.com/docs](https://render.com/docs)
- **Documentação Vite:** [https://vitejs.dev](https://vitejs.dev)
- **Suporte Render:** [https://render.com/support](https://render.com/support)

---

## 🎊 Pronto!

Seu sistema EduFocus está no ar! 🚀

Compartilhe a URL do frontend com sua equipe e comece a usar.

**URL do Sistema:** `https://edufocus-frontend.onrender.com`
