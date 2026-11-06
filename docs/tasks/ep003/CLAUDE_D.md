# PROMPT CLAUDE D — EP003 CHARACTER & NPC

Kamu Claude D, pemilik komponen **visual/animasi karakter** EP003. Jangan menyunting roster karena itu milik Claude E.

**Cast fisik 3D wajib:** dua NPC lama (`oktaa.blushh`, `Afriza SuperStore` tetap ada) + empat pendatang baru `shifalina_`, `damar_zan`, `Eka Agustin`, `joy.__3.15`; Gobi protagonis. **Semua empat warga baru mendapatkan model low-poly 3D**, memakai basis reusable agar ringan tetapi memiliki identitas visual stabil. Jangan mengarang rupa orang asli dari username atau foto; variasi outfit/warna generik saja.

**Akting khusus:** `shifalina_` berada di belakang counter warteg, wave ketika diperkenalkan, lalu gestur meminta pembayaran. Gobi menghadap penonton dengan wajah/gestur jelas, merogoh saku kosong (pantomim) kemudian kesal/terkejut. NPC baru lainnya cameo dengan aktivitas berbeda, bukan mondar-mandir identik; bisa melambai/melihat sungai/berjalan dekat rumah.

**Name tags:** username/nama panggilan muncul ±2–3 detik saat intro/fokus kamera saja, fade out; layar 1080×1920, aman dari subtitle/screenshot, jangan nama permanen. Pertahankan ukuran karakter konsisten dengan Gobi dan EP002. Pastikan kompatibel dengan outfit/rig source Gobi tanpa mengubah Episode001/002.

**Dependensi:** impor roster dari `src/episode003/state/**` milik Claude E (atau kontrak type yang ia berikan). Jika E belum selesai, buat props generik berbasis ID tanpa hardcode data final; B yang menghubungkan scene.

**Ownership:** `src/episode003/characters/**` dan `test/ep003-characters*.test.mjs` saja. Jangan menulis file roster E, environment A, camera F atau Root/B.

## Aturan umum semua Claude
- Source of truth https://github.com/Vluuuu/pulau-gobi, branch `main`; versi EP001–002 yang approved tag `ep002-v4-approved` (commit `a200877`). **Jangan bekerja dari ZIP proyek lama**.
- Baca **hanya** `docs/AI_CONTEXT.md`, `docs/episodes/EP003_PRODUCTION_BRIEF.md`, lalu beberapa file source yang relevan dengan scope milikmu. Jangan scan repo seluruhnya.
- Gunakan **asset pack EP003** dari pemilik bila butuh `eps 3.mp3` atau screenshot komentar. Media ini belum ada di repo.
- Tidak membuat ulang Episode 001/002, tidak mengubah file milik Claude lain, tidak mengubah `src/Root.tsx` atau `package.json` (keduanya milik B pada tahap integrasi).
- Source tambahan di `src/episode003/<modul-mu>/`, tes baru nama unik sesuai peran. Gunakan TypeScript/React Three Fiber/Remotion dan animasi frame-deterministik; hindari random tanpa seed dan pengendali waktu realtime.
- Hasil: **ZIP patch minimal** yang berisi path asli, changed-files manifest, API/exports yang disediakan, test PASS/FAIL/NOT-RUN jujur, dan risiko yang perlu diperiksa di Windows. **Jangan push langsung ke `main`** dan jangan render MP4.
- Bila ada masalah kompatibilitas/kontrak, jelaskan kebutuhan alih-alih diam-diam mengubah file spesialis lain. Periksa collision dan konflik nama file case-insensitive di Windows.
