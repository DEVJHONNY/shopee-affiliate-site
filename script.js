// Variáveis globais
let currentProducts = [];
let currentPage = 1;
let isLoading = false;
let searchParams = {
    query: '',
    category: '',
    sort: 'relevance',
    priceRange: ''
};

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ PromoShopee inicializado!');
    loadInitialProducts();
    setupEventListeners();
});

// Configurar event listeners
function setupEventListeners() {
    // Busca ao pressionar Enter
    document.getElementById('searchInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            searchProducts();
        }
    });

    // Chat ao pressionar Enter
    document.getElementById('chatInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Fechar modal ao clicar fora
    document.getElementById('productModal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Carregar produtos iniciais
async function loadInitialProducts() {
    try {
        showLoading();
        searchParams.query = SITE_CONFIG.DEFAULT_SEARCH_TERM;
        const products = await fetchShopeeProducts(searchParams);
        currentProducts = products;
        displayProducts(products);
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
        displayProducts(FALLBACK_PRODUCTS);
    }
}

// Buscar produtos da API
async function fetchShopeeProducts(params) {
    try {
        console.log('🔍 Buscando produtos:', params);
        
        // Mostrar loading
        showLoading();
        
        const response = await fetch(`${SHOPEE_CONFIG.BACKEND_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
            console.error('❌ Erros da API:', data.errors);
            showError('Erro na API Shopee: ' + (data.errors[0]?.message || 'Erro desconhecido'));
            return FALLBACK_PRODUCTS;
        }

        if (!data.data?.productOfferV2?.nodes || data.data.productOfferV2.nodes.length === 0) {
            console.log('📭 Nenhum produto encontrado na API');
            showInfo('Nenhum produto encontrado. Mostrando produtos de exemplo.');
            return FALLBACK_PRODUCTS;
        }

        console.log(`✅ ${data.data.productOfferV2.nodes.length} produtos recebidos`);
        return data.data.productOfferV2.nodes;

    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        
        // Mostrar mensagem de erro amigável
        if (error.message.includes('Failed to fetch')) {
            showError('Erro de conexão. Verifique sua internet e tente novamente.');
        } else if (error.message.includes('400')) {
            showError('Erro na requisição. Tente novamente em alguns instantes.');
        } else if (error.message.includes('500')) {
            showError('Servidor temporariamente indisponível. Tente novamente em alguns minutos.');
        } else {
            showError('Erro inesperado: ' + error.message);
        }
        
        return FALLBACK_PRODUCTS;
    }
}

// Exibir produtos na grade
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    
    if (!products || products.length === 0) {
        grid.innerHTML = '<div class="loading">Nenhum produto encontrado.</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.itemId})">
            <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}" 
                 alt="${product.productName}" 
                 class="product-image"
                 onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'">
            
            <div class="product-info">
                <h3>${product.productName}</h3>
                
                <div class="product-price">
                    <span class="current-price">R$ ${parseFloat(product.priceMin).toFixed(2)}</span>
                    ${product.priceMax > product.priceMin ? `
                        <span class="original-price">R$ ${parseFloat(product.priceMax).toFixed(2)}</span>
                        <span class="discount">-${calculateDiscount(product.priceMin, product.priceMax)}%</span>
                    ` : ''}
                </div>
                
                <div class="product-meta">
                    <div class="rating">
                        ⭐ ${parseFloat(product.ratingStar || 4.5).toFixed(1)}
                    </div>
                    <div class="sales">
                        ${formatSales(product.sales)} vendas
                    </div>
                </div>
                
                ${product.commissionRate ? `
                    <div class="commission">
                        Comissão: ${(parseFloat(product.commissionRate) * 100).toFixed(1)}%
                    </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Calcular desconto
function calculateDiscount(current, original) {
    return Math.round(((original - current) / original) * 100);
}

// Formatar vendas
function formatSales(sales) {
    if (sales >= 1000) {
        return (sales / 1000).toFixed(1) + 'k';
    }
    return sales;
}

// Buscar produtos
async function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    searchParams.query = searchTerm || SITE_CONFIG.DEFAULT_SEARCH_TERM;
    searchParams.category = document.getElementById('categoryFilter').value;
    
    showLoading();
    
    try {
        const products = await fetchShopeeProducts(searchParams);
        currentProducts = products;
        displayProducts(products);
        
        // Scroll para produtos
        document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Erro na busca:', error);
        displayProducts(FALLBACK_PRODUCTS);
    }
}

// Filtrar produtos
async function filterProducts() {
    searchParams.category = document.getElementById('categoryFilter').value;
    searchParams.sort = document.getElementById('sortFilter').value;
    searchParams.priceRange = document.getElementById('priceFilter').value;
    
    showLoading();
    
    try {
        const products = await fetchShopeeProducts(searchParams);
        currentProducts = products;
        displayProducts(products);
    } catch (error) {
        console.error('Erro no filtro:', error);
        displayProducts(FALLBACK_PRODUCTS);
    }
}

// Carregar mais produtos
async function loadMoreProducts() {
    if (isLoading) return;
    
    isLoading = true;
    currentPage++;
    
    try {
        const moreProducts = await fetchShopeeProducts({
            ...searchParams,
            page: currentPage
        });
        
        currentProducts = [...currentProducts, ...moreProducts];
        displayProducts(currentProducts);
    } catch (error) {
        console.error('Erro ao carregar mais produtos:', error);
    } finally {
        isLoading = false;
    }
}

// Abrir modal do produto
function openProductModal(productId) {
    const product = currentProducts.find(p => p.itemId === productId) || FALLBACK_PRODUCTS[0];
    
    const modalContent = `
        <div class="modal-product">
            <div class="modal-image-container">
                <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}" 
                     alt="${product.productName}" 
                     class="modal-image"
                     onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'">
            </div>
            
            <h2>${product.productName}</h2>
            
            <div class="modal-price">
                <span class="current-price">R$ ${parseFloat(product.priceMin).toFixed(2)}</span>
                ${product.priceMax > product.priceMin ? `
                    <span class="original-price">R$ ${parseFloat(product.priceMax).toFixed(2)}</span>
                    <span class="discount">-${calculateDiscount(product.priceMin, product.priceMax)}%</span>
                ` : ''}
            </div>
            
            <div class="modal-details">
                <p><strong>Loja:</strong> ${product.shopName}</p>
                <p><strong>Avaliação:</strong> ⭐ ${parseFloat(product.ratingStar || 4.5).toFixed(1)}</p>
                <p><strong>Vendas:</strong> ${formatSales(product.sales)}</p>
                ${product.commissionRate ? `
                    <p><strong>Comissão:</strong> ${(parseFloat(product.commissionRate) * 100).toFixed(1)}%</p>
                ` : ''}
            </div>
            
            <div class="modal-actions">
                <a href="${product.offerLink || product.productLink}${SITE_CONFIG.AFFILIATE_TAG}" 
                   target="_blank" 
                   class="buy-button">
                    🛒 Comprar na Shopee
                </a>
                <button onclick="closeModal()" class="close-button">
                    ✕ Fechar
                </button>
            </div>
        </div>
    `;
    
    document.getElementById('modalContent').innerHTML = modalContent;
    document.getElementById('productModal').style.display = 'block';
    
    // Adiciona overlay
    if (!document.getElementById('modalOverlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'modalOverlay';
        overlay.className = 'modal-overlay';
        overlay.onclick = closeModal;
        document.body.appendChild(overlay);
    }
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
    
    // Remove overlay
    const overlay = document.getElementById('modalOverlay');
    if (overlay) {
        overlay.remove();
    }
}

// Mostrar loading
function showLoading() {
    document.getElementById('productsGrid').innerHTML = `
        <div class="loading">
            <div>🔍 Buscando produtos...</div>
        </div>
    `;
}

// Funções de feedback para o usuário
function showError(message) {
    const grid = document.getElementById('productsGrid');
    grid.innerHTML = `
        <div class="error-message">
            <strong>⚠️ Erro:</strong> ${message}
            <br>
            <small>Mostrando produtos de exemplo...</small>
        </div>
        ${createProductsGrid(FALLBACK_PRODUCTS)}
    `;
}

function showInfo(message) {
    const grid = document.getElementById('productsGrid');
    const infoDiv = document.createElement('div');
    infoDiv.className = 'no-products';
    infoDiv.innerHTML = `
        <i>🔍</i>
        <p>${message}</p>
    `;
    grid.appendChild(infoDiv);
}

// Função auxiliar para criar grid de produtos
function createProductsGrid(products) {
    return products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.itemId})">
            <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}" 
                 alt="${product.productName}" 
                 class="product-image"
                 onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'">
            
            <div class="product-info">
                <h3>${product.productName}</h3>
                
                <div class="product-price">
                    <span class="current-price">R$ ${parseFloat(product.priceMin).toFixed(2)}</span>
                    ${product.priceMax > product.priceMin ? `
                        <span class="original-price">R$ ${parseFloat(product.priceMax).toFixed(2)}</span>
                        <span class="discount">-${calculateDiscount(product.priceMin, product.priceMax)}%</span>
                    ` : ''}
                </div>
                
                <div class="product-meta">
                    <div class="rating">
                        ⭐ ${parseFloat(product.ratingStar || 4.5).toFixed(1)}
                    </div>
                    <div class="sales">
                        ${formatSales(product.sales)} vendas
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Sistema de Chat
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    
    if (!message) return;
    
    // Adicionar mensagem do usuário
    addMessage(message, 'user');
    input.value = '';
    
    // Resposta do bot
    setTimeout(() => {
        const response = getBotResponse(message);
        addMessage(response, 'bot');
    }, 1000);
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function getBotResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('promo') || lowerMessage.includes('ofert')) {
        return CHAT_CONFIG.RESPONSES.promoções;
    }
    else if (lowerMessage.includes('eletrôn') || lowerMessage.includes('celular') || lowerMessage.includes('phone')) {
        return CHAT_CONFIG.RESPONSES.eletrônicos;
    }
    else if (lowerMessage.includes('moda') || lowerMessage.includes('roupa') || lowerMessage.includes('vest')) {
        return CHAT_CONFIG.RESPONSES.moda;
    }
    else if (lowerMessage.includes('desconto') || lowerMessage.includes('preço') || lowerMessage.includes('barato')) {
        return CHAT_CONFIG.RESPONSES.desconto;
    }
    else if (lowerMessage.includes('frete') || lowerMessage.includes('entrega') || lowerMessage.includes('envio')) {
        return CHAT_CONFIG.RESPONSES.frete;
    }
    else {
        return CHAT_CONFIG.RESPONSES.default;
    }
}

// Utilitários
function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(value);
}

// Log de inicialização
console.log('🚀 Script do PromoShopee carregado com sucesso!');
console.log('📊 Produtos de fallback:', FALLBACK_PRODUCTS.length);
console.log('💬 Configuração do chat:', CHAT_CONFIG.BOT_NAME);