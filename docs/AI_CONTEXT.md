# AI_CONTEXT — Pulau Gobi (2026-11-06, setelah EP002 approved)

## Source of truth dan status nyata
- Repository: https://github.com/Vluuuu/pulau-gobi, branch `main`.
- Source Episode 001–002 sudah ada di root repo, masuk pada commit `a200877e02056c1f4f4caa24eea9505a118739fd` dan tag `ep002-v4-approved`. Berkas `src/`, `public/`, `test/`, `package.json`, `package-lock.json` sudah dipush.
- EP001: pulau kecil + Gobi, sudah dirender dan dipublikasikan.
- EP002 V4 Windows Fix: 90 detik, 1080×1920 30 FPS, sudah dirender di Windows dan disetujui. Tidak perlu dibuat ulang.
- Snapshot editorial: `docs/world/EP001_STATE.json` dan `docs/world/EP002_STATE.json`; **belum otomatis dipakai runtime**. Release notes: `docs/episodes/EP002_RELEASE.md`.
- Episode 003 **naskah VO V1 sudah disetujui owner**, dan storyboard sinematik V1 sudah ditulis pada `docs/episodes/EP003_STORYBOARD_V1.md`. **VO MP3 belum dibuat**, timecode masih estimasi, source EP003 belum diimplementasikan.

## World state sesudah EP002
- Satu pulau utama melayang dengan radius 11,7 unit.
- Gobi (kaos oranye, celana navy, sneakers krem); rumah kayu di (-5,0,-1) skala 1,65.
- Sawah di (4,9,0,-2,6) skala 1,9, **padi belum siap panen**.
- Warga awal permanen: `oktaa.blushh`, `Afriza SuperStore`, keduanya kini dianggap **Warga Spesial Angkatan Pertama** dari komentar terpilih.
- Dekorasi pohon, semak, bunga, rumput, kerikil tetap ada. Jumlah penghuni termasuk Gobi = 3.
- Masalah naratif: baru satu rumah dan kebutuhan makanan belum terselesaikan.

## Sistem warga terbaru — disetujui
- Follow **dan** komentar `Jadi Warga` = **calon warga**, bukan otomatis diterima; kreator memilih.
- Warga biasa: peserta terpilih memiliki identitas model low-poly 3D unik dari basis reusable.
- Warga spesial: komentar ide yang dipilih dan diwujudkan; tampil dalam momen cerita istimewa.
- Nama panggilan/username: muncul sekitar 2–3 detik saat perkenalan atau saat fokus, **tidak permanen**.
- Hanya sebagian NPC yang ditampilkan per adegan; yang lain tetap ada di roster. Jangan klaim akses follower otomatis.
- **Belum diimplementasikan:** sistem pendaftaran calon warga, skala populasi dan pipeline identitas reusable baru. Claude E bertugas merancangnya bila diputuskan dalam brief.

## Arah sinematik baru — disetujui
- Isometric/orthographic untuk establishing/wide reveal, tetapi ketika Gobi bicara gunakan frontal/three-quarter close-up yang menonjolkan wajah/gestur.
- Ketika membangun satu objek, gunakan object-detail close-up; kemudian reveal wide yang mempertahankan objek lama.
- Reaksi tubuh/wajah yang sesuai narasi, aktivitas NPC, gerak lingkungan ringan, lighting, SFX dan kamera yang punya tujuan.
- **Rencana, belum final:** pulau EP003 ingin sangat besar; radius 35–40 unit usulan eksploratif, bukan ukuran pasti.
- Baca `docs/episodes/EP003_STORYBOARD_V1.md` untuk naskah/shot draft yang disepakati. Ini **bukan perintah langsung coding** sebelum VO MP3, source komentar dan kontrak modul siap.

## Enam Claude Browser sesuai spesialisasi
- A world builder (aset, terrain, bangunan); B episode director (scene, pacing, integrasi);
- C captions/audio; D character/NPC model/animasi; E population/roster/world state; F sinematografi/camera preset/lighting.
- **E dan F adalah penugasan baru, belum ada kode/fitur yang dibuat oleh mereka.** Tidak semua Claude perlu dipakai setiap episode; hindari dua Claude menulis file yang sama secara paralel.
- ChatGPT = sutradara kreatif, script/storyboard, prompt, QA dan dokumentasi; Windows = preview/render/test; GitHub = source of truth.
- Outro selalu persis: **"Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!"**
- Repo saat dicek **public**. Jangan ubah visibility tanpa izin pemilik.

## Langkah selanjutnya
Siapkan MP3 ElevenLabs dari naskah EP003 yang disetujui; setelah durasi diketahui sesuaikan timecode storyboard, ambil screenshot komentar sah, finalkan radius/kontrak modul, baru prompt coding Claude A–F.
