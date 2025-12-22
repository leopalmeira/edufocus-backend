# 📹 SISTEMA DE CÂMERAS - IMPLEMENTAÇÃO SIMPLIFICADA

## ✅ O QUE JÁ EXISTE

- ✅ Tela de Infraestrutura no Super Admin
- ✅ Cadastro de Técnico
- ✅ Sistema de login

## 🎯 O QUE PRECISA SER FEITO

### 1. **Criar Tabela de Câmeras no Banco**
```sql
CREATE TABLE cameras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    classroom_id INT NOT NULL,
    camera_name VARCHAR(255) NOT NULL,
    camera_type ENUM('IP', 'RTSP', 'HTTP') DEFAULT 'IP',
    camera_ip VARCHAR(255),
    camera_url VARCHAR(500) NOT NULL,
    camera_port INT DEFAULT 80,
    camera_username VARCHAR(100),
    camera_password VARCHAR(255),
    status ENUM('active', 'inactive') DEFAULT 'active',
    installed_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    FOREIGN KEY (school_id) REFERENCES schools(id),
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id),
    FOREIGN KEY (installed_by) REFERENCES users(id)
);
```

### 2. **Adicionar Aba "Câmeras" na Infraestrutura**

Na tela de Infraestrutura do Super Admin, adicionar uma nova aba:
- Cadastrar Técnico (já existe)
- Tabela de Valores (já existe)
- **Configurar Câmeras** (NOVO) ← Aqui o técnico configura

### 3. **Interface de Configuração de Câmeras**

```
┌────────────────────────────────────────┐
│ Infraestrutura → Câmeras               │
├────────────────────────────────────────┤
│                                        │
│ Escola: [Selecione ▼]                 │
│ Turma: [Selecione ▼]                  │
│                                        │
│ Nome: [Câmera Sala 1A]                │
│ IP: [192.168.1.100]                   │
│ URL: [http://192.168.1.100/video]    │
│ Porta: [80]                           │
│ Usuário: [admin]                      │
│ Senha: [••••••]                       │
│                                        │
│ [Testar] [Cadastrar]                  │
│                                        │
│ Câmeras Cadastradas:                  │
│ ┌────────────────────────────────────┐│
│ │ ✅ Câmera Sala 1A                  ││
│ │ Escola ABC - 1º Ano A              ││
│ │ 192.168.1.100:80                   ││
│ │ [Editar] [Remover]                 ││
│ └────────────────────────────────────┘│
└────────────────────────────────────────┘
```

### 4. **Professor - Botão Monitorar**

Quando professor clicar em "Monitorar":
```javascript
// 1. Buscar câmera da turma atual
const camera = await api.get(`/teacher/classroom/${classId}/camera`);

// 2. Se encontrou, abrir modal com feed
if (camera) {
    showCameraFeed(camera.url);
} else {
    alert('Câmera não configurada');
}
```

---

## 📁 ARQUIVOS A MODIFICAR

### 1. Banco de Dados
**Arquivo**: Executar SQL no banco
```sql
-- Criar tabela cameras
-- Ver: server/create_cameras_table.sql
```

### 2. Backend (server.js)
**Adicionar endpoints**:
```javascript
// Listar escolas (para dropdown)
GET /api/technician/schools

// Listar turmas de uma escola
GET /api/technician/schools/:id/classrooms

// Cadastrar câmera
POST /api/technician/cameras

// Testar câmera
POST /api/technician/cameras/test

// Listar câmeras
GET /api/technician/cameras

// Professor: buscar câmera da turma
GET /api/teacher/classroom/:id/camera
```

### 3. Frontend - Infraestrutura
**Arquivo**: `client/src/pages/SuperAdminDashboard.jsx` ou similar

**Adicionar aba "Câmeras"**:
```jsx
<Tab>Câmeras</Tab>

// Conteúdo da aba
<TabPanel>
    <CameraConfiguration />
</TabPanel>
```

### 4. Frontend - Professor
**Arquivo**: `client/src/pages/TeacherDashboard.jsx`

**Modificar botão Monitorar**:
```jsx
const handleMonitoring = async () => {
    if (!monitoring) {
        // Buscar câmera
        const res = await api.get(`/teacher/classroom/${selectedClass.id}/camera`);
        if (res.data) {
            setCameraUrl(res.data.camera_url);
            setShowCameraModal(true);
        } else {
            alert('Câmera não configurada');
        }
    }
    setMonitoring(!monitoring);
};
```

---

## 🔄 FLUXO COMPLETO

### 1. Super Admin/Técnico configura câmera
```
1. Acessa Infraestrutura → Câmeras
2. Seleciona Escola
3. Seleciona Turma
4. Preenche dados da câmera
5. Testa conexão
6. Salva
```

### 2. Professor monitora
```
1. Acessa Dashboard
2. Seleciona Turma
3. Clica "Monitorar"
4. Sistema busca câmera da turma
5. Abre modal com feed
6. Inicia análise de emoções
```

---

## ✅ PRÓXIMOS PASSOS

1. **Criar tabela no banco** ✅ (SQL pronto)
2. **Adicionar endpoints** ✅ (Código pronto em `endpoints_cameras.js`)
3. **Adicionar aba Câmeras na Infraestrutura** ⏳
4. **Modificar botão Monitorar do professor** ⏳
5. **Criar modal de câmera** ⏳
6. **Testar fluxo completo** ⏳

---

## 📋 RESUMO

**Onde configurar**: Infraestrutura → Nova aba "Câmeras"
**Quem configura**: Super Admin ou Técnico
**Como vincula**: Escola + Turma específica
**Como professor usa**: Clica "Monitorar" → Sistema busca câmera da turma

---

**🎯 IMPLEMENTAÇÃO SIMPLIFICADA!**

Aproveita estrutura existente de Infraestrutura! 📹

---

*Última atualização: 12/12/2025 09:37*
