# 🔧 TROUBLESHOOTING - PAINEL DO TÉCNICO

## ❌ Problema Reportado

**Sintomas**:
- Ao clicar em "Adicionar Câmera", o campo de escola não carrega
- Outros campos não permitem inserir dados

---

## ✅ Soluções Implementadas

### 1. **Logs de Debug Adicionados** 🔍

Agora o sistema mostra no console do navegador:
```
🔍 Carregando escolas...
✅ Escolas carregadas: [...]
```

ou

```
❌ Erro ao carregar escolas: [erro]
⚠️ Usando dados mockados para escolas
```

### 2. **Fallback com Dados Mockados** 💾

Se a API falhar, o sistema usa dados de exemplo:

**Escolas**:
- Escola Municipal Centro - São Paulo
- Colégio Estadual Norte - Rio de Janeiro  
- Instituto Sul - Curitiba

**Turmas** (para qualquer escola):
- 1º Ano A (30 alunos)
- 1º Ano B (28 alunos)
- 2º Ano A (32 alunos)
- 2º Ano B (29 alunos)
- 3º Ano A (31 alunos)

### 3. **Alert de Erro** ⚠️

Se houver erro ao carregar do servidor:
```
⚠️ Erro ao carregar escolas do servidor. Usando dados de exemplo.
```

---

## 🔍 Como Verificar o Problema

### 1. Abrir Console do Navegador
```
F12 → Console
```

### 2. Acessar Painel do Técnico
```
Login como técnico
Ir para "Câmeras"
Clicar "Adicionar Câmera"
```

### 3. Verificar Logs
```
Procurar por:
🔍 Carregando escolas...
✅ ou ❌
```

---

## 🐛 Possíveis Causas

### 1. **Endpoint não existe**
```
❌ 404 Not Found
Solução: Verificar se endpoints foram adicionados ao server.js
```

### 2. **Erro de Autenticação**
```
❌ 401 Unauthorized ou 403 Forbidden
Solução: Verificar se usuário tem role 'technician'
```

### 3. **Servidor não está rodando**
```
❌ Network Error
Solução: Verificar se npm start está rodando
```

### 4. **CORS Error**
```
❌ CORS policy blocked
Solução: Verificar configuração CORS no server.js
```

---

## ✅ Verificações

### Backend

#### 1. Verificar se endpoints existem
```bash
# Procurar no server.js
grep "technician/schools" server/server.js
```

Deve retornar:
```javascript
app.get('/api/technician/schools', ...
app.get('/api/technician/schools/:schoolId/classrooms', ...
```

#### 2. Verificar se servidor está rodando
```bash
# Terminal deve mostrar:
Server running on port 5000
```

#### 3. Testar endpoint manualmente
```bash
# No navegador ou Postman:
GET http://localhost:5000/api/technician/schools
```

### Frontend

#### 1. Verificar se dev server está rodando
```bash
# Terminal deve mostrar:
Local: http://localhost:5173
```

#### 2. Verificar console do navegador
```
F12 → Console
Procurar por erros em vermelho
```

#### 3. Verificar Network tab
```
F12 → Network
Filtrar por "schools"
Ver se requisição foi feita
Ver status code (200, 404, 500, etc)
```

---

## 🔧 Soluções por Erro

### Erro 404 - Endpoint não encontrado
```
Causa: Endpoints não foram adicionados ao server.js
Solução: Copiar endpoints de endpoints_cameras.js para server.js
```

### Erro 401/403 - Não autorizado
```
Causa: Usuário não tem permissão ou token inválido
Solução: 
1. Fazer logout e login novamente
2. Verificar se usuário tem role 'technician'
3. Verificar token no localStorage
```

### Erro 500 - Erro no servidor
```
Causa: Erro no código do backend
Solução: Verificar logs do servidor (terminal npm start)
```

### Network Error - Servidor offline
```
Causa: Servidor não está rodando
Solução: Iniciar servidor com npm start
```

---

## 📋 Checklist de Teste

### Teste Completo

- [ ] 1. Servidor rodando (npm start)
- [ ] 2. Frontend rodando (npm run dev)
- [ ] 3. Login como técnico
- [ ] 4. Acessar "Câmeras"
- [ ] 5. Clicar "Adicionar Câmera"
- [ ] 6. Ver escolas no dropdown
- [ ] 7. Selecionar escola
- [ ] 8. Ver turmas no dropdown
- [ ] 9. Preencher todos os campos
- [ ] 10. Cadastrar câmera

### Se Usar Dados Mockados

- [ ] 1. Ver alert: "Usando dados de exemplo"
- [ ] 2. Ver 3 escolas no dropdown
- [ ] 3. Selecionar escola
- [ ] 4. Ver 5 turmas no dropdown
- [ ] 5. Conseguir preencher todos os campos
- [ ] 6. Conseguir cadastrar (pode dar erro ao salvar)

---

## 🎯 Teste Rápido

### Console do Navegador
```javascript
// Testar se API está acessível
fetch('http://localhost:5000/api/technician/schools', {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('token')
    }
})
.then(r => r.json())
.then(d => console.log('Escolas:', d))
.catch(e => console.error('Erro:', e));
```

---

## 📊 Status Atual

### ✅ Implementado
- Logs de debug
- Fallback com dados mockados
- Alert de erro
- Mensagens claras no console

### ⏳ Para Verificar
- Se endpoints estão no server.js
- Se servidor está rodando
- Se há erros no console
- Se token está válido

---

## 🚀 Próximos Passos

1. **Abrir console do navegador** (F12)
2. **Acessar painel do técnico**
3. **Clicar "Adicionar Câmera"**
4. **Ver logs no console**
5. **Reportar o que aparece**

---

**Logs Esperados (Sucesso)**:
```
🔍 Carregando escolas...
✅ Escolas carregadas: [{id: 1, name: "..."}]
```

**Logs Esperados (Fallback)**:
```
🔍 Carregando escolas...
❌ Erro ao carregar escolas: Error: ...
⚠️ Usando dados mockados para escolas
```

---

*Última atualização: 12/12/2025 10:05*
