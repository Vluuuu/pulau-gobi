import {
  clamp01, distanceToRiver, frameSeconds, localWater, pathRows, riverFill, samplePath,
  smooth01, trenchHeight, waterHeight, wrap01,
} from './riverMath.ts';
import type {FillState, RiverModel} from './riverMath.ts';

export type RiverBuffers = {positions: Float32Array; colors: Float32Array; indices: Uint32Array};
type RGB = readonly [number, number, number];
// Linear RGB, so Three's vertex colors agree with sRGB material colors.
const rgb = (hex: number): RGB => [16, 8, 0].map((shift) => {
  const c = ((hex >> shift) & 255) / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}) as unknown as RGB;
const DEEP = rgb(0x238f9c), SHALLOW = rgb(0x62cbb7), GLINT = rgb(0xc8f5e6);
const BED = rgb(0x797762), SAND = rgb(0xbbad7e), DRY = rgb(0xc6b58b);
const PEBBLE = [rgb(0x8d9990), rgb(0xb9b6a0), rgb(0x738c83)];
const REED = rgb(0x4b8653), REED_TIP = rgb(0x86ae60);
const mix = (a: RGB, b: RGB, t: number): RGB => [a[0] + (b[0] - a[0]) * t,
  a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];

class Builder {
  p: number[] = []; c: number[] = []; i: number[] = [];
  vertex(x: number, y: number, z: number, color: RGB): number {
    const n = this.p.length / 3; this.p.push(x, y, z); this.c.push(...color); return n;
  }
  triangle(a: number, b: number, c: number): void {
    // All water/lining faces are front-facing from above, including both round end caps.
    const ax = this.p[b * 3] - this.p[a * 3], az = this.p[b * 3 + 2] - this.p[a * 3 + 2];
    const bx = this.p[c * 3] - this.p[a * 3], bz = this.p[c * 3 + 2] - this.p[a * 3 + 2];
    const y = az * bx - ax * bz;
    if (Math.abs(y) > 1e-10) this.i.push(...(y > 0 ? [a, b, c] : [a, c, b]));
  }
  finish(): RiverBuffers { return {positions: new Float32Array(this.p), colors: new Float32Array(this.c), indices: new Uint32Array(this.i)}; }
}

const bankHalf = (model: RiverModel): number => model.width / 2 + 0.61;
const liningHeight = (model: RiverModel, x: number, z: number): number => {
  const h = trenchHeight(model, x, z);
  // An 8 mm floor liner preserves bed depth. More overlap at the dry shore masks
  // A1's coarse terrain facets without raising the bottom of the channel.
  const depth = model.waterY - model.bedY;
  const flat = Math.max(0, model.width / 2 - 0.5);
  const shore = smooth01(distanceToRiver(model, x, z) / Math.max(0.1, flat * 0.9));
  return h + Math.min(0.008, depth * 0.04) + shore * Math.min(0.06, depth * 0.3);
};
const liningColor = (model: RiverModel, x: number, z: number): RGB => {
  const d = distanceToRiver(model, x, z), half = model.width / 2;
  return d < half ? mix(BED, SAND, smooth01(d / half)) : mix(SAND, DRY, smooth01((d - half) / 0.65));
};

