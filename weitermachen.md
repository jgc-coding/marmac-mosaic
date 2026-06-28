# Weitermachen — MacMarMosaics

> Stand für die nächste Session. Wird bei `/save-state` komplett NEU geschrieben.
> Dauerhafte Fakten stehen in `CLAUDE.md`, nicht hier.

## Stand (diese Session = v4.2 — Briefing-Update Martina)
- **v4.1 zuvor live:** neue Werke (Mauro/Porträt + Frosch/Schildkröte/Erdbeere/Pfeife) freigestellt eingebaut, nach `main` gemergt + deployt.
- **v4.2 (NEU, auf Branch, noch NICHT gemergt):** Briefing `marmac-website-update-briefing.md` umgesetzt:
  - **Galerie = kontinuierlicher Loop** (Marquee, nur Mosaike, Hover-Pause, Pfeile) statt Slide-Karussell + Auto-Advance. Modi loop/scroll/center.
  - **Detail-Overlay neu:** Mosaik groß, Caption (Material/Maße/Stunden), Original klein, Vor/Zurück (Pfeile/Wisch/←→), Zoom.
  - **Kontakt:** Formular raus → nur E-Mail (Platzhalter `kontakt@platzhalter.de`, TODO) + Instagram im Nav-Stil; neuer Kontakttext.
  - **Footer** in Menü-Schrift. **Captions** je Werk (DE+EN). **Texte:** „Geduld und Zeit", „jedem Gesicht auf dem Foto".
  - **Node:** `actions/checkout@v5` (Pages-Actions haben noch keine Node-24-Version).
- Verifiziert in Preview: Galerie-Logik (Pfeile/Wrap/baseWidth), Detail (Zoom/Nav/Caption/Single), Kontakt, Footer-Font, DE/EN, Mobile — Konsole fehlerfrei. (Marquee-Animation läuft nicht im Headless-Tab: rAF pausiert bei `document.hidden`; im echten Browser läuft sie.)

## Offen / wartet auf Martina (kein Code-Job)
- **Nav-Unterstrich:** bewusst NICHT geändert (Briefing offen) — entscheiden: alle ohne Unterstrich ODER nur „Bisherige Arbeiten".
- **Porträt-Name „Mauro"** bestätigen; **„Lisa"**-Foto liefern (fehlt) → 2. Porträt.
- **Echte E-Mail** statt `kontakt@platzhalter.de`; Instagram-Handle bestätigen.
- EN-Beschreibungen + Captions der Werke gegenlesen; „Über mich"-Foto; Impressum/Datenschutz.

## Nächste mögliche Schritte
1. **v4.2 nach `main` mergen** → deployt das Briefing-Update live (mit Gabriel/Martina abstimmen; ist eine sichtbar große UX-Änderung).
2. Auf echtem Gerät prüfen, dass der Marquee sauber + nahtlos läuft (im Headless-Preview pausiert rAF).
3. Offene Punkte mit Martina klären (Unterstrich, Mauro/Lisa, E-Mail).

## Stolperfallen aktuell
- Lokal: `npx http-server site -p 5173 -c-1 --silent` bzw. Preview „marmac-site".
- Deploy: Änderungen auf `main` → GitHub Actions deployed nach Pages (~20–25 s).
- UTF-8: Datei-Edits nur über Edit-Tool, NIE PowerShell-bulk-replace.
