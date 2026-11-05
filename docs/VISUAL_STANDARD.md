# Visual Standard — Pulau Gobi

> **v1.0 — concept baseline, 2026-11-05.** Arah visual dunia dan outfit Gobi telah disepakati. Nilai material, framing, skala, dan pencahayaan harus diuji pada still Three.js dan disetujui sebelum dianggap **VISUAL LOCKED**. Belum ada model/renderer produksi.

## 1. Art direction dan dunia

- **Premis visual tetap:** satu pulau kecil **melayang di langit** dengan satu manusia Gobi; dari episode pertama tidak ada rumah, pohon, struktur, hewan, fasilitas, atau pulau lain.
- **Gaya:** *premium stylized low-poly 3D / miniature floating-diorama*. Geometry sederhana tetapi komposisi, shading, dan silhouette matang. Bukan Minecraft/voxel, bukan cel-shaded 2D, bukan photorealistic.
- **Mood:** cozy, satisfying, playful, sedikit magis. Perubahan dunia di masa depan boleh absurd dan fantastis, tetapi tetap satu art direction.
- **Logika multi-island:** pulau utama punya identitas permanen; pulau tambahan dapat hadir di lokasi/ketinggian lain di langit. Jangan mengunci background pada satu pulau selamanya.

## 2. Bentuk pulau Ep001

- Siluet asimetris, organik; secara logika dapat memakai cell untuk ekspansi tetapi **render mesh tidak terlihat sebagai kotak-kotak cell**.
- Atas: lapisan rumput melengkung halus dengan tepi bervariasi, sedikit triangulasi low-poly. Permukaan cukup rata agar Gobi dapat berdiri.
- Sisi: tanah berfaset jelas dengan variasi bentuk dan kedalaman; bagian bawah mengerucut menjadi batu mengambang. Hubungan rumput–tanah–batu terlihat menyatu.
- Permukaan atas **kosong** kecuali Gobi; jangan menyiasati kekosongan dengan pohon, bunga, batu dekoratif, bangku, jalan, rumput rumpun, atau rumah.
- Awan berada di **lingkungan langit**, bukan vegetasi atau dekorasi di permukaan pulau. Awan tidak boleh menutupi karakter.
- Tidak ada lautan, garis horizon air, atau ground plane biasa di bawah pulau.

## 3. Palet v1 (perlu review pada still)

| Material/kebutuhan | Referensi HEX | Prinsip |
| --- | --- | --- |
| Langit dasar | `#CBE9F5` | pastel biru muda, sedikit variasi tonal |
| Awan | `#F5F6F4` | warm-white; hindari putih clipping |
| Rumput atas | `#83BF72` | hijau hangat, tidak neon |
| Tanah | `#AF7D5D` | cokelat hangat dengan facet lebih gelap/terang |
| Batu bawah | `#80706D` | abu hangat, tidak kebiruan berlebihan |
| Cahaya warm highlight | `#F1C48F` | aksen sinar pagi, bukan filter oranye global |
| Kaos Gobi | `#E88A4E` | oranye utama, kontras terhadap rumput/langit |
| Celana Gobi | `#344B63` | navy kontras sedang |
| Sneakers Gobi | `#F3EBDD` | krem terang, siluet kaki terbaca |
| Teks utama | `#FFFFFF` atau `#142A39` | pilih berdasarkan latar/kontras |
| Highlight subtitle | `#FFD464` | kuning hangat untuk kata/frasa aktif |

Centralize warna dalam palet proyek. Verifikasi tampilannya setelah tone mapping, lighting dan shadow. Tidak perlu menambah banyak material/warna hanya untuk detail kecil.

## 4. Pencahayaan dan atmosfer

- Nuansa waktu: **pagi cerah**, natural; satu key light hangat lembut dari kiri-atas kamera, fill/ambient skylight lebih dingin, shadow berarah dan lembut.
- Gunakan cast shadow Gobi yang jelas pada rumput; contact shadow dapat terbaca di bawah kaki. Hindari Gobi terlihat melayang di atas tanah.
- Shadow tidak terlalu gelap sehingga mata/wajah hilang; hindari jagged shadow, z-fighting, overexposure, dan kesan datar tanpa volume.
- Atmosfer langit sederhana dengan sedikit gradasi, bukan partikel berlebihan. Awan bergerak halus hanya jika tidak mengganggu framing atau determinisme.
- Jangan menambahkan efek bloom, depth-of-field berat, volumetric cloud mahal, atau physics hanya untuk still awal.

## 5. Kamera dan framing

