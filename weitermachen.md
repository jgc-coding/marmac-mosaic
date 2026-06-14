# Weitermachen — MacMarMosaics

> Stand für die nächste Session. Wird bei `/save-state` komplett NEU geschrieben.
> Dauerhafte Fakten stehen in `CLAUDE.md`, nicht hier.

## Stand (diese Session = v4)
- Rebrand MarMacMosaic → **MacMarMosaics** überall (Site, i18n DE/EN, Legal, Footer, Doku).
- Hero + „Vom Foto zum Mosaik" verschmolzen: Titel → Subline → Intro-Block → Menü.
- Finale Klientinnen-Wahl als Default: Menüstil **underline**, Schrift **Source Sans 3 Light**.
- Kategorien „Haustiere" + „Verschiedenes" → eine Kategorie **Verschiedenes** (EN „Mixed").
- Echte Texte für Intro + Über-mich (DE; Über-mich behutsam geglättet) + EN-Übersetzungen.
- Hero-Titel verkleinert (8vw/7rem) → kein Cropping (geprüft 1280/375/320 px).
- Commit `c21f473` (v4); wird auf `main` deployed → live.

## Offen / wartet auf Martina (kein Code-Job)
- **EN-Übersetzungen** der neuen Texte (Intro + Über-mich) gegenlesen lassen.
- Echtes „Über mich"-Foto (ersetzt CSS-Tile in `#ueber-mich`).
- Werke für Kategorien Persönliche Porträts + Verschiedenes (`site/assets/js/works.js`).
- Echte Kontaktdaten (aktuell Platzhalter `kontakt@macmarmosaics.de` / `@macmarmosaics`).
- Impressum + Datenschutz mit echten Angaben füllen.

## Nächste mögliche Schritte
1. Klientinnen-Feedback zur v4 einsammeln (Link ist raus).
2. Optional: GitHub-Repo + Pages-URL von `marmac-mosaic` umbenennen (manuell auf GitHub; leitet alte URL weiter).
3. Optional: Tabs optisch exakt ans Underline-Menü angleichen (permanenter Strich pro Tab; derzeit nur aktiver Tab unterstrichen).
4. Sobald Assets/Texte da: Werke + Foto + echte Kontaktdaten einpflegen.

## Stolperfallen aktuell
- Lokal: `npx http-server site -p 5173 -c-1 --silent` bzw. Preview „marmac-site".
- Deploy: Änderungen auf `main` → GitHub Actions deployed nach Pages (~20–25 s).
- UTF-8: Datei-Edits nur über Edit-Tool, NIE PowerShell-bulk-replace.
