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
  const galleryBgHearts = document.getElementById('gallery-bg-hearts');
  const galleryFrame = document.querySelector('.gallery-frame');
  const romanticMusic = document.getElementById('romantic-music');
  const finaleMusic = document.getElementById('finale-music');
  const declarationLine = document.getElementById('declaration-line');
  const creditsLine = document.getElementById('credits-line');
  const btnFinale = document.getElementById('btn-finale');
  const btnYes = document.getElementById('btn-yes');
  const btnNo = document.getElementById('btn-no');

  let currentScreen = 'intro';
  let escapeAttempts = 0;
  let particlesAnimId = null;
  let galleryHeartsInterval = null;
  let musicStarted = false;
  let musicStartTime = 0;
  let finaleMusicStarted = false;

  const ESCAPE_MESSAGES = [
    'Te amo ❤️',
    'Para sempre, meu amor 💕',
  ];

  const TRANSITION_MS = 900;

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
      await startRomanticMusic();
      await transitionTo('gallery');
      initGallery();
    });
  }

  // ── Música romântica ──
  async function startRomanticMusic() {
    if (musicStarted) return;
    romanticMusic.src = SITE_CONFIG.musicSrc;
    romanticMusic.volume = 0.65;
    romanticMusic.loop = false;

    try {
      await romanticMusic.play();
      musicStarted = true;
      musicStartTime = Date.now();
    } catch {
      await wait(300);
      try {
        await romanticMusic.play();
        musicStarted = true;
        musicStartTime = Date.now();
      } catch {
        /* autoplay bloqueado — tentará na galeria */
      }
    }
  }

  // ── Corações voando no fundo rosa ──
  const HEART_SYMBOLS = ['❤️', '💕', '💗', '♥', '💖', '🩷'];

  function spawnBgHeart() {
    const screen = screens.gallery;
    if (!galleryBgHearts || !screen) return;

    const w = screen.offsetWidth;
    const heart = document.createElement('span');
    heart.className = 'gallery-bg-heart';
    heart.textContent = HEART_SYMBOLS[Math.floor(Math.random() * HEART_SYMBOLS.length)];
    heart.style.left = `${randomBetween(0, Math.max(0, w - 30))}px`;
    heart.style.fontSize = `${randomBetween(14, 26)}px`;
    heart.style.setProperty('--drift', `${randomBetween(-60, 60)}px`);
    heart.style.setProperty('--spin', `${randomBetween(90, 360)}deg`);
    heart.style.animationDuration = `${randomBetween(5, 9)}s`;

    galleryBgHearts.appendChild(heart);
    heart.addEventListener('animationend', () => heart.remove());
  }

  function startGalleryHearts() {
    stopGalleryHearts();
    for (let i = 0; i < 14; i++) {
      setTimeout(spawnBgHeart, i * 120);
    }
    galleryHeartsInterval = setInterval(spawnBgHeart, 450);
  }

  function stopGalleryHearts() {
    if (galleryHeartsInterval) {
      clearInterval(galleryHeartsInterval);
      galleryHeartsInterval = null;
    }
    if (galleryBgHearts) galleryBgHearts.innerHTML = '';
  }

  // ── Transição entre fotos ──
  function buildGallerySlides() {
    gallerySlides.innerHTML = '';
    const slideA = document.createElement('div');
    const slideB = document.createElement('div');
    slideA.className = 'gallery-slide';
    slideB.className = 'gallery-slide';
    slideA.innerHTML = '<img alt="Nossa memória">';
    slideB.innerHTML = '<img alt="Nossa memória">';
    gallerySlides.appendChild(slideA);
    gallerySlides.appendChild(slideB);
    return { slideA, slideB };
  }

  async function transitionPhoto(slides, src, alt, isFirst) {
    const { slideA, slideB, useA } = slides;
    const incoming = useA ? slideA : slideB;
    const outgoing = useA ? slideB : slideA;
    const img = incoming.querySelector('img');

    img.src = src;
    img.alt = alt;

    if (isFirst) {
      incoming.classList.add('active', 'slide-enter');
      await wait(TRANSITION_MS);
      incoming.classList.remove('slide-enter');
      slides.useA = false;
      return;
    }

    outgoing.classList.add('slide-exit');
    incoming.classList.add('active', 'slide-enter');

    await wait(TRANSITION_MS);

    outgoing.classList.remove('active', 'slide-exit');
    incoming.classList.remove('slide-enter');
    slides.useA = !useA;
  }

  // ── Tela 5: Galeria ──
  async function resolvePhotoSrc(index) {
    const photos = SITE_CONFIG.photos;
    const photo = photos[index];
    if (!photo) return SITE_CONFIG.photoFallbacks[0];

    const fallbacks = SITE_CONFIG.photoFallbacks || [];
    const fallback = fallbacks[index] || fallbacks[fallbacks.length - 1] || photo.src;

    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(photo.src);
      img.onerror = () => resolve(fallback);
      img.src = photo.src;
    });
  }

  async function initGallery() {
    gallerySlides.innerHTML = '';
    galleryCaption.classList.remove('visible');
    galleryCaption.classList.add('hidden');

    if (galleryFrame) {
      galleryFrame.style.opacity = '';
      galleryFrame.style.transform = '';
    }
    screens.gallery.classList.remove('screen--fading');

    const photoDuration = SITE_CONFIG.photoDuration || 10000;
    const photos = SITE_CONFIG.photos;

    if (!musicStarted) {
      await startRomanticMusic();
    }

    if (!musicStartTime) {
      musicStartTime = Date.now();
    }

    startGalleryHearts();

    const slides = buildGallerySlides();
    slides.useA = true;

    const musicDuration = SITE_CONFIG.musicDuration || 100000;
    const musicEndTime = musicStartTime + musicDuration;
    let slot = 0;

    while (Date.now() < musicEndTime && !romanticMusic.ended && slot < photos.length) {
      const photoIndex = slot;
      const src = await resolvePhotoSrc(photoIndex);
      const alt = photos[photoIndex].caption || `Memória ${photoIndex + 1}`;

      await transitionPhoto(slides, src, alt, slot === 0);

      const caption = photos[photoIndex].caption;
      const isLastPhoto = photoIndex === photos.length - 1;

      if (isLastPhoto || !caption) {
        galleryCaption.textContent = '';
        galleryCaption.classList.add('hidden');
        galleryCaption.classList.remove('visible');
      } else {
        galleryCaption.classList.remove('hidden');
        galleryCaption.textContent = caption;
        galleryCaption.classList.remove('visible');
        void galleryCaption.offsetWidth;
        galleryCaption.classList.add('visible');
      }

      const remaining = musicEndTime - Date.now();
      const waitTime = Math.min(photoDuration - TRANSITION_MS, remaining);
      if (waitTime <= 0) break;

      await wait(waitTime);
      slot++;
    }

    stopGalleryHearts();
    galleryCaption.classList.remove('visible');
    galleryCaption.classList.add('hidden');

    fadeOutMusic();

    await fadeGalleryToDeclaration();

    declarationLine.classList.remove('visible');
    declarationLine.textContent = '';
    await wait(600);
    initDeclaration();
  }

  function fadeOutMusic() {
    if (romanticMusic.paused) return;

    const step = romanticMusic.volume / 20;
    const interval = setInterval(() => {
      if (romanticMusic.volume > step) {
        romanticMusic.volume = Math.max(0, romanticMusic.volume - step);
      } else {
        romanticMusic.volume = 0;
        romanticMusic.pause();
        clearInterval(interval);
      }
    }, 100);
  }

  async function fadeGalleryToDeclaration() {
    const galleryScreen = screens.gallery;

    if (galleryFrame) {
      galleryFrame.style.opacity = '0';
      galleryFrame.style.transform = 'scale(0.96)';
    }

    galleryScreen.classList.add('screen--fading');
    await wait(2600);

    goToScreen('declaration');

    if (galleryFrame) {
      galleryFrame.style.opacity = '';
      galleryFrame.style.transform = '';
    }
    galleryScreen.classList.remove('screen--fading');
  }

  // ── Música do encerramento ──
  async function startFinaleMusic() {
    if (finaleMusicStarted || !finaleMusic) return;

    finaleMusic.src = SITE_CONFIG.finaleMusicSrc || SITE_CONFIG.musicSrc;
    finaleMusic.volume = 0;
    finaleMusic.loop = true;

    try {
      await finaleMusic.play();
      finaleMusicStarted = true;
      fadeInVolume(finaleMusic, 0.6, 2000);
    } catch {
      try {
        await finaleMusic.play();
        finaleMusicStarted = true;
        fadeInVolume(finaleMusic, 0.6, 2000);
      } catch {
        /* autoplay bloqueado */
      }
    }
  }

  function fadeInVolume(audio, targetVolume, durationMs) {
    const steps = 20;
    const stepTime = durationMs / steps;
    const increment = targetVolume / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      audio.volume = Math.min(targetVolume, increment * step);
      if (step >= steps) clearInterval(interval);
    }, stepTime);
  }

  // ── Fade de texto (declaração e créditos) ──
  async function showFadeLine(element, text, holdMs = 2500, extraClass = '') {
    element.classList.remove('visible', 'declaration-line--name');
    if (extraClass) element.classList.add(extraClass);
    element.textContent = text;
    await wait(150);
    element.classList.add('visible');
    await wait(holdMs);
  }

  // ── Tela 6: Declaração final ──
  async function initDeclaration() {
    await startFinaleMusic();

    const lines = ['Eu te amo.', 'Hoje.', 'Amanhã.', 'Para sempre.'];

    for (const line of lines) {
      const hold = line === 'Para sempre.' ? 4000 : 2500;
      await showFadeLine(declarationLine, line, hold);
    }

    await wait(1500);
    goToScreen('credits');
    creditsLine.classList.remove('visible', 'declaration-line--name');
    creditsLine.textContent = '';
    btnFinale.classList.add('hidden');
    btnFinale.classList.remove('visible', 'clicked');
    initCredits();
  }

  // ── Pós-créditos: "eu te amo" em vários idiomas ──
  async function initCredits() {
    const translations = SITE_CONFIG.loveTranslations || [];
    const finale = SITE_CONFIG.finaleLines || [];

    for (const line of translations) {
      await showFadeLine(creditsLine, line, 2200);
    }

    await wait(800);

    for (let i = 0; i < finale.length; i++) {
      const hold = 3500;
      await showFadeLine(creditsLine, finale[i], hold);
    }

    await wait(1000);
    await showFadeLine(creditsLine, SITE_CONFIG.finalLoveLine || 'eu te amo.', 3500);

    creditsLine.classList.remove('visible');
    await wait(600);

    creditsLine.classList.remove('declaration-line--name');
    creditsLine.classList.add('declaration-line--name');
    creditsLine.textContent = (SITE_CONFIG.herName || 'Laura').toUpperCase();
    await wait(200);
    creditsLine.classList.add('visible');

    await wait(3500);

    btnFinale.textContent = SITE_CONFIG.finaleButtonText || 'eu também te amo, meu amor';
    btnFinale.classList.remove('hidden', 'clicked');
    await wait(100);
    btnFinale.classList.add('visible');
  }

  btnFinale.addEventListener('click', () => {
    btnFinale.classList.add('clicked');
    spawnParticles(50);

    const rect = btnFinale.getBoundingClientRect();
    spawnFloatingHearts(rect.left + rect.width / 2, rect.top + rect.height / 2, 12);
  });

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
