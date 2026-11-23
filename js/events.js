// ===== Sky Events calendar UI — Khaled Mohamed =====
(function () {
'use strict';
const E = Events, AE = E.AE, DAY = E.DAY, HOUR = E.HOUR, MIN = E.MIN, D2R = Math.PI / 180, R2D = 180 / Math.PI;
const $ = id => document.getElementById(id);
let lang = KH.getLang(), loc = KH.getLoc();
const PN = { sun: ['الشمس', 'Sun'], moon: ['القمر', 'Moon'], mer: ['عطارد', 'Mercury'], ven: ['الزهرة', 'Venus'], mar: ['المريخ', 'Mars'], jup: ['المشتري', 'Jupiter'], sat: ['زحل', 'Saturn'], ura: ['أورانوس', 'Uranus'], nep: ['نبتون', 'Neptune'] };
const pn = k => PN[k][lang === 'ar' ? 0 : 1];
const T = {
  ar: { title: 'تقويم الظواهر الفلكية', useGeo: '📍 موقعي', next12: 'الـ ١٢ شهرًا القادمة', computing: '⏳ جاري الحساب…',
    hHijri: '🌙 الأهلّة وبدايات الشهور الهجرية', hijriLead: 'لكل شهر: لحظة الاقتران (ميلاد القمر)، وحالة الهلال عند غروب يوم الاقتران من موقعك، ثم بداية الشهر حسب ثلاثة معايير. اضغط على أي صف لعرض التفاصيل ورسم الهلال فوق الأفق.',
    hAll: '📅 كل الظواهر', hISS: '🛰️ مرور محطة الفضاء الدولية', today: 'اليوم', sunH: '☀️ الشمس اليوم', moonH: '🌙 القمر اليوم',
    astroDawn: 'الفجر الفلكي (−١٨°)', civilDawn: 'الشفق المدني صباحًا', rise: 'الشروق', noon: 'الزوال', set: 'الغروب', civilDusk: 'الشفق المدني مساءً', astroDusk: 'نهاية الشفق الفلكي', dayLen: 'طول النهار', noonAlt: 'ارتفاع الشمس عند الزوال',
    phase: 'الطور', illum: 'الإضاءة', age: 'العمر', dist: 'البعد', mrise: 'شروق القمر', mset: 'غروب القمر', nextPh: 'الأطوار القادمة', days: 'يوم', km: 'كم', h: 'س', m: 'د',
    phases: ['🌑 محاق (اقتران)', '🌓 تربيع أول', '🌕 بدر', '🌗 تربيع ثانٍ'], phaseNames: ['محاق', 'هلال متزايد', 'تربيع أول', 'أحدب متزايد', 'بدر', 'أحدب متناقص', 'تربيع ثانٍ', 'هلال متناقص'],
    cats: { all: 'الكل', moon: '🌙 القمر', eclipse: '🌘 كسوف وخسوف', planet: '🪐 الكواكب', sun: '☀️ الشمس والفصول', meteor: '☄️ الشهب' },
    month: 'الشهر', conj: 'الاقتران', sunset: 'غروب الشمس', moonset: 'غروب القمر', lag: 'المكث', moonAge: 'عمر الهلال', eve: 'مساء', uq: 'أم القرى (مكة)', eg: 'مصر (دار الإفتاء)', odeh: 'عودة: بالعين', odehO: 'عودة: بالتلسكوب', zone: 'منطقة الرؤية',
    zones: { A: 'يُرى بالعين المجردة بسهولة', B: 'قد يُرى بالعين، والأفضل بالمنظار', C: 'يُرى بالأجهزة البصرية فقط', D: 'لا يمكن رؤيته (حتى بالتلسكوب)' },
    criteriaNote: '<b>أم القرى:</b> يبدأ الشهر إذا حدث الاقتران قبل غروب الشمس في مكة، وغرب القمر بعد الشمس. وتعني العلامة <span style="color:#7ee2a8">✓</span> أن التاريخ المحسوب هنا يطابق جداول تقويم أم القرى الرسمية المضمّنة في المتصفح (وقد تطابقت جميع الأشهر من ١٤٤٦ إلى ١٤٤٩ هـ في اختبارنا). <b>مصر:</b> تطبيق للمنهج الذي تنشره دار الإفتاء المصرية: اقتران قبل الغروب في القاهرة، ومكث ١٠ دقائق على الأقل، وبُعد زاوي ٨° على الأقل. <b>عودة (ICOP):</b> معيار محمد شوكت عودة (٢٠٠٦)، ويعتمد على قوس الرؤية ARCV وعرض الهلال W محسوبين عند «أفضل وقت» (الغروب + ٤/٩ المكث) من موقعك. التواريخ تقديرات فلكية، والإعلان الرسمي يصدر عن الجهات المختصة.',
    lunarEcl: { total: 'خسوف كلي للقمر', partial: 'خسوف جزئي للقمر', penumbral: 'خسوف شبه ظلي للقمر' }, solarEcl: { total: 'كسوف كلي للشمس', annular: 'كسوف حلقي للشمس', hybrid: 'كسوف هجين للشمس', partial: 'كسوف جزئي للشمس' },
    visFull: 'مرئي بالكامل من موقعك', visPart: 'مرئي جزئيًا من موقعك', visNo: 'غير مرئي من موقعك', localAs: 'يُرى من موقعك كـ', obsc: 'نسبة الحجب', magn: 'القدر (المقدار)',
    opp: 'تقابل', oppD: 'الكوكب في الجهة المقابلة للشمس: أقرب وألمع ما يكون، يشرق مع الغروب ويظل طوال الليل.', elongE: 'أعظم استطالة شرقية (سماء المساء)', elongW: 'أعظم استطالة غربية (سماء الفجر)', elongD: 'أفضل فرصة لرؤية الكوكب بعيدًا عن وهج الشمس.',
    conjT: 'اقتران', near: 'القمر قرب', sepL: 'الفاصل الزاوي', seasons: { 0: 'الاعتدال الربيعي', 90: 'الانقلاب الصيفي', 180: 'الاعتدال الخريفي', 270: 'الانقلاب الشتوي' }, seasonsS: { 0: 'الاعتدال الخريفي', 90: 'الانقلاب الشتوي', 180: 'الاعتدال الربيعي', 270: 'الانقلاب الصيفي' },
    perihelion: 'الأرض في الحضيض الشمسي (أقرب نقطة للشمس)', aphelion: 'الأرض في الأوج الشمسي (أبعد نقطة عن الشمس)', kaaba: 'تعامد الشمس على الكعبة المشرفة', kaabaD: 'في هذه اللحظة تكون الشمس فوق الكعبة تمامًا، فاتجاه ظل أي عمود رأسي في موقعك يشير عكس القبلة، واتجاه الشمس نفسه هو القبلة.', abuSimbel: 'تعامد الشمس على وجه رمسيس الثاني (أبو سمبل)', abuD: 'تدخل أشعة الشروق إلى قدس الأقداس في معبد أبو سمبل.',
    meteor: 'ذروة زخة', zhr: 'المعدل (ZHR)', radAlt: 'ارتفاع نقطة الإشعاع الساعة ٣ فجرًا', moonLight: 'إضاءة القمر', parent: 'الجرم الأم', speed: 'السرعة', good: 'ظروف ممتازة', fair: 'ظروف متوسطة', poor: 'القمر يفسد الرؤية',
    supermoon: 'قمر عملاق (Supermoon)', micromoon: 'قمر صغير (Micromoon)', openAtlas: '🔭 شاهده في الأطلس', close: 'إغلاق', contacts: 'مراحل الحدث (بتوقيتك المحلي)', altAt: 'ارتفاع', localT: 'بتوقيت', notVis: 'تحت الأفق',
    P1: 'بداية شبه الظل', U1: 'بداية الخسوف الجزئي', U2: 'بداية الخسوف الكلي', max: 'ذروة الحدث', U3: 'نهاية الكلي', U4: 'نهاية الجزئي', P4: 'نهاية شبه الظل', C1: 'التماس الأول (بداية الكسوف)', C2: 'التماس الثاني (بداية الكلي/الحلقي)', C3: 'التماس الثالث', C4: 'التماس الرابع (نهاية الكسوف)',
    duration: 'المدة', bestTime: 'أفضل وقت', evening: 'سماء المساء بعد الغروب', morning: 'سماء الفجر قبل الشروق', globalPeak: 'ذروة الكسوف عالميًا عند', eyeWarn: '⚠️ لا تنظر للشمس أبدًا بدون نظارة كسوف معتمدة (ISO 12312-2).',
    issLead: 'يحتاج اتصالًا بالإنترنت لتحميل أحدث عناصر مدار المحطة (TLE) من CelesTrak، ثم يُحسب المرور محليًا لموقعك لمدة ٧ أيام. تظهر فقط المرورات المرئية: المحطة مضاءة بالشمس والسماء مظلمة.', issBtn: '🛰️ احسب المرور', issPaste: 'أو الصق TLE يدويًا', issNone: 'لا توجد مرورات مرئية في الأيام القادمة.', issErr: 'تعذّر تحميل البيانات. تأكد من الاتصال أو الصق TLE.', issStart: 'يظهر', issMax: 'أعلى ارتفاع', issEnd: 'يختفي', issDur: 'المدة',
    nextTr: 'العبور القادم لعطارد أمام قرص الشمس', credit: 'إعداد: خالد محمد — قسم الفلك وعلوم الفضاء والأرصاد الجوية، كلية العلوم، جامعة القاهرة · عضو AfAS وAUASS', engine: 'الحسابات: Astronomy Engine (Don Cross، MIT)، ومعيار عودة لرؤية الأهلة، وقائمة الشهب من IMO.',
    sunAltL: 'ارتفاع الشمس', moonAltL: 'ارتفاع القمر', daz: 'فرق السمت', arcl: 'الاستطالة', width: 'عرض الهلال', vval: 'قيمة V', bestT: 'أفضل وقت للرصد', horizon: 'الأفق الغربي' },
  en: { title: 'Sky Events Calendar', useGeo: '📍 My location', next12: 'Next 12 months', computing: '⏳ Computing…',
    hHijri: '🌙 Crescent visibility & Hijri months', hijriLead: 'For each month: the conjunction (new Moon), the crescent at sunset on the conjunction day from your location, and the month start by three criteria. Tap a row for details and a sketch of the crescent above the horizon.',
    hAll: '📅 All events', hISS: '🛰️ ISS passes', today: 'Today', sunH: '☀️ The Sun today', moonH: '🌙 The Moon today',
    astroDawn: 'Astronomical dawn (−18°)', civilDawn: 'Civil dawn', rise: 'Sunrise', noon: 'Solar noon', set: 'Sunset', civilDusk: 'Civil dusk', astroDusk: 'Astronomical dusk', dayLen: 'Day length', noonAlt: 'Noon altitude',
    phase: 'Phase', illum: 'Illuminated', age: 'Age', dist: 'Distance', mrise: 'Moonrise', mset: 'Moonset', nextPh: 'Next phases', days: 'days', km: 'km', h: 'h', m: 'm',
    phases: ['🌑 New Moon', '🌓 First quarter', '🌕 Full Moon', '🌗 Last quarter'], phaseNames: ['New', 'Waxing crescent', 'First quarter', 'Waxing gibbous', 'Full', 'Waning gibbous', 'Last quarter', 'Waning crescent'],
    cats: { all: 'All', moon: '🌙 Moon', eclipse: '🌘 Eclipses', planet: '🪐 Planets', sun: '☀️ Sun & seasons', meteor: '☄️ Meteors' },
    month: 'Month', conj: 'Conjunction', sunset: 'Sunset', moonset: 'Moonset', lag: 'Lag', moonAge: 'Age', eve: 'Evening', uq: 'Umm al-Qura (Mecca)', eg: 'Egypt (Dar al-Ifta)', odeh: 'Odeh: naked eye', odehO: 'Odeh: telescope', zone: 'Visibility zone',
    zones: { A: 'Easily visible to the naked eye', B: 'May be seen by eye; optical aid helps', C: 'Visible with optical aid only', D: 'Not visible, even with a telescope' },
    criteriaNote: '<b>Umm al-Qura:</b> the month begins if the conjunction occurs before sunset at Mecca and the Moon sets after the Sun. A <span style="color:#7ee2a8">✓</span> means the computed date matches the official Umm al-Qura tables built into the browser (all months 1446–1449 AH matched in our test). <b>Egypt:</b> an implementation of the method published by Dar al-Ifta: conjunction before sunset at Cairo, lag ≥ 10 min, elongation ≥ 8°. <b>Odeh (ICOP):</b> Odeh (2006) criterion using ARCV and crescent width W at the best time (sunset + 4/9 lag) for your location. Dates are astronomical estimates; official announcements come from the competent authorities.',
    lunarEcl: { total: 'Total lunar eclipse', partial: 'Partial lunar eclipse', penumbral: 'Penumbral lunar eclipse' }, solarEcl: { total: 'Total solar eclipse', annular: 'Annular solar eclipse', hybrid: 'Hybrid solar eclipse', partial: 'Partial solar eclipse' },
    visFull: 'Fully visible from your location', visPart: 'Partly visible from your location', visNo: 'Not visible from your location', localAs: 'Seen from your location as', obsc: 'Obscuration', magn: 'Magnitude',
    opp: 'Opposition', oppD: 'The planet is opposite the Sun: closest and brightest, rising at sunset and up all night.', elongE: 'Greatest eastern elongation (evening sky)', elongW: 'Greatest western elongation (morning sky)', elongD: 'Best chance to see the planet away from the Sun\'s glare.',
    conjT: 'Conjunction', near: 'Moon near', sepL: 'Separation', seasons: { 0: 'March equinox', 90: 'June solstice', 180: 'September equinox', 270: 'December solstice' }, seasonsS: { 0: 'March equinox', 90: 'June solstice', 180: 'September equinox', 270: 'December solstice' },
    perihelion: 'Earth at perihelion (closest to the Sun)', aphelion: 'Earth at aphelion (farthest from the Sun)', kaaba: 'Sun directly over the Kaaba', kaabaD: 'At this moment the Sun is at the zenith of Mecca, so the direction of the Sun from anywhere it is visible is the Qibla direction.', abuSimbel: 'Sun alignment at Abu Simbel', abuD: 'Sunrise rays reach the sanctuary of the Great Temple of Abu Simbel.',
    meteor: 'Peak of the', zhr: 'ZHR', radAlt: 'Radiant altitude at 03:00', moonLight: 'Moonlight', parent: 'Parent body', speed: 'Speed', good: 'Excellent conditions', fair: 'Fair conditions', poor: 'Moonlight interferes',
    supermoon: 'Supermoon', micromoon: 'Micromoon', openAtlas: '🔭 See it in the atlas', close: 'Close', contacts: 'Contacts (your local time)', altAt: 'Alt', localT: 'local', notVis: 'below horizon',
    P1: 'Penumbral begins', U1: 'Partial begins', U2: 'Totality begins', max: 'Maximum', U3: 'Totality ends', U4: 'Partial ends', P4: 'Penumbral ends', C1: 'First contact', C2: 'Second contact (totality/annularity)', C3: 'Third contact', C4: 'Last contact',
    duration: 'Duration', bestTime: 'Best time', evening: 'evening sky after sunset', morning: 'morning sky before sunrise', globalPeak: 'Greatest eclipse at', eyeWarn: '⚠️ Never look at the Sun without certified eclipse glasses (ISO 12312-2).',
    issLead: 'Needs an internet connection to load the latest ISS orbital elements (TLE) from CelesTrak; passes are then computed locally for 7 days. Only visible passes are shown: the station sunlit and the sky dark.', issBtn: '🛰️ Compute passes', issPaste: 'or paste a TLE', issNone: 'No visible passes in the coming days.', issErr: 'Could not load data. Check your connection or paste a TLE.', issStart: 'Appears', issMax: 'Max altitude', issEnd: 'Disappears', issDur: 'Duration',
    nextTr: 'Next transit of Mercury across the Sun', credit: 'By Khaled Mohamed — Astronomy, Space Science & Meteorology Dept., Faculty of Science, Cairo University · Member of AfAS and AUASS', engine: 'Computations: Astronomy Engine (Don Cross, MIT), the Odeh crescent criterion, and the IMO meteor shower list.',
    sunAltL: 'Sun altitude', moonAltL: 'Moon altitude', daz: 'ΔAz', arcl: 'Elongation', width: 'Crescent width', vval: 'V value', bestT: 'Best time', horizon: 'Western horizon' }
};
const t = k => T[lang][k];
const ft = x => x ? KH.fmtTime(x, loc, lang) : '—';
const fd = (x, o) => KH.fmtDate(x, loc, lang, o);
const fdt = x => fd(x) + ' · ' + ft(x);
const n = (x, d) => KH.num(x, d, lang);
const dur = msx => { const m = Math.round(msx / 60000); return lang === 'ar' ? KH.digits(`${Math.floor(m / 60)}س ${m % 60}د`, 'ar') : `${Math.floor(m / 60)}h ${m % 60}m`; };
const sleep = () => new Promise(r => setTimeout(r, 0));
const atlasLink = (tm, sel) => `atlas.html#t=${Math.round(tm)}&sel=${sel || ''}`;

let range = null, all = [], hijriRows = [], filter = 'all';

function initUI() {
  $('logo').innerHTML = KH.logoSVG(36);
  document.documentElement.lang = lang; document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'; document.body.lang = lang;
  document.querySelectorAll('[data-i]').forEach(e => { const v = t(e.dataset.i); if (typeof v === 'string') e.textContent = v; });
  $('btnLang').textContent = lang === 'ar' ? 'EN' : 'ع';
  const cs = $('citySel'); cs.innerHTML = KH.CITIES.map(c => `<option value="${c.id}">${c[lang]}</option>`).join('') + (KH.CITIES.some(c => c.id === loc.id) ? '' : `<option value="cur">${lang === 'ar' ? 'موقعي' : 'My location'} (${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)})</option>`);
  cs.value = KH.CITIES.some(c => c.id === loc.id) ? loc.id : 'cur';
  const y = new Date().getFullYear(), rs = $('rangeSel');
  rs.innerHTML = `<option value="next">${t('next12')}</option>` + [0, 1, 2, 3, 4, 5, 6].map(k => `<option value="${y + k}">${KH.digits(y + k, lang)}</option>`).join('');
  rs.value = KH.store.get('evRange', 'next');
  $('placeLbl').textContent = (KH.CITIES.find(c => c.id === loc.id) || {})[lang] || `${loc.lat.toFixed(2)}, ${loc.lon.toFixed(2)}`;
  $('filters').innerHTML = Object.keys(T[lang].cats).map(k => `<button class="chip${k === filter ? ' on' : ''}" data-f="${k}">${T[lang].cats[k]}</button>`).join('');
  $('filters').querySelectorAll('.chip').forEach(b => b.onclick = () => { filter = b.dataset.f; $('filters').querySelectorAll('.chip').forEach(x => x.classList.toggle('on', x === b)); renderList(); });
  $('foot').innerHTML = `${KH.logoSVG(30)}<br>${t('credit')}<br><span style="opacity:.8">${t('engine')}</span><br><a href="index.html">${lang === 'ar' ? 'الصفحة الرئيسية' : 'Home'}</a> · <a href="atlas.html">${lang === 'ar' ? 'أطلس السماء' : 'Sky Atlas'}</a>`;
  document.title = t('title') + ' — ' + (lang === 'ar' ? 'خالد محمد' : 'Khaled Mohamed');
}
$('btnLang').onclick = () => { lang = lang === 'ar' ? 'en' : 'ar'; KH.setLang(lang); initUI(); renderToday(); renderHijri(); renderList(); renderISS(); };
$('citySel').onchange = e => { const c = KH.CITIES.find(x => x.id === e.target.value); if (c) { loc = Object.assign({}, c); KH.setLoc(loc); run(); } };
$('rangeSel').onchange = e => { KH.store.set('evRange', e.target.value); run(); };
$('btnGeo').onclick = () => navigator.geolocation && navigator.geolocation.getCurrentPosition(p => { loc = { id: 'geo', lat: +p.coords.latitude.toFixed(4), lon: +p.coords.longitude.toFixed(4), tz: Intl.DateTimeFormat().resolvedOptions().timeZone }; KH.setLoc(loc); run(); }, () => alert(lang === 'ar' ? 'تعذّر تحديد الموقع' : 'Location unavailable'));

// ---------- Today ----------
function moonPhaseName(lonDiff) { return T[lang].phaseNames[Math.round(lonDiff / 45) % 8]; }
function moonIcon(lonDiff) { return ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘'][Math.round(lonDiff / 45) % 8]; }
function renderToday() {
  const now = Date.now(), ds = E.localDayStart(now, loc), s = E.sunTimes(ds, loc), m = E.moonTimes(ds, loc), mi = E.moonInfo(now);
  const ph = E.lunarPhases(now, now + 32 * DAY).slice(0, 4);
  $('today').innerHTML = `<div class="panel card"><h3>${t('sunH')} <small style="color:var(--muted);font-weight:400">${fd(now)}</small></h3><div class="kv">
    <b>${t('astroDawn')}</b><span>${ft(s.astroDawn)}</span><b>${t('civilDawn')}</b><span>${ft(s.civilDawn)}</span><b>${t('rise')}</b><span>${ft(s.rise)}</span>
    <b>${t('noon')}</b><span>${ft(s.noon)}</span><b>${t('set')}</b><span>${ft(s.set)}</span><b>${t('civilDusk')}</b><span>${ft(s.civilDusk)}</span><b>${t('astroDusk')}</b><span>${ft(s.astroDusk)}</span>
    <b>${t('dayLen')}</b><span>${s.dayLen ? dur(s.dayLen) : '—'}</span><b>${t('noonAlt')}</b><span>${n(s.noonAlt, 1)}°</span></div></div>
  <div class="panel card"><h3>${t('moonH')} <span style="font-size:24px">${moonIcon(mi.phaseLon)}</span></h3><div class="kv">
    <b>${t('phase')}</b><span>${moonPhaseName(mi.phaseLon)}</span><b>${t('illum')}</b><span>${n(mi.k * 100, 0)}%</span><b>${t('age')}</b><span>${n(mi.age, 1)} ${t('days')}</span>
    <b>${t('dist')}</b><span>${KH.digits(Math.round(mi.dist).toLocaleString('en'), lang)} ${t('km')}</span><b>${t('mrise')}</b><span>${ft(m.rise)}</span><b>${t('mset')}</b><span>${ft(m.set)}</span></div>
    <div style="margin-top:10px;font-size:13px;color:var(--muted)">${t('nextPh')}</div><div class="kv" style="margin-top:4px">${ph.map(p => `<b>${T[lang].phases[p.phase]}</b><span>${fdt(p.t)}</span>`).join('')}</div></div>`;
}

// ---------- compute ----------
async function run() {
  initUI(); renderToday();
  const rv = $('rangeSel').value; const now = Date.now();
  range = rv === 'next' ? [E.localDayStart(now, loc), now + 365 * DAY] : [Date.UTC(+rv, 0, 1), Date.UTC(+rv + 1, 0, 1)];
  $('hijri').innerHTML = `<div class="spin">${t('computing')}</div>`; $('list').innerHTML = `<div class="spin">${t('computing')}</div>`;
  const [t0, t1] = range; all = []; hijriRows = [];
  const phases = E.lunarPhases(t0, t1); await sleep();
  const aps = E.lunarApsides(t0 - 20 * DAY, t1 + 20 * DAY);
  for (const p of phases) {
    const ev = { t: p.t, kind: 'phase', phase: p.phase, cat: 'moon' };
    if (p.phase === 2 || p.phase === 0) { const d = E.moonInfo(p.t).dist; ev.dist = d; if (d < 360000) ev.super = true; if (d > 405000) ev.micro = true; }
    all.push(ev);
  }
  for (const p of phases.filter(p => p.phase === 0)) { hijriRows.push(E.monthStart(p.t, loc)); if (hijriRows.length % 3 === 0) { renderHijri(); await sleep(); } }
  renderHijri();
  hijriRows.forEach(r => { const d = r.odehEye || (r.egypt && r.egypt.day) || (r.ummAlQura && r.ummAlQura.day); if (d) all.push({ t: d, kind: 'hijri', r, cat: 'moon', dayOnly: true }); });
  await sleep();
  E.lunarEclipses(t0, t1, loc).forEach(e => all.push(Object.assign(e, { cat: 'eclipse' })));
  E.solarEclipses(t0, t1, loc).forEach(e => all.push(Object.assign(e, { cat: 'eclipse' })));
  await sleep(); renderList();
  E.planetEvents(t0, t1).forEach(e => { if ((e.kind === 'moonconj' || e.kind === 'moonstar') && e.sep > 2) return; all.push(Object.assign(e, { cat: e.kind === 'moonconj' || e.kind === 'moonstar' ? 'moon' : 'planet' })); });
  await sleep();
  E.seasons(t0, t1).forEach(e => all.push(Object.assign(e, { cat: 'sun' })));
  E.kaaba(t0, t1).forEach(e => all.push(Object.assign(e, { cat: 'sun' })));
  abuSimbel(t0, t1).forEach(e => all.push(Object.assign(e, { cat: 'sun' })));
  E.meteorPeaks(t0, t1, loc).forEach(e => all.push(Object.assign(e, { cat: 'meteor' })));
  all.sort((a, b) => a.t - b.t);
  renderList(); renderISS();
}
function abuSimbel(t0, t1) {
  const AS = { lat: 22.3372, lon: 31.6258, tz: 'Africa/Cairo' }, out = [];
  for (let y = new Date(t0).getUTCFullYear(); y <= new Date(t1).getUTCFullYear(); y++) for (const [m, d] of [[1, 22], [9, 22]]) { const ds = E.localDayStart(Date.UTC(y, m, d, 12), AS); const r = E.sunTimes(ds, AS).rise; if (r >= t0 && r <= t1) out.push({ t: r, kind: 'abusimbel' }); }
  return out;
}

// ---------- Hijri table ----------
function zoneTag(z) { return `<span class="z z${z}" title="${T[lang].zones[z]}">${z}</span>`; }
// here is the modification of checking our Umm al-Qura computation against the official calendar tables built into the browser (Intl islamic-umalqura)
let uqFmt = null; try { uqFmt = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura', { day: 'numeric', timeZone: 'UTC' }); if (uqFmt.resolvedOptions().calendar !== 'islamic-umalqura') uqFmt = null; } catch (e) { uqFmt = null; }
function uqOfficial(conj) { if (!uqFmt) return null; for (let k = -1; k <= 4; k++) { const d = new Date(Math.floor(conj / 86400000 + k) * 86400000 + 12 * 3600000); if (uqFmt.formatToParts(d).find(x => x.type === 'day').value === '1') return d.getTime(); } return null; }
function uqMark(r) { const o = uqOfficial(r.conj), u = r.ummAlQura && r.ummAlQura.day; if (!o || !u) return ''; return Math.abs(o - u) < 13 * 3600e3 ? ' <span title="' + (lang === 'ar' ? 'يطابق تقويم أم القرى الرسمي' : 'Matches the official Umm al-Qura calendar') + '" style="color:#7ee2a8">✓</span>' : ' <span style="color:#ff9fb3" title="' + (lang === 'ar' ? 'الرسمي: ' : 'Official: ') + fd(o) + '">≠</span>'; }
function renderHijri() {
  if (!hijriRows.length) return;
  const rows = hijriRows.map((r, i) => {
    const e0 = r.evenings[0] && r.evenings[0].c;
    const dd = x => x ? fd(x, { weekday: 'short', day: 'numeric', month: 'short', year: undefined }) : '—';
    return `<tr class="clk" data-i="${i}"><td><b>${E.HIJRI[lang][r.hijri.m]}</b> ${KH.digits(r.hijri.y, lang)}</td><td>${fdt(r.conj)}</td>
      <td>${e0 ? ft(e0.sunset) + ' / ' + ft(e0.moonset) : '—'}</td><td>${e0 ? (e0.lag > 0 ? n(e0.lag, 0) + ' ' + t('m') : '<span style="color:#ff9fb3">' + n(e0.lag, 0) + ' ' + t('m') + '</span>') : '—'}</td>
      <td>${r.evenings.map(x => zoneTag(x.c.zone)).join(' ')}</td><td>${dd(r.ummAlQura && r.ummAlQura.day)}${uqMark(r)}</td><td>${dd(r.egypt && r.egypt.day)}</td><td>${dd(r.odehEye)}</td></tr>`;
  }).join('');
  $('hijri').innerHTML = `<table class="t"><thead><tr><th>${t('month')}</th><th>${t('conj')}</th><th>${t('sunset')} / ${t('moonset')}</th><th>${t('lag')}</th><th>${t('zone')}</th><th>${t('uq')}</th><th>${t('eg')}</th><th>${t('odeh')}</th></tr></thead><tbody>${rows}</tbody></table>
   <div class="legend-z">${['A', 'B', 'C', 'D'].map(z => `<span>${zoneTag(z)} ${T[lang].zones[z]}</span>`).join('')}</div><div class="note2">${t('criteriaNote')}</div>`;
  $('hijri').querySelectorAll('tr.clk').forEach(tr => tr.onclick = () => showHijri(hijriRows[+tr.dataset.i]));
}
function crescentSVG(c) {
  // sky sketch at best time: x = azimuth difference (moon - sun), y = altitude
  const W = 320, H = 200, sx = 14, sy = 14, ox = W / 2, oy = H - 40;
  const mx = ox + (((c.mAzSunset - c.sAzSunset + 540) % 360) - 180) * sx, my = oy - c.mAltSunset * sy;
  const dz = (((c.mAzSunset - c.sAzSunset + 540) % 360) - 180);
  const grid = [-6, -4, -2, 0, 2, 4, 6].map(x => `<line x1="${ox + x * sx}" y1="${oy}" x2="${ox + x * sx}" y2="${oy + 5}" stroke="#9fb0d6"/><text x="${ox + x * sx}" y="${oy + 17}" fill="#9fb0d6" font-size="10" text-anchor="middle">${n(x, 0)}°</text>`).join('') + [2, 4, 6, 8, 10].map(y => `<text x="6" y="${oy - y * sy + 3}" fill="#9fb0d6" font-size="10">${n(y, 0)}°</text><line x1="22" y1="${oy - y * sy}" x2="${W - 6}" y2="${oy - y * sy}" stroke="#ffffff12"/>`).join('');
  const ang = Math.atan2(-(0 - c.mAltSunset), -(0 - dz)) ; // toward the sun (sun at horizon)
  const r = 9, k = Math.max(0.03, (1 - Math.cos(c.arcl * D2R)) / 2), rx = r * Math.abs(2 * k - 1);
  const rot = Math.atan2((oy + 0.6 * sy) - my, ox - mx) * R2D;
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:420px;background:linear-gradient(#0d1838,#3a3f6b 70%,#d9844a);border-radius:12px">
   ${grid}<rect x="0" y="${oy}" width="${W}" height="${H - oy}" fill="#111a14"/><text x="${W - 8}" y="${oy + 30}" fill="#9fb0d6" font-size="11" text-anchor="end">${t('horizon')}</text>
   <circle cx="${ox}" cy="${oy + 0.83 * sy}" r="10" fill="#ffcf6b" opacity=".9"/><text x="${ox}" y="${oy + 32}" fill="#ffd98a" font-size="11" text-anchor="middle">${pn('sun')}</text>
   ${c.mAltSunset > -2 ? `<g transform="translate(${mx},${my}) rotate(${rot})"><circle r="${r}" fill="#2a2f3d"/><path d="M0 ${-r} A${r} ${r} 0 0 1 0 ${r} A${rx} ${r} 0 0 ${k < 0.5 ? 0 : 1} 0 ${-r}" fill="#f4f1e6"/></g><text x="${mx}" y="${my - 14}" fill="#fff" font-size="11" text-anchor="middle">${pn('moon')}</text>` : ''}
  </svg>`;
}
function showHijri(r) {
  const evs = r.evenings.map(x => { const c = x.c; return `<div class="panel" style="margin-top:10px"><b>${t('eve')} ${fd(x.day, { weekday: 'long', day: 'numeric', month: 'long', year: undefined })}</b> ${zoneTag(c.zone)} <small>${T[lang].zones[c.zone]}</small>
    <div class="kv" style="margin-top:8px"><b>${t('sunset')}</b><span>${ft(c.sunset)}</span><b>${t('moonset')}</b><span>${ft(c.moonset)}</span><b>${t('lag')}</b><span>${n(c.lag, 0)} ${t('m')}</span><b>${t('moonAge')}</b><span>${c.age > 0 ? n(c.age, 1) + ' ' + t('h') : (lang === 'ar' ? 'قبل الاقتران' : 'before conjunction')}</span>
    <b>${t('bestT')}</b><span>${ft(c.tb)}</span><b>${t('moonAltL')}</b><span>${n(c.mAlt, 2)}°</span><b>ARCV</b><span>${n(c.arcv, 2)}°</span><b>${t('arcl')} (ARCL)</b><span>${n(c.arcl, 2)}°</span><b>${t('daz')} (DAZ)</b><span>${n(c.daz, 2)}°</span><b>${t('width')} (W)</b><span>${n(c.W, 3)}′</span><b>${t('vval')}</b><span>${n(c.V, 2)}</span></div>
    <div style="margin-top:8px">${crescentSVG(c)}</div><a class="btn sm ghost" style="display:inline-block;margin-top:8px;text-decoration:none" href="${atlasLink(c.sunset + 5 * MIN, 'body:moon')}">${t('openAtlas')}</a></div>`; }).join('');
  openModal(`<button class="ibtn x" onclick="document.getElementById('modal').hidden=true">✕</button><h3>🌙 ${E.HIJRI[lang][r.hijri.m]} ${KH.digits(r.hijri.y, lang)} ${lang === 'ar' ? 'هـ' : 'AH'}</h3>
   <div class="kv"><b>${t('conj')}</b><span>${fdt(r.conj)}</span><b>${t('uq')}</b><span>${r.ummAlQura ? fd(r.ummAlQura.day) : '—'}</span><b>${t('eg')}</b><span>${r.egypt ? fd(r.egypt.day) : '—'}</span><b>${t('odeh')}</b><span>${r.odehEye ? fd(r.odehEye) : '—'}</span><b>${t('odehO')}</b><span>${r.odehOptic ? fd(r.odehOptic) : '—'}</span></div>${evs}
   <div class="note2">${t('criteriaNote')}</div>`);
}

// ---------- event list ----------
function evTitle(e) {
  switch (e.kind) {
    case 'phase': return T[lang].phases[e.phase] + (e.super ? ` <span class="badge b-star">${t('supermoon')}</span>` : e.micro ? ` <span class="badge b-part">${t('micromoon')}</span>` : '');
    case 'hijri': return `🌙 ${lang === 'ar' ? 'بداية شهر' : 'Start of'} ${E.HIJRI[lang][e.r.hijri.m]} ${KH.digits(e.r.hijri.y, lang)} ${lang === 'ar' ? 'هـ (تقديرًا)' : 'AH (estimate)'}`;
    case 'lunarEclipse': return '🌘 ' + T[lang].lunarEcl[e.type] + visBadge(e.visible);
    case 'solarEclipse': return '🌞 ' + T[lang].solarEcl[e.type] + (e.local ? ` <span class="badge b-yes">${t('localAs')} ${T[lang].solarEcl[e.local.type]}</span>` : visBadge('none'));
    case 'opposition': return `🪐 ${t('opp')} ${pn(e.a)}`;
    case 'elongation': return `✨ ${pn(e.a)}: ${e.east ? t('elongE') : t('elongW')}`;
    case 'conj': return `💫 ${t('conjT')} ${pn(e.a)} ${lang === 'ar' ? 'و' : '&'} ${pn(e.b)}`;
    case 'moonconj': return `🌙 ${t('near')} ${pn(e.b)}`;
    case 'moonstar': return `🌙 ${t('near')} ${lang === 'ar' ? e.star[3] : e.star[2]}`;
    case 'transit': return `⚫ ${lang === 'ar' ? 'عبور' : 'Transit of'} ${pn(e.a)}`;
    case 'season': return '☀️ ' + (loc.lat >= 0 ? T[lang].seasons : T[lang].seasonsS)[e.L];
    case 'perihelion': return '🌍 ' + t('perihelion'); case 'aphelion': return '🌍 ' + t('aphelion');
    case 'kaaba': return '🕋 ' + t('kaaba'); case 'abusimbel': return '🏛️ ' + t('abuSimbel');
    case 'meteor': return `☄️ ${t('meteor')} ${lang === 'ar' ? e.s.ar : e.s.en}` + (e.moonK < 0.35 && e.radAlt > 20 ? ` <span class="badge b-yes">${t('good')}</span>` : e.moonK > 0.7 ? ` <span class="badge b-no">${t('poor')}</span>` : ` <span class="badge b-part">${t('fair')}</span>`);
  }
}
function visBadge(v) { return v === 'full' ? ` <span class="badge b-yes">${t('visFull')}</span>` : v === 'partial' ? ` <span class="badge b-part">${t('visPart')}</span>` : ` <span class="badge b-no">${t('visNo')}</span>`; }
function evDesc(e) {
  switch (e.kind) {
    case 'phase': return e.dist ? `${t('dist')}: ${KH.digits(Math.round(e.dist).toLocaleString('en'), lang)} ${t('km')}` : '';
    case 'hijri': return `${t('uq')}: ${e.r.ummAlQura ? fd(e.r.ummAlQura.day, { weekday: 'short', day: 'numeric', month: 'short', year: undefined }) : '—'} · ${t('eg')}: ${e.r.egypt ? fd(e.r.egypt.day, { weekday: 'short', day: 'numeric', month: 'short', year: undefined }) : '—'} · ${t('odeh')}: ${e.r.odehEye ? fd(e.r.odehEye, { weekday: 'short', day: 'numeric', month: 'short', year: undefined }) : '—'}`;
    case 'lunarEclipse': return `${t('max')}: ${ft(e.c.max)}${e.obsc > 0 ? ' · ' + t('obsc') + ': ' + n(e.obsc * 100, 0) + '%' : ''} · ${e.sd.tot ? t('duration') + ' ' + dur(e.sd.tot * 2 * MIN) : ''}`;
    case 'solarEclipse': return e.local ? `${t('max')}: ${ft(e.local.c.max)} · ${t('obsc')}: ${n(e.local.obsc * 100, 0)}% · ${t('magn')}: ${n(e.local.mag, 3)}` : `${t('globalPeak')} ${n(Math.abs(e.lat), 1)}°${e.lat >= 0 ? (lang === 'ar' ? 'ش' : 'N') : (lang === 'ar' ? 'ج' : 'S')} ${n(Math.abs(e.lon), 1)}°${e.lon >= 0 ? (lang === 'ar' ? 'ق' : 'E') : (lang === 'ar' ? 'غ' : 'W')}`;
    case 'opposition': return `${t('oppD')} ${t('magn')}: ${n(e.mag, 1)} · ${t('dist')}: ${n(e.dist, 2)} AU`;
    case 'elongation': return `${n(e.el, 1)}° — ${t('elongD')}`;
    case 'conj': case 'moonconj': case 'moonstar': return `${t('sepL')}: ${n(e.sep, 1)}°`;
    case 'season': { const s = E.sunTimes(E.localDayStart(e.t, loc), loc); return `${t('dayLen')}: ${dur(s.dayLen)} · ${t('noonAlt')}: ${n(s.noonAlt, 1)}°`; }
    case 'perihelion': case 'aphelion': return `${n(e.d, 5)} AU = ${KH.digits(Math.round(e.d * 149597870.7).toLocaleString('en'), lang)} ${t('km')}`;
    case 'kaaba': return t('kaabaD');
    case 'abusimbel': return t('abuD');
    case 'meteor': return `${t('zhr')}: ${n(e.s.zhr, 0)} · ${lang === 'ar' ? 'المتوقع في الساعة: نحو ' + n(e.hrDark, 0) + ' في موقع مظلم، ' + n(e.hrCity, 0) + ' من المدينة' : 'expected per hour: ~' + n(e.hrDark, 0) + ' at a dark site, ' + n(e.hrCity, 0) + ' from a city'} · ${t('radAlt')}: ${n(e.radAlt, 0)}° · ${t('moonLight')}: ${n(e.moonK * 100, 0)}%`;
  }
  return '';
}
function renderList() {
  if (!all.length) return;
  const items = all.filter(e => filter === 'all' || e.cat === filter);
  let html = '', lastM = '';
  for (let i = 0; i < items.length; i++) {
    const e = items[i], m = fd(e.t, { weekday: undefined, day: undefined, month: 'long', year: 'numeric' });
    if (m !== lastM) { html += `<div class="month-h">${m}</div>`; lastM = m; }
    const dt = e.dayOnly ? fd(e.t, { weekday: 'long', day: 'numeric', month: 'long', year: undefined }) : fd(e.t, { weekday: 'long', day: 'numeric', month: 'long', year: undefined }) + ' · ' + ft(e.t);
    html += `<div class="panel ev" data-k="${all.indexOf(e)}"><div class="bd"><div class="tt">${evTitle(e)}</div><div class="dt">${dt}</div><div class="ds">${evDesc(e)}</div></div></div>`;
  }
  $('list').innerHTML = html || `<div class="spin">—</div>`;
  $('list').querySelectorAll('.ev').forEach(d => d.onclick = () => showEvent(all[+d.dataset.k]));
}

// ---------- event detail ----------
function contactsTable(c, alt, keys) {
  return `<table class="t" style="min-width:0"><thead><tr><th>${t('contacts')}</th><th></th><th>${t('altAt')}</th></tr></thead><tbody>` + keys.filter(k => c[k]).map(k => `<tr><td>${t(k)}</td><td>${ft(c[k])}</td><td>${alt[k] > 0 ? n(alt[k], 1) + '°' : `<span style="color:#ff9fb3">${t('notVis')}</span>`}</td></tr>`).join('') + '</tbody></table>';
}
function lunarSVG(e) {
  const g = tt => { const m = AE.GeoMoon(new Date(tt)), s = AE.GeoVector(AE.Body.Sun, new Date(tt), true); const sl = s.Length(), ml = m.Length(); const a = [-s.x / sl, -s.y / sl, -s.z / sl], u = [m.x / ml, m.y / ml, m.z / ml];
    let e1 = [-a[1], a[0], 0]; const l1 = Math.hypot(...e1); e1 = e1.map(x => x / l1); const e2 = [a[1] * e1[2] - a[2] * e1[1], a[2] * e1[0] - a[0] * e1[2], a[0] * e1[1] - a[1] * e1[0]];
    const RE = 6378.14 / 149597870.7, piM = Math.asin(RE / ml) * R2D, sS = 959.63 / 3600 / sl, piS = 8.794 / 3600 / sl, sM = Math.asin(1737.4 / 149597870.7 / ml) * R2D;
    return { x: -(u[0] * e1[0] + u[1] * e1[1] + u[2] * e1[2]) * R2D, y: (u[0] * e2[0] + u[1] * e2[1] + u[2] * e2[2]) * R2D, ru: 1.01 * piM - sS + piS, rp: 1.01 * piM + sS + piS, sM }; };
  const G = g(e.c.max), S = 150 / (G.rp + G.sM * 1.6), W = 340, H = 340, cx = W / 2, cy = H / 2;
  const pts = []; for (let i = 0; i <= 40; i++) { const tt = e.c.P1 - 20 * MIN + (e.c.P4 - e.c.P1 + 40 * MIN) * i / 40; pts.push(g(tt)); }
  const keys = ['P1', 'U1', 'U2', 'max', 'U3', 'U4', 'P4'].filter(k => e.c[k]);
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:380px;background:#070b18;border-radius:12px">
   <circle cx="${cx}" cy="${cy}" r="${G.rp * S}" fill="#3a3550" opacity=".55"/><circle cx="${cx}" cy="${cy}" r="${G.ru * S}" fill="#5a1d1d" opacity=".85"/>
   <text x="${cx}" y="${cy - G.rp * S + 14}" fill="#c8c0e8" font-size="11" text-anchor="middle">${lang === 'ar' ? 'شبه الظل' : 'Penumbra'}</text><text x="${cx}" y="${cy}" fill="#ffb3a8" font-size="11" text-anchor="middle">${lang === 'ar' ? 'الظل' : 'Umbra'}</text>
   <polyline points="${pts.map(p => (cx + p.x * S) + ',' + (cy - p.y * S)).join(' ')}" fill="none" stroke="#d4a73c" stroke-dasharray="4 4"/>
   ${keys.map(k => { const p = g(e.c[k]); return `<circle cx="${cx + p.x * S}" cy="${cy - p.y * S}" r="${p.sM * S}" fill="${k === 'max' ? '#b5502f' : '#e9ecf2'}" opacity="${k === 'max' ? .9 : .35}" stroke="#fff" stroke-width=".6"/><text x="${cx + p.x * S}" y="${cy - p.y * S + p.sM * S + 12}" fill="#e8edf9" font-size="10" text-anchor="middle">${k}</text>`; }).join('')}
  </svg>`;
}
function solarSVG(e) {
  const tr = E.solarTrack(e, loc, 60), W = 340, H = 320, S = 40, cx = W / 2, cy = H / 2;
  const keys = ['C1', 'C2', 'max', 'C3', 'C4'].filter(k => e.local.c[k]);
  const at = tt => { const i = Math.round((tt - tr[0].t) / (tr[tr.length - 1].t - tr[0].t) * 60); return tr[Math.max(0, Math.min(60, i))]; };
  return `<svg viewBox="0 0 ${W} ${H}" width="100%" style="max-width:380px;background:#070b18;border-radius:12px" id="solSvg">
    <defs><radialGradient id="sg"><stop offset="0" stop-color="#fff6c8"/><stop offset=".8" stop-color="#ffcc55"/><stop offset="1" stop-color="#ff9a2a"/></radialGradient></defs>
    <circle cx="${cx}" cy="${cy}" r="${S}" fill="url(#sg)"/>
    <polyline points="${tr.map(p => (cx - p.x * S) + ',' + (cy - p.y * S)).join(' ')}" fill="none" stroke="#9fb0d6" stroke-dasharray="3 4"/>
    ${keys.map(k => { const p = at(e.local.c[k]); return `<circle cx="${cx - p.x * S}" cy="${cy - p.y * S}" r="${p.rM * S}" fill="#0b0f1c" opacity="${k === 'max' ? .95 : .35}" stroke="#9fb0d6" stroke-width=".7"/><text x="${cx - p.x * S}" y="${cy - p.y * S - p.rM * S - 4}" fill="#e8edf9" font-size="10" text-anchor="middle">${k}</text>`; }).join('')}
    <text x="8" y="${H - 8}" fill="#9fb0d6" font-size="10">${lang === 'ar' ? 'الاتجاه كما يُرى في السماء (أعلى = سمت الرأس)' : 'As seen in the sky (up = toward zenith)'}</text></svg>`;
}
function showEvent(e) {
  let body = `<p style="color:var(--muted);margin:2px 0 10px">${e.dayOnly ? fd(e.t) : fdt(e.t)}</p><div class="ds" style="font-size:14px;line-height:1.8">${evDesc(e)}</div>`;
  let sel = '';
  if (e.kind === 'lunarEclipse') { body += `<div style="margin:10px 0">${lunarSVG(e)}</div>` + contactsTable(e.c, e.alt, ['P1', 'U1', 'U2', 'max', 'U3', 'U4', 'P4']); sel = 'body:moon'; }
  if (e.kind === 'solarEclipse') { body += `<p class="note2" style="color:#ffcf8a">${t('eyeWarn')}</p>`; if (e.local) { body += `<div style="margin:10px 0">${solarSVG(e)}</div>` + contactsTable(e.local.c, e.local.alt, ['C1', 'C2', 'max', 'C3', 'C4']); if (e.local.c.C2) body += `<p><b>${lang === 'ar' ? 'مدة الكلي/الحلقي' : 'Totality/annularity'}:</b> ${KH.digits(Math.floor((e.local.c.C3 - e.local.c.C2) / 60000) + ':' + String(Math.round((e.local.c.C3 - e.local.c.C2) / 1000) % 60).padStart(2, '0'), lang)}</p>`; } sel = 'body:sun'; }
  if (e.kind === 'meteor') body += `<div class="kv" style="margin-top:10px"><b>${t('parent')}</b><span>${e.s.parent}</span><b>${t('speed')}</b><span>${n(e.s.v, 0)} km/s</span><b>${lang === 'ar' ? 'نقطة الإشعاع' : 'Radiant'}</b><span>RA ${n(e.s.ra, 0)}° · Dec ${n(e.s.dec, 0)}°</span><b>${t('bestTime')}</b><span>${fdt(e.tObs)}</span><b>${lang === 'ar' ? 'مؤشر التجمّع r' : 'Population index r'}</b><span>${n(e.s.r, 1)}</span></div><p class="small" style="margin-top:8px">${lang === 'ar' ? 'المعدل الساعي المتوقع HR = ZHR × sin(ارتفاع نقطة الإشعاع) × r<sup>−(6.5 − LM)</sup>، حيث LM أضعف قدر نجمي تراه العين. يفترض الحساب LM = 6.5 في موقع مظلم (مطروحًا منه أثر ضوء القمر)، و LM = 4 في سماء مدينة كالقاهرة. ZHR قيمة مثالية لا يراها راصد حقيقي تقريبًا.' : 'Expected hourly rate HR = ZHR × sin(radiant altitude) × r<sup>−(6.5 − LM)</sup>, where LM is the naked-eye limiting magnitude. We assume LM = 6.5 at a dark site (minus a moonlight penalty) and LM = 4 in a city sky like Cairo. ZHR is an idealised value a real observer almost never sees.'}</p>`;
  if (e.kind === 'hijri') { showHijri(e.r); return; }
  if (['opposition', 'elongation'].includes(e.kind)) sel = 'body:' + e.a;
  if (['conj'].includes(e.kind)) sel = 'body:' + e.a;
  if (['moonconj', 'moonstar', 'phase'].includes(e.kind)) sel = 'body:moon';
  if (['season', 'perihelion', 'aphelion', 'kaaba', 'abusimbel'].includes(e.kind)) sel = 'body:sun';
  if (e.kind === 'kaaba') { const o = E.obs(loc), s = E.topo(AE.Body.Sun, e.t, o, true); body += `<p><b>${lang === 'ar' ? 'من موقعك في هذه اللحظة' : 'From your location at that moment'}:</b> ${lang === 'ar' ? 'الشمس على ارتفاع' : 'Sun altitude'} ${n(s.alt, 1)}° ${lang === 'ar' ? 'وسمت' : ', azimuth'} ${n(s.az, 1)}° (${KH.compass(s.az, lang)}) ${s.alt > 0 ? (lang === 'ar' ? '← هذا هو اتجاه القبلة.' : '← this is your Qibla direction.') : (lang === 'ar' ? '(الشمس تحت الأفق عندك).' : '(the Sun is below your horizon).')}</p>`; }
  const tAtlas = e.kind === 'meteor' ? e.tObs : e.kind === 'elongation' ? (e.east ? E.sunTimes(E.localDayStart(e.t, loc), loc).civilDusk : E.sunTimes(E.localDayStart(e.t, loc), loc).civilDawn) : e.t;
  openModal(`<button class="ibtn x" onclick="document.getElementById('modal').hidden=true">✕</button><h3>${evTitle(e)}</h3>${body}<a class="btn sm" style="display:inline-block;margin-top:12px;text-decoration:none" href="${atlasLink(tAtlas, sel)}">${t('openAtlas')}</a>`);
}
function openModal(h) { $('modalBox').innerHTML = h; $('modal').hidden = false; $('modalBox').scrollTop = 0; }
$('modal').onclick = e => { if (e.target.id === 'modal') $('modal').hidden = true; };
document.addEventListener('click', ev => { const a = ev.target.closest('a[href^="atlas.html#"]'); if (a) KH.store.set('deeplink', { q: a.getAttribute('href').split('#')[1], at: Date.now() }); }, true);

// ---------- ISS ----------
function renderISS() {
  const tr = E.nextTransits(Date.now()).find(x => x.a === 'mer');
  $('iss').innerHTML = `<p class="lead" style="margin:0 0 10px">${t('issLead')}</p><button class="btn" id="issGo">${t('issBtn')}</button>
   <details style="margin-top:10px"><summary style="cursor:pointer;color:var(--muted);font-size:13px">${t('issPaste')}</summary><textarea class="inp" id="issTle" rows="3" style="width:100%;margin-top:6px;font-family:monospace;font-size:11px"></textarea></details><div id="issOut" style="margin-top:10px"></div>
   <p class="note2">⚫ ${t('nextTr')}: ${fdt(tr.t)}</p>`;
  $('issGo').onclick = issRun;
}
async function issRun() {
  const out = $('issOut'); out.innerHTML = `<div class="spin">${t('computing')}</div>`;
  let tle = ($('issTle').value || '').trim().split('\n').map(s => s.trim()).filter(Boolean);
  if (tle.length < 2) {
    try { const r = await fetch('https://celestrak.org/NORAD/elements/gp.php?CATNR=25544&FORMAT=TLE'); const tx = await r.text(); tle = tx.trim().split('\n').map(s => s.trim()); KH.store.set('issTle', { tle, at: Date.now() }); }
    catch (err) { const c = KH.store.get('issTle', null); if (c) tle = c.tle; else { out.innerHTML = `<div class="note2">${t('issErr')}</div>`; return; } }
  }
  const l1 = tle.find(s => s.startsWith('1 ')), l2 = tle.find(s => s.startsWith('2 '));
  if (!l1 || !l2) { out.innerHTML = `<div class="note2">${t('issErr')}</div>`; return; }
  const rec = satellite.twoline2satrec(l1, l2), gd = { longitude: loc.lon * D2R, latitude: loc.lat * D2R, height: 0.05 };
  const o = E.obs(loc), passes = []; let cur = null;
  const t0 = Date.now(), t1 = t0 + 7 * DAY;
  for (let tt = t0; tt < t1; tt += 20000) {
    const d = new Date(tt), pv = satellite.propagate(rec, d); if (!pv || !pv.position) continue;
    const gm = satellite.gstime(d), ecf = satellite.eciToEcf(pv.position, gm), la = satellite.ecfToLookAngles(gd, ecf), el = la.elevation * R2D;
    if (el > 10) {
      if (!cur) { const sAlt = E.topo(AE.Body.Sun, tt, o).alt; cur = { start: tt, sAlt, maxEl: el, tMax: tt, azStart: la.azimuth * R2D, lit: 0, n: 0 }; }
      const sv = AE.GeoVector(AE.Body.Sun, d, true), su = [sv.x, sv.y, sv.z].map(x => x / sv.Length()), p = pv.position, along = p.x * su[0] + p.y * su[1] + p.z * su[2];
      const perp = Math.hypot(p.x - along * su[0], p.y - along * su[1], p.z - along * su[2]); const lit = along > 0 || perp > 6378;
      cur.n++; if (lit) cur.lit++;
      if (el > cur.maxEl) { cur.maxEl = el; cur.tMax = tt; cur.azMax = la.azimuth * R2D; }
      cur.end = tt; cur.azEnd = la.azimuth * R2D;
    } else if (cur) { if (cur.sAlt < -6 && cur.lit > 0) passes.push(cur); cur = null; }
  }
  out.innerHTML = passes.length ? `<table class="t" style="min-width:0"><thead><tr><th>${lang === 'ar' ? 'التاريخ' : 'Date'}</th><th>${t('issStart')}</th><th>${t('issMax')}</th><th>${t('issEnd')}</th><th>${t('issDur')}</th></tr></thead><tbody>` +
    passes.map(p => `<tr><td>${fd(p.start, { weekday: 'short', day: 'numeric', month: 'short', year: undefined })}</td><td>${ft(p.start)} ${KH.compass(p.azStart, lang)}</td><td>${ft(p.tMax)} · ${n(p.maxEl, 0)}° ${KH.compass(p.azMax || p.azStart, lang)}</td><td>${ft(p.end)} ${KH.compass(p.azEnd, lang)}</td><td>${dur(p.end - p.start)}</td></tr>`).join('') + '</tbody></table>' : `<div class="note2">${t('issNone')}</div>`;
}

run();
})();
