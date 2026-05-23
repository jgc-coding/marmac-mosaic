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
      id:        'audrey',
      title:     'Audrey Hepburn',
      desc:      'Ikonisches Profil-Porträt in Schwarz und Weiß.',
      desc_en:   'Iconic profile portrait in black and white.',
      original:  'assets/images/works/audrey-original.webp',
      mosaic:    'assets/images/works/audrey-mosaic.jpg',
      animation: null
    },
    {
      id:        'dali',
      title:     'Salvador Dalí',
      desc:      'Porträt-Mosaik in Schwarz, Weiß und Grautönen.',
      desc_en:   'Portrait mosaic in black, white and shades of gray.',
      original:  'assets/images/works/dali-original.png',
      mosaic:    'assets/images/works/dali-mosaic.png',
      animation: null
    },
    {
      id:        'elvis',
      title:     'Elvis Presley',
      desc:      'Porträt-Mosaik auf tiefrotem Grund.',
      desc_en:   'Portrait mosaic on deep red background.',
      original:  'assets/images/works/elvis-original.webp',
      mosaic:    'assets/images/works/elvis-mosaic.jpg',
      animation: null
    },
    {
      id:        'frida',
      title:     'Frida Kahlo',
      desc:      'Farbiges Porträt mit Blumenkrone.',
      desc_en:   'Colorful portrait with floral crown.',
      original:  'assets/images/works/frida-original.jpg',
      mosaic:    'assets/images/works/frida-mosaic.jpg',
      animation: null
    }
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
