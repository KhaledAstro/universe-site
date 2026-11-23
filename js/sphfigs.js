// Figures for the spherical-astronomy course: one live diagram per solved problem, drawn from the same inputs as the solution.
(function (root) {
'use strict';
const D = Math.PI / 180, R = 180 / Math.PI;
const sin = x => Math.sin(x * D), cos = x => Math.cos(x * D), tan = x => Math.tan(x * D);
const asin = x => Math.asin(Math.max(-1, Math.min(1, x))) * R, acos = x => Math.acos(Math.max(-1, Math.min(1, x))) * R, atan2 = (y, x) => Math.atan2(y, x) * R;
const n360 = x => ((x % 360) + 360) % 360;
const f = (x, d) => (+x).toFixed(d === undefined ? 1 : d);
let lang = 'ar'; const S = (a, e) => lang === 'ar' ? a : e;
const COL = { hor: '#7ee2a8', eq: '#f1d27a', ecl: '#ff9f5a', mer: '#c39bff', tri: '#6fa8ff', diu: '#ff8fb8', txt: '#e8edf9', dim: '#9fb0d6', gold: '#f1d27a', red: '#ff7f7f' };
// ---------- vector helpers
const dot = (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const cross = (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]];
const norm = a => { const n = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / n, a[1] / n, a[2] / n]; };
const add = (a, b, k) => [a[0] + b[0] * (k === undefined ? 1 : k), a[1] + b[1] * (k === undefined ? 1 : k), a[2] + b[2] * (k === undefined ? 1 : k)];
const sc = (a, k) => [a[0] * k, a[1] * k, a[2] * k];
const sph = (lat, lon) => [cos(lat) * cos(lon), cos(lat) * sin(lon), sin(lat)];
function slerp(a, b, n) { const d = Math.acos(Math.max(-1, Math.min(1, dot(a, b)))); const o = []; for (let i = 0; i <= n; i++) { const s = i / n; if (d < 1e-6) { o.push(a); continue; } const k1 = Math.sin((1 - s) * d) / Math.sin(d), k2 = Math.sin(s * d) / Math.sin(d); o.push(add(sc(a, k1), b, k2)); } return o; }
const isAr = t => /[\u0600-\u06FF]/.test(String(t));
function tAttr(t, anchor) { if (!isAr(t)) return anchor ? `text-anchor="${anchor}"` : ''; const a = anchor === 'middle' ? 'middle' : anchor === 'end' ? 'start' : 'end'; return `direction="rtl" text-anchor="${a}"`; }
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

// ---------- sphere canvas
function Sphere(eye, opt) {
  opt = opt || {}; const W = opt.w || 300, H = opt.h || 280, Rr = opt.r || 112; let cx = W / 2, cy = (opt.cy || H / 2);
  eye = norm(eye); const upH = opt.up || [0, 0, 1]; let right = norm(cross(upH, eye)); if (!isFinite(right[0])) right = [0, 1, 0]; const up = cross(eye, right);
  if (opt.focus) { const fo = norm(opt.focus); cx -= dot(fo, right) * Rr; cy += dot(fo, up) * Rr; }
  const P = v => [cx + dot(v, right) * Rr, cy - dot(v, up) * Rr, dot(v, eye)];
  let body = '', top = '';
  const api = {
    P,
    path(pts, col, w, opts) { opts = opts || {}; let cur = '', back = null, out = ''; const flush = () => { if (cur) out += `<path d="${cur}" stroke="${col}" stroke-width="${w}" fill="none" stroke-linecap="round" ${back ? 'stroke-dasharray="3 4" opacity=".45"' : ''}${opts.dash && !back ? ` stroke-dasharray="${opts.dash}"` : ''}/>`; };
      pts.forEach((v, i) => { const p = P(v), b = p[2] < -1e-3; if (i === 0 || b !== back) { flush(); cur = `M${p[0].toFixed(1)},${p[1].toFixed(1)}`; if (i > 0) { const q = P(pts[i - 1]); cur = `M${q[0].toFixed(1)},${q[1].toFixed(1)}L${p[0].toFixed(1)},${p[1].toFixed(1)}`; } } else cur += `L${p[0].toFixed(1)},${p[1].toFixed(1)}`; back = b; });
      flush(); body += out; return api; },
    circle(pole, rad, col, w, opts) { pole = norm(pole); let a = Math.abs(pole[2]) < 0.9 ? [0, 0, 1] : [1, 0, 0]; a = norm(cross(pole, a)); const b = cross(pole, a); const pts = []; for (let i = 0; i <= 180; i++) { const t = i / 180 * 2 * Math.PI; pts.push(add(sc(pole, cos(rad)), add(sc(a, Math.cos(t) * sin(rad)), b, Math.sin(t) * sin(rad)))); } return api.path(pts, col, w || 1.3, opts); },
    arc(a, b, col, w) { return api.path(slerp(a, b, 48), col || COL.tri, w || 2.4); },
    fill(vs, col) { const ring = []; for (let i = 0; i < vs.length; i++) ring.push(...slerp(vs[i], vs[(i + 1) % vs.length], 30)); body += `<path d="${ring.map((v, i) => { const p = P(v); return (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1); }).join('')}Z" fill="${col || 'rgba(111,168,255,.2)'}"/>`; return api; },
    point(v, label, col, opt2) { opt2 = opt2 || {}; const p = P(v), b = p[2] < -1e-3; const dx = opt2.dx === undefined ? 7 : opt2.dx, dy = opt2.dy === undefined ? -7 : opt2.dy;
      top += `<circle cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${opt2.r || 4}" fill="${col || '#fff'}" ${b ? 'opacity=".5"' : ''}/>`;
      if (label) top += `<text x="${(p[0] + dx).toFixed(1)}" y="${(p[1] + dy).toFixed(1)}" fill="${opt2.tc || col || '#fff'}" font-size="${opt2.fs || 14}" font-weight="700" font-family="serif" ${b ? 'opacity=".6"' : ''} ${tAttr(label, opt2.anchor || 'start')}>${esc(label)}</text>`; return api; },
    label(v, text, col, opt2) { opt2 = opt2 || {}; const p = P(v); top += `<text x="${(p[0] + (opt2.dx || 0)).toFixed(1)}" y="${(p[1] + (opt2.dy || 0)).toFixed(1)}" fill="${col || COL.txt}" font-size="${opt2.fs || 11.5}" font-family="serif" font-style="italic" ${isAr(text) ? 'direction="rtl" ' : ''}text-anchor="middle" paint-order="stroke" stroke="#0a0f1e" stroke-width="3">${esc(text)}</text>`; return api; },
    sideLabel(a, b, text, centroid, col) { const m = norm(add(a, b)); const pm = P(m), pc = P(centroid); let dx = pm[0] - pc[0], dy = pm[1] - pc[1]; const n = Math.hypot(dx, dy) || 1; return api.label(m, text, col || '#cfe0ff', { dx: dx / n * 16, dy: dy / n * 16 + 4 }); },
    angle(V, A, B, text, col, rho) { rho = rho || 9; const ta = norm(add(A, V, -dot(A, V))), tb = norm(add(B, V, -dot(B, V))); const th = Math.acos(Math.max(-1, Math.min(1, dot(ta, tb)))); const ax = cross(V, ta); const pts = [];
      for (let i = 0; i <= 20; i++) { const s = i / 20 * th; const t = add(sc(ta, Math.cos(s)), cross(V, ta), Math.sin(s) * Math.sign(dot(cross(ta, tb), V) || 1)); pts.push(add(sc(V, cos(rho)), t, sin(rho))); }
      api.path(pts, col || COL.gold, 1.6); if (text) { const s = th / 2, t = add(sc(ta, Math.cos(s)), cross(V, ta), Math.sin(s) * Math.sign(dot(cross(ta, tb), V) || 1)); api.label(add(sc(V, cos(rho + 9)), t, sin(rho + 9)), text, col || COL.gold, { dy: 4, fs: 12 }); } return api; },
    right(V, A, B, col) { const ta = norm(add(A, V, -dot(A, V))), tb = norm(add(B, V, -dot(B, V))); const k = 7; const p1 = add(sc(V, cos(k)), ta, sin(k)), p3 = add(sc(V, cos(k)), tb, sin(k)), p2 = norm(add(add(V, ta, sin(k)), tb, sin(k))); api.path([p1, p2, p3], col || COL.gold, 1.6); return api; },
    outline() { body = `<circle cx="${cx}" cy="${cy}" r="${Rr}" fill="rgba(30,50,115,.22)" stroke="rgba(255,255,255,.35)"/>` + body; return api; },
    note(x, y, text, col, fs, anchor) { top += `<text x="${x}" y="${y}" fill="${col || COL.dim}" font-size="${fs || 11}" ${tAttr(text, anchor)}>${esc(text)}</text>`; return api; },
    raw(s) { top += s; return api; },
    svg() { return `<svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" direction="ltr" style="direction:ltr">${body}${top}</svg>`; }
  };
  return api;
}
// ---------- horizon-frame helpers: world = (North, West, Up), right-handed
function starNWU(phi, dec, H) { const sh = sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H); const y = -cos(dec) * sin(H), x = sin(dec) * cos(phi) - cos(dec) * cos(H) * sin(phi); const h = asin(sh), A = atan2(y, x); return [cos(h) * cos(A), -cos(h) * sin(A), sin(h)]; }
const NCP = phi => [cos(phi), 0, sin(phi)];
function celestial(phi, opt) {
  opt = opt || {}; const west = opt.west === undefined ? true : opt.west;
  const s = Sphere(opt.eye || [0.16, west ? 0.86 : -0.86, 0.42], { w: 300, h: 280 }).outline();
  s.circle([0, 0, 1], 90, COL.hor, 1.6);
  if (opt.mer !== false) s.circle([0, 1, 0], 90, COL.mer, 1.1);
  if (opt.eq !== false) s.circle(NCP(phi), 90, COL.eq, 1.4);
  const card = [['N', [1, 0, 0]], ['S', [-1, 0, 0]], ['E', [0, -1, 0]], ['W', [0, 1, 0]]];
  card.forEach(c => { const p = s.P(c[1]); if (true) s.raw(`<text x="${(p[0] + (c[0] === 'E' ? -4 : 4)).toFixed(1)}" y="${(p[1] + 15).toFixed(1)}" fill="${COL.hor}" font-size="12" font-weight="700" text-anchor="middle" ${p[2] < 0 ? 'opacity=".5"' : ''}>${S({ N: 'ش', S: 'ج', E: 'ق', W: 'غ' }[c[0]], c[0])}</text>`); });
  return s;
}
function legend(s, items, y) { let x = 8; y = y || 272; items.forEach(it => { s.raw(`<rect x="${x}" y="${y - 8}" width="10" height="3" fill="${it[0]}"/>`); s.note(x + 13, y - 3, it[1], COL.dim, 10); x += 16 + it[1].length * 5.6; }); return s; }
const LEG = () => ({ hor: [COL.hor, S('الأفق', 'horizon')], eq: [COL.eq, S('الاستواء', 'equator')], mer: [COL.mer, S('الزوال', 'meridian')], diu: [COL.diu, S('المسار اليومي', 'diurnal path')], ecl: [COL.ecl, S('البروج', 'ecliptic')] });
function pzx(phi, dec, H, opt) {
  opt = opt || {}; const X = starNWU(phi, dec, H), P = NCP(phi), Z = [0, 0, 1];
  const s = celestial(phi, { west: opt.west === undefined ? H >= 0 : opt.west });
  if (opt.diurnal !== false) s.circle(P, 90 - dec, COL.diu, 1.3, { dash: '1 0' });
  s.fill([P, Z, X]).arc(P, Z, COL.tri).arc(Z, X, COL.tri).arc(X, P, COL.tri);
  const G = norm(add(add(P, Z), X));
  if (opt.sides !== false) { s.sideLabel(P, Z, '90°−φ', G); s.sideLabel(Z, X, 'z', G); s.sideLabel(X, P, '90°−δ', G); }
  if (opt.angP !== false) s.angle(P, Z, X, opt.angPtext || 'H');
  if (opt.angZ) s.angle(Z, P, X, opt.angZ);
  if (opt.angX) s.angle(X, P, Z, opt.angX);
  s.point(P, 'P', COL.gold).point(Z, 'Z', '#fff').point(X, 'X', '#ffcf7a');
  return { s, X, P, Z };
}
// ---------- 2-D helpers
function Plane(w, h) { let out = ''; const api = { line(x1, y1, x2, y2, col, w_, dash) { out += `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" stroke="${col}" stroke-width="${w_ || 1.5}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`; return api; },
  circ(x, y, r, col, w_, fill, dash) { out += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" stroke="${col || 'none'}" stroke-width="${w_ || 1.3}" fill="${fill || 'none'}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`; return api; },
  ell(x, y, rx, ry, col, w_, fill, rot) { out += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" stroke="${col || 'none'}" stroke-width="${w_ || 1.3}" fill="${fill || 'none'}" ${rot ? `transform="rotate(${rot} ${x} ${y})"` : ''}/>`; return api; },
  path(d, col, w_, fill, dash) { out += `<path d="${d}" stroke="${col || 'none'}" stroke-width="${w_ || 1.5}" fill="${fill || 'none'}" ${dash ? `stroke-dasharray="${dash}"` : ''} stroke-linecap="round"/>`; return api; },
  text(x, y, t, col, fs, anchor, bold) { out += `<text x="${x.toFixed(1)}" y="${y.toFixed(1)}" fill="${col || COL.txt}" font-size="${fs || 12}" font-family="serif" ${tAttr(t, anchor || 'start')} ${bold ? 'font-weight="700"' : 'font-style="italic"'} paint-order="stroke" stroke="#0a0f1e" stroke-width="3">${esc(t)}</text>`; return api; },
  arcA(cx, cy, r, a1, a2, col, label, lr) { // angles in deg, math convention (ccw, y up)
    const pts = []; const n = 24; for (let i = 0; i <= n; i++) { const a = a1 + (a2 - a1) * i / n; pts.push([cx + r * cos(a), cy - r * sin(a)]); }
    out += `<path d="${pts.map((p, i) => (i ? 'L' : 'M') + p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('')}" stroke="${col || COL.gold}" stroke-width="1.5" fill="none"/>`;
    if (label) { const am = (a1 + a2) / 2, rr = lr || r + 11; api.text(cx + rr * cos(am), cy - rr * sin(am) + 4, label, col || COL.gold, 12, 'middle'); } return api; },
  dot(x, y, r, col, label, dx, dy) { api.circ(x, y, r || 3.5, null, 0, col || '#fff'); if (label) api.text(x + (dx === undefined ? 6 : dx), y + (dy === undefined ? -6 : dy), label, col || '#fff', 13, null, true); return api; },
  raw(s) { out += s; return api; },
  svg() { return `<svg viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" direction="ltr" style="direction:ltr">${out}</svg>`; } }; return api; }
