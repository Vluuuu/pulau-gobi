# EP003 World Builder — A1–A4 (2026-11-06)

**Status: keputusan produksi EP003.** Tugas Claude A tunggal dipecah menjadi **empat spesialis** untuk mengurangi beban satu sesi. **Jangan lagi menyerahkan `CLAUDE_A.md` sebagai satu tugas kode besar.** Paket input Claude adalah ZIP scoped lokal yang dibuat ChatGPT; sesi Claude **tidak perlu membuka GitHub**.

| Sesi | Output | Ownership |
|---|---|---|
| A1 | Terrain, ekspansi, trench sungai, shared world layout | `src/episode003/world/terrain/**`, `src/episode003/world/layout.ts` |
| A2 | Alur/air/tepi sungai | `src/episode003/world/river/**` |
| A3 | Rumah lama `house-001` direnovasi 2 lantai | `src/episode003/world/house/**` |
| A4 | Warteg, etalase/stok, interaksi penjaga | `src/episode003/world/warteg/**` |
| B | world barrel + integrasi semua patch | `src/episode003/world/index.ts` |

**Kontrak koordinat dari draft Claude E:** radius lama 11.7, radius target sementara 37.5 (rentang desain 35–40), ground top Y=0; house-001 `[-5,0,-1]` rot PI/4 scale 1.65; sawah `[4.9,0,-2.6]` rot PI/4 scale 1.9; warteg-001 `[14,0,6]` rot 3PI/4 scale 1.5; river-001 centerline XZ `[[-22,-6],[-16,2],[-13,10],[-15,20]]`, width 3, channel bottom -0.35, water surface -0.15. Posisi semua baru **provisional**, tetapi sama antar paket A1–A4 agar integrasi mungkin dilakukan. A1 menulis runtime layout; B menyelaraskannya dengan draft state E. Jangan membiarkan A2/A4 memilih koordinat sendiri-sendiri.

**Kontrak API:** A1 `ExpandedIslandEP003({progress,frame?,radius?})` dan `EP003_WORLD_LAYOUT`; A2 `RiverEP003({progress,frame,centerline?,width?,bedY?,waterY?})`; A3 `RenovatedHouseEP003({progress,frame?,position?,rotationY?,scale?})`; A4 `WartegEP003({progress,frame?,position?,rotationY?,scale?})` serta `WARTEG_LOCAL_ANCHORS` untuk vendor/customer/counterFocus. Gunakan progress lokal 0–1 frame-deterministic, bukan timeline masing-masing.

**Batasan:** tidak menimpa file EP001/EP002, modul E/D/F/C, scene B, atau `package.json`. Tidak merender MP4, tidak push ke main. Setiap Claude menyerahkan ZIP patch minimal + MANIFEST + laporan tes nyata. B membuat `src/episode003/world/index.ts` setelah empat patch direview.

**Continuity/quality:** A1 tidak men-scale object lama; terrain harus memberi trench realistis untuk sungai A2; rumah EP002 tidak berduplikasi/beratap dua lapis; sungai dan warteg tidak menabrak dekor, rumah atau sawah; A4 tidak membuat NPC Shifalina, hanya anchor untuk D. Pantau kualitas low-poly, close-up construction, dan 4–6 detik ekspansi termasuk reveal.

**Input khusus Claude:** File ZIP `PulauGobi_EP003_Claude_A1_SCOPED.zip` sampai `A4_SCOPED.zip`, masing-masing berisi `START_HERE.md`, `EP003_A_SHARED_CONTRACT.md`, `PROMPT_Ax.md`, brief dan referensi terbatas. ZIP tidak di-commit; diunduh/dikirim owner dari percakapan produksi.

**Progress:** Patch Claude E sudah diterima dan dilaporkan 9 tes PASS, integrasi/render EP003 belum diuji. Pastikan hasil kerja Claude A tunggal terdahulu, jika ada, tidak ditimpa/duplikasi.
