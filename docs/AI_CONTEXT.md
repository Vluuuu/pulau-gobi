# AI_CONTEXT — ringkasan untuk sesi AI (perbarui di akhir tiap stage)

Baca ini dulu. Buka dokumen lain hanya bila tugas membutuhkannya. Bila bertentangan: `DECISIONS.md` > `ARCHITECTURE.md` > `TECHNICAL_SPEC.md`.

## Status
- **Stage 0 (higiene dokumen): selesai dan sudah di-push (`0ad6a3c`).**
- **Sekarang: Visual Pre-Production**. `docs/CHARACTER_BIBLE.md` dan `docs/VISUAL_STANDARD.md` v1 sudah masuk `main` (`598efd9`); identitas/outfit disetujui, model, skala, palet final, kamera, dan lighting **belum VISUAL LOCKED**. Berikutnya **Visual Asset Lab minimal reusable**, QA still di laptop, review owner. Belum ada bootstrap engine atau Episode 001.
- **Belum ada source code, `package.json`, perintah build/test, atau episode.** Tidak ada hasil pengujian apa pun.
- Repo sudah **Private** (diverifikasi 2026-11-05). Jangan ubah visibility.

## Proyek dalam 6 baris
- Serial video pendek vertikal 1080×1920, 30 fps, low-poly 3D berbasis kode, Bahasa Indonesia.
- Protagonis Gobi (pemuda). Ep001: pulau kecil kosong + Gobi saja, tanpa rumah/pohon.
- Dunia berkembang dari komentar terpilih: multi-pulau, penduduk, hewan, fantasi, dengan kontinuitas.
- Outro wajib, tidak boleh diubah: "Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!"
- Stack: TypeScript, React, Three.js, R3F, Remotion, `@remotion/three`, npm, Vitest, ESLint.
- Prototype Tiny Island bukan dasar kode.

## Keputusan inti (D1–D10, detail di `DECISIONS.md`)
- Terrain: himpunan cell untuk logika, **mesh organik low-poly**, bukan grid kubus. 1 unit = 1 cell.
- Kamera orthographic, azimuth ±45°, elevasi ±35° (nilai final dari still).
- State: command episode + snapshot JSON reproducible; objek lama tidak hilang tanpa peristiwa cerita.
- **Dunia:** pulau utama melayang di langit (tanpa laut/horizon air). **Gobi:** semi-chibi procedural low-poly articulated rig, kaos oranye, celana pendek navy, sneakers krem. Detail wajah/proporsi final menunggu review still; GLB boleh nanti untuk aset lain.
- Caption: word-level dari timestamp ElevenLabs, fallback phrase-level.
- VO Ep001 belum ada; **dilarang memakai VO sementara sebagai audio final.**
- Lisensi dicatat di `LICENSES_AND_ASSETS.md`.

## Aturan keras
- Animasi deterministik per frame: pakai `useCurrentFrame`, `interpolate`, `spring`, seeded random. Dilarang di jalur render: `Math.random`, `Date.now`, `requestAnimationFrame`, `setTimeout`, `useFrame` untuk animasi.
- World state adalah TS murni (tanpa import React/Three); renderer = fungsi murni dari (state, timeline, frame).
- **Scope guard:** tanpa physics, AI penghuni, navigasi kompleks, simulasi ekosistem; bangun hanya yang dibutuhkan stage berjalan.
- Perubahan minimal berbentuk patch; jangan regenerasi atau merusak episode lama.
- Jangan klaim sesuatu teruji tanpa bukti. Laporkan `PASS` / `FAIL` / `NOT-RUN`.
- Claude tidak merender MP4 final dan tidak meminta akses tulis GitHub berulang; berikan patch/ZIP + manifest.
- Jangan membuat Episode 001 sebelum desain visual disetujui.

## Peta dokumen
| Butuh | Buka |
| --- | --- |
| Konsep, tone | `PROJECT_BIBLE.md` |
| Gobi | `CHARACTER_BIBLE.md` dan `VISUAL_STANDARD.md` |
| Visual, kamera, lighting | `VISUAL_STYLE.md` |
| Kontinuitas dunia | `WORLD_RULES.md` |
| Naskah, subtitle, audio | `CONTENT_RULES.md` |
| QA | `QA_CHECKLIST.md` |
| Rancangan engine | `ARCHITECTURE.md` (kontrak ringkas: `TECHNICAL_SPEC.md`) |
| Keputusan | `DECISIONS.md` |
| Tahapan | `ROADMAP.md` |
| Lisensi dan aset | `LICENSES_AND_ASSETS.md` |
| Brief episode | `EPISODE_BRIEF_TEMPLATE.md` |
| Alur kerja | `PRODUCTION_WORKFLOW.md` |

## State dunia saat ini
Belum ada snapshot. Rencana `after-ep001`: `island:main` (kecil, organik) + `res:gobi`; struktur 0, vegetasi 0.

## Tahap
0 Higiene (selesai) → V Visual Pre-Production (berlangsung) → 1 Bootstrap → 2 Inti dunia → 3 Renderer → 4 Gobi produksi → 5 Timeline/AV → 6 QA Ep001 → 7 Engagement loop → 8 Ekspansi.
