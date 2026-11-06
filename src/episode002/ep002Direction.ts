/**
 * Arahan Episode 002 (timing, blocking & acting Gobi, kamera). MURNI & deterministik:
 * semua nilai hanya fungsi dari waktu `t` (detik) -> aman di frame mana pun, tanpa state.
 * Tidak mengimpor remotion/three supaya bisa diuji langsung dengan Node
 * (node --experimental-strip-types test/ep002Direction.test.mjs).
 *
 * TIMING: diturunkan dari analisis jeda/silence di episode002.mp3 (88.19 dtk) + urutan naskah
 * VO_SCRIPT_EP002.txt. Ini PERKIRAAN (±1 dtk), bukan transkripsi kata-per-kata. Cukup ubah
 * konstanta di `T` dan tabel keyframe di bawah setelah melihat preview.
 */
import type {GobiPose} from '../Gobi';
import {HOUSE_SPOT, FIELD_SPOT, ISLAND_EXPANDED_SCALE} from './sceneLayout.ts';

export const EP002_FPS = 30;
export const EP002_FRAMES = 2700; // 90 dtk; MP3 = 88.19 dtk (minimal 2646 frame)
export const AUDIO_SECONDS = 88.189375;

const FACE = Math.PI / 4; // = FACE_CAMERA di timeline.ts
const TWO_PI = Math.PI * 2;

/** Waktu kunci (detik). */
export const T = {
  card1In: 5.55, // "Ini nih!" (komentar 1: pulau gede, rumah, makanan-minuman)
  card1Out: 12.3,
  expandStart: 23.4, // "Nahhh! Gini dong!" -> pulau membesar
  houseStart: 30.5, // "RUMAH!" -> pondasi, dinding, atap (atap ~34.7 "ATAP!")
  card2In: 41.6, // "Eh? Ada komentar lagi?" (komentar 2: peternakan/padi)
  card2Out: 48.4,
  fieldStart: 49.6, // "padi dulu aja, deh!" -> ditanam ~52 "Nah! Udah ditanam!"
  npcAppear: 64.6, // "Eh?! Bentar... siapa kalian?!" -> dua warga pop-in
} as const;

export const sec2f = (s: number): number => Math.round(s * EP002_FPS);

/* ------------------------------------------------------------------ util */

export type Pts = [number, number][];

/** Keyframe (detik -> nilai), easing in-out quad, clamp di ujung. Sama dengan kf() di timeline.ts. */
export const kfp = (t: number, pts: Pts): number => {
  if (t <= pts[0][0]) return pts[0][1];
  const last = pts[pts.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 0; i < pts.length - 1; i++) {
    const [t0, v0] = pts[i];
    const [t1, v1] = pts[i + 1];
    if (t >= t0 && t < t1) {
      const u = (t - t0) / (t1 - t0);
      const e = u < 0.5 ? 2 * u * u : 1 - 2 * (1 - u) * (1 - u);
      return v0 + (v1 - v0) * e;
    }
  }
  return last[1];
};

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** Pulsa 0..1..0 berbentuk busur (untuk lompatan / kejutan). */
const arc = (t: number, t0: number, dur: number): number => Math.sin(Math.PI * clamp01((t - t0) / dur));

/** Jendela 0..1 dengan fade masuk/keluar `f` detik. */
const gate = (t: number, a: number, b: number, f = 0.15): number =>
  clamp01((t - a) / f) * clamp01((b - t) / f);

const angleDiff = (a: number, b: number): number => {
  let d = (b - a) % TWO_PI;
  if (d > Math.PI) d -= TWO_PI;
  if (d <= -Math.PI) d += TWO_PI;
  return d;
};

/* ------------------------------------------------------------ blocking */

