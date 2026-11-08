PULAU GOBI — EP006 Postmortem & Standar QA Episode Berikutnya
Status: CATATAN PRODUKSI / LESSONS LEARNED — BUKAN TASK PERBAIKAN EP006
Berlaku untuk: EP007 dan seluruh episode berikutnya
Tanggal: 8 November 2026
Bukti utama: Episode006.mp4 (154,97 detik, 1080×1920, 30 FPS); master eps6.mp3 (±113,24 detik).
Keputusan pemilik: EP006 sudah dipublikasikan dan tidak akan direvisi atau di-render ulang. Temuan di bawah merupakan masukan agar masalah yang sama tidak muncul lagi.
1. Hasil evaluasi EP006
Kategori	Temuan video yang sudah dipublikasikan	Konsekuensi untuk episode mendatang
Subtitle	Teks tampil dominan putih/outline tanpa highlight kata aktif seperti gaya Pulau Gobi yang diharapkan.	Caption wajib punya kata aktif yang disorot sesuai timing ucapan, bukan caption statis.
VO / editorial audio	Ada pengulangan bunyi/fragmen di sekitar beberapa batas jeda. Pencocokan waveform menemukan kandidat kemunculan fragmen master yang sama pada kedua sisi edit. Akar penyebab di source belum terbukti.	Susunan audio EDL wajib menjamin tidak ada duplikasi rentang sumber, pemotongan fonem atau CTA ganda. Wajib listening review.
Framing kamera	Beberapa sudut terlalu dekat (kehilangan konteks sungai/ikan) atau terlalu jauh (ekspresi karakter sulit terlihat). Komposisi sekolah, jembatan dan kelompok belum selalu fokus.	Setiap shot harus memiliki tujuan, subjek, konteks spasial, ukuran subjek, dan orientasi kamera yang jelas.
Interior sekolah	Shot kelas belum selalu menunjukkan papan, guru dan murid dengan proporsi serta visibilitas yang baik.	Gunakan kamera di dalam kelas yang utuh, dengan establishing, medium guru/papan, reverse murid. Jangan mengandalkan cutaway sebagai default shot sinematik.
Blocking NPC	Pada beberapa iterasi EP006 ditemukan murid/penduduk menembus satu sama lain, terhalang di pintu, atau kelompok terlalu padat di dek/sungai.	Rute dan staging harus memperhitungkan dimensi model, pintu, kursi, railing, serta waktu antar-NPC; periksa sepanjang gerakan, tidak hanya posisi akhir.
Pembangunan sungai/jembatan	Beberapa shot menampilkan air terlalu memenuhi layar atau komposisi pembangunan sulit dibaca. Pohon sempat menghalangi jembatan dalam iterasi.	Master shot medium-wide 3/4 harus menampilkan before–process–after; shot detail hanya sebagai pendukung. Cek foreground occlusion.
Animasi / komedi	Acting dan reaksi pada scene ramai masih perlu penyutradaraan lebih jelas.	Animasi harus punya anticipation–aksi–reaksi–recovery; gestur tidak boleh berulang tanpa tujuan. SFX/VFX sinkron tepat pada aksi penting.
Outro	Pada beberapa iterasi terdahulu, visual dunia berubah saat outro dan perpindahan audio terasa mendadak.	Reuse audio dan kalimat outro resmi, namun visual tetap dari world state episode aktif, sambungan suara halus, ending tidak terpotong.


