const products = [
    {
        id: 1,
        name: "Ardent Loading Screen",
        category: ["Standalone"],
        description: "A simple and modern loading screen with a built-in music player and info panels.",
        longDescription: `
            <p>This loading screen provides a clean and professional welcome for your server. It focuses on a smooth user experience without overwhelming your players with too many effects.</p>
            <p>It includes essential features like a music player, news updates, and a gallery. Everything is easy to set up and can be customized from a single file.</p>
        `,
        features: [
            "Video Background",
            "Music Player with Playlist",
            "Live News & Update Feed Panel",
            "Server Events Calendar",
            "Image Gallery",
            "Staff Team",
            "Dynamic Tips System",
            "Fully Configurable (config.js)"
        ],
        image: "https://images.guns.lol/e7d2c74909113866fff54169156ad21fd9732a78/z06Myi.png",
        video: "0QSdxoH6254",
        price: "$10.00",
        originalPrice: "$10.00",
        discount: false,
        tebexLink: "https://ardentdev.tebex.io/package/7287293"
    }
];


let currentCategory = 'all';

// Helper function to calculate discount percentage
function calculateDiscount(currentPrice, originalPrice) {
    if (!originalPrice || !currentPrice) return null;
    const current = parseFloat(currentPrice.replace(/[^0-9.-]+/g, ""));
    const original = parseFloat(originalPrice.replace(/[^0-9.-]+/g, ""));
    if (isNaN(current) || isNaN(original) || original <= 0) return null;
    const discount = ((original - current) / original) * 100;
    return Math.round(discount);
}

// Notification spam protection
let notificationHistory = [];
const NOTIFICATION_SPAM_LIMIT = 5; // Maximum notifications in time window
const NOTIFICATION_SPAM_WINDOW = 2000; // Time window in milliseconds (2 seconds)

