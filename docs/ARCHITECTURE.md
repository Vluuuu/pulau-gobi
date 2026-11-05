# Arsitektur Engine — Pulau Gobi (v1, disetujui dengan penyesuaian)

> **Status: DISETUJUI sebagai arah desain (2026-11-05), BELUM DIIMPLEMENTASIKAN.** Belum ada kode, dan belum ada yang dijalankan atau diuji. Keputusan D1–D10 ada di [`DECISIONS.md`](DECISIONS.md) (sumber kebenaran). Bila dokumen ini bertentangan, urutan prioritas: `DECISIONS.md` > `ARCHITECTURE.md` > `TECHNICAL_SPEC.md`. Dokumen ini adalah rincian dari `TECHNICAL_SPEC.md`, bukan duplikatnya.

**Prinsip pembatas (scope guard):** jangan membangun lebih dari yang dibutuhkan untuk membuktikan kualitas visual. Pertahankan: multi-island, persistent world state, reusable asset registry, animasi deterministik per frame, rig karakter modular, preset kamera dan lampu, snapshot episode. **Tidak dibangun** sebelum ada episode yang membutuhkannya: physics engine, AI penghuni, navigasi kompleks, simulasi ekosistem. Kontrak di bawah ditulis lengkap agar arah jelas, tetapi **diimplementasikan bertahap**: command, aset, dan script baru dibuat saat episode pertama yang memerlukannya.

## 0. Status verifikasi

| Hal | Status |
| --- | --- |
| Seluruh repo dibaca (`CLAUDE.md`, `README.md`, `PROJECT_INSTRUCTIONS_CHATGPT.md`, `docs/`, `.gitignore`, PR template; commit `dd9bb8e`) | Sudah dibaca |
| `@remotion/three` memakai `<ThreeCanvas />`; animasi di markup, bukan `useFrame()`; `<Sequence>` di dalam canvas butuh `layout="none"`; Chromium perlu ANGLE (`Config.setChromiumOpenGlRenderer('angle')`, `chromiumOptions.gl = 'angle'` untuk API SSR) | Dari dokumentasi Remotion, dibaca 2026-11-05; **cek ulang saat Stage 1** |
| R3F v9 untuk React 19; sRGB otomatis pada texture dihapus | Dari migration guide R3F; **cek ulang saat Stage 1** |
| Nomor versi `remotion`, `three`, `@react-three/fiber`, React, Node | **Belum ditetapkan.** Dipin saat Stage 1 (lihat D6 dan §9.5) |
| Remotion 5.0 akan mengubah lisensi/telemetri | Disebut di halaman FAQ lisensi resmi Remotion (dibaca 2026-11-05) untuk pelanggan "Automators"; tanggal rilis tidak tercantum. Lihat [`LICENSES_AND_ASSETS.md`](LICENSES_AND_ASSETS.md) |
| Performa render, kualitas visual, semua klaim "akan berjalan" | **Belum diuji.** Sesi Claude tidak dapat `npm install` |

## 1. Hasil audit Stage 0

| # | Temuan awal | Status |
| --- | --- | --- |
| A1 | `README.md` berisi baris UTF-16 (byte NUL) | Diperbaiki di Stage 0; `.gitattributes` ditambahkan |
| A2 | Dokumen menyebut repo private, repo ternyata publik | Owner akan menjadikannya private (D1); visibility tidak diubah oleh Claude |
| A3 | `ROADMAP.md` usang | Diperbarui di Stage 0 |
| A4 | Belum ada `package.json`, lockfile, `tsconfig`, konfigurasi Remotion, `LICENSE`, `.env.example` | Sengaja ditunda ke Stage 1 |
| A5 | `TECHNICAL_SPEC.md` tingkat tinggi | Dirinci oleh dokumen ini |
| A6 | Mekanisme durasi dan sumber word timing belum ditentukan | D7 dan D9; lihat §8 |
| A7 | Lisensi komersial belum dicatat | Dicatat awal di [`LICENSES_AND_ASSETS.md`](LICENSES_AND_ASSETS.md); verifikasi akhir oleh owner (D10) |
| A8 | `CLAUDE.md` tidak mewajibkan `CONTENT_RULES.md` dan `QA_CHECKLIST.md` | Diperbaiki di Stage 0 |
| A9 | `.gitignore` memblokir `*.zip`, `*.mp4`, `*.mov`, `*.webm` secara global | Dicatat; gunakan `git add -f` untuk aset sah bila perlu |

