import {Easing, interpolate} from 'remotion';

export const FPS = 30;
// MP3 = 24.19 dtk. Video 26 dtk supaya ada jeda penutup (Gobi + pulau kosong).
export const DURATION_IN_FRAMES = 26 * FPS;

export type Pts = [number, number][];

/** Keyframe sederhana (detik -> nilai), easing in-out, clamp di ujung. */
export const kf = (t: number, pts: Pts): number =>
  interpolate(
    t,
    pts.map((p) => p[0]),
    pts.map((p) => p[1]),
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.inOut(Easing.quad),
    },
  );

export type CaptionWord = {text: string; start: number; end: number};
export type CaptionCue = {start: number; end: number; words: CaptionWord[]};

/**
 * Bangun cue dari teks: waktu tiap kata dibagi proporsional panjang kata
 * (tanda baca = jeda sedikit lebih panjang). Ini ESTIMASI, bukan word-level
 * hasil analisis audio. Untuk koreksi per kata, ganti `cue(...)` dengan
 * literal {start, end, words: [{text, start, end}, ...]}.
 */
const cue = (start: number, end: number, text: string): CaptionCue => {
  const raw = text.split(' ');
  const weights = raw.map((w) => w.replace(/[^\p{L}\p{N}-]/gu, '').length + 2 + (/[.,?!]$|\.\.\./.test(w) ? 1.5 : 0));
  const total = weights.reduce((a, b) => a + b, 0);
  let acc = start;
  const words = raw.map((w, i) => {
    const d = ((end - start) * weights[i]) / total;
    const out = {text: w, start: acc, end: acc + d};
    acc += d;
    return out;
  });
  return {start, end, words};
};

/**
 * Subtitle V2: frasa pendek (2-5 kata). Timestamp PERKIRAAN (detik) -- edit di
 * sini setelah preview. Gabungan semua frasa = naskah VO V1 (tidak diubah).
 */
export const CAPTIONS: CaptionCue[] = [
  cue(0.3, 0.95, 'Hah?'),
  cue(1.05, 2.7, 'Aku di mana ini?'),
  cue(3.1, 4.7, 'Kok kosong banget?'),
  cue(4.8, 6.0, 'Rumah nggak ada...'),
  cue(6.05, 7.3, 'pohon juga nggak ada.'),
  cue(7.6, 8.9, 'Eh, bentar...'),
  cue(9.0, 9.8, 'WOI!'),
  cue(9.85, 11.3, 'Ini pulaunya melayang?!'),
  cue(11.6, 13.3, 'Terus aku tinggal di sini?'),
  cue(13.4, 13.95, 'Lah...'),
  cue(14.0, 15.4, 'nanti tidur di mana?'),
  cue(15.6, 17.3, 'Eh, kalian bantuin aku, dong!'),
  cue(17.4, 18.3, 'Menurut kalian,'),
  cue(18.35, 19.4, 'kita harus bikin apa dulu'),
  cue(19.45, 20.3, 'di pulau ini?'),
  // Outro (teks persis), ditampilkan bertahap
  cue(20.4, 21.65, 'Kalian yang komen,'),
  cue(21.7, 22.85, 'kita yang bangun.'),
  cue(22.9, 23.65, 'Yuk, bangun pulau'),
  cue(23.7, 24.5, 'ini bareng-bareng!'),
];

// Kamera isometrik
export const CAM_OFFSET: [number, number, number] = [10, 10, 10];
export const FACE_CAMERA = Math.PI / 4; // arah hadap Gobi ke kamera
