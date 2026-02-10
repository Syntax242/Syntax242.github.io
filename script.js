const products = [
    {
        id: 1,
        name: "Ardent Banking",
        category: ["QBCore", "Qbox"],
        description: "Advanced banking system with clean UI and transaction history.",
        longDescription: `
            <p>Ardent Banking allows your players to manage their finances with ease. Featuring a sleek, modern UI, this banking system is fully optimized for ESX servers.</p>
            <p>It includes a comprehensive transaction history, allowing players to track their spending and income. The lending system enables players to borrow money with configurable interest rates and repayment terms.</p>
            <p>Admins have full control over the banking system, with the ability to view all accounts, freeze suspicious accounts, and manage loans.</p>
        `,
        features: [
            "Modern & Clean UI",
            "Transaction History",
            "Loan System with Interest",
            "Shared Accounts for Societies",
            "ATM Robbery Integration",
            "Optimized 0.00ms idle"
        ],
        image: "https://ardentdev.tebex.io/package/5673009/image",
        video: "0QSdxoH6254",
        price: "$24.99",
        tebexLink: "https://ardentdev.tebex.io/package/5673009"
    },
    {
        id: 2,
        name: "Ardent Fishing",
        category: ["QBCore", "Qbox"],
        description: "Ardent Fishing allows your players to fish in the game.",
        longDescription: `
            <p>Ardent Fishing allows your players to fish in the game. Featuring a sleek, modern UI, this fishing system is fully optimized for QBCore servers.</p>
            <p>It includes a comprehensive transaction history, allowing players to track their spending and income. The lending system enables players to borrow money with configurable interest rates and repayment terms.</p>
            <p>Admins have full control over the banking system, with the ability to view all accounts, freeze suspicious accounts, and manage loans.</p>
        `,
        features: [
            "Framework Agnostic (Standalone)",
            "Circular Status Indicators",
            "Vehicle HUD with Speedometer",
            "Compass & Street Name",
            "Cinematic Mode",
            "Fully Configurable CSS"
        ],
        image: "https://via.placeholder.com/800x600/1e293b/10b981?text=Ardent+HUD+Preview",
        video: "u7PfSNzjNe0",
        price: "$19.99",
        tebexLink: "https://tebex.io/package/example2"
    },
    {
        id: 3,
        name: "Ardent Tablet",
        category: ["QBCore", "Qbox"],
        description: "Ardent Tablet allows your players to use a tablet in the game.",
        longDescription: `
            <p>Ardent Tablet allows your players to use a tablet in the game. Featuring a sleek, modern UI, this tablet system is fully optimized for QBCore servers.</p>
            <p>It includes a comprehensive transaction history, allowing players to track their spending and income. The lending system enables players to borrow money with configurable interest rates and repayment terms.</p>
            <p>Admins have full control over the banking system, with the ability to view all accounts, freeze suspicious accounts, and manage loans.</p>
        `,
        features: [
            "Citizen & Vehicle Database",
            "Warrants & BOLOs",
            "Incident Reports",
            "Evidence System",
            "EMS Medical Records",
            "Dark/Light Mode Support"
        ],
        image: "https://via.placeholder.com/800x600/1e293b/3b82f6?text=Ardent+MDT+Preview",
        video: "0QSdxoH6254",
        price: "$34.99",
        tebexLink: "https://tebex.io/package/example3"
    },
    {
        id: 4,
        name: "Ardent Loading Screen",
        category: ["Standalone"],
        description: "Ardent Loading Screen allows your server to have a loading screen.",
        longDescription: `
            <p>Ardent Loading Screen allows your server to have a loading screen. Featuring a sleek, modern UI, this loading screen system is fully optimized for QBCore servers.</p>
            <p>It includes a comprehensive transaction history, allowing players to track their spending and income. The lending system enables players to borrow money with configurable interest rates and repayment terms.</p>
            <p>Admins have full control over the banking system, with the ability to view all accounts, freeze suspicious accounts, and manage loans.</p>
        `,
        features: [
            "Video Background Support",
            "Music Player with Playlist",
            "Server Information Display",
            "Staff Team Showcase",
            "Project Landing Page Style",
            "Easy Configuration"
        ],
        image: "https://via.placeholder.com/800x600/1e293b/f59e0b?text=Loading+Screen+Preview",
        video: "0QSdxoH6254",
        price: "$14.99",
        tebexLink: "https://tebex.io/package/example4"
    },
    {
        id: 5,
        name: "Ardent Item List",
        category: ["QBCore", "Qbox"],
        description: "Sleek drag-and-drop inventory system with crafting and shops.",
        longDescription: `
            <p>A robust inventory system designed for Qbox. The intuitive drag-and-drop interface makes managing items a breeze for your players.</p>
            <p>Features include a crafting system with blueprints, player-owned shops, and item decay. The metadata support allows for unique items with specific properties.</p>
        `,
        features: [
            "Drag & Drop Interface",
            "Crafting System",
            "Player Shops",
            "Item Metadata & Decay",
            "Hotbar Support",
            "Optimized Performance"
        ],
        image: "https://via.placeholder.com/800x600/1e293b/8b5cf6?text=Ardent+Inventory+Preview",
        video: "0QSdxoH6254",
        price: "$29.99",
        tebexLink: "https://tebex.io/package/example5"
    },
    {
        id: 6,
        name: "Ardent PostJob",
        category: ["QBCore", "Qbox"],
        description: "Beautiful multi-character selection screen with ped preview.",
        longDescription: `
            <p>Welcome your players with style. This multi-character script offers a cinematic character selection screen with high-quality ped previews.</p>
            <p>Players can view their characters' details, such as job, cash, and bank balance, before spawning. The spawn selection map is integrated for a seamless experience.</p>
        `,
        features: [
            "Ped Preview Animation",
            "Character Stats Display",
            "Spawn Selector Integration",
            "Cinematic Camera Angles",
            "Slot Management",
            "Easy Setup"
        ],
        image: "https://via.placeholder.com/800x600/1e293b/ec4899?text=Multicharacter+Preview",
        video: "0QSdxoH6254",
        price: "$19.99",
        tebexLink: "https://tebex.io/package/example6"
    }
];