Keputusan kreatif yang **belum** final (palet, desain Gobi, tipografi, suara, musik, intro, jadwal, handle) diputuskan di Visual Pre-Production (§10), bukan dikarang.

## 2. Invariant arsitektur

1. **World state adalah data murni**, tanpa import React/Three. Dapat diuji dengan Node saja.
2. **Renderer = fungsi murni dari `(WorldState, EpisodeTimeline, frame)`.** Tidak ada state tersembunyi.
3. **Episode adalah data** (commands + timeline + referensi audio), bukan kode adegan baru. Episode rutin tidak boleh mengubah engine.
4. **Dilarang di jalur render:** `Math.random`, `Date.now`, `performance.now`, `requestAnimationFrame`, `setTimeout`, `useFrame` untuk animasi. Gunakan `useCurrentFrame()`, `interpolate`, `spring`, dan `seededRandom(seed)`. Ditegakkan lewat aturan ESLint dan `check:determinism`.
5. **Snapshot immutable dan berantai.** Snapshot `after-epN` menyimpan hash `after-epN-1`. Objek tidak pernah hilang karena data hilang: penghapusan = tombstone + `removedBy` (peristiwa cerita).
6. **Backward compatibility:** aset dan skema berversi; episode lama tetap dapat dirender dengan versi aset yang dirujuknya.
7. **Outro** disimpan sebagai satu konstanta; tes membandingkannya dengan teks di `CLAUDE.md`.
8. **Scope guard:** tanpa physics engine, AI penghuni, navigasi kompleks, atau simulasi ekosistem sampai ada episode yang membutuhkannya. Setiap modul baru harus punya konsumen nyata di episode atau stage berjalan.

## 3. Struktur modul (single package, batas modul ketat)

Struktur di bawah adalah **target**. Folder dan file dibuat saat dibutuhkan, bukan sekaligus di Stage 1.

```
src/
  shared/        units, seededRandom (mulberry32), easing, math, outro.ts
  world/         PURE TS
    schema/      tipe + validator + migrasi skema
    commands/    createIsland, expandIsland, addStructure, addProp, addResident,
                 addCreature, moveEntity, removeEntity(+storyEventId),
                 updateEnvironment, setFlag
    apply.ts     reducer: (state, command) -> Result<state>
    validate/    ID unik, island ada, footprint dalam cell, tanpa overlap, aset ada
    snapshots/   hash chain, serialisasi stabil (kunci terurut)
    queries.ts   bounds, occupancy, entitas per island
  catalog/       registry aset (metadata + builder), palette, material preset
  characters/
    gobi/        spec (terkunci), rig, pose, clip, ekspresi
  animation/     clip evaluator, blend, choreography (build/grow/summon), path follower
  timeline/      tipe episode, compiler, resolver "state pada frame t"
  render/        R3F: Stage, IslandView, WaterView, EntityView, LightRig, CameraRig
  av/            captions, audio track, outro component
  remotion/      Root.tsx, compositions, calculateMetadata
  episodes/      ep001/ ..., registry.ts
world-data/      snapshots/after-ep001.json (ditulis mesin, di-commit)
scripts/         Node .mjs lintas-OS: world-apply, check-encoding, check-determinism,
                 qa-stills, qa-report
public/          audio/, models/ (hanya bila lisensi jelas)
```

Aturan impor: `world` tidak boleh mengimpor apa pun di atasnya; `render` boleh mengimpor `world`, `catalog`, `characters`, `animation`; `remotion` adalah satu-satunya lapisan yang tahu Remotion API. Dijaga ESLint (`no-restricted-imports`).

## 4. World state, multi-island, persistent

