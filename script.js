// Variáveis globais
let images = [];
let currentImageIndex = 0;
let filteredImages = [];

// DOM Elements
const galleryGrid = document.getElementById('galleryGrid');
const modal = document.getElementById('imageModal');
const modalImage = document.getElementById('modalImage');
const closeModal = document.querySelector('.close');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const filterButtons = document.querySelectorAll('.filter-btn');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadImagesFromAPI();
    setupEventListeners();
    setupScrollAnimations();
    setupSmoothScrolling();
});

// ======================
// Carregar imagens do API Google Photos
// ======================
async function loadImagesFromAPI(filter = 'all') {
    try {
        const res = await fetch('/api/photos');
        const data = await res.json();
        images = data.photos.map((url, i) => ({
            src: url,
            category: 'all', // você pode customizar se quiser categorizar
            alt: `Foto ${i + 1}`
        }));
        loadGallery(filter);
    } catch (err) {
        console.error('Erro ao carregar fotos do API:', err);
        galleryGrid.innerHTML = '<p>Erro ao carregar as fotos. Tente novamente mais tarde.</p>';
    }
}

// ======================
// Carregar galeria
// ======================
function loadGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    
    filteredImages = filter === 'all' ? [...images] : images.filter(img => img.category === filter);
    
    filteredImages.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
    });
    
    // Animação de entrada
    setTimeout(() => {
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

// ======================
// Criar item da galeria
// ======================
function createGalleryItem(image, index) {
    const item = document.createElement('div');
    item.className = 'gallery-item fade-in';
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'all 0.6s ease';
    
    item.innerHTML = `
        <img src="${image.src}" alt="${image.alt}" onerror="this.src='https://via.placeholder.com/400x250/667eea/ffffff?text=Foto+${index + 1}'">
        <div class="gallery-overlay">
            <i class="fas fa-search-plus"></i>
        </div>
    `;
    
    item.addEventListener('click', () => openModal(index));
    
    return item;
}

// ======================
// Event Listeners
// ======================
function setupEventListeners() {
    // Filtros da galeria
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filter = button.getAttribute('data-filter');
            loadGallery(filter);
        });
    });
    
    // Modal
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalHandler();
    });
    
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    document.addEventListener('keydown', handleKeyPress);
    
    hamburger.addEventListener('click', toggleMobileMenu);
    
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    window.addEventListener('scroll', handleScroll);
}

// ======================
// Modal
// ======================
function openModal(index) {
    currentImageIndex = index;
    const image = filteredImages[index];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

function showPrevImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
    const image = filteredImages[currentImageIndex];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
}

function showNextImage() {
    currentImageIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
    const image = filteredImages[currentImageIndex];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
}

function handleKeyPress(e) {
    if (modal.style.display === 'block') {
        switch(e.key) {
            case 'Escape': closeModalHandler(); break;
            case 'ArrowLeft': showPrevImage(); break;
            case 'ArrowRight': showNextImage(); break;
        }
    }
}

// ======================
// Menu mobile
// ======================
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// ======================
// Scroll e animações
// ======================
function handleScroll() {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('visible');
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    
    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
}

function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
}

// ======================
// Partículas no hero
// ======================
function createParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;
    
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `position:absolute; top:0; left:0; width:100%; height:100%; pointer-events:none; z-index:1;`;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position:absolute; width:2px; height:2px; background:rgba(255,255,255,0.5);
            border-radius:50%; animation:float ${Math.random()*3+2}s ease-in-out infinite;
            animation-delay:${Math.random()*2}s; left:${Math.random()*100}%; top:${Math.random()*100}%;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.appendChild(particlesContainer);
}
setTimeout(createParticles, 1000);

// ======================
// Performance
// ======================
function optimizePerformance() {
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {}, 250);
    });
    
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => { handleScroll(); scrollTimeout = null; }, 16);
        }
    });
}
optimizePerformance();
