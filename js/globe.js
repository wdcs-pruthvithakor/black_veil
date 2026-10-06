/* BLACK VEIL — interactive holographic globe (Three.js r128) with 2D fallback */
(function () {
  const DEG = Math.PI / 180;
  const G = { ready: false };
  let canvas, renderer, scene, camera, earth, markers = [], arcs = [], hitMeshes = [];
  let rotX = 0.35, rotY = -1.2, tRotX = rotX, tRotY = rotY, camZ = 3.4, tCamZ = 3.4;
  let dragging = false, lastX = 0, lastY = 0, velX = 0, velY = 0, idleT = 0, running = false, raf = 0;
  let pointers = new Map(), pinchD = 0, hover = null, onPick, onHover, layers = { fic: true, doc: true };
  let fallback = false, fbCtx = null;

  function ll(lat, lon, r = 1) {
    const phi = (90 - lat) * DEG, th = (lon + 180) * DEG;
    return new THREE.Vector3(-r * Math.sin(phi) * Math.cos(th), r * Math.cos(phi), r * Math.sin(phi) * Math.sin(th));
  }

  /* point in polygon (ray casting) with bbox precheck */
  function landTest() {
    const rings = (window.BV_WORLD || []).map(r => {
      let a = 1e9, b = -1e9, c = 1e9, d = -1e9;
      r.forEach(([x, y]) => { a = Math.min(a, x); b = Math.max(b, x); c = Math.min(c, y); d = Math.max(d, y); });
      return { r, a, b, c, d };
    });
    return (lon, lat) => {
      let inside = false;
      for (const R of rings) {
        if (lon < R.a || lon > R.b || lat < R.c || lat > R.d) continue;
        const p = R.r; let ins = false;
        for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
          const xi = p[i][0], yi = p[i][1], xj = p[j][0], yj = p[j][1];
          if (((yi > lat) !== (yj > lat)) && (lon < (xj - xi) * (lat - yi) / (yj - yi) + xi)) ins = !ins;
        }
        if (ins) inside = !inside;
      }
      return inside;
    };
  }

  function colorFor(site) {
    if (site.type === 'event') return site.label === 'UNV' ? 0xe2a23b : 0x5fb8e6;
    return [0, 0x5fb8e6, 0xe2a23b, 0xd0212a, 0x9b8fa6, 0xff2a2a][site.threat] || 0xd0212a;
  }

  function build() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(38, 1, .1, 100); camera.position.set(0, 0, camZ);
    earth = new THREE.Group(); scene.add(earth);

    earth.add(new THREE.Mesh(new THREE.SphereGeometry(.995, 64, 48), new THREE.MeshBasicMaterial({ color: 0x06090b })));

    // land dot matrix
    const isLand = landTest(), pts = [];
    for (let lat = -84; lat <= 84; lat += 1.5) {
      const step = 1.5 / Math.max(.2, Math.cos(lat * DEG));
      for (let lon = -180; lon < 180; lon += step) if (isLand(lon, lat)) { const v = ll(lat, lon, 1.002); pts.push(v.x, v.y, v.z); }
    }
    const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.Float32BufferAttribute(pts, 3));
    earth.add(new THREE.Points(pg, new THREE.PointsMaterial({ color: 0x4f8fae, size: .0105, transparent: true, opacity: .75 })));

    // coastlines as one segment buffer
    const seg = [];
    (window.BV_WORLD || []).forEach(ring => {
      for (let i = 0; i < ring.length; i++) {
        const a = ring[i], b = ring[(i + 1) % ring.length];
        const va = ll(a[1], a[0], 1.003), vb = ll(b[1], b[0], 1.003); seg.push(va.x, va.y, va.z, vb.x, vb.y, vb.z);
      }
    });
    const cg = new THREE.BufferGeometry(); cg.setAttribute('position', new THREE.Float32BufferAttribute(seg, 3));
    earth.add(new THREE.LineSegments(cg, new THREE.LineBasicMaterial({ color: 0x5fb8e6, transparent: true, opacity: .32 })));

    // graticule
    const gr = [];
    for (let lat = -60; lat <= 60; lat += 30) for (let lon = -180; lon < 180; lon += 3) { const a = ll(lat, lon, 1.001), b = ll(lat, lon + 3, 1.001); gr.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    for (let lon = -180; lon < 180; lon += 30) for (let lat = -90; lat < 90; lat += 3) { const a = ll(lat, lon, 1.001), b = ll(lat + 3, lon, 1.001); gr.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    const gg = new THREE.BufferGeometry(); gg.setAttribute('position', new THREE.Float32BufferAttribute(gr, 3));
    earth.add(new THREE.LineSegments(gg, new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: .045 })));

    // atmosphere (fresnel)
    const atm = new THREE.Mesh(new THREE.SphereGeometry(1.16, 64, 48), new THREE.ShaderMaterial({
      side: THREE.BackSide, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
      uniforms: { c: { value: new THREE.Color(0x3a8fbf) } },
      vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 c; varying vec3 vN; void main(){ float i = pow(0.62 - dot(vN, vec3(0.,0.,1.)), 3.0); gl_FragColor = vec4(c, 1.0) * i; }'
    }));
    scene.add(atm);

    // scanning ring
    const scan = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.252, 128), new THREE.MeshBasicMaterial({ color: 0xd0212a, transparent: true, opacity: .25, side: THREE.DoubleSide }));
    scan.rotation.x = Math.PI / 2; scene.add(scan); G._scan = scan;

    // markers
    const ringGeo = new THREE.RingGeometry(.018, .024, 32), coreGeo = new THREE.SphereGeometry(.009, 12, 8), hitGeo = new THREE.SphereGeometry(.045, 8, 6);
    BV.sites.forEach(site => {
      const col = colorFor(site), pos = ll(site.lat, site.lon, 1.006);
      const g = new THREE.Group(); g.position.copy(pos); g.lookAt(pos.clone().multiplyScalar(2));
      const core = new THREE.Mesh(coreGeo, new THREE.MeshBasicMaterial({ color: col }));
      const ring = new THREE.Mesh(ringGeo, new THREE.MeshBasicMaterial({ color: col, transparent: true, opacity: .9, side: THREE.DoubleSide }));
      const ring2 = ring.clone(); ring2.material = ring.material.clone();
      g.add(core, ring, ring2);
      if (site.type !== 'event') { // spike
        const sg = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, .08 + site.threat * .02)]);
        g.add(new THREE.Line(sg, new THREE.LineBasicMaterial({ color: col, transparent: true, opacity: .7 })));
      }
      const hit = new THREE.Mesh(hitGeo, new THREE.MeshBasicMaterial({ visible: false })); hit.userData.site = site; g.add(hit); hitMeshes.push(hit);
      g.userData = { site, ring, ring2, phase: Math.random() * 3 };
      g.visible = site.type !== 'hidden';
      earth.add(g); markers.push(g);
    });
  }

  function addArc(a, b, color = 0xd0212a) {
    const va = ll(a.lat, a.lon, 1.006), vb = ll(b.lat, b.lon, 1.006);
    const mid = va.clone().add(vb).multiplyScalar(.5); const len = va.distanceTo(vb);
    mid.normalize().multiplyScalar(1 + len * .35);
    const curve = new THREE.QuadraticBezierCurve3(va, mid, vb), pts = curve.getPoints(80);
    const geo = new THREE.BufferGeometry().setFromPoints(pts); geo.setDrawRange(0, 0);
    const line = new THREE.Line(geo, new THREE.LineBasicMaterial({ color, transparent: true, opacity: .85 }));
    line.userData = { t: 0, n: pts.length }; earth.add(line); arcs.push(line);
  }

  function resize() {
    if (fallback) return drawFallback();
    const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return;
    renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix();
  }

  function loop(now) {
    raf = requestAnimationFrame(loop);
    const t = now / 1000;
    if (!dragging) {
      tRotY += velX; tRotX += velY; velX *= .94; velY *= .94;
      if (performance.now() - idleT > 4000 && !G.reduced) tRotY += .0009;
    }
    tRotX = Math.max(-1.3, Math.min(1.3, tRotX));
    rotX += (tRotX - rotX) * .12; rotY += (tRotY - rotY) * .12; camZ += (tCamZ - camZ) * .12;
    earth.rotation.x = rotX; earth.rotation.y = rotY; camera.position.z = camZ;
    G._scan.rotation.z = t * .4; G._scan.rotation.y = Math.sin(t * .2) * .3;
    markers.forEach(m => {
      const u = m.userData, k = ((t * .7 + u.phase) % 1.6) / 1.6, k2 = ((t * .7 + u.phase + .8) % 1.6) / 1.6;
      const amp = u.site.threat >= 4 ? 3.6 : 2.6;
      u.ring.scale.setScalar(1 + k * amp); u.ring.material.opacity = (1 - k) * .9;
      u.ring2.scale.setScalar(1 + k2 * amp); u.ring2.material.opacity = (1 - k2) * .9;
      if (m === hover) m.scale.setScalar(1.6); else m.scale.setScalar(1);
    });
    arcs.forEach(a => { if (a.userData.t < 1) { a.userData.t = Math.min(1, a.userData.t + .012); a.geometry.setDrawRange(0, Math.floor(a.userData.n * a.userData.t)); } a.material.opacity = .5 + .35 * Math.sin(t * 3); });
    renderer.render(scene, camera);
    const read = document.getElementById('globeRead');
    if (read && (raf % 6 === 0)) {
      const lat = rotX / DEG, lon = -(rotY / DEG) - 90; const L = ((lon + 540) % 360) - 180;
      const f = (v, n) => (v < 0 ? '−' : '+') + Math.abs(v).toFixed(2).padStart(n, '0');
      read.textContent = `LAT ${f(lat, 5)} / LON ${f(L, 6)} // ZOOM ${(3.4 / camZ).toFixed(1)}×`;
    }
    if (hover) placeTip(hover);
  }

  function placeTip(m) {
    const tip = document.getElementById('globeTip'), v = new THREE.Vector3(); m.getWorldPosition(v);
    const facing = v.clone().normalize().dot(camera.position.clone().sub(v).normalize()) > 0;
    if (!facing) { tip.hidden = true; return; }
    v.project(camera); const r = canvas.getBoundingClientRect();
    tip.style.left = ((v.x + 1) / 2 * r.width) + 'px'; tip.style.top = ((1 - v.y) / 2 * r.height) + 'px';
  }

  function pick(e) {
    const r = canvas.getBoundingClientRect();
    const m = new THREE.Vector2(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
    const rc = new THREE.Raycaster(); rc.setFromCamera(m, camera);
    const hits = rc.intersectObjects(hitMeshes.filter(h => h.parent.visible), false);
    for (const h of hits) {
      const wp = new THREE.Vector3(); h.object.getWorldPosition(wp);
      if (wp.z > -0.15) return h.object.parent; // front hemisphere only
    }
    return null;
  }

  function setHover(m) {
    if (m === hover) return; hover = m;
    const tip = document.getElementById('globeTip');
    canvas.style.cursor = m ? 'pointer' : '';
    if (!m) { tip.hidden = true; return; }
    tip.hidden = false; tip.innerHTML = onHover(m.userData.site); window.BVAudio && BVAudio.hover();
  }

  function bind() {
    canvas.addEventListener('pointerdown', e => {
      canvas.setPointerCapture(e.pointerId); pointers.set(e.pointerId, e);
      dragging = true; lastX = e.clientX; lastY = e.clientY; velX = velY = 0; idleT = performance.now(); G._down = [e.clientX, e.clientY];
    });
    canvas.addEventListener('pointermove', e => {
      if (pointers.has(e.pointerId)) pointers.set(e.pointerId, e);
      if (pointers.size === 2) {
        const [a, b] = [...pointers.values()], d = Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
        if (pinchD) tCamZ = Math.max(1.55, Math.min(4.6, tCamZ * (pinchD / d))); pinchD = d; return;
      }
      if (dragging) {
        const dx = e.clientX - lastX, dy = e.clientY - lastY; lastX = e.clientX; lastY = e.clientY;
        const s = .005 * (camZ / 3.4); tRotY += dx * s; tRotX += dy * s; velX = dx * s * .5; velY = dy * s * .5; idleT = performance.now();
        if (G._down && Math.hypot(e.clientX - G._down[0], e.clientY - G._down[1]) > 4) setHover(null);
      } else setHover(pick(e));
    });
    const up = e => {
      pointers.delete(e.pointerId); if (pointers.size < 2) pinchD = 0;
      if (dragging && G._down && Math.hypot(e.clientX - G._down[0], e.clientY - G._down[1]) < 5) { const m = pick(e); if (m) onPick(m.userData.site); }
      dragging = pointers.size > 0;
    };
    canvas.addEventListener('pointerup', up); canvas.addEventListener('pointercancel', up);
    canvas.addEventListener('pointerleave', () => { if (!dragging) setHover(null); });
    canvas.addEventListener('wheel', e => { e.preventDefault(); tCamZ = Math.max(1.55, Math.min(4.6, tCamZ * (1 + Math.sign(e.deltaY) * .1))); idleT = performance.now(); }, { passive: false });
    window.addEventListener('resize', resize);
    if (window.ResizeObserver) new ResizeObserver(resize).observe(canvas);
  }

  /* ---------- 2D fallback (no WebGL) */
  function drawFallback() {
    const { w, h } = FX.fit(canvas); fbCtx = canvas.getContext('2d');
    fbCtx.fillStyle = '#06090b'; fbCtx.fillRect(0, 0, w, h);
    FX.drawWorld(fbCtx, w, h, { grid: true });
    BV.sites.forEach(s => {
      if (s.type === 'hidden' && !G._nullShown) return;
      if ((s.type === 'event' && !layers.doc) || (s.type !== 'event' && !layers.fic)) return;
      const [x, y] = FX.proj(s.lat, s.lon, w, h); fbCtx.fillStyle = '#' + colorFor(s).toString(16).padStart(6, '0');
      fbCtx.beginPath(); fbCtx.arc(x, y, 5, 0, 7); fbCtx.fill();
    });
  }
  function bindFallback() {
    canvas.addEventListener('click', e => {
      const r = canvas.getBoundingClientRect(), x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
      let best = null, bd = .03;
      BV.sites.forEach(s => { const [sx, sy] = FX.proj(s.lat, s.lon, 1, 1); const d = Math.hypot(sx - x, sy - y); if (d < bd) { bd = d; best = s; } });
      if (best) onPick(best);
    });
    window.addEventListener('resize', drawFallback);
    if (window.ResizeObserver) new ResizeObserver(drawFallback).observe(canvas);
  }

  G.init = function (cv, pickCb, hoverCb) {
    canvas = cv; onPick = pickCb; onHover = hoverCb; G.reduced = FX.reduced;
    try {
      if (!window.THREE) throw new Error('no three');
      renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      build(); bind(); resize(); G.ready = true;
    } catch (err) {
      console.warn('Globe: WebGL unavailable, using flat projection.', err);
      fallback = true; bindFallback(); drawFallback(); G.ready = true;
      document.querySelector('.g-hint').textContent = 'WEBGL UNAVAILABLE — FLAT PROJECTION';
    }
  };
  G.start = function () { if (!canvas) return; if (fallback) return drawFallback(); if (running) return; running = true; resize(); raf = requestAnimationFrame(loop); };
  G.stop = function () { running = false; cancelAnimationFrame(raf); };
  G.zoom = f => { tCamZ = Math.max(1.55, Math.min(4.6, tCamZ * f)); idleT = performance.now(); };
  G.reset = () => { tCamZ = 3.4; tRotX = .35; };
  G.focus = function (lat, lon) {
    if (fallback) return;
    tRotX = lat * DEG; let target = -(lon + 90) * DEG;
    while (target - tRotY > Math.PI) target -= 2 * Math.PI; while (target - tRotY < -Math.PI) target += 2 * Math.PI;
    tRotY = target; tCamZ = Math.min(tCamZ, 2.6); velX = velY = 0; idleT = performance.now() + 6000;
  };
  G.setLayers = function (l) {
    layers = l; if (fallback) return drawFallback();
    markers.forEach(m => { const s = m.userData.site; m.visible = s.type === 'hidden' ? !!G._nullShown : (s.type === 'event' ? l.doc : l.fic); });
  };
  G.revealNull = function () {
    G._nullShown = true; if (fallback) return drawFallback();
    markers.forEach(m => { if (m.userData.site.type === 'hidden') m.visible = true; });
  };
  G.connect = function (ids, toId) {
    if (fallback) return;
    const get = id => BV.sites.find(s => s.id === id);
    if (toId) ids.forEach(id => addArc(get(id), get(toId), 0xff2a2a));
    else for (let i = 0; i < ids.length; i++) addArc(get(ids[i]), get(ids[(i + 1) % ids.length]));
  };
  window.Globe = G;
})();
