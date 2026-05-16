/* ============================================================
   MarMac-Mosaic — main.js
   Vanilla JS, kommentiert, klein gehalten. Aufgaben:
     1. Scroll-Reveal für [data-reveal]-Elemente.
     2. Lightbox für Werk-Bilder.
     3. Formular-Stub (kein Backend) mit freundlicher Hinweismeldung.
     4. Reduced-Motion: Video pausieren, keine Reveal-Animationen.

   Hinweis: Die Nav ist jetzt von Anfang an sichtbar (durchgehend
   cremig-transparent mit Backdrop-Blur). Keine JS-Toggle-Logik mehr.
   ============================================================ */

(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Scroll-Reveal ----------------------------------------- */
  const revealTargets = document.querySelectorAll('[data-reveal]');

  if (reduceMotion) {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  } else if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- 2. Lightbox ---------------------------------------------- */
  const lightbox    = document.getElementById('lightbox');
  const lightboxImg = lightbox ? lightbox.querySelector('.lightbox__image') : null;
  const lightboxX   = lightbox ? lightbox.querySelector('.lightbox__close') : null;
  let lastFocused   = null;

  function openLightbox(src, alt) {
    if (!lightbox || !lightboxImg) return;
    lastFocused = document.activeElement;
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    lightbox.hidden = false;
    document.body.style.overflow = 'hidden';
    if (lightboxX) lightboxX.focus();
  }

  function closeLightbox() {
    if (!lightbox || !lightboxImg) return;
    lightbox.hidden = true;
    lightboxImg.src = '';
    lightboxImg.alt = '';
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') {
      lastFocused.focus();
    }
  }

  // Klick-Delegation auf alle Werk-Bilder.
  document.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-lightbox-src]');
    if (trigger) {
      event.preventDefault();
      openLightbox(
        trigger.getAttribute('data-lightbox-src'),
        trigger.getAttribute('data-lightbox-alt')
      );
      return;
    }
    // Klick außerhalb des Bildes schließt die Lightbox.
    if (lightbox && !lightbox.hidden && event.target === lightbox) {
      closeLightbox();
    }
  });

  if (lightboxX) {
    lightboxX.addEventListener('click', closeLightbox);
  }

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && lightbox && !lightbox.hidden) {
      closeLightbox();
    }
  });

  /* ---------- 3. Formular-Stub ----------------------------------------- */
  const form = document.getElementById('contact-form');
  const note = document.getElementById('contact-form-note');

  if (form && note) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      // Hier später echte Anbindung (Formspree, eigener Endpoint, ...).
      note.textContent =
        'Vielen Dank! Das Formular ist noch nicht angebunden — bitte nutze vorerst E-Mail oder WhatsApp rechts.';
    });
  }

  /* ---------- 4. Reduced Motion: Video pausieren ----------------------- */
  if (reduceMotion) {
    const heroVideo = document.querySelector('.hero__video');
    if (heroVideo) {
      // Auf den ersten Frame springen und stoppen.
      try {
        heroVideo.pause();
        heroVideo.currentTime = 0;
      } catch (_) {
        /* ignorieren */
      }
    }
  }
})();
