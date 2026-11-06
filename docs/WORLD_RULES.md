# Aturan Dunia & Kontinuitas

## State permanen
- Dunia memakai ID permanen bagi pulau, Gobi, struktur, sawah, dekorasi, warga dan makhluk.
- Setiap episode mulai dari keadaan episode sebelumnya, mencatat before/action/after. Objek lama tidak boleh menghilang, pindah atau berubah skala tanpa alasan cerita.
- Dunia dapat berkembang menjadi multi-island dan unsur fantasi, tidak terbatas realisme.
- Snapshot editorial `docs/world/EP001_STATE.json` dan `EP002_STATE.json` adalah referensi untuk cerita. **Saat ini JSON belum menjadi input otomatis renderer**, sehingga sinkronkan dengan source TS.
- Episode 003 mempertahankan rumah kayu pertama, sawah yang belum panen, warga awal `oktaa.blushh` dan `Afriza SuperStore`, serta dekorasi EP002.

## Mekanisme warga (keputusan 2026-11-06)
1. Orang yang **follow dan komentar "Jadi Warga"** masuk sebagai **calon warga**, tidak otomatis diterima. Kreator memilih kandidat; verifikasi follow sebatas data yang tersedia pada platform. Jangan memalsukan verifikasi.
2. Setiap **warga biasa terpilih** memiliki ID, username/nama panggilan yang diizinkan, penanda platform bila relevan, serta karakter low-poly 3D dari template reusable dengan variasi visual. Nama/identitas sensitif tidak dicatat sembarangan.
3. **Warga spesial** adalah peserta yang ide komentarnya dipilih dan diwujudkan dalam cerita; boleh memiliki intro khusus atau peran kecil dalam pembangunan. Keduanya yang muncul di Episode 002 berstatus spesial angkatan pertama sebagai warisan aturan sebelumnya.
4. **Papan nama di atas kepala tidak permanen**: 2–3 detik saat dikenalkan, atau saat kamera menyorot seseorang. Fade out; harus terbaca dan tidak menghalangi subtitle.
5. Warga permanen di roster meski tidak selalu tampil. Per episode hanya pilih secukupnya untuk staging dan performa; tidak wajib merender semua follower sekaligus.
6. NPC ringan dan deterministik: diam, berjalan, berbalik, gestur, aktivitas kecil; bukan simulasi AI, ekonomi, profesi atau physics.
7. Komentar kreatif tetap dipilih secara editorial; tidak semua ide diwujudkan. Jangan menjanjikan semua pendaftar langsung menjadi warga.

## Kontinuitas dan etika konten
- Catat komentar sumber ide, tanggal/platform bila tersedia, status pilihan dan tautan/screenshot yang boleh dipublikasikan. Gunakan nama panggilan sukarela jika diminta; lakukan moderasi dan hindari memamerkan data pribadi.
- Jika warga berpindah pulau, berganti pakaian atau tidak terlihat, pertahankan ID dan sejarahnya. Jangan menghapus warga tanpa alasan cerita.
- Pembesaran pulau harus mengakomodasi kamera, collision, lokasi aset lama, dan konsekuensi plot. Jangan otomatis mengisi lahan baru dengan semua bangunan.
- Pulau berkembang berdasarkan ide/kebutuhan cerita, bukan pola episode kaku.

## Baseline numerik pasca-EP002
- Pulau utama radius 11,7; rumah pada (-5,0,-1) skala 1,65; sawah pada (4,9,0,-2.6) skala 1,9, belum panen; total populasi termasuk Gobi: 3.
- Untuk data detail, lihat `docs/world/EP002_STATE.json` dan komponen source `src/episode002/`.
