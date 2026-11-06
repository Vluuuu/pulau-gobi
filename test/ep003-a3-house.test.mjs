import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {Box3, Euler, Matrix4, Quaternion, Vector3} from 'three';
import {HOUSE, HOUSE_TOP, HOUSE_COLORS, DEFAULT_HOUSE_PLACEMENT, ROOF_DIMENSIONS, ROOF_HOVER_RISE,
  UPPER_WALL_BASE, UPPER_WALL_HEIGHT, HOUSE_LOCAL_ANCHORS, buildOriginalHouseParts, buildOriginalRoofParts,
  buildUpperHouseParts, buildHouseEffects, housePose, resolveHousePlacement, localToWorld} from '../src/episode003/world/house/houseModel.ts';

const near = (a, b, e = 1e-8) => assert.ok(Math.abs(a - b) <= e, `${a} != ${b}`);
const base = buildOriginalHouseParts(), roof = buildOriginalRoofParts();
const byId = (parts, id) => { const part = parts.find((v) => v.id === id); assert.ok(part, id); return part; };
function bounds(part) {
  const matrix = new Matrix4().compose(new Vector3(...part.position), new Quaternion().setFromEuler(new Euler(...(part.rotation ?? [0,0,0]))), new Vector3(...part.size));
  return new Box3(new Vector3(-0.5,-0.5,-0.5), new Vector3(0.5,0.5,0.5)).applyMatrix4(matrix);
}

test('baseline dimensions, world placement and palette match approved source constants', () => {
  assert.deepEqual(DEFAULT_HOUSE_PLACEMENT, {position: [-5,0,-1], rotationY: Math.PI/4, scale:1.65});
  assert.equal(HOUSE.width, 3.2); assert.equal(HOUSE.depth, 2.6); assert.equal(HOUSE.wallHeight, 2.4);
  assert.equal(HOUSE.gableHeight, 1); assert.equal(HOUSE.foundationHeight, 0.2);
  const source = readFileSync(new URL('../src/episode002/GobiHouse.tsx', import.meta.url), 'utf8');
  for (const color of ['stone','wallA','wallB','post','roof','door','frame','glass','knob']) assert.ok(source.includes(`'${HOUSE_COLORS[color]}'`));
});

test('old foundation, doorstep, six wall courses, four posts and ONE door persist exactly', () => {
  assert.deepEqual(byId(base, 'original-foundation').size, [3.5,0.2,2.9]);
  assert.deepEqual(byId(base, 'original-doorstep').position, [0,0.07,1.75]);
  assert.equal(base.filter((p) => /^original-wall-/.test(p.id)).length, 6);
  assert.equal(base.filter((p) => /^original-post-/.test(p.id)).length, 4);
  assert.equal(base.filter((p) => p.id.endsWith('door-panel')).length, 1);
  assert.deepEqual(byId(base, 'original-door-panel').size, [1.15,2.1,0.07]);
  assert.deepEqual(byId(base, 'original-door-panel').position, [0,1.25,1.36]);
  for (const p of [0,0.2,0.5,0.85,1]) { housePose(p, 99); buildUpperHouseParts(p); assert.deepEqual(buildOriginalHouseParts(), base); }
});

test('roof has exactly TWO unchanged slabs, ONE ridge and the original attic window', () => {
  assert.equal(roof.filter((p) => p.id.startsWith('original-roof-slab-')).length, 2);
  assert.equal(roof.filter((p) => p.id === 'original-roof-ridge').length, 1);
  assert.equal(roof.filter((p) => p.id === 'original-attic-glass').length, 1);
  for (const p of [0,0.2,0.5,0.85,1]) {
    const extra = buildUpperHouseParts(p);
    assert.ok(!extra.some((v) => /roof|foundation|door-panel/.test(v.id)));
    assert.deepEqual(buildOriginalRoofParts(), roof);
  }
  near(ROOF_DIMENSIONS.slopeLength, Math.hypot(1.85, 1.15625));
});

