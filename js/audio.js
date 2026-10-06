/* BLACK VEIL — synthesized sound design (Web Audio, no files, never autoplays) */
(function () {
  const A = { enabled: false, ctx: null };
  let master, ambBus, noiseBuf, ambNodes = [], ambTimer = null;

  function ensure() {
    if (A.ctx) return A.ctx;
    const C = window.AudioContext || window.webkitAudioContext;
    if (!C) return null;
    A.ctx = new C();
    master = A.ctx.createGain(); master.gain.value = 0; master.connect(A.ctx.destination);
    ambBus = A.ctx.createGain(); ambBus.gain.value = 0.55; ambBus.connect(master);
    // 2s white noise buffer, reused everywhere
    noiseBuf = A.ctx.createBuffer(1, A.ctx.sampleRate * 2, A.ctx.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    return A.ctx;
  }

  function noise(loop = true) { const s = A.ctx.createBufferSource(); s.buffer = noiseBuf; s.loop = loop; return s; }

  function startAmbient() {
    const c = A.ctx, t = c.currentTime;
    // low-frequency drone: two detuned saws through a lowpass
    const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 180; lp.Q.value = 4;
    const dg = c.createGain(); dg.gain.value = 0.16; lp.connect(dg); dg.connect(ambBus);
    [41.2, 41.7, 55.0].forEach(f => { const o = c.createOscillator(); o.type = 'sawtooth'; o.frequency.value = f; o.connect(lp); o.start(t); ambNodes.push(o); });
    // slow filter breathing
    const lfo = c.createOscillator(); lfo.frequency.value = 0.05; const lg = c.createGain(); lg.gain.value = 90;
    lfo.connect(lg); lg.connect(lp.frequency); lfo.start(t); ambNodes.push(lfo);
    // electrical hum 60Hz + harmonic
    const hg = c.createGain(); hg.gain.value = 0.025; hg.connect(ambBus);
    [60, 120, 180].forEach((f, i) => { const o = c.createOscillator(); o.frequency.value = f; const g = c.createGain(); g.gain.value = 1 / (i + 1); o.connect(g); g.connect(hg); o.start(t); ambNodes.push(o); });
    // radio static bed
    const n = noise(); const bp = c.createBiquadFilter(); bp.type = 'bandpass'; bp.frequency.value = 2400; bp.Q.value = .6;
    const ng = c.createGain(); ng.gain.value = 0.018; n.connect(bp); bp.connect(ng); ng.connect(ambBus); n.start(t); ambNodes.push(n);
    // distant machinery: random thuds / beeps
    const tick = () => {
      if (!A.enabled) return;
      const r = Math.random();
      if (r < .35) A.beep(1800 + Math.random() * 600, .06, .015);
      else if (r < .6) thud();
      else if (r < .7) voice();
      ambTimer = setTimeout(tick, 2500 + Math.random() * 6000);
    };
    ambTimer = setTimeout(tick, 2000);
  }
  function stopAmbient() {
    clearTimeout(ambTimer);
    ambNodes.forEach(n => { try { n.stop(); } catch (e) {} });
    ambNodes = [];
  }
  function thud() {
    const c = A.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(70, t); o.frequency.exponentialRampToValueAtTime(30, t + .5);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(.12, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .9);
    o.connect(g); g.connect(ambBus); o.start(t); o.stop(t + 1);
  }
  // distorted "voice": formant-filtered noise bursts
  function voice() {
    const c = A.ctx, t = c.currentTime, n = noise(false), f = c.createBiquadFilter(), g = c.createGain();
    f.type = 'bandpass'; f.Q.value = 9; f.frequency.setValueAtTime(500, t);
    for (let i = 0; i < 6; i++) f.frequency.setValueAtTime(350 + Math.random() * 900, t + i * .12);
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.05, t + .05); g.gain.linearRampToValueAtTime(0, t + .8);
    n.connect(f); f.connect(g); g.connect(ambBus); n.start(t); n.stop(t + .9);
  }

  A.toggle = function (force) {
    const want = typeof force === 'boolean' ? force : !A.enabled;
    if (want && !ensure()) return false;
    A.enabled = want;
    if (!A.ctx) return false;
    const t = A.ctx.currentTime;
    if (want) {
      A.ctx.resume();
      startAmbient();
      master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(.6, t + 2.5);
    } else {
      master.gain.cancelScheduledValues(t); master.gain.setValueAtTime(master.gain.value, t); master.gain.linearRampToValueAtTime(0, t + .4);
      setTimeout(() => { if (!A.enabled) stopAmbient(); }, 450);
    }
    return A.enabled;
  };

  A.beep = function (freq = 1200, dur = .05, vol = .05, type = 'square') {
    if (!A.enabled) return;
    const c = A.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.0001, t + dur);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + dur + .02);
  };
  A.click = () => { A.beep(2600, .025, .03); setTimeout(() => A.beep(900, .03, .02), 30); };
  A.hover = () => A.beep(3400, .012, .008, 'sine');
  A.glitch = function () {
    if (!A.enabled) return;
    const c = A.ctx, t = c.currentTime, n = noise(false), g = c.createGain();
    g.gain.setValueAtTime(.12, t); g.gain.setValueAtTime(0, t + .05); g.gain.setValueAtTime(.08, t + .09); g.gain.linearRampToValueAtTime(0, t + .3);
    n.connect(g); g.connect(master); n.start(t); n.stop(t + .32);
  };
  A.alarm = function (cycles = 3) {
    if (!A.enabled) return;
    const c = A.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.type = 'sawtooth';
    for (let i = 0; i < cycles; i++) { o.frequency.setValueAtTime(620, t + i * .9); o.frequency.linearRampToValueAtTime(880, t + i * .9 + .45); o.frequency.linearRampToValueAtTime(620, t + i * .9 + .9); }
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(.06, t + .05); g.gain.setValueAtTime(.06, t + cycles * .9 - .1); g.gain.linearRampToValueAtTime(0, t + cycles * .9);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + cycles * .9 + .05);
  };
  A.drop = function () { // deep sub hit for reveals
    if (!A.enabled) return;
    const c = A.ctx, t = c.currentTime, o = c.createOscillator(), g = c.createGain();
    o.frequency.setValueAtTime(90, t); o.frequency.exponentialRampToValueAtTime(24, t + 3);
    g.gain.setValueAtTime(.3, t); g.gain.exponentialRampToValueAtTime(.0001, t + 4);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 4);
  };

  const MORSE = { A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.', H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.', O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-', V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..', '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.' };
  A.MORSE = MORSE;
  A.toMorse = s => s.toUpperCase().split('').map(ch => ch === ' ' ? '/' : (MORSE[ch] || '')).join(' ');
  A.fromMorse = s => s.trim().split(/\s*\/\s*|\s{3,}/).map(w => w.split(/\s+/).map(code => {
    for (const k in MORSE) if (MORSE[k] === code.replace(/[—–]/g, '-').replace(/·/g, '.')) return k;
    return code ? '?' : '';
  }).join('')).join(' ');

  /* Transmission playback. Returns { analyser, stop }. Works only with sound on. */
  A.transmit = function (kind, opts = {}) {
    if (!A.enabled) return null;
    const c = A.ctx, t = c.currentTime, out = c.createGain(), an = c.createAnalyser();
    an.fftSize = 1024; out.gain.value = .5; out.connect(an); an.connect(master);
    const nodes = [];
    const add = n => (nodes.push(n), n);
    let dur = 10;
    // always a bed of static
    const st = add(noise()); const sf = c.createBiquadFilter(); sf.type = 'highpass'; sf.frequency.value = 900;
    const sg = c.createGain(); sg.gain.value = kind === 'static' ? .28 : .05; st.connect(sf); sf.connect(sg); sg.connect(out); st.start(t);
    if (kind === 'morse') {
      const o = add(c.createOscillator()), g = c.createGain(); o.frequency.value = 680; g.gain.value = 0; o.connect(g); g.connect(out); o.start(t);
      const unit = .09; let at = t + .6;
      A.toMorse(opts.message || 'SOS').split('').forEach(sym => {
        if (sym === '.') { g.gain.setValueAtTime(.35, at); at += unit; g.gain.setValueAtTime(0, at); at += unit; }
        else if (sym === '-') { g.gain.setValueAtTime(.35, at); at += unit * 3; g.gain.setValueAtTime(0, at); at += unit; }
        else if (sym === ' ') at += unit * 2;
        else if (sym === '/') at += unit * 4;
      });
      dur = at - t + 1;
    } else if (kind === 'carrier') {
      const o = add(c.createOscillator()), g = c.createGain(); o.frequency.value = 1420.4 / 2; g.gain.value = .12;
      const lfo = add(c.createOscillator()), lg = c.createGain(); lfo.frequency.value = 1 / 3; lg.gain.value = 6; lfo.connect(lg); lg.connect(o.frequency); lfo.start(t);
      o.connect(g); g.connect(out); o.start(t); dur = 12;
    } else if (kind === 'pulse') {
      const o = add(c.createOscillator()), g = c.createGain(); o.frequency.value = 52; o.type = 'triangle'; g.gain.value = 0; o.connect(g); g.connect(out); o.start(t);
      [0, 3, 17 / 3, 42 / 5, 9.5].forEach(s => { g.gain.setValueAtTime(0, t + s); g.gain.linearRampToValueAtTime(.5, t + s + .05); g.gain.exponentialRampToValueAtTime(.001, t + s + 1.4); });
      dur = 12;
    } else if (kind === 'whale') {
      const o = add(c.createOscillator()), g = c.createGain(); o.type = 'sine'; g.gain.value = 0; o.connect(g); g.connect(out); o.start(t);
      const pts = [[0, 180], [1.5, 340], [3, 120], [5, 420], [7, 200], [9, 60]];
      pts.forEach(([s, f]) => o.frequency.linearRampToValueAtTime(f, t + s));
      g.gain.linearRampToValueAtTime(.3, t + .5); g.gain.setValueAtTime(.3, t + 8.5); g.gain.linearRampToValueAtTime(0, t + 9.5); dur = 10;
    } else if (kind === 'drip') {
      for (let i = 0; i < 10; i++) { const s = t + .4 + i * (0.6 + Math.random() * .7); const o = c.createOscillator(), g = c.createGain(); o.frequency.setValueAtTime(1400, s); o.frequency.exponentialRampToValueAtTime(500, s + .12); g.gain.setValueAtTime(.2, s); g.gain.exponentialRampToValueAtTime(.001, s + .2); o.connect(g); g.connect(out); o.start(s); o.stop(s + .25); }
      dur = 9;
    } else if (kind === 'alarm') {
      const o = add(c.createOscillator()), g = c.createGain(); o.type = 'square'; o.frequency.value = 0; g.gain.value = .07; o.connect(g); g.connect(out); o.start(t);
      for (let i = 0; i < 8; i++) { o.frequency.setValueAtTime(960, t + i); o.frequency.setValueAtTime(720, t + i + .5); }
      dur = 8;
    } else if (kind === 'forest') {
      const n = add(noise()), bp = c.createBiquadFilter(), g = c.createGain(); bp.type = 'bandpass'; bp.frequency.value = 4200; bp.Q.value = 3; g.gain.value = 0;
      const am = add(c.createOscillator()), ag = c.createGain(); am.frequency.value = 22; ag.gain.value = .12; am.connect(ag); ag.connect(g.gain); am.start(t);
      n.connect(bp); bp.connect(g); g.connect(out); n.start(t);
      sg.gain.setValueAtTime(.05, t); out.gain.setValueAtTime(.5, t + 6); out.gain.setValueAtTime(0, t + 6.02); // chorus cuts out
      dur = 9;
    }
    out.gain.setValueAtTime(out.gain.value, t + dur - .3); out.gain.linearRampToValueAtTime(0, t + dur);
    let stopped = false;
    const stop = () => { if (stopped) return; stopped = true; nodes.forEach(n => { try { n.stop(); } catch (e) {} }); try { out.disconnect(); } catch (e) {} };
    const timer = setTimeout(stop, dur * 1000 + 100);
    return { analyser: an, duration: dur, stop: () => { clearTimeout(timer); stop(); } };
  };

  window.BVAudio = A;
})();
