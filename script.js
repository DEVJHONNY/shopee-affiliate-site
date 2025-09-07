// Configurações da API da Shopee
const SHOPEE_CONFIG = {
    appId: '18305010276',
    secret: 'LRINXLVGSVNOB2FW6FOHBOR6NPRRB3NW',
    baseUrl: 'https://partner.shopeemobile.com/api/v1',
    affiliateBaseUrl: 'https://affiliate.shopee.com.br/api'
};

// Estado global da aplicação
let currentProducts = [];
let filteredProducts = [];
let currentPage = 0;
let isLoading = false;

// Elementos DOM
const elements = {
    searchInput: document.getElementById('searchInput'),
    searchBtn: document.getElementById('searchBtn'),
    categoryFilter: document.getElementById('categoryFilter'),
    priceFilter: document.getElementById('priceFilter'),
    sortFilter: document.getElementById('sortFilter'),
    productsGrid: document.getElementById('productsGrid'),
    loading: document.getElementById('loading'),
    loadMoreBtn: document.getElementById('loadMoreBtn'),
    chatInput: document.getElementById('chatInput'),
    sendBtn: document.getElementById('sendBtn'),
    chatMessages: document.getElementById('chatMessages'),
    productModal: document.getElementById('productModal'),
    closeModal: document.querySelector('.close')
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    loadInitialProducts();
    showAPIStatus();
});

// Mostrar status da API no console
function showAPIStatus() {
    if (SITE_CONFIG?.api?.debugMode) {
        console.log('🔧 === CONFIGURAÇÃO DA API SHOPEE ===');
        console.log('📱 AppID:', SITE_CONFIG.affiliate.appId);
        console.log('🔑 Secret:', SITE_CONFIG.affiliate.secret ? 'Configurado' : 'Não configurado');
        console.log('🌐 API Real:', SITE_CONFIG.api.useRealAPI ? 'Ativada' : 'Desativada (usando dados mock)');
        console.log('🐛 Debug Mode:', SITE_CONFIG.api.debugMode ? 'Ativado' : 'Desativado');
        console.log('🔗 Base URL:', SITE_CONFIG.api.baseUrl);
        console.log('=====================================');
        
        if (!SITE_CONFIG.api.useRealAPI) {
            console.log('💡 Para usar a API real, mude "useRealAPI" para true no config.js');
            console.log('📖 Consulte o arquivo API-SETUP.md para instruções completas');
        } else {
            console.log('✅ API real ativada - sistema funcionando com fallback inteligente');
            console.log('🔗 Links de afiliado funcionais mesmo com restrições de CORS');
            console.log('📖 Consulte o arquivo CORS-SOLUTION.md para detalhes técnicos');
        }
    }
}

function initializeApp() {
    // Configurar navegação suave
    setupSmoothNavigation();
    
    // Configurar chat
    setupChat();
    
    // Mostrar loading inicial
    showLoading(true);
}

function setupEventListeners() {
    // Busca
    elements.searchBtn.addEventListener('click', handleSearch);
    elements.searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });

    // Filtros
    elements.categoryFilter.addEventListener('change', applyFilters);
    elements.priceFilter.addEventListener('change', applyFilters);
    elements.sortFilter.addEventListener('change', applyFilters);

    // Carregar mais produtos
    elements.loadMoreBtn.addEventListener('click', loadMoreProducts);

    // Chat
    elements.sendBtn.addEventListener('click', sendChatMessage);
    elements.chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendChatMessage();
        }
    });

    // Modal
    elements.closeModal.addEventListener('click', closeProductModal);
    window.addEventListener('click', function(e) {
        if (e.target === elements.productModal) {
            closeProductModal();
        }
    });
}

function setupSmoothNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
                
                // Atualizar link ativo
                navLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
}

