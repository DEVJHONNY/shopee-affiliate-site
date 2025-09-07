// Configurações da API Shopee - PRODUÇÃO
const SHOPEE_CONFIG = {
    APP_ID: '18305010276',
    SECRET: 'LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW',
    API_URL: 'https://open-api.affiliate.shopee.com.br/graphql',
    BACKEND_URL: 'https://shopee-backend-jrbl.onrender.com',
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

const FALLBACK_PRODUCTS = []; // Deixado em branco para simplicidade, adicione produtos se necessário.

const CHAT_CONFIG = {
    BOT_NAME: 'Assistente Shopee',
    WELCOME_MESSAGE: "Olá! Sou seu assistente de promoções. Digite 'promoções', 'cupons' ou 'moda' para começar!",
    RESPONSES: {
        'promoções': 'Buscando as melhores promoções de "promoção" para você agora! 🎯',
        'eletrônicos': 'Pesquisando os eletrônicos em promoção! Segundos... 📱',
        'moda': 'Focando nas ofertas de moda para você! 👗',
        'desconto': 'Mostrando os produtos com os maiores descontos! Prepare-se para economizar. 🔥',
        'menor_preco': 'Claro! Ordenei os produtos pelo menor preço para você. Confira os resultados! 💸',
        'cupons': 'Para economizar ainda mais, aqui estão os links para as páginas de cupons: <a href="https://shopee.com.br/m/cupons-diarios" target="_blank" rel="noopener noreferrer">Cupons Diários</a> | <a href="https://shopee.com.br/m/frete-gratis" target="_blank" rel="noopener noreferrer">Frete Grátis</a>',
        'frete': 'A Shopee oferece cupons de frete grátis! Você pode encontrá-los na nossa seção de cupons. Quer que eu te mostre?',
        'default': 'Não entendi. Você pode tentar perguntar sobre "promoções", "cupons" ou uma categoria como "eletrônicos".'
    }
};

console.log('🛍️ PromoShopee Configurado!');