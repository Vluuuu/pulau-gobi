# EP006 major revision — minimal verification

Baseline **4037ea4**, branch **codex/ep006-production**.

| Pemeriksaan | Hasil |
| --- | --- |
| TypeScript project, satu final pass | FAIL_BASELINE: hanya `src/episode002/Villager.tsx(104,71) TS2740`; tidak ada error baru EP006 |
| Grup tes terarah EP006, satu final pass | PASS 16/16 gabungan: 15 lulus pada grup awal; hanya satu tes gagal yang diulang sesudah perbaikan, lalu 1/1 lulus |
| PCM cerita dari master | PASS saat persiapan: 4.801.020 sampel cerita direjoin identik, speed 1 |
| Canonical VO19 | Input MP3 tidak diubah; SHA `f3b527f7a51c4c94d45e0b45d22da8a712e104eda49dfea58c3decb7a3fe3e07`; dipakai lengkap sekali |
| RMS aktif cerita/outro setelah gain | 0.104176 / 0.104175; sample peak outro 0.47889. Bukan LUFS atau true-peak |
| Render / still / screenshot / preview / browser automation / camera sweep | NOT-RUN, sesuai permintaan |
| Build / ASR ulang / install dependency | NOT-RUN |
| Listening dan persetujuan visual pemilik | NOT-RUN / PENDING OWNER REVIEW |
| Push / merge | NOT-RUN |

Pemeriksaan hanya memvalidasi source/domain/audio metadata; tidak mengklaim kualitas visual disetujui. Error baseline `src/episode002/Villager.tsx:104 TS2740` dicatat terpisah bila masih ada.

## Eksekusi aktual

1. `.\node_modules\.bin\tsc.cmd --noEmit --pretty false` — satu kali, hanya error baseline di atas. Tidak diulang karena tidak ada error TypeScript terkait patch.
2. `node --test --experimental-strip-types test\ep006-production.test.mjs` — satu grup, 16 kasus: 15 PASS / 1 FAIL. Variasi siklus aktivitas sempat mengganti aksi murid `raise` menjadi `watch` pada waktu yang diperiksa. Source diperbaiki agar aktivitas tersebut dipertahankan dan event angkat tangan berada pada jendela reverse kelas.
3. `node --test --experimental-strip-types --test-name-pattern="stance travel" test\ep006-production.test.mjs` — hanya kasus gagal, **1/1 PASS**. Lima belas kasus lain tidak diulang.

Cakupan: identitas/retensi state lama; portal dan delapan kursi aktual; satu jembatan; retensi tanaman; koneksi waterfall; forecourt dua rank dengan jarak sungai; kamera kelas berada di ruang fisik serta shell utuh; two-bone IK tanpa perubahan panjang; stance phase dan perbedaan kegiatan; bay observasi; splash/droplet/reaksi/cue pada satu urutan; PCM cerita; caption CTA resmi dan checksum audio; level RMS serta scene EP006 yang kontinu melewati outro. Tidak menjalankan tes kamera per shot atau camera audit massal. Warning Node `MODULE_TYPELESS_PACKAGE_JSON` tetap merupakan warning metadata, bukan kegagalan.

Source disiapkan untuk **OWNER REVIEW**, durasi **4649 frame / 154,966667 detik**. Tidak ada preview/render/loudness approval manusia pada sesi ini.
