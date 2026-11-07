# EP004 visual pilot — bukan episode penuh

Branch lokal: `codex/ep004-visual-pilot-20261107`. Worktree: `D:/pulau-gobi/ep004-visual-pilot`.
Baseline: integrasi EP003 **a29be83c0f4cbd06b841a564d279b7540883ea65**, yang sudah mencakup main terbaru **b796efe** dan baseline EP002 **a200877 / ep002-v4-approved**. Remote diperiksa melalui fetch. Tidak push/merge main.

V1 bagian Visual Pilot dan revisi V2 dipakai; V2 didahulukan. Permintaan pengguna membatasi pekerjaan pada pilot dan mengizinkan penyesuaian durasi berdasarkan MP3. Bagian produksi penuh, keputusan ekspansi, penghijauan, pertanian, peternakan dan konstruksi kost EP004 tidak diimplementasikan.

## Preview Windows

```powershell
Set-Location D:\pulau-gobi\ep004-visual-pilot
npm run dev
# Pilih composition Episode004VisualPilot.
```

Checkout baru: `npm ci` terlebih dahulu. Junction node_modules lokal tidak disertakan dalam patch. Composition: **Episode004VisualPilot**, **1080×1920, 30 FPS, 489 frame / 16,3 detik**. Semua composition EP001–003 dan preview lama tetap terdaftar.

## Isi implementasi

- Model Gobi asli dan Villager oktaa.blushh asli, warna dari roster EP003. Adapter pilot menggerakkan mata/mulut/kepala, tanpa mengedit rig Episode 001–002.
- Jalan oktaa 3,76 unit; akselerasi/rem, fase kaki dari jarak, ayunan kaki nol setelah berhenti. Reaksi: anggukan, head look, blink, hop kecil, mundur 0,32 unit, lean dan melihat Gobi duduk.
- Gobi: berputar menyambut, bangga/point/hop, senyum menyusut, pupil mengecil, beat diam 1,1 detik, keringat, anticipation, lompatan besar dengan stretch, landing squash, geleng, hentak/tunjuk/gemetar, tekuk/kehilangan keseimbangan, jatuh terduduk, pantulan dan debu.
- Kost proxy statis: dua lantai, enam pintu bernomor, balkon, tiang, jendela, atap dan papan. Di [4,0,14], rotasi PI/4. Ini latar pilot, bukan sistem build kost final.
- Empat hard cut; kamera statis establishing, two-shot, OTS, medium dan full-body. Tanpa orbit, camera shake atau zoom bergerak. Name tag oktaa selama ia di layar, bubble dekat pembicara, subtitle putih/highlight kata aktif kuning.
- World EP003 dirender pada keadaan selesai: rumah dua lantai, sungai mengalir, warteg, sawah, dekor dan lima warga lainnya tetap ada. oktaa dipindahkan ke pilot; tidak ada duplikatnya.

## VO dan timing

| Input asli | File pilot | Durasi file | Mulai |
|---|---|---|---|
| enam kamar.mp3 | voice_01.mp3 | 2.768938 s | f117 |
| 201.mp3 | voice_02.mp3 | 2.194250 s | f318 |
| kurang banyak.mp3 | voice_03.mp3 | 2.586063 s | f393 |

Ketiga MP3 disalin tanpa perubahan byte; tidak dipercepat atau dipotong. Durasi 407f V2 memakai VO perkiraan yang lebih pendek. Pilot menjadi 489f agar audio asli, waktu baca dan payoff tetap utuh.

Bubble 1: pop f60–66, tahan penuh f66–108, keluar sampai f111; jawaban mulai f117. Bubble 2: pop f215–221, tahan penuh **52f** sampai f273, keluar sampai f278. Penambahan satu frame dari tabel V2 memenuhi rumus baca 0,4 + 0,045 × 29 karakter. Beat diam f283–316; takeoff f320; landing f340; sit f448–457; kontak f457; emote ! f459; hold sampai f488. Cut f54/f203/f283/f316.

