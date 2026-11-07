# Post-EP005 World Polish — 8 November 2026

EP005 sudah dipublikasikan oleh pemilik. Patch ini **hanya aset statis opt-in untuk EP006+**. Tidak mengubah composition atau hasil historis EP005. Hasil visual belum diperiksa melalui preview/render, sesuai batas pengerjaan pemilik.

Branch: `codex/post-ep005-world-polish`.

Worktree: `D:/pulau-gobi/post-ep005-world-polish`.

Base: `3093d8bfcfe5adb3ec35e1980d2868fdba619043` dari source lokal EP005. Worktree/branch EP005 asli tetap pada commit tersebut. Tidak menggunakan `main` sebagai baseline.

## Audit geometri dan perubahan

Source yang diperiksa: `src/episode005/{models,campus,layout,access,World}.ts[x]`, model/renderer part EP004, layout EP003/EP004, kost, kandang, serta roster aktual. Brief lampiran disimpan sebagai `EP005_POST_PUBLISH_WORLD_POLISH_BRIEF.md` di folder dokumen ini.

- Anchor sekolah tetap **[-20, 0, -22]**. Offset tiga sayap tetap A **[0, 0]**, B **[-5, -5]**, C **[-10, -2]**, masing-masing footprint **8.4 × 5.8**. Bangunan tetap dua lantai dengan massa atap tiga sayap dan fasilitas publik besar yang sudah ada.
- Model historis A01 bergantung pada parameter interior timeline. Varian baru membangun empat sisi dinding, kusen, bukaan jendela dengan kaca transparan, lantai, plafon, slab lantai atas, rangka/tie beam/rafter, dan atap **secara default**. Tidak ada kelas baru di luar gedung.
- Footprint sayap lama bertumpang tindih di sambungannya. Lantai dibuat sebagai union tanpa slab rangkap; dinding luar B/C yang berada di dalam sayap tetangga dihilangkan agar tidak membelah koridor. Partisi A01 tetap utuh. Bukaan jendela ditessellasi pada dinding, bukan panel kaca di atas dinding padat.
- Foyer menempel pada dinding depan A01. Pintu utama → foyer → pintu A01 memiliki lantai kontinu. Akses samping foyer terhubung ke portico sayap C melalui lantai dan penutup koridor. Sambungan railing lantai atas diberi celah akses, bukan dipaksakan berjalan menembus railing.
- Ditambahkan tangga balik dua flight di sambungan B/C: 20 riser, dua flight masing-masing 10 tread, bordes tengah, bordes atas, stringer, railing dan lubang slab/plafon yang sesuai. Ini geometri statis, bukan animasi berjalan.
- Daun pintu A01/A02 membuka ke dalam agar tidak menyapu koridor. Kusen, engsel, panel pintu, dan gagang ada pada kedua sisi. API hanya menyediakan pose statis `closed` atau `open`, tanpa interpolasi/frame.
- Lapangan, marka, dua backboard/ring, pagar perimeter, gerbang, tiang bendera, bangku, jalur lama dan signage dipertahankan pada koordinat source. Marka sedikit diredupkan. Ditambahkan paving gerbang → pintu utama, dudukan/bracket signage barat, dan papan arah koridor. Bendera dan bel pada varian ini berupa pose statis.

### Dimensi dan akses pejalan

| Elemen | Koordinat lokal sekolah, lantai | Bukaan bersih |
|---|---|---|
| Gerbang | [-1, 0, 12] | 3.2 lebar × 3.3 tinggi |
| Pintu utama | [0, 0.4, 5.84] | 2.4 × 2.8, dua daun |
| Foyer | [0, 0.4, 4.3] | jalur tengah 3.2; tinggi ruangan 3.24 |
| Pintu A01 | [0, 0.4, 2.8] | 1.5 × 2.65, satu daun |
| Lantai atas | y = 3.96 | terhubung melalui tangga dan veranda |

Pintu kelas diukur dari dinding aktual varian, bukan memaksakan marker/camera EP005 lama. Dibanding pintu sapi 2.78 pada source historis, lebar 1.5 lebih sesuai pejalan manusia. Tidak mengubah blocking atau metadata akses EP005 lama.

### Furnitur dan detail A01

- Delapan meja dan delapan kursi murid tetap ada, dua kolom × empat baris. Setiap meja punya kaki dan apron; kursi punya kaki serta penyangga sandaran. Tidak menambah murid/NPC.
- Empat meja tambahan dan papan tulis yang sudah ada pada masing-masing sayap B/C tetap dipertahankan; meja ditata ulang di dalam sayapnya agar tidak menutup tangga/koridor dan diberi kaki penopang.
- Meja guru dan kursi, buku, tempat pensil, papan tulis besar dengan frame/tray, kapur dan penghapus.
- Lorong tengah sekitar 2.95 unit, akses tepi, area mengajar di tengah depan papan. Furnitur ditata pada lantai y=0.4 dan tidak memotong jalur pintu.
- Rak buku dan buku, jam dengan jarum statis, dua poster edukasi original berbasis teks (angka dan pelestarian air), tempat sampah, keset, lis dinding, empat armatur plafon serta armatur foyer.
- Palet cream/sage/kayu konsisten dengan source. Renderer memakai material kaca terpisah; tidak menambahkan lampu scene, lighting direction, VFX, SFX atau tekstur eksternal.

## Cutaway untuk EP006+

`buildSchoolAsset()` dan `<PostEp005School/>` menghasilkan bangunan utuh, pintu tertutup. Cutaway default **mati**. Cutaway hanya memfilter bagian varian baru, tidak memutasi sumber atau menyimpan perubahan global.