// Posisi Gobi (x,z). Pulau lama radius 3; pulau diperbesar menjadi 11.7.
// Rumah di (-5,-1), sawah di (4.9,-2.6); setelah warga muncul Gobi tetap di (0,0)
// karena jalur warga divalidasi terhadap Gobi di pusat (villagerPath.makeObstacles).
const X: Pts = [
  [0, 0], [19.8, 0],
  [21.3, 2.0], [22.4, 2.0], // 3 langkah ke tepi pulau kecil (sama dengan Ep001)
  [23.3, 0.9], [24.6, 0.9], // mundur ketakutan, lalu pulau membesar
  [26.2, 2.5], [27.0, 2.5], // berani jalan melewati bekas tepi lama
  [28.4, 0.9], [29.4, 0.5], // kembali, siap lihat rumah
  [47.0, 0.5], [48.6, 1.2],
  [50.2, 1.9], // ke depan sawah
  [61.9, 1.9], [62.7, 1.2], [63.6, 0], // pulang ke tengah (memutar, tidak menyenggol sawah)
  [90, 0],
];
const Z: Pts = [
  [0, 0], [19.8, 0],
  [21.3, 1.6], [22.4, 1.6],
  [23.3, 0.7], [24.6, 0.7],
  [26.2, 2.0], [27.0, 2.0],
  [28.4, 1.5], [29.4, 0.9],
  [47.0, 0.9], [48.6, 0.1],
  [50.2, -0.95],
  [61.9, -0.95], [62.7, 0.35], [63.6, 0],
  [90, 0],
];
export const gobiXZ = (t: number) => ({x: kfp(t, X), z: kfp(t, Z)});

/** Arah hadap dasar (hadap kamera = FACE). */
const ROT: Pts = [
  [0, FACE], [19.8, FACE],
  [20.5, 0.9], [22.4, 0.9], [23.2, FACE], // menghadap tepi saat mengintip jurang
  [30.8, FACE], [31.5, FACE - 0.9], [34.8, FACE - 0.9], [35.5, FACE], // menoleh ke rumah (kiri)
  [35.7, FACE], [37.0, FACE + TWO_PI], // putar kegirangan
];
const ROT3: Pts = [
  // dipakai setelah putaran selesai (37.0 dtk); nilai relatif terhadap FACE
  [38.5, 0], [39.2, Math.PI / 2], [40.6, Math.PI / 2], [41.3, 0], // berbaring MENYAMPING (kepala tidak menembus rumah)
  [48.8, 0], [49.8, 2.0], [53.0, 2.0], [53.8, 0], // menghadap sawah saat menanam (3/4 punggung)
  [54.6, 0], [55.2, 1.3], [58.9, 1.1], [59.5, 0], // duduk menunggu, profil ke kanan
];
const rotBase = (t: number): number => {
  if (t < 37.0) return kfp(t, ROT);
  return FACE + TWO_PI + kfp(t, ROT3);
};

/** Hop (lompatan): [mulai, tinggi, durasi]. */
const HOPS: [number, number, number][] = [
  [0.87, 0.7, 0.35], // "LAH?!"
  [4.95, 0.55, 0.35], // "...satu desa?!"
  [5.7, 0.35, 0.3], // kaget lihat komentar 1
  [16.5, 0.35, 0.3], // "Oke!"
  [22.15, 0.6, 0.4], // selamat dari jurang
  [23.65, 0.6, 0.4], [24.25, 0.4, 0.3], // "Nahhh!"
  [30.2, 0.5, 0.35], // "RUMAH!"
  [32.0, 0.3, 0.3], [33.5, 0.3, 0.3], [34.65, 0.55, 0.4], // pondasi, dinding, ATAP
  [35.6, 0.7, 0.45], [36.3, 0.5, 0.4], // "YES!"
  [40.45, 0.4, 0.3], // bangun dari rumput
  [41.8, 0.5, 0.35], // "Eh? Ada komentar lagi?"
  [52.2, 0.6, 0.4], // "Nah! Udah ditanam!"
  [59.05, 0.8, 0.45], [60.2, 0.4, 0.3], // "HAH?! ... PANEN?!"
  [63.85, 0.6, 0.35], // "Eh?!"
  [66.2, 0.5, 0.35], // "LAH?!"
  [75.95, 0.7, 0.4], [76.9, 0.4, 0.3], // "tempat uji kesabaran"
  [82.4, 0.3, 0.25], [82.85, 0.3, 0.25], // "Tulis di komentar, ya!"
  [86.2, 0.5, 0.35], [87.0, 0.4, 0.3], [87.8, 0.7, 0.45], // "Yuk, bangun..."
];

