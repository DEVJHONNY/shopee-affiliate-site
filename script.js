// Variáveis globais
let currentProducts = [];
let currentPage = 1;
let isLoading = false;
let searchParams = {
    query: '',
    category: '',
    sort: 'relevance'
};
let chatHistory = []; // Para guardar o histórico da conversa

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ PromoShopee inicializado!');
    loadInitialProducts();
    setupEventListeners();

    // Adicionar mensagem inicial do chatbot
    setTimeout(() => {
        const welcomeMessage = CHAT_CONFIG.WELCOME_MESSAGE;
        addMessage(welcomeMessage, 'bot');
        chatHistory.push({ role: "model", parts: [{ text: welcomeMessage }] });
    }, 1000);
});

// Configurar event listeners
function setupEventListeners() {
    document.getElementById('searchInput').addEventListener('keypress', e => e.key === 'Enter' && searchProducts());
    document.getElementById('chatInput').addEventListener('keypress', e => e.key === 'Enter' && sendMessage());
    document.getElementById('productModal').addEventListener('click', e => e.target === e.currentTarget && closeModal());
    
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
        showLoading();
        
        const response = await fetch(`${SHOPEE_CONFIG.BACKEND_URL}/api/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(params)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
        }

        const data = await response.json();
        
        if (data.errors) {
            console.error('❌ Erros da API:', data.errors);
            return FALLBACK_PRODUCTS;
        }

        if (!data.data?.productOfferV2?.nodes || data.data.productOfferV2.nodes.length === 0) {
            console.log('📭 Nenhum produto encontrado na API');
            return FALLBACK_PRODUCTS;
        }

        return data.data.productOfferV2.nodes;

    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
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
            <img src="${product.imageUrl || 'placeholder.jpg'}" alt="${product.productName}" class="product-image" onerror="this.src='https://via.placeholder.com/300'">
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

// Ações de busca e filtro
async function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.trim();
    searchParams.query = searchTerm || SITE_CONFIG.DEFAULT_SEARCH_TERM;
    
    showLoading();
    const products = await fetchShopeeProducts(searchParams);
    currentProducts = products;
    displayProducts(products);
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
}

async function filterProducts() {
    searchParams.category = document.getElementById('categoryFilter').value;
    searchParams.sort = document.getElementById('sortFilter').value;
    
    showLoading();
    const products = await fetchShopeeProducts(searchParams);
    currentProducts = products;
    displayProducts(products);
}

// Modal
function openProductModal(itemId) {
    const product = currentProducts.find(p => p.itemId === itemId);
    if (!product) return;
    
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
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
                <button onclick="closeModal()" class="close-button">✕ Fechar</button>
            </div>
        </div>
    `;
    document.getElementById('productModal').style.display = 'block';
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
        document.getElementById('sortFilter').value = 'price_asc';
        filterProducts();
        return CHAT_CONFIG.RESPONSES.menor_preco;
    }
    if (lowerMessage.includes('cupom') || lowerMessage.includes('cupons') || lowerMessage.includes('redirecione')) {
        return CHAT_CONFIG.RESPONSES.cupons;
    }
    if (lowerMessage.includes('promo') || lowerMessage.includes('ofert')) {
        document.getElementById('searchInput').value = 'promoção';
        searchProducts();
        return CHAT_CONFIG.RESPONSES.promoções;
    }
    if (lowerMessage.includes('eletrôn') || lowerMessage.includes('celular')) {
        document.getElementById('categoryFilter').value = 'eletronicos';
        filterProducts();
        return CHAT_CONFIG.RESPONSES.eletrônicos;
    }
    if (lowerMessage.includes('moda') || lowerMessage.includes('roupa')) {
        document.getElementById('categoryFilter').value = 'moda';
        filterProducts();
        return CHAT_CONFIG.RESPONSES.moda;
    }
    if (lowerMessage.includes('desconto') || lowerMessage.includes('barato')) {
        document.getElementById('sortFilter').value = 'discount';
        filterProducts();
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
    messageDiv.innerHTML = text; // Usar innerHTML diretamente para renderizar o link
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) typingIndicator.remove();
}