Timestamp kata diestimasi dengan faster-whisper small lokal dari file asli; teks mengikuti dialog yang diberikan. Metadata `verified:false` disimpan. Sinkronisasi kata, rasa jeda dan aksen VO tetap perlu diperiksa dengan pendengaran pemilik. Tidak ada VO oktaa.

## Audio SFX nyata

Enam WAV PCM mono 44,1 kHz original procedural, seed **4004**: footstep, bubble-pop, boing, landing-thump, panic-rattle, fall-thud. Terdapat 13 pemutaran cue. Tidak mengambil aset pihak ketiga; tidak ada metadata yang berpura-pura menjadi audio.

`src/episode004/pilot/audio.ts` menyimpan provenance/hash/durasi/peak/RMS setiap sumber. `out/pilot-evidence/audio-schedule.json` mencatat **id, shot, frame, sumber/seed, durasi, peak, RMS, volume** setiap cue. Generator NumPy `scripts/ep004-pilot-sfx.py` disertakan; Python tidak diperlukan untuk preview karena WAV sudah ada.

Pemeriksaan gelombang: seluruh sumber peak > −30 dan ≤ −1 dBFS; tidak senyap. Penjumlahan sample VO volume 0,9 + SFX sesuai schedule menghasilkan sample peak **−3,34 dBFS**, tanpa sample clipping. Ini bukan pengukuran true peak/LUFS atau klaim sudah diaudisi manusia.

## Pemeriksaan yang dijalankan

- **PASS** tujuh test pilot terarah: VO/hash, durasi, waktu baca bubble, jalan/stride, anticipation/stretch/squash/sit, determinisme/kamera, framing/overlay dan WAV nyata. Test tidak menjalankan seluruh suite proyek.
- **PASS** bundle Remotion dan registrasi composition, browser ANGLE, dua still native: f238 two-shot/bubble dan f474 seated payoff. Tidak membuat contact sheet atau MP4. Still tidak membuktikan kualitas gerak/playback.
- **Typecheck proyek:** tetap **FAIL baseline TS2740** `src/episode002/Villager.tsx(104,71)` (`number[]` vs `Vector2`); tidak ada diagnostik tambahan pilot. File legacy tersebut tidak diubah.
- Kontinuitas: semua file baseline selain dua perubahan aditif berikut dipertahankan: `Root.tsx` menambah import/composition; `Episode003Scene.tsx` hanya mengekspor world renderer yang sudah ada agar dipakai kembali, tanpa mengubah perilaku EP003.

```powershell
node --test --experimental-strip-types test/ep004-pilot.test.mjs
npx tsc --noEmit
# Opsional satu still, tanpa MP4:
npx remotion still src/index.ts Episode004VisualPilot out\pilot-jump.png --frame=330 --gl=angle
```

## File dan penerapan patch

Baru: `src/episode004/pilot/{PilotScene,Actors,KostProxy,Overlays}.tsx`, `{plan,framing,audio}.ts`, sembilan media di `public/episode004/pilot/`, `test/ep004-pilot.test.mjs`, generator SFX, dan manifest ini. Modified: dua file aditif di atas. Dependency/package/lockfile tetap.

ZIP minimal berisi perubahan pilot terhadap **a29be83**, bukan seluruh source EP003 lagi. Terapkan pada integrasi EP003 itu atau gunakan branch pilot lokal. Jangan menerapkan ZIP sendirian pada main lama yang belum memuat EP003. Evidence terpilih berada di `out/pilot-evidence/`, di luar source commit; tidak memuat model ASR, venv, node_modules atau bundle.

Yang perlu dinilai pemilik di Remotion Studio: kealamian langkah/jatuh, rasa anticipation/jeda, volume SFX dan sinkronisasi kata. Periksa f0, f54, f85, f145, f238, f299, f318, f330, f343, f442, f457 dan f488. Rig lama masih memakai langkah kartun berbasis stride, bukan foot IK. Kost final, seluruh episode dan persetujuan visual akhir belum dikerjakan.
