/**
 * Dia dos Namorados — Experiência Romântica
 */

(function () {
  'use strict';

  // ── Elementos ──
  const screens = {
    intro: document.getElementById('screen-intro'),
    q1: document.getElementById('screen-q1'),
    q2: document.getElementById('screen-q2'),
    q3: document.getElementById('screen-q3'),
    gallery: document.getElementById('screen-gallery'),
    declaration: document.getElementById('screen-declaration'),
    credits: document.getElementById('screen-credits'),
  };

  const typingEl = document.getElementById('typing-text');
  const introButtonArea = document.getElementById('intro-button-area');
  const btnNextStep = document.getElementById('btn-next-step');
  const escapeMessage = document.getElementById('escape-message');
  const cinematicOverlay = document.getElementById('cinematic-overlay');
  const particlesCanvas = document.getElementById('particles-canvas');
  const gallerySlides = document.getElementById('gallery-slides');
  const galleryCaption = document.getElementById('gallery-caption');
  const romanticMusic = document.getElementById('romantic-music');
  const declarationLine = document.getElementById('declaration-line');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');

  let currentScreen = 'intro';
  let escapeAttempts = 0;
  let particlesAnimId = null;

  const ESCAPE_MESSAGES = [
    'Te amo ❤️',
    'Para sempre, meu amor 💕',
  ];

  const INTRO_TEXTS = [
    'Oi amor...',
    'Eu estava tão ansioso pra que hoje chegasse, mas fiz isso com todo o carinho pra você, meu amor. Esse é o mínimo que posso fazer por você, mas agora vamos pular pra parte legal.',
  ];

  // ── Utilitários ──
  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  // ── Transição cinematográfica ──
  async function cinematicTransition(callback) {
    const overlay = cinematicOverlay;
    overlay.classList.add('active', 'closing');
    spawnParticles(30);
    await wait(900);

    if (callback) callback();

    overlay.classList.remove('closing');
    overlay.classList.add('opening');
    await wait(900);

    overlay.classList.remove('active', 'opening');
    stopParticles();
  }

  function goToScreen(screenId) {
    Object.values(screens).forEach((s) => s.classList.remove('screen--active'));
    screens[screenId].classList.add('screen--active');
    currentScreen = screenId;
  }

  async function transitionTo(screenId) {
    await cinematicTransition(() => goToScreen(screenId));
  }

  // ── Efeito de digitação ──
  async function typeText(text, speed = 45) {
    for (let i = 0; i < text.length; i++) {
      typingEl.innerHTML = text.slice(0, i + 1) + '<span class="cursor"></span>';
      const char = text[i];
      const delay = char === '.' || char === ',' ? speed * 4 : char === ' ' ? speed * 0.5 : speed;
      await wait(delay + randomBetween(-10, 15));
    }
  }

  async function runIntroTyping() {
    await wait(800);
    await typeText(INTRO_TEXTS[0], 80);
    await wait(2000);
    typingEl.innerHTML = '';
    await typeText(INTRO_TEXTS[1], 35);
    await wait(600);
    typingEl.innerHTML = typingEl.textContent;
    introButtonArea.classList.remove('hidden');
    btnNextStep.style.left = '50%';
    btnNextStep.style.top = '50%';
  }

  // ── Botão que escapa (Tela 1) ──
  function getRandomPosition(button, container) {
    const padding = 16;
    const btnW = button.offsetWidth;
    const btnH = button.offsetHeight;
    const maxX = container.clientWidth - btnW - padding;
    const maxY = container.clientHeight - btnH - padding;

    return {
      x: randomBetween(padding, Math.max(padding, maxX)),
      y: randomBetween(padding, Math.max(padding, maxY)),
    };
  }

  function spawnFloatingHearts(x, y, count = 5) {
    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.className = 'floating-heart';
      heart.textContent = '❤️';
      heart.style.left = `${x + randomBetween(-30, 30)}px`;
      heart.style.top = `${y + randomBetween(-20, 20)}px`;
      heart.style.animationDelay = `${i * 0.15}s`;
      document.body.appendChild(heart);
      setTimeout(() => heart.remove(), 2500);
    }
  }

  btnNextStep.addEventListener('click', async (e) => {
    if (escapeAttempts < 2) {
      e.preventDefault();

      const rect = btnNextStep.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      escapeMessage.textContent = ESCAPE_MESSAGES[escapeAttempts];
      escapeMessage.classList.remove('hidden');
      spawnFloatingHearts(centerX, centerY);
      spawnParticles(15);

      const pos = getRandomPosition(btnNextStep, introButtonArea);
      btnNextStep.style.left = `${pos.x}px`;
      btnNextStep.style.top = `${pos.y}px`;
      btnNextStep.style.transform = 'none';

      escapeAttempts++;

      setTimeout(() => {
        escapeMessage.classList.add('hidden');
      }, 1800);

      return;
    }

    btnNextStep.classList.add('btn--ready');
    await transitionTo('q1');
    initQ1();
  });

  // ── Partículas / corações ──
  function spawnParticles(count = 20) {
    const ctx = particlesCanvas.getContext('2d');
    particlesCanvas.width = window.innerWidth;
    particlesCanvas.height = window.innerHeight;
    particlesCanvas.classList.add('active');

    const particles = [];
    const symbols = ['❤', '♥', '✦', '·'];

    for (let i = 0; i < count; i++) {
      particles.push({
        x: randomBetween(0, particlesCanvas.width),
        y: randomBetween(0, particlesCanvas.height),
        size: randomBetween(8, 18),
        speedY: randomBetween(-1.5, -0.3),
        speedX: randomBetween(-0.5, 0.5),
        opacity: randomBetween(0.2, 0.7),
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        rotation: randomBetween(0, 360),
      });
    }

    function animate() {
      ctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.rotation += 0.5;

        if (p.y < -20) {
          p.y = particlesCanvas.height + 20;
          p.x = randomBetween(0, particlesCanvas.width);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = p.opacity;
        ctx.font = `${p.size}px serif`;
        ctx.fillStyle = '#c9184a';
        ctx.fillText(p.symbol, 0, 0);
        ctx.restore();
      });

      particlesAnimId = requestAnimationFrame(animate);
    }

    if (particlesAnimId) cancelAnimationFrame(particlesAnimId);
    animate();

    setTimeout(stopParticles, 4000);
  }

  function stopParticles() {
    if (particlesAnimId) {
      cancelAnimationFrame(particlesAnimId);
      particlesAnimId = null;
    }
    particlesCanvas.classList.remove('active');
  }

  // ── Tela 2: Pergunta comida ──
  function initQ1() {
    const options = screens.q1.querySelectorAll('.btn--option');
    const feedback = document.getElementById('q1-feedback');

    options.forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (btn.dataset.answer === 'correct') {
          btn.classList.add('correct-flash');
          options.forEach((b) => (b.disabled = true));
          feedback.textContent = 'Acertei, né amor? ❤️';
          feedback.classList.remove('hidden');
          spawnParticles(25);
          await wait(3500);
          await transitionTo('q2');
          initQ2();
        } else {
          btn.style.opacity = '0.4';
          btn.disabled = true;
        }
      });
    });
  }

  // ── Tela 3: Nome da filha ──
  function initQ2() {
    const mirandaBtn = screens.q2.querySelector('[data-name="Miranda"]');
    const feedback = document.getElementById('q2-feedback');

    mirandaBtn.classList.add('btn--highlight');

    screens.q2.querySelectorAll('.btn--option').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (btn.dataset.name === 'Miranda') {
          screens.q2.querySelectorAll('.btn--option').forEach((b) => (b.disabled = true));
          feedback.textContent = 'Por que não Lourenza, amorzinho? 😂❤️';
          feedback.classList.remove('hidden');
          spawnParticles(20);
          await wait(4000);
          await transitionTo('q3');
          initQ3();
        } else {
          mirandaBtn.classList.add('correct-flash');
          btn.style.opacity = '0.35';
          setTimeout(() => {
            btn.style.opacity = '';
            mirandaBtn.classList.remove('correct-flash');
          }, 600);
        }
      });
    });
  }

  // ── Tela 4: Você me ama? ──
  function initQ3() {
    const loveButtonsContainer = screens.q3.querySelector('.love-buttons');

    btnNo.addEventListener('mouseenter', fleeNoButton);
    btnNo.addEventListener('touchstart', (e) => {
      e.preventDefault();
      fleeNoButton();
    }, { passive: false });

    function fleeNoButton() {
      const containerRect = loveButtonsContainer.getBoundingClientRect();
      const btnRect = btnNo.getBoundingClientRect();

      const maxX = containerRect.width - btnRect.width;
      const maxY = containerRect.height - btnRect.height;

      const newX = randomBetween(0, Math.max(0, maxX));
      const newY = randomBetween(0, Math.max(0, maxY));

      btnNo.style.position = 'absolute';
      btnNo.style.left = `${newX}px`;
      btnNo.style.top = `${newY}px`;
    }

    btnYes.addEventListener('click', async () => {
      spawnParticles(40);
      await transitionTo('gallery');
      initGallery();
    });
  }

  // ── Tela 5: Galeria ──
  async function resolvePhotoSrc(index) {
    const photo = SITE_CONFIG.photos[index];
    const fallback = SITE_CONFIG.photoFallbacks[index];

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(photo.src);
      img.onerror = () => resolve(fallback);
      img.src = photo.src;
    });
  }

  async function initGallery() {
    gallerySlides.innerHTML = '';

    const resolvedSrcs = await Promise.all(
      SITE_CONFIG.photos.map((_, i) => resolvePhotoSrc(i))
    );

    resolvedSrcs.forEach((src, i) => {
      const slide = document.createElement('div');
      slide.className = 'gallery-slide';
      slide.innerHTML = `<img src="${src}" alt="Memória ${i + 1}" loading="eager">`;
      gallerySlides.appendChild(slide);
    });

    romanticMusic.src = SITE_CONFIG.musicSrc;
    romanticMusic.volume = 0.6;

    try {
      await romanticMusic.play();
    } catch {
      document.addEventListener(
        'click',
        () => romanticMusic.play().catch(() => {}),
        { once: true }
      );
    }

    const duration = SITE_CONFIG.photoDuration || 5000;
    const slides = gallerySlides.querySelectorAll('.gallery-slide');

    for (let i = 0; i < slides.length; i++) {
      slides.forEach((s) => s.classList.remove('active'));
      slides[i].classList.add('active');

      galleryCaption.textContent = SITE_CONFIG.photos[i].caption;
      galleryCaption.classList.remove('visible');
      void galleryCaption.offsetWidth;
      galleryCaption.classList.add('visible');

      const img = slides[i].querySelector('img');
      img.style.animation = 'none';
      void img.offsetWidth;
      img.style.animation = `kenBurns ${duration}ms ease-out forwards`;

      await wait(duration);
    }

    galleryCaption.classList.remove('visible');

    const galleryContainer = screens.gallery.querySelector('.gallery-container');
    galleryContainer.style.transition = 'opacity 3s ease';
    galleryContainer.style.opacity = '0';

    for (let v = romanticMusic.volume; v > 0; v -= 0.03) {
      romanticMusic.volume = Math.max(0, v);
      await wait(100);
    }
    romanticMusic.pause();

    await wait(3200);
    goToScreen('declaration');
    initDeclaration();
  }

  // ── Tela 6: Declaração final ──
  async function initDeclaration() {
    const lines = ['Eu te amo.', 'Hoje.', 'Amanhã.', 'Para sempre.'];

    for (const line of lines) {
      declarationLine.classList.remove('visible');
      declarationLine.textContent = line;
      await wait(100);
      declarationLine.classList.add('visible');
      await wait(line === 'Para sempre.' ? 4000 : 2500);
    }

    await wait(2000);
    goToScreen('credits');
  }

  // ── Resize handler ──
  window.addEventListener('resize', () => {
    if (particlesCanvas.classList.contains('active')) {
      particlesCanvas.width = window.innerWidth;
      particlesCanvas.height = window.innerHeight;
    }
  });

  // ── Iniciar ──
  runIntroTyping();
})();
