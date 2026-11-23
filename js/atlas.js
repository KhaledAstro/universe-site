// ===== Sky Atlas — Khaled Mohamed =====
(function () {
'use strict';
const A = Astro, SD = SKYDATA, D2R = A.D2R, R2D = A.R2D;
const $ = id => document.getElementById(id);
let lang = KH.getLang(), loc = KH.getLoc();

// ---------- i18n ----------
const T = {
  ar: { title: 'أطلس السماء', cHere: '📍 سماء موقعي', cDome: '◯ القبة كاملة', cGyro: '📱 وجّه هاتفك', cPolaris: '⭐ ابحث عن النجم القطبي', cNow: '🔭 في السماء الآن', cSearch: '🔍 بحث',
    tLayers: 'الطبقات', tPlace: 'المكان والوقت', tNow: 'الآن', tSearch: 'بحث', tAbout: 'عن الأطلس',
    city: 'المدينة', useGeo: '📍 استخدم موقعي الحالي', lat: 'خط العرض (°)', lon: 'خط الطول (°)', applyLL: 'تطبيق الإحداثيات', dateTime: 'التاريخ والوقت (بتوقيت المكان)', applyDT: 'اذهب لهذا الوقت', now: 'الآن',
    live: '● مباشر', paused: '⏸ متوقف', sim: '▶ محاكاة', custom: 'موقع مخصص', myLoc: 'موقعي',
    L: { lines: 'خطوط الكوكبات', cnames: 'أسماء الكوكبات', snames: 'أسماء النجوم', planets: 'الشمس والقمر والكواكب', messier: 'أجرام مسييه (سدم ومجرات وعناقيد)', mw: 'درب التبانة', altaz: 'شبكة السمت والارتفاع', eqgrid: 'شبكة المطلع المستقيم والميل', equator: 'خط الاستواء السماوي', ecliptic: 'دائرة البروج', meridian: 'خط الزوال', ground: 'الأرض (إخفاء ما تحت الأفق)', refr: 'الانكسار الجوي (المواقع الظاهرية)', mansions: 'منازل القمر الثمانية والعشرون', atmosphere: 'الغلاف الجوي (لون السماء نهارًا)', cardinals: 'الاتجاهات' },
    star: 'نجم', planet: 'كوكب', sunT: 'نجم — مركز المجموعة الشمسية', moonT: 'تابع الأرض', cons: 'كوكبة', mtypes: { globular: 'عنقود نجمي كروي', open: 'عنقود نجمي مفتوح', planetary: 'سديم كوكبي', nebula: 'سديم', snr: 'بقايا مستعر أعظم', galaxy: 'مجرة', as: 'تجمع نجمي', dn: 'سديم مظلم', ds: 'نجم مزدوج' },
    mag: 'القدر الظاهري', ra: 'المطلع المستقيم', dec: 'الميل', alt: 'الارتفاع', az: 'السمت', rise: 'الشروق', transit: 'العبور (الزوال)', set: 'الغروب', dist: 'البعد', phase: 'الطور', illum: 'نسبة الإضاءة', age: 'عمر القمر', inCons: 'في كوكبة', below: 'تحت الأفق الآن', circum: 'لا يغرب أبدًا من هذا الموقع (حول قطبي)', never: 'لا يشرق من هذا الموقع', none: '—', center: 'توسيط', path: 'المسار اليومي', km: 'كم', au: 'و.ف', days: 'يوم', abbr: 'الاختصار',
    phases: ['محاق (قمر جديد)', 'هلال متزايد', 'تربيع أول', 'أحدب متزايد', 'بدر', 'أحدب متناقص', 'تربيع ثانٍ', 'هلال متناقص'],
    dirs: { N: 'ش', E: 'ق', S: 'ج', W: 'غ', NE: 'شق', SE: 'جق', SW: 'جغ', NW: 'شغ' },
    noGyro: 'لا يحتوي هذا الجهاز على مستشعر اتجاه. جرّب الميزة من الهاتف المحمول.', sandboxGyro: 'يمنع عارض Claude الصفحات من الوصول إلى مستشعرات الهاتف وإلى الموقع الجغرافي. افتح نسخة الويب المستقلة لتعمل هذه الميزة.', gyroOn: 'وجّه ظهر الهاتف نحو السماء', geoErr: 'تعذّر تحديد الموقع', geoOk: 'تم تحديد موقعك', searchPh: 'اكتب اسم نجم أو كوكب أو كوكبة…',
    nowHead: 'فوق الأفق الآن', bright: 'ألمع النجوم الظاهرة', nothing: 'لا شيء', aboveH: 'ارتفاع', mirror: 'ملاحظة: الكرة السماوية هنا مرئية من الخارج، فالكوكبات تظهر معكوسة كما على الكرات السماوية القديمة.',
    ncp: 'القطب السماوي الشمالي', scp: 'القطب السماوي الجنوبي', zenith: 'سمت الرأس', you: 'أنت',
    tz: 'المنطقة الزمنية', speeds: ['وقت حقيقي', 'دقيقة/ث', '١٠ دقائق/ث', 'ساعة/ث', 'يوم/ث', 'يوم فلكي/ث'],
    polarisT: 'إيجاد النجم القطبي (الجدي)', polarisSteps: lat => [
      'اتجه نحو <b>الشمال</b>، وابحث عن <b>بنات نعش الكبرى</b> (المغرفة في كوكبة الدب الأكبر)، سبعة نجوم لامعة.',
      'النجمان الأخيران في طرف المغرفة هما <b>الدليلان</b>: <b>المِراق</b> (β) ثم <b>الدُّبّ</b> (α).',
      'مُدّ الخط من المراق إلى الدبّ حوالي <b>٥ أضعاف</b> المسافة بينهما؛ ستصل إلى نجم متوسط اللمعان وحيد: <b>الجدي</b> (النجم القطبي، α من الدب الأصغر).',
      'ارتفاع الجدي عن الأفق يساوي تقريبًا <b>خط عرضك</b>. أنت الآن على خط عرض ' + lat + '°، والجدي على ارتفاع <b id="polAlt"></b>.',
      'نقطة الأفق الواقعة تحت الجدي هي <b>الشمال الحقيقي</b>. استخدمها الملاحون العرب لتحديد الاتجاه والعرض الجغرافي.'],
    polarisSouth: 'أنت في نصف الكرة الجنوبي، والجدي تحت الأفق؛ ابحث بدلًا منه عن الصليب الجنوبي.',
    aboutHTML: `<div class="who">${KH.logoSVG(54)}<div><b style="color:var(--gold-l);font-size:16px">خالد محمد</b><br><small style="color:var(--muted)">معيد الفيزياء، جامعة قازان الفيدرالية – فرع القاهرة<br>باحث ماجستير في فيزياء الشمس، قسم الفلك وعلوم الفضاء والأرصاد الجوية، كلية العلوم، جامعة القاهرة</small></div></div>
      <p>عضو <b>الجمعية الفلكية الأفريقية (AfAS)</b> و<b>الاتحاد العربي لعلوم الفلك والفضاء (AUASS)</b>.</p>
      <p>أطلس تفاعلي يحسب مواقع النجوم والشمس والقمر والكواكب لحظيًا لموقعك. الحسابات مبنية على: الزمن النجمي (Meeus 12.4)، والمبادرة من J2000 (Meeus 21)، ونظرية القمر المختصرة (Meeus 47)، وعناصر JPL المدارية التقريبية للكواكب. اختُبرت الدقة مقابل مكتبة Astropy، والخطأ أقل من ٥′ قوسية.</p>
      <p><b>البيانات:</b> كتالوج هيباركوس/يايل للنجوم حتى القدر ٦ (٥٠٤٤ نجمًا)، وخطوط الكوكبات وحدودها والأسماء العربية من مشروع d3-celestial (Olaf Frohn، رخصة BSD)، وكتالوج مسييه، ونموذج درب التبانة.</p>
      <p style="color:var(--muted);font-size:12px">يعمل بدون إنترنت بالكامل.</p>` },
  en: { title: 'Sky Atlas', cHere: '📍 My sky', cDome: '◯ Full dome', cGyro: '📱 Point your phone', cPolaris: '⭐ Find the North Star', cNow: '🔭 Up now', cSearch: '🔍 Search',
    tLayers: 'Layers', tPlace: 'Place & time', tNow: 'Now', tSearch: 'Search', tAbout: 'About',
    city: 'City', useGeo: '📍 Use my current location', lat: 'Latitude (°)', lon: 'Longitude (°)', applyLL: 'Apply coordinates', dateTime: 'Date & time (local to place)', applyDT: 'Go to this time', now: 'Now',
    live: '● Live', paused: '⏸ Paused', sim: '▶ Simulating', custom: 'Custom location', myLoc: 'My location',
    L: { lines: 'Constellation lines', cnames: 'Constellation names', snames: 'Star names', planets: 'Sun, Moon & planets', messier: 'Messier objects (nebulae, galaxies, clusters)', mw: 'Milky Way', altaz: 'Alt-azimuth grid', eqgrid: 'RA/Dec grid', equator: 'Celestial equator', ecliptic: 'Ecliptic', meridian: 'Meridian', ground: 'Ground (hide below horizon)', refr: 'Atmospheric refraction (apparent positions)', mansions: 'The 28 Arabic lunar mansions', atmosphere: 'Atmosphere (daytime sky)', cardinals: 'Cardinal points' },
    star: 'Star', planet: 'Planet', sunT: 'Star at the centre of the Solar System', moonT: "Earth's satellite", cons: 'Constellation', mtypes: { globular: 'Globular cluster', open: 'Open cluster', planetary: 'Planetary nebula', nebula: 'Nebula', snr: 'Supernova remnant', galaxy: 'Galaxy', as: 'Asterism', dn: 'Dark nebula', ds: 'Double star' },
    mag: 'Apparent magnitude', ra: 'Right ascension', dec: 'Declination', alt: 'Altitude', az: 'Azimuth', rise: 'Rise', transit: 'Transit', set: 'Set', dist: 'Distance', phase: 'Phase', illum: 'Illuminated', age: 'Moon age', inCons: 'In', below: 'Below the horizon now', circum: 'Never sets here (circumpolar)', never: 'Never rises here', none: '—', center: 'Center', path: 'Daily path', km: 'km', au: 'AU', days: 'days', abbr: 'Abbreviation',
    phases: ['New Moon', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full Moon', 'Waning gibbous', 'Last quarter', 'Waning crescent'],
    dirs: { N: 'N', E: 'E', S: 'S', W: 'W', NE: 'NE', SE: 'SE', SW: 'SW', NW: 'NW' },
    noGyro: 'This device has no orientation sensor. Try it on a phone.', sandboxGyro: 'The Claude viewer blocks pages from using phone sensors and location. Open the standalone web version for this feature.', gyroOn: 'Point the back of your phone at the sky', geoErr: 'Could not get your location', geoOk: 'Location set', searchPh: 'Type a star, planet or constellation…',
    nowHead: 'Above the horizon now', bright: 'Brightest visible stars', nothing: 'Nothing', aboveH: 'alt', mirror: 'Note: this celestial sphere is seen from outside, so constellations appear mirror-reversed, as on antique celestial globes.',
    ncp: 'North celestial pole', scp: 'South celestial pole', zenith: 'Zenith', you: 'You',
    tz: 'Time zone', speeds: ['Real time', '1 min/s', '10 min/s', '1 h/s', '1 day/s', '1 sidereal day/s'],
    polarisT: 'Finding the North Star (Polaris)', polarisSteps: lat => [
      'Face <b>north</b> and find the <b>Big Dipper</b> (the ladle in Ursa Major), seven bright stars.',
      'The two stars at the end of the bowl are the <b>Pointers</b>: <b>Merak</b> (β) then <b>Dubhe</b> (α).',
      'Extend the line from Merak through Dubhe about <b>5×</b> their separation; you reach a lone, medium-bright star: <b>Polaris</b> (α UMi).',
      'Polaris\' altitude above the horizon ≈ your <b>latitude</b>. You are at ' + lat + '°, and Polaris is at <b id="polAlt"></b>.',
      'The horizon point below Polaris is <b>true north</b>, which Arab navigators used to find direction and latitude.'],
    polarisSouth: 'You are in the southern hemisphere, so Polaris is below the horizon. Look for the Southern Cross instead.',
    aboutHTML: `<div class="who">${KH.logoSVG(54)}<div><b style="color:var(--gold-l);font-size:16px">Khaled Mohamed</b><br><small style="color:var(--muted)">Physics TA, Kazan Federal University – Cairo Branch<br>MSc researcher in solar physics, Astronomy, Space Science & Meteorology Dept., Faculty of Science, Cairo University</small></div></div>
      <p>Member of the <b>African Astronomical Society (AfAS)</b> and the <b>Arab Union for Astronomy and Space Sciences (AUASS)</b>.</p>
      <p>An interactive atlas that computes the positions of stars, the Sun, the Moon and the planets in real time for your location. Methods: sidereal time (Meeus 12.4), precession from J2000 (Meeus 21), abridged lunar theory (Meeus 47) and JPL approximate planetary elements. Checked against Astropy: errors are below 5 arcmin.</p>
      <p><b>Data:</b> Hipparcos/Yale bright stars to mag 6 (5044 stars), constellation lines and Arabic names from d3-celestial (Olaf Frohn, BSD licence), the Messier catalogue and a Milky Way model.</p>
      <p style="color:var(--muted);font-size:12px">Works fully offline.</p>` }
};
const t = k => T[lang][k];

// ---------- state ----------
const defLayers = { lines: true, cnames: true, snames: true, planets: true, messier: false, mw: true, altaz: false, eqgrid: false, equator: false, ecliptic: true, meridian: false, ground: true, refr: true, mansions: false, atmosphere: true, cardinals: true };
const st = {
  mode: KH.store.get('mode', '2d'),
  live: true, t: Date.now(), rate: 0, dir: 1, speedIdx: 2,
  view: Object.assign({ az: 180, alt: 35, fov: 110 }, KH.store.get('view', {})),
  cam3: Object.assign({ yaw: -125, pitch: 24, zoom: 1 }, KH.store.get('cam3', {})),
  layers: Object.assign({}, defLayers, KH.store.get('layers', {})),
  gyro: false, sel: null, path: false, guide: null, fly: null, dirty: true
};
const SPEEDS = [1, 60, 600, 3600, 86400, 86164.09];

// ---------- precompute catalog vectors ----------
const NS = SD.S.length;
const sV = new Float64Array(NS * 3), sMag = new Float32Array(NS), sBV = new Float32Array(NS);
SD.S.forEach((s, i) => { const v = A.radec2vec(s[0], s[1]); sV[i * 3] = v[0]; sV[i * 3 + 1] = v[1]; sV[i * 3 + 2] = v[2]; sMag[i] = s[2]; sBV[i] = s[3]; });
const sH = new Float64Array(NS * 3);
const starName = {}; // idx -> {en, ar, des, c, hip}
for (const k in SD.N) { const n = SD.N[k]; starName[k] = { en: n[0], ar: n[1], des: n[2], c: n[3], hip: n[4] }; }
const hipIdx = {}; for (const k in starName) hipIdx[starName[k].hip] = +k;
const consList = Object.keys(SD.C).map(id => { const c = SD.C[id]; return { id, en: c[0], ar: c[1], v: A.radec2vec(c[2], c[3]), rank: c[4] }; });
const consMap = {}; consList.forEach(c => consMap[c.id] = c);
const consLines = {}; for (const id in SD.L) consLines[id] = SD.L[id].map(seg => seg.map(p => A.radec2vec(p[0], p[1])));
const messier = SD.M.map(m => ({ id: m[0], en: m[1], ar: m[2], v: A.radec2vec(m[3], m[4]), mag: m[5], type: m[6], ra: m[3], de: m[4] }));
const eclJ2000 = []; { const e = 23.43928 * D2R; for (let l = 0; l <= 360; l += 2) { const L = l * D2R; eclJ2000.push([Math.cos(L), Math.sin(L) * Math.cos(e), Math.sin(L) * Math.sin(e)]); } }
const PCOL = { sun: '#ffd75e', moon: '#e9ecf2', mer: '#c9c0b0', ven: '#fff1c2', mar: '#ff7a45', jup: '#f2d3a2', sat: '#ead27c', ura: '#a8e6f0', nep: '#7d97ff' };
const PNAME = { sun: { ar: 'الشمس', en: 'Sun' }, moon: { ar: 'القمر', en: 'Moon' } };
['mer', 'ven', 'mar', 'jup', 'sat', 'ura', 'nep'].forEach(k => PNAME[k] = { ar: SD.P[k].ar.replace(/[ً-ْ]/g, ''), en: SD.P[k].en });

// Milky Way raster (equirectangular, 0.5°)
const MWW = 720, MWH = 360; let mwGrid = null;
(function buildMW() {
  const c = document.createElement('canvas'); c.width = MWW; c.height = MWH;
  const g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, MWW, MWH);
  g.fillStyle = 'rgba(255,255,255,0.2)';
  for (const lvl of SD.MW) for (const poly of lvl) {
    g.beginPath();
    for (const ring of poly) { ring.forEach((p, i) => { const x = (p[0] + 180) * 2, y = (90 - p[1]) * 2; i ? g.lineTo(x, y) : g.moveTo(x, y); }); g.closePath(); }
    g.fill('evenodd');
  }
  const c2 = document.createElement('canvas'); c2.width = MWW; c2.height = MWH; const g2 = c2.getContext('2d');
  try { g2.filter = 'blur(3px)'; } catch (e) { }
  g2.drawImage(c, 0, 0);
  const d = g2.getImageData(0, 0, MWW, MWH).data; mwGrid = new Float32Array(MWW * MWH);
  for (let i = 0; i < MWW * MWH; i++) mwGrid[i] = d[i * 4] / 255;
})();

// ---------- canvas ----------
const cv = $('sky'), cx2 = cv.getContext('2d');
let W = 0, H = 0, DPR = 1;
const bgC = document.createElement('canvas'), bgX = bgC.getContext('2d'); let bgImg = null;
function resize() { DPR = Math.min(2, window.devicePixelRatio || 1); W = innerWidth; H = innerHeight; cv.width = W * DPR; cv.height = H * DPR; st.dirty = true; }
addEventListener('resize', resize); resize();

// ---------- frame computation ----------
let F = null; // current frame data
function compute() {
  const J = A.jd(new Date(st.t)), Tc = A.cent(J);
  const P = A.precMatrix(Tc), lst = A.gmst(J) + loc.lon;
  const Hm = A.eq2horMatrix(lst, loc.lat), M = A.mul(Hm, P);
  for (let i = 0; i < NS; i++) {
    const x = sV[i * 3], y = sV[i * 3 + 1], z = sV[i * 3 + 2];
    sH[i * 3] = M[0][0] * x + M[0][1] * y + M[0][2] * z;
    sH[i * 3 + 1] = M[1][0] * x + M[1][1] * y + M[1][2] * z;
    sH[i * 3 + 2] = M[2][0] * x + M[2][1] * y + M[2][2] * z;
  }
  const ss = A.solarSystem(J, SD.P);
  const bodies = [];
  const un = v => { const r = Math.hypot(v[0], v[1], v[2]); return [v[0] / r, v[1] / r, v[2] / r]; };
  const sunH = un(A.apply(M, ss.sun.j2000)), sunDate = un(A.apply(P, ss.sun.j2000));
  bodies.push({ id: 'sun', h: sunH, eq: sunDate, mag: -26.7, dist: ss.sun.dist });
  let mh = A.apply(Hm, ss.moon.date); mh = [mh[0], mh[1], mh[2] - 6378.14]; const mdist = Math.hypot(...mh);
  const moonH = un(mh), moonDate = un(A.applyT(Hm, moonH));
  // phase
  const cosE = moonDate[0] * sunDate[0] + moonDate[1] * sunDate[1] + moonDate[2] * sunDate[2];
  const E = Math.acos(Math.max(-1, Math.min(1, cosE))), Rs = ss.sun.dist * 1.495978707e8;
  const ip = Math.atan2(Rs * Math.sin(E), mdist - Rs * Math.cos(E)), k = (1 + Math.cos(ip)) / 2;
  const waxing = (sunDate[0] * moonDate[1] - sunDate[1] * moonDate[0]) > 0;
  const elong360 = waxing ? E * R2D : 360 - E * R2D;
  bodies.push({ id: 'moon', h: moonH, eq: moonDate, mag: -12.7 * k + 0.0, dist: mdist, k, waxing, elong: elong360 });
  for (const p of ['mer', 'ven', 'mar', 'jup', 'sat', 'ura', 'nep']) bodies.push({ id: p, h: un(A.apply(M, ss[p].j2000)), eq: un(A.apply(P, ss[p].j2000)), mag: ss[p].mag, dist: ss[p].dist, k: ss[p].phase });
  F = { J, Tc, P, Hm, M, lst, bodies, sun: bodies[0], moon: bodies[1] };
}
function bodyById(id) { return F.bodies.find(b => b.id === id); }

// ---------- 2D camera & projection ----------
const cam = { f: [0, 0, 1], r: [0, 1, 0], u: [1, 0, 0], scale: 1, cx: 0, cy: 0 };
let gyroBasis = null;
function setCam2d() {
  if (st.gyro && gyroBasis) { cam.f = gyroBasis.f; cam.r = gyroBasis.r; cam.u = gyroBasis.u; }
  else {
    const az = st.view.az * D2R, al = st.view.alt * D2R;
    cam.f = [Math.cos(al) * Math.cos(az), Math.cos(al) * Math.sin(az), Math.sin(al)];
    cam.r = [-Math.sin(az), Math.cos(az), 0];
    cam.u = [-Math.sin(al) * Math.cos(az), -Math.sin(al) * Math.sin(az), Math.cos(al)];
  }
  cam.cx = W / 2; cam.cy = H / 2 + 10;
  cam.scale = (Math.min(W, H) / 2) / (2 * Math.tan(st.view.fov * D2R / 4));
}
function proj2(v) {
  const z = v[0] * cam.f[0] + v[1] * cam.f[1] + v[2] * cam.f[2];
  if (z < -0.92) return null;
  const x = v[0] * cam.r[0] + v[1] * cam.r[1] + v[2] * cam.r[2], y = v[0] * cam.u[0] + v[1] * cam.u[1] + v[2] * cam.u[2];
  const k = 2 / (1 + z) * cam.scale;
  return [cam.cx + x * k, cam.cy - y * k, z];
}
// ---------- 3D camera ----------
const c3 = { C: [0, 0, 0], R: [0, 0, 0], U: [0, 0, 0], S: 1, cx: 0, cy: 0 };
function setCam3() {
  const y = st.cam3.yaw * D2R, p = st.cam3.pitch * D2R;
  const C = [Math.cos(p) * Math.cos(y), Math.cos(p) * Math.sin(y), Math.sin(p)]; // ENU
  const f = [-C[0], -C[1], -C[2]];
  let R = [f[1] * 1 - f[2] * 0, f[2] * 0 - f[0] * 1, 0]; // f × Z
  const rn = Math.hypot(R[0], R[1], R[2]) || 1; R = [R[0] / rn, R[1] / rn, R[2] / rn];
  const U = [R[1] * f[2] - R[2] * f[1], R[2] * f[0] - R[0] * f[2], R[0] * f[1] - R[1] * f[0]];
  Object.assign(c3, { C, R, U, cx: W / 2, cy: H / 2 + 20, S: Math.min(W, H) * 0.36 * st.cam3.zoom });
}
function proj3(v, rad) { // v in [n,e,u] -> ENU
  const e = v[1], n = v[0], u = v[2], s = rad == null ? 1 : rad;
  const x = e * c3.R[0] + n * c3.R[1] + u * c3.R[2], y = e * c3.U[0] + n * c3.U[1] + u * c3.U[2], d = e * c3.C[0] + n * c3.C[1] + u * c3.C[2];
  return [c3.cx + x * c3.S * s, c3.cy - y * c3.S * s, d];
}
// here is the modification of atmospheric refraction: objects are drawn at their apparent altitude
let noRefr = false;
function refrV(v) {
  if (noRefr || !st.layers.refr) return v;
  const r = Math.hypot(v[0], v[1], v[2]), sa = v[2] / r;
  if (sa < -0.035 || sa > 0.99) return v; // below -2° or near zenith: negligible / undefined
  const alt = Math.asin(sa) * R2D, ap = (alt + A.refraction(alt)) * D2R, ch = Math.hypot(v[0], v[1]) || 1e-9, k = Math.cos(ap) * r / ch;
  return [v[0] * k, v[1] * k, Math.sin(ap) * r];
}
function proj(v) { v = refrV(v); return st.mode === '3d' ? proj3(v) : proj2(v); }

// ---------- helpers ----------
function bvColor(bv) {
  const t = Math.max(-0.4, Math.min(2, bv));
  if (t < 0) return [170, 191, 255]; if (t < 0.3) return [202 + t * 60, 215 + t * 40, 255];
  if (t < 0.6) return [248, 247, 255 - (t - 0.3) * 100]; if (t < 1.0) return [255, 240 - (t - 0.6) * 90, 210 - (t - 0.6) * 200];
  return [255, 200 - (t - 1) * 70, 140 - (t - 1) * 70];
}
const smooth = x => { x = Math.max(0, Math.min(1, x)); return x * x * (3 - 2 * x); };
function hor(v) { return A.hor2altaz(v); }
function nameOfStar(i) {
  const n = starName[i]; if (!n) return null;
  const nm = lang === 'ar' ? (n.ar || n.en) : (n.en || n.ar);
  if (nm) return nm;
  if (n.des && n.c && consMap[n.c]) return n.des + ' ' + (lang === 'ar' ? consMap[n.c].ar : n.c);
  return null;
}
function limMag() {
  const s = F.sun.h[2] * R2D;
  let lim = 6.3;
  if (st.layers.atmosphere) { const day = smooth((s + 12) / 12); lim = 6.3 - day * 7.5; }
  if (st.mode === '2d' && st.view.fov < 90) lim += Math.min(0.6, Math.log2(90 / st.view.fov) * 0.3);
  if (st.mode === '3d') lim = Math.min(lim, 5.2);
  return lim;
}

// ---------- labels with collision ----------
let boxes = [];
function canPlace(x, y, w, h) { for (const b of boxes) if (x < b[0] + b[2] && x + w > b[0] && y < b[1] + b[3] && y + h > b[1]) return false; boxes.push([x, y, w, h]); return true; }
function label(txt, x, y, color, size, force, weight) {
  const g = cx2; g.font = `${weight || 500} ${size || 12}px ${lang === 'ar' ? '"Noto Naskh Arabic","Segoe UI",Tahoma,sans-serif' : '"Segoe UI",Arial,sans-serif'}`;
  const w = g.measureText(txt).width + 6, h = (size || 12) + 4;
  if (!force && !canPlace(x - w / 2, y - h / 2, w, h)) return false;
  if (force) boxes.push([x - w / 2, y - h / 2, w, h]);
  g.fillStyle = 'rgba(5,8,20,.55)'; g.fillText(txt, x + 1, y + 1);
  g.fillStyle = color; g.fillText(txt, x, y);
  return true;
}

// ---------- picking ----------
let picks = [];
function addPick(x, y, type, id, pri) { picks.push([x, y, type, id, pri]); }

// ---------- drawing 2D ----------
function drawBackground2d() {
  const s = W > 900 ? 3 : 2.5, w = Math.ceil(W / s), h = Math.ceil(H / s);
  if (!bgImg || bgC.width !== w || bgC.height !== h) { bgC.width = w; bgC.height = h; bgImg = bgX.createImageData(w, h); }
  const d = bgImg.data, sun = F.sun.h, sa = Math.asin(sun[2]) * R2D, L = st.layers;
  const dayF = L.atmosphere ? smooth((sa + 7) / 13) : 0, twF = L.atmosphere ? Math.max(0, 1 - Math.abs(sa + 4) / 10) * (1 - dayF * 0.6) : 0;
  const mwF = L.mw ? (L.atmosphere ? smooth((-sa - 8) / 10) : 1) : 0;
  const M = F.M, f = cam.f, r = cam.r, u = cam.u, sc = cam.scale, ccx = cam.cx, ccy = cam.cy;
  let o = 0;
  for (let py = 0; py < h; py++) {
    const Y = (ccy - py * s) / sc;
    for (let px = 0; px < w; px++, o += 4) {
      const X = (px * s - ccx) / sc, rho2 = X * X + Y * Y, z = (4 - rho2) / (4 + rho2), k = (1 + z) / 2;
      const a = X * k, b = Y * k;
      const v0 = a * r[0] + b * u[0] + z * f[0], v1 = a * r[1] + b * u[1] + z * f[1], v2 = a * r[2] + b * u[2] + z * f[2];
      let R, G, B;
      if (L.ground && v2 < 0) {
        const dd = Math.min(1, -v2 * 3);
        const g0 = 0.55 + 0.45 * dayF;
        R = (26 + 40 * dayF) * g0 * (1 - dd * 0.45); G = (30 + 52 * dayF) * g0 * (1 - dd * 0.45); B = (24 + 22 * dayF) * g0 * (1 - dd * 0.45);
        if (v2 > -0.03) { const hz = 1 + (v2 + 0.03) * 10; R += 10 * hz; G += 14 * hz; B += 10 * hz; }
      } else {
        let hz = 1 - Math.min(1, Math.max(0, v2) / 0.55); hz *= hz;
        R = 7 + 4 * hz; G = 11 + 6 * hz; B = 26 + 10 * hz;
        if (dayF > 0) { const zr = 38 + 110 * hz, zg = 100 + 92 * hz, zb = 205 + 25 * hz; R += (zr - R) * dayF; G += (zg - G) * dayF; B += (zb - B) * dayF; }
        const cs = v0 * sun[0] + v1 * sun[1] + v2 * sun[2];
        if (twF > 0) { const gl = twF * hz * Math.pow((cs + 1) / 2, 5); R += gl * 230; G += gl * 105; B += gl * 40; const gb = twF * (1 - hz) * 0.25; B += gb * 40; G += gb * 20; }
        if (dayF > 0 && cs > 0.9) { const p = Math.pow(cs, 300) * 255 + Math.pow(cs, 24) * 80; R += p * dayF; G += p * dayF * 0.96; B += p * dayF * 0.85; }
        if (mwF > 0) {
          const ex = M[0][0] * v0 + M[1][0] * v1 + M[2][0] * v2, ey = M[0][1] * v0 + M[1][1] * v1 + M[2][1] * v2, ez = M[0][2] * v0 + M[1][2] * v1 + M[2][2] * v2;
          let ra = Math.atan2(ey, ex) * R2D; // -180..180
          const de = Math.asin(Math.max(-1, Math.min(1, ez))) * R2D;
          const gx = Math.min(MWW - 1, ((ra + 180) * 2) | 0), gy = Math.min(MWH - 1, ((90 - de) * 2) | 0);
          const m = mwGrid[gy * MWW + gx] * mwF;
          R += m * 52; G += m * 56; B += m * 74;
        }
      }
      d[o] = R; d[o + 1] = G; d[o + 2] = B; d[o + 3] = 255;
    }
  }
  bgX.putImageData(bgImg, 0, 0);
  cx2.imageSmoothingEnabled = true; cx2.drawImage(bgC, 0, 0, w, h, 0, 0, w * s, h * s);
}
function strokeCurve(vs, color, width, dash, below) {
  const g = cx2; g.strokeStyle = color; g.lineWidth = width || 1; g.setLineDash(dash || []);
  g.beginPath(); let prev = null;
  for (const v of vs) {
    const hide = !below && st.layers.ground && v[2] < -0.002 && st.mode === '2d';
    const p = hide ? null : proj(v);
    if (p && (st.mode === '3d' ? true : true)) {
      if (prev && Math.abs(p[0] - prev[0]) < W * 0.6 && Math.abs(p[1] - prev[1]) < H * 0.6) g.lineTo(p[0], p[1]); else g.moveTo(p[0], p[1]);
    }
    prev = p;
  }
  g.stroke(); g.setLineDash([]);
}
function altazRing(alt) { const out = []; for (let a = 0; a <= 360; a += 3) { const A_ = a * D2R, h = alt * D2R; out.push([Math.cos(h) * Math.cos(A_), Math.cos(h) * Math.sin(A_), Math.sin(h)]); } return out; }
function altazMer(az, a0, a1) { const out = []; for (let h = a0; h <= a1; h += 3) { const A_ = az * D2R, H_ = h * D2R; out.push([Math.cos(H_) * Math.cos(A_), Math.cos(H_) * Math.sin(A_), Math.sin(H_)]); } return out; }
function eqDateCurve(fn) { return fn().map(v => A.apply(F.Hm, v)); }
function decCircle(dec) { return eqDateCurve(() => { const o = []; for (let r = 0; r <= 360; r += 3) o.push(A.radec2vec(r, dec)); return o; }); }
function raLine(ra) { return eqDateCurve(() => { const o = []; for (let d = -88; d <= 88; d += 4) o.push(A.radec2vec(ra, d)); return o; }); }
function drawGrids() {
  const L = st.layers;
  if (L.altaz) {
    noRefr = true;
    for (const a of [0, 15, 30, 45, 60, 75]) strokeCurve(altazRing(a), 'rgba(120,220,160,.28)', 1);
    for (let z = 0; z < 360; z += 30) strokeCurve(altazMer(z, 0, 90), 'rgba(120,220,160,.22)', 1);
    noRefr = false;
  }
  if (L.eqgrid) {
    for (let d = -75; d <= 75; d += 15) strokeCurve(decCircle(d), 'rgba(111,168,255,.22)', 1);
    for (let r = 0; r < 360; r += 30) strokeCurve(raLine(r), 'rgba(111,168,255,.2)', 1);
  }
  if (L.equator) strokeCurve(decCircle(0), 'rgba(212,167,60,.7)', 1.4);
  if (L.ecliptic) strokeCurve(eclJ2000.map(v => A.apply(F.M, v)), 'rgba(255,150,80,.65)', 1.3, [6, 5]);
  if (L.meridian) { strokeCurve(altazMer(0, -90, 90), 'rgba(255,255,255,.3)', 1, [2, 4]); strokeCurve(altazMer(180, -90, 90), 'rgba(255,255,255,.3)', 1, [2, 4]); }
}
function drawConsLines(alphaBack) {
  if (!st.layers.lines) return;
  const g = cx2, selC = selectedCons();
  for (const id in consLines) {
    const hl = id === selC || (st.guide === 'polaris' && (id === 'UMa' || id === 'UMi'));
    g.strokeStyle = hl ? 'rgba(241,210,122,.95)' : 'rgba(130,165,255,.38)'; g.lineWidth = hl ? 1.8 : 1;
    g.beginPath();
    for (const seg of consLines[id]) {
      let prev = null;
      for (const v of seg) {
        const h = A.apply(F.M, v);
        let p = null;
        if (st.mode === '2d') { if (!(st.layers.ground && h[2] < -0.02)) p = proj2(refrV(h)); }
        else { p = proj3(refrV(h)); if (p[2] < 0) p = alphaBack ? p : null; }
        if (p && prev && Math.abs(p[0] - prev[0]) < W * 0.5) g.lineTo(p[0], p[1]); else if (p) g.moveTo(p[0], p[1]);
        prev = p;
      }
    }
    g.stroke();
  }
}
function drawStars(frontOnly) {
  const g = cx2, lim = limMag(), L = st.layers, is3 = st.mode === '3d';
  const zoomB = is3 ? 0.8 : (st.view.fov < 60 ? 1.25 : 1);
  for (let i = 0; i < NS; i++) {
    const m = sMag[i]; if (m > lim) continue;
    const v = [sH[i * 3], sH[i * 3 + 1], sH[i * 3 + 2]];
    if (!is3 && L.ground && v[2] < (L.refr ? -0.0135 : -0.005)) continue;
    const p = proj(v); if (!p) continue;
    if (p[0] < -10 || p[0] > W + 10 || p[1] < -10 || p[1] > H + 10) continue;
    let alpha = Math.min(1, (lim - m + 0.4) / 1.3);
    if (is3 && p[2] < 0) { if (frontOnly) continue; alpha *= 0.22; } else if (is3 && !frontOnly) continue;
    const r = Math.max(0.55, (0.5 + (Math.min(lim, 6.3) - m) * 0.42)) * zoomB;
    const c = bvColor(sBV[i]);
    if (m < 1.6 && alpha > 0.5) {
      const gr = g.createRadialGradient(p[0], p[1], 0, p[0], p[1], r * 4);
      gr.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},${0.35 * alpha})`); gr.addColorStop(1, 'rgba(0,0,0,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(p[0], p[1], r * 4, 0, 7); g.fill();
    }
    g.fillStyle = `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${alpha})`;
    g.beginPath(); g.arc(p[0], p[1], r, 0, 7); g.fill();
    if (!is3 || p[2] >= 0) addPick(p[0], p[1], 'star', i, 6 - m);
  }
}
function drawMessier() {
  if (!st.layers.messier) return;
  const g = cx2, is3 = st.mode === '3d';
  if (st.layers.atmosphere && F.sun.h[2] > -0.1) return;
  for (let i = 0; i < messier.length; i++) {
    const o = messier[i], h = A.apply(F.M, o.v);
    if (!is3 && st.layers.ground && h[2] < 0) continue;
    const p = proj(h); if (!p || (is3 && p[2] < 0)) continue;
    g.strokeStyle = o.type === 'galaxy' ? 'rgba(255,160,200,.8)' : o.type === 'nebula' || o.type === 'planetary' || o.type === 'snr' ? 'rgba(120,230,200,.8)' : 'rgba(255,230,140,.8)';
    g.lineWidth = 1.2; g.beginPath();
    if (o.type === 'galaxy') g.ellipse(p[0], p[1], 6, 3.2, -0.5, 0, 7); else if (o.type === 'open' || o.type === 'globular') { g.arc(p[0], p[1], 4.5, 0, 7); } else g.rect(p[0] - 4, p[1] - 4, 8, 8);
    g.stroke();
    if (o.type === 'globular') { g.beginPath(); g.moveTo(p[0] - 4.5, p[1]); g.lineTo(p[0] + 4.5, p[1]); g.moveTo(p[0], p[1] - 4.5); g.lineTo(p[0], p[1] + 4.5); g.stroke(); }
    addPick(p[0], p[1], 'messier', i, 2.5);
    if (st.mode === '2d' && st.view.fov < 100 || o.ar) label((lang === 'ar' && o.ar) ? o.ar : (o.en ? o.id + ' ' + o.en : o.id), p[0], p[1] + 15, 'rgba(200,210,235,.75)', 10.5);
  }
}
function angPx(rad) { return st.mode === '3d' ? rad * c3.S * 6 : rad * cam.scale; }
function drawMoon(p, b) {
  const g = cx2, r = Math.max(st.mode === '3d' ? 7 : 9, angPx(0.0045));
  // direction toward sun on screen
  const s = F.sun.h, m = b.h, d = s[0] * m[0] + s[1] * m[1] + s[2] * m[2];
  let tv = [s[0] - d * m[0], s[1] - d * m[1], s[2] - d * m[2]]; const tn = Math.hypot(...tv) || 1;
  const q = [m[0] + 0.03 * tv[0] / tn, m[1] + 0.03 * tv[1] / tn, m[2] + 0.03 * tv[2] / tn];
  const pq = proj(q); const ang = pq ? Math.atan2(pq[1] - p[1], pq[0] - p[0]) : 0;
  g.save(); g.translate(p[0], p[1]);
  const gl = g.createRadialGradient(0, 0, r, 0, 0, r * 3.2); gl.addColorStop(0, `rgba(230,235,255,${0.25 * b.k})`); gl.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = gl; g.beginPath(); g.arc(0, 0, r * 3.2, 0, 7); g.fill();
  g.fillStyle = '#2a2f3d'; g.beginPath(); g.arc(0, 0, r, 0, 7); g.fill();
  g.rotate(ang);
  const k = b.k, rx = r * Math.abs(2 * k - 1);
  g.fillStyle = '#eef0f5'; g.beginPath(); g.arc(0, 0, r, -Math.PI / 2, Math.PI / 2, false);
  if (k >= 0.5) g.ellipse(0, 0, rx, r, 0, Math.PI / 2, 3 * Math.PI / 2, false); else g.ellipse(0, 0, rx, r, 0, Math.PI / 2, -Math.PI / 2, true);
  g.fill();
  g.restore();
  return r;
}
function drawBodies(frontOnly) {
  if (!st.layers.planets) return;
  const g = cx2, is3 = st.mode === '3d';
  for (const b of F.bodies.slice().sort((a, c) => a.mag - c.mag)) {
    if (!is3 && st.layers.ground && b.h[2] < (st.layers.refr ? -0.0135 : -0.005)) continue;
    const p = proj(b.h); if (!p) continue;
    const back = is3 && p[2] < 0; if (back && frontOnly) continue; if (is3 && !back && !frontOnly) continue;
    g.globalAlpha = back ? 0.35 : 1;
    let r;
    if (b.id === 'sun') {
      r = Math.max(is3 ? 8 : 11, angPx(0.00465));
      const gr = g.createRadialGradient(p[0], p[1], r * 0.4, p[0], p[1], r * 4); gr.addColorStop(0, 'rgba(255,230,140,.6)'); gr.addColorStop(1, 'rgba(255,200,80,0)');
      g.fillStyle = gr; g.beginPath(); g.arc(p[0], p[1], r * 4, 0, 7); g.fill();
      g.fillStyle = '#fff2b0'; g.beginPath(); g.arc(p[0], p[1], r, 0, 7); g.fill();
    } else if (b.id === 'moon') r = drawMoon(p, b);
    else {
      r = Math.max(2.4, Math.min(6.5, 3.6 - b.mag * 0.75));
      g.fillStyle = PCOL[b.id]; g.beginPath(); g.arc(p[0], p[1], r, 0, 7); g.fill();
      if (b.id === 'sat') { g.strokeStyle = 'rgba(234,210,124,.8)'; g.lineWidth = 1.1; g.beginPath(); g.ellipse(p[0], p[1], r * 2.1, r * 0.7, -0.35, 0, 7); g.stroke(); }
    }
    g.globalAlpha = 1;
    if (!back) {
      addPick(p[0], p[1], 'body', b.id, 20);
      const lc = b.id === 'sun' ? '#ffe08a' : '#ffd9a0', big = b.id === 'sun' || b.id === 'moon';
      if (!label(PNAME[b.id][lang], p[0], p[1] - r - 9, lc, 13, false, 600) && !label(PNAME[b.id][lang], p[0], p[1] + r + 10, lc, 13, false, 600)
        && !label(PNAME[b.id][lang], p[0] + r + 24, p[1], lc, 13, false, 600)) label(PNAME[b.id][lang], p[0] - r - 24, p[1], lc, 13, big, 600);
    }
  }
}

// here is the modification of the 28 Arabic lunar mansions (منازل القمر)
const MANSIONS = [
  ['الشرطان','al-Sharaṭān',[['β','Ari'],['γ1','Ari']]],['البطين','al-Buṭayn',[['δ','Ari'],['ε','Ari']]],['الثريا','al-Thurayyā',[['η','Tau']]],
  ['الدبران','al-Dabarān',[['α','Tau']]],['الهقعة','al-Haqʿa',[['λ','Ori']]],['الهنعة','al-Hanʿa',[['γ','Gem'],['ξ','Gem']]],
  ['الذراع','al-Dhirāʿ',[['α','Gem'],['β','Gem']]],['النثرة','al-Nathra',[['γ','Cnc'],['δ','Cnc']]],['الطرف','al-Ṭarf',[['κ','Cnc'],['λ','Leo']]],
  ['الجبهة','al-Jabha',[['ζ','Leo'],['γ1','Leo'],['η','Leo'],['α','Leo']]],['الزبرة','al-Zubra',[['δ','Leo'],['θ','Leo']]],['الصرفة','al-Ṣarfa',[['β','Leo']]],
  ['العوّاء','al-ʿAwwāʾ',[['β','Vir'],['η','Vir'],['γ','Vir'],['δ','Vir'],['ε','Vir']]],['السماك','al-Simāk',[['α','Vir']]],['الغفر','al-Ghafr',[['ι','Vir'],['κ','Vir'],['λ','Vir']]],
  ['الزبانى','al-Zubānā',[['α2','Lib'],['β','Lib']]],['الإكليل','al-Iklīl',[['β1','Sco'],['δ','Sco'],['π','Sco']]],['القلب','al-Qalb',[['α','Sco']]],
  ['الشولة','al-Shawla',[['λ','Sco'],['υ','Sco']]],['النعائم','al-Naʿāʾim',[['γ2','Sgr'],['δ','Sgr'],['ε','Sgr'],['σ','Sgr'],['φ','Sgr'],['τ','Sgr'],['ζ','Sgr']]],['البلدة','al-Balda',[['π','Sgr']]],
  ['سعد الذابح','Saʿd al-Dhābiḥ',[['α2','Cap'],['β','Cap']]],['سعد بلع','Saʿd Bulaʿ',[['ε','Aqr'],['μ','Aqr']]],['سعد السعود','Saʿd al-Suʿūd',[['β','Aqr'],['ξ','Aqr']]],
  ['سعد الأخبية','Saʿd al-Akhbiya',[['γ','Aqr'],['ζ','Aqr'],['η','Aqr'],['π','Aqr']]],['الفرغ المقدّم','al-Fargh al-Muqaddam',[['α','Peg'],['β','Peg']]],
  ['الفرغ المؤخّر','al-Fargh al-Muʾakhkhar',[['γ','Peg'],['α','And']]],['بطن الحوت (الرشاء)','Baṭn al-Ḥūt',[['β','And']]]
].map(([ar, en, ss]) => {
  const des = (d, c) => { for (const k in starName) { const n = starName[k]; if (n.c === c && (n.des === d || n.des === d.replace(/\d$/, ''))) return +k; } return -1; };
  const idx = ss.map(([d, c]) => des(d, c)).filter(i => i >= 0);
  const eps = 23.4392911 * D2R, lam = i => { const x = sV[i * 3], y = sV[i * 3 + 1], z = sV[i * 3 + 2]; return (Math.atan2(y * Math.cos(eps) + z * Math.sin(eps), x) * R2D + 360) % 360; };
  // anchor longitude = circular mean of member stars (J2000 ecliptic)
  let sx = 0, sy = 0; idx.forEach(i => { sx += Math.cos(lam(i) * D2R); sy += Math.sin(lam(i) * D2R); });
  return { ar, en, idx, lon: (Math.atan2(sy, sx) * R2D + 360) % 360 };
});
function mansionOfMoon() { // Moon J2000 ecliptic longitude -> mansion whose star group it has reached last
  const m = A.applyT(F.P, F.moon.eq), eps = 23.4392911 * D2R;
  const lm = (Math.atan2(m[1] * Math.cos(eps) + m[2] * Math.sin(eps), m[0]) * R2D + 360) % 360;
  let best = 0, bd = 1e9;
  MANSIONS.forEach((M_, i) => { const d = Math.abs(((lm - M_.lon + 540) % 360) - 180); if (d < bd) { bd = d; best = i; } }); // nearest star group in longitude
  return { i: best, m: MANSIONS[best], lm };
}
function drawMansions() {
  if (!st.layers.mansions) return;
  const g = cx2, is3 = st.mode === '3d', cur = mansionOfMoon().i;
  MANSIONS.forEach((M_, k) => {
    const pts = M_.idx.map(i => { const v = [sH[i * 3], sH[i * 3 + 1], sH[i * 3 + 2]]; if (!is3 && st.layers.ground && v[2] < 0) return null; const p = proj(v); return p && !(is3 && p[2] < 0) ? p : null; }).filter(Boolean);
    if (!pts.length) return;
    const on = k === cur;
    g.strokeStyle = on ? 'rgba(241,210,122,.95)' : 'rgba(212,167,60,.55)'; g.lineWidth = on ? 1.8 : 1.1;
    pts.forEach(p => { g.beginPath(); g.arc(p[0], p[1], on ? 7 : 5.5, 0, 7); g.stroke(); });
    const cxm = pts.reduce((a, p) => a + p[0], 0) / pts.length, cym = Math.max(...pts.map(p => p[1]));
    label((lang === 'ar' ? '☾ ' + M_.ar : '☾ ' + M_.en) + ' ' + KH.num(k + 1, 0, lang), cxm, cym + 18, on ? '#f1d27a' : 'rgba(241,210,122,.75)', 11.5, on, 600);
  });
}
function drawLabels() {
  const L = st.layers, is3 = st.mode === '3d';
  if (L.snames) {
    const lim = Math.min(limMag(), is3 ? 2.2 : (st.view.fov > 120 ? 1.8 : st.view.fov > 70 ? 2.6 : 3.8));
    const idx = Object.keys(starName).map(Number).filter(i => sMag[i] <= lim).sort((a, b) => sMag[a] - sMag[b]);
    for (const i of idx) {
      const v = [sH[i * 3], sH[i * 3 + 1], sH[i * 3 + 2]];
      if (!is3 && L.ground && v[2] < 0) continue;
      const p = proj(v); if (!p || (is3 && p[2] < 0)) continue;
      const nm = nameOfStar(i); if (nm) label(nm, p[0], p[1] - 10, 'rgba(225,232,250,.9)', 11.5);
    }
  }
  if (L.cnames) {
    for (const c of consList) {
      if (c.rank > (is3 ? 1 : (st.view.fov > 120 ? 2 : 3))) continue;
      const h = A.apply(F.M, c.v);
      if (!is3 && L.ground && h[2] < 0) continue;
      const p = proj(h); if (!p || (is3 && p[2] < 0)) continue;
      label(lang === 'ar' ? c.ar : c.en, p[0], p[1], 'rgba(150,185,255,.75)', 12.5, false, 600);
      addPick(p[0], p[1], 'cons', c.id, -5);
    }
  }
}
function drawHorizon2d() {
  if (!st.layers.ground && !st.layers.cardinals) return;
  strokeCurve(altazRing(0), 'rgba(160,210,170,.55)', 1.4, null, true);
  if (st.layers.cardinals) {
    const D = T[lang].dirs;
    [['N', 0], ['NE', 45], ['E', 90], ['SE', 135], ['S', 180], ['SW', 225], ['W', 270], ['NW', 315]].forEach(([k, a]) => {
      const p = proj2([Math.cos(a * D2R), Math.sin(a * D2R), 0]); if (!p) return;
      const main = k.length === 1;
      label(D[k], p[0], p[1] + 16, main ? '#f1d27a' : 'rgba(241,210,122,.6)', main ? 16 : 12, true, 700);
    });
  }
}
function drawSelection() {
  if (!st.sel) return;
  const v = selVec(); if (!v) return;
  if (st.path) {
    const eq = A.applyT(F.Hm, v); const dec = Math.asin(eq[2]) * R2D;
    strokeCurve(decCircle(dec), 'rgba(241,210,122,.8)', 1.5, [5, 4], st.mode === '3d');
  }
  const p = proj(v); if (!p || (st.mode === '3d' && p[2] < 0)) return;
  const g = cx2; g.strokeStyle = '#f1d27a'; g.lineWidth = 1.6;
  const tt = performance.now() / 600, rr = 15 + Math.sin(tt) * 2;
  g.beginPath(); g.arc(p[0], p[1], rr, 0, 7); g.stroke();
  for (let k = 0; k < 4; k++) { const a = k * Math.PI / 2; g.beginPath(); g.moveTo(p[0] + Math.cos(a) * (rr + 3), p[1] + Math.sin(a) * (rr + 3)); g.lineTo(p[0] + Math.cos(a) * (rr + 9), p[1] + Math.sin(a) * (rr + 9)); g.stroke(); }
}
function drawGuide() {
  if (st.guide !== 'polaris') return;
  const iM = hipIdx[53910], iD = hipIdx[54061], iP = hipIdx[11767];
  const vM = [sH[iM * 3], sH[iM * 3 + 1], sH[iM * 3 + 2]], vD = [sH[iD * 3], sH[iD * 3 + 1], sH[iD * 3 + 2]], vP = [sH[iP * 3], sH[iP * 3 + 1], sH[iP * 3 + 2]];
  const pts = []; for (let s = 0; s <= 1.0001; s += 0.02) { const a = [vM[0] + (vP[0] - vM[0]) * s, vM[1] + (vP[1] - vM[1]) * s, vM[2] + (vP[2] - vM[2]) * s]; const n = Math.hypot(...a); pts.push([a[0] / n, a[1] / n, a[2] / n]); }
  strokeCurve(pts, 'rgba(241,210,122,.9)', 2, [7, 6], true);
  const g = cx2;
  [[vM, 'المراق', 'Merak'], [vD, 'الدب', 'Dubhe'], [vP, 'الجدي', 'Polaris']].forEach(([v, a, e], j) => {
    const p = proj(v); if (!p) return; g.strokeStyle = '#f1d27a'; g.lineWidth = 2; g.beginPath(); g.arc(p[0], p[1], j === 2 ? 14 : 9, 0, 7); g.stroke();
    label(lang === 'ar' ? a : e, p[0], p[1] + (j === 2 ? 26 : 20), '#f1d27a', j === 2 ? 15 : 12.5, true, 700);
  });
  const pa = $('polAlt'); if (pa) pa.textContent = KH.num(Math.asin(vP[2]) * R2D, 1, lang) + '°';
  // line down to horizon (true north)
  strokeCurve(altazMer(0, 0, Math.asin(vP[2]) * R2D), 'rgba(241,210,122,.5)', 1, [2, 4], true);
}
// ---------- drawing 3D ----------
function draw3d() {
  const g = cx2; setCam3();
  const gr = g.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, Math.max(W, H) * 0.7); gr.addColorStop(0, '#111a3a'); gr.addColorStop(1, '#05070f');
  g.fillStyle = gr; g.fillRect(0, 0, W, H);
  // sphere
  g.fillStyle = 'rgba(40,60,120,.12)'; g.strokeStyle = 'rgba(160,190,255,.35)'; g.lineWidth = 1.2;
  g.beginPath(); g.arc(c3.cx, c3.cy, c3.S, 0, 7); g.fill(); g.stroke();
  const L = st.layers;
  const circ = (vs, col, w, dash) => { // front solid, back faint
    g.setLineDash(dash || []);
    for (const pass of [0, 1]) { g.strokeStyle = pass ? col : col.replace(/[\d.]+\)$/, m => (parseFloat(m) * 0.3).toFixed(2) + ')'); g.lineWidth = w; g.beginPath(); let prev = null;
      for (const v of vs) { const p = proj3(v); const ok = pass ? p[2] >= 0 : p[2] < 0; if (ok) { prev ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); prev = p; } else prev = null; } g.stroke(); }
    g.setLineDash([]);
  };
  // back stuff
  drawConsLines(true); drawStars(false); drawBodies(false);
  // horizon disc
  const ring = altazRing(0);
  g.fillStyle = 'rgba(60,120,80,.42)'; g.strokeStyle = 'rgba(150,230,170,.8)'; g.lineWidth = 1.5; g.beginPath();
  ring.forEach((v, i) => { const p = proj3(v); i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]); }); g.closePath(); g.fill(); g.stroke();
  // N-S, E-W lines on disc
  g.strokeStyle = 'rgba(200,240,210,.35)'; g.lineWidth = 1;
  [[[1, 0, 0], [-1, 0, 0]], [[0, 1, 0], [0, -1, 0]]].forEach(([a, b]) => { const p = proj3(a), q = proj3(b); g.beginPath(); g.moveTo(p[0], p[1]); g.lineTo(q[0], q[1]); g.stroke(); });
  // circles
  if (L.altaz) { for (const a of [30, 60]) circ(altazRing(a), 'rgba(120,220,160,.5)', 1); for (let z = 0; z < 360; z += 45) circ(altazMer(z, 0, 90), 'rgba(120,220,160,.4)', 1); }
  if (L.eqgrid) { for (let d = -60; d <= 60; d += 30) circ(decCircle(d), 'rgba(111,168,255,.45)', 1); for (let r = 0; r < 360; r += 30) circ(raLine(r), 'rgba(111,168,255,.4)', 1); }
  circ(decCircle(0), 'rgba(212,167,60,.95)', 1.6);
  if (L.ecliptic) circ(eclJ2000.map(v => A.apply(F.M, v)), 'rgba(255,150,80,.9)', 1.5, [6, 5]);
  if (L.meridian) circ(altazMer(0, -90, 90).concat(altazMer(180, -90, 90).reverse()), 'rgba(255,255,255,.5)', 1, [3, 4]);
  // polar axis
  const ncp = A.apply(F.Hm, [0, 0, 1]), scp = [-ncp[0], -ncp[1], -ncp[2]];
  const pN = proj3(ncp, 1.18), pS = proj3(scp, 1.18), pO = proj3([0, 0, 0]);
  g.strokeStyle = 'rgba(241,210,122,.85)'; g.lineWidth = 1.6; g.beginPath(); g.moveTo(pS[0], pS[1]); g.lineTo(pN[0], pN[1]); g.stroke();
  label(t('ncp'), pN[0], pN[1] - 10, '#f1d27a', 12, true, 600); label(t('scp'), pS[0], pS[1] + 14, 'rgba(241,210,122,.7)', 11, true);
  // zenith
  const pZ = proj3([0, 0, 1], 1.0); g.setLineDash([3, 4]); g.strokeStyle = 'rgba(255,255,255,.45)'; g.beginPath(); g.moveTo(pO[0], pO[1]); g.lineTo(pZ[0], pZ[1]); g.stroke(); g.setLineDash([]);
  label(t('zenith'), pZ[0], pZ[1] - 10, 'rgba(255,255,255,.75)', 11, true);
  // observer
  const pH = proj3([0, 0, 0.07]);
  g.strokeStyle = '#fff'; g.lineWidth = 2.2; g.beginPath(); g.moveTo(pO[0], pO[1]); g.lineTo(pH[0], pH[1]); g.stroke();
  g.fillStyle = '#fff'; g.beginPath(); g.arc(pH[0], pH[1] - 3, 3.4, 0, 7); g.fill();
  label(t('you'), pO[0], pO[1] + 14, '#fff', 11, true);
  // cardinal letters
  const D = T[lang].dirs;
  [['N', 0], ['E', 90], ['S', 180], ['W', 270]].forEach(([k, a]) => { const p = proj3([Math.cos(a * D2R), Math.sin(a * D2R), 0], 1.1); label(D[k], p[0], p[1], '#f1d27a', 16, true, 700); });
  // front stuff
  drawConsLines(false); drawMessier(); drawMansions(); drawStars(true); drawBodies(true); drawSelection(); drawLabels();
}

// ---------- main draw ----------
function draw() {
  boxes = []; picks = [];
  const g = cx2; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.textAlign = 'center'; g.textBaseline = 'middle';
  if (st.mode === '3d') { draw3d(); return; }
  setCam2d();
  drawBackground2d(); drawGrids(); drawConsLines(); drawMessier(); drawMansions(); drawStars(); drawBodies(true);
  drawGuide(); drawSelection(); drawHorizon2d(); drawLabels();
}

// ---------- selection & info ----------
function selVec() {
  const s = st.sel; if (!s) return null;
  if (s.type === 'star') return [sH[s.id * 3], sH[s.id * 3 + 1], sH[s.id * 3 + 2]];
  if (s.type === 'body') return bodyById(s.id).h;
  if (s.type === 'messier') return A.apply(F.M, messier[s.id].v);
  if (s.type === 'cons') return A.apply(F.M, consMap[s.id].v);
}
function selectedCons() { const s = st.sel; if (!s) return null; if (s.type === 'cons') return s.id; if (s.type === 'star' && starName[s.id]) return starName[s.id].c; return null; }
function hvecAt(sel, ms) { // horizontal vector of selected object at time ms
  const J = A.jd(new Date(ms)), Tc = A.cent(J), P = A.precMatrix(Tc), Hm = A.eq2horMatrix(A.gmst(J) + loc.lon, loc.lat), M = A.mul(Hm, P);
  if (sel.type === 'star') return A.apply(M, [sV[sel.id * 3], sV[sel.id * 3 + 1], sV[sel.id * 3 + 2]]);
  if (sel.type === 'messier') return A.apply(M, messier[sel.id].v);
  if (sel.type === 'cons') return A.apply(M, consMap[sel.id].v);
  const ss = A.solarSystem(J, SD.P);
  if (sel.id === 'moon') { const m = A.apply(Hm, ss.moon.date); m[2] -= 6378.14; return m; }
  return A.apply(M, ss[sel.id].j2000);
}
function riseSet(sel, tNow) {
  const h0 = sel.type === 'body' && (sel.id === 'sun' || sel.id === 'moon') ? -0.833 : -0.5667;
  const step = 10 * 60000, t0 = tNow - 14 * 3600000, N = 40 * 6 + 1, alts = [], ts = [];
  for (let i = 0; i < N; i++) { const tt = t0 + i * step, v = hvecAt(sel, tt); ts.push(tt); alts.push(Math.asin(v[2] / Math.hypot(...v)) * R2D); }
  const rises = [], sets = [], trs = [];
  for (let i = 1; i < N; i++) {
    const a = alts[i - 1] - h0, b = alts[i] - h0, tm = ts[i - 1] + (a / (a - b)) * step;
    if (a < 0 && b >= 0) rises.push(tm);
    if (a >= 0 && b < 0) sets.push(tm);
    if (i < N - 1 && alts[i] >= alts[i - 1] && alts[i] > alts[i + 1]) { const y0 = alts[i - 1], y1 = alts[i], y2 = alts[i + 1], den = y0 - 2 * y1 + y2; trs.push(ts[i] + (den ? 0.5 * (y0 - y2) / den : 0) * step); }
  }
  const mx = Math.max(...alts), mn = Math.min(...alts);
  const up = alts[14 * 6] > h0;
  let rise = up ? rises.filter(x => x <= tNow).pop() : rises.find(x => x > tNow);
  if (rise == null && up) rise = null;
  const ref = rise != null ? rise : tNow;
  const set = sets.find(x => x > ref);
  const tr = rise != null && set != null ? trs.find(x => x > rise && x < set) : trs.reduce((b, x) => b == null || Math.abs(x - tNow) < Math.abs(b - tNow) ? x : b, null);
  return { rise, set, tr, circ: mn > h0, never: mx < h0 };
}
function hms(ra) { const h = ra / 15, H_ = Math.floor(h), m = (h - H_) * 60; return lang === 'ar' ? KH.digits(`${H_}س ${m.toFixed(1)}د`, lang) : `${H_}h ${m.toFixed(1)}m`; }
function dms(d) { const s = d < 0 ? '−' : '+', a = Math.abs(d), D_ = Math.floor(a), m = Math.round((a - D_) * 60); return s + KH.digits(`${D_}° ${m}′`, lang); }
function moonPhaseIdx(b) { const e = b.elong; return Math.round(e / 45) % 8; }
function showInfo() {
  const box = $('info'); const s = st.sel; if (!s) { box.hidden = true; return; }
  let title = '', sub = '', type = '', rows = [];
  const v = selVec(); const [alt, az] = hor(v); const eq = A.applyT(F.Hm, v); const [ra, de] = A.vec2radec(eq);
  if (s.type === 'star') {
    const n = starName[s.id] || {}; title = nameOfStar(s.id) || (KH.digits('HIP', lang)); sub = lang === 'ar' ? (n.en || '') : (n.ar || '');
    if (n.des && n.c) sub += (sub ? ' · ' : '') + n.des + ' ' + n.c;
    type = t('star') + (n.c && consMap[n.c] ? ' — ' + t('inCons') + ' ' + (lang === 'ar' ? consMap[n.c].ar : consMap[n.c].en) : '');
    rows.push([t('mag'), KH.num(sMag[s.id], 2, lang)]);
  } else if (s.type === 'body') {
    const b = bodyById(s.id); title = PNAME[s.id][lang]; sub = PNAME[s.id][lang === 'ar' ? 'en' : 'ar'];
    type = s.id === 'sun' ? t('sunT') : s.id === 'moon' ? t('moonT') : t('planet');
    if (s.id !== 'sun') rows.push([t('mag'), KH.num(b.mag, 1, lang)]);
    if (s.id === 'moon') {
      rows.push([t('phase'), T[lang].phases[moonPhaseIdx(b)]]); rows.push([t('illum'), KH.num(b.k * 100, 0, lang) + '٪'.replace('٪', lang === 'ar' ? '٪' : '%')]);
      rows.push([t('age'), KH.num(b.elong / 12.19, 1, lang) + ' ' + t('days')]);
      { const mm = mansionOfMoon(); rows.push([lang === 'ar' ? 'منزلة القمر (أقرب نجومها)' : 'Lunar mansion (nearest)', (lang === 'ar' ? mm.m.ar : mm.m.en) + ' (' + KH.num(mm.i + 1, 0, lang) + '/' + KH.num(28, 0, lang) + ')']); }
      rows.push([t('dist'), KH.digits(Math.round(b.dist).toLocaleString('en'), lang) + ' ' + t('km')]);
    } else rows.push([t('dist'), KH.num(b.dist, s.id === 'sun' ? 4 : 3, lang) + ' ' + t('au')]);
  } else if (s.type === 'messier') {
    const o = messier[s.id]; title = (lang === 'ar' && o.ar) ? o.ar : (o.en || o.id); sub = o.id + (o.en && lang === 'ar' ? ' · ' + o.en : '');
    type = T[lang].mtypes[o.type] || o.type; rows.push([t('mag'), KH.num(o.mag, 1, lang)]);
  } else if (s.type === 'cons') {
    const c = consMap[s.id]; title = lang === 'ar' ? c.ar : c.en; sub = lang === 'ar' ? c.en : c.ar; type = t('cons'); rows.push([t('abbr'), c.id]);
  }
  rows.push([t('ra'), hms(ra)], [t('dec'), dms(de)]);
  const ap = alt + A.refraction(alt);
  rows.push([t('alt'), KH.num(ap, 1, lang) + '°'], [t('az'), KH.num(az, 1, lang) + '° (' + KH.compass(az, lang) + ')']);
  const rs = riseSet(s, st.t);
  const dayKey = ms => { const o = KH.tzOffsetMin(ms, loc); return Math.floor((ms + o * 60000) / 86400000); };
  const ft = x => { if (x == null) return t('none'); const dd = dayKey(x) - dayKey(st.t); return KH.fmtTime(x, loc, lang) + (dd ? ` <small style="color:var(--muted)">(${dd > 0 ? (lang === 'ar' ? 'غدًا' : 'tomorrow') : (lang === 'ar' ? 'أمس' : 'yesterday')})</small>` : ''); };
  if (rs.circ) rows.push([t('rise'), t('circum')]); else if (rs.never) rows.push([t('rise'), t('never')]);
  else { rows.push([t('rise'), ft(rs.rise)], [t('transit'), ft(rs.tr)], [t('set'), ft(rs.set)]); }
  box.innerHTML = `<button class="ibtn x" id="infoX">✕</button><h2>${title}</h2><div class="alt">${sub}${sub ? ' — ' : ''}${type}</div>
    <div class="kv">${rows.map(r => `<b>${r[0]}</b><span>${r[1]}</span>`).join('')}</div>
    ${alt < 0 ? `<div class="note">⤓ ${t('below')}</div>` : ''}
    <div class="row-btns">${s.type === 'star' ? `<button class="btn sm" id="infoStar">⭐ ${lang === 'ar' ? 'شكل النجم وحجمه' : 'The star up close'}</button>` : ''}${s.type === 'body' ? `<button class="btn sm" id="info3d">🌐 ${lang === 'ar' ? 'شكله الحقيقي 3D' : 'Real 3D view'}</button>` : ''}<button class="btn sm${s.type === 'body' || s.type === 'star' ? ' ghost' : ''}" id="infoC">${t('center')}</button><button class="btn sm ghost${st.path ? ' on' : ''}" id="infoP">${st.path ? '✓ ' : ''}${t('path')}</button></div>`;
  box.hidden = false;
  $('infoX').onclick = () => { st.sel = null; box.hidden = true; st.dirty = true; };
  $('infoC').onclick = () => flyTo(v);
  if ($('info3d')) $('info3d').onclick = () => Body3D.open(s.id, st.live ? null : st.t, { lang });
  if ($('infoStar')) $('infoStar').onclick = () => Star3D.open({ hip: (starName[s.id] || {}).hip, name: title, bv: sBV[s.id], mag: sMag[s.id], lang });
  $('infoP').onclick = () => { st.path = !st.path; showInfo(); st.dirty = true; };
}
function select(sel, fly) { st.sel = sel; if (fly) { compute(); flyTo(selVec()); } showInfo(); st.dirty = true; }

// ---------- flying ----------
function flyTo(v, fov) {
  if (st.mode === '3d') { const [al, az] = hor(v); st.fly = { from: { ...st.cam3 }, to: { yaw: 90 - az + 0, pitch: Math.max(-10, Math.min(80, al)), zoom: st.cam3.zoom }, t0: performance.now(), d3: true }; return; }
  if (st.gyro) setGyro(false);
  const [al, az] = hor(v);
  st.fly = { from: { ...st.view }, to: { az, alt: Math.max(-30, Math.min(90, al)), fov: fov || Math.min(st.view.fov, 90) }, t0: performance.now() };
}
function stepFly(now) {
  const f = st.fly; if (!f) return;
  const k = Math.min(1, (now - f.t0) / 900), e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
  if (f.d3) { let dy = ((f.to.yaw - f.from.yaw) % 360 + 540) % 360 - 180; st.cam3.yaw = f.from.yaw + dy * e; st.cam3.pitch = f.from.pitch + (f.to.pitch - f.from.pitch) * e; }
  else { let da = ((f.to.az - f.from.az) % 360 + 540) % 360 - 180; st.view.az = (f.from.az + da * e + 360) % 360; st.view.alt = f.from.alt + (f.to.alt - f.from.alt) * e; st.view.fov = f.from.fov + (f.to.fov - f.from.fov) * e; }
  st.dirty = true; if (k >= 1) { st.fly = null; saveView(); }
}
function saveView() { KH.store.set('view', st.view); KH.store.set('cam3', st.cam3); }

// ---------- input ----------
const ptrs = new Map(); let drag = null, pinch = null, moved = false;
cv.addEventListener('pointerdown', e => { cv.setPointerCapture(e.pointerId); ptrs.set(e.pointerId, [e.clientX, e.clientY]); moved = false; st.fly = null;
  if (ptrs.size === 1) drag = { x: e.clientX, y: e.clientY }; else if (ptrs.size === 2) { const [a, b] = [...ptrs.values()]; pinch = { d: Math.hypot(a[0] - b[0], a[1] - b[1]), fov: st.view.fov, zoom: st.cam3.zoom }; drag = null; }
  cv.classList.add('dragging'); });
cv.addEventListener('pointermove', e => {
  if (!ptrs.has(e.pointerId)) return; ptrs.set(e.pointerId, [e.clientX, e.clientY]);
  if (pinch && ptrs.size === 2) { const [a, b] = [...ptrs.values()]; const d = Math.hypot(a[0] - b[0], a[1] - b[1]); const r = pinch.d / d;
    if (st.mode === '3d') st.cam3.zoom = Math.max(0.5, Math.min(4, pinch.zoom / r)); else st.view.fov = Math.max(8, Math.min(200, pinch.fov * r)); moved = true; st.dirty = true; return; }
  if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 4) moved = true; if (!moved) return;
  drag.x = e.clientX; drag.y = e.clientY;
  if (st.mode === '3d') { st.cam3.yaw += dx * 0.35; st.cam3.pitch = Math.max(-85, Math.min(85, st.cam3.pitch + dy * 0.3)); }
  else { if (st.gyro) setGyro(false); const dpp = R2D / cam.scale; st.view.az = ((st.view.az - dx * dpp / Math.max(0.25, Math.cos(st.view.alt * D2R) * 0.7 + 0.3)) % 360 + 360) % 360; st.view.alt = Math.max(-60, Math.min(90, st.view.alt + dy * dpp)); }
  st.dirty = true;
});
function endPtr(e) {
  const wasTap = !moved && ptrs.size === 1 && !pinch;
  ptrs.delete(e.pointerId); if (ptrs.size < 2) pinch = null; if (!ptrs.size) { drag = null; cv.classList.remove('dragging'); saveView(); }
  if (wasTap && e.type === 'pointerup') tap(e.clientX, e.clientY);
}
cv.addEventListener('pointerup', endPtr); cv.addEventListener('pointercancel', endPtr);
cv.addEventListener('wheel', e => { e.preventDefault(); const f = Math.exp(e.deltaY * 0.0012); if (st.mode === '3d') st.cam3.zoom = Math.max(0.5, Math.min(4, st.cam3.zoom / f)); else st.view.fov = Math.max(8, Math.min(200, st.view.fov * f)); st.dirty = true; saveView(); }, { passive: false });
function tap(x, y) {
  let best = null, bs = 1e9;
  for (const p of picks) { const d = Math.hypot(p[0] - x, p[1] - y); if (d > 26) continue; const sc = d - p[4] * 2.2; if (sc < bs) { bs = sc; best = p; } }
  if (best) select({ type: best[2], id: best[3] }); else { st.sel = null; $('info').hidden = true; st.dirty = true; }
}
addEventListener('keydown', e => { if (e.target.tagName === 'INPUT') return; if (e.key === '+') st.view.fov *= 0.85; if (e.key === '-') st.view.fov /= 0.85; if (e.key === 'ArrowLeft') st.view.az -= 5; if (e.key === 'ArrowRight') st.view.az += 5; if (e.key === 'ArrowUp') st.view.alt = Math.min(90, st.view.alt + 5); if (e.key === 'ArrowDown') st.view.alt -= 5; st.dirty = true; });

// ---------- gyro ----------
let gyroSeen = false, gyroTimer = null;
function inFrame() { try { return window.self !== window.top; } catch (e) { return true; } }
// here is the modification of the gyro: one basis builder used by both the quaternion sensor and the Euler event
function setBasis(X, Y, Z) {
  let f = [-Z[0], -Z[1], -Z[2]], u = Y;               // camera looks out of the back of the phone; screen top = up
  const prev = gyroBasis ? gyroBasis.enu : null;
  if (prev) { const k = 0.35; f = f.map((x, i) => prev.f[i] + (x - prev.f[i]) * k); u = u.map((x, i) => prev.u[i] + (x - prev.u[i]) * k); }
  const nf = Math.hypot(...f); f = f.map(x => x / nf);
  let r = [f[1] * u[2] - f[2] * u[1], f[2] * u[0] - f[0] * u[2], f[0] * u[1] - f[1] * u[0]]; const nr = Math.hypot(...r) || 1; r = r.map(x => x / nr);
  u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  const cvt = v => [v[1], v[0], v[2]]; // ENU -> [n,e,u]
  gyroBasis = { f: cvt(f), r: cvt(r), u: cvt(u), enu: { f, u } };
  gyroSeen = true; st.dirty = true;
}
// here is the modification of the screen-rotation fix (landscape signs were reversed)
function screenRot(X, Y) {
  const ang = ((screen.orientation && screen.orientation.angle) || window.orientation || 0) * D2R;
  if (!ang) return [X, Y];
  const c = Math.cos(ang), s = Math.sin(ang);
  return [X.map((x, i) => x * c - Y[i] * s), X.map((x, i) => x * s + Y[i] * c)];
}
function onOri(e) {
  if (sensorOn) return;                               // the quaternion sensor is running and is better
  let a = e.alpha, b = e.beta, gm = e.gamma;
  if (e.webkitCompassHeading != null) a = 360 - e.webkitCompassHeading;
  if (a == null || b == null) return;
  a *= D2R; b *= D2R; gm *= D2R;
  const cA = Math.cos(a), sA = Math.sin(a), cB = Math.cos(b), sB = Math.sin(b), cG = Math.cos(gm), sG = Math.sin(gm);
  // columns of R = Rz(alpha)·Rx(beta)·Ry(gamma) (device -> earth ENU)
  let X = [cA * cG - sA * sB * sG, cG * sA + cA * sB * sG, -cB * sG];
  let Y = [-cB * sA, cA * cB, sB];
  const Z = [cA * sG + cG * sA * sB, sA * sG - cA * cG * sB, cB * cG];
  [X, Y] = screenRot(X, Y);
  setBasis(X, Y, Z);
}
// here is the modification: Android Chrome AbsoluteOrientationSensor (quaternion, no gimbal lock, fused gyro+compass)
let sensor = null, sensorOn = false;
function startSensor() {
  if (!('AbsoluteOrientationSensor' in window)) return;
  try {
    sensor = new AbsoluteOrientationSensor({ frequency: 60, referenceFrame: 'screen' });
    sensor.addEventListener('reading', () => {
      const [x, y, z, w] = sensor.quaternion;          // rotation device(screen) -> earth (x East, y North, z Up)
      const X = [1 - 2 * (y * y + z * z), 2 * (x * y + w * z), 2 * (x * z - w * y)];
      const Y = [2 * (x * y - w * z), 1 - 2 * (x * x + z * z), 2 * (y * z + w * x)];
      const Z = [2 * (x * z + w * y), 2 * (y * z - w * x), 1 - 2 * (x * x + y * y)];
      sensorOn = true; setBasis(X, Y, Z);
    });
    sensor.addEventListener('error', () => { sensorOn = false; try { sensor.stop(); } catch (e) {} sensor = null; });
    sensor.start();
  } catch (e) { sensor = null; sensorOn = false; }
}
function stopSensor() { if (sensor) { try { sensor.stop(); } catch (e) {} } sensor = null; sensorOn = false; }
function setGyro(on) {
  if (on) {
    const start = () => {
      const ev = ('ondeviceorientationabsolute' in window) ? 'deviceorientationabsolute' : 'deviceorientation';
      addEventListener(ev, onOri); startSensor(); st.gyro = true; st.view.fov = 75; toast(t('gyroOn'));
      clearTimeout(gyroTimer); gyroTimer = setTimeout(() => { if (!gyroSeen) { toast(inFrame() ? t('sandboxGyro') : t('noGyro')); setGyro(false); } }, 2500);
      $('cGyro').classList.add('on');
    };
    if (typeof DeviceOrientationEvent !== 'undefined' && DeviceOrientationEvent.requestPermission) DeviceOrientationEvent.requestPermission().then(r => r === 'granted' ? start() : toast(inFrame() ? t('sandboxGyro') : t('noGyro'))).catch(() => toast(inFrame() ? t('sandboxGyro') : t('noGyro')));
    else if (typeof DeviceOrientationEvent !== 'undefined') start(); else toast(t('noGyro'));
  } else {
    removeEventListener('deviceorientationabsolute', onOri); removeEventListener('deviceorientation', onOri); stopSensor();
    if (st.gyro && gyroBasis) { const f = gyroBasis.f; st.view.az = (Math.atan2(f[1], f[0]) * R2D + 360) % 360; st.view.alt = Math.asin(f[2]) * R2D; }
    st.gyro = false; gyroBasis = null; $('cGyro').classList.remove('on');
  }
  st.dirty = true;
}

// ---------- UI ----------
let toastT = null;
function toast(m) { const e = $('toast'); e.textContent = m; e.classList.add('show'); clearTimeout(toastT); toastT = setTimeout(() => e.classList.remove('show'), 2600); }
function applyLang() {
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.body.lang = lang;
  document.querySelectorAll('[data-i]').forEach(e => { const v = t(e.dataset.i); if (typeof v === 'string') e.textContent = v; });
  $('btnLang').textContent = lang === 'ar' ? 'EN' : 'ع';
  $('q').placeholder = t('searchPh');
  $('tSpeed').innerHTML = T[lang].speeds.map((s, i) => `<option value="${i}">${s}</option>`).join(''); $('tSpeed').value = st.speedIdx;
  $('pAbout').innerHTML = t('aboutHTML');
  buildLayers(); buildCities(); updPlace(); showInfo(); if (st.guide) showGuide(); buildSearch(); refreshNow(); updTime();
  document.title = t('title') + ' — ' + (lang === 'ar' ? 'خالد محمد' : 'Khaled Mohamed');
  st.dirty = true;
}
function buildLayers() {
  const sw = { lines: '#82a5ff', ecliptic: '#ff9650', equator: '#d4a73c', altaz: '#78dca0', eqgrid: '#6fa8ff', meridian: '#ffffff', mw: '#9aa6c8', messier: '#ffa0c8' };
  $('pLayers').innerHTML = Object.keys(defLayers).map(k => `<label class="tog"><span>${sw[k] ? `<i class="sw" style="background:${sw[k]}"></i>` : ''}${T[lang].L[k]}</span><input type="checkbox" data-l="${k}" ${st.layers[k] ? 'checked' : ''}></label>`).join('') + (st.mode === '3d' ? `<div class="legend">${t('mirror')}</div>` : '');
  $('pLayers').querySelectorAll('input').forEach(i => i.onchange = () => { st.layers[i.dataset.l] = i.checked; KH.store.set('layers', st.layers); st.dirty = true; });
}
function buildCities() {
  const s = $('citySel'); s.innerHTML = KH.CITIES.map(c => `<option value="${c.id}">${c[lang]}</option>`).join('') + `<option value="custom">${loc.id === 'custom' || loc.id === 'geo' ? (loc.id === 'geo' ? t('myLoc') : t('custom')) + ' (' + loc.lat.toFixed(2) + ', ' + loc.lon.toFixed(2) + ')' : t('custom')}</option>`;
  s.value = KH.CITIES.some(c => c.id === loc.id) ? loc.id : 'custom';
  $('inLat').value = loc.lat; $('inLon').value = loc.lon;
}
function setLocation(l) { loc = l; KH.setLoc(l); buildCities(); updPlace(); compute(); showInfo(); refreshNow(); st.dirty = true; }
function updPlace() {
  const nm = loc.id === 'geo' ? t('myLoc') : loc.id === 'custom' ? t('custom') : (KH.CITIES.find(c => c.id === loc.id) || {})[lang] || loc[lang] || '';
  $('placeLbl').textContent = nm + ' · ' + KH.num(Math.abs(loc.lat), 2, lang) + '°' + (loc.lat >= 0 ? (lang === 'ar' ? 'ش' : 'N') : (lang === 'ar' ? 'ج' : 'S')) + ' ' + KH.num(Math.abs(loc.lon), 2, lang) + '°' + (loc.lon >= 0 ? (lang === 'ar' ? 'ق' : 'E') : (lang === 'ar' ? 'غ' : 'W'));
  $('tzNote').textContent = t('tz') + ': ' + KH.tzOf(loc);
}
$('citySel').onchange = e => { const c = KH.CITIES.find(x => x.id === e.target.value); if (c) setLocation(Object.assign({}, c)); };
$('btnApplyLL').onclick = () => { const la = parseFloat($('inLat').value), lo = parseFloat($('inLon').value); if (isFinite(la) && isFinite(lo) && Math.abs(la) <= 90) setLocation({ id: 'custom', lat: la, lon: lo, tz: Intl.DateTimeFormat().resolvedOptions().timeZone }); };
function geolocate(cb) {
  if (!navigator.geolocation) { toast(t('geoErr')); return; }
  navigator.geolocation.getCurrentPosition(p => { setLocation({ id: 'geo', lat: +p.coords.latitude.toFixed(4), lon: +p.coords.longitude.toFixed(4), tz: Intl.DateTimeFormat().resolvedOptions().timeZone }); toast(t('geoOk')); cb && cb(); }, () => { toast(inFrame() ? t('sandboxGyro') : t('geoErr')); cb && cb(); }, { enableHighAccuracy: false, timeout: 9000, maximumAge: 600000 });
}
$('btnGeo').onclick = () => geolocate();
$('cHere').onclick = () => { geolocate(); setMode('2d'); st.fly = { from: { ...st.view }, to: { az: 180, alt: 35, fov: 110 }, t0: performance.now() }; goLive(); };
$('cDome').onclick = () => { setMode('2d'); if (st.gyro) setGyro(false); st.fly = { from: { ...st.view }, to: { az: 180, alt: 90, fov: 182 }, t0: performance.now() }; };
$('cGyro').onclick = () => { setMode('2d'); setGyro(!st.gyro); };
$('cPolaris').onclick = () => { st.guide = st.guide === 'polaris' ? null : 'polaris'; if (st.guide) { setMode('2d'); st.layers.lines = true; st.fly = { from: { ...st.view }, to: { az: 0, alt: Math.max(15, Math.min(60, loc.lat)), fov: 105 }, t0: performance.now() }; } showGuide(); st.dirty = true; };
$('cNow').onclick = () => openDrawer('pNow');
$('cSearch').onclick = () => { openDrawer('pSearch'); setTimeout(() => $('q').focus(), 260); };
function showGuide() {
  const gd = $('guide'); $('cPolaris').classList.toggle('on', st.guide === 'polaris');
  if (st.guide !== 'polaris') { gd.hidden = true; return; }
  const latS = KH.num(loc.lat, 1, lang);
  gd.innerHTML = `<button class="ibtn x" id="gX">✕</button><b style="color:var(--gold-l)">${t('polarisT')}</b>` + (loc.lat < 0 ? `<p style="font-size:13px">${t('polarisSouth')}</p>` : `<ol>${T[lang].polarisSteps(latS).map(s => `<li>${s}</li>`).join('')}</ol>`);
  gd.hidden = false; $('gX').onclick = () => { st.guide = null; showGuide(); st.dirty = true; };
}
$('btnLang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; KH.setLang(lang); applyLang(); };
function setMode(m) { if (st.mode === m) return; st.mode = m; KH.store.set('mode', m); if (m === '3d' && st.gyro) setGyro(false); $('btnMode').textContent = m === '3d' ? '2D' : '3D'; buildLayers(); st.dirty = true; }
$('btnMode').onclick = () => setMode(st.mode === '3d' ? '2d' : '3d');
function openDrawer(p) { $('drawer').classList.add('open'); $('scrim').classList.add('on'); if (p) { document.querySelectorAll('.tab').forEach(x => x.classList.toggle('on', x.dataset.p === p)); document.querySelectorAll('.pane').forEach(x => x.classList.toggle('on', x.id === p)); } if (p === 'pNow' || !p) refreshNow(); }
function closeDrawer() { $('drawer').classList.remove('open'); $('scrim').classList.remove('on'); }
$('btnMenu').onclick = () => $('drawer').classList.contains('open') ? closeDrawer() : openDrawer();
$('scrim').onclick = closeDrawer;
document.querySelectorAll('.tab').forEach(b => b.onclick = () => openDrawer(b.dataset.p));
// time controls
function goLive() { st.live = true; st.rate = 0; st.t = Date.now(); updTime(); compute(); st.dirty = true; }
function play(dir) { st.live = false; st.dir = dir; st.rate = SPEEDS[st.speedIdx] * dir; updTime(); }
$('tPlay').onclick = () => { if (st.rate) { st.rate = 0; st.live = false; } else play(st.dir || 1); updTime(); };
$('tFwd').onclick = () => play(1); $('tBack').onclick = () => play(-1);
$('tNowB').onclick = goLive; $('btnNowDT').onclick = () => { goLive(); fillDT(); };
$('tSpeed').onchange = e => { st.speedIdx = +e.target.value; if (st.rate) st.rate = SPEEDS[st.speedIdx] * st.dir; };
let slAnchor = null;
$('tSlider').addEventListener('input', e => { if (slAnchor == null) slAnchor = st.t; st.live = false; st.rate = 0; st.t = slAnchor + (+e.target.value) * 60000; compute(); updTime(); st.dirty = true; });
$('tSlider').addEventListener('change', e => { slAnchor = null; e.target.value = 0; showInfo(); });
$('tDisp').onclick = () => { openDrawer('pPlace'); fillDT(); };
function fillDT() { const off = KH.tzOffsetMin(st.t, loc); const d = new Date(st.t + off * 60000); $('inDT').value = d.toISOString().slice(0, 16); }
$('btnApplyDT').onclick = () => { const v = $('inDT').value; if (!v) return; const [dp, tp] = v.split('T'); const [y, mo, d] = dp.split('-').map(Number); const [h, mi] = tp.split(':').map(Number);
  let ms = Date.UTC(y, mo - 1, d, h, mi); ms -= KH.tzOffsetMin(ms, loc) * 60000; ms = Date.UTC(y, mo - 1, d, h, mi) - KH.tzOffsetMin(ms, loc) * 60000;
  st.live = false; st.rate = 0; st.t = ms; compute(); updTime(); showInfo(); st.dirty = true; closeDrawer(); };
function updTime() {
  $('tDate').textContent = KH.fmtDate(st.t, loc, lang);
  $('tTime').textContent = KH.fmtTime(st.t, loc, lang, true);
  const l = $('tLive'); l.textContent = st.live ? t('live') : st.rate ? t('sim') : t('paused'); l.classList.toggle('off', !st.live);
  $('tPlay').textContent = st.rate ? '⏸' : '▶'; $('tPlay').classList.toggle('on', !!st.rate);
  $('tFwd').classList.toggle('on', st.rate > 0); $('tBack').classList.toggle('on', st.rate < 0);
}
// Now list
function refreshNow() {
  if (!F) return; const el = $('nowList'); if (!el) return;
  const rows = [];
  for (const b of F.bodies) { const [al, az] = hor(b.h); rows.push({ nm: PNAME[b.id][lang], al, az, col: PCOL[b.id], sel: { type: 'body', id: b.id }, mag: b.mag }); }
  const vis = rows.filter(r => r.al > 0).sort((a, b) => b.al - a.al);
  const stars = Object.keys(starName).map(Number).filter(i => sMag[i] < 1.6 && sH[i * 3 + 2] > 0.05).sort((a, b) => sMag[a] - sMag[b]).slice(0, 12)
    .map(i => { const [al, az] = hor([sH[i * 3], sH[i * 3 + 1], sH[i * 3 + 2]]); return { nm: nameOfStar(i), al, az, col: '#cfd8ff', sel: { type: 'star', id: i }, mag: sMag[i] }; });
  const row = r => `<div class="it" data-s='${JSON.stringify(r.sel)}'><span><i class="dot" style="background:${r.col}"></i>${r.nm}</span><small>${KH.compass(r.az, lang)} · ${t('aboveH')} ${KH.num(r.al, 0, lang)}°</small></div>`;
  el.innerHTML = `<b style="color:var(--gold-l)">${t('nowHead')}</b>` + (vis.length ? vis.map(row).join('') : `<div class="it">${t('nothing')}</div>`) + `<br><b style="color:var(--gold-l)">${t('bright')}</b>` + stars.map(row).join('');
  el.querySelectorAll('.it[data-s]').forEach(x => x.onclick = () => { closeDrawer(); setMode(st.mode); select(JSON.parse(x.dataset.s), true); });
}
// search
let sIndex = [];
function buildSearch() {
  sIndex = [];
  Object.keys(PNAME).forEach(id => sIndex.push({ k: KH.normAr(PNAME[id].ar + ' ' + PNAME[id].en), nm: PNAME[id][lang], sub: lang === 'ar' ? PNAME[id].en : PNAME[id].ar, sel: { type: 'body', id }, w: 0 }));
  for (const i in starName) { const n = starName[i]; if (!n.en && !n.ar) continue; sIndex.push({ k: KH.normAr((n.ar || '') + ' ' + (n.en || '')), nm: nameOfStar(i), sub: (lang === 'ar' ? n.en : n.ar) || '', sel: { type: 'star', id: +i }, w: sMag[i] }); }
  consList.forEach(c => sIndex.push({ k: KH.normAr(c.ar + ' ' + c.en + ' ' + c.id), nm: lang === 'ar' ? c.ar : c.en, sub: t('cons'), sel: { type: 'cons', id: c.id }, w: 1 }));
  messier.forEach((o, i) => sIndex.push({ k: KH.normAr(o.id + ' ' + o.en + ' ' + o.ar), nm: (lang === 'ar' && o.ar) ? o.ar : (o.en || o.id), sub: o.id, sel: { type: 'messier', id: i }, w: 3 }));
}
$('q').addEventListener('input', () => {
  const q = KH.normAr($('q').value); const el = $('qList');
  if (!q) { el.innerHTML = ''; return; }
  const res = sIndex.filter(x => x.k.includes(q)).sort((a, b) => (a.k.indexOf(q) - b.k.indexOf(q)) || a.w - b.w).slice(0, 14);
  el.innerHTML = res.map((r, j) => `<div class="it" data-j="${j}"><span>${r.nm}</span><small>${r.sub}</small></div>`).join('');
  el.querySelectorAll('.it').forEach(x => x.onclick = () => { const r = res[+x.dataset.j]; if (r.sel.type === 'messier') { st.layers.messier = true; buildLayers(); } closeDrawer(); select(r.sel, true); });
});

// ---------- loop ----------
let last = performance.now(), lastLive = 0, lastInfo = 0;
function loop(now) {
  const dt = (now - last) / 1000; last = now;
  if (st.live) { if (now - lastLive > 1000) { st.t = Date.now(); lastLive = now; compute(); updTime(); st.dirty = true; } }
  else if (st.rate) { st.t += dt * 1000 * st.rate; compute(); updTime(); st.dirty = true; }
  stepFly(now);
  if (st.sel || st.guide) st.dirty = true; // animated ring
  if (st.dirty) { st.dirty = false; draw(); }
  if (st.sel && now - lastInfo > (st.rate ? 400 : 5000)) { lastInfo = now; showInfo(); }
  requestAnimationFrame(loop);
}
$('logo').innerHTML = KH.logoSVG(36);
$('btnMode').textContent = st.mode === '3d' ? '2D' : '3D';
compute(); applyLang(); updTime();
// deep link: #t=<ms>&sel=body:moon|hip:32349|cons:Ori|m:M42
(function () {
  let h = new URLSearchParams(location.hash.slice(1)); if (!h.get('t') && !h.get('sel')) { const dl = KH.store.get('deeplink', null); if (dl && Date.now() - dl.at < 60000) h = new URLSearchParams(dl.q); KH.store.set('deeplink', null); }
  const tt = +h.get('t'), sl = h.get('sel');
  if (tt) { st.live = false; st.rate = 0; st.t = tt; compute(); updTime(); }
  if (sl) { const [ty, id] = sl.split(':'); let sel = null;
    if (ty === 'body') sel = { type: 'body', id }; else if (ty === 'hip' && hipIdx[+id] != null) sel = { type: 'star', id: hipIdx[+id] };
    else if (ty === 'cons' && consMap[id]) sel = { type: 'cons', id }; else if (ty === 'm') { const i = messier.findIndex(o => o.id === id); if (i >= 0) { st.layers.messier = true; sel = { type: 'messier', id: i }; } }
    if (sel) { if (st.mode === '3d') setMode('2d'); select(sel, true); } }
})();
if (!KH.store.get('seenTip', false)) { setTimeout(() => toast(lang === 'ar' ? 'اسحب للتحريك، وقرّب بإصبعين، والمس أي جرم لعرض تفاصيله' : 'Drag to look around, pinch to zoom, tap any object for details'), 600); KH.store.set('seenTip', true); }
requestAnimationFrame(loop);
// test hook
window.__atlas = { st, compute, draw, select, setMode, get F() { return F; }, hipIdx, setLocation };
})();