/** Shared cross sections prevent cracks at A1's polyline bends. Caps stay in its round trench ends. */
function buildSurface(model: RiverModel, end: number, water: boolean, fill: FillState, frame: number): RiverBuffers {
  const b = new Builder(), rows = pathRows(model, end);
  if (rows.length === 0) return b.finish();
  const fractions = [-1, -0.83, -0.66, -0.42, 0, 0.42, 0.66, 0.83, 1];
  const vertex = (x: number, z: number, s: number, lateral: number, half: number): number => {
    const y = water ? waterHeight(model, fill, frame, s, lateral) : liningHeight(model, x, z);
    const c = water ? mix(DEEP, SHALLOW, (Math.abs(lateral) / Math.max(half, 1e-6)) ** 2 * 0.67) : liningColor(model, x, z);
    return b.vertex(x, y, z, c);
  };
  const grid = rows.map((s) => {
    const p = samplePath(model, s), half = water ? localWater(model, fill, s).halfWidth : bankHalf(model);
    return fractions.map((f) => vertex(p.x + p.nx * half * f, p.z + p.nz * half * f, s, half * f, half));
  });
  for (let i = 1; i < grid.length; i++) for (let j = 1; j < fractions.length; j++) {
    b.triangle(grid[i - 1][j - 1], grid[i][j - 1], grid[i - 1][j]);
    b.triangle(grid[i - 1][j], grid[i][j - 1], grid[i][j]);
  }
  for (const [rowIndex, sign] of [[0, -1], [rows.length - 1, 1]]) {
    const s = rows[rowIndex], p = samplePath(model, s);
    // A cap uses the actual end tangent, rather than a bend's miter normal.
    const tx = sign < 0 ? model.tangents[0][0] : p.tx;
    const tz = sign < 0 ? model.tangents[0][1] : p.tz;
    const half = water ? localWater(model, fill, s).halfWidth : bankHalf(model);
    if (half < 1e-6) continue;
    const rings: number[][] = [];
    for (const fraction of [0, 0.42, 0.66, 0.83, 1]) {
      const radius = half * fraction;
      const ring: number[] = [];
      for (let k = 0; k <= 16; k++) {
        const a = -Math.PI / 2 + Math.PI * k / 16;
        const lateral = radius * Math.sin(a), along = radius * Math.cos(a) * sign;
        ring.push(vertex(p.x + tx * along + p.nx * lateral, p.z + tz * along + p.nz * lateral, s, lateral, half));
      }
      rings.push(ring);
    }
    for (let r = 1; r < rings.length; r++) for (let k = 1; k < rings[r].length; k++) {
      b.triangle(rings[r - 1][k - 1], rings[r][k - 1], rings[r][k]);
      b.triangle(rings[r - 1][k - 1], rings[r][k], rings[r - 1][k]);
    }
  }
  return b.finish();
}

export const buildRiverLining = (model: RiverModel, progress: number): RiverBuffers => {
  const fill = riverFill(model, progress);
  return buildSurface(model, fill.bedEnd, false, fill, 0);
};
export const buildRiverWater = (model: RiverModel, progress: number, frame: number): RiverBuffers => {
  const fill = riverFill(model, progress);
  return buildSurface(model, fill.waterEnd, true, fill, frame);
};