const UP: Pts = [
  [0, 0], [0.85, 0], [1.0, 1], [2.0, 1], [2.4, 0.35], [2.7, 0.35], [3.0, 0], // LAH?! + shrug
  [3.4, 0], [3.7, 0.5], [4.8, 0.5], [5.0, 1], [5.5, 1], [5.9, 0], // "satu desa?!"
  [9.2, 0], [9.5, 0.4], [11.8, 0.4], [12.3, 0], // menyimak daftar permintaan
  [12.6, 0], [13.0, 0.9], [15.9, 0.9], [16.3, 0], // "dua tangan"
  [16.5, 0], [16.8, 0.6], [17.3, 0.6], [17.6, 0.5], [19.4, 0.5], [19.7, 0], // "gedein"
  [21.0, 0], [21.2, 1], [22.1, 1], [22.4, 0.3], [22.8, 0], // melambai-lambai di tepi
  [23.6, 0], [23.8, 1], [25.0, 1], [25.5, 0.45], [28.0, 0.45], [28.5, 0], // "Nahhh!"
  [30.1, 0], [30.3, 1], [31.0, 1], [31.4, 0],
  [31.9, 0], [32.0, 0.5], [32.5, 0], [33.4, 0], [33.5, 0.5], [34.0, 0],
  [34.55, 0], [34.7, 1], [35.3, 1], [35.5, 0.9], [37.9, 1], [38.9, 0], // "YES!"
  [41.7, 0], [41.85, 0.8], [42.5, 0.8], [43.0, 0],
  [52.4, 0], [52.6, 1], [53.4, 1], [53.9, 0], // "Nah! Udah ditanam!"
  [59.0, 0], [59.2, 1], [61.1, 1], [61.4, 0], // "HAH?!"
  [63.8, 0], [64.0, 0.9], [65.9, 0.9], [66.2, 0.2], [66.4, 0],
  [70.9, 0], [71.3, 0.5], [75.3, 0.5], [75.8, 0],
  [75.9, 0], [76.1, 1], [77.6, 1], [78.0, 0],
  [83.8, 0], [84.1, 0.5], [85.9, 0.5], [86.2, 0.35], [89.9, 0.35], [90, 0.35],
];
const WAVE: Pts = [[69.3, 0], [69.6, 1], [71.4, 1], [71.8, 0], [86.0, 0], [86.4, 1], [90, 1]];
const POINT: Pts = [
  [5.8, 0], [6.1, 1], [8.9, 1], [9.3, 0], // tunjuk komentar 1
  [40.4, 0], [40.7, 1], [41.4, 1], [41.7, 0], // tunjuk rumah
  [43.9, 0], [44.3, 1], [46.4, 1], [46.8, 0], // tunjuk komentar 2
  [57.0, 0], [57.3, 1], [58.5, 1], [58.8, 0], // "kok masih ijo?" tunjuk padi
  [66.3, 0], [66.6, 1], [67.8, 1], [68.2, 0], // tunjuk warga
  [79.9, 0], [80.2, 1], [81.9, 1], [82.2, 0], // "kalian punya ide...?"
  [82.3, 0], [82.5, 1], [83.5, 1], [83.8, 0], // "Tulis di komentar, ya!"
];
const ARM_FWD: Pts = [
  [49.9, 0], [50.4, 0.9], [52.5, 0.9], [52.9, 0], // menanam
  [53.8, 0], [54.1, 0.5], [54.7, 0], // menggosok tangan menunggu
  [61.3, 0], [61.6, 1], [62.7, 1], [63.4, 0.3], [63.8, 0], // pegang perut
  [78.8, 0], [79.0, 0.6], [79.7, 0], // "Aduh..."
];
const LEAN: Pts = [
  [20.8, 0], [21.5, 0.65], [22.0, 0.65], [22.15, -0.4], [22.6, 0], // mengintip jurang
  [49.4, 0], [49.9, 0.55], [52.6, 0.55], [53.0, 0], // menanam
  [57.0, 0], [57.4, 0.3], [58.6, 0.3], [59.0, 0], // melongok padi
  [61.3, 0], [61.6, 0.45], [62.8, 0.45], [63.4, 0], // lapar
  [78.8, 0], [79.0, 0.3], [79.6, 0.3], [79.9, 0],
];
const HEAD_PITCH: Pts = [
  [5.8, 0], [6.2, -0.3], [9.0, -0.3], [9.4, 0], // mendongak baca komentar 1
  [20.9, 0], [21.4, 0.35], [22.0, 0.35], [22.15, -0.25], [22.6, 0],
  [41.8, 0], [42.2, -0.3], [47.8, -0.3], [48.2, 0], // mendongak komentar 2
  [49.9, 0], [50.3, 0.3], [52.6, 0.3], [53.0, 0], // lihat tanah
  [57.0, 0], [57.4, 0.35], [58.6, 0.35], [59.0, 0],
  [61.4, 0], [61.7, 0.3], [62.8, 0.3], [63.3, 0],
  [78.8, 0], [79.0, 0.3], [79.6, 0.3], [79.9, 0],
];
const HEAD_YAW: Pts = [
  [3.1, 0], [3.5, 0.45], [4.0, -0.45], [4.5, 0.4], [5.0, -0.4], [5.4, 0], // geleng "satu desa?!"
  [30.8, 0], [31.4, 0.55], [34.8, 0.55], [35.4, 0], // badan ke rumah, muka ke kamera
  [49.4, 0], [50.0, -0.8], [53.0, -0.8], [53.6, 0], // menanam: muka tetap terlihat
  [54.6, 0], [55.2, -0.7], [58.9, -0.5], [59.0, 0],
  [59.0, 0], [59.3, 0.5], [59.7, -0.5], [60.1, 0.5], [60.5, -0.5], [60.9, 0], // geleng "PANEN?!"
  [63.9, 0], [64.3, 0.7], [64.9, -0.7], [65.5, 0.6], [66.0, -0.6], [66.4, 0], // lihat kiri-kanan
  [70.5, 0], [71.5, -0.6], [72.6, -0.6], [73.4, 0.6], [74.8, 0.6], [75.4, 0], // rumah (kiri), padi (kanan)
  [76.0, 0], [76.3, 0.5], [76.7, -0.5], [77.1, 0.5], [77.5, -0.4], [77.9, 0],
];
const TILT: Pts = [
  [1.9, 0], [2.3, 0.2], [2.9, 0.2], [3.3, 0], [4.2, 0], [4.6, -0.2], [5.2, 0.2], [5.6, 0],
  [14.2, 0], [14.6, -0.2], [15.4, 0.2], [15.9, 0],
  [48.7, 0], [49.1, 0.22], [49.6, 0], // berpikir "Hmm..."
  [57.0, 0], [57.4, 0.25], [58.7, 0.25], [59.0, 0],
  [70.6, 0], [71.2, 0.15], [72.4, -0.15], [73.6, 0.15], [75.2, 0],
  [83.8, 0], [84.6, 0.12], [85.4, -0.12], [86.0, 0],
];
const SURPRISE: Pts = [
  [0.8, 0], [0.95, 1], [2.0, 1], [2.5, 0],
  [4.9, 0], [5.0, 1], [5.6, 0],
  [5.6, 0], [5.7, 0.8], [6.3, 0],
  [21.3, 0], [21.5, 1], [22.3, 0.5], [22.6, 0],
  [41.7, 0], [41.85, 1], [42.8, 0],
  [59.0, 0], [59.1, 1], [61.0, 1], [61.3, 0],
  [63.8, 0], [63.9, 1], [66.5, 1], [67.0, 0],
  [75.9, 0], [76.0, 1], [77.5, 0],
];
const SIT: Pts = [[54.3, 0], [54.9, 1], [56.6, 1], [57.1, 0]];
const LIE: Pts = [[38.9, 0], [39.5, 1], [40.2, 1], [40.8, 0]];
/** Langkah menghentak di tempat (sedang kesal & lapar). */
const STOMP: Pts = [[61.2, 0], [61.4, 0.8], [62.0, 0.8], [62.2, 0]];

