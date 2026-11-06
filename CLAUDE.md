# Instruksi permanen untuk Claude Browser — Pulau Gobi

**Mulai dari `docs/AI_CONTEXT.md` (ringkasan). Lalu baca `README.md`, `docs/PROJECT_BIBLE.md`, `docs/VISUAL_STYLE.md`, `docs/CHARACTER_BIBLE.md`, `docs/WORLD_RULES.md`, `docs/TECHNICAL_SPEC.md`, `docs/ARCHITECTURE.md`, `docs/DECISIONS.md`, `docs/PRODUCTION_WORKFLOW.md`, `docs/CONTENT_RULES.md`, dan `docs/QA_CHECKLIST.md` sebelum implementasi** (untuk tugas kecil, baca yang relevan; `CONTENT_RULES.md` dan `QA_CHECKLIST.md` wajib untuk tugas yang menyentuh naskah, subtitle, audio, atau QA). Jika tugas spesifik episode, baca snapshot dan brief episode tersebut.

1. **Source produksi SUDAH ADA di main**: Episode 001–002, commit `a200877`, tag `ep002-v4-approved`. Prototipe Tiny Island lama bukan source of truth. **Jangan rebuild engine atau mengganti source yang sudah dirender.**
2. Setelah engine dibuat, **jangan membangun ulang** untuk tiap episode: pahami komponen existing, lakukan perubahan minimal, reusable, dan backward compatible.
3. Bahasa video **Indonesia**. Protagonis **Gobi**, pemuda low-poly, mulai dari pulau kosong dan hanya satu penghuni. Outro **persis**: “Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!”
4. Semua perubahan komentar adalah keputusan editorial, bukan janji otomatis menerima semua komentar. Tidak ada larangan memperluas pulau, membuat pulau baru, kandang naga, atau dunia fantasi. Pertahankan kontinuitas dan konsekuensi.
5. Gunakan React + TypeScript + Three.js/R3F + Remotion dan penyimpanan state versi-per-episode. Pastikan animasi render-deterministik. Gunakan dokumentasi versi package yang kompatibel.
6. Claude Browser **bukan** Claude Code lokal. Referensi skills yang dilampirkan/sync dari GitHub perlu dibaca eksplisit; jangan mengklaim instalasi CLI tersedia tanpa bukti.
7. Jangan melakukan full MP4 render atau cloud deployment. User menjalankan preview, QA, dan render di Windows lokal. Boleh validasi code dan frame terbatas bila lingkungan mendukung; cantumkan yang belum diuji.
8. Untuk setiap hasil pengembangan berikan **changed-files manifest**, perubahan file, version notes, instruksi merge ke clone lokal, perintah validasi lokal, dan QA report jujur. Jangan cuma mengirim ZIP tanpa petunjuk apa yang berubah.
9. Jangan menghapus atau menimpa file user yang tidak terkait, jangan mengubah identitas Gobi, palet, atau CTA tanpa persetujuan eksplisit.
10. Jaga lisensi aset dan audio. Jangan commit `.env`, token, cache, `node_modules`, render output, atau file temporary.
11. Prioritas: komposisi profesional, karakter bertindak sesuai cerita, gerak objek bermakna, bayangan & lighting meyakinkan, keterbacaan subtitle, scene tidak statis, tidak ada collision/overlap/clipping.
12. Bila lingkungan tidak dapat `npm install`, lakukan QA yang memungkinkan dan nyatakan hasil runtime belum terverifikasi. Never claim full pass tanpa bukti.
13. Jangan mengubah visibility repo (private/publik) tanpa instruksi eksplisit owner.
14. Jangan meminta akses tulis GitHub berulang kali. Bila lingkungan tidak mengizinkan push, berikan patch atau ZIP plus changed-files manifest untuk diterapkan manual.
15. Scope guard: jangan membangun physics engine, AI penghuni, navigasi kompleks, atau simulasi ekosistem sebelum ada episode yang membutuhkannya. Implementasi bertahap; kualitas visual Gobi dan lingkungan low-poly adalah prioritas pertama.
16. Visual yang disetujui: **polished simple low-poly** dengan acting/komposisi unggul. Mulai EP003, saat Gobi bicara gunakan front/3/4 close-up; saat membangun objek gunakan object detail close-up, lalu reveal wide/isometric. Tidak perlu Visual Asset Lab atau remake Episode 001/002.
17. Gunakan VO episode final sebelum sinkronisasi animasi; jangan memakai VO sementara sebagai audio final. Catat lisensi setiap font, musik, SFX, dan aset di `docs/LICENSES_AND_ASSETS.md`.
18. Laporkan status pengujian sebagai `PASS`, `FAIL`, atau `NOT-RUN` sesuai bukti nyata.

19. **Aturan warga terbaru:** follow + komentar `Jadi Warga` = calon warga, tidak otomatis diterima. Warga terpilih memiliki NPC 3D dan identitas konsisten. Komentar ide terpilih/diwujudkan = warga spesial. Nama muncul singkat, bukan permanen. Lihat `docs/WORLD_RULES.md`.
20. **Enam spesialis:** A world builder, B episode director, C audio/captions, D character/NPC, E population/world state, F camera/lighting. Kerjakan hanya scope yang ditugaskan; tidak mengubah milik spesialis lain tanpa koordinasi. Baca `docs/PRODUCTION_WORKFLOW.md`.
21. Episode 003 **belum final**; `docs/EP003_CREATIVE_DIRECTION.md` hanya creative direction. Angka pulau 35–40 unit masih opsi eksplorasi, jangan dianggap final.
