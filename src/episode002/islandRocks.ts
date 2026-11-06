/**
 * Penempatan batu di bawah pulau besar. Modul MURNI (tanpa React/three) supaya bisa diuji dengan node.
 * Setiap batu ditentukan oleh (azimut, kedalaman t pada kerucut), lalu posisinya dihitung dari
 * permukaan kerucut yang SEDANG tampil (skala s dan ys saat itu), jadi batu menempel dan ikut
 * bergerak selama animasi perluasan -- tidak pernah di luar kontur dan tidak melayang.
 */

/** Sama dengan <coneGeometry args={[2.5, 2.7, 8]} /> di Island.tsx / ExpandedIsland.tsx. */
export const CONE_R = 2.5;
export const CONE_H = 2.7;
/** Dasar tanah = puncak kerucut batu. */
export const CONE_TOP_Y = -1.1;

const Q = Math.PI / 4;

/**
 * Jarak dari sumbu ke tepi segi-8 pada azimut `az` (atan2(x, z)).
 * Segi-8 pulau: sisi datar berpusat di azimut kelipatan 45 derajat, sudut di 22.5 + k*45.
 */
export const polyRadius = (az: number, circumR: number): number => {
  let off = ((az % Q) + Q) % Q;
  off = Math.min(off, Q - off);
  return (circumR * Math.cos(Math.PI / 8)) / Math.cos(off);
};

export type RockSpec = {
  /** azimut (radian, atan2(x, z)) */
  az: number;
  /** 0 = tepi atas kerucut, 1 = ujung bawah */
  t: number;
  /** radius dasar batu (unit) */
  size: number;
  kind: 'chunk' | 'spike';
  /** regangan vertikal (spike memanjang ke bawah) */
  sy: number;
  color: string;
  spin: [number, number, number];
  /** jendela muncul (progress perluasan). b <= a = sudah ada sejak awal */
  a: number;
  b: number;
};

const G1 = '#8b909c';
const G2 = '#7a7f8c';
const G3 = '#6f7480';

export const ROCKS: RockSpec[] = [
  // dua bongkahan asli Ep001 (azimut & kedalaman sama), kini menempel di kerucut
  {az: 1.107, t: 0.556, size: 0.35, kind: 'chunk', sy: 1, color: G1, spin: [0.4, 1.1, 0.2], a: 0, b: 0},
  {az: -2.034, t: 0.74, size: 0.25, kind: 'chunk', sy: 1, color: G1, spin: [1.2, 0.3, 0.7], a: 0, b: 0},
  // bongkahan tambahan (muncul bertahap saat tanah bertambah)
  {az: 0.4, t: 0.2, size: 0.55, kind: 'chunk', sy: 0.85, color: G2, spin: [0.8, 2.1, 0.3], a: 0.3, b: 0.5},
  {az: 2.6, t: 0.3, size: 0.5, kind: 'chunk', sy: 0.9, color: G3, spin: [0.2, 0.9, 1.0], a: 0.4, b: 0.6},
  {az: -0.9, t: 0.15, size: 0.6, kind: 'chunk', sy: 0.8, color: G2, spin: [1.4, 0.5, 0.6], a: 0.45, b: 0.65},
  {az: -2.9, t: 0.45, size: 0.45, kind: 'chunk', sy: 1, color: G1, spin: [0.6, 2.6, 0.9], a: 0.55, b: 0.75},
  {az: 1.9, t: 0.65, size: 0.4, kind: 'chunk', sy: 1, color: G3, spin: [1.0, 1.6, 0.1], a: 0.65, b: 0.85},
  {az: -1.6, t: 0.4, size: 0.5, kind: 'chunk', sy: 0.9, color: G2, spin: [0.3, 0.4, 1.3], a: 0.7, b: 0.9},
  // stalaktit runcing yang menggantung dari permukaan batu
  {az: 0.0, t: 0.5, size: 0.3, kind: 'spike', sy: 2.2, color: G2, spin: [0, 0.6, 0], a: 0.5, b: 0.7},
  {az: 2.2, t: 0.55, size: 0.28, kind: 'spike', sy: 2.0, color: G3, spin: [0, 1.4, 0], a: 0.6, b: 0.8},
  {az: -0.5, t: 0.7, size: 0.25, kind: 'spike', sy: 1.9, color: G2, spin: [0, 0.2, 0], a: 0.7, b: 0.9},
  {az: -2.4, t: 0.6, size: 0.28, kind: 'spike', sy: 2.1, color: G1, spin: [0, 2.0, 0], a: 0.75, b: 0.95},
  {az: 1.0, t: 0.35, size: 0.3, kind: 'spike', sy: 2.0, color: G3, spin: [0, 0.9, 0], a: 0.8, b: 1.0},
];

/** Pembesaran ukuran batu mengikuti pulau (tidak sebanding penuh agar tidak raksasa). */
export const rockSizeFactor = (s: number): number => 1 + (s - 1) * 0.45;

/** Kedalaman benam (fraksi ukuran, diukur tegak lurus permukaan) yang dituju. */
export const EMBED_RATIO = 0.9;

export type RockPlacement = {position: [number, number, number]; size: number};

/**
 * Posisi batu pada permukaan kerucut yang sedang tampil.
 * @param s skala radius pulau saat ini, @param ys regangan tinggi kerucut saat ini.
 */
export const rockPlacement = (spec: RockSpec, s: number, ys: number): RockPlacement => {
  const coneH = CONE_H * ys;
  const y = CONE_TOP_Y - spec.t * coneH;
  const circumR = CONE_R * s * (1 - spec.t);
  const surface = polyRadius(spec.az, circumR);
  const size = spec.size * rockSizeFactor(s);
  const radial = Math.max(0, surface - size * EMBED_RATIO);
  return {position: [Math.sin(spec.az) * radial, y, Math.cos(spec.az) * radial], size};
};
