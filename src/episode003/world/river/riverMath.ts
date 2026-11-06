/** A2 is independent of A1 at runtime. Defaults/profile mirror the shared trench contract. */
export type PointXZ = readonly [number, number];
export type RiverOptions = {
  centerline?: readonly PointXZ[];
  width?: number;
  bedY?: number;
  waterY?: number;
};

export const RIVER_FPS = 30;
export const DEFAULT_RIVER_CENTERLINE: readonly PointXZ[] = Object.freeze([
  Object.freeze([-22, -6] as const), Object.freeze([-16, 2] as const),
  Object.freeze([-13, 10] as const), Object.freeze([-15, 20] as const),
]);
export const DEFAULT_RIVER = Object.freeze({
  centerline: DEFAULT_RIVER_CENTERLINE, width: 3, bedY: -0.35, waterY: -0.15,
});

export type RiverModel = {
  points: readonly PointXZ[];
  distances: readonly number[];
  tangents: readonly PointXZ[];
  length: number;
  width: number;
  bedY: number;
  waterY: number;
};
export type PathSample = {x: number; z: number; tx: number; tz: number; nx: number; nz: number};

export const clamp01 = (v: number): number => !(v > 0) ? 0 : Math.min(1, v);
export const smooth01 = (v: number): number => { const t = clamp01(v); return t * t * (3 - 2 * t); };
export const frameSeconds = (frame: number): number => Number.isFinite(frame) ? frame / RIVER_FPS : 0;
export const wrap01 = (v: number): number => ((v % 1) + 1) % 1;

/** Invalid/empty layouts disable the component; coincident consecutive points are harmless. */
export function createRiverModel(options: RiverOptions = {}): RiverModel | null {
  const {centerline = DEFAULT_RIVER.centerline, width = 3, bedY = -0.35, waterY = -0.15} = options;
  if (![width, bedY, waterY].every(Number.isFinite) || width <= 0 || bedY >= waterY || waterY >= 0) return null;
  const points: PointXZ[] = [];
  for (const p of centerline) {
    if (!p || !Number.isFinite(p[0]) || !Number.isFinite(p[1])) return null;
    const last = points[points.length - 1];
    if (!last || Math.hypot(p[0] - last[0], p[1] - last[1]) > 1e-6) points.push([p[0], p[1]]);
  }
  if (points.length < 2) return null;
  const distances = [0];
  const tangents: PointXZ[] = [];
  for (let i = 1; i < points.length; i++) {
    const dx = points[i][0] - points[i - 1][0], dz = points[i][1] - points[i - 1][1];
    const length = Math.hypot(dx, dz);
    tangents.push([dx / length, dz / length]);
    distances.push(distances[i - 1] + length);
  }
  // A ribbon has no sensible bank at a near U-turn. Do not produce an unbounded miter.
  for (let i = 1; i < tangents.length; i++) {
    if (tangents[i][0] * tangents[i - 1][0] + tangents[i][1] * tangents[i - 1][1] < -0.8) return null;
  }
  return {points, distances, tangents, length: distances[distances.length - 1], width, bedY, waterY};
}

/** Arc length on the exact polyline, including a shared miter at every control point. */
export function samplePath(model: RiverModel, distance: number): PathSample {
  const s = Math.max(0, Math.min(model.length, Number.isFinite(distance) ? distance : 0));
  let i = 0;
  while (i < model.tangents.length - 1 && s > model.distances[i + 1] + 1e-8) i++;
  const [tx, tz] = model.tangents[i];
  const t = (s - model.distances[i]) / (model.distances[i + 1] - model.distances[i]);
  const normalAt = (point: number): PointXZ => {
    if (point === 0) return [-model.tangents[0][1], model.tangents[0][0]];
    if (point === model.points.length - 1) {
      const last = model.tangents[model.tangents.length - 1]; return [-last[1], last[0]];
    }
    const [ax, az] = model.tangents[point - 1], [bx, bz] = model.tangents[point];
    const denom = Math.max(0.1, 1 + ax * bx + az * bz);
    return [(-az - bz) / denom, (ax + bx) / denom];
  };
  // Interpolate along each offset rail. Abruptly switching back to a perpendicular
  // after a miter would fold the closely spaced cross sections over each other.
  const n0 = normalAt(i), n1 = normalAt(i + 1);
  const nx = n0[0] + (n1[0] - n0[0]) * t, nz = n0[1] + (n1[1] - n0[1]) * t;
  return {x: model.points[i][0] + (model.points[i + 1][0] - model.points[i][0]) * t,
    z: model.points[i][1] + (model.points[i + 1][1] - model.points[i][1]) * t, tx, tz, nx, nz};
}

