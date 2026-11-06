/**
 * Penempatan dekorasi pulau besar (pohon, semak, bunga, rumput, kerikil). MURNI & deterministik
 * (hash, bukan Math.random) dan tanpa React/three supaya bisa diuji Node (test/islandDecor.test.mjs).
 *
 * Aturan: dekorasi TIDAK menyentuh rumah, sawah, zona jalan Gobi/warga, dan tepi pulau. Dekorasi baru
 * muncul SETELAH perluasan dimulai (awal episode tetap "kosong banget").
 */
import {polyRadius} from './islandRocks.ts';
import {HOUSE_SPOT, FIELD_SPOT, HOUSE_SCALE, FIELD_SCALE, ISLAND_EXPANDED_SCALE} from './sceneLayout.ts';
import {obstacleDistance} from './villagerPath.ts';
import type {Obstacle} from './villagerPath.ts';

export type DecorKind = 'tree' | 'bush' | 'flower' | 'tuft' | 'pebble';
export type DecorItem = {
  kind: DecorKind;
  x: number;
  z: number;
  /** skala 0.8..1.4 */
  size: number;
  rot: number;
  /** indeks warna */
  variant: number;
  /** progres perluasan (0..1) saat mulai muncul */
  delay: number;
  phase: number;
};

const hash01 = (i: number): number => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

const OUTER = 3 * ISLAND_EXPANDED_SCALE; // radius segi-8 akhir (11.7)

/** Zona gerak Gobi + warga (kotak sumbu x/z) yang harus bersih dari dekorasi. */
export const ACTION_ZONE = {xMin: -2.9, xMax: 5.5, zMin: -2.3, zMax: 5.9};

const houseOb: Obstacle = {
  kind: 'rect',
  x: HOUSE_SPOT.position[0],
  z: HOUSE_SPOT.position[2],
  rotY: HOUSE_SPOT.rotationY,
  hx: 1.85 * HOUSE_SCALE,
  zMin: -1.55 * HOUSE_SCALE,
  zMax: 2.05 * HOUSE_SCALE,
};
const fieldOb: Obstacle = {
  kind: 'rect',
  x: FIELD_SPOT.position[0],
  z: FIELD_SPOT.position[2],
  rotY: FIELD_SPOT.rotationY,
  hx: 1.4 * FIELD_SCALE,
  zMin: -1.1 * FIELD_SCALE,
  zMax: 1.1 * FIELD_SCALE,
};

/** Jarak bebas (>= 0 = boleh) titik terhadap semua larangan, dikurangi `pad` (radius objek). */
export const decorFree = (x: number, z: number, pad: number): number => {
  const az = Math.atan2(x, z);
  let m = polyRadius(az, OUTER) - 0.8 - Math.hypot(x, z) - pad; // tepi pulau
  m = Math.min(m, obstacleDistance(houseOb, x, z) - 0.8 - pad);
  m = Math.min(m, obstacleDistance(fieldOb, x, z) - 0.6 - pad);
  const dx = Math.max(ACTION_ZONE.xMin - x, 0, x - ACTION_ZONE.xMax);
  const dz = Math.max(ACTION_ZONE.zMin - z, 0, z - ACTION_ZONE.zMax);
  const inside = x > ACTION_ZONE.xMin && x < ACTION_ZONE.xMax && z > ACTION_ZONE.zMin && z < ACTION_ZONE.zMax;
  const zoneDist = inside
    ? -Math.min(x - ACTION_ZONE.xMin, ACTION_ZONE.xMax - x, z - ACTION_ZONE.zMin, ACTION_ZONE.zMax - z)
    : Math.hypot(dx, dz);
  return Math.min(m, zoneDist - pad);
};

const build = (): DecorItem[] => {
  const items: DecorItem[] = [];
  const far = (x: number, z: number, minD: number, kinds?: DecorKind[]) =>
    items.every((o) => (kinds && !kinds.includes(o.kind) ? true : Math.hypot(o.x - x, o.z - z) >= minD));
  let seed = 1;
  const rnd = () => hash01(seed++);
  const point = (): [number, number] => {
    const a = rnd() * Math.PI * 2;
    const r = Math.sqrt(rnd()) * (OUTER - 0.5);
    return [Math.sin(a) * r, Math.cos(a) * r];
  };
  const place = (kind: DecorKind, count: number, pad: number, spacing: number, sizeMin: number, sizeMax: number, filter?: (x: number, z: number) => boolean) => {
    let n = 0;
    for (let tries = 0; tries < 6000 && n < count; tries++) {
      const [x, z] = point();
      if (filter && !filter(x, z)) continue;
      if (decorFree(x, z, pad) < 0) continue;
      if (!far(x, z, spacing, kind === 'tree' ? ['tree', 'bush'] : [kind])) continue;
      const r = Math.hypot(x, z);
      items.push({
        kind,
        x,
        z,
        size: sizeMin + (sizeMax - sizeMin) * rnd(),
        rot: rnd() * Math.PI * 2,
        variant: Math.floor(rnd() * 4),
        delay: Math.min(0.85, 0.12 + (r / OUTER) * 0.7 + rnd() * 0.05),
        phase: rnd() * Math.PI * 2,
      });
      n++;
    }
  };
  // pohon: hanya di belakang/samping Gobi dari sudut kamera (x+z kecil) supaya tidak menutupi aksi
  place('tree', 7, 1.0, 3.6, 1.0, 1.4, (x, z) => x + z < 1.5);
  place('bush', 11, 0.7, 2.0, 0.8, 1.3);
  place('pebble', 14, 0.3, 1.2, 0.8, 1.5);
  // bunga berkelompok: 8 pusat x ~7 bunga
  const centers: [number, number][] = [];
  for (let tries = 0; tries < 4000 && centers.length < 8; tries++) {
    const [x, z] = point();
    if (decorFree(x, z, 1.1) < 0) continue;
    if (centers.some(([cx, cz]) => Math.hypot(cx - x, cz - z) < 3.2)) continue;
    centers.push([x, z]);
  }
  for (const [cx, cz] of centers) {
    for (let k = 0; k < 7; k++) {
      const a = rnd() * Math.PI * 2;
      const d = 0.2 + rnd() * 0.9;
      const x = cx + Math.sin(a) * d;
      const z = cz + Math.cos(a) * d;
      if (decorFree(x, z, 0.15) < 0) continue;
      if (!far(x, z, 0.28, ['flower'])) continue;
      const r = Math.hypot(x, z);
      items.push({kind: 'flower', x, z, size: 0.9 + rnd() * 0.5, rot: rnd() * 6.28, variant: Math.floor(rnd() * 4), delay: Math.min(0.88, 0.14 + (r / OUTER) * 0.7 + rnd() * 0.06), phase: rnd() * 6.28});
    }
  }
  place('tuft', 40, 0.2, 0.9, 0.9, 1.4);
  return items;
};

export const DECOR: DecorItem[] = build();
