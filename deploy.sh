#!/bin/bash

echo "🚀 Verificando configuração do Git..."
echo "=========================================="

# Verificar se o Git está configurado
if [ -z "$(git config --global user.name)" ] || [ -z "$(git config --global user.email)" ]; then
    echo "⚙️ Configurando Git..."
    git config --global user.name "DEVJHONNY"
    git config --global user.email "lucas.rocha.11@hotmail.com"
fi

echo "🚀 Iniciando deploy do PromoShopee..."
echo "=========================================="

# Verificar se é o diretório correto
if [ ! -f "index.html" ]; then
    echo "❌ Erro: Execute este script na pasta principal do projeto!"
    exit 1
fi

echo "📁 Adicionando arquivos ao Git..."
git add .

echo "📋 Status dos arquivos:"
git status

echo "💾 Fazendo commit..."
git commit -m "🚀 Deploy: $(date +'%d/%m/%Y %H:%M') - Atualização do site"

echo "📤 Enviando para GitHub..."
git push origin main

echo "🔄 Preparando deploy para Netlify..."
if [ ! -f "netlify.toml" ]; then
    echo "📝 Criando arquivo netlify.toml..."
    cat > netlify.toml << EOL
[build]
  publish = "."
  command = ""

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-XSS-Protection = "1; mode=block"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Content-Security-Policy = "default-src 'self'; connect-src 'self' https://*.shopee.com.br https://shopee-backend-jrbl.onrender.com; img-src 'self' https://*.shopee.com.br https://via.placeholder.com data:; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;"
EOL
fi
else
    echo "ℹ️ Para fazer deploy no Netlify:"
    echo "1. Acesse: https://app.netlify.com"
    echo "2. Clique em 'Add new site' > 'Import an existing project'"
    echo "3. Selecione GitHub e escolha este repositório"
    echo "4. Configure:"
    echo "   - Build command: deixe em branco"
    echo "   - Publish directory: ."
    echo "5. Clique em 'Deploy site'"
fi

echo "✅ Processo de deploy concluído!"
echo "📊 Backend: https://shopee-backend.onrender.com"
echo "=========================================="