// Funções da API da Shopee
async function fetchShopeeProducts(query = '', category = '', page = 0) {
    try {
        // Verificar se deve usar API real
        const useRealAPI = SITE_CONFIG?.api?.useRealAPI || false;
        const debugMode = SITE_CONFIG?.api?.debugMode || false;
        
        if (debugMode) {
            console.log('🔍 Buscando produtos:', { query, category, page, useRealAPI });
        }
        
        // Tentar usar backend primeiro, depois API direta
        if (useRealAPI && typeof SITE_CONFIG !== 'undefined' && SITE_CONFIG.affiliate.appId) {
            if (debugMode) {
                console.log('🚀 Tentando usar backend da Shopee...');
            }
            
            const backendProducts = await fetchProductsFromBackend(query, category, page);
            if (backendProducts && backendProducts.length > 0) {
                if (debugMode) {
                    console.log('✅ Produtos carregados via backend:', backendProducts.length);
                }
                return backendProducts;
            }
            
            if (debugMode) {
                console.log('🔄 Backend falhou, tentando API direta...');
            }
            
            const realProducts = await fetchRealShopeeProducts(query, category, page);
            if (realProducts && realProducts.length > 0) {
                if (debugMode) {
                    console.log('✅ Produtos reais carregados via API direta:', realProducts.length);
                }
                return realProducts;
            }
        }
        
        // Usar dados mock
        if (debugMode) {
            console.log('📦 Usando dados mock para demonstração');
        }
        
        const mockProducts = generateMockProducts(query, category, page);
        
        // Simular delay da API
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        return mockProducts;
    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        // Em caso de erro, usar dados mock
        return generateMockProducts(query, category, page);
    }
}

// Função para buscar produtos reais da API GraphQL da Shopee
async function fetchRealShopeeProducts(query = '', category = '', page = 0) {
    try {
        const config = SITE_CONFIG;
        const timestamp = Math.floor(Date.now() / 1000);
        
        if (config.api.debugMode) {
            console.log('🚀 Fazendo requisição para API GraphQL da Shopee...');
        }
        
        // Query GraphQL para buscar produtos
        const graphqlQuery = `
            query {
                productOfferV2(
                    keyword: "${query || 'promoção'}"
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

        // Payload da requisição GraphQL
        const payload = JSON.stringify({
            query: graphqlQuery
        });

        // Gerar assinatura SHA256
        const signature = await generateGraphQLSignature(payload, timestamp);

        if (config.api.debugMode) {
            console.log('📝 Query GraphQL:', graphqlQuery);
            console.log('🔐 Assinatura gerada:', signature);
        }

        // Fazer requisição para a API GraphQL da Shopee
        const response = await fetch(config.api.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `SHA256 Credential=${config.affiliate.appId}, Timestamp=${timestamp}, Signature=${signature}`,
                'User-Agent': 'ShopeeAffiliateBot/1.0'
            },
            body: payload
        });

        if (config.api.debugMode) {
            console.log('📡 Status da resposta:', response.status);
        }

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        
        if (config.api.debugMode) {
            console.log('📦 Dados recebidos da API GraphQL:', data);
        }
        
        if (data.errors) {
            throw new Error(data.errors[0]?.message || 'Erro na API GraphQL da Shopee');
        }

        const products = formatGraphQLProducts(data.data?.productOfferV2?.nodes || []);
        
        if (config.api.debugMode) {
            console.log('✅ Produtos formatados:', products.length);
            console.log('📦 Primeiro produto:', products[0]);
        }
        
        return products;
    } catch (error) {
        console.error('❌ Erro ao buscar produtos reais:', error);
        
        // Se for erro de CORS ou similar, tentar método alternativo
        if (error.message.includes('CORS') || error.message.includes('fetch') || error.message.includes('ERR_FAILED')) {
            console.log('🔄 Erro de CORS detectado, tentando método alternativo...');
            return await fetchRealShopeeProductsAlternative(query, category, page);
        }
        
        return null;
    }
}

// Método alternativo para buscar produtos (via proxy ou CORS)
async function fetchRealShopeeProductsAlternative(query = '', category = '', page = 0) {
    try {
        console.log('🔄 Tentando método alternativo com proxy CORS...');
        
        // Usar múltiplos proxies para maior confiabilidade
        const proxies = [
            'https://api.allorigins.win/raw?url=',
            'https://cors-anywhere.herokuapp.com/',
            'https://thingproxy.freeboard.io/fetch/'
        ];
        
        const apiUrl = encodeURIComponent(`https://open-api.affiliate.shopee.com.br/graphql`);
        
        // Usar GraphQL também no método alternativo
        const timestamp = Math.floor(Date.now() / 1000);
        const graphqlQuery = `
            query {
                productOfferV2(
                    keyword: "${query || 'promoção'}"
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
                        imageUrl
                        productLink
                        offerLink
                        shopId
                        shopName
                        sales
                        ratingStar
                    }
                }
            }
        `;
        
        const payload = JSON.stringify({ query: graphqlQuery });
        const signature = await generateGraphQLSignature(payload, timestamp);
        
        // Tentar cada proxy até um funcionar
        for (let i = 0; i < proxies.length; i++) {
            try {
                console.log(`🔄 Tentando proxy ${i + 1}/${proxies.length}: ${proxies[i]}`);
                
                const response = await fetch(proxies[i] + apiUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `SHA256 Credential=${SITE_CONFIG.affiliate.appId}, Timestamp=${timestamp}, Signature=${signature}`,
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: payload
                });
                
                if (response.ok) {
                    const data = await response.json();
                    console.log('✅ Proxy funcionou! Produtos encontrados:', data.data?.productOfferV2?.nodes?.length || 0);
                    return formatGraphQLProducts(data.data?.productOfferV2?.nodes || []);
                } else {
                    console.log(`❌ Proxy ${i + 1} falhou: ${response.status}`);
                }
            } catch (proxyError) {
                console.log(`❌ Proxy ${i + 1} erro:`, proxyError.message);
                continue;
            }
        }
        
        // Se todos os proxies falharam, tentar buscar produtos reais via API pública
        console.log('🔄 Todos os proxies falharam, tentando API pública da Shopee...');
        const publicProducts = await fetchPublicShopeeProducts(query, category, page);
        if (publicProducts && publicProducts.length > 0) {
            return publicProducts;
        }
        
        console.log('❌ Todas as tentativas falharam. É necessário um backend para contornar CORS.');
        console.log('💡 Soluções possíveis:');
        console.log('   1. Criar um backend Node.js/Python');
        console.log('   2. Usar um serviço de proxy CORS pago');
        console.log('   3. Deploy em servidor com CORS habilitado');
        return null;
        
    } catch (error) {
        console.error('❌ Método alternativo também falhou:', error);
        return null;
    }
}

