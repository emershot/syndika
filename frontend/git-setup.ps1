#!/usr/bin/env powershell
# Script para conectar com GitHub e fazer deploy

$gitPath = "C:\Program Files\Git\cmd\git.exe"
$projectPath = "c:\Users\Emerson\Documents\SaaS Condominio"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SYNDIKA - Git Setup & GitHub Push" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar se Git está instalado
if (Test-Path $gitPath) {
    Write-Host "✅ Git encontrado em: $gitPath" -ForegroundColor Green
} else {
    Write-Host "❌ Git não encontrado!" -ForegroundColor Red
    Write-Host "Instale Git em: https://git-scm.com/download/win" -ForegroundColor Yellow
    Write-Host "Depois reinstale a aba do PowerShell e tente novamente" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Entrando no diretório do projeto..." -ForegroundColor Cyan
Set-Location $projectPath

Write-Host ""
Write-Host "1️⃣  Inicializando Git (se necessário)..." -ForegroundColor Cyan
& $gitPath init

Write-Host ""
Write-Host "2️⃣  Adicionando todos os arquivos..." -ForegroundColor Cyan
& $gitPath add .

Write-Host ""
Write-Host "3️⃣  Criando commit inicial..." -ForegroundColor Cyan
& $gitPath commit -m "Initial commit: SYNDIKA MVP - Gestão de Condomínios"

Write-Host ""
Write-Host "4️⃣  Renomeando branch para 'main'..." -ForegroundColor Cyan
& $gitPath branch -M main

Write-Host ""
Write-Host "5️⃣  Adicionando repositório remoto (GitHub)..." -ForegroundColor Cyan
& $gitPath remote add origin https://github.com/emershot/syndika.git

Write-Host ""
Write-Host "6️⃣  Fazendo push para GitHub..." -ForegroundColor Cyan
& $gitPath push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ CONCLUÍDO COM SUCESSO!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "📊 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Vá em: https://vercel.com/dashboard" -ForegroundColor White
Write-Host "2. Clique: Add New → Project" -ForegroundColor White
Write-Host "3. Clique: Import Git Repository" -ForegroundColor White
Write-Host "4. Selecione: syndika" -ForegroundColor White
Write-Host "5. Clique: Import e Deploy" -ForegroundColor White
Write-Host ""
Write-Host "Seu repositório GitHub:" -ForegroundColor Yellow
Write-Host "https://github.com/emershot/syndika" -ForegroundColor Cyan
Write-Host ""
