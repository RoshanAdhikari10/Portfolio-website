/* ============================================================
   Roshan Adhikari — portfolio scripts
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k){ try { return localStorage.getItem(k); } catch { return null; } },
    set(k,v){ try { localStorage.setItem(k,v); } catch {} }
  };

  /* ---------- toast ---------- */
  const toast = $('#toast');
  let toastTimer;
  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  };

  /* ---------- preloader ---------- */
  const preloader = $('#preloader');
  const plFill = $('#plFill'), plNum = $('#plNum');
  if (preloader) {
    let p = 0;
    const tick = setInterval(() => {
      p = Math.min(100, p + Math.random() * 18 + 6);
      if (plFill) plFill.style.width = p + '%';
      if (plNum) plNum.textContent = Math.round(p) + '%';
      if (p >= 100) {
        clearInterval(tick);
        setTimeout(() => {
          preloader.classList.add('done');
          document.body.classList.remove('is-locked');
          startHero();
        }, 350);
      }
    }, reduceMotion ? 40 : 160);
    document.body.classList.add('is-locked');
  }

  /* ---------- theme ---------- */
  const root = document.documentElement;
  const themeBtn = $('#themeToggle');
  const applyTheme = (t) => {
    root.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.innerHTML = t === 'dark' ? "<i class='bx bx-sun'></i>" : "<i class='bx bx-moon'></i>";
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', t === 'dark' ? '#080b12' : '#f5f4f1');
  };
  applyTheme(store.get('theme') || 'dark');
  themeBtn?.addEventListener('click', () => {
    const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    store.set('theme', next);
  });

  /* ---------- nav / scroll state ---------- */
  const nav = $('#nav');
  const sections = $$('section[id]');
  const navIndicator = $('#navIndicator');
  const backToTop = $('.back-to-top');
  const progress = $('#progress');

  const onScroll = () => {
    const y = window.scrollY;
    const docH = document.body.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (docH > 0 ? (y / docH) * 100 : 0) + '%';
    if (backToTop) backToTop.classList.toggle('active', y > 420);

    const pos = y + 170;
    let current = null;
    sections.forEach(sec => {
      if (pos >= sec.offsetTop && pos < sec.offsetTop + sec.offsetHeight) current = sec.id;
    });
    $$('.nav-links a').forEach(a => {
      const on = a.getAttribute('href') === '#' + current;
      a.classList.toggle('active', on);
      if (on && navIndicator) {
        navIndicator.style.height = a.offsetHeight + 'px';
        navIndicator.style.transform = `translateY(${a.offsetTop}px)`;
      }
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- smooth scroll ---------- */
  const mobileMenu = $('#mobileMenu');
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.scrollto');
    if (!t) return;
    const id = t.getAttribute('href');
    if (!id || !id.startsWith('#')) return;
    const el = document.querySelector(id);
    if (!el) return;
    e.preventDefault();
    mobileMenu?.classList.remove('active');
    el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  });

  $('#navToggle')?.addEventListener('click', () => mobileMenu.classList.add('active'));
  $('#closeMenu')?.addEventListener('click', () => mobileMenu.classList.remove('active'));

  /* ---------- command palette ---------- */
  const palette = $('#palette'), palInput = $('#palInput'), palList = $('#palList');
  const palCommands = [
    { icon:'bx-home',        label:'Home',        hint:'section', go:'#hero' },
    { icon:'bx-user',        label:'About',       hint:'section', go:'#about' },
    { icon:'bx-layer',       label:'Services',    hint:'section', go:'#services' },
    { icon:'bx-code-alt',    label:'Skills',      hint:'section', go:'#skills' },
    { icon:'bx-folder',      label:'Projects',    hint:'section', go:'#projects' },
    { icon:'bx-briefcase',   label:'Experience',  hint:'section', go:'#experience' },
    { icon:'bx-git-branch',  label:'Process',     hint:'section', go:'#process' },
    { icon:'bx-envelope',    label:'Contact',     hint:'section', go:'#contact' },
    { icon:'bxl-github',     label:'GitHub profile',  hint:'link', url:'https://github.com/RoshanAdhikari10' },
    { icon:'bxl-linkedin',   label:'LinkedIn profile',hint:'link', url:'https://www.linkedin.com/in/roshan-adhikari-80b883320/' },
    { icon:'bxl-whatsapp',   label:'Message on WhatsApp', hint:'link', url:'https://wa.me/9779766009112' },
    { icon:'bx-mail-send',   label:'Email Roshan', hint:'link', url:'mailto:chhetrirosun@gmail.com' },
    { icon:'bx-download',    label:'Download resume', hint:'file', url:'assets/Roshan_Adhikari_CV.pdf' },
    { icon:'bx-adjust',      label:'Toggle light / dark theme', hint:'action', action:'theme' }
  ];
  let palFiltered = palCommands.slice(), palIndex = 0;

  const renderPal = () => {
    if (!palList) return;
    if (!palFiltered.length) { palList.innerHTML = '<div class="pal-empty">Nothing matches. Try “projects” or “email”.</div>'; return; }
    palList.innerHTML = palFiltered.map((c, i) =>
      `<div class="pal-item${i === palIndex ? ' sel' : ''}" data-i="${i}"><i class='bx ${c.icon}'></i>${c.label}<span class="hint">${c.hint}</span></div>`
    ).join('');
  };
  const runPal = (c) => {
    if (!c) return;
    closePal();
    if (c.action === 'theme') { themeBtn?.click(); return; }
    if (c.go) { document.querySelector(c.go)?.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); return; }
    if (c.url) {
      if (c.url.startsWith('http')) window.open(c.url, '_blank', 'noopener');
      else window.location.href = c.url;
    }
  };
  const openPal = () => {
    palette?.classList.add('open');
    palInput.value = ''; palFiltered = palCommands.slice(); palIndex = 0;
    renderPal(); setTimeout(() => palInput.focus(), 40);
  };
  const closePal = () => palette?.classList.remove('open');

  $('#palTrigger')?.addEventListener('click', openPal);
  palInput?.addEventListener('input', () => {
    const q = palInput.value.toLowerCase().trim();
    palFiltered = palCommands.filter(c => c.label.toLowerCase().includes(q) || c.hint.includes(q));
    palIndex = 0; renderPal();
  });
  palList?.addEventListener('click', (e) => {
    const item = e.target.closest('.pal-item');
    if (item) runPal(palFiltered[+item.dataset.i]);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); palette.classList.contains('open') ? closePal() : openPal(); return; }
    if (e.key === 'Escape') { closePal(); closeModal(); mobileMenu?.classList.remove('active'); }
    if (!palette?.classList.contains('open')) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); palIndex = (palIndex + 1) % palFiltered.length; renderPal(); }
    if (e.key === 'ArrowUp')   { e.preventDefault(); palIndex = (palIndex - 1 + palFiltered.length) % palFiltered.length; renderPal(); }
    if (e.key === 'Enter')     { e.preventDefault(); runPal(palFiltered[palIndex]); }
  });
  palette?.addEventListener('click', (e) => { if (e.target === palette) closePal(); });

  /* ---------- scroll reveal ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); obs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => ro.observe(el));
  } else revealEls.forEach(el => el.classList.add('in'));

  /* ---------- count-up stats ---------- */
  const counters = $$('[data-count]');
  const runCount = (el) => {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const dur = 1400; const t0 = performance.now();
    const step = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if ('IntersectionObserver' in window) {
    const co = new IntersectionObserver((en, obs) => {
      en.forEach(e => { if (e.isIntersecting) { runCount(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.6 });
    counters.forEach(c => co.observe(c));
  } else counters.forEach(c => c.textContent = c.dataset.count + (c.dataset.suffix || ''));

  /* ---------- skill bars ---------- */
  const fillGauge = (g) => {
    const fill = g.querySelector('.gauge-fill');
    const val = g.getAttribute('data-value');
    if (fill && val) requestAnimationFrame(() => fill.style.width = val + '%');
  };
  const gauges = $$('.gauge');
  if ('IntersectionObserver' in window) {
    const go = new IntersectionObserver((en, obs) => {
      en.forEach(e => { if (e.isIntersecting) { fillGauge(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    gauges.forEach(g => go.observe(g));
  } else gauges.forEach(fillGauge);

  /* ---------- skill rings ---------- */
  const rings = $$('[data-ring]');
  const fillRing = (card) => {
    const pct = +card.dataset.ring;
    const fg = card.querySelector('.ring-fg');
    const label = card.querySelector('.ring-val');
    if (fg) fg.style.strokeDashoffset = String(283 - (283 * pct) / 100);
    if (label) {
      const t0 = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - t0) / 1500);
        label.textContent = Math.round(pct * (1 - Math.pow(1 - p, 3))) + '%';
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  };
  if ('IntersectionObserver' in window) {
    const rgo = new IntersectionObserver((en, obs) => {
      en.forEach(e => { if (e.isIntersecting) { fillRing(e.target); obs.unobserve(e.target); } });
    }, { threshold: 0.4 });
    rings.forEach(r => rgo.observe(r));
  } else rings.forEach(fillRing);

  /* ---------- tabs (about) ---------- */
  $$('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      $$('.tab').forEach(t => t.classList.remove('active'));
      $$('.tab-panel').forEach(p => p.classList.remove('active'));
      tab.classList.add('active');
      $('#tab-' + tab.dataset.tab)?.classList.add('active');
    });
  });

  /* ---------- filters ---------- */
  const wireFilter = (barSel, itemSel) => {
    const bar = $(barSel);
    if (!bar) return;
    bar.addEventListener('click', (e) => {
      const btn = e.target.closest('.filter-btn');
      if (!btn) return;
      $$('.filter-btn', bar).forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      $$(itemSel).forEach(item => {
        const cats = (item.dataset.cat || '').split(' ');
        item.classList.toggle('hide', f !== 'all' && !cats.includes(f));
      });
    });
  };
  wireFilter('#skillFilter', '#skillsGrid .gauge');
  wireFilter('#projFilter', '#projectsGrid .tilt-card');

  /* ---------- project modal ---------- */
  const projectData = {
    quiz: {
      title: 'Quiz App',
      sub: 'React Native · Tailwind CSS · 2025',
      body: 'A mobile quiz application built during my internship and extended afterwards. Questions are timed, scored and stored locally, with animated transitions between screens and sound feedback on every answer.',
      features: [
        'Countdown timer with per-question scoring and a running leaderboard',
        'Animated screen transitions kept at 60fps on mid-range Android hardware',
        'Sound effects for correct, wrong and timeout states',
        'Reusable question and result components shared across categories'
      ],
      stack: ['React Native', 'Tailwind CSS', 'AsyncStorage'],
      code: 'https://github.com/RoshanAdhikari10/Quiz-App',
      live: 'https://drive.google.com/file/d/1rQACc7ZgPsUsdtRGShPQWFNJFJoqEjtG/view?usp=drive_link',
      liveLabel: 'Watch demo'
    },
    food: {
      title: 'FoodSathi',
      sub: 'HTML · CSS · JavaScript · 2024',
      body: 'A responsive front end for a food-ordering service. Built without a framework to keep the page light, with a dark mode that remembers your choice and scroll-triggered animation on each section.',
      features: [
        'Mobile-first layout that holds up from 320px to ultrawide',
        'Dark and light themes driven by CSS custom properties',
        'Scroll-triggered reveals using IntersectionObserver, not scroll listeners',
        'Semantic markup and meta tags for search visibility'
      ],
      stack: ['HTML5', 'CSS3', 'JavaScript'],
      code: 'https://github.com/RoshanAdhikari10/FoodSathi',
      live: 'https://roshanadhikari10.github.io/FoodSathi/',
      liveLabel: 'Visit site'
    },
    pong: {
      title: 'Ping Pong Game',
      sub: 'HTML Canvas · JavaScript · 2024',
      body: 'The classic Pong, rebuilt from scratch on a canvas element with no game library. Collision, scoring, sound and an AI paddle that gets harder as the rally goes on.',
      features: [
        'Custom game loop with requestAnimationFrame and delta timing',
        'AI opponent with adjustable reaction speed for difficulty levels',
        'Paddle and wall collision written from first principles',
        'Keyboard and touch controls, plus sound on every hit'
      ],
      stack: ['HTML Canvas', 'JavaScript', 'CSS'],
      code: 'https://github.com/roshanadhikari10/ping-pong-game',
      live: 'https://roshanadhikari10.github.io/Ping-pong-game/',
      liveLabel: 'Play now'
    }
  };

  const modal = $('#modal'), modalBox = $('#modalBox');
  const openModal = (key) => {
    const d = projectData[key];
    if (!d || !modal) return;
    modalBox.innerHTML = `
      <button class="modal-close" aria-label="Close">&times;</button>
      <h3 id="modalTitle">${d.title}</h3>
      <div class="m-sub mono">${d.sub}</div>
      <p style="color:var(--text-dim)">${d.body}</p>
      <h4>What it does</h4>
      <ul>${d.features.map(f => `<li>${f}</li>`).join('')}</ul>
      <h4>Built with</h4>
      <div class="tag-row">${d.stack.map(s => `<span class="tag">${s}</span>`).join('')}</div>
      <div class="modal-actions">
        <a class="btn btn-primary btn-sm" href="${d.code}" target="_blank" rel="noopener">View code</a>
        <a class="btn btn-ghost btn-sm" href="${d.live}" target="_blank" rel="noopener">${d.liveLabel}</a>
      </div>`;
    modal.classList.add('open');
    document.body.classList.add('is-locked');
    modalBox.querySelector('.modal-close').focus();
  };
  const closeModal = () => {
    modal?.classList.remove('open');
    document.body.classList.remove('is-locked');
  };
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-project]');
    if (trigger) { openModal(trigger.dataset.project); return; }
    if (e.target.closest('.modal-close') || e.target === modal) closeModal();
  });

  /* ---------- copy to clipboard ---------- */
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(btn.dataset.copy); showToast('Copied to clipboard'); }
      catch { showToast('Copy failed — select the text instead'); }
    });
  });

  /* ---------- spotlight on service cards ---------- */
  if (!reduceMotion) {
    $$('.svc').forEach(card => {
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
    });

    /* 3D tilt on project cards */
    $$('.tilt').forEach(card => {
      const strength = 9;
      card.addEventListener('pointermove', (e) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `perspective(1000px) rotateX(${(-py*strength).toFixed(2)}deg) rotateY(${(px*strength).toFixed(2)}deg) translateY(-5px)`;
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  /* ---------- marquee ---------- */
  const marqueeTrack = $('#marqueeTrack');
  if (marqueeTrack) {
    const items = [
      ['bxl-html5','HTML5'], ['bxl-css3','CSS3'], ['bxl-javascript','JavaScript'],
      ['bxl-react','React Native'], ['bxl-tailwind-css','Tailwind'], ['bxl-firebase','Firebase'],
      ['bxl-java','Java'], ['bxl-python','Python'], ['bxl-git','Git'], ['bxl-figma','Figma'],
      ['bxl-github','GitHub'], ['bx-server','Linux']
    ];
    const row = items.map(([i,l]) => `<span><i class='bx ${i}'></i>${l}</span>`).join('');
    marqueeTrack.innerHTML = row + row;
  }

  /* ---------- year ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- contact form ---------- */
  const form = $('#contactForm');
  const status = $('#form-status');
  const validate = (input) => {
    const row = input.closest('.form-row');
    const err = row?.querySelector('.err');
    let msg = '';
    if (!input.value.trim()) msg = 'This field is required.';
    else if (input.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.value)) msg = 'Enter a valid email address.';
    else if (input.id === 'message' && input.value.trim().length < 10) msg = 'Add a little more detail (10+ characters).';
    row?.classList.toggle('invalid', !!msg);
    if (err) err.textContent = msg;
    return !msg;
  };

  if (form) {
    $$('input[required], textarea[required]', form).forEach(input => {
      input.addEventListener('blur', () => validate(input));
      input.addEventListener('input', () => { if (input.closest('.form-row').classList.contains('invalid')) validate(input); });
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fields = $$('input[required], textarea[required]', form);
      const ok = fields.map(validate).every(Boolean);
      if (!ok) {
        status.textContent = 'Check the highlighted fields above.';
        status.style.color = '#ff7a6e';
        return;
      }
      const submitBtn = form.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      status.textContent = 'Sending…';
      status.style.color = 'var(--glacier)';

      try {
        const res = await fetch(form.action, {
          method: form.method,
          body: new FormData(form),
          headers: { Accept: 'application/json' }
        });
        let data;
        try { data = await res.json(); } catch { data = { success: res.ok }; }
        if (data.success) {
          status.textContent = 'Message sent. I\'ll reply within a day.';
          status.style.color = 'var(--mint)';
          form.reset();
          showToast('Message sent');
          setTimeout(() => status.textContent = '', 6000);
        } else {
          status.textContent = 'That didn\'t send. Try again, or email chhetrirosun@gmail.com.';
          status.style.color = '#ff7a6e';
        }
      } catch {
        status.textContent = 'No connection. Check your network and send again.';
        status.style.color = '#ff7a6e';
      } finally {
        submitBtn.disabled = false;
      }
    });
  }

  /* ---------- typed role line + terminal (started after preloader) ---------- */
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return;
    heroStarted = true;

    const typedEl = $('.typed');
    if (typedEl && window.Typed) {
      const items = typedEl.getAttribute('data-typed-items').split(',').map(s => s.trim());
      new Typed('.typed', { strings: items, typeSpeed: 65, backSpeed: 32, backDelay: 1600, loop: true, smartBackspace: true });
    }

    const term = $('#termBody');
    if (!term) return;
    const lines = [
      `<span class="c">// profile.js</span>`,
      `<span class="k">const</span> roshan = {`,
      `  role: <span class="s">"Web &amp; Mobile Developer"</span>,`,
      `  base: <span class="s">"Pokhara, Nepal"</span>,`,
      `  stack: [<span class="s">"React Native"</span>, <span class="s">"JavaScript"</span>, <span class="s">"Firebase"</span>],`,
      `  ships: <span class="p">true</span>,`,
      `  open: <span class="p">"to full-time &amp; freelance"</span>`,
      `};`,
      `<span class="c">// → say hello: chhetrirosun@gmail.com</span>`
    ];
    if (reduceMotion) {
      term.innerHTML = lines.map(l => `<div class="ln">${l}</div>`).join('');
      return;
    }
    let li = 0;
    const writeLine = () => {
      if (li >= lines.length) {
        const last = term.lastElementChild;
        if (last) last.insertAdjacentHTML('beforeend', '<span class="term-cursor"></span>');
        return;
      }
      const div = document.createElement('div');
      div.className = 'ln';
      div.innerHTML = lines[li];
      div.style.opacity = '0';
      term.appendChild(div);
      requestAnimationFrame(() => {
        div.style.transition = 'opacity .35s ease';
        div.style.opacity = '1';
      });
      li++;
      setTimeout(writeLine, 230);
    };
    writeLine();
  }
  // fallback in case the preloader never fires
  setTimeout(startHero, 4000);

  /* ============================================================
     3D hero scene — particle network + code glyphs
     ============================================================ */
  const canvas = document.getElementById('bp-canvas');
  if (canvas && window.THREE && !reduceMotion) {
    const hero = document.getElementById('hero');
    let width = hero.clientWidth, height = hero.clientHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 1.6, 9);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);

    const NODE_COUNT = 90;
    const palette = [0xff6b4a, 0xffb347, 0x4ac9ff];
    const nodes = [];

    function circleTexture(color) {
      const size = 64;
      const cnv = document.createElement('canvas');
      cnv.width = cnv.height = size;
      const ctx = cnv.getContext('2d');
      const hex = '#' + color.toString(16).padStart(6, '0');
      const grad = ctx.createRadialGradient(size/2, size/2, 0, size/2, size/2, size/2);
      grad.addColorStop(0, hex);
      grad.addColorStop(0.4, hex);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(cnv);
    }

    for (let i = 0; i < NODE_COUNT; i++) {
      nodes.push({
        x: (Math.random() - 0.5) * 23,
        y: (Math.random() - 0.5) * 14 + 2,
        z: -Math.random() * 22 - 1,
        colorIdx: i % palette.length
      });
    }

    const nodeGroup = new THREE.Group();
    const nodeTextures = palette.map(circleTexture);
    palette.forEach((color, ci) => {
      const group = nodes.filter(n => n.colorIdx === ci);
      const posArr = new Float32Array(group.length * 3);
      group.forEach((n, i) => { posArr[i*3] = n.x; posArr[i*3+1] = n.y; posArr[i*3+2] = n.z; });
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(posArr, 3));
      const mat = new THREE.PointsMaterial({
        map: nodeTextures[ci], color, size: 0.32, transparent: true,
        opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending
      });
      nodeGroup.add(new THREE.Points(geo, mat));
    });

    const maxDist = 5.1;
    const edgePositions = [], edgeColors = [];
    const cA = new THREE.Color(0xff6b4a), cB = new THREE.Color(0x4ac9ff);
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y, a.z - b.z);
        if (d < maxDist) {
          edgePositions.push(a.x, a.y, a.z, b.x, b.y, b.z);
          const col = cA.clone().lerp(cB, d / maxDist);
          edgeColors.push(col.r, col.g, col.b, col.r, col.g, col.b);
        }
      }
    }
    const edgeGeo = new THREE.BufferGeometry();
    edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePositions, 3));
    edgeGeo.setAttribute('color', new THREE.Float32BufferAttribute(edgeColors, 3));
    nodeGroup.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({
      vertexColors: true, transparent: true, opacity: 0.15
    })));
    scene.add(nodeGroup);

    function glyphTexture(text, color) {
      const size = 128;
      const cnv = document.createElement('canvas');
      cnv.width = cnv.height = size;
      const ctx = cnv.getContext('2d');
      ctx.font = '600 58px "JetBrains Mono", monospace';
      ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.shadowColor = color; ctx.shadowBlur = 18;
      ctx.fillText(text, size / 2, size / 2 + 4);
      return new THREE.CanvasTexture(cnv);
    }
    const glyphDefs = ['</>', '{ }', '=>', '#!', '( )', '[ ]', '&&', '::'];
    const glyphColors = ['#ff6b4a', '#ffb347', '#4ac9ff'];
    const glyphSprites = glyphDefs.map((g, i) => {
      const mat = new THREE.SpriteMaterial({ map: glyphTexture(g, glyphColors[i % 3]), transparent: true, opacity: 0.45, depthWrite: false });
      const sprite = new THREE.Sprite(mat);
      const scale = 1 + Math.random() * 0.6;
      sprite.scale.set(scale, scale, 1);
      sprite.position.set((Math.random() - 0.5) * 17, (Math.random() - 0.5) * 8 + 2, -Math.random() * 14 - 2);
      sprite.userData.phase = Math.random() * Math.PI * 2;
      sprite.userData.baseY = sprite.position.y;
      return sprite;
    });
    glyphSprites.forEach(s => scene.add(s));

    let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
    window.addEventListener('pointermove', (e) => {
      mouseX = e.clientX / window.innerWidth - 0.5;
      mouseY = e.clientY / window.innerHeight - 0.5;
    });

    const applyFog = () => {
      const light = document.documentElement.getAttribute('data-theme') === 'light';
      scene.fog = new THREE.FogExp2(light ? 0xf5f4f1 : 0x080b12, 0.05);
      glyphSprites.forEach(s => s.material.opacity = light ? 0.3 : 0.45);
    };
    applyFog();
    themeBtn?.addEventListener('click', () => setTimeout(applyFog, 30));

    const resize = () => {
      width = hero.clientWidth; height = hero.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', resize);

    let visible = true;
    document.addEventListener('visibilitychange', () => { visible = !document.hidden; });

    const clock = new THREE.Clock();
    (function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      const t = clock.getElapsedTime();

      targetX += (mouseX - targetX) * 0.03;
      targetY += (mouseY - targetY) * 0.03;
      camera.position.x = targetX * 2.2;
      camera.position.y = 1.6 - targetY * 1.1;
      camera.lookAt(0, 0.6, -2);

      nodeGroup.rotation.y = t * 0.024;
      nodeGroup.position.y = Math.sin(t * 0.15) * 0.3;
      glyphSprites.forEach(s => {
        s.position.y = s.userData.baseY + Math.sin(t * 0.6 + s.userData.phase) * 0.4;
        s.material.rotation = Math.sin(t * 0.2 + s.userData.phase) * 0.06;
      });

      renderer.render(scene, camera);
    })();
  }
});
