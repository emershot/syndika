# Git Push to GitHub - Script
# Usar com: .\github-push.ps1

$git = "C:\Users\Emerson\Downloads\PortableGit\bin\git.exe"
$repo = "c:\Users\Emerson\Documents\syndika-monorepo"

Write-Host "=================="
Write-Host "🚀 GITHUB PUSH"
Write-Host "=================="
Write-Host ""

Set-Location $repo
Write-Host "📍 Repositório: $repo"
Write-Host ""

# Step 1: Verificar remotes
Write-Host "Step 1: Verificando configuração..."
Write-Host "---"
$remotes = @(& $git remote -v)
if ($remotes.Count -eq 0) {
    Write-Host "❌ Nenhum remote configurado!"
    Write-Host "Adicionando origin..."
    & $git remote add origin https://github.com/emershot/syndika.git
    Write-Host "✅ Origin adicionado"
} else {
    Write-Host "✅ Remotes existentes:"
    foreach ($remote in $remotes) {
        Write-Host "   $remote"
    }
}
Write-Host ""

# Step 2: Verificar branch
Write-Host "Step 2: Configurando branch..."
Write-Host "---"
$branch = @(& $git branch)[0]
Write-Host "Branch atual: $branch"
if ($branch -ne "* main") {
    Write-Host "Renomeando para 'main'..."
    & $git branch -M main
    Write-Host "✅ Branch renomeado para main"
} else {
    Write-Host "✅ Branch já é main"
}
Write-Host ""

# Step 3: Check status
Write-Host "Step 3: Status atual..."
Write-Host "---"
$status = @(& $git status --short)
if ($status.Count -eq 0) {
    Write-Host "✅ Tudo limpo, pronto para push"
} else {
    Write-Host "⚠️  Arquivos não commitados:"
    foreach ($line in $status) {
        Write-Host "   $line"
    }
}
Write-Host ""

# Step 4: Push
Write-Host "Step 4: Enviando para GitHub..."
Write-Host "---"
Write-Host "⏳ Isso pode levar alguns minutos..."
Write-Host ""

try {
    $result = & $git push -u origin main 2>&1
    Write-Host $result
    Write-Host ""
    Write-Host "✅ PUSH CONCLUÍDO COM SUCESSO!"
} catch {
    Write-Host "⚠️  Erro no push: $_"
    Write-Host ""
    Write-Host "Tentando pull primeiro..."
    & $git pull origin main --allow-unrelated-histories 2>&1 | Out-Null
    Write-Host "Tentando push novamente..."
    & $git push -u origin main 2>&1
    Write-Host "✅ Push completo após pull"
}

Write-Host ""
Write-Host "📊 Resultado Final:"
Write-Host "---"
Write-Host "Remotes:"
& $git remote -v 2>&1
Write-Host ""
Write-Host "Últimos commits:"
& $git log --oneline -3 2>&1
Write-Host ""
Write-Host "🔗 Acesse: https://github.com/emershot/syndika"
