/* ============================================================
   MarMac-Mosaic — works.js
   Single Source of Truth für alle Werke.
   --------------------------------------------------------------
   Neues Werk hinzufügen:
   1. Bilder in site/assets/images/works/ ablegen
   2. Eintrag in die richtige Kategorie unten ergänzen
   3. fertig — Karussell + Detail-Overlay rendern automatisch.

   Felder pro Werk:
   - id          : eindeutiger Schlüssel (kebab-case)
   - title       : Anzeige-Titel (z. B. "Salvador Dalí")
   - desc        : ein-Satz-Beschreibung (Caption + Detail)
   - original    : Pfad zum Originalfoto
   - mosaic      : Pfad zum fertigen Mosaik
   - animation   : optional — Pfad zu MP4/WebM der Explosions-Animation
                   (siehe Detail-Overlay-Doku in main.js).
                   null = kein Asset, Fallback Side-by-Side im Detail.
   ============================================================ */
window.WORKS = {
  ikonen: [
    {
      id:        'dali',
      title:     'Salvador Dalí',
      desc:      'Porträt-Mosaik in Schwarz, Weiß und Grautönen.',
      original:  'assets/images/works/dali-original.png',
      mosaic:    'assets/images/works/dali-mosaic.png',
      animation: null
    },
    {
      id:        'elvis',
      title:     'Elvis Presley',
      desc:      'Porträt-Mosaik auf tiefrotem Grund.',
      original:  'assets/images/works/elvis-original.webp',
      mosaic:    'assets/images/works/elvis-mosaic.jpg',
      animation: null
    },
    {
      id:        'frida',
      title:     'Frida Kahlo',
      desc:      'Farbiges Porträt mit Blumenkrone.',
      original:  'assets/images/works/frida-original.jpg',
      mosaic:    'assets/images/works/frida-mosaic.jpg',
      animation: null
    }
    // TODO: Audrey Hepburn ergänzen, sobald Asset vorliegt.
  ],

  // Auftragsarbeiten von Verwandten/Freunden — aktuell leer.
  portraits: [],

  // Tiere — aktuell leer. Falls dauerhaft leer, Kategorie aus
  // index.html-Submenu/Tabs streichen.
  haustiere: [],

  // Restkategorie — aktuell leer.
  verschiedenes: []
};

/* Lesbare Kategorien-Labels (Single Source für Submenu, Tabs, Detail). */
window.WORK_CATEGORIES = {
  ikonen:        'Ikonen',
  portraits:     'Persönliche Porträts',
  haustiere:     'Haustiere',
  verschiedenes: 'Verschiedenes'
};