Pilihan `walls` menyembunyikan infill dan kaca sisi A01 yang dipilih; kusen, jamb/header tebal serta konteks koridor tetap ada. Sisi depan/timur foyer ikut diseleksi bila berpotensi menghalangi sisi yang sama. Pilihan `overhead` menyembunyikan plafon, bagian atas sayap A dan penutup koridor terkait untuk keperluan shot interior. Sayap B/C dan struktur koridor lain tetap ada. Hilangkan prop `cutaway` untuk mengembalikan seluruh geometri.

Patch ini **tidak menentukan kapan cutaway aktif**, kamera atau durasi shot. Itu tanggung jawab produksi EP006 nanti.

## Kontinuitas dunia

`POST_EP005_WORLD` adalah manifest snapshot data yang disalin lalu dibekukan, bukan composition/renderer dunia lengkap. Snapshot tidak membekukan/memutasi objek milik modul episode historis.

- Semua 12 warga dari CAST EP005 beserta ID, nama, tier dan visualnya dipertahankan, ditambah identitas Gobi secara terpisah. Damia `warga-11` tetap guru pertama; `selectedStudentIds` kosong.
- `cow-001`, `cow-002`, `cow-003` tetap permanen dan berada kembali di kandang. Riwayat cow-003 ke sekolah tidak mengganti identitasnya.
- Snapshot mempertahankan placement rumah, warteg, kost enam kamar, sawah, pertanian, kandang, radius terrain 52, river/CHANNEL/waterfall, scenery dan referensi source aset lama.
- Padi tetap pascapanen dengan bundel lama; jagung/wortel tetap fase tunas EP005. Tidak ada panen ulang, pertumbuhan baru, perubahan stok/cerita, karakter baru atau penghapusan bangunan/pohon.
- Kost/warteg/kandang tidak diberi varian baru pada patch ini. Source sudah memiliki enam pintu kost, tangga/railing, etalase warteg, trough/pakan/jerami dan gate kandang. Fokus tetap integrasi sekolah; polish tambahan aset lain tidak diperluas.

## Pemakaian saat produksi EP006

Import entry point `src/world/postEp005/index.ts` dari world assembler EP006:

```tsx
import {PostEp005School, POST_EP005_WORLD} from '../world/postEp005';

// Mount satu kali, pada scene R3F EP006 yang sudah memiliki terrain/lighting.
// Komponen sudah menerapkan anchor sekolah; jangan ditranslasi lagi ke [-20,0,-22].
<PostEp005School />

// Alternatif khusus shot interior masa depan; bukan mount kedua bersamaan:
<PostEp005School
  doors="open"
  cutaway={{room: 'A01', walls: ['front', 'east'], overhead: true}}
/>
```

Gunakan snapshot untuk roster, fase pertanian dan placement saat menyusun dunia EP006; API ini tidak menambahkan aktor. Gunakan kembali aset dunia lain dari `retainedAssets` dan **gantikan** blok sekolah lama dengan komponen ini. Jangan menumpuk `<World005/>` utuh dan `<PostEp005School/>`, karena akan menggandakan sekolah. `World005`/`Episode005` historis tetap memakai asetnya sendiri. Tidak ada composition EP006 atau registrasi Remotion baru dalam patch ini.

`SCHOOL_ENTRY_ROUTE` dan `UPPER_ACCESS_ROUTE` adalah polyline akses statis dalam koordinat lokal sekolah. Pakai `toWorld()` bila membutuhkan koordinat dunia. Data ini bukan kurva animasi atau jadwal pergerakan karakter.

## Tes minimal dan batas bukti

Perintah tes yang dipakai:

```powershell
node --test --experimental-strip-types test/post-ep005-world.test.mjs
npx tsc --noEmit --pretty false
git diff --check
```

Hasil: **4/4 tes lulus**. Tes menilai enclosure/furnitur dan bukaan kaca, jalur pejalan (proxy lebar 0.60/tinggi 2.2; sampling jarak 0.10 unit), dukungan lantai/tangga, pemulihan cutaway, serta kontinuitas snapshot. Dukungan tapak pada tangga mengizinkan perbedaan tinggi tread bertetangga; tidak memodelkan pose telapak/gerak karakter.

Typecheck mempunyai error baseline `TS2740` pada `src/episode002/Villager.tsx:104`; tidak ada diagnostik baru. Pemeriksaan ini tidak menyatakan kualitas visual telah disetujui. Tidak menjalankan Remotion Studio/preview, render MP4, still, bundle, mass camera audit, audio processing, push atau merge. Semua perubahan berada di file baru; source dan media historis tetap identik dengan `3093d8b`.

## File baru

1. `src/world/postEp005/schoolLayout.ts` — anchor, ukuran, portal, rute dan opsi cutaway/pose pintu.
2. `src/world/postEp005/schoolAsset.ts` — model statis lengkap dan detail halaman/kelas.
3. `src/world/postEp005/SchoolCampus.tsx` — renderer aset, kaca dan label statis.
4. `src/world/postEp005/snapshot.ts` — manifest kontinuitas pasca-EP005.
5. `src/world/postEp005/index.ts` — ekspor publik untuk EP006+.
6. `test/post-ep005-world.test.mjs` — empat tes struktur/data.
7. `docs/episodes/post-ep005/EP005_POST_PUBLISH_WORLD_POLISH_BRIEF.md` — salinan brief lampiran.
8. `docs/episodes/post-ep005/WORLD_POLISH_RESULT.md` — audit, hasil dan cara integrasi ini.
