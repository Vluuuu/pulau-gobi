/**
 * Subtitle Episode 002 -- data timing (detik, relatif ke awal MP3 episode002.mp3 = 88.19 dtk).
 *
 * STATUS TIMING: ESTIMASI (belum diverifikasi dengan telinga/preview).
 * Cara pembuatan: batas ucapan/jeda diukur dari audio asli (ffmpeg silencedetect -38 dB),
 * naskah VO_SCRIPT_EP002.txt dicocokkan ke segmen suara secara berurutan, lalu waktu
 * tiap kata dibagi menurut jumlah suku kata di dalam segmen suara. TIDAK ada ASR/Whisper,
 * jadi batas kata di dalam satu kalimat adalah perkiraan. Teks mengikuti naskah acuan,
 * bukan transkripsi MP3 -- kalau MP3 berbeda, ikuti MP3.
 *
 * CARA KOREKSI setelah preview: ubah angka di array `starts` (detik awal tiap kata) dan
 * `end` (detik akhir kata terakhir). Akhir tiap kata = awal kata berikutnya, jadi cukup
 * geser satu angka. Cue bertanda `check: true` = keselarasan paling meragukan
 * (kalimat terlalu padat/longgar dibanding durasi suaranya), periksa dulu.
 */
export type CaptionWord = {text: string; start: number; end: number};
export type CaptionCue = {
  start: number;
  end: number;
  words: CaptionWord[];
  /** true = timing hasil estimasi (bukan alignment per kata dari audio). */
  estimated?: boolean;
  /** true = keselarasan paling meragukan, periksa dulu di preview. */
  check?: boolean;
};

export const EP002_TIMING_STATUS = 'ESTIMATED' as const;

/** Outro permanen -- harus persis seperti ini. */
export const EP002_OUTRO_TEXT = 'Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!';

/** Cue(teks, awal tiap kata, akhir cue). Jumlah angka `starts` harus sama dengan jumlah kata. */
const c = (text: string, starts: number[], end: number, opts: {check?: boolean} = {}): CaptionCue => {
  const raw = text.split(' ');
  if (raw.length !== starts.length) {
    throw new Error(`captionTimeline: "${text}" punya ${raw.length} kata tapi ${starts.length} waktu`);
  }
  return {
    start: starts[0],
    end,
    estimated: true,
    ...(opts.check ? {check: true} : {}),
    words: raw.map((w, i) => ({text: w, start: starts[i], end: i + 1 < raw.length ? starts[i + 1] : end})),
  };
};

