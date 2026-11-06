import test from 'node:test';
import assert from 'node:assert/strict';
import {createRiverModel, DEFAULT_RIVER, distanceToRiver, pathRows, samplePath, trenchHeight} from '../src/episode003/world/river/riverMath.ts';
import {buildRiverBanks, buildRiverHighlights, buildRiverLining, buildRiverWater} from '../src/episode003/world/river/riverGeometry.ts';
import {EP003_WORLD_LAYOUT as L} from '../src/episode003/world/layout.ts';
import {distanceToPolylineXZ, octagonBoundaryRadius, sampleRiverTrenchHeight} from '../src/episode003/world/terrain/terrainMath.ts';
import {ANGULAR, RADIAL, buildTerrainBuffers} from '../src/episode003/world/terrain/render/terrainGeometry.ts';

const model = createRiverModel();
const near = (a, b, tolerance = 1e-6) => assert.ok(Math.abs(a - b) <= tolerance, `${a} versus ${b}`);
const vertex = (b, i) => Array.from(b.positions.slice(i * 3, i * 3 + 3));
const eachTriangle = (b, fn) => { for (let i = 0; i < b.indices.length; i += 3) fn(...Array.from(b.indices.slice(i, i + 3), (id) => vertex(b, id))); };
const areaXZ = (b) => {
  let area = 0;
  eachTriangle(b, (a, c, d) => { area += Math.abs((c[2] - a[2]) * (d[0] - a[0]) - (c[0] - a[0]) * (d[2] - a[2])) / 2; });
  return area;
};

