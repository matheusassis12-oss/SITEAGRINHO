// ============ IMPORTS ============
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// ============ CONFIGURAÇÃO DO CENÁRIO 3D ============
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0f0d, 0.0008);

// Camera
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.set(0, 5, 15);
camera.lookAt(0, 0, 0);

// Renderer
const renderer = new THREE.WebGLRenderer({ 
    alpha: true, 
    antialias: true,
    powerPreference: "high-performance"
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.5;
container.appendChild(renderer.domElement);

// Orbit Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.autoRotate = true;
controls.autoRotateSpeed = 0.5;
controls.maxPolarAngle = Math.PI / 1.8;
controls.minDistance = 8;
controls.maxDistance = 25;
controls.target.set(0, 0.5, 0);
controls.enablePan = false;

// ============ ILUMINAÇÃO ============
const ambientLight = new THREE.AmbientLight(0x1a3a1a, 1.5);
scene.add(ambientLight);

const sunLight = new THREE.DirectionalLight(0xffffff, 8);
sunLight.position.set(10, 15, 10);
sunLight.castShadow = true;
sunLight.shadow.mapSize.width = 2048;
sunLight.shadow.mapSize.height = 2048;
sunLight.shadow.camera.near = 0.5;
sunLight.shadow.camera.far = 50;
sunLight.shadow.camera.left = -15;
sunLight.shadow.camera.right = 15;
sunLight.shadow.camera.top = 15;
sunLight.shadow.camera.bottom = -15;
sunLight.shadow.bias = -0.0001;
scene.add(sunLight);

const pointLight1 = new THREE.PointLight(0x00ff88, 50, 20);
pointLight1.position.set(5, 3, 5);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0x00cc66, 50, 20);
pointLight2.position.set(-5, 3, -5);
scene.add(pointLight2);

// ============ CHÃO ============
const groundGeometry = new THREE.CircleGeometry(12, 64);
const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x1a3a1a,
    roughness: 0.8,
    metalness: 0.2
});
const ground = new THREE.Mesh(groundGeometry, groundMaterial);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -4;
ground.receiveShadow = true;
scene.add(ground);

// Grade polar
const gridHelper = new THREE.PolarGridHelper(10, 32, 20, 64, 0x00ff88, 0x00ff88);
gridHelper.position.y = -3.99;
scene.add(gridHelper);

// ============ ESFERA CENTRAL (PLANETA TECH) ============
const sphereGeo = new THREE.SphereGeometry(2, 64, 64);
const sphereMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    roughness: 0.1,
    metalness: 0.8,
    emissive: 0x003311,
    emissiveIntensity: 0.5
});
const sphere = new THREE.Mesh(sphereGeo, sphereMat);
sphere.position.y = 0.5;
sphere.castShadow = true;
sphere.receiveShadow = true;
scene.add(sphere);

