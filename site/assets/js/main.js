/* ============================================================
   MarMac-Mosaic — main.js (v2)
   Vanilla JS. Module:
     1. Scroll-Reveal für [data-reveal]
     2. Submenu-Toggle (Mobile: Tap; Desktop: CSS-Hover)
     3. Tab- + Karussell-Controller (Render aus window.WORKS,
        prev/next, Swipe, Tastatur, leere Kategorie)
     4. Detail-Overlay (ersetzt Lightbox; mit Animations-Slot)
     5. Kontakt-Form-Stub mit DSGVO-Validierung
     6. Font-Switcher (URL-Param ?fonts=picker + localStorage)
     7. Reduced-Motion-Handling

   Animations-Slot-Doku (Briefing 8):
   - Pro Werk kann in works.js ein "animation"-Pfad gesetzt werden
     (z. B. 'assets/videos/dali-explosion.mp4').
   - main.js erkennt das → rendert <video autoplay muted controls
     loop="false"> in .detail__animation und blendet das
     Side-by-Side-Paar aus.
   - Empfohlenes Format: MP4 H.264 1080p ≤ 8 MB. Optional WebM
     als zweite <source>. Lottie nur wenn vektor-basierte Animation
     vorliegt (für Partikel-/Mosaik-Explosion in der Regel nicht).
   - Solange "animation": null → Side-by-Side-Fallback.
   ============================================================ */
