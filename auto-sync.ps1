# Script de Sincronização Automática com GitHub
# Mantém o projeto EDU03 sincronizado com o repositório GitHub em tempo real

Write-Host "🔄 SINCRONIZAÇÃO AUTOMÁTICA ATIVADA" -ForegroundColor Green
Write-Host "Monitorando mudanças em: C:\Users\User\Desktop\EDU03" -ForegroundColor Cyan
Write-Host "Sincronizando para: C:\Users\User\Documents\GitHub\edufocus1" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pressione Ctrl+C para parar" -ForegroundColor Yellow
Write-Host "================================================" -ForegroundColor Gray
Write-Host ""

$sourceDir = "C:\Users\User\Desktop\EDU03"
$targetDir = "C:\Users\User\Documents\GitHub\edufocus1"
$gitExe = "C:\Program Files\Git\cmd\git.exe"

# Função para sincronizar arquivos
function Sync-Files {
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] Sincronizando arquivos..." -ForegroundColor Yellow
    
    # Copiar pastas principais
    Copy-Item -Path "$sourceDir\server\*" -Destination "$targetDir\server\" -Recurse -Force -Exclude "node_modules","*.db"
    Copy-Item -Path "$sourceDir\client\*" -Destination "$targetDir\client\" -Recurse -Force -Exclude "node_modules","dist"
    Copy-Item -Path "$sourceDir\package.json" -Destination "$targetDir\package.json" -Force
    Copy-Item -Path "$sourceDir\package-lock.json" -Destination "$targetDir\package-lock.json" -Force -ErrorAction SilentlyContinue
    Copy-Item -Path "$sourceDir\.gitignore" -Destination "$targetDir\.gitignore" -Force -ErrorAction SilentlyContinue
    
    Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✅ Arquivos copiados" -ForegroundColor Green
}

# Função para fazer commit e push
function Git-Sync {
    param([string]$message = "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')")
    
    Set-Location $targetDir
    
    # Verificar se há mudanças
    $status = & $gitExe status --porcelain
    
    if ($status) {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] 📤 Enviando para GitHub..." -ForegroundColor Cyan
        
        & $gitExe add .
        & $gitExe commit -m $message
        & $gitExe push origin main
        
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ✅ Enviado para GitHub!" -ForegroundColor Green
        Write-Host ""
    } else {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ℹ️  Nenhuma mudança detectada" -ForegroundColor Gray
    }
}

# Loop principal - sincroniza a cada 30 segundos
while ($true) {
    try {
        Sync-Files
        Git-Sync
        
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ⏳ Aguardando 30 segundos..." -ForegroundColor DarkGray
        Start-Sleep -Seconds 30
    }
    catch {
        Write-Host "[$(Get-Date -Format 'HH:mm:ss')] ❌ Erro: $_" -ForegroundColor Red
        Start-Sleep -Seconds 5
    }
}
