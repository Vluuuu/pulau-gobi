# AI_CONTEXT — Pulau Gobi (terbaru 2026-11-06)

## Status produksi yang berlaku
- **Episode 001 telah dirender dan dipublikasikan.**
- **Episode 002 V4 Windows Fix sudah dirender di laptop dan disetujui.** Format 1080×1920, 30 FPS, 90 detik; VO sekitar 88,19 detik.
- Source baseline final: `pulau-gobi-ep002-v4-windows-import-fixed.zip`, SHA-256 `a803070cee4d22e9b14ad739b929c6632260622df6d115f62ad2885d03884f1d`.
- **Sinkronisasi source ke GitHub belum selesai sebelum root repo memiliki `src/`, `public/`, `test/`, `package.json`.** Jangan kembali ke scaffold docs-only atau membangun proyek dari nol.
- Snapshot editorial Episode 001/002 ada di `docs/world/`, catatan release di `docs/episodes/EP002_RELEASE.md`. JSON ini belum menjadi input runtime otomatis.
- Rencana selanjutnya: mulai Episode 003 dari state setelah EP002; pilih komentar baru dan lanjutkan cerita.

## Dunia setelah Episode 002
- Satu pulau utama melayang, radius 11,7 unit, kamera orthographic/isometric.
- Gobi tetap karakter utama.
- Rumah kayu di (-5,0,-1) skala 1,65; sawah di (4,9,0,-2,6) skala 1,9, padi belum panen.
- Dua warga permanen dari komentar terpilih: `oktaa.blushh` dan `Afriza SuperStore`. NPC sederhana jalan-berhenti-balik, nama tampil saat perkenalan.
- Dekorasi low-poly kini bagian dunia; jangan menghilangkan aset lama tanpa alasan cerita.
- Masalah cerita tersisa: satu rumah untuk tiga penghuni dan makanan belum tersedia.

## Peran dan batas kerja
- **ChatGPT:** strategi, naskah, brief, QA, integrasi GitHub.
- **Claude A:** aset lingkungan/bangunan; **B:** scene/acting/kamera; **C:** subtitle/VO timing; **D:** NPC/perbaikan sesuai kebutuhan.
- **Windows:** `npm install`, Studio, render dan QA.
- Hanya patch minimal dari source baseline; hindari engine besar, AI NPC, physics, audit repo berulang dan riset skills tidak relevan.
- Remotion + React Three Fiber/Three.js, TypeScript, animasi deterministik frame-based.
- Jangan mengklaim hasil render atau typecheck tanpa bukti.

## Identitas yang tidak boleh diubah
- Nama serial: **Pulau Gobi**. Bahasa seluruh konten Indonesia.
- Gobi: kaos oranye, celana navy, sneakers krem.
- Outro harus persis: **"Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!"**
- Episode 001 dimulai pulau kosong; Episode 002 memperluas pulau, membangun rumah/sawah dan menambah dua warga.
- Durasi, caption media sosial, panjang video bersifat fleksibel, bukan target tetap.
- Pelajari `docs/DECISIONS.md` atau `docs/WORLD_RULES.md` hanya jika tugas membutuhkan rincian.
