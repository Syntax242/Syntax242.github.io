const products = [
    {
        id: 1,
        name: 'Roblox External',
        description: 'Fully Undetected Roblox External Tool.',
        category: 'Roblox',
        image: 'https://cdn.capware.fun/Qz7TBnz.png',
        plans: {
            lifetime: { price: 5.50, originalPrice: 9.99, discount: 45 }
        }
    },
    {
        id: 2,
        name: 'Fortnite External', 
        description: 'Undetected Fortnite External.',
        category: 'Fortnite',
        image: 'https://cdn.capware.fun/image.png',
        plans: {
            daily: { price: 3.99, originalPrice: 4.99, discount: 20 },
            weekly: { price: 9.99, originalPrice: 13.99, discount: 29 },
            monthly: { price: 19.99, originalPrice: 29.99, discount: 33 }
        }
    },
    {
        id: 3,
        name: 'Fortnite Internal',
        description: 'Advanced Fortnite Internal Tool.',
        category: 'Fortnite',
        image: 'https://i.ytimg.com/vi/3jrYALUpslI/hq720.jpg',
        plans: {
            daily: { price: 5.99, originalPrice: 7.99, discount: 25 },
            weekly: { price: 14.99, originalPrice: 19.99, discount: 25 },
            monthly: { price: 29.99, originalPrice: 44.99, discount: 33 }
        }
    },
    {
        id: 4,
        name: 'HWID Spoofer',
        description: 'Remove HWID Bans on EAC, BE, Vanguard.',
        category: 'Tools',
        image: '',
        plans: {
            daily: { price: 4.99, originalPrice: 7.99, discount: 38 },
            weekly: { price: 12.99, originalPrice: 19.99, discount: 35 },
            monthly: { price: 24.99, originalPrice: 39.99, discount: 38 }
        }
    },
    {
        id: 5,
        name: 'Valorant Colorbot',
        description: 'DMA Compatible Valorant Colorbot.',
        category: 'Valorant',
        image: '',
        plans: {
            daily: { price: 9.99, originalPrice: 14.99, discount: 33 },
            weekly: { price: 29.99, originalPrice: 44.99, discount: 33 },
            monthly: { price: 44.99, originalPrice: 69.99, discount: 36 }
        }
    },
    {
        id: 6,
        name: 'CS2 External',
        description: 'CapWare Undetected CS2 External.',
        category: 'CS2',
        image: '',
        plans: {
            free: { price: 0.00, originalPrice: 0.00, discount: 100 }
        }
    }
];

let cart = JSON.parse(localStorage.getItem('capware-cart')) || [];
let currentCategory = 'all';
let searchTerm = '';

