// Configuração das imagens (você pode adicionar suas 22 fotos aqui)
const images = [
    // Exemplo de como adicionar suas fotos
    // Substitua pelos nomes reais dos seus arquivos na pasta /img
    { src: 'img/foto1.jpg', category: 'portrait', alt: 'Retrato 1' },
    { src: 'img/foto2.jpg', category: 'landscape', alt: 'Paisagem 1' },
    { src: 'img/foto3.jpg', category: 'street', alt: 'Street 1' },
    { src: 'img/foto4.jpg', category: 'nature', alt: 'Natureza 1' },
    { src: 'img/foto5.jpg', category: 'portrait', alt: 'Retrato 2' },
    { src: 'img/foto6.jpg', category: 'landscape', alt: 'Paisagem 2' },
    { src: 'img/foto7.jpg', category: 'street', alt: 'Street 2' },
    { src: 'img/foto8.jpg', category: 'nature', alt: 'Natureza 2' },
    { src: 'img/foto9.jpg', category: 'portrait', alt: 'Retrato 3' },
    { src: 'img/foto10.jpg', category: 'landscape', alt: 'Paisagem 3' },
    { src: 'img/foto11.jpg', category: 'street', alt: 'Street 3' },
    { src: 'img/foto12.jpg', category: 'nature', alt: 'Natureza 3' },
    { src: 'img/foto13.jpg', category: 'portrait', alt: 'Retrato 4' },
    { src: 'img/foto14.jpg', category: 'landscape', alt: 'Paisagem 4' },
    { src: 'img/foto15.jpg', category: 'street', alt: 'Street 4' },
    { src: 'img/foto16.jpg', category: 'nature', alt: 'Natureza 4' },
    { src: 'img/foto17.jpg', category: 'portrait', alt: 'Retrato 5' },
    { src: 'img/foto18.jpg', category: 'landscape', alt: 'Paisagem 5' },
    { src: 'img/foto19.jpg', category: 'street', alt: 'Street 5' },
    { src: 'img/foto20.jpg', category: 'nature', alt: 'Natureza 5' },
    { src: 'img/foto21.jpg', category: 'portrait', alt: 'Retrato 6' },
    { src: 'img/foto22.jpg', category: 'landscape', alt: 'Paisagem 6' }
];

// Variáveis globais
let currentImageIndex = 0;
let filteredImages = [...images];

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
    loadGallery();
    setupEventListeners();
    setupScrollAnimations();
    setupSmoothScrolling();
});

// Carregar galeria
function loadGallery(filter = 'all') {
    galleryGrid.innerHTML = '';
    
    filteredImages = filter === 'all' ? [...images] : images.filter(img => img.category === filter);
    
    filteredImages.forEach((image, index) => {
        const galleryItem = createGalleryItem(image, index);
        galleryGrid.appendChild(galleryItem);
    });
    
    // Adicionar animação de entrada
    setTimeout(() => {
        const items = document.querySelectorAll('.gallery-item');
        items.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
}

// Criar item da galeria
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

// Configurar event listeners
function setupEventListeners() {
    // Filtros da galeria
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover classe active de todos os botões
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Adicionar classe active ao botão clicado
            button.classList.add('active');
            
            // Filtrar galeria
            const filter = button.getAttribute('data-filter');
            loadGallery(filter);
        });
    });
    
    // Modal
    closeModal.addEventListener('click', closeModalHandler);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModalHandler();
    });
    
    // Navegação do modal
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Teclado
    document.addEventListener('keydown', handleKeyPress);
    
    // Menu mobile
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Links de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
    
    // Scroll do header
    window.addEventListener('scroll', handleScroll);
}

// Abrir modal
function openModal(index) {
    currentImageIndex = index;
    const image = filteredImages[index];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

// Fechar modal
function closeModalHandler() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Imagem anterior
function showPrevImage() {
    currentImageIndex = currentImageIndex > 0 ? currentImageIndex - 1 : filteredImages.length - 1;
    const image = filteredImages[currentImageIndex];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
}

// Próxima imagem
function showNextImage() {
    currentImageIndex = currentImageIndex < filteredImages.length - 1 ? currentImageIndex + 1 : 0;
    const image = filteredImages[currentImageIndex];
    modalImage.src = image.src;
    modalImage.alt = image.alt;
}

// Manipular teclas
function handleKeyPress(e) {
    if (modal.style.display === 'block') {
        switch(e.key) {
            case 'Escape':
                closeModalHandler();
                break;
            case 'ArrowLeft':
                showPrevImage();
                break;
            case 'ArrowRight':
                showNextImage();
                break;
        }
    }
}

// Toggle menu mobile
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Manipular scroll
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

// Configurar animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observar elementos com animação
    document.querySelectorAll('.fade-in').forEach(el => {
        observer.observe(el);
    });
}

// Configurar scroll suave
function setupSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Função para adicionar novas imagens dinamicamente
function addImage(src, category, alt) {
    images.push({ src, category, alt });
    loadGallery();
}

// Função para remover imagem
function removeImage(index) {
    images.splice(index, 1);
    loadGallery();
}

// Lazy loading para imagens
function setupLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Função para criar efeito de partículas no hero
function createParticles() {
    const hero = document.querySelector('.hero');
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    particlesContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 1;
    `;
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(255, 255, 255, 0.5);
            border-radius: 50%;
            animation: float ${Math.random() * 3 + 2}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particlesContainer.appendChild(particle);
    }
    
    hero.appendChild(particlesContainer);
}

// Inicializar partículas
setTimeout(createParticles, 1000);

// Função para otimizar performance
function optimizePerformance() {
    // Debounce para resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recarregar galeria se necessário
            if (window.innerWidth <= 768) {
                // Ajustes para mobile
            }
        }, 250);
    });
    
    // Throttle para scroll
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (!scrollTimeout) {
            scrollTimeout = setTimeout(() => {
                handleScroll();
                scrollTimeout = null;
            }, 16); // ~60fps
        }
    });
}

// Inicializar otimizações
optimizePerformance();