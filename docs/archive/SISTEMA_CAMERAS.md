# 🎯 SISTEMA COMPLETO DE CÂMERAS - FLUXO TÉCNICO → PROFESSOR

## 📋 FLUXO COMPLETO

### 1. **Super Admin cria Técnico**
```
Super Admin → Criar Usuário
- Nome: João Silva
- Email: tecnico@edufocus.com
- Senha: senha123
- Role: technician ✅
```

### 2. **Técnico acessa Painel**
```
Login: tecnico@edufocus.com
Acesso: Painel do Técnico
Menu: Configuração de Câmeras
```

### 3. **Técnico configura Câmera**
```
1. Seleciona Escola: "Escola Municipal ABC"
2. Seleciona Sala/Turma: "1º Ano A"
3. Configura Câmera:
   - Nome: Câmera Sala 1A
   - IP: 192.168.1.100
   - URL: http://192.168.1.100:80/video
   - Porta: 80
   - Usuário: admin
   - Senha: ••••••
4. Testa Conexão ✅
5. Salva
```

### 4. **Professor acessa Dashboard**
```
Login: professor@teste.com
Seleciona Turma: "1º Ano A"
Dashboard carregado
```

### 5. **Professor clica "Monitorar"**
```
1. Sistema busca câmera da turma "1º Ano A"
2. Encontra: Câmera Sala 1A (192.168.1.100)
3. Abre modal com feed da câmera
4. Inicia análise de emoções
5. Atualiza métricas em tempo real
```

---

## 🗄️ ESTRUTURA DO BANCO

### Tabela: `users` (já existe)
```sql
-- Adicionar role 'technician'
ALTER TABLE users 
MODIFY COLUMN role ENUM('student', 'teacher', 'school', 'superadmin', 'technician');
```

### Tabela: `cameras` (nova)
```sql
CREATE TABLE cameras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    classroom_id INT NOT NULL,  -- Vincula à turma/sala
    camera_name VARCHAR(255) NOT NULL,
    camera_type ENUM('IP', 'RTSP', 'HTTP', 'USB') DEFAULT 'IP',
    camera_ip VARCHAR(255),
    camera_url VARCHAR(500) NOT NULL,
    camera_port INT DEFAULT 80,
    camera_username VARCHAR(100),
    camera_password VARCHAR(255), -- Criptografada
    status ENUM('active', 'inactive') DEFAULT 'active',
    installed_by INT, -- ID do técnico
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
    FOREIGN KEY (installed_by) REFERENCES users(id)
);
```

---

## 👨‍🔧 PAINEL DO TÉCNICO

### Interface
```
┌────────────────────────────────────────────┐
│ 📹 Configuração de Câmeras - Técnico      │
├────────────────────────────────────────────┤
│                                            │
│ 🏫 Escola: [Escola Municipal ABC ▼]       │
│                                            │
│ 🚪 Turma/Sala: [1º Ano A ▼]              │
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │ 📹 Nova Câmera                         │ │
│ │                                        │ │
│ │ Nome: [Câmera Sala 1A]                │ │
│ │ Tipo: [IP Camera ▼]                   │ │
│ │ IP: [192.168.1.100]                   │ │
│ │ URL: [http://192.168.1.100:80/video] │ │
│ │ Porta: [80]                           │ │
│ │ Usuário: [admin]                      │ │
│ │ Senha: [••••••]                       │ │
│ │                                        │ │
│ │ [🔍 Testar] [💾 Salvar]               │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ 📋 Câmeras Configuradas:                  │
│ ┌────────────────────────────────────────┐ │
│ │ ✅ Câmera Sala 1A                      │ │
│ │ 🏫 Escola Municipal ABC                │ │
│ │ 🚪 1º Ano A                            │ │
│ │ 🌐 192.168.1.100:80                    │ │
│ │ [✏️ Editar] [🗑️ Remover]              │ │
│ └────────────────────────────────────────┘ │
└────────────────────────────────────────────┘
```