/* ---------------------------------------------- akting V4 (ekspresi) */

/** Bingung: mata tak sama besar + mulut miring (pas dengan dialog yang bertanya/ragu). */
const CONFUSE: Pts = [
  [1.9, 0], [2.3, 1], [3.2, 1], [3.6, 0], // \"Kemarin aku cuma minta ide...\"
  [41.9, 0], [42.3, 0.8], [42.9, 0], // \"Eh? Ada komentar lagi?\"
  [48.6, 0], [49.0, 1], [49.7, 0], // \"Hmm...\"
  [57.1, 0], [57.4, 1], [58.8, 1], [59.0, 0], // \"Lho? Kok masih ijo?\"
  [65.1, 0], [65.5, 1], [66.3, 0.4], [66.6, 0], // \"siapa kalian?!\"
  [70.7, 0], [71.2, 0.8], [75.2, 0.8], [75.7, 0], // \"Sebentar, sebentar...\"
];
/** Senang: mata menyipit gembira + mulut lebar. */
const HAPPY: Pts = [
  [23.7, 0], [24.0, 1], [28.0, 1], [28.6, 0], // \"Nahhh! Gini dong!\"
  [30.2, 0], [30.5, 1], [31.3, 0], // \"RUMAH!\"
  [34.6, 0], [34.9, 1], [39.0, 0.9], [39.6, 0], // \"ATAP! ... YES!\"
  [52.3, 0], [52.6, 1], [54.4, 0.8], [55.0, 0], // \"Nah! Udah ditanam!\"
  [83.8, 0], [84.2, 0.7], [86.0, 0.9], [90, 0.9], // ajakan outro
];
/** Lapar: mata sayu + mulut datar bergetar. */
const HUNGRY: Pts = [
  [61.3, 0], [61.7, 1], [63.3, 1], [63.7, 0], // \"AKU LAPARNYA SEKARANG!\"
  [78.8, 0], [79.0, 1], [79.8, 1], [80.1, 0], // \"Aduh...\"
];