// Interpolate the ACTUAL A1 triangle, independently of A2's analytic trench helper.
function topHeight(mesh, radius, x, z) {
  const az = ((Math.atan2(x, z) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
  const j = Math.floor(az * ANGULAR / (2 * Math.PI)) % ANGULAR, j1 = (j + 1) % ANGULAR;
  const i0 = Math.floor(Math.hypot(x, z) / octagonBoundaryRadius(az, radius) * RADIAL);
  const v = (i, k) => vertex(mesh, 1 + (i - 1) * ANGULAR + k);
  for (let i = Math.max(1, i0 - 2); i <= Math.min(RADIAL - 1, i0 + 2); i++) {
    const a = v(i, j), b = v(i, j1), c = v(i + 1, j), d = v(i + 1, j1);
    for (const [v0, v1, v2] of [[a, c, b], [b, c, d]]) {
      const den = (v1[2] - v2[2]) * (v0[0] - v2[0]) + (v2[0] - v1[0]) * (v0[2] - v2[2]);
      const w0 = ((v1[2] - v2[2]) * (x - v2[0]) + (v2[0] - v1[0]) * (z - v2[2])) / den;
      const w1 = ((v2[2] - v0[2]) * (x - v2[0]) + (v0[0] - v2[0]) * (z - v2[2])) / den;
      if (w0 >= -1e-7 && w1 >= -1e-7 && 1 - w0 - w1 >= -1e-7) return w0 * v0[1] + w1 * v1[1] + (1 - w0 - w1) * v2[1];
    }
  }
  throw new Error(`No A1 triangle at ${x},${z}`);
}

test('defaults exactly match frozen A1 layout and full path arc length', () => {
  assert.deepEqual(DEFAULT_RIVER, L.river);
  near(model.length, 10 + Math.hypot(3, 8) + Math.hypot(2, 10));
  for (let i = 0; i < model.points.length; i++) {
    const p = samplePath(model, model.distances[i]);
    near(p.x, model.points[i][0]); near(p.z, model.points[i][1]);
  }
});

test('path rows include all corners and clamp partial endpoints', () => {
  for (const end of [0.01, 10, 12.7, model.length, model.length + 2]) {
    const rows = pathRows(model, end);
    near(rows.at(-1), Math.min(end, model.length));
    for (const d of model.distances) if (d <= end) assert.ok(rows.includes(d));
    for (let i = 1; i < rows.length; i++) assert.ok(rows[i] > rows[i - 1] && rows[i] - rows[i - 1] <= 0.300001);
  }
});

test('A2 profile agrees with A1 across floor, banks, caps and bends', () => {
  for (let x = -25; x <= -9; x += 0.23) for (let z = -10; z <= 24; z += 0.31) {
    near(distanceToRiver(model, x, z), distanceToPolylineXZ(x, z, L.river.centerline), 1e-12);
    near(trenchHeight(model, x, z), sampleRiverTrenchHeight(x, z, L.river.centerline, 3, -0.35, -0.15), 1e-12);
  }
});

test('all builders produce finite indexed buffers within a small geometry budget', () => {
  let triangles = 0;
  for (const build of [buildRiverLining, buildRiverWater, buildRiverBanks, buildRiverHighlights]) {
    const b = build(model, 1, 73);
    assert.ok(b.indices.length > 0);
    assert.equal(b.positions.length, b.colors.length);
    assert.equal(b.indices.length % 3, 0);
    assert.ok(b.positions.every(Number.isFinite) && b.colors.every((c) => Number.isFinite(c) && c >= 0 && c <= 1));
    assert.ok(b.indices.every((i) => i < b.positions.length / 3));
    triangles += b.indices.length / 3;
  }
  assert.ok(triangles < 6000, `${triangles} triangles`);
});

test('water and lining use upward, nondegenerate faces including caps', () => {
  for (const build of [buildRiverLining, buildRiverWater]) eachTriangle(build(model, 1, 120), (a, b, c) => {
    assert.ok((b[2] - a[2]) * (c[0] - a[0]) - (b[0] - a[0]) * (c[2] - a[2]) > 1e-10);
  });
});

test('final water stays below ground and strictly inside wet corridor at every bend/cap', () => {
  for (const frame of [0, 17, 149, 901]) {
    const water = buildRiverWater(model, 1, frame);
    for (let i = 0; i < water.positions.length / 3; i++) {
      const [x, y, z] = vertex(water, i);
      assert.ok(y < 0 && Math.abs(y - L.river.waterY) <= 0.006001);
      assert.ok(distanceToRiver(model, x, z) < 1.35, `bank clearance at ${x},${z}`);
      assert.ok(trenchHeight(model, x, z) < y - 0.035);
    }
  }
});

test('actual A1 triangulated terrain never pokes through final water', () => {
  for (const radius of [35, 37.5, 40]) {
    const terrain = buildTerrainBuffers(radius, L.river);
    for (const frame of [0, 71]) eachTriangle(buildRiverWater(model, 1, frame), (a, b, c) => {
      for (const weights of [[1, 0, 0], [0, 1, 0], [0, 0, 1], [1/3, 1/3, 1/3], [0.5, 0.5, 0], [0, 0.5, 0.5], [0.5, 0, 0.5]]) {
        const v = [0, 1, 2].map((axis) => a[axis] * weights[0] + b[axis] * weights[1] + c[axis] * weights[2]);
        assert.ok(topHeight(terrain, radius, v[0], v[2]) < v[1] - 0.008, `terrain intersects water at radius ${radius}, ${v}`);
      }
    });
  }
});

test('advancing water stays above the lined floor and inside the actual A1 trench', () => {
  const terrain = buildTerrainBuffers(37.5, L.river);
  for (const progress of [0.15, 0.27, 0.35, 0.53, 0.65, 0.82, 0.95]) {
    const water = buildRiverWater(model, progress, 43);
    eachTriangle(water, (a, b, c) => {
      const [x, y, z] = a.map((v, k) => (v + b[k] + c[k]) / 3);
      assert.ok(y > topHeight(terrain, 37.5, x, z) + 0.003);
      if (distanceToRiver(model, x, z) <= 0.8) assert.ok(y > model.bedY + 0.009, `wet tip below liner at ${progress}`);
    });
  }
});

test('dry lining covers actual A1 facets while keeping the center floor thin', () => {
  const failures = [];
  for (const radius of [35, 37.5, 40]) for (const progress of [0.35, 0.65, 1]) {
    const terrain = buildTerrainBuffers(radius, L.river);
    let minimumGap = Infinity;
    let worst;
    eachTriangle(buildRiverLining(model, progress), (a, b, c) => {
      for (const w of [[1,0,0], [0,1,0], [0,0,1], [1/3,1/3,1/3], [0.5,0.5,0], [0,0.5,0.5], [0.5,0,0.5]]) {
        const [x,y,z] = a.map((v,k) => v*w[0] + b[k]*w[1] + c[k]*w[2]);
        const gap = y - topHeight(terrain, radius, x, z);
        if (gap < minimumGap) { minimumGap = gap; worst = {x,y,z,d: distanceToRiver(model,x,z)}; }
      }
    });
    if (minimumGap <= 0) failures.push({radius, progress, minimumGap, worst});
  }
  assert.deepEqual(failures, [], 'A1 pierces dry lining');
  const lining = buildRiverLining(model, 1);
  const bottom = Math.min(...lining.positions.filter((_, i) => i % 3 === 1));
  near(bottom, model.bedY + 0.008);
});

test('river geometry clears old island/properties and fits A1 octagon, not a circular approximation', () => {
  let minimumRadius = Infinity;
  for (const build of [buildRiverLining, buildRiverWater, buildRiverBanks, buildRiverHighlights]) {
    const b = build(model, 1, 80);
    for (let i = 0; i < b.positions.length / 3; i++) {
      const [x, , z] = vertex(b, i), r = Math.hypot(x, z);
      minimumRadius = Math.min(minimumRadius, r);
      assert.ok(r > 11.7 + 0.5);
      for (const radius of [35, 37.5, 40]) assert.ok(r < octagonBoundaryRadius(Math.atan2(x, z), radius));
      for (const prop of [L.house, L.riceField, L.warteg]) assert.ok(Math.hypot(x - prop.position[0], z - prop.position[2]) > 7);
    }
  }
  assert.ok(minimumRadius > 12.2);
});

test('fill area increases monotonically and reaches both round ends without moving original path', () => {
  let last = 0;
  for (let i = 0; i <= 100; i++) {
    const area = areaXZ(buildRiverWater(model, i / 100, 0));
    assert.ok(area >= last - 1e-5, `${area} < ${last}`); last = area;
  }
  const half = 1.25;
  near(last, 2 * half * model.length + Math.PI * half ** 2, 0.1);
});

test('custom layout and levels propagate without mutating caller data', () => {
  const options = {centerline: Object.freeze([Object.freeze([4, 6]), Object.freeze([4, 6]), Object.freeze([8, 6]), Object.freeze([9, 10])]), width: 2, bedY: -0.6, waterY: -0.25};
  const custom = createRiverModel(options);
  assert.equal(custom.points.length, 3);
  const b = buildRiverWater(custom, 1, 0);
  for (let i = 0; i < b.positions.length / 3; i++) {
    const [x, y, z] = vertex(b, i);
    assert.ok(Math.abs(y + 0.25) <= 0.00601);
    assert.ok(distanceToRiver(custom, x, z) < 1);
  }
  assert.equal(options.centerline.length, 4);
});

test('invalid inputs disable safely and short/narrow valid rivers stay finite', () => {
  for (const options of [{centerline: []}, {centerline: [[1, 2]]}, {centerline: [[1, 2], [NaN, 4]]}, {width: 0}, {width: Infinity}, {bedY: 0}, {waterY: 0}, {waterY: -1}, {centerline: [[0, 0], [1, 0], [0, 0]]}]) assert.equal(createRiverModel(options), null);
  for (const width of [0.15, 1, 5]) {
    const custom = createRiverModel({centerline: [[0, 0], [0, 0.12]], width});
    for (const build of [buildRiverLining, buildRiverWater, buildRiverBanks, buildRiverHighlights]) {
      assert.ok(build(custom, 0.75, NaN).positions.every(Number.isFinite));
    }
  }
});