// ============ ANÉIS TECNOLÓGICOS ============
function createRing(radius, thickness, color, emissiveColor, emissiveIntensity) {
    const geo = new THREE.TorusGeometry(radius, thickness, 32, 100);
    const mat = new THREE.MeshStandardMaterial({
        color: color,
        roughness: 0.1,
        metalness: 1,
        emissive: emissiveColor,
        emissiveIntensity: emissiveIntensity
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.y = 0.5;
    mesh.castShadow = true;
    return mesh;
}

const ring1 = createRing(2.5, 0.08, 0x00ff88, 0x00ff88, 2);
ring1.rotation.x = Math.PI / 2;
scene.add(ring1);

const ring2 = createRing(3, 0.06, 0x00ff88, 0x00ff88, 2);
ring2.rotation.x = Math.PI / 3;
ring2.rotation.y = Math.PI / 4;
scene.add(ring2);

const ring3 = createRing(3.5, 0.04, 0x4ade80, 0x4ade80, 1.5);
ring3.rotation.x = Math.PI / 2.5;
ring3.rotation.y = -Math.PI / 3;
scene.add(ring3);

// ============ PARTÍCULAS (DADOS FLUTUANTES) ============
const particlesGeo = new THREE.BufferGeometry();
const particlesCount = 500;
const positions = new Float32Array(particlesCount * 3);
const colors = new Float32Array(particlesCount * 3);

for (let i = 0; i < particlesCount; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.random() * Math.PI;
    const radius = 3 + Math.random() * 7;

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);

    colors[i * 3] = 0;
    colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
    colors[i * 3 + 2] = 0.3 + Math.random() * 0.2;
}

particlesGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const particlesMat = new THREE.PointsMaterial({
    size: 0.05,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.8
});

const particles = new THREE.Points(particlesGeo, particlesMat);
scene.add(particles);

// ============ CUBOS DE DADOS ============
const cubes = [];
for (let i = 0; i < 30; i++) {
    const cubeGeo = new THREE.BoxGeometry(0.15, 0.15, 0.15);
    const cubeMat = new THREE.MeshStandardMaterial({
        color: new THREE.Color().setHSL(0.35 + Math.random() * 0.15, 1, 0.5 + Math.random() * 0.3),
        roughness: 0.1,
        metalness: 0.9,
        emissive: new THREE.Color().setHSL(0.35, 1, 0.2),
        emissiveIntensity: 0.5
    });
    const cube = new THREE.Mesh(cubeGeo, cubeMat);

    const angle = (i / 30) * Math.PI * 2;
    const radius = 4 + Math.random() * 4;
    cube.position.x = Math.cos(angle) * radius;
    cube.position.z = Math.sin(angle) * radius;
    cube.position.y = -2 + Math.random() * 6;
    cube.rotation.x = Math.random() * Math.PI;
    cube.rotation.y = Math.random() * Math.PI;
    cube.castShadow = true;
    
    cube.userData = {
        baseY: cube.position.y,
        speed: 0.5 + Math.random() * 1.5,
        amplitude: 0.5 + Math.random() * 2,
        rotSpeed: 0.01 + Math.random() * 0.03,
        angle: angle,
        radius: radius
    };
    
    scene.add(cube);
    cubes.push(cube);
}

// ============ ÁRVORES TECNOLÓGICAS ============
function createTechTree(x, y, z) {
    const group = new THREE.Group();

    // Tronco
    const trunkGeo = new THREE.CylinderGeometry(0.15, 0.2, 3, 16);
    const trunkMat = new THREE.MeshStandardMaterial({
        color: 0x4a3728,
        roughness: 0.6,
        metalness: 0.3
    });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    group.add(trunk);

    // Copas tecnológicas
    const crownColors = [0x00ff88, 0x4ade80, 0x22c55e, 0x86efac];
    for (let i = 0; i < 15; i++) {
        const crownGeo = new THREE.SphereGeometry(0.3 + Math.random() * 0.4, 16, 16);
        const crownMat = new THREE.MeshStandardMaterial({
            color: crownColors[Math.floor(Math.random() * crownColors.length)],
            roughness: 0.2,
            metalness: 0.7,
            emissive: crownColors[Math.floor(Math.random() * crownColors.length)],
            emissiveIntensity: 0.3
        });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.y = 2.5 + Math.random() * 2.5;
        crown.position.x = (Math.random() - 0.5) * 2;
        crown.position.z = (Math.random() - 0.5) * 2;
        crown.castShadow = true;
        group.add(crown);
    }

    group.position.set(x, y, z);
    scene.add(group);
    return group;
}

const trees = [];
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const radius = 7;
    const tree = createTechTree(
        Math.cos(angle) * radius,
        -4,
        Math.sin(angle) * radius
    );
    trees.push(tree);
}

// ============ DRONE 3D ============
function createDrone() {
    const droneGroup = new THREE.Group();

    // Corpo
    const bodyGeo = new THREE.BoxGeometry(0.4, 0.1, 0.4);
    const bodyMat = new THREE.MeshStandardMaterial({
        color: 0x333333,
        roughness: 0.2,
        metalness: 0.9
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.castShadow = true;
    droneGroup.add(body);

    // Luzes LED
    const lightGeo = new THREE.SphereGeometry(0.05, 8, 8);
    const lightMat = new THREE.MeshStandardMaterial({
        color: 0x00ff88,
        emissive: 0x00ff88,
        emissiveIntensity: 2,
        roughness: 0
    });

    for (let i = 0; i < 4; i++) {
        const light = new THREE.Mesh(lightGeo, lightMat);
        light.position.set(
            (i < 2 ? 1 : -1) * 0.25,
            0.05,
            (i % 2 === 0 ? 1 : -1) * 0.25
        );
        droneGroup.add(light);
    }

    // Hélices
    for (let i = 0; i < 4; i++) {
        const propGeo = new THREE.BoxGeometry(0.5, 0.02, 0.08);
        const propMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc,
            roughness: 0.1,
            metalness: 0.8
        });
        const prop = new THREE.Mesh(propGeo, propMat);
        prop.position.set(
            (i < 2 ? 1 : -1) * 0.3,
            0.12,
            (i % 2 === 0 ? 1 : -1) * 0.3
        );
        prop.name = 'propeller';
        droneGroup.add(prop);
    }

    return droneGroup;
}

