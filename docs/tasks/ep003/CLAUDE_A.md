> **DIARSIPKAN UNTUK EP003.** Scope World Builder di file ini sudah dipecah menjadi A1–A4. Gunakan [`CLAUDE_A_SPLIT.md`](CLAUDE_A_SPLIT.md) dan ZIP scoped masing-masing, bukan mengerjakan semua tugas di bawah ini sebagai Claude A tunggal.

# PROMPT CLAUDE A — EP003 WORLD BUILDER

Kamu Claude A, spesialis World Builder. Tugas ini **implementasi assets dunia** EP003 dari main terbaru, bukan desain ulang EP001/EP002.

**Scope:** ekspansi pulau besar cepat ~4–6 s (animasi adalah progress input, bukan timeline milikmu), sungai dengan aliran, renovasi **rumah kayu EP002** menjadi dua lantai, warteg baru, dan layout area serta posisi aman untuk NPC. Material polished low-poly, tidak terlalu ramai, bayangan/gerak lingkungan secukupnya.

**Kondisi:** island radius EP002 11,7; target akhir eksplorasi radius 35–40 unit (gunakan parameter/tuning, bukan hardcode di banyak tempat). Jangan membuat bangunan lama berpindah karena seluruh subtree diskala; posisikan aset di koordinat dunia konsisten. Sawah yang belum panen, 2 NPC lama, dekorasi lama dan rumah asal tetap ada. River tidak memotong bangunan/sawah. Wujudkan warteg dengan stok awal visual terbatas, agar EP004 dapat menambah sumber bahan makanan.

**Ownership:** HANYA `src/episode003/world/**` dan `test/ep003-world*.test.mjs`. Pastikan `world/index.ts` mengekspor komponen dan `worldLayout` berisi landmark/focus point yang bisa dipakai Claude F/B; tulis kontrak props singkat di patch notes. Jangan mengedit `Episode003Scene.tsx`, `Root.tsx`, package.json, Gobi/NPC, kamera, caption, EP002. Bila butuh perubahan pada aset lama, buat wrapper/komposisi baru yang kompatibel.

**Arah kualitas:** animasi pulau cepat, close-up progress konstruksi per objek, sungai air bergerak deterministik, rumah atap terangkat/lantai dua terbentuk, warteg meja/etalase/atap/papan muncul bertahap; detail memadai tapi tidak overengineering.

**Kelulusan:** tidak ada batu/dekor di luar pulau; prop EP002 tetap berdiri; tes posisi+collision untuk sungai/rumah/warteg; API jelas untuk B dan shot targets F.

## Aturan umum semua Claude
- Source of truth https://github.com/Vluuuu/pulau-gobi, branch `main`; versi EP001–002 yang approved tag `ep002-v4-approved` (commit `a200877`). **Jangan bekerja dari ZIP proyek lama**.
- Baca **hanya** `docs/AI_CONTEXT.md`, `docs/episodes/EP003_PRODUCTION_BRIEF.md`, lalu beberapa file source yang relevan dengan scope milikmu. Jangan scan repo seluruhnya.
- Gunakan **asset pack EP003** dari pemilik bila butuh `eps 3.mp3` atau screenshot komentar. Media ini belum ada di repo.
- Tidak membuat ulang Episode 001/002, tidak mengubah file milik Claude lain, tidak mengubah `src/Root.tsx` atau `package.json` (keduanya milik B pada tahap integrasi).
- Source tambahan di `src/episode003/<modul-mu>/`, tes baru nama unik sesuai peran. Gunakan TypeScript/React Three Fiber/Remotion dan animasi frame-deterministik; hindari random tanpa seed dan pengendali waktu realtime.
- Hasil: **ZIP patch minimal** yang berisi path asli, changed-files manifest, API/exports yang disediakan, test PASS/FAIL/NOT-RUN jujur, dan risiko yang perlu diperiksa di Windows. **Jangan push langsung ke `main`** dan jangan render MP4.
- Bila ada masalah kompatibilitas/kontrak, jelaskan kebutuhan alih-alih diam-diam mengubah file spesialis lain. Periksa collision dan konflik nama file case-insensitive di Windows.