/** Kedip deterministik tiap 3,1 dtk (lebih jarang saat kaget). */
const blinkAt = (t: number, surprise: number): number => {
  const ph = t % 3.1;
  return ph > 2.95 ? Math.sin((Math.PI * (ph - 2.95)) / 0.15) * (1 - surprise) : 0;
};

/**
 * Squash & stretch: antisipasi (pipih sebelum lompat), memanjang di udara, pipih saat mendarat.
 * Setiap pulsa mulai & berakhir di 0 sehingga kontinu. Amplitudo ikut tinggi lompatan.
 */
const squashAt = (t: number): number => {
  let s = 0;
  for (const [t0, h, d] of HOPS) {
    const k = Math.min(1, h / 0.5);
    if (t >= t0 - 0.2 && t < t0) s += 0.34 * k * Math.sin((Math.PI * (t - (t0 - 0.2))) / 0.2);
    else if (t >= t0 && t < t0 + d) s -= 0.22 * k * Math.sin((Math.PI * (t - t0)) / d);
    else if (t >= t0 + d && t < t0 + d + 0.2) {
      const v = (t - t0 - d) / 0.2;
      s += 0.3 * k * Math.sin(Math.PI * v) * (1 - 0.5 * v);
    }
  }
  s += gate(t, 61.5, 63.2) * 0.05 * Math.sin(t * 12); // perut keroncongan
  return Math.min(0.42, Math.max(-0.3, s));
};

/* ------------------------------------------------------------- emote */

export type EmoteKind = 'q' | 'bang' | 'heart' | 'star' | 'rumble';
/** Balon kecil di atas kepala Gobi. [jenis, mulai, selesai] (detik) -- selaras dengan dialog. */
const EMOTES: [EmoteKind, number, number][] = [
  ['bang', 0.87, 1.9], // \"LAH?!\"
  ['q', 2.0, 3.4], // \"...cuma minta ide\"
  ['bang', 4.95, 5.85], // \"satu desa?!\"
  ['bang', 21.3, 22.3], // jurang!
  ['star', 23.8, 25.6], // \"Nahhh! Gini dong!\"
  ['star', 30.2, 31.2], // \"RUMAH!\"
  ['heart', 35.5, 37.7], // \"YES! Akhirnya punya rumah\"
  ['q', 41.9, 43.0], // \"Eh? Ada komentar lagi?\"
  ['q', 48.7, 49.7], // \"Hmm...\"
  ['star', 52.3, 53.9], // \"Nah! Udah ditanam!\"
  ['q', 57.2, 58.8], // \"Lho? Kok masih ijo?\"
  ['bang', 59.1, 60.8], // \"HAH?! PANEN?!\"
  ['rumble', 61.5, 63.3], // \"AKU LAPARNYA SEKARANG!\"
  ['bang', 63.85, 64.95], // \"Eh?!\"
  ['q', 65.05, 66.3], // \"siapa kalian?!\"
  ['bang', 66.3, 67.3], // \"Yang kemarin komen jadi warga?!\"
  ['q', 70.8, 72.3], // \"Sebentar, sebentar...\"
  ['bang', 75.95, 77.0], // \"tempat uji kesabaran\"
  ['rumble', 78.9, 79.9], // \"Aduh...\"
  ['star', 86.2, 88.0], // \"Yuk, bangun pulau ini!\"
];
const easeBack = (u: number, o = 2.0): number => 1 + (o + 1) * Math.pow(u - 1, 3) + o * Math.pow(u - 1, 2);
export type EmoteState = {kind: EmoteKind; /** 0..1 progres hidup */ u: number; /** skala (overshoot saat muncul, mengecil saat hilang) */ scale: number};
export const emotesAt = (t: number): EmoteState[] => {
  const out: EmoteState[] = [];
  for (const [kind, a, b] of EMOTES) {
    if (t < a || t > b) continue;
    const inK = easeBack(clamp01((t - a) / 0.2));
    const outK = clamp01((b - t) / 0.15);
    out.push({kind, u: (t - a) / (b - a), scale: inK * outK});
  }
  return out;
};

