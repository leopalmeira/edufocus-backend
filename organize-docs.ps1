# Script para organizar documentação
# Move arquivos .md antigos para docs/archive

Write-Host "🗂️  Organizando documentação..." -ForegroundColor Cyan

# Criar pasta archive se não existir
$archivePath = "docs\archive"
if (-not (Test-Path $archivePath)) {
    New-Item -ItemType Directory -Path $archivePath | Out-Null
}

# Lista de arquivos para manter na raiz
$keepInRoot = @(
    "README.md",
    "LICENSE",
    ".gitignore"
)

# Lista de arquivos para manter em docs
$keepInDocs = @(
    "README.md",
    "INSTALACAO.md",
    "WHATSAPP.md",
    "CAMERAS.md",
    "USO.md",
    "API.md",
    "FAQ.md"
)

# Mover arquivos .md da raiz para archive (exceto os da lista)
Write-Host "`n📄 Movendo arquivos da raiz..." -ForegroundColor Yellow
Get-ChildItem -Path "." -Filter "*.md" | ForEach-Object {
    if ($keepInRoot -notcontains $_.Name) {
        $dest = Join-Path $archivePath $_.Name
        if (Test-Path $dest) {
            Write-Host "  ⚠️  $($_.Name) já existe no arquivo, pulando..." -ForegroundColor Gray
        } else {
            Move-Item $_.FullName $dest -Force
            Write-Host "  ✅ $($_.Name) → archive/" -ForegroundColor Green
        }
    }
}

Write-Host "`n✨ Organização concluída!" -ForegroundColor Green
Write-Host "`nArquivos mantidos na raiz:" -ForegroundColor Cyan
Get-ChildItem -Path "." -Filter "*.md" | ForEach-Object {
    Write-Host "  📄 $($_.Name)" -ForegroundColor White
}

Write-Host "`nArquivos em docs/:" -ForegroundColor Cyan
Get-ChildItem -Path "docs" -Filter "*.md" | ForEach-Object {
    Write-Host "  📄 $($_.Name)" -ForegroundColor White
}

Write-Host "`nArquivos arquivados:" -ForegroundColor Cyan
$archived = Get-ChildItem -Path $archivePath -Filter "*.md"
Write-Host "  Total: $($archived.Count) arquivos" -ForegroundColor White

Write-Host "`n🎯 Próximos passos:" -ForegroundColor Yellow
Write-Host "  1. Revise o README.md principal"
Write-Host "  2. Verifique a documentação em docs/"
Write-Host "  3. Commit as mudanças no Git"
Write-Host ""
