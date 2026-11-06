# PROMPT CLAUDE F — EP003 CINEMATOGRAPHY

Kamu Claude F, spesialis kamera, shot transitions dan lighting Pulau Gobi. **Ini peran baru; targetnya modul reusable**, bukan cinematic redo Episode 002.

**Kontrak shot yang wajib ada:** `GobiFrontCloseup`, `GobiReaction`, `OverShoulder`, `ObjectDetail`, `ConstructionReveal`, `IslandWide`. Ketika Gobi bicara, kamera frontal/three-quarter sejajar wajah (bukan selalu dari atas); ketika membangun sungai/rumah/warteg, gunakan detail objek besar; setelah itu wide/isometric reveal menunjukkan hubungan lokasi lama-baru. Tambahkan medium/two-shot counter untuk adegan `shifalina_` meminta bayaran; shot saku Gobi bila memungkinkan.

**Orkestrasi:** sediakan preset fungsi frame-based dengan interpolasi smooth tanpa whip, menghindari clipping dan perubahan zoom mendadak. Kamera boleh orthographic meskipun sudut frontal; cek ukuran subjek untuk 1080×1920. Light/shadow warm cozy konsisten EP002, tidak membuat scene overbright. F menyediakan API shot-focus/target/transition yang akan dipakai B, bukan mengatur sendiri naskah EP003.

**Koordinat:** fokus world objects diambil dari `src/episode003/world/worldLayout` yang disediakan A. Jika A belum siap, ekspor API kamera yang menerima target transform argumen, bukan hardcode posisi warteg/sungai. Kamera harus bisa framing pulau jauh lebih besar tanpa mengecilkan Gobi pada close-up. Radius ~35–40 masih desain, buat parameter.

**Ownership:** `src/episode003/camera/**` dan `test/ep003-camera*.test.mjs` saja. Jangan edit episode scene B, asset A, character D, captions C, atau `src/Root.tsx`.

**Tes:** continuous frame jump/zoom, safe area caption+name tag, edge of world, close-up Gobi, close-up warteg/sungai/rumah, transition to wide; jelaskan bahwa ini numerik dan visual perlu preview Windows.

## Aturan umum semua Claude
- Source of truth https://github.com/Vluuuu/pulau-gobi, branch `main`; versi EP001–002 yang approved tag `ep002-v4-approved` (commit `a200877`). **Jangan bekerja dari ZIP proyek lama**.
- Baca **hanya** `docs/AI_CONTEXT.md`, `docs/episodes/EP003_PRODUCTION_BRIEF.md`, lalu beberapa file source yang relevan dengan scope milikmu. Jangan scan repo seluruhnya.
- Gunakan **asset pack EP003** dari pemilik bila butuh `eps 3.mp3` atau screenshot komentar. Media ini belum ada di repo.
- Tidak membuat ulang Episode 001/002, tidak mengubah file milik Claude lain, tidak mengubah `src/Root.tsx` atau `package.json` (keduanya milik B pada tahap integrasi).
- Source tambahan di `src/episode003/<modul-mu>/`, tes baru nama unik sesuai peran. Gunakan TypeScript/React Three Fiber/Remotion dan animasi frame-deterministik; hindari random tanpa seed dan pengendali waktu realtime.
- Hasil: **ZIP patch minimal** yang berisi path asli, changed-files manifest, API/exports yang disediakan, test PASS/FAIL/NOT-RUN jujur, dan risiko yang perlu diperiksa di Windows. **Jangan push langsung ke `main`** dan jangan render MP4.
- Bila ada masalah kompatibilitas/kontrak, jelaskan kebutuhan alih-alih diam-diam mengubah file spesialis lain. Periksa collision dan konflik nama file case-insensitive di Windows.
