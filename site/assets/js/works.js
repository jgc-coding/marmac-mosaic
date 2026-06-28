/* ============================================================
   MacMarMosaics — works.js
   Single Source of Truth für alle Werke.
   --------------------------------------------------------------
   Neues Werk hinzufügen:
   1. Bilder in site/assets/images/works/ ablegen
   2. Eintrag in die richtige Kategorie unten ergänzen
   3. fertig — Galerie + Detail-Overlay rendern automatisch.

   Felder pro Werk:
   - id          : eindeutiger Schlüssel (kebab-case)
   - title       : Anzeige-Titel (z. B. "Salvador Dalí")
   - desc        : ein-Satz-Beschreibung (DE) — Detail-Overlay
   - desc_en     : Beschreibung (EN, optional)
   - caption     : Werk-Daten (Material/Maße/Stunden, DE) — Detail-Overlay
   - caption_en  : Werk-Daten (EN, optional)
   - original    : Pfad zum Originalfoto (OPTIONAL — weglassen, wenn nur ein
                   Mosaik-Foto vorliegt. Die Übersicht zeigt ohnehin nur das
                   Mosaik; das Original erscheint klein im Detail-Overlay).
   - mosaic      : Pfad zum fertigen Mosaik
   - animation   : optional — Pfad zu MP4/WebM der Explosions-Animation
                   (siehe Detail-Overlay-Doku in main.js).
                   null = kein Asset, Fallback Side-by-Side im Detail.
   ============================================================ */
window.WORKS = {
  ikonen: [
    {
      id:         'audrey',
      title:      'Audrey Hepburn',
      desc:       'Ikonisches Profil-Porträt in Schwarz und Weiß.',
      desc_en:    'Iconic profile portrait in black and white.',
      caption:    'Keramik auf Spanplatte, 23×30 cm, ca. 50 h',
      caption_en: 'Ceramic on chipboard, 23×30 cm, approx. 50 h',
      original:   'assets/images/works/audrey-original.webp',
      mosaic:     'assets/images/works/audrey-mosaic.jpg',
      animation:  null
    },
    {
      id:         'dali',
      title:      'Salvador Dalí',
      desc:       'Porträt-Mosaik in Schwarz, Weiß und Grautönen.',
      desc_en:    'Portrait mosaic in black, white and shades of gray.',
      caption:    'Keramik auf Spanplatte, 30×40 cm, ca. 2,5 Monate, ca. 170 h',
      caption_en: 'Ceramic on chipboard, 30×40 cm, approx. 2.5 months, approx. 170 h',
      original:   'assets/images/works/dali-original.png',
      mosaic:     'assets/images/works/dali-mosaic.png',
      animation:  null
    },
    {
      id:         'elvis',
      title:      'Elvis Presley',
      desc:       'Porträt-Mosaik auf tiefrotem Grund.',
      desc_en:    'Portrait mosaic on deep red background.',
      caption:    'Keramik auf Spanplatte, 23×30 cm, ca. 20 Tage, ca. 80 h',
      caption_en: 'Ceramic on chipboard, 23×30 cm, approx. 20 days, approx. 80 h',
      original:   'assets/images/works/elvis-original.webp',
      mosaic:     'assets/images/works/elvis-mosaic.jpg',
      animation:  null
    },
    {
      id:         'frida',
      title:      'Frida Kahlo',
      desc:       'Farbiges Porträt mit Blumenkrone.',
      desc_en:    'Colorful portrait with floral crown.',
      caption:    'Keramik auf Spanplatte, 23×30 cm, ca. 2 Monate, ca. 90 h',
      caption_en: 'Ceramic on chipboard, 23×30 cm, approx. 2 months, approx. 90 h',
      original:   'assets/images/works/frida-original.jpg',
      mosaic:     'assets/images/works/frida-mosaic.jpg',
      animation:  null
    }
  ],

  // Persönliche Porträts (Auftrags-/persönliche Arbeiten). Nur Mosaik-Foto
  // vorhanden → kein "original".
  // HINWEIS: Das Briefing nennt zwei Porträts — "Lisa" und "Mauro". Im
  // gelieferten Bildmaterial war nur EIN Porträt (bärtiger Mann) → als
  // "Mauro" eingepflegt. "Lisa" folgt, sobald das Foto vorliegt.
  portraits: [
    {
      id:         'portrait-1',
      title:      'Mauro',
      desc:       'Persönliches Porträt in Schwarz, Weiß und Grautönen — vom Foto Stein für Stein gelegt.',
      desc_en:    'Personal portrait in black, white and shades of gray — laid stone by stone from a photo.',
      caption:    'Keramik auf Spanplatte, 22×30 cm, ca. 56 h',
      caption_en: 'Ceramic on chipboard, 22×30 cm, approx. 56 h',
      mosaic:     'assets/images/works/portrait-1-mosaic.jpg',
      animation:  null
    }
  ],

  // Sammelkategorie (vormals "Haustiere" + "Verschiedenes" zusammengelegt)
  // — Tiere und alles Übrige. EN-Label: "Mixed". Nur Mosaik-Fotos → kein "original".
  // Im Briefing als "Kosten-Bilder" geführt: alle 10×10×5 cm (Kiste), ca. 4 h.
  verschiedenes: [
    {
      id:         'frosch',
      title:      'Frosch',
      desc:       'Ein Frosch auf einem Ast, in frischen Grün- und tiefen Brauntönen.',
      desc_en:    'A frog on a branch, in fresh greens and deep browns.',
      caption:    'Keramik auf Spanplatte (Kiste), 10×10×5 cm, ca. 4 h',
      caption_en: 'Ceramic on chipboard (box), 10×10×5 cm, approx. 4 h',
      mosaic:     'assets/images/works/frosch-mosaic.jpg',
      animation:  null
    },
    {
      id:         'schildkroete',
      title:      'Schildkröte',
      desc:       'Eine kleine Schildkröte in abgestuften Grüntönen.',
      desc_en:    'A little turtle in graduated shades of green.',
      caption:    'Keramik auf Spanplatte (Kiste), 10×10×5 cm, ca. 4 h',
      caption_en: 'Ceramic on chipboard (box), 10×10×5 cm, approx. 4 h',
      mosaic:     'assets/images/works/schildkroete-mosaic.jpg',
      animation:  null
    },
    {
      id:         'erdbeere',
      title:      'Erdbeere',
      desc:       'Eine reife Erdbeere aus leuchtend roten Keramikbruchstücken.',
      desc_en:    'A ripe strawberry made of bright red ceramic shards.',
      caption:    'Keramik auf Spanplatte (Kiste), 10×10×5 cm, ca. 4 h',
      caption_en: 'Ceramic on chipboard (box), 10×10×5 cm, approx. 4 h',
      mosaic:     'assets/images/works/erdbeere-mosaic.jpg',
      animation:  null
    },
    {
      id:         'pfeife',
      title:      'Pfeife',
      desc:       'Eine klassische Pfeife in warmem Bordeaux und Schwarz.',
      desc_en:    'A classic pipe in warm burgundy and black.',
      caption:    'Keramik auf Spanplatte (Kiste), 10×10×5 cm, ca. 4 h',
      caption_en: 'Ceramic on chipboard (box), 10×10×5 cm, approx. 4 h',
      mosaic:     'assets/images/works/pfeife-mosaic.jpg',
      animation:  null
    }
  ]
};

/* Lesbare Kategorien-Labels (Single Source für Submenu, Tabs, Detail). */
window.WORK_CATEGORIES = {
  ikonen:        'Ikonen',
  portraits:     'Persönliche Porträts',
  verschiedenes: 'Verschiedenes'
};
