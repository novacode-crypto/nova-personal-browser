@echo off
title NOVA Browser - Dev
color 0A

echo.
echo  ███╗   ██╗ ██████╗ ██╗   ██╗ █████╗ 
echo  ████╗  ██║██╔═══██╗██║   ██║██╔══██╗
echo  ██╔██╗ ██║██║   ██║██║   ██║███████║
echo  ██║╚██╗██║██║   ██║╚██╗ ██╔╝██╔══██║
echo  ██║ ╚████║╚██████╔╝ ╚████╔╝ ██║  ██║
echo  ╚═╝  ╚═══╝ ╚═════╝   ╚═══╝  ╚═╝  ╚═╝
echo.
echo  Personal Browser Suite - DEV MODE
echo  ─────────────────────────────────────
echo.

cd /d "%~dp0"

echo  [1/3] Instalando Electron...
call npm install electron@28 --save-dev --silent
echo  Electron listo!
echo.

echo  [2/3] Iniciando Vite...
start "NOVA - Vite Server" cmd /k "cd /d "%~dp0" && pnpm run dev:vite"

echo  Esperando Vite... (5s)
timeout /t 5 /nobreak > nul

echo  [3/3] Iniciando NOVA...
start "NOVA - Electron" cmd /k "cd /d "%~dp0" && node_modules\.bin\electron ."

echo.
echo  NOVA iniciado!
timeout /t 2 /nobreak > nul
exit