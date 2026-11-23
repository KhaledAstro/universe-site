// ===== Moon3D: WebGL renderer for MoonSim (physics stays in the 2D plane; bodies are shown as lit 3D spheres of particles) =====
(function (root) {
'use strict';
function R3D(container) {
  const THREE = window.THREE; this.T = THREE;
  const cv = document.createElement('canvas'); cv.style.cssText = 'width:100%;height:100%;display:block;border-radius:16px'; container.appendChild(cv); this.cv = cv;
  const rd = new THREE.WebGLRenderer({ canvas: cv, antialias: true }); rd.setPixelRatio(Math.min(2, devicePixelRatio || 1)); rd.outputEncoding = THREE.sRGBEncoding; this.rd = rd;
  const sc = new THREE.Scene(); this.sc = sc; const cam = new THREE.PerspectiveCamera(40, 1, 0.01, 2000); this.cam = cam;
  const L = new THREE.TextureLoader(), tex = n => { const x = L.load('tex/' + n + '.jpg'); x.encoding = THREE.sRGBEncoding; return x; };
  const sky = new THREE.Mesh(new THREE.SphereGeometry(900, 48, 24), new THREE.MeshBasicMaterial({ map: tex('milkyway'), side: THREE.BackSide })); sky.material.color.setScalar(0.45); sc.add(sky);
  sc.add(new THREE.AmbientLight(0x30364a, 0.55)); const sun = new THREE.DirectionalLight(0xfff2dd, 2.3); sun.position.set(-8, 5, 6); sc.add(sun);
  // particles: instanced lit spheres
  this.max = 1800; const g = new THREE.SphereGeometry(1, 14, 10);
  const mat = new THREE.MeshStandardMaterial({ roughness: 0.85, metalness: 0.05 });
  mat.onBeforeCompile = sh => { // per-instance emissive glow from heat: encoded in instanceColor alpha-like channel via a uniform-free trick (brightness > 1 means glowing)
    sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', '#include <emissivemap_fragment>\n totalEmissiveRadiance += max(vec3(0.0), vColor - vec3(1.0)) * 1.0;'); };
  this.inst = new THREE.InstancedMesh(g, mat, this.max); this.inst.instanceMatrix.setUsage(THREE.DynamicDrawUsage); this.inst.instanceColor = new THREE.InstancedBufferAttribute(new Float32Array(this.max * 3), 3); sc.add(this.inst);
  // glow sprites for hot material
  const gc = document.createElement('canvas'); gc.width = gc.height = 64; const gg = gc.getContext('2d'), gr = gg.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(0.4, 'rgba(255,255,255,0.35)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); gg.fillStyle = gr; gg.fillRect(0, 0, 64, 64);
  this.gpos = new Float32Array(this.max * 3); this.gcol = new Float32Array(this.max * 3);
  const pg = new THREE.BufferGeometry(); pg.setAttribute('position', new THREE.BufferAttribute(this.gpos, 3)); pg.setAttribute('color', new THREE.BufferAttribute(this.gcol, 3));
  this.glow = new THREE.Points(pg, new THREE.PointsMaterial({ size: 0.55, map: new THREE.CanvasTexture(gc), vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })); sc.add(this.glow);
  // Earth (after the impact the planet relaxes into a sphere) and the Moon
  this.earth = new THREE.Mesh(new THREE.SphereGeometry(1, 64, 48), new THREE.MeshStandardMaterial({ map: tex('earth_magma'), emissiveMap: tex('earth_magma_glow'), emissive: new THREE.Color(0xff6a20), emissiveIntensity: 1.2, roughness: 0.9 })); this.earth.visible = false; sc.add(this.earth);
  // the young Earth right after the impact: a magma-ocean world (no continents or oceans yet) – a model-based reconstruction
  const halo = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(gc), color: 0xff7a3a, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, depthWrite: false })); halo.scale.set(3.4, 3.4, 1); this.earth.add(halo); this.halo = halo;
  this.moon = new THREE.Mesh(new THREE.SphereGeometry(1, 48, 32), new THREE.MeshStandardMaterial({ map: tex('moon_magma'), emissiveMap: tex('moon_magma_glow'), emissive: new THREE.Color(0xff7a2a), emissiveIntensity: 1.4, roughness: 0.9 })); this.moon.visible = false; sc.add(this.moon);
  // Roche ring
  const rr = new THREE.RingGeometry(2.88, 2.92, 128); this.roche = new THREE.Mesh(rr, new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.18, side: THREE.DoubleSide })); this.roche.rotation.x = -Math.PI / 2; sc.add(this.roche);
  // trail line (capture)
  this.trailGeo = new THREE.BufferGeometry(); this.trailGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(3 * 2000), 3)); this.trail = new THREE.Line(this.trailGeo, new THREE.LineBasicMaterial({ color: 0xf1d27a, transparent: true, opacity: 0.7 })); sc.add(this.trail);
  // per-particle random height factor -> bodies look like 3D spheres
  this.hz = new Float32Array(this.max); for (let i = 0; i < this.max; i++) this.hz[i] = (Math.random() * 2 - 1);
  // camera orbit
  this.az = 0.35; this.el = 0.62; this.dist = 11; const ptr = new Map(); let drag = null, pinch = null;
  cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); if (ptr.size === 2) { const [a, b] = [...ptr.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), r: this.dist }; } else drag = [e.clientX, e.clientY]; });
  cv.addEventListener('pointermove', e => { if (!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, [e.clientX, e.clientY]); if (pinch && ptr.size === 2) { const [a, b] = [...ptr.values()]; this.dist = Math.max(4, Math.min(30, pinch.r * pinch.d / Math.hypot(a[0] - b[0], a[1] - b[1]))); return; } if (!drag) return; this.az -= (e.clientX - drag[0]) * 0.006; this.el = Math.max(0.05, Math.min(1.5, this.el + (e.clientY - drag[1]) * 0.006)); drag = [e.clientX, e.clientY]; });
  const up = e => { ptr.delete(e.pointerId); if (ptr.size < 2) pinch = null; if (!ptr.size) drag = null; }; cv.addEventListener('pointerup', up); cv.addEventListener('pointercancel', up);
  cv.addEventListener('wheel', e => { e.preventDefault(); this.dist = Math.max(4, Math.min(30, this.dist * Math.exp(e.deltaY * 0.001))); }, { passive: false });
  this.m4 = new THREE.Matrix4(); this.col = new THREE.Color();
}
R3D.prototype.resize = function () { const w = this.cv.clientWidth, h = this.cv.clientHeight; if (!w || !h) return; this.rd.setSize(w, h, false); this.cam.aspect = w / h; this.cam.updateProjectionMatrix(); };
R3D.prototype.render = function (sim, mode, view, trail, label) {
  const T = this.T; this.resize(); const s = sim; if (!s) return;
  const [cx, cy] = s.centre(); const st = s.stats();
  this.dist += ((view * 2.15) - this.dist) * 0.0; // user controls distance
  this.cam.position.set(this.dist * Math.cos(this.el) * Math.sin(this.az), this.dist * Math.sin(this.el), this.dist * Math.cos(this.el) * Math.cos(this.az)); this.cam.lookAt(0, 0, 0);
  // impactor centre (for sphere-shaped display before contact)
  let ix = 0, iy = 0, im = 0; for (let i = 0; i < s.N; i++) { if (!s.alive[i] || s.src[i] !== 1 || i === s.central) continue; const dx = s.x[i] - cx, dy = s.y[i] - cy; if (dx * dx + dy * dy > 1.6) { ix += s.x[i] * s.m[i]; iy += s.y[i] * s.m[i]; im += s.m[i]; } } if (im) { ix /= im; iy /= im; }
  const RT = Math.sqrt(Math.max(im, 0.001)); let n = 0, gN = 0;
  for (let i = 0; i < s.N && n < this.max; i++) {
    if (!s.alive[i] || i === s.central || i === st.bigIdx && s.m[i] > 0.003 && s.central != null) continue;
    const x = s.x[i] - cx, y = s.y[i] - cy, d = Math.hypot(x, y); let h = 0;
    if (s.central == null && d < 1.15) h = this.hz[i] * Math.sqrt(Math.max(0, 1.2 - d * d)) * 0.9;
    else if (im && s.src[i] === 1) { const di = Math.hypot(s.x[i] - ix, s.y[i] - iy); if (di < RT * 1.2) h = this.hz[i] * Math.sqrt(Math.max(0, RT * RT * 1.1 - di * di)) * 0.9; else h = this.hz[i] * 0.04; }
    else h = this.hz[i] * 0.05;
    const r = Math.max(0.035, s.r[i] * (s.m[i] > 0.002 ? 1.3 : 0.95));
    this.m4.makeScale(r, r, r).setPosition(x, h, -y); this.inst.setMatrixAt(n, this.m4);
    const heat = Math.min(1, s.heat[i] * 1.3);
    if (mode === 'mat') this.col.set(s.mat[i] === 0 ? 0xb5523a : 0xc9ccd4);
    else if (mode === 'heat') { this.col.setRGB(0.35 + 1.6 * heat, 0.25 + 1.2 * Math.max(0, heat - 0.35), 0.22 + 0.9 * Math.max(0, heat - 0.7)); }
    else { const f = s.f[i]; this.col.setRGB(0.12 + 0.88 * f, 0.38 + 0.0 * f, 0.95 - 0.88 * f); }
    // molten glow on top of any colouring
    if (mode !== 'heat' && heat > 0.15) { this.col.r += heat * 0.9; this.col.g += heat * 0.35; }
    this.inst.setColorAt(n, this.col); n++;
    if (heat > 0.25 && gN < this.max) { this.gpos[gN * 3] = x; this.gpos[gN * 3 + 1] = h; this.gpos[gN * 3 + 2] = -y; this.gcol[gN * 3] = 1.0 * heat; this.gcol[gN * 3 + 1] = 0.45 * heat; this.gcol[gN * 3 + 2] = 0.12 * heat; gN++; }
  }
  this.inst.count = n; this.inst.instanceMatrix.needsUpdate = true; this.inst.instanceColor.needsUpdate = true;
  this.glow.geometry.setDrawRange(0, gN); this.glow.geometry.attributes.position.needsUpdate = true; this.glow.geometry.attributes.color.needsUpdate = true;
  // Earth sphere after consolidation
  if (s.central != null) { this.earth.visible = true; const c = s.central; this.earth.position.set(s.x[c] - cx, 0, -(s.y[c] - cy)); this.earth.scale.setScalar(s.r[c]); this.earth.rotation.y += 0.004;
    const age = Math.max(0, s.t - (this.tc == null ? (this.tc = s.t) : this.tc)); this.earth.material.emissiveIntensity = Math.max(0.6, 1.6 - age * 0.008); this.halo.material.opacity = Math.max(0.18, 0.5 - age * 0.004);
    if (mode === 'origin') { const f = s.f[c]; this.earth.material.color.setRGB(0.7 + 0.3 * f, 0.8, 1.0 - 0.3 * f); } else this.earth.material.color.setRGB(1, 1, 1);
  } else { this.earth.visible = false; this.tc = null; }
  // Moon sphere once a big moonlet exists
  if (s.central != null && st.bigIdx >= 0 && s.m[st.bigIdx] > 0.003) { const b = st.bigIdx; this.moon.visible = true; this.moon.position.set(s.x[b] - cx, 0, -(s.y[b] - cy)); this.moon.scale.setScalar(Math.max(0.1, 0.273 * Math.cbrt(s.m[b] / 0.0123))); this.moon.rotation.y += 0.01; this.moon.material.emissiveIntensity = 1.4;
    if (mode === 'origin') { const f = s.f[b]; this.moon.material.color.setRGB(0.75 + 0.25 * f, 0.85, 1 - 0.4 * f); } else this.moon.material.color.setRGB(1, 1, 1);
  } else this.moon.visible = false;
  // trail
  if (trail && trail.length > 1) { const a = this.trailGeo.attributes.position.array, k = Math.min(2000, trail.length); for (let j = 0; j < k; j++) { const p = trail[trail.length - k + j]; a[j * 3] = p[0] - cx; a[j * 3 + 1] = 0; a[j * 3 + 2] = -(p[1] - cy); } this.trailGeo.setDrawRange(0, k); this.trailGeo.attributes.position.needsUpdate = true; this.trail.visible = true; } else this.trail.visible = false;
  this.rd.render(this.sc, this.cam);
  if (label) { const v = this.moon.visible ? this.moon.position.clone().project(this.cam) : null; label(v ? [(v.x + 1) / 2, (1 - v.y) / 2] : null); }
};
root.Moon3D = R3D;
})(window);
