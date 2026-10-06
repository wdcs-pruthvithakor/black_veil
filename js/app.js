/* BLACK VEIL — boot sequence, navigation, wiring */
(function () {
  const $ = s => document.querySelector(s);
  const App = { view: 'map', rendered: {} };
  window.App = App;
  Story.load();

  /* ------------------------------------------------------------ threat */
  App.setThreat = function (lvl) {
    lvl = Math.max(1, Math.min(5, lvl | 0));
    document.body.dataset.threat = lvl;
    $('#threatName').textContent = BV.threat[lvl].name;
    if (lvl === 5) BVAudio.alarm(1);
  };
  App.restoreThreat = function () {
    if (!$('#docv').hidden || !$('#inv').hidden) return;
    App.setThreat(Story.S.ending === 'look' ? 2 : 1);
  };

  /* ------------------------------------------------------------ meta / progress */
  App.refreshMeta = function () {
    const st = Story.stage();
    document.querySelectorAll('#progress li').forEach((li, i) => { li.classList.toggle('done', i < st); li.classList.toggle('now', i === st); });
    $('#accessLvl').textContent = Story.access();
    $('#integrity').textContent = ['98.2%', '91.7%', '83.0%', '61.4%', '17.0%'][st];
    const sig = document.querySelectorAll('#sigBars i'); sig.forEach((b, i) => b.classList.toggle('off', i >= 5 - Math.min(3, st)));
    const keys = Story.S.keys; $('#railKeys').innerHTML = keys.length ? keys.map(k => `<li>${FX.esc(k)}</li>`).join('') : '<li class="none">NONE</li>';
    if (App.rendered.archive) Views.renderDisc();
  };

  App.renderAll = function () {
    Views.renderSiteList(); Views.renderResearch(); Views.renderFiles(); Views.renderIncidents();
    if (App.rendered.archive) Views.renderArchive($('#arcSearch').value);
  };

  App.titleOf = function (id) {
    const s = Views.site(id); if (s) return s.name;
    const p = Views.proj(id); if (p) return p.codename;
    const d = Views.docOf(id); if (d) return d.id;
    const a = BV.anomalies.find(x => x.id === id); if (a) return a.title;
    const sp = BV.specimens.find(x => x.id === id); if (sp) return sp.id;
    return null;
  };

  App.openAny = function (id) {
    if (!id) return false;
    if (/^U-/.test(id)) { Views.openUnx(id); return true; }
    if (Views.site(id)) { if (Views.site(id).type === 'hidden' && !Story.S.zero) return false; return Views.openSite(id); }
    if (Views.proj(id)) { if (Views.proj(id).secret && !Story.S.correlation) return false; return Views.openProject(id); }
    if (Views.docOf(id)) return Views.openDoc(id);
    if (BV.specimens.find(x => x.id === id)) return Views.openSpecimen(id);
    if (BV.anomalies.find(x => x.id === id)) return Views.openAnomaly(id);
    return false;
  };

  /* ------------------------------------------------------------ views */
  const CAM = { map: 'CAM 01 // GLOBAL', research: 'CAM 02 // RESEARCH', biohazard: 'CAM 03 // BSL-4', facilities: 'SAT 04 // ORBITAL', anomalies: 'CAM 05 // ANOMALY', unexplained: 'ARCHIVE 06 // PUBLIC', files: 'VAULT 07 // FILES', incidents: 'CAM 08 // INCIDENT', timeline: 'CAM 09 // CHRONO', archive: 'ARCHIVE 10', monitor: 'LIVE 11 // MONITOR' };
  App.go = function (v, quiet) {
    if (!document.querySelector(`.view[data-view="${v}"]`)) return;
    if (v !== App.view && !quiet) FX.cut(CAM[v]);
    App.view = v;
    document.querySelectorAll('.view').forEach(s => s.classList.toggle('active', s.dataset.view === v));
    document.querySelectorAll('#deptList button').forEach(b => { const on = b.dataset.view === v; b.classList.toggle('active', on); on ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'); });
    $('#dept').classList.remove('open'); $('#deptToggle').setAttribute('aria-expanded', 'false');
    // lazy renders
    if (!App.rendered[v]) {
      App.rendered[v] = true;
      ({ biohazard: () => { Views.renderBio(); Views.sim.init(); }, facilities: Views.renderFacilities, anomalies: Views.renderAnomalies, unexplained: Views.renderUnexplained,
        timeline: () => { Views.renderTimeline(); Views.selectTl(BV.timeline.findIndex(e => e.y === 1968)); }, archive: () => { Views.renderArchive(); Views.renderDisc(); } }[v] || (() => {}))();
    }
    v === 'map' ? Globe.start() : Globe.stop();
    v === 'monitor' ? Monitor.start() : Monitor.stop();
    if (v !== 'biohazard') Views.sim.stop && Views.sim.stop();
    if (!quiet) { BVAudio.click(); Story.log('ACCESS DEPT ' + v.toUpperCase()); }
    const h = document.querySelector(`.view[data-view="${v}"] h2`); if (h && !quiet) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
    if (window.innerWidth <= 720) window.scrollTo(0, 0);
  };

  /* ------------------------------------------------------------ boot */
  function cctv() {
    const cv = $('#cctv'); let world = null, raf = 0, on = true;
    const draw = now => {
      if (!on) return; raf = requestAnimationFrame(draw);
      const { w, h } = FX.fit(cv, 1), c = cv.getContext('2d'), t = now / 1000;
      if (!world || world.width !== w) {
        world = document.createElement('canvas'); world.width = w; world.height = h;
        const wc = world.getContext('2d'); wc.fillStyle = '#030405'; wc.fillRect(0, 0, w, h);
        const mh = w / 2, oy = (h - mh) / 2;
        wc.translate(0, oy); FX.drawWorld(wc, w, mh, { stroke: 'rgba(170,190,200,.35)', fill: 'rgba(140,160,170,.06)', grid: true });
        world.oy = oy; world.mh = mh;
      }
      const jx = (Math.random() < .04 ? (Math.random() - .5) * 14 : 0);
      c.drawImage(world, jx, 0);
      BV.sites.filter(s => s.type === 'facility').forEach((s, i) => {
        const [x, y] = FX.proj(s.lat, s.lon, w, world.mh), k = (t * .6 + i * .37) % 1;
        c.fillStyle = '#d0212a'; c.beginPath(); c.arc(x + jx, y + world.oy, 3, 0, 7); c.fill();
        c.strokeStyle = `rgba(208,33,42,${1 - k})`; c.beginPath(); c.arc(x + jx, y + world.oy, 4 + k * 22, 0, 7); c.stroke();
      });
      // VHS tracking band & noise lines
      const by = (t * 60) % (h + 120) - 60; c.fillStyle = 'rgba(255,255,255,.04)'; c.fillRect(0, by, w, 30);
      for (let i = 0; i < 6; i++) { c.fillStyle = `rgba(255,255,255,${Math.random() * .08})`; c.fillRect(0, Math.random() * h, w, 1); }
      const ft = $('#feedTime'); if (ft) ft.textContent = new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC';
    };
    raf = requestAnimationFrame(draw);
    return () => { on = false; cancelAnimationFrame(raf); };
  }

  let stopCctv = null;
  async function boot() {
    const term = $('#bootTerm');
    await FX.sleep(700);
    await FX.typeLine(term, 'CONNECTING TO BLACK VEIL NETWORK...', '', 38);
    await FX.sleep(900);
    await FX.typeLine(term, 'ENCRYPTED CONNECTION ESTABLISHED', 'ok', 26);
    await FX.sleep(500);
    if (Story.S.viewed.length) { await FX.typeLine(term, `RETURNING SESSION DETECTED — ${Story.S.viewed.length} FILES PREVIOUSLY OPENED`, 'warn', 16); await FX.sleep(300); }
    await FX.typeLine(term, 'ACCESS LEVEL: UNKNOWN', 'bad', 40);
    await FX.sleep(600);
    $('#bootFeed').classList.add('on'); stopCctv = cctv();
    await FX.sleep(1600);
    $('#bootTitle').classList.add('on');
    setTimeout(() => $('#enterBtn').focus({ preventScroll: true }), 400);
  }

  async function enter() {
    BVAudio.click(); FX.cut('AUTH'); document.body.dataset.stage = 'loading';
    $('#boot').hidden = true; stopCctv && stopCctv(); $('#loader').hidden = false;
    $('#ldId').textContent = 'BV-' + Math.random().toString(16).slice(2, 10).toUpperCase();
    // radar spinner
    const rc = $('#ldRadar'), rx = rc.getContext('2d'); let a = 0, spin = true;
    (function r() { if (!spin) return; a += .06; rx.fillStyle = 'rgba(0,0,0,.18)'; rx.fillRect(0, 0, 260, 260); rx.strokeStyle = 'rgba(208,33,42,.35)';
      [40, 80, 120].forEach(R => { rx.beginPath(); rx.arc(130, 130, R, 0, 7); rx.stroke(); });
      rx.strokeStyle = '#d0212a'; rx.lineWidth = 2; rx.beginPath(); rx.moveTo(130, 130); rx.lineTo(130 + Math.cos(a) * 120, 130 + Math.sin(a) * 120); rx.stroke(); rx.lineWidth = 1;
      if (Math.random() < .1) { rx.fillStyle = '#ff6b6b'; rx.fillRect(130 + Math.cos(a) * Math.random() * 120, 130 + Math.sin(a) * Math.random() * 120, 3, 3); }
      requestAnimationFrame(r); })();
    // build globe during the sequence
    setTimeout(() => Globe.init($('#globe'), s => Views.openSite(s.id), Views.tip), 50);
    const steps = ['AUTHENTICATING HANDSHAKE', 'DECRYPTING GLOBAL ANOMALY INDEX', `MOUNTING ${BV.sites.filter(s => s.type === 'facility').length} FACILITY FEEDS`, 'LOADING SPECIMEN REGISTRY', 'VERIFYING DATA INTEGRITY', 'ACCESS GRANTED'];
    const ol = $('#ldSteps');
    for (let i = 0; i < steps.length; i++) {
      const li = document.createElement('li'); ol.appendChild(li); await FX.scramble(li, steps[i], 260);
      await FX.sleep(220 + Math.random() * 260);
      li.innerHTML = FX.esc(steps[i]) + `<span>${i === steps.length - 1 ? 'LEVEL 1' : 'OK'}</span>`;
      $('#ldBar').style.width = ((i + 1) / steps.length * 100) + '%'; BVAudio.beep(1200 + i * 120, .04, .02);
    }
    await FX.sleep(450); spin = false;
    $('#loader').hidden = true; const app = $('#app'); app.hidden = false; app.classList.add('crt-on');
    document.body.dataset.stage = 'app';
    setTimeout(() => app.classList.remove('crt-on'), 1000);
    startApp();
  }

  /* ------------------------------------------------------------ app start */
  function startApp() {
    Views.renderThreatLegend(); App.renderAll(); Monitor.init(); Views.bindDocViewer(); FX.tilt(document.getElementById('main'));
    document.querySelectorAll('#deptList button').forEach(b => b.title = b.textContent.replace(/^\d+/, '').trim());
    App.go('map', true); App.refreshMeta();
    if (Story.S.correlation) Globe.connect(BV.sites.filter(s => s.type === 'facility').map(s => s.id));
    if (Story.S.zero) Globe.revealNull();
    $('#railLog').innerHTML = Story.S.log.slice(0, 30).map(t => `<li><b>${t.slice(0, 8)}</b> ${FX.esc(t.slice(9))}</li>`).join('');
    Story.log('SESSION OPENED · ACCESS ' + Story.access());
    Story.bindSecrets();
    setInterval(clock, 1000); clock(); ticker();
    if (!Story.S.viewed.length) setTimeout(() => FX.toast('SELECT A SIGNAL ON THE MAP TO BEGIN YOUR INVESTIGATION'), 1500);
  }
  function clock() { $('#utc').textContent = new Date().toISOString().slice(11, 19); }
  function ticker() {
    const items = [
      ['ARCHIVE ID', 'BV-00317'], ['SIGNAL STRENGTH', '-71 dBm'], ['LAST TRANSMISSION', '03:17:42 UTC'], ['CONTAINMENT', 'KASAI — FAILURE'],
      ['SPECIMEN STATUS', 'VX-17 MISSING'], ['THREAT INDEX', 'ELEVATED'], ['SECURITY LEVEL', 'TIER 4'], ['DATA INTEGRITY', 'DEGRADING'],
      ['ENCRYPTED', 'AES-VEIL/512'], ['ACCESS LOG', 'SESSION #00317'], ['OCEAN', 'DEEP NODE LISTENING'], ['NOTICE', 'FICTIONAL FILES ARE LABELLED CLASSIFIED-STYLE FICTION']
    ];
    $('#tickerInner').innerHTML = items.concat(items).map(([k, v]) => `<span>${k} <b>${v}</b></span>`).join('');
  }

  /* ------------------------------------------------------------ events */
  function bind() {
    $('#enterBtn').addEventListener('click', enter);
    $('#soundToggle').addEventListener('click', () => {
      const on = BVAudio.toggle(); $('#soundToggle').setAttribute('aria-pressed', on); $('#soundState').textContent = on ? 'ON' : 'OFF';
      if (on) BVAudio.click();
    });
    $('#deptList').addEventListener('click', e => { const b = e.target.closest('[data-view]'); if (b) App.go(b.dataset.view); });
    $('#deptToggle').addEventListener('click', () => { const o = $('#dept').classList.toggle('open'); $('#deptToggle').setAttribute('aria-expanded', o); });
    $('#logo').addEventListener('click', () => App.go('map'));
    $('#termBtn').addEventListener('click', () => Story.T.open());
    $('#termForm').addEventListener('submit', e => { e.preventDefault(); const i = $('#termInput'); Story.T.run(i.value); i.value = ''; });
    $('#zIn').onclick = () => Globe.zoom(.85); $('#zOut').onclick = () => Globe.zoom(1.18); $('#zReset').onclick = () => Globe.reset();
    const lay = () => Globe.setLayers({ fic: $('#lyrFic').checked, doc: $('#lyrDoc').checked });
    $('#lyrFic').onchange = lay; $('#lyrDoc').onchange = lay;
    $('#arcSearch').addEventListener('input', e => Views.renderArchive(e.target.value));
    $('#purgeBtn').addEventListener('click', () => { if (confirm('Purge this session? All discoveries will be erased.')) Story.purge(); });
    $('#compareBtn').addEventListener('click', () => {
      const c = Views.compare; c.on = !c.on; c.pick = [];
      $('#compareBtn').setAttribute('aria-pressed', c.on); $('#compareHint').textContent = c.on ? 'SELECT TWO FILES' : '';
      Views.renderFiles();
    });

    document.addEventListener('click', e => {
      const t = e.target;
      const closeEl = t.closest('[data-close]'); if (closeEl && closeEl.closest('#inv')) return Views.closeInv();
      const g = (sel, fn) => { const el = t.closest(sel); if (el) { fn(el); return true; } return false; };
      if (g('[data-open-site]', el => el.dataset.openSite && Views.openSite(el.dataset.openSite))) return;
      if (g('[data-open-proj]', el => Views.openProject(el.dataset.openProj))) return;
      if (g('[data-doc]', el => {
        const c = Views.compare;
        if (c.on && el.closest('#filesGrid')) {
          const id = el.dataset.doc; c.pick = c.pick.includes(id) ? c.pick.filter(x => x !== id) : c.pick.concat(id).slice(-2);
          Views.renderFiles(); $('#compareHint').textContent = `${c.pick.length} / 2 SELECTED`;
          if (c.pick.length === 2) { Views.openDoc(c.pick); c.pick = []; }
        } else Views.openDoc(el.dataset.doc);
      })) return;
      if (g('[data-spec]', el => Views.openSpecimen(el.dataset.spec))) return;
      if (g('[data-anom]', el => Views.openAnomaly(el.dataset.anom))) return;
      if (g('[data-any]', el => App.openAny(el.dataset.any))) return;
      if (g('[data-ref]', el => App.openAny(el.dataset.ref))) return;
      if (g('[data-unx]', el => { const box = el.parentElement, o = box.classList.toggle('open'); el.setAttribute('aria-expanded', o); if (o) Story.log('READ PUBLIC RECORD ' + el.querySelector('h3').textContent.toUpperCase()); BVAudio.click(); })) return;
      if (g('[data-lv]', el => {
        const lv = +el.dataset.lv; App.setThreat(lv); FX.toast(`PREVIEW — LEVEL 0${lv} ${BV.threat[lv].name}`);
        clearTimeout(App._lvT); App._lvT = setTimeout(App.restoreThreat, 3000);
      })) return;
    });
    // research filter (separate so it can re-render)
    $('#researchFilters').addEventListener('click', e => { const b = e.target.closest('[data-rf]'); if (!b) return; Views.setFilter(b.dataset.rf); });
    // incident rows keyboard
    $('#incTable').addEventListener('keydown', e => { if (e.key === 'Enter') { const r = e.target.closest('[data-open-site]'); r && r.dataset.openSite && Views.openSite(r.dataset.openSite); } });

    document.addEventListener('keydown', e => {
      const typing = /INPUT|TEXTAREA/.test(document.activeElement.tagName);
      if (e.key === 'Escape') {
        if (!$('#term').hidden) return Story.T.close();
        if (document.querySelector('.photo-zoom')) return document.querySelector('.photo-zoom').remove();
        if (!$('#docv').hidden) return Views.closeDoc();
        if (!$('#inv').hidden) return Views.closeInv();
        if (!$('#overlay').hidden && !$('#overlay').classList.contains('final')) return Story.closeOverlay();
      }
      if (typing) return;
      if (e.key === '`' || e.key === '~') { e.preventDefault(); $('#term').hidden ? Story.T.open() : Story.T.close(); }
      if ((e.key === 'm' || e.key === 'M') && document.body.dataset.stage !== 'boot') $('#soundToggle').click();
      if (!$('#docv').hidden) {
        if (e.key === '+' || e.key === '=') document.querySelector('[data-act="zoomin"]').click();
        if (e.key === '-') document.querySelector('[data-act="zoomout"]').click();
        if (e.key === 'r' || e.key === 'R') document.querySelector('[data-act="rotr"]').click();
        if (e.key === 'u' || e.key === 'U') document.querySelector('[data-act="uv"]').click();
      }
    });

    // hover blips on interactive elements
    document.addEventListener('pointerover', e => { if (e.pointerType === 'mouse' && e.target.closest('.btn, .card, #deptList button, .folder')) BVAudio.hover(); });
  }

  // research filter: toggles card visibility without re-rendering
  Views.setFilter = function (f) {
    const btns = document.querySelectorAll('#researchFilters button');
    btns.forEach(b => b.classList.toggle('on', b.dataset.rf === f));
    document.querySelectorAll('#researchGrid .card').forEach(c => {
      const p = Views.proj(c.dataset.openProj);
      const show = f === 'ALL' || (f === 'SEALED' ? (p.locked && !Story.S.zero) : p.status.startsWith(f));
      c.hidden = !show;
    });
    BVAudio.click();
  };

  bind();
  if (FX.reduced) document.body.classList.add('reduce-motion');
  boot();
})();