/* -------------------------------------------------------------- pose */

const rawPos = (t: number) => gobiXZ(t);

export const gobiPoseAt = (t: number): GobiPose => {
  const {x, z} = rawPos(t);
  const p = rawPos(Math.max(0, t - 1 / EP002_FPS));
  const dx = x - p.x;
  const dz = z - p.z;
  const speed = Math.hypot(dx, dz) * EP002_FPS;
  const stomp = kfp(t, STOMP);
  const walk = Math.min(1, Math.max(speed / 1.0, stomp));

  // condong menghadap arah jalan (sebagian saja, supaya wajah tetap terlihat)
  let rotY = rotBase(t);
  if (speed > 0.2) {
    const heading = Math.atan2(dx, dz);
    const d = angleDiff(rotY, heading);
    // memudar menuju 0 saat berlawanan arah (|d| -> PI) supaya rotasi tidak melompat
    const taper = clamp01((2.2 - Math.abs(d)) / 0.6);
    rotY += d * 0.3 * Math.min(1, speed / 1.0) * taper;
  }

  let hop = 0;
  for (const [t0, h, d] of HOPS) hop += h * arc(t, t0, d);

  // goyangan tubuh (roll) dari beberapa momen
  const roll =
    gate(t, 21.3, 22.3) * 0.28 * Math.sin(t * 18) + // goyah di tepi jurang
    gate(t, 61.4, 62.9) * 0.12 * Math.sin(t * 9) + // lapar
    gate(t, 48.7, 49.6) * 0.06 * Math.sin(t * 4) + // berpikir
    gate(t, 54.9, 57.0) * 0.05 * Math.sin(t * 3) + // menunggu bosan
    gate(t, 83.8, 86.0) * 0.06 * Math.sin(t * 5); // mengajak

  // lengan: kepak kecil di momen tertentu
  const flap =
    gate(t, 21.2, 22.1) * 0.25 * Math.sin(t * 20) + // berkibar seperti hampir jatuh
    gate(t, 14.1, 15.9) * 0.12 * Math.sin(t * 10) + // "dua tangan"
    gate(t, 71.3, 75.3) * 0.1 * Math.sin(t * 6); // mengangkat bahu
  const up = Math.max(0, Math.min(1.2, kfp(t, UP) + flap));

  // menanam: naik-turun kecil
  const plantBob = gate(t, 50.4, 52.5) * 0.08 * Math.sin(t * 8);
  const lean = kfp(t, LEAN) + plantBob;

  return {
    x,
    z,
    rotY,
    walk,
    phase: t * 11,
    sit: kfp(t, SIT),
    lie: kfp(t, LIE),
    lean,
    up,
    wave: kfp(t, WAVE),
    tilt: kfp(t, TILT),
    headYaw: kfp(t, HEAD_YAW),
    headPitch: kfp(t, HEAD_PITCH),
    roll,
    surprise: kfp(t, SURPRISE),
    point: kfp(t, POINT),
    hop,
    armFwd: kfp(t, ARM_FWD) + gate(t, 53.8, 54.7) * 0.2 * Math.sin(t * 14),
    squash: squashAt(t),
    blink: blinkAt(t, kfp(t, SURPRISE)),
    happy: kfp(t, HAPPY),
    confuse: kfp(t, CONFUSE),
    hungry: kfp(t, HUNGRY),
  };
};

/* ------------------------------------------------------------ kamera */

