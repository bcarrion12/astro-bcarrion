export function runParticleField(canvas, getTheme) {
  const ctx = canvas.getContext('2d');
  let w, h, dpr = Math.min(window.devicePixelRatio || 1, 2);
  const N = 130;
  const stars = [];

  function resize() {
    w = canvas.clientWidth || window.innerWidth;
    h = canvas.clientHeight || window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);
  window.addEventListener('resize', resize);

  function spawnStar(s) {
    s.bx = Math.random(); s.by = Math.random();
    s.depth = 0.3 + Math.random() * 0.7;
    s.radius = 0.3 + Math.random() * 0.9;
    s.twinkleSpeed = 1 + Math.random() * 3;
    s.twinklePhase = Math.random() * Math.PI * 2;
    s.baseAlpha = 0.4 + Math.random() * 0.55;
    s.driftPhase = Math.random() * Math.PI * 2;
    s.driftSpeed = 0.25 + Math.random() * 0.5;
    s.lifeT = 0;
    s.lifeDur = 3 + Math.random() * 6;
  }
  for (let i = 0; i < N; i++) {
    const s = {};
    spawnStar(s);
    s.lifeT = Math.random() * s.lifeDur;
    stars.push(s);
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let mx = 0, my = 0, tmx = 0, tmy = 0;
  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    tmx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    tmy = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }
  if (!reducedMotion) window.addEventListener('mousemove', onMove);

  let last = performance.now();
  function frame(now) {
    now = now || performance.now();
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    mx += (tmx - mx) * dt * 4;
    my += (tmy - my) * dt * 4;
    ctx.clearRect(0, 0, w, h);
    const theme = getTheme();
    ctx.globalCompositeOperation = theme === 'dark' ? 'lighter' : 'source-over';
    const lightness = theme === 'dark' ? 92 : 25;
    const t = now / 1000;
    for (const s of stars) {
      s.lifeT += dt;
      if (s.lifeT >= s.lifeDur) spawnStar(s);
      const lp = s.lifeT / s.lifeDur;
      const envelope = lp < 0.2 ? lp / 0.2 : (lp > 0.8 ? (1 - lp) / 0.2 : 1);
      const driftX = Math.sin(t * s.driftSpeed + s.driftPhase) * 22;
      const driftY = Math.cos(t * s.driftSpeed * 0.8 + s.driftPhase) * 18;
      const x = s.bx * w + mx * 40 * s.depth + driftX;
      const y = s.by * h + my * 40 * s.depth + driftY;
      const twinkle = 0.5 + 0.5 * Math.sin(t * s.twinkleSpeed + s.twinklePhase);
      const alpha = s.baseAlpha * (0.4 + 0.6 * twinkle) * envelope;
      const r2 = s.radius * (8 + s.depth * 10);
      const grad = ctx.createRadialGradient(x, y, 0, x, y, r2);
      grad.addColorStop(0, `hsla(210,15%,${lightness}%,${alpha})`);
      grad.addColorStop(1, `hsla(210,15%,${lightness}%,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, r2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = `hsla(210,10%,${lightness}%,${Math.min(alpha * 1.2, 1)})`;
      ctx.arc(x, y, s.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  if (reducedMotion) {
    frame(performance.now());
    const redraw = () => frame(performance.now());
    window.addEventListener('resize', redraw);
    const themeBtn = document.querySelector('[data-theme-toggle]');
    themeBtn?.addEventListener('click', () => setTimeout(redraw, 0));
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', resize);
      window.removeEventListener('resize', redraw);
      themeBtn?.removeEventListener('click', redraw);
    };
  }

  const interval = setInterval(() => frame(performance.now()), 16);
  return () => { clearInterval(interval); ro.disconnect(); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); };
}

export function initTheme() {
  const stored = localStorage.getItem('bca_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', stored);
  return stored;
}

export function initLang() {
  const stored = localStorage.getItem('bca_lang') || 'es';
  document.documentElement.setAttribute('data-lang', stored);
  return stored;
}

export function wireGlobalControls() {
  const themeBtn = document.querySelector('[data-theme-toggle]');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('bca_theme', next);
    });
  }
  const langBtns = document.querySelectorAll('[data-lang-set]');
  const syncLangPressed = () => {
    const current = document.documentElement.getAttribute('data-lang');
    langBtns.forEach(b => b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-set') === current)));
  };
  syncLangPressed();
  langBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.getAttribute('data-lang-set');
      document.documentElement.setAttribute('data-lang', lang);
      localStorage.setItem('bca_lang', lang);
      syncLangPressed();
    });
  });
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.getElementById('nav-links');
  if (menuToggle && navLinks) {
    const closeMenu = () => {
      navLinks.classList.remove('mobile-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.textContent = '☰';
    };
    menuToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('mobile-open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.textContent = isOpen ? '✕' : '☰';
    });
    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  }

  document.querySelectorAll('.cta-solid').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rect = btn.getBoundingClientRect();
      const span = document.createElement('span');
      span.className = 'ripple';
      const size = 16;
      span.style.width = size + 'px';
      span.style.height = size + 'px';
      span.style.left = (e.clientX - rect.left) + 'px';
      span.style.top = (e.clientY - rect.top) + 'px';
      span.style.marginLeft = '-8px';
      span.style.marginTop = '-8px';
      btn.appendChild(span);
      setTimeout(() => span.remove(), 650);
    });
  });
}

export function initGalleryLightbox() {
  const overlay = document.getElementById('lightbox');
  if (!overlay || overlay.dataset.inited) return;
  overlay.dataset.inited = 'true';

  const triggers = Array.from(document.querySelectorAll('[data-lightbox-trigger]'));
  const imgEl = overlay.querySelector('[data-lightbox-img]');
  const closeBtn = overlay.querySelector('[data-lightbox-close]');
  const prevBtn = overlay.querySelector('[data-lightbox-prev]');
  const nextBtn = overlay.querySelector('[data-lightbox-next]');
  if (triggers.length === 0 || !imgEl) return;

  let current = -1;
  let lastFocused = null;

  function show(index) {
    current = (index + triggers.length) % triggers.length;
    const t = triggers[current];
    imgEl.src = t.dataset.full || '';
    imgEl.alt = t.getAttribute('aria-label') || '';
  }
  function open(index) {
    lastFocused = document.activeElement;
    show(index);
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
    document.body.style.overflow = 'hidden';
    closeBtn?.focus();
  }
  function close() {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
    document.body.style.overflow = '';
    imgEl.src = '';
    current = -1;
    if (lastFocused instanceof HTMLElement) lastFocused.focus();
  }

  triggers.forEach((t, i) => t.addEventListener('click', () => open(i)));
  closeBtn?.addEventListener('click', close);
  prevBtn?.addEventListener('click', () => show(current - 1));
  nextBtn?.addEventListener('click', () => show(current + 1));
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  document.addEventListener('keydown', (e) => {
    if (overlay.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowLeft') show(current - 1);
    else if (e.key === 'ArrowRight') show(current + 1);
  });
}

export function startCountdown(targetISO, ids) {
  const target = new Date(targetISO).getTime();
  function tick() {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    const vals = [d, h, m, s];
    ids.forEach((id, i) => {
      const el = document.getElementById(id);
      if (el) el.textContent = String(vals[i]).padStart(2, '0');
    });
  }
  tick();
  return setInterval(tick, 1000);
}
