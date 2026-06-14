/* ============================================================
   MacMarMosaics — legal.js
   Minimal-JS für Impressum + Datenschutz:
   - i18n init (Sprachwahl aus localStorage anwenden)
   - Lang-Switch-Button verdrahten
   ============================================================ */
(() => {
  'use strict';
  if (!window.I18N) return;
  window.I18N.init();

  document.querySelectorAll('[data-lang-switch]').forEach(btn => {
    btn.addEventListener('click', () => {
      const next = (window.I18N.current === 'de') ? 'en' : 'de';
      window.I18N.setLanguage(next);
    });
  });
})();
