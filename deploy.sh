#!/bin/bash

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

echo "✅ Deploy concluído!"
echo "🌐 Site: https://devjhonny.github.io/shopee-affiliate-site/"
echo "📊 Backend: https://shopee-backend.onrender.com"
echo "=========================================="