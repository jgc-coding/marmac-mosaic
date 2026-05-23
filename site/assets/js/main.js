/* ============================================================
   MarMac-Mosaic — main.js (v3)
   Module:
     1. i18n init + Sprachschalter
     2. Scroll-Reveal für [data-reveal]
     3. Top-Nav-Reveal (Nav erscheint smooth nach dem Hero)
     4. Submenu-Toggle
     5. Tab- + Karussell-Controller + Auto-Advance
     6. Detail-Overlay
     7. Kontakt-Form-Stub + DSGVO
     8. Font-Switcher (URL-Param ?fonts=picker)
     9. Reduced-Motion

   Animations-Slot-Doku (Briefing 8):
     - Pro Werk in works.js ein "animation"-Pfad setzen (MP4 H.264
       1080p ≤ 8 MB empfohlen, optional WebM zusätzlich).
     - main.js hängt automatisch <video> in .detail__animation und
       blendet das Side-by-Side-Paar aus (Klasse .has-animation).
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
        // Nav erscheint, sobald der Hero zu weniger als ~15 % sichtbar ist.
        if (entry.intersectionRatio < 0.15) nav.classList.add('is-revealed');
        else                                nav.classList.remove('is-revealed');
      },
      { threshold: [0, 0.15, 0.5, 1] }
    );
    heroObserver.observe(hero);
  } else if (nav) {
    // Fallback ohne IO: Nav dauerhaft sichtbar.
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

  /* ============================================================
     5. Tabs + Karussell (mit Auto-Advance)
     ============================================================ */
  const tabsContainer = document.querySelector('[data-tabs]');
  const tabs          = tabsContainer ? tabsContainer.querySelectorAll('[data-category]') : [];
  const track         = document.querySelector('[data-carousel-track]');
  const viewport      = document.querySelector('[data-carousel-viewport]');
  const prevBtn       = document.querySelector('[data-carousel-prev]');
  const nextBtn       = document.querySelector('[data-carousel-next]');
  const dotsContainer = document.querySelector('[data-carousel-dots]');
  const emptyEl       = document.querySelector('[data-carousel-empty]');
  const categoryAnchors = document.querySelectorAll('[data-category]');

  const AUTO_ADVANCE_MS = 6000;
  let currentCategory = 'ikonen';
  let currentIndex    = 0;
  let slidesCount     = 0;
  let autoTimer       = null;
  let autoStopped     = false; // Nach erster manueller Interaktion: dauerhaft aus.

  function t(key, fallback) {
    return (window.I18N && window.I18N.t(key)) || fallback;
  }

  // Lokalisierte Werk-Beschreibung holen
  function workDesc(work) {
    if (window.I18N && window.I18N.current === 'en' && work.desc_en) return work.desc_en;
    return work.desc;
  }

  function renderSlide(work) {
    const desc = workDesc(work);
    const labelOriginal = t('detail.original', 'Originalfoto');
    const labelMosaic   = t('detail.mosaic',   'Mosaik');
    return `
      <div class="slide" data-work-id="${work.id}">
        <div class="slide__pair">
          <figure class="slide__side slide__side--original">
            <button type="button" class="slide__image" data-open-detail="${work.id}" aria-label="${work.title} — ${labelOriginal}">
              <img src="${work.original}" alt="${labelOriginal}: ${work.title}" loading="lazy" />
            </button>
          </figure>
          <figure class="slide__side slide__side--mosaic">
            <button type="button" class="slide__image" data-open-detail="${work.id}" aria-label="${work.title} — ${labelMosaic}">
              <img src="${work.mosaic}" alt="${labelMosaic}: ${work.title}" loading="lazy" />
            </button>
          </figure>
        </div>
        <div class="slide__caption">
          <h3 class="slide__title">${work.title}</h3>
          <p class="slide__desc">${desc}</p>
        </div>
      </div>
    `;
  }

  function renderDots(count) {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      const dot = document.createElement('button');
      dot.className = 'carousel__dot' + (i === 0 ? ' is-active' : '');
      dot.type = 'button';
      dot.setAttribute('aria-label', `Werk ${i + 1}`);
      dot.addEventListener('click', () => { stopAuto(); goTo(i); });
      dotsContainer.appendChild(dot);
    }
  }

  function updateOffset() {
    if (!viewport || !track) return;
    const w = viewport.offsetWidth;
    track.style.setProperty('--carousel-offset', `-${currentIndex * w}px`);
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === currentIndex);
      });
    }
    // Buttons NICHT mehr deaktivieren — Karussell wraps endlos durch.
    // (Mit Auto-Advance soll der Nutzer manuell ebenfalls beliebig vor/zurück.)
    if (prevBtn) prevBtn.disabled = false;
    if (nextBtn) nextBtn.disabled = false;
  }

  function goTo(i) {
    if (slidesCount === 0) return;
    // Wrap-around: i wird modulo slidesCount.
    currentIndex = ((i % slidesCount) + slidesCount) % slidesCount;
    updateOffset();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function startAuto() {
    if (autoStopped || reduceMotion || slidesCount < 2) return;
    stopAutoTimer();
    autoTimer = setInterval(() => next(), AUTO_ADVANCE_MS);
  }
  function stopAutoTimer() {
    if (autoTimer) { clearInterval(autoTimer); autoTimer = null; }
  }
  function stopAuto() {
    autoStopped = true;
    stopAutoTimer();
  }

  function setCategory(cat) {
    if (!window.WORKS || !window.WORKS[cat]) return;
    currentCategory = cat;
    const works = window.WORKS[cat];
    slidesCount = works.length;
    currentIndex = 0;

    tabs.forEach(t => {
      const active = t.getAttribute('data-category') === cat;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (slidesCount === 0) {
      if (track) track.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      if (dotsContainer) dotsContainer.innerHTML = '';
      stopAutoTimer();
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (prevBtn) prevBtn.hidden = false;
    if (nextBtn) nextBtn.hidden = false;

    track.innerHTML = works.map(renderSlide).join('');
    renderDots(slidesCount);
    updateOffset();
    startAuto();
  }

  // Tab-Click filtert (gilt als manuelle Interaktion → Auto stoppt).
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      stopAuto();
      setCategory(tab.getAttribute('data-category'));
    });
  });

  // Submenu-Anchor: Klick filtert + scrollt.
  categoryAnchors.forEach(a => {
    if (a.tagName !== 'A') return;
    a.addEventListener('click', () => {
      const cat = a.getAttribute('data-category');
      if (cat) {
        stopAuto();
        setCategory(cat);
        closeAllSubmenus();
      }
    });
  });

  if (prevBtn) prevBtn.addEventListener('click', () => { stopAuto(); prev(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { stopAuto(); next(); });

  if (viewport) {
    viewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); stopAuto(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); stopAuto(); prev(); }
    });
    viewport.setAttribute('tabindex', '0');
  }

  let pointerStartX = null;
  function onPointerDown(e) {
    pointerStartX = (e.touches ? e.touches[0].clientX : e.clientX);
  }
  function onPointerUp(e) {
    if (pointerStartX == null) return;
    const endX = (e.changedTouches ? e.changedTouches[0].clientX : e.clientX);
    const dx = endX - pointerStartX;
    pointerStartX = null;
    if (Math.abs(dx) > 50) {
      stopAuto();
      if (dx < 0) next();
      else        prev();
    }
  }
  if (viewport) {
    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    viewport.addEventListener('touchend',   onPointerUp,   { passive: true });
  }

  // Auto-Advance pausieren wenn der Tab im Hintergrund ist (höflich
  // gegenüber CPU & Akku), wieder anlaufen wenn sichtbar — solange
  // der Nutzer nicht manuell interagiert hat.
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopAutoTimer();
    else if (!autoStopped) startAuto();
  });

  let resizeT = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(updateOffset, 100);
  });

  // Initial-Render
  if (track && window.WORKS) {
    setCategory(currentCategory);
  }

  // Beim Sprachwechsel ruft i18n.setLanguage() refreshCarousel()
  // auf, damit die Werk-Beschreibungen + Labels neu rendern.
  window.refreshCarousel = function () {
    if (slidesCount > 0) {
      const works = window.WORKS[currentCategory] || [];
      track.innerHTML = works.map(renderSlide).join('');
      updateOffset();
    }
  };

  /* ============================================================
     6. Detail-Overlay
     ============================================================ */
  const detail        = document.getElementById('detail');
  const detailTitle   = detail ? detail.querySelector('[id="detail-title"]') : null;
  const detailAnim    = detail ? detail.querySelector('[data-detail-animation]') : null;
  const detailOrig    = detail ? detail.querySelector('[data-detail-original]') : null;
  const detailMosaic  = detail ? detail.querySelector('[data-detail-mosaic]') : null;
  const detailDesc    = detail ? detail.querySelector('[data-detail-desc]') : null;
  const detailClose   = detail ? detail.querySelector('.detail__close') : null;
  let detailLastFocus = null;

  function findWork(id) {
    if (!window.WORKS) return null;
    for (const cat of Object.values(window.WORKS)) {
      const w = cat.find(x => x.id === id);
      if (w) return w;
    }
    return null;
  }

  function openDetail(workId) {
    const work = findWork(workId);
    if (!work || !detail) return;

    detailLastFocus = document.activeElement;
    detailTitle.textContent  = work.title;
    detailDesc.textContent   = workDesc(work);
    detailOrig.src           = work.original;
    detailOrig.alt           = `${t('detail.original','Originalfoto')}: ${work.title}`;
    detailMosaic.src         = work.mosaic;
    detailMosaic.alt         = `${t('detail.mosaic','Mosaik')}: ${work.title}`;

    detailAnim.innerHTML = '';
    if (work.animation) {
      const v = document.createElement('video');
      v.src         = work.animation;
      v.autoplay    = true;
      v.muted       = true;
      v.controls    = true;
      v.playsInline = true;
      detailAnim.appendChild(v);
      detail.classList.add('has-animation');
    } else {
      detail.classList.remove('has-animation');
    }

    detail.hidden = false;
    document.body.style.overflow = 'hidden';
    stopAuto(); // Auto-Advance stoppt beim Öffnen des Detail-Overlays.
    if (detailClose) detailClose.focus();
  }

  function closeDetail() {
    if (!detail || detail.hidden) return;
    detail.hidden = true;
    detail.classList.remove('has-animation');
    if (detailAnim) detailAnim.innerHTML = '';
    if (detailOrig) detailOrig.src = '';
    if (detailMosaic) detailMosaic.src = '';
    document.body.style.overflow = '';
    if (detailLastFocus && typeof detailLastFocus.focus === 'function') {
      detailLastFocus.focus();
    }
  }

  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-detail]');
    if (trigger) {
      e.preventDefault();
      openDetail(trigger.getAttribute('data-open-detail'));
      return;
    }
    if (detail && !detail.hidden && e.target === detail) closeDetail();
  });

  if (detailClose) detailClose.addEventListener('click', closeDetail);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && detail && !detail.hidden) closeDetail();
  });

  /* ============================================================
     7. Kontakt-Form-Stub + DSGVO
     ============================================================ */
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('contact-form-note');
  if (form && formNote) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const dsgvo = form.querySelector('input[name="dsgvo"]');
      if (dsgvo && !dsgvo.checked) {
        formNote.textContent = t('contact.note.dsgvo', 'Bitte bestätige die Datenschutzerklärung, um fortzufahren.');
        dsgvo.focus();
        return;
      }
      formNote.textContent = t('contact.note.thanks', 'Vielen Dank! Das Formular ist noch nicht angebunden.');
    });
  }

  /* ============================================================
     8. Font-Switcher (URL-Param ?fonts=picker)
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
})();
