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
    },
    {
        id: 2,
        name: "Ardent Street Names",
        category: ["Free", "Standalone"],
        description: "Displays the current street name and zone. Fully configurable, and works with any framework.",
        longDescription: `
            <p><strong>Ardent Street Names</strong> is a clean and lightweight resource that shows the player's current street name and zone in real time.</p>
            <p>It is fully standalone, no framework required and can be easily customised through the <code>config.lua</code> file.</p>
        `,
        features: [
            "Real-time street & zone display",
            "Fully Standalone (no framework needed)",
            "Configurable via config.lua",
            "Optimized 0.00ms",
            "Clean & modern design styles",
            "Easy installation"
        ],
        image: "https://images.guns.lol/e7d2c74909113866fff54169156ad21fd9732a78/S4RIjn.png",
        video: "r5dcQPOyKKQ",
        price: "FREE",
        originalPrice: "FREE",
        discount: false,
        tebexLink: "https://github.com/ArdentDevelopment/adt-streetnames"
    },
    {
        id: 3,
        name: "Ardent Notify",
        category: ["Free", "Standalone"],
        description: "A modern notification system with 4 types, custom positioning, and clean animations.",
        longDescription: `
            <p><strong>Ardent Notify</strong> is a basic clean notification for FiveM.</p>
            <p>Supports 4 notification types (success, error, warning, info), 8 screen positions, customizable titles, and adjustable duration. Easily integrable via client exports and server events.</p>
        `,
        features: [
            "4 Notification Types (Success, Error, Warning, Info)",
            "8 Screen Position Options",
            "Custom Sound Effects",
            "Clean Animations",
            "Configurable Titles via config.lua",
            "Client Export & Server Event Support",
            "Adjustable Duration",
            "Fully Standalone (no framework needed)",
            "Optimized 0.00ms",
            "Easy Installation"
        ],
        image: "https://images.guns.lol/e7d2c74909113866fff54169156ad21fd9732a78/WKN25g.png",
        video: "r5dcQPOyKKQ",
        price: "FREE",
        originalPrice: "FREE",
        discount: false,
        tebexLink: "https://github.com/ArdentDevelopment/adt-notify"
    }
];

function slugify(text) {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function getPathForTab(tabName, product) {
    if (tabName === 'home') return '/';
    if (tabName === 'products') return '/products';
    if (tabName === 'docs') return '/docs';
    if (tabName === 'product-details' && product) return '/products/' + slugify(product.name);
    return '/';
}

function navigateTo(path, replace) {
    if (replace) {
        history.replaceState({ path: path }, '', path);
    } else {
        history.pushState({ path: path }, '', path);
    }
    handleRoute();
}

function handleRoute() {
    const path = window.location.pathname;

    if (path === '/' || path === '') {
        switchTab('home', true);
    } else if (path === '/products') {
        switchTab('products', true);
    } else if (path === '/docs') {
        switchTab('docs', true);
    } else if (path.startsWith('/products/')) {
        const slug = path.replace('/products/', '');
        const product = products.find(p => slugify(p.name) === slug);
        if (product) {
            viewProduct(product.id, true);
        } else {
            switchTab('products', true);
        }
    } else {
        switchTab('home', true);
    }
}

let currentCategory = 'all';

function calculateDiscount(currentPrice, originalPrice) {
    if (!originalPrice || !currentPrice) return null;
    const current = parseFloat(currentPrice.replace(/[^0-9.-]+/g, ""));
    const original = parseFloat(originalPrice.replace(/[^0-9.-]+/g, ""));
    if (isNaN(current) || isNaN(original) || original <= 0) return null;
    const discount = ((original - current) / original) * 100;
    return Math.round(discount);
}

let notificationHistory = [];
const NOTIFICATION_SPAM_LIMIT = 5;
const NOTIFICATION_SPAM_WINDOW = 2000;

function switchTab(tabName, skipPush) {
    const targetTabId = tabName === 'product-details' ? 'product-details-tab' : `${tabName}-tab`;
    const targetTab = document.getElementById(targetTabId);

    if (targetTab && targetTab.classList.contains('active')) {
        return;
    }

    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    const selectedTab = document.getElementById(tabName === 'product-details' ? 'product-details-tab' : `${tabName}-tab`);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }
    else {
        console.warn('Tab not found:', `${tabName}-tab`);
    }

    const navTabName = tabName === 'product-details' ? 'products' : tabName;
    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === navTabName) {
            btn.classList.add('active');
        }
    });
    updateNavSlider();

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

    if (!skipPush) {
        const path = getPathForTab(tabName);
        history.pushState({ path: path }, '', path);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    setupScrollAnimations();

    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const tab = btn.dataset.tab;
            const path = getPathForTab(tab);
            navigateTo(path);
        });
    });

    displayProducts();
    setupFilterButtons();

    requestAnimationFrame(() => updateNavSlider());

    window.addEventListener('resize', () => {
        updateCategorySlider();
        updateNavSlider();
    });

    window.addEventListener('popstate', () => {
        handleRoute();
    });

    handleRoute();
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
        productCard.className = 'product-card animate-on-scroll';
        productCard.style.animationDelay = `${index * 0.1}s`;

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
                        <div class="badge-wrapper">
                            ${product.category.includes('Free') ? `<span class="category-badge free-badge">Free</span>` : ''}
                            ${product.category.includes('Standalone') && !product.category.includes('Free') ? `<span class="category-badge">Standalone</span>` : ''}
                            ${!product.category.includes('Standalone') && !product.category.includes('Free') ? product.category.map(c => `<span class="category-badge">${c}</span>`).join('') : ''}
                        </div>
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

