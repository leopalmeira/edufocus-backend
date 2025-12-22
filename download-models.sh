#!/bin/bash

# Script para baixar modelos do face-api.js
# Autor: EduFocus Team
# Data: 2025-12-17

echo "🔄 Baixando modelos de IA do face-api.js..."

# Criar diretório se não existir
mkdir -p client/public/models
cd client/public/models

echo "📁 Diretório criado: $(pwd)"

# URL base do repositório
BASE_URL="https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master"

echo ""
echo "📥 Baixando Tiny Face Detector..."
curl -L -o tiny_face_detector_model-weights_manifest.json "$BASE_URL/tiny_face_detector/tiny_face_detector_model-weights_manifest.json"
curl -L -o tiny_face_detector_model-shard1 "$BASE_URL/tiny_face_detector/tiny_face_detector_model-shard1"

echo ""
echo "📥 Baixando Face Landmark 68..."
curl -L -o face_landmark_68_model-weights_manifest.json "$BASE_URL/face_landmark_68/face_landmark_68_model-weights_manifest.json"
curl -L -o face_landmark_68_model-shard1 "$BASE_URL/face_landmark_68/face_landmark_68_model-shard1"

echo ""
echo "📥 Baixando Face Recognition..."
curl -L -o face_recognition_model-weights_manifest.json "$BASE_URL/face_recognition/face_recognition_model-weights_manifest.json"
curl -L -o face_recognition_model-shard1 "$BASE_URL/face_recognition/face_recognition_model-shard1"

echo ""
echo "📥 Baixando Face Expression..."
curl -L -o face_expression_model-weights_manifest.json "$BASE_URL/face_expression/face_expression_model-weights_manifest.json"
curl -L -o face_expression_model-shard1 "$BASE_URL/face_expression/face_expression_model-shard1"

echo ""
echo "✅ Download concluído!"
echo ""
echo "📊 Arquivos baixados:"
ls -lh

echo ""
echo "🎉 Modelos prontos para uso!"
echo "💡 Reinicie o servidor com: npm run dev"
