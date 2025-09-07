# 🚀 Como Criar Repositório GitHub e Deploy no Render

## 📝 **Passo a Passo Completo:**

### **1. Criar Conta no GitHub**
- Acesse: https://github.com
- Clique em "Sign up"
- Crie sua conta gratuita

### **2. Criar Repositório**
- Clique no botão verde "New" ou "+"
- **Repository name**: `shopee-affiliate-api`
- **Description**: `Sistema completo para afiliados da Shopee`
- **Public** ✅ (gratuito)
- **Add README** ✅
- Clique "Create repository"

### **3. Fazer Upload dos Arquivos**

#### **Opção A: Upload Manual (Mais Fácil)**
1. No seu repositório GitHub
2. Clique em "uploading an existing file"
3. Arraste todos os arquivos do seu projeto:
   - `index.html`
   - `styles.css`
   - `script.js`
   - `config.js`
   - `render.yaml`
   - `README.md`
   - `DEPLOY-RENDER.md`
   - `COMO-EXECUTAR.md`
   - Pasta `backend/` (com `server.js` e `package.json`)
4. Clique "Commit changes"

#### **Opção B: Git Command Line**
```bash
# No terminal, na pasta do seu projeto
git init
git add .
git commit -m "Primeiro commit - Sistema Shopee API"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/shopee-affiliate-api.git
git push -u origin main
```

### **4. Deploy no Render**

#### **4.1. Criar Conta no Render**
- Acesse: https://render.com
- Clique "Get Started for Free"
- Faça login com GitHub

#### **4.2. Conectar Repositório**
- Clique "New +"
- Selecione "Web Service"
- Conecte com GitHub
- Selecione seu repositório `shopee-affiliate-api`

#### **4.3. Configurar Deploy**
- **Name**: `shopee-api-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: `Free`

#### **4.4. Variáveis de Ambiente**
Adicione:
```
NODE_ENV=production
PORT=10000
```

#### **4.5. Deploy**
- Clique "Create Web Service"
- Aguarde 2-3 minutos
- Pronto! 🎉

## 🌐 **URLs Finais:**

- **Backend**: `https://shopee-api-backend.onrender.com`
- **API**: `https://shopee-api-backend.onrender.com/api/products`
- **Teste**: `https://shopee-api-backend.onrender.com/api/test`

## 📱 **Testar:**

1. **Teste do Backend**: Acesse a URL de teste
2. **Teste do Frontend**: Abra `index.html`
3. **Verificar Logs**: Console do navegador

## 🚨 **Se Der Erro:**

### **Erro de Build:**
- Verifique se `package.json` está na pasta `backend`
- Verifique se todas as dependências estão listadas

### **Erro de Start:**
- Verifique se `server.js` está na pasta `backend`
- Verifique se a porta está configurada

### **Erro de CORS:**
- O backend já está configurado com CORS
- Verifique se a URL está correta

## 💡 **Dicas Importantes:**

1. **GitHub Gratuito** - Repositórios públicos são gratuitos
2. **Render Gratuito** - Plano free disponível
3. **Deploy Automático** - Push no GitHub = Deploy automático
4. **Sempre Atualizado** - Mudanças refletem automaticamente

## 🎯 **Resultado:**

✅ **Repositório GitHub** - Código versionado
✅ **Backend no Render** - API funcionando
✅ **Deploy Automático** - Sempre atualizado
✅ **Sistema Completo** - Pronto para produção

---

**🚀 Em 10 minutos você terá tudo funcionando!**

**Siga os passos acima e sua API da Shopee estará online!**