function viewProduct(productId, skipPush) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    document.getElementById('detailVideo').src = `https://www.youtube.com/embed/${product.video}?rel=0`;
    document.getElementById('detailTitle').textContent = product.name;
    const detailCategoryEl = document.getElementById('detailCategory');
    detailCategoryEl.innerHTML = [
        product.category.includes('Free') ? `<span class="category-badge free-badge">Free</span>` : '',
        product.category.includes('Standalone') ? `<span class="category-badge">Standalone</span>` : '',
        ...product.category.filter(c => c !== 'Free' && c !== 'Standalone').map(c => `<span class="category-badge">${c}</span>`)
    ].join('');
    document.getElementById('detailShortDesc').textContent = product.description;

    const longDescContainer = document.getElementById('detailLongDesc');
    longDescContainer.innerHTML = product.longDescription;

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
    const buyBtn = document.getElementById('detailBuyBtn');
    buyBtn.href = product.tebexLink;
    if (product.category.includes('Free')) {
        buyBtn.innerHTML = 'Get for Free <i class="fas fa-arrow-right"></i>';
        buyBtn.style.background = '';
    } else {
        buyBtn.innerHTML = 'Visit Tebex <i class="fas fa-arrow-right"></i>';
        buyBtn.style.background = '';
    }

    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));

    const detailsTab = document.getElementById('product-details-tab');
    detailsTab.classList.add('active');

    document.querySelectorAll('.nav-tab').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.tab === 'products') btn.classList.add('active');
    });
    updateNavSlider();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (!skipPush) {
        const path = getPathForTab('product-details', product);
        history.pushState({ path: path }, '', path);
    }
}

function backToProducts() {
    navigateTo('/products');
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
        return;
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
    const categories = ['all', 'QBCore', 'Qbox', 'ESX', 'Free'];
    categories.forEach(cat => {
        const el = document.getElementById('count-' + cat);
        if (el) {
            if (cat === 'all') {
                el.textContent = products.length;
            } else if (cat === 'Free') {
                el.textContent = products.filter(p => p.category.includes('Free')).length;
            } else {
                el.textContent = products.filter(p => p.category.includes(cat) || p.category.includes('Standalone')).length;
            }
        }
    });
}

function filterProducts() {
    let filtered = products;

    if (currentCategory !== 'all') {
        if (currentCategory === 'Free') {
            filtered = filtered.filter(p => p.category.includes('Free'));
        } else {
            filtered = filtered.filter(p => p.category.includes(currentCategory) || p.category.includes('Standalone'));
        }
    }

    displayProducts(filtered);
}




