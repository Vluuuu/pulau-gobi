/**
 * EP003 A1b: builder geometri pulau (MURNI: tanpa React/three, deterministik, tanpa bilangan acak runtime).
 * Dipisah dari komponen supaya bisa diuji dengan node. Semua matematika radius/parit/oktagon
 * berasal dari terrainMath.ts (A1a); file ini hanya menyusun vertex.
 */
import {octagonBoundaryRadius, radiusForExpansion, sampleRiverTrenchHeight} from '../terrainMath.ts';
import {ROCKS, rockPlacement} from '../../../../episode002/islandRocks.ts';

export type RiverSpec = {
  centerline: readonly (readonly [number, number])[];
  width: number;
  bedY: number;
  waterY: number;
};

export type TerrainBuffers = {
  positions: Float32Array;
  colors: Float32Array;
  indices: Uint32Array;
  /** jumlah vertex permukaan atas (indeks 0..topVertexCount-1 = top rumput) */
  topVertexCount: number;
  /** radius circum oktagon yang dipakai (unit dunia) */
  radius: number;
};

export const RADIAL = 80; // cincin radial pada top
export const ANGULAR = 288; // kelipatan 8 => sudut oktagon (22.5 + k*45 deg) tepat jatuh pada sampel
const BODY_AZ = 16; // jumlah jangkar jitter tebing/batu dasar (sudut + tengah sisi oktagon)
const BODY_RINGS = 5; // cincin tambahan sepanjang kerucut batu

export const GRASS_BAND = 0.3; // tebal sisi rumput (sama dengan EP002)
export const SOIL_BOTTOM_Y = -1.1; // dasar tanah = puncak kerucut (sama dengan EP002)
export const SOIL_TAPER = 2.5 / 3; // radius bawah tanah / radius atas (sama dengan EP002)
export const CONE_R_RATIO = 2.5 / 3;
const CONE_H = 2.7; // tinggi kerucut EP002 pada s=1

const C_GRASS = [0x7e / 255, 0xd9 / 255, 0x57 / 255] as const; // #7ed957
const C_GRASS_WET = [0x5f / 255, 0xb0 / 255, 0x4a / 255] as const; // sedikit lebih gelap di parit
const C_SOIL = [0x9a / 255, 0x6b / 255, 0x43 / 255] as const; // #9a6b43
const C_ROCK = [0x7a / 255, 0x7f / 255, 0x8c / 255] as const; // #7a7f8c
const C_ROCK_DARK = [0x6a / 255, 0x6f / 255, 0x7c / 255] as const;

/** hash deterministik 0..1 dari dua integer */
export function hash2(a: number, b: number): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

/** Radius circum yang terlihat. `targetRadius` = radius akhir (default layout). */
export function resolveRadius(progress: number, initialRadius: number, targetRadius: number): number {
  const target = Number.isFinite(targetRadius) ? Math.max(initialRadius, targetRadius) : initialRadius;
  return radiusForExpansion(progress, initialRadius, target);
}

/** Skala radius relatif terhadap silinder EP002 (circumR 3). */
export const scaleOf = (radius: number): number => radius / 3;
/** Regangan tinggi kerucut batu (rumus EP002: 1 + (s-1)*0.45). */
export const heightStretch = (radius: number): number => 1 + (scaleOf(radius) - 1) * 0.45;
export const coneHeight = (radius: number): number => CONE_H * heightStretch(radius);