/** Bobot shot: 1 = wide (pulau terlihat), 0 = medium (Gobi besar). */
const WIDE_W: Pts = [
  [0, 0], [5.2, 0], [6.1, 1], [11.7, 1], [12.6, 0], // medium kaget -> wide komentar 1 -> medium
  [22.3, 0], [23.6, 1], [27.2, 1], [29.6, 0], // tunjukkan ukuran pulau, kembali dekat secara halus
  [30.6, 0], [35.0, 0], [35.9, 0], // pembangunan rumah: fokus kamera khusus
  [47.2, 0], [48.2, 0], [53.8, 0], [54.7, 0], // pembangunan sawah: fokus kamera khusus
  [63.8, 0], [67.6, 0], [69.2, 1], [69.6, 1], [71.6, 0], // close-up lapar/kaget -> reveal (FOCUS_REVEAL) -> tarik mundur ke wide
  [75.6, 0], [80.3, 0], [83.0, 1], [90, 1], // outro: wide permanen sampai frame terakhir
];
const MED_ZOOM: Pts = [
  [0, 162], [0.7, 162], [1.3, 220], [2.6, 210], [3.3, 188], [4.8, 188], [5.0, 206], [5.5, 180], // close-up \"LAH?!\" & bingung
  [12.7, 172], [14.0, 190], [16.4, 180], [19.5, 178], [20.8, 168], [22.9, 168],
  [28.9, 178], [35.8, 205], [37.0, 180], [41.5, 180], [42.3, 194], [44, 182], [47.6, 182],
  [54.4, 150], [58.5, 150], [58.9, 175], [60.5, 200], [61.4, 230], [63.2, 228], [63.8, 190], // close-up lapar
  [70.2, 140], [75.4, 140], [76.1, 158], [78, 148], [81.2, 140],
];
const FOCUS_FIELD: Pts = [[53.9, 0], [54.6, 0.45], [58.6, 0.45], [59.0, 0], [90, 0]];
/** 1 = bingkai grup (tengah pulau) untuk adegan dengan dua warga. */
const FOCUS_GROUP: Pts = [[69.9, 0], [70.6, 1], [81.4, 1], [82.0, 0], [90, 0]];

/** Fokus reveal dua warga: mendekat ke titik tengah warga + Gobi, lalu tarik mundur. */
const FOCUS_REVEAL: Pts = [[63.8, 0], [65.3, 1], [67.6, 1], [69.2, 0], [90, 0]];
const REVEAL_TARGET = {x: 1.2, z: 1.8, zoom: 78};

/** Dorongan zoom singkat (punch) tepat di momen kaget/senang. Amplitudo kecil, kontinu. */
const KICKS: [number, number][] = [
  [0.87, 0.05], [5.0, 0.03], [22.15, 0.03], [23.5, 0.05], [30.2, 0.03], [34.7, 0.045],
  [35.6, 0.05], [52.2, 0.035], [59.05, 0.05], [63.9, 0.05], [75.95, 0.04],
];
export const camKick = (t: number): number => {
  let k = 0;
  for (const [t0, a] of KICKS) k += a * arc(t, t0, 0.5);
  return k;
};

export type CameraState = {
  target: [number, number, number];
  zoom: number;
  /** 0..1 progres pembesaran pulau (untuk menyesuaikan zoom wide). */
  big: number;
};

/**
 * @param t detik
 * @param scale skala radius pulau saat ini (1 -> ISLAND_EXPANDED_SCALE), dari islandRadiusScale().
 */
