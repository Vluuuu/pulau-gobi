# Pulau Gobi — source produksi Episode 001–002

**Baseline resmi: Episode 002 V4 (Windows Import Fix)**, telah dirender dan disetujui pemilik pada 6 November 2026.

## Jalankan lokal

```powershell
npm ci       # setelah package-lock.json dibuat dan di-commit
npm run dev  # Remotion Studio; pilih Episode002
npm run test:all
npm run render:ep002
```

Jika belum ada package-lock.json, jalankan `npm install` terlebih dulu. `Episode001` tetap tersedia. Target render standar 1080×1920, 30 FPS. Audio MP3 dan screenshot komentar asli tersimpan di `public/`; MP4 tidak disimpan di Git.

## Dunia yang harus dipertahankan
- Pulau utama besar radius 11,7 unit (Episode 001 radius 3).
- Rumah kayu pertama, petak sawah padi belum panen.
- Gobi dan dua warga komentator terpilih: `oktaa.blushh` dan `Afriza SuperStore`.
- Pohon, semak, bunga, rumput, kerikil, awan dan batu hasil Episode 002 menjadi bagian lingkungan.

Lihat `docs/world/EP002_STATE.json` dan `docs/episodes/EP002_RELEASE.md` pada repo untuk snapshot kontinuitas.

**Outro permanen:** Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!

**Catatan:** snapshot JSON di `docs/world` masih dokumentasi editorial, belum otomatis dikonsumsi renderer TypeScript.