export const EP002_CAPTIONS: CaptionCue[] = [
  c("LAH?! Kemarin aku", [0.00, 0.87, 1.32], 1.63, {check: true}),
  c("cuma minta ide...", [1.63, 1.93, 2.24], 2.61),
  c("Kok sekarang kalian", [3.11, 3.24, 3.65], 4.05),
  c("nyuruh aku bangun", [4.05, 4.32, 4.58], 4.85),
  c("satu desa?!", [4.85, 5.12], 5.39),
  c("Ini nih!", [5.88, 6.21], 6.37),
  c("Katanya pulaunya harus digedein,", [6.80, 6.97, 7.20, 7.31], 7.54, {check: true}),
  c("terus bikin rumah,", [7.54, 7.65, 7.77], 7.88, {check: true}),
  c("sama nyiapin makanan", [7.88, 7.99, 8.16], 8.33, {check: true}),
  c("dan minuman.", [8.33, 8.39], 8.56, {check: true}),
  c("Ya ampun...", [8.91, 9.21], 9.96, {check: true}),
  c("aku kan cuma", [10.20, 10.52, 10.68], 11.01),
  c("punya dua tangan!", [11.01, 11.33, 11.65], 11.98),
  c("Oke! Pertama,", [12.53, 13.11], 13.63),
  c("kita gedein dulu pulaunya!", [13.63, 14.32, 14.83, 15.17], 15.86),
  c("Soalnya tiap jalan", [16.53, 17.47, 18.07], 18.46),
  c("tiga langkah...", [18.46, 18.84], 19.33),
  c("udah ketemu jurang.", [19.76, 20.33, 21.18], 21.75, {check: true}),
  c("Nahhh! Gini dong!", [22.00, 23.70, 24.87], 25.46, {check: true}),
  c("Sekarang aku bisa", [25.78, 26.31, 26.66], 27.01),
  c("jalan tanpa takut jatuh!", [27.01, 27.36, 27.71, 28.06], 28.41),
  c("Selanjutnya... RUMAH!", [29.00, 30.17], 30.69),
  c("Pondasi dulu...", [31.12, 31.62], 32.04),
  c("terus dinding...", [32.38, 32.80], 33.32),
  c("dan terakhir, ATAP!", [33.64, 33.75, 34.11], 34.35),
  c("YES! Akhirnya aku", [34.62, 35.57, 36.42], 36.86, {check: true}),
  c("punya rumah sendiri!", [36.86, 37.29, 37.72], 38.36),
  c("Malam ini nggak", [38.75, 39.09, 39.43], 39.60),
  c("perlu tidur di rumput lagi!", [39.60, 39.94, 40.28, 40.45, 40.79], 41.13),
  c("Eh? Ada komentar lagi?", [41.78, 42.37, 42.66, 43.08], 43.37),
  c("Katanya aku harus", [43.87, 44.29, 44.57], 44.85),
  c("bikin peternakan...", [44.85, 45.13], 45.76),
  c("atau nanam padi.", [45.91, 46.00, 46.10], 46.20, {check: true}),
  c("Hmm... padi dulu aja, deh!", [46.52, 46.76, 47.11, 47.46, 47.80], 47.98, {check: true}),
  c("Biar ada makanan!", [48.63, 49.01, 49.77], 50.34),
  c("Nah! Udah ditanam!", [50.61, 52.10, 52.61], 53.37, {check: true}),
  c("Sekarang tinggal", [53.68, 54.21], 54.55),
  c("nunggu nasinya matang!", [54.55, 54.90, 55.42], 55.77),
  c("Lho? Kok masih ijo?", [56.35, 56.93, 57.12, 57.49], 57.86),
  c("HAH?! PADINYA", [58.37, 59.00], 59.48, {check: true}),
  c("HARUS NUNGGU PANEN?!", [59.48, 59.80, 60.12], 60.44),
  c("LAH, AKU", [60.83, 61.00], 61.62),
  c("LAPARNYA SEKARANG!", [61.62, 62.14], 62.65),
  c("Eh?! Bentar...", [63.22, 63.66], 63.95),
  c("siapa kalian?!", [64.30, 64.70], 65.10),
  c("LAH?! Yang kemarin", [65.61, 66.19, 66.34], 66.78),
  c("komen malah jadi", [66.78, 67.08, 67.38], 67.68),
  c("warga di sini juga?!", [67.68, 67.97, 68.12, 68.42], 68.72),
  c("Sebentar, sebentar...", [69.29, 69.64], 70.04),
  c("Sekarang kita bertiga...", [70.44, 71.00, 71.38], 72.04),
  c("rumahnya cuma satu...", [72.28, 72.78, 73.11], 73.70),
  c("padinya belum bisa dimakan!", [73.96, 74.40, 74.69, 74.98], 75.41),
  c("Ini pulau apa", [75.88, 76.19, 76.49], 76.80),
  c("tempat uji kesabaran, sih?!", [76.80, 77.11, 77.41, 78.02], 78.18),
  c("Aduh... kalian punya", [78.79, 79.82, 80.21], 80.46, {check: true}),
  c("ide biar kita", [80.46, 80.72, 80.97], 81.23),
  c("nggak kelaparan?", [81.23, 81.36], 81.87),
  c("Tulis di komentar, ya!", [82.25, 82.54, 82.69, 83.14], 83.28),
  c("Kalian yang komen,", [83.72, 84.23, 84.40], 85.00),
  c("kita yang bangun.", [85.00, 85.34, 85.51], 85.85),
  c("Yuk, bangun pulau", [86.17, 86.32, 86.84], 87.14),
  c("ini bareng-bareng!", [87.14, 87.44], 88.03),
];

/** Jumlah cue terakhir yang membentuk outro (4 frasa). */
export const EP002_OUTRO_CUES = 4;
