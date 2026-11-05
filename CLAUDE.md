# Instruksi permanen untuk Claude Browser — Pulau Gobi

**Baca `README.md`, `docs/PROJECT_BIBLE.md`, `docs/VISUAL_STYLE.md`, `docs/CHARACTER_BIBLE.md`, `docs/WORLD_RULES.md`, `docs/TECHNICAL_SPEC.md`, dan `docs/PRODUCTION_WORKFLOW.md` sebelum implementasi.** Jika tugas spesifik episode, baca snapshot dan brief episode tersebut.

1. Ini proyek **baru**; file awal hanya dokumentasi. Prototipe Tiny Island lama bukan source of truth. Buat engine baru berdasarkan kontrak dokumen, jangan meng-copy pilot tanpa keputusan owner.
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
