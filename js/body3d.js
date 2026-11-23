// ===== Body3D: real-texture 3D view of the Sun, Moon and planets, oriented and lit exactly as seen from Earth now =====
// Orientation from IAU rotation models (Astronomy Engine RotationAxis); lighting from the true Sun direction (phase).
(function (root) {
'use strict';
const D2R = Math.PI / 180;
const DATA = {
  sun: { ar: 'الشمس', en: 'The Sun', tex: 'sun', r: 696000, mass: '1.989×10³⁰ kg', g: 274, day: { ar: '٢٥ يومًا عند الاستواء، و٣٥ عند القطبين', en: '25 d (equator) – 35 d (poles)' }, year: null, moons: null, T: { ar: '٥٧٧٢ ك (السطح)، ١٫٥×١٠⁷ ك (القلب)', en: '5772 K (surface), 1.5×10⁷ K (core)' }, emissive: true },
  moon: { ar: 'القمر', en: 'The Moon', tex: 'moon', bump: 'moon_bump', r: 1737.4, mass: '7.342×10²² kg', g: 1.62, day: { ar: '٢٧٫٣٢ يومًا (دوران متزامن)', en: '27.32 d (synchronous)' }, year: { ar: '٢٧٫٣٢ يومًا حول الأرض', en: '27.32 d around Earth' }, moons: null, T: { ar: '−١٧٣ إلى ١٢٧ °س', en: '−173 to 127 °C' } },
  mer: { ar: 'عطارد', en: 'Mercury', tex: 'mercury', r: 2439.7, mass: '3.301×10²³ kg', g: 3.7, day: { ar: '٥٨٫٦ يومًا', en: '58.6 d' }, year: { ar: '٨٨ يومًا', en: '88 d' }, moons: 0, T: { ar: '−١٨٠ إلى ٤٣٠ °س', en: '−180 to 430 °C' } },
  ven: { ar: 'الزهرة', en: 'Venus', tex: 'venus', atm: 'venus_atm', r: 6051.8, mass: '4.867×10²⁴ kg', g: 8.87, day: { ar: '٢٤٣ يومًا (دوران عكسي)', en: '243 d (retrograde)' }, year: { ar: '٢٢٥ يومًا', en: '225 d' }, moons: 0, T: { ar: '٤٦٤ °س', en: '464 °C' } },
  earth: { ar: 'الأرض', en: 'Earth', tex: 'earth', night: 'earth_night', clouds: 'earth_clouds', r: 6371, mass: '5.972×10²⁴ kg', g: 9.81, day: { ar: '٢٣س ٥٦د', en: '23 h 56 m' }, year: { ar: '٣٦٥٫٢٦ يومًا', en: '365.26 d' }, moons: 1, T: { ar: 'متوسط ١٥ °س', en: 'mean 15 °C' } },
  mar: { ar: 'المريخ', en: 'Mars', tex: 'mars', bump: 'mars_bump', r: 3389.5, mass: '6.417×10²³ kg', g: 3.71, day: { ar: '٢٤س ٣٧د', en: '24 h 37 m' }, year: { ar: '٦٨٧ يومًا', en: '687 d' }, moons: 2, T: { ar: 'متوسط −٦٥ °س', en: 'mean −65 °C' } },
  jup: { ar: 'المشتري', en: 'Jupiter', tex: 'jupiter', r: 69911, mass: '1.898×10²⁷ kg', g: 24.79, day: { ar: '٩س ٥٦د', en: '9 h 56 m' }, year: { ar: '١١٫٨٦ سنة', en: '11.86 yr' }, moons: 95, T: { ar: '−١١٠ °س (قمم السحب)', en: '−110 °C (cloud tops)' }, flat: 0.0649 },
  sat: { ar: 'زحل', en: 'Saturn', tex: 'saturn', ring: 'saturn_ring', r: 58232, mass: '5.683×10²⁶ kg', g: 10.44, day: { ar: '١٠س ٣٤د', en: '10 h 34 m' }, year: { ar: '٢٩٫٤ سنة', en: '29.4 yr' }, moons: 146, T: { ar: '−١٤٠ °س', en: '−140 °C' }, flat: 0.098 },
  ura: { ar: 'أورانوس', en: 'Uranus', tex: 'uranus', r: 25362, mass: '8.681×10²⁵ kg', g: 8.87, day: { ar: '١٧س ١٤د (محوره مائل ٩٨°)', en: '17 h 14 m (axis tilted 98°)' }, year: { ar: '٨٤ سنة', en: '84 yr' }, moons: 28, T: { ar: '−١٩٥ °س', en: '−195 °C' } },
  nep: { ar: 'نبتون', en: 'Neptune', tex: 'neptune', r: 24622, mass: '1.024×10²⁶ kg', g: 11.15, day: { ar: '١٦س ٦د', en: '16 h 6 m' }, year: { ar: '١٦٥ سنة', en: '165 yr' }, moons: 16, T: { ar: '−٢٠٠ °س', en: '−200 °C' } }
};
const AEB = { sun: 'Sun', moon: 'Moon', mer: 'Mercury', ven: 'Venus', earth: 'Earth', mar: 'Mars', jup: 'Jupiter', sat: 'Saturn', ura: 'Uranus', nep: 'Neptune' };
const L = {
  ar: { asSeen: 'كما يُرى من الأرض الآن', free: 'دوّره بحرية', reset: '↺ كما يُرى الآن', diam: 'القطر', mass: 'الكتلة', g: 'الجاذبية السطحية', day: 'طول اليوم', year: 'مدة الدوران حول الشمس', moons: 'عدد الأقمار', T: 'درجة الحرارة', dist: 'البعد الآن', app: 'القطر الظاهري الآن', illum: 'الجزء المضاء', km: 'كم', au: 'و.ف', close: '✕', loading: 'جاري تحميل الخريطة الحقيقية…', credit: 'خرائط الأسطح: NASA وSolar System Scope (CC BY 4.0) وMESSENGER. الاتجاه والإضاءة من نماذج الدوران IAU وحسابات Astronomy Engine.', earthView: 'الأرض الآن من فوق موقعك: الليل والنهار الحقيقيان', noWebGL: 'المتصفح لا يدعم WebGL.' },
  en: { asSeen: 'As seen from Earth now', free: 'Rotate freely', reset: '↺ As seen now', diam: 'Diameter', mass: 'Mass', g: 'Surface gravity', day: 'Day length', year: 'Orbital period', moons: 'Moons', T: 'Temperature', dist: 'Distance now', app: 'Apparent diameter now', illum: 'Illuminated', km: 'km', au: 'AU', close: '✕', loading: 'Loading the real surface map…', credit: 'Surface maps: NASA, Solar System Scope (CC BY 4.0), MESSENGER. Orientation and lighting from IAU rotation models and Astronomy Engine.', earthView: 'Earth now, seen from above your location: the real day and night', noWebGL: 'This browser does not support WebGL.' }
};
let THREEp = null;
function loadThree() { if (window.THREE) return Promise.resolve(); if (THREEp) return THREEp; THREEp = new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'js/three.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); }); return THREEp; }
function css() {
  if (document.getElementById('b3dcss')) return;
  const st = document.createElement('style'); st.id = 'b3dcss';
  st.textContent = `.b3d{position:fixed;inset:0;z-index:50;background:radial-gradient(circle at 50% 40%,#101a3a,#03050c 70%);display:flex;flex-direction:column;color:#e8edf9;font-family:inherit}
  .b3d .hd{display:flex;align-items:center;gap:10px;padding:calc(10px + env(safe-area-inset-top)) 14px 6px}.b3d h2{margin:0;font-size:20px;color:#f1d27a;flex:1}
  .b3d .cv{flex:1;min-height:0;position:relative;touch-action:none}.b3d canvas{width:100%;height:100%;display:block}
  .b3d .tg{display:flex;gap:6px;justify-content:center;padding:6px}.b3d .tg button{padding:7px 12px;border-radius:999px;border:1px solid #ffffff2a;background:#121b38cc;color:#fff;font:inherit;font-size:13px}.b3d .tg button.on{background:#d4a73c;color:#0a0f1e;border-color:#d4a73c}
  .b3d .inf{max-height:34vh;overflow:auto;padding:8px 16px calc(14px + env(safe-area-inset-bottom));display:grid;grid-template-columns:auto 1fr;gap:4px 14px;font-size:13.5px}.b3d .inf b{color:#9fb0d6;font-weight:500}
  .b3d .x{width:38px;height:38px;border-radius:50%;border:1px solid #ffffff2a;background:#121b38;color:#fff;font-size:16px}
  .b3d .ld{position:absolute;inset:0;display:grid;place-items:center;color:#9fb0d6;font-size:14px;pointer-events:none}.b3d .cr{grid-column:1/3;color:#7f8db0;font-size:11px;margin-top:6px}`;
  document.head.appendChild(st);
}
function v3(a) { return [a.x, a.y, a.z]; }
function norm(a) { const r = Math.hypot(a[0], a[1], a[2]); return [a[0] / r, a[1] / r, a[2] / r]; }
function cross(a, b) { return [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]; }
function dot(a, b) { return a[0] * b[0] + a[1] * b[1] + a[2] * b[2]; }
// body-fixed basis (EQJ) from IAU axis: x toward prime meridian, z north pole
function bodyBasis(ax) {
  const n = norm(v3(ax.north)), Z = [0, 0, 1];
  let Q = norm(cross(Z, n)); const W = ax.spin * D2R, nQ = cross(n, Q);
  const x = [Math.cos(W) * Q[0] + Math.sin(W) * nQ[0], Math.cos(W) * Q[1] + Math.sin(W) * nQ[1], Math.cos(W) * Q[2] + Math.sin(W) * nQ[2]];
  return { x, y: cross(n, x), z: n };
}
async function open(id, time, opts) {
  opts = opts || {}; const lang = opts.lang || (window.KH ? KH.getLang() : 'ar'), t = L[lang], d = DATA[id]; if (!d) return;
  const AE = Astronomy, date = new Date(time || Date.now());
  css();
  const el = document.createElement('div'); el.className = 'b3d'; el.dir = lang === 'ar' ? 'rtl' : 'ltr';
  el.innerHTML = `<div class="hd"><h2>${d[lang]}</h2><button class="x">${t.close}</button></div><div class="cv"><canvas></canvas><div class="ld">${t.loading}</div></div>
   <div class="tg"><button class="on" data-m="seen">${id === 'earth' ? t.earthView : t.asSeen}</button><button data-m="free">${t.free}</button></div><div class="inf"></div>`;
  document.body.appendChild(el);
  let alive = true; const close = () => { alive = false; el.remove(); if (renderer) renderer.dispose(); };
  el.querySelector('.x').onclick = close;
  // ---- info ----
  const rows = [[t.diam, `${(d.r * 2).toLocaleString('en')} ${t.km}`], [t.mass, d.mass], [t.g, `${d.g} m/s²`], [t.day, d.day[lang]]];
  if (d.year) rows.push([t.year, d.year[lang]]); if (d.moons != null) rows.push([t.moons, String(d.moons)]); rows.push([t.T, d.T[lang]]);
  let geo = null;
  if (id !== 'earth') {
    geo = id === 'moon' ? AE.GeoMoon(date) : AE.GeoVector(AE.Body[AEB[id]], date, true);
    const dk = geo.Length() * 149597870.7, ang = 2 * Math.atan(d.r / dk) / D2R * 3600;
    rows.push([t.dist, id === 'moon' ? Math.round(dk).toLocaleString('en') + ' ' + t.km : geo.Length().toFixed(4) + ' ' + t.au]);
    rows.push([t.app, ang > 120 ? (ang / 60).toFixed(1) + '′' : ang.toFixed(1) + '″']);
    if (id !== 'sun') rows.push([t.illum, Math.round(AE.Illumination(AE.Body[AEB[id]], date).phase_fraction * 100) + '%']);
  }
  el.querySelector('.inf').innerHTML = rows.map(r => `<b>${r[0]}</b><span>${r[1]}</span>`).join('') + `<div class="cr">${t.credit}</div>`;
  try { await loadThree(); } catch (e) { el.querySelector('.ld').textContent = t.noWebGL; return; }
  if (!alive) return;
  const THREE = window.THREE, cv = el.querySelector('canvas'), box = el.querySelector('.cv');
  let renderer; try { renderer = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true }); } catch (e) { el.querySelector('.ld').textContent = t.noWebGL; return; }
  renderer.setPixelRatio(Math.min(2, devicePixelRatio || 1)); renderer.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.1, 100); cam.position.set(0, 0, 4.6);
  const loader = new THREE.TextureLoader(), tex = n => new Promise(r => loader.load('tex/' + n + (n === 'saturn_ring' ? '.png' : '.jpg'), x => { x.encoding = THREE.sRGBEncoding; x.anisotropy = 4; r(x); }, undefined, () => r(null)));
  // star background
  const sg = new THREE.BufferGeometry(), sp = []; for (let i = 0; i < 1500; i++) { const u = Math.random() * 2 - 1, a = Math.random() * 6.283, r = 40; sp.push(r * Math.sqrt(1 - u * u) * Math.cos(a), r * Math.sqrt(1 - u * u) * Math.sin(a), r * u); }
  sg.setAttribute('position', new THREE.Float32BufferAttribute(sp, 3)); scene.add(new THREE.Points(sg, new THREE.PointsMaterial({ color: 0xffffff, size: 0.08, transparent: true, opacity: 0.7 })));
  const group = new THREE.Group(); scene.add(group);
  const geom = new THREE.SphereGeometry(1, 128, 96);
  const map = await tex(d.tex); if (!alive) return;
  let mat;
  if (d.emissive) mat = new THREE.MeshBasicMaterial({ map });
  else { mat = new THREE.MeshStandardMaterial({ map, roughness: 1, metalness: 0 }); if (d.bump) { const b = await tex(d.bump); if (b) { mat.bumpMap = b; mat.bumpScale = id === 'moon' ? 0.012 : 0.02; } } }
  const mesh = new THREE.Mesh(geom, mat); if (d.flat) mesh.scale.y = 1 - d.flat;
  const holder = new THREE.Group(); holder.add(mesh); group.add(holder);
  if (d.clouds) { const c = await tex(d.clouds); if (c) { const cm = new THREE.Mesh(new THREE.SphereGeometry(1.008, 96, 64), new THREE.MeshStandardMaterial({ map: c, transparent: true, opacity: 0.55, depthWrite: false, blending: THREE.AdditiveBlending })); holder.add(cm); } }
  if (d.night) { const nt = await tex(d.night); if (nt) { mat.emissiveMap = nt; mat.emissive = new THREE.Color(0xffd9a0); mat.emissiveIntensity = 1.1; mat.onBeforeCompile = sh => { sh.fragmentShader = sh.fragmentShader.replace('#include <emissivemap_fragment>', `#include <emissivemap_fragment>\n float nd = dot(normalize(vNormal), normalize((viewMatrix*vec4(uSunDir,0.)).xyz)); totalEmissiveRadiance *= smoothstep(0.15,-0.25,nd);`).replace('void main() {', 'uniform vec3 uSunDir;\nvoid main() {'); sh.uniforms.uSunDir = { value: sunDirW }; }; } }
  if (d.ring) { const rt = await tex(d.ring); if (rt) { const rg = new THREE.RingGeometry(1.24, 2.27, 128, 1); const pos = rg.attributes.position, uv = rg.attributes.uv; for (let i = 0; i < pos.count; i++) { const x = pos.getX(i), y = pos.getY(i); uv.setXY(i, (Math.hypot(x, y) - 1.24) / 1.03, 0.5); } const rm = new THREE.Mesh(rg, new THREE.MeshStandardMaterial({ map: rt, side: THREE.DoubleSide, transparent: true, roughness: 1 })); rm.rotation.x = -Math.PI / 2; holder.add(rm); } }
  if (id === 'sun') { const gl = new THREE.Sprite(new THREE.SpriteMaterial({ color: 0xffb648, transparent: true, opacity: 0.35, blending: THREE.AdditiveBlending, map: glowTex(THREE) })); gl.scale.set(3.6, 3.6, 1); group.add(gl); }
  el.querySelector('.ld').remove();
  // ---- lighting ----
  const sun = new THREE.DirectionalLight(0xffffff, 2.2); scene.add(sun); scene.add(new THREE.AmbientLight(0x223355, id === 'earth' ? 0.25 : 0.08));
  const sunDirW = new THREE.Vector3(0, 0, 1);
  // ---- orientation: map body frame -> camera frame ----
  function orient() {
    const now = new Date(time || Date.now());
    let toObs, up, sunVec;
    if (id === 'earth') {
      // camera above the observer's location, north up
      const loc = window.KH ? KH.getLoc() : { lat: 30, lon: 31 };
      const ax = AE.RotationAxis(AE.Body.Earth, now), B = bodyBasis(ax);
      const la = loc.lat * D2R, lo = loc.lon * D2R, bv = [Math.cos(la) * Math.cos(lo), Math.cos(la) * Math.sin(lo), Math.sin(la)];
      toObs = norm([B.x[0] * bv[0] + B.y[0] * bv[1] + B.z[0] * bv[2], B.x[1] * bv[0] + B.y[1] * bv[1] + B.z[1] * bv[2], B.x[2] * bv[0] + B.y[2] * bv[1] + B.z[2] * bv[2]]);
      const s = AE.GeoVector(AE.Body.Sun, now, true); sunVec = norm(v3(s));
      up = B.z; var Bb = B;
    } else {
      const g = id === 'moon' ? AE.GeoMoon(now) : AE.GeoVector(AE.Body[AEB[id]], now, true); const gp = v3(g);
      toObs = norm([-gp[0], -gp[1], -gp[2]]);
      const hs = id === 'sun' ? [0, 0, 0] : v3(AE.GeoVector(AE.Body.Sun, now, true)); sunVec = id === 'sun' ? toObs : norm([hs[0] - gp[0], hs[1] - gp[1], hs[2] - gp[2]]);
      up = [0, 0, 1]; var Bb = bodyBasis(AE.RotationAxis(AE.Body[AEB[id]], now));
    }
    // camera basis (EQJ): c toward observer, u = north projected, r = u x c
    const c = toObs; let u = [up[0] - dot(up, c) * c[0], up[1] - dot(up, c) * c[1], up[2] - dot(up, c) * c[2]]; u = norm(u); const r = cross(u, c);
    const toCam = v => [dot(v, r), dot(v, u), dot(v, c)];
    const bx = toCam(Bb.x), by = toCam(Bb.y), bz = toCam(Bb.z);
    // three local: +x = lon 0, -z = lon 90E, +y = north pole
    const m = new THREE.Matrix4().set(bx[0], bz[0], -by[0], 0, bx[1], bz[1], -by[1], 0, bx[2], bz[2], -by[2], 0, 0, 0, 0, 1);
    holder.matrixAutoUpdate = false; holder.matrix.copy(m);
    const sc = toCam(sunVec); sun.position.set(sc[0] * 10, sc[1] * 10, sc[2] * 10); sunDirW.set(sc[0], sc[1], sc[2]).normalize();
  }
  orient();
  // ---- interaction ----
  let mode = 'seen', drag = null, rotX = 0, rotY = 0, zoom = 1, pinch = null; const ptr = new Map();
  el.querySelectorAll('.tg button').forEach(b => b.onclick = () => { mode = b.dataset.m; el.querySelectorAll('.tg button').forEach(x => x.classList.toggle('on', x === b)); if (mode === 'seen') { rotX = rotY = 0; zoom = 1; } });
  box.addEventListener('pointerdown', e => { box.setPointerCapture(e.pointerId); ptr.set(e.pointerId, [e.clientX, e.clientY]); if (ptr.size === 2) { const [a, b] = [...ptr.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), z: zoom }; } else drag = [e.clientX, e.clientY]; });
  box.addEventListener('pointermove', e => { if (!ptr.has(e.pointerId)) return; ptr.set(e.pointerId, [e.clientX, e.clientY]); if (pinch && ptr.size === 2) { const [a, b] = [...ptr.values()]; zoom = Math.max(0.6, Math.min(3, pinch.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / pinch.d)); return; } if (!drag) return; rotY += (e.clientX - drag[0]) * 0.008; rotX += (e.clientY - drag[1]) * 0.008; drag = [e.clientX, e.clientY]; if (mode === 'seen') { mode = 'free'; el.querySelectorAll('.tg button').forEach(x => x.classList.toggle('on', x.dataset.m === 'free')); } });
  const up = e => { ptr.delete(e.pointerId); if (ptr.size < 2) pinch = null; if (!ptr.size) drag = null; }; box.addEventListener('pointerup', up); box.addEventListener('pointercancel', up);
  box.addEventListener('wheel', e => { e.preventDefault(); zoom = Math.max(0.6, Math.min(3, zoom * Math.exp(-e.deltaY * 0.001))); }, { passive: false });
  function size() { const w = box.clientWidth, h = box.clientHeight; renderer.setSize(w, h, false); cam.aspect = w / h; cam.fov = w < h ? 30 * Math.min(1.6, h / w) : 30; cam.updateProjectionMatrix(); }
  addEventListener('resize', size); size();
  let last = performance.now();
  (function loop(now) { if (!alive) return; const dt = (now - last) / 1000; last = now;
    if (mode === 'free' && !drag) rotY += dt * 0.15;
    group.rotation.set(rotX, rotY, 0); cam.position.z = (d.ring ? 7.2 : 4.6) / zoom; if (!time) orient();
    renderer.render(scene, cam); requestAnimationFrame(loop); })(last);
}
function glowTex(THREE) { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 20, 64, 64, 64); gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); return new THREE.CanvasTexture(c); }
root.Body3D = { open, DATA, css };
})(window);

