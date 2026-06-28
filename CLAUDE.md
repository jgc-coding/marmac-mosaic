# CLAUDE.md — Projekt-Memory für MacMarMosaics-Website

> Dies ist der Quick-Brief für jede neue Claude-Code-Session in diesem Projekt.
> Beim Öffnen einer neuen Session lädt Claude diese Datei automatisch.

## Was ist das?

One-Page-Landingpage für **Martina** ("MacMarMosaics") — personalisierte, handgefertigte Mosaik-Porträts. Reines statisches HTML/CSS/JS, kein Build. Auto-deployed via GitHub Actions zu GitHub Pages.

**Live:** https://jgc-coding.github.io/marmac-mosaic/
**Repo:** https://github.com/jgc-coding/marmac-mosaic

## Wichtige Konventionen

- **Brand-Schreibung:** überall **„MacMarMosaics"** ohne Bindestrich. Mobile-Hero bricht via `<br class="hero__break">` nach „MacMar" um (CSS toggelt das).
- **Sprache:** Deutsch (Default). Englisch via Sprachschalter aktiv.
- **„Porträt"-Begriff** soll prominent sichtbar bleiben (Hero-Subline, Hero-Intro-Block, Kontakt-Headline) — Martinas explizite Vorgabe.
- **Ikonen-Werke** (Dalí, Elvis, Frida, Audrey) sind nur Inspiration, NICHT zum Verkauf. Hinweis-Text in der Galerie-Section macht das klar.

## Schriften

| Verwendung | Font | Notiz |
|---|---|---|
| Display (Hero-Title, Section-Headlines) | **WindSong** | Kursive Handschrift |
| Subline / Fallback / Brand-Mobile | **Cormorant Garamond** | (Italic im Hero) |
| Body / Form / Footer | **Inter** | |
| Menü (umschaltbar) | **`--font-menu`** (Default: Source Sans 3 Light) | 4 Varianten via Picker |

