// Variáveis globais
let currentProducts = [];
let currentPage = 1;
let isLoading = false;
let requestCount = 0;
let lastRequestTime = Date.now();

// Funções de Segurança
const sanitizeInput = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

const validateProduct = (product) => {
    const requiredFields = ['itemId', 'productName', 'imageUrl', 'priceMin', 'priceMax'];
    return requiredFields.every(field => product.hasOwnProperty(field)) &&
        typeof product.itemId === 'number' &&
        product.priceMin > 0;
};

let searchParams = {
    query: '',
    category: '',
    sort: 'relevance'
};
let chatHistory = [];

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    SHOPEE_CONFIG.DEBUG_MODE && console.log('🛍️ Shopee Treasures - Iniciando...');
    loadInitialProducts();
    setupEventListeners(); setTimeout(() => {
        const welcomeMessage = CHAT_CONFIG.WELCOME_MESSAGE;
        addMessage(welcomeMessage, 'bot');
        chatHistory.push({ role: "model", parts: [{ text: welcomeMessage }] });
    }, 1000);
});

// Configurar event listeners
function setupEventListeners() {
    // Busca
    document.getElementById('searchInput').addEventListener('keypress', e => e.key === 'Enter' && searchProducts());

    // Chat
    document.getElementById('chatInput').addEventListener('keypress', e => e.key === 'Enter' && sendMessage());

    // Modal
    document.getElementById('productModal').addEventListener('click', e => {
        if (e.target.classList.contains('modal') || e.target.classList.contains('close')) {
            closeModal();
        }
    });

    const chatContainer = document.getElementById('chat-container');
    const chatToggleButton = document.getElementById('chat-toggle-button');
    const chatCloseButton = document.getElementById('chat-close-button');

    chatToggleButton.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
        chatToggleButton.classList.toggle('hidden');
    });

    chatCloseButton.addEventListener('click', () => {
        chatContainer.classList.toggle('hidden');
        chatToggleButton.classList.toggle('hidden');
    });

    // --- Lógica do Menu Hambúrguer ---
    const hamburgerButton = document.getElementById('hamburger-button');
    const mobileNav = document.getElementById('mobile-nav');
    const mobileNavLinks = mobileNav.querySelectorAll('.nav-link');

    hamburgerButton.addEventListener('click', () => {
        hamburgerButton.classList.toggle('active');
        mobileNav.classList.toggle('active');
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerButton.classList.remove('active');
            mobileNav.classList.remove('active');
        });
    });

    // --- Lógica do Botão Voltar ao Topo ---
    const backToTopBtn = document.getElementById('backToTopBtn');

    window.onscroll = () => {
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    };

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
        // Rate limiting
        const now = Date.now();
        if (now - lastRequestTime < 1000) {
            const waitTime = 1000 - (now - lastRequestTime);
            await new Promise(resolve => setTimeout(resolve, waitTime));
        }
        lastRequestTime = Date.now();

        // Validação de parâmetros
        params.query = sanitizeInput(params.query);
        if (params.query.length > 100) throw new Error('Busca muito longa');

        SHOPEE_CONFIG.DEBUG_MODE && console.log('🔍 Buscando:', params.query);
        showLoading(); const response = await fetch(`${SHOPEE_CONFIG.BACKEND_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            throw new Error(`Erro HTTP: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || data.errors) {
            console.error('❌ Erros da API:', data.errors);
            return FALLBACK_PRODUCTS;
        }

        if (!data.data?.productOfferV2?.nodes || data.data.productOfferV2.nodes.length === 0) {
            return [];
        }

        return data.data.productOfferV2.nodes;

    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        const errorMessage = document.getElementById('productsGrid');
        errorMessage.innerHTML = `
            <div class="loading error">
                <p>😕 Ops! Tivemos um problema ao buscar os produtos.</p>
                <button onclick="location.reload()" class="retry-button">Tentar Novamente</button>
            </div>
        `;
        return FALLBACK_PRODUCTS;
    }
}

// Exibir produtos na grade
function displayProducts(products) {
    const grid = document.getElementById('productsGrid');
    if (!products || products.length === 0) {
        grid.innerHTML = '<div class="loading">Nenhum produto encontrado. Tente uma nova busca!</div>';
        return;
    }

    grid.innerHTML = products.map(product => `
        <div class="product-card" onclick="openProductModal(${product.itemId})">
            <img src="${product.imageUrl || 'assets/images/placeholder.jpg'}" 
                alt="${product.productName}" 
                class="product-image" 
                onerror="this.onerror=null; this.src='https://via.placeholder.com/300x300?text=Imagem+Indisponível'"
                loading="lazy">
            <div class="product-info">
                <h3>${product.productName}</h3>
                <div class="product-price">
                    <span class="current-price">R$ ${parseFloat(product.priceMin).toFixed(2)}</span>
                    ${product.priceMax > product.priceMin ? `<span class="original-price">R$ ${parseFloat(product.priceMax).toFixed(2)}</span><span class="discount">-${calculateDiscount(product.priceMin, product.priceMax)}%</span>` : ''}
                </div>
                <div class="product-meta">
                    <div class="rating">⭐ ${parseFloat(product.ratingStar || 4.5).toFixed(1)}</div>
                    <div class="sales">${formatSales(product.sales)} vendas</div>
                </div>
            </div>
        </div>
    `).join('');
}

