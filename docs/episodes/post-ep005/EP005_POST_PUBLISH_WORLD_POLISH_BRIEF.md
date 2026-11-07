Pulau Gobi — Post-EP005 World Polish (untuk Codex)
Status: EP005 sudah dipublikasikan. Jangan ubah video yang sudah tayang, VO, subtitle, timeline, komposisi, atau outro. Tujuan: memperbaiki aset bangunan/world secara statis agar otomatis lebih siap digunakan pada EP006 dan episode berikutnya.

Sumber QA visual: Episode005(1).mp4, 178,667 detik, 1080×1920/30fps. Source EP005 belum diperiksa langsung: branch/commit lokal codex/ep005-full-20261107 / 3093d8b belum terdeteksi pada GitHub remote. Codex harus membaca source lokal aktual sebelum menentukan file yang diubah.
Temuan video (timestamp kira-kira)
Bagian	Rentang	Temuan
Air terjun	00:24–00:39	Sudah terbaca sebagai air terjun melayang. Perlu shot hero dan keterbacaan skala yang lebih baik di episode berikutnya; bukan prioritas patch statis saat ini.
Aktivitas pertanian/peternakan	00:48–01:30	Lingkungan lebih ramai, tetapi gerak karakter/sapi masih terkesan sederhana; ini isu animasi untuk EP006, bukan perbaikan mesh statis.
Eksterior sekolah	01:36–01:54	Gedung utama dan lapangan sudah lebih besar, tidak perlu dibongkar.
Interior sekolah	01:55–02:18	Cutaway kelas terasa seperti ruang terbuka/terpotong, belum terbaca jelas berada di dalam sayap sekolah. Detail kelas, koridor, pintu dan material kurang kaya.
Penutup/outro	02:48–02:58	Transisi ke outro terasa mendadak, tanpa waktu settle yang memadai. Audio reuse EP004 cocok dengan sumber; perbaikan diarahkan ke episode berikutnya.


