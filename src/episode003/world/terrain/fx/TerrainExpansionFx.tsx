import React from 'react';

/**
 * EP003 A1c — efek visual ekspansi pulau (FX saja, bukan terrain).
 *
 * Murni fungsi dari `progress` 0..1 (+ `frame` opsional untuk goyangan debu sangat kecil).
 * Tanpa state, hooks, timer, Math.random, atau import three/A1a/A1b: aman dipakai di
 * React Three Fiber maupun <ThreeCanvas> Remotion, dan aman di-seek ke frame mana pun.
 *
 * Fase (dalam progress lokal 0..1):
 *   1. Ring: satu garis oktagon tipis di dalam tepi pulau, mengejar tepi saat tanah tumbuh.
 *   2. Debu: PUFF_COUNT gumpalan low-poly di tepi, tumbuh lalu memudar (berurutan, bergantian).
 *   3. Settle (0.88..1): ring menipis & memudar, debu menggepeng lalu hilang.
 * progress <= 0 atau >= 1 => tidak merender apa pun.
 *
 * `radius` = circumradius oktagon yang TERLIHAT pada frame ini (dari B), bukan radius target.
 * Orientasi oktagon mengikuti EP002 (cylinder 8 sisi, rotation-y = PI/8): titik sudut di
 * azimut PI/8 + k*PI/4, azimut diukur dari +Z ke +X.
 * Permukaan atas pulau y=0; FX digambar sedikit di atasnya.
 */

export type TerrainExpansionFxProps = {
  /** 0..1, dikendalikan Claude B. Di luar rentang / NaN di-clamp. */
  progress: number;
  /** Radius pulau yang terlihat pada frame ini (11.7 → 37.5 pada desain sementara). */
  radius: number;
  /** Frame Remotion (opsional). Hanya memberi goyangan debu sangat halus. */
  frame?: number;
};

// ---------- konstanta ----------
export const PUFF_COUNT = 10; // kontrak: 8–12
export const SETTLE_START = 0.88;
const OCT_STEP = Math.PI / 4;
/** Sudut awal ringGeometry (bidang XY) agar titik sudut jatuh di azimut PI/8 + k*PI/4 setelah rotation-x=-PI/2. */
export const RING_THETA_START = Math.PI / 8;
const RING_Y = 0.045;
const RING_COLOR = '#fff6c8';
const DUST_COLOR = '#f1e6d2';
const DUST_EMISSIVE = '#e9d9b8';

// ---------- helper murni ----------
export const clamp01 = (v: number): number => (Number.isFinite(v) ? Math.min(1, Math.max(0, v)) : 0);
const seg = (p: number, a: number, b: number): number => clamp01((p - a) / (b - a));
const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
const smooth = (t: number): number => t * t * (3 - 2 * t);
/** Pseudo-acak deterministik 0..1 dari indeks. */
export const hash01 = (i: number): number => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

/** Efek terlihat hanya di dalam (0,1) eksklusif. */
export const isExpansionFxVisible = (progress: number): boolean => {
  const p = clamp01(progress);
  return p > 0 && p < 1;
};

/** Radius batas oktagon (azimut dari +Z ke +X) untuk circumradius R. */
export const octagonRadiusAt = (azimuth: number, circumRadius: number): number => {
  const d = azimuth - Math.round(azimuth / OCT_STEP) * OCT_STEP; // [-PI/8, PI/8], titik tengah sisi di d=0
  return (circumRadius * Math.cos(Math.PI / 8)) / Math.cos(d);
};

/** Amplop opacity ring 0..1: tepat 0 di p<=0 dan p>=1, naik cepat, tahan, lalu pudar di settle. */
export const ringEnvelope = (progress: number): number => {
  const p = clamp01(progress);
  if (p <= 0 || p >= 1) return 0;
  return smooth(seg(p, 0, 0.1)) * (1 - smooth(seg(p, SETTLE_START - 0.06, 1)));
};

/** 0 sebelum fase settle, 1 di progress=1 (ease-out). */
export const settleAmount = (progress: number): number => easeOutCubic(seg(clamp01(progress), SETTLE_START, 1));

export type RingState = {visible: boolean; inner: number; outer: number; opacity: number};