// ===== Star3D: physically-based view of a star (colour from T_eff, size from R), side by side with the Sun to scale =====
(function (root) {
'use strict';
// HIP: [spectral type, distance ly, radius R☉, T_eff K, luminosity L☉, note-ar, note-en]
const S = {
  32349: ['A1V', 8.6, 1.71, 9940, 25.4, 'ألمع نجم في سماء الليل. له رفيق قزم أبيض (الشعرى ب) بحجم الأرض تقريبًا.', 'Brightest star in the night sky; its companion Sirius B is a white dwarf about the size of Earth.'],
  30438: ['A9II', 310, 71, 7350, 10700, 'ثاني ألمع نجم في السماء، عملاق لامع تستخدمه المركبات الفضائية مرجعًا للتوجيه.', 'Second-brightest star, a bright giant used for spacecraft navigation.'],
  69673: ['K1.5III', 36.7, 25.4, 4290, 170, 'عملاق برتقالي في مرحلة متقدمة من حياته، يعطينا صورة لمستقبل الشمس بعد نحو ٥ مليارات سنة.', 'An orange giant, a preview of the Sun in about 5 billion years.'],
  71683: ['G2V', 4.37, 1.22, 5790, 1.52, 'من أقرب نظام نجمي إلينا، وهو شبيه جدًا بالشمس.', 'Part of the nearest star system; very Sun-like.'],
  91262: ['A0V', 25, 2.6, 9600, 40, 'معيار القدر صفر، وتدور بسرعة كبيرة فيبدو شكلها مفلطحًا.', 'The zero-magnitude standard; a fast rotator, visibly flattened.'],
  24608: ['G8III', 42.9, 12, 4970, 79, 'نظام من عملاقين أصفرين.', 'A system of two yellow giants.'],
  24436: ['B8Ia', 860, 79, 12100, 120000, 'عملاق أزرق فائق، تفوق إضاءته إضاءة الشمس ١٢٠ ألف مرة.', 'A blue supergiant, ~120,000 times more luminous than the Sun.'],
  37279: ['F5IV-V', 11.5, 2.05, 6530, 7, 'له رفيق قزم أبيض.', 'Has a white-dwarf companion.'],
  7588: ['B6Vep', 139, 9.2, 15000, 3150, 'أكثر النجوم المعروفة تفلطحًا بسبب دورانه السريع جدًا.', 'The most flattened star known, from extremely fast rotation.'],
  27989: ['M1-2Ia', 550, 764, 3600, 90000, 'عملاق أحمر فائق يقترب من نهاية حياته، وسينفجر مستعرًا أعظم. لو وُضع مكان الشمس لابتلع مدار المريخ. وهو من النجوم القليلة التي صُوِّرت قرصًا (ALMA وVLT). نصف قطره غير مؤكد (نحو ٦٤٠–١٠٠٠ R☉).', 'A red supergiant near the end of its life, a future supernova. In the Sun\'s place it would swallow Mars\'s orbit. One of few stars imaged as a disc (ALMA, VLT).'],
  97649: ['A7V', 16.7, 1.8, 7700, 10.6, 'يدور حول نفسه مرة كل ٩ ساعات تقريبًا، وصُوِّر سطحه بمقياس التداخل CHARA.', 'Spins in about 9 hours; its surface was imaged with the CHARA interferometer.'],
  21421: ['K5III', 65, 44, 3900, 440, 'عين الثور، عملاق برتقالي.', 'The eye of Taurus, an orange giant.'],
  80763: ['M1.5Iab', 550, 680, 3660, 75000, 'عملاق أحمر فائق، صُوِّر سطحه بمقياس التداخل VLTI.', 'A red supergiant whose surface was imaged by the VLTI.'],
  65474: ['B1III-IV', 250, 7.5, 25300, 20500, 'نجمان أزرقان حاران في مدار متقارب جدًا.', 'Two hot blue stars in a very close orbit.'],
  37826: ['K0III', 33.8, 9.1, 4670, 33, 'عملاق برتقالي يدور حوله كوكب.', 'An orange giant with a known planet.'],
  113368: ['A3V', 25, 1.84, 8590, 16.6, 'محاط بقرص من الحطام.', 'Surrounded by a debris disc.'],
  102098: ['A2Ia', 2600, 200, 8500, 200000, 'من أشد النجوم إضاءة في المجرة، وما زال بعده غير مؤكد.', 'One of the most luminous stars known; its distance is uncertain.'],
  49669: ['B8IVn', 79, 4.35, 12500, 300, 'يدور بسرعة قريبة من حد التمزق.', 'Rotates close to break-up speed.'],
  25336: ['B2III', 250, 5.75, 21800, 9200, '', ''],
  11767: ['F7Ib', 433, 37.5, 6000, 1260, 'نجم متغير قيفاوي، وهو الذي يدل على الشمال.', 'A Cepheid variable that marks true north.'],
  26311: ['B0Ia', 1200, 42, 27500, 275000, 'النجم الأوسط في حزام الجبار.', 'The middle star of Orion\'s Belt.'],
  26727: ['O9.5Iab', 1260, 20, 29000, 250000, '', ''],
  25930: ['O9.5II', 1200, 16.5, 29500, 190000, '', ''],
  54061: ['K0III', 123, 30, 4660, 316, '', ''],
  53910: ['A1V', 79.7, 3.0, 9200, 58, '', ''],
  10826: ['M7IIIe', 300, 330, 3000, 9000, 'أول نجم متغير دوري اكتُشف، ويتغير لمعانه نحو ١٠٠ مرة.', 'The first periodic variable discovered; its brightness changes about 100-fold.'],
  14576: ['B8V', 90, 2.7, 12500, 182, 'نجم ثنائي كسوفي يخفت كل ٢٫٨٧ يوم، ومن هنا جاء اسمه «الغول».', 'An eclipsing binary that dims every 2.87 days.'],
  15863: ['F5Ib', 510, 68, 6350, 5000, '', ''], 72607: ['K4III', 131, 42, 4030, 390, '', ''], 9884: ['K2III', 66, 15, 4480, 91, '', ''],
  57632: ['A3V', 36, 1.7, 8500, 15, '', ''], 46390: ['K3II-III', 177, 50, 4120, 780, '', ''], 107315: ['K2Ib', 690, 185, 4380, 5000, '', ''],
  67301: ['B3V', 104, 3.4, 15500, 594, '', ''], 62956: ['A1III-IVp', 83, 4.1, 9020, 102, '', ''], 85927: ['B2IV', 570, 8.8, 25000, 36300, '', '']
};
function bvToT(bv) { return 4600 * (1 / (0.92 * bv + 1.7) + 1 / (0.92 * bv + 0.62)); } // Ballesteros (2012)
function tToRGB(T) { // Planckian locus approximation (Tanner Helland), returns [r,g,b] 0..255
  const t = T / 100; let r, g, b;
  if (t <= 66) { r = 255; g = 99.4708025861 * Math.log(t) - 161.1195681661; b = t <= 19 ? 0 : 138.5177312231 * Math.log(t - 10) - 305.0447927307; }
  else { r = 329.698727446 * Math.pow(t - 60, -0.1332047592); g = 288.1221695283 * Math.pow(t - 60, -0.0755148492); b = 255; }
  const m = (r + g + b) / 3, k = 1.0; return [r, g, b].map(v => Math.max(0, Math.min(255, m + (v - m) * k)));
}
function surfaceTex(THREE, T, size) {
  const c = document.createElement('canvas'); c.width = size * 2; c.height = size; const g = c.getContext('2d'), [r, gg, b] = tToRGB(T);
  g.fillStyle = `rgb(${r},${gg},${b})`; g.fillRect(0, 0, c.width, c.height);
  // convection cells: many small granules for dwarfs/giants, a few huge cells for supergiants (as in 3D RHD models of Betelgeuse)
  const giant = T < 4300, n = giant ? 90 : 5000, rad = giant ? size * 0.16 : size * 0.012;
  for (let pass = 0; pass < 2; pass++) for (let i = 0; i < n; i++) {
    const x = Math.random() * c.width, y = Math.random() * c.height, rr = rad * (0.6 + Math.random() * 0.8), bright = pass === 0;
    const k = bright ? 1.18 : 0.78, col = `${Math.min(255, r * k) | 0},${Math.min(255, gg * k) | 0},${Math.min(255, b * k) | 0}`;
    const gr = g.createRadialGradient(x, y, 0, x, y, rr); gr.addColorStop(0, `rgba(${col},${bright ? 0.22 : 0.18})`); gr.addColorStop(1, `rgba(${col},0)`);
    g.fillStyle = gr; g.beginPath(); g.arc(x, y, rr, 0, 7); g.fill();
  }
  const tx = new THREE.CanvasTexture(c); tx.encoding = THREE.sRGBEncoding; return tx;
}
function starMat(THREE, map) { // limb darkening I(mu) = 1 - u(1-mu)
  const m = new THREE.MeshBasicMaterial({ map });
  m.onBeforeCompile = sh => { sh.vertexShader = sh.vertexShader.replace('#include <common>', '#include <common>\nvarying vec3 vN; varying vec3 vV;').replace('#include <project_vertex>', '#include <project_vertex>\n vN = normalize(normalMatrix*normal); vV = normalize(-mvPosition.xyz);');
    sh.fragmentShader = sh.fragmentShader.replace('#include <common>', '#include <common>\nvarying vec3 vN; varying vec3 vV;').replace('#include <dithering_fragment>', '#include <dithering_fragment>\n float mu = clamp(dot(vN, vV), 0.0, 1.0); gl_FragColor.rgb *= (1.0 - 0.6*(1.0-mu));'); };
  return m;
}
async function openStar(o) {
  const lang = o.lang || 'ar', d = S[o.hip], T = d ? d[3] : Math.round(bvToT(o.bv)), R = d ? d[2] : null;
  const AR = lang === 'ar';
  if (window.Body3D) Body3D.css();
  const el = document.createElement('div'); el.className = 'b3d'; el.dir = AR ? 'rtl' : 'ltr';
  el.innerHTML = `<div class="hd"><h2>${o.name}</h2><button class="x">✕</button></div><div class="cv"><canvas></canvas></div>
   <div class="tg">${R ? `<button class="on" data-m="star">${AR ? 'النجم' : 'The star'}</button><button data-m="cmp">${AR ? 'مقارنة بالشمس بنفس المقياس' : 'Compared with the Sun to scale'}</button>` : ''}</div><div class="inf"></div>`;
  document.body.appendChild(el);
  // make sure styles exist
  if (!document.getElementById('b3dcss') && window.Body3D) { /* styles are injected by Body3D.open; inject minimal */ }
  const rows = [];
  if (d) rows.push([AR ? 'النوع الطيفي' : 'Spectral type', d[0]], [AR ? 'البعد' : 'Distance', (d[1] >= 100 ? Math.round(d[1]) : d[1]) + (AR ? ' سنة ضوئية' : ' light-years')], [AR ? 'نصف القطر' : 'Radius', d[2] + ' R☉ = ' + Math.round(d[2] * 696000).toLocaleString('en') + ' km'], [AR ? 'الإضاءة' : 'Luminosity', d[4].toLocaleString('en') + ' L☉']);
  rows.push([AR ? 'حرارة السطح' : 'Surface temperature', T.toLocaleString('en') + ' K' + (d ? '' : (AR ? ' (مقدّرة من اللون B−V)' : ' (estimated from B−V colour)'))]);
  if (o.mag != null) rows.push([AR ? 'القدر الظاهري' : 'Apparent magnitude', o.mag.toFixed(2)]);
  if (d && d[1] && d[4]) rows.push([AR ? 'غادر الضوء الذي تراه الآن النجمَ عام' : 'The light you see left it in', String(Math.round(new Date().getFullYear() - d[1]))]);
  el.querySelector('.inf').innerHTML = rows.map(r => `<b>${r[0]}</b><span>${r[1]}</span>`).join('') + (d && d[AR ? 5 : 6] ? `<div style="grid-column:1/3;margin-top:6px;line-height:1.7">${d[AR ? 5 : 6]}</div>` : '') +
    `<div class="cr">${AR ? 'تنبيه علمي: تبدو معظم النجوم من الأرض نقاطًا مهما بلغ التكبير. هذا الشكل مرسوم وفق الفيزياء: اللون من حرارة السطح (منحنى بلانك)، والحجم من نصف القطر المقيس، وإظلام الحافة وخلايا الحمل من نماذج الأغلفة الجوية النجمية. ولم يُصوَّر سطح إلا عدد قليل من النجوم بمقاييس التداخل، مثل منكب الجوزاء وقلب العقرب والنسر الطائر.' : 'Note: most stars appear as points however much we magnify them. This view is physically based: colour from surface temperature (Planck curve), size from the measured radius, limb darkening and convection cells from stellar-atmosphere models. Only a handful of stars (Betelgeuse, Antares, Altair) have been imaged as discs by interferometry.'}</div>`;
  let alive = true; el.querySelector('.x').onclick = () => { alive = false; el.remove(); if (rd) rd.dispose(); };
  if (!window.THREE) await new Promise((res, rej) => { const s = document.createElement('script'); s.src = 'js/three.min.js'; s.onload = res; s.onerror = rej; document.head.appendChild(s); });
  const THREE = window.THREE, cv = el.querySelector('canvas'), box = el.querySelector('.cv'); var rd = new THREE.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
  rd.setPixelRatio(Math.min(2, devicePixelRatio || 1)); rd.outputEncoding = THREE.sRGBEncoding;
  const scene = new THREE.Scene(), cam = new THREE.PerspectiveCamera(30, 1, 0.01, 1e6); cam.position.set(0, 0, 4.6);
  const glow = (col, s) => { const c = document.createElement('canvas'); c.width = c.height = 128; const g = c.getContext('2d'), gr = g.createRadialGradient(64, 64, 18, 64, 64, 64); gr.addColorStop(0, `rgba(${col[0] | 0},${col[1] | 0},${col[2] | 0},0.9)`); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 128, 128); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, blending: THREE.AdditiveBlending, depthWrite: false })); sp.scale.set(s, s, 1); return sp; };
  const star = new THREE.Group(), sm = new THREE.Mesh(new THREE.SphereGeometry(1, 96, 64), starMat(THREE, surfaceTex(THREE, T, 512)));
  star.add(sm); const sgl = glow(tToRGB(T), 2.9); sgl.material.opacity = 0.45; star.add(sgl); scene.add(star);
  // comparison: Sun to scale + Earth orbit ring when relevant
  const cmp = new THREE.Group(); scene.add(cmp); cmp.visible = false;
  const label = (txt, col) => { const c = document.createElement('canvas'); c.width = 512; c.height = 96; const g = c.getContext('2d'); g.font = 'bold 44px Tahoma, sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(txt, 256, 48); const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(c), transparent: true, depthTest: false })); sp.renderOrder = 10; const k = R && R > 150 ? 1.6 : 0.8; sp.scale.set(k, k * 0.19, 1); return sp; };
  if (R) {
    const sr = 1 / R, sunPos = new THREE.Vector3(1 + Math.max(sr, 0.02) * 1.6 + 0.08, 0, 0.2);
    const sun = new THREE.Mesh(new THREE.SphereGeometry(sr, 48, 32), starMat(THREE, surfaceTex(THREE, 5772, 256))); sun.position.copy(sunPos); cmp.add(sun);
    const sg = glow(tToRGB(5772), Math.max(sr * 3.4, 0.05)); sg.position.copy(sunPos); cmp.add(sg);
    if (sr < 0.05) { const mk = new THREE.Mesh(new THREE.RingGeometry(0.035, 0.042, 48), new THREE.MeshBasicMaterial({ color: 0xf1d27a, depthTest: false, transparent: true })); mk.position.copy(sunPos); mk.renderOrder = 9; cmp.add(mk); }
    const sl = label(AR ? 'الشمس' : 'Sun', '#f1d27a'); sl.position.set(sunPos.x, sunPos.y - Math.max(sr, 0.04) - 0.12, sunPos.z); cmp.add(sl);
    [[215.03, 0x4ea3ff, AR ? 'مدار الأرض' : "Earth's orbit"], [327.6, 0xff7a45, AR ? 'مدار المريخ' : "Mars's orbit"], [1118, 0xf2d3a2, AR ? 'مدار المشتري' : "Jupiter's orbit"]].forEach(([au, col, nm], k) => {
      const rr = au / R; if (rr > 3.2 || rr < 0.05) return;
      const ring = new THREE.Mesh(new THREE.RingGeometry(rr * 0.982, rr, 256), new THREE.MeshBasicMaterial({ color: col, side: THREE.DoubleSide, transparent: true, opacity: 0.95, depthTest: false })); ring.renderOrder = 8; ring.position.z = 0.0; cmp.add(ring);
      const l = label(nm, '#' + col.toString(16).padStart(6, '0')); l.position.set(0, rr + 0.1, 0); cmp.add(l); });
    if (R > 150) { const t2 = label(AR ? 'لو النجم مكان الشمس:' : 'If it replaced the Sun:', '#ffffff'); t2.position.set(0, 1.45, 0); t2.scale.set(1.2, 0.22, 1); cmp.add(t2); }
  }
  el.querySelectorAll('.tg button').forEach(b => b.onclick = () => { el.querySelectorAll('.tg button').forEach(x => x.classList.toggle('on', x === b)); const c = b.dataset.m === 'cmp'; cmp.visible = c; const big = R > 150; sm.material.transparent = c && big; sm.material.opacity = c && big ? 0.35 : 1;
    const sr = 1 / R, sx = 1 + Math.max(sr, 0.02) * 1.6 + 0.08, half = big ? Math.max(1.3, Math.min(3.3, 1118 / R) + 0.3) : (sx + Math.max(sr, 0.02) + 1) / 2 + 0.6;
    shift = c && !big ? -(sx - 1) / 2 : 0; tgt = c ? half / (Math.tan(15 * Math.PI / 180) * Math.min(1, cam.aspect)) : 4.6; });
  let tgt = 4.6, ry = 0, drag = null, zoom = 1, shift = 0;
  box.addEventListener('pointerdown', e => { box.setPointerCapture(e.pointerId); drag = e.clientX; }); box.addEventListener('pointermove', e => { if (drag == null) return; ry += (e.clientX - drag) * 0.01; drag = e.clientX; }); box.addEventListener('pointerup', () => drag = null);
  box.addEventListener('wheel', e => { e.preventDefault(); zoom = Math.max(0.3, Math.min(8, zoom * Math.exp(-e.deltaY * 0.001))); }, { passive: false });
  const size = () => { const w = box.clientWidth, h = box.clientHeight; rd.setSize(w, h, false); cam.aspect = w / h; cam.updateProjectionMatrix(); }; addEventListener('resize', size); size();
  (function loop() { if (!alive) return; sm.rotation.y += 0.002; star.rotation.y = ry; star.position.x += (shift - star.position.x) * 0.1; cmp.position.x = star.position.x; cam.position.z += (tgt / zoom - cam.position.z) * 0.08; rd.render(scene, cam); requestAnimationFrame(loop); })();
}
root.Star3D = { open: openStar, DATA: S, bvToT };
})(window);