**Schriftpicker** (für Martina): `?fonts=picker` öffnet Widget unten rechts mit 4 Optionen:
`italianno` (Gabriola-like), `sans` (Source Sans 3 Light, Candara-like), `courier` (Courier Prime), `default` (Inter). LocalStorage-Key: `marmac-menu-font`. **Finale Wahl der Klientin: `sans` („A Sans Light", Source Sans 3 Light) — ist jetzt der Default in `:root` (styles.css).**

## Menü-Stile (5 Varianten via `?menu=picker`)

Martina hat ihren Lieblingsstil gewählt. Picker-Widget unten links bei `?menu=picker`. Direkt-Links: `?menu=pills|outline|underline|lines|solid`. LocalStorage-Key: `marmac-menu-style`. **Finale Wahl & Default (ohne Wahl): `underline`** — gesetzt via `data-menu-style="underline"` am `<body>` aller HTML-Seiten (JS-Fallback in main.js ebenfalls `underline`).

| Stil | Beschreibung |
|---|---|
| **pills** | Pill mit cremig getöntem Background + Akzent-Border |
| **outline** | Pill nur mit Border, transparenter Background |
| **underline** (Default) | Kein Container, dünner Permanent-Strich pro Item |
| **lines** | Eine durchgehende Linie oben + unten am gesamten Menü, deutlich überstehend |
| **solid** | Kräftiger dunkler Pill mit heller Schrift |

Implementation: CSS reagiert auf `body[data-menu-style="…"]`. Wichtig: bei neuen Stil-Varianten muss die Spezifität via `body[…]` (nicht nur `[…]`) sein — sonst überschreibt `.menu--hero .menu__link { color }` den Variantencolor.

## Architektur

```
site/
├── index.html              # Single-Page-HTML (Hero enthält den Intro-Block)
├── impressum.html          # Platzhalter-Seite (im Footer verlinkt)
├── datenschutz.html        # Platzhalter (vom Form + Footer verlinkt)
└── assets/
    ├── css/styles.css      # 16 Sektionen, kommentiert; Mobile-first
    ├── js/
    │   ├── works.js        # window.WORKS — Single Source of Truth aller Werke
    │   ├── i18n.js         # DE/EN-Übersetzungen + Render-Logik
    │   ├── main.js         # Karussell, Submenu, Detail-Overlay, Form, Pickers
    │   └── legal.js        # Mini-Loader für Impressum/Datenschutz
    └── images/
        ├── hero-marmac-mosaic.png   # Aus v2, nicht mehr verwendet (Hero ist Text)
        └── works/                    # Vorher/Nachher-Bilder pro Werk
.github/workflows/pages.yml  # Auto-Deploy zu Pages bei push auf main
.claude/launch.json          # Preview-Server-Config für Claude Code
```

## Werke ergänzen / ändern

Alle Werke leben in [`site/assets/js/works.js`](site/assets/js/works.js). Neues Werk:

1. Bilder in `site/assets/images/works/` ablegen.
2. Eintrag in die passende Kategorie (`ikonen`, `portraits`, `verschiedenes`).
3. Felder pro Werk: `id`, `title`, `desc` (DE), `desc_en` (EN, optional), `original` (**optional**), `mosaic`, `animation` (null oder MP4-Pfad).
4. Karussell + Detail-Overlay rendern automatisch neu.

**Werke ohne Vorher-Foto:** Fehlt `original`, rendert main.js automatisch eine **einzelne, zentrierte Mosaik-Karte** (`.slide--single` / `.slide__solo`) in natürlicher Bildproportion statt des getilteten Vorher/Nachher-Paars; das Detail-Overlay zeigt dann nur das Mosaik (`.detail--single`). Genutzt für die neuen Werke in `portraits` + `verschiedenes`.

Aktuell:
- **ikonen** (Vorher/Nachher-Paare): Audrey · Dalí · Elvis · Frida.
- **portraits** (Persönliche Porträts, nur Mosaik): Persönliches Porträt (`portrait-1`). Weitere folgen.
- **verschiedenes** (EN „Mixed", nur Mosaik): Frosch · Schildkröte · Erdbeere · Pfeife.

Die neuen Mosaik-Fotos wurden aus iPhone-HEIC (`Arbeitsproben/Neu/`) gewonnen: nach PNG gewandelt, Hintergrund per **rechteckigem Zuschnitt knapp innerhalb der Fliesenkante** entfernt (Pillow/pillow-heif; rembg taugte hier NICHT, weil das Salient-Modell nur das farbige Motiv statt der cremefarbenen Fliese erkennt) und als `…-mosaic.jpg` (≤ 1500 px, q90) gespeichert. (Die frühere Kategorie „Haustiere" wurde in „Verschiedenes" zusammengelegt.)

## i18n (DE/EN-Switcher)

- HTML-Knoten markiert mit `data-i18n="key"` (Plain-Text), `data-i18n-html="key"` (mit Markup), `data-i18n-placeholder="key"`, `data-i18n-aria="key"`.
- Strings in `i18n.js` unter `I18N.strings.de` und `I18N.strings.en`.
- Sprachschalter ist die schwebende EN/DE-Pille top-right. LocalStorage-Key: `marmac-lang`. Default folgt `navigator.language`.
- Beim Sprachwechsel ruft i18n auch `window.refreshCarousel()` auf → Karussell rendert Werk-Beschreibungen in der neuen Sprache.

## Karussell (Bisherige Arbeiten)

- 3 Tabs (Subkategorien: Ikonen · Persönliche Porträts · Verschiedenes). Klick filtert.
- Prev/Next-Buttons + Tastatur (←/→) + Touch-Swipe (Threshold 50 px) + Dot-Indikatoren.
- **Auto-Advance alle 6 Sekunden**. Stoppt **dauerhaft** bei jeder manuellen Interaktion (Click, Swipe, Tab-Wechsel, Detail-Open). Pause bei `document.hidden`. Kein Auto bei `prefers-reduced-motion`.
- Wrap-around (Modulo-Index), Buttons nicht mehr disabled an Rändern.
- Slide-Layout: Pair-Container 5:4, Bilder 54 % Breite, Original leicht tiefer als Mosaik (+6 % top), Tilts ±2,5°.

## Detail-Overlay (Klick aufs Werk)

- Öffnet sich bei Klick auf Slide-Bild. Side-by-Side Original + Mosaik.
- **Animations-Slot** `.detail__animation` (data-detail-animation) — wenn `work.animation` in `works.js` einen Pfad enthält, hängt main.js automatisch `<video autoplay muted controls playsinline>` ein und blendet das Side-by-Side aus (`.detail.has-animation`).
- **Empfohlenes Format für Animations-Assets:** MP4 H.264, 1080 p, ≤ 8 MB. Optional WebM als zweite `<source>`. Lottie nur bei vektor-basierten Animationen.

## Wie arbeite ich an dieser Site

### Lokal entwickeln
```bash
npx http-server site -p 5173 -c-1 --silent
```
Dann <http://localhost:5173> öffnen.

In Claude Code: Preview-MCP automatisch via `.claude/launch.json` mit Name `marmac-site`.

### Deployen
```bash
git add .
git commit -m "..."
git push
```
GitHub Actions Workflow läuft in ~17–25 Sekunden, deployed nach Pages.

### Watch deploy
```bash
gh run list --limit 1
gh run watch <id> --exit-status
```

## Backup-Strategie

- **v1 (mit Hero-Video)** ist als Git-Tag `v1-with-video` gesichert + GitHub Release.
- Rückholbar lokal: `git checkout v1-with-video` (detached) oder `git checkout -b restore-v1 v1-with-video`.
- Release: <https://github.com/jgc-coding/marmac-mosaic/releases/tag/v1-with-video>

## Storage-Keys (localStorage)

| Key | Zweck | Werte |
|---|---|---|
| `marmac-lang` | Sprachwahl | `de` \| `en` |
| `marmac-menu-style` | Menü-Stil | `pills` \| `outline` \| `underline` \| `lines` \| `solid` |
| `marmac-menu-font` | Menü-Schrift | `default` \| `italianno` \| `sans` \| `courier` |

## Versions-Historie (kurz)

- **v1** (Tag `v1-with-video`): Hero war ein loopendes Brand-Reveal-Video, flache Galerie mit 3 Vorher/Nachher-Paaren (Dalí, Elvis, Frida).
- **v2**: Briefing-Überarbeitung — Video raus, statisches Hero-Bild, doppelte Nav, Subkategorien, Karussell, Detail-Overlay mit Animations-Slot, DSGVO, Impressum/Datenschutz.
- **v3**: Hero ohne Bild, nur WindSong-Schriftzug + Cormorant-Italic-Subline auf hellem Gradient; DE/EN-Switcher; Karussell-Auto-Advance; Audrey hinzu; WhatsApp raus, Instagram rein.
- **v3-Fix**: Hero-Titel-Cropping, Submenu-Richtung, Menü-Pills als Affordance.
- **v3+/++/+++**: Menü-Stil-Picker (5 Varianten), Brand ohne Bindestrich, Mobile-Submenu-Fix, Lines-Variante mit durchgehenden Linien, Hero-Gradient asymmetrisch + visuelle Grenze zur Intro.
- **v4**: Rebrand auf **MacMarMosaics**; Hero + „Vom Foto zum Mosaik" verschmolzen (Reihenfolge im Hero: Titel → Subline → Intro-Block → Menü, Submenu öffnet nach oben); finale Menü-Wahl als Default (Stil **underline**, Schrift **Source Sans 3 Light**); Kategorien „Haustiere" + „Verschiedenes" zu **Verschiedenes** (EN „Mixed") zusammengelegt; echte Intro- + Über-mich-Texte ersetzen die Platzhalter.
- **v4.1**: Erste echte Werke in **portraits** (Persönliches Porträt) + **verschiedenes** (Frosch, Schildkröte, Erdbeere, Pfeife) ergänzt — aus iPhone-HEIC freigestellt (rechteckiger Zuschnitt, Hintergrund weg). Neuer additiver **„Nur-Mosaik"-Render** (`.slide--single` / `.detail--single`) für Werke ohne Vorher-Foto; Vorher/Nachher-Werke unverändert.

## Aktuelle Defaults (was Besucher ohne URL-Parameter sehen)

- Sprache: nach Browser-Sprache (de oder en)
- Menü-Stil: **underline** (dünner Permanent-Strich pro Item) — via `data-menu-style="underline"` am `<body>`
- Menü-Schrift: **sans** („A Sans Light", Source Sans 3 Light) — via `--font-menu` in `:root`

> localStorage-Wahl aus dem Picker (`marmac-menu-style` / `marmac-menu-font`) überschreibt diese Defaults weiterhin pro Browser.

## Offene Punkte — was Martina noch nachliefert

- Echtes Portrait-Foto für „Über mich" (`#ueber-mich` → ersetzt CSS-Tile-Placeholder)
- Weitere Werke für Persönliche Porträts + Verschiedenes (erste Werke sind drin; Titel/Name des Porträts „portrait-1" ggf. anpassen)
- EN-Beschreibungen der neuen Werke (in `works.js` `desc_en`) von Martina gegenlesen lassen
- Echte Kontaktdaten — aktuell Platzhalter `kontakt@macmarmosaics.de` / `@macmarmosaics` in `index.html`
- Impressum + Datenschutz mit echten Angaben befüllen
- EN-Übersetzungen der neuen Texte (Intro + Über mich) von Martina gegenlesen lassen
- Eventuell: extern produzierte Mosaik-Explosions-Animation (MP4) pro Werk in `works.js` einhängen
- Optional: GitHub-Repo + Pages-URL von `marmac-mosaic` auf den neuen Namen umbenennen (manueller Schritt; GitHub leitet die alte URL automatisch weiter)

## Bekannte Quirks

- **PowerShell + UTF-8:** PS 5.1 verstümmelt deutsche Umlaute beim Lesen/Schreiben von UTF-8-Dateien. **NICHT** PowerShell für bulk-replace nutzen — Edit-Tool oder Bash mit `sed` verwenden.
- **CSS-Spezifität bei Menü-Varianten:** `.menu--hero .menu__link { color }` hat 0,2,0 — höher als `[data-menu-style="…"] .menu__link` (0,1,1). Neue Varianten müssen mit `body[data-menu-style="…"]` qualifizieren (0,2,1).
- **`display: flex` überschreibt das HTML-`[hidden]`-Default** — für solche Elemente immer explizit `.element[hidden] { display: none }` setzen (siehe `.carousel__btn[hidden]`, `.carousel__empty[hidden]`).
- **Mobile-Submenu** öffnet `left: 0; right: auto` (nicht `right: 0`), weil „Arbeiten" links sitzt und sonst nach links über den Viewport hinausschneidet.
- **Preview-Verifikation:** `preview_screenshot` ist in dieser Umgebung wiederholt beim Bild-Export gehangen — verlässlich sind `preview_snapshot` (Struktur/Text) + Computed-Styles via `preview_eval` (Schrift/Stil/Cropping). `preview_click` löst gelegentlich die JS-Handler nicht aus (Sprachschalter, Tabs) — dann ein echtes `MouseEvent` per `preview_eval` dispatchen und Ergebnis prüfen.