function sunGlyph(p, x, y, r) { p.raw(`<circle cx="${x}" cy="${y}" r="${(r || 9) + 5}" fill="rgba(255,190,80,.25)"/><circle cx="${x}" cy="${y}" r="${r || 9}" fill="#ffc35a"/>`); return p; }

// ---------- figures per problem
const FIG = {
qibla: p => { const s = Sphere(sph(28, (p.laA + p.laB) / 2 - 15), { w: 300, h: 280, r: 185, focus: sph(52, (p.laA + p.laB) / 2), cy: 135 }).outline();
  const NP = [0, 0, 1], A = sph(p.phA, p.laA), B = sph(p.phB, p.laB);
  s.circle([0, 0, 1], 90, COL.eq, 1.1); for (let l = -180; l < 180; l += 30) s.path(slerp(NP, sph(0, l), 30).concat(slerp(sph(0, l), [0, 0, -1], 30)), 'rgba(255,255,255,.12)', 0.8);
  s.path(slerp(NP, sph(0, p.laA), 40), COL.mer, 1.2).path(slerp(NP, sph(0, p.laB), 40), COL.mer, 1.2);
  s.fill([NP, A, B], 'rgba(111,168,255,.18)').arc(A, B, COL.gold, 3);
  const G = norm(add(add(NP, A), B)); s.sideLabel(NP, A, '90°−φ₁', G).sideLabel(NP, B, '90°−φ₂', G).sideLabel(A, B, S('القوس العظيم', 'great circle'), G, COL.gold);
  s.angle(NP, A, B, 'Δλ', COL.mer, 6).angle(A, NP, B, S('القبلة', 'Qibla'), COL.gold, 4);
  s.point(NP, 'P', COL.gold).point(A, S('القاهرة', 'Cairo'), '#fff', { fs: 12, dx: -52, dy: 4 }).point(B, S('مكة', 'Mecca'), COL.gold, { fs: 12, dy: 16 });
  return s.svg(); },
sss: p => triFig(p.a, p.b, p.c),
polar: p => { const cC = -cos(p.A) * cos(p.B) + sin(p.A) * sin(p.B) * cos(p.c), C = acos(cC); const a = acos((cos(p.A) + cos(p.B) * cos(C)) / (sin(p.B) * sin(C))), b = acos((cos(p.B) + cos(p.A) * cos(C)) / (sin(p.A) * sin(C))); return triFig(a, b, p.c, true); },
napier: p => { const eps = p.eps, s = Sphere(sph(30, p.lam / 2 - 25), { w: 300, h: 280 }).outline();
  const eqPole = [0, 0, 1], eclPole = [0, -sin(eps), cos(eps)]; // x towards ♈
  s.circle(eqPole, 90, COL.eq, 1.5).circle(eclPole, 90, COL.ecl, 1.5);
  const ar = [1, 0, 0], sun = [cos(p.lam), sin(p.lam) * cos(eps), sin(p.lam) * sin(eps)], al = atan2(sun[1], sun[0]), foot = [cos(al), sin(al), 0];
  s.fill([ar, foot, sun], 'rgba(241,210,122,.2)').arc(ar, sun, COL.ecl, 3).arc(ar, foot, COL.eq, 3).arc(foot, sun, COL.tri, 3);
  const G = norm(add(add(ar, foot), sun)); s.sideLabel(ar, sun, 'λ', G, COL.ecl).sideLabel(ar, foot, 'α', G, COL.eq).sideLabel(foot, sun, 'δ', G, COL.tri);
  s.angle(ar, foot, sun, 'ε', COL.gold, 12).right(foot, ar, sun);
  s.point(ar, '♈\uFE0E', '#fff').point(sun, '☉\uFE0E', '#ffc35a', { fs: 16 }).point(foot, '', '#fff').point(eqPole, 'P', COL.gold);
  legend(s, [LEG().eq, LEG().ecl]); return s.svg(); },
diff: p => { const o = pzx(p.phi, p.dec, p.H, { angZ: 'A' }); const s = o.s; legend(s, [LEG().hor, LEG().eq, LEG().diu]); s.note(296, 18, S('dh/dH = cosφ sinA', 'dh/dH = cosφ sinA'), COL.gold, 12, 'end'); return s.svg(); },
eq2hor: p => { const o = pzx(p.phi, p.dec, p.Hh * 15, { angZ: S('السمت', 'A') }); legend(o.s, [LEG().hor, LEG().eq, LEG().mer, LEG().diu]); return o.s.svg(); },
hor2eq: p => { const sd = sin(p.phi) * sin(p.h) + cos(p.phi) * cos(p.h) * cos(p.A), dec = asin(sd), H = atan2(-sin(p.A) * cos(p.h), sin(p.h) * cos(p.phi) - cos(p.h) * sin(p.phi) * cos(p.A)); const o = pzx(p.phi, dec, H, { angZ: 'A', angPtext: 'H ?' }); legend(o.s, [LEG().hor, LEG().eq, LEG().mer, LEG().diu]); return o.s.svg(); },
eq2ecl: p => { const eps = p.eps; const s = Sphere(sph(38, p.ra + 45), { w: 300, h: 280 }).outline(); const P = [0, 0, 1], K = [0, -sin(eps), cos(eps)], X = sph(p.dec, p.ra);
  s.circle(P, 90, COL.eq, 1.4).circle(K, 90, COL.ecl, 1.4).fill([P, K, X]).arc(P, K, COL.tri).arc(K, X, COL.tri).arc(X, P, COL.tri);
  const G = norm(add(add(P, K), X)); s.sideLabel(P, K, 'ε', G).sideLabel(K, X, '90°−β', G).sideLabel(X, P, '90°−δ', G);
  s.angle(P, K, X, '90°+α', COL.gold, 10).angle(K, P, X, '90°−λ', COL.ecl, 14);
  s.point(P, 'P', COL.gold).point(K, 'K', COL.ecl).point(X, 'X', '#ffcf7a').point([1, 0, 0], '♈\uFE0E', '#fff'); legend(s, [LEG().eq, LEG().ecl]); return s.svg(); },
gal: p => { const aG = 192.85948, dG = 27.12825; const s = Sphere(norm(add(sph(dG + 10, aG - 40), [0, 0, 0.4])), { w: 300, h: 280 }).outline(); const P = [0, 0, 1], G_ = sph(dG, aG), X = sph(p.dec, p.ra);
  s.circle(P, 90, COL.eq, 1.3).circle(G_, 90, '#c3d4ff', 1.6).fill([P, G_, X]).arc(P, G_, COL.tri).arc(G_, X, COL.tri).arc(X, P, COL.tri);
  const C = norm(add(add(P, G_), X)); s.sideLabel(P, G_, '90°−δ_G', C).sideLabel(G_, X, '90°−b', C).sideLabel(X, P, '90°−δ', C);
  s.angle(P, G_, X, 'α−α_G', COL.gold, 10).angle(G_, P, X, 'θ', '#c3d4ff', 10);
  s.point(P, 'P', COL.gold).point(G_, 'G', '#c3d4ff').point(X, 'X', '#ffcf7a'); legend(s, [LEG().eq, ['#c3d4ff', S('مستوى المجرة', 'galactic plane')]]); return s.svg(); },
fix: p => fixFig(p),
culm: p => { const s = celestial(p.phi, { west: true }); const P = NCP(p.phi), Z = [0, 0, 1]; s.circle(P, 90 - p.dec, COL.diu, 1.6);
  const U = starNWU(p.phi, p.dec, 0), Lw = starNWU(p.phi, p.dec, 180); s.arc(P, U, COL.tri, 2).arc(P, Lw, COL.tri, 2);
  s.label(norm(add(P, U)), '90°−δ', '#cfe0ff', { dx: 14 }).label(norm(add(P, Lw)), '90°−δ', '#cfe0ff', { dx: 14 });
  const Nh = [1, 0, 0]; s.arc(Nh, P, COL.gold, 2).label(norm(add(Nh, P)), 'φ', COL.gold, { dx: -12 });
  s.point(P, 'P', COL.gold).point(Z, 'Z', '#fff').point(U, S('علوي', 'upper'), '#ffcf7a', { fs: 11 }).point(Lw, S('سفلي', 'lower'), '#ffcf7a', { fs: 11 });
  legend(s, [LEG().hor, LEG().eq, LEG().mer, LEG().diu]); return s.svg(); },
rise: p => { const c1 = (sin(p.h0) - sin(p.phi) * sin(p.dec)) / (cos(p.phi) * cos(p.dec)), H1 = acos(c1); const o = pzx(p.phi, p.dec, -H1, { west: false, angZ: 'Aᵣ', angPtext: 'H₀', sides: false });
  const s = o.s, Xs = starNWU(p.phi, p.dec, H1), T = starNWU(p.phi, p.dec, 0); s.point(Xs, S('غروب', 'set'), '#ffcf7a', { fs: 11 }).point(T, S('عبور', 'transit'), '#ffcf7a', { fs: 11 });
  s.label(o.X, S('شروق', 'rise'), '#ffcf7a', { dy: 18 }); legend(s, [LEG().hor, LEG().eq, LEG().diu]); return s.svg(); },
pv: p => { const ok = p.dec > 0 && p.dec < p.phi; const H = ok ? -acos(tan(p.dec) / tan(p.phi)) : -60; const o = pzx(p.phi, p.dec, H, { west: false, angZ: ok ? '90°' : 'A', sides: true });
  const s = o.s; if (ok) s.right(o.Z, o.P, o.X); s.circle([1, 0, 0], 90, 'rgba(255,255,255,.55)', 1.1, { dash: '5 3' }); s.note(296, 18, S('الدائرة الرأسية الأولى (متقطعة بيضاء)', 'prime vertical (white dashed)'), COL.dim, 10, 'end'); legend(s, [LEG().hor, LEG().eq, LEG().diu]); return s.svg(); },
elong: p => { const phi = p.phi, dec = Math.min(p.dec, 89.99); const H = dec > phi ? acos(tan(phi) / tan(dec)) : 90; const P = NCP(phi), Z = [0, 0, 1];
  // zoom on the pole: use an exaggerated polar distance for visibility
  const pd = Math.max(90 - dec, 20), decV = 90 - pd, HV = decV > phi ? acos(tan(phi) / tan(decV)) : 90; const X = starNWU(phi, decV, -HV);
  const s = celestial(phi, { west: false, eye: [0.75, -0.25, 0.45] }); s.circle(P, pd, COL.diu, 1.6).fill([P, Z, X]).arc(P, Z, COL.tri).arc(Z, X, COL.tri).arc(X, P, COL.tri).right(X, P, Z).angle(Z, P, X, 'A_max', COL.gold, 14);
  s.point(P, 'P', COL.gold).point(Z, 'Z', '#fff').point(X, 'X', '#ffcf7a'); s.note(8, 18, S('(المسافة القطبية مكبّرة للوضوح)', '(polar distance exaggerated for clarity)'), COL.dim, 10); legend(s, [LEG().hor, LEG().eq, LEG().diu]); return s.svg(); },
rates: p => { const o = pzx(p.phi, p.dec, p.H, { angZ: 'A', angX: 'q' }); legend(o.s, [LEG().hor, LEG().eq, LEG().diu]); return o.s.svg(); },
circum: p => { const H = p.Hm / 4, phi = 90 - p.hobs + p.dec; const o = pzx(phi, p.dec, -H, { west: false, angPtext: 'H', sides: false }); const s = o.s; const M = starNWU(phi, p.dec, 0);
  s.point(M, S('على الزوال', 'on meridian'), '#ffcf7a', { fs: 11, dy: -10 }); s.label(o.X, 'h', '#ffcf7a', { dy: 18 }); legend(s, [LEG().hor, LEG().eq, LEG().mer, LEG().diu]); return s.svg(); },
refr1: p => { const q = Plane(300, 240); q.path('M10,200 L290,200', COL.hor, 2).text(288, 218, S('الأفق', 'horizon'), COL.hor, 11, 'end');
  q.path('M10,200 Q150,150 290,130', 'rgba(111,168,255,.25)', 30).text(250, 170, S('الغلاف الجوي', 'atmosphere'), COL.dim, 11, 'middle');
  const ox = 40, oy = 200, ha = p.ha, ht = ha - 0.8; // exaggerate refraction for display
  const L = 190, exag = 6; const a1 = ha, a2 = ha - exag;
  q.line(ox, oy, ox + L * cos(a1), oy - L * sin(a1), COL.gold, 2, '6 4').line(ox, oy, ox + L * cos(a2), oy - L * sin(a2), '#fff', 2);
  q.dot(ox + L * cos(a1), oy - L * sin(a1), 5, COL.gold, '', 0, 0).text(ox + L * cos(a1) - 8, oy - L * sin(a1) - 10, S("الظاهري h′", "apparent h′"), COL.gold, 12, 'end').dot(ox + L * cos(a2), oy - L * sin(a2), 5, '#fff', '', 0, 0).text(ox + L * cos(a2) + 6, oy - L * sin(a2) + 18, S('الحقيقي h', 'true h'), '#fff', 12, 'end');
  q.arcA(ox, oy, 120, a2, a1, COL.red, 'R', 132).arcA(ox, oy, 70, 0, a2, COL.dim, 'h').dot(ox, oy, 4, '#fff', '', 0, 0).text(ox + 4, oy + 20, S('الراصد', 'observer'), '#fff', 12, 'middle');
  q.text(296, 18, S('(الانكسار مكبّر للتوضيح)', '(refraction exaggerated)'), COL.dim, 10, 'end'); return q.svg(); },
refr2: p => { const Rb = h => 1 / Math.tan((h + 7.31 / (h + 4.4)) * D); const hcT = p.hc - Rb(p.hc) / 60; const app = ht => { let x = ht; for (let i = 0; i < 30; i++) x = ht + Rb(x) / 60; return x; };
  const up = app(hcT + p.sd / 60), lo = app(hcT - p.sd / 60), vd = (up - lo) * 60, k = 4.2;
  const q = Plane(300, 230); q.path('M10,190 L290,190', COL.hor, 2).text(14, 208, S('الأفق', 'horizon'), COL.hor, 11);
  const cyy = 190 - p.hc * 60 * k / 10 - 0; const r = p.sd * k;
  q.circ(150, 120, r, 'rgba(255,255,255,.6)', 1.5, null, '4 3').ell(150, 120, r, vd / 2 * k, null, 0, '#ffb347');
  q.text(150, 120 - r - 8, S('القرص الحقيقي (متقطع)', 'true disc (dashed)'), COL.dim, 11, 'middle').text(150, 120 + r + 20, S(`الظاهري: ${f(vd, 1)}′ × ${2 * p.sd}′`, `apparent: ${f(vd, 1)}′ × ${2 * p.sd}′`), '#ffcf7a', 12, 'middle');
  q.text(10, 18, S(`انكسار الحافة السفلى: ${f(Rb(lo), 1)}′`, `refraction, lower limb: ${f(Rb(lo), 1)}′`), COL.dim, 11).text(10, 34, S(`انكسار الحافة العليا: ${f(Rb(up), 1)}′`, `refraction, upper limb: ${f(Rb(up), 1)}′`), COL.dim, 11); return q.svg(); },
twi1: p => twiFig(p.phi, p.dec, [-50 / 60, -6, -12, -18]),
twi2: p => { const dm = asin(-sin(p.phi) * tan(p.Dp / 2)); return twiFig(p.phi, dm, [0, -p.Dp], true); },
twi3: p => { const s = celestial(p.phi, { west: false, eye: [0.7, -0.5, 0.35] }); const P = NCP(p.phi); s.circle(P, 90 - p.eps, COL.diu, 1.8); s.circle([0, 0, 1], 108, '#c39bff', 1.2, { dash: '4 3' });
  const L = starNWU(p.phi, p.eps, 180); s.point(P, 'P', COL.gold).point([0, 0, 1], 'Z', '#fff').point(L, '☉\uFE0E', '#ffc35a', { fs: 15 }); s.arc([1, 0, 0], L, COL.red, 2).label(norm(add([1, 0, 0], L)), f(p.phi + p.eps - 90, 1) + '°', COL.red, { dx: 18 });
  s.note(8, 18, S('البنفسجي المتقطع: دائرة الارتفاع −18°', 'violet dashed: altitude −18°'), COL.dim, 10); legend(s, [LEG().hor, LEG().eq, [COL.diu, S('مسار الشمس في الانقلاب', 'Sun at solstice')]]); return s.svg(); },
lst: p => { const J0 = jd0(p.Y, p.M, p.Dd), T = (J0 - 2451545) / 36525; const g0 = n360(100.46061837 + 36000.770053608 * T), g = n360(g0 + 360.98564736629 * p.ut / 24), l = n360(g + p.lon);
  const q = Plane(300, 270), cx = 150, cy = 135, r = 100; q.circ(cx, cy, r, COL.eq, 1.6).circ(cx, cy, 30, '#6fa8ff', 1, 'rgba(111,168,255,.25)');
  const ang = a => 90 + a; // ♈ at top? Greenwich meridian direction angle measured from ♈ (counter-clockwise = east)
  // ♈ direction at angle 0 (pointing right); Greenwich meridian at angle g (hour angle of ♈ = g means meridian is g east of ♈ in RA)
  const dir = a => [cx + r * cos(a), cy - r * sin(a)];
  const pA = dir(0), pG = dir(g), pL = dir(l);
  q.line(cx, cy, pA[0], pA[1], '#fff', 1.6).text(pA[0] + 8, pA[1] + 4, '♈\uFE0E', '#fff', 15, null, true);
  q.line(cx, cy, pG[0], pG[1], COL.mer, 1.6).text(pG[0] + 6 * cos(g), pG[1] - 6 * sin(g), S('غرينتش', 'Greenwich'), COL.mer, 11, 'middle');
  q.line(cx, cy, pL[0], pL[1], COL.gold, 2.2).text(pL[0] + 14 * cos(l), pL[1] - 14 * sin(l), S('زوال القاهرة', 'Cairo meridian'), COL.gold, 11, 'middle');
  q.arcA(cx, cy, 45, 0, g < l ? g : g - 360, COL.mer, 'θ', 56).arcA(cx, cy, 70, g, l < g ? l + 360 : l, COL.ecl, 'λ', 80);
  q.text(150, 262, S(`LST = θ + λ = ${f(l, 2)}° (اتجاه دوران الأرض عكس عقارب الساعة)`, `LST = θ + λ = ${f(l, 2)}° (Earth rotates counter-clockwise)`), COL.dim, 10.5, 'middle'); return q.svg(); },
eot: p => { const q = Plane(300, 230), x0 = 30, x1 = 290, y0 = 115, k = 4.2; q.line(x0, y0, x1, y0, 'rgba(255,255,255,.3)', 1);
  const E = d => { const J = jd0(p.Y, 1, 1) + d, T = (J - 2451545) / 36525; const L0 = n360(280.46646 + 36000.76983 * T), M = n360(357.52911 + 35999.05029 * T); const C = 1.914602 * sin(M) + 0.019993 * sin(2 * M); const lam = L0 + C - 0.00569; const al = n360(atan2(cos(23.4393) * sin(lam), cos(lam))); let e = L0 - 0.0057183 - al; e = ((e + 540) % 360) - 180; return e * 4; };
  let d = ''; for (let i = 0; i <= 365; i += 3) { d += (i ? 'L' : 'M') + (x0 + (x1 - x0) * i / 365).toFixed(1) + ',' + (y0 - E(i) * k).toFixed(1); } q.path(d, COL.gold, 2);
  const doy = (Date.UTC(p.Y, p.M - 1, p.Dd) - Date.UTC(p.Y, 0, 1)) / 864e5, e0 = E(doy); q.dot(x0 + (x1 - x0) * doy / 365, y0 - e0 * k, 5, '#ff7f7f', f(e0, 1) + 'ᵐ');
  [-15, -10, -5, 5, 10, 15].forEach(v => q.text(4, y0 - v * k + 4, (v > 0 ? '+' : '') + v, COL.dim, 9));
  const mn = ['1','2','3','4','5','6','7','8','9','10','11','12']; mn.forEach((m, i) => q.text(x0 + (x1 - x0) * (i + 0.5) / 12, 222, m, COL.dim, 9.5, 'middle'));
  q.text(150, 16, S('معادلة الزمن خلال السنة (دقائق) — المحور الأفقي: الشهر', 'Equation of time over the year (min) — x-axis: month'), COL.txt, 11, 'middle'); return q.svg(); },
sidint: p => { const q = Plane(300, 240); sunGlyph(q, 150, 120, 12); q.circ(150, 120, 90, 'rgba(255,255,255,.3)', 1.2, null, '4 4');
  const e1 = [150 + 90 * cos(-90), 120 - 90 * sin(-90)], a2 = -90 + 25, e2 = [150 + 90 * cos(a2), 120 - 90 * sin(a2)];
  [e1, e2].forEach((e, i) => { q.circ(e[0], e[1], 10, '#6fa8ff', 1.4, '#16336e'); q.line(e[0], e[1], e[0], e[1] - 60, '#fff', 1.4, '3 3'); });
  q.line(e2[0], e2[1], 150, 120, COL.gold, 1.4, '3 3'); q.text(e2[0], e2[1] - 66, S('نحو نجم بعيد', 'to a distant star'), '#fff', 10, 'middle');
  q.text(e1[0] - 30, e1[1] + 6, S('اليوم 1', 'day 1'), COL.dim, 10.5, 'middle').text(e2[0] + 48, e2[1] + 2, S('اليوم التالي', 'next day'), COL.dim, 10.5, 'middle');
  q.text(150, 18, S('بعد يوم نجمي يواجه الراصد النجم نفسه،', 'After one sidereal day the observer faces the same star;'), COL.txt, 10.5, 'middle').text(150, 33, S('ويحتاج ≈ 3ᵐ56ˢ إضافية ليواجه الشمس (الزاوية مكبّرة)', 'it needs ≈ 3ᵐ56ˢ more to face the Sun (angle exaggerated)'), COL.txt, 10.5, 'middle'); return q.svg(); },
kep1: p => kepFig(p.e, 360 / 365.2596 * p.days, 1),
kep2: p => { const cE = (1 - p.r / p.a) / p.e, E = acos(Math.max(-1, Math.min(1, cE))); const M = (E * D - p.e * Math.sin(E * D)) * R; return kepFig(p.e, M, p.a, p.r); },
syn: p => { const q = Plane(300, 260), cx = 150, cy = 130, s = 105; sunGlyph(q, cx, cy, 9); q.circ(cx, cy, s, '#6fa8ff', 1.3).circ(cx, cy, s * Math.min(p.a, 1.8) / (p.a > 1 ? p.a : 1), COL.gold, 1.3);
  if (p.a < 1) { const el = asin(p.a), Ex = cx - s, Ey = cy; const ang = 90 - el; // venus point: tangent
    const vx = cx + s * p.a * cos(180 + (90 - el) * -1), vy = cy - s * p.a * sin(180 - (90 - el)); const th = 180 - (90 - el); const Vx = cx + s * p.a * cos(th), Vy = cy - s * p.a * sin(th);
    q.line(Ex, Ey, Vx + (Vx - Ex) * 0.4, Vy + (Vy - Ey) * 0.4, '#fff', 1.4, '4 3').line(cx, cy, Vx, Vy, COL.gold, 1.2).line(Ex, Ey, cx, cy, '#6fa8ff', 1.2);
    q.dot(Ex, Ey, 6, '#6fa8ff', S('الأرض', 'Earth'), -10, 18).dot(Vx, Vy, 5, COL.gold, S('الكوكب', 'planet'), 6, -8).arcA(Ex, Ey, 40, 0, el, COL.red, 'ε').text(cx, cy + 22, 'a', COL.gold, 12, 'middle');
    q.text(150, 252, S('خط النظر مماس للمدار: الزاوية عند الكوكب قائمة', 'line of sight tangent to the orbit: right angle at the planet'), COL.dim, 10.5, 'middle'); }
  else q.text(150, 252, S('كوكب خارجي', 'outer planet'), COL.dim, 11, 'middle'); return q.svg(); },
stat: p => { const b = p.b, c = Math.sqrt(b) / (1 + b - Math.sqrt(b)), th = acos(c); const q = Plane(300, 270), cx = 110, cy = 140, s = 120 / b * 0.95, rE = Math.max(s * 1, 38);
  const sE = rE, sP = rE * b; sunGlyph(q, cx, cy, 8); q.circ(cx, cy, sE, '#6fa8ff', 1.3).circ(cx, cy, Math.min(sP, 260), COL.ecl, 1.3);
  const E = [cx + sE, cy], Pp = [cx + sP * cos(th), cy - sP * sin(th)]; q.line(cx, cy, E[0], E[1], 'rgba(255,255,255,.4)', 1).line(cx, cy, Pp[0], Pp[1], 'rgba(255,255,255,.4)', 1).line(E[0], E[1], Pp[0] + (Pp[0] - E[0]) * 0.2, Pp[1] + (Pp[1] - E[1]) * 0.2, '#fff', 1.4, '4 3');
  q.arcA(cx, cy, 30, 0, th, COL.gold, 'θ').dot(E[0], E[1], 6, '#6fa8ff', S('الأرض', 'Earth'), 6, 16).dot(Pp[0], Pp[1], 5, COL.ecl, S('الكوكب', 'planet'), 6, -8);
  q.line(E[0], E[1], E[0], E[1] - 40, '#6fa8ff', 2).line(Pp[0], Pp[1], Pp[0] - 30 / Math.sqrt(b) * sin(th), Pp[1] - 30 / Math.sqrt(b) * cos(th), COL.ecl, 2);
  q.text(150, 262, S('الخط المتقطع: خط النظر — الأسهم: السرعات المدارية', 'dashed: line of sight — arrows: orbital velocities'), COL.dim, 10.5, 'middle'); return q.svg(); },
par1: p => { const q = Plane(300, 230); sunGlyph(q, 60, 120, 9); q.ell(60, 120, 14, 50, '#6fa8ff', 1.2); q.dot(60, 70, 5, '#6fa8ff', S('الأرض', 'Earth'), 8, -4).dot(60, 170, 5, '#6fa8ff', '', 0, 0);
  q.dot(280, 120, 4, '#fff', S('النجم', 'star'), -30, -10).line(60, 70, 280, 120, '#fff', 1.1, '4 3').line(60, 170, 280, 120, '#fff', 1.1, '4 3').line(60, 120, 280, 120, COL.gold, 1.2);
  q.arcA(280, 120, 40, 180 - 13, 180, COL.red, 'ϖ').text(40, 100, '1 AU', COL.gold, 11).text(170, 140, 'd', COL.gold, 13, 'middle');
  q.text(150, 222, S('d [pc] = 1 / ϖ [″] (الزاوية مكبّرة جدًا)', 'd [pc] = 1 / ϖ [″] (angle hugely exaggerated)'), COL.dim, 10.5, 'middle'); return q.svg(); },
par2: p => { const q = Plane(300, 240), cx = 70, cy = 180, rE = 55; q.circ(cx, cy, rE, '#6fa8ff', 1.5, 'rgba(60,110,200,.35)'); const Tx = cx, Ty = cy - rE;
  const mx = 280, my = 40; q.line(Tx - 60, Ty, 296, Ty, COL.hor, 1.6).text(Tx - 55, Ty - 6, S('أفق الراصد', 'horizon'), COL.hor, 10);
  q.dot(cx, cy, 3.5, '#fff', 'O', -14, 4).dot(Tx, Ty, 4, '#fff', 'T', -14, -4).dot(mx, my, 8, '#ddd', S('القمر', 'Moon'), -26, -12);
  q.line(cx, cy, mx, my, '#fff', 1.1, '4 3').line(Tx, Ty, mx, my, COL.gold, 1.6).line(cx, cy, Tx, Ty, 'rgba(255,255,255,.5)', 1);
  const aT = atan2(Ty - my, mx - Tx), aO = atan2(cy - my, mx - cx); q.arcA(mx, my, 50, 180 + aO, 180 + aT, COL.red, 'p').arcA(Tx, Ty, 45, 0, aT, COL.gold, "h′");
  q.text(150, 232, 'sin p = sin π cos h′', COL.dim, 11, 'middle'); return q.svg(); },
ab1: p => { const k = 20.49, q = Plane(300, 240), cx = 150, cy = 115, sx = 4.2; q.ell(cx, cy, k * sx, k * sin(p.beta) * sx, COL.gold, 1.5); q.dot(cx, cy, 3, '#fff', S('الموضع المتوسط', 'mean position'), 6, -6);
  const dlc = -k * cos(p.lsun - p.lam), db = -k * sin(p.beta) * sin(p.lsun - p.lam); const x = cx + dlc * sx, y = cy - db * sx; q.line(cx, cy, x, y, COL.red, 2).dot(x, y, 5, COL.red, S('في التاريخ', 'on the date'), 6, 14);
  q.line(cx - k * sx - 10, cy, cx + k * sx + 10, cy, 'rgba(255,255,255,.25)', 1, '3 3').text(cx + k * sx + 12, cy + 4, 'Δλ cosβ', COL.dim, 10).line(cx, cy - k * sx * 0.95, cx, cy + k * sx * 0.95, 'rgba(255,255,255,.25)', 1, '3 3').text(cx + 4, cy - k * sx * 0.9, 'Δβ', COL.dim, 10);
  q.text(150, 228, S(`نصف المحور الأكبر κ = ${f(k, 1)}″ والأصغر κ sinβ = ${f(k * sin(p.beta), 1)}″`, `semi-axes κ = ${f(k, 1)}″ and κ sinβ = ${f(k * sin(p.beta), 1)}″`), COL.dim, 10.5, 'middle'); return q.svg(); },
pr1: p => precFig(p.ra, p.dec, p.yrs),
pr2: p => { const s = Sphere([0.75, 0.25, 0.6], { w: 300, h: 280 }).outline(); const K = [0, 0, 1], eps = p.eps; s.circle(K, eps, COL.gold, 1.6).circle(K, 90, COL.ecl, 1.2);
  const lp = 90, P = sph(90 - eps, lp), X = sph(p.beta, p.lam), Pm = sph(90 - eps, p.lam); s.arc(K, X, COL.tri, 2).arc(P, X, '#fff', 1.4).arc(Pm, X, COL.red, 2.4);
  s.point(K, 'K', COL.ecl).point(P, S('القطب الآن', 'pole now'), COL.gold, { fs: 11 }).point(Pm, S('القطب ~ بعد 11,800 سنة', 'pole in ~11,800 yr'), COL.red, { fs: 10.5, dy: 16 }).point(X, S('النسر الواقع', 'Vega'), '#ffcf7a', { fs: 11, dy: 18 });
  s.label(norm(add(K, P)), 'ε', COL.gold, { dx: 8 }); legend(s, [[COL.gold, S('مسار القطب السماوي', 'path of the celestial pole')], LEG().ecl]); return s.svg(); }
};
function jd0(y, m, d) { if (m <= 2) { y--; m += 12; } const A = Math.floor(y / 100), B = 2 - A + Math.floor(A / 4); return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5; }
function triFig(a, b, c, polar) {
  const A = acos((cos(a) - cos(b) * cos(c)) / (sin(b) * sin(c)));
  const s = Sphere([0.55, 0.45, 0.7], { w: 300, h: 280, r: 120 }).outline();
  const VA = [0, 0, 1], VB = sph(90 - c, -50), VC = sph(90 - b, -50 + A);
  s.fill([VA, VB, VC]).arc(VA, VB).arc(VB, VC).arc(VC, VA);
  const G = norm(add(add(VA, VB), VC)); s.sideLabel(VB, VC, 'a = ' + f(a, 1) + '°', G).sideLabel(VC, VA, 'b = ' + f(b, 1) + '°', G).sideLabel(VA, VB, 'c = ' + f(c, 1) + '°', G);
  const B = acos((cos(b) - cos(a) * cos(c)) / (sin(a) * sin(c))), C = acos((cos(c) - cos(a) * cos(b)) / (sin(a) * sin(b)));
  s.angle(VA, VB, VC, 'A', COL.gold, 8).angle(VB, VA, VC, 'B', COL.gold, 8).angle(VC, VA, VB, 'C', COL.gold, 8);
  s.point(VA, 'A', '#fff').point(VB, 'B', '#fff').point(VC, 'C', '#fff');
  s.note(8, 272, `A=${f(A, 1)}°  B=${f(B, 1)}°  C=${f(C, 1)}°  E=${f(A + B + C - 180, 1)}°`, COL.gold, 11);
  if (polar) s.note(292, 18, S('المثلث الأصلي (المحلول)', 'the solved triangle'), COL.dim, 10, 'end');
  return s.svg();
}
function twiFig(phi, dec, alts, classic) {
  const s = celestial(phi, { west: true }); const P = NCP(phi); s.circle(P, 90 - dec, COL.diu, 1.8);
  const cols = ['#ffd27a', '#ff9f5a', '#c39bff', '#7f8cff'];
  alts.forEach((h, i) => { if (h !== 0) s.circle([0, 0, 1], 90 - h, cols[i % 4], 1.1, { dash: '4 3' }); const c = (sin(h) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec)); if (Math.abs(c) <= 1) { const X = starNWU(phi, dec, acos(c)); s.point(X, '', cols[i % 4], { r: 4.5 }); } });
  const X0 = starNWU(phi, dec, acos((sin(alts[0]) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec)))), Xn = starNWU(phi, dec, acos((sin(alts[alts.length - 1]) - sin(phi) * sin(dec)) / (cos(phi) * cos(dec))));
  s.arc(P, X0, COL.tri, 1.6).arc(P, Xn, COL.tri, 1.6).arc([0, 0, 1], X0, 'rgba(255,255,255,.6)', 1.2).arc([0, 0, 1], Xn, 'rgba(255,255,255,.6)', 1.2);
  s.angle(P, X0, Xn, 'T', COL.gold, 12);
  s.point(P, 'P', COL.gold).point([0, 0, 1], 'Z', '#fff').label(X0, S('غروب', 'sunset'), '#ffd27a', { dy: -12 }).label(Xn, classic ? '−D' : '−18°', '#9fa8ff', { dy: 16 });
  s.note(8, 18, S('دوائر الارتفاع المتقطعة: ' + alts.map(h => f(h, h % 1 ? 2 : 0) + '°').join('، '), 'dashed altitude circles: ' + alts.map(h => f(h, h % 1 ? 2 : 0) + '°').join(', ')), COL.dim, 10);
  legend(s, [LEG().hor, LEG().eq, [COL.diu, S('مسار الشمس', 'Sun’s path')]]); return s.svg();
}
function kepFig(e, Mdeg, a, rr) {
  const M = Mdeg * D; let E = e > 0.8 ? Math.PI : M; for (let k = 0; k < 30; k++) E -= (E - e * Math.sin(E) - M) / (1 - e * Math.cos(E));
  const q = Plane(300, 240), A = 125, B = A * Math.sqrt(1 - e * e), cx = 150 - 0, cy = 118, fx = cx + A * e;
  q.circ(cx, cy, A, 'rgba(255,255,255,.18)', 1, null, '3 4').ell(cx, cy, A, B, '#6fa8ff', 1.6);
  if (rr) q.circ(fx, cy, rr / a * A, COL.red, 1.2, null, '5 3');
  sunGlyph(q, fx, cy, 7); q.dot(cx, cy, 2.5, 'rgba(255,255,255,.6)', 'O', -14, 14);
  const px = cx + A * Math.cos(E), py = cy - B * Math.sin(E), qx = cx + A * Math.cos(E), qy = cy - A * Math.sin(E);
  q.line(cx, cy, qx, qy, COL.mer, 1.2, '4 3').line(qx, qy, px, py, COL.mer, 1, '2 3').line(fx, cy, px, py, COL.gold, 1.8).line(cx - A, cy, cx + A, cy, 'rgba(255,255,255,.25)', 1);
  const nu = 2 * Math.atan2(Math.sqrt(1 + e) * Math.sin(E / 2), Math.sqrt(1 - e) * Math.cos(E / 2)) * R;
  q.arcA(cx, cy, 22, 0, E * R, COL.mer, 'E').arcA(fx, cy, 36, 0, n360(nu) > 359.9 ? 0 : n360(nu), COL.gold, 'ν').dot(px, py, 6, '#9fc2ff', S('الكوكب', 'planet'), 8, -6).dot(qx, qy, 3, COL.mer, '', 0, 0);
  q.text(cx + A - 4, cy + 16, S('الحضيض', 'perihelion'), COL.dim, 10, 'end').text(cx - A + 4, cy + 16, S('الأوج', 'aphelion'), COL.dim, 10);
  q.text(150, 234, rr ? S('الدائرة الحمراء: نصف القطر r — المذنب داخلها قرب الحضيض', 'red circle: radius r — the comet is inside near perihelion') : S('البنفسجي: الدائرة المساعدة والشذوذ اللامركزي E', 'violet: auxiliary circle and eccentric anomaly E'), COL.dim, 10.5, 'middle');
  return q.svg();
}
function fixFig(p) {
  const st = [[101.287, -16.716], [79.172, 45.998]];
  const hor = (phi, dec, H) => { const sh = sin(phi) * sin(dec) + cos(phi) * cos(dec) * cos(H); const y = -cos(dec) * sin(H), x = sin(dec) * cos(phi) - cos(dec) * cos(H) * sin(phi); return [asin(sh), n360(atan2(y, x))]; };
  const hobs = st.map(s => hor(p.phT, s[1], p.gst + p.laT - s[0])[0]); const c = st.map(s => hor(p.ph0, s[1], p.gst + p.la0 - s[0]));
  const q = Plane(300, 260), cx = 150, cy = 140; const scl = 2.2; // px per arcmin
  // local chart: x east (arcmin of departure), y north
  const toXY = (de, dn) => [cx + de * scl, cy - dn * scl];
  q.line(20, cy, 280, cy, 'rgba(255,255,255,.12)', 1).line(cx, 20, cx, 250, 'rgba(255,255,255,.12)', 1).text(cx + 4, 28, S('ش', 'N'), COL.dim, 11).text(276, cy - 6, S('ق', 'E'), COL.dim, 11);
  const lines = []; c.forEach((cc, i) => { const dh = (hobs[i] - cc[0]) * 60, A = cc[1]; const ux = sin(A), uy = cos(A); const P0 = toXY(dh * ux, dh * uy);
    const az = toXY(Math.max(dh, 20) * ux * 1.25, Math.max(dh, 20) * uy * 1.25); q.line(cx, cy, az[0], az[1], i ? COL.ecl : COL.tri, 1.2, '4 3');
    q.line(P0[0] - 120 * uy, P0[1] - 120 * ux, P0[0] + 120 * uy, P0[1] + 120 * ux, i ? COL.ecl : COL.tri, 2);
    q.text(az[0], az[1] - 6, (i ? S('العيوق', 'Capella') : S('الشعرى', 'Sirius')) + ` Δh=${f(dh, 1)}′`, i ? COL.ecl : COL.tri, 10.5, 'middle'); lines.push([dh, A]); });
  // intersection
  const [d1, A1] = lines[0], [d2, A2] = lines[1]; const a11 = cos(A1), a12 = sin(A1), a21 = cos(A2), a22 = sin(A2), det = a11 * a22 - a12 * a21; const dn = (d1 * a22 - a12 * d2) / det, de = (a11 * d2 - a21 * d1) / det;
  const F = toXY(de, dn); q.dot(cx, cy, 4, '#fff', S('المفترض', 'assumed'), 6, 14).dot(F[0], F[1], 6, COL.gold, S('الموقع', 'fix'), 8, -8);
  q.text(150, 254, S('خطا الموقع ⟂ سمتي النجمين؛ التقاطع = الموقع', 'Lines of position ⟂ azimuths; intersection = fix'), COL.dim, 10, 'middle'); return q.svg();
}
function precFig(ra, dec, yrs) {
  const s = Sphere([0.6, 0.7, 0.4], { w: 300, h: 280 }).outline(); const eps = 23.44, K = [0, -sin(eps), cos(eps)], P = [0, 0, 1];
  s.circle(K, eps, COL.gold, 1.3, { dash: '4 3' }).circle(P, 90, COL.eq, 1.3).circle(K, 90, COL.ecl, 1.3);
  const X = sph(dec, ra); s.arc(P, X, COL.tri, 2).arc(K, X, 'rgba(255,255,255,.5)', 1.2);
  s.point(P, 'P', COL.gold).point(K, 'K', COL.ecl).point(X, 'X', '#ffcf7a').point([1, 0, 0], '♈\uFE0E', '#fff');
  s.note(8, 18, S(`P يدور حول K (دورة ≈ 25 770 سنة)؛ هنا ${yrs} سنة`, `P circles K (≈ 25,770-yr cycle); here ${yrs} yr`), COL.dim, 10);
  legend(s, [LEG().eq, LEG().ecl, [COL.gold, S('مسار القطب', 'pole path')]]); return s.svg();
}
root.SphFigs = { FIG, setLang: l => { lang = l; } };
})(typeof window !== 'undefined' ? window : globalThis);
