/** Dimensions/materials of the finished EP002 GobiHouse; no runtime dependency on EP002/A1. */
export type Vec3 = readonly [number, number, number];
export const HOUSE = Object.freeze({width: 3.2, depth: 2.6, wallHeight: 2.4, gableHeight: 1,
  foundationHeight: 0.2, courses: 6, overhang: 0.25, roofThickness: 0.16, upperRise: 2.4});
export const HOUSE_COLORS = Object.freeze({stone: '#8b909c', wallA: '#e0a96d', wallB: '#d59b5c',
  post: '#a56a37', roof: '#b94a3a', door: '#7a4a2b', frame: '#5e3820', glass: '#bfe6ff',
  knob: '#ffd34d', dust: '#efe2cb', sparkle: '#ffe29a'});
export type HouseMaterial = keyof typeof HOUSE_COLORS;
export const DEFAULT_HOUSE_PLACEMENT = Object.freeze({position: Object.freeze([-5, 0, -1] as const), rotationY: Math.PI / 4, scale: 1.65});
export const HOUSE_TOP = HOUSE.foundationHeight + HOUSE.wallHeight;
export const UPPER_WALL_BASE = HOUSE_TOP + 0.18;
export const UPPER_WALL_HEIGHT = HOUSE.upperRise - 0.18;
export const ROOF_HOVER_RISE = HOUSE.upperRise + 1;
const ridgeY = HOUSE_TOP + HOUSE.gableHeight;
const eaveX = HOUSE.width / 2 + HOUSE.overhang;
const eaveY = HOUSE_TOP - HOUSE.overhang * HOUSE.gableHeight / (HOUSE.width / 2);
export const ROOF_DIMENSIONS = Object.freeze({
  slopeLength: Math.hypot(eaveX, ridgeY - eaveY),
  slopeAngle: Math.atan2(ridgeY - eaveY, eaveX),
  slabX: eaveX / 2 + Math.sin(Math.atan2(ridgeY - eaveY, eaveX)) * HOUSE.roofThickness / 2,
  slabY: (ridgeY + eaveY) / 2 + Math.cos(Math.atan2(ridgeY - eaveY, eaveX)) * HOUSE.roofThickness / 2,
  ridgeY,
});

export const clampProgress = (v: number): number => !(v > 0) ? 0 : Math.min(1, v);
export const phase = (p: number, a: number, b: number): number => clampProgress((p - a) / (b - a));
export const smooth = (v: number): number => { const t = clampProgress(v); return t * t * (3 - 2 * t); };
const outCubic = (v: number): number => 1 - (1 - clampProgress(v)) ** 3;
export const hash01 = (n: number): number => {
  let h = Math.imul(n + 101, 374761393); h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
};

export type HousePlacement = {position: Vec3; rotationY: number; scale: number};
export function resolveHousePlacement(input: {position?: Vec3; rotationY?: number; scale?: number} = {}): HousePlacement {
  const d = DEFAULT_HOUSE_PLACEMENT;
  return {position: input.position?.length === 3 && input.position.every(Number.isFinite) ? [...input.position] as [number, number, number] : d.position,
    rotationY: Number.isFinite(input.rotationY) ? input.rotationY! : d.rotationY,
    scale: Number.isFinite(input.scale) && input.scale! > 0 ? input.scale! : d.scale};
}
export function localToWorld(point: Vec3, placement: HousePlacement = DEFAULT_HOUSE_PLACEMENT): Vec3 {
  const c = Math.cos(placement.rotationY), s = Math.sin(placement.rotationY), k = placement.scale;
  return [placement.position[0] + k * (point[0] * c + point[2] * s),
    placement.position[1] + k * point[1], placement.position[2] + k * (-point[0] * s + point[2] * c)];
}

export type HousePart = {id: string; material: HouseMaterial; position: Vec3; size: Vec3;
  rotation?: Vec3; kind?: 'box' | 'sphere' | 'octahedron'};
const box = (id: string, material: HouseMaterial, position: Vec3, size: Vec3, rotation?: Vec3): HousePart => ({id, material, position, size, rotation});

