/**
 * Helper animasi MURNI (tanpa state, timer, atau delta) untuk aset Episode 002.
 * Semua nilai hanya bergantung pada `progress` 0..1 atau `frame` Remotion,
 * sehingga aman ketika timeline digeser ke frame mana pun.
 */

export const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;

/** Potong progress global menjadi sub-fase: 0 sebelum `a`, 1 setelah `b`. */
export const seg = (p: number, a: number, b: number): number => clamp01((p - a) / (b - a));

export const easeOutCubic = (t: number): number => 1 - Math.pow(1 - t, 3);
export const easeInOutCubic = (t: number): number =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

/** Pop dengan sedikit overshoot (0 -> 1). Tepat 0 di t=0 dan tepat 1 di t=1. */
export const easeOutBack = (t: number, overshoot = 1.70158): number => {
  const c3 = overshoot + 1;
  return 1 + c3 * Math.pow(t - 1, 3) + overshoot * Math.pow(t - 1, 2);
};

/** Angka pseudo-acak deterministik 0..1 dari indeks (bukan Math.random). */
export const hash01 = (i: number): number => {
  const s = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return s - Math.floor(s);
};

export type BuildAnimProps = {
  /** Frame komposisi Remotion (useCurrentFrame()). */
  frame?: number;
  /** Frame saat animasi dimulai (default 0). */
  startFrame?: number;
  /** Lama animasi dalam frame (default tergantung komponen). */
  durationFrames?: number;
  /** Jika diisi (0..1), mengalahkan `frame`/`startFrame`/`durationFrames`. */
  progress?: number;
};

/**
 * Prioritas: `progress` > `frame` > selesai (1).
 * Tanpa `progress` maupun `frame`, aset tampil dalam kondisi selesai.
 */
export const resolveProgress = (props: BuildAnimProps, defaultDuration: number): number => {
  if (props.progress !== undefined) return clamp01(props.progress);
  if (props.frame === undefined) return 1;
  const dur = Math.max(1, props.durationFrames ?? defaultDuration);
  return clamp01((props.frame - (props.startFrame ?? 0)) / dur);
};
