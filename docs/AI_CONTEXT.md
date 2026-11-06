# AI_CONTEXT — Pulau Gobi (2026-11-06, setelah EP002 approved)

## Source of truth dan status nyata
- Repository: https://github.com/Vluuuu/pulau-gobi, branch `main`.
- Source Episode 001–002 sudah ada di root repo, masuk pada commit `a200877e02056c1f4f4caa24eea9505a118739fd` dan tag `ep002-v4-approved`. Berkas `src/`, `public/`, `test/`, `package.json`, `package-lock.json` sudah dipush.
- EP001: pulau kecil + Gobi, sudah dirender dan dipublikasikan.
- EP002 V4 Windows Fix: 90 detik, 1080×1920 30 FPS, sudah dirender di Windows dan disetujui. Tidak perlu dibuat ulang.
- Snapshot editorial: `docs/world/EP001_STATE.json` dan `docs/world/EP002_STATE.json`; **belum otomatis dipakai runtime**. Release notes: `docs/episodes/EP002_RELEASE.md`.
- Episode 003 **naskah VO dan cast disetujui**, storyboard ada di `docs/episodes/EP003_STORYBOARD_V1.md`; **VO final sudah tersedia sebagai lampiran pemilik `eps 3.mp3`, 99.552625 s (BELUM masuk repo)**. Brief handoff terbaru `docs/episodes/EP003_PRODUCTION_BRIEF.md`. Source EP003 belum diimplementasikan; timecode tiap kalimat menunggu alignment.

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
- **Belum diimplementasikan:** sistem pendaftaran dan pipeline identitas NPC reusable. Untuk EP003, 4 warga baru dipilih pemilik: `shifalina_`, `damar_zan`, `Eka Agustin`, `joy.__3.15`; total penghuni setelah EP003 direncanakan 7 termasuk Gobi. Detail klasifikasi lihat production brief.

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
VO EP003 sudah tersedia sebagai lampiran pengguna (99.552625 s), screenshot komentar diterima, production brief serta prompt A–F ada di `docs/episodes/EP003_PRODUCTION_BRIEF.md` dan `docs/tasks/ep003/`. Berikutnya alignment MP3 oleh Claude C, kontrak A/E/F/D, lalu integrasi Claude B dan QA Windows. Radius final belum ditentukan.

## EP003 World Builder task split (6 Nov 2026)
- Claude A untuk EP003 dipecah menjadi A1 terrain/layout, A2 river, A3 house renovation, A4 warteg. B membuat world barrel `src/episode003/world/index.ts` dan mengintegrasikan. Baca `docs/tasks/ep003/CLAUDE_A_SPLIT.md`.
- Paket tugas Claude adalah ZIP scoped lokal; sesi Claude tidak perlu membuka GitHub. Source resmi tetap `main` untuk integrasi/commit akhir.
- Claude E sudah melaporkan patch data selesai (6 warga, 105 follower agregat, radius draft 37.5) dengan 9/9 tests PASS, **belum** integrasi. Patch A1–A4 belum diterima/diuji.