function switchTab(tabName) {
    // Early return if trying to switch to the currently active tab
    const targetTabId = tabName === 'product-details' ? 'product-details-tab' : `${tabName}-tab`;
    const targetTab = document.getElementById(targetTabId);

    if (targetTab && targetTab.classList.contains('active')) {
        return; // Already on this tab
    }

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
        // Hide with delay for fade effect handling if needed, but for now simple class toggle
        // To ensure product details are hidden when switching main tabs
        if (tabName !== 'product-details' && tab.id === 'product-details-tab') {
            // Ensure detail tab is hidden
        }
    });

    const selectedTab = document.getElementById(tabName === 'product-details' ? 'product-details-tab' : `${tabName}-tab`);
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
    updateNavSlider();

    // Product details tab body scroll engelle
    if (tabName === 'product-details') {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabName === 'products') {
        filterProducts();
        setupScrollAnimations();
        setupFilterButtons();
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();
    // Initialize products if on products tab (or default)
    // For now we just initialize listeners

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

    // Initial display
    displayProducts();
    setupFilterButtons();

    // Initialize nav slider
    requestAnimationFrame(() => updateNavSlider());

    // Recalculate sliders on window resize
    window.addEventListener('resize', () => {
        updateCategorySlider();
        updateNavSlider();
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

    document.querySelectorAll('.animate-on-scroll, .section-title, .docs-content').forEach(el => {
        observer.observe(el);
    });
}

function displayProducts(filteredProducts = products) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';

    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div class="no-products-message">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your search or category filter.</p>
            </div>
        `;
        return;
    }

    filteredProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card animate-on-scroll'; // Added animation class
        productCard.style.animationDelay = `${index * 0.1}s`;

        // Add click event to view product details
        productCard.addEventListener('click', () => viewProduct(product.id));

        const discount = calculateDiscount(product.price, product.originalPrice);

        productCard.innerHTML = `
            <div class="product-card-inner">
                <div class="product-image-section">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/1f2937/6366f1?text=${encodeURIComponent(product.name)}'">
                    <div class="product-overlay">
                    </div>
                </div>
                
                <div class="product-info-section">
                    <div class="product-title-wrapper">
                        <h3 class="product-title">${product.name}</h3>
                        ${product.category.includes('Standalone') ? `<span class="category-badge">Standalone</span>` : product.category.map(c => `<span class="category-badge">${c}</span>`).join('')}
                    </div>
                    <p class="product-text">${product.description}</p>
                    <div class="product-footer">
                         <div class="price-container">
                             ${product.discount && product.originalPrice ? `<span class="original-price">${product.originalPrice}</span>` : ''}
                             <span class="product-price">${product.price}</span>
                             ${product.discount && discount ? `<span class="discount-badge">-%${discount}</span>` : ''}
                         </div>
                    </div>
                </div>
            </div>
        `;

        productsGrid.appendChild(productCard);
    });
}

function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Populate Video
    document.getElementById('detailVideo').src = `https://www.youtube.com/embed/${product.video}?rel=0&modestbranding=1`;
    document.getElementById('detailTitle').textContent = product.name;
    const detailCategoryEl = document.getElementById('detailCategory');
    detailCategoryEl.innerHTML = product.category.includes('Standalone') ? `<span class="category-badge">Standalone</span>` : product.category.map(c => `<span class="category-badge">${c}</span>`).join('');
    document.getElementById('detailShortDesc').textContent = product.description;

    // Populate Long Description (HTML supported)
    const longDescContainer = document.getElementById('detailLongDesc');
    longDescContainer.innerHTML = product.longDescription;

    // Populate Features
    const featuresList = document.getElementById('detailFeatures');
    featuresList.innerHTML = '';
    product.features.forEach(feature => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${feature}`;
        featuresList.appendChild(li);
    });

    const discount = calculateDiscount(product.price, product.originalPrice);

    document.getElementById('detailPrice').innerHTML = `
        <div class="price-container">
            ${product.discount && product.originalPrice ? `<span class="original-price" style="font-size: 1.5rem;">${product.originalPrice}</span>` : ''}
            <span>${product.price}</span>
            ${product.discount && discount ? `<span class="discount-badge" style="font-size: 1rem; padding: 0.3rem 0.8rem;">-%${discount}</span>` : ''}
        </div>
    `;
    document.getElementById('detailBuyBtn').href = product.tebexLink;

    // Switch View
    // Hide all other tabs
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    // Show details tab
    const detailsTab = document.getElementById('product-details-tab');
    detailsTab.classList.add('active');

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function backToProducts() {
    switchTab('products');
}

function setupFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.removeEventListener('click', handleFilterClick);
        btn.addEventListener('click', handleFilterClick);
    });
    updateCategoryCounts();
    requestAnimationFrame(() => updateCategorySlider());
}

function updateNavSlider() {
    const activeTab = document.querySelector('.nav-tab.active');
    const slider = document.querySelector('.nav-slider');
    if (!activeTab || !slider) return;

    const nav = document.querySelector('.nav');
    const navRect = nav.getBoundingClientRect();
    const tabRect = activeTab.getBoundingClientRect();

    slider.style.width = tabRect.width + 'px';
    slider.style.left = (tabRect.left - navRect.left) + 'px';
}

function handleFilterClick(e) {
    const targetBtn = e.target.closest('.filter-btn');
    if (!targetBtn || targetBtn.classList.contains('active')) {
        return; // Already on this category or didn't click a button
    }

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    targetBtn.classList.add('active');
    currentCategory = targetBtn.dataset.category;
    updateCategorySlider();
    filterProducts();
}

function updateCategorySlider() {
    const activeBtn = document.querySelector('.filter-btn.active');
    const slider = document.querySelector('.category-slider');
    if (!activeBtn || !slider) return;

    const container = document.querySelector('.category-filter');
    const containerRect = container.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    slider.style.width = btnRect.width + 'px';
    slider.style.left = (btnRect.left - containerRect.left) + 'px';
}

function updateCategoryCounts() {
    const categories = ['all', 'QBCore', 'Qbox', 'ESX'];
    categories.forEach(cat => {
        const el = document.getElementById('count-' + cat);
        if (el) {
            if (cat === 'all') {
                el.textContent = products.length;
            } else {
                el.textContent = products.filter(p => p.category.includes(cat) || p.category.includes('Standalone')).length;
            }
        }
    });
}

function filterProducts() {
    let filtered = products;

    if (currentCategory !== 'all') {
        filtered = filtered.filter(p => p.category.includes(currentCategory) || p.category.includes('Standalone'));
    }

    displayProducts(filtered);
}




function showNotification(message, type = 'success') {
    // Spam protection - Check if too many notifications in short time
    const now = Date.now();
    notificationHistory = notificationHistory.filter(timestamp => now - timestamp < NOTIFICATION_SPAM_WINDOW);

    if (notificationHistory.length >= NOTIFICATION_SPAM_LIMIT) {
        return; // Block notification to prevent spam
    }

    notificationHistory.push(now);

    // Container'ı oluştur veya mevcut olanı kullan
    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    // Bildirim elemanı oluştur
    const notification = document.createElement('div');
    notification.className = `notification ${type} `;

    // İkon belirle
    let icon;
    let title;
    switch (type) {
        case 'error':
            icon = '<i class="fas fa-exclamation-circle"></i>';
            title = 'Error';
            break;
        case 'info':
            icon = '<i class="fas fa-info-circle"></i>';
            title = 'Info';
            break;
        default:
            icon = '<i class="fas fa-check-circle"></i>';
            title = 'Success';
    }

    // Bildirim içeriği
    notification.innerHTML = `
        <div class="notification-icon">${icon}</div>
        <div class="notification-content">
            <div class="notification-title">${title}</div>
            <div class="notification-message">${message}</div>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
        <div class="notification-progress"></div>
    `;

    // Container'a ekle (biraz gecikme ile animasyon için)
    container.appendChild(notification);

    // Force reflow for animation
    notification.offsetHeight;

    // Close butonu
    const closeBtn = notification.querySelector('.notification-close');
    const progressBar = notification.querySelector('.notification-progress');
    const iconElement = notification.querySelector('.notification-icon');

    // Otomatik kapatma (3.5 saniye)
    let autoClose = setTimeout(() => {
        removeNotification(notification);
    }, 3500);

    // Close butonu tıklama
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(autoClose);
        removeNotification(notification);
    });

    // Tıklanınca kapat (close butonu hariç) + ripple efekti
    notification.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-close')) {
            // Ripple efekti
            const ripple = document.createElement('div');
            ripple.style.cssText = `
position: absolute;
border - radius: 50 %;
background: rgba(255, 255, 255, 0.3);
width: 20px;
height: 20px;
left: ${e.offsetX} px;
top: ${e.offsetY} px;
transform: translate(-50 %, -50 %) scale(0);
animation: ripple 0.6s ease - out;
pointer - events: none;
`;
            notification.style.position = 'relative';
            notification.appendChild(ripple);

            setTimeout(() => ripple.remove(), 600);

            clearTimeout(autoClose);
            setTimeout(() => removeNotification(notification), 200);
        }
    });

    // Hover durumunda otomatik kapanmayı durdur
    let hoverTimeout;
    notification.addEventListener('mouseenter', () => {
        clearTimeout(autoClose);
        if (progressBar) {
            progressBar.style.animationPlayState = 'paused';
        }
    });

    notification.addEventListener('mouseleave', () => {
        if (progressBar && progressBar.style.animationPlayState === 'paused') {
            const remainingTime = (progressBar.offsetWidth / notification.offsetWidth) * 3500;
            progressBar.style.animation = 'none';
            progressBar.offsetHeight; // Force reflow
            progressBar.style.animation = `notificationProgress ${remainingTime}ms linear forwards`;
        }

        clearTimeout(autoClose);
        autoClose = setTimeout(() => {
            removeNotification(notification);
        }, Math.max(1000, (progressBar ? (progressBar.offsetWidth / notification.offsetWidth) * 3500 : 3000)));
    });
}

function removeNotification(notification) {
    if (!notification || !notification.parentNode) return;

    notification.classList.add('hiding');

    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }

        // Container boşsa kaldır
        const container = document.querySelector('.notification-container');
        if (container && container.children.length === 0) {
            container.remove();
        }
    }, 400);
}

document.querySelectorAll('.footer-section a[data-tab]').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const tabName = link.dataset.tab;
        switchTab(tabName);
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const text = "ArdentDev";

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

// =============================================
// GitBook-Style Documentation System
// =============================================

const docsData = [
    {
        group: 'Getting Started',
        icon: 'fas fa-bolt',
        pages: [
            {
                id: 'introduction',
                title: 'Introduction',
                content: `
                    <h1 class="docs-title">Introduction</h1>
                    <p class="docs-text">Welcome to the official <strong>ArdentDev</strong> documentation. This comprehensive guide will help you install, configure, and manage all our premium FiveM resources efficiently.</p>
                    <div class="docs-alert docs-alert-info"><i class="fas fa-info-circle"></i><div><strong>Note:</strong> All resources require a minimum server artifact version of <code>5848</code> or higher.</div></div>
                    <h2 class="docs-subtitle">What We Offer</h2>
                    <p class="docs-text">ArdentDev provides premium, optimized scripts for QBCore, Qbox, ESX, and Standalone frameworks. All our scripts come with encryption, regular updates, and full Discord support.</p>
                `
            },
            {
                id: 'installation',
                title: 'Installation',
                content: `
                    <h1 class="docs-title">Installation Guide</h1>
                    <p class="docs-text">Follow these steps to install any ArdentDev resource on your server.</p>
                    <ol class="docs-list">
                        <li>Download the resource from your Keymaster or Tebex account.</li>
                        <li>Extract the folder into your server's <code>resources/[ardent]</code> directory.</li>
                        <li>Configure the script's <code>config.lua</code> file.</li>
                        <li>Add the resource to your <code>server.cfg</code>.</li>
                        <li>Restart your FiveM server.</li>
                    </ol>
                    <div class="code-block-wrapper"><div class="code-header"><span>server.cfg</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-cfg"># ArdentDev Premium Resources
ensure ardent-banking
ensure ardent-fishing
ensure ardent-tablet
ensure ardent-loadingscreen</code></pre></div>
                `
            },
            {
                id: 'configuration',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">General Configuration</h1>
                    <p class="docs-text">Almost all scripts provide a <code>config.lua</code>. Below is a standard template.</p>
                    <div class="docs-alert docs-alert-warning"><i class="fas fa-exclamation-triangle"></i><div><strong>Important:</strong> Never modify core logic files. It will void your warranty.</div></div>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">Config = {}

-- Framework: 'qbcore', 'qbox', 'esx', 'standalone'
Config.Framework = 'qbcore'

-- Database: 'oxmysql', 'ghmattimysql', 'mysql-async'
Config.Database = 'oxmysql'

-- Enable debug logging
Config.Debug = false

-- Locale settings
Config.Locale = 'en'</code></pre></div>
                `
            }
        ]
    },
    {
        group: 'Ardent Banking',
        icon: 'fas fa-landmark',
        pages: [
            {
                id: 'banking-overview',
                title: 'Overview',
                content: `
                    <h1 class="docs-title">Ardent Banking</h1>
                    <p class="docs-text">Ardent Banking is our flagship financial system with a modern UI, transaction history, societies, and more.</p>
                    <h2 class="docs-subtitle">Features</h2>
                    <ul class="docs-list"><li>Modern & Clean UI</li><li>Full Transaction History</li><li>Loan System with Interest</li><li>Shared Accounts for Societies</li><li>ATM Robbery Integration</li><li>Optimized 0.00ms idle</li></ul>
                `
            },
            {
                id: 'banking-config',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">Banking Configuration</h1>
                    <p class="docs-text">Configure your banking system by editing <code>config.lua</code> in the <code>ardent-banking</code> resource folder.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">Config = {}

Config.Framework = 'qbcore'
Config.Database = 'oxmysql'

-- Interest rate for loans (percentage)
Config.LoanInterest = 5.0

-- Maximum loan amount
Config.MaxLoan = 100000

-- Enable society accounts
Config.SocietyAccounts = true

-- ATM robbery enabled
Config.ATMRobbery = true
Config.ATMRobberyCooldown = 3600 -- seconds</code></pre></div>
                `
            },
            {
                id: 'banking-exports',
                title: 'Exports & Events',
                content: `
                    <h1 class="docs-title">Exports & Events</h1>
                    <p class="docs-text">Use these exports to interact with the banking system from other scripts.</p>
                    <h2 class="docs-subtitle">Server Exports</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>server.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- Get player balance
local balance = exports['ardent-banking']:GetBalance(source)

-- Add money to player's bank
exports['ardent-banking']:AddMoney(source, 5000)

-- Remove money from player's bank
exports['ardent-banking']:RemoveMoney(source, 2500)

-- Get transaction history
local history = exports['ardent-banking']:GetTransactions(source, 50)</code></pre></div>
                    <h2 class="docs-subtitle">Client Exports</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>client.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- Open the banking UI
exports['ardent-banking']:OpenUI()

-- Close the banking UI
exports['ardent-banking']:CloseUI()</code></pre></div>
                    <h2 class="docs-subtitle">Server Events</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>server.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- Listen for successful transactions
AddEventHandler('ardent-banking:transactionComplete', function(src, type, amount)
    print(('[Banking] Player %s: %s $%d'):format(src, type, amount))
end)</code></pre></div>
                `
            }
        ]
    },
    {
        group: 'Ardent Fishing',
        icon: 'fas fa-water',
        pages: [
            {
                id: 'fishing-overview',
                title: 'Overview',
                content: `
                    <h1 class="docs-title">Ardent Fishing</h1>
                    <p class="docs-text">A realistic fishing experience with multiple rod types, bait systems, and a fully interactive minigame.</p>
                    <h2 class="docs-subtitle">Features</h2>
                    <ul class="docs-list"><li>Multiple fishing rod types</li><li>Bait system with rarity</li><li>Interactive fishing minigame</li><li>Fish market/NPC selling</li><li>Leaderboard system</li><li>Optimized performance</li></ul>
                `
            },
            {
                id: 'fishing-config',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">Fishing Configuration</h1>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">Config = {}

Config.Framework = 'qbcore'

-- Fishing spots (coordinates)
Config.Spots = {
    { coords = vector3(-1850.5, -1248.3, 8.6), label = 'Del Perro Pier' },
    { coords = vector3(1299.8, 4216.7, 33.9), label = 'Sandy Shores Lake' },
}

-- Fish types & rarity
Config.Fish = {
    { name = 'bass', label = 'Bass', price = 25, rarity = 0.4 },
    { name = 'trout', label = 'Trout', price = 40, rarity = 0.3 },
    { name = 'salmon', label = 'Salmon', price = 65, rarity = 0.2 },
    { name = 'swordfish', label = 'Swordfish', price = 150, rarity = 0.1 },
}</code></pre></div>
                `
            }
        ]
    },
    {
        group: 'Ardent Tablet',
        icon: 'fas fa-mobile-alt',
        pages: [
            {
                id: 'tablet-overview',
                title: 'Overview',
                content: `
                    <h1 class="docs-title">Ardent Tablet</h1>
                    <p class="docs-text">A feature-rich tablet system for police MDT, EMS records, and citizen databases.</p>
                    <h2 class="docs-subtitle">Features</h2>
                    <ul class="docs-list"><li>Citizen & Vehicle Database</li><li>Warrants & BOLOs</li><li>Incident Reports</li><li>Evidence System</li><li>EMS Medical Records</li><li>Dark/Light Mode</li></ul>
                `
            },
            {
                id: 'tablet-config',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">Tablet Configuration</h1>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">Config = {}

Config.Framework = 'qbcore'

-- Jobs that can access the tablet
Config.AllowedJobs = {
    'police', 'ambulance', 'bcso', 'sasp', 'doj'
}

-- Command to open tablet
Config.Command = 'tablet'

-- Keybind (FiveM registered key)
Config.Keybind = 'F6'</code></pre></div>
                `
            },
            {
                id: 'tablet-events',
                title: 'Events & API',
                content: `
                    <h1 class="docs-title">Tablet Events & API</h1>
                    <h2 class="docs-subtitle">NUI Callbacks</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>client.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- Open tablet programmatically
exports['ardent-tablet']:OpenTablet()

-- Close tablet
exports['ardent-tablet']:CloseTablet()

-- Check if tablet is open
local isOpen = exports['ardent-tablet']:IsOpen()</code></pre></div>
                    <h2 class="docs-subtitle">Server-Side</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>server.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- Search citizens
exports['ardent-tablet']:SearchCitizen(firstname, lastname)

-- Create warrant
exports['ardent-tablet']:CreateWarrant(targetId, reason, issuerId)</code></pre></div>
                `
            }
        ]
    },
    {
        group: 'Ardent Loading Screen',
        icon: 'fas fa-tv',
        pages: [
            {
                id: 'loading-overview',
                title: 'Overview',
                content: `
                    <h1 class="docs-title">Ardent Loading Screen</h1>
                    <p class="docs-text">A premium loading screen with video backgrounds, a built-in music player, server info, and staff showcase.</p>
                    <h2 class="docs-subtitle">Features</h2>
                    <ul class="docs-list"><li>Video Background Support</li><li>Music Player with Playlist</li><li>Server Information Display</li><li>Staff Team Showcase</li><li>Fully Configurable via JS</li><li>Easy Setup</li></ul>
                `
            },
            {
                id: 'loading-config',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">Loading Screen Configuration</h1>
                    <p class="docs-text">Edit <code>config.js</code> in the resource folder to customize your loading screen.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">const config = {
    serverName: "My Awesome Server",
    
    // Background video URL
    backgroundVideo: "https://cdn.example.com/bg.mp4",
    
    // Music playlist
    music: [
        { title: "Chill Vibes", src: "music/track1.mp3" },
        { title: "Night Drive", src: "music/track2.mp3" },
    ],
    
    // Staff members
    staff: [
        { name: "John", role: "Owner", avatar: "img/john.png" },
        { name: "Jane", role: "Developer", avatar: "img/jane.png" },
    ]
};</code></pre></div>
                `
            }
        ]
    }
];

