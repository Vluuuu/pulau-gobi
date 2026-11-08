# Pulau Gobi 3D World Viewer

**Revisi mayor EP006 dari 4037ea4:** CurrentWorld memakai layout v2 dengan hulu terpisah dari forecourt, dua rank murid, satu jembatan, dek/ramp, tanaman yang direlokasi dengan ID tetap, serta practical light kelas existing. Cutaway hanya opsi inspeksi manual; film produksi kini memakai bangunan utuh. Visual outro juga memakai world ini. Lihat `EP006_README.md` dan `docs/episodes/EP006_MAJOR_REVISION.md`. Belum ada preview/visual approval pada revisi ini.

**Worktree EP006:** gunakan `D:\pulau-gobi\ep006-production`. Entry point bersama kini memakai `src/world/ep006/World.tsx` dan snapshot pasca-EP006: 22 warga, tiga sapi bernama, kelas dengan delapan murid, sungai/ikan, satu jembatan dan dek observasi. UI kelas adalah fixture inspeksi siang hari. Model sekolah World Polish tetap sama. Lihat `EP006_README.md` untuk perubahan source, selisih jembatan yang tidak ada pada baseline, EDL audio, dan pemeriksaan minimal. Bagian di bawah merupakan catatan viewer baseline `3759f2e`; hasil build/browser yang disebut di sana bukan hasil QA EP006.

Aplikasi browser interaktif untuk inspeksi dunia pasca-EP005 dan episode berikutnya. Entry point React DOM + R3F biasa; tidak memasang Remotion composition, Player, audio, subtitle atau outro.

Branch `codex/world-viewer`, dibuat dari `codex/post-ep005-world-polish` commit `9b0a22b`. Worktree: `D:/pulau-gobi/world-viewer`.

## Menjalankan di Windows

```powershell
cd D:\pulau-gobi\world-viewer
npm run viewer
```

Buka **http://localhost:4173/** di Chrome atau Edge. Biarkan terminal berjalan. Tekan `Ctrl+C` untuk menghentikan server. Dependencies sudah dipasang pada worktree ini; pada checkout baru, jalankan `npm ci` terlebih dahulu. Versi Node mengikuti kebutuhan project; worktree diuji memakai Node yang sudah tersedia di laptop ini.

Jika port sedang dipakai:

```powershell
npm run viewer -- --port 4174
```

URL menjadi http://localhost:4174/. Server hanya bind loopback `127.0.0.1`; tidak mempublikasikan aplikasi ke jaringan atau internet. Tidak memakai CDN/font/asset eksternal. Perubahan source JS/TS/CSS memicu reload halaman otomatis; perubahan template `viewer/index.html` memerlukan restart server.

`npm run dev` tetap membuka Remotion Studio lama. Gunakan **`npm run viewer`** untuk alat ini.

## Kontrol

- Drag tombol kiri: orbit. Scroll: zoom. Drag tombol kanan: pan. Trackpad mengikuti gesture yang dipetakan browser ke wheel/pointer.
- Klik mesh bangunan atau pilih lokasi di panel kiri untuk fokus. Ukuran fokus dihitung dari bounding box objek/instance sebenarnya, bukan kotak/model proxy.
- Tombol **Kembali ke seluruh pulau** menyesuaikan tampilan ke seluruh scene, termasuk air terjun panjang di bawah pulau. Zoom masuk untuk melihat detail.
- Kamera bebas orbit dan bisa mendekat ke interior. Interaksi manual menghentikan transisi fokus. Ini alat inspeksi tanpa collision kamera/karakter atau simulasi berjalan.
- **Inspeksi sekolah → Area inspeksi**: gedung utuh, lantai satu A01, lantai dua A02, atau foyer/koridor A. Pilihan interior mengaktifkan cutaway dan membuka pintu. Centang atap/plafon dan setiap sisi dinding dapat diubah kembali secara terpisah. Pilih gedung utuh untuk mengembalikan seluruh model.
- Cutaway A02 mempertahankan slab lantai dua; tidak memakai potongan A01 yang menghilangkan lantai atas. Kusen/struktur pembatas tetap ada sebagai konteks. A02 saat ini memakai isi model aslinya; viewer tidak menambahkan furnitur/murid yang belum ada pada source.
- Opsi warga/Gobi/sapi, bayangan dan resolusi detail tersedia. Default DPR 1×; detail 1.5×. Matikan bayangan atau warga bila orbit terasa berat.

