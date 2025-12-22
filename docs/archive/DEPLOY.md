# 🚀 Guia Rápido de Deploy - Render.com

## Passo 1: Preparar o Repositório

1. Crie um repositório no GitHub
2. Faça upload de todo o projeto EDU03
3. Commit e push

## Passo 2: Deploy do Backend

### 2.1 Criar Web Service no Render

1. Acesse [https://render.com](https://render.com)
2. Faça login ou crie uma conta gratuita
3. No Dashboard, clique em **"New +"** → **"Web Service"**
4. Conecte seu repositório GitHub
5. Selecione o repositório do projeto

### 2.2 Configurar o Backend

Preencha os campos:

- **Name:** `edufocus-backend` (ou qualquer nome)
- **Region:** Escolha a mais próxima
- **Branch:** `main` (ou sua branch principal)
- **Root Directory:** `server`
- **Environment:** `Node`
- **Build Command:** `npm install`
- **Start Command:** `node seed.js && node server.js`
- **Instance Type:** `Free`

### 2.3 Variáveis de Ambiente

Clique em **"Advanced"** e adicione:

```
SECRET_KEY=seu_secret_key_super_seguro_aqui_12345
NODE_ENV=production
```

### 2.4 Deploy

1. Clique em **"Create Web Service"**
2. Aguarde o deploy (pode levar 5-10 minutos)
3. Copie a URL gerada (ex: `https://edufocus-backend.onrender.com`)

## Passo 3: Deploy do Frontend

### 3.1 Criar Static Site no Render

1. No Dashboard do Render, clique em **"New +"** → **"Static Site"**
2. Conecte o mesmo repositório GitHub
3. Selecione o repositório

### 3.2 Configurar o Frontend

Preencha os campos:

- **Name:** `edufocus-frontend` (ou qualquer nome)
- **Branch:** `main`
- **Root Directory:** `client`
- **Build Command:** `npm install && npm run build`
- **Publish Directory:** `dist`

### 3.3 Variáveis de Ambiente

Adicione a variável de ambiente:

```
VITE_API_URL=https://edufocus-backend.onrender.com/api
```

**⚠️ IMPORTANTE:** Substitua `edufocus-backend.onrender.com` pela URL real do seu backend do Passo 2.4

### 3.4 Deploy

1. Clique em **"Create Static Site"**
2. Aguarde o build e deploy
3. Acesse a URL gerada (ex: `https://edufocus-frontend.onrender.com`)

## Passo 4: Configurar CORS no Backend

Após o deploy, você precisa atualizar o CORS no backend para aceitar requisições do frontend.

1. Edite o arquivo `server/server.js`
2. Encontre a linha `app.use(cors());`
3. Substitua por:

```javascript
app.use(cors({
    origin: 'https://edufocus-frontend.onrender.com', // Sua URL do frontend
    credentials: true
}));
```

4. Faça commit e push
5. O Render fará redeploy automático

## Passo 5: Testar

1. Acesse a URL do frontend
2. Faça login com as credenciais:
   - **Email:** admin@edufocus.com
   - **Senha:** admin123

## 📝 Notas Importantes

### Limitações do Plano Gratuito do Render:

- ⏰ **Sleep após inatividade:** Serviços gratuitos "dormem" após 15 minutos sem uso
- 🐌 **Primeiro acesso lento:** Pode levar 30-60 segundos para "acordar"
- 💾 **Banco de dados:** SQLite funciona, mas dados podem ser perdidos em redeploys
- 🔄 **750 horas/mês:** Limite de horas gratuitas

### Recomendações:

1. **Banco de Dados Persistente:**
   - Para produção real, use PostgreSQL do Render (também tem plano gratuito)
   - Ou use Supabase/PlanetScale

2. **Manter Ativo:**
   - Use serviços como UptimeRobot para fazer ping a cada 5 minutos
   - Isso evita que o serviço "durma"

3. **Monitoramento:**
   - Configure notificações de deploy no Render
   - Monitore logs em tempo real no dashboard

## 🔧 Troubleshooting

### Erro "Application failed to respond"
- Verifique os logs no Render Dashboard
- Confirme que o Start Command está correto
- Verifique se a porta está configurada corretamente

### Frontend não conecta ao Backend
- Verifique se a variável `VITE_API_URL` está correta
- Confirme que o CORS está configurado no backend
- Teste a API diretamente: `https://seu-backend.onrender.com/api/login`

### Banco de dados vazio após redeploy
- Execute manualmente: adicione `node seed.js &&` antes do start command
- Ou configure um banco PostgreSQL persistente

## 🎉 Pronto!

Seu sistema EduFocus está no ar! 🚀

Compartilhe a URL do frontend com sua equipe e comece a usar.

---

**Precisa de ajuda?** Consulte a documentação do Render: [https://render.com/docs](https://render.com/docs)
