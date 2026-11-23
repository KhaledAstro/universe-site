// ===== Phenomena engine (built on Astronomy Engine, MIT, Don Cross) =====
// Lunar phases, crescent visibility & Hijri month starts, eclipses, planetary events, seasons, meteor showers, Sun over the Kaaba
(function (root) {
'use strict';
const AE = Astronomy, D2R = Math.PI / 180, R2D = 180 / Math.PI, DAY = 86400000, HOUR = 3600000, MIN = 60000;
const AU_KM = 149597870.7, RM = 1737.4;
const B = AE.Body;
const obs = loc => new AE.Observer(loc.lat, loc.lon, loc.h || 0);
const ms = at => at ? (at.date ? +at.date : +at) : null;
const wrap180 = x => { x = ((x % 360) + 360) % 360; return x > 180 ? x - 360 : x; };
function topo(body, t, o, refr) { const eq = AE.Equator(body, new Date(t), o, true, true); const h = AE.Horizon(new Date(t), o, eq.ra, eq.dec, refr ? 'normal' : null); return { eq, alt: h.altitude, az: h.azimuth }; }
function localDayStart(t, loc) { const o = KH.tzOffsetMin(t, loc) * MIN; return Math.floor((t + o) / DAY) * DAY - o; }

// ---------- Sun & Moon daily ----------
function sunTimes(dayStart, loc) {
  const o = obs(loc), d = new Date(dayStart), r = {};
  r.rise = ms(AE.SearchRiseSet(B.Sun, o, +1, d, 1)); r.set = ms(AE.SearchRiseSet(B.Sun, o, -1, d, 1));
  [['civil', -6], ['naut', -12], ['astro', -18]].forEach(([k, a]) => { r[k + 'Dawn'] = ms(AE.SearchAltitude(B.Sun, o, +1, d, 1, a)); r[k + 'Dusk'] = ms(AE.SearchAltitude(B.Sun, o, -1, d, 1, a)); });
  const hn = AE.SearchHourAngle(B.Sun, o, 0, d); r.noon = ms(hn.time); r.noonAlt = hn.hor.altitude;
  r.dayLen = r.rise && r.set ? r.set - r.rise : null;
  return r;
}
function moonTimes(dayStart, loc) { const o = obs(loc), d = new Date(dayStart); return { rise: ms(AE.SearchRiseSet(B.Moon, o, +1, d, 1)), set: ms(AE.SearchRiseSet(B.Moon, o, -1, d, 1)) }; }
function moonInfo(t) {
  const ill = AE.Illumination(B.Moon, new Date(t)), ph = AE.MoonPhase(new Date(t)), gv = AE.GeoMoon(new Date(t));
  return { k: ill.phase_fraction, phaseLon: ph, age: ph / 360 * 29.530588853, dist: gv.Length() * AU_KM, mag: ill.mag };
}

// ---------- Lunar phases ----------
function lunarPhases(t0, t1) {
  const ev = []; let mq = AE.SearchMoonQuarter(new Date(t0));
  while (ms(mq.time) <= t1) { ev.push({ t: ms(mq.time), phase: mq.quarter }); mq = AE.NextMoonQuarter(mq); }
  return ev;
}

// ---------- Hijri month labels: anchored on the new moon of 2026-02-17 (Ramadan 1447) ----------
const HIJRI = { ar: ['محرم', 'صفر', 'ربيع الأول', 'ربيع الآخر', 'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان', 'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'], en: ['Muharram', 'Safar', "Rabi' al-Awwal", "Rabi' al-Akhir", 'Jumada al-Ula', 'Jumada al-Akhira', 'Rajab', "Sha'ban", 'Ramadan', 'Shawwal', "Dhu al-Qa'dah", 'Dhu al-Hijjah'] };
const REF_NM = Date.UTC(2026, 1, 17, 12, 1);
function hijriOfNewMoon(t) { const k = Math.round((t - REF_NM) / (29.530588853 * DAY)); const idx = 8 + k; return { m: ((idx % 12) + 12) % 12, y: 1447 + Math.floor(idx / 12) }; }

// ---------- Crescent visibility (Odeh 2006) on the evening of a local day ----------
const MECCA = { id: 'mecca', lat: 21.4225, lon: 39.8262, tz: 'Asia/Riyadh' }, CAIRO = { id: 'cairo', lat: 30.0444, lon: 31.2357, tz: 'Africa/Cairo' };
function crescentEvening(dayStart, loc, conj) {
  const o = obs(loc);
  const ss = AE.SearchRiseSet(B.Sun, o, -1, new Date(dayStart + 6 * HOUR), 1); if (!ss) return null;
  const sunset = ms(ss);
  const msr = AE.SearchRiseSet(B.Moon, o, -1, new Date(sunset - 4 * HOUR), 1);
  const moonset = ms(msr), lag = moonset != null ? (moonset - sunset) / MIN : null;
  const tb = lag > 0 ? sunset + lag * 4 / 9 * MIN : sunset;
  const S = topo(B.Sun, tb, o), M = topo(B.Moon, tb, o);
  const arcv = M.alt - S.alt, daz = Math.abs(wrap180(M.az - S.az));
  const arcl = AE.AngleBetween(S.eq.vec, M.eq.vec);
  const sd = Math.asin(RM / (M.eq.dist * AU_KM)) * R2D * 60; // topocentric semi-diameter, arcmin
  const W = sd * (1 - Math.cos(arcl * D2R));
  const V = arcv - (-0.1018 * W ** 3 + 0.7319 * W ** 2 - 6.3226 * W + 7.1651);
  let zone = V >= 5.65 ? 'A' : V >= 2 ? 'B' : V >= -0.96 ? 'C' : 'D';
  if (!(lag > 0) || conj > sunset) zone = 'D';
  const elongGeo = AE.AngleFromSun(B.Moon, new Date(sunset));
  const Ss = topo(B.Sun, sunset, o), Ms = topo(B.Moon, sunset, o);
  return { sunset, moonset, lag, age: (sunset - conj) / HOUR, conjBefore: conj < sunset, tb, mAlt: M.alt, sAlt: S.alt, mAltSunset: Ms.alt, arcv, daz, arcl, W, V, zone, elongGeo, mAzSunset: Ms.az, sAzSunset: Ss.az };
}
function monthStart(conj, loc) {
  const r = { conj, hijri: hijriOfNewMoon(conj) };
  const d0 = localDayStart(conj, loc);
  r.evenings = [0, 1, 2].map(k => ({ day: d0 + k * DAY, c: crescentEvening(d0 + k * DAY, loc, conj) })).filter(x => x.c && x.c.sunset > conj - 12 * HOUR);
  const first = (place, test) => { const ds = localDayStart(conj, place); for (let k = 0; k < 3; k++) { const c = crescentEvening(ds + k * DAY, place, conj); if (c && test(c)) return { day: ds + (k + 1) * DAY + 12 * HOUR, eve: c }; } return null; };
  r.ummAlQura = first(MECCA, c => c.conjBefore && c.lag > 0);
  r.egypt = first(CAIRO, c => c.conjBefore && c.lag >= 10 && c.elongGeo >= 8);
  const eye = r.evenings.find(x => x.c.zone === 'A' || x.c.zone === 'B'), opt = r.evenings.find(x => x.c.zone !== 'D');
  r.odehEye = eye ? eye.day + DAY + 12 * HOUR : null; r.odehOptic = opt ? opt.day + DAY + 12 * HOUR : null;
  return r;
}

// ---------- Eclipses ----------
function lunarEclipses(t0, t1, loc) {
  const out = [], o = obs(loc); let e = AE.SearchLunarEclipse(new Date(t0 - 2 * DAY));
  while (ms(e.peak) <= t1) {
    const pk = ms(e.peak), c = { max: pk, P1: pk - e.sd_penum * MIN, P4: pk + e.sd_penum * MIN };
    if (e.sd_partial > 0) { c.U1 = pk - e.sd_partial * MIN; c.U4 = pk + e.sd_partial * MIN; }
    if (e.sd_total > 0) { c.U2 = pk - e.sd_total * MIN; c.U3 = pk + e.sd_total * MIN; }
    const alt = {}; for (const k in c) alt[k] = topo(B.Moon, c[k], o, true).alt;
    const a = c.U1 ? 'U1' : 'P1', b = c.U4 ? 'U4' : 'P4';
    const anyUp = Object.values(alt).some(x => x > 0);
    const visible = !anyUp ? 'none' : (alt[a] > 0 && alt[b] > 0 ? 'full' : 'partial');
    if (pk >= t0) out.push({ t: pk, kind: 'lunarEclipse', type: e.kind, obsc: e.obscuration, c, alt, visible, sd: { pen: e.sd_penum, par: e.sd_partial, tot: e.sd_total } });
    e = AE.NextLunarEclipse(e.peak);
  }
  return out;
}
function solarEclipses(t0, t1, loc) {
  const out = [], o = obs(loc); let g = AE.SearchGlobalSolarEclipse(new Date(t0 - 2 * DAY));
  while (ms(g.peak) <= t1) {
    const pk = ms(g.peak);
    if (pk >= t0) {
      let L = null;
      try { const le = AE.SearchLocalSolarEclipse(new Date(pk - 1.5 * DAY), o); if (Math.abs(ms(le.peak.time) - pk) < 1.2 * DAY) L = le; } catch (err) { }
      let local = null;
      if (L) {
        const c = { C1: ms(L.partial_begin.time), max: ms(L.peak.time), C4: ms(L.partial_end.time) }, alt = { C1: L.partial_begin.altitude, max: L.peak.altitude, C4: L.partial_end.altitude };
        if (L.total_begin) { c.C2 = ms(L.total_begin.time); c.C3 = ms(L.total_end.time); alt.C2 = L.total_begin.altitude; alt.C3 = L.total_end.altitude; }
        const sunUp = Object.values(alt).some(x => x > -0.5);
        const S = topo(B.Sun, c.max, o), M = topo(B.Moon, c.max, o);
        const rs = 959.63 / 3600 / S.eq.dist, rm = Math.asin(RM / (M.eq.dist * AU_KM)) * R2D, d = AE.AngleBetween(S.eq.vec, M.eq.vec);
        const mag = (rs + rm - d) / (2 * rs);
        if (sunUp) local = { type: L.kind, obsc: L.obscuration, mag, c, alt };
      }
      out.push({ t: pk, kind: 'solarEclipse', type: g.kind, obsc: g.obscuration, lat: g.latitude, lon: g.longitude, local });
    }
    g = AE.NextGlobalSolarEclipse(g.peak);
  }
  return out;
}
// moon offset relative to the sun on the sky (units of solar radius) for drawing local solar eclipses
function solarTrack(ev, loc, n) {
  const o = obs(loc), c = ev.local.c, out = [];
  for (let i = 0; i <= n; i++) {
    const t = c.C1 + (c.C4 - c.C1) * i / n, S = topo(B.Sun, t, o), M = topo(B.Moon, t, o);
    const rs = 959.63 / 3600 / S.eq.dist, rm = Math.asin(RM / (M.eq.dist * AU_KM)) * R2D;
    out.push({ t, x: wrap180(M.az - S.az) * Math.cos(S.alt * D2R) / rs, y: (M.alt - S.alt) / rs, rM: rm / rs, alt: S.alt });
  }
  return out;
}

// ---------- Planets ----------
const PL = { mer: B.Mercury, ven: B.Venus, mar: B.Mars, jup: B.Jupiter, sat: B.Saturn, ura: B.Uranus, nep: B.Neptune };
const BRIGHT = ['mer', 'ven', 'mar', 'jup', 'sat'];
function planetEvents(t0, t1) {
  const ev = [];
  for (const k of ['mar', 'jup', 'sat', 'ura', 'nep']) { let t = t0; for (let i = 0; i < 4; i++) { const r = AE.SearchRelativeLongitude(PL[k], 180, new Date(t)); const tt = ms(r); if (tt > t1) break; ev.push({ t: tt, kind: 'opposition', a: k, mag: AE.Illumination(PL[k], new Date(tt)).mag, dist: AE.GeoVector(PL[k], new Date(tt), true).Length() }); t = tt + 30 * DAY; } }
  for (const k of ['mer', 'ven']) { let t = t0; for (let i = 0; i < 12; i++) { const r = AE.SearchMaxElongation(PL[k], new Date(t)); const tt = ms(r.time); if (tt > t1) break; ev.push({ t: tt, kind: 'elongation', a: k, el: r.elongation, east: r.visibility === 'evening' }); t = tt + 10 * DAY; } }
  const gv = (k, t) => k === 'moon' ? AE.GeoMoon(new Date(t)) : AE.GeoVector(PL[k], new Date(t), true);
  const sepF = (a, b) => t => AE.AngleBetween(gv(a, t), typeof b === 'string' ? gv(b, t) : b);
  const refine = (f, a, b) => { for (let i = 0; i < 40; i++) { const m1 = a + (b - a) / 3, m2 = b - (b - a) / 3; if (f(m1) < f(m2)) b = m2; else a = m1; } return (a + b) / 2; };
  const elongOK = (k, t) => AE.AngleFromSun(PL[k], new Date(t)) > 12;
  const pairs = []; for (let i = 0; i < BRIGHT.length; i++) for (let j = i + 1; j < BRIGHT.length; j++) pairs.push([BRIGHT[i], BRIGHT[j]]);
  const minScan = (f, step, lim, cb) => { let a = f(t0 - step), b = f(t0); for (let t = t0; t <= t1; t += step) { const c = f(t + step); if (b <= a && b < c && b < lim) { const tm = refine(f, t - step, t + step); cb(tm, f(tm)); } a = b; b = c; } };
  for (const [a, b] of pairs) minScan(sepF(a, b), DAY, 3.5, (tm, s) => { if (s < 3 && elongOK(a, tm) && elongOK(b, tm)) ev.push({ t: tm, kind: 'conj', a, b, sep: s }); });
  for (const k of BRIGHT) minScan(sepF('moon', k), 6 * HOUR, 6, (tm, s) => { if (s < 4 && elongOK(k, tm)) ev.push({ t: tm, kind: 'moonconj', a: 'moon', b: k, sep: s }); });
  const STARS = [[68.98, 16.51, 'Aldebaran', 'الدبران'], [152.09, 11.97, 'Regulus', 'قلب الأسد'], [201.30, -11.16, 'Spica', 'السماك الأعزل'], [247.35, -26.43, 'Antares', 'قلب العقرب'], [56.75, 24.12, 'Pleiades', 'الثريا']];
  for (const s of STARS) { const v = AE.VectorFromSphere(new AE.Spherical(s[1], s[0], 1), new AE.AstroTime(new Date(t0))); minScan(sepF('moon', v), 6 * HOUR, 4, (tm, d) => { if (d < 3) ev.push({ t: tm, kind: 'moonstar', star: s, sep: d }); }); }
  for (const [k, b] of [['mer', B.Mercury], ['ven', B.Venus]]) { try { const tr = AE.SearchTransit(b, new Date(t0)); if (ms(tr.peak) <= t1) ev.push({ t: ms(tr.peak), kind: 'transit', a: k, start: ms(tr.start), finish: ms(tr.finish), sep: tr.separation }); } catch (e) { } }
  return ev;
}
function nextTransits(t0) { return [['mer', B.Mercury], ['ven', B.Venus]].map(([k, b]) => { const tr = AE.SearchTransit(b, new Date(t0)); return { t: ms(tr.peak), a: k, start: ms(tr.start), finish: ms(tr.finish) }; }); }

// ---------- Seasons, apsides ----------
function seasons(t0, t1) {
  const ev = [], y0 = new Date(t0).getUTCFullYear(), y1 = new Date(t1).getUTCFullYear();
  for (let y = y0; y <= y1; y++) { const s = AE.Seasons(y); [['mar_equinox', 0], ['jun_solstice', 90], ['sep_equinox', 180], ['dec_solstice', 270]].forEach(([k, L]) => { const t = ms(s[k]); if (t >= t0 && t <= t1) ev.push({ t, kind: 'season', L }); }); }
  let ap = AE.SearchPlanetApsis(B.Earth, new AE.AstroTime(new Date(t0 - 200 * DAY)));
  for (let i = 0; i < 8; i++) { const t = ms(ap.time); if (t > t1) break; if (t >= t0) ev.push({ t, kind: ap.kind === 0 ? 'perihelion' : 'aphelion', d: ap.dist_au }); ap = AE.NextPlanetApsis(B.Earth, ap); }
  return ev;
}
function lunarApsides(t0, t1) { const ev = []; let a = AE.SearchLunarApsis(new Date(t0)); while (ms(a.time) <= t1) { ev.push({ t: ms(a.time), kind: a.kind === 0 ? 'perigee' : 'apogee', km: a.dist_km }); a = AE.NextLunarApsis(a); } return ev; }

// ---------- Sun over the Kaaba (zenith transit at Mecca) ----------
function kaaba(t0, t1) {
  const o = obs(MECCA), ev = [];
  for (let y = new Date(t0).getUTCFullYear(); y <= new Date(t1).getUTCFullYear(); y++) {
    for (const [m0, d0] of [[4, 20], [6, 8]]) {
      let best = null;
      for (let d = 0; d < 18; d++) { const ds = localDayStart(Date.UTC(y, m0, d0 + d, 12), MECCA); const h = AE.SearchHourAngle(B.Sun, o, 0, new Date(ds)); const z = 90 - h.hor.altitude; if (!best || z < best.z) best = { t: ms(h.time), z }; }
      if (best && best.t >= t0 && best.t <= t1) ev.push({ t: best.t, kind: 'kaaba', z: best.z });
    }
  }
  return ev;
}

// ---------- Meteor showers (IMO; peak solar longitude J2000) ----------
const SHOWERS = [
  { id: 'QUA', ar: 'التربيعيات', en: 'Quadrantids', L: 283.15, zhr: 80, ra: 230, dec: 49, v: 41, parent: '2003 EH1', r: 2.1 },
  { id: 'LYR', ar: 'القيثاريات (السلياقيات)', en: 'Lyrids', L: 32.32, zhr: 18, ra: 271, dec: 34, v: 49, parent: 'C/1861 G1 Thatcher', r: 2.1 },
  { id: 'ETA', ar: 'إيتا الدلويات', en: 'Eta Aquariids', L: 45.5, zhr: 50, ra: 338, dec: -1, v: 66, parent: '1P/Halley', r: 2.4 },
  { id: 'SDA', ar: 'دلتا الدلويات الجنوبية', en: 'Southern Delta Aquariids', L: 127, zhr: 25, ra: 340, dec: -16, v: 41, parent: '96P/Machholz', r: 3.2 },
  { id: 'PER', ar: 'البرشاويات (البرساويات)', en: 'Perseids', L: 140.0, zhr: 100, ra: 48, dec: 58, v: 59, parent: '109P/Swift–Tuttle', r: 2.2 },
  { id: 'DRA', ar: 'التنينيات', en: 'Draconids', L: 195.4, zhr: 10, ra: 262, dec: 54, v: 20, parent: '21P/Giacobini–Zinner', r: 2.6 },
  { id: 'ORI', ar: 'الجباريات', en: 'Orionids', L: 208, zhr: 20, ra: 95, dec: 16, v: 66, parent: '1P/Halley', r: 2.5 },
  { id: 'NTA', ar: 'الثوريات الشمالية', en: 'Northern Taurids', L: 230, zhr: 5, ra: 58, dec: 22, v: 29, parent: '2P/Encke', r: 2.3 },
  { id: 'LEO', ar: 'الأسديات', en: 'Leonids', L: 235.27, zhr: 15, ra: 152, dec: 22, v: 71, parent: '55P/Tempel–Tuttle', r: 2.5 },
  { id: 'GEM', ar: 'التوأميات (الجوزائيات)', en: 'Geminids', L: 262.2, zhr: 150, ra: 112, dec: 33, v: 35, parent: '3200 Phaethon', r: 2.6 },
  { id: 'URS', ar: 'الدب الأصغريات', en: 'Ursids', L: 270.7, zhr: 10, ra: 217, dec: 76, v: 33, parent: '8P/Tuttle', r: 3.0 }];
function sunLonJ2000(t) { return AE.Ecliptic(AE.GeoVector(B.Sun, new Date(t), true)).elon; }
function meteorPeaks(t0, t1, loc) {
  const ev = [], o = obs(loc);
  for (const s of SHOWERS) {
    for (let t = t0 - 3 * DAY; t < t1; t += 3 * DAY) {
      const a = wrap180(sunLonJ2000(t) - s.L), b = wrap180(sunLonJ2000(t + 3 * DAY) - s.L);
      if (a < 0 && b >= 0) {
        let lo = t, hi = t + 3 * DAY; for (let i = 0; i < 30; i++) { const m = (lo + hi) / 2; if (wrap180(sunLonJ2000(m) - s.L) < 0) lo = m; else hi = m; }
        const tp = (lo + hi) / 2; if (tp < t0 || tp > t1) continue;
        const ds = localDayStart(tp, loc), tObs = ds + 3 * HOUR + ((tp - ds) > 15 * HOUR ? DAY : 0);
        const h = AE.Horizon(new Date(tObs), o, s.ra / 15, s.dec, 'normal');
        const mi = moonInfo(tObs), mAlt = topo(B.Moon, tObs, o, true).alt;
        // here is the modification of expected hourly rates (IMO): HR = ZHR · sin(h_rad) · r^-(6.5 − LM)
        const sh = Math.max(0, Math.sin(h.altitude * Math.PI / 180)), moonLM = mAlt > 0 ? 1.6 * mi.k : 0;
        const hr = LM => s.zhr * sh * Math.pow(s.r || 2.5, -(6.5 - LM));
        ev.push({ t: tp, kind: 'meteor', s, radAlt: h.altitude, moonK: mi.k, moonAlt: mAlt, tObs, hrDark: hr(6.5 - moonLM), hrCity: hr(Math.min(4.0, 6.5 - moonLM)) });
      }
    }
  }
  return ev;
}
function constellationOf(t, body) { const eq = AE.Equator(body, new Date(t), null, false, true); return AE.Constellation(eq.ra, eq.dec).symbol; }

root.Events = { AE, obs, topo, sunTimes, moonTimes, moonInfo, lunarPhases, hijriOfNewMoon, HIJRI, crescentEvening, monthStart, lunarEclipses, solarEclipses, solarTrack, planetEvents, nextTransits, seasons, lunarApsides, kaaba, meteorPeaks, SHOWERS, localDayStart, MECCA, CAIRO, constellationOf, DAY, HOUR, MIN, PL };
})(window);