P0 — Perbaikan permanen kelas (KERJAKAN SEKARANG)
1. Audit geometri sekolah saat ini: sayap A, foyer, koridor, pintu utama, ruang kelas, posisi dinding, lantai, atap, dan relasi koordinatnya. Tidak boleh membuat kelas baru yang berdiri sendiri di luar gedung.
2. Jadikan kelas sebagai ruangan fisik utuh yang menempel dengan koridor dan memiliki pintu kelas berengsel/kusen dan jalur masuk yang benar-benar tersambung dari gerbang → halaman → pintu utama → foyer/koridor → pintu kelas.
3. Pastikan lantai, empat sisi struktur, jendela, kusen, plafon, dan struktur atap ada dalam world model secara default. Untuk pengambilan gambar interior masa depan, expose opsi camera cutaway yang menyembunyikan hanya sisi/atap penghalang kamera secara temporal. Dalam state biasa, bangunan harus utuh. Hindari potongan yang menampakkan ruang seperti diorama tak sengaja; bila memakai cutaway, tampilkan ketebalan tepi dinding/atap, frame jendela, dan konteks koridor.
4. Tata ruang kelas: papan tulis besar, meja guru + kursi, 8 meja/kursi murid dalam baris rapi, lorong tengah dan area depan kosong cukup untuk Gobi/Damia bergerak; tambah rak buku, jam dinding, poster edukasi original, tempat sampah, lampu plafon, alas lantai dan lis dinding secukupnya. Sekolah tetap BELUM punya murid resmi. Jangan menambah NPC atau seragam murid.
5. Perbaiki skala agar karakter bisa masuk pintu, berjalan di koridor, dan berinteraksi dengan meja. Jangan membuat pintu/kelas jadi raksasa hanya karena adegan sapi EP005; pastikan path traversal masuk akal untuk pejalan normal. Posisi dan ukuran harus berdasarkan source, bukan angka koordinat karangan.
6. Pertahankan sekolah dua lantai, tiga sayap, lapangan, ring basket, pagar, gerbang, tiang bendera, signage dan area sekeliling yang sudah ada. Perbaiki hanya relasi dan detail yang kurang, jangan merusak asset lainnya.
P1 — Static pass aset dunia (jika tidak mengganggu P0)
- Sekolah exterior: tekstur/material low-poly yang konsisten, repetisi jendela teratur, koridor terlindung dan pintu yang terbaca, marka lapangan yang tidak terlalu mencolok, jalur paving dari gerbang ke pintu utama, lampu/papan arah secukupnya.
- Kandang/peternakan: perjelas gerbang, palang pengunci, tempat minum, tempat pakan, jerami, jalur rumput/pasir yang masuk akal; pertahankan 3 sapi ber-ID permanen.
- Warteg: detail statis etalase/rak, kanopi, pintu, meja; jangan mengubah stok/cerita yang sudah terjadi.
- Kost dua lantai: perjelas tangga, railing, koridor lantai dua, enam pintu kamar; jangan mengubah jumlah enam kamar.
- Pertanian & sawah: posisi bedengan, saluran irigasi, tanaman jagung/wortel yang telah bertunas, padi lama pascapanen; tidak tiba-tiba panen ulang atau tumbuh penuh.
- Jalur antarzona: pastikan koneksi sekolah–permukiman–kandang, dan akses jembatan jika ada. Jangan memindahkan atau menghapus bangunan lama.
Kontinuitas wajib
- Semua penduduk EP001–EP005 tetap di roster: total 12 warga permanen + Gobi; warga baru EP005 guapusingnjir (Spesial), DamiaInsyirah🫐🤍 (Spesial/guru), dan RIS_26 (Biasa).
- Sekolah sudah ada dan Damia guru pertama, tetapi murid terpilih belum ada. Semua 3 sapi tetap ada; sapi cow-003 yang pernah ke sekolah tidak berubah identitas.
- World snapshot baru harus merepresentasikan kondisi setelah EP005, tidak menimpa arsip historis sebelum EP005.
- Pertahankan aset dan konstruksi EP001–EP004, termasuk sungai/air terjun, warteg, kost, dua tipe pertanian, kandang, jalan, pohon, dekorasi. Jangan reset world state.
Batas pengerjaan yang tegas
1. Buat branch kerja lokal terpisah dari 3093d8b (mis. codex/post-ep005-world-polish), jangan mengubah riwayat episode yang sudah tayang.
2. Scope hanya model dan layout statis + metadata akses + snapshot dunia pasca EP005, bukan kamera sinematik episode, animasi, VFX, SFX, soundtrack, VO, subtitle, transisi atau outro.
3. Jangan menjalankan Remotion preview/render video, still, atau mass camera audit. Tes struktur/data minimal yang relevan boleh dilakukan; jangan mengklaim kualitas visual terbukti tanpa preview pengguna.
4. Bila perubahan shared component berpengaruh pada re-render episode lama, isolasikan sebagai varian aset/snapshot pasca-EP005 yang dipakai EP006+, bukan perubahan retroaktif pada EP005 terpublikasi.
5. Jangan push/merge ke main sampai owner menyetujui integrasi.
6. Hasil: daftar berkas yang diubah, penjelasan geometri dan jalur, daftar aset yang ditambahkan, status test minimal, branch/commit dan catatan cara memakai state perbaikan pada EP006.
Backlog khusus EP006 — JANGAN implementasikan dalam patch ini
1. Acting: Gobi/NPC punya anticipation, contact, follow-through, eye target, gestures, ekspresi sinkron VO; sapi punya pose berat, gait, telinga dan ekor, bukan sekadar geser posisi.
2. Kamera: pilih shot dari kondisi world terbaru; wajah/gestur Gobi selalu terbaca saat VO; jangan berlindung di angka raycast saja; hindari punggung/shot terlalu jauh untuk dialog.
3. Animasi bangunan/VFX: proper weight, settle, debu, ripple/splash, perubahan bertahap yang bisa dibaca dan SFX sesuai objek, tanpa efek noise konstan.
4. Audio: audit semua SFX, cari noise/buzz/rumble yang tidak sesuai aksi, duck saat VO, caption alignment sungguhan; uji headphone+speaker HP.
5. Editing/outro: desain transisi penutup yang disengaja, ruang untuk kalimat outro lengkap + tail/hold 0,5–1 dtk, tidak mendadak berhenti. Anggarkan di VO supaya total <= 180 dtk.
6. QA: review minimal beberapa shot kritis lewat Studio di Windows sebelum render final; jangan gunakan kelulusan test kode sebagai pengganti review video.