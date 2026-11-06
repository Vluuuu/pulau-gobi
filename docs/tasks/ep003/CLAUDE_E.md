# PROMPT CLAUDE E — EP003 POPULATION & WORLD STATE

Kamu Claude E, spesialis DATA warga dan kontinuitas EP003, bukan visual NPC.

**Baca snapshot EP002** dan kode roster EP002 yang ada. Buat append-only/overlay state baru, **tanpa mengganti data episode 002**. Stable ID untuk `gobi` dan dua warga lama wajib dipertahankan. Tambahkan tepat 4 record pendatang:
- `shifalina_`: Warga Spesial, penjaga warteg, mengusulkan rumah tingkat + warteg dan ingin berjualan.
- `damar_zan`: Warga Spesial karena ide ekspansi/sungai diwujudkan EP003.
- `Eka Agustin`: Warga Spesial karena ide sungai diwujudkan EP003.
- `joy.__3.15`: Warga Biasa terpilih untuk cameo; usulan peternakan/perkebunan **belum** diwujudkan, jadi jangan jadikan spesial dulu. Verifikasi follow+komentar `Jadi Warga` bila tidak ada bukti harus ditandai `pending`, bukan `verified`.

**Angka 105:** catat sebagai total followers gabungan IG 33/TikTok 55/YouTube 17; **bukan** roster 105 orang unik atau 105 warga terverifikasi. Jangan men-scrape/fabrikasi akun.

**World state setelah EP003 (draft):** pulau radius final parameter 35–40 TBD, rumah pertama menjadi dua lantai (ID tetap), sungai baru, warteg baru, sawah belum panen, dekorasi dan warga lama tetap. ID warteg/river unik, tidak mereset pulau. Buat status `draft` sampai hasil QA Windows approved.

**Output API:** data roster ber-ID stabil dengan displayName, kategori, visualVariant seed, introWindow trigger dan behavior hint yang bisa dipakai Claude D/B. Data peran/roster jangan menulis JSX atau scene. Tidak perlu engine populasi besar.

**Ownership:** hanya `src/episode003/state/**` dan `test/ep003-state*.test.mjs`. Jangan edit `docs/world/EP003_STATE.json` resmi sebelum final owner approved; berikan proposal draft di file module.

## Aturan umum semua Claude
- Source of truth https://github.com/Vluuuu/pulau-gobi, branch `main`; versi EP001–002 yang approved tag `ep002-v4-approved` (commit `a200877`). **Jangan bekerja dari ZIP proyek lama**.
- Baca **hanya** `docs/AI_CONTEXT.md`, `docs/episodes/EP003_PRODUCTION_BRIEF.md`, lalu beberapa file source yang relevan dengan scope milikmu. Jangan scan repo seluruhnya.
- Gunakan **asset pack EP003** dari pemilik bila butuh `eps 3.mp3` atau screenshot komentar. Media ini belum ada di repo.
- Tidak membuat ulang Episode 001/002, tidak mengubah file milik Claude lain, tidak mengubah `src/Root.tsx` atau `package.json` (keduanya milik B pada tahap integrasi).
- Source tambahan di `src/episode003/<modul-mu>/`, tes baru nama unik sesuai peran. Gunakan TypeScript/React Three Fiber/Remotion dan animasi frame-deterministik; hindari random tanpa seed dan pengendali waktu realtime.
- Hasil: **ZIP patch minimal** yang berisi path asli, changed-files manifest, API/exports yang disediakan, test PASS/FAIL/NOT-RUN jujur, dan risiko yang perlu diperiksa di Windows. **Jangan push langsung ke `main`** dan jangan render MP4.
- Bila ada masalah kompatibilitas/kontrak, jelaskan kebutuhan alih-alih diam-diam mengubah file spesialis lain. Periksa collision dan konflik nama file case-insensitive di Windows.
