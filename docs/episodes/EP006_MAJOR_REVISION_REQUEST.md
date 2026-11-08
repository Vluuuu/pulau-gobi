# REVISI MAYOR EP006 — CINEMATIC QUALITY, WORLD LAYOUT & CHARACTER ANIMATION

**STATUS: EPISODE 006 BELUM DISETUJUI.**

Implementasi sekarang sudah memiliki konten cerita yang dibutuhkan, tetapi kualitas visual, animasi, kamera, dan penataan lingkungan masih di bawah standar yang saya inginkan untuk Pulau Gobi.

Ini bukan permintaan menambah fitur atau mengulang episode dari nol. Saya meminta **quality pass menyeluruh pada implementasi yang sudah ada**.

Gunakan branch `codex/ep006-production`, commit `4037ea4` sebagai baseline. Pertahankan seluruh progres yang sudah selesai.

## P0 — 1. PERBAIKI LAYOUT SUNGAI DAN SEKOLAH

Masalah: sungai terlalu dekat dengan bagian depan sekolah. Area sekolah terlihat sempit, dan penempatan murid menjadi tidak masuk akal.

Wajib:
- Atur ulang jalur sungai agar tidak langsung memenuhi area depan sekolah.
- Sekolah harus memiliki ruang yang cukup untuk gerbang, halaman, lapangan, jalur pejalan kaki, dan aktivitas murid.
- Buat zona transisi berupa rumput, pepohonan, jalan setapak, dan ruang terbuka yang proporsional antara sekolah dan sungai.
- Area observasi ikan harus berada di tepi sungai yang aman dan terpisah dari lapangan sekolah.
- Jembatan harus menghubungkan dua sisi sungai secara logis dan memiliki akses jalan di kedua ujungnya.
- Pertahankan koneksi sungai menuju air terjun dan jangan menghilangkan bangunan, pohon penting, atau world state lama.
- Jangan mengubah posisi sungai hanya untuk menyembunyikan masalah kamera; perbaiki layout dunia secara konsisten.

**Acceptance:** saat melihat area ini dari kamera wide, sekolah tampak memiliki halaman sendiri dan sungai tidak terasa menempel pada pintu sekolah.

## P0 — 2. PERBAIKI SELURUH CINEMATOGRAPHY

Masalah: beberapa shot terasa seperti kamera otomatis yang sekadar diarahkan ke objek. Framing kurang menarik, sudut terlalu jauh, dan objek menutupi karakter.

Wajib:
- Opening harus memperlihatkan Gobi dengan jelas sejak frame pertama. Tidak boleh tertutup pohon.
- Saat Gobi berbicara, prioritaskan frontal atau three-quarter medium shot dengan wajah dan gestur yang terbaca.
- Hindari mengambil dialog utama dari belakang karakter, kecuali memang ada alasan storytelling.
- Setiap shot memiliki subjek utama yang jelas dan komposisi rapi.
- Jangan ada NPC, pohon, dinding, atau properti menutupi aksi penting.
- Gunakan close-up untuk ekspresi, detail pembangunan, ikan, dan interaksi.
- Gunakan wide shot untuk memperlihatkan skala bangunan dan hasil pembangunan, bukan sebagai angle default.
- Transisi kamera harus mendukung aksi, bukan orbit atau zoom acak.
- Hindari gerakan kamera yang terlalu lambat, terlalu panjang, atau tidak memiliki tujuan.

**Acceptance:** seluruh 38 shot harus terasa disutradarai secara sengaja, bukan kumpulan kamera statis atau otomatis.

## P0 — 3. ROMBAK SHOT INTERIOR KELAS

Masalah: interior masih terlihat seperti set terbuka. Papan tulis tidak jelas dan dua karakter di depan kelas mengganggu kamera.

