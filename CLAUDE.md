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
3. Felder pro Werk: `id`, `title`, `desc` (DE), `desc_en` (EN, opt.), `caption` (Material/Maße/Stunden, DE), `caption_en` (EN, opt.), `original` (**optional**), `mosaic`, `animation` (null oder MP4-Pfad).
4. Galerie + Detail-Overlay rendern automatisch neu.

**Werke ohne Vorher-Foto:** Fehlt `original`, zeigt das Detail-Overlay nur das Mosaik (`.detail--single`, kein kleines Original). Die Galerie-Übersicht zeigt ohnehin immer nur Mosaike. Genutzt für `portraits` + `verschiedenes`.

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

## Galerie (Bisherige Arbeiten) — kontinuierlicher Loop

- 3 Tabs (Ikonen · Persönliche Porträts · Verschiedenes). Klick filtert.
- **Übersicht zeigt NUR Mosaike** (kein Original) als quadratische Karten (`.gcard`, `object-fit: contain` → ganze Mosaik sichtbar, Porträts mit dezenten Seitenrändern, keine angeschnittenen Köpfe) + kleiner Titel.
- **Nahtloser Endlos-Loop (Marquee):** Karten-Liste wird vervielfacht (`copies`), Track per `requestAnimationFrame` gleichmäßig nach links geschoben (`SPEED` px/s); nach **exakt einer Listenbreite** (`baseWidth()` über `offsetLeft` der ersten Karte der 2. Kopie) zurückgesetzt → **kein sichtbares Zurückspringen**.
- Pausiert bei **Hover/Touch** und `document.hidden`. **Pfeile** schubsen manuell (eine Kartenbreite).
- **Modi:** `loop` (≥2 Werke, normale Motion) · `scroll` (`prefers-reduced-motion`, nativ scrollbar, kein Auto) · `center` (1 Werk, statisch zentriert, Pfeile aus). CSS-Klasse `carousel__track--{loop|scroll|center}`.
- Hinweis: rAF pausiert in unsichtbaren/Hintergrund-Tabs (Headless-Preview!) — die Animation testet man nur im echten sichtbaren Browser; Logik (Pfeile/Wrap) ist synchron prüfbar.

## Detail-Overlay (Klick aufs Mosaik)

- **Mosaik groß**, darunter **Caption** (`work.caption` — Material/Maße/Stunden), **Beschreibung** (`work.desc`), dann das **Originalfoto KLEIN** (`.detail__original-fig`, nur wenn `work.original` existiert; `max-height: 20vh` ≪ Mosaik 58vh → Vorher/Nachher bleibt).
- **Vor/Zurück** durch die Werke der Kategorie: Pfeile (`.detail__nav`), Tastatur ←/→, Touch-Wischen (Threshold 50 px, nicht im Zoom). Wrap via Modulo.
- **Zoom:** Klick aufs Mosaik (`.detail__zoom`) → `.detail--zoomed` (Mosaik natürliche Größe + scrollbar). Esc verlässt erst den Zoom, dann das Overlay.
- **Animations-Slot** `.detail__animation` (data-detail-animation) — wenn `work.animation` einen Pfad enthält, hängt main.js `<video autoplay muted controls playsinline>` ein und blendet Mosaik+Original aus (`.detail.has-animation`). Empfohlen: MP4 H.264, 1080 p, ≤ 8 MB.

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
- **v4.1**: Erste echte Werke in **portraits** (Persönliches Porträt) + **verschiedenes** (Frosch, Schildkröte, Erdbeere, Pfeife) ergänzt — aus iPhone-HEIC freigestellt (rechteckiger Zuschnitt, Hintergrund weg). Neuer additiver „Nur-Mosaik"-Render für Werke ohne Vorher-Foto.
- **v4.2** (Briefing-Update Martina): **Galerie als kontinuierlicher Loop** (Marquee, nur Mosaike, Hover-Pause, Pfeile) — ersetzt das Slide-für-Slide-Karussell + Auto-Advance. **Detail-Overlay** neu: Mosaik groß, Original klein, Vor/Zurück (Pfeile/Wisch/←→), Zoom, Caption. **Kontakt:** Formular raus → nur E-Mail (Platzhalter `kontakt@platzhalter.de`) + Instagram im Nav-Stil. **Footer** in Menü-Schrift. Werk-Captions (Material/Maße/Stunden) je Werk. Porträt `portrait-1` → Titel **„Mauro"** (Annahme, bärtiger Mann). Texte: „Geduld und Zeit", „jedem Gesicht auf dem Foto". Node: `actions/checkout@v5`.

