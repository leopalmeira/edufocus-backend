# 🧠 Sistema de Monitoramento de Emoções - EduFocus

## 📋 Visão Geral

O **Sistema de Monitoramento de Emoções** é uma funcionalidade avançada do EduFocus que utiliza Inteligência Artificial para analisar expressões faciais dos alunos em tempo real, fornecendo insights valiosos sobre o engajamento e bem-estar emocional da turma.

---

## 🎯 Funcionalidades

### 1. Detecção de Emoções em Tempo Real

O sistema detecta **7 emoções** diferentes:

| Emoção | Emoji | Descrição |
|--------|-------|-----------|
| **Happy** | 😊 | Felicidade, alegria |
| **Sad** | 😢 | Tristeza, melancolia |
| **Angry** | 😠 | Raiva, irritação |
| **Fearful** | 😨 | Medo, ansiedade |
| **Surprised** | 😲 | Surpresa, espanto |
| **Disgusted** | 🤢 | Nojo, repulsa |
| **Neutral** | 😐 | Neutro, sem emoção aparente |

### 2. Métricas Automáticas

O sistema calcula automaticamente 4 métricas principais:

#### 📊 Atenção da Turma
- **Cálculo:** Baseado em emoções positivas + neutras
- **Fórmula:** `((feliz + surpreso + neutro) / total) * 100`
- **Objetivo:** Medir o nível de foco e concentração

#### 😊 Disposição da Turma
- **Cálculo:** Baseado principalmente em felicidade
- **Fórmula:** `(feliz / total) * 100`
- **Objetivo:** Avaliar energia e motivação

#### 🎯 Engajamento
- **Cálculo:** Inverso de emoções neutras e negativas
- **Fórmula:** `(1 - ((neutro + negativas) / total)) * 100`
- **Objetivo:** Medir participação ativa

#### 📈 Desempenho
- **Cálculo:** Média das outras 3 métricas
- **Fórmula:** `(atenção + disposição + engajamento) / 3`
- **Objetivo:** Indicador geral de performance

### 3. Alertas Inteligentes

O sistema gera alertas automáticos quando detecta:

- ⚠️ **3+ alunos** com emoções negativas (tristeza, raiva, medo)
- ⚠️ **Disposição < 50%** - Poucos alunos felizes
- ⚠️ **70%+ neutros** - Turma possivelmente entediada

### 4. Distribuição por Nível

Classifica alunos em 3 categorias:

- 🟢 **Alta Atenção:** Feliz + Surpreso
- 🟡 **Média Atenção:** Neutro
- 🔴 **Baixa Atenção:** Triste + Raiva + Medo

---

## 🛠️ Tecnologias Utilizadas

### Face-API.js

Biblioteca JavaScript de Computer Vision que roda no navegador.

**Modelos utilizados:**
- `TinyFaceDetector` - Detecção rápida de rostos
- `FaceLandmark68Net` - 68 pontos faciais
- `FaceRecognitionNet` - Reconhecimento facial
- `FaceExpressionNet` - Classificação de emoções

**Precisão:**
- Detecção de rostos: ~95%
- Classificação de emoções: ~85%

### TensorFlow.js

Framework de Machine Learning que permite executar modelos de IA no navegador.

**Vantagens:**
- ✅ Processamento local (privacidade)
- ✅ Sem necessidade de servidor
- ✅ Baixa latência
- ✅ Funciona offline

---

## 📁 Arquivos do Sistema

```
client/
├── src/
│   ├── components/
│   │   └── EmotionMonitor.jsx      # Componente principal
│   └── pages/
│       └── TeacherDashboard.jsx    # Integração no dashboard
│
public/
└── models/                          # Modelos de IA
    ├── tiny_face_detector_model/
    ├── face_landmark_68_model/
    ├── face_recognition_model/
    └── face_expression_model/
```

---

## 🚀 Como Funciona

### Fluxo de Funcionamento

```
1. Professor clica em "Monitorar"
   ↓
2. Sistema solicita permissão da câmera
   ↓
3. Modelos de IA são carregados (uma vez)
   ↓
4. Loop de detecção inicia (10 FPS)
   ↓
5. Para cada frame:
   - Detecta rostos
   - Identifica landmarks faciais
   - Classifica emoções
   - Desenha no canvas
   ↓
6. Processa estatísticas
   ↓
7. Atualiza métricas do dashboard
   ↓
8. Gera alertas se necessário
```

### Processamento em Tempo Real

```javascript
// Detecção a cada 100ms (10 FPS)
const detections = await faceapi
    .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceExpressions();

// Resultado para cada rosto:
{
    expressions: {
        happy: 0.85,      // 85% de confiança
        sad: 0.05,
        angry: 0.02,
        fearful: 0.01,
        surprised: 0.03,
        disgusted: 0.01,
        neutral: 0.03
    }
}
```

---

## 💡 Uso no Dashboard do Professor

### 1. Ativar Monitoramento

```jsx
// Botão no header
<button onClick={() => setMonitoring(!monitoring)}>
    {monitoring ? "Parar" : "Monitorar"}
</button>
```