let currentDocPage = 'introduction';

function initDocs() {
    buildDocsSidebar();
    loadDocPage('introduction');

    const searchInput = document.getElementById('docsSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            filterDocsSidebar(e.target.value.trim().toLowerCase());
        });
    }
}

function buildDocsSidebar(filter = '') {
    const container = document.getElementById('docsSidebarContent');
    if (!container) return;
    container.innerHTML = '';

    docsData.forEach(group => {
        const matchingPages = group.pages.filter(p =>
            !filter || p.title.toLowerCase().includes(filter) || group.group.toLowerCase().includes(filter)
        );
        if (matchingPages.length === 0) return;

        const groupEl = document.createElement('div');
        groupEl.className = 'sidebar-group';

        const isOpen = filter || matchingPages.some(p => p.id === currentDocPage);

        groupEl.innerHTML = `
            <div class="sidebar-group-header ${isOpen ? 'open' : ''}" onclick="toggleSidebarGroup(this)">
                <span><i class="${group.icon}"></i> ${group.group}</span>
                <i class="fas fa-chevron-right sidebar-chevron"></i>
            </div>
            <ul class="sidebar-group-items ${isOpen ? 'open' : ''}">
                ${matchingPages.map(p => `
                    <li>
                        <a href="#" class="sidebar-page-link ${p.id === currentDocPage ? 'active' : ''}" data-page="${p.id}" onclick="event.preventDefault(); loadDocPage('${p.id}')">
                            ${p.title}
                        </a>
                    </li>
                `).join('')}
            </ul>
        `;
        container.appendChild(groupEl);
    });
}

