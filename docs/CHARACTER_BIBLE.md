# Character Bible — Gobi

> Versi konsep visual: **v1.0 — 2026-11-05**. Identitas dan outfit di bawah telah dipilih owner. Angka proporsi, bentuk detail, dan ekspresi adalah *production targets* yang perlu divalidasi lewat still 3D sebelum model dinyatakan final. Dokumen ini tidak menyatakan model sudah dibuat.

## 1. Identitas tetap

- **Nama:** Gobi. **Peran:** protagonis dan penghuni pertama Pulau Gobi.
- **Karakter:** pemuda Indonesia yang penasaran, ramah, kreatif, sedikit ceroboh; humor dari reaksi, bukan kekejaman.
- **Premis Ep001:** Gobi sendirian di pulau kecil yang melayang di langit. Tidak ada rumah, pohon, penduduk lain, atau fasilitas buatan.
- **Gaya:** premium stylized low-poly 3D dengan proporsi **semi-chibi tetapi tetap manusiawi**, bukan bayi/chibi ekstrem, voxel, atau photorealistic.
- **Siluet dan model wajah harus konsisten** dari episode ke episode. Setiap perubahan desain yang tampak perlu persetujuan owner dan versi aset baru.

## 2. Elemen desain: status keputusan

| Elemen | Keputusan / arah kerja | Status |
| --- | --- | --- |
| Proporsi | Semi-chibi, tubuh proporsional dan artikulasi nyata | **DIKUNCI (arah)** |
| Kaos | **Oranye hangat** | **DIKUNCI** |
| Celana | **Pendek biru tua** | **DIKUNCI** |
| Sepatu | **Sneakers krem** dengan sol jelas | **DIKUNCI** |
| Wajah | Sederhana, mudah membaca senyum, kaget, khawatir | **DIKUNCI (fungsi)** |
| Rambut | Pendek hitam, sedikit asimetris, satu siluet jambul khas | **USULAN v1, tunggu still** |
| Warna kulit | Sawo matang hangat; shading natural | **USULAN v1, tunggu still** |
| Aksesori | Tidak perlu aksesori untuk versi pertama | **USULAN v1** |
| Ukuran terukur | Tinggi ≈1 unit dunia = 1 G; total 3,5–4 tinggi kepala | **KALIBRASI melalui still** |

## 3. Bentuk dan proporsi untuk modeler kode

- Target sekitar **3,75 kepala** dalam total tinggi; kepala sedikit lebih besar untuk ekspresi tetapi tidak menyita separuh tubuh.
- Kepala: bentuk membulat bersisi/faceted lembut; bukan bola sempurna tanpa karakter. Dagu dan pipi tetap dibentuk agar ada arah muka.
- Rambut: bentuk sculpted low-poly yang menyatu dengan kepala; hindari tumpukan kerucut acak.
- Mata: dua mata yang jelas dari medium shot, pupil dan alis dapat diarahkan; jangan tampak seperti stiker datar yang melayang. Hidung minimal. Mulut bisa berubah bentuk (senyum, O, khawatir).
- Bahu, lengan atas, siku, lengan bawah, pergelangan, telapak tangan, paha, lutut, betis, pergelangan kaki, sepatu: semua punya volume dan pivot yang masuk akal.
- Tidak boleh ada celah antarsambungan yang terlihat saat pose biasa; hindari tangan/kaki seperti batang tanpa kaki/telapak.
- Kaos memiliki bentuk bahu dan sedikit lengkung kain, tidak sekadar box; celana pendek tetap terbaca dari silhouette.
- Sneakers mempunyai punggung, ujung kaki, dan sol sehingga orientasi langkah bisa dilihat.
- Skala/warna *harus* terpusat dalam `GobiSpec` versi, bukan angka tersebar di berbagai file.

## 4. Palet karakter — titik awal v1

| Bagian | HEX | Status |
| --- | --- | --- |
| Kaos oranye | `#E88A4E` | Warna referensi, kalibrasi tonemapping saat still |
| Celana navy | `#344B63` | Warna referensi, kalibrasi saat still |
| Sneakers krem | `#F3EBDD` | Warna referensi, kalibrasi saat still |
| Rambut | `#292421` | Usulan |
| Kulit | `#C78B68` | Usulan |
| Mata/alis | `#252425` | Usulan |

HEX merupakan nilai material *referensi*, bukan jaminan output layar persis sama setelah lighting dan color management.

## 5. Rig dasar yang wajib mendukung animasi

```
root
└── hips
    ├── torso → chest → neck → head (face: eyes/eyebrows/mouth)
    ├── upperLeg.L → lowerLeg.L → ankle.L → foot.L
    └── upperLeg.R → lowerLeg.R → ankle.R → foot.R
chest → shoulder.L/R → upperArm.L/R → foreArm.L/R → wrist.L/R → hand.L/R
```

Hierarki teknis akhir boleh disesuaikan, asalkan semua bagian tersebut memiliki pivot dan kontrol pose yang dapat dianimasikan. **Animasi deterministik per frame**, bukan waktu real-time.

## 6. Library acting minimal — target awal

| Clip | Kualitas yang harus terlihat |
| --- | --- |
| `idle` | napas halus, weight shift kecil, kedip natural |
| `walk` | lengan berayun, pinggul/kaki bergerak sinkron, telapak kaki tidak sekadar meluncur |
| `lookAround` | kepala, mata, bahu, dan torso saling merespons |
| `surprise` | anticipation, kepala/torso bereaksi, alis dan mulut terbuka |
| `wave` | gerak bahu–siku–pergelangan, bukan tangan kaku berputar dari bahu saja |
| `celebrate` | gerak antusias singkat, stabil saat kembali idle |

Clip lanjutan (`inspect`, `point`, `worried`, `sit`, dll.) dibuat saat cerita membutuhkan. Hindari menulis library animasi yang belum diperlukan.

## 7. Ekspresi minimum

`neutral`, `happy`, `surprised`, `worried`, `curious` — mata/alis/mulut dapat digabung dengan pose tubuh. Perubahan ekspresi tidak boleh mengubah struktur wajah atau identitas Gobi.

## 8. Hubungan dengan dunia

- Gobi selalu menghadap, bergerak, atau bereaksi terhadap kejadian bermakna; ia tidak boleh menjadi model diam sepanjang video.
- Posisi Gobi tersimpan sebagai penduduk `res:gobi`, dengan `islandId`/transform yang konsisten pada world state.
- Gerakan tidak boleh menembus tanah, jatuh dari pulau tanpa peristiwa cerita, atau menggeser rumah/objek tanpa sebab.
- Penduduk baru menggunakan karakter/assetId berbeda tetapi masih sesuai bahasa visual Pulau Gobi.

## 9. Gerbang persetujuan model 3D (belum PASS)

Sebelum menyatakan model final, tunjukkan masih PNG berikut dari *kode Three.js sebenarnya*, bukan gambar generatif: (1) tampak depan, (2) samping, (3) belakang, (4) three-quarter/isometric, (5) close-up wajah netral dan kaget, (6) satu pose berjalan dan melambai, (7) Gobi pada pulau kosong dalam komposisi vertikal. Periksa keterbacaan siluet pada ukuran thumbnail dan setiap sambungan rig. Setelah owner menyetujui, kunci `GobiSpec` versi produksi. Saat ini statusnya **spesifikasi konsep disetujui; model 3D NOT-RUN/NOT-REVIEWED**.
