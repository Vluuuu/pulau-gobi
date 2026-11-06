import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {EP003_WORLD_LAYOUT as L} from '../src/episode003/world/layout.ts';
import {
  octagonBoundaryRadius as OB,
  distanceToPolylineXZ as D,
  sampleRiverTrenchHeight,
} from '../src/episode003/world/terrain/terrainMath.ts';
import * as G from '../src/episode003/world/terrain/render/terrainGeometry.ts';
import {ROCKS} from '../src/episode002/islandRocks.ts';

const river = L.river;
const {centerline: C, width: W, bedY, waterY} = river;
const H = (x, z) => sampleRiverTrenchHeight(x, z, C, W, bedY, waterY);
const build = (R) => G.buildTerrainBuffers(R, river);
const near = (a, b, e) => assert.ok(Math.abs(a - b) <= e, `${a} !~ ${b} (tol ${e})`);
const vert = (b, i) => [b.positions[i * 3], b.positions[i * 3 + 1], b.positions[i * 3 + 2]];
const F32 = 1e-4; // toleransi Float32 pada koordinat sampai ~40 unit

// interpolasi tinggi mesh top (barisan: pusat, lalu N cincin x A sudut) pada (x,z)
function meshTopY(b, R, x, z) {
  const N = G.RADIAL;
  const A = G.ANGULAR;
  const az = (((Math.atan2(x, z) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
  const j = Math.floor(az / ((2 * Math.PI) / A)) % A;
  const j1 = (j + 1) % A;
  const V = (i, jj) => vert(b, 1 + (i - 1) * A + jj);
  const i0 = Math.max(1, Math.min(N - 1, Math.floor((Math.hypot(x, z) / OB(az, R)) * N)));
  for (let i = Math.max(1, i0 - 1); i <= Math.min(N - 1, i0 + 1); i++) {
    const a = V(i, j), bb = V(i, j1), c = V(i + 1, j), d = V(i + 1, j1);
    for (const [t0, t1, t2] of [[a, c, bb], [bb, c, d]]) {
      const den = (t1[2] - t2[2]) * (t0[0] - t2[0]) + (t2[0] - t1[0]) * (t0[2] - t2[2]);
      const w0 = ((t1[2] - t2[2]) * (x - t2[0]) + (t2[0] - t1[0]) * (z - t2[2])) / den;
      const w1 = ((t2[2] - t0[2]) * (x - t2[0]) + (t0[0] - t2[0]) * (z - t2[2])) / den;
      const w2 = 1 - w0 - w1;
      if (w0 >= -1e-9 && w1 >= -1e-9 && w2 >= -1e-9) return w0 * t0[1] + w1 * t1[1] + w2 * t2[1];
    }
  }
  return NaN;
}

test('resolveRadius: ujung persis, clamp progress, target custom, target tidak valid', () => {
  assert.equal(G.resolveRadius(0, 11.7, 37.5), 11.7);
  assert.equal(G.resolveRadius(1, 11.7, 37.5), 37.5);
  assert.equal(G.resolveRadius(-3, 11.7, 37.5), 11.7);
  assert.equal(G.resolveRadius(9, 11.7, 37.5), 37.5);
  assert.equal(G.resolveRadius(NaN, 11.7, 37.5), 11.7);
  assert.equal(G.resolveRadius(1, 11.7, 40), 40);
  assert.equal(G.resolveRadius(1, 11.7, 5), 11.7); // target < awal: tidak mengecil
  assert.equal(G.resolveRadius(1, 11.7, NaN), 11.7);
  let prev = -Infinity;
  for (let i = 0; i <= 20; i++) {
    const r = G.resolveRadius(i / 20, 11.7, 37.5);
    assert.ok(r >= prev);
    prev = r;
  }
});

test('deterministik: dua build identik byte-per-byte; batu identik', () => {
  for (const R of [11.7, 24.3, 37.5]) {
    const a = build(R), b = build(R);
    assert.deepEqual(Buffer.from(a.positions.buffer), Buffer.from(b.positions.buffer));
    assert.deepEqual(Buffer.from(a.colors.buffer), Buffer.from(b.colors.buffer));
    assert.deepEqual(Buffer.from(a.indices.buffer), Buffer.from(b.indices.buffer));
  }
  assert.deepEqual(G.computeRocks(0.6, 28), G.computeRocks(0.6, 28));
});

test('ukuran geometri tetap & indeks valid (tanpa NaN)', () => {
  const sizes = new Set();
  for (const R of [11.7, 20, 37.5]) {
    const b = build(R);
    sizes.add(`${b.positions.length}/${b.indices.length}`);
    assert.equal(b.colors.length, b.positions.length);
    assert.ok(b.positions.every(Number.isFinite));
    const nv = b.positions.length / 3;
    assert.ok(b.indices.every((i) => i < nv));
    assert.equal(b.indices.length % 3, 0);
  }
  assert.equal(sizes.size, 1);
});

test('tepi top persis di oktagon; tidak ada vertex top di luar; radius maksimum = circumR', () => {
  for (const R of [11.7, 20, 37.5]) {
    const b = build(R);
    let maxR = 0;
    for (let i = 0; i < b.topVertexCount; i++) {
      const [x, , z] = vert(b, i);
      const e = OB(Math.atan2(x, z), R);
      assert.ok(Math.hypot(x, z) <= e + F32, 'vertex di luar oktagon');
      maxR = Math.max(maxR, Math.hypot(x, z));
    }
    near(maxR, R, 1e-3); // sudut oktagon tepat pada sampel
    // cincin terluar
    const last = b.topVertexCount - G.ANGULAR;
    for (let j = 0; j < G.ANGULAR; j++) {
      const [x, , z] = vert(b, last + j);
      near(Math.hypot(x, z), OB((j * 2 * Math.PI) / G.ANGULAR, R), F32);
    }
  }
});

test('setiap vertex top == sampleRiverTrenchHeight (A1a), tanpa kecuali', () => {
  for (const R of [11.7, 24.3, 37.5]) {
    const b = build(R);
    for (let i = 0; i < b.topVertexCount; i++) {
      const [x, y, z] = vert(b, i);
      near(y, H(x, z), 1e-6);
    }
  }
});

test('ground top y=0 jauh dari sungai; pulau awal (11.7) rata y=0 seluruhnya', () => {
  const b0 = build(11.7);
  for (let i = 0; i < b0.topVertexCount; i++) assert.equal(vert(b0, i)[1], 0);
  const b = build(37.5);
  for (let i = 0; i < b.topVertexCount; i++) {
    const [x, y, z] = vert(b, i);
    if (D(x, z, C) >= 2.15) assert.equal(y, 0);
  }
  // titik rumah, sawah, warteg (interpolasi mesh)
  for (const p of [L.house.position, L.riceField.position, L.warteg.position]) {
    near(meshTopY(b, 37.5, p[0], p[2]), 0, 1e-6);
  }
});

test('parit: dasar -0.35 tercapai, tidak ada vertex top di luar [bedY, 0], dasar datar pada d<=1', () => {
  const b = build(37.5);
  let minY = Infinity, maxY = -Infinity, bedCount = 0;
  for (let i = 0; i < b.topVertexCount; i++) {
    const [x, y, z] = vert(b, i);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    if (D(x, z, C) <= 1.0) {
      near(y, bedY, 1e-6);
      bedCount++;
    }
  }
  near(minY, bedY, 1e-6);
  assert.equal(maxY, 0);
  assert.ok(bedCount > 200, `terlalu sedikit vertex dasar: ${bedCount}`);
});

test('mesh mengikuti fungsi parit di antara vertex (simpangan interpolasi terbatas)', () => {
  const R = 37.5;
  const b = build(R);
  let maxE = 0, sum = 0, cnt = 0;
  for (let x = -34; x <= 0; x += 0.11) {
    for (let z = -12; z <= 30; z += 0.11) {
      if (D(x, z, C) > 2.6) continue;
      if (Math.hypot(x, z) > OB(Math.atan2(x, z), R) * 0.98) continue;
      const my = meshTopY(b, R, x, z);
      assert.ok(Number.isFinite(my), `titik ${x},${z} tidak ditemukan pada mesh`);
      const e = Math.abs(my - H(x, z));
      maxE = Math.max(maxE, e);
      sum += e;
      cnt++;
    }
  }
  assert.ok(cnt > 3000);
  assert.ok(maxE <= 0.09, `simpangan maks ${maxE}`);
  assert.ok(sum / cnt <= 0.012, `simpangan rata-rata ${sum / cnt}`);
});

test('kontinuitas dengan EP002 pada progress 0 (radius 11.7)', () => {
  const R = 11.7;
  const b = build(R);
  const s = R / 3;
  const ys = 1 + (s - 1) * 0.45;
  let minY = Infinity;
  const ys_ = [];
  for (let i = 0; i < b.positions.length / 3; i++) {
    const y = vert(b, i)[1];
    minY = Math.min(minY, y);
    ys_.push(y);
  }
  near(minY, -1.1 - 2.7 * ys, 1e-4); // ujung kerucut
  assert.ok(ys_.some((y) => Math.abs(y + 0.3) < 1e-6), 'dasar sisi rumput y=-0.3');
  assert.ok(ys_.some((y) => Math.abs(y + 1.1) < 1e-6), 'dasar tanah y=-1.1');
  // dasar tanah: radius circum = 11.7*2.5/3 = 9.75 (identik EP002: 2.5*s)
  let maxSoil = 0;
  for (let i = 0; i < b.positions.length / 3; i++) {
    const [x, y, z] = vert(b, i);
    if (Math.abs(y + 1.1) < 1e-6) maxSoil = Math.max(maxSoil, Math.hypot(x, z));
  }
  near(maxSoil, 2.5 * s, 1e-3);
});

test('permukaan tertutup (watertight): setiap sisi dipakai tepat 2 segitiga (R=11.7, 22, 37.5)', () => {
  for (const R of [11.7, 22, 37.5]) {
    const b = build(R);
    const key = (i) => {
      const [x, y, z] = vert(b, i);
      return `${Math.round(x * 1e3)},${Math.round(y * 1e3)},${Math.round(z * 1e3)}`;
    };
    const map = new Map();
    const ids = new Map();
    const id = (i) => {
      const k = key(i);
      if (!ids.has(k)) ids.set(k, ids.size);
      return ids.get(k);
    };
    for (let t = 0; t < b.indices.length; t += 3) {
      const v = [id(b.indices[t]), id(b.indices[t + 1]), id(b.indices[t + 2])];
      for (let e = 0; e < 3; e++) {
        const p = v[e], q = v[(e + 1) % 3];
        if (p === q) continue;
        const k = p < q ? `${p}-${q}` : `${q}-${p}`;
        map.set(k, (map.get(k) || 0) + 1);
      }
    }
    let bad = 0;
    for (const n of map.values()) if (n !== 2) bad++;
    assert.equal(bad, 0, `R=${R}: ${bad} sisi tidak berpasangan`);
  }
});

test('ekspansi: radius tepi monoton naik, bentuk tetap oktagon, parit terpotong tepi tetap tertutup', () => {
  let prev = 0;
  for (let i = 0; i <= 10; i++) {
    const R = G.resolveRadius(i / 10, 11.7, 37.5);
    const b = build(R);
    let maxR = 0;
    for (let k = 0; k < b.topVertexCount; k++) maxR = Math.max(maxR, Math.hypot(vert(b, k)[0], vert(b, k)[2]));
    assert.ok(maxR >= prev - 1e-6);
    prev = maxR;
  }
});

test('batu: ada sejak progress 0 (EP002), bertambah saat ekspansi, menempel dalam oktagon, clamp & NaN', () => {
  const r0 = G.computeRocks(0, 11.7);
  assert.equal(r0.length, ROCKS.length);
  const r1 = G.computeRocks(1, 37.5);
  assert.equal(r1.length, ROCKS.length + G.EXTRA_ROCKS.length);
  // pertumbuhan batu tambahan tidak menurun
  let prevTotal = 0;
  for (let i = 0; i <= 20; i++) {
    const p = i / 20;
    const rocks = G.computeRocks(p, G.resolveRadius(p, 11.7, 37.5));
    const total = rocks.slice(ROCKS.length).reduce((a, r) => a + r.scale[0], 0);
    assert.ok(total >= prevTotal - 1e-9);
    prevTotal = total;
  }
  for (const rk of r1) {
    assert.ok(rk.position.every(Number.isFinite));
    assert.ok(Math.hypot(rk.position[0], rk.position[2]) < 37.5);
    assert.ok(rk.position[1] < -1.1);
  }
  assert.deepEqual(G.computeRocks(-2, 11.7), G.computeRocks(0, 11.7));
  assert.deepEqual(G.computeRocks(NaN, 11.7), G.computeRocks(0, 11.7));
  assert.deepEqual(G.computeRocks(7, 37.5), G.computeRocks(1, 37.5));
});

test('sumber A1b: tanpa Math.random, impor sesuai kontrak, tidak menyentuh ExpandedIsland lama', () => {
  const dir = new URL('../src/episode003/world/terrain/', import.meta.url);
  const tsx = readFileSync(new URL('ExpandedIslandEP003.tsx', dir), 'utf8');
  const geo = readFileSync(new URL('render/terrainGeometry.ts', dir), 'utf8');
  for (const src of [tsx, geo]) {
    assert.ok(!/Math\.random/.test(src));
    assert.ok(!/ExpandedIsland'|ExpandedIsland\.tsx/.test(src.replace(/ExpandedIslandEP003/g, '')));
  }
  assert.match(tsx, /from '\.\.\/layout\.ts'/);
  assert.match(tsx, /export const ExpandedIslandEP003/);
  assert.match(tsx, /export type ExpandedIslandEP003Props/);
  assert.match(geo, /radiusForExpansion/);
  assert.match(geo, /octagonBoundaryRadius/);
  assert.match(geo, /sampleRiverTrenchHeight/);
});
