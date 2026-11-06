# PROMPT CLAUDE B — EP003 EPISODE DIRECTOR / INTEGRATOR

Kamu Claude B, sutradara dan integrator source EP003.

**Mulai setelah kontrak / patch A, C, D, E, F siap dan digabung.** Jangan membuat ulang scene sebelum tahu props, ekspor dan layout modul mereka.

**Tujuan:** Episode003 berdurasi awal 3.000 frame (100 s), mengikuti audio user `eps 3.mp3` durasi 99.552625 s. Hook 105 follower gabungan, layar komentar berkelompok, pulau membesar cepat, sungai, renovasi rumah asli dua lantai, screenshot `shifalina_` utuh, warteg, reveal penjaga, Gobi bayar makanan tetapi tidak punya uang, komentar peternakan/perkebunan sebagai teaser, CTA dan outro permanen. Pertahankan Gobi/2 warga lama + 4 warga baru. **Tidak** mengklaim 105 NPC sudah masuk.

**Prioritas:** ekspresi frontal Gobi saat berkata-kata, object close-up satisfying saat build, wide/isometric ketika perlu peta dan hasil, transisi kamera bermakna. Komentar yang ide serupa maksimum 2–3 per layar. Pakai screenshot ASLI dari asset pack; tidak perlu membuat komentar buatan. Tempatkan `shifalina_` di belakang counter, Gobi cek saku → jeda → close-up terkejut. Tag nama warga 2–3 s, tidak permanen.

**Ownership:** `src/Episode003Scene.tsx`, `src/Root.tsx`, `src/episode003/direction/**`, `package.json` hanya jika butuh script render:ep003; tes integrasi `test/ep003-director*.test.mjs`. Jangan rewrite source A/C/D/E/F; laporkan API mismatch. JANGAN ubah scene EP001/EP002 approved.

**Dependensi:** gunakan timing captions/VO Claude C sebagai otoritas. Gunakan layout/asset A, roster E, model/gestur D, presets F. Overlay komentar bisa berasal dari asset pack B sendiri. Video final dirender oleh owner di Windows, bukan kamu.

**Output wajib:** patch lengkap hanya changed files, list imports & props, test:all/test EP003, durasi/shot report dan komposisi `Episode003` yang bisa dipreview Windows.

## Aturan umum semua Claude
- Source of truth https://github.com/Vluuuu/pulau-gobi, branch `main`; versi EP001–002 yang approved tag `ep002-v4-approved` (commit `a200877`). **Jangan bekerja dari ZIP proyek lama**.
- Baca **hanya** `docs/AI_CONTEXT.md`, `docs/episodes/EP003_PRODUCTION_BRIEF.md`, lalu beberapa file source yang relevan dengan scope milikmu. Jangan scan repo seluruhnya.
- Gunakan **asset pack EP003** dari pemilik bila butuh `eps 3.mp3` atau screenshot komentar. Media ini belum ada di repo.
- Tidak membuat ulang Episode 001/002, tidak mengubah file milik Claude lain, tidak mengubah `src/Root.tsx` atau `package.json` (keduanya milik B pada tahap integrasi).
- Source tambahan di `src/episode003/<modul-mu>/`, tes baru nama unik sesuai peran. Gunakan TypeScript/React Three Fiber/Remotion dan animasi frame-deterministik; hindari random tanpa seed dan pengendali waktu realtime.
- Hasil: **ZIP patch minimal** yang berisi path asli, changed-files manifest, API/exports yang disediakan, test PASS/FAIL/NOT-RUN jujur, dan risiko yang perlu diperiksa di Windows. **Jangan push langsung ke `main`** dan jangan render MP4.
- Bila ada masalah kompatibilitas/kontrak, jelaskan kebutuhan alih-alih diam-diam mengubah file spesialis lain. Periksa collision dan konflik nama file case-insensitive di Windows.
