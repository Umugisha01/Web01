// State management
let cart = [];
let services = [];
let products = [];
let currentUser = null;

// Constants
const API_URL = 'http://localhost:3000/api';
const CURRENCY = 'RWF';
const FREE_DELIVERY_THRESHOLD = 5000;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadServices();
    loadProducts();
    setupEventListeners();
    initializeCart();
    checkAuthStatus();
});

// Authentication functions
async function checkAuthStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
        try {
            const response = await fetch(`${API_URL}/auth/verify`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (response.ok) {
                currentUser = await response.json();
                updateUIForAuthenticatedUser();
            } else {
                localStorage.removeItem('authToken');
            }
        } catch (error) {
            console.error('Auth verification error:', error);
        }
    }
}

function updateUIForAuthenticatedUser() {
    const loginBtn = document.getElementById('loginBtn');
    loginBtn.textContent = 'My Account';
    loginBtn.onclick = showAccountModal;
}

async function login(email, password) {
    try {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('authToken', data.token);
            currentUser = data.user;
            updateUIForAuthenticatedUser();
            closeModal('loginModal');
            showNotification('Successfully logged in!');
        } else {
            throw new Error('Invalid credentials');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

async function register(userData) {
    try {
        const response = await fetch(`${API_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        
        if (response.ok) {
            showNotification('Registration successful! Please log in.');
            showLoginModal();
        } else {
            throw new Error('Registration failed');
        }
    } catch (error) {
        showNotification(error.message, 'error');
    }
}

// Service and Product Loading
async function loadServices() {
    try {
        const response = await fetch(`${API_URL}/services`);
        if (!response.ok) throw new Error('Failed to load services');
        services = await response.json();
        renderServices();
        populateServiceSelect();
    } catch (error) {
        console.error('Error loading services:', error);
        showNotification('Failed to load services', 'error');
    }
}

async function loadProducts() {
    try {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to load products');
        products = await response.json();
        renderProducts();
    } catch (error) {
        console.error('Error loading products:', error);
        showNotification('Failed to load products', 'error');
    }
}

// Rendering Functions
function renderServices() {
    const servicesGrid = document.querySelector('.services-grid');
    if (!servicesGrid) return;
    
    servicesGrid.innerHTML = services.map(service => `
        <div class="service-card">
            <img src="${service.image}" alt="${service.name}" onerror="this.src='default-service.jpg'">
            <div class="service-content">
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <p class="price">${CURRENCY} ${service.price.toLocaleString()}</p>
                <button onclick="bookService(${service.id})" class="book-btn">
                    Book Now
                </button>
            </div>
        </div>
    `).join('');
}

function renderProducts() {
    const productsGrid = document.querySelector('.products-grid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" onerror="this.src='default-product.jpg'">
            <div class="product-content">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p class="price">${CURRENCY} ${product.price.toLocaleString()}</p>
                <div class="product-actions">
                    <input type="number" min="1" max="99" value="1" id="qty-${product.id}">
                    <button onclick="addToCart(${product.id})" class="add-to-cart-btn">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function populateServiceSelect() {
    const serviceSelect = document.getElementById('serviceSelect');
    if (!serviceSelect) return;
    
    serviceSelect.innerHTML = `
        <option value="">Select a Service</option>
        ${services.map(service => `
            <option value="${service.id}">
                ${service.name} - ${CURRENCY} ${service.price.toLocaleString()}
            </option>
        `).join('')}
    `;
}

// Cart Functions
function initializeCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

function addToCart(productId) {
    const quantityInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(quantityInput?.value || 1);
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity
        });
    }
    
    saveCart();
    updateCartCount();
    showNotification('Product added to cart');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCart();
    showNotification('Product removed from cart');
}

function updateCartCount() {
    const cartCount = document.getElementById('cartCount');
    if (cartCount) {
        cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function calculateCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Booking Functions
async function bookService(serviceId) {
    if (!currentUser) {
        showNotification('Please log in to book a service', 'warning');
        showLoginModal();
        return;
    }
    
    const service = services.find(s => s.id === serviceId);
    if (service) {
        const serviceSelect = document.getElementById('serviceSelect');
        if (serviceSelect) {
            serviceSelect.value = serviceId;
            document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
        }
    }
}

async function submitBooking(bookingData) {
    try {
        const response = await fetch(`${API_URL}/bookings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify(bookingData)
        });
        
        if (!response.ok) throw new Error('Booking failed');
        
        const booking = await response.json();
        showNotification('Booking confirmed! Check your email for details.');
        return booking;
    } catch (error) {
        console.error('Booking error:', error);
        showNotification('Failed to create booking', 'error');
        throw error;
    }
}

// UI Helper Functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Login Modal
    document.getElementById('loginBtn')?.addEventListener('click', () => {
        if (!currentUser) showModal('loginModal');
        else showModal('accountModal');
    });
    
    // Cart Modal
    document.getElementById('cartBtn')?.addEventListener('click', () => {
        renderCart();
        showModal('cartModal');
    });
    
    // Booking Form
    document.getElementById('bookingForm')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (!currentUser) {
            showNotification('Please log in to book a service', 'warning');
            showLoginModal();
            return;
        }
        
        const formData = new FormData(e.target);
        const bookingData = {
            serviceId: formData.get('service'),
            date: formData.get('date'),
            time: formData.get('time'),
            notes: formData.get('notes')
        };
        
        try {
            await submitBooking(bookingData);
            e.target.reset();
        } catch (error) {
            console.error('Booking submission error:', error);
        }
    });
    
    // Close modal buttons
    document.querySelectorAll('.modal-close').forEach(button => {
        button.addEventListener('click', () => {
            const modal = button.closest('.modal');
            if (modal) closeModal(modal.id);
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            closeModal(e.target.id);
        }
    });
}

