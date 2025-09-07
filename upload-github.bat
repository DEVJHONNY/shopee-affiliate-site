@echo off
echo 🚀 Preparando arquivos para GitHub...
echo.

echo 📁 Verificando arquivos necessários...
if not exist "index.html" (
    echo ❌ index.html não encontrado!
    pause
    exit
)

if not exist "backend\server.js" (
    echo ❌ backend\server.js não encontrado!
    pause
    exit
)

if not exist "backend\package.json" (
    echo ❌ backend\package.json não encontrado!
    pause
    exit
)

echo ✅ Todos os arquivos encontrados!
echo.

echo 📋 Arquivos que serão enviados:
echo    - index.html
echo    - styles.css
echo    - script.js
echo    - config.js
echo    - render.yaml
echo    - README.md
echo    - DEPLOY-RENDER.md
echo    - COMO-EXECUTAR.md
echo    - CRIAR-REPOSITORIO.md
echo    - backend\server.js
echo    - backend\package.json
echo    - .gitignore
echo.

echo 🌐 Próximos passos:
echo    1. Acesse https://github.com
echo    2. Crie uma conta gratuita
echo    3. Clique "New" para criar repositório
echo    4. Nome: shopee-affiliate-api
echo    5. Marque "Public"
echo    6. Clique "Create repository"
echo    7. Clique "uploading an existing file"
echo    8. Arraste todos os arquivos desta pasta
echo    9. Clique "Commit changes"
echo.

echo 📖 Para instruções detalhadas, leia: CRIAR-REPOSITORIO.md
echo.

pause
