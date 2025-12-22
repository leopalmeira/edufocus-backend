# 📹 Sistema de Câmeras - EduFocus

## 📋 Visão Geral

O sistema de câmeras permite:
- 📹 Configurar câmeras IP por sala
- 🔍 Testar conexão antes de salvar
- 👁️ Monitorar salas em tempo real
- 😊 Analisar emoções dos alunos
- 📊 Gerar relatórios de engajamento

---

## 🎯 Papéis e Permissões

### Técnico
- ✅ Configurar câmeras
- ✅ Testar conexão
- ✅ Remover câmeras
- ✅ Ver faturamento

### Professor
- ✅ Visualizar câmera da sua sala
- ✅ Iniciar/parar monitoramento
- ✅ Ver análise de emoções

### Escola
- ✅ Ver quantas salas monitoradas
- ✅ Solicitar instalação

---

## 🔧 Configuração (Técnico)

### 1. Acessar Painel

1. Faça login como técnico
2. Vá em **"Câmeras"**
3. Clique em **"Adicionar Câmera"**

### 2. Buscar Escola

```
🔍 Buscar Escola
[Digite o nome da escola ou cidade...]

Resultados:
- Escola Municipal Centro - São Paulo
- Colégio Estadual Norte - Rio de Janeiro
```

### 3. Preencher Dados

**Campos Obrigatórios:**
- **Escola**: Selecione da lista
- **Turma/Sala**: Selecione a sala
- **Nome da Câmera**: Ex: "Câmera Sala 1A"
- **URL Completa**: Ex: `http://192.168.1.100:80/video`

**Campos Opcionais:**
- **Tipo**: IP Camera, RTSP, HTTP MJPEG
- **IP**: 192.168.1.100
- **Porta**: 80
- **Usuário**: admin
- **Senha**: ••••••
- **Observações**: Notas sobre a instalação

### 4. Testar Conexão

1. Preencha a URL
2. Clique em **"🔍 Testar Conexão"**
3. Aguarde o resultado:

**Sucesso:**
```
✅ Conexão bem-sucedida! Câmera está respondendo.
```

**Erro:**
```
❌ Conexão recusada. Verifique IP e porta.
```

### 5. Cadastrar

1. Clique em **"💾 Cadastrar"**
2. Aguarde confirmação
3. Câmera aparece na lista

---

## 📱 Tipos de Câmeras Suportadas

### 1. IP Camera (HTTP/HTTPS)

**Exemplo:**
```
URL: http://192.168.1.100:80/video
Tipo: IP
Porta: 80
```

**Marcas Compatíveis:**
- Intelbras
- Hikvision
- Dahua
- TP-Link

### 2. RTSP Stream

**Exemplo:**
```
URL: rtsp://192.168.1.100:554/stream
Tipo: RTSP
Porta: 554
```

**Formato:**
```
rtsp://[usuario]:[senha]@[ip]:[porta]/[caminho]
```

### 3. HTTP MJPEG

**Exemplo:**
```
URL: http://192.168.1.100:8080/video.mjpg
Tipo: HTTP
Porta: 8080
```

---

## 🔍 Descobrir IP da Câmera

### Método 1: Software do Fabricante

**Intelbras:**
1. Baixe o "IP Utility"
2. Execute o programa
3. Veja lista de câmeras na rede

**Hikvision:**
1. Baixe o "SADP Tool"
2. Execute
3. Veja IPs detectados

### Método 2: Roteador

1. Acesse o roteador (geralmente `192.168.1.1`)
2. Vá em "Dispositivos Conectados"
3. Procure pela câmera
4. Anote o IP

### Método 3: Angry IP Scanner

1. Baixe: https://angryip.org/
2. Escaneie a rede: `192.168.1.0/24`
3. Identifique a câmera pelas portas abertas (80, 554)

---

## 🎥 Uso pelo Professor

### 1. Iniciar Monitoramento

1. Acesse sua turma
2. Clique em **"📹 Monitorar"**
3. Sistema busca câmera da sala
4. Feed aparece em tela cheia

### 2. Análise de Emoções

Durante o monitoramento:

```
😊 Feliz: 45%
😐 Neutro: 30%
😟 Triste: 15%
😠 Irritado: 10%

Nível de Atenção: 75%
```

### 3. Parar Monitoramento

1. Clique em **"⏹️ Parar"**
2. Dados são salvos
3. Relatório é gerado

---

## 📊 Painel da Escola

### Ver Salas Monitoradas

```
📹 Câmeras Instaladas

Total de salas: 12
Salas com câmera: 8
Cobertura: 66.7%

Salas Monitoradas:
✅ Sala 1A - 1º Ano
✅ Sala 1B - 1º Ano
✅ Sala 2A - 2º Ano
...
```

### Solicitar Instalação

