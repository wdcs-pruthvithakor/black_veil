/* BLACK VEIL — GLOBAL THREAT MONITOR (runs only while visible) */
(function () {
  const M = { on: false };
  const $ = s => document.querySelector(s);
  let raf = 0, slowT = 0, worldCache = null;
  const fac = () => BV.sites.filter(s => s.type === 'facility');
  const SERIES = [
    { k: 'SIGNALS', c: '#5fb8e6', base: 6 },
    { k: 'BIOLOGICAL', c: '#7fae6a', base: 3 },
    { k: 'OCEANIC', c: '#e2a23b', base: 4 },
    { k: 'ELECTROMAGNETIC', c: '#d0212a', base: 2.5 }
  ];
  const data = SERIES.map(s => Array.from({ length: 60 }, (_, i) => s.base + Math.sin(i / 7 + s.base) * 1.5 + Math.random() * 2));
  const pulses = []; const bio = fac().map(s => ({ s, v: Math.random() * 8 }));
  let sweep = 0, spec = null, ocean = [];

  function pushData() {
    data.forEach((arr, j) => {
      const last = arr[arr.length - 1], s = SERIES[j];
      let v = last + (s.base - last) * .2 + (Math.random() - .5) * 2.4;
      if (Math.random() < .04) v += 6 + Math.random() * 6; // burst
      arr.push(Math.max(0, v)); arr.shift();
    });
    bio.forEach(b => { b.v = Math.max(0, b.v + (Math.random() - .5) * 2 + (b.s.threat >= 3 ? .15 : -.1)); if (b.v > 14) b.v = 6; });
    const s = fac()[(Math.random() * fac().length) | 0];
    if (Story.S.zero && Math.random() < .3) pulses.push({ lat: -48.88, lon: -123.39, t: 0, c: '#ff2a2a' });
    pulses.push({ lat: s.lat + (Math.random() - .5) * 6, lon: s.lon + (Math.random() - .5) * 6, t: 0, c: s.threat >= 3 ? '#d0212a' : '#e2a23b' });
    logLine();
  }

  const MSGS = [
    () => `<b>RX</b> ${(1420.4 + (Math.random() - .5) * .02).toFixed(3)} MHz · SNR ${(Math.random() * 30 + 4).toFixed(1)} dB · ORIGIN UNRESOLVED`,
    () => `<b>HYD</b> DEEP NODE · ${(3 + Math.random() * 40).toFixed(1)} Hz sweep · bearing ALL`,
    () => `<b>BIO</b> ${['VX-17', 'ORP-3', 'HX-2', 'N-44'][(Math.random() * 4) | 0]} · activity +${(Math.random() * 9).toFixed(1)}%`,
    () => `<b>MAG</b> BS12 · ΔB ${(Math.random() * 40).toFixed(1)} nT · period drift +17 s`,
    () => `<b>???</b> ${Array.from({ length: 6 }, () => ((Math.random() * 65535) | 0).toString(16).toUpperCase().padStart(4, '0')).join(' ')}`,
    () => `<b>CW</b> ${['- .... .-. . ... .... --- .-.. -..', '.-.. --- --- -.-', '..--..'][(Math.random() * 3) | 0]}`,
    () => `<b>SAT</b> clock skew +${(Math.random() < .3 ? 17 : (Math.random() * 3).toFixed(2))} s · pass ${((Math.random() * 900) | 0) + 100}`
  ];
  function logLine() {
    const ol = $('#monLog'); if (!ol) return;
    const li = document.createElement('li'); li.innerHTML = `${new Date().toISOString().slice(11, 19)} ${MSGS[(Math.random() * MSGS.length) | 0]()}`;
    ol.prepend(li); while (ol.children.length > 9) ol.lastChild.remove();
  }

  function drawMap(t) {
    const cv = $('#monMap'), { w, h } = FX.fit(cv), c = cv.getContext('2d');
    if (!worldCache || worldCache.width !== w || worldCache.height !== h) {
      worldCache = document.createElement('canvas'); worldCache.width = w; worldCache.height = h;
      const wc = worldCache.getContext('2d'); wc.fillStyle = '#05080a'; wc.fillRect(0, 0, w, h);
      FX.drawWorld(wc, w, h, { grid: true, stroke: 'rgba(95,184,230,.28)', fill: 'rgba(95,184,230,.06)' });
    }
    c.drawImage(worldCache, 0, 0);
    // terminator-like sweep band
    const bx = (t * 30) % (w + 200) - 100, g = c.createLinearGradient(bx - 80, 0, bx + 80, 0);
    g.addColorStop(0, 'rgba(95,184,230,0)'); g.addColorStop(.5, 'rgba(95,184,230,.08)'); g.addColorStop(1, 'rgba(95,184,230,0)'); c.fillStyle = g; c.fillRect(bx - 80, 0, 160, h);
    fac().forEach(s => {
      const [x, y] = FX.proj(s.lat, s.lon, w, h), col = ['', '#5fb8e6', '#e2a23b', '#d0212a', '#9b8fa6', '#ff2a2a'][s.threat];
      c.fillStyle = col; c.beginPath(); c.arc(x, y, 3 * (w / 900 + .6), 0, 7); c.fill();
      c.font = `${Math.max(9, w / 110)}px JetBrains Mono`; c.fillStyle = 'rgba(201,209,214,.6)'; c.fillText(s.name, x + 7, y - 6);
    });
    if (Story.S.zero) { const [x, y] = FX.proj(-48.88, -123.39, w, h); c.strokeStyle = '#ff2a2a'; c.beginPath(); c.arc(x, y, 6 + Math.sin(t * 4) * 3, 0, 7); c.stroke(); }
    for (let i = pulses.length - 1; i >= 0; i--) {
      const p = pulses[i]; p.t += .012; if (p.t > 1) { pulses.splice(i, 1); continue; }
      const [x, y] = FX.proj(p.lat, p.lon, w, h); c.strokeStyle = p.c; c.globalAlpha = 1 - p.t; c.lineWidth = 1.5;
      c.beginPath(); c.arc(x, y, p.t * 30 * (w / 900 + .5), 0, 7); c.stroke(); c.globalAlpha = 1;
    }
  }

  function drawRadar() {
    const cv = $('#monRadar'), { w, h } = FX.fit(cv), c = cv.getContext('2d'), cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 6;
    c.fillStyle = 'rgba(3,8,6,.25)'; c.fillRect(0, 0, w, h); // phosphor decay
    c.strokeStyle = 'rgba(127,174,106,.25)'; c.lineWidth = 1;
    for (let i = 1; i <= 4; i++) { c.beginPath(); c.arc(cx, cy, R * i / 4, 0, 7); c.stroke(); }
    c.beginPath(); c.moveTo(cx - R, cy); c.lineTo(cx + R, cy); c.moveTo(cx, cy - R); c.lineTo(cx, cy + R); c.stroke();
    sweep = (sweep + (FX.reduced ? 0 : .025)) % (Math.PI * 2);
    const gr = c.createConicGradient ? c.createConicGradient(sweep - .6, cx, cy) : null;
    if (gr) { gr.addColorStop(0, 'rgba(127,174,106,0)'); gr.addColorStop(.095, 'rgba(127,174,106,.35)'); gr.addColorStop(.1, 'rgba(127,174,106,0)'); c.fillStyle = gr; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill(); }
    c.strokeStyle = '#9fdc8a'; c.beginPath(); c.moveTo(cx, cy); c.lineTo(cx + Math.cos(sweep) * R, cy + Math.sin(sweep) * R); c.stroke();
    fac().forEach(s => {
      const a = (s.lon + 180) / 360 * Math.PI * 2, d = (90 - s.lat) / 180 * R;
      let diff = (sweep - a) % (Math.PI * 2); if (diff < 0) diff += Math.PI * 2;
      if (diff < .08) { c.fillStyle = s.threat >= 3 ? '#ff4d4d' : '#cfffc0'; c.beginPath(); c.arc(cx + Math.cos(a) * d, cy + Math.sin(a) * d, 3, 0, 7); c.fill(); }
    });
    const rr = $('#radarRead'); if (rr) rr.textContent = `SWEEP ${(sweep / Math.PI * 180).toFixed(0).padStart(3, '0')}° · CONTACTS ${fac().length} · ORBITAL LAYER`;
  }

  function drawSeries() {
    const cv = $('#monSeries'), { w, h, d } = FX.fit(cv), c = cv.getContext('2d');
    const pl = 34 * d, pb = 18 * d, pt = 8 * d, pw = w - pl - 8 * d, ph = h - pb - pt;
    const max = Math.max(12, ...data.flat()) * 1.1;
    c.clearRect(0, 0, w, h); c.font = `${10 * d}px JetBrains Mono`; c.fillStyle = 'rgba(123,134,141,.9)'; c.strokeStyle = 'rgba(255,255,255,.06)';
    for (let i = 0; i <= 4; i++) { const y = pt + ph - ph * i / 4; c.beginPath(); c.moveTo(pl, y); c.lineTo(pl + pw, y); c.stroke(); c.fillText(String(Math.round(max * i / 4)), 4 * d, y + 3 * d); }
    ['-60m', '-45m', '-30m', '-15m', 'NOW'].forEach((s, i) => c.fillText(s, pl + pw * i / 4 - (i === 4 ? 22 * d : 8 * d), h - 4 * d));
    data.forEach((arr, j) => {
      c.strokeStyle = SERIES[j].c; c.lineWidth = 1.6 * d; c.beginPath();
      arr.forEach((v, i) => { const x = pl + pw * i / (arr.length - 1), y = pt + ph - v / max * ph; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
      const v = arr[arr.length - 1]; c.fillStyle = SERIES[j].c; c.beginPath(); c.arc(pl + pw, pt + ph - v / max * ph, 2.5 * d, 0, 7); c.fill();
    });
  }

  function drawOcean(t) {
    const cv = $('#monOcean'), { w, h } = FX.fit(cv), c = cv.getContext('2d');
    ocean.push(Math.sin(t * 2.1) * .3 + Math.sin(t * 17 / 3) * .15 + (Math.random() - .5) * .25 + (Math.sin(t * .42) > .97 ? Math.sin(t * 60) * .9 : 0));
    while (ocean.length > w / 2) ocean.shift();
    c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(226,162,59,.85)'; c.lineWidth = 1.2; c.beginPath();
    ocean.forEach((v, i) => { const x = i * 2, y = h / 2 + v * h * .4; i ? c.lineTo(x, y) : c.moveTo(x, y); }); c.stroke();
    c.strokeStyle = 'rgba(255,255,255,.06)'; c.beginPath(); c.moveTo(0, h / 2); c.lineTo(w, h / 2); c.stroke();
  }

  function drawAtmo(t) {
    const cv = $('#monAtmo'), { w, h } = FX.fit(cv, 1), c = cv.getContext('2d');
    if (!spec || spec.width !== w || spec.height !== h) { spec = document.createElement('canvas'); spec.width = w; spec.height = h; }
    const s = spec.getContext('2d'); s.drawImage(spec, -2, 0);
    for (let y = 0; y < h; y += 2) {
      const f = 1 - y / h; let v = Math.random() * .25;
      [3 / 60, 17 / 60, 42 / 60].forEach(b => { if (Math.abs(f - b) < .018) v += .45 + .3 * Math.sin(t * 1.3); });
      if (Math.abs(f - (.2 + .15 * Math.sin(t * .3))) < .012) v += .4;
      s.fillStyle = `hsl(${210 - v * 210},85%,${v * 50}%)`; s.fillRect(w - 2, y, 2, 2);
    }
    c.drawImage(spec, 0, 0); c.font = '9px JetBrains Mono'; c.fillStyle = 'rgba(255,255,255,.5)'; c.fillText('42 Hz', 4, h - h * 42 / 60 + 3); c.fillText('17 Hz', 4, h - h * 17 / 60 + 3); c.fillText('3 Hz', 4, h - h * 3 / 60 - 2);
  }

  function drawBio() {
    const cv = $('#monBio'), { w, h, d } = FX.fit(cv), c = cv.getContext('2d'); c.clearRect(0, 0, w, h);
    const rows = bio.length, bh = h / rows, lw = 78 * d;
    c.font = `${9 * d}px JetBrains Mono`;
    bio.forEach((b, i) => {
      const y = i * bh, v = Math.min(1, b.v / 14);
      c.fillStyle = 'rgba(123,134,141,.9)'; c.fillText(b.s.id, 0, y + bh * .65);
      c.fillStyle = 'rgba(255,255,255,.05)'; c.fillRect(lw, y + bh * .2, w - lw, bh * .6);
      c.fillStyle = v > .7 ? '#d0212a' : v > .4 ? '#e2a23b' : '#7fae6a'; c.fillRect(lw, y + bh * .2, (w - lw) * v, bh * .6);
    });
  }

  function renderFac() {
    $('#monFac').innerHTML = fac().map(s => {
      const flick = Math.random() < .03 && !s.denied;
      return `<li class="tl${s.threat}"><span>${FX.esc(s.name)}</span><span>${flick ? '— SIGNAL LOST —' : FX.esc(s.denied ? 'DENIED' : s.status)}</span></li>`;
    }).join('');
  }

  function frame(now) {
    if (!M.on) return; raf = requestAnimationFrame(frame);
    const t = now / 1000;
    if (now - slowT > 1800) { slowT = now; pushData(); drawSeries(); drawBio(); renderFac(); $('#monClock').textContent = new Date().toISOString().slice(11, 19) + ' UTC'; }
    drawMap(t); drawRadar(); drawOcean(t); drawAtmo(t);
  }

  M.init = function () {
    $('#seriesLegend').innerHTML = SERIES.map(s => `<span><i style="background:${s.c}"></i>${s.k}</span>`).join('');
    for (let i = 0; i < 6; i++) logLine();
  };
  M.start = function () { if (M.on) return; M.on = true; slowT = 0; worldCache = null; raf = requestAnimationFrame(frame); };
  M.stop = function () { M.on = false; cancelAnimationFrame(raf); };
  window.Monitor = M;
})();