export function distanceToRiver(model: RiverModel, x: number, z: number): number {
  let best = Infinity;
  for (let i = 0; i < model.tangents.length; i++) {
    const [ax, az] = model.points[i], [bx, bz] = model.points[i + 1];
    const dx = bx - ax, dz = bz - az;
    const t = clamp01(((x - ax) * dx + (z - az) * dz) / (dx * dx + dz * dz));
    best = Math.min(best, Math.hypot(x - ax - t * dx, z - az - t * dz));
  }
  return best;
}

/** Same analytic profile as A1 sampleRiverTrenchHeight, without a runtime A1 import. */
export function trenchHeight(model: RiverModel, x: number, z: number): number {
  const d = distanceToRiver(model, x, z), half = model.width / 2;
  const flat = Math.max(0, half - 0.5);
  if (d <= flat) return model.bedY;
  if (d <= half) return model.bedY + (model.waterY - model.bedY) * smooth01((d - flat) / (half - flat));
  return model.waterY * (1 - smooth01((d - half) / 0.65));
}

export type FillState = {progress: number; bedEnd: number; waterEnd: number; fill: number};
export function riverFill(model: RiverModel, progress: number): FillState {
  const p = clamp01(progress);
  const fill = smooth01((p - 0.08) / 0.92);
  return {progress: p, bedEnd: model.length * smooth01(p / 0.76),
    waterEnd: model.length * Math.min(1, fill * 1.16), fill};
}

/** Leading end arrives first, then fills in depth/width; never scales world coordinates. */
export function localWater(model: RiverModel, fill: FillState, distance: number): {level: number; halfWidth: number} {
  const settle = smooth01((fill.fill * 1.16 - Math.max(0, distance) / model.length) / 0.16);
  // The thin liner occupies the very bottom of the trench. Keep the advancing
  // wet tip above it, tapering its width to zero rather than intersecting the floor.
  const depthRatio = 0.12 + 0.88 * settle;
  const level = model.bedY + (model.waterY - model.bedY) * depthRatio;
  const half = model.width / 2, flat = Math.max(0, half - 0.5);
  // Inverse smoothstep locates the wet contour. Leave clearance for A1's finite triangulation.
  let lo = 0, hi = 1;
  for (let k = 0; k < 16; k++) { const mid = (lo + hi) / 2; if (smooth01(mid) < depthRatio) lo = mid; else hi = mid; }
  const shore = flat + (half - flat) * (lo + hi) / 2;
  return {level, halfWidth: settle <= 0 ? 0 : Math.max(0, shore - Math.min(0.25, half * 0.22)) * smooth01(settle / 0.18)};
}

export function waterHeight(model: RiverModel, fill: FillState, frame: number, s: number, lateral: number): number {
  const wet = localWater(model, fill, s), time = frameSeconds(frame);
  const edge = Math.max(0, 1 - (lateral / Math.max(1e-6, wet.halfWidth)) ** 2);
  const depth = clamp01((wet.level - model.bedY) / (model.waterY - model.bedY));
  return wet.level + Math.min(0.006, (model.waterY - model.bedY) * 0.03) * edge * depth *
    (Math.sin(s * 1.65 - time * 1.8) * 0.65 + Math.sin(s * 3.1 + lateral * 2.4 - time * 2.5) * 0.35);
}

/** Include every bend, even for very short partial reveals. */
export function pathRows(model: RiverModel, end: number, step = 0.3): number[] {
  const stop = Math.max(0, Math.min(model.length, end));
  if (stop <= 1e-6) return [];
  const values = new Set([0, stop]);
  for (let i = 1; i < Math.ceil(stop / step); i++) values.add(i * step);
  for (const s of model.distances) if (s > 0 && s < stop) values.add(s);
  return [...values].sort((a, b) => a - b).filter((s, i, a) => i === 0 || s - a[i - 1] > 1e-6);
}