function switchTab(tabName) {    
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    
    const selectedTab = document.getElementById(`${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    } 
    else {
        console.warn('Tab not found:', `${tabName}-tab`); // Debug
    }
    
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        }
    });
    
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    if (tabName === 'products') {
        displayProducts();
        setupScrollAnimations();
        setupFilterButtons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
    displayCart();
    setupScrollAnimations();
    
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(btn.dataset.tab);
        });
    });
    
    document.querySelectorAll('a[data-tab]').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            switchTab(link.dataset.tab);
        });
    });
});

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll, .section-title, .about-content').forEach(el => {
        observer.observe(el);
    });
}

function displayProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;
    
    productsGrid.innerHTML = '';

    filteredProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.style.animationDelay = `${index * 0.1}s`;
        
        const dailyPlan = product.plans.daily || { price: 0, originalPrice: 0, discount: 0 };
        const weeklyPlan = product.plans.weekly || { price: 0, originalPrice: 0, discount: 0 };
        const monthlyPlan = product.plans.monthly || { price: 0, originalPrice: 0, discount: 0 };
        const lifetimePlan = product.plans.lifetime || { price: 0, originalPrice: 0, discount: 0 };
        const freePlan = product.plans.free || { price: 0, originalPrice: 0, discount: 0 };
        
        productCard.innerHTML = `
            <div class="product-card-inner">
                <div class="product-image-section">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/1f2937/6366f1?text=${encodeURIComponent(product.name)}'">
                    <div class="product-overlay"></div>
                </div>
                
                <div class="product-info-section">
                    <div class="product-title-wrapper">
                        <h3 class="product-title">${product.name}</h3>
                        <span class="category-badge">${product.category}</span>
                    </div>
                    <p class="product-text">${product.description}</p>
                    
                    ${!product.plans.free && !product.plans.lifetime ? `<div class="pricing-tabs-wrapper">
                        ${product.plans.daily ? `<button class="pricing-tab active" data-plan="daily" onclick="return false"><span class="plan-name">Daily</span><span class="plan-cost">$${dailyPlan.price.toFixed(2)}</span></button>` : ''}
                        ${product.plans.weekly ? `<button class="pricing-tab" data-plan="weekly" onclick="return false"><span class="plan-name">Weekly</span><span class="plan-cost">$${weeklyPlan.price.toFixed(2)}</span></button>` : ''}
                        ${product.plans.monthly ? `<button class="pricing-tab" data-plan="monthly" onclick="return false"><span class="plan-name">Monthly</span><span class="plan-cost">$${monthlyPlan.price.toFixed(2)}</span></button>` : ''}
                    </div>` : ''}
                    ${product.plans.lifetime ? `<div class="pricing-tabs-wrapper">
                        <button class="pricing-tab active" data-plan="lifetime" onclick="return false"><span class="plan-name">Lifetime</span><span class="plan-cost">$${lifetimePlan.price.toFixed(2)}</span></button>
                    </div>` : ''}
                    
                    <div class="price-display-box">
                        <div class="price-left">
                            ${product.plans.lifetime ? `<div class="current-price" id="current-${product.id}">$${lifetimePlan.price.toFixed(2)}</div><div class="original-price" id="original-${product.id}" style="display:none">$${lifetimePlan.originalPrice.toFixed(2)}</div>` : ''}
                            ${product.plans.free ? `<div class="current-price" id="current-${product.id}">FREE</div><div class="original-price" id="original-${product.id}" style="display:none">$${freePlan.originalPrice.toFixed(2)}</div>` : ''}
                            ${!product.plans.lifetime && !product.plans.free ? `<div class="current-price" id="current-${product.id}">$${dailyPlan.price.toFixed(2)}</div><div class="original-price" id="original-${product.id}">$${dailyPlan.originalPrice.toFixed(2)}</div>` : ''}
                        </div>
                        <div class="savings-badge" id="savings-${product.id}" ${product.plans.lifetime ? 'style="display:none"' : ''}>${product.plans.lifetime ? lifetimePlan.discount : product.plans.free ? '100' : dailyPlan.discount}% OFF</div>
                    </div>
                    
                    <button class="add-to-cart-btn" data-plan="${product.plans.lifetime ? 'lifetime' : product.plans.free ? 'free' : 'daily'}" onclick="addToCart(${product.id}, '${product.plans.lifetime ? 'lifetime' : product.plans.free ? 'free' : 'daily'}')">
                        <i class="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                </div>
            </div>
        `;
        
        const tabs = productCard.querySelectorAll('.pricing-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const selectedPlan = tab.dataset.plan;
                const plan = product.plans[selectedPlan];
                
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                productCard.querySelector(`#current-${product.id}`).textContent = `$${plan.price.toFixed(2)}`;
                productCard.querySelector(`#original-${product.id}`).textContent = `$${plan.originalPrice.toFixed(2)}`;
                productCard.querySelector(`#savings-${product.id}`).textContent = `${plan.discount}% OFF`;
                
                const btn = productCard.querySelector('.add-to-cart-btn');
                btn.dataset.plan = selectedPlan;
                btn.onclick = () => addToCart(product.id, selectedPlan);
            });
        });
        
        productsGrid.appendChild(productCard);
    });
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.removeEventListener('click', handleFilterClick);
        btn.addEventListener('click', handleFilterClick);
    });
}

function handleFilterClick(e) {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    e.target.closest('.filter-btn').classList.add('active');
    currentCategory = e.target.closest('.filter-btn').dataset.category;
    filterProducts();
}