// Funções utilitárias
const calculateDiscount = (current, original) => Math.round(((original - current) / original) * 100);
const formatSales = sales => (sales >= 1000) ? `${(sales / 1000).toFixed(1)}k` : sales;

// Ações de busca
async function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    searchParams.query = searchTerm || SITE_CONFIG.DEFAULT_SEARCH_TERM;
    searchParams.category = '';
    searchParams.sort = 'relevance';

    await triggerSearch();
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}

async function triggerSearch() {
    showLoading();
    const products = await fetchShopeeProducts(searchParams);
    currentProducts = products;
    displayProducts(products);
}

// Modal
function openProductModal(itemId) {
    const product = currentProducts.find(p => p.itemId === itemId);
    if (!product) {
        console.error('Produto não encontrado:', itemId);
        alert('Desculpe, não foi possível abrir os detalhes deste produto.');
        return;
    }

    const modalContentEl = document.getElementById('modalContent');
    modalContentEl.innerHTML = `
        <span class="close" onclick="closeModal()">&times;</span>
        <div class="modal-product">
            <div class="modal-image-container">
                <img src="${product.imageUrl}" alt="${product.productName}" class="modal-image">
            </div>
            <h2>${product.productName}</h2>
            <div class="modal-price">
                <span class="current-price">R$ ${parseFloat(product.priceMin).toFixed(2)}</span>
                ${product.priceMax > product.priceMin ? `<span class="original-price">R$ ${parseFloat(product.priceMax).toFixed(2)}</span>` : ''}
            </div>
            <div class="modal-details">
                <p><strong>Loja:</strong> ${product.shopName}</p>
                <p><strong>Avaliação:</strong> ⭐ ${parseFloat(product.ratingStar).toFixed(1)}</p>
                <p><strong>Vendas:</strong> ${formatSales(product.sales)}</p>
            </div>
            <div class="modal-actions">
                <a href="${product.offerLink}${SITE_CONFIG.AFFILIATE_TAG}" target="_blank" class="buy-button">🛒 Comprar na Shopee</a>
                <button onclick="closeModal()" class="close-button">Voltar</button>
            </div>
        </div>
    `;
    document.getElementById('productModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

const showLoading = () => document.getElementById('productsGrid').innerHTML = `<div class="loading">🔍 Buscando tesouros...</div>`;

// Sistema de Chat
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    input.value = '';

    const commandResponse = handleLocalCommand(message);
    if (commandResponse) {
        setTimeout(() => {
            addMessage(commandResponse, 'bot');
            chatHistory.push({ role: "model", parts: [{ text: commandResponse }] });
        }, 500);
    } else {
        await getGeminiResponse(message);
    }
}

function handleLocalCommand(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('menor preço')) {
        searchParams.sort = 'price_asc';
        triggerSearch();
        return CHAT_CONFIG.RESPONSES.menor_preco;
    }
    if (lowerMessage.includes('cupom') || lowerMessage.includes('cupons') || lowerMessage.includes('redirecione')) {
        return CHAT_CONFIG.RESPONSES.cupons;
    }
    if (lowerMessage.includes('promo') || lowerMessage.includes('ofert')) {
        searchParams.query = 'promoção';
        searchParams.category = '';
        searchParams.sort = 'relevance';
        triggerSearch();
        return CHAT_CONFIG.RESPONSES.promoções;
    }
    if (lowerMessage.includes('eletrôn') || lowerMessage.includes('celular')) {
        searchParams.query = 'eletrônicos';
        searchParams.category = 'eletronicos';
        searchParams.sort = 'relevance';
        triggerSearch();
        return CHAT_CONFIG.RESPONSES.eletrônicos;
    }
    if (lowerMessage.includes('moda') || lowerMessage.includes('roupa')) {
        searchParams.query = 'moda';
        searchParams.category = 'moda';
        searchParams.sort = 'relevance';
        triggerSearch();
        return CHAT_CONFIG.RESPONSES.moda;
    }
    if (lowerMessage.includes('desconto') || lowerMessage.includes('barato')) {
        searchParams.sort = 'discount';
        triggerSearch();
        return CHAT_CONFIG.RESPONSES.desconto;
    }
    return null;
}

async function getGeminiResponse(message) {
    addMessage('Digitando...', 'bot typing');
    try {
        const response = await fetch(`${SHOPEE_CONFIG.BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                history: chatHistory.slice(-6)
            })
        });
        if (!response.ok) throw new Error('Falha na resposta da API.');
        const data = await response.json();
        const geminiReply = data.reply;
        removeTypingIndicator();
        addMessage(geminiReply, 'bot');
        chatHistory.push({ role: "model", parts: [{ text: geminiReply }] });
    } catch (error) {
        console.error('Erro ao buscar resposta do Gemini:', error);
        removeTypingIndicator();
        addMessage('Desculpe, não consigo responder agora. Tente novamente.', 'bot error');
    }
}

function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    if (type.includes('typing')) messageDiv.id = 'typing-indicator';
    messageDiv.innerHTML = text;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}