### 4.1 Sketsa kontrak (bukan kode final)

```ts
type Id = string; // stabil, mis. "island:main", "res:gobi", "str:rumah-01"

interface WorldState {
  schemaVersion: number;
  afterEpisode: string;          // "ep001"
  parentHash: string | null;     // hash snapshot episode sebelumnya
  environment: Environment;      // timeOfDay, sky, waterStyle, weather
  islands: Record<Id, Island>;
  entities: Record<Id, Entity>;
  relations: Relation[];         // mis. tinggal-di, memiliki
  flags: Record<string, string | number | boolean>;
}

interface Island {
  id: Id; origin: { x: number; y: number; z: number }; yawDeg: number;
  cells: string[];               // "x,z" terurut; satu cell = 1 satuan dunia
  seed: number; biome: string; introducedIn: string;
}

interface Entity {
  id: Id; kind: "resident" | "structure" | "prop" | "vegetation" | "creature";
  assetId: string; assetVersion: number;
  islandId: Id;
  transform: { pos: [number, number, number]; yawDeg: number; scale: number };
  introducedIn: string;
  status: "active" | "removed"; removedBy?: string; // id peristiwa cerita
  params?: Record<string, unknown>;
}
```

### 4.2 Multi-island
- Setiap pulau punya `origin` dan `yawDeg` di koordinat dunia; entitas memakai koordinat **lokal pulau**. Menambah pulau = menambah node, tidak menyentuh pulau lain. `origin.y` memungkinkan pulau terbang.
- `island:main` wajib ada dan tidak bisa dihapus oleh command.
- Kamera menghitung framing dari `bounds` semua pulau/entitas yang relevan, jadi pulau baru tinggal masuk ke bounds.

### 4.3 Representasi terrain (D2: disetujui, dengan syarat visual)
Pulau = **himpunan cell** sebagai data logika (penempatan, footprint, tabrakan sederhana, ekspansi). Mesh **tidak** dibuat dari kubus per cell. Syarat visual (diuji lewat still di Visual Pre-Production, bukan diklaim dari kode):
- Kontur pantai dibangkitkan dari himpunan cell lalu dihaluskan (sudut dibulatkan/dipotong, titik kontur digeser dengan variasi seeded) sehingga tepi terlihat organik low-poly, bukan tangga grid.
- Permukaan atas punya variasi ketinggian halus; sisi tebing/tanah berfaset tidak tegak lurus seragam; ada lapisan rumput, tanah, dan batu dasar.
- Tidak ada tepi lurus panjang sejajar sumbu pada siluet pulau.
- Bila kontur dari 1 cell per kotak masih terasa kaku, naikkan resolusi kontur (sub-cell 2×2 untuk mesh, tanpa mengubah satuan logika 1 unit = 1 cell).
- Ekspansi = menambah cell; kontur dihitung ulang, dan cell baru naik dengan animasi (§7).
Alternatif (poligon kontur bebas) tetap disimpan sebagai cadangan bila cell-based gagal di still.

### 4.4 Commands dan validasi
Kontrak lengkap di bawah, tetapi hanya command yang dibutuhkan episode berjalan yang diimplementasikan (awal: pulau utama dan `addResident` untuk Gobi).

Command bersifat data: `{ id, type, payload }`. `apply` mengembalikan `Result` (state baru atau daftar error), tidak melempar. Validasi minimum: ID unik, `islandId` ada, aset ada di catalog, footprint berada di dalam cell pulau, tidak overlap entitas aktif, `removeEntity` wajib membawa `storyEventId`, Gobi tidak dapat dihapus tanpa peristiwa eksplisit.

### 4.5 Snapshot per episode
`world-data/snapshots/after-epNNN.json` ditulis oleh `npm run world:apply -- epNNN` (menjalankan command episode terhadap `after` episode sebelumnya, lalu menulis hasil + hash). `before` selalu diturunkan dari `after` sebelumnya dan diverifikasi oleh script; tidak disimpan ganda. Ep001: tanpa command perubahan struktur, jadi `after-ep001` = pulau utama + `res:gobi`, tanpa struktur dan vegetasi.

