# Aturan Dunia & Kontinuitas

## World state
- Dunia memakai stable IDs, bukan sekadar array posisi yang berubah tanpa jejak.
- State mencakup `islands`/wilayah, terrain, structures, props, residents, creatures, relations, dan flags kejadian.
- Pulau pertama selalu ada; pulau baru menambah node dunia, bukan mengganti pulau utama.
- Objek memiliki `id`, `type`, `islandId`, transform/position/rotation/scale, data aset, waktu diperkenalkan, dan status.
- Setiap episode mencatat **before state**, action(s), **after state** immutable/snapshot, serta komentar terpilih.
- Peristiwa perusakan/penghilangan objek harus berupa aksi cerita yang eksplisit; tidak boleh terjadi karena data hilang.

## Aturan kreatif
1. Komentar bisa mengusulkan apa pun dalam batas aman/layak tayang: bangunan, manusia, naga, pulau baru, area langit, dll.
2. Kreator menyunting/memilih ide berdasarkan kualitas cerita, desain, durasi, kelayakan, dan moderasi. Tidak semua komentar dijanjikan terwujud.
3. Lahan boleh diperluas; kamera harus dapat framing ulang. Hindari aset terlalu kecil dalam long shot.
4. Efek absurd harus punya konsekuensi yang bisa dipahami Gobi dan penonton.
5. Perkembangan permanen, tidak reset tiap episode. Jika perlu reset naratif, jadikan episode spesial yang jelas.
6. Jangan memakai username/komentar sensitif secara otomatis; periksa privasi dan konteks bila menampilkannya.

## Contoh transisi
- `ep001`: pulau_utama luas kecil + resident:Gobi, struktur=0, vegetasi=0.
- `ep002`: request rumah → add structure:rumah-01, terrain expansion bila dibutuhkan.
- `ep003`: request tambah penduduk → add resident, posisi, relasi ke bangunan jika ada.
- `ep004`: request pulau baru/kandang naga → add island-02 + habitat + creature yang logis.

Contoh di atas adalah ilustrasi, bukan urutan konten yang sudah ditetapkan.