Wajib:
- Kamera benar-benar ditempatkan DI DALAM ruang kelas.
- Pertahankan atap, plafon, dinding, dan arsitektur sekolah yang utuh.
- Jangan memakai cutaway dollhouse sebagai angle utama kelas.
- Gunakan wide interior dari belakang kelas, medium shot Damia mengajar, close-up papan tulis, serta reverse shot murid.
- Pastikan papan tulis memiliki ukuran, posisi, pencahayaan, dan kontras yang jelas.
- Jangan ada karakter berdiri menghalangi papan tulis atau guru.
- Pindahkan dua NPC pengganggu dari foreground ke posisi yang logis.
- Delapan murid harus berada di kursi masing-masing dengan framing yang memperlihatkan kegiatan belajar.
- Pastikan kamera tidak menembus plafon, dinding, meja, atau kepala karakter.

**Acceptance:** kelas harus terlihat seperti ruangan sekolah sungguhan yang sedang digunakan, bukan model kelas yang dibuka atapnya untuk dilihat dari atas.

## P0 — 4. TINGKATKAN KUALITAS ANIMASI SECARA NYATA

**Ini prioritas besar. Animasi sekarang masih terlalu sederhana, kaku, dan repetitif.**

Jangan hanya menambahkan beberapa rotasi tangan yang berulang.

Gobi:
- Ekspresi mata, kepala, mulut, tangan, dan postur harus mengikuti emosi dialog.
- Saat terkejut, tubuh bereaksi dengan anticipation, gerakan utama, dan recovery.
- Saat berjalan, harus terlihat perpindahan berat badan dan langkah yang sesuai kecepatan.
- Saat menunjuk objek, arah pandangan dan tangan harus menuju target yang benar.
- Variasikan gestur. Jangan semua dialog menggunakan gerakan yang sama.

Delapan murid:
- Tidak boleh seluruh murid mengulang animasi identik secara serempak.
- Ada yang menulis, memperhatikan guru, menoleh, mengangkat tangan, membaca, dan bereaksi.
- Terapkan timing berbeda sesuai kegiatan.
- Perpindahan dari gerbang menuju kelas harus terlihat seperti orang berjalan, bukan bergeser di atas lantai.

Damia dan Ghanim:
- Damia benar-benar bergerak saat mengajar, menunjuk atau menulis di papan.
- Ghanim memiliki gestur kepala sekolah yang berbeda dari NPC biasa.
- Saat terkena cipratan ikan, Ghanim harus memperlihatkan reaksi spontan yang jelas dan lucu.

Semua animasi harus deterministik berdasarkan frame Remotion, dapat digunakan ulang, dan tidak merusak rig atau model karakter permanen.

**Acceptance:** kualitas acting harus terlihat meningkat tanpa perlu memperhatikan kode. Setiap aksi memiliki bobot, tujuan, dan respons.

## P0 — 5. PERBAIKI BLOCKING MURID

Masalah: murid berbaris terlalu panjang hingga mendekati sungai.

Wajib:
- Susun delapan murid secara rapi di halaman sekolah, misalnya dua baris berisi empat murid.
- Pastikan jarak antarmurid cukup.
- Jangan biarkan barisan melintasi sungai atau masuk ke area yang tidak relevan.
- Saat kunjungan belajar alam, rombongan berjalan bersama melalui jalur yang benar.
- Di area sungai, kelompok berkumpul pada dek observasi atau zona aman, bukan membentuk barisan panjang secara acak.

**Acceptance:** posisi murid harus masuk akal secara fisik dan secara cerita di setiap scene.

## P0 — 6. FISH SPLASH HARUS MENJADI MOMEN KOMEDI YANG KUAT

Masalah: cipratan ikan kurang jelas, SFX kurang terasa, dan reaksinya terlalu sederhana.

Buat urutan aksi yang jelas:
1. Ikan bergerak dari bawah permukaan air.
2. Ada anticipation kecil atau ripple.
3. Ikan melompat dengan gerakan yang meyakinkan.
4. Percikan air mengenai Ghanim.
5. SFX splash terdengar jelas tepat saat kontak.
6. Ghanim bereaksi terkejut dengan gerakan kepala dan tubuh.
7. Air menetes sebentar, murid dan Gobi bereaksi.