export function buildTerrainBuffers(radius: number, river: RiverSpec): TerrainBuffers {
  const R = radius;
  const N = RADIAL;
  const A = ANGULAR;
  const twoPi = Math.PI * 2;

  const pos: number[] = [];
  const col: number[] = [];
  const idx: number[] = [];
  const pushV = (x: number, y: number, z: number, c: readonly number[]): number => {
    pos.push(x, y, z);
    col.push(c[0], c[1], c[2]);
    return pos.length / 3 - 1;
  };
  const height = (x: number, z: number): number =>
    sampleRiverTrenchHeight(x, z, river.centerline, river.width, river.bedY, river.waterY);
  const grassAt = (y: number): readonly number[] => {
    // tint lembap proporsional kedalaman parit (0 di y=0, 1 di dasar)
    const k = river.bedY < 0 ? Math.min(1, Math.max(0, y / river.bedY)) * 0.5 : 0;
    return [
      C_GRASS[0] + (C_GRASS_WET[0] - C_GRASS[0]) * k,
      C_GRASS[1] + (C_GRASS_WET[1] - C_GRASS[1]) * k,
      C_GRASS[2] + (C_GRASS_WET[2] - C_GRASS[2]) * k,
    ];
  };

  // ---- TOP: pusat + N cincin x A sudut. Sudut j -> azimut j*2pi/A (azimut = atan2(x,z)) ----
  const sinA: number[] = [];
  const cosA: number[] = [];
  const edgeR: number[] = [];
  for (let j = 0; j < A; j++) {
    const az = (j * twoPi) / A;
    sinA.push(Math.sin(az));
    cosA.push(Math.cos(az));
    edgeR.push(octagonBoundaryRadius(az, R));
  }
  const center = pushV(0, height(0, 0), 0, grassAt(height(0, 0)));
  const ringStart: number[] = [];
  const edgeY: number[] = [];
  for (let i = 1; i <= N; i++) {
    ringStart.push(pos.length / 3);
    const t = i / N;
    for (let j = 0; j < A; j++) {
      const r = edgeR[j] * t;
      const x = sinA[j] * r;
      const z = cosA[j] * r;
      const y = height(x, z);
      pushV(x, y, z, grassAt(y));
      if (i === N) edgeY.push(y);
    }
  }
  const topVertexCount = pos.length / 3;
  // kipas pusat
  for (let j = 0; j < A; j++) {
    idx.push(center, ringStart[0] + j, ringStart[0] + ((j + 1) % A));
  }
  for (let i = 0; i < N - 1; i++) {
    for (let j = 0; j < A; j++) {
      const j1 = (j + 1) % A;
      const a = ringStart[i] + j;
      const b = ringStart[i] + j1;
      const c = ringStart[i + 1] + j;
      const d = ringStart[i + 1] + j1;
      idx.push(a, c, b, b, c, d);
    }
  }

  // ---- SISI RUMPUT: dari tepi top (y mengikuti top) turun GRASS_BAND ----
  // Bawah band = y tepi - GRASS_BAND, sehingga tepi tidak pernah terputus walau parit memotong tepi.
  const bandTop: number[] = [];
  const bandBot: number[] = [];
  for (let j = 0; j < A; j++) {
    const x = sinA[j] * edgeR[j];
    const z = cosA[j] * edgeR[j];
    bandTop.push(pushV(x, edgeY[j], z, grassAt(edgeY[j])));
  }
  for (let j = 0; j < A; j++) {
    const x = sinA[j] * edgeR[j];
    const z = cosA[j] * edgeR[j];
    bandBot.push(pushV(x, edgeY[j] - GRASS_BAND, z, C_GRASS));
  }
  for (let j = 0; j < A; j++) {
    const j1 = (j + 1) % A;
    idx.push(bandTop[j], bandBot[j], bandTop[j1], bandTop[j1], bandBot[j], bandBot[j1]);
  }

  // ---- TANAH: dari bawah band turun ke SOIL_BOTTOM_Y, radius menyempit ke SOIL_TAPER ----
  const soilTop: number[] = [];
  const soilBot: number[] = [];
  for (let j = 0; j < A; j++) {
    const x = sinA[j] * edgeR[j];
    const z = cosA[j] * edgeR[j];
    soilTop.push(pushV(x, edgeY[j] - GRASS_BAND, z, C_SOIL));
  }
  for (let j = 0; j < A; j++) {
    const r = edgeR[j] * SOIL_TAPER;
    soilBot.push(pushV(sinA[j] * r, SOIL_BOTTOM_Y, cosA[j] * r, C_SOIL));
  }
  for (let j = 0; j < A; j++) {
    const j1 = (j + 1) % A;
    idx.push(soilTop[j], soilBot[j], soilTop[j1], soilTop[j1], soilBot[j], soilBot[j1]);
  }

  // ---- BATU DASAR: kerucut oktagon bergerigi menuju ujung, memakai SAMA 288 sampel sudut ----
  // (tanpa T-junction => permukaan tertutup). Jitter di-interpolasi dari BODY_AZ jangkar dan hanya
  // ke DALAM (radius x 0.93..1) supaya batu tempel (islandRocks) tetap menyatu dengan kontur.
  const coneH = coneHeight(R);
  const anchor = (k: number, j: number): number => {
    const u = (j * BODY_AZ) / A;
    const m0 = Math.floor(u) % BODY_AZ;
    const m1 = (m0 + 1) % BODY_AZ;
    const f = u - Math.floor(u);
    const h0 = hash2(k * 31 + 7, m0 * 17 + 3);
    const h1 = hash2(k * 31 + 7, m1 * 17 + 3);
    return h0 + (h1 - h0) * f;
  };
  const rings: number[][] = [];
  for (let k = 0; k <= BODY_RINGS; k++) {
    const t = k / (BODY_RINGS + 1); // 0 = puncak kerucut, <1 sebelum ujung
    const row: number[] = [];
    for (let j = 0; j < A; j++) {
      const color = k % 2 ? C_ROCK_DARK : C_ROCK;
      if (k === 0) {
        const r0 = edgeR[j] * SOIL_TAPER; // identik dengan soilBot => sambungan tanpa celah
        row.push(pushV(sinA[j] * r0, SOIL_BOTTOM_Y, cosA[j] * r0, color));
        continue;
      }
      const rr = edgeR[j] * CONE_R_RATIO * (1 - t) * (1 - 0.07 * anchor(k, j));
      const dy = -0.04 * coneH * anchor(k + 11, j);
      row.push(pushV(sinA[j] * rr, SOIL_BOTTOM_Y - t * coneH + dy, cosA[j] * rr, color));
    }
    rings.push(row);
  }
  const tip = pushV(0, SOIL_BOTTOM_Y - coneH, 0, C_ROCK_DARK);
  for (let k = 0; k < BODY_RINGS; k++) {
    for (let j = 0; j < A; j++) {
      const j1 = (j + 1) % A;
      idx.push(rings[k][j], rings[k + 1][j], rings[k][j1], rings[k][j1], rings[k + 1][j], rings[k + 1][j1]);
    }
  }
  for (let j = 0; j < A; j++) {
    idx.push(rings[BODY_RINGS][j], tip, rings[BODY_RINGS][(j + 1) % A]);
  }

  return {
    positions: new Float32Array(pos),
    colors: new Float32Array(col),
    indices: new Uint32Array(idx),
    topVertexCount,
    radius: R,
  };
}

