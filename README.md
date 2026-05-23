# MarMac-Mosaic — Website

One-Page-Landingpage für Martina ("MarMac-Mosaic") — personalisierte, handgefertigte Mosaik-Porträts. Reines HTML/CSS/JS, kein Build.

## Lokale Entwicklung

Direkt `site/index.html` im Browser öffnen, oder besser einen kleinen Server starten:

```bash
npx http-server site -p 5173 -c-1 --silent
```

Dann <http://localhost:5173> öffnen.

## Deployment

GitHub Pages deployed automatisch bei jedem Push auf `main` (siehe [.github/workflows/pages.yml](.github/workflows/pages.yml)). Der `site/`-Ordner ist die Quelle.

### Updates

```bash
git add .
git commit -m "deine änderung"
git push
```

Pages baut & deployed in ~30 Sekunden.

## Struktur

```
site/
├── index.html                  # Single-Page-HTML (Hero, Intro, Arbeiten, Über mich, Kontakt)
├── impressum.html              # Platzhalter, im Footer verlinkt
├── datenschutz.html            # Platzhalter, von Form + Footer verlinkt
└── assets/
    ├── css/styles.css          # Designsystem + alle Komponenten
    ├── js/
    │   ├── works.js            # Single Source of Truth: Werke nach Kategorie
    │   ├── i18n.js             # Mini-i18n-Stub (für späteren DE/EN-Switcher)
    │   └── main.js             # Karussell, Submenu, Detail-Overlay, Form, Font-Switcher
    └── images/
        ├── hero-marmac-mosaic.png   # Hero-Schriftzug (statisch)
        └── works/                    # Vorher/Nachher-Bilder pro Werk
.github/workflows/pages.yml     # Auto-Deploy nach Pages
```

## Schlüssel-Konzepte (für Wartung)

### Werke ergänzen / ändern
Alle Werke leben in [`site/assets/js/works.js`](site/assets/js/works.js). Neues Werk anlegen:

1. Bilder in `site/assets/images/works/` ablegen.
2. Eintrag in die passende Kategorie (`ikonen`, `portraits`, `haustiere`, `verschiedenes`).
3. Fertig — Karussell + Detail-Overlay rendern automatisch.

### Detail-Overlay & Explosions-Animation
Bei Klick auf ein Werk im Karussell öffnet sich ein Detail-Overlay. In `works.js` kann pro Werk ein `animation`-Pfad gesetzt werden:

```js
{ id: 'dali', ..., animation: 'assets/videos/dali-explosion.mp4' }
```

→ Das Overlay hängt ein `<video>` ein und blendet das Side-by-Side-Paar aus. Bei `animation: null` wird stattdessen Original + Mosaik nebeneinander gezeigt (Fallback).

**Empfohlenes Format**: MP4 H.264, 1080p, ≤ 8 MB. Optional WebM als zweite `<source>`. Lottie (JSON) nur sinnvoll bei vektor-basierten Animationen.

### Menü-Schrift-Switcher
URL `?fonts=picker` zeigt unten rechts ein Widget mit vier Optionen (Italianno / Source Sans 3 / Courier Prime / Standard). Die Wahl persistiert in `localStorage` unter `marmac-menu-font` und gilt für alle Folge-Besuche dieses Browsers.

Implementation: CSS-Variable `--font-menu` wird gesetzt. Verwendet von `.menu__link` und `.tab` (siehe `styles.css`, Abschnitt 1 + 4).

### i18n vorbereitet (aktuell nur DE)
[`site/assets/js/i18n.js`](site/assets/js/i18n.js) stellt `window.I18N` mit Stub-API bereit. Aktuell keine Übersetzungen aktiv. Für späteren DE/EN-Switcher:

1. Übersetzbare Knoten im HTML mit `data-i18n="key"` markieren.
2. Strings in `i18n.strings.en` befüllen.
3. Sprachschalter oben rechts einbauen, der `I18N.setLanguage('en')` ruft.

## Backup & Versionen

- **v1 (mit Hero-Video)** ist als Git-Tag `v1-with-video` gesichert + als GitHub-Release verfügbar.
- Rückholbar: `git checkout v1-with-video` (detached) oder `git checkout -b restore-v1 v1-with-video` (neuer Branch).
- Release-Seite: <https://github.com/jgc-coding/marmac-mosaic/releases/tag/v1-with-video>

## Was Martina noch nachliefert (kein Code-Job)

- Echter Intro-Text in `index.html` (`#intro` → ersetzt Platzhalter)
- Echter "Über mich"-Text + Foto (`#ueber-mich` → ersetzt CSS-Tile-Placeholder)
- Werke in den Kategorien Persönliche Porträts, Haustiere, Verschiedenes
- Audrey Hepburn (Ikonen) — sobald Asset bereit
- Echte Kontaktdaten (E-Mail, WhatsApp-Nummer in `index.html`)
- Instagram-Link → in `index.html` das `hidden`-Attribut am `[data-instagram-slot]`-Anker entfernen, `href` setzen
- Impressum + Datenschutz mit echten Angaben befüllen
- Entscheidung über finale Menü-Schriftart (Italianno / Sans / Courier / Standard)

## Hinweise

- **Quellordner `Hero Sektion/` und `Arbeitsproben/` sind via `.gitignore` ausgeschlossen** — sie liegen nur lokal.
- Kontakt-Formular hat **kein Backend** — Submit prüft DSGVO-Checkbox und zeigt eine Hinweismeldung. Anbindung an z. B. [Formspree](https://formspree.io) später möglich.
