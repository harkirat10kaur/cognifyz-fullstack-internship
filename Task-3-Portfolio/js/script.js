const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', () => { resize(); initParticles(); });

let mouse = { x: null, y: null };
window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null; });

const PARTICLE_COUNT = 100;
const CONNECTION_DISTANCE = 130;
const MOUSE_RADIUS = 160;
let particles = [];

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.radius = Math.random() * 1.8 + 0.8;
    this.opacity = Math.random() * 0.5 + 0.2;
    this.colorIndex = Math.floor(Math.random() * 3);
  }

  update() {
    if (mouse.x !== null) {
      const dx = mouse.x - this.x;
      const dy = mouse.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < MOUSE_RADIUS) {
        const force = (MOUSE_RADIUS - dist) / MOUSE_RADIUS;
        this.x += dx * force * 0.035;
        this.y += dy * force * 0.035;
      }
    }
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }

  draw() {
    const colors = [
      `rgba(0, 245, 255, ${this.opacity})`,
      `rgba(255, 107, 53, ${this.opacity})`,
      `rgba(255, 0, 128, ${this.opacity})`
    ];
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = colors[this.colorIndex];
    ctx.fill();
  }
}

function initParticles() {
  particles = [];
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
}

function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < CONNECTION_DISTANCE) {
        const opacity = (1 - dist / CONNECTION_DISTANCE) * 0.4;
        let lineColor;

        if (mouse.x !== null) {
          const midX = (particles[i].x + particles[j].x) / 2;
          const midY = (particles[i].y + particles[j].y) / 2;
          const mDist = Math.sqrt((mouse.x - midX) ** 2 + (mouse.y - midY) ** 2);
          if (mDist < MOUSE_RADIUS * 1.5) {
            lineColor = (i + j) % 2 === 0
              ? `rgba(0, 245, 255, ${opacity * 2})`
              : `rgba(255, 0, 128, ${opacity * 1.8})`;
          } else {
            lineColor = `rgba(140, 170, 187, ${opacity * 0.4})`;
          }
        } else {
          lineColor = `rgba(140, 170, 187, ${opacity * 0.4})`;
        }

        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  requestAnimationFrame(animate);
}

initParticles();
animate();

window.addEventListener('scroll', function () {
  const nav = document.getElementById('mainNav');
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

const titles = [
  'Full Stack Developer',
  'Computer Engineering Student',
  'Problem Solver',
  'Open to Internships'
];
let titleIndex = 0, charIndex = 0, isDeleting = false;
const typedEl = document.getElementById('typed-text');

function type() {
  const current = titles[titleIndex];
  typedEl.textContent = isDeleting
    ? current.substring(0, charIndex - 1)
    : current.substring(0, charIndex + 1);
  isDeleting ? charIndex-- : charIndex++;
  if (!isDeleting && charIndex === current.length) setTimeout(() => isDeleting = true, 1500);
  else if (isDeleting && charIndex === 0) { isDeleting = false; titleIndex = (titleIndex + 1) % titles.length; }
  setTimeout(type, isDeleting ? 55 : 95);
}
type();

function animateSkills() {
  document.querySelectorAll('.skill-fill').forEach(bar => {
    bar.style.width = bar.getAttribute('data-width') + '%';
  });
}

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      if (entry.target.closest('#skills')) animateSkills();
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.info-card, .project-card, .achievement-card, .skill-item, .stat-card, .tech-tag')
  .forEach(el => { el.classList.add('fade-in'); observer.observe(el); });

const skillsSection = document.getElementById('skills');
if (skillsSection) observer.observe(skillsSection);

const sections = document.querySelectorAll('section[id]');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) current = s.getAttribute('id'); });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) link.classList.add('active');
  });
});

function sendEmail() {
    const name    = document.getElementById('contactName').value.trim();
    const email   = document.getElementById('contactEmail').value.trim();
    const message = document.getElementById('contactMessage').value.trim();
    const errEl   = document.getElementById('contactError');
  
    if (!name || !email || !message) {
      errEl.style.display = 'block';
      return;
    }
  
    errEl.style.display = 'none';
  
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    
    window.location.href = `mailto:harkiratkaur.kh@gmail.com?subject=${subject}&body=${body}`;
  }