const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');
require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
app.use(cors());
app.use(express.json());

// Configurações
const SHOPEE_API = 'https://open-api.affiliate.shopee.com.br/graphql';
const APP_ID = '18305010276';
const SECRET = 'LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.get('/', (req, res) => {
    res.json({
        message: '🚀 API PromoShopee funcionando!',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        endpoints: {
            products: 'POST /api/products',
            chat: 'POST /api/chat',
            health: 'GET /health',
            test: 'GET /api/test'
        }
    });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message, history } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'A mensagem é obrigatória.' });
        }

        const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Você é um assistente de vendas amigável e prestativo chamado 'Shopee Treasures Assistant'. Seu objetivo é ajudar os usuários a encontrar promoções em um site de afiliados da Shopee. Seja conciso, amigável e foque em ajudar o cliente a navegar no site e encontrar o que precisa. Não invente produtos ou promoções que não existem." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Olá! Eu sou o assistente do Shopee Treasures. Como posso te ajudar a encontrar as melhores promoções hoje?" }],
                },
                ...(history || []),
            ],
        });

        const result = await chat.sendMessage(message);
        const response = await result.response;
        const text = response.text();

        res.json({ reply: text });

    } catch (error) {
        console.error('❌ Erro na API do Gemini:', error);
        res.status(500).json({ error: 'Não foi possível se comunicar com o assistente.' });
    }
});

app.get('/health', (req, res) => {
    res.status(200).json({
        status: '✅ OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

app.post('/api/products', async (req, res) => {
    try {
        const { query, category, page = 1, sort = 'relevance' } = req.body;
        const timestamp = Math.floor(Date.now() / 1000);

        const graphqlQuery = {
            query: `{
                productOfferV2(
                    keyword: "${query || 'promoção'}",
                    ${category ? `category: "${category}",` : ''}
                    sortType: ${getSortType(sort)},
                    page: ${page},
                    limit: 20,
                    isAMSOffer: true
                ) {
                    nodes {
                        itemId
                        productName
                        priceMin
                        priceMax
                        imageUrl
                        productLink
                        offerLink
                        shopName
                        sales
                        ratingStar
                    }
                }
            }`
        };

        const payload = JSON.stringify(graphqlQuery);
        const signatureString = APP_ID + timestamp + payload + SECRET;
        const signature = crypto.createHash('sha256').update(signatureString).digest('hex');

        const response = await fetch(SHOPEE_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${APP_ID}, Timestamp=${timestamp}, Signature=${signature}`
            },
            body: payload
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Erro da API Shopee:', errorText);
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (data.errors) {
            console.error('❌ Erros da API Shopee:', data.errors);
            return res.status(400).json({ success: false, errors: data.errors });
        }

        res.json({ success: true, data: data.data });

    } catch (error) {
        console.error('❌ Erro na rota /api/products:', error.message);
        res.status(500).json({ success: false, message: 'Erro ao conectar com a API da Shopee' });
    }
});

function getSortType(sort) {
    const sortTypes = {
        'relevance': 1, 'price_asc': 4, 'price_desc': 3, 'discount': 5, 'sales': 2
    };
    return sortTypes[sort] || 1;
}

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor iniciado na porta ${PORT}`);
});

module.exports = app;