(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================================
     1. Scroll-Reveal
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
     2. Submenu (Mobile-Tap-Toggle, Desktop nutzt CSS-Hover)
     ============================================================ */
  const submenuToggles = document.querySelectorAll('[data-submenu-toggle]');

  function closeAllSubmenus(except) {
    submenuToggles.forEach(t => {
      if (t !== except) t.setAttribute('aria-expanded', 'false');
    });
  }

  submenuToggles.forEach(toggle => {
    toggle.addEventListener('click', e => {
      // Auf Touch / kleinen Viewports: tap toggelt; Default-Anker
      // (Sprung zu #arbeiten) wird unterdrückt — Submenu öffnet stattdessen.
      // Auf Desktop mit Hover: CSS macht's; aber wir lassen den
      // Klick trotzdem zu, damit Tastatur-Nutzer + Touch-Devices
      // konsistent funktionieren.
      const isOpen = toggle.getAttribute('aria-expanded') === 'true';
      if (!isOpen) {
        e.preventDefault();
        closeAllSubmenus(toggle);
        toggle.setAttribute('aria-expanded', 'true');
      } else {
        // Zweiter Tap → schließt und folgt dem Anker.
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // Klick außerhalb der Submenus → alle schließen.
  document.addEventListener('click', e => {
    if (!e.target.closest('[data-submenu-toggle]') &&
        !e.target.closest('.submenu')) {
      closeAllSubmenus();
    }
  });

  // ESC schließt offene Submenus.
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeAllSubmenus();
  });

  /* ============================================================
     3. Tabs + Karussell
     ============================================================ */
  const tabsContainer = document.querySelector('[data-tabs]');
  const tabs          = tabsContainer ? tabsContainer.querySelectorAll('[data-category]') : [];
  const track         = document.querySelector('[data-carousel-track]');
  const viewport      = document.querySelector('[data-carousel-viewport]');
  const prevBtn       = document.querySelector('[data-carousel-prev]');
  const nextBtn       = document.querySelector('[data-carousel-next]');
  const dotsContainer = document.querySelector('[data-carousel-dots]');
  const emptyEl       = document.querySelector('[data-carousel-empty]');
  const categoryAnchors = document.querySelectorAll('[data-category]'); // Tabs + Submenu

  let currentCategory = 'ikonen';
  let currentIndex    = 0;
  let slidesCount     = 0;

  function renderSlide(work) {
    // Polaroid-Pair-Slide. Klick auf ein Bild öffnet Detail-Overlay.
    return `
      <div class="slide" data-work-id="${work.id}">
        <div class="slide__pair">
          <figure class="slide__side slide__side--original">
            <button type="button" class="slide__image" data-open-detail="${work.id}" aria-label="${work.title} — Detailansicht öffnen">
              <img src="${work.original}" alt="Originalfoto: ${work.title}" loading="lazy" />
            </button>
          </figure>
          <figure class="slide__side slide__side--mosaic">
            <button type="button" class="slide__image" data-open-detail="${work.id}" aria-label="${work.title} — Detailansicht öffnen">
              <img src="${work.mosaic}" alt="Mosaik: ${work.title}, handgesetzt von Martina" loading="lazy" />
            </button>
          </figure>
        </div>
        <div class="slide__caption">
          <h3 class="slide__title">${work.title}</h3>
          <p class="slide__desc">${work.desc}</p>
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
      dot.setAttribute('aria-label', `Werk ${i + 1} anzeigen`);
      dot.addEventListener('click', () => goTo(i));
      dotsContainer.appendChild(dot);
    }
  }

  function updateOffset() {
    if (!viewport || !track) return;
    const w = viewport.offsetWidth;
    track.style.setProperty('--carousel-offset', `-${currentIndex * w}px`);

    // Dots aktualisieren
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.carousel__dot').forEach((d, i) => {
        d.classList.toggle('is-active', i === currentIndex);
      });
    }

    // Buttons: an Rändern deaktivieren
    if (prevBtn) prevBtn.disabled = currentIndex === 0;
    if (nextBtn) nextBtn.disabled = currentIndex >= slidesCount - 1;
  }

  function goTo(i) {
    currentIndex = Math.max(0, Math.min(i, slidesCount - 1));
    updateOffset();
  }

  function next() { goTo(currentIndex + 1); }
  function prev() { goTo(currentIndex - 1); }

  function setCategory(cat) {
    if (!window.WORKS || !window.WORKS[cat]) return;
    currentCategory = cat;
    const works = window.WORKS[cat];
    slidesCount = works.length;
    currentIndex = 0;

    // Tabs aktualisieren
    tabs.forEach(t => {
      const active = t.getAttribute('data-category') === cat;
      t.classList.toggle('is-active', active);
      t.setAttribute('aria-selected', active ? 'true' : 'false');
    });

    if (slidesCount === 0) {
      // Leere Kategorie → Track ausblenden, Placeholder zeigen
      if (track) track.innerHTML = '';
      if (emptyEl) emptyEl.hidden = false;
      if (prevBtn) prevBtn.hidden = true;
      if (nextBtn) nextBtn.hidden = true;
      if (dotsContainer) dotsContainer.innerHTML = '';
      return;
    }

    if (emptyEl) emptyEl.hidden = true;
    if (prevBtn) prevBtn.hidden = false;
    if (nextBtn) nextBtn.hidden = false;

    track.innerHTML = works.map(renderSlide).join('');
    renderDots(slidesCount);
    updateOffset();
  }

  // Tabs: Klick filtert
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setCategory(tab.getAttribute('data-category'));
    });
  });

  // Submenu-Anchor: Klick filtert + scrollt
  categoryAnchors.forEach(a => {
    if (a.tagName !== 'A') return; // Tabs sind <button>, schon abgedeckt
    a.addEventListener('click', e => {
      const cat = a.getAttribute('data-category');
      if (cat) {
        setCategory(cat);
        closeAllSubmenus();
        // Default-Verhalten (Sprung zu #arbeiten) bleibt erhalten.
      }
    });
  });

  // Prev/Next-Buttons + Tastatur
  if (prevBtn) prevBtn.addEventListener('click', prev);
  if (nextBtn) nextBtn.addEventListener('click', next);

  if (viewport) {
    viewport.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); next(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); prev(); }
    });
    // Karussell soll fokussierbar sein (Tastatur-Navigation).
    viewport.setAttribute('tabindex', '0');
  }

  // Swipe (Touch + Pointer)
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
      if (dx < 0) next();
      else        prev();
    }
  }
  if (viewport) {
    viewport.addEventListener('touchstart', onPointerDown, { passive: true });
    viewport.addEventListener('touchend',   onPointerUp,   { passive: true });
  }

  // Resize: Offset neu berechnen (Slide-Breite ändert sich).
  let resizeT = null;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(updateOffset, 100);
  });

  // Initial-Render mit Default-Kategorie
  if (track && window.WORKS) {
    setCategory(currentCategory);
  }

  /* ============================================================
     4. Detail-Overlay (öffnet bei Klick auf Slide-Bild)
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
    detailDesc.textContent   = work.desc;
    detailOrig.src           = work.original;
    detailOrig.alt           = `Originalfoto: ${work.title}`;
    detailMosaic.src         = work.mosaic;
    detailMosaic.alt         = `Mosaik: ${work.title}`;

    // Animations-Slot: wenn work.animation gesetzt → Video einhängen,
    // Side-by-Side wird per CSS (.has-animation) ausgeblendet.
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

  // Klick auf Slide-Bild öffnet Detail (Event-Delegation)
  document.addEventListener('click', e => {
    const trigger = e.target.closest('[data-open-detail]');
    if (trigger) {
      e.preventDefault();
      openDetail(trigger.getAttribute('data-open-detail'));
      return;
    }
    // Klick auf Backdrop (außerhalb .detail__inner) schließt
    if (detail && !detail.hidden && e.target === detail) closeDetail();
  });

  if (detailClose) detailClose.addEventListener('click', closeDetail);
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && detail && !detail.hidden) closeDetail();
  });

  /* ============================================================
     5. Kontakt-Form-Stub mit DSGVO-Validierung
     ============================================================ */
  const form = document.getElementById('contact-form');
  const formNote = document.getElementById('contact-form-note');
  if (form && formNote) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const dsgvo = form.querySelector('input[name="dsgvo"]');
      if (dsgvo && !dsgvo.checked) {
        formNote.textContent = 'Bitte bestätige die Datenschutzerklärung, um fortzufahren.';
        formNote.style.color = ''; // default
        dsgvo.focus();
        return;
      }
      formNote.textContent =
        'Vielen Dank! Das Formular ist noch nicht angebunden — bitte nutze vorerst E-Mail oder WhatsApp rechts.';
    });
  }

  /* ============================================================
     6. Font-Switcher (URL-Param ?fonts=picker + localStorage)
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
    // Picker-Buttons: aktive Variante markieren
    document.querySelectorAll('.font-picker button[data-font]').forEach(b => {
      b.classList.toggle('is-active', b.getAttribute('data-font') === key);
    });
  }

  // 1. Persistierte Wahl beim Laden anwenden
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored && FONT_MAP[stored]) applyMenuFont(stored);
  } catch (_) { /* localStorage blockiert — ignorieren */ }

  // 2. Picker-Widget bei ?fonts=picker sichtbar machen
  const picker = document.getElementById('font-picker');
  if (picker) {
    const params = new URLSearchParams(window.location.search);
    if (params.get('fonts') === 'picker') {
      picker.hidden = false;
    }
    picker.querySelectorAll('button[data-font]').forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-font');
        applyMenuFont(key);
        try { localStorage.setItem(STORAGE_KEY, key); } catch (_) {}
      });
    });
  }

  /* ============================================================
     7. Reduced-Motion-Cleanup
     ============================================================ */
  if (reduceMotion && track) {
    // Karussell wechselt ohnehin nur per User-Interaktion (kein Auto-Play),
    // also nichts weiter zu tun. Transition wird via CSS bereits unterdrückt.
  }
})();
