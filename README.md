# Pulau Gobi

**Penonton mengusulkan pembangunan. Gobi menjalani konsekuensinya.**

Serial animasi pendek low-poly 3D berbahasa Indonesia, dibangun dengan TypeScript, React, Three.js/React Three Fiber dan Remotion.

## Status terbaru (6 November 2026)
- **Episode 001:** sudah dirender dan dipublikasikan; Gobi sendiri di pulau kecil.
- **Episode 002:** sudah dirender dan disetujui (V4 Windows Fix); pulau besar, rumah pertama, sawah, serta dua komentator menjadi warga.
- Snapshot kontinuitas: [EP001](docs/world/EP001_STATE.json) dan [EP002](docs/world/EP002_STATE.json).
- [Catatan versi final Episode 002](docs/episodes/EP002_RELEASE.md).
- **Source code produksi sedang disinkronkan ke main**. Selama folder `src/` dan `package.json` belum ada di root repository, gunakan ZIP V4 yang sudah dirender di laptop; jangan mengklaim repo sudah bisa dibuild.

## Cara menjalankan (setelah source tersimpan di root repo)
```powershell
npm install
npm run dev
npm run test:all
npm run render:ep002
```

Hasil render MP4 tidak dimasukkan ke Git. Arsip sementara, `node_modules`, dan kredensial juga tidak di-commit.

## Identitas produksi
- Gobi: pemuda sederhana, kaos oranye, celana pendek navy, sepatu krem.
- Setiap komentar yang **dipilih** berkesempatan menjadi warga bernama; hanya warga yang dibutuhkan adegan ditampilkan di layar.
- Dunia berkembang tanpa mereset rumah, sawah, warga atau pulau sebelumnya.
- Durasi dan caption fleksibel; yang utama cerita, reaksi Gobi, pembangunan satisfying, dan interaksi penonton.
- Outro tetap: **"Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!"**

Mulai sesi AI dari [`docs/AI_CONTEXT.md`](docs/AI_CONTEXT.md), lalu buka dokumentasi lain hanya jika diperlukan.