function toggleSidebarGroup(headerEl) {
    headerEl.classList.toggle('open');
    const items = headerEl.nextElementSibling;
    items.classList.toggle('open');
}

function filterDocsSidebar(query) {
    buildDocsSidebar(query);
}

function loadDocPage(pageId) {
    currentDocPage = pageId;
    const mainContent = document.getElementById('docsMainContent');
    if (!mainContent) return;

    let page = null;
    for (const group of docsData) {
        page = group.pages.find(p => p.id === pageId);
        if (page) break;
    }

    if (!page) {
        mainContent.innerHTML = '<p class="docs-text">Page not found.</p>';
        return;
    }

    // Build flat page list for prev/next
    const allPages = [];
    docsData.forEach(g => g.pages.forEach(p => allPages.push({ ...p, group: g.group })));
    const currentIdx = allPages.findIndex(p => p.id === pageId);
    const currentGroup = allPages[currentIdx]?.group;
    const prevPage = currentIdx > 0 ? allPages[currentIdx - 1] : null;
    const nextPage = currentIdx < allPages.length - 1 ? allPages[currentIdx + 1] : null;

    const navHtml = `
        <div class="docs-page-nav">
            ${prevPage ? `<a href="#" class="docs-nav-btn docs-nav-prev" onclick="event.preventDefault(); loadDocPage('${prevPage.id}')">
                <span class="docs-nav-direction">← Previous</span>
                ${prevPage.group !== currentGroup ? `<span class="docs-nav-group">${prevPage.group}</span>` : ''}
                <span class="docs-nav-title">${prevPage.title}</span>
            </a>` : '<div></div>'}
            ${nextPage ? `<a href="#" class="docs-nav-btn docs-nav-next" onclick="event.preventDefault(); loadDocPage('${nextPage.id}')">
                <span class="docs-nav-direction">Next →</span>
                ${nextPage.group !== currentGroup ? `<span class="docs-nav-group">${nextPage.group}</span>` : ''}
                <span class="docs-nav-title">${nextPage.title}</span>
            </a>` : '<div></div>'}
        </div>
    `;

    mainContent.innerHTML = `<div class="docs-section-block">${page.content}</div>${navHtml}`;

    // Update active state in sidebar
    document.querySelectorAll('.sidebar-page-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });

    // Auto-open the group containing the active page
    buildDocsSidebar(document.getElementById('docsSearchInput')?.value?.trim()?.toLowerCase() || '');

    // Apply syntax highlighting
    applySyntaxHighlighting();

    // Scroll main content to top
    const docsTab = document.getElementById('docs-tab');
    if (docsTab) docsTab.scrollTop = 0;
}

// Lightweight Syntax Highlighter
function applySyntaxHighlighting() {
    document.querySelectorAll('#docsMainContent pre code').forEach(codeEl => {
        const lang = (codeEl.className.match(/language-(\w+)/) || [])[1] || '';
        const raw = codeEl.textContent;
        codeEl.innerHTML = highlightSyntax(raw, lang);
    });
}

function highlightSyntax(code, lang) {
    // Escape HTML first
    let escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    if (lang === 'lua') {
        // Comments
        escaped = escaped.replace(/(--.*)/g, '<span class="syn-comment">$1</span>');
        // Strings
        escaped = escaped.replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*")/g, '<span class="syn-string">$1</span>');
        // Keywords
        const luaKw = /\b(local|function|end|if|then|else|elseif|return|for|while|do|repeat|until|in|not|and|or|true|false|nil|break|goto)\b/g;
        escaped = escaped.replace(luaKw, '<span class="syn-keyword">$1</span>');
        // Numbers
        escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-number">$1</span>');
        // Config / global identifiers
        escaped = escaped.replace(/\b(Config)\b/g, '<span class="syn-global">$1</span>');
    } else if (lang === 'javascript' || lang === 'js') {
        // Comments
        escaped = escaped.replace(/(\/\/.*)/g, '<span class="syn-comment">$1</span>');
        // Strings
        escaped = escaped.replace(/('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)/g, '<span class="syn-string">$1</span>');
        // Keywords
        const jsKw = /\b(const|let|var|function|return|if|else|for|while|class|new|this|import|export|from|default|async|await|try|catch|throw|typeof|instanceof|true|false|null|undefined)\b/g;
        escaped = escaped.replace(jsKw, '<span class="syn-keyword">$1</span>');
        // Numbers
        escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-number">$1</span>');
    } else if (lang === 'cfg') {
        // Comments (lines starting with #)
        escaped = escaped.replace(/(#.*)/g, '<span class="syn-comment">$1</span>');
        // ensure keywords
        escaped = escaped.replace(/\b(ensure|start|stop|restart)\b/g, '<span class="syn-keyword">$1</span>');
    }

    return escaped;
}

function copyCode(btn) {
    const codeBlock = btn.closest('.code-block-wrapper').querySelector('code');
    const text = codeBlock.textContent;
    navigator.clipboard.writeText(text).then(() => {
        const icon = btn.querySelector('i');
        icon.className = 'fas fa-check';
        btn.style.color = '#4ade80';
        setTimeout(() => {
            icon.className = 'fas fa-copy';
            btn.style.color = '';
        }, 2000);
    });
}

// Initialize docs when switching to the docs tab
const origSwitchTab = switchTab;
switchTab = function (tabName) {
    origSwitchTab(tabName);
    if (tabName === 'docs') {
        initDocs();
    }
};