Titik investigasi audio EP006 (referensi, bukan tugas patch)
Analisis waveform pada video EP006 memberi indikasi fragmen sumber yang mungkin dipakai ulang pada beberapa edit: 00:14–00:16, 00:22–00:26, 00:34–00:45, 01:10–01:13, 01:55–02:00, dan 02:04–02:07. Ini bukan klaim bahwa seluruh rentang tersebut berisi dialog berulang atau bahwa sumber pengulangan sudah diketahui. Gunakan sebagai contoh risiko audio segment/EDL overlap, bukan alasan mengubah EP006.
2. Aturan preventif wajib (EP007+)
A. VO dan audio editorial — P0
1. Master VO disimpan utuh sebagai source-of-truth; perubahan ritme video dilakukan dengan jeda visual di batas kalimat yang benar, bukan mengulang sebagian kata.
2. Bila VO dipotong menjadi segmen, buat EDL eksplisit dengan interval sumber (sourceIn, sourceOut) dan posisi timeline. Pastikan tiap rentang master yang dipertahankan digunakan tepat sekali, berurutan dan tanpa overlap yang tidak disengaja. Tandai secara eksplisit bagian yang sengaja dikecualikan (misalnya CTA diganti satu outro resmi).
3. Cegah dua Audio/`Sequence` memainkan sumber yang sama pada jendela waktu yang tumpang tindih. Periksa awal/akhir kata pada boundary.
4. Validasi kontinuitas waveform/source ringan sekali setelah audio final. Listening review tetap wajib karena tes kode tidak membuktikan bunyi enak atau tidak.
5. SFX harus punya fungsi spesifik, level di bawah dialog, tanpa ambience bising/loop yang tidak relevan. Aksi splash: visual dan transient sound pada momen kontak yang sama.
B. Subtitle dinamis — P0
1. Gunakan word-level active highlight, warna kontras yang konsisten dengan identitas Pulau Gobi. Kata aktif terlihat jelas, kata lain tetap terbaca.
2. Waktu kata harus didasarkan pada rekaman/word timing yang diaudit terhadap audio final. Estimasi jumlah huruf tidak boleh dianggap cukup akurat untuk final.
3. Caption hanya menyorot kata yang sedang diucapkan; tidak tertinggal sesudah jeda dan tidak melompat ke kalimat berikut.
4. Pertahankan safe area 9:16 dan hindari tabrakan subtitle dengan nama warga, pop-up komentar, atau objek penting.
5. Verifikasi highlight pada awal, tengah, dan akhir video, termasuk segmen setelah insert jeda.
C. Cinematography — P0
1. Kamera untuk dialog Gobi memakai front/three-quarter medium; wajah, mata, tangan dan reaksi harus terbaca pada layar ponsel. Jangan shoot dari belakang tanpa maksud naratif.
2. Wide/establishing diperlukan untuk memperkenalkan geografi; detail close-up dipakai setelah penonton memahami lokasi dan skala.
3. Pembangunan sungai, jembatan dan bangunan publik: tunjukkan before → proses → hasil dari angle yang membuat objek, kedua tepi/jalur, dan perubahan visual terbaca. Jangan terlalu dekat.
4. Aksi penting tidak boleh tertutup pohon, karakter lain, dinding, atap atau properti foreground.
5. Interior sekolah difilmkan dari kamera yang benar-benar berada di dalam ruangan tertutup dan utuh. Atap/dinding tetap ada; cutaway hanya opsi inspeksi atau shot yang benar-benar membutuhkannya.
6. Tetapkan shot intent per adegan (subjek utama, aksi, kamera, ukuran shot, blocker yang harus dihindari), bukan fallback orbit/zoom otomatis.
D. Blocking & acting — P0
1. NPC permanen mempunyai slot posisi dan rute yang konsisten serta jarak realistis berdasar ukuran tubuh, bukan hanya root transform.
2. Hindari karakter menembus orang, meja, pintu, railing dan sungai. Beri jeda keberangkatan/arrival masuk akal agar tidak saling menyusul di portal sempit.
3. Pergerakan menuju kelas, tempat duduk, dek sungai, jembatan dan jalan pulang mengikuti akses fisik yang sudah dibangun. Tidak teleport antarsudut kamera.
4. Karakter harus melakukan aktivitas yang bermakna (menulis, menunjuk, bekerja, belajar, makan, dll.), bukan gestur tangan seragam.
5. Komedi harus memiliki ritme setup → aksi → impact → reaction → recovery. Periksa arah tatapan dan objek yang direspons.
E. Outro & kontinuitas — P0
1. Outro wajib tepat: “Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!”
2. Pertahankan audio resmi yang telah disetujui dan mainkan sekali secara lengkap, tanpa CTA dobel.
3. Visual outro harus menggunakan world state episode saat ini, tidak kembali ke geometri pulau episode lama.
4. Sisakan transisi audio/visual yang mulus dan hold akhir yang memadai, tanpa memotong suara.
5. Dunia berkembang permanen: rumah, sekolah, sungai, jembatan, sawah, warga, sapi, dekorasi lama tidak di-reset/hilang tanpa alasan cerita.
3. Gate QA sebelum owner render/publish episode baru
- [ ] Audio: EDL sumber bebas replay/overlap tak sengaja; tidak ada kata atau akhir kalimat terpotong; volume/sambungan/outro dicek dengan telinga.
- [ ] Subtitle: kata aktif benar-benar berubah dan sinkron pada opening, beberapa scene tengah, dan penutup; tidak berubah jadi putih statis.
- [ ] Opening: subjek langsung jelas sejak frame pertama; wajah Gobi tidak tertutup.
- [ ] Kelas/interior: guru, papan dan murid terbaca; kamera di dalam bangunan utuh; foreground tidak menghalangi.
- [ ] World layout: area sekolah, sungai, jembatan, jalur dan dek punya akses logis; tidak menempel/berpotongan secara aneh.
- [ ] Blocking: inspeksi lintasan pintu, tempat duduk, kelompok, penyeberangan dan pulang; tidak ada clipping signifikan sepanjang gerak.
- [ ] Cinematography: wide shot menjelaskan geografi, medium shot menonjolkan dialog, insert menonjolkan aksi; tidak ada obstruksi kamera.
- [ ] Acting: ada variasi bermakna, momentum, reaksi, dan sinkronisasi SFX/VFX.
- [ ] Outro: kalimat utuh, hanya sekali, dunia terkini, transisi tidak patah.
- [ ] Owner approval: owner meninjau preview penuh di Windows; kualitas tidak dinyatakan lulus hanya dari unit test/code audit.
4. Workflow efisien untuk Codex/Claude
1. Sebelum implementasi: baca dokumen ini, docs/AI_CONTEXT.md, keputusan dunia, storyboard final, serta source/world state terbaru. Kunci alur, naskah, VO dan roster terlebih dahulu.
2. Saat implementasi: gunakan komponen reusable dan patch minimal. Bekerja pada branch terpisah. Jangan mengubah episode yang sudah terbit.
3. Validasi otomatis: satu typecheck dan tes terarah yang relevan setelah implementasi; ulang hanya kasus gagal setelah penyebabnya diperbaiki. Fokus tes source/audio mapping, bukan rendertime.
4. Tidak menjalankan atas inisiatif sendiri: render MP4, screenshot, still image, browser preview otomatis, camera sweep massal, atau tes berulang tanpa alasan. Owner melakukan preview melalui World Viewer dan Remotion Studio lokal.
5. Handoff: sertakan commit, daftar file, status tes, risiko yang belum dinilai secara visual, dan langkah preview Windows. Jangan klaim kualitas final tanpa persetujuan owner.
5. Ruang lingkup instruksi dokumentasi saat ini
Boleh dilakukan sekarang: menyimpan dokumen ini ke repository, menambahkan tautan singkat darinya pada workflow produksi bila cocok, dan commit dokumentasi saja.

Dilarang untuk task dokumentasi sekarang: mengedit Episode006, VO/subtitle/audio, camera, rig, storyboard, world, world state, tests atau dependency; melakukan build, render, preview, audit, push atau merge. EP006 yang sudah tayang tetap apa adanya.

Status akhir yang diharapkan: Dokumen menjadi rujukan permanen untuk EP007+ dan bagian dari checklist pre-release tiap episode, tanpa memulai produksi EP007 sampai konsep/VO/storyboard disetujui.