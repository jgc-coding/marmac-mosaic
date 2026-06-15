/* ============================================================
   MacMarMosaics — hero.module.js
   Three.js-Hero: ein Porträt aus tausenden Keramik-Kacheln.
   ------------------------------------------------------------
   Ablauf:
   1. 4 Mosaik-Bilder laden, jedes in ein GRID_W×GRID_H-Raster
      herunterrechnen → eine Farbtabelle pro Porträt.
   2. InstancedMesh mit GRID_W*GRID_H Kacheln (kleine Boxen).
   3. Eine GSAP-getriebene Skalar-Animation "p" (0..1) steuert,
      wie stark jede Kachel von ihrer Streu-Position zur Ziel-
      Position im Gesicht interpoliert (per-Kachel-Delay = Stagger).
   4. Endlos-Zyklus: zusammensetzen → halten → zerstreuen →
      nächstes Porträt.
   Fällt WebGL aus, übernimmt das CSS-Fallback (body.no-webgl).
   ============================================================ */
import * as THREE from "three";

const CONFIG = {
  images: [
    "../assets/images/works/frida-mosaic.jpg",
    "../assets/images/works/elvis-mosaic.jpg",
    "../assets/images/works/audrey-mosaic.jpg",
    "../assets/images/works/dali-mosaic.png",
  ],
  GRID_W: 50,
  GRID_H: 64,
  cell: 0.12,      // Weltbreite einer Rasterzelle
  gap: 0.84,       // Kachel = cell * gap (Rest = Fugen)
  DUR: 0.55,       // Anteil der Gesamt-Progression, in dem eine Kachel reist
};

const heroReady = () => window.dispatchEvent(new CustomEvent("hero:ready"));

function fail(reason) {
  console.warn("[hero] Fallback aktiv:", reason);
  document.body.classList.add("no-webgl");
  heroReady();
}

/* ---------- Bild → Farbtabelle (cover-crop auf GRID_W×GRID_H) ---------- */
function sampleImage(img, w, h) {
  const cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const ctx = cv.getContext("2d", { willReadFrequently: true });
  // cover: das Bild so skalieren/zuschneiden, dass es das Raster füllt
  const ir = img.width / img.height;
  const tr = w / h;
  let sw, sh, sx, sy;
  if (ir > tr) { sh = img.height; sw = sh * tr; sx = (img.width - sw) / 2; sy = 0; }
  else { sw = img.width; sh = sw / tr; sx = 0; sy = (img.height - sh) / 2; }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const colors = new Float32Array(w * h * 3);
  // leichte Sättigung/Kontrast-Anhebung, damit die Kacheln im Spot leuchten
  for (let i = 0; i < w * h; i++) {
    let r = data[i * 4] / 255, g = data[i * 4 + 1] / 255, b = data[i * 4 + 2] / 255;
    const l = 0.299 * r + 0.587 * g + 0.114 * b;
    const sat = 1.18, con = 1.06;
    r = Math.min(1, Math.max(0, (l + (r - l) * sat - 0.5) * con + 0.5));
    g = Math.min(1, Math.max(0, (l + (g - l) * sat - 0.5) * con + 0.5));
    b = Math.min(1, Math.max(0, (l + (b - l) * sat - 0.5) * con + 0.5));
    colors[i * 3] = r; colors[i * 3 + 1] = g; colors[i * 3 + 2] = b;
  }
  return colors;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error("Bild fehlt: " + src));
    img.src = src;
  });
}

