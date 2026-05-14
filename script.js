// ============ CURSOR ============
const cursorEl = document.getElementById('cursor');
let mouseX = 0, mouseY = 0;
let curX = 0, curY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    createTrail(e.clientX, e.clientY);
});

function animateCursor() {
    curX += (mouseX - curX) * 0.1;
    curY += (mouseY - curY) * 0.1;
    cursorEl.style.left = curX + 'px';
    cursorEl.style.top = curY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();

// ============ TRAIL ============
function createTrail(x, y) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    const size = Math.random() * 4 + 3;
    dot.style.width = size + 'px';
    dot.style.height = size + 'px';
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    document.body.appendChild(dot);
    
    setTimeout(() => {
        if (dot.parentNode) dot.remove();
    }, 500);
}

// ============ CURSOR HOVER ============
const hoverTargets = document.querySelectorAll('a, button, .card, .stat, .timeline-item');
hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => cursorEl.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursorEl.classList.remove('hover'));
});

// ============ HEADER SCROLL ============
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ============ STATS COUNTER ============
function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-target'));
    const duration = 1800;
    const start = performance.now();
    
    function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * ease);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            el.textContent = target;
        }
    }
    
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.4 });

document.querySelectorAll('.stat-number').forEach(el => counterObserver.observe(el));

// ============ FADE IN ON SCROLL ============
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll('.card, .timeline-item, .stat').forEach(el => {
    el.classList.add('fade-in');
    fadeObserver.observe(el);
});

// ============ SMOOTH ANCHOR SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ============ CARD TILT (SUAVE) ============
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -3;
        const rotateY = (x - centerX) / centerX * 3;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

console.log('🌱 Agrinho 2026 - Tecnologia no Campo - Pronto! 🚀');
