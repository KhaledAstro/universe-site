// ===== Astro core: positions of stars, Sun, Moon, planets (Meeus / JPL approximate elements) =====
(function (root) {
  const D2R = Math.PI / 180, R2D = 180 / Math.PI;
  const sin = Math.sin, cos = Math.cos;
  function jd(date) { return date.getTime() / 86400000 + 2440587.5; }
  function cent(J) { return (J - 2451545.0) / 36525; }
  function norm360(x) { x %= 360; return x < 0 ? x + 360 : x; }
  // Greenwich mean sidereal time (deg), Meeus 12.4
  function gmst(J) {
    const T = cent(J);
    return norm360(280.46061837 + 360.98564736629 * (J - 2451545) + 0.000387933 * T * T - T * T * T / 38710000);
  }
  // Precession matrix J2000 -> mean equator of date (Meeus 21.2)
  function precMatrix(T) {
    const as = D2R / 3600;
    const zeta = (2306.2181 * T + 0.30188 * T * T + 0.017998 * T * T * T) * as;
    const z = (2306.2181 * T + 1.09468 * T * T + 0.018203 * T * T * T) * as;
    const th = (2004.3109 * T - 0.42665 * T * T - 0.041833 * T * T * T) * as;
    const cz = cos(zeta), sz = sin(zeta), cZ = cos(z), sZ = sin(z), ct = cos(th), st = sin(th);
    return [
      [cz * ct * cZ - sz * sZ, -sz * ct * cZ - cz * sZ, -st * cZ],
      [cz * ct * sZ + sz * cZ, -sz * ct * sZ + cz * cZ, -st * sZ],
      [cz * st, -sz * st, ct]];
  }
  // Equatorial(of date) -> horizontal [north, east, up]
  function eq2horMatrix(lstDeg, latDeg) {
    const L = lstDeg * D2R, p = latDeg * D2R;
    const cL = cos(L), sL = sin(L), cp = cos(p), sp = sin(p);
    return [
      [-sp * cL, -sp * sL, cp],   // north
      [-sL, cL, 0],               // east
      [cp * cL, cp * sL, sp]];    // up
  }
  function mul(A, B) {
    const C = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
    for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) C[i][j] = A[i][0] * B[0][j] + A[i][1] * B[1][j] + A[i][2] * B[2][j];
    return C;
  }
  function apply(M, v) {
    return [M[0][0] * v[0] + M[0][1] * v[1] + M[0][2] * v[2],
            M[1][0] * v[0] + M[1][1] * v[1] + M[1][2] * v[2],
            M[2][0] * v[0] + M[2][1] * v[1] + M[2][2] * v[2]];
  }
  function applyT(M, v) {
    return [M[0][0] * v[0] + M[1][0] * v[1] + M[2][0] * v[2],
            M[0][1] * v[0] + M[1][1] * v[1] + M[2][1] * v[2],
            M[0][2] * v[0] + M[1][2] * v[1] + M[2][2] * v[2]];
  }
  function radec2vec(ra, de) { const a = ra * D2R, d = de * D2R; return [cos(d) * cos(a), cos(d) * sin(a), sin(d)]; }
  function vec2radec(v) {
    const r = Math.hypot(v[0], v[1], v[2]);
    return [norm360(Math.atan2(v[1], v[0]) * R2D), Math.asin(v[2] / r) * R2D];
  }
  function hor2altaz(h) {
    const r = Math.hypot(h[0], h[1], h[2]);
    return [Math.asin(h[2] / r) * R2D, norm360(Math.atan2(h[1], h[0]) * R2D)];
  }
  // Kepler elements -> heliocentric equatorial J2000 (AU)
  const EPS0 = 23.43928 * D2R;
  function helio(el, T) {
    const a = el.a + el.da * T, e = el.e + el.de * T, I = (el.i + el.di * T) * D2R;
    const L = el.L + el.dL * T, W = el.W + el.dW * T, N = el.N + el.dN * T;
    const w = (W - N) * D2R, O = N * D2R;
    let M = norm360(L - W); if (M > 180) M -= 360; M *= D2R;
    let E = M + e * sin(M);
    for (let k = 0; k < 12; k++) { const dE = (M - (E - e * sin(E))) / (1 - e * cos(E)); E += dE; if (Math.abs(dE) < 1e-12) break; }
    const xp = a * (cos(E) - e), yp = a * Math.sqrt(1 - e * e) * sin(E);
    const cw = cos(w), sw = sin(w), cO = cos(O), sO = sin(O), cI = cos(I), sI = sin(I);
    const x = (cw * cO - sw * sO * cI) * xp + (-sw * cO - cw * sO * cI) * yp;
    const y = (cw * sO + sw * cO * cI) * xp + (-sw * sO + cw * cO * cI) * yp;
    const z = (sw * sI) * xp + (cw * sI) * yp;
    return [x, y * cos(EPS0) - z * sin(EPS0), y * sin(EPS0) + z * cos(EPS0)];
  }
  // Moon geocentric, ecliptic of date (Meeus ch.47, main terms) -> equatorial of date, km
  function moonEqDate(T) {
    const Lp = 218.3164477 + 481267.88123421 * T;
    const D = (297.8501921 + 445267.1114034 * T) * D2R;
    const M = (357.5291092 + 35999.0502909 * T) * D2R;
    const Mp = (134.9633964 + 477198.8675055 * T) * D2R;
    const F = (93.2720950 + 483202.0175233 * T) * D2R;
    const E = 1 - 0.002516 * T;
    const l = 6288774 * sin(Mp) + 1274027 * sin(2 * D - Mp) + 658314 * sin(2 * D) + 213618 * sin(2 * Mp)
      - 185116 * E * sin(M) - 114332 * sin(2 * F) + 58793 * sin(2 * D - 2 * Mp) + 57066 * E * sin(2 * D - M - Mp)
      + 53322 * sin(2 * D + Mp) + 45758 * E * sin(2 * D - M) - 40923 * E * sin(M - Mp) - 34720 * sin(D)
      - 30383 * E * sin(M + Mp) + 15327 * sin(2 * D - 2 * F) - 12528 * sin(Mp + 2 * F) + 10980 * sin(Mp - 2 * F)
      + 10675 * sin(4 * D - Mp) + 10034 * sin(3 * Mp) + 8548 * sin(4 * D - 2 * Mp) - 7888 * E * sin(2 * D + M - Mp)
      - 6766 * E * sin(2 * D + M) - 5163 * sin(D - Mp) + 4987 * E * sin(D + M) + 4036 * E * sin(2 * D - M + Mp)
      + 3994 * sin(2 * D + 2 * Mp) + 3861 * sin(4 * D) + 3665 * sin(2 * D - 3 * Mp) - 2689 * E * sin(M - 2 * Mp)
      - 2602 * sin(2 * D - Mp + 2 * F) + 2390 * E * sin(2 * D - M - 2 * Mp) - 2348 * sin(D + Mp)
      + 2236 * E * E * sin(2 * D - 2 * M) - 2120 * E * sin(M + 2 * Mp) - 2069 * E * E * sin(2 * M);
    const r = -20905355 * cos(Mp) - 3699111 * cos(2 * D - Mp) - 2955968 * cos(2 * D) - 569925 * cos(2 * Mp)
      + 48888 * E * cos(M) - 3149 * cos(2 * F) + 246158 * cos(2 * D - 2 * Mp) - 152138 * E * cos(2 * D - M - Mp)
      - 170733 * cos(2 * D + Mp) - 204586 * E * cos(2 * D - M) - 129620 * E * cos(M - Mp) + 108743 * cos(D)
      + 104755 * E * cos(M + Mp) + 10321 * cos(2 * D - 2 * F) + 79661 * cos(Mp - 2 * F) - 34782 * cos(4 * D - Mp)
      - 23210 * cos(3 * Mp) - 21636 * cos(4 * D - 2 * Mp) + 24208 * E * cos(2 * D + M - Mp) + 30824 * E * cos(2 * D + M)
      - 8379 * cos(D - Mp) - 16675 * E * cos(D + M) - 12831 * E * cos(2 * D - M + Mp) - 10445 * cos(2 * D + 2 * Mp);
    const b = 5128122 * sin(F) + 280602 * sin(Mp + F) + 277693 * sin(Mp - F) + 173237 * sin(2 * D - F)
      + 55413 * sin(2 * D - Mp + F) + 46271 * sin(2 * D - Mp - F) + 32573 * sin(2 * D + F) + 17198 * sin(2 * Mp + F)
      + 9266 * sin(2 * D + Mp - F) + 8822 * sin(2 * Mp - F) + 8216 * E * sin(2 * D - M - F) + 4324 * sin(2 * D - 2 * Mp - F)
      + 4200 * sin(2 * D + Mp + F) - 3359 * E * sin(2 * D + M - F);
    const lam = (Lp + l / 1e6) * D2R, bet = (b / 1e6) * D2R, dist = 385000.56 + r / 1000;
    const eps = (23.439291 - 0.0130042 * T) * D2R;
    const x = cos(bet) * cos(lam), y = cos(bet) * sin(lam), z = sin(bet);
    return { v: [x * dist, (y * cos(eps) - z * sin(eps)) * dist, (y * sin(eps) + z * cos(eps)) * dist], dist, lam: norm360(lam * R2D) };
  }
  const PH = { mer: [-0.42, 0.038], ven: [-4.40, 0.0009], mar: [-1.52, 0.016], jup: [-9.40, 0.005], sat: [-8.88, 0.044], ura: [-7.19, 0], nep: [-6.87, 0] };
  // Compute all solar system bodies at date: returns {id: {eqJ2000 | eqDate vector, dist, mag, ...}}
  function deltaT(J) { const y = 2000 + (J - 2451545) / 365.25; return 69.2 + 0.15 * (y - 2026) + 0.003 * (y - 2026) * (y - 2026); } // seconds (TT-UT)
  function solarSystem(Jut, P) {
    const J = Jut + deltaT(Jut) / 86400; // ephemerides in TT
    const T = cent(J);
    const earth = helio(P.ter.el, T);
    const out = {};
    const R0 = Math.hypot(...earth), eL = helio(P.ter.el, T - R0 * 0.0057755 / 36525); // light-time (aberration of the Sun)
    out.sun = { j2000: [-eL[0], -eL[1], -eL[2]], dist: R0, mag: -26.7 };
    for (const k of ['mer', 'ven', 'mar', 'jup', 'sat', 'ura', 'nep']) {
      // one light-time iteration
      let h = helio(P[k].el, T), g = [h[0] - earth[0], h[1] - earth[1], h[2] - earth[2]];
      const lt = Math.hypot(...g) * 0.0057755 / 36525; // days->centuries
      h = helio(P[k].el, T - lt); g = [h[0] - earth[0], h[1] - earth[1], h[2] - earth[2]];
      const r = Math.hypot(...h), d = Math.hypot(...g), R = Math.hypot(...earth);
      const ci = (r * r + d * d - R * R) / (2 * r * d), i = Math.acos(Math.max(-1, Math.min(1, ci))) * R2D;
      let mag = PH[k][0] + 5 * Math.log10(r * d) + PH[k][1] * i;
      const L5 = 5 * Math.log10(r * d);
      if (k === 'mer') mag = L5 - 0.613 + 6.328e-2 * i - 1.6336e-3 * i * i + 3.3644e-5 * i ** 3 - 3.4265e-7 * i ** 4 + 1.6893e-9 * i ** 5 - 3.0334e-12 * i ** 6;
      if (k === 'ven') { const j = Math.min(i, 163.7); mag = L5 - 4.384 - 1.044e-3 * j + 3.687e-4 * j * j - 2.814e-6 * j ** 3 + 8.938e-9 * j ** 4; }
      if (k === 'mar') mag = L5 - 1.601 + 0.02267 * i - 0.0001302 * i * i;
      out[k] = { j2000: g, dist: d, helioDist: r, mag, phase: (1 + ci) / 2 };
    }
    const m = moonEqDate(T);
    out.moon = { date: m.v, dist: m.dist, lam: m.lam };
    return out;
  }
  function refraction(alt) { // apparent - true, degrees (Saemundsson inverse of Bennett)
    if (alt < -1.5) return 0;
    return 1.02 / Math.tan((alt + 10.3 / (alt + 5.11)) * D2R) / 60;
  }
  root.Astro = { deltaT, D2R, R2D, jd, cent, gmst, precMatrix, eq2horMatrix, mul, apply, applyT, radec2vec, vec2radec, hor2altaz, helio, moonEqDate, solarSystem, refraction, norm360 };
  if (typeof module !== 'undefined') module.exports = root.Astro;
})(typeof window !== 'undefined' ? window : globalThis);
