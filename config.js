// Configurações da API Shopee - PRODUÇÃO
const SHOPEE_CONFIG = {
    APP_ID: '18305010276',
    SECRET: 'LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW',
    API_URL: 'https://open-api.affiliate.shopee.com.br/graphql',
    BACKEND_URL: 'https://shopee-backend-jrbl.onrender.com', // SERÁ ATUALIZADO
    USE_REAL_API: true,
    DEBUG_MODE: false
};

const SITE_CONFIG = {
    SITE_NAME: 'PromoShopee',
    SITE_DESCRIPTION: 'As melhores promoções da Shopee',
    DEFAULT_SEARCH_TERM: 'promoção',
    ITEMS_PER_PAGE: 20,
    AFFILIATE_TAG: '?affiliate_id=18305010276'
};

const FALLBACK_PRODUCTS = [/* ... mesmo conteúdo ... */];

const CHAT_CONFIG = {
    BOT_NAME: 'Assistente Shopee',
    WELCOME_MESSAGE: 'Olá! Sou seu assistente de promoções. Digite "promoções" para ver as ofertas!',
    RESPONSES: {
        'promoções': 'Aqui estão nossas promoções em destaque! 🎯',
        'eletrônicos': 'Confira eletrônicos com até 50% OFF! 📱',
        'moda': 'Moda com até 70% OFF! 👗',
        'desconto': 'Produtos com até 80% OFF! 🔥',
        'frete': 'Frete grátis em compras acima de R$ 99! 🚚',
        'default': 'Digite "promoções" para ver ofertas!'
    }
};

console.log('🛍️ PromoShopee Configurado!');