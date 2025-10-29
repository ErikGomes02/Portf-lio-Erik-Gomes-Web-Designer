// script.js - Interações: menu, modal, formulário simples + animações de zoom e partículas

document.addEventListener('DOMContentLoaded', function() {
  // -------- ANO NO RODAPÉ --------
  document.getElementById('year').textContent = new Date().getFullYear();

  // -------- MENU MOBILE --------
  const navToggle = document.getElementById('navToggle');
  const navList = document.getElementById('navList');
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const expanded = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!expanded));
      if (!expanded) {
        navList.style.display = 'flex';
        navList.style.flexDirection = 'column';
        navToggle.textContent = '✕';
      } else {
        navList.style.display = '';
        navToggle.textContent = '☰';
      }
    });
  }

  // -------- MODAL DE PROJETOS --------
  const modal = document.getElementById('projectModal');
  const modalBody = document.getElementById('modalBody');
  const modalClose = modal.querySelector('.modal-close');

  function openModal(title, content) {
    modal.setAttribute('aria-hidden', 'false');
    modalBody.innerHTML = `<h4>${title}</h4><p>${content}</p>`;
    modal.querySelector('.modal-close').focus();
  }

  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    modalBody.innerHTML = '';
  }

  document.querySelectorAll('.project .btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const article = e.target.closest('.project');
      const title = article.querySelector('h3').textContent;
      const desc = article.getAttribute('data-desc') || 'Detalhes do projeto.';
      openModal(title, desc + ' — Posso desenvolver essa solução para o seu negócio com foco em usabilidade e conversão.');
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // -------- FORMULÁRIO --------
  const form = document.getElementById('contactForm');
  const formMessage = document.getElementById('formMessage');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    formMessage.textContent = '';
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (name.length < 2) { formMessage.textContent = 'Por favor, insira um nome válido.'; form.name.focus(); return; }
    if (!/^\S+@\S+\.\S+$/.test(email)) { formMessage.textContent = 'Por favor, insira um email válido.'; form.email.focus(); return; }
    if (message.length < 10) { formMessage.textContent = 'Digite uma mensagem mais detalhada (mín. 10 caracteres).'; form.message.focus(); return; }

    formMessage.textContent = 'Enviando...';
    setTimeout(() => {
      formMessage.textContent = 'Mensagem enviada! Responderei em breve. Obrigado.';
      form.reset();
    }, 900);
  });

  // -------- ACESSIBILIDADE EM PROJETOS --------
  document.querySelectorAll('.project').forEach(card => {
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        card.querySelector('.btn')?.click();
      }
    });
  });

  // ==================================================
  //        🔹 EFEITO DE ZOOM SUAVE EM BOTÕES E PROJETOS
  // ==================================================
  const zoomables = document.querySelectorAll('.btn, .project');
  zoomables.forEach(el => {
    el.style.transition = 'transform 0.25s ease, box-shadow 0.25s ease';
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.04)';
      el.style.boxShadow = '0 6px 18px rgba(124,58,237,0.25)';
    });
    el.addEventListener('mouseleave', () => {
      el.style.transform = 'scale(1)';
      el.style.boxShadow = 'none';
    });
  });

  // ==================================================
  //       ✨ EFEITO DE PARTÍCULAS (POEIRA DE BRILHO)
  // ==================================================
  const particleCanvas = document.createElement('canvas');
  particleCanvas.id = 'particleCanvas';
  particleCanvas.style.position = 'fixed';
  particleCanvas.style.top = '0';
  particleCanvas.style.left = '0';
  particleCanvas.style.width = '100%';
  particleCanvas.style.height = '100%';
  particleCanvas.style.pointerEvents = 'none';
  particleCanvas.style.zIndex = '1';
  document.body.appendChild(particleCanvas);

  const ctx = particleCanvas.getContext('2d');
  let width = (particleCanvas.width = window.innerWidth);
  let height = (particleCanvas.height = window.innerHeight);
  window.addEventListener('resize', () => {
    width = particleCanvas.width = window.innerWidth;
    height = particleCanvas.height = window.innerHeight;
  });

  const particles = [];
  const particleCount = 30;
  const mouse = { x: width / 2, y: height / 2 };

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x = mouse.x;
      this.y = mouse.y;
      this.size = Math.random() * 2 + 1;
      this.speedX = (Math.random() - 0.5) * 1.2;
      this.speedY = (Math.random() - 0.5) * 1.2;
      this.alpha = Math.random() * 0.5 + 0.3;
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.alpha -= 0.005;
      if (this.alpha <= 0) this.reset();
    }
    draw() {
      ctx.fillStyle = `rgba(255,255,255,${this.alpha})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI*2);
      ctx.fill();
    }
  }

  for(let i=0;i<particleCount;i++){particles.push(new Particle());}

  window.addEventListener('mousemove', (e)=>{ mouse.x=e.clientX; mouse.y=e.clientY; });

  function animateParticles(){
    ctx.clearRect(0,0,width,height);
    particles.forEach(p=>{
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }

  animateParticles();
});