## 5. Sistem karakter Gobi

- **Model procedural low-poly dengan articulated rig (D5, final).** Prioritas utama: kualitas proporsi, ekspresi wajah, dan animasi. Kontrol penuh atas pivot, deterministik, tanpa skinning. GLB tidak dilarang permanen untuk aset masa depan (mis. makhluk rumit) selama lisensinya tercatat.
- **Rig hierarkis** dengan pivot bermakna: `root > hips > spine > chest > neck > head`; `chest > shoulder.L/R > upperArm > foreArm > hand`; `hips > thigh > shin > foot`. Nama bone diekspor sebagai tipe agar clip tervalidasi di compile-time.
- **`GobiSpec` terkunci** (warna, proporsi, pakaian) di satu file berversi. Tes menghitung hash spec agar perubahan tidak sengaja terdeteksi. Spec dikunci hanya setelah desain disetujui di Visual Pre-Production (§10); sebelum itu semua nilai bersifat sementara.
- **Pose dan clip:** pose = rotasi per bone + keadaan wajah. Clip = keyframe pose dengan easing; `evaluateClip(clip, localFrame)` murni. Blending antar clip dengan crossfade; lapisan aditif untuk napas, kedip, dan look-at.
- **Wajah:** mata (kedip lewat skala), alis, mulut; set ekspresi awal: netral, senang, terkejut, khawatir, kesal-lucu, tekad. Sinkron mulut dengan VO ditunda (butuh envelope audio yang dihitung di muka agar deterministik).
- **Clip bertahap (urutan sesuai bible):** Stage 4 = idle breathing, walk, wave, look-around, surprise. Berikutnya: point, celebrate, worried, inspect, sit.
- **Lokomosi:** `moveTo` memakai polyline + kecepatan; fase walk-cycle diturunkan dari jarak tempuh sehingga kaki tidak meluncur. Posisi Gobi pada frame t adalah fungsi murni.
- **Aktor sebagai track:** `{ startFrame, clip, expression, lookAt?, moveTo? }` di timeline episode, sehingga acting tiap episode berupa data.

## 6. Aset reusable (catalog)

```ts
interface AssetDefinition {
  id: string; version: number; kind: "structure" | "prop" | "vegetation" | "creature";
  builder: "procedural" | "glb";
  footprint: [number, number];      // dalam cell
  pivot: "base-center" | "custom";
  bounds: { min: [number, number, number]; max: [number, number, number] };
  anchors?: Record<string, [number, number, number]>; // pintu, tempat duduk, dll.
  buildChoreography?: string;       // id choreography
  license?: { source: string; terms: string };       // wajib untuk GLB/audio/font
}
```

- Semua warna lewat `palette.ts` (nilai sementara sampai palet final disetujui) dan material preset: rumput, tanah, air, kayu, batu, metal, fantasi.
- Geometri procedural di-cache per `(assetId, version, params)` di level modul. Pengulangan banyak (pohon, rumput) memakai instancing, ditambahkan saat benar-benar dibutuhkan.
- **Asset-Lab:** komposisi Remotion yang menampilkan satu aset dari beberapa sudut dengan kotak footprint/bounds, untuk QA aset sebelum dipakai episode.
- Aset baru = satu file builder + satu entri catalog, mengikuti satu aset referensi.

## 7. Animasi pembangunan

Pendekatan: **choreography = fungsi murni `progress(0..1) -> transform/visibilitas per bagian`**, dipicu oleh command yang punya `startFrame` pada timeline.

| Choreography | Urutan |
| --- | --- |
| `build` (rumah, bangunan) | pondasi naik (squash/stretch) → dinding bertahap → atap jatuh dengan pantulan → detail (pintu, jendela) → settle kecil + debu (partikel seeded) |
| `grow` (pohon, tanaman) | skala dari nol dengan spring, goyang halus saat selesai |
| `expandTerrain` | cell baru naik dari bawah dengan jeda berdasarkan jarak ke tepi (jeda seeded); kamera pull-back disinkronkan lewat shot |
| `bridge` | papan muncul berurutan di sepanjang spline |
| `summon` (fantasi) | cincin cahaya, partikel, skala-masuk; terpisah dari `build` agar terasa berbeda |