### Funcionalidades
- ✅ Listar todas as escolas
- ✅ Listar turmas/salas da escola selecionada
- ✅ Configurar câmera para sala específica
- ✅ Testar conexão antes de salvar
- ✅ Editar câmeras existentes
- ✅ Ativar/Desativar câmeras
- ✅ Remover câmeras

---

## 👨‍🏫 PAINEL DO PROFESSOR

### Botão "Monitorar"
```
┌────────────────────────────────────────┐
│ Dashboard - 1º Ano A                   │
│ [📹 Monitorar] 🔄 🔔 📥              │
└────────────────────────────────────────┘
```

### Ao Clicar "Monitorar"

#### Se câmera configurada ✅
```
┌────────────────────────────────────────────┐
│ 📹 Monitoramento - 1º Ano A                │
├────────────────────────────────────────────┤
│                                            │
│ ┌────────────────────────────────────────┐ │
│ │                                        │ │
│ │     [FEED DA CÂMERA AO VIVO]          │ │
│ │                                        │ │
│ │     Câmera Sala 1A                    │ │
│ │     192.168.1.100:80                  │ │
│ │                                        │ │
│ └────────────────────────────────────────┘ │
│                                            │
│ ● AO VIVO  |  24 alunos na sala           │
│                                            │
│ 😊 Feliz: 12  😐 Neutro: 8  😢 Triste: 4  │
│                                            │
│ [⏸️ Parar Monitoramento]                  │
└────────────────────────────────────────────┘
```

#### Se câmera NÃO configurada ❌
```
┌────────────────────────────────────────────┐
│ ⚠️ Câmera Não Configurada                 │
├────────────────────────────────────────────┤
│                                            │
│ A câmera ainda não foi configurada para   │
│ esta sala.                                 │
│                                            │
│ Entre em contato com o técnico para        │
│ instalar e configurar a câmera.            │
│                                            │
│ [OK]                                       │
└────────────────────────────────────────────┘
```

---

## 🔌 ENDPOINTS DA API

### Super Admin - Criar Técnico
```javascript
POST /api/superadmin/users
Body: {
    name: "João Silva",
    email: "tecnico@edufocus.com",
    password: "senha123",
    role: "technician"
}
```

### Técnico - Listar Escolas
```javascript
GET /api/technician/schools
Response: [
    { id: 1, name: "Escola Municipal ABC", city: "São Paulo" }
]
```

### Técnico - Listar Turmas/Salas
```javascript
GET /api/technician/schools/1/classrooms
Response: [
    { id: 1, name: "1º Ano A", capacity: 30 },
    { id: 2, name: "1º Ano B", capacity: 28 }
]
```

### Técnico - Configurar Câmera
```javascript
POST /api/technician/cameras
Body: {
    school_id: 1,
    classroom_id: 1,
    camera_name: "Câmera Sala 1A",
    camera_type: "IP",
    camera_ip: "192.168.1.100",
    camera_url: "http://192.168.1.100:80/video",
    camera_port: 80,
    camera_username: "admin",
    camera_password: "senha123"
}
```

### Técnico - Testar Câmera
```javascript
POST /api/technician/cameras/test
Body: {
    camera_url: "http://192.168.1.100:80/video",
    camera_type: "IP"
}
Response: {
    success: true,
    message: "✅ Conexão bem-sucedida!"
}
```

### Professor - Obter Câmera da Turma
```javascript
GET /api/teacher/classroom/1/camera
Response: {
    id: 1,
    camera_name: "Câmera Sala 1A",
    camera_url: "http://192.168.1.100:80/video",
    camera_type: "IP",
    status: "active"
}
```

---

## 🎯 FLUXO TÉCNICO DETALHADO

