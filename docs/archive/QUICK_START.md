# 🚀 Início Rápido - Deploy EduFocus

## Opção 1: Deploy Automático (Mais Fácil)

### Passo 1: Preparar GitHub
```powershell
cd C:\Users\User\Desktop\EDU03
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/SEU_USUARIO/edufocus.git
git push -u origin main
```

### Passo 2: Deploy no Render
1. Acesse: https://render.com
2. Faça login com GitHub
3. Clique em "New +" → "Blueprint"
4. Selecione o repositório `edufocus`
5. O Render detectará o `render.yaml` e criará tudo automaticamente!

### Passo 3: Configurar Variáveis
Após o deploy, configure:

**Backend:**
- `FRONTEND_URL`: URL do frontend gerado

**Frontend:**
- `VITE_API_URL`: URL do backend + `/api`

---

## Opção 2: Deploy Manual (Mais Controle)

Siga o guia completo em: **DEPLOY_GUIDE.md**

---

## ✅ Verificar Deploy

1. Acesse a URL do frontend
2. Login: `admin@edufocus.com` / `admin123`
3. Se funcionar, está tudo OK! 🎉

---

## 🆘 Problemas?

Consulte: **DEPLOY_GUIDE.md** → Seção Troubleshooting
