# Pulau Gobi Episode 003 — patch integrasi produksi

7 November 2026, Asia/Jakarta. Satu workflow, tanpa delegasi/sesi AI tambahan.

Repository resmi: https://github.com/Vluuuu/pulau-gobi. Baseline `origin/main` **b796efe4a14217bced533223af4aa90901d3c18e**, diperiksa lagi terhadap remote. Branch lokal **codex/ep003-one-shot-20261107**, worktree **D:/pulau-gobi/ep003-production**. Tidak push atau merge; `main` tidak diubah.

Input master diekstrak ke `D:/pulau-gobi/handoff-ep003-master-readonly`, terpisah dari repository. Seluruh `EP003_CODEX_MASTER_BRIEF.md` dibaca sebelum implementasi. SHA input dan bukti kesamaan source ada di `out/ep003-evidence/verification.json`.

## Integrasi dan asal dependensi

| Bagian | Sumber asli yang dipakai | Perlakuan |
|---|---|---|
| A1 terrain/layout/FX, A2 river, E state/roster | `inputs/accepted` dalam master ZIP | 18 file source/test identik SHA-256 |
| A3 renovasi rumah | worktree `a3-house`, commit `c171f0b` | 3 source + 1 test identik; satu `house-001` |
| A4 warteg | worktree `a4-warteg`, commit `086546c` | 3 source + 1 test identik; satu `warteg-001` |
| Gobi, dua warga lama, sawah, seluruh dekor lama | source Episode 001–002 baseline | dipakai kembali tanpa edit |
| VO | MP3 asli, disalin sekali menjadi `public/episode003/voiceover.mp3` | SHA-256 `d68cce970725cceb63a2c8ac91b856f4b3f9baddcef09eef53ec3ec9fd2d1283` |
| Komentar | enam screenshot asli yang benar-benar dipakai | file tidak diubah; hanya dibingkai sebagai kartu |

MANIFEST A3/A4 dan export aktual diperiksa sebelum integrasi. Keduanya sudah tersedia, sehingga **tidak ada dependensi A3/A4 yang menunggu**. Paket final menyertakan seluruh source dependensi yang belum berada di main agar langsung dapat digunakan setelah diterapkan pada baseline. Tidak menyertakan salinan seluruh repository/handoff, node_modules, model ASR, venv, atau bundle hasil build.

## Perubahan baru

- `src/Episode003Scene.tsx`: komposisi lengkap dan `Episode003Stage` yang reusable untuk probe QA. Satu terrain, satu rumah yang direnovasi, satu sawah belum dipanen, satu sungai, satu warteg. Props terrain menerima radius akhir 37.5; FX menerima radius yang sedang terlihat. Rumah lama tidak pernah dihilangkan. Objek lama tidak ikut diskalakan bersama terrain.
- `src/episode003/audio/alignment.ts`: metadata VO, 46 cue caption dan 217 token kata beserta timestamp, confidence/probability, dan status verifikasi.
- `src/episode003/captions/**`: subtitle putih, highlight kata aktif kuning, outline, fade, outro dengan end hold; screenshot komentar utuh, panel agregat follow, dan CTA calon warga.
- `src/episode003/direction/**`: 11 beat mengikuti timing MP3, progress A1–A4, acting Gobi/warga, jeda komedi, dan 12 cue metadata SFX.
- `src/episode003/characters/**`: adapter model Gobi asli, properti telepon/saku kosong, dua model warga lama, empat varian warga baru dengan outfit/rambut dari roster E, apron Shifalina, gesture telapak meminta bayar, dan name tag 75 frame.
- `src/episode003/camera/**`: sembilan keluarga preset, framing wajah/objek, tracking air, reveal pulau, two-shot, detail kantong, lighting hangat dan fill wajah. Interpolasi orbit menjaga kamera tidak melewati target; arah orbit dikunci saat transisi; lintasan dari sawah melewati atas atap warteg.
- `src/episode003/world/index.ts`: barrel export dependensi asli.
- `src/Root.tsx`: hanya import dan registrasi `Episode003`; empat komposisi lama tetap ada.
- `package.json`: hanya menambah `test:ep003`, `still:ep003`, `build:ep003`. Dependency dan lockfile tetap.
- Dua test produksi baru, di samping seluruh test A1/A2/A3/A4/E yang disertakan.

Semua gerak adalah sampel fungsi `frame` pada 30 FPS; progress bangunan diturunkan dari frame. Tidak ada `Math.random`, delta-time, clock animation, atau simulasi fisika terakumulasi. Seek mundur/maju menghasilkan pose yang sama. Kanvas untuk name tag hanya membuat tekstur teks lokal, dengan disposal; bukan sumber waktu animasi.

## Timeline aktual dan acting

