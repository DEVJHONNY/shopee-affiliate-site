// Configuração do sistema de cache
module.exports = {
    CACHE_TTL: 3600, // 1 hora em segundos
    REDIS_CONFIG: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        password: process.env.REDIS_PASSWORD
    },
    CACHE_KEYS: {
        PRODUCTS: 'products:',
        COUPONS: 'coupons:',
        SEARCH: 'search:'
    },
    // Prefixos para diferentes tipos de cache
    PREFIX: {
        API: 'api:',
        STATIC: 'static:',
        USER: 'user:'
    }
}