function showNotification(message, type = 'success') {
    const now = Date.now();
    notificationHistory = notificationHistory.filter(timestamp => now - timestamp < NOTIFICATION_SPAM_WINDOW);

    if (notificationHistory.length >= NOTIFICATION_SPAM_LIMIT) {
        return;
    }

    notificationHistory.push(now);

    let container = document.querySelector('.notification-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
    }

    const notification = document.createElement('div');
    notification.className = `notification ${type} `;

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

    container.appendChild(notification);

    notification.offsetHeight;

    const closeBtn = notification.querySelector('.notification-close');
    const progressBar = notification.querySelector('.notification-progress');
    const iconElement = notification.querySelector('.notification-icon');

    let autoClose = setTimeout(() => {
        removeNotification(notification);
    }, 3500);

    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        clearTimeout(autoClose);
        removeNotification(notification);
    });

    notification.addEventListener('click', (e) => {
        if (!e.target.closest('.notification-close')) {
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
            progressBar.offsetHeight;
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
        const path = getPathForTab(tabName);
        navigateTo(path);
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
                    <p class="docs-text">Welcome to the official <strong>ArdentDev</strong> documentation. This comprehensive guide will help you install, configure, and manage all our FiveM resources efficiently.</p>
                    <div class="docs-alert docs-alert-info"><i class="fas fa-info-circle"></i><div><strong>Note:</strong> All resources require a minimum server artifact version of <code>5848</code> or higher.</div></div>
                    <h2 class="docs-subtitle">What We Offer</h2>
                    <p class="docs-text">ArdentDev provides high quality, optimized scripts for QBCore, Qbox, ESX, and Standalone frameworks. All our scripts come with regular updates and full Discord support.</p>
                    <h2 class="docs-subtitle">Our Resources</h2>
                    <ul class="docs-list">
                        <li><strong>Ardent Loading Screen</strong> — A modern loading screen with music player, news, events, gallery, and staff showcase.</li>
                        <li><strong>Ardent Notification</strong> — A sleek notification system with 4 types, custom positioning, and sound effects.</li>
                        <li><strong>Ardent Street Names</strong> — Displays the current street name and zone with 4 unique themes.</li>
                    </ul>
                `
            },
            {
                id: 'installation',
                title: 'Installation',
                content: `
                    <h1 class="docs-title">Installation Guide</h1>
                    <p class="docs-text">Follow these steps to install any ArdentDev resource on your server.</p>
                    <ol class="docs-list">
                        <li>Download the resource from your CFX Portal.</li>
                        <li>Extract the folder into your server's <code>resources</code> directory.</li>
                        <li>Configure the script's config file (<code>config.lua</code> or <code>config.js</code>).</li>
                        <li>Add the resource to your <code>server.cfg</code>.</li>
                        <li>Restart your FiveM server.</li>
                    </ol>
                    <div class="docs-alert docs-alert-warning"><i class="fas fa-exclamation-triangle"></i><div><strong>Important:</strong> Do not rename any resource folder. Our scripts have name checks and will not work if renamed.</div></div>
                    <div class="code-block-wrapper"><div class="code-header"><span>server.cfg</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-cfg"># ArdentDev Resources
ensure adt-loading
ensure adt-notify
ensure adt-streetnames</code></pre></div>
                `
            },
            {
                id: 'configuration',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">General Configuration</h1>
                    <p class="docs-text">Each script provides its own config file. Lua-based scripts use <code>config.lua</code>, while UI-heavy scripts like the loading screen use <code>config.js</code>.</p>
                    <div class="docs-alert docs-alert-warning"><i class="fas fa-exclamation-triangle"></i><div><strong>Important:</strong> Only edit config files. Modifying core logic files may break the script and void your support.</div></div>
                    <h2 class="docs-subtitle">Config File Locations</h2>
                    <ul class="docs-list">
                        <li><code>adt-loading/config.js</code> — Loading Screen configuration</li>
                        <li><code>adt-notify/config.lua</code> — Notification System configuration</li>
                        <li><code>adt-streetnames/config.lua</code> — Street Names configuration</li>
                    </ul>
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
                    <p class="docs-text">A premium loading screen with video backgrounds, a built-in music player, server info panels, and staff showcase.</p>
                    <h2 class="docs-subtitle">Features</h2>
                    <ul class="docs-list">
                        <li>Video Background Support (WebM)</li>
                        <li>Built-in Music Player with Album Art</li>
                        <li>News & Announcements Panel</li>
                        <li>Events Calendar Panel</li>
                        <li>Screenshot Gallery</li>
                        <li>Staff Team Showcase with Custom Colors</li>
                        <li>Rotating Tips System</li>
                        <li>Social Media Links (Discord, Website)</li>
                        <li>Fully Configurable via <code>config.js</code></li>
                        <li>Easy Setup — No Framework Required</li>
                    </ul>
                    <div class="docs-alert docs-alert-info"><i class="fas fa-info-circle"></i><div><strong>Note:</strong> This script uses FiveM's <code>loadscreen</code> system and works with any framework (Standalone).</div></div>
                `
            },
            {
                id: 'loading-config',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">Loading Screen Configuration</h1>
                    <p class="docs-text">Edit <code>config.js</code> in the resource folder to customize your loading screen.</p>

                    <h2 class="docs-subtitle">Server Settings</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">const Config = {
    ServerName: "Server Name",
    SubText: "Welcome to Server Name! Please read the rules before you join!",

    BackgroundVideo: "assets/bg.webm",
    VideoVolume: 0.0, // 0.0 to 1.0
};</code></pre></div>

                    <h2 class="docs-subtitle">Panel Headers</h2>
                    <p class="docs-text">Customize the tab names displayed on the loading screen panels.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">PanelHeaders: {
    News: "News",
    Events: "Events",
    Gallery: "Gallery",
    Staff: "Staff Team"
},</code></pre></div>

                    <h2 class="docs-subtitle">Music</h2>
                    <p class="docs-text">Add songs to the built-in music player. Place audio files in the <code>assets/</code> folder.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">Music: [
    {
        title: "Song Name",
        artist: "Artist Name",
        file: "assets/song.mp3",
        logo: "assets/song-cover.png"
    }
],</code></pre></div>

                    <h2 class="docs-subtitle">News</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">News: [
    {
        label: "WELCOME",
        title: "Welcome to Server Name!",
        description: "Thank you for joining us. Please read the rules!",
        date: "21 February 2026"
    }
],</code></pre></div>

                    <h2 class="docs-subtitle">Events</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">Events: [
    {
        dateBlock: { day: "23", month: "FEB" },
        title: "Street Race",
        time: "21:30"
    }
],</code></pre></div>

                    <h2 class="docs-subtitle">Gallery</h2>
                    <p class="docs-text">Add screenshot paths to display in the gallery panel.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">Gallery: [
    "assets/resim1.png",
    "assets/resim2.png",
    "assets/resim3.png"
],</code></pre></div>

                    <h2 class="docs-subtitle">Tips</h2>
                    <p class="docs-text">Rotating tips displayed at the bottom of the loading screen.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">TipIntervalMs: 6000,