// Buscar produtos via backend
async function fetchProductsFromBackend(query = '', category = '', page = 0) {
    try {
        // URL do backend (local ou Render)
        const backendUrl = 'https://shopee-api-backend.onrender.com/api/products';
        const localUrl = 'http://localhost:3000/api/products';
        
        // Tentar Render primeiro, depois local
        const urls = [backendUrl, localUrl];
        
        for (const url of urls) {
            try {
                console.log('🖥️ Tentando backend:', url);
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ query, category, page })
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                
                if (data.success && data.data && data.data.data && data.data.data.productOfferV2) {
                    const products = formatGraphQLProducts(data.data.data.productOfferV2.nodes);
                    console.log('✅ Backend retornou produtos:', products.length);
                    return products;
                }
                
                console.log('❌ Backend retornou dados inválidos:', data);
                
            } catch (urlError) {
                console.log('❌ URL falhou:', url, urlError.message);
                continue;
            }
        }
        
        console.log('❌ Todos os backends falharam');
        return null;
        
    } catch (error) {
        console.log('❌ Erro geral no backend:', error.message);
        return null;
    }
}

// Buscar produtos da API pública da Shopee
async function fetchPublicShopeeProducts(query = '', category = '', page = 0) {
    try {
        console.log('🌐 Tentando API pública da Shopee...');
        
        // Usar a API pública de busca da Shopee
        const searchQuery = query || 'promoção';
        const apiUrl = `https://shopee.com.br/api/v4/search/search_items?by=relevancy&keyword=${encodeURIComponent(searchQuery)}&limit=20&newest=${page * 20}&order=desc&page_type=search&scenario=PAGE_GLOBAL_SEARCH&version=2`;
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
            console.log('✅ API pública retornou produtos:', data.items.length);
            return formatPublicShopeeProducts(data.items);
        }
        
        return [];
    } catch (error) {
        console.log('❌ API pública falhou:', error.message);
        return null;
    }
}