VFX harus mendukung gerakan ikan, bukan sekadar partikel acak. Gunakan splash, droplet, dan ripple dengan timing serta ukuran yang sesuai.

SFX tidak boleh menutupi VO atau menimbulkan bunyi bising terus-menerus.

**Acceptance:** momen ini harus mudah dipahami, lucu, dan memiliki payoff visual serta audio.

## P0 — 7. PERBAIKI OUTRO DAN TRANSISI AUDIO

Masalah: pulau saat outro terlihat berbeda dari world state EP006, sementara transisi suara terasa patah-patah.

Wajib:
- Jangan menggunakan visual pulau lama jika tidak cocok dengan dunia EP006.
- Gunakan world state aktual EP006 untuk visual outro.
- Pertahankan audio dan kalimat outro resmi yang sudah disetujui, tanpa perubahan naskah.
- Buat transisi visual menuju outro yang halus, bukan cut mendadak ke dunia berbeda.
- Periksa sambungan VO utama dan audio outro; tidak boleh ada fonem terpotong, perubahan volume ekstrem, atau overlap yang aneh.
- Pastikan seluruh kalimat outro selesai dan diberi ruang penutup yang cukup.
- Hindari audio CTA ganda.

**Acceptance:** penonton merasa outro merupakan bagian alami dari episode, bukan video lain yang ditempel di ujung.

## P1 — 8. POLISH VISUAL KESELURUHAN

Setelah P0 selesai:
- Tingkatkan komposisi dan keterbacaan setiap scene.
- Perbaiki pencahayaan interior agar karakter dan papan tulis jelas.
- Tambahkan secondary motion yang relevan pada karakter dan lingkungan.
- Rapikan visual pembangunan sungai dan jembatan agar lebih satisfying.
- Hindari VFX berlebihan, keramaian visual, dan SFX yang tidak punya fungsi.
- Pastikan seluruh scene terlihat baik pada format vertikal 1080×1920.

**JANGAN hanya melakukan perubahan kosmetik kecil lalu mengklaim revisi besar selesai.** Jika masalah bersifat struktural, perbaiki blocking, animasi, model, atau sistem kamera yang menyebabkannya.

## BATASAN KERJA — WAJIB DIPATUHI

- Jangan membuat ulang EP006 dari awal.
- Jangan mengubah naskah atau mempercepat VO.
- Jangan menambah cerita, warga, atau bangunan baru di luar kebutuhan perbaikan layout.
- Jangan merusak kontinuitas EP001–EP005, sekolah World Polish, atau World Viewer.
- Jangan render MP4, still image, screenshot, atau menjalankan browser preview otomatis.
- Jangan menjalankan audit kamera massal atau pengujian berulang-ulang.
- Jangan menjalankan build/typecheck yang sama berkali-kali tanpa perubahan penyebab kegagalan.
- Cukup satu pemeriksaan akhir TypeScript dan tes terarah yang relevan. Ulang hanya jika ada kegagalan terkait perubahan.
- Jangan push atau merge ke main.

**PEKERJAAN SELESAI JIKA:**
1. Seluruh masalah P0 di atas sudah ditangani dalam source.
2. Perubahan benar-benar meningkatkan kamera, animasi, dan layout, bukan sekadar memenuhi angka audit.
3. Semua aset baru tetap reusable untuk episode selanjutnya.
4. Source disimpan dalam commit baru di branch kerja.
5. Ada laporan singkat per kategori masalah serta daftar file yang berubah.

Saya sendiri yang akan melakukan preview di Remotion Studio dan render MP4 lokal di Windows.

**Jangan mengklaim kualitas visual sudah disetujui sebelum saya melihat hasilnya.**