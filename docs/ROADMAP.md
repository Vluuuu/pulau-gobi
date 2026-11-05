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

## Phase V — Visual Pre-Production (BERIKUTNYA; belum ada kode engine)
- [x] Dipilih **Visual Asset Lab minimal dan reusable**; belum ada kode atau still nyata.
- [x] Arah Gobi disetujui: semi-chibi berartikulasi; kaos oranye, celana navy, sneakers krem.
- [ ] Detail wajah, rambut, material, proporsi terukur dan rig Gobi dikunci setelah still 3D nyata disetujui.
- [x] Palet awal `Cozy Sky` dan pulau melayang disepakati sebagai **baseline v1**.
- [ ] Warna final dan lighting dikunci berdasarkan still 3D.
- [ ] Style pulau: kontur organik low-poly, bukan grid kubus (D2).
- [ ] Evaluasi kamera (azimuth ±45°, elevasi ±35°) dan pencahayaan lewat beberapa still (D3).
- [ ] Kalibrasi skala relatif Gobi, bangunan, tanaman, pulau (D8).
- [ ] Tipografi subtitle.
- [x] `docs/VISUAL_STANDARD.md` v1 dibuat dan di-push (commit `598efd9`); **concept baseline, belum VISUAL LOCKED**.
- [ ] Still Character Sheet dan Island direview, ukuran/warna/kamera dikalibrasi, lalu status **VISUAL LOCKED** disetujui sebelum Episode 001.

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
