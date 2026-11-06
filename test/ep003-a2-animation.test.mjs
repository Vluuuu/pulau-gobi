import test from 'node:test';
import assert from 'node:assert/strict';
import {createRiverModel, frameSeconds, localWater, riverFill, waterHeight} from '../src/episode003/world/river/riverMath.ts';
import {buildRiverBanks, buildRiverHighlights, buildRiverLining, buildRiverWater} from '../src/episode003/world/river/riverGeometry.ts';

const model = createRiverModel();
const builders = [buildRiverLining, buildRiverWater, buildRiverBanks, buildRiverHighlights];
const bytes = (b) => [b.positions, b.colors, b.indices].map((a) => Buffer.from(a.buffer));

test('progress zero/negative/NaN produce no visible triangles; >1 equals final', () => {
  for (const build of builders) {
    for (const p of [0, -1, NaN, -Infinity]) assert.equal(build(model, p, 10).indices.length, 0);
    assert.deepEqual(bytes(build(model, 3, 10)), bytes(build(model, 1, 10)));
    assert.deepEqual(bytes(build(model, Infinity, 10)), bytes(build(model, 1, 10)));
  }
});

test('arbitrary frame order / repeated frames produce byte-identical geometry', () => {
  for (const build of builders) {
    const original = bytes(build(model, 0.63, 107));
    for (const f of [400, 0, 106, 108, -12]) build(model, 0.21, f);
    assert.deepEqual(bytes(build(model, 0.63, 107)), original);
  }
});

test('all frames and reveal stages remain finite, deterministic and bounded', () => {
  for (let p = 0; p <= 20; p++) for (const frame of [-30, 0, 15, 123, 3000, NaN, Infinity]) {
    for (const build of builders) {
      const b = build(model, p / 20, frame);
      assert.ok(b.positions.every(Number.isFinite));
      assert.ok(b.indices.length < 18000);
      assert.deepEqual(bytes(b), bytes(build(model, p / 20, frame)));
    }
  }
});

test('bed leads water and fill reaches final depth even at the downstream endpoint', () => {
  for (let i = 0; i <= 100; i++) {
    const fill = riverFill(model, i / 100);
    assert.ok(fill.waterEnd <= fill.bedEnd + 1e-8);
  }
  for (const s of [0, 10, model.length]) {
    const wet = localWater(model, riverFill(model, 1), s);
    assert.ok(Math.abs(wet.level + 0.15) < 1e-10);
    assert.ok(Math.abs(wet.halfWidth - 1.25) < 1e-5);
  }
});

test('wave amplitude is subtle, shore pinned, and advances smoothly at 30 FPS', () => {
  assert.equal(frameSeconds(30), 1);
  assert.equal(frameSeconds(45), 1.5);
  const fill = riverFill(model, 1);
  let variation = 0;
  for (let f = 0; f < 240; f++) for (const s of [1, 9, 16, 24]) {
    const wet = localWater(model, fill, s);
    const a = waterHeight(model, fill, f, s, 0), next = waterHeight(model, fill, f + 1, s, 0);
    assert.ok(Math.abs(a - wet.level) <= 0.0060001);
    assert.ok(Math.abs(next - a) < 0.0005);
    assert.equal(waterHeight(model, fill, f, s, wet.halfWidth), wet.level);
    variation = Math.max(variation, Math.abs(next - a));
  }
  assert.ok(variation > 0.00005);
});

test('water and highlights animate after fill; banks and lining remain fixed', () => {
  for (const build of [buildRiverWater, buildRiverHighlights]) assert.notDeepEqual(bytes(build(model, 1, 0)), bytes(build(model, 1, 30)));
  for (const build of [buildRiverBanks, buildRiverLining]) assert.deepEqual(bytes(build(model, 1, 0)), bytes(build(model, 1, 300)));
});

test('highlights remain within water and never draw onto unrevealed banks', () => {
  for (const p of [0.1, 0.2, 0.4, 0.7, 1]) for (const f of [0, 60, 201, 511]) {
    const b = buildRiverHighlights(model, p, f);
    const minY = model.bedY, maxY = model.waterY + 0.02;
    for (let i = 0; i < b.positions.length / 3; i++) {
      const y = b.positions[i * 3 + 1];
      assert.ok(y > minY && y < maxY);
    }
  }
});

test('invalid frame values match frame zero', () => {
  for (const build of builders) for (const frame of [NaN, Infinity, -Infinity]) assert.deepEqual(bytes(build(model, 1, frame)), bytes(build(model, 1, 0)));
});