1. Clique em **"Solicitar Instalação"**
2. Selecione as salas
3. Envie solicitação
4. Técnico recebe notificação

---

## 💰 Faturamento (Técnico)

### Tabela de Valores

```
3 câmeras: R$ 250
4 câmeras: R$ 310
5 câmeras: R$ 380
```

### Instalações Realizadas

```
Escola Centro: 3 câmeras = R$ 250
Colégio Norte: 4 câmeras = R$ 310
Instituto Sul: 5 câmeras = R$ 380

Total: R$ 940
```

---

## 🔧 Configuração de Rede

### Requisitos

- **Rede Local**: Câmera e servidor na mesma rede
- **Firewall**: Liberar portas 80, 554, 8080
- **Largura de Banda**: Mínimo 2 Mbps por câmera

### Configurar Câmera

1. **Conecte** a câmera na rede
2. **Acesse** via navegador: `http://[IP-DA-CAMERA]`
3. **Configure**:
   - Resolução: 720p ou 1080p
   - FPS: 15-30
   - Codec: H.264
4. **Teste** o stream

### Portas Comuns

```
HTTP: 80, 8080
HTTPS: 443
RTSP: 554
ONVIF: 8000
```

---

## 🐛 Solução de Problemas

### Câmera Não Conecta

**Sintomas:**
- ❌ Teste de conexão falha
- ❌ "Conexão recusada"

**Soluções:**
1. Verificar se câmera está ligada
2. Verificar IP (ping)
3. Verificar porta
4. Verificar firewall
5. Verificar usuário/senha

### Imagem Não Aparece

**Sintomas:**
- ✅ Conexão OK
- ❌ Vídeo não carrega

**Soluções:**
1. Verificar codec (use H.264)
2. Verificar resolução (máx 1080p)
3. Verificar largura de banda
4. Limpar cache do navegador
5. Testar em outro navegador

### Lag no Vídeo

**Sintomas:**
- ✅ Vídeo carrega
- ❌ Muito atraso

**Soluções:**
1. Reduzir resolução
2. Reduzir FPS
3. Melhorar rede
4. Usar cabo ethernet
5. Verificar CPU do servidor

---

## 🔐 Segurança

### Boas Práticas

1. **Altere senhas padrão** das câmeras
2. **Use senhas fortes** (min 12 caracteres)
3. **Atualize firmware** regularmente
4. **Isole rede** das câmeras (VLAN)
5. **Use HTTPS** quando possível

### Privacidade

- ✅ Vídeos não são gravados
- ✅ Apenas análise em tempo real
- ✅ Dados anonimizados
- ❌ Não compartilhe feeds

---

## 📝 Manutenção

### Checklist Semanal

- [ ] Verificar status de todas as câmeras
- [ ] Testar conexão
- [ ] Limpar lentes
- [ ] Verificar posicionamento
- [ ] Atualizar firmware (se disponível)

### Checklist Mensal

- [ ] Revisar configurações
- [ ] Verificar logs
- [ ] Testar failover
- [ ] Backup de configurações
- [ ] Relatório de uptime

---

## 📊 Relatórios

### Disponíveis

1. **Uptime das Câmeras**
   - Tempo online/offline
   - Falhas detectadas
   - Tempo médio de resposta

2. **Uso por Professor**
   - Horas de monitoramento
   - Salas mais monitoradas
   - Horários de pico

3. **Análise de Emoções**
   - Distribuição de emoções
   - Tendências ao longo do tempo
   - Comparação entre turmas

---

## 🔄 Atualização de Câmera

### Editar Configuração

1. Acesse a lista de câmeras
2. Clique em **"✏️ Editar"**
3. Modifique os campos
4. Teste conexão
5. Salve

### Remover Câmera

1. Clique em **"🗑️ Remover"**
2. Confirme a ação
3. Câmera é desvinculada

---

## 📞 Suporte Técnico

### Contato

- 📧 Email: tecnico@edufocus.com
- 💬 WhatsApp: (21) 99587-9170
- 🎫 Ticket: Painel do Técnico → Suporte

### Informações para Suporte

Ao abrir ticket, informe:
- Modelo da câmera
- IP e porta
- Mensagem de erro
- Logs do sistema
- Prints da tela

---

## 📚 Recursos Adicionais

### Manuais

- [Intelbras](https://www.intelbras.com/pt-br/suporte)
- [Hikvision](https://www.hikvision.com/br/support/)
- [Dahua](https://www.dahuasecurity.com/support)

### Ferramentas

- **VLC Media Player** - Testar streams RTSP
- **IP Camera Viewer** - Visualizar múltiplas câmeras
- **Wireshark** - Analisar tráfego de rede

---

**Câmeras configuradas? Veja o [Guia de Uso](USO.md)!**