/** The exact four-mesh EP002 window, with optional new-story sill and shutters. */
function windowParts(id: string, position: Vec3, rotationY: number, size: number, k = 1, ornate = false): HousePart[] {
  if (k <= 1e-5) return [];
  const c = Math.cos(rotationY), s = Math.sin(rotationY);
  const part = (suffix: string, material: HouseMaterial, x: number, y: number, z: number, dimensions: Vec3) =>
    box(`${id}-${suffix}`, material, [position[0] + k * (x * c + z * s), position[1] + k * y, position[2] + k * (-x * s + z * c)],
      dimensions.map((v) => v * k) as [number, number, number], [0, rotationY, 0]);
  const parts = [part('frame', 'frame', 0, 0, 0, [size + 0.18, size + 0.18, 0.08]),
    part('glass', 'glass', 0, 0, 0.03, [size, size, 0.07]),
    part('mullion-v', 'frame', 0, 0, 0.07, [0.07, size, 0.05]),
    part('mullion-h', 'frame', 0, 0, 0.075, [size, 0.07, 0.05])];
  if (ornate) {
    parts.push(part('sill', 'post', 0, -(size + 0.18) / 2 - 0.035, 0.045, [size + 0.32, 0.07, 0.2]));
    for (const side of [-1, 1]) {
      parts.push(part(`shutter-${side}`, 'post', side * (size / 2 + 0.17), 0, 0.015, [0.17, size + 0.05, 0.07]));
      for (const y of [-0.22, 0.22]) parts.push(part(`hinge-${side}-${y}`, 'frame', side * (size / 2 + 0.17), y, 0.06, [0.15, 0.035, 0.035]));
    }
  }
  return parts;
}

/** Persistent ground floor. Never fades/scales/disappears during the renovation. */
export function buildOriginalHouseParts(): HousePart[] {
  const {width: w, depth: d, foundationHeight: f, wallHeight: h, courses} = HOUSE;
  const parts: HousePart[] = [box('original-foundation', 'stone', [0, f / 2, 0], [w + 0.3, f, d + 0.3]),
    box('original-doorstep', 'stone', [0, 0.07, d / 2 + 0.45], [1.3, 0.14, 0.5])];
  for (let i = 0; i < courses; i++) parts.push(box(`original-wall-${i}`, i % 2 ? 'wallB' : 'wallA',
    [0, f + (i + 0.5) * h / courses, 0], [w, h / courses - 0.02, d]));
  for (const x of [-1, 1]) for (const z of [-1, 1]) parts.push(box(`original-post-${x}-${z}`, 'post',
    [x * w / 2, f + (h + 0.04) / 2, z * d / 2], [0.2, h + 0.04, 0.2]));
  parts.push(box('original-door-frame', 'frame', [0, f + 1.12, d / 2 + 0.025], [1.4, 2.24, 0.05]),
    box('original-door-panel', 'door', [0, f + 1.05, d / 2 + 0.06], [1.15, 2.1, 0.07]),
    {id: 'original-door-knob', material: 'knob', position: [0.37, f + 1, d / 2 + 0.14], size: [0.07, 0.07, 0.07], kind: 'sphere'});
  parts.push(...windowParts('original-side-right', [w / 2 + 0.02, f + 1.35, 0], Math.PI / 2, 0.75),
    ...windowParts('original-side-left', [-w / 2 - 0.02, f + 1.35, 0], -Math.PI / 2, 0.75));
  return parts;
}

/** The SAME two slabs, ridge and attic window throughout all progress values. */
export function buildOriginalRoofParts(): HousePart[] {
  const r = ROOF_DIMENSIONS;
  const parts: HousePart[] = [-1, 1].map((side) => box(`original-roof-slab-${side}`, 'roof',
    [side * r.slabX, r.slabY, 0], [r.slopeLength, HOUSE.roofThickness, HOUSE.depth + 2 * HOUSE.overhang], [0, 0, -side * r.slopeAngle]));
  // A 3 mm end-cap offset avoids coplanar ridge/slab faces in close-ups.
  parts.push(box('original-roof-ridge', 'post', [0, r.ridgeY + 0.1, 0], [0.24, 0.24, HOUSE.depth + 2 * HOUSE.overhang + 0.006], [0, 0, Math.PI / 4]),
    ...windowParts('original-attic', [0, HOUSE_TOP + 0.5, HOUSE.depth / 2 + 0.02], 0, 0.45));
  return parts;
}

