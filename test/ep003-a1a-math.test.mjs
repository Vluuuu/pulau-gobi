import test from 'node:test';
import assert from 'node:assert/strict';
import {EP003_WORLD_LAYOUT as L} from '../src/episode003/world/layout.ts';
import {
  clamp01,
  radiusForExpansion,
  octagonBoundaryRadius,
  distanceToPolylineXZ,
  sampleRiverTrenchHeight,
} from '../src/episode003/world/terrain/terrainMath.ts';

const {centerline: C, width: W, bedY, waterY} = L.river;
const H = (x, z) => sampleRiverTrenchHeight(x, z, C, W, bedY, waterY);
const near = (a, b, e = 1e-9) => assert.ok(Math.abs(a - b) <= e, `${a} !~ ${b}`);

test('layout constants', () => {
  assert.equal(L.initialRadius, 11.7);
  assert.equal(L.targetRadius, 37.5);
  assert.deepEqual([...L.house.position], [-5, 0, -1]);
  assert.deepEqual([...L.riceField.position], [4.9, 0, -2.6]);
  assert.deepEqual([...L.warteg.position], [14, 0, 6]);
  assert.equal(L.river.width, 3);
  assert.equal(L.river.bedY, -0.35);
  assert.equal(L.river.waterY, -0.15);
});

test('clamp01', () => {
  assert.equal(clamp01(-3), 0);
  assert.equal(clamp01(0.4), 0.4);
  assert.equal(clamp01(9), 1);
  assert.equal(clamp01(NaN), 0);
});

test('radius endpoints exact + clamp + monotonic', () => {
  assert.equal(radiusForExpansion(0), 11.7);
  assert.equal(radiusForExpansion(1), 37.5);
  assert.equal(radiusForExpansion(-5), 11.7);
  assert.equal(radiusForExpansion(5), 37.5);
  assert.equal(radiusForExpansion(0, 10, 20), 10);
  assert.equal(radiusForExpansion(1, 10, 20), 20);
  let prev = -Infinity;
  for (let i = 0; i <= 1000; i++) {
    const r = radiusForExpansion(i / 1000);
    assert.ok(r >= prev);
    assert.ok(r >= 11.7 && r <= 37.5);
    prev = r;
  }
});

test('octagon boundary: flat sides at 45deg multiples, corners at 22.5+k*45', () => {
  const R = 10;
  near(octagonBoundaryRadius(0, R), R * Math.cos(Math.PI / 8));
  near(octagonBoundaryRadius(Math.PI / 2, R), R * Math.cos(Math.PI / 8));
  near(octagonBoundaryRadius(Math.PI / 8, R), R);
  near(octagonBoundaryRadius(-Math.PI / 8, R), R);
  near(octagonBoundaryRadius(Math.PI / 8 + 7 * (Math.PI / 4), R), R);
  assert.equal(octagonBoundaryRadius(1.234, 0), 0);
});

test('distanceToPolylineXZ', () => {
  near(distanceToPolylineXZ(-22, -6, C), 0);
  near(distanceToPolylineXZ(-22, -8, C), 2); // sebelum titik awal => jarak ke endpoint
  near(distanceToPolylineXZ(0, 0, [[0, 0], [10, 0]]), 0);
  near(distanceToPolylineXZ(5, 3, [[0, 0], [10, 0]]), 3);
  near(distanceToPolylineXZ(3, 4, [[0, 0], [0, 0]]), 5); // segmen degenerate
  assert.equal(distanceToPolylineXZ(1, 1, []), Infinity);
});

test('trench: bed flat, edges, outside', () => {
  near(H(-22, -6), bedY);
  // titik pada jarak d dari segmen pertama (tegak lurus di tengah segmen)
  const [ax, az] = C[0], [bx, bz] = C[1];
  const mx = (ax + bx) / 2, mz = (az + bz) / 2;
  const len = Math.hypot(bx - ax, bz - az);
  const nx = -(bz - az) / len, nz = (bx - ax) / len;
  const at = (d) => H(mx + nx * d, mz + nz * d);
  near(at(0), bedY);
  near(at(1.0), bedY);
  near(at(1.5), waterY);
  near(at(2.15), 0);
  near(at(3), 0);
  near(at(50), 0);
  // monoton naik terhadap d
  let prev = -Infinity;
  for (let i = 0; i <= 400; i++) {
    const h = at(i * 0.01);
    assert.ok(h >= prev - 1e-12);
    assert.ok(h >= bedY - 1e-12 && h <= 1e-12);
    prev = h;
  }
});

test('continuity far from river and across trench edge', () => {
  for (const [x, z] of [[0, 0], [-5, -1], [4.9, -2.6], [14, 6], [30, 30], [-3, 15]]) {
    assert.equal(H(x, z), 0);
    assert.equal(H(x + 1e-4, z - 1e-4), 0);
  }
  // kontinuitas Lipschitz-kecil di sepanjang garis melintasi parit
  const [ax, az] = C[1], [bx, bz] = C[2];
  const len = Math.hypot(bx - ax, bz - az);
  const nx = -(bz - az) / len, nz = (bx - ax) / len;
  const mx = (ax + bx) / 2, mz = (az + bz) / 2;
  let prev = H(mx - nx * 4, mz - nz * 4);
  for (let i = 1; i <= 8000; i++) {
    const t = -4 + i * 0.001;
    const h = H(mx + nx * t, mz + nz * t);
    assert.ok(Math.abs(h - prev) < 0.002, `lompatan di t=${t}`);
    prev = h;
  }
});

test('deterministic', () => {
  for (let i = 0; i < 50; i++) assert.equal(H(-16.3 + i * 0.01, 3.1), H(-16.3 + i * 0.01, 3.1));
});

test('house, rice field, warteg clear of trench corridor and inside island', () => {
  const clear = (W / 2) + 0.65;
  for (const p of [L.house.position, L.riceField.position, L.warteg.position]) {
    const d = distanceToPolylineXZ(p[0], p[2], C);
    assert.ok(d > clear + 5, `terlalu dekat sungai: ${d}`);
    assert.equal(H(p[0], p[2]), 0);
    const az = Math.atan2(p[0], p[2]);
    assert.ok(Math.hypot(p[0], p[2]) < octagonBoundaryRadius(az, L.targetRadius));
  }
});

test('river corridor lies outside old island (11.7) and inside target island', () => {
  const clear = (W / 2) + 0.65;
  for (let s = 0; s < C.length - 1; s++) {
    for (let i = 0; i <= 100; i++) {
      const t = i / 100;
      const x = C[s][0] + (C[s + 1][0] - C[s][0]) * t;
      const z = C[s][1] + (C[s + 1][1] - C[s][1]) * t;
      const r = Math.hypot(x, z);
      assert.ok(r - clear > L.initialRadius, `sungai menyentuh pulau lama @${x},${z}`);
      assert.ok(r + clear < octagonBoundaryRadius(Math.atan2(x, z), L.targetRadius));
    }
  }
});
