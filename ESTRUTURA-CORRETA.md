# 📁 Estrutura Correta do Projeto

## 🚨 **Problema Atual:**
O Render não encontra a pasta `backend` porque os arquivos não estão organizados corretamente.

## ✅ **Solução Rápida:**

### **1. Deletar Repositório Atual:**
1. Vá para: https://github.com/DEVJHONNY/shopee-affiliate-api
2. Clique **"Settings"** (aba)
3. Role até o final
4. Clique **"Delete this repository"**
5. Confirme a exclusão

### **2. Criar Novo Repositório:**
1. Clique **"New"** no GitHub
2. Nome: `shopee-affiliate-api`
3. Marque **"Public"**
4. Clique **"Create repository"**

### **3. Upload com Estrutura Correta:**

#### **Passo 1: Upload dos Arquivos da Raiz**
1. Clique **"uploading an existing file"**
2. Arraste estes arquivos:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `config.js`
   - `render.yaml`
   - `README.md`
   - `DEPLOY-RENDER.md`
   - `COMO-EXECUTAR.md`
   - `CRIAR-REPOSITORIO.md`
   - `INSTRUCOES-RAPIDAS.md`
   - `upload-github.bat`
   - `.gitignore`
3. Clique **"Commit changes"**

#### **Passo 2: Criar Pasta Backend**
1. Clique **"Create new file"**
2. Nome: `backend/server.js`
3. Cole o conteúdo do arquivo `server.js`
4. Clique **"Commit new file"**

#### **Passo 3: Adicionar package.json**
1. Clique **"Create new file"**
2. Nome: `backend/package.json`
3. Cole o conteúdo do arquivo `package.json`
4. Clique **"Commit new file"**

### **4. Verificar Estrutura:**
Seu repositório deve ficar assim:
```
shopee-affiliate-api/
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

### **5. Deploy no Render:**
1. Vá para: https://render.com
2. Clique **"New +"** → **"Web Service"**
3. Conecte com GitHub
4. Selecione `shopee-affiliate-api`
5. Configurar:
   - **Name**: `shopee-api-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: `Free`
6. Clique **"Create Web Service"**

## 🎯 **Resultado:**
✅ **Estrutura correta** no GitHub
✅ **Deploy funcionando** no Render
✅ **API GraphQL** funcionando
✅ **Sistema completo** online

---

**🚀 Siga estes passos e o deploy funcionará perfeitamente!**
