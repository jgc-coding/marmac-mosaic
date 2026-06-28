/* ============================================================
   MacMarMosaics — works.js
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
   - original    : Pfad zum Originalfoto (OPTIONAL — weglassen, wenn nur ein
                   Mosaik-Foto vorliegt; dann rendert eine einzelne, zentrierte
                   Karte statt des Vorher/Nachher-Paars).
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

  // Persönliche Porträts (Auftrags-/persönliche Arbeiten). Nur Mosaik-Foto
  // vorhanden → kein "original" (rendert als einzelne Karte).
  portraits: [
    {
      id:        'portrait-1',
      title:     'Persönliches Porträt',
      desc:      'Persönliches Porträt in Schwarz, Weiß und Grautönen — vom Foto Stein für Stein gelegt.',
      desc_en:   'Personal portrait in black, white and shades of gray — laid stone by stone from a photo.',
      mosaic:    'assets/images/works/portrait-1-mosaic.jpg',
      animation: null
    }
  ],

  // Sammelkategorie (vormals "Haustiere" + "Verschiedenes" zusammengelegt)
  // — Tiere und alles Übrige. EN-Label: "Mixed". Nur Mosaik-Fotos → kein "original".
  verschiedenes: [
    {
      id:        'frosch',
      title:     'Frosch',
      desc:      'Ein Frosch auf einem Ast, in frischen Grün- und tiefen Brauntönen.',
      desc_en:   'A frog on a branch, in fresh greens and deep browns.',
      mosaic:    'assets/images/works/frosch-mosaic.jpg',
      animation: null
    },
    {
      id:        'schildkroete',
      title:     'Schildkröte',
      desc:      'Eine kleine Schildkröte in abgestuften Grüntönen.',
      desc_en:   'A little turtle in graduated shades of green.',
      mosaic:    'assets/images/works/schildkroete-mosaic.jpg',
      animation: null
    },
    {
      id:        'erdbeere',
      title:     'Erdbeere',
      desc:      'Eine reife Erdbeere aus leuchtend roten Keramikbruchstücken.',
      desc_en:   'A ripe strawberry made of bright red ceramic shards.',
      mosaic:    'assets/images/works/erdbeere-mosaic.jpg',
      animation: null
    },
    {
      id:        'pfeife',
      title:     'Pfeife',
      desc:      'Eine klassische Pfeife in warmem Bordeaux und Schwarz.',
      desc_en:   'A classic pipe in warm burgundy and black.',
      mosaic:    'assets/images/works/pfeife-mosaic.jpg',
      animation: null
    }
  ]
};

/* Lesbare Kategorien-Labels (Single Source für Submenu, Tabs, Detail). */
window.WORK_CATEGORIES = {
  ikonen:        'Ikonen',
  portraits:     'Persönliche Porträts',
  verschiedenes: 'Verschiedenes'
};