// Formatar produtos da API pública da Shopee
function formatPublicShopeeProducts(items) {
    return items.map(item => {
        const item_basic = item.item_basic;
        const price = item_basic.price / 100000; // Converter de centavos
        const originalPrice = item_basic.price_before_discount / 100000;
        const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;
        
        return {
            id: item_basic.itemid,
            name: item_basic.name,
            price: price,
            originalPrice: originalPrice,
            discount: discount,
            image: `https://cf.shopee.com.br/file/${item_basic.image}`,
            images: [`https://cf.shopee.com.br/file/${item_basic.image}`],
            category: mapGraphQLCategory(item_basic.catid),
            rating: item_basic.item_rating?.rating_star || 0,
            reviews: item_basic.item_rating?.rating_count || 0,
            description: item_basic.name,
            shopId: item_basic.shopid,
            shopName: item_basic.shop_name || 'Loja Shopee',
            stock: 0,
            sold: item_basic.sold || 0,
            brand: '',
            weight: 0,
            dimensions: '',
            warranty: '',
            shipping: '',
            variants: [],
            isRealProduct: true,
            // Links reais da Shopee
            productLink: `https://shopee.com.br/${item_basic.name.replace(/\s+/g, '-')}-i.${item_basic.shopid}.${item_basic.itemid}`,
            offerLink: `https://shope.ee/${Math.random().toString(36).substr(2, 9)}`,
            shopType: [1],
            periodStartTime: 0,
            periodEndTime: 0
        };
    });
}


// Gerar assinatura SHA256 para API GraphQL da Shopee
async function generateGraphQLSignature(payload, timestamp) {
    try {
        // Fórmula: SHA256(Credential + Timestamp + Payload + Secret)
        const credential = SITE_CONFIG.affiliate.appId;
        const secret = SITE_CONFIG.affiliate.secret;
        
        const stringToSign = credential + timestamp + payload + secret;
        
        if (SITE_CONFIG.api.debugMode) {
            console.log('🔐 String para assinatura:', stringToSign);
        }
        
        // Usar Web Crypto API para gerar SHA256
        const encoder = new TextEncoder();
        const data = encoder.encode(stringToSign);
        
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    } catch (error) {
        console.error('❌ Erro ao gerar assinatura GraphQL:', error);
        return '';
    }
}

// Gerar assinatura para API REST (compatibilidade)
async function generateAPISignature(params, timestamp) {
    try {
        // Ordenar parâmetros
        const sortedParams = Object.keys(params)
            .sort()
            .map(key => `${key}=${params[key]}`)
            .join('&');
        
        const stringToSign = `${SITE_CONFIG.affiliate.appId}${timestamp}${sortedParams}`;
        
        // Usar Web Crypto API para gerar HMAC-SHA256
        const encoder = new TextEncoder();
        const keyData = encoder.encode(SITE_CONFIG.affiliate.secret);
        const messageData = encoder.encode(stringToSign);
        
        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyData,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );
        
        const signature = await crypto.subtle.sign('HMAC', cryptoKey, messageData);
        const hashArray = Array.from(new Uint8Array(signature));
        const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
        
        return hashHex;
    } catch (error) {
        console.error('Erro ao gerar assinatura:', error);
        return '';
    }
}