Warga dan sapi memakai **pose diam acuan akhir EP005**, bukan menjalankan timeline/VO. Sungai/air terjun/scenery juga dipertahankan pada state selesai. Pergerakan real-time di alat ini adalah kontrol kamera; patch tidak menambahkan animasi episode.

## Satu sumber world untuk viewer dan EP006+

`src/world/current.ts` mengekspor `CurrentWorld`, `CURRENT_WORLD_STATE`, lighting source serta daftar landmark. Viewer tidak mempunyai model mesh pulau, bangunan atau karakter sendiri.

- `src/world/postEp005/World.tsx` memasang world source EP005 pada frame acuan terakhir sebelum outro (5194), dengan slot sekolah memakai **PostEp005School** yang telah diperbaiki. Semua placement, terrain radius 52, material, scenery, jalur, irigasi, sawah pascapanen, tunas jagung/wortel, stok, kandang dan tiga sapi tetap berasal dari source.
- Sekolah lama beserta gerbang lamanya diganti sekali melalui slot opsional `schoolOverride`; tidak ditumpuk dengan model sekolah baru.
- `World005` tanpa prop tersebut tetap memakai jalur render lama. Composition, kamera episode, timeline, animasi, VO, subtitle, SFX, VFX dan outro EP005 tidak diubah.
- `WorldLighting` memakai **SceneLighting** yang sama dengan source (hemisphere, ambient, sun dan fill). Kamera inspeksi perspective bebas menggantikan kamera sinematik hanya di viewer.
- `PostEp005School`/`buildSchoolAsset` adalah model yang sama untuk viewer dan produksi. Opsi cutaway A02 ditambahkan di model bersama, bukan membuat salinan khusus viewer.
- Saat EP006 menambah aset, tempatkan aset pada world assembler bersama dan ubah ekspor aktif di `src/world/current.ts` bila snapshot berganti. Viewer dan episode berikutnya dapat mengimpor entry point itu. Perubahan komponen bersama langsung terlihat melalui reload; aset yang hanya ditambahkan ke composition episode tertentu perlu didaftarkan pada assembler bersama agar masuk dunia aktif.
- `WORLD_LANDMARKS` hanya memetakan nama root objek untuk pintasan fokus. Tambahkan satu entri jika bangunan baru perlu tombol fokus; tidak perlu menyalin mesh. Daftar ini bukan daftar yang membatasi aset yang tampil.

## Performa dan pemeriksaan

Canvas menggunakan `frameloop="demand"`: tidak terus menggambar ketika kamera/UI diam. Orbit damping dan transisi fokus meminta frame selama dibutuhkan. Aset instanced milik source tetap dipakai; tidak ada rebuild geometri per tick, video encoding atau mass camera sampling.

Pemeriksaan minimal:

```powershell
npm run build:viewer
node --test --experimental-strip-types test/post-ep005-world.test.mjs test/world-viewer.test.mjs
npx tsc --noEmit --pretty false
```

Build hanya mengompilasi JS/CSS/HTML ke `out/world-viewer` yang di-ignore Git. Ini bukan render gambar/video. Dua tes baru memeriksa slab A02 saat cutaway dan framing bounding box tinggi pada aspect ratio berbeda; empat tes statis sebelumnya tetap digunakan. Typecheck project memiliki error baseline `TS2740` pada `src/episode002/Villager.tsx:104`.

Hasil: **build viewer lulus, 6/6 tes lulus**, dan typecheck hanya melaporkan error baseline tersebut. Browser smoke terbatas memeriksa scene WebGL, fokus sekolah/rumah, cutaway A01/A02, orbit/scroll, serta tombol overview; tidak ada console warning/error yang tercatat. Bukan audit seluruh kamera, validasi seluruh kontak karakter, atau benchmark semua laptop. Tidak merender MP4/still, tidak push/merge.
