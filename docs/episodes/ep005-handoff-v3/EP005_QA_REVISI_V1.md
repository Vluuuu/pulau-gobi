# Pulau Gobi EP005 — QA visual/audio sebelum publikasi

**Bukti:** `Episode005.mp4` pengguna, 177.173 detik, 1080×1920, 30 FPS, audio stereo AAC. Review melalui ekstraksi frame dan pembandingan bentuk gelombang soundtrack dengan master `ElevenLabs_..._v4.mp3` (135.158 dtk). **Belum** ada inspeksi interaktif scene 3D atau audit audio mendengar kata-per-kata, sehingga jangan menganggap waveform cocok sebagai sertifikasi seluruh pengucapan.

## Temuan wajib P0

1. **Dialog Gobi kerap terlalu jauh / dari belakang** (terutama ~0–12, 37–46, 109–116 dtk). Saat dialog, wajib three-quarter/front medium, ekspresi dan gestur jelas. Simpan wide/isometric untuk establishing, build, dan reveal, bukan dominan untuk VO Gobi. Hindari pohon/rumah menghalangi line-of-sight. Uji komposisi pada frame sebenarnya, bukan still kamera alternatif.
2. **Sekolah dan kelas tidak menjadi satu ruang terhubung** (~106 eksterior besar, 117–134 interior). Eksterior kampus bertingkat sebenarnya sudah tampil, tetapi interior terlihat seperti kotak kelas tanpa atap, terpisah dari volume gedung utama, dengan perpindahan masuk yang tidak terbaca. Jangan hanya memperbesar dekor: satukan ruang kelas ke dalam wing bangunan yang sama, pertahankan world transform/logika pintu. Tampilkan *gerbang sekolah → jalur halaman/lapangan → pintu utama → koridor → pintu kelas*. Jangan menembus dinding atau teleport. Hanya sembunyikan atap/dinding penghalang saat cutaway interior; eksterior dan kontinuitas fisik atap tetap normal.
3. **Lapangan/halaman sekolah belum punya identitas jelas** (~100–112). Manfaatkan pelataran di depan sekolah sebagai lapangan upacara/olahraga, jalur batu/paving, marka sederhana, tiang bendera, taman/pohon samping, bangku, lampu/tiang kecil, pagar dan gerbang. Tidak perlu bangunan baru terpisah. Kelas tetap delapan meja, tetapi dimensi indoor harus masuk akal.
4. **Komedi sapi belum punya path visual meyakinkan** (~120–136). Perlihatkan cow-003 dari gerbang kandang mengikuti jalur, melewati gerbang sekolah, pintu utama lalu koridor dan pintu kelas yang sungguh terbuka; Gobi/RIS/Joy/Damia juga melalui akses yang sama. Sapi tidak boleh keluar-masuk lewat bagian dinding kelas yang sengaja disembunyikan untuk kamera. Pertahankan bunyi lonceng sebagai pemicu dan Xyree membawa pulang.
5. **Audit audio VO yang terdengar terpotong**. Pembandingan sinyal menunjukkan sebagian besar master VO ada dalam video dan tersusun berurutan dengan sisipan jeda ±36,5 dtk, bukan hilang satu chapter besar. Tetapi pembandingan ini tidak memastikan kelancaran fonem di cut, kualitas TTS, mixing, atau kecocokan subtitle. Periksa dengan mendengar khusus pergantian sekitar 0/33, 51–62, 96–105, 116–126, 134–138, dan masuk outro ~171,7. Cek potongan konsonan di awal/akhir dan fade, VO jangan dipercepat/digenerate ulang tanpa persetujuan. Pertahankan jeda hanya di keheningan dan caption word timing harus ikut edit baru.

## Prioritas visual P1

- **Air terjun** (~24–36): air vertikal sudah ada tetapi hero shot terlalu singkat dan sudut tidak sekaligus menunjukkan rim, tebing, dan air lenyap dalam kabut secara besar/jelas. Reframe side 3/4 di 9:16; ujung air hilang alami ke mist. Tidak cukup hanya mesh lebih panjang.
- **Bangun sekolah** (~97–105): saat konstruksi tunjukkan per tahap dari jarak yang membuat panel, lantai, dinding, koridor dan atap besar terbaca. Roof tetap hadir pada shot eksterior.
- **Aktivitas NPC**: ekspresi Gobi dan NPC saat berbicara tidak terbaca bila ukuran terlalu kecil; tambah blocking berorientasi dialog dan tindakan bermakna, bukan sekadar NPC tersebar di pulau.
- **SFX & subtitle**: uji moo sapi, langkah di jalur, derit pintu, lonceng, water roar, impact struktur, serta volume dibanding VO; label nama, bubble dan caption jangan tumpang tindih.

## Pengendalian scope

- Bekerja sebagai **revisi EP005**, bukan membuat ulang dunia, naskah, VO, sekolah/roster/terrain atau episode lama dari nol.
- Jangan menghapus objek permanen; jangan merge/push main dulu.
- Sebelum final, preview Studio seluruh scene bermasalah dan render satu MP4 review di Windows pengguna. Full automated code tests seperlunya; jangan render massal di Codex.
- Pertahankan durasi di bawah 180 detik **termasuk outro**; boleh retime jeda visual, jangan potong kata/dialog.

## Bukti frame

`EP005_QA_4_FRAME_REFERENSI.jpg` memuat frame asli dari video pada 33, 106, 119, dan 128 detik (untuk orientasi visual; tidak mewakili semua frame video).
