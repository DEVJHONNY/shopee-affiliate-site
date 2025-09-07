// Integração com API Real da Shopee
// Este arquivo contém funções para integração com a API oficial da Shopee

class ShopeeAPI {
    constructor(config) {
        this.appId = config.affiliate.appId;
        this.secret = config.affiliate.secret;
        this.baseUrl = config.api.baseUrl;
        this.affiliateBaseUrl = config.api.affiliateBaseUrl;
        this.timeout = config.api.timeout;
    }

    // Gerar assinatura para autenticação
    generateSignature(params, timestamp) {
        const crypto = require('crypto');
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        const stringToSign = `${this.appId}${timestamp}${sortedParams}`;
        return crypto.createHmac('sha256', this.secret).update(stringToSign).digest('hex');
    }

    // Buscar produtos da Shopee
    async searchProducts(query = '', category = '', page = 0, limit = 20) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const params = {
                keyword: query,
                category_id: category,
                page: page,
                page_size: limit,
                sort_type: 0, // 0 = relevância, 1 = preço baixo, 2 = preço alto
                partner_id: this.appId,
                shopid: 0, // 0 = todos os shops
                timestamp: timestamp
            };

            const signature = this.generateSignature(params, timestamp);
            params.sign = signature;

            const response = await fetch(`${this.baseUrl}/item/search`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.formatProducts(data.items || []);
        } catch (error) {
            console.error('Erro ao buscar produtos da Shopee:', error);
            return [];
        }
    }

    // Buscar detalhes de um produto específico
    async getProductDetails(itemId, shopId) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const params = {
                item_id: itemId,
                shop_id: shopId,
                partner_id: this.appId,
                timestamp: timestamp
            };

            const signature = this.generateSignature(params, timestamp);
            params.sign = signature;

            const response = await fetch(`${this.baseUrl}/item/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.formatProductDetail(data.item);
        } catch (error) {
            console.error('Erro ao buscar detalhes do produto:', error);
            return null;
        }
    }

    // Buscar categorias
    async getCategories() {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const params = {
                partner_id: this.appId,
                timestamp: timestamp
            };

            const signature = this.generateSignature(params, timestamp);
            params.sign = signature;

            const response = await fetch(`${this.baseUrl}/item/categories/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data.categories || [];
        } catch (error) {
            console.error('Erro ao buscar categorias:', error);
            return [];
        }
    }

    // Buscar produtos em promoção
    async getPromotionProducts(limit = 20) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const params = {
                page_size: limit,
                partner_id: this.appId,
                timestamp: timestamp
            };

            const signature = this.generateSignature(params, timestamp);
            params.sign = signature;

            const response = await fetch(`${this.baseUrl}/item/promotion/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return this.formatProducts(data.items || []);
        } catch (error) {
            console.error('Erro ao buscar produtos em promoção:', error);
            return [];
        }
    }

    // Formatar produtos da API para o formato do site
    formatProducts(items) {
        return items.map(item => ({
            id: item.item_id,
            name: item.item_name,
            price: item.price / 100000, // Preço em centavos
            originalPrice: item.price_before_discount / 100000,
            discount: item.discount ? Math.round(item.discount) : 0,
            image: item.image,
            images: item.images || [item.image],
            category: this.mapCategory(item.category_id),
            rating: item.item_rating?.rating_star || 0,
            reviews: item.item_rating?.rating_count || 0,
            description: item.description || '',
            shopId: item.shop_id,
            shopName: item.shop_name,
            stock: item.stock,
            sold: item.sold,
            brand: item.brand,
            weight: item.weight,
            dimensions: item.dimension,
            warranty: item.warranty,
            shipping: item.shipping_info,
            variants: item.tier_variations || []
        }));
    }

    // Formatar detalhes de um produto
    formatProductDetail(item) {
        return {
            id: item.item_id,
            name: item.item_name,
            price: item.price / 100000,
            originalPrice: item.price_before_discount / 100000,
            discount: item.discount ? Math.round(item.discount) : 0,
            image: item.image,
            images: item.images || [item.image],
            category: this.mapCategory(item.category_id),
            rating: item.item_rating?.rating_star || 0,
            reviews: item.item_rating?.rating_count || 0,
            description: item.description || '',
            shopId: item.shop_id,
            shopName: item.shop_name,
            stock: item.stock,
            sold: item.sold,
            brand: item.brand,
            weight: item.weight,
            dimensions: item.dimension,
            warranty: item.warranty,
            shipping: item.shipping_info,
            variants: item.tier_variations || [],
            attributes: item.attributes || [],
            specifications: item.specifications || [],
            reviews: item.reviews || []
        };
    }

    // Mapear ID da categoria para nome
    mapCategory(categoryId) {
        const categoryMap = {
            100001: 'electronics',
            100002: 'fashion',
            100003: 'home',
            100004: 'beauty',
            100005: 'sports',
            100006: 'books',
            100007: 'toys',
            100008: 'automotive'
        };
        return categoryMap[categoryId] || 'other';
    }

    // Gerar link de afiliado
    generateAffiliateLink(itemId, shopId) {
        return `https://shopee.com.br/product/${shopId}/${itemId}?affiliate_id=${this.appId}`;
    }

    // Buscar relatório de afiliado
    async getAffiliateReport(startDate, endDate) {
        try {
            const timestamp = Math.floor(Date.now() / 1000);
            const params = {
                start_date: startDate,
                end_date: endDate,
                partner_id: this.appId,
                timestamp: timestamp
            };

            const signature = this.generateSignature(params, timestamp);
            params.sign = signature;

            const response = await fetch(`${this.affiliateBaseUrl}/report/get`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(params)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Erro ao buscar relatório de afiliado:', error);
            return null;
        }
    }
}

// Função para inicializar a API
function initializeShopeeAPI() {
    if (typeof SITE_CONFIG !== 'undefined') {
        return new ShopeeAPI(SITE_CONFIG);
    }
    return null;
}

// Exportar para uso global
if (typeof window !== 'undefined') {
    window.ShopeeAPI = ShopeeAPI;
    window.initializeShopeeAPI = initializeShopeeAPI;
}

// Exportar para Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ShopeeAPI, initializeShopeeAPI };
}
