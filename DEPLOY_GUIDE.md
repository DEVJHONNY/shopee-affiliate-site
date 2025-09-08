# Guia de Deploy - Frontend (Netlify) e Backend (Render)

## Parte 1: Deploy do Backend no Render

1. Acesse [Render Dashboard](https://dashboard.render.com)
2. Clique em "New +" e selecione "Web Service"
3. Conecte com GitHub e selecione o repositório
4. Configure o serviço:
   - Name: `shopee-backend`
   - Region: escolha a mais próxima (ex: São Paulo)
   - Branch: `main`
   - Runtime: `Node`
   - Build Command: `cd backend && npm install`
   - Start Command: `cd backend && npm start`
   - Instance Type: `Free`

5. Em "Environment Variables", adicione:
   ```
   NODE_ENV=production
   PORT=10000
   SHOPEE_APP_ID=18305010276
   SHOPEE_SECRET=LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW
   GEMINI_API_KEY=AIzaSyCXquSEk9JzR3mtLllGp1Zn7fVshyKByWA
   ```

6. Clique em "Create Web Service"
7. Aguarde o deploy (pode levar alguns minutos)
8. Copie a URL gerada (será algo como `https://shopee-backend.onrender.com`)

## Parte 2: Deploy do Frontend no Netlify

## 1. Conectar ao GitHub
1. Acesse [Netlify](https://app.netlify.com)
2. Clique em "Add new site" > "Import an existing project"
3. Escolha "Deploy with GitHub"
4. Selecione o repositório `shopee-affiliate-site`

## 2. Configurar Domínio
1. Vá em Site settings > Domain management
2. Clique em "Edit site name"
3. Digite: `shopee-treasures`
4. Clique em Save

## 3. Configurar Build
1. Vá em Site settings > Build & deploy
2. Configure:
   - Build command: (deixe em branco)
   - Publish directory: .
   - Production branch: main

## 4. Configurar Variáveis de Ambiente
1. Vá em Site settings > Environment
2. Clique em "Add a variable"
3. Adicione cada variável:

```bash
GEMINI_API_KEY=AIzaSyCXquSEk9JzR3mtLllGp1Zn7fVshyKByWA
SHOPEE_APP_ID=18305010276
SHOPEE_SECRET=LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW
NODE_ENV=production
```

## 5. Verificar Deploy
1. Volte para a página principal do site
2. Aguarde o deploy completar (icone verde = sucesso)
3. Clique no link do site para testar

## Problemas Comuns:
- Se o build falhar, verifique os logs de erro no Netlify
- Certifique-se que todas as variáveis de ambiente foram adicionadas
- Verifique se o arquivo netlify.toml está na raiz do projeto

## Links Úteis:
- [Documentação Netlify](https://docs.netlify.com)
- [Status do Site](https://shopee-treasures.netlify.app)