### 2. Visualizar Câmera

- Vídeo ao vivo com overlay de detecções
- Contador de rostos detectados
- Badge "AO VIVO"
- Estatísticas de emoções em tempo real

### 3. Acompanhar Métricas

Cards atualizados automaticamente:
- Atenção da Turma
- Disposição da Turma
- Desempenho
- Engajamento

### 4. Receber Alertas

Notificações quando:
- Muitos alunos com emoções negativas
- Baixa felicidade geral
- Turma muito neutra (entediada)

---

## 🔧 Configuração

### Pré-requisitos

1. **Modelos de IA**

Baixe os modelos do face-api.js e coloque em `/public/models/`:

```bash
# Estrutura necessária
public/models/
├── tiny_face_detector_model-weights_manifest.json
├── tiny_face_detector_model-shard1
├── face_landmark_68_model-weights_manifest.json
├── face_landmark_68_model-shard1
├── face_recognition_model-weights_manifest.json
├── face_recognition_model-shard1
├── face_expression_model-weights_manifest.json
└── face_expression_model-shard1
```

**Download:** https://github.com/justadudewhohacks/face-api.js-models

2. **Permissões de Câmera**

O navegador solicitará permissão para acessar a câmera. Certifique-se de:
- ✅ Usar HTTPS (ou localhost)
- ✅ Permitir acesso à câmera
- ✅ Câmera funcional

### Instalação

```bash
# Instalar face-api.js
npm install face-api.js

# Já incluído no projeto
```

---

## 📊 Interpretação dos Dados

### Métricas Ideais

| Métrica | Excelente | Bom | Atenção | Crítico |
|---------|-----------|-----|---------|---------|
| Atenção | 85-100% | 70-84% | 50-69% | <50% |
| Disposição | 70-100% | 50-69% | 30-49% | <30% |
| Engajamento | 80-100% | 60-79% | 40-59% | <40% |
| Desempenho | 80-100% | 65-79% | 45-64% | <45% |

### Recomendações por Cenário

#### 🟢 Métricas Altas (>75%)
- ✅ Mantenha o ritmo atual
- ✅ Aproveite para aprofundar conteúdo
- ✅ Introduza conceitos mais complexos

#### 🟡 Métricas Médias (50-75%)
- ⚠️ Faça uma pausa de 5 minutos
- ⚠️ Introduza atividade interativa
- ⚠️ Faça perguntas para engajar

#### 🔴 Métricas Baixas (<50%)
- 🚨 Mude de estratégia imediatamente
- 🚨 Atividade física rápida (alongamento)
- 🚨 Jogo educativo ou música
- 🚨 Revisar conteúdo anterior

---

## 🔒 Privacidade e Segurança

### Proteção de Dados

- ✅ **Processamento Local:** Tudo roda no navegador
- ✅ **Sem Armazenamento:** Imagens não são salvas
- ✅ **Sem Envio:** Dados não saem do dispositivo
- ✅ **Anônimo:** Apenas estatísticas agregadas

### LGPD Compliance

O sistema está em conformidade com a LGPD:
- Não armazena imagens dos alunos
- Não identifica alunos individualmente
- Apenas analisa emoções em tempo real
- Dados são descartados após análise

---

## 🐛 Troubleshooting

### Problema: Modelos não carregam

**Solução:**
```bash
# Verifique se os modelos estão em /public/models/
ls public/models/

# Deve listar:
# - tiny_face_detector_model-*
# - face_landmark_68_model-*
# - face_recognition_model-*
# - face_expression_model-*
```

### Problema: Câmera não ativa

**Possíveis causas:**
1. Permissão negada → Permitir no navegador
2. Câmera em uso → Fechar outros apps
3. HTTP (não HTTPS) → Usar localhost ou HTTPS

### Problema: Detecção lenta

**Soluções:**
- Reduzir resolução da câmera
- Aumentar intervalo de detecção (de 100ms para 200ms)
- Usar modelo mais leve (TinyFaceDetector já é o mais leve)

---

## 📈 Roadmap Futuro

### Próximas Funcionalidades

- [ ] Reconhecimento individual de alunos
- [ ] Histórico de emoções por aluno
- [ ] Gráficos de evolução temporal
- [ ] Exportação de relatórios
- [ ] Integração com câmeras IP
- [ ] Detecção de sonolência
- [ ] Análise de postura corporal
- [ ] Alertas via WhatsApp

---

## 📚 Referências

- [face-api.js Documentation](https://github.com/justadudewhohacks/face-api.js)
- [TensorFlow.js](https://www.tensorflow.org/js)
- [Emotion Recognition Research](https://arxiv.org/abs/1710.07557)

---

## 👨‍💻 Suporte

Para dúvidas ou problemas:
- 📧 Email: suporte@edufocus.com
- 💬 GitHub Issues: [edufocus1/issues](https://github.com/leopalmeira/edufocus1/issues)

---

**Desenvolvido com ❤️ pela equipe EduFocus**