| Detik | Beat / aksi |
|---|---|
| 0–7.44 | Gobi kaget, agregat 33 + 55 + 17 = 105, reveal rumah lama |
| 7.44–19.26 | baca komentar asli, kepala membaca dan properti telepon |
| 19.26–24.86 | pulau membesar, pointing, reaksi dekat dan reveal |
| 24.86–32.36 | sungai mengisi 26.82–29.30; tracking mengikuti ujung air; Damar/Eka mengamati dan dikenalkan |
| 32.36–43.28 | rumah lama → atap naik 35.36–36.90 → lantai dua 37.14–38.12 → atap kembali 38.60–39.70 → settle/reveal |
| 43.28–53 | komentar Shifalina ditampilkan utuh; tanggapan Gobi |
| 53–58.90 | rangka; meja 55.08–55.72 → etalase 56.14–56.76 → atap 57.08–57.66 → jadi/settle |
| 58.90–65.50 | Shifalina melambai di anchor vendor A4; nama sementara; two-shot |
| 65.50–76.36 | lapar → pesan 68.30 → bayar dulu 69.92 → saku kosong 71.65–73.10 → reaksi 72.62–75.95 |
| 76.36–87.64 | stok terbatas di etalase; sawah tetap belum dipanen; komentar peternakan/perkebunan sebagai teaser |
| 87.64–100 | Joy hadir, CTA calon warga, reveal semua pembangunan, close-up dan outro tepat hingga frame terakhir |

Timing disesuaikan dengan ASR MP3 asli, bukan angka perkiraan storyboard. Tidak ada time-stretch atau pemotongan VO. Durasi MP3 yang diukur **99.552625 detik**, 44.1 kHz mono. Komposisi **1080×1920, 30 FPS, 3000 frame / 100 detik** memberi tail hold 0.447375 detik setelah file berakhir. Outro: **“Yuk, bangun pulau ini bareng-bareng!”**.

Caption **machine-aligned, `verified:false`**: faster-whisper small, CPU int8, bahasa Indonesia, word timestamps, beam 5. Normalisasi editorial terbatas seperti Shivalina→Shifalina, wartek→warteg, tanda baca dan ejaan outro dicatat di JSON. **Belum dilakukan pemeriksaan dengar manusia penuh**; confidence bukan bukti verifikasi manusia. Raw ASR dan script disertakan agar koreksi bisa ditelusuri.

SFX legal tidak disediakan. Seluruh 12 cue memiliki `file:null`, `enabled:false`, `status:'awaiting-licensed-audio'`. Tidak ada file audio palsu atau suara sintetis. Saat ini yang terdengar adalah VO asli (volume 0.95).

## Kontinuitas warga dan interaksi

Roster E tetap otoritatif: oktaa.blushh, Afriza SuperStore, shifalina_, damar_zan, Eka Agustin, joy.__3.15. Enam warga + Gobi = tujuh karakter. Empat varian baru bersifat generik, tidak mengklaim kemiripan fisik orang nyata. Status Joy yang belum diverifikasi tetap dipertahankan. `EP003_DRAFT_STATE.finalQa` tidak dipalsukan menjadi true.

105 adalah **total hitungan follow lintas platform**, bukan orang unik atau jumlah NPC. Follow + komentar “Jadi Warga” menghasilkan calon yang dipilih kreator, bukan pendaftaran otomatis. Rumah kos, peternakan dan perkebunan belum dibangun.

Vendor dan pelanggan memakai transform `WARTEG_LOCAL_ANCHORS` A4 asli:

| Anchor | Posisi dunia |
|---|---|
| Shifalina / vendor | [13.045406, 0, 5.427244] |
| Gobi / customer | [15.304612, 0, 3.168037] |
| Fokus etalase | [15.887975, 2.145, 5.490883] |

Model warga lama tetap sama, blocking EP003 ditempatkan agar tidak menutup wajah Gobi. Jalur Gobi melewati area bersih di depan dekor; tidak memindahkan pohon/semak/sawah untuk memberi jalan.

## Hasil QA faktual

| Pemeriksaan | Hasil |
|---|---|
| Seluruh Node test proyek | **PASS, 123 entri test**, 0 gagal; termasuk script legacy yang mencetak assertion sendiri |
| Test produksi baru | **PASS, 20 test**; timing, determinisme, roster, camera, collision, safe zoom/framing |
| Hash sumber | **PASS**: 80 file baseline terlindungi, 26 file dependensi A1/A2/E/A3/A4, 7 media asli |
| Root/package | **PASS**: registrasi Episode003 dan penambahan script saja; dependency/lockfile tetap |
| TypeScript proyek | **FAIL baseline**: TS2740 di `src/episode002/Villager.tsx(104,71)`, `number[]` vs `Vector2` pada sprite center |
| Perbandingan TypeScript baseline/integrasi | **PASS**: exit code 2 dan diagnostik identik; tidak ada diagnostik tambahan dari EP003 |
| Remotion compositions CLI | **PASS**: Episode003 3000f, Episode002 2700f, Episode001 780f, dua preview lama tetap terdaftar |
| Remotion bundle CLI/API | **PASS**, dependency proyek asli, WebGL ANGLE |
| Still produksi | **34 still EP003 nyata**, ditambah 4 PNG kontrol legacy; tidak ada MP4 |
| Runtime probe R3F | **PASS pada 74 frame terpilih**: satu rumah, satu atap asli, lantai lama tetap ada; river/warteg sesuai tahap; enam warga di akhir |
| Layout Chromium | **PASS pada 74 frame terpilih**, meliputi seluruh 46 cue: maksimal 2 baris, safe area 75..1005 × 1510..1760; maksimal 3 kartu komentar |
| Legacy still regression | **PASS**: EP001 frame 330 dan EP002 frame 2280 identik SHA-256 antara baseline dan integrasi |
| Pemeriksaan visual still | **DILAKUKAN**: wajah, komentar, renovasi atap, build warteg, vendor, pembayaran, kantong kosong, sawah, reveal dan outro ditinjau dari PNG asli |
| Full playback, audio review manusia, persetujuan visual akhir | **NOT-RUN / milik pemilik proyek** |