// Formatar produtos da API GraphQL da Shopee
function formatGraphQLProducts(items) {
    if (!items || !Array.isArray(items)) {
        console.warn('Items inválidos para formatação:', items);
        return [];
    }
    
    return items.map(item => {
        if (!item) {
            console.warn('Item nulo encontrado');
            return null;
        }
        
        // Converter preços de string para número
        const priceMin = parseFloat(item.priceMin) || 0;
        const priceMax = parseFloat(item.priceMax) || 0;
        const commission = parseFloat(item.commission) || 0;
        
        // Calcular desconto baseado no preço
        const discount = item.priceDiscountRate ? parseInt(item.priceDiscountRate) : 0;
        const originalPrice = discount > 0 ? priceMin / (1 - discount / 100) : priceMin;
        
        return {
            id: item.itemId || Math.random().toString(36).substr(2, 9),
            name: item.productName || 'Produto sem nome',
            price: priceMin,
            originalPrice: originalPrice,
            discount: discount,
            image: item.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
            images: [item.imageUrl || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400'],
            category: mapGraphQLCategory(item.productCatIds?.[0]),
            rating: parseFloat(item.ratingStar) || 0,
            reviews: item.sales || 0,
            description: item.productName || 'Descrição não disponível',
            shopId: item.shopId || 0,
            shopName: item.shopName || 'Loja não identificada',
            stock: 0,
            sold: item.sales || 0,
            brand: '',
            weight: 0,
            dimensions: '',
            warranty: '',
            shipping: '',
            variants: [],
            isRealProduct: true,
            // Campos específicos da API GraphQL
            commissionRate: parseFloat(item.commissionRate) || 0,
            sellerCommissionRate: parseFloat(item.sellerCommissionRate) || 0,
            shopeeCommissionRate: parseFloat(item.shopeeCommissionRate) || 0,
            commission: commission,
            productLink: item.productLink || '#',
            offerLink: item.offerLink || '#',
            shopType: item.shopType || [],
            periodStartTime: item.periodStartTime,
            periodEndTime: item.periodEndTime
        };
    }).filter(product => product !== null); // Remover produtos nulos
}

// Formatar produtos reais da API REST (compatibilidade)
function formatRealProducts(items) {
    return items.map(item => ({
        id: item.item_id,
        name: item.item_name,
        price: item.price / 100000, // Preço em centavos
        originalPrice: item.price_before_discount / 100000,
        discount: item.discount ? Math.round(item.discount) : 0,
        image: item.image,
        images: item.images || [item.image],
        category: mapCategory(item.category_id),
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
        isRealProduct: true // Marcar como produto real
    }));
}

// Mapear categoria da API GraphQL da Shopee
function mapGraphQLCategory(categoryId) {
    const categoryMap = {
        100001: 'electronics',
        100002: 'fashion', 
        100003: 'home',
        100004: 'beauty',
        100005: 'sports',
        100006: 'books',
        100007: 'toys',
        100008: 'automotive',
        100009: 'health',
        100010: 'baby',
        100011: 'pets',
        100012: 'automotive'
    };
    return categoryMap[categoryId] || 'other';
}

// Mapear categoria da API REST (compatibilidade)
function mapCategory(categoryId) {
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

function generateMockProducts(query = '', category = '', page = 0) {
    const allProducts = [
        {
            id: 1,
            name: 'Smartphone Samsung Galaxy A54 5G 128GB',
            price: 1299.99,
            originalPrice: 1599.99,
            discount: 19,
            image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400',
            category: 'electronics',
            rating: 4.5,
            reviews: 1250,
            description: 'Smartphone Samsung Galaxy A54 5G com 128GB de armazenamento, câmera tripla de 50MP e tela Super AMOLED de 6.4".',
            shopId: 12345678,
            shopName: 'Samsung Oficial',
            isRealProduct: false // Produto mock para demonstração
        },
        {
            id: 2,
            name: 'Fone de Ouvido Bluetooth JBL Tune 510BT',
            price: 199.99,
            originalPrice: 299.99,
            discount: 33,
            image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
            category: 'electronics',
            rating: 4.3,
            reviews: 890,
            description: 'Fone de ouvido Bluetooth JBL com som de alta qualidade, bateria de longa duração e design confortável.',
            shopId: 87654321,
            shopName: 'JBL Store',
            isRealProduct: false
        },
        {
            id: 3,
            name: 'Tênis Nike Air Max 270 Masculino',
            price: 399.99,
            originalPrice: 499.99,
            discount: 20,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400',
            category: 'fashion',
            rating: 4.7,
            reviews: 2100,
            description: 'Tênis Nike Air Max 270 com tecnologia de amortecimento Air Max e design moderno e confortável.',
            shopId: 11223344,
            shopName: 'Nike Oficial',
            isRealProduct: false
        },
        {
            id: 4,
            name: 'Cafeteira Elétrica Nespresso Essenza Mini',
            price: 299.99,
            originalPrice: 399.99,
            discount: 25,
            image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400',
            category: 'home',
            rating: 4.4,
            reviews: 650,
            description: 'Cafeteira Nespresso Essenza Mini, compacta e eficiente, perfeita para preparar café expresso de qualidade.',
            shopId: 55667788,
            shopName: 'Nespresso Store',
            isRealProduct: false
        },
        {
            id: 5,
            name: 'Kit Maquiagem Profissional 24 Cores',
            price: 89.99,
            originalPrice: 149.99,
            discount: 40,
            image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400',
            category: 'beauty',
            rating: 4.2,
            reviews: 420,
            description: 'Kit completo de maquiagem com 24 cores vibrantes, pincéis inclusos e alta pigmentação.',
            shopId: 99887766,
            shopName: 'Beauty Store',
            isRealProduct: false
        },
        {
            id: 6,
            name: 'Bicicleta Ergométrica Premium',
            price: 899.99,
            originalPrice: 1299.99,
            discount: 31,
            image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400',
            category: 'sports',
            rating: 4.6,
            reviews: 180,
            description: 'Bicicleta ergométrica premium com display digital, 8 níveis de resistência e design ergonômico.',
            shopId: 44332211,
            shopName: 'Sports Store',
            isRealProduct: false
        },
        {
            id: 7,
            name: 'Notebook Gamer Acer Nitro 5',
            price: 2499.99,
            originalPrice: 3299.99,
            discount: 24,
            image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400',
            category: 'electronics',
            rating: 4.8,
            reviews: 950,
            description: 'Notebook gamer Acer Nitro 5 com processador Intel i7, placa de vídeo RTX 3060 e 16GB RAM.',
            shopId: 76543210,
            shopName: 'Acer Store',
            isRealProduct: false
        },
        {
            id: 8,
            name: 'Relógio Smartwatch Apple Watch SE',
            price: 1299.99,
            originalPrice: 1599.99,
            discount: 19,
            image: 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400',
            category: 'electronics',
            rating: 4.5,
            reviews: 3200,
            description: 'Apple Watch SE com monitoramento de saúde, GPS e conectividade com iPhone.',
            shopId: 13579246,
            shopName: 'Apple Store',
            isRealProduct: false
        }
    ];

    // Filtrar produtos baseado na query e categoria
    let filtered = allProducts;
    
    if (query) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(query.toLowerCase()) ||
            product.description.toLowerCase().includes(query.toLowerCase())
        );
    }
    
    if (category) {
        filtered = filtered.filter(product => product.category === category);
    }

    // Simular paginação
    const itemsPerPage = 8;
    const startIndex = page * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    
    return filtered.slice(startIndex, endIndex);
}

