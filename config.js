// Configurações da API Shopee - PRODUÇÃO
const SECURITY_CONFIG = {
    MAX_REQUESTS_PER_MINUTE: 60,
    SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutos
    CORS_ORIGINS: ['https://shopee.com.br', 'https://shopee-backend.onrender.com'],
    CSP_DIRECTIVES: "default-src 'self'; script-src 'self' 'unsafe-inline'; img-src 'self' https://*.shopee.com.br https://via.placeholder.com data:; connect-src 'self' https://*.shopee.com.br; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com;",
    SECURITY_HEADERS: {
        'X-XSS-Protection': '1; mode=block',
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
    },
    RATE_LIMIT: {
        WINDOW_MS: 15 * 60 * 1000, // 15 minutos
        MAX_REQUESTS: 100,
        MESSAGE: 'Muitas requisições, tente novamente em alguns minutos'
    },
    INPUT_VALIDATION: {
        MAX_QUERY_LENGTH: 100,
        ALLOWED_SORTS: ['relevance', 'price_asc', 'price_desc', 'sales'],
        ALLOWED_CATEGORIES: ['eletronicos', 'moda', 'casa', 'beleza']
    }
};

const SHOPEE_CONFIG = {
    APP_ID: '18305010276', // Valor público de produção
    SECRET: '************', // Valor protegido - Nunca expor
    API_URL: 'https://open-api.affiliate.shopee.com.br/graphql',
    API_VERSION: 'v2',
    TIMEOUT: 10000, // 10 segundos
    RETRY_ATTEMPTS: 3,
    ENCRYPTION: {
        enabled: true,
        algorithm: 'aes-256-gcm'
    },
    BACKEND_URL: 'https://shopee-backend.onrender.com',
    USE_REAL_API: true,
    DEBUG_MODE: false
};

const SITE_CONFIG = {
    SITE_NAME: 'Shopee Treasures',
    SITE_DESCRIPTION: 'Descubra tesouros com até 80% OFF na Shopee',
    DEFAULT_SEARCH_TERM: 'promoção',
    ITEMS_PER_PAGE: 20,
    AFFILIATE_TAG: '?affiliate_id=18305010276'
};

const FALLBACK_PRODUCTS = [
    {
        itemId: 1,
        productName: "Smartphone Exemplo",
        imageUrl: "https://via.placeholder.com/300x300?text=Smartphone",
        priceMin: 599.99,
        priceMax: 999.99,
        ratingStar: 4.5,
        sales: 1500,
        shopName: "Loja Exemplo",
        offerLink: "https://shopee.com.br"
    },
    {
        itemId: 2,
        productName: "Fone de Ouvido Bluetooth",
        imageUrl: "https://via.placeholder.com/300x300?text=Fone+Bluetooth",
        priceMin: 89.99,
        priceMax: 149.99,
        ratingStar: 4.8,
        sales: 2300,
        shopName: "Loja Exemplo",
        offerLink: "https://shopee.com.br"
    }
];

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

// Configuração concluída