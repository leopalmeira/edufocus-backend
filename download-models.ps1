# Script PowerShell para baixar modelos do face-api.js
# Autor: EduFocus Team
# Data: 2025-12-17

Write-Host "🔄 Baixando modelos de IA do face-api.js..." -ForegroundColor Cyan

# Criar diretório se não existir
$modelsPath = "client\public\models"
if (!(Test-Path $modelsPath)) {
    New-Item -ItemType Directory -Path $modelsPath -Force | Out-Null
}

Set-Location $modelsPath
Write-Host "📁 Diretório: $((Get-Location).Path)" -ForegroundColor Green

# URL base do repositório
$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js-models/master"

# Função para baixar arquivo
function Download-Model {
    param($url, $output)
    try {
        Write-Host "  Baixando $output..." -ForegroundColor Yellow
        Invoke-WebRequest -Uri $url -OutFile $output -UseBasicParsing
        Write-Host "  ✓ $output baixado" -ForegroundColor Green
    } catch {
        Write-Host "  ✗ Erro ao baixar $output" -ForegroundColor Red
        Write-Host "  $_" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📥 Baixando Tiny Face Detector..." -ForegroundColor Cyan
Download-Model "$baseUrl/tiny_face_detector/tiny_face_detector_model-weights_manifest.json" "tiny_face_detector_model-weights_manifest.json"
Download-Model "$baseUrl/tiny_face_detector/tiny_face_detector_model-shard1" "tiny_face_detector_model-shard1"

Write-Host ""
Write-Host "📥 Baixando Face Landmark 68..." -ForegroundColor Cyan
Download-Model "$baseUrl/face_landmark_68/face_landmark_68_model-weights_manifest.json" "face_landmark_68_model-weights_manifest.json"
Download-Model "$baseUrl/face_landmark_68/face_landmark_68_model-shard1" "face_landmark_68_model-shard1"

Write-Host ""
Write-Host "📥 Baixando Face Recognition..." -ForegroundColor Cyan
Download-Model "$baseUrl/face_recognition/face_recognition_model-weights_manifest.json" "face_recognition_model-weights_manifest.json"
Download-Model "$baseUrl/face_recognition/face_recognition_model-shard1" "face_recognition_model-shard1"

Write-Host ""
Write-Host "📥 Baixando Face Expression..." -ForegroundColor Cyan
Download-Model "$baseUrl/face_expression/face_expression_model-weights_manifest.json" "face_expression_model-weights_manifest.json"
Download-Model "$baseUrl/face_expression/face_expression_model-shard1" "face_expression_model-shard1"

Write-Host ""
Write-Host "✅ Download concluído!" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Arquivos baixados:" -ForegroundColor Cyan
Get-ChildItem | Format-Table Name, Length, LastWriteTime

Write-Host ""
Write-Host "🎉 Modelos prontos para uso!" -ForegroundColor Green
Write-Host "💡 Reinicie o servidor com: npm run dev" -ForegroundColor Yellow

# Voltar ao diretório raiz
Set-Location ..\..\..