### 1. Super Admin cria Técnico
```sql
INSERT INTO users (name, email, password, role)
VALUES ('João Silva', 'tecnico@edufocus.com', '$2b$10$...', 'technician');
```

### 2. Técnico faz Login
```
POST /api/login
Body: { email: "tecnico@edufocus.com", password: "senha123" }
Response: { token: "...", user: { role: "technician" } }
```

### 3. Técnico acessa Painel
```
Rota: /technician/cameras
Componente: TechnicianCameras.jsx
```

### 4. Técnico configura Câmera
```
1. GET /api/technician/schools → Lista escolas
2. Seleciona escola → GET /api/technician/schools/1/classrooms
3. Seleciona turma → Preenche formulário
4. POST /api/technician/cameras/test → Testa conexão
5. POST /api/technician/cameras → Salva configuração
```

### 5. Câmera salva no banco
```sql
INSERT INTO cameras (
    school_id, classroom_id, camera_name, camera_url, installed_by
) VALUES (
    1, 1, 'Câmera Sala 1A', 'http://192.168.1.100:80/video', 5
);
```

---

## 🎓 FLUXO PROFESSOR DETALHADO

### 1. Professor faz Login
```
POST /api/login
Body: { email: "professor@teste.com", password: "senha123" }
```

### 2. Professor seleciona Turma
```
GET /api/teacher/classes
Response: [{ id: 1, name: "1º Ano A" }]
```

### 3. Professor clica "Monitorar"
```javascript
// No componente TeacherDashboard.jsx
const handleMonitoring = async () => {
    try {
        // Busca câmera da turma
        const res = await api.get(`/teacher/classroom/${selectedClass.id}/camera`);
        
        if (res.data) {
            // Câmera encontrada - abre modal
            setCameraData(res.data);
            setShowCameraModal(true);
            setMonitoring(true);
        }
    } catch (err) {
        if (err.response?.status === 404) {
            // Câmera não configurada
            alert('⚠️ Câmera não configurada para esta sala. Contate o técnico.');
        }
    }
};
```

### 4. Modal de Câmera abre
```javascript
<CameraModal 
    camera={cameraData}
    onClose={() => setShowCameraModal(false)}
/>
```

### 5. Feed da câmera é exibido
```javascript
<video 
    src={camera.camera_url}
    autoPlay
    style={{ width: '100%', borderRadius: '8px' }}
/>
```

---

## 📁 ARQUIVOS CRIADOS

### Backend
- ✅ `server/create_cameras_table.sql` - Tabela de câmeras
- ✅ `server/endpoints_cameras.js` - Endpoints da API

### Frontend
- ✅ `client/src/components/TechnicianCameras.jsx` - Painel do técnico
- ⏳ `client/src/components/CameraModal.jsx` - Modal para professor (próximo)

### Documentação
- ✅ `SISTEMA_CAMERAS.md` - Documentação completa

---

## ✅ CHECKLIST DE IMPLEMENTAÇÃO

### Banco de Dados
- [ ] Adicionar role 'technician' na tabela users
- [ ] Criar tabela cameras
- [ ] Executar script SQL

### Backend
- [ ] Copiar endpoints de `endpoints_cameras.js` para `server.js`
- [ ] Testar endpoints do técnico
- [ ] Testar endpoints do professor

### Frontend - Técnico
- [ ] Adicionar rota `/technician/cameras`
- [ ] Testar seleção de escola
- [ ] Testar seleção de turma
- [ ] Testar configuração de câmera
- [ ] Testar teste de conexão

### Frontend - Professor
- [ ] Modificar botão "Monitorar"
- [ ] Criar CameraModal
- [ ] Integrar com API
- [ ] Testar exibição de câmera
- [ ] Adicionar análise de emoções

---

**🎯 SISTEMA COMPLETO PLANEJADO!**

Super Admin → Técnico → Câmera → Professor → Monitoramento! 📹

---

*Última atualização: 12/12/2025 09:36*
