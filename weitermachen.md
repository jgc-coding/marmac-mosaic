# Weitermachen — MacMarMosaics

> Stand für die nächste Session. Wird bei `/save-state` komplett NEU geschrieben.
> Dauerhafte Fakten stehen in `CLAUDE.md`, nicht hier.

## Stand (diese Session = v4.1)
- **Neue Werke ergänzt** aus iPhone-HEIC (`Arbeitsproben/Neu/`, gitignored):
  - **portraits:** Persönliches Porträt (`portrait-1`).
  - **verschiedenes:** Frosch, Schildkröte, Erdbeere, Pfeife.
- Bilder freigestellt = **rechteckiger Zuschnitt knapp innerhalb der Fliesenkante** (Hintergrund Holz/Folie/Stoff weg). HEIC→PNG via pillow-heif; Zuschnitt-Skripte im Scratchpad. rembg taugte NICHT (erkennt nur das Motiv, nicht die cremefarbene Fliese).
- Neuer **additiver „Nur-Mosaik"-Render**: fehlt `original` in works.js → einzelne, zentrierte Karte (`.slide--single`/`.slide__solo`) + Detail nur Mosaik (`.detail--single`). Vorher/Nachher-Werke (Ikonen) unverändert (Regression geprüft).
- Verifiziert in Preview: Render/Detail/DE-EN/Mobile ok, Konsole fehlerfrei. (Screenshot-Tool hängt in dieser Umgebung — via DOM/Computed-Styles geprüft.)
- Branch `claude/laughing-goldberg-0b9f75`. Noch NICHT auf `main` gemergt → noch nicht live.
- Davor (v4): Rebrand MacMarMosaics, Hero/Intro-Merge, finale Menü-Wahl, echte Texte.

## Offen / wartet auf Martina (kein Code-Job)
- **Titel/Name** für `portrait-1` (aktuell „Persönliches Porträt") prüfen/anpassen.
- **EN-Beschreibungen** der neuen Werke (works.js `desc_en`) + alte Texte (Intro/Über-mich) gegenlesen.
- Echtes „Über mich"-Foto (ersetzt CSS-Tile in `#ueber-mich`).
- Weitere Werke für Persönliche Porträts + Verschiedenes (`site/assets/js/works.js`).
- Echte Kontaktdaten (aktuell Platzhalter `kontakt@macmarmosaics.de` / `@macmarmosaics`).
- Impressum + Datenschutz mit echten Angaben füllen.

## Nächste mögliche Schritte
1. Branch `claude/laughing-goldberg-0b9f75` nach `main` mergen → deployt die neuen Werke live (mit Martina abstimmen).
2. Klientinnen-Feedback zu den neuen Werken + ggf. Porträt-Titel einsammeln.
3. Optional: GitHub-Repo + Pages-URL von `marmac-mosaic` umbenennen (manuell auf GitHub; leitet alte URL weiter).
4. Optional: Tabs optisch exakt ans Underline-Menü angleichen (permanenter Strich pro Tab; derzeit nur aktiver Tab unterstrichen).
5. Sobald weitere Assets/Texte da: Werke + „Über mich"-Foto + echte Kontaktdaten einpflegen.

## Stolperfallen aktuell
- Lokal: `npx http-server site -p 5173 -c-1 --silent` bzw. Preview „marmac-site".
- Deploy: Änderungen auf `main` → GitHub Actions deployed nach Pages (~20–25 s).
- UTF-8: Datei-Edits nur über Edit-Tool, NIE PowerShell-bulk-replace.
