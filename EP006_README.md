# Pulau Gobi EP006 — koreksi blocking dan kamera

**BELUM DISETUJUI secara visual.** Koreksi empat P0 pada branch `codex/ep006-production`, baseline revisi **`c652fc9`**; world awal tetap berasal dari `3759f2e`. Ini revisi implementasi yang sama, tanpa mengganti VO/naskah/roster, tanpa modifikasi Episode 001–005. Tidak push/merge.

Laporan empat koreksi dan pemeriksaan minimal terbaru: [EP006_FINAL_BLOCKING_CORRECTION.md](docs/episodes/EP006_FINAL_BLOCKING_CORRECTION.md). Daftar file revisi ini: [EP006_CHANGED_FILES.txt](docs/episodes/EP006_CHANGED_FILES.txt). Catatan revisi sebelumnya tetap historis: [EP006_MAJOR_REVISION.md](docs/episodes/EP006_MAJOR_REVISION.md) dan [EP006_REVISION_VALIDATION.md](docs/episodes/EP006_REVISION_VALIDATION.md).

Afriza SuperStore (`warga-2`), penghalang langsung pintu A01, kini berada di sisi halaman barat bersama pengunjung lama lainnya. Ghanim dan Gobi memiliki bay foyer terpisah. Delapan murid memakai slot dan jadwal lintas yang berbeda, mengitari daun pintu terbuka, mendekati kursi dari samping, serta menyeberang satu file dengan kecepatan bersama. Dek tetap berukuran sama, dengan Damia mengajar dari tepian timur dan bay belakang terpisah bagi Ghanim/Gobi. Kamera S17/S18 dan master jembatan memakai three-quarter medium-wide; pohon ID 83/111 tetap pada posisi baseline.

## Windows — preview oleh pemilik

World Viewer:

```powershell
cd D:\pulau-gobi\ep006-production
npm run viewer
```

Buka **http://localhost:4173/**. Gunakan panel sekolah/A01 untuk inspeksi; cutaway masih tersedia hanya bila dipilih pemilik di viewer. Viewer memakai pose inspeksi siang hari, bukan timeline episode. Port alternatif: `npm run viewer -- --port 4174`. `Ctrl+C` untuk berhenti.

Remotion Studio pada terminal kedua:

```powershell
cd D:\pulau-gobi\ep006-production
npm run dev -- --port 3006
```

Buka **http://localhost:3006/** dan pilih **Episode006**. **1080×1920, 30 FPS, 4649 frame / 154,966667 detik.** Dependencies worktree sudah memakai junction ke `D:\pulau-gobi\world-viewer\node_modules`; tidak perlu install ulang. Checkout baru tanpa dependencies dapat memakai `npm ci` satu kali.

## Kondisi source saat ini

- Hulu sungai dijauhkan dari plaza/gerbang. Hilir dan bibir waterfall EP005 tetap. Delapan murid berdiri dua baris × empat, dengan jalur kelompok, satu jembatan dan dek observasi yang disambung ramp. Rumah, kost, kebun/sawah/stok, pohon pertama Irtiza, seluruh ID tanaman dan tiga sapi tetap dipertahankan. Tanaman yang terkena layout direlokasi dalam snapshot.
- 38 beat tetap, kini dengan kamera perspective yang disutradarai per shot. Interior memakai ruang lengkap dengan kamera di dalam A01/foyer, empat jenis sudut kelas, lampu plafon existing, papan tulis berkontras jelas. Lima pengunjung lama memakai slot di area halaman barat; Gobi dan Ghanim memiliki bay foyer di luar jalur pintu.
- Artikulasi opt-in siku/lutut untuk Gobi, Damia dan Ghanim memakai model/palet/wajah existing. Murid memiliki sendi, stance foot yang mengikuti jarak, duduk bertahap ke kursi asli dan footrest, aktivitas/timing berbeda. Mulut Gobi memakai energi audio aktual, bukan klaim phoneme alignment.
- Gag ikan: approach/ripple → leap → busur air menuju kepala sekolah → SFX pada kontak → recoil, ekspresi, wipe dan drip → reaksi murid/Gobi. SFX berupa satu transien teredam saat VO, tanpa dengung terus-menerus.
- Outro visual tetap **CurrentWorld EP006**, kamera/lighting berjalan terus. Hanya **audio VO19 resmi EP004** yang dipakai lengkap, sekali, dengan level RMS disesuaikan ke VO utama. Tidak memasang composition/visual dunia EP004. Penutup dan hold asli tetap utuh.

MP3 `eps6.mp3` tetap utuh. **4.801.020 sampel cerita** dipertahankan identik; tidak ada pemotongan kata atau percepatan. CTA duplikat master diganti pada jeda yang sama dengan VO19 lengkap. Hold masuk kelas ditambah 3 detik untuk blocking; jeda sebelum CTA diperpendek 0,4 detik pada silence saja. Caption ASR tetap provisional dan membutuhkan listening review.

Nama/ID dari commit sebelumnya tidak diganti: delapan murid (termasuk `capiwasa` yang dikonfirmasi pemilik), total **22 warga + Gobi**, sapi **Sappy / Oopet / Rembo**. `damar_zan` tetap `warga-4`. Angka 361 hanya berasal dari ucapan master; data calon warga tetap `null`, tanpa counter baru. Jembatan tetap satu aset rekonstruksi EP006 karena tidak ada model jembatan pada baseline `3759f2e`; catatan asal itu tidak berubah.

Tidak ada MP4, still, screenshot, preview browser, build, atau audit kamera otomatis dari quality pass ini. Review estetika, seluruh kontak/clipping, timing ucapan/caption dan persetujuan akhir menunggu preview pemilik.