- Default: **orthographic** dengan azimuth awal **45°** dan elevasi awal **35°**; nilai sebenarnya harus dikalibrasi dari still.
- Tidak harus satu shot statis: wide untuk establishing, medium untuk akting Gobi, close-up seperlunya. Perpindahan kamera selalu punya tujuan cerita.
- Wide shot Episode 001 wajib memperlihatkan **pulau secara utuh** termasuk ujung tanah/batu bawah tanpa terpotong, dengan langit cukup untuk menunjukkan bahwa pulau melayang.
- Medium/close-up wajib memperlihatkan wajah dan tangan Gobi dengan jelas; outfit oranye–navy–krem harus masih dapat dikenali.
- **Safe area awal untuk desain 1080×1920:** sisakan kira-kira 90 px margin kiri/kanan, 180 px atas, dan 300 px bawah untuk elemen kritis; ini batas desain konservatif, **bukan** jaminan UI aman di semua platform. Uji preview di tiap platform.
- Jangan menempatkan subtitle di atas wajah Gobi atau momen pembangunan penting.

## 6. Skala relatif dan geometry (baseline sampai still)

- Satuan logika: `1 world unit = 1 cell` (sesuai D8); **tinggi Gobi referensi = 1 world unit (1 G)**.
- Target bentuk Gobi **3,5–4 kepala** dari atas rambut sampai sol sepatu.
- Pulau utama Ep001 target awal rentang **7×7 sampai 9×9 cell** secara logika; kontur mesh tampak organik/asimetris.
- Aset masa depan (bukan untuk Ep001): tinggi pintu ~1,3 G, rumah kecil footprint ~3×3 cell, pohon kecil tinggi ~2,5 G.
- Saat still, periksa Gobi tidak terlalu kecil dari wide shot dan tidak terlalu besar sampai pulau terasa sempit; revisi skala angka bersama owner jika perlu tanpa merusak perbandingan logika.

## 7. Standar karakter

- Referensi tunggal detail Gobi: [`CHARACTER_BIBLE.md`](CHARACTER_BIBLE.md).
- Gobi semi-chibi proporsional, berartikulasi, kaos oranye, celana pendek navy, sneakers krem. Rambut hitam dan kulit sawo matang adalah usulan awal yang perlu review still.
- Identitas wajah, pakaian, rig, material, dan proporsi dijaga dengan satu `GobiSpec` versi agar konsisten semua episode.
- Setiap aksi pembangunan/pulau yang berarti harus direspons Gobi melalui acting sesuai shot.

## 8. Animasi dan motion language

- Gerak kamera halus, tidak tiba-tiba zoom/pan tanpa motivasi.
- *Build animation* berurutan dan memuaskan (fondasi → badan → atap → detail); *terrain expansion* menampilkan tambahan daratan; *fantasy summon* memakai bahasa efek tersendiri.
- Easing, anticipation, overshoot kecil dan settle digunakan dengan sengaja, tidak semuanya spring/pop.
- Semua transform/partikel bergantung pada frame Remotion dan seed tetap; tidak boleh bergantung pada jam sistem atau frame-rate real-time.
- Episode 001 hanya idle/lihat sekeliling/reaksi Gobi, **tidak** membuat pohon atau rumah.

## 9. Overlay, subtitle, audio

- Bahasa visual dan narasi: **Indonesia**.
- Font baseline yang diusulkan: **Plus Jakarta Sans**, weight tebal untuk judul dan medium/semibold untuk subtitle; verifikasi hak penggunaan dan file font sebelum embed, fallback sans-serif.
- Subtitle maksimal sekitar 2 baris per beat; pilih frasa pendek yang sesuai VO. Highlight kata/frasa aktif dengan `#FFD464`, tanpa animasi berlebihan yang mengganggu world scene.
- CTA/outro **persis**: **"Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!"**. Elemen teks dan narasi akhir harus konsisten, tidak dipendekkan.
- Final output **1080×1920, 30 FPS**; preview boleh lebih kecil. Durasi final mengikuti VO ElevenLabs, bukan angka detik asal.

## 10. QA visual dan deliverables tahap V (belum dijalankan)

**Masih yang harus disetujui sebelum engine produksi / Episode 001:**

1. Character sheet **dari model Three.js yang sama**: front, side, back, 3/4, neutral, surprise, wave/walk; bukan beberapa gambar AI yang tidak konsisten.
2. Island still: top/3-4 isometric wide + medium Gobi; pulau utuh, kosong, tanah berfaset, awan tidak menutupi karakter.
3. Varian lighting/palet 2–3 opsi dalam *lab minimal reusable* (tidak membangun seluruh engine).
4. Pemeriksaan detail: wajah dan tangan, silhouette thumbnail, kaki kontak tanah, shadow bersih, warna antarframe, framing vertikal, tanpa clipping.
5. Pemeriksaan teknis di laptop: TypeScript/build, preview still, dan visual review owner. Claude melaporkan PASS/FAIL/NOT-RUN secara jujur.
6. Setelah owner memilih hasil still: catat revisi angka/palet/kamera dalam dokumen ini, beri status **VISUAL LOCKED**, dan versi asset Gobi disahkan.

**Status sekarang:** keputusan kreatif fundamental **FINAL**, detail teknis **TARGET v1**, still/render/rig **NOT-RUN**. Jangan klaim model final atau fase V selesai sebelum bukti visual diperiksa.
