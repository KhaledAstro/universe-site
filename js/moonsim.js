// ===== MoonSim: 2D particle model (softened N-body gravity + soft-sphere contacts + accretion beyond the Roche limit) =====
// Units: Earth radius = 1, Earth mass = 1, G = 1.  Mat: 0 iron, 1 rock.  Src: 0 proto-Earth, 1 impactor/other.
(function (root) {
'use strict';
function Sim(n) {
  this.N = 0; const A = k => new Float32Array(n);
  this.x = A(); this.y = A(); this.vx = A(); this.vy = A(); this.ax = A(); this.ay = A(); this.m = A(); this.r = A(); this.mat = new Uint8Array(n); this.src = new Uint8Array(n); this.heat = A(); this.f = A(); this.alive = new Uint8Array(n);
  this.K = 6; this.damp = 0.5; this.eps = 0.05; this.t = 0; this.accrete = false; this.roche = 2.9; this.drag = 0; this.spin = 0;
}
Sim.prototype.add = function (x, y, vx, vy, m, r, mat, src) { const i = this.N++; this.x[i] = x; this.y[i] = y; this.vx[i] = vx; this.vy[i] = vy; this.m[i] = m; this.r[i] = r; this.mat[i] = mat; this.src[i] = src; this.alive[i] = 1; this.heat[i] = 0; this.f[i] = src === 1 ? 1 : 0; return i; };
// fill a disc of radius R with particles on a hex lattice; core radius fraction for iron
Sim.prototype.body = function (cx, cy, vx, vy, R, M, coreFrac, src, spacing) {
  const pts = []; const s = spacing;
  for (let j = -Math.ceil(R / s) - 1; j <= Math.ceil(R / s) + 1; j++) for (let i = -Math.ceil(R / s) - 1; i <= Math.ceil(R / s) + 1; i++) { const x = (i + (j & 1) * 0.5) * s, y = j * s * 0.866; if (x * x + y * y <= R * R) pts.push([x, y]); }
  const m = M / pts.length, r = s * 0.5, ids = [];
  for (const p of pts) ids.push(this.add(cx + p[0], cy + p[1], vx, vy, m, r, Math.hypot(p[0], p[1]) < coreFrac * R ? 0 : 1, src));
  return ids;
};
Sim.prototype.forces = function () {
  const N = this.N, x = this.x, y = this.y, vx = this.vx, vy = this.vy, m = this.m, r = this.r, ax = this.ax, ay = this.ay, al = this.alive, K = this.K, eps2 = this.eps * this.eps, dmp = this.damp;
  ax.fill(0, 0, N); ay.fill(0, 0, N);
  for (let i = 0; i < N; i++) { if (!al[i]) continue; const xi = x[i], yi = y[i], mi = m[i], ri = r[i];
    for (let j = i + 1; j < N; j++) { if (!al[j]) continue; const dx = x[j] - xi, dy = y[j] - yi, d2 = dx * dx + dy * dy, d = Math.sqrt(d2) + 1e-9;
      const inv = 1 / ((d2 + eps2) * Math.sqrt(d2 + eps2)); let fx = dx * inv, fy = dy * inv; // gravity per unit mass pair
      ax[i] += m[j] * fx; ay[i] += m[j] * fy; ax[j] -= mi * fx; ay[j] -= mi * fy;
      const s = ri + r[j];
      if (d < s && i !== this.central && j !== this.central) { const ov = s - d, nx = dx / d, ny = dy / d, vn = (vx[j] - vx[i]) * nx + (vy[j] - vy[i]) * ny;
        let f = K * ov * Math.sqrt(Math.min(mi, m[j]) / 0.0015) - dmp * vn * 0.05; // soft-sphere repulsion + damping
        if (f < 0) f = 0;
        ax[i] -= f * nx / mi; ay[i] -= f * ny / mi; ax[j] += f * nx / m[j]; ay[j] += f * ny / m[j];
        if (vn < -0.3) { const h = -vn * 0.02; this.heat[i] += h; this.heat[j] += h; }
        if (this.mix && this.heat[i] > this.mix && this.heat[j] > this.mix) { const fi = this.f[i], fj = this.f[j], k = 0.08; this.f[i] += k * (fj - fi); this.f[j] += k * (fi - fj); } } } }
};
Sim.prototype.step = function (dt) {
  const N = this.N, x = this.x, y = this.y, vx = this.vx, vy = this.vy, ax = this.ax, ay = this.ay, al = this.alive;
  for (let i = 0; i < N; i++) if (al[i]) { vx[i] += 0.5 * dt * ax[i]; vy[i] += 0.5 * dt * ay[i]; x[i] += dt * vx[i]; y[i] += dt * vy[i]; }
  this.forces();
  for (let i = 0; i < N; i++) if (al[i]) { vx[i] += 0.5 * dt * ax[i]; vy[i] += 0.5 * dt * ay[i]; this.heat[i] *= 0.9995;
    if (this.spinUp && i !== this.central) { const dx = x[i] - this.cx, dy = y[i] - this.cy, r = Math.hypot(dx, dy); if (r < 1.15) { const vt = (-dy * vx[i] + dx * vy[i]) / (r + 1e-6), want = this.spinUp * r, a = (want - vt) * 0.6 * dt; vx[i] += -dy / (r + 1e-6) * a; vy[i] += dx / (r + 1e-6) * a; } }
    if (this.drag) { const r = Math.hypot(x[i] - this.cx, y[i] - this.cy); if (r > 1.2 && r < 4) { vx[i] *= 1 - this.drag * dt; vy[i] *= 1 - this.drag * dt; } } }
  if (this.central != null) this.absorb();
  if (this.accrete) this.merge();
  this.t += dt;
};
// centre of the main body (densest mass within 1.6 of the previous centre)
Sim.prototype.centre = function () {
  if (this.central != null) { const c = this.central; this.cx = this.x[c]; this.cy = this.y[c]; this.cvx = this.vx[c]; this.cvy = this.vy[c]; this.cm = this.m[c]; return [this.cx, this.cy]; }
  let cx = this.cx || 0, cy = this.cy || 0;
  for (let it = 0; it < 3; it++) { let sx = 0, sy = 0, sm = 0, svx = 0, svy = 0; for (let i = 0; i < this.N; i++) { if (!this.alive[i]) continue; const dx = this.x[i] - cx, dy = this.y[i] - cy; if (dx * dx + dy * dy < 2.56) { sx += this.m[i] * this.x[i]; sy += this.m[i] * this.y[i]; svx += this.m[i] * this.vx[i]; svy += this.m[i] * this.vy[i]; sm += this.m[i]; } }
    if (sm > 0) { cx = sx / sm; cy = sy / sm; this.cvx = svx / sm; this.cvy = svy / sm; this.cm = sm; } }
  this.cx = cx; this.cy = cy; return [cx, cy];
};
// accretion: overlapping particles outside the Roche limit stick together if their relative speed is below mutual escape-ish speed
// after the impact: collapse everything bound inside rcut into one central planet (it relaxes to a sphere in reality)
Sim.prototype.consolidate = function (rcut) {
  const [cx, cy] = this.centre(); let M = 0, px = 0, py = 0, mT = 0;
  for (let i = 0; i < this.N; i++) { if (!this.alive[i]) continue; if (Math.hypot(this.x[i] - cx, this.y[i] - cy) < rcut) { M += this.m[i]; px += this.m[i] * this.vx[i]; py += this.m[i] * this.vy[i]; mT += this.m[i] * this.f[i]; this.alive[i] = 0; } }
  const c = this.add(cx, cy, px / M, py / M, M, 1.0, 0, 0); this.central = c; this.centralT = mT / M; this.f[c] = mT / M; this.eps = 0.03; return c;
};
Sim.prototype.absorb = function () {
  const c = this.central; if (c == null) return;
  for (let i = 0; i < this.N; i++) { if (!this.alive[i] || i === c) continue; const d = Math.hypot(this.x[i] - this.x[c], this.y[i] - this.y[c]); if (d < this.r[c] + this.r[i] * 0.3) { const M = this.m[c] + this.m[i]; this.vx[c] = (this.vx[c] * this.m[c] + this.vx[i] * this.m[i]) / M; this.vy[c] = (this.vy[c] * this.m[c] + this.vy[i] * this.m[i]) / M; this.f[c] = (this.f[c] * this.m[c] + this.f[i] * this.m[i]) / M; this.centralT = this.f[c]; this.m[c] = M; this.alive[i] = 0; } }
};
Sim.prototype.merge = function () {
  const N = this.N, cx = this.cx, cy = this.cy, R2 = this.roche * this.roche;
  for (let i = 0; i < N; i++) { if (!this.alive[i] || i === this.central) continue; const dxi = this.x[i] - cx, dyi = this.y[i] - cy; if (dxi * dxi + dyi * dyi < R2) continue;
    for (let j = i + 1; j < N; j++) { if (!this.alive[j] || j === this.central) continue; const dx = this.x[j] - this.x[i], dy = this.y[j] - this.y[i], s = this.r[i] + this.r[j];
      if (dx * dx + dy * dy < s * s) { const dxj = this.x[j] - cx, dyj = this.y[j] - cy; if (dxj * dxj + dyj * dyj < R2) continue;
        const mi = this.m[i], mj = this.m[j], M = mi + mj, rv = Math.hypot(this.vx[j] - this.vx[i], this.vy[j] - this.vy[i]), ve = Math.sqrt(2 * M / s);
        if (rv < (this.mergeTol || 1.5) * ve) { this.x[i] = (this.x[i] * mi + this.x[j] * mj) / M; this.y[i] = (this.y[i] * mi + this.y[j] * mj) / M; this.vx[i] = (this.vx[i] * mi + this.vx[j] * mj) / M; this.vy[i] = (this.vy[i] * mi + this.vy[j] * mj) / M;
          this.r[i] = Math.sqrt(this.r[i] * this.r[i] + this.r[j] * this.r[j]); this.f[i] = (this.f[i] * mi + this.f[j] * mj) / M; if (!this.iron) { this.iron = new Float32Array(this.x.length); for (let q = 0; q < this.N; q++) this.iron[q] = this.mat[q] === 0 ? 1 : 0; }
          this.iron[i] = (this.iron[i] * mi + this.iron[j] * mj) / M; this.mat[i] = this.iron[i] > 0.5 ? 0 : 1; this.m[i] = M; this.alive[j] = 0; } } } }
};
// statistics: mass bound in a disc outside the planet, largest moonlet and its impactor fraction
Sim.prototype.stats = function () {
  const [cx, cy] = this.centre(); let disk = 0, diskT = 0, big = -1, bm = 0, esc = 0;
  for (let i = 0; i < this.N; i++) { if (!this.alive[i] || i === this.central) continue; const dx = this.x[i] - cx, dy = this.y[i] - cy, r = Math.hypot(dx, dy); if (r < 1.05) continue;
    const vx = this.vx[i] - (this.cvx || 0), vy = this.vy[i] - (this.cvy || 0), E = 0.5 * (vx * vx + vy * vy) - (this.cm || 1) / r;
    if (E < 0) { disk += this.m[i]; diskT += this.m[i] * this.f[i]; if (this.m[i] > bm) { bm = this.m[i]; big = i; } } else esc += this.m[i]; }
  const bt = big >= 0 ? this.f[big] : 0, bi = big >= 0 ? (this.iron ? this.iron[big] : (this.mat[big] === 0 ? 1 : 0)) : 0;
  return { disk, diskT: disk ? diskT / disk : 0, big: bm, bigT: bt, bigIron: bi, bigIdx: big, esc };
};
root.MoonSim = Sim;
if (typeof module !== 'undefined') module.exports = Sim;
})(typeof window !== 'undefined' ? window : globalThis);
