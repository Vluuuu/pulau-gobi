# EP006 — empat koreksi P0, menunggu preview pemilik

Branch `codex/ep006-production`, baseline `c652fc9`. Durasi tetap **4649 frame / 154,966667 detik**, 38 beat. Revisi source; belum ada persetujuan visual. VO, audio/SFX, storyline, interior lengkap, animasi splash dan outro CurrentWorld tidak diganti. Episode 001–005 tidak diubah. Tidak push/merge.

## 1. Pintu kelas dan kursi

Penghalang langsung adalah **Afriza SuperStore (`warga-2`)**, pada `[-20,0,-19.6]`, tepat di lintasan A01. Posisi warisan oktaa.blushh (`warga-1`) dan guapusingnjir (`warga-10`) juga berada di foyer/lantai lama; `warga-10` beririsan dengan bay Gobi. Ketiganya dipindahkan ke sisi halaman barat, di luar akses murid, tanpa mengubah identitas atau menghapusnya dari dunia. Peta pengunjung pada snapshot mengikuti posisi tersebut.

Ghanim (`warga-21`) sebelumnya menunggu dekat ambang kelas; rute Gobi juga masuk terlalu jauh melewati pintu sebelum kembali ke foyer. Ghanim sekarang menunggu di bay kiri `[-22.65,.4,-17.6]`, Gobi di bay kanan `[-18.7,.4,-17.65]`. Rute Gobi berhenti di foyer dan memimpin murid, tanpa melewati pintu A01.

Waktu lewat gerbang murid diberi selisih **21 frame**, dengan kecepatan trunk bersama 1,9 unit/detik. Baris belakang forecourt berangkat lebih dahulu. Jalur kursi kiri belakang mengitari ujung daun pintu terbuka, lalu memakai celah aktual di samping meja. Di samping kursi murid berputar menghadap papan, menggantung tas, memajukan kaki ke depan kursi, bergeser ke dudukan lalu duduk. Urutan keluar dibalik: berdiri, bergeser ke samping, mengambil tas, menuju aisle/pintu. Tidak ada actor disembunyikan atau dinding dipotong.

## 2. Sungai dan ikan

S17 menggunakan satu medium-wide three-quarter yang mempertahankan sumbu serta kedua tepian selama lebar sungai berubah dari 3 ke 5,4 unit. S18 menggunakan sudut three-quarter dari arah hilir, menampilkan air dan kelompok ikan sekaligus. Kamera tidak lagi memakai close-up waterline sebagai satu-satunya sudut penambahan ikan. Bentuk sungai, mesh air, perilaku ikan dan waterfall tidak diubah.

## 3. Blocking kelompok dan kontinuitas

`choreography.ts` mengatur jadwal serta rute statis per actor, dengan kecepatan bersama pada ruas bersama. Ini mengganti interpolasi sepanjang rute dengan panjang/durasi berbeda yang membuat murid saling menyusul. Sepuluh slot tunggu berbeda disediakan bagi delapan murid, Damia dan Ghanim; slot orang dewasa tidak lagi memakai ulang indeks murid.

Ghanim keluar dari arus sebelum kelompok tiba di tepi barat. Fork pendek pada jalur existing memberi ruang formasi tanpa memindahkan pohon. Jembatan dilintasi satu file: Damia, Ghanim, Gobi lalu murid dengan headway sendiri; murid mendapat selisih **14 frame** pada portal jembatan. Dua rank murid di dek memiliki delapan koordinat berbeda, jarak kolom 0,95 unit dan baris 1,30 unit. Rank belakang diisi dahulu. Damia berada di tepian timur, Ghanim/Gobi pada dua bay belakang terpisah. Tidak ada actor dikeluarkan dari dunia.

Perjalanan Gobi ke dek berlanjut setelah cut S24/S25, tidak di-reset oleh pergantian shot. Murid kembali berurutan, mengisi baris jauh dahulu. Cabang pulang orang dewasa mengitari plaza agar tidak berbalik melawan arus murid atau melintasi Gobi. Pengetatan siku saat berjalan memperhitungkan lebar bahu/model, bukan hanya koordinat root. Gerak dan ekspresi lainnya tetap memakai rig sebelumnya.

## 4. Jembatan dan pohon

Foreground obstruction pada kamera lama berasal dari pohon **83** dan **111**. Kamera S21/S23 dipindahkan ke sisi timur, dengan master medium-wide three-quarter yang memuat kedua ujung, bentang, railing dan air. S23 tetap memiliki insert papan di tengah master; S24 mengikuti sumbu timur yang sama dari jarak cukup. Tidak ada pohon permanen dipindahkan atau dihapus dalam revisi ini; daftar transplantasi identik dengan baseline.

## Bukti dan batas pemeriksaan

- **TypeScript satu kali:** hanya error baseline `src/episode002/Villager.tsx(104,71) TS2740`; tidak ada error EP006. Tidak diulang untuk error lama.
- **Satu grup awal, 22 kasus:** 18 lulus, 4 kasus geometri gagal. Setelah koreksi, hanya kasus gagal diulang: 4 → 3 → 2 kasus; seluruh **22 kasus unik** akhirnya pernah lulus. Pemeriksaan jarak kemudian diperluas satu kali setelah posisi warisan `warga-2` ditemukan, untuk mencakup warga lama terhadap kelompok bergerak. Grup produksi 16 kasus tidak diulang. Koreksi ulang terbatas pada pertemuan jalur, ujung daun pintu/sandaran, waktu tiba dan batas framing.
- Pemeriksaan geometri mencakup jendela masuk/kelas, perjalanan lapangan, penyeberangan/dek, dan pulang, sampling satu frame. Envelope murid berjalan 0,34 / reaksi 0,44; dewasa 0,56 / 0,68; Gobi 0,64 / 0,75 unit berasal dari ukuran kepala/bahu/sleeve, dengan envelope duduk yang lebih kecil. Torso berorientasi diperiksa terhadap bagian furnitur serta dinding ground floor, bukan jarak titik saja.
- Pemeriksaan kamera source dibatasi pada master **S17, S18, S21, S23, S24**: proyeksi kedua tepian sebelum/sesudah, seluruh kelompok ikan yang disampel beserta margin tubuh, kedua ujung/railing jembatan, serta ray terhadap crown pohon. Tidak ada sweep seluruh 38 shot atau tes visual per shot.
- Tes retensi memeriksa transplantasi tanaman, profil warga, tiga sapi, PCM cerita, VO19, splash, durasi dan source episode lama. Semua media/audio tetap identik terhadap `c652fc9`.
- **Tidak dijalankan:** render MP4, still, screenshot, browser preview/automation, build, install dependency, listening review. Tidak ada klaim seluruh mesh/acting sudah lolos penilaian visual; kontak akhir, ekspresi dan komposisi tetap perlu preview pemilik.

Perintah pemeriksaan yang dijalankan:

```powershell
.\node_modules\.bin\tsc.cmd --noEmit --pretty false
node --test --experimental-strip-types test/ep006-production.test.mjs test/ep006-blocking.test.mjs
```

Ulangan kasus gagal memakai `--test-name-pattern` pada `test/ep006-blocking.test.mjs` saja. Warning Node `MODULE_TYPELESS_PACKAGE_JSON` bukan kegagalan tes.

Instruksi World Viewer dan Remotion Studio Windows ada di [EP006_README.md](../../EP006_README.md). Pemilik melakukan preview dan render final sendiri.
