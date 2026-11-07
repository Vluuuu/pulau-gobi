# Pulau Gobi Episode 004

Branch `codex/ep004-full-20261107`, worktree `D:/pulau-gobi/ep004-full`, melanjutkan pilot disetujui **d90d506** dan integrasi EP003 **a29be83**. Main terbaru saat mulai tetap **b796efe**; tidak push/merge main. Episode 001–003, rumah dua lantai, sungai, warteg, sawah lama dan seluruh dekor lama dipertahankan.

## Preview Windows

```powershell
cd D:\pulau-gobi\ep004-full
npm run dev
```

Pilih **Episode004**: **1080×1920, 30 FPS, 4327 frame / 144,233 detik**. Checkout baru memerlukan `npm ci`; junction node_modules lokal tidak ikut source. Composition pilot dan seluruh composition lama tetap tersedia.

## Implementasi

- Penghijauan bergelombang dan ekspansi **37,5 → 52** mengikuti opsi ekspansi yang sekarang diizinkan pengguna. Tambahan 145 pohon, 150 semak, 360 rumpun rumput, 150 bunga, 45 batu, pohon pertama Irtiza dan jalur. Di-instancing; plot, parit, aset lama dan koridor gerak dijaga. Vegetasi luar muncul setelah tanah tersedia.
- Pertanian baru di [10,0,-12]: enam bedengan **kosong**, tali pandu, sumur/tangki/pompa, pintu air, saluran utama dan enam cabang irigasi, bak resapan, pagar, gerobak dan karung. Air tidak diambil dari sungai dan tidak melintasi sawah lama.
- Peternakan di [-12,0,-14]: pagar, rangka, dua bidang atap, gerbang, palung, jerami, bangku/lentera penjaga; **tanpa hewan**.
- Kost di [4,0,14]: desain pilot ditingkatkan dengan pembangunan pondasi/lantai satu → lantai dua/pintu/jendela → atap/dekor. Enam kamar bernomor, balkon dan tangga luar. Karakter menonton dari luar footprint saat bangun.
- Sembilan warga + Gobi. Tiga Warga Spesial baru: `warga-7` irtizadelanorillaridwan, `warga-8` fredrikz_24, `warga-9` Xyree. Model generik reusable, bukan klaim likeness. Aktivitas menanam, merentang tali, mengoperasikan irigasi, memeriksa pagar dan menjaga kandang; reward bintang. Roster EP003 tidak ditulis ulang dan status Joy tidak diubah.
- Seluruh beat V1+V2 dihubungkan: hook 201 **calon** warga, komentar asli, empat pembangunan, interaksi penjaga, antrean rumah, komedi pilot, pemulihan, cutaway lahan/kandang kosong, poll, CTA seleksi dan outro. Perjalanan terlihat memakai perpindahan dan stride berbasis jarak; pergantian zona tertentu memakai editorial cut. Bukan simulasi perjalanan dunia tanpa cut.
- Kamera pembangunan statis agak tinggi; hard cut untuk pergantian sudut. Follow hanya untuk lari, satu crane outro dengan interpolasi log-width. Nama memakai packing deterministik dan LOD/fade pada wide; subtitle putih dengan highlight aktif kuning. Komedi memakai pose/camera/bubble pilot, dengan hold jatuh lebih panjang.

## VO02: pemotongan yang disetujui

Pengguna secara eksplisit mengizinkan membuang pengulangan. VO02 asli **22,752625 s** tersimpan di `audio-backups/ep004_vo_02.original.mp3`. Versi timeline **11,363250 s** mempertahankan satu blok lengkap pertama dan berakhir pada jeda alami sebelum blok kedua.

Metode: **MP3 packet stream copy**, tanpa encoding ulang, perubahan kecepatan, penyusunan ulang kata, atau generate VO. Bagian decode hasil sama persis dengan prefix asli (**max absolute difference 0**). Kata terakhir take pertama selesai sekitar 11,04 s; pengulangan mulai sekitar 11,48 s. File asli di ZIP referensi juga tetap utuh. Bukti: `out/ep004-evidence/vo02-edit.json`.

Semua 19 VO dipakai berurutan. Delapan belas lainnya identik SHA-256 dengan manifest pengguna. Total VO final sekitar **98,09 s**; durasi film bertambah karena jeda pembangunan, baca bubble, gerak, komedi dan hold. Tidak memaksa batas 125 detik. Subtitle berasal dari estimasi kata ASR lokal, dengan normalisasi nama/ejaan/angka sesuai naskah; **belum verifikasi dengar manusia penuh**. Outro mempertahankan teks akhir yang disetujui dan di-hold sampai frame terakhir.

## Audio dan pemeriksaan

14 aset SFX prosedural original (enam pilot + delapan produksi), seed tetap; 112 cue SFX, ditambah bed angin. Jeda pembangunan memiliki Foley nyata. Bed angin diredam pada beat diam komedi dan fade akhir. Generator produksi: `scripts/ep004-production-sfx.py`. Tidak memakai rekaman pihak ketiga atau menambahkan suara ternak.

Pemeriksaan relevan: tujuh test pilot dan sebelas test produksi lulus; bundle/registrasi composition; dua still terarah (irigasi dan final wide), bukan bukti persetujuan gerak. Pemeriksaan envelope badan terhadap badan lain, batang pohon dan semak dilakukan pada 4327 frame, bukan full mesh/limb collision. Analisis penjumlahan gelombang VO+SFX memberi sample peak **−1,87 dBFS**, tanpa sample clipping; true peak/LUFS dan pendengaran manusia tidak diklaim.

Typecheck masih memiliki **TS2740 baseline** pada `src/episode002/Villager.tsx(104,71)` (`number[]` vs `Vector2`); tidak ada diagnostik baru. Source legacy itu tidak diubah. Tidak menjalankan seluruh suite lama atau render MP4.

Source baru di `src/episode004/production/**`, media di `public/episode004/{voice,sfx,comments}/`, test `test/ep004-production.test.mjs`. Shared API di `ResidentActor.tsx` dan `pilot/Actors.tsx` memperoleh props opsional dengan default kompatibel; `pilot/KostProxy.tsx` memperoleh progress konstruksi dan akses tangga khusus produksi. `Root.tsx` hanya menambahkan Episode004. Dependency/lockfile tetap.

```powershell
node --test --experimental-strip-types test/ep004-production.test.mjs
npx tsc --noEmit
```

Bukti teknis/analisis audio tersedia di `out/ep004-evidence/` (artefak lokal, bukan bagian source commit). Persetujuan visual/audio dan render akhir tetap oleh pemilik melalui playback Windows. Periksa pengucapan nama/angka, ritme antar-shot, volume Foley, keterbacaan tag dan timing adegan pembangunan/komedi.