Aturan: tiap struktur mendefinisikan `buildStages` (rentang progress per bagian). Gobi bereaksi lewat track aktor (menoleh, mendekat, terkejut). Pop-in tanpa animasi dilarang di QA. Easing memakai `spring()`/`interpolate()` Remotion, yang deterministik terhadap fps dan frame.

## 8. Episode timeline

```ts
interface EpisodeDefinition {
  id: string; schemaVersion: number; title: string; status: string;
  worldBefore: string;                       // "after-ep000"/"after-epN-1"
  commands: Array<{ atSec: number; command: WorldCommand; choreography?: string }>;
  vo: { file: string; durationSec: number };           // VO final; lihat D9
  captions: { level: "word" | "phrase"; file: string }; // JSON hasil konversi, lihat §8.1
  shots: Array<{ startSec: number; endSec: number; camera: CameraTrack; light?: string }>;
  actors: ActorTrack[];                      // acting Gobi dan penduduk
  overlays: TextOverlay[];
  sfx: Array<{ atSec: number; file: string; gain: number }>;
  music?: { file: string; gain: number };
}
```

- Penulisan dalam **detik** (selaras VO), dikompilasi ke **frame** (`round(sec * 30)`).
- `compileEpisode(def, stateBefore)` memvalidasi: shot tidak overlap dan menutup seluruh durasi, command di dalam durasi, outro menempati bagian akhir, durasi VO ≤ durasi komposisi. Hasilnya `CompiledEpisode` dengan `durationInFrames`.
- `resolveAtFrame(compiled, frame)` menghasilkan daftar entitas dengan `buildProgress`, pose aktor, kamera, dan lampu: murni dan dapat dimemoisasi.
- `calculateMetadata` Remotion mengambil `durationInFrames` dari hasil compile (sumber durasi: VO + outro). Nama API pengukur durasi audio diverifikasi saat implementasi.
- **Kamera:** `CameraTrack` berupa keyframe `{ frame, target, zoom, azimuthDeg, elevationDeg, easing }`. Helper `frameBounds(bounds, aspect, safeArea)` menghitung zoom otomatis untuk "framing ulang setelah ekspansi" dan "pull-back reveal pulau baru". Safe area dibuat konfigurabel; angka final dikalibrasi lewat still di ponsel (saya tidak mengasumsikan ukuran UI platform).
- Ep001 = komposisi pertama; episode berikutnya menambah folder data, bukan mengubah engine.

### 8.1 Caption dan sumber timing (D7)
- Format internal engine: JSON `{ words?: [{text, startSec, endSec}], phrases: [{text, startSec, endSec}] }`. Engine mendukung **word-level** dan **fallback phrase-level**; komposisi memilih tingkat yang tersedia, tidak mengubah tata letak.
- Sumber utama: timestamp dari ElevenLabs. Endpoint *text-to-speech with timestamps* mengembalikan alignment **per karakter** (`characters`, `character_start_times_seconds`, `character_end_times_seconds`), menurut dokumentasi resmi (dibaca 2026-11-05). Script konversi mengelompokkan karakter menjadi kata dan frasa.
- Belum dikonfirmasi: apakah model ElevenLabs yang dipakai mendukung Bahasa Indonesia dengan alignment yang akurat (halaman referensi API tidak menyebut Indonesia secara eksplisit), dan apakah alur Anda memakai API atau web UI (web UI mungkin tidak memberi timestamp). Dicek saat VO pertama dibuat.
- Fallback bila timestamp tidak ada: forced alignment (alat lokal, dipilih nanti) atau SRT/JSON manual per frasa dari naskah final.
- Naskah VO dikunci sebelum timing dibuat, sesuai `CONTENT_RULES.md`.

## 9. Strategi Three.js, R3F, dan Remotion

