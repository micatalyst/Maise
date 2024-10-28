@echo off

rem Define o caminho base como o diretório do arquivo batch
set "BASE_DIR=%~dp0"

rem Abre o terminal para o backend e executa o servidor
start cmd /k "cd /d "%BASE_DIR%backend" && node upload-server.js"

rem Aguarda 1 segundo para garantir que o backend inicialize
timeout /t 2 >nul

rem Abre o terminal para o frontend e executa o comando de desenvolvimento
start cmd /k "cd /d "%BASE_DIR%" && yarn run dev"

rem Aguarda 1 segundo para garantir que o frontend carregue corretamente
timeout /t 2 >nul

rem Abre o navegador padrão no localhost:3000
start "" "http://localhost:3000"

rem Aguarda 2 segundos antes de abrir o vs code
timeout /t 2 >nul

rem Abre o Visual Studio Code no diretório atual (raiz do projeto)
where code >nul 2>&1 && code "%BASE_DIR%" >nul 2>&1

rem Aguarda 3 segundos antes de fechar o terminal original
timeout /t 3 >nul

rem Fecha o terminal original
exit


