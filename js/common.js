// ===== Shared helpers: language, location, time formatting, branding =====
(function (root) {
  const store = {
    get(k, d) { try { const v = localStorage.getItem('khSky.' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem('khSky.' + k, JSON.stringify(v)); } catch (e) { } }
  };
  const CITIES = [
    { id: 'cairo', ar: 'القاهرة', en: 'Cairo', lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo' },
    { id: 'ainshams', ar: 'عين شمس، القاهرة', en: 'Ain Shams, Cairo', lat: 30.1310, lon: 31.3290, tz: 'Africa/Cairo' },
    { id: 'kottamia', ar: 'مرصد القطامية', en: 'Kottamia Observatory', lat: 29.9326, lon: 31.8275, tz: 'Africa/Cairo' },
    { id: 'helwan', ar: 'حلوان', en: 'Helwan', lat: 29.8500, lon: 31.3340, tz: 'Africa/Cairo' },
    { id: 'alex', ar: 'الإسكندرية', en: 'Alexandria', lat: 31.2001, lon: 29.9187, tz: 'Africa/Cairo' },
    { id: 'luxor', ar: 'الأقصر', en: 'Luxor', lat: 25.6872, lon: 32.6396, tz: 'Africa/Cairo' },
    { id: 'aswan', ar: 'أسوان', en: 'Aswan', lat: 24.0889, lon: 32.8998, tz: 'Africa/Cairo' },
    { id: 'mecca', ar: 'مكة المكرمة', en: 'Mecca', lat: 21.4225, lon: 39.8262, tz: 'Asia/Riyadh' },
    { id: 'riyadh', ar: 'الرياض', en: 'Riyadh', lat: 24.7136, lon: 46.6753, tz: 'Asia/Riyadh' },
    { id: 'kuwait', ar: 'الكويت', en: 'Kuwait City', lat: 29.3759, lon: 47.9774, tz: 'Asia/Kuwait' },
    { id: 'dubai', ar: 'دبي', en: 'Dubai', lat: 25.2048, lon: 55.2708, tz: 'Asia/Dubai' },
    { id: 'doha', ar: 'الدوحة', en: 'Doha', lat: 25.2854, lon: 51.5310, tz: 'Asia/Qatar' },
    { id: 'amman', ar: 'عمّان', en: 'Amman', lat: 31.9454, lon: 35.9284, tz: 'Asia/Amman' },
    { id: 'rabat', ar: 'الرباط', en: 'Rabat', lat: 34.0209, lon: -6.8416, tz: 'Africa/Casablanca' },
    { id: 'khartoum', ar: 'الخرطوم', en: 'Khartoum', lat: 15.5007, lon: 32.5599, tz: 'Africa/Khartoum' },
    { id: 'kazan', ar: 'قازان', en: 'Kazan', lat: 55.7963, lon: 49.1088, tz: 'Europe/Moscow' },
    { id: 'rome', ar: 'روما', en: 'Rome', lat: 41.9028, lon: 12.4964, tz: 'Europe/Rome' },
    { id: 'london', ar: 'لندن', en: 'London', lat: 51.5072, lon: -0.1276, tz: 'Europe/London' },
    { id: 'capetown', ar: 'كيب تاون', en: 'Cape Town', lat: -33.9249, lon: 18.4241, tz: 'Africa/Johannesburg' }
  ];
  function getLoc() {
    const l = store.get('loc', null);
    if (l && typeof l.lat === 'number') return l;
    return Object.assign({}, CITIES[0]);
  }
  function setLoc(l) { store.set('loc', l); }
  function getLang() { return store.get('lang', 'ar'); }
  function setLang(l) { store.set('lang', l); }
  const AR_DIG = '٠١٢٣٤٥٦٧٨٩';
  function digits(s, lang) { s = String(s); return lang === 'ar' ? s.replace(/[0-9]/g, d => AR_DIG[d]) : s; }
  function num(x, dp, lang) { return digits((+x).toFixed(dp), lang).replace('-', '−'); }
  function tzOf(loc) { return loc.tz || Intl.DateTimeFormat().resolvedOptions().timeZone; }
  function fmtTime(ms, loc, lang, sec) {
    try {
      return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', { hour: '2-digit', minute: '2-digit', second: sec ? '2-digit' : undefined, hour12: lang === 'ar', timeZone: tzOf(loc) }).format(new Date(ms));
    } catch (e) { return new Date(ms).toLocaleTimeString(); }
  }
  function fmtDate(ms, loc, lang, opts) {
    try {
      return new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-GB', Object.assign({ weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', timeZone: tzOf(loc) }, opts || {})).format(new Date(ms));
    } catch (e) { return new Date(ms).toDateString(); }
  }
  function tzOffsetMin(ms, loc) { // minutes east of UTC for the place's zone at time ms
    try {
      const f = new Intl.DateTimeFormat('en-US', { timeZone: tzOf(loc), hourCycle: 'h23', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });
      const p = {}; f.formatToParts(new Date(ms)).forEach(x => p[x.type] = x.value);
      const asUTC = Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour % 24, +p.minute, +p.second);
      return Math.round((asUTC - Math.floor(ms / 1000) * 1000) / 60000);
    } catch (e) { return -new Date(ms).getTimezoneOffset(); }
  }
  function normAr(s) {
    return (s || '').toLowerCase().replace(/[ً-ٰٟـ]/g, '').replace(/[أإآا]/g, 'ا').replace(/ى/g, 'ي').replace(/ة/g, 'ه').replace(/\s+/g, ' ').trim();
  }
  const COMPASS = {
    ar: ['شمال', 'شمال شرق', 'شرق', 'جنوب شرق', 'جنوب', 'جنوب غرب', 'غرب', 'شمال غرب'],
    en: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  };
  function compass(az, lang) { return COMPASS[lang][Math.round(((az % 360) + 360) % 360 / 45) % 8]; }
  // Personal logo: infinity (Khaled = eternal) + star, gold on navy
  function logoSVG(size) {
    return `<svg viewBox="0 0 64 64" width="${size}" height="${size}" aria-hidden="true"><defs><linearGradient id="lg-gold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6e3a1"/><stop offset=".55" stop-color="#d4a73c"/><stop offset="1" stop-color="#a87b1f"/></linearGradient></defs><circle cx="32" cy="32" r="31" fill="#0b1430" stroke="url(#lg-gold)" stroke-width="1.5"/><path d="M14 34c0-5 4-8 8-8 7 0 13 16 20 16 4 0 8-3 8-8s-4-8-8-8c-7 0-13 16-20 16-4 0-8-3-8-8z" fill="none" stroke="url(#lg-gold)" stroke-width="3" stroke-linecap="round"/><path d="M32 8l2.2 6.3 6.6.2-5.3 4 1.9 6.4L32 21l-5.4 3.9 1.9-6.4-5.3-4 6.6-.2z" fill="url(#lg-gold)"/></svg>`;
  }
  root.KH = { store, CITIES, getLoc, setLoc, getLang, setLang, digits, num, fmtTime, fmtDate, tzOf, tzOffsetMin, normAr, compass, logoSVG };
})(window);
