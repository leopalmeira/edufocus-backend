$baseUrl = "https://raw.githubusercontent.com/justadudewhohacks/face-api.js/master/weights"
$destDir = "C:\Users\User\Desktop\EDU03\client\public\models"

$files = @(
    "face_landmark_68_model-weights_manifest.json",
    "face_landmark_68_model-shard1",
    "face_recognition_model-weights_manifest.json",
    "face_recognition_model-shard1",
    "face_recognition_model-shard2",
    "ssd_mobilenetv1_model-weights_manifest.json",
    "ssd_mobilenetv1_model-shard1",
    "ssd_mobilenetv1_model-shard2",
    "face_expression_model-weights_manifest.json",
    "face_expression_model-shard1"
)

Write-Host "Baixando modelos de IA..." -ForegroundColor Cyan

foreach ($file in $files) {
    $url = "$baseUrl/$file"
    $dest = "$destDir\$file"
    Write-Host "Baixando $file..."
    try {
        Invoke-WebRequest -Uri $url -OutFile $dest
    }
    catch {
        Write-Host "Erro ao baixar $file" -ForegroundColor Red
    }
}

Write-Host "Download concluído!" -ForegroundColor Green
