# 📖 Guia de Instalação - EduFocus

## 📋 Requisitos do Sistema

### Hardware Mínimo
- **CPU**: Dual-core 2.0 GHz
- **RAM**: 4 GB
- **Disco**: 10 GB livres
- **Webcam**: Para reconhecimento facial (opcional)

### Software Necessário
- **Node.js**: 18.x ou superior ([Download](https://nodejs.org/))
- **npm**: 9.x ou superior (vem com Node.js)
- **Git**: Para clonar o repositório ([Download](https://git-scm.com/))
- **Navegador**: Chrome, Firefox ou Edge (versão recente)

---

## 🚀 Instalação Rápida

### 1. Clonar o Repositório

```bash
git clone https://github.com/leopalmeira/EDU03.git
cd EDU03
```

### 2. Instalar Dependências

**Backend:**
```bash
npm install
```

**Frontend:**
```bash
cd client
npm install
cd ..
```

### 3. Configurar Ambiente

Crie o arquivo `.env` na raiz do projeto:

```env
# Servidor
PORT=5000
SECRET_KEY=edufocus_secret_key_change_me_in_production

# Banco de Dados
DB_PATH=./databases

# WhatsApp (opcional)
WHATSAPP_SESSION_PATH=./whatsapp-auth
```

### 4. Iniciar Aplicação

**Terminal 1 - Backend:**
```bash
npm start
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

### 5. Acessar

Abra o navegador em: `http://localhost:5173`

**Credenciais padrão:**
- Email: `admin@edufocus.com`
- Senha: `admin123`

---

## 🔧 Instalação Detalhada

### Passo 1: Instalar Node.js

#### Windows
1. Baixe o instalador: https://nodejs.org/
2. Execute o instalador
3. Siga as instruções
4. Verifique a instalação:
```bash
node --version
npm --version
```

#### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### macOS
```bash
brew install node@18
```

### Passo 2: Instalar Git

#### Windows
1. Baixe: https://git-scm.com/download/win
2. Execute o instalador
3. Use as opções padrão

#### Linux
```bash
sudo apt-get install git
```

#### macOS
```bash
brew install git
```

### Passo 3: Clonar e Configurar

```bash
# Clonar
git clone https://github.com/leopalmeira/EDU03.git
cd EDU03

# Instalar backend
npm install

# Instalar frontend
cd client
npm install
cd ..

# Criar .env
cp .env.example .env
```

### Passo 4: Configurar Banco de Dados

O banco de dados SQLite é criado automaticamente na primeira execução.

**Localização:** `./databases/system.db`

**Dados iniciais:**
- 1 Super Admin
- 3 Escolas de exemplo
- Professores e alunos de teste

### Passo 5: Executar

```bash
# Terminal 1
npm start

# Terminal 2
cd client
npm run dev
```

---

## 🐳 Instalação com Docker (Opcional)

### Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Backend
COPY package*.json ./
RUN npm install

# Frontend
COPY client/package*.json ./client/
RUN cd client && npm install

# Código
COPY . .

# Build frontend
RUN cd client && npm run build

EXPOSE 5000

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  edufocus:
    build: .
    ports:
      - "5000:5000"
    volumes:
      - ./databases:/app/databases
      - ./whatsapp-auth:/app/whatsapp-auth
    environment:
      - PORT=5000
      - SECRET_KEY=your_secret_key
```

**Executar:**
```bash
docker-compose up -d
```

---

## ⚙️ Configurações Avançadas

### Porta Customizada

No `.env`:
```env
PORT=3000
```

No `client/vite.config.js`:
```javascript
export default {
  server: {
    port: 3001,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
}
```

### HTTPS (Produção)

Use um reverse proxy como Nginx:

```nginx
server {
    listen 443 ssl;
    server_name edufocus.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Banco de Dados Externo

Para usar PostgreSQL ou MySQL, modifique `server/db.js`:

```javascript
// Exemplo com PostgreSQL
const { Pool } = require('pg');

const pool = new Pool({
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 5432
});
```

---

## 🔍 Verificação da Instalação

### Checklist

- [ ] Node.js instalado (`node --version`)
- [ ] npm instalado (`npm --version`)
- [ ] Git instalado (`git --version`)
- [ ] Repositório clonado
- [ ] Dependências instaladas (backend e frontend)
- [ ] Arquivo `.env` criado
- [ ] Servidor backend rodando (porta 5000)
- [ ] Servidor frontend rodando (porta 5173)
- [ ] Acesso ao sistema via navegador
- [ ] Login com credenciais padrão funciona

### Testar Endpoints

```bash
# Teste de saúde
curl http://localhost:5000/api/health

# Teste de login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@edufocus.com","password":"admin123"}'
```

---

## 🐛 Solução de Problemas

### Erro: "Port already in use"

```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:5000 | xargs kill -9
```

### Erro: "Module not found"

```bash
# Reinstalar dependências
rm -rf node_modules client/node_modules
npm install
cd client && npm install
```

### Erro: "Cannot connect to database"

```bash
# Verificar permissões
chmod 755 databases/
chmod 644 databases/*.db

# Recriar banco
rm databases/system.db
npm start
```

### Erro: "CORS blocked"

Verifique `server/server.js`:
```javascript
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
```

---

## 📦 Build para Produção

### Frontend

```bash
cd client
npm run build
```

Arquivos gerados em: `client/dist/`

### Servir Produção

```bash
# Instalar serve
npm install -g serve

# Servir frontend
serve -s client/dist -l 3000
```

### PM2 (Process Manager)

```bash
# Instalar PM2
npm install -g pm2

# Iniciar aplicação
pm2 start server/server.js --name edufocus

# Auto-restart
pm2 startup
pm2 save
```

---

## 🔄 Atualização

```bash
# Parar servidores
# Ctrl+C nos terminais

# Atualizar código
git pull origin main

# Atualizar dependências
npm install
cd client && npm install && cd ..

# Reiniciar
npm start
cd client && npm run dev
```

---

## 📞 Suporte

Se encontrar problemas:

1. Verifique os logs do servidor
2. Verifique o console do navegador (F12)
3. Consulte a [documentação completa](../README.md)
4. Abra uma [issue no GitHub](https://github.com/leopalmeira/EDU03/issues)
5. Entre em contato: suporte@edufocus.com

---

**Instalação concluída com sucesso? Veja o [Guia de Uso](USO.md)!**