### 9.1 Pembagian peran
- **Three.js murni** untuk hal imperatif: membangun `BufferGeometry` pulau dari cell, vertex color, shader air, fungsi matematika kamera.
- **R3F** sebagai scene graph deklaratif di dalam `ThreeCanvas`; komponen kecil, props bersifat data.
- **Remotion** sebagai satu-satunya sumber waktu: `useCurrentFrame()` dibaca di satu tempat (komposisi), lalu `frame` diturunkan ke bawah sebagai props murni. Dengan begitu `render/` dapat dirender oleh Remotion maupun dites tanpa Remotion.
- `@react-three/drei` dipakai selektif dan hanya setelah dicek aman terhadap render deterministik; default: tanpa drei.

### 9.2 Aturan wajib (dari dokumentasi Remotion)
- Gunakan `ThreeCanvas` dari `@remotion/three`; animasi di markup, bukan `useFrame()`.
- `<Sequence layout="none">` bila dipakai di dalam canvas.
- `remotion.config.ts`: `Config.setChromiumOpenGlRenderer('angle')`; skrip render berbasis API SSR menambahkan `chromiumOptions: { gl: 'angle' }`.

### 9.3 Komposisi yang direncanakan
`Ep001` (final), `Ep001-Preview` (resolusi/kualitas lebih rendah, tata letak identik), `Stills` untuk QA (0/25/50/75/100 %), `Gobi-Lab` (galeri clip dan turntable), `Asset-Lab`, `World-Overview` (debug snapshot semua pulau).

### 9.4 Kualitas visual
Lampu kunci directional dengan shadow, hemisphere sebagai fill, soft shadow (PCF; VSM dibandingkan lewat still), contact shadow untuk karakter, kamera shadow di-fit otomatis ke bounds (penting saat pulau meluas), flat shading pada material sederhana. Mode `preview`/`final` hanya mengubah ukuran shadow map, antialias, dan DPR, bukan komposisi. Semua pilihan di sini dinilai lewat still di laptop, bukan diklaim bagus dari typecheck.

### 9.5 Versi dan paket (D6)
Semua paket `remotion` dan `@remotion/*` memakai versi yang sama persis (praktik standar Remotion; diverifikasi ulang di halaman resmi sebelum menulis `package.json`). R3F v9 dipasangkan dengan React 19; `three` dan `@types/three` dipilih yang kompatibel dengan R3F tersebut. Semua dipin dan lockfile di-commit.

**Node.js:** versi final ditetapkan di Stage 1 setelah (a) persyaratan Node dari dokumentasi Remotion dicek, (b) `node -v` dan `npm -v` di laptop Windows Anda diketahui, dan (c) kompatibilitas paket diperiksa. Per 2026-11-05 halaman rilis Node.js menandai v22, v24, dan v26 sebagai LTS; kandidat awal adalah LTS terbaru yang didukung Remotion (kemungkinan v24). Ini **belum keputusan final**.

### 9.6 Performa render
Remotion merender frame secara paralel di beberapa tab Chromium, sehingga setiap tab membangun scene sendiri. Konsekuensi: geometri harus murah dibuat, cache modul, tanpa alokasi per frame, instancing untuk objek berulang, dan `--concurrency` disetel di laptop pengguna. Angka performa **belum ada**; diukur di Stage 6.

## 10. Roadmap bertahap

Setiap stage selesai dengan **gerbang persetujuan** sebelum lanjut. Rincian checklist ada di [`ROADMAP.md`](ROADMAP.md).