let currentCategory = 'all';
let searchTerm = '';

// Notification spam protection
let notificationHistory = [];
const NOTIFICATION_SPAM_LIMIT = 5; // Maximum notifications in time window
const NOTIFICATION_SPAM_WINDOW = 2000; // Time window in milliseconds (2 seconds)

function switchTab(tabName) {
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

    // About ve Contact tablarında body scroll'unu engelle
    if (tabName === 'about' || tabName === 'contact' || tabName === 'product-details') {
        document.body.classList.add('no-scroll');
    } else {
        document.body.classList.remove('no-scroll');
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (tabName === 'products') {
        displayProducts();
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

        productCard.innerHTML = `
            <div class="product-card-inner">
                <div class="product-image-section">
                    <img src="https://img.youtube.com/vi/${product.video}/maxresdefault.jpg" alt="${product.name}" onerror="this.src='https://via.placeholder.com/400x300/1f2937/6366f1?text=${encodeURIComponent(product.name)}'">
                    <div class="product-overlay">
                    </div>
                </div>
                
                <div class="product-info-section">
                    <div class="product-title-wrapper">
                        <h3 class="product-title">${product.name}</h3>
                        ${product.category.map(c => `<span class="category-badge">${c}</span>`).join('')}
                    </div>
                    <p class="product-text">${product.description}</p>
                    <div class="product-footer">
                         <span class="product-price">${product.price}</span>
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
    detailCategoryEl.innerHTML = product.category.map(c => `<span class="category-badge">${c}</span>`).join('');
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

    document.getElementById('detailPrice').textContent = product.price;
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
        filtered = filtered.filter(p => p.category.includes(currentCategory));
    }

    if (searchTerm) {
        filtered = filtered.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.some(c => c.toLowerCase().includes(searchTerm.toLowerCase()))
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