test('progress zero is a complete old house; progress one adds one upper floor', () => {
  assert.equal(base.length, 23); assert.equal(roof.length, 7);
  assert.deepEqual(buildUpperHouseParts(0), []);
  assert.equal(housePose(0).roofRise, 0);
  assert.equal(housePose(1).roofRise, HOUSE.upperRise);
  assert.equal(buildUpperHouseParts(1).filter((p) => p.id.startsWith('upper-post-')).length, 4);
  assert.equal(buildUpperHouseParts(1).filter((p) => p.id.startsWith('upper-wall-')).length, 24);
  assert.equal(buildUpperHouseParts(1).filter((p) => p.id.startsWith('upper-window-') && p.id.endsWith('-glass')).length, 6);
});

test('roof lifts before construction, hovers above all new posts, and descends onto the new story', () => {
  assert.deepEqual(buildUpperHouseParts(0.25), []);
  assert.ok(housePose(0.2).roofRise > 2);
  near(housePose(0.27).roofRise, ROOF_HOVER_RISE);
  for (let i = 27; i <= 70; i++) {
    const p = i/100;
    near(housePose(p).roofRise, ROOF_HOVER_RISE);
    const upper = buildUpperHouseParts(p), maxY = Math.max(HOUSE_TOP, ...upper.map((part) => bounds(part).max.y));
    const eave = 2.44375 + housePose(p).roofRise;
    assert.ok(eave > maxY + 0.6, `roof/structure collision at ${p}`);
  }
  assert.ok(housePose(0.78).roofRise < ROOF_HOVER_RISE);
  assert.ok(housePose(0.85).roofRise > HOUSE.upperRise);
  near(housePose(0.88).roofRise, HOUSE.upperRise);
});

test('midpoint shows joists, a deck, posts and staged walls with a persistent lower house', () => {
  const halfway = buildUpperHouseParts(0.5);
  assert.equal(halfway.filter((p) => p.id.startsWith('upper-joist-')).length, 7);
  assert.equal(halfway.filter((p) => p.id.startsWith('upper-floorboard-')).length, 8);
  assert.ok(halfway.filter((p) => p.id.startsWith('upper-wall-')).length > 4);
  assert.ok(halfway.filter((p) => p.id.startsWith('upper-wall-')).length < 24);
  assert.ok(halfway.length < buildUpperHouseParts(1).length);
  assert.equal(byId(base, 'original-door-panel').position[2], 1.36);
});

test('upper structure is supported at the first-floor top, with a single floor seam', () => {
  const upper = buildUpperHouseParts(1);
  for (const part of upper.filter((p) => p.id.startsWith('upper-post-') || p.id.startsWith('upper-joist-'))) near(bounds(part).min.y, HOUSE_TOP);
  for (const part of upper.filter((p) => p.id.startsWith('upper-floorboard-'))) near(bounds(part).max.y, UPPER_WALL_BASE);
  near(UPPER_WALL_BASE + UPPER_WALL_HEIGHT, HOUSE_TOP + HOUSE.upperRise);
  assert.ok(!upper.some((p) => p.id.includes('door') || p.id.includes('foundation')));
});

test('second-floor glazing stays below header/roof and inside original roof overhang', () => {
  for (const part of buildUpperHouseParts(1).filter((p) => p.id.endsWith('-glass'))) {
    const b = bounds(part);
    assert.ok(b.min.y > UPPER_WALL_BASE);
    assert.ok(b.max.y < HOUSE_TOP + HOUSE.upperRise - 0.1);
    assert.ok(Math.max(Math.abs(b.min.x), Math.abs(b.max.x)) < HOUSE.width / 2 + HOUSE.overhang);
    assert.ok(Math.max(Math.abs(b.min.z), Math.abs(b.max.z)) < HOUSE.depth / 2 + HOUSE.overhang);
  }
});

test('door/front axis and default transforms retain EP002 location; custom props transform consistently', () => {
  const entrance = localToWorld(HOUSE_LOCAL_ANCHORS.entrance);
  assert.ok(entrance[0] > -5 && entrance[2] > -1);
  assert.deepEqual(localToWorld([0,0,0]), [-5,0,-1]);
  const custom = resolveHousePlacement({position: Object.freeze([12,2,-8]), rotationY: Math.PI/2, scale:2});
  assert.deepEqual(custom.position, [12,2,-8]);
  const front = localToWorld([0,1,3], custom);
  near(front[0],18); near(front[1],4); near(front[2],-8);
});

