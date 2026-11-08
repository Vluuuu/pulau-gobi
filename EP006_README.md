# Pulau Gobi — Episode 006

Implementasi source lokal untuk review pemilik. Baseline **`codex/world-viewer` / `3759f2e`**, branch **`codex/ep006-production`**, worktree **`D:\pulau-gobi\ep006-production`**. Source dan aset Episode 001–005 tidak diubah. Tidak push/merge.

## Jalankan sendiri di Windows

Dependencies pada worktree ini memakai junction ke `D:\pulau-gobi\world-viewer\node_modules`; tidak ada instalasi ulang dependency project. Jangan hapus folder target selama worktree ini dipakai. Pada checkout lain, gunakan `npm ci` satu kali.

World Viewer:

```powershell
cd D:\pulau-gobi\ep006-production
npm run viewer
```

Buka **http://localhost:4173/** di Chrome/Edge. Jika port dipakai, `npm run viewer -- --port 4174`. Pilih sekolah, A01, jembatan, atau belajar alam. Viewer memakai world bersama pasca-EP006; pose warga di viewer adalah fixture inspeksi kelas pada siang hari. Tidak memainkan timeline/audio episode. `Ctrl+C` menghentikan server.

Remotion Studio, pada terminal kedua:

```powershell
cd D:\pulau-gobi\ep006-production
npm run dev -- --port 3006
```

Buka **http://localhost:3006/** lalu pilih **Episode006**. Format 1080×1920 / 30 FPS, **4571 frame / 152,366667 detik**. EDL final source tercatat di `docs/episodes/EP006_SHOT_EDL.csv` dan `EP006_AUDIO_EDL.json`. Tidak ada perintah render otomatis pada patch ini. Preview visual dan render final dilakukan pemilik.

## Implementasi

- 38 beat sutradara; urutan Ghanim disesuaikan dengan MP3: perkenalan kepala sekolah mendahului ajakan masuk kelas. Kamera dialog memakai medium frontal/3Q; kamera akses mengikuti kelompok; cutaway hanya pada shot interior. Transisi ke outro crossfade 12 frame.
- Sekolah `PostEp005School` hasil World Polish dipakai langsung. Delapan murid melalui gerbang → pintu utama → foyer → koridor → kursi yang benar, berputar dan duduk; menulis, memperhatikan, menoleh, mengangkat tangan. Damia mengajar/drawing ikan, Ghanim masuk melalui akses yang sama. Perjalanan praktikum dan pulang adalah rute kontinu, termasuk kembali lewat sekolah; tidak ada perpindahan posisi murid instan.
- Sungai tetap pada centerline lama, diperlebar 3 → 5,4 unit dan diperdalam, lalu menyempit menjadi 3,15 di mulut waterfall lama. Empat belas ikan, satu leap/cipratan yang terkait dengan reaksi Ghanim, satu dek observasi berpagarkan akses masuk. Satu root jembatan berubah dari bentang pendek menjadi bentang 7,8 dengan railing dan sambungan jalan.
- Semua warga lama, bangunan, sawah pascapanen, tunas kebun, stok warteg/pakan, kost enam kamar dan tiga sapi dipertahankan. Tanaman EP004 yang menabrak sekolah, jalur, dek atau tepi sungai ditransplantasi dengan ID/varian tetap; daftar sebelum/sesudah ada di snapshot. Clearance sekolah diterapkan sejak pembuka; transplantasi tepi/jalur mengikuti pembangunan sungai. Dekorasi EP002 dan pohon pertama Irtiza tetap.
- Senja meredup ke biru dengan fill wajah/jalur tetap terbaca. **Tidak ada lampu jalan baru**. Lampu plafon model sekolah lama adalah aset baseline.
- SFX pendek hanya pada aksi: bel, kapur, tanah, papan, langkah, cipratan, satu respons sapi. Tidak menambahkan musik/dengung terus-menerus.

## Identitas dan fakta yang tidak ditebak

Murid: `posyaryn07`, `uz_daus`, `capiwasa`, `Rissa-i3f`, `bsk_rfi`, `FaRzHaN-BoY`, `MisbahulAmmar`, `athrr_0202`. `capiwasa` dikonfirmasi pemilik pada chat 8 November 2026 setelah screenshot dekoratif dinyatakan ambigu; tujuh lainnya dibaca dari screenshot asli. Awalan UI `@` tidak dianggap bagian username. Label Ghanim memakai nama tampilan **Ghanim Miyaz**, username screenshot **GhanimMiyaz**. Total roster: **22 warga + Gobi**. Tidak ada klaim verifikasi follow otomatis.

