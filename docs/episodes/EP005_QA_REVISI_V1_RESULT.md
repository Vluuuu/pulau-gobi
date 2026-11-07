# EP005 QA Revisi V1 — 8 November 2026

Status: **revisi source untuk review pemilik; visual belum disetujui dan episode belum difinalisasi**.

Branch `codex/ep005-full-20261107`, worktree `D:/pulau-gobi/ep005-full`. Revisi melanjutkan checkpoint lokal `5c3ff64`, yang menyimpan implementasi EP005 sebelumnya tanpa mengklaim persetujuan. Baseline EP004 FULL tetap `76ee0c8ca6612282452286ea556798eaa2bc02f6`. Source EP001–EP004 tidak diubah.

Masukan: laporan pemilik `D:/claude_vid/EP005_QA_REVISI_V1.md` dan render aktual `out/Episode005.mp4` (177.173 s, H.264 1080×1920/30 fps, AAC stereo 48 kHz). Render milik pemilik dipakai sebagai bahan audit, tidak ditimpa.

## Perubahan per masalah

| Masalah | Revisi source |
|---|---|
| P0 kamera Gobi | Dialog kini memakai front/three-quarter medium atau full-body dengan lebar framing 4–7.4 unit; tubuh menghadap kamera saat berbicara. Walk-and-talk mengikuti translasi nyata, tanpa orbit acak. Wide dipakai untuk insert lingkungan, konstruksi, akses, dan reveal yang memang membutuhkan konteks. Kamera dekat ditempatkan di pad agar bangunan jauh tidak menjadi penghalang foreground. |
| P0 halaman sekolah | Gedung tiga sayap dua lantai dipertahankan. Ditambahkan lapangan bermarka dengan garis tengah/lingkaran, dua ring/backboard, podium bendera terpisah dari area bermain, perimeter pagar yang tersambung, gerbang dua daun, jalan masuk dan tangga pintu utama. Tidak ada ekspansi terrain atau penghapusan bangunan/dekor lama. |
| P0 integrasi kelas | A01 tetap di world transform sayap A. Foyer beratap melekat pada sayap yang sama, dengan pintu utama dan koridor menuju pintu A01 yang terpisah. Delapan meja dipertahankan dan ditata agar lorong depan serta tengah dapat dilalui. Atap, slab depan dan dinding yang menghalangi disembunyikan hanya pada shot interior; bagian belakang lantai atas/atap dan balok pengikat tetap terlihat. Geometri eksterior dipulihkan pada shot luar. Tidak ada kelas pengganti di lokasi terpisah. |
| P0 blocking | Gobi, Damia, RIS, Joy dan cow-003 memakai rantai portal yang sama: gerbang → jalur halaman → pintu utama → foyer/koridor → pintu kelas. Entry RIS/Joy dan sapi dipecah menjadi beberapa insert timeline yang memperlihatkan tahap tersebut. Rute sapi di luar kandang melewati apron sebelum berbelok, sehingga tidak mengikuti garis pagar. Xyree berjalan/berlari pada rute yang sama saat menjemput; Gobi mengikuti penggiringan dengan jarak waktu agar tidak bertumpuk. |
| P0 audio | VO tidak lagi di-mount sebagai sembilan pemain media terpisah. Satu `edited-v4.wav` kontinu memuat seluruh sampel master, dengan jeda disisipkan tepat di titik hening. Tidak ada fade pada suara bicara, perubahan kecepatan atau perubahan naskah. Master MP3 dan sembilan potongan sebelumnya tetap disimpan untuk provenance. |
| P1 air terjun | Hero side-three-quarter diperpanjang menjadi 4.2 s di dalam G1 yang tetap 9.5 s. Pengisian kanal dan awal jatuhnya air diselaraskan dengan reveal. Kamera menampilkan rim, tebing, pita panjang dan kabut; vertex alpha membuat ujung air lenyap bertahap. |
| P1 pembangunan | Konstruksi memakai dua framing statis per tahap: pondasi/lantai bawah dan struktur/lantai atas. Foyer, koridor, jendela dan atap tumbuh sesuai urutan; setelah itu insert A01 memperlihatkan meja/papan di sayap yang benar. |
| P1 acting | Gobi menjaga wajah/gestur ke kamera saat dialog; mulut mengikuti jendela kata. Damia membawa buku/penggaris dan menarik tali bel. Cow-003 mendekati kait secara translasi, menurunkan moncong pada kait, berbelok saat berhenti, serta tetap berkedip, mengunyah dan menggerakkan telinga/ekor. Moo rekaman tetap terpisah dari imitasi VO. |
| P1 UI/mixing | Subtitle dinamis menyorot kata berdasarkan estimasi ASR lokal yang dipetakan ke naskah asli. Tag hanya muncul ketika karakter berada dalam frame, maksimal tiga, dengan ruang wajah/subtitle/bubble dicadangkan. SFX mempunyai attack/release singkat; musik/ambience duck secara halus dan menjaga hold hening sebelum LAH. Interior memakai latar hangat dan framing lebih dekat. |

