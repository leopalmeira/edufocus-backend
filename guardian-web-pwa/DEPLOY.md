# 🚀 Deploy do PWA Guardian

## Opção 1: Netlify (Recomendado - Gratuito)

### 1. Crie conta no Netlify:
https://app.netlify.com/signup

### 2. Instale o Netlify CLI:
```bash
npm install -g netlify-cli
```

### 3. Faça login:
```bash
netlify login
```

### 4. Deploy:
```bash
cd C:\Users\User\Desktop\edufocus1\edufocus1-main\client\public\guardian-pwa
netlify deploy --prod
```

### 5. Você receberá um link tipo:
```
https://edufocus-guardian.netlify.app
```

---

## Opção 2: Vercel (Alternativa Gratuita)

### 1. Instale Vercel CLI:
```bash
npm install -g vercel
```

### 2. Deploy:
```bash
cd C:\Users\User\Desktop\edufocus1\edufocus1-main\client\public\guardian-pwa
vercel --prod
```

---

## Opção 3: GitHub Pages (Gratuito)

### 1. Crie repositório no GitHub
### 2. Faça push da pasta guardian-pwa
### 3. Ative GitHub Pages nas configurações
### 4. Link será: `https://seu-usuario.github.io/guardian-pwa`

---

## ⚠️ IMPORTANTE: Trocar URL da API

Depois do deploy, você precisa trocar a URL da API no código:

**Arquivo:** `index.html` - linha 295

**Trocar:**
```javascript
const API_URL = 'http://localhost:5000/api';
```

**Por:**
```javascript
const API_URL = 'http://SEU_IP:5000/api';
```

Ou melhor ainda, hospedar o backend também!

---

## 🎯 Quer que eu faça o deploy agora?

Responda qual opção prefere:
- **Netlify** (mais fácil)
- **Vercel** (alternativa)
- **GitHub Pages** (mais manual)