// ------------------------------------------------------------------ batu menempel
export type RockInstance = {
  kind: 'chunk' | 'spike';
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
};

/** Batu EP002 (selalu ada: progress 0 = pulau EP002 final) + batu tambahan yang tumbuh saat ekspansi. */
type ExtraRock = {az: number; t: number; size: number; kind: 'chunk' | 'spike'; sy: number; color: string; spin: [number, number, number]; a: number; b: number};
export const EXTRA_ROCKS: ExtraRock[] = [
  {az: 0.9, t: 0.12, size: 0.5, kind: 'chunk', sy: 0.85, color: '#8b909c', spin: [0.5, 1.3, 0.4], a: 0.15, b: 0.45},
  {az: -1.3, t: 0.22, size: 0.55, kind: 'chunk', sy: 0.8, color: '#7a7f8c', spin: [1.1, 0.7, 0.2], a: 0.2, b: 0.5},
  {az: 2.9, t: 0.18, size: 0.5, kind: 'chunk', sy: 0.9, color: '#6f7480', spin: [0.3, 2.2, 0.8], a: 0.25, b: 0.55},
  {az: -2.6, t: 0.3, size: 0.45, kind: 'chunk', sy: 1, color: '#8b909c', spin: [0.9, 0.4, 1.2], a: 0.3, b: 0.6},
  {az: 1.6, t: 0.35, size: 0.4, kind: 'chunk', sy: 0.9, color: '#7a7f8c', spin: [0.2, 1.9, 0.5], a: 0.4, b: 0.7},
  {az: -0.2, t: 0.28, size: 0.5, kind: 'chunk', sy: 0.85, color: '#6f7480', spin: [1.3, 0.8, 0.6], a: 0.45, b: 0.75},
  {az: 0.7, t: 0.55, size: 0.28, kind: 'spike', sy: 2.1, color: '#7a7f8c', spin: [0, 0.5, 0], a: 0.5, b: 0.8},
  {az: -1.9, t: 0.5, size: 0.3, kind: 'spike', sy: 2.0, color: '#6f7480', spin: [0, 1.7, 0], a: 0.55, b: 0.85},
  {az: 2.5, t: 0.6, size: 0.27, kind: 'spike', sy: 2.2, color: '#8b909c', spin: [0, 1.1, 0], a: 0.6, b: 0.9},
  {az: -3.0, t: 0.45, size: 0.3, kind: 'spike', sy: 1.9, color: '#7a7f8c', spin: [0, 2.3, 0], a: 0.65, b: 0.95},
];

const smooth01 = (a: number, b: number, x: number): number => {
  if (b <= a) return x >= b ? 1 : 0;
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

export function computeRocks(progress: number, radius: number): RockInstance[] {
  const p = Number.isFinite(progress) ? Math.min(1, Math.max(0, progress)) : 0;
  const s = scaleOf(radius);
  const ys = heightStretch(radius);
  const out: RockInstance[] = [];
  const push = (r: {az: number; t: number; size: number; kind: 'chunk' | 'spike'; sy: number; color: string; spin: [number, number, number]}, grow: number) => {
    if (grow <= 0.001) return;
    const {position, size} = rockPlacement({...r, a: 0, b: 0}, s, ys);
    const k = size * grow;
    out.push({
      kind: r.kind,
      position,
      rotation: r.kind === 'spike' ? [Math.PI, r.spin[1], 0] : r.spin,
      scale: [k, k * r.sy, k],
      color: r.color,
    });
  };
  for (const r of ROCKS) push(r, 1); // batu lama selalu ada
  for (const r of EXTRA_ROCKS) push(r, smooth01(r.a, r.b, p));
  return out;
}
