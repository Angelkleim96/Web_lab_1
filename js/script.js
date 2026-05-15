// ----------------------------------------------
// 1. Эффект печатающегося текста
// ----------------------------------------------
const subtitleEl = document.getElementById('dynamicSubtitle');
const fullText = "Современный веб-дизайн, адаптивные интерфейсы";
let index = 0;

function typeWriter() {
  if (index < fullText.length) {
    subtitleEl.innerHTML = fullText.substring(0, index + 1);
    index++;
    setTimeout(typeWriter, 45);
  }
}

// ----------------------------------------------
// 2. Theme Toggle (Светлая/Темная тема)
// ----------------------------------------------
const themeToggle = document.getElementById('themeToggle');
const body = document.body;

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
  body.classList.add('light-theme');
}

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    body.classList.toggle('light-theme');
    const isLight = body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });
}

// ----------------------------------------------
// 3. Мобильное меню (гамбургер)
// ----------------------------------------------
const mobileToggle = document.getElementById('mobileToggle');
const mobileMenu = document.getElementById('mobileMenu');

if (mobileToggle && mobileMenu) {
  mobileToggle.addEventListener('click', () => {
    mobileToggle.classList.toggle('active');
    mobileMenu.classList.toggle('active');
  });

  // Закрытие меню при клике на ссылку
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      mobileToggle.classList.remove('active');
      mobileMenu.classList.remove('active');
    });
  });
}

// ----------------------------------------------
// 4. Эффект скролла для шапки
// ----------------------------------------------
const header = document.querySelector('.header-new');
if (header) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });
}