test('placement validation handles malformed numeric props without hiding the persistent house', () => {
  for (const input of [{position:[NaN,1,2]}, {position:[0,Infinity,0]}, {rotationY:NaN}, {rotationY:Infinity}, {scale:0}, {scale:-3}, {scale:NaN}, {scale:Infinity}]) assert.deepEqual(resolveHousePlacement(input), DEFAULT_HOUSE_PLACEMENT);
});

test('progress is clamped safely and invalid frames are equivalent to frame zero', () => {
  for (const p of [-1,-Infinity,NaN]) {
    assert.deepEqual(housePose(p,30), housePose(0,30));
    assert.deepEqual(buildUpperHouseParts(p), []);
  }
  for (const p of [2,Infinity]) assert.deepEqual(housePose(p,30), housePose(1,30));
  for (const frame of [NaN,Infinity,-Infinity]) for (const p of [0,0.2,0.5,0.95,1]) {
    assert.deepEqual(housePose(p,frame), housePose(p,0)); assert.deepEqual(buildHouseEffects(p,frame), buildHouseEffects(p,0));
  }
});

test('all states remain finite, IDs unique and part sizes positive across dense frame/progress seeks', () => {
  for (let i = 0; i <= 200; i++) {
    const p = i/200, pose = housePose(p,i*7);
    assert.ok([pose.roofRise,...pose.roofRotation,...pose.walls,pose.deck,pose.posts,pose.windows,pose.finish].every(Number.isFinite));
    const parts = [...base,...roof,...buildUpperHouseParts(p),...buildHouseEffects(p,i*7)];
    assert.equal(new Set(parts.map((v) => v.id)).size, parts.length);
    assert.ok(parts.length < 180);
    for (const part of parts) {
      assert.ok([...part.position,...part.size,...(part.rotation??[])].every(Number.isFinite), part.id);
      assert.ok(part.size.every((k) => k > 0), part.id);
    }
  }
});

test('roof movement is continuous at beat boundaries and final state is stable for every frame', () => {
  for (const edge of [0.1,0.27,0.7,0.88,1]) near(housePose(edge-1e-7,60).roofRise,housePose(edge+1e-7,60).roofRise, 1e-5);
  for (const frame of [-60,0,30,90,3000]) {
    assert.deepEqual(housePose(1,frame), housePose(1,0)); assert.deepEqual(buildHouseEffects(1,frame), []);
    assert.deepEqual(housePose(0,frame), housePose(0,0));
  }
});

test('out-of-order seeks reproduce pose, construction parts and seeded FX exactly', () => {
  const original = {pose:housePose(0.94,62), parts:buildUpperHouseParts(0.94), fx:buildHouseEffects(0.94,62)};
  for (const p of [1,0,0.5,-1,0.22]) { housePose(p,200); buildUpperHouseParts(p); buildHouseEffects(p,200); }
  assert.deepEqual({pose:housePose(0.94,62), parts:buildUpperHouseParts(0.94), fx:buildHouseEffects(0.94,62)}, original);
  assert.notDeepEqual(housePose(0.5,0).roofRotation,housePose(0.5,30).roofRotation);
});

test('source uses no real-time animation or unseeded randomness and leaves integrator files untouched', () => {
  for (const file of ['houseModel.ts','HousePartBatch.tsx','RenovatedHouseEP003.tsx']) {
    const source = readFileSync(new URL(`../src/episode003/world/house/${file}`, import.meta.url),'utf8');
    assert.doesNotMatch(source,/Math\.random\s*\(|Date\s*[.(]|performance\.|setTimeout\s*\(|setInterval\s*\(|useFrame\s*\(/);
    assert.doesNotMatch(source,/from\s+['"].*(episode002|terrain|river|world\/layout|remotion)['"]/);
  }
});

test('local ridge cap and crossing window bars avoid the baseline coplanar faces', () => {
  assert.ok(byId(roof,'original-roof-ridge').size[2] > byId(roof,'original-roof-slab-1').size[2]);
  assert.ok(byId(roof,'original-attic-mullion-h').position[2] > byId(roof,'original-attic-mullion-v').position[2]);
  for (const id of ['upper-window--1-1','upper-window-1-1']) {
    assert.ok(byId(buildUpperHouseParts(1),`${id}-mullion-h`).position[2] > byId(buildUpperHouseParts(1),`${id}-mullion-v`).position[2]);
  }
});