export type HousePose = {progress: number; roofRise: number; roofRotation: Vec3; deck: number; posts: number;
  walls: readonly number[]; windows: number; finish: number};
export function housePose(progress: number, frame = 0): HousePose {
  const p = clampProgress(progress), time = (Number.isFinite(frame) ? frame : 0) / 30;
  const lift = smooth(phase(p, 0.1, 0.27)), descend = smooth(phase(p, 0.7, 0.88));
  const settle = phase(p, 0.88, 1);
  const settleY = p > 0.88 && p < 1 ? -0.024 * Math.sin(settle * Math.PI * 3) * Math.sin(Math.PI * settle) * (1 - settle) : 0;
  const swing = p > 0.1 && p < 0.88 ? Math.sin(Math.PI * phase(p, 0.1, 0.88)) : 0;
  return {progress: p, roofRise: ROOF_HOVER_RISE * lift + (HOUSE.upperRise - ROOF_HOVER_RISE) * descend + settleY,
    roofRotation: swing === 0 ? [0, 0, 0] : [Math.sin(time * 1.7) * 0.005 * swing, Math.sin(time * 1.2) * 0.008 * swing, Math.sin(time * 2.3) * 0.012 * swing],
    deck: outCubic(phase(p, 0.27, 0.4)), posts: outCubic(phase(p, 0.34, 0.47)),
    walls: Array.from({length: 6}, (_, i) => outCubic(phase(p, 0.42 + i * 0.032, 0.50 + i * 0.032))),
    windows: smooth(phase(p, 0.60, 0.72)), finish: smooth(phase(p, 0.64, 0.76))};
}

export function buildUpperHouseParts(progress: number): HousePart[] {
  const p = clampProgress(progress), pose = housePose(p), parts: HousePart[] = [];
  const {width: w, depth: d, upperRise} = HOUSE;
  // Joists assemble from left to right, anchored to the existing first-floor top.
  for (let i = 0; i < 7; i++) {
    const k = outCubic(phase(p, 0.27 + i * 0.008, 0.35 + i * 0.008));
    if (k > 1e-5) parts.push(box(`upper-joist-${i}`, 'frame', [-w / 2 + w * k / 2, HOUSE_TOP + 0.055, -d / 2 + i * d / 6], [w * k, 0.11, 0.13]));
  }
  for (let i = 0; i < 8; i++) {
    const k = outCubic(phase(p, 0.32 + i * 0.007, 0.40 + i * 0.007));
    if (k > 1e-5) parts.push(box(`upper-floorboard-${i}`, i % 2 ? 'wallB' : 'wallA', [-w / 2 + (i + 0.5) * w / 8, HOUSE_TOP + 0.145, -d / 2 + d * k / 2], [w / 8 - 0.012, 0.07, d * k]));
  }
  if (pose.posts > 1e-5) for (const x of [-1, 1]) for (const z of [-1, 1]) {
    parts.push(box(`upper-post-${x}-${z}`, 'post', [x * w / 2, HOUSE_TOP + (upperRise + 0.04) * pose.posts / 2, z * d / 2], [0.2, (upperRise + 0.04) * pose.posts, 0.2]));
  }
  // Hollow perimeter courses rather than solid blocks: the open construction phase has a real deck.
  pose.walls.forEach((k, i) => {
    if (k <= 1e-5) return;
    const layer = UPPER_WALL_HEIGHT / HOUSE.courses, y = UPPER_WALL_BASE + i * layer + (layer - 0.02) * k / 2;
    const color = i % 2 ? 'wallB' : 'wallA';
    for (const z of [-1, 1]) parts.push(box(`upper-wall-${i}-z${z}`, color, [0, y, z * (d / 2 - 0.07)], [w, (layer - 0.02) * k, 0.14]));
    for (const x of [-1, 1]) parts.push(box(`upper-wall-${i}-x${x}`, color, [x * (w / 2 - 0.07), y, 0], [0.14, (layer - 0.02) * k, d - 0.28]));
  });
  const trim = pose.finish;
  if (trim > 1e-5) {
    for (const z of [-1, 1]) {
      parts.push(box(`upper-rim-z${z}`, 'post', [0, HOUSE_TOP + 0.08, z * (d / 2 + 0.015)], [(w + 0.22) * trim, 0.16, 0.17]),
        box(`upper-header-z${z}`, 'post', [0, HOUSE_TOP + upperRise - 0.06, z * (d / 2 + 0.015)], [(w + 0.22) * trim, 0.14, 0.17]));
      for (const x of [-1, 1]) {
        parts.push(box(`upper-knee-${x}-${z}`, 'frame', [x * (w / 2 - 0.18), HOUSE_TOP + upperRise - 0.3, z * (d / 2 + 0.025)], [0.1, 0.55 * trim, 0.09], [0, 0, -x * Math.PI / 4]));
        parts.push({id: `upper-joint-pin-${x}-${z}`, material: 'knob', position: [x * (w / 2 - 0.055), HOUSE_TOP + upperRise - 0.11, z * (d / 2 + 0.11)], size: [0.028, 0.028, 0.014], kind: 'sphere'});
      }
    }
    for (const x of [-1, 1]) parts.push(box(`upper-rim-x${x}`, 'post', [x * (w / 2 + 0.015), HOUSE_TOP + 0.08, 0], [0.17, 0.16, (d + 0.22) * trim]),
      box(`upper-header-x${x}`, 'post', [x * (w / 2 + 0.015), HOUSE_TOP + upperRise - 0.06, 0], [0.17, 0.14, (d + 0.22) * trim]));
  }
  for (const z of [-1, 1]) for (const x of [-1, 1]) {
    const k = smooth(phase(p, 0.60 + (x > 0 ? 0.012 : 0), 0.71 + (x > 0 ? 0.012 : 0)));
    parts.push(...windowParts(`upper-window-${x}-${z}`, [x * 0.79, HOUSE_TOP + 1.23, z * (d / 2 + 0.02)], z > 0 ? 0 : Math.PI, 0.68, k, true));
  }
  for (const x of [-1, 1]) parts.push(...windowParts(`upper-window-side-${x}`, [x * (w / 2 + 0.02), HOUSE_TOP + 1.23, 0], x * Math.PI / 2, 0.75, pose.windows, true));
  return parts;
}