// ----------------------------------------------
// 5. Активная ссылка в навигации при скролле
// ----------------------------------------------
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
  const scrollPosition = window.scrollY + 150;

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionBottom = sectionTop + section.offsetHeight;
    
    if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
      const currentId = section.getAttribute('id');
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentId}`) {
          link.classList.add('active');
        }
      });
    }
  });
}

window.addEventListener('scroll', updateActiveLink);
window.addEventListener('load', updateActiveLink);

// ----------------------------------------------
// 6. Плавная прокрутка для якорных ссылок
// ----------------------------------------------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const headerOffset = 80;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
      
      // Закрываем мобильное меню если оно открыто
      if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileToggle.classList.remove('active');
        mobileMenu.classList.remove('active');
      }
    }
  });
});

// ----------------------------------------------
// 7. Продвинутая система частиц
// ----------------------------------------------
class Vector2 {
  constructor(x = 0, y = 0) { 
    this.x = x; 
    this.y = y; 
  }
  randomize(b) { 
    this.x = Math.random() * b.x; 
    this.y = Math.random() * b.y; 
    return this; 
  }
  add(v) { 
    this.x += v.x; 
    this.y += v.y; 
    return this; 
  }
}

let backCanvas, midCanvas, frontCanvas;
let ctxBack, ctxMid, ctxFront;
let dimensions = { x: window.innerWidth, y: window.innerHeight };
let particles = [];
let mouse = new Vector2(window.innerWidth / 2, window.innerHeight / 2);
let mouseActive = false;

function initCanvases() {
  backCanvas = document.querySelector('.back');
  midCanvas = document.querySelector('.mid');
  frontCanvas = document.querySelector('.front');
  if (!backCanvas) return;
  
  ctxBack = backCanvas.getContext('2d');
  ctxMid = midCanvas.getContext('2d');
  ctxFront = frontCanvas.getContext('2d');
  
  resizeCanvas();
  window.addEventListener('resize', () => resizeCanvas());
  window.addEventListener('mousemove', (e) => { 
    mouse.x = e.clientX; 
    mouse.y = e.clientY; 
    mouseActive = true; 
  });
  window.addEventListener('mouseleave', () => { mouseActive = false; });
  
  createParticles();
  animateParticles();
}

function resizeCanvas() {
  dimensions.x = window.innerWidth;
  dimensions.y = window.innerHeight;
  [backCanvas, midCanvas, frontCanvas].forEach(c => {
    if (c) { 
      c.width = dimensions.x; 
      c.height = dimensions.y; 
    }
  });
}

class ParticleSys {
  constructor(ctx, size, speed, color, zIndex) {
    this.ctx = ctx;
    this.size = size;
    this.speed = speed;
    this.color = color;
    this.z = zIndex;
    this.pos = new Vector2().randomize(dimensions);
    this.vel = new Vector2(0, speed);
  }
  
  update() {
    this.pos.add(this.vel);
    if (this.pos.y < -this.size || this.pos.y > dimensions.y + this.size || 
        this.pos.x < -this.size || this.pos.x > dimensions.x + this.size) {
      this.pos.x = Math.random() * dimensions.x;
      this.pos.y = dimensions.y + this.size;
    }
    
    if (mouseActive) {
      let dx = mouse.x - this.pos.x;
      let influence = (this.z === 1 ? 0.02 : this.z === 2 ? 0.04 : 0.08);
      let targetVelX = dx * influence;
      this.vel.x += (targetVelX - this.vel.x) * 0.08;
      this.vel.x *= 0.98;
    } else {
      this.vel.x *= 0.96;
    }
    this.vel.y = this.speed + (this.z === 3 ? -0.2 : 0);
  }
  
  draw() {
    this.ctx.beginPath();
    this.ctx.fillStyle = this.color;
    this.ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

function createParticles() {
  particles = [];
  const colors = ['rgba(56, 189, 248, 0.4)', 'rgba(129, 140, 248, 0.45)', 'rgba(167, 139, 250, 0.5)'];
  
  for (let i = 0; i < 450; i++) {
    let layer = i < 200 ? 1 : i < 350 ? 2 : 3;
    let ctx = layer === 1 ? ctxBack : layer === 2 ? ctxMid : ctxFront;
    let size = layer === 1 ? 2 : layer === 2 ? 3.5 : 5;
    let speed = layer === 1 ? -0.7 : layer === 2 ? -1.2 : -1.8;
    let color = colors[layer - 1];
    let p = new ParticleSys(ctx, size, speed, color, layer);
    p.pos.randomize(dimensions);
    particles.push(p);
  }
}

function animateParticles() {
  if (ctxBack) ctxBack.clearRect(0, 0, dimensions.x, dimensions.y);
  if (ctxMid) ctxMid.clearRect(0, 0, dimensions.x, dimensions.y);
  if (ctxFront) ctxFront.clearRect(0, 0, dimensions.x, dimensions.y);
  
  for (let p of particles) {
    p.update();
    p.draw();
  }
  requestAnimationFrame(animateParticles);
}

// ----------------------------------------------
// 8. Custom cursor
// ----------------------------------------------
const cursorDot = document.querySelector('.cursor');
const cursorOutline = document.querySelector('.cursor-follower');

if (cursorDot && cursorOutline) {
  window.addEventListener('mousemove', (e) => {
    cursorDot.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    cursorOutline.style.transform = `translate(${e.clientX - 20}px, ${e.clientY - 20}px)`;
  });
  
  const interactiveElements = document.querySelectorAll('a, button, .skill-chip, .project-img, .btn-primary, .btn-secondary, .btn-hire, .project-link, .mobile-toggle');
  interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursorOutline.style.width = '60px';
      cursorOutline.style.height = '60px';
      cursorOutline.style.borderColor = '#ffffff';
      cursorOutline.style.backgroundColor = 'rgba(56,189,248,0.15)';
    });
    el.addEventListener('mouseleave', () => {
      cursorOutline.style.width = '40px';
      cursorOutline.style.height = '40px';
      cursorOutline.style.borderColor = '#38bdf8';
      cursorOutline.style.backgroundColor = 'transparent';
    });
  });
}

// ----------------------------------------------
// 9. Image expand modal
// ----------------------------------------------
const overlay = document.getElementById('imageOverlay');
const expandedImg = document.getElementById('expandedImg');
const projectImgs = document.querySelectorAll('.project-img');

projectImgs.forEach(img => {
  img.addEventListener('click', (e) => {
    e.stopPropagation();
    const fullSrc = img.getAttribute('data-full') || img.src;
    expandedImg.src = fullSrc;
    overlay.classList.add('active');
  });
});

if (overlay) {
  overlay.addEventListener('click', () => {
    overlay.classList.remove('active');
  });
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && overlay && overlay.classList.contains('active')) {
    overlay.classList.remove('active');
  }
});

// ----------------------------------------------
// 10. Плавное появление при скролле
// ----------------------------------------------
const fadeElements = document.querySelectorAll('.fade-up');

function checkFade() {
  const triggerBottom = window.innerHeight * 0.85;
  fadeElements.forEach(el => {
    const boxTop = el.getBoundingClientRect().top;
    if (boxTop < triggerBottom) {
      el.classList.add('visible');
    }
  });
}

window.addEventListener('scroll', checkFade);
window.addEventListener('load', checkFade);

// ----------------------------------------------
// 11. Параллакс-эффект для частиц
// ----------------------------------------------
let scrollY = 0;

window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  const maxOffset = 80;
  const offset = Math.min(scrollY * 0.1, maxOffset);
  if (backCanvas) backCanvas.style.transform = `translateY(${offset * 0.2}px)`;
  if (midCanvas) midCanvas.style.transform = `translateY(${offset * 0.4}px)`;
  if (frontCanvas) frontCanvas.style.transform = `translateY(${offset * 0.7}px)`;
});

// ----------------------------------------------
// 12. 3D hover-эффект для карточек
// ----------------------------------------------
const cards = document.querySelectorAll('.card-modern');

cards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const xc = rect.width / 2;
    const yc = rect.height / 2;
    const dx = (x - xc) / 20;
    const dy = (y - yc) / 20;
    card.style.transform = `translateY(-6px) perspective(1000px) rotateX(${dy * -0.3}deg) rotateY(${dx * 0.3}deg)`;
  });
  
  card.addEventListener('mouseleave', () => {
    card.style.transform = 'translateY(0) perspective(1000px) rotateX(0deg) rotateY(0deg)';
  });
});

// ----------------------------------------------
// 13. Инициализация Swiper слайдера
// ----------------------------------------------
function initSwiper() {
  if (document.querySelector('.projects-swiper') && typeof Swiper !== 'undefined') {
    const swiper = new Swiper('.projects-swiper', {
      slidesPerView: 1,
      spaceBetween: 20,
      loop: true,
      autoplay: {
        delay: 4000,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        640: {
          slidesPerView: 1.2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 2,
          spaceBetween: 24,
        },
        1024: {
          slidesPerView: 2.5,
          spaceBetween: 30,
        },
      },
      effect: 'slide',
      speed: 800,
    });
  }
}

// ----------------------------------------------
// Запуск всех анимаций после загрузки
// ----------------------------------------------
window.addEventListener('load', () => {
  typeWriter();
  initCanvases();
  initSwiper();
});