/* BLACK VEIL — visual effects & procedural imagery */
(function () {
  const FX = {};
  FX.reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  FX.rng = function (seed) {
    let a = typeof seed === 'string' ? FX.hash(seed) : seed >>> 0;
    return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
  };
  FX.hash = s => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

  FX.fit = function (cv, maxDpr = 2) {
    // client size ignores CSS transforms (e.g. the CRT power-on scale)
    const d = Math.min(window.devicePixelRatio || 1, maxDpr);
    const w = Math.max(1, Math.round(cv.clientWidth * d)), h = Math.max(1, Math.round(cv.clientHeight * d));
    if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; }
    return { w, h, d };
  };

  FX.esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ----- text decryption effect */
  const GLYPHS = '█▓▒░<>/\\|=+*#%&@0123456789ABCDEFXZ';
  FX.scramble = function (el, text, ms = 700) {
    if (FX.reduced) { el.textContent = text; return Promise.resolve(); }
    return new Promise(res => {
      const start = performance.now();
      const step = now => {
        const p = Math.min(1, (now - start) / ms), n = Math.floor(text.length * p);
        let s = text.slice(0, n);
        for (let i = n; i < text.length; i++) s += text[i] === ' ' ? ' ' : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        el.textContent = s;
        p < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });
  };

  FX.sleep = ms => new Promise(r => setTimeout(r, FX.reduced ? Math.min(ms, 60) : ms));

  FX.typeLine = async function (container, html, cls = '', speed = 22) {
    const p = document.createElement('p'); p.className = cls + ' cursor'; container.appendChild(p);
    const tmp = document.createElement('div'); tmp.innerHTML = html; const text = tmp.textContent;
    if (FX.reduced) { p.innerHTML = html; p.classList.remove('cursor'); return; }
    for (let i = 1; i <= text.length; i++) { p.textContent = text.slice(0, i); if (i % 2 === 0 && window.BVAudio) BVAudio.beep(2200 + Math.random() * 400, .01, .006); await FX.sleep(speed); }
    p.innerHTML = html; p.classList.remove('cursor');
  };

  /* ----- camera switch / flash / toast */
  FX.cut = function (label) {
    const s = document.getElementById('fxStatic');
    document.getElementById('fxChannel').textContent = label || 'CAM ' + String((Math.random() * 40) | 0).padStart(2, '0');
    s.classList.remove('on'); void s.offsetWidth; if (!FX.reduced) s.classList.add('on');
    window.BVAudio && BVAudio.glitch();
  };
  FX.flash = function () { const f = document.getElementById('fxFlash'); f.classList.remove('on'); void f.offsetWidth; if (!FX.reduced) f.classList.add('on'); };
  FX.toast = function (msg) {
    const t = document.createElement('div'); t.className = 'toast'; t.setAttribute('role', 'status'); t.textContent = msg;
    document.body.appendChild(t); setTimeout(() => t.remove(), 3500);
  };

  /* ----- subtle depth on cards */
  FX.tilt = function (root) {
    if (FX.reduced) return;
    root.addEventListener('pointermove', e => {
      const c = e.target.closest('.card'); if (!c || e.pointerType !== 'mouse') return;
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      c.style.setProperty('--ry', ((x - .5) * 6).toFixed(2) + 'deg'); c.style.setProperty('--rx', ((.5 - y) * 5).toFixed(2) + 'deg');
      c.style.setProperty('--mx', (x * 100) + '%'); c.style.setProperty('--my', (y * 100) + '%');
    });
    root.addEventListener('pointerout', e => { const c = e.target.closest('.card'); if (c && !c.contains(e.relatedTarget)) { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); } });
  };

  /* ----- flat world map (equirectangular) */
  FX.drawWorld = function (ctx, w, h, opts = {}) {
    const W = window.BV_WORLD || [];
    ctx.save();
    ctx.strokeStyle = opts.stroke || 'rgba(95,184,230,.35)'; ctx.fillStyle = opts.fill || 'rgba(95,184,230,.05)'; ctx.lineWidth = opts.lw || 1;
    W.forEach(ring => {
      ctx.beginPath();
      ring.forEach(([lon, lat], i) => { const x = (lon + 180) / 360 * w, y = (90 - lat) / 180 * h; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); });
      ctx.closePath(); ctx.fill(); ctx.stroke();
    });
    if (opts.grid) {
      ctx.strokeStyle = 'rgba(255,255,255,.04)';
      for (let lon = -180; lon <= 180; lon += 30) { const x = (lon + 180) / 360 * w; ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let lat = -60; lat <= 60; lat += 30) { const y = (90 - lat) / 180 * h; ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }
    ctx.restore();
  };
  FX.proj = (lat, lon, w, h) => [(lon + 180) / 360 * w, (90 - lat) / 180 * h];

  /* ----- procedural satellite image */
  FX.satellite = function (cv, seed, opts = {}) {
    const { w, h } = FX.fit(cv, 1.5), ctx = cv.getContext('2d'), r = FX.rng(seed);
    const base = opts.terrain || 'desert';
    const pal = { desert: [[58, 52, 40], [84, 74, 55]], ice: [[150, 160, 168], [200, 208, 214]], forest: [[22, 38, 24], [40, 60, 34]], ocean: [[8, 20, 30], [14, 34, 48]], tundra: [[60, 64, 58], [92, 96, 86]], mountain: [[70, 66, 62], [120, 116, 110]] }[base];
    const img = ctx.createImageData(w, h), d = img.data;
    // value noise
    const G = 24, grid = []; for (let i = 0; i < (G + 1) * (G + 1); i++) grid.push(r());
    const sm = t => t * t * (3 - 2 * t);
    const vn = (x, y) => { const xi = Math.floor(x), yi = Math.floor(y), xf = sm(x - xi), yf = sm(y - yi); const g = (a, b) => grid[((b % G) * (G + 1) + (a % G))]; return (g(xi, yi) * (1 - xf) + g(xi + 1, yi) * xf) * (1 - yf) + (g(xi, yi + 1) * (1 - xf) + g(xi + 1, yi + 1) * xf) * yf; };
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const n = vn(x / w * 6, y / h * 6) * .6 + vn(x / w * 18, y / h * 18) * .3 + Math.random() * .1;
      const i = (y * w + x) * 4;
      for (let k = 0; k < 3; k++) d[i + k] = pal[0][k] + (pal[1][k] - pal[0][k]) * n;
      d[i + 3] = 255;
    }
    ctx.putImageData(img, 0, 0);
    // roads & structures
    ctx.strokeStyle = 'rgba(210,205,190,.35)'; ctx.lineWidth = Math.max(1, w / 300);
    for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(r() * w, 0); ctx.bezierCurveTo(r() * w, r() * h, r() * w, r() * h, r() * w, h); ctx.stroke(); }
    if (base !== 'ocean') {
      const cx = w * (.35 + r() * .3), cy = h * (.35 + r() * .3);
      ctx.fillStyle = 'rgba(200,200,190,.18)'; ctx.fillRect(cx - w * .14, cy - h * .02, w * .28, h * .04); // runway / pad
      for (let i = 0; i < 9; i++) { const bw = w * (.02 + r() * .05), bh = h * (.02 + r() * .06); ctx.fillStyle = `rgba(${200 + r() * 40},${200 + r() * 40},${190 + r() * 30},.55)`; ctx.fillRect(cx + (r() - .5) * w * .3, cy + (r() - .5) * h * .3, bw, bh); ctx.fillStyle = 'rgba(0,0,0,.4)'; }
    } else {
      ctx.strokeStyle = 'rgba(160,220,255,.15)';
      for (let i = 1; i < 6; i++) { ctx.beginPath(); ctx.arc(w / 2, h / 2, i * w * .07, 0, 7); ctx.stroke(); }
    }
    // target reticle + grid
    ctx.strokeStyle = 'rgba(208,33,42,.85)'; ctx.lineWidth = 1;
    const tx = w / 2, ty = h / 2, s = Math.min(w, h) * .14;
    ctx.strokeRect(tx - s, ty - s, s * 2, s * 2);
    ctx.beginPath(); ctx.moveTo(tx - s * 1.6, ty); ctx.lineTo(tx - s * .4, ty); ctx.moveTo(tx + s * .4, ty); ctx.lineTo(tx + s * 1.6, ty); ctx.moveTo(tx, ty - s * 1.6); ctx.lineTo(tx, ty - s * .4); ctx.moveTo(tx, ty + s * .4); ctx.lineTo(tx, ty + s * 1.6); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,255,255,.06)';
    for (let x = 0; x < w; x += w / 8) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
    for (let y = 0; y < h; y += h / 5) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    // cloud wisps
    const cg = ctx.createRadialGradient(w * r(), h * r(), 0, w * r(), h * r(), w * .5); cg.addColorStop(0, 'rgba(255,255,255,.12)'); cg.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = cg; ctx.fillRect(0, 0, w, h);
  };

  /* ----- evidence photographs for documents */
  FX.evidence = function (cv, kind, seed) {
    cv.width = cv.width || 380; cv.height = cv.height || 280;
    const w = cv.width, h = cv.height, ctx = cv.getContext('2d'), r = FX.rng(seed || kind);
    ctx.fillStyle = '#222'; ctx.fillRect(0, 0, w, h);
    if (kind === 'debris') {
      const g = ctx.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#666'); g.addColorStop(.45, '#999'); g.addColorStop(.46, '#4a4a42'); g.addColorStop(1, '#2b2b26');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 9; i++) { ctx.save(); ctx.translate(w * (.15 + r() * .7), h * (.55 + r() * .35)); ctx.rotate(r() * 6); ctx.fillStyle = `rgba(${200 + r() * 50},${200 + r() * 50},${200 + r() * 50},.85)`; ctx.beginPath(); ctx.moveTo(0, 0); for (let k = 0; k < 5; k++) ctx.lineTo((r() - .5) * 50, (r() - .5) * 26); ctx.fill(); ctx.restore(); }
      ctx.strokeStyle = 'rgba(30,30,30,.9)'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(w * .2, h * .2); ctx.lineTo(w * .2, h * .55); ctx.stroke(); // figure post
      ctx.font = '12px monospace'; ctx.fillStyle = '#ddd'; ctx.fillText('GRID 7 — 0317', 10, 18);
    } else if (kind === 'trace' || kind === 'spectrogram') {
      ctx.fillStyle = kind === 'trace' ? '#e8e2cf' : '#05070a'; ctx.fillRect(0, 0, w, h);
      if (kind === 'trace') {
        ctx.strokeStyle = 'rgba(0,0,0,.12)'; for (let x = 0; x < w; x += 12) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
        ctx.strokeStyle = '#1a1a5a'; ctx.lineWidth = 1.4; ctx.beginPath();
        for (let x = 0; x < w; x++) { const t = x / w; let y = h * .6 + (r() - .5) * 6; [.12, .19, .45].forEach(c => { y -= 70 * Math.exp(-Math.pow((t - c) * 60, 2)); }); x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke(); ctx.fillStyle = '#8d1418'; ctx.font = '14px "Reenie Beanie", cursive'; ctx.fillText('3 · 17 · 42 ?!', w * .5, h * .25);
      } else {
        for (let x = 0; x < w; x += 2) for (let y = 0; y < h; y += 2) {
          const f = 1 - y / h, t = x / w; let v = r() * .25;
          if (Math.abs(f - (.15 + t * .5)) < .02 && t > .4) v += .8;
          [.03 / .6, .17 / .6, .42 / .6].forEach(b => { if (Math.abs(f - b * .6) < .012 && t > .7) v += .7; });
          ctx.fillStyle = `hsl(${200 - v * 160},90%,${v * 55}%)`; ctx.fillRect(x, y, 2, 2);
        }
      }
    } else if (kind === 'culture') {
      ctx.fillStyle = '#c9c1a7'; ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = '#ece6d4'; ctx.beginPath(); ctx.arc(w / 2, h / 2, h * .44, 0, 7); ctx.fill(); ctx.strokeStyle = '#999'; ctx.stroke();
      for (let i = -6; i <= 6; i++) for (let j = -4; j <= 4; j++) { const x = w / 2 + i * 17 + (j % 2) * 8, y = h / 2 + j * 17; if (Math.hypot(x - w / 2, y - h / 2) < h * .4) { ctx.fillStyle = `rgba(110,90,40,${.4 + r() * .4})`; ctx.beginPath(); ctx.arc(x, y, 3 + ((i * j) % 3), 0, 7); ctx.fill(); } }
    } else if (kind === 'satellite') {
      FX.satellite(cv, seed || 'stain', { terrain: 'ocean' });
      ctx.fillStyle = 'rgba(0,0,0,.85)'; ctx.beginPath(); ctx.ellipse(w / 2, h / 2, w * .22, h * .12, -.3, 0, 7); ctx.fill();
    } else if (kind === 'map') {
      ctx.fillStyle = '#d8d0b8'; ctx.fillRect(0, 0, w, h);
      FX.drawWorld(ctx, w, h, { stroke: 'rgba(40,30,20,.6)', fill: 'rgba(60,50,30,.12)' });
      const pts = BV.sites.filter(s => s.type === 'facility');
      ctx.strokeStyle = 'rgba(160,20,24,.8)'; ctx.lineWidth = 1;
      pts.forEach(a => { const [x1, y1] = FX.proj(a.lat, a.lon, w, h); const [x2, y2] = FX.proj(-48.88, -123.39, w, h); ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); ctx.fillStyle = '#a0141a'; ctx.fillRect(x1 - 2, y1 - 2, 4, 4); });
    } else if (kind === 'eye') {
      ctx.fillStyle = '#0a0a0a'; ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 400; i++) { const a = r() * 7, d = h * (.08 + r() * .3); ctx.strokeStyle = `rgba(200,200,200,${r() * .3})`; ctx.beginPath(); ctx.moveTo(w / 2 + Math.cos(a) * h * .08, h / 2 + Math.sin(a) * h * .08); ctx.lineTo(w / 2 + Math.cos(a) * d, h / 2 + Math.sin(a) * d); ctx.stroke(); }
      ctx.fillStyle = '#000'; ctx.beginPath(); ctx.arc(w / 2, h / 2, h * .08, 0, 7); ctx.fill();
    }
    // film grain + vignette
    const id = ctx.getImageData(0, 0, w, h), dd = id.data;
    for (let i = 0; i < dd.length; i += 4) { const n = (Math.random() - .5) * 30; dd[i] += n; dd[i + 1] += n; dd[i + 2] += n; }
    ctx.putImageData(id, 0, 0);
    const vg = ctx.createRadialGradient(w / 2, h / 2, h * .2, w / 2, h / 2, w * .7); vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,.6)');
    ctx.fillStyle = vg; ctx.fillRect(0, 0, w, h);
  };

  /* ----- animated microscope view (lazy: only runs while visible) */
  FX.microscope = function (cv, micro, seed) {
    const ctx = cv.getContext('2d'), r = FX.rng(seed);
    let raf = 0, visible = false, t0 = performance.now();
    const cells = Array.from({ length: 46 }, () => ({ x: r(), y: r(), s: .02 + r() * .05, a: r() * 6.28, v: (r() - .5) * .0006, p: r() * 6 }));
    const draw = now => {
      const { w, h } = FX.fit(cv, 1.5), t = (now - t0) / 1000, hue = micro.hue;
      ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
      const bg = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w * .55);
      bg.addColorStop(0, `hsla(${hue},40%,14%,1)`); bg.addColorStop(.85, `hsla(${hue},40%,5%,1)`); bg.addColorStop(1, '#000');
      ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';
      if (micro.kind === 'lattice') {
        const sp = w / 14;
        for (let i = 0; i < 16; i++) for (let j = 0; j < 10; j++) {
          const x = i * sp + (j % 2) * sp / 2 + Math.sin(t * .5 + j) * 2, y = j * sp * .86;
          const on = (i * 3 + j * 17 + Math.floor(t * 2)) % 42 < 20;
          ctx.fillStyle = `hsla(${hue},80%,${on ? 55 : 25}%,${on ? .7 : .25})`; ctx.beginPath(); ctx.arc(x, y, sp * .18, 0, 7); ctx.fill();
        }
      } else if (micro.kind === 'filament') {
        ctx.lineWidth = 1.5;
        for (let k = 0; k < 14; k++) {
          ctx.strokeStyle = `hsla(${hue + k * 3},90%,60%,${.25 + .25 * Math.sin(t * 2 + k)})`; ctx.beginPath();
          for (let x = 0; x <= w; x += 6) { const y = h * (k / 14) + Math.sin(x * .02 + t + k) * 14 + Math.sin(x * .05 - t * 1.3) * 6; x ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
          ctx.stroke();
        }
      } else if (micro.kind === 'eye') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = `hsla(${hue},60%,30%,.3)`; ctx.fillRect(0, 0, w, h);
        ctx.font = `600 ${w / 18}px JetBrains Mono, monospace`; ctx.fillStyle = 'rgba(255,255,255,.75)'; ctx.textAlign = 'center';
        ctx.fillText(Math.sin(t * 3) > .96 ? 'DO NOT LOOK' : 'IMAGE REDACTED', w / 2, h / 2);
      } else if (micro.kind === 'ice') {
        ctx.globalCompositeOperation = 'source-over';
        ctx.strokeStyle = 'rgba(180,220,255,.25)';
        for (let i = 0; i < 30; i++) { ctx.beginPath(); ctx.moveTo(r() * w, r() * h); ctx.lineTo(r() * w, r() * h); ctx.stroke(); }
        ctx.fillStyle = 'rgba(0,0,0,.6)'; ctx.fillRect(0, 0, w, h);
        ctx.font = `800 ${w / 12}px Barlow Condensed, sans-serif`; ctx.fillStyle = '#d0212a'; ctx.textAlign = 'center'; ctx.fillText('ACCESS DENIED', w / 2, h / 2 + w / 40);
      } else {
        cells.forEach(c => {
          c.x += Math.cos(c.a) * c.v * 16; c.y += Math.sin(c.a) * c.v * 16; c.a += (r() - .5) * .05;
          if (c.x < 0 || c.x > 1) c.v *= -1; if (c.y < 0 || c.y > 1) c.v *= -1;
          const x = c.x * w, y = c.y * h, s = c.s * w * (1 + .1 * Math.sin(t * 2 + c.p));
          if (micro.kind === 'crystal') {
            ctx.strokeStyle = `hsla(${hue},80%,60%,.7)`; ctx.beginPath();
            for (let k = 0; k < 6; k++) { const a = k / 6 * 6.283 + c.a; ctx.lineTo(x + Math.cos(a) * s, y + Math.sin(a) * s); }
            ctx.closePath(); ctx.stroke();
          } else {
            ctx.strokeStyle = `hsla(${hue},70%,55%,.5)`; ctx.lineWidth = 1;
            ctx.beginPath(); ctx.moveTo(x, y);
            for (let k = 1; k < 6; k++) ctx.lineTo(x + Math.cos(c.a + k * .7) * s * k * .5, y + Math.sin(c.a + k * .9) * s * k * .5); ctx.stroke();
            ctx.fillStyle = `hsla(${hue},80%,60%,.6)`; ctx.beginPath(); ctx.arc(x, y, 2, 0, 7); ctx.fill();
          }
        });
      }
      ctx.globalCompositeOperation = 'source-over';
      // scope ring + scale bar
      ctx.strokeStyle = 'rgba(255,255,255,.15)'; ctx.beginPath(); ctx.arc(w / 2, h / 2, Math.min(w, h) * .46, 0, 7); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,.6)'; ctx.fillRect(w - 70, h - 14, 50, 2);
      if (visible && !FX.reduced) raf = requestAnimationFrame(draw);
    };
    const io = new IntersectionObserver(es => es.forEach(e => { visible = e.isIntersecting; cancelAnimationFrame(raf); if (visible) raf = requestAnimationFrame(draw); }));
    io.observe(cv);
    requestAnimationFrame(draw);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  };

  /* ----- handwritten-style signature */
  FX.signature = function (seed) {
    const r = FX.rng(seed); let d = 'M5 35';
    for (let i = 0; i < 9; i++) d += ` q ${8 + r() * 10} ${-20 - r() * 15} ${14 + r() * 8} ${r() * 20 - 5}`;
    d += ' m -60 8 l 90 -6';
    return `<svg viewBox="0 0 180 55" aria-hidden="true"><path d="${d}" fill="none" stroke="#1d3a8a" stroke-width="1.6" stroke-linecap="round"/></svg>`;
  };

  window.FX = FX;
})();
