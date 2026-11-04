@echo off
chcp 65001 >nul
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo O Node.js nao esta instalado. Baixe a versao LTS em https://nodejs.org e rode este arquivo de novo.
  pause
  exit /b
)
if not exist node_modules (
  echo Instalando dependencias, aguarde...
  call npm.cmd install
)
start "" http://localhost:3000/html/equipes.html
echo Servidor ligado. Deixe esta janela aberta enquanto usa o site.
call npm.cmd start
pause