`damar_zan` tetap `warga-4`. Kepala sekolah `warga-21`; `velora.nyxflare` `warga-22`. Komentar Velora literal **“Nama sapi: Sappy, Oopet & Rembo 🤣🤣”**. Pemetaan editorial sesuai urutan ke `cow-001` → Sappy, `cow-002` → Oopet, `cow-003` → Rembo; screenshot tidak menentukan corak masing-masing sapi. Jumlah tetap tiga.

**Selisih baseline:** tidak ada aset jembatan pada source `3759f2e` (termasuk river/Nature/decor; komentar layout juga mengatakan tidak ada jembatan dekoratif). Karena storyboard/VO mengandaikan jembatan, EP006 merekonstruksi satu penyeberangan pendek pada lokasi yang sama dengan upgrade; bukan mengklaim model ini telah ada pada EP005. Rute pendekatan baru juga tercatat sebagai perubahan EP006, dengan seluruh jalan lama dipertahankan. Pemilik perlu menilai kesesuaian kontinuitas lokasi ini saat preview.

MP3 menyebut **361 calon warga**. Angka itu adalah klaim rekaman, belum didukung data calon warga dari pemilik; `candidateCount` tetap `null`, tanpa counter numerik tambahan. Rekaman tidak diubah untuk mengganti angka tersebut.

## Audio dan EDL

- Input `public/episode006/voice/eps6.mp3` disalin utuh dari ZIP; 113,240813 s / mono / 44100 Hz. SHA-256 tersimpan pada EDL.
- Master sudah memiliki CTA. Bagian cerita sumber **0..108,8666667 s** dipertahankan sample-exact dalam `story-edit.wav`, pada kecepatan asli. Hold visual disisipkan sebagai PCM nol pada jeda yang diukur, tanpa crossfade, trim kata, time-stretch atau pitch-shift pada cerita.
- Pada keheningan **108,689683..109,065986 s**, seluruh CTA master EP006 diganti dengan **tail asli EP004 frame 4162..4326**: composition, visual, kamera, aktor, caption, VO19 lengkap 4,675875 s, ambience/SFX aslinya dan hold asli 24 frame. CTA tidak diputar dua kali. Seluruh input master tetap tersedia utuh di disk. Ini pengecualian sengaja terhadap kalimat “semua sampel master dipakai” di draft handoff, untuk memenuhi reuse outro lengkap dan menghindari dubbing ganda.
- `EP006_AUDIO_EDL.json`: in/out sample dan detik, destination frame, insert/hold, checksum PCM cerita, replacement CTA. `EP006_SHOT_EDL.csv`: cut video final. `EP006_TRANSCRIPT.json` dan `voice.ts`: frasa dari ASR lokal multilingual base dengan koreksi ejaan nama dan salah dengar jelas; **bukan forced alignment atau bukti sudah didengar manusia**. Caption/timing masih perlu listening review, terutama jumlah calon warga, “Hari ini…ikan”, “Ghanim serius”, dan kalimat sebelum CTA. Tidak membuat VO baru.

## Pemeriksaan dan review pemilik

Hasil aktual ada di `docs/episodes/EP006_VALIDATION.md`. Maksimal satu typecheck project dan satu grup tes EP006, kecuali pemeriksaan gagal yang perlu diulang sesudah perbaikan. Build, camera audit, browser automation, preview otomatis, screenshot, still dan MP4 **tidak dijalankan**. Tidak ada development server tertinggal.

Review pemilik tetap diperlukan untuk komposisi wajah/tangan, semua kontak kursi/pintu/railing, kamera tracking pulang, kejernihan ikan di air, waterfall, penempatan jembatan rekonstruksi, caption/ucapan, level SFX dan transisi outro. Tes source tidak membuktikan kualitas audiovisual final atau bebas semua clipping.

## File yang berubah

- `src/episode006/*`: composition, kamera, acting, model murid/cow adapter, shot/timeline, caption, overlay dan cue audio.
- `src/world/ep006/*`: world assembler, state/roster, river/terrain/fish, bridge/deck, transplantasi tanaman; `src/world/current.ts` beralih ke snapshot EP006.
- `src/Root.tsx`: hanya menambahkan registrasi `Episode006`; `src/viewer/App.tsx`: nama state aktif.
- `public/episode006/*`: MP3 asli, PCM cerita, 11 screenshot asli dan lima WAV SFX original.
- `scripts/ep006-*`: persiapan source audio, metadata dan ASR lokal; `test/ep006-production.test.mjs`: grup verifikasi terarah.
- `docs/episodes/EP006_*`, `docs/world/EP006_STATE.json`, `docs/episodes/ep006-handoff/*`, `EP006_README.md`, `WORLD_VIEWER.md`, `docs/LICENSES_AND_ASSETS.md`: handoff, bukti dan petunjuk Windows.