export const cameraAt = (t: number, scale: number): CameraState => {
  const w = kfp(t, WIDE_W);
  const g = gobiXZ(t);
  const big = clamp01((scale - 1) / (ISLAND_EXPANDED_SCALE - 1));

  // wide: setengah-mengikuti Gobi; pulau besar -> zoom keluar; dorong lambat di outro
  const push = -2 * clamp01((t - 82.4) / 7.6);
  const wideZoom = 128 - 83 * big + push;
  const wtx = 0.3 * g.x;
  const wtz = 0.3 * g.z;
  const wty = -1.6 - 0.2 * big;

  // medium: ikuti Gobi (kepala di atas-tengah, subtitle di bawah)
  const field = kfp(t, FOCUS_FIELD);
  const group = kfp(t, FOCUS_GROUP);
  let mtx = 0.9 * g.x;
  let mtz = 0.9 * g.z;
  mtx += (1.1 - mtx) * field + (0.2 - mtx) * group;
  mtz += (-1.4 - mtz) * field + (0.4 - mtz) * group;
  const mty = -0.2 - 0.1 * group;
  const medZoom = kfp(t, MED_ZOOM);

  // Selama membangun, sorot objek agar rumah/sawah tetap besar walau pulau kini 6x luas.
  // Transisi perlahan, tidak mengubah scene atau VO yang sudah disetujui.
  const houseFocus = kfp(t, [[0, 0], [29.0, 0], [32.5, 1], [34.1, 1], [37.7, 0], [90, 0]]);
  const fieldFocus = kfp(t, [[0, 0], [47.2, 0], [50.5, 1], [53.1, 1], [56.5, 0], [90, 0]]);
  // dorong pelan selama membangun supaya terasa hidup (bukan sorotan statis)
  const houseZoom = kfp(t, [[29, 100], [32.5, 106], [36, 114], [37.7, 110]]);
  const fieldZoom = kfp(t, [[47, 118], [50.5, 122], [53.1, 130], [56.5, 126]]);
  let x = w * wtx + (1 - w) * mtx;
  let y = w * wty + (1 - w) * mty;
  let z = w * wtz + (1 - w) * mtz;
  let zoom = w * wideZoom + (1 - w) * medZoom;
  if (houseFocus > 0) {
    x += (HOUSE_SPOT.position[0] - x) * houseFocus;
    y += (-0.2 - y) * houseFocus;
    z += (HOUSE_SPOT.position[2] - z) * houseFocus;
    zoom += (houseZoom - zoom) * houseFocus;
  }
  if (fieldFocus > 0) {
    x += (FIELD_SPOT.position[0] - x) * fieldFocus;
    y += (-0.2 - y) * fieldFocus;
    z += (FIELD_SPOT.position[2] - z) * fieldFocus;
    zoom += (fieldZoom - zoom) * fieldFocus;
  }
  const reveal = kfp(t, FOCUS_REVEAL);
  if (reveal > 0) {
    x += (REVEAL_TARGET.x - x) * reveal;
    y += (-0.2 - y) * reveal;
    z += (REVEAL_TARGET.z - z) * reveal;
    zoom += (REVEAL_TARGET.zoom - zoom) * reveal;
  }
  // napas kamera (sangat kecil) + punch di momen aksi
  x += 0.06 * Math.sin(t * 0.45);
  z += 0.05 * Math.cos(t * 0.37);
  zoom *= (1 + 0.008 * Math.sin(t * 0.9)) * (1 + camKick(t));
  return {target: [x, y, z], zoom, big};
};

/* ---------------------------------------------------- efek pulau/kartu */

/** Getar pulau (unit dunia): pulsa singkat di momen kaget/ledakan. */
const SHAKES: [number, number][] = [
  [0.87, 0.9], [5.0, 0.5], [22.15, 0.6], [23.5, 1.0], [24.5, 0.5], [34.7, 0.6], [35.6, 0.8],
  [41.8, 0.5], [59.05, 1.0], [63.9, 0.7], [75.95, 0.7],
];
export const islandShake = (t: number): number => {
  let s = 0;
  for (const [t0, a] of SHAKES) {
    const u = (t - t0) / 0.55;
    if (u >= 0 && u <= 1) s += a * (1 - u) * Math.sin(t * 62);
  }
  return s * 0.05;
};

/** Pulau mengambang pelan (sama dengan Ep001, sedikit lebih kecil). */
export const islandBob = (t: number): number => Math.sin(t * 1.6) * 0.1;

/** Animasi kartu komentar: 0..1 masuk (overshoot), keluar cepat. Mengembalikan skala, opasitas, geser-y. */
export const cardAnim = (t: number, tIn: number, tOut: number) => {
  const inP = clamp01((t - tIn) / 0.5);
  const outP = clamp01((t - tOut) / 0.35);
  const c3 = 2.2 + 1;
  const back = 1 + c3 * Math.pow(inP - 1, 3) + 2.2 * Math.pow(inP - 1, 2);
  const visible = t >= tIn && t < tOut + 0.4;
  return {
    visible,
    scale: (0.6 + 0.4 * back) * (1 - 0.1 * outP),
    opacity: clamp01(inP * 3) * (1 - outP),
    y: (1 - back) * -60 - outP * 70,
    wobble: Math.sin((t - tIn) * 5) * 1.2 * (1 - clamp01((t - tIn) / 1.4)),
  };
};
