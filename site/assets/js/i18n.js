/* ============================================================
   MarMac-Mosaic — i18n.js
   Mini-Architektur für späteren DE/EN-Switcher.
   --------------------------------------------------------------
   Aktuell aktiv: nur DE (keine Übersetzungs-Logik nötig — alle
   Texte stehen direkt im HTML). Dieses Modul reserviert die
   Architektur, damit später ein Sprachschalter nachgerüstet
   werden kann, ohne die Seite umzubauen.

   Spätere Nutzung:
   - HTML markiert übersetzbare Knoten mit data-i18n="key"
     z. B. <h2 data-i18n="works.heading">Bisherige Arbeiten</h2>
   - I18N.strings.en wird befüllt
   - I18N.setLanguage('en') tauscht alle data-i18n-Knoten aus
   - Ein Switcher oben rechts (data-lang-switcher) ruft setLanguage()

   Bis dahin tut dieses Modul nichts Sichtbares — es exportiert
   nur eine konsistente API, sodass kein Renderer-Code später
   ausgetauscht werden muss.
   ============================================================ */
window.I18N = {
  current: 'de',

  // Übersetzungs-Strings: aktuell leer. Beispielstruktur:
  // strings.en['works.heading'] = 'Past Works'
  strings: {
    de: {},
    en: {}
  },

  /** Sprache wechseln und alle markierten Knoten neu rendern. */
  setLanguage(lang) {
    if (!this.strings[lang]) {
      console.warn('[i18n] unbekannte Sprache:', lang);
      return;
    }
    this.current = lang;
    document.documentElement.lang = lang;
    this.render();
  },

  /** Alle data-i18n-Knoten füllen — wenn ein Key fehlt,
   *  bleibt der vorhandene HTML-Inhalt erhalten (fail-safe DE). */
  render() {
    const dict = this.strings[this.current] || {};
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
  }
};

// Aktuell kein Auto-Render nötig: HTML ist bereits in der
// Default-Sprache. Sobald EN dazukommt, hier I18N.render() aufrufen,
// nachdem die Sprache aus localStorage oder ?lang=... gelesen wurde.
