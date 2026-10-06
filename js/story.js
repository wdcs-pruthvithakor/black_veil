/* BLACK VEIL — investigation state, hidden narrative, secrets & terminal */
(function () {
  const KEY = 'bv-state-v1';
  const S = {
    viewed: [], keys: [], disc: [], log: [],
    correlation: false, zero: false, nullFound: false, ending: null, started: Date.now()
  };
  const Story = { S };

  const DISCOVERIES = {
    first: 'FIRST FILE OPENED',
    correlation: 'CORRELATION DETECTED',
    morse: 'ECHO TRANSMISSION DECODED',
    zero: 'PROJECT ZERO DECRYPTED',
    ghost: 'INVISIBLE COORDINATES',
    dotfile: 'HIDDEN TERMINAL FILE',
    konami: 'OBSERVER MODE',
    personnel: 'ARCHIVE 0 — PERSONNEL FILE',
    uv: 'UV INSPECTION',
    compare: 'SIGNATURE MATCH',
    lantern: 'PROJECT LANTERN',
    null: 'SITE NULL',
    end_seal: 'ENDING — SEALED',
    end_look: 'ENDING — OBSERVED',
    hour: 'THE 03:17 HOUR'
  };
  Story.DISCOVERIES = DISCOVERIES;

  Story.load = function () {
    try { const raw = localStorage.getItem(KEY); if (raw) Object.assign(S, JSON.parse(raw)); } catch (e) { /* storage unavailable: run stateless */ }
  };
  Story.save = function () { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };
  Story.purge = function () { try { localStorage.removeItem(KEY); } catch (e) {} location.reload(); };

  const utc = () => new Date().toISOString().slice(11, 19);
  Story.log = function (msg) {
    S.log.unshift(`${utc()} ${msg}`); S.log = S.log.slice(0, 80); Story.save();
    const mk = t => { const li = document.createElement('li'); li.innerHTML = `<b>${t.slice(0, 8)}</b> ${FX.esc(t.slice(9))}`; return li; };
    ['railLog', 'accessLog'].forEach(id => { const ol = document.getElementById(id); if (!ol) return; ol.prepend(mk(S.log[0])); while (ol.children.length > 40) ol.lastChild.remove(); });
  };
  Story.has = k => S.keys.includes(k);
  Story.seen = id => S.viewed.includes(id);

  Story.discover = function (id, quiet) {
    if (S.disc.includes(id)) return false;
    S.disc.push(id); Story.save(); Story.log('DISCOVERY // ' + DISCOVERIES[id]);
    if (!quiet) FX.toast('◆ DISCOVERY — ' + DISCOVERIES[id]);
    App.refreshMeta(); return true;
  };

  /* every opened file passes through here */
  Story.view = function (id, title, opts = {}) {
    const first = !S.viewed.includes(id);
    if (first) S.viewed.push(id);
    (opts.grants || []).forEach(k => { if (!S.keys.includes(k)) { S.keys.push(k); if (first) setTimeout(() => FX.toast('CLEARANCE KEY ACQUIRED — ' + k), 900); } });
    Story.log('OPEN ' + title);
    Story.discover('first', true);
    Story.save(); App.refreshMeta();
    if (opts.veil && !S.correlation) {
      const n = Story.veilCount();
      if (n >= 5) setTimeout(Story.correlate, 1400);
      else if (n === 3) setTimeout(() => FX.toast('PATTERN ANALYSIS — 3 / 5 SIGNATURES MATCHED'), 1200);
    }
  };
  Story.veilCount = function () {
    const veilIds = new Set([...BV.sites, ...BV.projects, ...BV.documents, ...BV.anomalies].filter(x => x.veil || x.label === 'CSF').map(x => x.id));
    return S.viewed.filter(id => veilIds.has(id)).length;
  };

  Story.stage = function () {
    if (S.nullFound || S.ending) return 4;
    if (S.zero) return 3;
    if (S.correlation) return 2;
    if (S.viewed.length >= 3) return 1;
    return 0;
  };
  Story.access = function () {
    return ['LEVEL 1', 'LEVEL 2', 'LEVEL 3', 'VEIL', S.ending === 'look' ? 'OBSERVED' : 'NULL'][Story.stage()];
  };

  /* ---------------------------------------------------- overlays */
  const ov = () => document.getElementById('overlay');
  function openOverlay(html, cls = '') {
    const o = ov(); o.className = 'overlay ' + cls; o.innerHTML = html; o.hidden = false;
    const f = o.querySelector('button'); f && setTimeout(() => f.focus(), 50);
    return o;
  }
  Story.closeOverlay = () => { const o = ov(); o.hidden = true; o.innerHTML = ''; };

  Story.correlate = function () {
    if (S.correlation) return;
    S.correlation = true; Story.save(); Story.discover('correlation', true);
    BVAudio.alarm(2); FX.flash();
    const items = S.viewed.map(id => App.titleOf(id)).filter(Boolean).slice(0, 9);
    const W = window.innerWidth, H = window.innerHeight, cx = W / 2, cy = H / 2, R = Math.min(W, H) * .36;
    const pos = items.map((t, i) => { const a = i / items.length * Math.PI * 2 - Math.PI / 2; return [cx + Math.cos(a) * R, cy + Math.sin(a) * R * .8]; });
    let lines = '';
    pos.forEach((p, i) => pos.forEach((q, j) => { if (j > i) lines += `<line x1="${p[0]}" y1="${p[1]}" x2="${q[0]}" y2="${q[1]}" stroke="#d0212a" stroke-width="1" opacity=".55" stroke-dasharray="1200" stroke-dashoffset="1200"><animate attributeName="stroke-dashoffset" to="0" dur="${1 + (i + j) * .15}s" fill="freeze"/></line>`; }));
    pos.forEach((p, i) => { lines += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="#d0212a"/><text x="${p[0]}" y="${p[1] - 12}" fill="#c9d1d6" font-family="JetBrains Mono" font-size="10" text-anchor="middle" letter-spacing="1.5">${FX.esc(items[i])}</text>`; });
    const o = openOverlay(`<svg class="lines" aria-hidden="true">${lines}</svg>
      <div class="ov-inner"><p class="ov-k">CORRELATION DETECTED</p><h2 class="scramble" id="corrH">THE INCIDENTS ARE CONNECTED.</h2>
      <p>Every file you opened shares the same signature: <b>03:17:42 UTC</b>, the ratio <b>3 : 17 : 42</b>, a delay of <b>seventeen seconds</b>. Different divisions gave it different names.</p>
      <p class="mono" style="font-size:12px;letter-spacing:.14em;color:var(--red)">NEW FILE UNLOCKED: THE BLACK VEIL PROTOCOL · HIDDEN PROJECT INDEXED</p>
      <div class="ov-actions"><button class="btn" id="ovGoFiles">OPEN CLASSIFIED FILES</button><button class="btn ghost" id="ovGoMap">VIEW ON GLOBAL MAP</button></div></div>`);
    FX.scramble(o.querySelector('#corrH'), 'THE INCIDENTS ARE CONNECTED.', 1600);
    o.querySelector('#ovGoFiles').onclick = () => { Story.closeOverlay(); App.go('files'); };
    o.querySelector('#ovGoMap').onclick = () => { Story.closeOverlay(); App.go('map'); };
    Globe.connect(BV.sites.filter(s => s.type === 'facility').map(s => s.id));
    App.renderAll(); App.refreshMeta();
  };

  Story.tryZero = function (phrase) {
    const ok = String(phrase).trim().toUpperCase().replace(/\s+/g, '') === 'THRESHOLD';
    if (ok && !S.zero) {
      S.zero = true; if (!S.keys.includes('ZERO')) S.keys.push('ZERO'); Story.save();
      Story.discover('zero'); BVAudio.drop(); FX.flash();
      Story.log('PROJECT ZERO DECRYPTED');
      Globe.revealNull(); App.renderAll(); App.refreshMeta();
    }
    return ok;
  };

  Story.findNull = function () {
    Globe.revealNull(); Story.discover('null', true);
    const first = !S.nullFound; S.nullFound = true; Story.save(); App.refreshMeta();
    App.setThreat(5); BVAudio.alarm(3); BVAudio.drop(); FX.flash();
    const lines = [
      'TRACE COMPLETE.',
      'Correlating: FACILITY 07 · OMEGA · BLACK SITE 12 · DEEP NODE · ORPHEUS · KASAI · VERDANT-9 · CAIRN · HADAL-4',
      '',
      'Each division filed its own report. A signal. An organism. A pulse. An answer. A dream.',
      'Every instrument we built to watch it became one more way for it to watch us.',
      '',
    ];
    const o = openOverlay(`<div class="ov-inner"><p class="ov-k">SITE NULL // -48.88 -123.39</p><div class="typed" id="nullTyped"></div>
      <h2 id="nullH1" style="opacity:0;margin-top:26px">THEY WERE NEVER INVESTIGATING DIFFERENT INCIDENTS.</h2>
      <h2 id="nullH2" style="opacity:0;color:var(--red);margin-top:10px">THEY WERE INVESTIGATING THE SAME THING.</h2>
      <div class="ov-actions" id="nullAct" style="opacity:0"><button class="btn danger" id="endSeal">SEAL THE ARCHIVE</button><button class="btn" id="endLook">KEEP LOOKING</button></div>
      <p class="mono dim" style="font-size:10px;letter-spacing:.14em;margin-top:22px">CLASSIFIED-STYLE FICTION</p></div>`, 'final');
    (async () => {
      const box = o.querySelector('#nullTyped');
      for (const l of lines) { await FX.typeLine(box, FX.esc(l) || '&nbsp;', '', 18); }
      for (const id of ['nullH1', 'nullH2', 'nullAct']) { await FX.sleep(900); const el = o.querySelector('#' + id); el.style.transition = 'opacity 1.4s'; el.style.opacity = 1; if (id !== 'nullAct') BVAudio.drop(); }
      o.querySelector('#endSeal').onclick = () => Story.ending('seal');
      o.querySelector('#endLook').onclick = () => Story.ending('look');
      o.querySelector('#endSeal').focus();
    })();
    if (first) Story.log('SITE NULL TRACED');
  };

  Story.ending = function (which) {
    S.ending = which; Story.save(); Story.discover(which === 'seal' ? 'end_seal' : 'end_look', true);
    if (which === 'seal') {
      App.setThreat(1);
      const o = openOverlay(`<div class="ov-inner"><p class="ov-k" style="color:var(--blue)">ARCHIVE SEALED</p><h2>OBSERVATION CEASED.</h2>
        <p>All instruments are powered down. For the first time since 1947, the carrier tone at Facility 07 stops.</p>
        <p class="mono" id="sealAfter" style="opacity:0;transition:opacity 2s;color:var(--red);font-size:12px;letter-spacing:.18em">03:17:42 UTC — 1 NEW SESSION CONNECTED</p>
        <div class="ov-actions"><button class="btn" id="ovClose">RETURN TO ARCHIVE</button></div></div>`);
      setTimeout(() => { const e = o.querySelector('#sealAfter'); if (e) e.style.opacity = 1; BVAudio.beep(680, .3, .05, 'sine'); }, 4200);
      o.querySelector('#ovClose').onclick = () => { Story.closeOverlay(); App.restoreThreat(); };
    } else {
      App.setThreat(5);
      const o = openOverlay(`<div class="ov-inner"><p class="ov-k">ACCESS LEVEL: OBSERVED</p><h2>YOU KEPT LOOKING.</h2>
        <p>Every instrument at every site is now pointed at this terminal. The lattice is forming in the pixels of your screen at a ratio of 3 : 17 : 42.</p>
        <p>It is not hiding from us. It is learning how we look.</p>
        <div class="ov-actions"><button class="btn danger" id="ovClose">LOOK AWAY</button></div></div>`);
      o.querySelector('#ovClose').onclick = () => { Story.closeOverlay(); App.restoreThreat(); };
    }
    App.refreshMeta();
  };

  /* personnel file: the archive watching you */
  Story.personnel = function () {
    Story.discover('personnel', true);
    const mins = Math.max(1, Math.round((Date.now() - S.started) / 60000));
    const o = openOverlay(`<div class="ov-inner" style="text-align:left"><p class="ov-k">ARCHIVE 0 // PERSONNEL FILE</p><h2>SUBJECT: YOU</h2>
      <p class="mono" style="font-size:12px;line-height:1.9;color:var(--text)">SESSION #00317<br>TIME IN ARCHIVE: ${mins} MIN<br>FILES OPENED: ${S.viewed.length}<br>DISPLAY: ${screen.width}×${screen.height}<br>LOCAL TIME: ${new Date().toLocaleTimeString()}<br>
      STATUS: ${S.correlation ? 'AWARE OF PATTERN' : 'UNAWARE'}<br>ASSESSMENT: Subject reads closely. Subject clicks things that are not buttons.</p>
      <p class="mono dim" style="font-size:11px">LAST 6 ACTIONS:<br>${S.log.slice(0, 6).map(FX.esc).join('<br>')}</p>
      <p class="mono" style="font-size:10px;color:var(--text-faint)">Nothing here leaves your browser. It is still unsettling, isn't it.</p>
      <div class="ov-actions" style="justify-content:flex-start"><button class="btn" id="ovClose">CLOSE FILE</button></div></div>`);
    o.querySelector('#ovClose').onclick = Story.closeOverlay;
  };

  /* ---------------------------------------------------- secrets wiring */
  Story.bindSecrets = function () {
    // Konami
    const seq = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']; let k = 0;
    document.addEventListener('keydown', e => {
      k = (e.key === seq[k] || e.key.toLowerCase() === seq[k]) ? k + 1 : (e.key === seq[0] ? 1 : 0);
      if (k === seq.length) { k = 0; Story.discover('konami'); App.setThreat(4); FX.cut('OBSERVER'); FX.toast('OBSERVER MODE — YOU ARE NOW VISIBLE TO THE ARCHIVE'); setTimeout(App.restoreThreat, 7000); }
    });
    // logo ×7
    let clicks = 0, ct = 0;
    document.getElementById('logo').addEventListener('click', () => {
      clicks = (Date.now() - ct < 900) ? clicks + 1 : 1; ct = Date.now();
      if (clicks === 7) { clicks = 0; Story.personnel(); }
    });
    // invisible coordinates
    document.getElementById('ghostCoords').addEventListener('click', () => {
      Story.discover('ghost');
      if (S.zero) Story.findNull(); else FX.toast('COORDINATES LOGGED: -48.88 / -123.39 — NO SITE ON RECORD');
    });
    // idle
    let idle; const reset = () => { clearTimeout(idle); idle = setTimeout(() => { if (!document.getElementById('app').hidden) { FX.cut('CAM ??'); FX.toast('ARE YOU STILL THERE?  — WE ARE.'); } }, 120000); };
    ['pointermove', 'keydown', 'wheel', 'touchstart'].forEach(ev => document.addEventListener(ev, reset, { passive: true })); reset();
    // the 03:17 hour
    setInterval(() => { const d = new Date(); if (d.getUTCHours() === 3 && d.getUTCMinutes() === 17 && Story.discover('hour')) { FX.flash(); BVAudio.alarm(2); } }, 15000);
  };

  /* ---------------------------------------------------- terminal */
  const T = {};
  T.out = (txt, cls = '') => { const o = document.getElementById('termOut'); const d = document.createElement('div'); d.className = cls; d.textContent = txt; o.appendChild(d); o.scrollTop = o.scrollHeight; };
  T.open = function () {
    const t = document.getElementById('term'); t.hidden = false;
    if (!T.booted) { T.booted = true; T.out('BLACK VEIL ARCHIVE TERMINAL v3.17.42', 'sys'); T.out('Type "help". Some files are not listed.'); }
    setTimeout(() => document.getElementById('termInput').focus(), 30);
  };
  T.close = () => { document.getElementById('term').hidden = true; };
  T.run = function (line) {
    T.out('veil@archive:~$ ' + line);
    const [cmd, ...args] = line.trim().split(/\s+/); const a = args.join(' ');
    const ids = () => [...BV.sites.filter(s => s.type === 'facility').map(s => s.id), ...BV.projects.filter(p => !p.secret || S.correlation).map(p => p.id), ...BV.documents.map(d => d.id), ...BV.specimens.map(s => s.id)];
    switch ((cmd || '').toLowerCase()) {
      case '': break;
      case 'help': T.out(BV.hidden['readme.txt'].split('\n').slice(2).join('\n')); break;
      case 'ls': T.out(ids().join('  ') + (args[0] === '-a' ? '  .veil  readme.txt' : '')); if (args[0] === '-a') Story.discover('dotfile'); break;
      case 'cat': if (BV.hidden[a]) { T.out(BV.hidden[a]); if (a === '.veil') Story.discover('dotfile'); } else T.out('cat: ' + a + ': no such file', 'err'); break;
      case 'open': { if (BV.hidden[a]) { T.out(BV.hidden[a]); break; } const ok = App.openAny(a.toUpperCase()); if (!ok) T.out('open: ' + a + ': not found', 'err'); else T.close(); break; }
      case 'decode': { const r = BVAudio.fromMorse(a); T.out(r || 'decode: nothing to decode'); if (r.replace(/\s/g, '') === 'THRESHOLD') { Story.discover('morse'); T.out('>> PASSPHRASE FORMAT DETECTED. Try: unlock ' + r, 'sys'); } break; }
      case 'unlock': if (Story.tryZero(a)) { T.out('PROJECT ZERO — DECRYPTED. Coordinates released.', 'sys'); } else T.out('unlock: passphrase rejected (attempt logged)', 'err'); break;
      case 'trace': {
        const [lat, lon] = args.map(Number);
        if (Math.abs(lat + 48.88) < 1 && Math.abs(lon + 123.39) < 1) { if (S.zero) { T.out('TRACE LOCK... CONVERGENCE CONFIRMED.', 'sys'); setTimeout(() => { T.close(); App.go('map'); Globe.focus(-48.88, -123.39); setTimeout(Story.findNull, 1400); }, 900); } else T.out('TRACE BLOCKED — PROJECT ZERO ENCRYPTED', 'err'); }
        else if (!isNaN(lat) && !isNaN(lon)) { T.out(`TRACE ${lat} ${lon}: no anomaly on record.`); App.go('map'); Globe.focus(lat, lon); }
        else T.out('usage: trace <lat> <lon>', 'err');
        break;
      }
      case 'whoami': T.out(`session #00317 · access ${Story.access()} · ${S.viewed.length} files opened · keys: ${S.keys.join(', ') || 'none'}`); break;
      case 'status': T.out(`correlation: ${S.correlation ? 'DETECTED' : 'pending (' + Story.veilCount() + '/5)'}\nproject zero: ${S.zero ? 'DECRYPTED' : 'SEALED'}\nsite null: ${S.nullFound ? 'TRACED' : 'UNKNOWN'}\ndiscoveries: ${S.disc.length}/${Object.keys(DISCOVERIES).length}`); break;
      case 'clear': document.getElementById('termOut').innerHTML = ''; break;
      case 'sudo': T.out('sudo: there is no one above you here.', 'err'); break;
      case 'exit': case 'quit': T.close(); break;
      case 'veil': T.out('...you said its name. It noticed.', 'sys'); FX.cut('CAM 00'); break;
      default: T.out(cmd + ': command not found', 'err');
    }
  };
  Story.T = T;
  window.Story = Story;
})();