function filterProducts() {
    let filtered = products;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category === currentCategory);
    }

    if (searchTerm) {
        filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }

    displayProducts(filtered);
}

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchTerm = e.target.value;
                filterProducts();
            });
        }
    }, 100);
});

function addToCart(productId, plan = 'monthly') {
    const product = products.find(p => p.id === productId);
    const planData = product.plans[plan];
    
    const cartItem = {
        id: productId,
        name: product.name,
        category: product.category,
        plan: plan,
        price: planData.price,
        originalPrice: planData.originalPrice,
        discount: planData.discount,
        image: product.image,
        quantity: 1
    };
    
    const existingItem = cart.find(item => item.id === productId && item.plan === plan);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push(cartItem);
    }

    localStorage.setItem('capware-cart', JSON.stringify(cart));
    updateCartCount();
    displayCart();
    
    const planLabel = plan.charAt(0).toUpperCase() + plan.slice(1);
    showNotification(`${product.name} (${planLabel}) added to cart!`);
}

function displayCart() {
    const cartItems = document.getElementById('cartItems');
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>Your cart is empty</p>
            </div>
        `;
    } else {
        cartItems.innerHTML = cart.map((item, index) => `
            <div class="cart-item">
                <img src="${item.image || ''}" alt="${item.name}" class="cart-item-image" onerror="this.src='https://via.placeholder.com/80x80/6366f1/ffffff?text=Product'">
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-plan">${item.plan ? item.plan.charAt(0).toUpperCase() + item.plan.slice(1) : 'Standard'}</div>
                    <div class="cart-item-price">$${item.price.toFixed(2)}</div>
                    <div class="cart-item-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${index}, -1)">-</button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${index}, 1)">+</button>
                        <button class="remove-item" onclick="removeFromCart(${index})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    updateCartTotal();
}

function updateQuantity(index, change) {
    if (cart[index]) {
        if (change < 0 && cart[index].quantity <= 1) {
            return;
        }
        cart[index].quantity += change;
        localStorage.setItem('capware-cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    localStorage.setItem('capware-cart', JSON.stringify(cart));
    displayCart();
    updateCartCount();
}

function updateCartTotal() {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const cartTotalEl = document.getElementById('cartTotal');
    if (cartTotalEl) {
        cartTotalEl.textContent = `$${total.toFixed(2)}`;
    }
}

function updateCartCount() {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = count;
        if (count === 0) {
            cartCountEl.style.display = 'none';
        } else {
            cartCountEl.style.display = 'flex';
        }
    }
}

function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('cartOverlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Checkout page coming soon!\n\nTotal: $${total.toFixed(2)}`, 'info');
}

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    const bgColor = type === 'error' ? '#ef4444' : type === 'info' ? '#6366f1' : '#10b981';
    
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${bgColor};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        z-index: 3000;
        animation: slideIn 0.3s ease;
        max-width: 350px;
        font-weight: 500;
        white-space: pre-line;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

document.querySelectorAll('.footer-section a[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.dataset.tab;
        switchTab(tabName);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const text = "CapWare";

    const SPEED = {
        type: [90, 140],
        delete: [60, 90],
        holdAfterType: 4200,
        holdAfterDelete: 800
    };

    const el = document.getElementById("typewriter");
    if (!el) return;

    const cursor = document.createElement("span");
    cursor.className = "type-cursor";
    cursor.textContent = "|";
    el.after(cursor);

    let index = 0;
    let mode = "type";

    const rand = ([min, max]) =>
        Math.floor(Math.random() * (max - min + 1)) + min;

    function loop() {
        if (mode === "type") {
            el.textContent = text.slice(0, ++index);

            if (index === text.length) {
                mode = "holdType";
                return setTimeout(loop, SPEED.holdAfterType);
            }
        }

        else if (mode === "delete") {
            el.textContent = text.slice(0, --index);

            if (index === 0) {
                mode = "holdDelete";
                return setTimeout(loop, SPEED.holdAfterDelete);
            }
        }

        else if (mode === "holdType") {
            mode = "delete";
        }

        else if (mode === "holdDelete") {
            mode = "type";
        }

        setTimeout(loop, mode === "delete" ? rand(SPEED.delete) : rand(SPEED.type));
    }

    loop();
});