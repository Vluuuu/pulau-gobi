# Roadmap

Rincian teknis tiap stage ada di [`ARCHITECTURE.md`](ARCHITECTURE.md) §10. Setiap stage selesai dengan gerbang persetujuan owner. Status hanya dicentang bila ada buktinya.

## Phase 0 — Foundation
- [x] Konsep Pulau Gobi, Gobi, Bahasa Indonesia, outro permanen diputuskan.
- [x] Prototipe teknologi Tiny Island pernah dirender, tetapi **disisihkan sebagai eksperimen**.
- [x] Repo GitHub `pulau-gobi` dibuat dan starter docs di-push (commit awal `dd9bb8e`).
- [ ] Repo dijadikan **private** (D1; dikerjakan owner).
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
- [ ] Owner meninjau, menerapkan patch ke clone lokal, dan commit/push.

## Phase V — Visual Pre-Production (BERIKUTNYA; belum ada kode engine)
- [ ] Putuskan pendekatan lingkungan still (lab minimal atau kerangka Stage 1 minimal).
- [ ] Opsi desain Gobi: wajah, pakaian, warna, proporsi → dipilih dan dikunci.
- [ ] Opsi palet warna dunia → dipilih dan dikunci.
- [ ] Style pulau: kontur organik low-poly, bukan grid kubus (D2).
- [ ] Evaluasi kamera (azimuth ±45°, elevasi ±35°) dan pencahayaan lewat beberapa still (D3).
- [ ] Kalibrasi skala relatif Gobi, bangunan, tanaman, pulau (D8).
- [ ] Tipografi subtitle.
- [ ] `docs/VISUAL_STANDARD.md` dibuat dan disetujui. **Episode 001 tidak dimulai sebelum ini.**

## Phase 1 — Engine dan Episode 001
- [ ] Stage 1 Bootstrap: versi dipin (Node, paket), `tsc`, ESLint, Vitest, konfigurasi Remotion.
- [ ] Stage 2 Inti dunia tanpa 3D (multi-island capable, hanya command yang dibutuhkan).
- [ ] Stage 3 Renderer produksi: pulau, air, preset kamera dan lampu.
- [ ] Stage 4 Gobi produksi: rig articulated, clip dasar, ekspresi.
- [ ] Naskah dan storyboard Episode 001 final.
- [ ] VO Indonesia Episode 001 final (belum dibuat; tidak ada VO sementara sebagai audio final, D9).
- [ ] Stage 5 Timeline, caption (word dan phrase), audio, outro permanen.
- [ ] Stage 6 QA visual dan render laptop PASS.
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
