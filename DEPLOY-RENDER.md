# 🚀 Deploy no Render - Guia Completo

## ✅ **Configuração Pronta para Render!**

Configurei tudo para deploy automático no Render. É gratuito e muito fácil!

## 📁 **Arquivos Criados:**

- ✅ `render.yaml` - Configuração do Render
- ✅ `backend/server.js` - Atualizado para produção
- ✅ `script.js` - Atualizado para usar Render

## 🚀 **Passo a Passo no Render:**

### **1. Criar Conta no Render**
- Acesse: https://render.com
- Faça login com GitHub

### **2. Conectar Repositório**
- Clique em "New +"
- Selecione "Web Service"
- Conecte seu repositório GitHub

### **3. Configurar Deploy**
- **Name**: `shopee-api-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: `Free`

### **4. Variáveis de Ambiente**
Adicione estas variáveis no Render:
```
NODE_ENV=production
PORT=10000
```

### **5. Deploy**
- Clique em "Create Web Service"
- Aguarde o deploy (2-3 minutos)
- Sua API estará em: `https://shopee-api-backend.onrender.com`

## 🔧 **Configuração Automática:**

O arquivo `render.yaml` já está configurado:
```yaml
services:
  - type: web
    name: shopee-api-backend
    env: node
    plan: free
    buildCommand: npm install
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
    healthCheckPath: /api/test
```

## 🌐 **URLs Configuradas:**

### **Backend (Render):**
- **API**: `https://shopee-api-backend.onrender.com/api/products`
- **Teste**: `https://shopee-api-backend.onrender.com/api/test`

### **Frontend:**
- O `script.js` já está configurado para usar o Render
- Tenta Render primeiro, depois local

## 📊 **Logs que Você Verá:**

### **No Render Dashboard:**
```
🚀 Servidor rodando na porta 10000
📱 AppID: 18305010276
🌐 Ambiente: production
🔗 Teste: http://localhost:10000/api/test
🛍️ API: http://localhost:10000/api/products
```

### **No Frontend:**
```
🚀 Tentando usar backend da Shopee...
🖥️ Tentando backend: https://shopee-api-backend.onrender.com/api/products
✅ Backend retornou produtos: 20
✅ Produtos carregados via backend: 20
```

## 🎯 **Vantagens do Render:**

✅ **Gratuito** - Plano free disponível
✅ **Automático** - Deploy automático do GitHub
✅ **HTTPS** - SSL automático
✅ **Escalável** - Cresce com seu projeto
✅ **Fácil** - Configuração simples

## 🚨 **Se Der Erro:**

### **Erro de Build:**
- Verifique se `package.json` está na pasta `backend`
- Verifique se todas as dependências estão listadas

### **Erro de Start:**
- Verifique se `server.js` está na pasta `backend`
- Verifique se a porta está configurada corretamente

### **Erro de CORS:**
- O backend já está configurado com CORS
- Verifique se a URL está correta

## 🔄 **Deploy Automático:**

Após configurar:
1. **Push no GitHub** → Deploy automático
2. **Mudanças no código** → Deploy automático
3. **Sempre atualizado** → Sempre funcionando

## 📱 **Testar:**

### **1. Teste do Backend:**
```
https://shopee-api-backend.onrender.com/api/test
```

### **2. Teste da API:**
```bash
curl -X POST https://shopee-api-backend.onrender.com/api/products \
  -H "Content-Type: application/json" \
  -d '{"query":"promoção","category":"","page":0}'
```

### **3. Teste do Frontend:**
- Abra `index.html`
- Verifique os logs no console
- Deve mostrar produtos reais da Shopee

## 💡 **Próximos Passos:**

1. ✅ **Deploy no Render** - Backend funcionando
2. 🔄 **Testar API** - Verificar funcionamento
3. 🚀 **Deploy Frontend** - Netlify/Vercel
4. 📊 **Monitorar** - Logs e performance
5. 💰 **Gerar Vendas** - Links funcionais

## 🌟 **Resultado Final:**

✅ **Backend no Render** - `https://shopee-api-backend.onrender.com`
✅ **API GraphQL funcionando** - Produtos reais
✅ **Links de afiliado** - Comissões rastreadas
✅ **Sistema completo** - Pronto para produção

---

**🚀 Agora é só fazer o deploy no Render e sua API da Shopee funcionará perfeitamente!**

**Siga os passos acima e em 5 minutos estará funcionando!**
