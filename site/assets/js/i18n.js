/* ============================================================
   MarMacMosaic — i18n.js
   DE/EN-Sprachschalter (aktiv, persistiert in localStorage).
   --------------------------------------------------------------
   Verwendung im HTML:
   - <h2 data-i18n="works.title">Eine Auswahl</h2>
   - <input data-i18n-placeholder="field.message.placeholder" />
   - <a data-i18n-href-de="impressum.html" data-i18n-href-en="...">
   - Element mit data-i18n-html erlaubt Markup (z. B. <a> drin).

   Neue Strings → einfach in beiden Sprachen unten ergänzen.
   ============================================================ */
window.I18N = {
  current: 'de',

  strings: {
    de: {
      'meta.title':           'MarMacMosaic — Personalisierte Mosaik-Porträts von Martina',
      'meta.description':     'MarMacMosaic: handgefertigte, personalisierte Mosaik-Porträts aus deinem Lieblingsmotiv. Vom Foto zum echten Kunstwerk.',

      'nav.works':            'Arbeiten',
      'nav.about':            'Über mich',
      'nav.contact':          'Kontakt',
      'nav.lang.toggle':      'EN',
      'nav.lang.aria':        'Switch language to English',
      'nav.back':             '← Zurück zur Startseite',

      'submenu.icons':        'Ikonen',
      'submenu.portraits':    'Persönliche Porträts',
      'submenu.pets':         'Haustiere',
      'submenu.misc':         'Verschiedenes',

      'hero.subline':         'Personalisierte Mosaik-Porträts',

      'intro.eyebrow':        'Vom Foto zum Mosaik',
      'intro.title':          'Dein Porträt — Stein für Stein.',
      'intro.body1':          'Aus einem persönlichen Foto entsteht ein handgesetztes Mosaik-Porträt — sei es eine geliebte Person, ein Haustier oder eine Ikone, die dich begleitet. Jedes Werk ist ein Unikat, gefertigt aus tausenden kleinen Glas-, Keramik- und Natursteinen.',
      'intro.body2':          '(Dieser Text ist ein Platzhalter und wird später durch Martinas eigene Worte ersetzt.)',

      'works.eyebrow':        'Bisherige Arbeiten',
      'works.title':          'Eine Auswahl',
      'works.empty':          'Bald hier zu sehen.',
      'works.note.html':      'Die hier gezeigten Werke der Kategorie <em>Ikonen</em> dienen als Inspiration — sie sind nicht zum Verkauf. Gerne fertige ich dir dein eigenes Mosaik-Porträt: <a href="#kontakt">Kontaktiere mich</a>.',

      'about.eyebrow':        'Über mich',
      'about.title':          'Hinter jedem Stein steckt Geduld.',
      'about.body1':          'Mein Name ist Martina. Seit Jahren setze ich Mosaike aus Glas-, Keramik- und Natursteinen. Jedes Werk entsteht in Handarbeit — Stein für Stein, oft über Wochen hinweg.',
      'about.body2':          'Was mich am Mosaik fasziniert: aus tausenden winzigen Teilen entsteht ein einziges großes Porträt. Genau wie Erinnerungen, die ich für meine Kundinnen und Kunden in dauerhafte Kunst verwandle.',
      'about.body3':          '(Dieser Text ist ein Platzhalter und wird später durch Martinas eigene Worte ersetzt.)',

      'contact.eyebrow':      'Kontakt',
      'contact.title':        'Lass uns dein Mosaik-Porträt besprechen.',
      'contact.lede':         'Schreib mir, welches Motiv dir vorschwebt — oder nutze direkt E-Mail oder Instagram.',

      'field.name':           'Name',
      'field.email':          'E-Mail',
      'field.message':        'Nachricht',
      'field.dsgvo.html':     'Ich habe die <a href="datenschutz.html">Datenschutzerklärung</a> gelesen und stimme zu.',

      'contact.send':         'Anfrage senden',
      'contact.note.dsgvo':   'Bitte bestätige die Datenschutzerklärung, um fortzufahren.',
      'contact.note.thanks':  'Vielen Dank! Das Formular ist noch nicht angebunden — bitte nutze vorerst E-Mail oder Instagram rechts.',
      'contact.direct.intro': 'Oder direkt:',
      'contact.email.label':  'E-Mail schreiben',
      'contact.instagram.label': 'Instagram',
      'contact.instagram.sub':   '@marmac.mosaic',
      'contact.hint':         'Hinweis: Alle Kontaktdaten sind Platzhalter und werden später durch Martinas echte Adressen ersetzt.',

      'detail.original':      'Originalfoto',
      'detail.mosaic':        'Mosaik',

      'footer.claim':         'Handgefertigte Mosaik-Porträts aus deinem Motiv.',
      'footer.imprint':       'Impressum',
      'footer.privacy':       'Datenschutz',
      'footer.legal.followup':'',

      'imprint.eyebrow':      'Rechtliches',
      'imprint.title':        'Impressum',
      'imprint.placeholder':  'Hinweis: Diese Seite ist ein Platzhalter und wird mit den tatsächlichen Angaben befüllt, sobald Martina sie nachgeliefert hat.',
      'imprint.h.tmg':        'Angaben gemäß § 5 TMG',
      'imprint.h.contact':    'Kontakt',
      'imprint.h.tax':        'Umsatzsteuer-Identifikationsnummer',
      'imprint.h.responsible':'Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV',
      'imprint.h.liability':  'Haftung für Inhalte',

      'privacy.eyebrow':      'Rechtliches',
      'privacy.title':        'Datenschutzerklärung',
      'privacy.placeholder':  'Hinweis: Diese Seite ist ein Platzhalter und wird von Martina mit einer rechtskonformen Datenschutzerklärung ersetzt.'
    },

    en: {
      'meta.title':           'MarMacMosaic — Personalized Mosaic Portraits by Martina',
      'meta.description':     'MarMacMosaic: handcrafted, personalized mosaic portraits from your favorite motif. From photo to a real piece of art.',

      'nav.works':            'Works',
      'nav.about':            'About',
      'nav.contact':          'Contact',
      'nav.lang.toggle':      'DE',
      'nav.lang.aria':        'Sprache auf Deutsch wechseln',
      'nav.back':             '← Back to home',

      'submenu.icons':        'Icons',
      'submenu.portraits':    'Personal Portraits',
      'submenu.pets':         'Pets',
      'submenu.misc':         'Miscellaneous',

      'hero.subline':         'Personalized Mosaic Portraits',

      'intro.eyebrow':        'From Photo to Mosaic',
      'intro.title':          'Your portrait — stone by stone.',
      'intro.body1':          'From a personal photo, a handcrafted mosaic portrait takes shape — be it a loved one, a pet, or an icon who inspires you. Each piece is a unique work, made from thousands of small glass, ceramic, and natural stones.',
      'intro.body2':          '(This text is a placeholder and will be replaced with Martina’s own words later.)',

      'works.eyebrow':        'Past Works',
      'works.title':          'A Selection',
      'works.empty':          'Coming soon.',
      'works.note.html':      'The works shown in the <em>Icons</em> category serve as inspiration — they are not for sale. I’d love to craft your own mosaic portrait: <a href="#kontakt">get in touch</a>.',

      'about.eyebrow':        'About me',
      'about.title':          'Patience lives in every stone.',
      'about.body1':          'My name is Martina. For years, I have been crafting mosaics from glass, ceramic, and natural stones. Each work is made by hand — stone by stone, often over weeks.',
      'about.body2':          'What fascinates me about mosaic: from thousands of tiny pieces, one single great portrait emerges. Just like memories that I transform for my clients into lasting art.',
      'about.body3':          '(This text is a placeholder and will be replaced with Martina’s own words later.)',

      'contact.eyebrow':      'Contact',
      'contact.title':        'Let’s talk about your mosaic portrait.',
      'contact.lede':         'Tell me what motif you have in mind — or reach me directly via email or Instagram.',

      'field.name':           'Name',
      'field.email':          'Email',
      'field.message':        'Message',
      'field.dsgvo.html':     'I have read and agree to the <a href="datenschutz.html">privacy policy</a>.',

      'contact.send':         'Send request',
      'contact.note.dsgvo':   'Please confirm the privacy policy to continue.',
      'contact.note.thanks':  'Thank you! The form isn’t connected yet — please use email or Instagram on the right for now.',
      'contact.direct.intro': 'Or directly:',
      'contact.email.label':  'Write an email',
      'contact.instagram.label': 'Instagram',
      'contact.instagram.sub':   '@marmac.mosaic',
      'contact.hint':         'Note: all contact details are placeholders and will be replaced with Martina’s real addresses later.',

      'detail.original':      'Original photo',
      'detail.mosaic':        'Mosaic',

      'footer.claim':         'Handcrafted mosaic portraits from your motif.',
      'footer.imprint':       'Imprint',
      'footer.privacy':       'Privacy',
      'footer.legal.followup':'',

      'imprint.eyebrow':      'Legal',
      'imprint.title':        'Imprint',
      'imprint.placeholder':  'Note: this page is a placeholder and will be filled with actual details once Martina has provided them.',
      'imprint.h.tmg':        'Information pursuant to § 5 TMG',
      'imprint.h.contact':    'Contact',
      'imprint.h.tax':        'VAT identification number',
      'imprint.h.responsible':'Responsible for content under § 55 (2) RStV',
      'imprint.h.liability':  'Liability for content',

      'privacy.eyebrow':      'Legal',
      'privacy.title':        'Privacy Policy',
      'privacy.placeholder':  'Note: this page is a placeholder and will be replaced by Martina with a legally compliant privacy policy.'
    }
  },

  /** Wechsel auf die andere Sprache + Re-Render aller markierten Knoten. */
  setLanguage(lang) {
    if (!this.strings[lang]) return;
    this.current = lang;
    document.documentElement.lang = lang;
    try { localStorage.setItem('marmac-lang', lang); } catch (_) {}
    this.render();
    // Karussell-Beschriftungen neu rendern, falls Karussell-Controller verfügbar.
    if (typeof window.refreshCarousel === 'function') window.refreshCarousel();
  },

  /** Initial laden — Browser-Sprache oder gespeicherte Wahl. */
  init() {
    let stored = null;
    try { stored = localStorage.getItem('marmac-lang'); } catch (_) {}
    const lang = stored || (navigator.language && navigator.language.startsWith('en') ? 'en' : 'de');
    this.current = (this.strings[lang] ? lang : 'de');
    document.documentElement.lang = this.current;
    this.render();
  },

  /** Liefert einen Übersetzungs-String oder null, wenn unbekannt. */
  t(key) {
    const dict = this.strings[this.current] || {};
    return dict[key] != null ? dict[key] : null;
  },

  /** Alle markierten Knoten neu rendern. Fail-safe: wenn ein Key fehlt,
   *  bleibt der vorhandene Inhalt. */
  render() {
    const dict = this.strings[this.current] || {};
    // Plain Text
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] != null) el.textContent = dict[key];
    });
    // HTML-Inhalt (für Strings mit Markup, z. B. eingebettete <a>)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] != null) el.innerHTML = dict[key];
    });
    // Placeholder (z. B. <input placeholder="...">)
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] != null) el.setAttribute('placeholder', dict[key]);
    });
    // aria-label
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] != null) el.setAttribute('aria-label', dict[key]);
    });
    // <title> + <meta name="description">
    if (dict['meta.title']) document.title = dict['meta.title'];
    const md = document.querySelector('meta[name="description"]');
    if (md && dict['meta.description']) md.setAttribute('content', dict['meta.description']);
  }
};
