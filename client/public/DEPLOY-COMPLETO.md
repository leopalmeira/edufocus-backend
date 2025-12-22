# 🚀 DEPLOY COMPLETO - Site + App

## ✅ O QUE FOI CRIADO:

1. **PWA Guardian** - `/guardian-pwa/index.html`
2. **Página de Download** - `/guardian-download.html` (com QR Code!)

---

## 📱 COMO FUNCIONA:

### 1. Fazer Deploy no Netlify

```bash
# 1. Login
netlify login

# 2. Deploy
cd C:\Users\User\Desktop\edufocus1\edufocus1-main\client\public
netlify deploy --prod --dir .
```

### 2. Você terá 2 links:

**Página de Download (com QR Code):**
```
https://seu-site.netlify.app/guardian-download.html
```

**App PWA:**
```
https://seu-site.netlify.app/guardian-pwa/
```

---

## 🎯 COMO USAR:

1. **Acesse a página de download no PC:**
   - `https://seu-site.netlify.app/guardian-download.html`

2. **Escaneie o QR Code com o celular**

3. **O app abre automaticamente**

4. **Clique em "Instalar App"**

5. **Pronto! App instalado! 🎉**

---

## ⚠️ IMPORTANTE: Configurar IP do Backend

Antes de fazer deploy, troque o IP da API:

**Arquivo:** `guardian-pwa/index.html` - linha 295

**Opção 1 - Ngrok (Temporário):**
```bash
ngrok http 5000
```
Você terá: `https://abc123.ngrok.io`

Troque para:
```javascript
const API_URL = 'https://abc123.ngrok.io/api';
```

**Opção 2 - IP Local (mesma rede):**
```javascript
const API_URL = 'http://SEU_IP:5000/api';
```

**Opção 3 - Hospedar backend (Render.com):**
```javascript
const API_URL = 'https://seu-backend.onrender.com/api';
```

---

## 🚀 QUER QUE EU FAÇA O DEPLOY AGORA?

Responda SIM e eu faço o deploy completo!

Você terá:
- ✅ Site online permanente
- ✅ QR Code funcionando
- ✅ App instalável
- ✅ Tudo gratuito!
