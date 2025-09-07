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
        // Adiciona a boas-vindas ao histórico como se o modelo tivesse dito
        chatHistory.push({ role: "model", parts: [{ text: welcomeMessage }] });
    }, 1000);
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

    // Chat
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
            showError('Erro na API Shopee: ' + (data.errors[0]?.message || 'Erro desconhecido'));
            return FALLBACK_PRODUCTS;
        }

        if (!data.data?.productOfferV2?.nodes || data.data.productOfferV2.nodes.length === 0) {
            showInfo('Nenhum produto encontrado. Mostrando produtos de exemplo.');
            return FALLBACK_PRODUCTS;
        }

        return data.data.productOfferV2.nodes;

    } catch (error) {
        console.error('❌ Erro ao buscar produtos:', error);
        showError('Erro de conexão. Verifique sua internet e tente novamente.');
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
                    <div class="rating">⭐ ${parseFloat(product.ratingStar || 4.5).toFixed(1)}</div>
                    <div class="sales">${formatSales(product.sales)} vendas</div>
                </div>
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
    if (sales >= 1000) return (sales / 1000).toFixed(1) + 'k';
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

// Abrir modal do produto
function openProductModal(productId) {
    const product = currentProducts.find(p => p.itemId === productId) || FALLBACK_PRODUCTS[0];
    
    const modalContent = `
        <div class="modal-product">
            <div class="modal-image-container">
                <img src="${product.imageUrl || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}" alt="${product.productName}" class="modal-image" onerror="this.src='https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'">
            </div>
            <h2>${product.productName}</h2>
            <div class="modal-price">
                <span class="current-price">R$ ${parseFloat(product.priceMin).toFixed(2)}</span>
                ${product.priceMax > product.priceMin ? `<span class="original-price">R$ ${parseFloat(product.priceMax).toFixed(2)}</span><span class="discount">-${calculateDiscount(product.priceMin, product.priceMax)}%</span>` : ''}
            </div>
            <div class="modal-details">
                <p><strong>Loja:</strong> ${product.shopName}</p>
                <p><strong>Avaliação:</strong> ⭐ ${parseFloat(product.ratingStar || 4.5).toFixed(1)}</p>
                <p><strong>Vendas:</strong> ${formatSales(product.sales)}</p>
            </div>
            <div class="modal-actions">
                <a href="${product.offerLink || product.productLink}${SITE_CONFIG.AFFILIATE_TAG}" target="_blank" class="buy-button">🛒 Comprar na Shopee</a>
                <button onclick="closeModal()" class="close-button">✕ Fechar</button>
            </div>
        </div>
    `;
    
    document.getElementById('modalContent').innerHTML = modalContent;
    document.getElementById('productModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('productModal').style.display = 'none';
}

// Mostrar loading
function showLoading() {
    document.getElementById('productsGrid').innerHTML = `<div class="loading"><div>🔍 Buscando produtos...</div></div>`;
}

function showError(message) {
    console.error(message);
}

function showInfo(message) {
    console.log(message);
}

// --- NOVO SISTEMA DE CHAT HÍBRIDO ---

// Função principal que envia a mensagem
async function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    if (!message) return;

    addMessage(message, 'user');
    chatHistory.push({ role: "user", parts: [{ text: message }] });
    input.value = '';

    // 1. Tenta processar como um comando local primeiro
    const commandResponse = handleLocalCommand(message);

    if (commandResponse) {
        // Se foi um comando, mostra a resposta e para
        setTimeout(() => {
            addMessage(commandResponse, 'bot');
            chatHistory.push({ role: "model", parts: [{ text: commandResponse }] });
        }, 500);
    } else {
        // 2. Se não for um comando, chama a API do Gemini
        await getGeminiResponse(message);
    }
}

// Função que lida com comandos locais (filtros, etc.)
function handleLocalCommand(message) {
    const lowerMessage = message.toLowerCase();
    
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
    // Se não for nenhum comando, retorna nulo
    return null;
}

// Função que busca a resposta do Gemini através do backend
async function getGeminiResponse(message) {
    addMessage('Digitando...', 'bot typing'); // Mostra o indicador "Digitando..."

    try {
        const response = await fetch(`${SHOPEE_CONFIG.BACKEND_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: message,
                history: chatHistory.slice(-6) // Envia as últimas 6 interações como contexto
            })
        });

        if (!response.ok) throw new Error('Falha na resposta da API.');

        const data = await response.json();
        const geminiReply = data.reply;

        // Remove o "Digitando..." e adiciona a resposta final
        removeTypingIndicator();
        addMessage(geminiReply, 'bot');
        chatHistory.push({ role: "model", parts: [{ text: geminiReply }] });

    } catch (error) {
        console.error('Erro ao buscar resposta do Gemini:', error);
        removeTypingIndicator();
        addMessage('Desculpe, não consigo responder agora. Tente novamente.', 'bot error');
    }
}

// Funções de utilidade para o chat
function addMessage(text, type) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    // Adiciona um ID único para a mensagem "Digitando" para que possamos removê-la
    if (type.includes('typing')) {
        messageDiv.id = 'typing-indicator';
    }
    messageDiv.innerHTML = `<p>${text}</p>`;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function removeTypingIndicator() {
    const typingIndicator = document.getElementById('typing-indicator');
    if (typingIndicator) {
        typingIndicator.remove();
    }
}