// Checkout Process
async function processCheckout() {
    if (!currentUser) {
        showNotification('Please log in to complete your purchase', 'warning');
        showLoginModal();
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
                items: cart,
                totalAmount: calculateCartTotal()
            })
        });
        
        if (!response.ok) throw new Error('Checkout failed');
        
        const order = await response.json();
        cart = [];
        saveCart();
        updateCartCount();
        closeModal('cartModal');
        showNotification('Order placed successfully! Check your email for details.');
        return order;
    } catch (error) {
        console.error('Checkout error:', error);
        showNotification('Failed to process checkout', 'error');
        throw error;
    }
}

// Cart Rendering
function renderCart() {
    const cartModal = document.getElementById('cartModal');
    if (!cartModal) return;
    
    const total = calculateCartTotal();
    const freeDelivery = total >= FREE_DELIVERY_THRESHOLD;
    
    cartModal.innerHTML = `
        <div class="modal-content">
            <h2>Your Cart</h2>
            <div class="cart-items">
                ${cart.length === 0 ? '<p>Your cart is empty</p>' : ''}
                ${cart.map(item => `
                    <div class="cart-item">
                        <span>${item.name}</span>
                        <span>${item.quantity} x ${CURRENCY} ${item.price.toLocaleString()}</span>
                        <button onclick="removeFromCart(${item.id})" class="remove-btn">
                            Remove
                        </button>
                    </div>
                `).join('')}
            </div>
            ${cart.length > 0 ? `
                <div class="cart-summary">
                    <p>Subtotal: ${CURRENCY} ${total.toLocaleString()}</p>
                    <p>Delivery: ${freeDelivery ? 'FREE' : `${CURRENCY} 1,000`}</p>
                    <p class="total">Total: ${CURRENCY} ${(total + (freeDelivery ? 0 : 1000)).toLocaleString()}</p>
                    <button onclick="processCheckout()" class="checkout-btn">
                        Proceed to Checkout
                    </button>
                </div>
            ` : ''}
            <button class="modal-close">Close</button>
        </div>
    `;
}