## Timeline dan audio

- Composition **Episode005**, **5360 frame / 178.666667 s**, 1080×1920, 30 fps.
- Master **135.1575 s**, playback rate **1.0**. Jeda bertambah 1.5 s: G5 menjadi 4.8 s, G6 menjadi 4.2 s. Total jeda 38.0 s.
- Outro mulai frame **5195** / **173.166667 s**. Durasi **165 frame / 5.5 s**, menjalankan **Episode004 asli pada frame 4162–4326**. Audio, animasi, kamera, overlay dan tail outro tidak dibuat ulang.
- `docs/episodes/EP005_V1_CONTINUOUS_VO.json` membuktikan bahwa menghapus sisipan hening dari WAV baru mengembalikan PCM master **bit for bit**. Hash PCM master/recovered: `c5c23108f8afe152e1b9a89fb1287419b9d43d8fdf5f0998ed36c04425915b07`.
- RMS delapan titik cut, ±20 ms, sekitar **−87 sampai −89 dBFS**. Perbandingan waveform render lama mendeteksi offset sekitar **33 ms pada blok setelah G1 dan sebelum G2a**; mayoritas jendela lain berada pada offset nol. Ini bukti timing/sinyal, bukan sertifikasi pendengaran seluruh fonem. Playback kontinu menghilangkan restart media antarbagian.
- Analisis penjumlahan sampel VO/SFX/bed baru: sample peak sekitar **−4.15 dBFS**, tanpa sample clipping. LUFS, true peak, dan pendengaran manusia kata-per-kata tidak diklaim.
- Sebanyak **285 token caption naskah** dipetakan ke estimasi kata Whisper lokal, dengan nama/ejaan tetap dari naskah. Ini **bukan forced alignment dan belum human-verified**; highlight nama panjang/onomatope tetap perlu diperiksa saat preview.

## Pemeriksaan

- **23 tes relevan PASS**: 11 regresi EP004, 11 produksi EP005, dan satu pemeriksaan akses yang menyapu setiap frame entry/escort terhadap dinding eksterior utuh, furnitur dan daun pintu. Tes tidak bergantung pada dinding yang disembunyikan kamera.
- Pemeriksaan kamera memakai **sinar paralel sesuai kamera ortografik**, pada awal, 25%, tengah, 75%, akhir dan frame emfasis setiap shot dialog. Kriteria: wajah ≥95%, tangan ≥90%, arah wajah dan ukuran/framing terbaca. Hasil akhir dirangkum dalam `EP005_QA_V1_VERIFY.json`; raw lokal berada di `out/ep005-evidence/camera-mesh.json`.
- Bundle/registrasi composition dan dua still diagnostik diambil langsung dari **kamera timeline Episode005**: `qa-v1-school-access-court.png` frame **3153** (105.10 s), `qa-v1-class-dialogue.png` frame **3837** (127.90 s). Bukan sudut kamera khusus untuk still.
- Typecheck hanya memiliki **TS2740 baseline** di `src/episode002/Villager.tsx:104`; tidak ada diagnostik baru.
- Tidak ada render MP4 penuh baru, mass stills, push, merge, atau klaim persetujuan visual.

Pemeriksaan root/collider dan sampel raycast bukan bukti seluruh deformasi/helai/prop setiap frame. Review gerak, volume melalui speaker, subtitle dan kualitas visual tetap dilakukan pemilik pada render Windows berikutnya.

## Preview Windows

```powershell
cd D:\pulau-gobi\ep005-full
npm run dev
```

Pilih **Episode005**. Periksa terutama 0–12 s (dialog awal), 96.6–104.6 s (build), 105–111 s (kedatangan guru/masuk sekolah), 117.5–127 s (kunjungan kelas dan pendekatan sapi), 127–143 s (reaksi dan penggiringan), serta masuk outro pada 173.17 s.

Source/media sudah tersedia pada branch ini; tidak perlu menjalankan ulang ASR atau generator aset untuk preview. Model ASR dan raw evidence di folder `out/` adalah alat lokal, bukan dependency runtime episode.