| Stage | Isi | Kriteria selesai |
| --- | --- | --- |
| **0. Higiene repo dan keputusan** | README UTF-8, `.gitattributes`, ROADMAP, CLAUDE.md, DECISIONS, AI_CONTEXT, LICENSES_AND_ASSETS | Review dokumen; tanpa kode |
| **V. Visual Pre-Production** | Opsi desain Gobi (wajah, pakaian, warna, proporsi), opsi palet dunia, style pulau (kontur organik, §4.3), evaluasi kamera (azimuth ±45°, elevasi ±35°) dan pencahayaan, semuanya sebagai **still**; skala relatif (D8) dikalibrasi di layar ponsel | Standar visual **dikunci** dan disetujui (`docs/VISUAL_STANDARD.md`). Belum ada Episode 001 |
| **1. Bootstrap** | `package.json` (versi dipin), `tsconfig` strict, ESLint (determinisme + batas impor), Vitest, konfigurasi Remotion (ANGLE), satu komposisi kosong | `npm ci`, `typecheck`, `lint`, `test`, `npm run dev` berjalan di Windows Anda |
| **2. Inti dunia (tanpa 3D)** | Skema, command yang dibutuhkan, reducer, validasi, hash chain, `seededRandom`, `outro.ts` | Tes lulus lokal |
| **3. Renderer produksi** | Mesh pulau dari cell sesuai standar visual, air, preset kamera dan lampu, `World-Overview` | Still sesuai standar terkunci |
| **4. Gobi produksi** | Rig articulated, clip idle/walk/wave/look-around/surprise, ekspresi, `Gobi-Lab` | Clip ditinjau di Studio |
| **5. Timeline dan AV** | Compiler episode, caption (word dan phrase), audio, outro, `calculateMetadata`, komposisi Ep001 | Preview di Studio; smoke render pendek berhasil. **Final hanya dengan VO final** (D9) |
| **6. QA dan poles Ep001** | Still QA, pemeriksaan determinisme, acting/kamera/lighting, ukur performa | Lolos `QA_CHECKLIST.md`; render final oleh Anda |
| **7. Engagement loop** | `world:apply`, choreography `build`/`grow`, katalog aset v1 (rumah dulu), pipeline Ep002 | Ep002 dari data + sedikit aset |
| **8. Ekspansi** | `expandTerrain`, pulau kedua, makhluk dasar, regresi snapshot visual | Episode pulau baru tanpa merusak episode lama |

Catatan Stage V: membuat still memerlukan lingkungan render. Pendekatannya (proyek lab minimal terpisah dari engine, atau langsung memakai kerangka Stage 1 yang minimal) diputuskan di awal Stage V, bersama Anda, dan tidak termasuk Stage 0.

## 11. Strategi penghematan token

1. **`docs/AI_CONTEXT.md` (singkat, ±100 baris):** sudah dibuat di Stage 0; diperbarui di akhir tiap stage. Sesi Claude membaca ini dulu, lalu hanya dokumen yang relevan.
2. **`docs/MODULE_INDEX.md` dibangkitkan script** (daftar ekspor per modul), sehingga Claude tidak perlu membuka banyak file untuk menemukan API.
3. **Episode = data.** Prompt episode rutin cukup: brief + daftar file yang boleh diubah + satu aset referensi bila perlu aset baru.
4. **Irisan vertikal kecil** (±10 file) dengan kriteria selesai dan perintah uji, bukan satu prompt raksasa.
5. **Patch/diff dan changed-files manifest**, bukan ZIP penuh (sudah sesuai workflow).
6. **Aturan ditegakkan mesin** (ESLint, tipe, tes), sehingga review manual dan percakapan koreksi berkurang.
7. **Tinjau lewat still dan contact sheet**, bukan video. `qa-report` mencetak ringkasan satu halaman untuk ditempel balik ke Claude, bukan log penuh.
8. **Satu tugas per percakapan.** Di akhir, keputusan dicatat ke `DECISIONS.md` (append-only) dan `CHANGELOG.md`.
9. **Pembagian peran tetap:** ChatGPT untuk kreatif dan brief; Claude hanya menerima brief final.

## 12. Strategi pengujian lokal (Windows)

Pengujian dibangun bertahap: Stage 1 hanya memerlukan `tsc`, ESLint, dan Vitest; pemeriksaan determinisme, still QA, dan baseline visual ditambahkan ketika sudah ada yang diuji.

Jujur soal batas: sesi Claude ini tidak dapat menjalankan `npm install`, sehingga **typecheck, tes, dan render tidak bisa dijalankan di sini**. Setiap laporan Claude akan menandai status per item: `PASS-lokal (dijalankan pengguna)`, `NOT-RUN`, atau `FAIL`. Tidak ada klaim lulus tanpa bukti.

