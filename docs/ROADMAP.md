# STATUS TERKINI (2026-11-06, menggantikan checklist lama di bawah)
- [x] EP001 voice-over, source, render, publikasi.
- [x] EP002: dua komentar dipilih, pulau diperluas, rumah dan sawah dibangun, dua NPC komentator, subtitle highlight, VO final.
- [x] EP002 V4 Windows Fix dirender dan disetujui; source ZIP frozen, snapshot editorial tercatat.
- [ ] Sinkronisasi **source lengkap** termasuk MP3/screenshot ke GitHub root (`src/`, `public/`, `package.json`, `test/`).
- [ ] Mulai storyboard/VO EP003 dari dunia akhir EP002.

> Checklist panjang di bawah adalah rancangan lama; beberapa butir blueprint telah digantikan oleh implementasi episode sederhana yang sudah berjalan. Tidak perlu membangun engine besar untuk menyelesaikannya.

# Roadmap

Rincian teknis tiap stage ada di [`ARCHITECTURE.md`](ARCHITECTURE.md) §10. Setiap stage selesai dengan gerbang persetujuan owner. Status hanya dicentang bila ada buktinya.

## Phase 0 — Foundation
- [x] Konsep Pulau Gobi, Gobi, Bahasa Indonesia, outro permanen diputuskan.
- [x] Prototipe teknologi Tiny Island pernah dirender, tetapi **disisihkan sebagai eksperimen**.
- [x] Repo GitHub `pulau-gobi` dibuat dan starter docs di-push (commit awal `dd9bb8e`).
- [x] Repo dijadikan **private** (D1; diverifikasi 2026-11-05).
- [ ] Dokumen Project ChatGPT dimasukkan ke Project settings (dikerjakan owner).
- [ ] Claude Project disambungkan ke GitHub dan file terpilih disinkronkan (dikerjakan owner; sinkron ulang setelah Stage 0 di-merge).
- [x] Audit dokumentasi dan proposal arsitektur ditinjau dan disetujui dengan penyesuaian (D1–D10).

### Stage 0 — Higiene repo dan keputusan
- [x] `README.md` diperbaiki ke UTF-8 (NUL dan baris UTF-16 dihapus).
- [x] `.gitattributes` ditambahkan.
- [x] `ROADMAP.md` diperbarui.
- [x] `CLAUDE.md` mewajibkan `CONTENT_RULES.md` dan `QA_CHECKLIST.md`.
- [x] Keputusan D1–D10 dicatat di `DECISIONS.md`.
- [x] `AI_CONTEXT.md` dibuat.
- [x] `ARCHITECTURE.md` (dari proposal) dirapikan dan diselaraskan dengan keputusan.
- [x] `LICENSES_AND_ASSETS.md` dibuat (catatan awal lisensi).
- [x] Owner menerapkan patch dan push ke `main` (commit `0ad6a3c`).

## Phase V — Arahan visual ringkas (SELESAI SEBAGAI KONSEP)
- [x] Gaya sederhana: low-poly 3D berbasis kode, kualitas setara prototype Tiny Island sudah cukup; tidak perlu 3D detail.
- [x] Gobi: semi-chibi, kaos oranye, celana pendek navy, sneakers krem, rig sederhana yang memungkinkan gestur/ekspresi dasar.
- [x] Dunia: satu pulau kecil melayang di langit, kontur organik, langit pastel; Ep001 hanya Gobi dan pulau kosong.
- [x] `docs/CHARACTER_BIBLE.md` dan `docs/VISUAL_STANDARD.md` menjadi **panduan fleksibel**, bukan syarat membuat Asset Lab terpisah.
- [ ] Kualitas visual disesuaikan **setelah preview Episode 001 di laptop**, bukan melalui tahap still multi-angle sebelum coding.

## Phase 1 — Engine dan Episode 001
- [ ] Stage 1 Bootstrap: versi dipin (Node, paket), `tsc`, ESLint, Vitest, konfigurasi Remotion.
- [ ] Stage 2 Inti dunia tanpa 3D (multi-island capable, hanya command yang dibutuhkan).
- [ ] Stage 3 Renderer awal: pulau melayang, langit, kamera, lighting sederhana (tanpa air).
- [ ] Stage 4 Gobi sederhana: rig/pivot dasar, wajah ekspresif secukupnya, idle/look-around/wave; tambah animasi saat cerita membutuhkan.
- [x] Naskah dan storyboard Episode 001 disetujui; lihat `docs/episodes/EP001_BRIEF.md` (durasi disesuaikan setelah MP3).
- [ ] VO Indonesia Episode 001 final (belum dibuat; tidak ada VO sementara sebagai audio final, D9).
- [ ] Stage 5 Timeline, caption (word dan phrase), audio, outro permanen.
- [ ] Stage 6 Review preview/video Ep001 di laptop, perbaiki masalah yang nyata, render lokal PASS.
- [ ] Upload Episode 001.

## Phase 2 — Engagement Loop
- [ ] Pilih komentar yang layak.
- [ ] Episode perubahan via JSON dan commands.
- [ ] Asset library reusable (rumah dulu).
- [ ] Buat 3–5 episode dan ukur retention/komentar.

## Phase 3 — Expansion
- [ ] Terrain expansion dan pulau kedua.
- [ ] Populasi, habitat, creature termasuk fantasi.
- [ ] Optimasi kualitas, efisiensi render, regresi snapshot.
- Fitur seperti physics, AI penghuni, navigasi kompleks, dan simulasi ekosistem hanya dipertimbangkan bila episode benar-benar membutuhkannya.