## Aktuelle Defaults (was Besucher ohne URL-Parameter sehen)

- Sprache: nach Browser-Sprache (de oder en)
- Menü-Stil: **underline** (dünner Permanent-Strich pro Item) — via `data-menu-style="underline"` am `<body>`
- Menü-Schrift: **sans** („A Sans Light", Source Sans 3 Light) — via `--font-menu` in `:root`

> localStorage-Wahl aus dem Picker (`marmac-menu-style` / `marmac-menu-font`) überschreibt diese Defaults weiterhin pro Browser.

## Offene Punkte — was Martina noch nachliefert / zu klären ist

- **Nav-Unterstrich-Verhalten** (Briefing „Offen"): unklar, ob ALLE Menüpunkte ohne Unterstrich oder nur „Bisherige Arbeiten". → **bewusst NICHT geändert**, bis Martina entscheidet.
- **Porträt-Name bestätigen:** `portrait-1` ist als **„Mauro"** eingepflegt (Annahme). **„Lisa"** aus dem Briefing fehlt das Foto — Bild liefern, dann zweites Porträt einbauen.
- **Echte E-Mail-Adresse:** aktuell Platzhalter `kontakt@platzhalter.de` (in `index.html`, als TODO markiert) → ersetzen. Instagram-Handle `@macmarmosaics` ggf. bestätigen.
- EN-Beschreibungen + Captions der neuen Werke (`works.js` `desc_en` / `caption_en`) gegenlesen.
- Echtes Portrait-Foto für „Über mich" (`#ueber-mich` → ersetzt CSS-Tile-Placeholder).
- Impressum + Datenschutz mit echten Angaben befüllen.
- Eventuell: Mosaik-Explosions-Animation (MP4) pro Werk in `works.js` einhängen.
- Optional: GitHub-Repo + Pages-URL von `marmac-mosaic` auf den neuen Namen umbenennen (GitHub leitet die alte URL weiter).

## Bekannte Quirks

- **PowerShell + UTF-8:** PS 5.1 verstümmelt deutsche Umlaute beim Lesen/Schreiben von UTF-8-Dateien. **NICHT** PowerShell für bulk-replace nutzen — Edit-Tool oder Bash mit `sed` verwenden.
- **CSS-Spezifität bei Menü-Varianten:** `.menu--hero .menu__link { color }` hat 0,2,0 — höher als `[data-menu-style="…"] .menu__link` (0,1,1). Neue Varianten müssen mit `body[data-menu-style="…"]` qualifizieren (0,2,1).
- **`display: flex` überschreibt das HTML-`[hidden]`-Default** — für solche Elemente immer explizit `.element[hidden] { display: none }` setzen (siehe `.carousel__btn[hidden]`, `.carousel__empty[hidden]`).
- **Mobile-Submenu** öffnet `left: 0; right: auto` (nicht `right: 0`), weil „Arbeiten" links sitzt und sonst nach links über den Viewport hinausschneidet.
- **Preview-Verifikation:** `preview_screenshot` ist in dieser Umgebung wiederholt beim Bild-Export gehangen — verlässlich sind `preview_snapshot` (Struktur/Text) + Computed-Styles via `preview_eval` (Schrift/Stil/Cropping). `preview_click` löst gelegentlich die JS-Handler nicht aus (Sprachschalter, Tabs) — dann ein echtes `MouseEvent` per `preview_eval` dispatchen und Ergebnis prüfen.