export function buildHouseEffects(progress: number, frame = 0): HousePart[] {
  const p = clampProgress(progress), time = (Number.isFinite(frame) ? frame : 0) / 30, parts: HousePart[] = [];
  for (const [start, end, y] of [[0.11, 0.28, HOUSE_TOP], [0.86, 0.99, HOUSE_TOP + HOUSE.upperRise]]) {
    const u = phase(p, start, end);
    if (u <= 0 || u >= 1) continue;
    for (let i = 0; i < 8; i++) {
      const a = i / 8 * 2 * Math.PI + hash01(i) * 0.3;
      const radius = 1.65 + u * 0.45, k = Math.sin(Math.PI * u) * (0.06 + hash01(i + 12) * 0.05);
      parts.push({id: `dust-${start}-${i}`, material: 'dust', position: [Math.cos(a) * radius, y + u * 0.22, Math.sin(a) * radius * 0.8],
        size: [k, k * 0.65, k], kind: 'sphere'});
    }
  }
  const u = phase(p, 0.9, 1);
  if (u > 0 && u < 1) for (let i = 0; i < 5; i++) {
    const a = (i + 0.4) / 5 * Math.PI * 2, k = Math.sin(Math.PI * u) * (0.055 + 0.025 * Math.sin(time * 3 + i));
    parts.push({id: `reveal-sparkle-${i}`, material: 'sparkle', position: [Math.cos(a) * 2, HOUSE_TOP + HOUSE.upperRise + 0.4 + u * 0.6, Math.sin(a) * 1.8],
      size: [k, k * 1.6, k], rotation: [0, time * 0.5 + i, 0], kind: 'octahedron'});
  }
  return parts;
}

export const HOUSE_LOCAL_ANCHORS = Object.freeze({entrance: [0, 0, 2.35] as Vec3,
  doorway: [0, 1.25, HOUSE.depth / 2 + 0.14] as Vec3, originalFocus: [0, 1.8, 0] as Vec3,
  renovationFocus: [0, 3.65, 0] as Vec3, finalFocus: [0, 3, 0] as Vec3,
  upperWindowFocus: [0, HOUSE_TOP + 1.23, HOUSE.depth / 2 + 0.1] as Vec3});
