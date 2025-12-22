-- ============================================
-- TABELA DE CÂMERAS
-- ============================================

CREATE TABLE IF NOT EXISTS cameras (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    classroom_id INT,
    camera_name VARCHAR(255) NOT NULL,
    camera_type ENUM('IP', 'USB', 'RTSP', 'HTTP') DEFAULT 'IP',
    camera_ip VARCHAR(255),
    camera_url VARCHAR(500) NOT NULL,
    camera_port INT DEFAULT 80,
    camera_username VARCHAR(100),
    camera_password VARCHAR(255),
    status ENUM('active', 'inactive', 'maintenance') DEFAULT 'active',
    installed_by INT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_check TIMESTAMP NULL,
    
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (classroom_id) REFERENCES classrooms(id) ON DELETE SET NULL,
    FOREIGN KEY (installed_by) REFERENCES users(id) ON DELETE SET NULL,
    
    INDEX idx_school_classroom (school_id, classroom_id),
    INDEX idx_status (status),
    INDEX idx_classroom (classroom_id)
);

-- ============================================
-- DADOS DE EXEMPLO (OPCIONAL)
-- ============================================

-- Exemplo de câmera IP
INSERT INTO cameras (
    school_id,
    classroom_id,
    camera_name,
    camera_type,
    camera_ip,
    camera_url,
    camera_port,
    camera_username,
    notes,
    installed_by
) VALUES (
    1, -- ID da escola
    1, -- ID da sala
    'Câmera Sala 1A',
    'IP',
    '192.168.1.100',
    'http://192.168.1.100:80/video',
    80,
    'admin',
    'Câmera instalada em 12/12/2025',
    1 -- ID do técnico
);

-- Exemplo de câmera RTSP
INSERT INTO cameras (
    school_id,
    classroom_id,
    camera_name,
    camera_type,
    camera_url,
    camera_username,
    notes,
    installed_by
) VALUES (
    1,
    2,
    'Câmera Sala 2B',
    'RTSP',
    'rtsp://192.168.1.101:554/stream',
    'admin',
    'Stream RTSP configurado',
    1
);

-- ============================================
-- CONSULTAS ÚTEIS
-- ============================================

-- Listar todas as câmeras ativas
SELECT 
    c.id,
    c.camera_name,
    s.name as school_name,
    cl.name as classroom_name,
    c.camera_type,
    c.camera_url,
    c.status
FROM cameras c
LEFT JOIN schools s ON c.school_id = s.id
LEFT JOIN classrooms cl ON c.classroom_id = cl.id
WHERE c.status = 'active'
ORDER BY s.name, cl.name;

-- Listar câmeras por escola
SELECT 
    c.*,
    cl.name as classroom_name
FROM cameras c
LEFT JOIN classrooms cl ON c.classroom_id = cl.id
WHERE c.school_id = 1
ORDER BY cl.name;

-- Verificar câmeras sem sala atribuída
SELECT 
    c.id,
    c.camera_name,
    s.name as school_name,
    c.camera_url
FROM cameras c
JOIN schools s ON c.school_id = s.id
WHERE c.classroom_id IS NULL;

-- Estatísticas de câmeras
SELECT 
    s.name as school_name,
    COUNT(c.id) as total_cameras,
    SUM(CASE WHEN c.status = 'active' THEN 1 ELSE 0 END) as active_cameras,
    SUM(CASE WHEN c.status = 'inactive' THEN 1 ELSE 0 END) as inactive_cameras
FROM schools s
LEFT JOIN cameras c ON s.id = c.school_id
GROUP BY s.id, s.name
ORDER BY total_cameras DESC;
