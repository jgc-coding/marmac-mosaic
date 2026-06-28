/* ============================================================
   MacMarMosaics — main.js
   Module:
     1. i18n init + Sprachschalter
     2. Scroll-Reveal für [data-reveal]
     3. Top-Nav-Reveal (Nav erscheint smooth nach dem Hero)
     4. Submenu-Toggle
     5. Galerie — kontinuierlicher Endlos-Loop (Marquee) + Tabs
     6. Detail-Overlay (Mosaik groß, Original klein, Vor/Zurück, Zoom)
     7. Font-Switcher (URL-Param ?fonts=picker)
     8. Menü-Stil-Picker (?menu=picker)

   Animations-Slot-Doku:
     - Pro Werk in works.js ein "animation"-Pfad setzen (MP4 H.264
       1080p ≤ 8 MB empfohlen, optional WebM zusätzlich).
     - main.js hängt automatisch <video> in .detail__animation und
       blendet das Mosaik/Original-Paar aus (Klasse .has-animation).
   ============================================================ */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. i18n init + Sprachschalter
     ============================================================ */
  if (window.I18N) {
    window.I18N.init();
    document.querySelectorAll('[data-lang-switch]').forEach(btn => {
      btn.addEventListener('click', () => {
        const next = (window.I18N.current === 'de') ? 'en' : 'de';
        window.I18N.setLanguage(next);
      });
    });
  }

  /* ============================================================
     2. Scroll-Reveal
     ============================================================ */
  const revealTargets = document.querySelectorAll('[data-reveal]');
  if (reduceMotion) {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const ro = new IntersectionObserver((entries, obs) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealTargets.forEach(el => ro.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('is-visible'));
  }

  /* ============================================================
     3. Top-Nav-Reveal — Nav erscheint smooth, sobald der Hero
     den Viewport verlässt (IntersectionObserver auf #hero).
     ============================================================ */
  const nav  = document.getElementById('nav');
  const hero = document.getElementById('hero');
  if (nav && hero && !nav.classList.contains('nav--always') && 'IntersectionObserver' in window) {
    const heroObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 0.15) nav.classList.add('is-revealed');
        else                                nav.classList.remove('is-revealed');
      },
      { threshold: [0, 0.15, 0.5, 1] }
    );
    heroObserver.observe(hero);
  } else if (nav) {
    nav.classList.add('is-revealed');
  }

  /* ============================================================
     4. Submenu-Toggle
     ============================================================ */
  const submenuToggles = document.querySelectorAll('[data-submenu-toggle]');

  function closeAllSubmenus(except) {
    submenuToggles.forEach(t => { if (t !== except) t.setAttribute('aria-expanded', 'false'); });
  }

  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen) {
        e.preventDefault();
        closeAllSubmenus(toggle);
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('[data-submenu-toggle]') && !e.target.closest('.submenu')) {
      closeAllSubmenus();
    }
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllSubmenus();
  });

  /* Kleine i18n-Helfer (auch von Galerie + Detail genutzt). */
  function t(key, fallback) {
    return (window.I18N && window.I18N.t(key)) || fallback;
  }
  function workDesc(work) {
    if (window.I18N && window.I18N.current === 'en' && work.desc_en) return work.desc_en;
    return work.desc;
  }
  function workCaption(work) {
    if (window.I18N && window.I18N.current === 'en' && work.caption_en) return work.caption_en;
    return work.caption || '';
  }

  /* ============================================================
     5. Galerie — kontinuierlicher Loop (Marquee) + Tabs
     - Übersicht zeigt NUR Mosaike (Briefing 4); das Original
       erscheint klein im Detail-Overlay.
     - Endlos-Loop: die Karten-Liste wird vervielfacht und der Track
       gleichmäßig (requestAnimationFrame) nach links geschoben; nach
       genau EINER Listenbreite zurückgesetzt → nahtlos, kein sichtbares
       Zurückspringen an den Anfang.
     - Pausiert bei Hover/Touch und wenn der Tab im Hintergrund ist.
     - Pfeile schubsen manuell vor/zurück.
     - 1 Werk → statisch zentriert; prefers-reduced-motion → kein
       Auto-Lauf, dafür nativ scroll-/pfeilbar.
     ============================================================ */
  const tabsContainer   = document.querySelector('[data-tabs]');
  const tabs            = tabsContainer ? tabsContainer.querySelectorAll('[data-category]') : [];
  const track           = document.querySelector('[data-carousel-track]');
  const viewport        = document.querySelector('[data-carousel-viewport]');
  const prevBtn         = document.querySelector('[data-carousel-prev]');
  const nextBtn         = document.querySelector('[data-carousel-next]');
  const emptyEl         = document.querySelector('[data-carousel-empty]');
  const categoryAnchors = document.querySelectorAll('[data-category]');

  const SPEED = 38;            // px pro Sekunde — sanfter Lauf
  let currentCategory = 'ikonen';
  let items   = [];            // Werke der aktuellen Kategorie
  let copies  = 1;            // Wiederholungen für den nahtlosen Loop
  let mode    = 'center';      // 'loop' | 'scroll' | 'center'
  let offset  = 0;            // Track-Verschiebung in px (≤ 0)
  let paused  = false;
  let rafId   = null;
  let lastTs  = 0;

  // Übersichts-Karte: nur das Mosaik + kleiner Titel.
  function renderCard(work) {
    const labelMosaic = t('detail.mosaic', 'Mosaik');
    return `
      <figure class="gcard" data-work-id="${work.id}">
        <button type="button" class="gcard__image" data-open-detail="${work.id}" aria-label="${work.title} — ${labelMosaic}">
          <img src="${work.mosaic}" alt="${labelMosaic}: ${work.title}" loading="lazy" />
        </button>
        <figcaption class="gcard__title">${work.title}</figcaption>
      </figure>
    `;
  }

  function buildStripHTML() {
    let html = '';
    for (let c = 0; c < copies; c++) html += items.map(renderCard).join('');
    return html;
  }

  function applyTransform() { track.style.transform = `translateX(${offset}px)`; }

  // Breite EINER Werk-Liste = Abstand der ersten Karte der 2. Kopie zur ersten
  // Karte (inkl. Lücken) → exakte, nahtlose Loop-Distanz.
  function baseWidth() {
    const cards = track.children;
    if (cards.length > items.length && items.length > 0) {
      return cards[items.length].offsetLeft - cards[0].offsetLeft;
    }
    return track.scrollWidth;
  }

  function normalize() {
    const bw = baseWidth();
    if (bw <= 10) return;
    while (offset <= -bw) offset += bw;
    while (offset > 0)    offset -= bw;
  }

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    const dt = Math.min(0.05, (ts - lastTs) / 1000); // dt deckeln (Tab-Rückkehr)
    lastTs = ts;
    if (!paused && mode === 'loop' && items.length) {
      offset -= SPEED * dt;
      normalize();
      applyTransform();
    }
    rafId = window.requestAnimationFrame(tick);
  }
  function startLoop() { if (rafId == null) { lastTs = 0; rafId = window.requestAnimationFrame(tick); } }
  function stopLoop()  { if (rafId != null) { window.cancelAnimationFrame(rafId); rafId = null; } }

  function stepSize() {
    const card = track.querySelector('.gcard');
    return card ? card.getBoundingClientRect().width + 24 : 220;
  }

  // Manueller Schubs per Pfeil.
  function nudge(dir) {
    const step = stepSize();
    if (mode === 'scroll') {
      viewport.scrollBy({ left: dir * step, behavior: 'smooth' });
      return;
    }
    if (mode === 'loop') {
      offset -= dir * step;
      normalize();
      applyTransform();
    }
  }

  function setCategory(cat) {
    if (!window.WORKS || !window.WORKS[cat]) return;
    currentCategory = cat;
    items = window.WORKS[cat] || [];

    tabs.forEach(tb => {
      const active = tb.getAttribute('data-category') === cat;
      tb.classList.toggle('is-active', active);
      tb.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    stopLoop();
    offset = 0; lastTs = 0;

    if (items.length === 0) {
      track.innerHTML = '';
      track.className = 'carousel__track carousel__track--center';
      track.style.transform = 'translateX(0)';
      if (emptyEl) emptyEl.hidden = false;
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      return;
    }
    if (emptyEl) emptyEl.hidden = true;

    // Modus bestimmen.
    if (items.length <= 1)      mode = 'center';
    else if (reduceMotion)      mode = 'scroll';
    else                        mode = 'loop';

    copies = (mode === 'loop') ? Math.max(2, Math.ceil(16 / items.length)) : 1;
    track.innerHTML = buildStripHTML();
    track.className = 'carousel__track carousel__track--' + mode;
    track.style.transform = 'translateX(0)';
    if (viewport) viewport.classList.toggle('carousel__viewport--scroll', mode === 'scroll');

    // Pfeile nur sinnvoll ab 2 Werken.
    if (prevBtn) prevBtn.hidden = items.length < 2;
    if (nextBtn) nextBtn.hidden = items.length < 2;

    if (mode === 'loop') startLoop();
  }

  // Pause bei Hover/Touch.
  if (viewport) {
    viewport.addEventListener('mouseenter', () => { paused = true; });
    viewport.addEventListener('mouseleave', () => { paused = false; });
    viewport.addEventListener('touchstart', () => { paused = true; },  { passive: true });
    viewport.addEventListener('touchend',   () => { paused = false; }, { passive: true });
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLoop();
    else if (mode === 'loop' && items.length) startLoop();
  });

  // Tabs + Submenu-Anchors filtern.
  tabs.forEach(tab => tab.addEventListener('click', () => setCategory(tab.getAttribute('data-category'))));
  categoryAnchors.forEach(a => {
    if (a.tagName !== 'A') return;
    a.addEventListener('click', () => {
      const cat = a.getAttribute('data-category');
      if (cat) { setCategory(cat); closeAllSubmenus(); }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => nudge(-1));
  if (nextBtn) nextBtn.addEventListener('click', () => nudge(1));

  let resizeT = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => { normalize(); applyTransform(); }, 120);
  });

  // Initial-Render
  if (track && window.WORKS) setCategory(currentCategory);

  // Beim Sprachwechsel: Karten-Titel + ggf. offenes Detail neu rendern.
  window.refreshCarousel = function () {
    if (track && items.length) {
      track.innerHTML = buildStripHTML();
      normalize();
      applyTransform();
    }
    if (detail && !detail.hidden && currentDetail) renderDetail(currentDetail);
  };

  /* ============================================================
     6. Detail-Overlay
     - Mosaik groß (klickbar = Zoom), Caption (Material/Maße/Stunden),
       Beschreibung, darunter das Originalfoto KLEIN (falls vorhanden).
     - Vor/Zurück durch die Werke der Kategorie (Pfeile + Wischen + ←/→).
     - Zoom: Klick aufs Mosaik vergrößert es scrollbar.
     ============================================================ */
  const detail        = document.getElementById('detail');
  const detailTitle   = detail ? detail.querySelector('#detail-title') : null;
  const detailAnim    = detail ? detail.querySelector('[data-detail-animation]') : null;
  const detailOrig    = detail ? detail.querySelector('[data-detail-original]') : null;
  const detailOrigFig = detail ? detail.querySelector('[data-detail-original-fig]') : null;
  const detailMosaic  = detail ? detail.querySelector('[data-detail-mosaic]') : null;
  const detailZoomBtn = detail ? detail.querySelector('[data-detail-zoom]') : null;
  const detailCaption = detail ? detail.querySelector('[data-detail-caption]') : null;
  const detailDesc    = detail ? detail.querySelector('[data-detail-desc]') : null;
  const detailClose   = detail ? detail.querySelector('.detail__close') : null;
  const detailPrev    = detail ? detail.querySelector('[data-detail-prev]') : null;
  const detailNext    = detail ? detail.querySelector('[data-detail-next]') : null;

  let detailLastFocus = null;
  let detailCat = null;   // Kategorie-Schlüssel des aktuellen Werks
  let detailIdx = 0;      // Index innerhalb der Kategorie
  let currentDetail = null;
  let detailZoomed = false;

  function locateWork(id) {
    if (!window.WORKS) return null;
    for (const [cat, list] of Object.entries(window.WORKS)) {
      const i = list.findIndex(w => w.id === id);
      if (i !== -1) return { cat, idx: i, list };
    }
    return null;
  }

  function setZoom(on) {
    detailZoomed = on;
    if (!detail) return;
    detail.classList.toggle('detail--zoomed', on);
    if (detailZoomBtn) {
      detailZoomBtn.setAttribute('aria-label',
        on ? t('detail.zoomOut', 'Mosaik verkleinern') : t('detail.zoomIn', 'Mosaik vergrößern'));
    }
    if (!on && detailZoomBtn) detailZoomBtn.scrollTo({ left: 0, top: 0 });
  }

  function renderDetail(work) {
    currentDetail = work;
    detailTitle.textContent = work.title;
    detailMosaic.src = work.mosaic;
    detailMosaic.alt = `${t('detail.mosaic', 'Mosaik')}: ${work.title}`;
    if (detailCaption) detailCaption.textContent = workCaption(work);
    if (detailDesc)    detailDesc.textContent    = workDesc(work);

    // Originalfoto klein — nur wenn vorhanden.
    if (work.original) {
      detailOrig.src = work.original;
      detailOrig.alt = `${t('detail.original', 'Originalfoto')}: ${work.title}`;
      if (detailOrigFig) detailOrigFig.hidden = false;
      detail.classList.remove('detail--single');
    } else {
      detailOrig.removeAttribute('src');
      detailOrig.alt = '';
      if (detailOrigFig) detailOrigFig.hidden = true;
      detail.classList.add('detail--single');
    }

    // Animations-Slot.
    detailAnim.innerHTML = '';
    if (work.animation) {
      const v = document.createElement('video');
      v.src = work.animation;
      v.autoplay = true; v.muted = true; v.controls = true; v.playsInline = true;
      detailAnim.appendChild(v);
      detail.classList.add('has-animation');
    } else {
      detail.classList.remove('has-animation');
    }

    setZoom(false);

    // Vor/Zurück nur ab 2 Werken in der Kategorie.
    const count = (window.WORKS[detailCat] || []).length;
    if (detailPrev) detailPrev.hidden = count < 2;
    if (detailNext) detailNext.hidden = count < 2;
  }

  function openDetail(id) {
    const loc = locateWork(id);
    if (!loc || !detail) return;
    detailCat = loc.cat;
    detailIdx = loc.idx;
    detailLastFocus = document.activeElement;
    renderDetail(loc.list[loc.idx]);
    detail.hidden = false;
    document.body.style.overflow = 'hidden';
    if (detailClose) detailClose.focus();
  }

  function detailGo(dir) {
    if (!detailCat) return;
    const list = window.WORKS[detailCat] || [];
    if (list.length < 2) return;
    detailIdx = (detailIdx + dir + list.length) % list.length;
    renderDetail(list[detailIdx]);
  }

  function closeDetail() {
    if (!detail || detail.hidden) return;
    setZoom(false);
    detail.hidden = true;
    detail.classList.remove('has-animation');
    if (detailAnim)   detailAnim.innerHTML = '';
    if (detailMosaic) detailMosaic.removeAttribute('src');
    if (detailOrig)   detailOrig.removeAttribute('src');
    currentDetail = null;
    document.body.style.overflow = '';
    if (detailLastFocus && typeof detailLastFocus.focus === 'function') detailLastFocus.focus();
  }

  // Klick auf eine Galerie-Karte → Detail öffnen.
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-detail]');
    if (trigger) {
      e.preventDefault();
      openDetail(trigger.getAttribute('data-open-detail'));
      return;
    }
    // Klick auf den abgedunkelten Hintergrund schließt.
    if (detail && !detail.hidden && e.target === detail) closeDetail();
  });

  if (detailClose) detailClose.addEventListener('click', closeDetail);
  if (detailPrev)  detailPrev.addEventListener('click', () => detailGo(-1));
  if (detailNext)  detailNext.addEventListener('click', () => detailGo(1));
  if (detailZoomBtn) detailZoomBtn.addEventListener('click', () => setZoom(!detailZoomed));

  document.addEventListener('keydown', e => {
    if (!detail || detail.hidden) return;
    if (e.key === 'Escape') {
      if (detailZoomed) setZoom(false);
      else closeDetail();
    } else if (e.key === 'ArrowLeft')  { e.preventDefault(); detailGo(-1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); detailGo(1); }
  });

  // Wischen im Detail → Vor/Zurück (nicht im gezoomten Zustand, da wird gescrollt).
  if (detail) {
    let dStartX = null;
    detail.addEventListener('touchstart', ev => {
      dStartX = ev.touches ? ev.touches[0].clientX : null;
    }, { passive: true });
    detail.addEventListener('touchend', ev => {
      if (dStartX == null || detailZoomed) { dStartX = null; return; }
      const endX = ev.changedTouches ? ev.changedTouches[0].clientX : dStartX;
      const dx = endX - dStartX;
      dStartX = null;
      if (Math.abs(dx) > 50) detailGo(dx < 0 ? 1 : -1);
    }, { passive: true });
  }

  /* ============================================================
     7. Font-Switcher (URL-Param ?fonts=picker)
     ============================================================ */
  const FONT_MAP = {
    italianno: { stack: '"Italianno", "Allura", cursive',                       weight: 400, letter: '0.02em' },
    sans:      { stack: '"Source Sans 3", "Manrope", system-ui, sans-serif',    weight: 300, letter: '0.02em' },
    courier:   { stack: '"Courier Prime", "Courier New", monospace',            weight: 400, letter: '0.04em' },
    default:   { stack: '',                                                     weight: 500, letter: '0.01em' }
  };
  const STORAGE_KEY = 'marmac-menu-font';

  function applyMenuFont(key) {
    const config = FONT_MAP[key] || FONT_MAP.default;
    const root = document.documentElement.style;
    if (key === 'default' || !config.stack) {
      root.removeProperty('--font-menu');
      root.removeProperty('--font-menu-weight');
      root.removeProperty('--font-menu-letter');
    } else {
      root.setProperty('--font-menu', config.stack);
      root.setProperty('--font-menu-weight', String(config.weight));
      root.setProperty('--font-menu-letter', config.letter);
    }
    document.querySelectorAll('.font-picker button[data-font]').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-font') === key);
    });
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && FONT_MAP[stored]) applyMenuFont(stored);
  } catch (_) {}

  const picker = document.getElementById('font-picker');
  if (picker) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('fonts') === 'picker') picker.hidden = false;
    picker.querySelectorAll('button[data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-font');
        applyMenuFont(key);
        try { localStorage.setItem(STORAGE_KEY, key); } catch (_) {}
      });
    });
  }

  /* ============================================================
     8. Menü-Stil-Picker (?menu=picker)
     Varianten: pills / outline / underline / lines / solid.
     Wahl wird via data-menu-style auf <body> gesetzt; CSS reagiert.
     ============================================================ */
  const MENU_STYLES = ['pills', 'outline', 'underline', 'lines', 'solid'];
  const MENU_STORAGE_KEY = 'marmac-menu-style';

  function applyMenuStyle(style) {
    if (!MENU_STYLES.includes(style)) style = 'underline';
    document.body.setAttribute('data-menu-style', style);
    document.querySelectorAll('.style-picker button[data-menu-style]').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-menu-style') === style);
    });
  }

  try {
    const stored = localStorage.getItem(MENU_STORAGE_KEY);
    if (stored && MENU_STYLES.includes(stored)) applyMenuStyle(stored);
  } catch (_) {}

  const menuPicker = document.getElementById('menu-picker');
  try {
    const param = new URLSearchParams(window.location.search).get('menu');
    if (param === 'picker' && menuPicker) {
      menuPicker.hidden = false;
    } else if (param && MENU_STYLES.includes(param)) {
      applyMenuStyle(param);
    }
  } catch (_) {}

  if (menuPicker) {
    menuPicker.querySelectorAll('button[data-menu-style]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-menu-style');
        applyMenuStyle(key);
        try { localStorage.setItem(MENU_STORAGE_KEY, key); } catch (_) {}
      });
    });
    applyMenuStyle(document.body.getAttribute('data-menu-style') || 'underline');
  }
})();
