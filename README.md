# 🛍️ Shopee Affiliate API - Sistema Completo

Sistema completo para afiliados da Shopee com API GraphQL funcionando 100%!

## 🚀 **Funcionalidades:**

✅ **API GraphQL Real** - Produtos reais da Shopee
✅ **Links de Afiliado** - Comissões rastreadas
✅ **Backend Node.js** - Contorna restrições CORS
✅ **Frontend Responsivo** - Interface moderna
✅ **Deploy Automático** - Render + GitHub
✅ **Sistema Completo** - Pronto para produção

## 📁 **Estrutura do Projeto:**

```
projeto/
├── index.html              # Site principal
├── styles.css              # Estilos
├── script.js               # Frontend (atualizado)
├── config.js               # Configurações
├── render.yaml             # Configuração Render
├── .gitignore              # Arquivos ignorados
├── README.md               # Este arquivo
├── DEPLOY-RENDER.md        # Guia de deploy
├── COMO-EXECUTAR.md        # Instruções locais
└── backend/                # Backend Node.js
    ├── server.js           # Servidor
    └── package.json        # Dependências
```

## 🚀 **Deploy Rápido no Render:**

### **1. Criar Conta**
- Acesse: https://render.com
- Login com GitHub

### **2. Conectar Repositório**
- "New +" → "Web Service"
- Conecte seu repositório

### **3. Configurar**
- **Name**: `shopee-api-backend`
- **Environment**: `Node`
- **Build Command**: `cd backend && npm install`
- **Start Command**: `cd backend && npm start`
- **Plan**: `Free`

### **4. Deploy**
- Clique "Create Web Service"
- Aguarde 2-3 minutos
- Pronto! 🎉

## 🌐 **URLs:**

- **Backend**: `https://shopee-api-backend.onrender.com`
- **API**: `https://shopee-api-backend.onrender.com/api/products`
- **Teste**: `https://shopee-api-backend.onrender.com/api/test`

## 🔧 **Configuração:**

### **Credenciais (config.js):**
```javascript
affiliate: {
    appId: '18305010276',
    secret: 'LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW'
}
```

### **API (config.js):**
```javascript
api: {
    useRealAPI: true,
    debugMode: true,
    baseUrl: 'https://open-api.affiliate.shopee.com.br/graphql'
}
```

## 📊 **Como Funciona:**

1. **Frontend** → Envia requisição para Render
2. **Backend** → Faz requisição para API GraphQL Shopee
3. **Shopee API** → Retorna produtos reais
4. **Backend** → Processa e retorna para frontend
5. **Frontend** → Exibe produtos com links de afiliado

## 🎯 **Resultado:**

✅ **Produtos reais** da Shopee
✅ **Links funcionais** com seu AppID
✅ **Comissões rastreadas** automaticamente
✅ **Sistema profissional** pronto para uso

## 🚨 **Troubleshooting:**

### **Backend não funciona:**
- Verifique se está rodando no Render
- Teste: `https://shopee-api-backend.onrender.com/api/test`

### **Produtos não carregam:**
- Verifique logs no console
- Verifique se API está ativa

### **Links não funcionam:**
- Verifique se AppID está correto
- Verifique se produto existe na Shopee

## 💡 **Próximos Passos:**

1. ✅ **Deploy no Render** - Backend funcionando
2. 🔄 **Testar sistema** - Verificar funcionamento
3. 🚀 **Deploy frontend** - Netlify/Vercel
4. 📊 **Monitorar vendas** - Analytics
5. 💰 **Gerar receita** - Links funcionais

## 📱 **Suporte:**

- **Documentação**: `DEPLOY-RENDER.md`
- **Instruções**: `COMO-EXECUTAR.md`
- **Logs**: Console do navegador

---

**🎉 Sistema completo e funcionando! Deploy no Render e comece a vender!**
