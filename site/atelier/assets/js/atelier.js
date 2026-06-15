/* ============================================================
   MacMarMosaics — atelier.js
   Lenis-Smoothscroll · GSAP-Choreografie · Custom-Cursor ·
   horizontale Werk-Galerie · Detail-Overlay · Loader · Form.
   Alles defensiv: fehlt eine Lib, läuft die Seite trotzdem.
   ============================================================ */
(function () {
  "use strict";

  /* ---------- Werke (Single Source für Galerie + Detail) ---------- */
  var WORKS = [
    { id: "audrey", title: "Audrey Hepburn", tag: "Ikone", desc: "Ikonisches Profil-Porträt in Schwarz und Weiß.",
      original: "../assets/images/works/audrey-original.webp", mosaic: "../assets/images/works/audrey-mosaic.jpg" },
    { id: "dali", title: "Salvador Dalí", tag: "Ikone", desc: "Porträt-Mosaik in Schwarz, Weiß und Grautönen.",
      original: "../assets/images/works/dali-original.png", mosaic: "../assets/images/works/dali-mosaic.png" },
    { id: "elvis", title: "Elvis Presley", tag: "Ikone", desc: "Porträt-Mosaik auf tiefrotem Grund.",
      original: "../assets/images/works/elvis-original.webp", mosaic: "../assets/images/works/elvis-mosaic.jpg" },
    { id: "frida", title: "Frida Kahlo", tag: "Ikone", desc: "Farbiges Porträt mit Blumenkrone.",
      original: "../assets/images/works/frida-original.jpg", mosaic: "../assets/images/works/frida-mosaic.jpg" },
  ];

  var hasGSAP = typeof window.gsap !== "undefined";
  var hasST = hasGSAP && typeof window.ScrollTrigger !== "undefined";
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (hasST) window.gsap.registerPlugin(window.ScrollTrigger);

  document.addEventListener("DOMContentLoaded", init);

  function init() {
    buildWorks();
    initLoader();
    var lenis = initSmoothScroll();
    if (fine && !reduced) initCursor();
    initNav();
    if (hasST && !reduced) {
      initReveals();
      initSplits();
      initWorksScroll();
      initProgress();
    } else {
      // Ohne ScrollTrigger: alles sofort sichtbar
      document.querySelectorAll("[data-reveal]").forEach(function (el) { el.style.opacity = 1; });
    }
    initDetail();
    initForm();

    window.dispatchEvent(new CustomEvent("atelier:ready"));
    if (lenis) window.__lenis = lenis;
  }

  /* ---------- Werk-Karten erzeugen ---------- */
  function buildWorks() {
    var track = document.querySelector("[data-works-track]");
    if (!track) return;
    WORKS.forEach(function (w, i) {
      var n = String(i + 1).padStart(2, "0");
      var card = document.createElement("article");
      card.className = "work";
      card.dataset.index = i;
      card.innerHTML =
        '<div class="work__frame" data-detail role="button" tabindex="0" aria-label="' + w.title + ' groß ansehen">' +
          '<img class="work__img work__img--mosaic" src="' + w.mosaic + '" alt="Mosaik-Porträt ' + w.title + '" loading="lazy" />' +
          '<img class="work__img work__img--original" src="' + w.original + '" alt="Originalfoto ' + w.title + '" loading="lazy" />' +
          '<span class="work__tag">' + w.tag + "</span>" +
          '<span class="work__state">Foto ⇄ Mosaik</span>' +
        "</div>" +
        '<div class="work__meta">' +
          '<span class="work__index">' + n + "</span>" +
          "<div><h3 class=\"work__title\">" + w.title + "</h3>" +
          '<p class="work__desc">' + w.desc + "</p></div>" +
        "</div>";
      track.appendChild(card);
    });
  }

  /* ---------- Loader ---------- */
  function initLoader() {
    var loader = document.getElementById("loader");
    var fill = document.getElementById("loader-fill");
    if (!loader) return;
    var done = false;

    if (fill) {
      if (hasGSAP) window.gsap.to(fill, { width: "92%", duration: 1.8, ease: "power1.out" });
      else fill.style.width = "92%";
    }

    function hide() {
      if (done) return;
      done = true;
      if (fill) fill.style.width = "100%";
      if (hasGSAP) {
        window.gsap.to(loader, {
          opacity: 0, duration: 0.7, delay: 0.15, ease: "power2.out",
          onComplete: function () { loader.style.display = "none"; },
        });
        introHero();
      } else {
        loader.style.opacity = 0;
        setTimeout(function () { loader.style.display = "none"; }, 400);
      }
    }

    window.addEventListener("hero:ready", hide, { once: true });
    // Sicherheitsnetz, falls der Hero nie meldet
    setTimeout(hide, 4500);
  }

  function introHero() {
    if (!hasGSAP) return;
    var t = window.gsap.timeline({ defaults: { ease: "power3.out" } });
    t.from(".hero__kicker", { y: 20, opacity: 0, duration: 1 }, 0.1)
     .from(".hero__brand", { y: 40, opacity: 0, duration: 1.3 }, 0.2)
     .from(".hero__subline", { y: 20, opacity: 0, duration: 1 }, 0.5)
     .from(".hero__tagline", { y: 20, opacity: 0, duration: 1 }, 0.65)
     .from(".hero__cue, .hero__meta", { opacity: 0, duration: 1 }, 0.9);
  }

  /* ---------- Lenis Smooth-Scroll ---------- */
  function initSmoothScroll() {
    if (typeof window.Lenis === "undefined" || reduced) return null;
    var lenis = new window.Lenis({ duration: 1.1, smoothWheel: true, wheelMultiplier: 1, touchMultiplier: 1.5 });
    if (hasST) {
      lenis.on("scroll", window.ScrollTrigger.update);
      window.gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      window.gsap.ticker.lagSmoothing(0);
    } else {
      requestAnimationFrame(function raf(t) { lenis.raf(t); requestAnimationFrame(raf); });
    }
    // Anker-Links sanft anscrollen
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener("click", function (e) {
        var id = a.getAttribute("href");
        if (id.length < 2) return;
        var el = document.querySelector(id);
        if (!el) return;
        e.preventDefault();
        lenis.scrollTo(el, { offset: -60 });
      });
    });
    return lenis;
  }

  /* ---------- Custom Cursor ---------- */
  function initCursor() {
    var cursor = document.getElementById("cursor");
    if (!cursor || !hasGSAP) return;
    document.body.classList.add("has-cursor");
    var xTo = window.gsap.quickTo(cursor, "x", { duration: 0.35, ease: "power3" });
    var yTo = window.gsap.quickTo(cursor, "y", { duration: 0.35, ease: "power3" });
    window.addEventListener("pointermove", function (e) { xTo(e.clientX); yTo(e.clientY); });
    var sel = "a, button, [data-link], [data-detail], input, textarea, label";
    document.querySelectorAll(sel).forEach(function (el) {
      el.addEventListener("pointerenter", function () { cursor.classList.add("is-hover"); });
      el.addEventListener("pointerleave", function () { cursor.classList.remove("is-hover"); });
    });
  }

  /* ---------- Nav-Reveal ---------- */
  function initNav() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    if (hasST) {
      window.ScrollTrigger.create({
        trigger: ".hero", start: "bottom top+=80",
        onEnter: function () { nav.classList.add("is-visible"); },
        onLeaveBack: function () { nav.classList.remove("is-visible"); },
      });
    } else {
      window.addEventListener("scroll", function () {
        if (window.scrollY > window.innerHeight * 0.8) nav.classList.add("is-visible");
        else nav.classList.remove("is-visible");
      }, { passive: true });
    }
  }

  /* ---------- Reveal-Animationen ---------- */
  function initReveals() {
    window.gsap.utils.toArray("[data-reveal]").forEach(function (el) {
      window.gsap.from(el, {
        y: 44, opacity: 0, duration: 1.1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 86%" },
      });
    });
  }

  /* ---------- Split-Headlines (Wörter steigen zeilenweise auf) ---------- */
  function initSplits() {
    document.querySelectorAll("[data-split]").forEach(function (el) {
      var words = el.textContent.trim().split(/\s+/);
      el.innerHTML = words.map(function (w) {
        return '<span class="w"><span class="w__in">' + w + "</span></span>";
      }).join(" ");
      el.querySelectorAll(".w").forEach(function (s) {
        s.style.display = "inline-block"; s.style.overflow = "hidden"; s.style.verticalAlign = "top";
      });
      var ins = el.querySelectorAll(".w__in");
      ins.forEach(function (s) { s.style.display = "inline-block"; });
      window.gsap.from(ins, {
        yPercent: 115, opacity: 0, duration: 1.1, ease: "power4.out", stagger: 0.07,
        scrollTrigger: { trigger: el, start: "top 85%" },
      });
    });
  }

  /* ---------- Horizontale Werk-Galerie ---------- */
  function initWorksScroll() {
    var pin = document.querySelector("[data-works-pin]");
    var track = document.querySelector("[data-works-track]");
    if (!pin || !track) return;
    // Auf schmalen Screens normal horizontal scrollen lassen
    if (window.matchMedia("(max-width: 760px)").matches) {
      pin.style.overflowX = "auto";
      pin.style.height = "auto";
      return;
    }
    var getAmount = function () { return Math.max(0, track.scrollWidth - window.innerWidth); };
    window.gsap.to(track, {
      x: function () { return -getAmount(); },
      ease: "none",
      scrollTrigger: {
        trigger: pin, start: "top top",
        end: function () { return "+=" + getAmount(); },
        pin: true, scrub: 1, invalidateOnRefresh: true, anticipatePin: 1,
      },
    });
  }

  /* ---------- Scroll-Fortschrittsbalken ---------- */
  function initProgress() {
    var bar = document.getElementById("scroll-bar");
    if (!bar) return;
    window.ScrollTrigger.create({
      start: 0, end: "max",
      onUpdate: function (self) { bar.style.transform = "scaleX(" + self.progress + ")"; },
    });
  }

  /* ---------- Detail-Overlay ---------- */
  function initDetail() {
    var detail = document.getElementById("detail");
    if (!detail) return;
    var oImg = document.getElementById("detail-original");
    var mImg = document.getElementById("detail-mosaic");
    var title = document.getElementById("detail-title");
    var desc = document.getElementById("detail-desc");
    var closeBtn = detail.querySelector(".detail__close");

    function open(i) {
      var w = WORKS[i];
      if (!w) return;
      oImg.src = w.original; oImg.alt = "Originalfoto " + w.title;
      mImg.src = w.mosaic; mImg.alt = "Mosaik " + w.title;
      title.textContent = w.title;
      desc.textContent = w.desc;
      detail.hidden = false;
      document.body.style.overflow = "hidden";
      if (window.__lenis) window.__lenis.stop();
      if (hasGSAP) window.gsap.from(".detail__inner", { y: 30, opacity: 0, duration: 0.6, ease: "power3.out" });
    }
    function close() {
      detail.hidden = true;
      document.body.style.overflow = "";
      if (window.__lenis) window.__lenis.start();
    }

    document.addEventListener("click", function (e) {
      var frame = e.target.closest("[data-detail]");
      if (frame) {
        var card = frame.closest("[data-index]");
        if (card) open(parseInt(card.dataset.index, 10));
      }
    });
    document.addEventListener("keydown", function (e) {
      var frame = document.activeElement && document.activeElement.closest && document.activeElement.closest("[data-detail]");
      if (frame && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault();
        var card = frame.closest("[data-index]");
        if (card) open(parseInt(card.dataset.index, 10));
      }
      if (e.key === "Escape" && !detail.hidden) close();
    });
    if (closeBtn) closeBtn.addEventListener("click", close);
    detail.addEventListener("click", function (e) { if (e.target === detail) close(); });
  }

  /* ---------- Kontaktformular (noch nicht angebunden) ---------- */
  function initForm() {
    var form = document.getElementById("contact-form");
    var note = document.getElementById("contact-form-note");
    if (!form || !note) return;
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var dsgvo = form.querySelector('input[name="dsgvo"]');
      if (dsgvo && !dsgvo.checked) {
        note.textContent = "Bitte bestätige die Datenschutzerklärung, um fortzufahren.";
        return;
      }
      note.textContent = "Vielen Dank! Das Formular ist noch nicht angebunden — bitte nutze vorerst E-Mail oder Instagram.";
      form.reset();
    });
  }
})();
