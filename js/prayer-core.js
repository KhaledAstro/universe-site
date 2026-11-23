// ===== Prayer times & Qibla (Astronomy Engine based) =====
(function (root) {
'use strict';
const AE = Astronomy, B = AE.Body, D2R = Math.PI / 180, R2D = 180 / Math.PI, MIN = 60000, DAY = 86400000;
// fajr/isha: sun depression (deg) or isha minutes after maghrib; adj: minutes added to each time (precaution), as commonly applied by each authority
const METHODS = {
  egypt: { ar: 'الهيئة المصرية العامة للمساحة', en: 'Egyptian General Authority of Survey', fajr: 19.5, isha: 17.5 },
  umm: { ar: 'أم القرى (مكة المكرمة)', en: 'Umm al-Qura, Makkah', fajr: 18.5, ishaMin: 90, ishaMinRamadan: 120 },
  mwl: { ar: 'رابطة العالم الإسلامي', en: 'Muslim World League', fajr: 18, isha: 17 },
  kuwait: { ar: 'الكويت', en: 'Kuwait', fajr: 18, isha: 17.5 },
  qatar: { ar: 'قطر', en: 'Qatar', fajr: 18, ishaMin: 90 },
  dubai: { ar: 'دبي (الإمارات)', en: 'Dubai (UAE)', fajr: 18.2, isha: 18.2 },
  jordan: { ar: 'الأردن', en: 'Jordan', fajr: 18, isha: 18 },
  morocco: { ar: 'المغرب', en: 'Morocco', fajr: 19, isha: 17 },
  karachi: { ar: 'جامعة العلوم الإسلامية بكراتشي', en: 'Univ. of Islamic Sciences, Karachi', fajr: 18, isha: 18 },
  isna: { ar: 'أمريكا الشمالية (ISNA)', en: 'ISNA (North America)', fajr: 15, isha: 15 },
  russia: { ar: 'روسيا (الإدارة الدينية لمسلمي روسيا)', en: 'Russia (SAMR)', fajr: 16, isha: 15 }
};
function defaultMethod(loc) {
  const tz = (loc.tz || '');
  if (/Cairo|Khartoum/.test(tz)) return 'egypt';
  if (/Riyadh/.test(tz)) return 'umm';
  if (/Kuwait/.test(tz)) return 'kuwait';
  if (/Qatar|Bahrain/.test(tz)) return 'qatar';
  if (/Dubai|Muscat/.test(tz)) return 'dubai';
  if (/Amman|Damascus|Beirut|Baghdad/.test(tz)) return 'jordan';
  if (/Casablanca|Algiers|Tunis/.test(tz)) return 'morocco';
  if (/Moscow|Volgograd|Samara/.test(tz)) return 'russia';
  if (/Karachi|Kolkata|Dhaka/.test(tz)) return 'karachi';
  if (/America/.test(tz)) return 'isna';
  return 'mwl';
}
const ms = at => at ? +at.date : null;
// Prayer times for the local day that starts at dayStart (UT ms of local midnight)
function times(dayStart, loc, opt) {
  const o = new AE.Observer(loc.lat, loc.lon, loc.h || 0), d = new Date(dayStart), M = METHODS[opt.method] || METHODS.mwl, r = {};
  const noon = AE.SearchHourAngle(B.Sun, o, 0, d);
  r.dhuhr = ms(noon.time) + (opt.dhuhrMin || 0) * MIN;
  r.sunrise = ms(AE.SearchRiseSet(B.Sun, o, +1, d, 1));
  r.maghrib = ms(AE.SearchRiseSet(B.Sun, o, -1, d, 1));
  const fa = AE.SearchAltitude(B.Sun, o, +1, d, 1, -M.fajr); r.fajr = ms(fa);
  if (M.ishaMin) r.isha = r.maghrib != null ? r.maghrib + (opt.ramadan && M.ishaMinRamadan ? M.ishaMinRamadan : M.ishaMin) * MIN : null;
  else { const is = AE.SearchAltitude(B.Sun, o, -1, new Date(ms(noon.time)), 1, -M.isha); r.isha = ms(is); }
  // Asr: shadow length = factor x object height + noon shadow  =>  cot(h) = factor + tan|phi - delta|
  const eq = AE.Equator(B.Sun, noon.time, o, true, true);
  const z0 = Math.abs(loc.lat - eq.dec), f = opt.asr === 'hanafi' ? 2 : 1;
  const hAsr = Math.atan(1 / (f + Math.tan(z0 * D2R))) * R2D;
  r.asr = ms(AE.SearchAltitude(B.Sun, o, -1, noon.time, 1, hAsr));
  r.asrAlt = hAsr;
  // high-latitude fallback (angle never reached): one-seventh of the night
  if (r.fajr == null || r.isha == null) {
    const night = (r.sunrise + DAY) - r.maghrib;
    if (r.fajr == null && r.sunrise) r.fajr = r.sunrise - night / 7;
    if (r.isha == null && r.maghrib) r.isha = r.maghrib + night / 7;
    r.highLat = true;
  }
  // midnight (Islamic: half of sunset→fajr) and last third of the night
  const nextFajr = ms(AE.SearchAltitude(B.Sun, o, +1, new Date(dayStart + DAY), 1, -M.fajr)) || (r.fajr + DAY);
  r.midnight = r.maghrib + (nextFajr - r.maghrib) / 2; r.lastThird = r.maghrib + 2 * (nextFajr - r.maghrib) / 3;
  const add = opt.adj || {}; ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'].forEach(k => { if (r[k] != null && add[k]) r[k] += add[k] * MIN; });
  return r;
}
// Qibla: initial great-circle bearing to the Kaaba
const KAABA = { lat: 21.422487, lon: 39.826206 };
function qibla(loc) {
  const p1 = loc.lat * D2R, p2 = KAABA.lat * D2R, dl = (KAABA.lon - loc.lon) * D2R;
  const brg = (Math.atan2(Math.sin(dl), Math.cos(p1) * Math.tan(p2) - Math.sin(p1) * Math.cos(dl)) * R2D + 360) % 360;
  const c = Math.acos(Math.min(1, Math.sin(p1) * Math.sin(p2) + Math.cos(p1) * Math.cos(p2) * Math.cos(dl)));
  return { bearing: brg, km: c * 6371.0 };
}
root.Prayer = { METHODS, defaultMethod, times, qibla, KAABA };
})(window);
