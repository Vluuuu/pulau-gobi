/**
 * EP003 terrain math (A1a). Fungsi murni & deterministik; tanpa React/three/Math.random.
 */

/** Batasi ke [0,1]. NaN dianggap 0. */
export function clamp01(value: number): number {
  if (!(value > 0)) return 0; // 0, negatif, NaN
  if (value > 1) return 1;
  return value;
}

/** smoothstep 0..1 (ternormalisasi) dari x pada rentang [a,b]. */
function smoothstepRange(a: number, b: number, x: number): number {
  if (b <= a) return x >= b ? 1 : 0;
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
}

/**
 * Radius pulau untuk progress ekspansi 0..1. Monoton naik (smoothstep),
 * persis initialRadius pada progress<=0 dan targetRadius pada progress>=1.
 */
export function radiusForExpansion(
  progress: number,
  initialRadius: number = 11.7,
  targetRadius: number = 37.5,
): number {
  const p = clamp01(progress);
  if (p <= 0) return initialRadius;
  if (p >= 1) return targetRadius;
  const s = p * p * (3 - 2 * p);
  return initialRadius + (targetRadius - initialRadius) * s;
}

/**
 * Jarak dari sumbu ke tepi segi-8 pada azimut `azimuth` (atan2(x, z)), konsisten dengan
 * polyRadius EP002: sisi datar berpusat di kelipatan 45 derajat, sudut (circumRadius)
 * di 22.5 + k*45 derajat.
 */
export function octagonBoundaryRadius(azimuth: number, circumRadius: number): number {
  const Q = Math.PI / 4;
  let off = ((azimuth % Q) + Q) % Q;
  off = Math.min(off, Q - off);
  return Math.max(0, (circumRadius * Math.cos(Math.PI / 8)) / Math.cos(off));
}

/** Jarak terdekat titik (x,z) ke polyline XZ. Polyline kosong => Infinity. */
export function distanceToPolylineXZ(
  x: number,
  z: number,
  centerline: readonly (readonly [number, number])[],
): number {
  const n = centerline.length;
  if (n === 0) return Infinity;
  if (n === 1) return Math.hypot(x - centerline[0][0], z - centerline[0][1]);
  let best = Infinity;
  for (let i = 0; i < n - 1; i++) {
    const ax = centerline[i][0];
    const az = centerline[i][1];
    const dx = centerline[i + 1][0] - ax;
    const dz = centerline[i + 1][1] - az;
    const len2 = dx * dx + dz * dz;
    let t = len2 > 0 ? ((x - ax) * dx + (z - az) * dz) / len2 : 0;
    t = t < 0 ? 0 : t > 1 ? 1 : t;
    const d = Math.hypot(x - (ax + t * dx), z - (az + t * dz));
    if (d < best) best = d;
  }
  return best;
}

/**
 * Tinggi permukaan rumput (Y) pada (x,z) dengan parit sungai.
 * d = jarak ke centerline, half = width/2:
 *  - d <= half-0.5 (=1.0)        : dasar datar = bedY
 *  - half-0.5 < d <= half (=1.5) : smoothstep bedY -> waterY
 *  - half < d < half+0.65 (=2.15): smoothstep waterY -> 0
 *  - d >= half+0.65              : 0
 * Kontinu dan monoton naik terhadap d.
 */
export function sampleRiverTrenchHeight(
  x: number,
  z: number,
  centerline: readonly (readonly [number, number])[],
  width: number,
  bedY: number,
  waterY: number,
): number {
  const d = distanceToPolylineXZ(x, z, centerline);
  if (!Number.isFinite(d)) return 0;
  const half = Math.max(0, width) / 2;
  const flatEnd = Math.max(0, half - 0.5);
  const bankEnd = half + 0.65;
  if (d >= bankEnd) return 0;
  if (d <= flatEnd) return bedY;
  if (d <= half) {
    return bedY + (waterY - bedY) * smoothstepRange(flatEnd, half, d);
  }
  return waterY + (0 - waterY) * smoothstepRange(half, bankEnd, d);
}
