# EP002 — Release baseline V4 (disetujui)

**Status per 2026-11-06:** video Episode 002 sudah dirender di laptop Windows, ditonton, dan disetujui pemilik proyek. Tidak diperlukan remake.

## Identitas produksi
- Source release yang disetujui: `pulau-gobi-ep002-v4-windows-import-fixed.zip` (perbaikan konflik nama modul Windows dari versi polish V4).
- SHA-256 ZIP sumber: `a803070cee4d22e9b14ad739b929c6632260622df6d115f62ad2885d03884f1d`.
- Video render yang ditinjau: `episode002.mp4` — 1080 × 1920, 30 FPS, 90 detik; disimpan di luar repo.
- SHA-256 video yang ditinjau: `2e814d622db5790e5ee0baff8304b79c1f609ca74599f49ac292d261d567ae43`.
- VO: `public/episode002.mp3`, sekitar 88,19 detik.
- Komposisi: `Episode002` di `src/Root.tsx`.
- Script preview/render: `npm run dev`, `npm run render:ep002`.
- Tes numerik: `npm run test:all` PASS saat diperiksa; pengujian ini tidak menggantikan peninjauan hasil render.

## Perubahan dunia permanen
1. Pulau utama radius 3 → 11,7 unit (luas sekitar 15,21× dibanding EP001, dan ~5,94× dibanding versi awal pulau besar EP002).
2. Rumah kayu pertama dibangun pada (-5, 0, -1), skala 1,65.
3. Sawah padi dibuat pada (4,9, 0, -2,6), skala 1,9; **belum siap panen**.
4. Dua komentator terpilih menjadi warga bernama `oktaa.blushh` dan `Afriza SuperStore`, gerak NPC sederhana. Gobi tetap protagonis.
5. Pulau memiliki dekorasi low-poly yang sekarang menjadi bagian lingkungan, termasuk pohon, semak, bunga, rumput dan kerikil.

Sumber data snapshot: [`../world/EP002_STATE.json`](../world/EP002_STATE.json). Episode 003 **harus mempertahankan** rumah, sawah, dua warga, dan ukuran pulau ini.

## Status source GitHub (terverifikasi 2026-11-06)
**Source produksi lengkap sudah di-push** ke `main`, commit `a200877e02056c1f4f4caa24eea9505a118739fd`; tag `ep002-v4-approved`. Berkas source, `package.json`, `package-lock.json`, MP3 dan screenshot komentar ada di repo; MP4 tidak di-commit. Baseline Episode 003 adalah GitHub tag tersebut, bukan ZIP lawas.

## Cara kerja Episode berikutnya
Gunakan source EP002 V4 final sebagai fondasi, patch minimal per komponen, lalu Windows melakukan preview dan render. Outro permanen tidak berubah: **"Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!"**