/** Ring garis tipis: radius luar sedikit di dalam tepi, inset mengecil sehingga ring "mengejar" tepi. */
export const ringState = (progress: number, radius: number): RingState => {
  const p = clamp01(progress);
  const env = ringEnvelope(p);
  if (!(radius > 0) || !Number.isFinite(radius) || env <= 0) return {visible: false, inner: 0, outer: 0, opacity: 0};
  const chase = 1 - easeOutCubic(seg(p, 0, 0.85));
  const outer = Math.max(0.05, radius * (0.985 - 0.1 * chase));
  const width = (0.07 + 0.006 * radius) * (1 - 0.5 * settleAmount(p));
  const pulse = 0.88 + 0.12 * Math.sin(p * Math.PI * 6);
  return {visible: true, inner: Math.max(0.01, outer - width), outer, opacity: 0.8 * env * pulse};
};

export type PuffState = {
  visible: boolean;
  position: [number, number, number];
  scale: [number, number, number];
  rotationY: number;
  opacity: number;
  /** Jendela progress global [start, end] puff ini. */
  window: [number, number];
};

/** Jendela progress puff ke-i: tersebar berurutan (golden-ratio), selalu selesai sebelum p=1. */
export const puffWindow = (i: number): [number, number] => {
  const start = 0.04 + 0.5 * ((i * 0.618034) % 1);
  const len = 0.34 + 0.08 * hash01(i + 60);
  return [start, start + len];
};

/** Keadaan puff ke-i pada progress/radius/frame tertentu. */
export const puffState = (i: number, progress: number, radius: number, frame?: number): PuffState => {
  const p = clamp01(progress);
  const window = puffWindow(i);
  const hidden: PuffState = {visible: false, position: [0, 0, 0], scale: [0, 0, 0], rotationY: 0, opacity: 0, window};
  if (!(radius > 0) || !Number.isFinite(radius)) return hidden;
  const u = seg(p, window[0], window[1]);
  if (p <= 0 || p >= 1 || u <= 0 || u >= 1) return hidden;
  const life = Math.sin(Math.PI * u);
  if (life < 0.01) return hidden;
  const settle = settleAmount(p);

  const az = (i / PUFF_COUNT) * Math.PI * 2 + (hash01(i + 10) - 0.5) * 0.5 * ((Math.PI * 2) / PUFF_COUNT);
  const drift = (0.5 + 0.5 * hash01(i + 20)) * (0.5 + 0.03 * radius);
  const r = octagonRadiusAt(az, radius) * 0.97 + drift * easeOutCubic(u);
  const sway = frame === undefined || !Number.isFinite(frame) ? 0 : Math.sin(frame * 0.11 + i * 1.7) * 0.05 * life;
  const x = Math.sin(az) * r + Math.cos(az) * sway;
  const z = Math.cos(az) * r - Math.sin(az) * sway;
  const y = 0.12 + (0.35 + 0.01 * radius) * easeOutCubic(u);

  const k = (0.22 + 0.0105 * radius) * (0.75 + 0.5 * hash01(i + 30)) * life;
  return {
    visible: true,
    position: [x, y, z],
    scale: [k, k * 0.85 * (1 - 0.4 * settle), k],
    rotationY: hash01(i + 40) * Math.PI + u * 0.8,
    opacity: 0.8 * life,
    window,
  };
};

// ---------- komponen ----------
export const TerrainExpansionFx: React.FC<TerrainExpansionFxProps> = ({progress, radius, frame}) => {
  if (!isExpansionFxVisible(progress)) return null;
  if (!(radius > 0) || !Number.isFinite(radius)) return null;
  const p = clamp01(progress);
  const ring = ringState(p, radius);

  return (
    <group>
      {ring.visible && (
        <mesh position={[0, RING_Y, 0]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[ring.inner, ring.outer, 8, 1, RING_THETA_START, Math.PI * 2]} />
          <meshBasicMaterial color={RING_COLOR} transparent opacity={ring.opacity} depthWrite={false} />
        </mesh>
      )}
      {Array.from({length: PUFF_COUNT}, (_, i) => {
        const s = puffState(i, p, radius, frame);
        if (!s.visible) return null;
        return (
          <mesh key={i} position={s.position} rotation-y={s.rotationY} scale={s.scale}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial
              color={DUST_COLOR}
              emissive={DUST_EMISSIVE}
              emissiveIntensity={0.3}
              flatShading
              transparent
              opacity={s.opacity}
              depthWrite={false}
            />
          </mesh>
        );
      })}
    </group>
  );
};
