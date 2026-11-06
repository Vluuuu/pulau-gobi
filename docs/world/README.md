# Snapshot dunia Pulau Gobi

Dokumen ini menyimpan **keadaan akhir permanen setiap episode** supaya source berikutnya tidak mereset dunia.

- `EP001_STATE.json`: setelah Episode 001 (satu pulau kecil, Gobi sendirian).
- `EP002_STATE.json`: setelah Episode 002 (pulau besar, satu rumah, satu sawah, dua warga).
- Episode 003 harus mulai dari keadaan akhir EP002; komentar baru hanya menambah atau mengubah objek melalui cerita.
- ID karakter, warga, rumah, sawah dan pulau tidak boleh dipakai ulang untuk objek berbeda.
- Komentar terpilih menambah warga **satu per akun yang dipilih**, bukan otomatis setiap follower/komentar.
- NPC sederhana: berjalan, berhenti, berbalik, tetap jauh dari tepi pulau/bangunan; nama muncul sebentar saat pengenalan.
- **Catatan teknis:** JSON ini adalah *snapshot dokumentasi*, BELUM menjadi input runtime. Untuk koordinat dan model aktual, lihat `src/episode002/sceneLayout.ts`, `villagerRoster.ts` dan `islandDecor.ts`. Jika kode/cerita berubah, perbarui snapshot bersamaan; jangan membuat state kedua yang bertentangan.
