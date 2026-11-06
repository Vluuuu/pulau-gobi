# Episode 003 — Arahan Kreatif Awal (belum naskah atau implementasi)

**Status:** ARAH KREATIF DISETUJUI; pilihan komentar, naskah, VO, storyboard detail, jumlah warga baru, model 3D dan ukuran pulau akhir BELUM diputuskan. Dokumen ini **bukan** perintah untuk langsung coding.

## Pilar yang sudah disetujui
1. Episode 003 melanjutkan dunia EP002 V4 approved tanpa reset. Rumah pertama, sawah, dua warga lama, pohon, rumput, batu dan dekorasi tetap ada.
2. Penonton yang follow dan komentar `Jadi Warga` adalah **calon warga**. Dipilih secara editorial; yang terpilih memperoleh model NPC 3D dan identitas persisten. Komentar ide yang dipilih dan dibangun = **Warga Spesial**.
3. Warga punya nama singkat saat dikenalkan/fokus kamera, tidak permanen sepanjang video.
4. Pulau ingin diperluas **jauh lebih besar** agar ada ruang penduduk/bangunan mendatang; jangan memaksa semua bangunan muncul bersamaan.
5. Saat Gobi bicara, gunakan close-up wajah dari depan/3/4; saat membuat satu objek, gunakan close-up objek untuk animasi satisfying; wide/isometric untuk establishing/reveal.
6. Tambahkan acting karakter, aktivitas NPC, lingkungan bergerak, lighting dan SFX yang mendukung, tanpa mengorbankan kesederhanaan low-poly.

## Kandidat rancangan untuk dibahas, belum final
- Radius pulau sekitar **35–40 world units** (±9–12× luas EP002); perlu uji framing, collision dan performa. Nilai final harus disetujui owner.
- Calon alur: Gobi gembira mendengar banyak orang ingin tinggal di Pulau Gobi, panik karena hanya ada satu rumah dan sawah belum panen, pulau meluas besar, muncul masalah tempat tinggal/makanan untuk episode berikutnya.
- Pembagian zona untuk **komposisi**, bukan permanen: pemukiman, pertanian, lahan kosong, zona ide selanjutnya.
- Camera presets reusable: `GobiFrontCloseup`, `GobiReaction`, `ObjectDetail`, `OverShoulder`, `IslandWide`, `ConstructionReveal`.

## Kebutuhan sebelum implementasi
- Pilih komentar asli yang akan diwujudkan dan kandidat warga baru. Pastikan username/izin dan mekanisme follow dapat dibuktikan sebatas akses platform.
- Tentukan hook/VO/dialog, storyboard dan alasan cerita ekspansi. Pilih radius akhir setelah melihat komposisi.
- Buat kontrak terpisah untuk Claude A (terrain), D (NPC visual), E (roster/world state), F (camera presets); B menyatukan adegan, C mengatur timing caption/VO.
- Tes visual di Windows setelah integrasi; tidak ada klaim EP003 sudah berjalan sekarang.