/** Combined tapered streamlets and expanding arcs: one mesh, no textures or transparency sorting. */
export function buildRiverHighlights(model: RiverModel, progress: number, frame: number): RiverBuffers {
  const b = new Builder(), fill = riverFill(model, progress), time = frameSeconds(frame);
  if (fill.waterEnd < 0.1) return b.finish();
  const point = (s: number, lateral: number, strength: number): number => {
    const p = samplePath(model, s);
    const wet = localWater(model, fill, s);
    return b.vertex(p.x + p.nx * lateral, waterHeight(model, fill, frame, s, lateral) + 0.012,
      p.z + p.nz * lateral, mix(mix(DEEP, SHALLOW, (lateral / Math.max(wet.halfWidth, 1e-6)) ** 2 * 0.67), GLINT, strength));
  };
  const stroke = (samples: {s: number; l: number}[], thickness: number, strength: number) => {
    let previous: number[] | undefined;
    for (let i = 0; i < samples.length; i++) {
      const {s, l} = samples[i], width = thickness * Math.sin(Math.PI * i / (samples.length - 1));
      const wet = localWater(model, fill, s);
      if (s <= 0.1 || s >= fill.waterEnd - 0.1 || Math.abs(l) + width > wet.halfWidth * 0.9 || wet.level < model.bedY + 0.04) return;
    }
    for (let i = 0; i < samples.length; i++) {
      const {s, l} = samples[i], width = thickness * Math.sin(Math.PI * i / (samples.length - 1));
      const row = [point(s, l - width, strength), point(s, l + width, strength)];
      if (previous) { b.triangle(previous[0], row[0], previous[1]); b.triangle(previous[1], row[0], row[1]); }
      previous = row;
    }
  };
  for (let i = 0; i < 26; i++) {
    const phase = wrap01(i * 0.61803398875 + time * 0.7 / model.length);
    const s = phase * model.length;
    const l = Math.sin(i * 2.39996) * Math.min(model.width * 0.23, 0.7);
    const fade = smooth01(phase / 0.06) * smooth01((1 - phase) / 0.06);
    stroke(Array.from({length: 8}, (_, k) => ({s: s + (k / 7 - 0.5) * (0.48 + (i % 3) * 0.17),
      l: l + Math.sin(k / 7 * Math.PI) * 0.035})), 0.017 * fade, 0.22 * fade);
  }
  for (let i = 0; i < 7; i++) {
    const phase = wrap01(time / 3.4 + i * 0.371), radius = 0.09 + phase * 0.34;
    const s = model.length * (0.09 + i * 0.13), lateral = (i % 2 ? -1 : 1) * Math.min(model.width * 0.16, 0.48);
    const fade = Math.sin(Math.PI * phase) ** 2;
    for (const side of [-1, 1]) stroke(Array.from({length: 13}, (_, k) => {
      const a = -1.1 + k / 12 * 2.2;
      return {s: s + Math.cos(a) * radius * side, l: lateral + Math.sin(a) * radius * 0.64};
    }), 0.012 * fade, 0.28 * fade);
  }
  return b.finish();
}

/** Sparse close-up pebbles and reed tufts, baked into one mesh, fixed integer-seeded placements. */
export function buildRiverBanks(model: RiverModel, progress: number): RiverBuffers {
  const b = new Builder(), fill = riverFill(model, progress), half = model.width / 2;
  const seed = (n: number): number => ((Math.imul(n + 17, 1597334677) ^ Math.imul(n + 31, 3812015801)) >>> 0) / 4294967296;
  for (let i = 0; i < 42; i++) {
    const s = model.length * (0.035 + seed(i * 11) * 0.93), p = samplePath(model, s);
    const growth = smooth01((fill.bedEnd - s) / 0.9);
    if (growth <= 0) continue;
    const side = i % 2 ? -1 : 1, lateral = side * (half + 0.26 + seed(i * 11 + 1) * 0.24);
    const x = p.x + p.nx * lateral, z = p.z + p.nz * lateral;
    const y = liningHeight(model, x, z) - 0.012;
    if (i % 3 !== 0) {
      const size = (0.07 + seed(i * 11 + 2) * 0.085) * growth;
      const center = b.vertex(x, y + size * 0.65, z, PEBBLE[i % 3]);
      const ring: number[] = [];
      for (let k = 0; k < 6; k++) {
        const a = k * Math.PI / 3 + seed(i) * 6;
        ring.push(b.vertex(x + Math.cos(a) * size, y, z + Math.sin(a) * size * 0.75, PEBBLE[i % 3]));
      }
      for (let k = 0; k < 6; k++) b.triangle(center, ring[k], ring[(k + 1) % 6]);
    } else {
      for (let k = 0; k < 4; k++) {
        const a = k * 2.4 + seed(i) * 6, h = (0.25 + seed(i + k + 8) * 0.26) * growth;
        const dx = Math.cos(a), dz = Math.sin(a), w = 0.025 * growth;
        const v0 = b.vertex(x - dx * w, y, z - dz * w, REED);
        const v1 = b.vertex(x + dx * w, y, z + dz * w, REED);
        const v2 = b.vertex(x + dz * h * 0.25, y + h, z - dx * h * 0.25, REED_TIP);
        // Reeds are upright: retain vertical triangles (the surface builder omits them).
        b.i.push(v0, v1, v2);
      }
    }
  }
  return b.finish();
}
