# 🔧 Comandos Git - Após Instalação

## ⚙️ **1. Configurar Git:**
```bash
git config --global user.name "DEVJHONNY"
git config --global user.email "seu@email.com"
```

## 📁 **2. Reorganizar Arquivos:**
Primeiro, vamos organizar os arquivos com a estrutura correta:

```
projeto/
├── index.html
├── styles.css
├── script.js
├── config.js
├── render.yaml
├── README.md
├── DEPLOY-RENDER.md
├── COMO-EXECUTAR.md
├── CRIAR-REPOSITORIO.md
├── INSTRUCOES-RAPIDAS.md
├── upload-github.bat
├── .gitignore
└── backend/
    ├── server.js
    └── package.json
```

## 🚀 **3. Comandos Git:**
```bash
# Inicializar repositório
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Sistema Shopee API completo - Estrutura correta"

# Renomear branch para main
git branch -M main

# Conectar com GitHub
git remote add origin https://github.com/DEVJHONNY/shopee-affiliate-api.git

# Enviar para GitHub
git push -u origin main
```

## 🎯 **4. Deploy no Render:**
Após o push, faça o deploy no Render:
1. Acesse: https://render.com
2. Clique "New +" → "Web Service"
3. Conecte com GitHub
4. Selecione `shopee-affiliate-api`
5. Configurar:
   - **Name**: `shopee-api-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`
6. Clique "Create Web Service"

## ✅ **Resultado:**
- ✅ Git instalado e configurado
- ✅ Arquivos organizados corretamente
- ✅ Repositório GitHub atualizado
- ✅ Deploy funcionando no Render
- ✅ API GraphQL funcionando

---

**🚀 Siga estes passos após instalar o Git!**
