// ============ CURSOR SYSTEM ============
const cursor = document.getElementById('cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    createTrailParticle(e.clientX, e.clientY);
});

function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
}
updateCursor();

// ============ TRAIL PARTICLES ============
function createTrailParticle(x, y) {
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    const size = Math.random() * 6 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    particle.style.opacity = Math.random() * 0.4 + 0.2;

    document.body.appendChild(particle);

    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 600);
}

// ============ CURSOR HOVER EFFECTS ============
const hoverElements = document.querySelectorAll('a, button, .tech-card, .stat-item, .timeline-item, .floating-card');

hoverElements.forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('active'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('active'));
});

// ============ BACKGROUND PARTICLES ============
const particlesBg = document.getElementById('particlesBg');

function createBgParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle-dot';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDuration = Math.random() * 10 + 15 + 's';
    particle.style.animationDelay = Math.random() * 5 + 's';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;

    particlesBg.appendChild(particle);

    setTimeout(() => {
        if (particle.parentNode) {
            particle.remove();
        }
    }, 25000);
}

// Criar partículas iniciais
for (let i = 0; i < 30; i++) {
    setTimeout(createBgParticle, i * 300);
}

// Criar novas partículas periodicamente
setInterval(createBgParticle, 2000);

// ============ HEADER SCROLL EFFECT ============
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============ STATS COUNTER ============
function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-target'));
    const duration = 2000;
    const startTime = Date.now();
    
    function update() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(target * ease);
        
        element.textContent = current;
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = target;
        }
    }
    
    update();
}

// Intersection Observer para contadores
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px'
};

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.stat-number[data-target]').forEach(counter => {
    counterObserver.observe(counter);
});

// ============ SCROLL REVEAL ============
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// Adicionar animação de reveal nos elementos
document.querySelectorAll('.tech-card, .timeline-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(el);
});

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ============ TILT EFFECT NOS CARDS ============
document.querySelectorAll('.tech-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -5;
        const rotateY = (x - centerX) / centerX * 5;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ============ PARALLAX HERO ============
window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual && scrolled < window.innerHeight) {
        heroVisual.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ============ CONSOLE EASTER EGG ============
console.log(`
╔══════════════════════════════════════╗
║                                      ║
║   🌱 AGRINHO 2026 🌱                ║
║   Tecnologia no Campo               ║
║                                      ║
║   🤖 Inteligência Artificial        ║
║   🛰️  Drones Inteligentes           ║
║   📊 Big Data Rural                 ║
║   🌿 Sustentabilidade Tech          ║
║                                      ║
║   💚 O futuro do agro é tech!       ║
║                                      ║
╚══════════════════════════════════════╝
`);