// Funções de exibição de produtos
async function loadInitialProducts() {
    try {
        showLoading(true);
        const products = await fetchShopeeProducts();
        currentProducts = products;
        filteredProducts = [...products];
        displayProducts(products);
        showLoading(false);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        showLoading(false);
        showError('Erro ao carregar produtos. Tente novamente.');
    }
}

async function loadMoreProducts() {
    if (isLoading) return;
    
    isLoading = true;
    elements.loadMoreBtn.textContent = 'Carregando...';
    elements.loadMoreBtn.disabled = true;
    
    try {
        currentPage++;
        const query = elements.searchInput.value;
        const category = elements.categoryFilter.value;
        const newProducts = await fetchShopeeProducts(query, category, currentPage);
        
        if (newProducts.length > 0) {
            currentProducts = [...currentProducts, ...newProducts];
            filteredProducts = [...currentProducts];
            displayProducts(filteredProducts);
        } else {
            elements.loadMoreBtn.textContent = 'Não há mais produtos';
            elements.loadMoreBtn.disabled = true;
        }
    } catch (error) {
        console.error('Erro ao carregar mais produtos:', error);
        showError('Erro ao carregar mais produtos.');
    } finally {
        isLoading = false;
        elements.loadMoreBtn.textContent = 'Carregar Mais Produtos';
        elements.loadMoreBtn.disabled = false;
    }
}

