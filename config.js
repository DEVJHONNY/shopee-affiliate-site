// Configurações do Site de Promoções Shopee
const SITE_CONFIG = {
    // Informações do Afiliado
    affiliate: {
        appId: '18305010276',
        secret: 'LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW',
        name: 'Promoções Shopee',
        email: 'lucas.rocha.11@hotmail.com',
        whatsapp: '71996457135'
    },

    // Configurações da API
    api: {
        baseUrl: 'https://open-api.affiliate.shopee.com.br/graphql', // API GraphQL correta
        timeout: 10000, // 10 segundos
        retryAttempts: 3,
        useRealAPI: true, // API real ativada - usando credenciais válidas
        debugMode: true, // Mostra logs de debug no console
        rateLimit: 2000, // 2000 requests por hora
        explorerUrl: 'https://open-api.affiliate.shopee.com.br/explorer'
    },

    // Configurações do Site
    site: {
        title: 'Promoções Shopee - Ofertas Imperdíveis',
        description: 'Descubra as melhores promoções da Shopee e economize muito nas suas compras!',
        keywords: 'shopee, promoções, ofertas, desconto, afiliado, compras online',
        itemsPerPage: 8,
        maxProducts: 100
    },

    // Configurações do Chat
    chat: {
        welcomeMessage: 'Olá! Sou seu assistente de promoções da Shopee. Como posso ajudá-lo hoje?',
        responses: {
            promocoes: '🔥 Confira nossas promoções do dia! Temos descontos de até 50% em eletrônicos, moda e muito mais. Use os filtros para encontrar o que procura!',
            eletronicos: '📱 Nossa seção de eletrônicos está em promoção! Smartphones, notebooks, fones de ouvido e muito mais com preços imperdíveis!',
            moda: '👕 Aproveite as ofertas de moda! Tênis, roupas e acessórios com descontos especiais. Confira nossa seleção!',
            preco: '💰 Temos produtos com descontos de até 50%! Use o filtro de preço para encontrar ofertas no seu orçamento.',
            ajuda: '💡 Posso ajudá-lo a encontrar produtos, explicar sobre promoções ou tirar dúvidas sobre o site. O que você gostaria de saber?',
            obrigado: '😊 De nada! Estou aqui para ajudar. Aproveite as promoções e faça ótimas compras!'
        },
        defaultResponses: [
            'Interessante! Que tipo de produto você está procurando?',
            'Posso ajudá-lo a encontrar o que precisa. Use os filtros ou me diga o que procura!',
            'Temos muitas ofertas especiais! Que categoria te interessa mais?',
            'Confira nossa seleção de produtos em promoção. Tem algo específico em mente?'
        ]
    },

    // Configurações de Notificações
    notifications: {
        enabled: true,
        showPromotionAlerts: true,
        alertInterval: 30000, // 30 segundos
        promotionMessages: [
            '🔥 Nova Promoção! Smartphone Samsung Galaxy A54 com 19% de desconto!',
            '💥 Oferta Relâmpago! Fone JBL Tune 510BT com 33% OFF!',
            '⚡ Promoção Especial! Tênis Nike Air Max 270 com 20% de desconto!',
            '🎉 Mega Oferta! Cafeteira Nespresso Essenza Mini com 25% OFF!'
        ]
    },

    // Configurações de Filtros
    filters: {
        categories: [
            { value: '', label: 'Todas as categorias' },
            { value: 'electronics', label: 'Eletrônicos' },
            { value: 'fashion', label: 'Moda' },
            { value: 'home', label: 'Casa e Jardim' },
            { value: 'beauty', label: 'Beleza' },
            { value: 'sports', label: 'Esportes' }
        ],
        priceRanges: [
            { value: '', label: 'Qualquer preço' },
            { value: '0-50', label: 'Até R$ 50' },
            { value: '50-100', label: 'R$ 50 - R$ 100' },
            { value: '100-200', label: 'R$ 100 - R$ 200' },
            { value: '200+', label: 'Acima de R$ 200' }
        ],
        sortOptions: [
            { value: 'relevance', label: 'Relevância' },
            { value: 'price_low', label: 'Menor preço' },
            { value: 'price_high', label: 'Maior preço' },
            { value: 'rating', label: 'Melhor avaliação' }
        ]
    },

    // Configurações de Produtos Mock (para demonstração)
    mockProducts: {
        enabled: true,
        categories: {
            electronics: ['Smartphone', 'Notebook', 'Fone de Ouvido', 'Smartwatch', 'Tablet'],
            fashion: ['Tênis', 'Camiseta', 'Calça', 'Bolsa', 'Relógio'],
            home: ['Cafeteira', 'Aspirador', 'Liquidificador', 'Micro-ondas', 'Geladeira'],
            beauty: ['Maquiagem', 'Perfume', 'Creme', 'Shampoo', 'Batom'],
            sports: ['Bicicleta', 'Esteira', 'Halter', 'Bola', 'Tênis Esportivo']
        },
        brands: ['Samsung', 'Apple', 'Nike', 'Adidas', 'JBL', 'Nespresso', 'Acer', 'LG'],
        priceRange: { min: 29.99, max: 2999.99 },
        ratingRange: { min: 3.5, max: 5.0 },
        reviewsRange: { min: 50, max: 5000 }
    },

    // Configurações de SEO
    seo: {
        ogImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200',
        twitterCard: 'summary_large_image',
        canonicalUrl: window.location.origin
    },

    // Configurações de Analytics (opcional)
    analytics: {
        googleAnalytics: '', // Seu ID do Google Analytics
        facebookPixel: '', // Seu ID do Facebook Pixel
        hotjar: '' // Seu ID do Hotjar
    },

    // Configurações de Performance
    performance: {
        lazyLoading: true,
        imageOptimization: true,
        cacheTimeout: 300000, // 5 minutos
        preloadImages: 3
    }
};

// Função para obter configuração
function getConfig(path) {
    return path.split('.').reduce((obj, key) => obj && obj[key], SITE_CONFIG);
}

// Função para atualizar configuração
function updateConfig(path, value) {
    const keys = path.split('.');
    const lastKey = keys.pop();
    const target = keys.reduce((obj, key) => obj[key] = obj[key] || {}, SITE_CONFIG);
    target[lastKey] = value;
}

// Exportar configurações (se usando módulos)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { SITE_CONFIG, getConfig, updateConfig };
}