Probe layout mengukur posisi kata/kartu di dalam overlay fixed-width karena Remotion mula-mula me-mount scene di viewport tersembunyi. Ukuran canvas sementara dalam log DOM bukan resolusi output; PNG produksi sungguhan berukuran 1080×1920. Sampel scene akhir memiliki 643 mesh node dan 1038 instance ekuivalen, **bukan klaim draw-call/FPS**.

Collision diperiksa di semua 3000 frame untuk envelope badan, terrain, parit, rumah/sawah, batang pohon dan semak; posisi kamera diperiksa terhadap envelope rumah/warteg. Gesture tangan dan framing ditinjau pada still kunci. Ini bukan simulasi collision seluruh permukaan tubuh atau pemeriksaan visual semua 3000 frame. Perubahan blocking yang dilakukan setelah preview pertama: warga lama dibebaskan dari wajah Gobi, kamera vendor dijauhkan dari tiang, tracking mengikuti ujung air, rute Gobi menghindari semak, dan kamera kembali dari sawah memakai lintasan di atas atap. Kamera ortografis berjarak minimal 40 unit dari target agar near plane tidak memotong tanah foreground; framing tetap ditentukan oleh zoom. Kamera komedi menunggu Gobi berputar menghadap penonton, sehingga tidak mengorbit mengikuti putaran badannya melalui warteg. Tidak menyatakan final visual PASS.

## Preview Windows

Di worktree ini dependency tersedia melalui junction lokal. Untuk checkout baru, gunakan `npm ci` dari lockfile baseline; junction tidak termasuk ZIP.

```powershell
Set-Location D:\pulau-gobi\ep003-production
# Checkout baru saja: npm ci
npm run dev
# Pilih Episode003 di Remotion Studio.
```

```powershell
npm run test:all
npm run test:ep003
npx tsc --noEmit
npx remotion compositions src/index.ts --gl=angle
npm run build:ep003
npm run still:ep003
# Still lain, tanpa MP4:
npx remotion still src/index.ts Episode003 out\ep003-vendor.png --frame=1830 --gl=angle
npx remotion still src/index.ts Episode003 out\ep003-house.png --frame=1135 --gl=angle
```

Preview beat penting: frame 30 hook; 625 expansion; 835 water fill; 920 warga sungai; 1100/1135/1185 renovasi; 1665/1700/1732 warteg; 1830 vendor; 2100/2115 payment; 2165 pockets; 2220 reaction; 2400 sawah; 2800 world reveal; 2890/2990 outro. Periksa juga playback dengan VO di Studio untuk timing rasa komedi, transisi kamera dan pengucapan ASR sebelum menyetujui visual akhir.

Harness QA dalam ZIP mempertahankan path `out/production-tools` agar import relatif dapat dijalankan dari root repository:

```powershell
node out\production-tools\render.mjs
node --experimental-strip-types out\production-tools\audit.mjs
```

`verify.mjs` dan `legacy.mjs` membutuhkan folder baseline/handoff/worktree referensi lokal untuk membandingkan source. `transcribe.py` memerlukan faster-whisper dalam Python venv terpisah; model/venv tidak didistribusikan. Aplikasi produksi tidak memerlukan Python, ASR atau jaringan eksternal.

## Isi ZIP dan penerapan

Satu `PulauGobi_EP003_INTEGRATION_PATCH.zip`: source baru/modified, dependensi asli yang belum ada di main, test EP003, satu MP3 asli, enam screenshot yang dipakai, MANIFEST ini, evidence terpilih dan harness di `out/`. `patch-inventory.json` berisi daftar path dan SHA-256 isi paket (di luar hash inventory sendiri).

Terapkan pada branch lain dari baseline di atas atau gunakan branch kerja lokal ini. Tinjau perubahan `Root.tsx`/script bila main berkembang; jangan menimpa perubahan orang lain. Jangan menerapkan ulang source A1–A4/E bila sudah diintegrasikan dengan versi berbeda tanpa membandingkan hash. Tidak ada kebutuhan merge branch lain karena source dependensi asli sudah disertakan. Commit lokal tercantum dalam receipt pengiriman; evidence besar di `out/` diikutkan dalam ZIP, bukan source commit.

Yang tersisa untuk pemilik: preview playback Windows, koreksi ASR bila ada kata yang berbeda, SFX legal bila diinginkan, dan persetujuan visual/render final. Tidak ada blocker implementasi A3/A4. Typecheck hijau penuh membutuhkan perbaikan baseline Episode 002 yang berada di luar perubahan ini.
