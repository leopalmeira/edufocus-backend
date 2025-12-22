# 📥 Download dos Modelos de IA - Face-API.js

## 🎯 Modelos Necessários

Para o sistema de análise de emoções funcionar, você precisa baixar os modelos pré-treinados do face-api.js.

---

## 📁 Estrutura de Pastas

Crie a seguinte estrutura em `public/models/`:

```
public/
└── models/
    ├── tiny_face_detector_model-weights_manifest.json
    ├── tiny_face_detector_model-shard1
    ├── face_landmark_68_model-weights_manifest.json
    ├── face_landmark_68_model-shard1
    ├── face_recognition_model-weights_manifest.json
    ├── face_recognition_model-shard1
    ├── face_expression_model-weights_manifest.json
    └── face_expression_model-shard1
```

---

## 🔗 Download Direto

### Opção 1: Download Manual

Acesse o repositório oficial e baixe os modelos:

**URL:** https://github.com/justadudewhohacks/face-api.js-models/tree/master/models

**Modelos necessários:**
1. `tiny_face_detector` - Detecção rápida de rostos
2. `face_landmark_68` - 68 pontos faciais
3. `face_recognition` - Reconhecimento facial
4. `face_expression` - Classificação de emoções

### Opção 2: Clone do Repositório

```bash
# Clone o repositório de modelos
git clone https://github.com/justadudewhohacks/face-api.js-models.git

# Copie os modelos para a pasta public
cp -r face-api.js-models/models/* client/public/models/
```

### Opção 3: Download via Script (Recomendado)

Crie um script para baixar automaticamente:

```bash
# No diretório client/
mkdir -p public/models

cd public/models

# Tiny Face Detector
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/tiny_face_detector/tiny_face_detector_model-shard1

# Face Landmark 68
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_landmark_68/face_landmark_68_model-shard1

# Face Recognition
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition/face_recognition_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_recognition/face_recognition_model-shard1

# Face Expression
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-weights_manifest.json
curl -O https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master/face_expression/face_expression_model-shard1
```

---

## ✅ Verificação

Após o download, verifique se todos os arquivos estão presentes:

```bash
ls -la client/public/models/

# Deve listar 8 arquivos:
# - tiny_face_detector_model-weights_manifest.json
# - tiny_face_detector_model-shard1
# - face_landmark_68_model-weights_manifest.json
# - face_landmark_68_model-shard1
# - face_recognition_model-weights_manifest.json
# - face_recognition_model-shard1
# - face_expression_model-weights_manifest.json
# - face_expression_model-shard1
```

---

## 🚀 Após o Download

1. Reinicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

2. Acesse o dashboard do professor

3. Clique em "Monitorar"

4. O sistema deve carregar os modelos automaticamente

5. A câmera será ativada e começará a detectar emoções

---

## 📊 Tamanho dos Modelos

| Modelo | Tamanho | Descrição |
|--------|---------|-----------|
| Tiny Face Detector | ~1.2 MB | Detecção rápida |
| Face Landmark 68 | ~350 KB | Pontos faciais |
| Face Recognition | ~6.2 MB | Reconhecimento |
| Face Expression | ~310 KB | Emoções |
| **TOTAL** | **~8 MB** | Todos os modelos |

---

## 🐛 Troubleshooting

### Erro: "Erro ao carregar modelos de IA"

**Causa:** Modelos não encontrados em `/public/models/`

**Solução:**
1. Verifique se a pasta existe: `ls client/public/models/`
2. Baixe os modelos conforme instruções acima
3. Reinicie o servidor

### Erro: "Failed to fetch"

**Causa:** Caminho incorreto ou servidor não está servindo arquivos estáticos

**Solução:**
1. Verifique se o Vite está configurado corretamente
2. Modelos devem estar em `public/models/` (não `src/models/`)
3. Acesse diretamente: `http://localhost:5173/models/tiny_face_detector_model-weights_manifest.json`

---

## 📞 Suporte

Se os modelos não carregarem:
- Verifique o console do navegador (F12)
- Confirme que os arquivos existem
- Teste o acesso direto aos arquivos

---

**Desenvolvido com ❤️ pela equipe EduFocus**