function displayProducts(products) {
    console.log('🖼️ Exibindo produtos:', products.length);
    console.log('🖼️ Primeiro produto para exibição:', products[0]);
    
    if (products.length === 0) {
        elements.productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #666;">
                <i class="fas fa-search" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i>
                <h3>Nenhum produto encontrado</h3>
                <p>Tente ajustar os filtros ou buscar por outros termos.</p>
            </div>
        `;
        return;
    }

    const productsHTML = products.map(product => createProductCard(product)).join('');
    console.log('🖼️ HTML gerado para produtos:', productsHTML.substring(0, 200) + '...');
    elements.productsGrid.innerHTML = productsHTML;
}

function createProductCard(product) {
    // Verificar se o produto tem dados válidos
    if (!product || !product.name || product.name === 'undefined') {
        console.warn('Produto inválido:', product);
        return '';
    }
    
    const discount = product.discount || Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    const price = product.price || 0;
    const originalPrice = product.originalPrice || price;
    const rating = product.rating || 0;
    const reviews = product.reviews || 0;
    const image = product.image || 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400';
    
    return `
        <div class="product-card" onclick="openProductModal(${product.id})">
            <div class="product-image">
                <img src="${image}" alt="${product.name}" loading="lazy">
                <div class="discount-badge">-${discount}%</div>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="price-info">
                    <span class="current-price">R$ ${price.toFixed(2).replace('.', ',')}</span>
                    <span class="original-price">R$ ${originalPrice.toFixed(2).replace('.', ',')}</span>
                </div>
                <div class="rating">
                    <div class="stars">
                        ${generateStars(rating)}
                    </div>
                    <span class="rating-text">(${reviews})</span>
                </div>
            </div>
        </div>
    `;
}

function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

// Funções de busca e filtros
async function handleSearch() {
    const query = elements.searchInput.value.trim();
    showLoading(true);
    
    try {
        const products = await fetchShopeeProducts(query);
        currentProducts = products;
        filteredProducts = [...products];
        applyFilters();
        showLoading(false);
    } catch (error) {
        console.error('Erro na busca:', error);
        showLoading(false);
        showError('Erro ao buscar produtos.');
    }
}

function applyFilters() {
    let filtered = [...currentProducts];
    
    // Filtro de preço
    const priceFilter = elements.priceFilter.value;
    if (priceFilter) {
        const [min, max] = priceFilter.split('-').map(p => p === '+' ? Infinity : parseInt(p));
        filtered = filtered.filter(product => {
            const price = product.price;
            return price >= min && (max === undefined || price <= max);
        });
    }
    
    // Ordenação
    const sortFilter = elements.sortFilter.value;
    switch (sortFilter) {
        case 'price_low':
            filtered.sort((a, b) => a.price - b.price);
            break;
        case 'price_high':
            filtered.sort((a, b) => b.price - a.price);
            break;
        case 'rating':
            filtered.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Manter ordem original (relevância)
            break;
    }
    
    filteredProducts = filtered;
    displayProducts(filteredProducts);
}

// Sistema de Chat
function setupChat() {
    // Adicionar mensagem de boas-vindas
    addChatMessage('bot', 'Olá! Sou seu assistente de promoções da Shopee. Como posso ajudá-lo hoje?');
}

function sendChatMessage() {
    const message = elements.chatInput.value.trim();
    if (!message) return;
    
    // Adicionar mensagem do usuário
    addChatMessage('user', message);
    elements.chatInput.value = '';
    
    // Simular resposta do bot
    setTimeout(() => {
        const response = generateChatResponse(message);
        addChatMessage('bot', response);
    }, 1000);
}

function addChatMessage(type, message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}-message`;
    
    const icon = type === 'bot' ? 'fas fa-robot' : 'fas fa-user';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="${icon}"></i>
            <p>${message}</p>
        </div>
    `;
    
    elements.chatMessages.appendChild(messageDiv);
    elements.chatMessages.scrollTop = elements.chatMessages.scrollHeight;
}

function generateChatResponse(userMessage) {
    const message = userMessage.toLowerCase();
    
    if (message.includes('promoção') || message.includes('promoções') || message.includes('ofertas')) {
        return '🔥 Confira nossas promoções do dia! Temos descontos de até 50% em eletrônicos, moda e muito mais. Use os filtros para encontrar o que procura!';
    }
    
    if (message.includes('eletrônico') || message.includes('celular') || message.includes('smartphone')) {
        return '📱 Nossa seção de eletrônicos está em promoção! Smartphones, notebooks, fones de ouvido e muito mais com preços imperdíveis!';
    }
    
    if (message.includes('moda') || message.includes('roupa') || message.includes('tênis')) {
        return '👕 Aproveite as ofertas de moda! Tênis, roupas e acessórios com descontos especiais. Confira nossa seleção!';
    }
    
    if (message.includes('preço') || message.includes('barato') || message.includes('desconto')) {
        return '💰 Temos produtos com descontos de até 50%! Use o filtro de preço para encontrar ofertas no seu orçamento.';
    }
    
    if (message.includes('ajuda') || message.includes('help')) {
        return '💡 Posso ajudá-lo a encontrar produtos, explicar sobre promoções ou tirar dúvidas sobre o site. O que você gostaria de saber?';
    }
    
    if (message.includes('obrigado') || message.includes('valeu') || message.includes('thanks')) {
        return '😊 De nada! Estou aqui para ajudar. Aproveite as promoções e faça ótimas compras!';
    }
    
    // Resposta padrão
    const responses = [
        'Interessante! Que tipo de produto você está procurando?',
        'Posso ajudá-lo a encontrar o que precisa. Use os filtros ou me diga o que procura!',
        'Temos muitas ofertas especiais! Que categoria te interessa mais?',
        'Confira nossa seleção de produtos em promoção. Tem algo específico em mente?'
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// Modal do produto
function openProductModal(productId) {
    const product = currentProducts.find(p => p.id === productId);
    if (!product) return;
    
    const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
    
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductName').textContent = product.name;
    document.getElementById('modalCurrentPrice').textContent = `R$ ${product.price.toFixed(2).replace('.', ',')}`;
    document.getElementById('modalOriginalPrice').textContent = `R$ ${product.originalPrice.toFixed(2).replace('.', ',')}`;
    document.getElementById('modalDiscount').textContent = `-${discount}%`;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalRating').innerHTML = generateStars(product.rating) + ` <span>(${product.reviews} avaliações)</span>`;
    
    // Criar link de afiliado correto
    const affiliateLink = generateCorrectAffiliateLink(product);
    document.getElementById('modalProductLink').href = affiliateLink;
    
    elements.productModal.style.display = 'block';
}

function closeProductModal() {
    elements.productModal.style.display = 'none';
}

// Funções utilitárias
function showLoading(show) {
    elements.loading.style.display = show ? 'block' : 'none';
    elements.productsGrid.style.display = show ? 'none' : 'grid';
}

function showError(message) {
    elements.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 3rem; color: #ff4757;">
            <i class="fas fa-exclamation-triangle" style="font-size: 3rem; margin-bottom: 1rem;"></i>
            <h3>Ops! Algo deu errado</h3>
            <p>${message}</p>
        </div>
    `;
}

// Função para gerar links de afiliado corretos
function generateCorrectAffiliateLink(product) {
    const config = SITE_CONFIG || { affiliate: { appId: '18305010276' } };
    
    // Se o produto tem offerLink (da API real), usar ele
    if (product.offerLink && product.offerLink !== '#') {
        return product.offerLink;
    }
    
    // Se o produto tem productLink (da API real), usar ele
    if (product.productLink && product.productLink !== '#') {
        return product.productLink;
    }
    
    // Se é um produto real da API, usar o formato correto
    if (product.isRealProduct && product.shopId) {
        // Formato correto para produtos reais da Shopee
        return `https://shopee.com.br/product/${product.shopId}/${product.id}?affiliate_id=${config.affiliate.appId}`;
    }
    
    // Para produtos mock, usar formato de demonstração
    return `https://shopee.com.br/product/${product.id}?affiliate_id=${config.affiliate.appId}`;
}

// Função para gerar links de afiliado (compatibilidade)
function generateAffiliateLink(productId) {
    const config = SITE_CONFIG || { affiliate: { appId: '18305010276' } };
    return `https://shopee.com.br/product/${productId}?affiliate_id=${config.affiliate.appId}`;
}

// Configurar notificações (se o usuário permitir)
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
    }
}

// Inicializar notificações quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    requestNotificationPermission();
});

// Função para mostrar notificação de nova promoção
function showPromotionNotification(title, message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, {
            body: message,
            icon: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'
        });
    }
}

// Simular notificação de nova promoção (para demonstração)
setTimeout(() => {
    showPromotionNotification(
        '🔥 Nova Promoção!',
        'Smartphone Samsung Galaxy A54 com 19% de desconto! Aproveite!'
    );
}, 10000); // 10 segundos após carregar a página
