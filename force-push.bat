@echo off
echo ============================================
echo   FORCE PUSH PARA GITHUB - MANUAL
echo ============================================
echo.

cd /d "c:\Users\Emerson\Documents\syndika-monorepo"

set GIT=C:\Users\Emerson\Downloads\PortableGit\bin\git.exe

echo [1/5] Adicionando arquivos...
"%GIT%" add -A

echo [2/5] Fazendo commit...
"%GIT%" commit -m "Final monorepo setup - Feb 2026"

echo [3/5] Configurando branch main...
"%GIT%" branch -M main

echo [4/5] Configurando remote...
"%GIT%" remote set-url origin https://github.com/emershot/syndika.git

echo [5/5] FORCE PUSH para GitHub...
echo ⏳ Isso pode pedir autenticacao...
echo.

"%GIT%" push -u origin main --force

echo.
echo ============================================
echo   CONCLUIDO!
echo ============================================
echo.
echo Atualize o GitHub e veja:
echo https://github.com/emershot/syndika
echo.
echo Deve mostrar: Updated on Feb 3, 2026
echo.
pause
