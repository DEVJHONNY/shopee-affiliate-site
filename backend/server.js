const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Suas credenciais da Shopee
const APP_ID = '18305010276';
const SECRET = 'LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW';

// Gerar assinatura SHA256
function generateSignature(payload, timestamp) {
    const stringToSign = APP_ID + timestamp + payload + SECRET;
    return crypto.createHash('sha256').update(stringToSign).digest('hex');
}

// Endpoint para buscar produtos
app.post('/api/products', async (req, res) => {
    try {
        console.log('🚀 Recebendo requisição para buscar produtos...');
        
        const { query = 'promoção', category = '', page = 0 } = req.body;
        const timestamp = Math.floor(Date.now() / 1000);
        
        console.log('📝 Parâmetros:', { query, category, page });
        
        // Query GraphQL
        const graphqlQuery = `
            query {
                productOfferV2(
                    keyword: "${query}"
                    sortType: 1
                    page: ${page + 1}
                    limit: 20
                    isAMSOffer: true
                ) {
                    nodes {
                        itemId
                        productName
                        priceMin
                        priceMax
                        commissionRate
                        sellerCommissionRate
                        shopeeCommissionRate
                        commission
                        sales
                        ratingStar
                        priceDiscountRate
                        imageUrl
                        productLink
                        offerLink
                        shopId
                        shopName
                        shopType
                        productCatIds
                        periodStartTime
                        periodEndTime
                    }
                    pageInfo {
                        page
                        limit
                        hasNextPage
                    }
                }
            }
        `;
        
        const payload = JSON.stringify({ query: graphqlQuery });
        const signature = generateSignature(payload, timestamp);
        
        console.log('🔐 Assinatura gerada:', signature);
        
        // Fazer requisição para API da Shopee
        const response = await fetch('https://open-api.affiliate.shopee.com.br/graphql', {
            method: 'POST',
            headers: {
                'Authorization': `SHA256 Credential=${APP_ID}, Timestamp=${timestamp}, Signature=${signature}`,
                'Content-Type': 'application/json'
            },
            body: payload
        });
        
        console.log('📡 Status da resposta:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Dados recebidos da API:', data);
        
        // Retornar dados para o frontend
        res.json({
            success: true,
            data: data,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        res.status(500).json({
            success: false,
            error: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Endpoint de teste
app.get('/api/test', (req, res) => {
    res.json({
        message: '🚀 Backend da Shopee API funcionando!',
        timestamp: new Date().toISOString(),
        appId: APP_ID
    });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log('🚀 Servidor rodando na porta', PORT);
    console.log('📱 AppID:', APP_ID);
    console.log('🌐 Ambiente:', process.env.NODE_ENV || 'development');
    console.log('🔗 Teste: http://localhost:' + PORT + '/api/test');
    console.log('🛍️ API: http://localhost:' + PORT + '/api/products');
});

module.exports = app;