Tips: [
    "If you are getting low FPS, try the /fps command.",
    "You can read the rules on our Discord server."
],</code></pre></div>

                    <h2 class="docs-subtitle">Staff Team</h2>
                    <p class="docs-text">Showcase your staff members with custom name colors and avatars.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">Staff: [
    {
        name: "John",
        role: "Founder",
        color: "#ffffffb7",
        avatar: "https://example.com/avatar.png"
    }
],</code></pre></div>

                    <h2 class="docs-subtitle">Social Media</h2>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.js</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-javascript">Socials: {
    Discord: "https://discord.gg/yourserver",
    Website: "https://yoursite.com"
},</code></pre></div>
                `
            }
        ]
    },
    {
        group: 'Ardent Notification',
        icon: 'fas fa-bell',
        pages: [
            {
                id: 'notify-overview',
                title: 'Overview',
                content: `
                    <h1 class="docs-title">Ardent Notification</h1>
                    <p class="docs-text">A modern, customizable notification system for FiveM with sound effects, smooth animations, and 4 notification types.</p>
                    <h2 class="docs-subtitle">Features</h2>
                    <ul class="docs-list">
                        <li>4 Notification Types: Success, Error, Warning, Info</li>
                        <li>8 Position Options</li>
                        <li>Custom Sound Effects</li>
                        <li>Smooth Animations</li>
                        <li>Configurable Titles</li>
                        <li>Adjustable Duration</li>
                        <li>Works with any Framework (Standalone)</li>
                        <li>Client Export & Server Event Support</li>
                    </ul>
                    <div class="docs-alert docs-alert-warning"><i class="fas fa-exclamation-triangle"></i><div><strong>Warning:</strong> Do not rename the resource folder. The script must remain as <code>adt-notify</code>.</div></div>
                `
            },
            {
                id: 'notify-config',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">Notification Configuration</h1>
                    <p class="docs-text">Edit <code>config.lua</code> in the <code>adt-notify</code> resource folder.</p>

                    <h2 class="docs-subtitle">Position</h2>
                    <p class="docs-text">Set where notifications appear on screen.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">Config = {}

-- Options:
-- top-right, top-left,
-- bottom-right, bottom-left,
-- top-center, bottom-center,
-- center-right, center-left
Config.Position = "center-right"</code></pre></div>

                    <h2 class="docs-subtitle">Custom Titles</h2>
                    <p class="docs-text">Customize the title text for each notification type.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">Config.Titles = {
    success = "Success",
    error = "Error",
    warning = "Warning",
    info = "Information"
}</code></pre></div>
                `
            },
            {
                id: 'notify-exports',
                title: 'Exports & Events',
                content: `
                    <h1 class="docs-title">Exports & Events</h1>
                    <p class="docs-text">Use these exports and events to trigger notifications from other scripts.</p>

                    <h2 class="docs-subtitle">Client Export</h2>
                    <p class="docs-text">Call this from any <strong>client-side</strong> script.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>client.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- exports['adt-notify']:Notify(type, message, duration)

-- Types: 'success', 'error', 'warning', 'info'
-- Duration: milliseconds (default: 5000)

exports['adt-notify']:Notify('success', 'Item purchased!', 5000)

exports['adt-notify']:Notify('error', 'Not enough money!', 5000)

exports['adt-notify']:Notify('warning', 'You are being watched!', 5000)

exports['adt-notify']:Notify('info', 'Press E to interact.', 3000)</code></pre></div>

                    <h2 class="docs-subtitle">Server Event</h2>
                    <p class="docs-text">Trigger a notification from any <strong>server-side</strong> script by firing a client event.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>server.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- TriggerClientEvent('adt-notify:client:Notify', source, type, message, duration)

TriggerClientEvent('adt-notify:client:Notify', source, 'success', 'Welcome to the server!', 5000)

TriggerClientEvent('adt-notify:client:Notify', source, 'error', 'Action failed!', 5000)</code></pre></div>

                    <h2 class="docs-subtitle">QBCore Snippet</h2>
                    <p class="docs-text">To replace QBCore's default notification with <code>adt-notify</code>, open <code>qb-core/client/functions.lua</code> and find the <code>QBCore.Functions.Notify</code> function. Replace it with one of the snippets below.</p>
                    <div class="docs-alert docs-alert-info"><i class="fas fa-info-circle"></i><div><strong>Note:</strong> You can use either the <strong>Event</strong> method or the <strong>Export</strong> method. Both work the same way choose whichever you prefer.</div></div>

                    <h3 class="docs-subtitle">Method 1: Event</h3>
                    <div class="code-block-wrapper"><div class="code-header"><span>qb-core/client/functions.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">function QBCore.Functions.Notify(text, texttype, length, icon)
    local nType = texttype

    if type(text) == 'table' then
        nType = text.type or nType
        text = text.text or 'Placeholder'
    end

    if not nType or nType == 'primary' then
        nType = 'success'
    end

    TriggerEvent('adt-notify:client:Notify', nType, text, length)
end</code></pre></div>

                    <h3 class="docs-subtitle">Method 2: Export</h3>
                    <div class="code-block-wrapper"><div class="code-header"><span>qb-core/client/functions.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">function QBCore.Functions.Notify(text, texttype, length, icon)
    local nType = texttype

    if type(text) == 'table' then
        nType = text.type or nType
        text = text.text or 'Placeholder'
    end

    if not nType or nType == 'primary' then
        nType = 'success'
    end

    exports['adt-notify']:Notify(nType, text, length)
end</code></pre></div>
                `
            }
        ]
    },
    {
        group: 'Ardent Street Names',
        icon: 'fas fa-road',
        pages: [
            {
                id: 'streetnames-overview',
                title: 'Overview',
                content: `
                    <h1 class="docs-title">Ardent Street Names</h1>
                    <p class="docs-text">Displays the current street name and crossing zone on screen. Fully configurable with 4 unique themes, custom positioning, and optional map icon.</p>
                    <h2 class="docs-subtitle">Features</h2>
                    <ul class="docs-list">
                        <li>4 Different UI Themes</li>
                        <li>8 Position Options</li>
                        <li>Optional Map Icon</li>
                        <li>Separate Refresh Rates for Vehicle & On-foot</li>
                        <li>Auto-hide on Pause Menu</li>
                        <li>Crossing Street Detection</li>
                        <li>Works with any Framework (Standalone)</li>
                        <li>Optimized Performance</li>
                    </ul>
                `
            },
            {
                id: 'streetnames-config',
                title: 'Configuration',
                content: `
                    <h1 class="docs-title">Street Names Configuration</h1>
                    <p class="docs-text">Edit <code>config.lua</code> in the <code>adt-streetnames</code> resource folder.</p>

                    <h2 class="docs-subtitle">Theme</h2>
                    <p class="docs-text">Choose between 4 different visual themes.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">cfg = {}

-- 1, 2, 3, 4
cfg.theme = 1</code></pre></div>

                    <h2 class="docs-subtitle">Map Icon</h2>
                    <p class="docs-text">Show or hide the map icon next to the street name.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">cfg.mapicon = true</code></pre></div>

                    <h2 class="docs-subtitle">Position</h2>
                    <p class="docs-text">Set the position of the street name display on screen.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">-- Options:
-- 'top-left', 'top-center'
-- 'top-right', 'center-left'
-- 'center-right', 'bottom-left'
-- 'bottom-center', 'bottom-right'
cfg.position = 'bottom-right'</code></pre></div>

                    <h2 class="docs-subtitle">Refresh Rates</h2>
                    <p class="docs-text">Set how often the street name updates (in milliseconds). Separate values for in-vehicle and on-foot.</p>
                    <div class="code-block-wrapper"><div class="code-header"><span>config.lua</span><button class="copy-btn" onclick="copyCode(this)"><i class="fas fa-copy"></i></button></div><pre><code class="language-lua">cfg.rfstimes = {
    vehicle = 2500,
    ped = 3000
}</code></pre></div>
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

    document.querySelectorAll('.sidebar-page-link').forEach(link => {
        link.classList.toggle('active', link.dataset.page === pageId);
    });

    buildDocsSidebar(document.getElementById('docsSearchInput')?.value?.trim()?.toLowerCase() || '');

    applySyntaxHighlighting();

    const docsTab = document.getElementById('docs-tab');
    if (docsTab) docsTab.scrollTop = 0;
}

function applySyntaxHighlighting() {
    document.querySelectorAll('#docsMainContent pre code').forEach(codeEl => {
        const lang = (codeEl.className.match(/language-(\w+)/) || [])[1] || '';
        const raw = codeEl.textContent;
        codeEl.innerHTML = highlightSyntax(raw, lang);
    });
}

function highlightSyntax(code, lang) {
    let escaped = code
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    if (lang === 'lua') {

        const luaKw = /\b(local|function|end|if|then|else|elseif|return|for|while|do|repeat|until|in|not|and|or|true|false|nil|break|goto)\b/g;
        escaped = escaped.replace(luaKw, '<span class="syn-keyword">$1</span>');
        escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-number">$1</span>');
        escaped = escaped.replace(/\b(Config)\b/g, '<span class="syn-global">$1</span>');
    } else if (lang === 'javascript' || lang === 'js') {

        const jsKw = /\b(const|let|var|function|return|if|else|for|while|class|new|this|import|export|from|default|async|await|try|catch|throw|typeof|instanceof|true|false|null|undefined)\b/g;
        escaped = escaped.replace(jsKw, '<span class="syn-keyword">$1</span>');
        escaped = escaped.replace(/\b(\d+\.?\d*)\b/g, '<span class="syn-number">$1</span>');
    } else if (lang === 'cfg') {

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

const origSwitchTab = switchTab;
switchTab = function (tabName) {
    origSwitchTab(tabName);
    if (tabName === 'docs') {
        initDocs();
    }
};