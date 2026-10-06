/* BLACK VEIL — department views, investigation panel, document viewer */
(function () {
  const V = {};
  const $ = s => document.querySelector(s);
  const esc = s => FX.esc(s);
  const lbl = k => `<span class="lbl ${k}" title="${esc(BV.labels[k].note)}">${BV.labels[k].name}</span>`;
  const tb = (lvl, text) => `<span class="tbadge tl${lvl}"><i></i>${esc(text || BV.threat[lvl].name)}</span>`;
  const site = id => BV.sites.find(s => s.id === id);
  const proj = id => BV.projects.find(p => p.id === id);
  const docOf = id => BV.documents.find(d => d.id === id);
  V.site = site; V.proj = proj; V.docOf = docOf;

  /* ---------------------------------------------------------- MAP side */
  V.renderThreatLegend = function () {
    $('#threatLegend').innerHTML = BV.threat.slice(1).map(t =>
      `<button class="tl${t.lvl}" data-lv="${t.lvl}" aria-label="Preview threat level ${t.lvl}: ${t.name}"><span class="lv">LEVEL 0${t.lvl}</span><span class="nm">${t.name}</span><span class="ds">${t.desc}</span></button>`).join('');
  };
  V.renderSiteList = function () {
    const list = BV.sites.filter(s => s.type !== 'hidden' || Story.S.zero);
    $('#siteList').innerHTML = list.map(s => {
      const lvl = s.type === 'event' ? 1 : s.threat;
      return `<button role="listitem" class="tl${lvl}" data-open-site="${s.id}"><i></i><span>${esc(s.name)}<br><small>${esc(s.region)}</small></span><small>${s.type === 'event' ? lbl(s.label) : (s.last || '')}</small></button>`;
    }).join('');
  };
  V.tip = function (s) {
    if (s.type === 'event') return `<em>${BV.labels[s.label].name} · ${esc(s.year)}</em><b>${esc(s.name)}</b>${esc(s.region)}<br><em>CLICK TO OPEN PUBLIC RECORD</em>`;
    return `<em>${esc(s.region)}</em><b>${esc(s.name)}</b>STATUS: <span style="color:var(--amber)">${esc(s.status)}</span><br>THREAT: <span class="tl${s.threat}" style="color:var(--tc)">${esc(s.threatText)}</span><br>LAST TRANSMISSION: ${esc(s.last)}`;
  };

  /* ---------------------------------------------------------- RESEARCH */
  let researchFilter = 'ALL';
  V.renderResearch = function () {
    const cats = ['ALL', 'ACTIVE', 'QUARANTINE', 'TERMINATED', 'SEALED'];
    $('#researchFilters').innerHTML = cats.map(c => `<button class="${c === researchFilter ? 'on' : ''}" data-rf="${c}">${c}</button>`).join('');
    const list = BV.projects.filter(p => !p.secret || Story.S.correlation).filter(p => {
      if (researchFilter === 'ALL') return true;
      if (researchFilter === 'SEALED') return p.locked && !Story.S.zero;
      return p.status.startsWith(researchFilter);
    });
    $('#researchGrid').innerHTML = list.map(p => {
      const locked = p.locked && !Story.S.zero, d = locked ? p : Object.assign({}, p, p.unlocked || {});
      return `<button class="card tl${p.threat} ${Story.seen(p.id) ? 'viewed' : ''} ${locked ? 'locked' : ''}" data-open-proj="${p.id}">
        <div class="meta"><span>${p.pid}</span>${lbl(p.label)}</div>
        <h3>${esc(p.codename)}${p.secret ? ' <small style="color:var(--red);font-size:12px">◆ HIDDEN</small>' : ''}</h3>
        <p>${locked ? '<span class="redact-block">████████ ███████ ██████████ ██ ███</span> ████ ███████ ████ ██████.' : esc(d.summary)}</p>
        <dl class="kv"><dt>CATEGORY</dt><dd>${esc(d.category)}</dd><dt>LOCATION</dt><dd>${esc(d.location)}</dd><dt>STATUS</dt><dd>${esc(d.status)}</dd><dt>THREAT</dt><dd>${tb(p.threat)}</dd></dl>
      </button>`;
    }).join('');
  };

  /* ---------------------------------------------------------- BIOHAZARD */
  let microStops = [];
  V.renderBio = function () {
    microStops.forEach(f => f()); microStops = [];
    $('#specGrid').innerHTML = BV.specimens.map(s => `
      <button class="card spec tl${s.threat}" data-spec="${s.id}" aria-label="Specimen ${s.id}">
        <div style="position:relative"><canvas data-micro="${s.id}"></canvas><div class="scope-hud"><span>×${s.denied ? '—' : (400 + FX.hash(s.id) % 3600)}</span><span>${esc(s.id)}</span></div></div>
        <div class="spec-body">
          <div class="meta"><span>SPECIMEN</span>${lbl(s.label)}</div>
          <h3>${esc(s.id)}</h3>
          <dl class="kv"><dt>CLASSIFICATION</dt><dd>${esc(s.cls)}</dd><dt>STATUS</dt><dd class="spec-status">${esc(s.status)}</dd><dt>LAST OBSERVED</dt><dd>${esc(s.last)}</dd><dt>ORIGIN</dt><dd>${esc(s.origin)}</dd></dl>
        </div>
      </button>`).join('');
    document.querySelectorAll('[data-micro]').forEach(cv => { const s = BV.specimens.find(x => x.id === cv.dataset.micro); microStops.push(FX.microscope(cv, s.micro, s.id)); });
    $('#qzTable tbody').innerHTML = BV.quarantine.map(q => `<tr class="tl${q.level}"><td>${esc(q.zone)}</td><td>${esc(q.radius)}</td><td>${q.since}</td><td><span class="tbadge"><i></i>${q.status}</span></td></tr>`).join('');
    $('#procList').innerHTML = BV.procedures.map(p => `<li>${esc(p)}</li>`).join('');
  };

  /* SIR infection simulation on a grid (spatial, stochastic) */
  V.sim = (function () {
    const N = 64, M = 36; let grid, timer = null, hist = [], tick = 0;
    const cv = () => $('#simCanvas'), ch = () => $('#simChart');
    function reset() {
      grid = new Uint8Array(N * M); hist = []; tick = 0; // 0 S, 1 I, 2 R, 3 wall
      if ($('#simContain').checked) for (let y = 0; y < M; y++) for (let x = 0; x < N; x++) if ((x % 16 === 0 || y % 12 === 0) && !((x + y) % 7 === 0)) grid[y * N + x] = 3;
      grid[Math.floor(M / 2) * N + Math.floor(N / 2)] = 1; grid[5 * N + 9] = 1;
      draw();
    }
    function step() {
      const b = +$('#simBeta').value, g = +$('#simGamma').value, next = grid.slice();
      for (let y = 0; y < M; y++) for (let x = 0; x < N; x++) {
        const i = y * N + x;
        if (grid[i] === 0) {
          let inf = 0;
          for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) { if (!dx && !dy) continue; const xx = x + dx, yy = y + dy; if (xx >= 0 && yy >= 0 && xx < N && yy < M && grid[yy * N + xx] === 1) inf++; }
          if (inf && Math.random() < 1 - Math.pow(1 - b / 4, inf)) next[i] = 1;
        } else if (grid[i] === 1 && Math.random() < g) next[i] = 2;
      }
      grid = next; tick++;
      let s = 0, ii = 0, r = 0; grid.forEach(v => { if (v === 0) s++; else if (v === 1) ii++; else if (v === 2) r++; });
      hist.push([s, ii, r]); draw();
      if (ii === 0) stop();
    }
    function draw() {
      const c = cv(), x = c.getContext('2d'), cw = c.width / N, chh = c.height / M;
      x.fillStyle = '#030404'; x.fillRect(0, 0, c.width, c.height);
      for (let y = 0; y < M; y++) for (let xx = 0; xx < N; xx++) {
        const v = grid[y * N + xx]; x.fillStyle = ['#16242b', '#d0212a', '#3f5c34', '#6b6255'][v];
        x.fillRect(xx * cw + .5, y * chh + .5, cw - 1, chh - 1);
      }
      x.fillStyle = 'rgba(255,255,255,.6)'; x.font = '10px JetBrains Mono'; x.fillText('T+' + String(tick).padStart(3, '0') + ' CYCLES', 8, 14);
      const k = ch(), kx = k.getContext('2d'), total = N * M; kx.clearRect(0, 0, k.width, k.height);
      kx.strokeStyle = 'rgba(255,255,255,.08)'; kx.beginPath(); kx.moveTo(0, k.height - .5); kx.lineTo(k.width, k.height - .5); kx.stroke();
      if (hist.length < 2) return;
      const len = Math.max(120, hist.length);
      [['#3d5b6b', 0], ['#d0212a', 1], ['#7fae6a', 2]].forEach(([col, j]) => {
        kx.strokeStyle = col; kx.lineWidth = 2; kx.beginPath();
        hist.forEach((h, i) => { const px = i / len * k.width, py = k.height - 4 - h[j] / total * (k.height - 10); i ? kx.lineTo(px, py) : kx.moveTo(px, py); }); kx.stroke();
      });
      const last = hist[hist.length - 1]; kx.fillStyle = '#d0212a'; kx.font = '10px JetBrains Mono'; kx.fillText('INFECTED ' + (last[1] / total * 100).toFixed(1) + '%', k.width - 120, 12);
    }
    function start() { if (timer) return stop(); $('#simRun').textContent = 'PAUSE'; timer = setInterval(step, FX.reduced ? 200 : 90); BVAudio.click(); }
    function stop() { clearInterval(timer); timer = null; const b = $('#simRun'); if (b) b.textContent = 'RUN'; }
    return { reset, start, stop, init() {
      reset();
      $('#simRun').onclick = start; $('#simReset').onclick = () => { stop(); reset(); };
      $('#simContain').onchange = () => { stop(); reset(); };
      ['Beta', 'Gamma'].forEach(n => $('#sim' + n).oninput = e => { $('#sim' + n + 'V').textContent = (+e.target.value).toFixed(2); });
    } };
  })();

  /* ---------------------------------------------------------- FACILITIES */
  const TERRAIN = { F07: 'desert', OMEGA: 'ice', BS12: 'tundra', DEEPNODE: 'ocean', ORPHEUS: 'ocean', KASAI: 'forest', VERDANT: 'forest', CAIRN: 'mountain', HADAL: 'ocean' };
  V.renderFacilities = function () {
    const list = BV.sites.filter(s => s.type === 'facility');
    $('#facGrid').innerHTML = list.map(s => `
      <button class="card fac tl${s.threat} ${s.denied ? 'denied' : ''} ${Story.seen(s.id) ? 'viewed' : ''}" data-open-site="${s.id}">
        <div class="sat"><canvas data-sat="${s.id}"></canvas><div class="sat-hud"><div><span>${s.lat.toFixed(2)}, ${s.lon.toFixed(2)}</span><span>PASS ${FX.hash(s.id) % 900 + 100}</span></div><div><span>${esc(s.name)}</span><span>RES 0.6 m</span></div></div></div>
        <div class="fac-body">
          <div class="meta"><span>${esc(s.name)} // ${esc(s.region.split(' — ')[0])}</span>${lbl(s.label)}</div>
          <dl class="kv"><dt>PURPOSE</dt><dd>${esc(s.purpose)}</dd><dt>SECURITY</dt><dd>${esc(s.security)}</dd><dt>BUILT</dt><dd>${esc(s.built)}</dd><dt>DEPTH</dt><dd>${esc(s.depth)}</dd><dt>PERSONNEL</dt><dd>${esc(s.personnel)}</dd><dt>STATUS</dt><dd>${tb(s.threat, s.status)}</dd></dl>
        </div>
      </button>`).join('');
    // lazy-paint satellite imagery when scrolled into view
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { const id = e.target.dataset.sat; FX.satellite(e.target, id, { terrain: TERRAIN[id] }); io.unobserve(e.target); } }));
    document.querySelectorAll('[data-sat]').forEach(c => io.observe(c));
  };

  /* ---------------------------------------------------------- ANOMALIES */
  V.renderAnomalies = function () {
    const list = BV.anomalies.slice();
    $('#anomGrid').innerHTML = list.map(a => `
      <button class="card anom tl${a.threat} ${Story.seen(a.id) ? 'viewed' : ''}" data-anom="${a.id}">
        <div class="meta"><span>${a.id}</span>${lbl(a.label)}</div>
        <h3>${esc(a.title)}</h3><p>${esc(a.text)}</p>
        <span class="glitchline">${tb(a.threat)} · INTEGRITY ${(70 + FX.hash(a.id) % 29)}%</span>
      </button>`).join('');
  };

  /* ---------------------------------------------------------- UNEXPLAINED (real) */
  V.renderUnexplained = function () {
    $('#unxList').innerHTML = BV.unexplained.map(u => `
      <div class="unx" id="${u.id}">
        <button aria-expanded="false" data-unx="${u.id}"><span class="date">${esc(u.date)}</span><span><h3>${esc(u.title)}</h3><small>${esc(u.place)}</small></span>${lbl(u.label)}</button>
        <div class="unx-body">
          <div><h4>THE RECORD</h4><p>${esc(u.record)}</p></div>
          <div><h4>LEADING EXPLANATION</h4><p>${esc(u.explanation)}</p></div>
          <div><h4>WHAT REMAINS OPEN</h4><p>${esc(u.open)}</p></div>
        </div>
      </div>`).join('');
  };
  V.openUnx = function (id) {
    const el = document.getElementById(id); if (!el) return;
    App.go('unexplained');
    el.classList.add('open'); el.querySelector('button').setAttribute('aria-expanded', 'true');
    setTimeout(() => el.scrollIntoView({ behavior: FX.reduced ? 'auto' : 'smooth', block: 'center' }), 380);
    Story.log('READ PUBLIC RECORD ' + BV.unexplained.find(u => u.id === id).title.toUpperCase());
  };

  /* ---------------------------------------------------------- FILES */
  V.compare = { on: false, pick: [] };
  V.renderFiles = function () {
    $('#filesGrid').innerHTML = BV.documents.map(d => {
      const locked = d.locked === 'correlation' && !Story.S.correlation;
      return `<button class="folder ${locked ? 'locked' : ''} ${Story.seen(d.id) ? 'viewed' : ''} ${V.compare.pick.includes(d.id) ? 'selected' : ''}" data-doc="${d.id}" aria-label="${esc(d.title)}${locked ? ' (locked)' : ''}">
        <div class="fold"><div class="ftag">${esc(d.file)} · ${esc(d.date)}</div><h3>${locked ? '██████ ██ ████████' : esc(d.title)}</h3><span class="fstamp">${esc(d.stamp)}</span>
        <div class="ftag" style="margin-top:14px">${BV.labels[d.label].name}</div></div></button>`;
    }).join('');
  };

  /* ---------------------------------------------------------- INCIDENTS */
  V.renderIncidents = function () {
    $('#incTable tbody').innerHTML = BV.incidents.map(i => {
      const s = site(i.site); const hidden = i.site === 'NULL' && !Story.S.zero;
      return `<tr class="click tl${i.sev}" data-open-site="${hidden ? '' : i.site}" tabindex="0"><td>${i.id}</td><td>${i.date}</td><td>${hidden ? '████' : esc(s ? s.name : i.site)}</td><td class="sev">${BV.threat[i.sev].name}</td><td>${esc(i.title)}</td><td>${i.status}</td><td>${lbl(i.label)}</td></tr>`;
    }).join('');
  };

  /* ---------------------------------------------------------- TIMELINE */
  const TL = { x: 0, min: 0, max: 0, sel: -1 };
  V.renderTimeline = function () {
    const ev = BV.timeline, y0 = 1900, y1 = 2030, PX = 34; // px per year
    const track = $('#tlTrack'); track.style.width = ((y1 - y0) * PX + 400) + 'px';
    const used = {};
    track.innerHTML = ev.map((e, i) => {
      const k = e.y; used[k] = (used[k] || 0) + 1;
      const up = (i % 2 === 0) !== (used[k] > 1);
      const corrupt = e.tag === 'DATA CORRUPTED' || e.tag === 'REDACTED';
      return `<button class="tl-ev ${e.label} ${up ? 'up' : 'down'} ${corrupt ? 'corrupt' : ''}" style="left:${(e.y - y0) * PX + 120 + (used[k] - 1) * 30}px" data-tl="${i}">
        <div class="yr">${e.y}</div><div class="tt">${esc(e.t)}</div><span class="tg">${e.tag ? esc(e.tag) : BV.labels[e.label].name}</span></button>`;
    }).join('');
    $('#tlYears').innerHTML = [1900, 1925, 1950, 1975, 2000, 2025].map(y => `<span>${y}</span>`).join('');
    const wrap = $('#tlWrap');
    TL.max = 0; TL.min = Math.min(0, wrap.clientWidth - track.scrollWidth);
    const apply = () => { TL.x = Math.max(TL.min, Math.min(TL.max, TL.x)); track.style.transform = `translateX(${TL.x}px)`; };
    if (!TL.bound) {
      TL.bound = true; let down = false, sx = 0, st = 0, moved = 0;
      wrap.addEventListener('pointerdown', e => { down = true; sx = e.clientX; st = TL.x; moved = 0; wrap.setPointerCapture(e.pointerId); });
      wrap.addEventListener('pointermove', e => { if (!down) return; moved = Math.abs(e.clientX - sx); TL.x = st + (e.clientX - sx); apply(); });
      wrap.addEventListener('pointerup', e => { down = false; if (moved < 5) { const b = document.elementsFromPoint(e.clientX, e.clientY).find(n => n.dataset && n.dataset.tl); if (b) V.selectTl(+b.dataset.tl); } });
      wrap.addEventListener('wheel', e => { e.preventDefault(); TL.x -= (e.deltaX || e.deltaY); apply(); }, { passive: false });
      wrap.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight') { V.selectTl(Math.min(ev.length - 1, TL.sel + 1)); e.preventDefault(); }
        if (e.key === 'ArrowLeft') { V.selectTl(Math.max(0, TL.sel - 1)); e.preventDefault(); }
        if (e.key === 'Enter' && TL.sel >= 0) V.openRef(ev[TL.sel].ref);
      });
      window.addEventListener('resize', () => { TL.min = Math.min(0, wrap.clientWidth - track.scrollWidth); apply(); });
    }
    TL.x = TL.min * .35; apply(); TL.apply = apply;
  };
  V.selectTl = function (i) {
    const e = BV.timeline[i]; TL.sel = i;
    document.querySelectorAll('.tl-ev').forEach((b, j) => b.classList.toggle('sel', j === i));
    const b = document.querySelector(`[data-tl="${i}"]`), wrap = $('#tlWrap');
    TL.x = -(parseFloat(b.style.left) - wrap.clientWidth / 2 + 95); TL.apply();
    const d = $('#tlDetail');
    d.innerHTML = `<div class="meta mono dim" style="font-size:10px;letter-spacing:.14em;margin-bottom:6px">${e.y} · ${lbl(e.label)} ${e.tag ? '· ' + esc(e.tag) : ''}</div><h3></h3><p style="margin:0 0 10px">${esc(e.d)}</p><button class="btn sm" data-ref="${e.ref}">OPEN RELATED FILE →</button>`;
    FX.scramble(d.querySelector('h3'), e.t, 500); BVAudio.beep(1400, .03, .02);
  };

  /* ---------------------------------------------------------- ARCHIVE search */
  V.index = function () {
    const out = [];
    BV.sites.filter(s => s.type === 'facility').forEach(s => out.push({ id: s.id, t: s.name, k: 'FACILITY', label: s.label, txt: [s.summary, s.notes, ...(s.observations || []), ...(s.incidents || [])].join(' ') }));
    BV.projects.filter(p => !p.secret || Story.S.correlation).forEach(p => out.push({ id: p.id, t: p.codename, k: 'PROJECT', label: p.label, txt: p.locked && !Story.S.zero ? '' : [p.summary, ...(p.findings || [])].join(' ') }));
    BV.documents.forEach(d => out.push({ id: d.id, t: d.title, k: 'DOCUMENT', label: d.label, txt: d.locked && !Story.S.correlation ? '' : d.body.join(' ').replace(/\[\[(R|ENC:[A-Z0-9]+):[^\]]*\]\]/g, '').replace(/\[\[(UV|HW):/g, '').replace(/\]\]/g, '') }));
    BV.specimens.forEach(s => out.push({ id: s.id, t: 'SPECIMEN ' + s.id, k: 'SPECIMEN', label: s.label, txt: [s.cls, s.morph, s.note].join(' ') }));
    BV.anomalies.forEach(a => out.push({ id: a.id, t: a.title, k: 'ANOMALY', label: a.label, txt: a.text }));
    BV.unexplained.forEach(u => out.push({ id: u.id, t: u.title.toUpperCase(), k: 'PUBLIC RECORD', label: u.label, txt: [u.record, u.explanation, u.open].join(' ') }));
    return out;
  };
  V.renderArchive = function (q = '') {
    const Q = q.trim().toLowerCase(), all = V.index();
    const res = Q ? all.filter(r => (r.t + ' ' + r.txt + ' ' + r.id).toLowerCase().includes(Q)) : all;
    const hl = s => Q ? esc(s).replace(new RegExp(Q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi'), m => `<mark>${m}</mark>`) : esc(s);
    $('#arcResults').innerHTML = res.length ? res.map(r => {
      let snip = ''; if (Q) { const i = r.txt.toLowerCase().indexOf(Q); if (i >= 0) snip = `<small class="dim" style="display:block;font-size:12.5px">…${hl(r.txt.slice(Math.max(0, i - 50), i + 70))}…</small>`; }
      return `<li><button data-any="${r.id}"><span class="aid">${r.k}<br>${r.id}</span><span><span class="atitle">${hl(r.t)}</span>${snip}</span>${lbl(r.label)}</button></li>`;
    }).join('') : `<li class="mono dim" style="padding:14px">NO RECORDS. ${Q === '03:17:42' ? '' : 'THE ABSENCE HAS BEEN LOGGED.'}</li>`;
    if (Q === '03:17:42' && res.length > 4) FX.toast(`${res.length} RECORDS SHARE THIS TIMESTAMP`);
  };
  V.renderDisc = function () {
    const D = Story.DISCOVERIES, have = Story.S.disc;
    $('#discCount').textContent = `${have.length} / ${Object.keys(D).length}`;
    $('#discList').innerHTML = Object.keys(D).map(k => have.includes(k) ? `<li>${D[k]}</li>` : `<li class="no">██████████</li>`).join('');
    $('#accessLog').innerHTML = Story.S.log.slice(0, 40).map(t => `<li><b>${t.slice(0, 8)}</b> ${esc(t.slice(9))}</li>`).join('');
  };

  /* ==========================================================================
     INVESTIGATION PANEL
     ========================================================================== */
  let invStops = [], invPrevThreat = null, lastFocus = null;
  function openInv(kicker, title, html, threat) {
    lastFocus = document.activeElement;
    $('#invKicker').innerHTML = kicker; $('#invTitle').textContent = ''; $('#invBody').innerHTML = html;
    $('#inv').hidden = false; FX.scramble($('#invTitle'), title, 600);
    App.setThreat(threat, true);
    BVAudio.click(); if (threat >= 3) BVAudio.alarm(1);
    if (threat >= 3) FX.flash();
    setTimeout(() => $('#inv .close').focus(), 50);
  }
  V.closeInv = function () {
    invStops.forEach(f => f && f()); invStops = [];
    $('#inv').hidden = true; App.restoreThreat();
    lastFocus && lastFocus.focus && lastFocus.focus();
  };

  const sec = (h, body) => body ? `<section class="inv-sec"><h4>${h}</h4>${body}</section>` : '';
  const ul = arr => arr && arr.length ? `<ul>${arr.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
  const grid = pairs => `<dl class="inv-grid">${pairs.map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('')}</dl>`;

  function audioBlock(a, siteObj) {
    return `<section class="inv-sec"><h4>AUDIO TRANSMISSION</h4><div class="audio-player"><button data-play="${a.kind}" aria-label="Play transmission">▶</button><canvas data-wave></canvas><p>${esc(a.caption)}${BVAudio.enabled ? '' : ' — TURN SOUND ON TO LISTEN'}</p></div></section>`;
  }
  function bindAudio(root, extra = {}) {
    root.querySelectorAll('[data-play]').forEach(btn => {
      const cv = btn.parentElement.querySelector('[data-wave]'); let tx = null, raf = 0;
      const idle = () => { const { w, h } = FX.fit(cv), c = cv.getContext('2d'); c.clearRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,.2)'; c.beginPath(); for (let x = 0; x < w; x += 2) c.lineTo(x, h / 2 + (Math.random() - .5) * 3); c.stroke(); };
      idle();
      btn.onclick = () => {
        if (tx) { tx.stop(); tx = null; btn.textContent = '▶'; cancelAnimationFrame(raf); idle(); return; }
        if (!BVAudio.enabled) { FX.toast('SOUND IS OFF — ENABLE SOUND TO PLAY TRANSMISSIONS'); return; }
        tx = BVAudio.transmit(btn.dataset.play, extra); if (!tx) return; btn.textContent = '■';
        const buf = new Uint8Array(tx.analyser.fftSize), t0 = performance.now();
        const draw = () => {
          const { w, h } = FX.fit(cv), c = cv.getContext('2d'); tx && tx.analyser.getByteTimeDomainData(buf);
          c.clearRect(0, 0, w, h); c.strokeStyle = getComputedStyle(document.body).getPropertyValue('--accent'); c.lineWidth = 1.5; c.beginPath();
          for (let i = 0; i < buf.length; i++) { const x = i / buf.length * w, y = buf[i] / 255 * h; i ? c.lineTo(x, y) : c.moveTo(x, y); } c.stroke();
          if (tx && performance.now() - t0 < tx.duration * 1000) raf = requestAnimationFrame(draw); else { tx = null; btn.textContent = '▶'; idle(); }
        };
        draw();
        if (extra.onPlay) extra.onPlay();
      };
      invStops.push(() => { tx && tx.stop(); cancelAnimationFrame(raf); });
    });
  }

  V.openSite = function (id) {
    const s = site(id); if (!s) return false;
    if (s.type === 'event') { V.openUnx(s.ref); return true; }
    if (s.type === 'hidden') { if (Story.S.zero) Story.findNull(); return true; }
    Globe.focus(s.lat, s.lon);
    const denied = s.denied && !Story.S.zero;
    const html = `
      ${denied ? '<div class="denied-box">ACCESS DENIED — PARTIAL RECORD · CLEARANCE VEIL-BLACK REQUIRED</div>' : ''}
      <p style="margin:0 0 14px">${lbl(s.label)} ${tb(s.threat, 'THREAT: ' + s.threatText)}</p>
      ${grid([['LOCATION', esc(s.region)], ['COORDINATES', `${s.lat.toFixed(2)}, ${s.lon.toFixed(2)}`], ['DISCOVERY', esc(s.discovered)], ['CLASSIFICATION', esc(s.classification)], ['DIVISION', esc(s.division)], ['LAST TRANSMISSION', esc(s.last)], ['STATUS', esc(s.status)], ['DEPTH', esc(s.depth)], ['PERSONNEL', esc(s.personnel)]])}
      ${sec('SUMMARY', `<p>${esc(s.summary)}</p>`)}
      <div class="inv-media"><figure><canvas data-satimg></canvas><figcaption>SATELLITE PASS — ARCHIVAL</figcaption></figure><figure><canvas data-evimg></canvas><figcaption>DECLASSIFIED EVIDENCE — ${esc((s.evidence[0] || '').toUpperCase())}</figcaption></figure></div>
      ${sec('KNOWN INCIDENTS', ul(s.incidents))}
      ${sec('SCIENTIFIC OBSERVATIONS', ul(s.observations))}
      ${sec('DECLASSIFIED EVIDENCE', ul(s.evidence))}
      ${sec('TIMELINE', `<ol class="tl-mini">${s.timeline.map(([y, t]) => `<li><b>${y}</b>${esc(t)}</li>`).join('')}</ol>`)}
      ${audioBlock(s.audio, s)}
      ${sec('RESEARCH NOTES', `<p class="notes">${esc(s.notes)}</p>`)}
      ${sec('CROSS-REFERENCES', [...s.projects.map(p => `<button class="chip" data-open-proj="${p}">PROJECT ${p}</button>`), ...s.docs.map(d => `<button class="chip" data-doc="${d}">${d}</button>`)].join(''))}
    `;
    openInv(`${esc(s.region)} // ${esc(s.id)}`, s.name, html, s.threat);
    const terr = { F07: 'desert', OMEGA: 'ice', BS12: 'tundra', KASAI: 'forest', VERDANT: 'forest', CAIRN: 'mountain' }[s.id] || 'ocean';
    requestAnimationFrame(() => {
      FX.satellite($('[data-satimg]'), s.id, { terrain: terr });
      const ev = $('[data-evimg]'); ev.width = 380; ev.height = 240;
      FX.evidence(ev, { F07: 'debris', CAIRN: 'trace', KASAI: 'culture', DEEPNODE: 'spectrogram', HADAL: 'satellite', BS12: 'trace', ORPHEUS: 'spectrogram', VERDANT: 'culture', OMEGA: 'eye' }[s.id], s.id);
      bindAudio($('#invBody'), s.audio.kind === 'morse' ? { message: 'THRESHOLD' } : {});
    });
    Story.view(s.id, s.name, { veil: s.veil, grants: s.keys });
    return true;
  };

  V.openProject = function (id) {
    const p = proj(id); if (!p) return false;
    const locked = p.locked && !Story.S.zero, d = locked ? p : Object.assign({}, p, p.unlocked || {});
    let html = `<p style="margin:0 0 14px">${lbl(p.label)} ${tb(p.threat)}</p>
      ${grid([['PROJECT ID', p.pid], ['LOCATION', esc(d.location)], ['ORGANIZATION', esc(d.org)], ['CATEGORY', esc(d.category)], ['STATUS', esc(d.status)], ['DISCOVERY', esc(d.discovered)], ['LAST UPDATE', esc(d.updated)], ['THREAT', BV.threat[p.threat].name], ['ARCHIVE ID', 'BV-' + (FX.hash(p.id) % 99999).toString().padStart(5, '0')]])}`;
    if (locked) {
      html += `<div class="denied-box">FILE ENCRYPTED — ${Story.S.correlation ? 'PASSPHRASE REQUIRED' : 'ALMOST COMPLETELY REDACTED'}</div>
        ${sec('SUMMARY', `<p><span class="redact-block">████████ ██ ███ █ ████████ ███████.</span> ██ ██ ███ █████ ██ █████ ███ ████ ███████. <span class="redact-block">█████ ███ ███████████ ███████.</span></p>`)}
        ${sec('DECRYPTION', `<p class="mono dim" style="font-size:12px">A passphrase was transmitted once, in 1991, from a listening post. ${Story.S.correlation ? '' : 'Correlation not yet established.'}</p>
        <form class="passbox" id="zeroForm"><input id="zeroPass" aria-label="Passphrase" placeholder="PASSPHRASE" autocomplete="off"><button class="btn sm">DECRYPT</button></form>`)}`;
    } else {
      html += `${sec('SUMMARY', `<p>${esc(d.summary)}</p>`)}
        ${sec('FINDINGS', ul(d.findings))}
        ${sec('RESEARCHERS', ul(d.researchers))}
        ${sec('EVIDENCE', ul(d.evidence))}
        ${sec('INCIDENT REPORTS', ul(d.incidents))}
        ${p.morse ? audioBlock({ kind: 'morse', caption: 'CAIRN 1991 — MORSE SEGMENT. Transcript: — .... .-. . ... .... --- .-.. -..   (decode in the terminal: decode <code>)' }) : ''}
        ${sec('RELATED PROJECTS', p.related.map(r => `<button class="chip" data-open-proj="${r}">PROJECT ${r}</button>`).join('') + (p.site ? `<button class="chip" data-open-site="${p.site}">SITE: ${esc(site(p.site).name)}</button>` : ''))}
        ${id === 'ZERO' ? `<div class="inv-sec"><button class="btn danger" id="goNull">TRACE −48.88, −123.39</button></div>` : ''}`;
    }
    openInv(`RESEARCH DATABASE // ${p.pid}`, p.codename, html, p.threat);
    const f = $('#zeroForm');
    if (f) f.onsubmit = e => {
      e.preventDefault();
      if (Story.tryZero($('#zeroPass').value)) { V.closeInv(); setTimeout(() => V.openProject('ZERO'), 300); }
      else { f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); BVAudio.beep(180, .25, .08, 'sawtooth'); Story.log('ZERO PASSPHRASE REJECTED'); }
    };
    const g = $('#goNull'); if (g) g.onclick = () => { V.closeInv(); App.go('map'); Globe.focus(-48.88, -123.39); setTimeout(Story.findNull, 1500); };
    bindAudio($('#invBody'), { message: 'THRESHOLD', onPlay: () => Story.log('PLAYED ECHO MORSE SEGMENT') });
    if (id === 'LANTERN') Story.discover('lantern');
    Story.view(p.id, p.codename, { veil: p.veil, grants: locked ? [] : [p.grants] });
    return true;
  };

  V.openAnomaly = function (id) {
    const a = BV.anomalies.find(x => x.id === id); if (!a) return false;
    openInv(`ANOMALY REGISTER // ${a.id}`, a.title, `<p>${lbl(a.label)} ${tb(a.threat)}</p>${sec('OBSERVATION', `<p>${esc(a.text)}</p>`)}${sec('DATA INTEGRITY', `<p class="mono dim">${70 + FX.hash(a.id) % 29}% — portions of this record could not be recovered.</p>`)}`, a.threat);
    Story.view(a.id, a.title, { veil: true });
    return true;
  };

  V.openSpecimen = function (id) {
    const s = BV.specimens.find(x => x.id === id); if (!s) return false;
    openInv(`BIOHAZARD // SPECIMEN REGISTRY`, 'SPECIMEN: ' + s.id, `<p>${lbl(s.label)} ${tb(s.threat)}</p>
      ${grid([['CLASSIFICATION', esc(s.cls)], ['STATUS', `<span style="color:var(--red)">${esc(s.status)}</span>`], ['LAST OBSERVED', esc(s.last)], ['ORIGIN', esc(s.origin)], ['CONTAINMENT', BV.threat[s.threat].name], ['SPECIMEN STATUS', s.denied ? 'DENIED' : 'LOGGED']])}
      <div class="inv-media" style="grid-template-columns:1fr"><figure><canvas data-bigmicro style="height:240px"></canvas><figcaption>LIVE MICROSCOPY FEED — ${esc(s.id)}</figcaption></figure></div>
      ${sec('MORPHOLOGY', `<p>${esc(s.morph)}</p>`)}${sec('CONTAINMENT PROCEDURE', `<p>${esc(s.contain)}</p>`)}${sec('LAB NOTE', `<p class="notes">${esc(s.note)}</p>`)}`, s.threat);
    requestAnimationFrame(() => invStops.push(FX.microscope($('[data-bigmicro]'), s.micro, s.id + 'L')));
    Story.view(s.id, 'SPECIMEN ' + s.id, { veil: false });
    return true;
  };

  /* ==========================================================================
     DOCUMENT VIEWER
     ========================================================================== */
  const DV = { zoom: 1, rot: 0, uv: false, lens: false, docs: [] };
  function parseBody(text, doc) {
    if (text === '[[SIG]]') return `<div class="sig">${FX.signature(doc.id)}<small>${esc(doc.from)}</small></div>`;
    let isBlock = false;
    const html = esc(text).replace(/\[\[(R|UV|HW|ENC):(?:([A-Z0-9]+):)?(.*?)\]\]/g, (m, t, key, body) => {
      if (t === 'R') return `<span class="rd">${body}</span>`;
      if (t === 'UV') return `<span class="uv" data-uv>${body}</span>`;
      if (t === 'HW') { isBlock = true; return `<span class="hw">${body}</span>`; }
      if (t === 'ENC') {
        isBlock = true; const has = Story.has(key);
        const cipher = Array.from(body).map((c, i) => c === ' ' ? ' ' : String.fromCharCode(0x41 + ((c.charCodeAt(0) * 7 + i * 3) % 26))).join('');
        return `<span class="enc ${has ? 'can' : 'locked'}" data-enc data-plain="${body}" data-need="REQUIRES CROSS-REFERENCE: ${key === 'ZERO' ? 'PROJECT ZERO' : (proj(key) ? 'PROJECT ' + key : key)}">${cipher}</span>`;
      }
      return m;
    });
    return isBlock ? html : `<p>${html}</p>`;
  }
  function highlightSigs(html) {
    BV.signatures.forEach(sig => { const re = new RegExp('(' + sig.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')(?![^<]*>)', 'gi'); html = html.replace(re, '<span class="sigmatch">$1</span>'); });
    return html;
  }
  function docHTML(d, compare) {
    let body = d.body.map(b => parseBody(b, d)).join('');
    if (compare) body = highlightSigs(body);
    return `<article class="doc" data-docid="${d.id}" tabindex="0">
      <div class="d-head"><span>FILE ${esc(d.file)}</span><span>${esc(d.date)}</span></div>
      <p class="d-cls">${esc(d.cls)}</p>
      <div class="photo" data-photo="${d.photo}"><canvas width="380" height="280"></canvas><span>exhibit ${FX.hash(d.id) % 90 + 10}</span></div>
      <h3>${esc(d.title)}</h3>
      <div class="d-route">FROM: ${esc(d.from)}<br>TO: ${esc(d.to)}<br>REF: ${esc(d.id)} · ${BV.labels[d.label].name}</div>
      ${body}
      <span class="stamp">${esc(d.stamp)}</span>
      <div class="d-foot"><span>BLACK VEIL // ${esc(d.cls)}</span><span>COPY ${FX.hash(d.id) % 9 + 1} OF 9</span></div>
    </article>`;
  }
  function applyDV() {
    document.querySelectorAll('#docvStage .doc').forEach(el => { el.style.transform = `scale(${DV.zoom}) rotate(${DV.rot}deg)`; el.classList.toggle('uv-on', DV.uv); });
    document.querySelector('[data-act="uv"]').setAttribute('aria-pressed', DV.uv);
    document.querySelector('[data-act="lens"]').setAttribute('aria-pressed', DV.lens);
  }
  V.openDoc = function (ids) {
    ids = [].concat(ids); const docs = ids.map(docOf).filter(Boolean); if (!docs.length) return false;
    if (docs.some(d => d.locked === 'correlation' && !Story.S.correlation)) { FX.toast('LOCKED — CORRELATE AT LEAST 5 BLACK VEIL FILES'); BVAudio.beep(180, .2, .06, 'sawtooth'); return true; }
    lastFocus = document.activeElement;
    DV.zoom = window.innerWidth < 720 ? 1 : 1; DV.rot = 0; DV.uv = false; DV.lens = false; DV.docs = docs;
    const compare = docs.length > 1;
    $('#docvTitle').textContent = compare ? `COMPARE — ${docs.map(d => d.id).join(' ⟷ ')}` : `${docs[0].file} — ${docs[0].title}`;
    $('#docvStage').innerHTML = docs.map(d => docHTML(d, compare)).join('');
    $('#docv').hidden = false; $('#lens').hidden = true;
    document.querySelectorAll('#docvStage .photo').forEach(ph => FX.evidence(ph.querySelector('canvas'), ph.dataset.photo, ph.closest('.doc').dataset.docid));
    applyDV(); BVAudio.click(); App.setThreat(Math.max(...docs.map(d => d.threat)), true);
    setTimeout(() => $('#docv .close').focus(), 50);
    docs.forEach(d => Story.view(d.id, d.id + ' ' + d.title, { veil: true, grants: [] }));
    if (compare) {
      const shared = BV.signatures.filter(sig => docs.every(d => d.body.join(' ').toLowerCase().includes(sig.toLowerCase())));
      if (shared.length) { FX.toast('SIGNATURE MATCH — ' + shared.join(' · ')); Story.discover('compare'); }
      else FX.toast('NO SHARED SIGNATURE ON THE SURFACE. TRY UV.');
    }
    return true;
  };
  V.closeDoc = function () { $('#docv').hidden = true; $('#lens').hidden = true; App.restoreThreat(); lastFocus && lastFocus.focus && lastFocus.focus(); V.renderFiles(); };

  V.bindDocViewer = function () {
    $('#docv .docv-tools').addEventListener('click', e => {
      const b = e.target.closest('[data-act]'); if (!b) return; const a = b.dataset.act; BVAudio.click();
      if (a === 'zoomin') DV.zoom = Math.min(2.4, DV.zoom + .15);
      if (a === 'zoomout') DV.zoom = Math.max(.5, DV.zoom - .15);
      if (a === 'rotl') DV.rot -= 90; if (a === 'rotr') DV.rot += 90;
      if (a === 'uv') { DV.uv = !DV.uv; if (DV.uv) { Story.discover('uv'); const hidden = [...document.querySelectorAll('#docvStage [data-uv]')].map(s => s.textContent); if (hidden.length) Story.log('UV REVEALED: ' + hidden[0].slice(0, 40)); } }
      if (a === 'lens') { DV.lens = !DV.lens; $('#lens').hidden = !DV.lens; }
      if (a === 'decrypt') decryptAll();
      if (a === 'close') return V.closeDoc();
      applyDV();
    });
    $('#docvStage').addEventListener('wheel', e => { if (!e.ctrlKey) return; e.preventDefault(); DV.zoom = Math.max(.5, Math.min(2.4, DV.zoom - Math.sign(e.deltaY) * .1)); applyDV(); }, { passive: false });
    $('#docvStage').addEventListener('click', e => {
      const ph = e.target.closest('.photo'); if (ph) { const z = document.createElement('div'); z.className = 'photo-zoom'; const c = document.createElement('canvas'); c.width = 900; c.height = 640; z.appendChild(c); FX.evidence(c, ph.dataset.photo, ph.closest('.doc').dataset.docid); z.onclick = () => z.remove(); document.body.appendChild(z); return; }
      const enc = e.target.closest('[data-enc]'); if (enc) decryptOne(enc);
    });
    // magnifier lens
    const lens = $('#lens');
    $('#docv').addEventListener('pointermove', e => {
      if (!DV.lens) return; const doc = e.target.closest('.doc'); if (!doc) { lens.style.opacity = 0; return; }
      lens.style.opacity = 1; lens.style.left = (e.clientX - 90) + 'px'; lens.style.top = (e.clientY - 90) + 'px';
      const r = doc.getBoundingClientRect(), Z = 2.2;
      if (!lens.firstChild || lens.firstChild.dataset.src !== doc.dataset.docid) { lens.innerHTML = ''; const c = doc.cloneNode(true); c.style.animation = 'none'; c.dataset.src = doc.dataset.docid; const w = document.createElement('div'); w.dataset.src = doc.dataset.docid; w.appendChild(c); lens.appendChild(w); c.querySelectorAll('canvas').forEach((cv, i) => cv.getContext('2d').drawImage(doc.querySelectorAll('canvas')[i], 0, 0)); }
      const w = lens.firstChild; w.style.width = (r.width / DV.zoom) + 'px';
      w.firstChild.style.transform = 'none'; w.firstChild.classList.toggle('uv-on', DV.uv);
      w.style.transform = `translate(${-(e.clientX - r.left) / DV.zoom * Z + 90}px, ${-(e.clientY - r.top) / DV.zoom * Z + 90}px) scale(${Z})`;
    });
  };
  function decryptOne(el) {
    if (el.classList.contains('open')) return;
    const need = el.dataset.need;
    if (el.classList.contains('locked')) { FX.toast(need); BVAudio.beep(200, .15, .05, 'sawtooth'); el.animate([{ transform: 'translateX(-4px)' }, { transform: 'translateX(4px)' }, { transform: 'none' }], { duration: 250 }); return; }
    el.classList.add('open'); BVAudio.beep(900, .05, .03); FX.scramble(el, el.dataset.plain, 900);
    Story.log('DECRYPTED SECTION IN ' + el.closest('.doc').dataset.docid);
  }
  function decryptAll() {
    const all = [...document.querySelectorAll('#docvStage [data-enc]:not(.open)')];
    if (!all.length) { FX.toast('NO ENCRYPTED SECTIONS REMAINING'); return; }
    const can = all.filter(e => !e.classList.contains('locked'));
    can.forEach((e, i) => setTimeout(() => decryptOne(e), i * 300));
    const lockedN = all.length - can.length;
    if (lockedN) FX.toast(`${lockedN} SECTION${lockedN > 1 ? 'S REQUIRE' : ' REQUIRES'} A CROSS-REFERENCE KEY FROM ANOTHER FILE`);
  }

  V.openRef = function (ref) { return App.openAny(ref); };
  window.Views = V;
})();
