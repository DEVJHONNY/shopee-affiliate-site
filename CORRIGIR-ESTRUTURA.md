# 🔧 Corrigir Estrutura do Projeto no GitHub

## ❌ **Problema:**
O Render não está encontrando a pasta `backend` porque os arquivos não estão organizados corretamente.

## ✅ **Solução:**

### **1. Reorganizar Arquivos no GitHub**

#### **Opção A: Deletar e Recriar (Mais Fácil)**
1. Vá para: https://github.com/DEVJHONNY/shopee-affiliate-api
2. Clique em **"Settings"** (aba)
3. Role até o final e clique **"Delete this repository"**
4. Confirme a exclusão
5. Crie um novo repositório com o mesmo nome
6. Faça upload novamente com a estrutura correta

#### **Opção B: Reorganizar Arquivos Existentes**
1. No seu repositório GitHub
2. Clique em **"Create new file"**
3. Nome: `backend/server.js`
4. Cole o conteúdo do arquivo `server.js`
5. Clique **"Commit new file"**
6. Repita para `backend/package.json`

### **2. Estrutura Correta:**

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

### **3. Upload Correto:**

#### **Método 1: Upload Manual**
1. No repositório GitHub
2. Clique **"uploading an existing file"**
3. Arraste os arquivos na ordem correta:
   - Primeiro: arquivos da raiz
   - Depois: pasta `backend/` completa

#### **Método 2: Criar Pasta no GitHub**
1. Clique **"Create new file"**
2. Nome: `backend/server.js`
3. Cole o conteúdo
4. Clique **"Commit new file"**
5. Repita para `backend/package.json`

### **4. Verificar Estrutura:**
Após o upload, seu repositório deve ter:
- ✅ Arquivos na raiz
- ✅ Pasta `backend/` com `server.js` e `package.json`

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

## 🚨 **Se Ainda Der Erro:**

### **Erro: "backend: No such file or directory"**
- Verifique se a pasta `backend/` existe no GitHub
- Verifique se `server.js` e `package.json` estão dentro de `backend/`

### **Erro: "package.json not found"**
- Verifique se `package.json` está em `backend/package.json`
- Verifique se o conteúdo está correto

### **Erro: "server.js not found"**
- Verifique se `server.js` está em `backend/server.js`
- Verifique se o conteúdo está correto

## 💡 **Dica Importante:**

A estrutura deve ser exatamente assim:
```
backend/
├── server.js
└── package.json
```

**NÃO** assim:
```
backend/
└── server.js
package.json  ← ERRADO! Deve estar dentro de backend/
```

## 🎯 **Resultado:**

✅ **Estrutura correta** no GitHub
✅ **Deploy funcionando** no Render
✅ **API GraphQL** funcionando
✅ **Sistema completo** online

---

**🚀 Corrija a estrutura e o deploy funcionará perfeitamente!**
