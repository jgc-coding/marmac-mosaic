# MarMac-Mosaic — Website

One-Page-Landingpage für Martina ("MarMac-Mosaic") — personalisierte, handgefertigte Mosaikbilder. Reines HTML/CSS/JS, kein Build.

## Lokale Entwicklung

Direkt `site/index.html` im Browser öffnen, oder besser einen kleinen Server starten (Video-Autoplay läuft auf `file://` nicht überall):

```bash
npx http-server site -p 5173 -c-1 --silent
```

Dann <http://localhost:5173> öffnen.

## Deployment

GitHub Pages deployed automatisch bei jedem Push auf `main` (siehe [.github/workflows/pages.yml](.github/workflows/pages.yml)). Der `site/`-Ordner ist die Quelle.

### Einmaliges Setup (für neuen Klon)

1. **Repo auf GitHub anlegen** — z. B. `marmac-mosaic`, **public** (für Pages auf Free-Accounts), ohne README/`.gitignore` (sind hier schon).
2. **Remote setzen + pushen**:
   ```bash
   git remote add origin https://github.com/<dein-user>/marmac-mosaic.git
   git branch -M main
   git push -u origin main
   ```
3. **Pages aktivieren** — auf GitHub: **Settings → Pages → Build and deployment → Source: "GitHub Actions"** auswählen.
4. Nach ~30 Sekunden zeigt der Actions-Tab die URL, etwa `https://<dein-user>.github.io/marmac-mosaic/`. Diese Martina schicken.

### Updates später

Einfach Dateien in `site/` ändern, dann:
```bash
git add .
git commit -m "deine änderung"
git push
```
Pages baut & deployed automatisch.

## Struktur

```
site/
├── index.html                  # Single-Page-HTML
├── assets/
│   ├── css/styles.css          # Warm-erdiges Designsystem
│   ├── js/main.js              # Lightbox, Scroll-Reveal, Form-Stub
│   ├── video/hero.mp4          # Hero-Loop-Video
│   └── images/works/           # Vorher/Nachher-Mosaike
.github/workflows/pages.yml     # Auto-Deploy nach Pages
.claude/launch.json             # Preview-Server für Claude Code
```

## Hinweise

- **Quellordner `Hero Sektion/` und `Arbeitsproben/` sind via `.gitignore` ausgeschlossen** — sie liegen nur lokal. Web-fertige Kopien sind in `site/assets/`.
- Kontakt-Formular hat **kein Backend** — Submit zeigt nur eine Hinweismeldung. Später z. B. an [Formspree](https://formspree.io) anbinden.
- Impressum + Datenschutzerklärung fehlen noch und sind für gewerbliche Nutzung in DE Pflicht.
