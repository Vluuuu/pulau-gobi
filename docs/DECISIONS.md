# Log Keputusan

- **2026-11-05** — Nama final: **Pulau Gobi**. Nama Pulau Rame dan Pulau Kita ditolak.
- **2026-11-05** — Pemuda pertama bernama **Gobi**.
- **2026-11-05** — Bahasa video Indonesia; gaya cozy/satisfying + humor absurd.
- **2026-11-05** — Outro permanen tepat: “Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!”
- **2026-11-05** — Episode 001: pulau kosong + Gobi saja. Tidak ada rumah/pohon sebelum komentar terpilih.
- **2026-11-05** — Scope dunia terbuka: pulau diperluas, pulau baru, populasi, hewan dan fantasy (termasuk naga), dengan kontinuitas.
- **2026-11-05** — Prototype Tiny Island lama hanya proof-of-concept teknis; proyek produksi dibangun baru.
- **2026-11-05** — Claude Browser menulis kode, user render di Windows, GitHub private adalah source of truth.

## Keputusan D1–D10 (arsitektur engine) — ditinjau bersama creative director

- **2026-11-05 — D1 Repo.** Repository dibuat **Private** selama pengembangan awal. Claude tidak mengubah visibility tanpa instruksi owner. (Saat audit, repo terbukti masih publik; owner yang mengubahnya.)
- **2026-11-05 — D2 Terrain.** Cell-based untuk mendukung ekspansi pulau, **dengan** kontur low-poly organik. Visual tidak boleh terlihat seperti grid kubus. Detail dan kriteria: `ARCHITECTURE.md` §4.3.
- **2026-11-05 — D3 Kamera.** Orthographic, azimuth awal 45°, elevasi sekitar 35°. Nilai final ditentukan setelah melihat still visual.
- **2026-11-05 — D4 State.** Episode commands dan persistent world snapshots berbasis JSON. Snapshot harus reproducible dan mempertahankan objek dari episode sebelumnya.
- **2026-11-05 — D5 Gobi.** Procedural low-poly 3D dengan articulated rig. Prioritas: proporsi, ekspresi wajah, animasi. GLB tidak dilarang permanen untuk aset masa depan.
- **2026-11-05 — D6 Tooling.** npm, TypeScript, Vitest, ESLint. Versi Node.js LTS diverifikasi terhadap laptop Windows owner dan persyaratan Remotion **sebelum** ditetapkan (Stage 1). Belum ada versi final.
- **2026-11-05 — D7 Subtitle timing.** Diutamakan dari ElevenLabs (timestamp generation atau forced alignment bila tersedia). Sistem mendukung word-level captions dengan fallback phrase-level. Lihat `ARCHITECTURE.md` §8.1.
- **2026-11-05 — D8 Skala.** 1 world unit = 1 cell. Skala relatif Gobi, bangunan, tanaman, pulau didefinisikan; angka awal bersifat sementara sampai dikalibrasi di Visual Pre-Production (`ARCHITECTURE.md` §14.1).
- **2026-11-05 — D9 VO Episode 001.** Belum dibuat. Naskah dan storyboard diselesaikan dahulu. Tidak ada VO sementara yang dipakai sebagai audio final.
- **2026-11-05 — D10 Lisensi.** Persyaratan lisensi Remotion, ElevenLabs, font, musik, SFX, dan aset dicatat di `LICENSES_AND_ASSETS.md` dengan merujuk dokumentasi resmi. Verifikasi akhir ada pada owner.

### Penyesuaian arsitektur dan proses
- **2026-11-05 — Scope guard.** Jangan membuat engine terlalu kompleks sebelum kualitas visual dasar terbukti. Pertahankan: multi-island, persistent world state, reusable asset registry, animasi deterministik per frame, rig karakter modular, preset kamera dan lampu, snapshot episode. Tidak dibangun sebelum diperlukan: physics engine, AI penghuni, navigasi kompleks, simulasi ekosistem. Implementasi bertahap.
- **2026-11-05 — Prioritas.** Karakter Gobi dan lingkungan low-poly berkualitas visual tinggi didahulukan.
- **2026-11-05 — Urutan tahap.** Stage 0 (higiene dokumentasi) → Visual Pre-Production (desain Gobi, palet, proporsi, style pulau, kamera dan lighting lewat still, standar visual dikunci) → bootstrap engine. Episode 001 tidak dimulai sebelum desain visual disetujui.
- **2026-11-05 — Workflow.** Claude Browser membuat source code dan dokumentasi; owner melakukan instalasi, testing, preview, rendering, Git commit/push. Bila lingkungan Claude tidak memberi akses tulis GitHub, Claude **tidak** meminta berulang kali; Claude memberikan patch atau ZIP untuk diterapkan manual. Status pengujian dilaporkan sebagai PASS, FAIL, atau NOT-RUN sesuai bukti.
- **2026-11-05 — Dokumen arsitektur.** `docs/ARCHITECTURE_PROPOSAL.md` menjadi `docs/ARCHITECTURE.md` (rincian dari `TECHNICAL_SPEC.md`). Prioritas bila bertentangan: `DECISIONS.md` > `ARCHITECTURE.md` > `TECHNICAL_SPEC.md`.