/* ============================================================ */
async function init() {
  const canvas = document.getElementById("hero-canvas");
  if (!canvas) return fail("kein Canvas");

  // WebGL-Verfügbarkeit prüfen
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch (e) { return fail("WebGLRenderer: " + e.message); }
  if (!renderer.getContext()) return fail("kein WebGL-Kontext");

  const { GRID_W: W, GRID_H: H, cell, gap, DUR } = CONFIG;
  const N = W * H;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Bilder laden + sampeln (fehlertolerant: nur erfolgreiche behalten)
  const palettes = [];
  for (const src of CONFIG.images) {
    try { palettes.push(sampleImage(await loadImage(src), W, H)); }
    catch (e) { console.warn("[hero]", e.message); }
  }
  if (!palettes.length) return fail("keine Bilder ladbar");

  /* ---------- Szene ---------- */
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.18;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

  // Lichter — warmer Spot auf der Kachelwand
  scene.add(new THREE.AmbientLight(0x3a2c1e, 1.0));
  const key = new THREE.DirectionalLight(0xfff1dc, 2.1); key.position.set(-4, 5, 6); scene.add(key);
  const rim = new THREE.DirectionalLight(0xc56a3e, 1.5); rim.position.set(6, -2, 3); scene.add(rim);
  const fill = new THREE.DirectionalLight(0xd9b26a, 0.7); fill.position.set(2, 1, -5); scene.add(fill);

  /* ---------- Kachel-Geometrie & Mesh ---------- */
  const tile = cell * gap;
  const geo = new THREE.BoxGeometry(tile, tile, tile * 0.55);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.62, metalness: 0.04 });
  const mesh = new THREE.InstancedMesh(geo, mat, N);
  mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
  const group = new THREE.Group();
  group.add(mesh);
  group.position.y = 0.8; // Porträt etwas nach oben → Platz für den Schriftzug darunter
  scene.add(group);

  // Pro Kachel: Ziel-Pos/Rot, Streu-Pos/Rot, Delay, Wobble-Phase
  const targetPos = new Float32Array(N * 3);
  const targetRot = new Float32Array(N * 3);
  const scatterPos = new Float32Array(N * 3);
  const scatterRot = new Float32Array(N * 3);
  const delay = new Float32Array(N);
  const phase = new Float32Array(N);
  const depth = new Float32Array(N);

  const halfW = (W * cell) / 2, halfH = (H * cell) / 2;
  const maxDist = Math.hypot(halfW, halfH);

  function buildTargets() {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const k = y * W + x;
        const px = -halfW + (x + 0.5) * cell;
        const py = halfH - (y + 0.5) * cell;
        targetPos[k * 3] = px;
        targetPos[k * 3 + 1] = py;
        targetPos[k * 3 + 2] = depth[k] = (Math.random() - 0.5) * tile * 0.7;
        targetRot[k * 3] = (Math.random() - 0.5) * 0.12;
        targetRot[k * 3 + 1] = (Math.random() - 0.5) * 0.12;
        targetRot[k * 3 + 2] = (Math.random() - 0.5) * 0.18;
        // Stagger: Zentrum zuerst, Rand zuletzt + etwas Zufall
        const d = Math.hypot(px, py) / maxDist;
        delay[k] = Math.min(0.45, d * 0.4 + Math.random() * 0.12);
        phase[k] = Math.random() * Math.PI * 2;
      }
    }
  }
  function buildScatter() {
    for (let k = 0; k < N; k++) {
      const ang = Math.random() * Math.PI * 2;
      const rad = 7 + Math.random() * 8;
      scatterPos[k * 3] = Math.cos(ang) * rad;
      scatterPos[k * 3 + 1] = Math.sin(ang) * rad * 0.7 + (Math.random() - 0.5) * 4;
      scatterPos[k * 3 + 2] = -6 + Math.random() * 12;
      scatterRot[k * 3] = Math.random() * Math.PI * 2;
      scatterRot[k * 3 + 1] = Math.random() * Math.PI * 2;
      scatterRot[k * 3 + 2] = Math.random() * Math.PI * 2;
    }
  }
  buildTargets();
  buildScatter();

  // Farben des aktuellen Porträts setzen
  const col = new THREE.Color();
  let current = 0;
  function applyPalette(idx) {
    const pal = palettes[idx % palettes.length];
    for (let k = 0; k < N; k++) {
      col.setRGB(pal[k * 3], pal[k * 3 + 1], pal[k * 3 + 2], THREE.SRGBColorSpace);
      mesh.setColorAt(k, col);
    }
    mesh.instanceColor.needsUpdate = true;
  }
  applyPalette(0);

  /* ---------- Kamera so stellen, dass das Porträt passt ---------- */
  function fitCamera() {
    const aspect = canvas.clientWidth / Math.max(1, canvas.clientHeight);
    camera.aspect = aspect;
    const portraitH = H * cell;
    const portraitW = W * cell;
    const fovV = (camera.fov * Math.PI) / 180;
    // vertikal + horizontal nötigen Abstand bestimmen, größeren nehmen, Marge drauf
    const distV = (portraitH * 0.92) / Math.tan(fovV / 2);
    const fovH = 2 * Math.atan(Math.tan(fovV / 2) * aspect);
    const distH = (portraitW * 0.92) / Math.tan(fovH / 2);
    camera.position.set(0, 0, Math.max(distV, distH));
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    fitCamera();
  }
  resize();
  window.addEventListener("resize", resize);

  /* ---------- Animationszustand ---------- */
  const state = { p: reduced ? 1 : 0, scatterAmt: 1 };
  // scatterAmt steuert ScrollTrigger das Auflösen beim Verlassen des Heros (1=Gesicht, 0=zerstreut)

  // Maus-Parallaxe
  const mouse = { x: 0, y: 0, tx: 0, ty: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.tx = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.ty = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });

  const tmpPos = new THREE.Vector3();
  const tmpScatter = new THREE.Vector3();
  const tmpQuat = new THREE.Quaternion();
  const tmpEuler = new THREE.Euler();
  const tmpScale = new THREE.Vector3();
  const tmpMat = new THREE.Matrix4();

  const easeOut = (t) => 1 - Math.pow(1 - t, 3);

  function updateTiles(time) {
    const p = state.p;
    for (let k = 0; k < N; k++) {
      // lokaler Fortschritt mit per-Kachel-Delay
      let lt = (p - delay[k]) / DUR;
      lt = lt < 0 ? 0 : lt > 1 ? 1 : lt;
      const e = easeOut(lt);
      // zusätzliche Streuung übers Scroll-Auflösen
      const e2 = e * state.scatterAmt;

      const ti = k * 3;
      tmpPos.set(targetPos[ti], targetPos[ti + 1], targetPos[ti + 2]);
      tmpScatter.set(scatterPos[ti], scatterPos[ti + 1], scatterPos[ti + 2]);
      tmpPos.lerpVectors(tmpScatter, tmpPos, e2);

      // sanftes Schweben, wenn zusammengesetzt
      if (e2 > 0.6 && !reduced) {
        tmpPos.z += Math.sin(time * 1.1 + phase[k]) * tile * 0.25 * e2;
      }

      tmpEuler.set(
        scatterRot[ti] + (targetRot[ti] - scatterRot[ti]) * e2,
        scatterRot[ti + 1] + (targetRot[ti + 1] - scatterRot[ti + 1]) * e2,
        scatterRot[ti + 2] + (targetRot[ti + 2] - scatterRot[ti + 2]) * e2
      );
      tmpQuat.setFromEuler(tmpEuler);
      const s = 0.12 + 0.88 * e2;
      tmpScale.set(s, s, s);
      tmpMat.compose(tmpPos, tmpQuat, tmpScale);
      mesh.setMatrixAt(k, tmpMat);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }

  /* ---------- Render-Loop ---------- */
  let running = true;
  let rafId = 0;
  let startT = null;
  function frame(now) {
    if (!running) return;
    rafId = requestAnimationFrame(frame);
    if (startT === null) startT = now;
    const time = (now - startT) / 1000;

    // Parallaxe sanft nachziehen
    mouse.x += (mouse.tx - mouse.x) * 0.05;
    mouse.y += (mouse.ty - mouse.y) * 0.05;
    group.rotation.y = mouse.x * 0.22;
    group.rotation.x = -mouse.y * 0.14;
    group.position.x = mouse.x * 0.25;

    updateTiles(time);
    renderer.render(scene, camera);
  }

  // Bei Tab-Wechsel / Hero außer Sicht pausieren (Performance)
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) { running = false; cancelAnimationFrame(rafId); }
    else if (!running) { running = true; rafId = requestAnimationFrame(frame); }
  });

  /* ---------- Zyklus (zusammensetzen → halten → zerstreuen → nächstes) ---------- */
  function startCycle() {
    if (reduced || !window.gsap) {
      // Statisch: Gesicht direkt zeigen
      state.p = 1;
      return;
    }
    const gsap = window.gsap;
    function loop() {
      const tl = gsap.timeline({ onComplete: loop });
      tl.to(state, { p: 1, duration: 2.6, ease: "power2.out" });
      tl.to({}, { duration: 3.4 });
      tl.to(state, {
        p: 0, duration: 1.5, ease: "power2.in",
        onComplete: () => { current = (current + 1) % palettes.length; applyPalette(current); buildScatter(); },
      });
      tl.to({}, { duration: 0.25 });
    }
    loop();
  }

  // ScrollTrigger: Hero-Kacheln beim Wegscrollen auflösen + Canvas leicht zurücknehmen
  function bindScroll() {
    if (!window.gsap || !window.ScrollTrigger) return;
    const gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);
    gsap.to(state, {
      scatterAmt: 0.18,
      ease: "none",
      scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 0.6 },
    });
    gsap.to(canvas, {
      opacity: 0.25, ease: "none",
      scrollTrigger: { trigger: ".hero", start: "center top", end: "bottom top", scrub: 0.6 },
    });
  }

  // erstes Bild gerendert → Loader darf weg
  updateTiles(0);
  renderer.render(scene, camera);
  heroReady();

  rafId = requestAnimationFrame(frame);
  startCycle();
  // ScrollTrigger evtl. erst nach atelier.js bereit → kurz warten
  if (window.ScrollTrigger) bindScroll();
  else window.addEventListener("atelier:ready", bindScroll, { once: true });
}

init().catch((e) => fail(e && e.message ? e.message : "Init-Fehler"));