| Lapisan | Alat | Menangkap apa |
| --- | --- | --- |
| Statis | `tsc --noEmit`, ESLint, `check:encoding` (NUL/UTF-16) | Tipe, larangan non-deterministik, batas modul, file rusak seperti README |
| Unit | Vitest | Command dan validasi, hash chain, konsistensi outro, `compileEpisode`, evaluasi clip, matematika `frameBounds`, `seededRandom` |
| Determinisme | `check:determinism` (render frame N dua kali di proses terpisah, bandingkan hash) | Sumber non-deterministik yang lolos lint |
| Visual | `qa-stills` (0/25/50/75/100 %) + contact sheet; baseline opsional untuk perbandingan piksel dengan toleransi (GPU/ANGLE bisa berbeda) | Framing, clipping, shadow, subtitle |
| Integrasi | `render:smoke` (2–3 detik, resolusi rendah) lalu render final | Aset hilang, durasi audio vs frame, crash render |
| Manual | `QA_CHECKLIST.md` | Hook, acting, kontinuitas, audio |

Script ditulis sebagai Node `.mjs` (bukan bash) agar jalan di Windows. `.gitattributes` memaksa LF untuk teks.

## 13. Risiko utama

| Risiko | Mitigasi |
| --- | --- |
| Render lambat karena banyak tab membangun scene | Cache geometri, instancing, ukur di Stage 6, setel concurrency |
| Cell-based terasa kaku | Bulatkan kontur dan variasi seeded; pertahankan opsi poligon bila gagal di still Stage 3 |
| Desain Gobi berubah setelah banyak clip dibuat | Gerbang desain di Visual Pre-Production (Stage V), sebelum rig dan clip produksi |
| Versi paket tidak cocok (Remotion/R3F/three/React) | Pin versi di bootstrap, lockfile di-commit, verifikasi lewat dokumentasi resmi |
| Subtitle tanpa word timing | Format JSON mendukung word dan phrase; fallback phrase-level (D7, §8.1) |
| Engine terlalu kompleks sebelum visual terbukti | Scope guard (§2 no. 8), Visual Pre-Production sebelum bootstrap, implementasi bertahap |
| VO sementara terbawa ke render final | Render final menolak berjalan tanpa VO final (D9) |
| Lisensi layanan/aset | Owner memeriksa; field `license` di catalog |

## 14. Keputusan

Keputusan D1–D10 sudah dibuat dan dicatat di [`DECISIONS.md`](DECISIONS.md). Dokumen ini tidak mengulang isinya.

### 14.1 Skala relatif (D8) — **SEMENTARA**
1 world unit = 1 cell. Angka berikut adalah usulan awal untuk dikalibrasi lewat still di Visual Pre-Production, lalu dikunci di `docs/VISUAL_STANDARD.md`. Jangan dipakai sebagai keputusan final.

| Objek | Ukuran usulan (unit) |
| --- | --- |
| Gobi (tinggi) | ±1.0 (acuan "G") |
| Pintu rumah (tinggi) | ±1.3 G |
| Rumah kecil (footprint) | 3×3 cell, tinggi dinding ±2 G |
| Pohon kecil (tinggi) | ±2.5 G |
| Semak/tanaman | 0.3–0.6 G |
| Pulau Ep001 (perkiraan) | 7×7 hingga 9×9 cell, bentuk organik |

### 14.2 Masih terbuka (diputuskan kemudian)
| Hal | Kapan |
| --- | --- |
| Versi Node.js final dan versi paket | Stage 1 |
| Alur ElevenLabs (API atau web) dan dukungan alignment Bahasa Indonesia | Saat VO pertama dibuat |
| Pendekatan lingkungan still untuk Visual Pre-Production | Awal Stage V |
| Nilai final kamera (azimuth, elevasi), palet, desain Gobi, tipografi | Stage V |
| Lisensi font, musik, SFX, aset: pilihan dan pencatatan | Saat dipilih; lihat `LICENSES_AND_ASSETS.md` |