const drone = createDrone();
drone.position.set(0, 4, 0);
drone.scale.set(1.5, 1.5, 1.5);
scene.add(drone);

// ============ ANIMAÇÃO 3D ============
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const time = clock.getElapsedTime();

    // Anéis girando
    ring1.rotation.z += 0.01;
    ring2.rotation.z -= 0.008;
    ring2.rotation.x += 0.005;
    ring3.rotation.z += 0.012;
    ring3.rotation.y += 0.006;

    // Esfera pulsante
    const pulse = 1 + Math.sin(time * 2) * 0.05;
    sphere.scale.setScalar(pulse);
    sphere.rotation.y += 0.005;
    sphere.rotation.x += 0.003;

    // Partículas
    particles.rotation.y += 0.002;
    particles.rotation.x += 0.001;

    // Cubos animados
    cubes.forEach(cube => {
        cube.position.y = cube.userData.baseY + 
            Math.sin(time * cube.userData.speed) * cube.userData.amplitude;
        cube.rotation.x += cube.userData.rotSpeed;
        cube.rotation.y += cube.userData.rotSpeed * 1.5;
    });

    // Drone voando
    drone.position.y = 4 + Math.sin(time * 1.5) * 1.5;
    drone.position.x = Math.cos(time * 0.7) * 3;
    drone.position.z = Math.sin(time * 0.7) * 3;
    drone.rotation.y += 0.02;
    drone.lookAt(sphere.position);

    // Hélices girando
    drone.children.forEach(child => {
        if (child.name === 'propeller') {
            child.rotation.y += 0.5;
        }
    });

    // Árvores balançando
    trees.forEach((tree, i) => {
        tree.rotation.y += 0.003;
        tree.position.y = -4 + Math.sin(time * 0.8 + i) * 0.3;
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();

// ============ MOUSE TRAIL SYSTEM ============
const cursor = document.getElementById('cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;
const trailParticles = [];
const maxTrailParticles = 30;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Criar partícula de rastro
    const particle = document.createElement('div');
    particle.className = 'trail-particle';
    const size = Math.random() * 12 + 4;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = (mouseX - size / 2) + 'px';
    particle.style.top = (mouseY - size / 2) + 'px';
    particle.style.background = `radial-gradient(circle, hsl(${140 + Math.random() * 20}, 100%, ${60 + Math.random() * 30}%), transparent)`;
    particle.style.boxShadow = `0 0 ${size * 2}px rgba(0, 255, 136, 0.8)`;

    document.body.appendChild(particle);
    trailParticles.push(particle);

    // Limitar número de partículas
    if (trailParticles.length > maxTrailParticles) {
        const oldParticle = trailParticles.shift();
        if (oldParticle?.parentNode) {
            oldParticle.remove();
        }
    }

    // Remover partícula após animação
    setTimeout(() => {
        const index = trailParticles.indexOf(particle);
        if (index > -1) {
            trailParticles.splice(index, 1);
        }
        if (particle.parentNode) {
            particle.remove();
        }
    }, 800);
});

// Suavização do cursor
function updateCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(updateCursor);
}
updateCursor();

// ============ INTERAÇÕES COM CARDS ============
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        cursor.classList.add('active');
    });
    
    card.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
    });

    // Efeito 3D nos cards
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -10;
        const rotateY = (x - centerX) / centerX * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
    });
});

// ============ CONTADORES ANIMADOS ============
function animateCounters() {
    const counters = document.querySelectorAll('[data-counter]');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-counter'));
                const duration = 2000;
                const startTime = Date.now();
                
                function update() {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    const ease = 1 - Math.pow(1 - progress, 3); // Ease out
                    const current = Math.floor(target * ease);
                    
                    counter.textContent = current + (target === 30 ? '%' : '');
                    
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = '+' + target + '%';
                    }
                }
                
                update();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

animateCounters();

// ============ RESPONSIVE HANDLER ============
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// ============ PERFORMANCE OPTIMIZATION ============
// Pausar animação quando aba não estiver visível
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        controls.autoRotate = false;
    } else {
        controls.autoRotate = true;
    }
});

// ============ CONSOLE EASTER EGG ============
console.log(`
🌱🚀 AGRINHO 2026 - TECNOLOGIA NO CAMPO 🚀🌱
╔══════════════════════════════════════╗
║  🤖 IA na Agricultura               ║
║  🛰️  Drones Inteligentes            ║
║  📊 Big Data Rural                   ║
║  🌿 Sustentabilidade Tech            ║
║                                      ║
║  💚 Tecnologia que transforma!      ║
╚══════════════════════════════════════╝
`);
