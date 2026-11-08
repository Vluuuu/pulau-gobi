# EP006 — minimal verification record

**Catatan historis baseline 4037ea4.** Hasil revisi mayor terbaru ada di `EP006_REVISION_VALIDATION.md`; jangan menganggap hasil di bawah sebagai pemeriksaan ulang revisi mayor.

Baseline `3759f2e`, branch `codex/ep006-production`.

| Pemeriksaan | Status |
| --- | --- |
| TypeScript project | FAIL_BASELINE: hanya `src/episode002/Villager.tsx(104,71) TS2740`; tidak ada error EP006 pada hasil terakhir |
| Satu grup `test/ep006-production.test.mjs` | PASS 10/10 secara gabungan: 9 lulus pada grup awal, 1 lulus setelah perbaikan endpoint; hanya tes gagal yang diulang |
| PCM cerita 0..108,8666667 s | PASS pada persiapan aset: 4.801.020 sampel cerita direjoin identik dengan decoded source |
| Identitas | Tujuh username murid + Ghanim + Velora + tiga nama sapi dibaca dari screenshot; capiwasa dikonfirmasi pemilik |
| Build / kamera audit / browser automation | NOT-RUN sesuai batas proses |
| Preview / still / screenshot / MP4 | NOT-RUN sesuai instruksi; tidak ada visual otomatis |
| Listening, loudness dan review audiovisual manusia | NOT-RUN / menunggu pemilik |
| Push / merge | NOT-RUN |

Input master memuat CTA: whole-phrase replacement memakai tail EP004 penuh; file MP3 asli tidak dimodifikasi. Caption bersifat estimasi mesin. Jumlah calon warga resmi tetap tidak diketahui; angka 361 hanya dipertahankan sebagai ucapan dari input.

## Command yang benar-benar dijalankan

1. `.\node_modules\.bin\tsc.cmd --noEmit --pretty false` — sekali pada akhir implementasi. Menemukan baseline TS2740 dan dua anotasi tuple rute EP006 (`direction.ts`), lalu anotasi diperbaiki.
2. `node --test --experimental-strip-types test\ep006-production.test.mjs` — satu grup, 9 PASS / 1 FAIL. Tes endpoint kursi memakai kesamaan tuple persis; integrator mengembalikan `-22.200000000000003` vs endpoint `-22.2`. Fungsi rute diperbaiki agar mengembalikan waypoint asli pada awal/akhir.
3. Pengulangan **hanya pemeriksaan gagal setelah perbaikan**: typecheck yang sama menghasilkan **hanya baseline TS2740**; `node --test --experimental-strip-types --test-name-pattern="physical entry" test\ep006-production.test.mjs` menghasilkan **1/1 PASS**. Tidak mengulang sembilan tes yang sudah lulus.

Warning `MODULE_TYPELESS_PACKAGE_JSON` dari Node adalah warning metadata modul yang sudah ada, bukan kegagalan tes; package/lockfile tidak diubah.

## Cakupan tes

Identitas/uniknya roster, snapshot immutable dan profil warga/placement lama, urutan portal World Polish dan delapan kursi aktual, centreline/jadwal jembatan, retensi ID tanaman dan clearance batang di sekolah/jalur, kesinambungan river/waterfall, lintasan ikan yang kontinu dan momen Ghanim terciprat, cakupan timeline 38 beat dan tail EP004 utuh, hash/sample PCM cerita beserta silence insert, serta diff sumber/aset episode lama terhadap `3759f2e`.

Durasi **4571 frame / 152,366667 detik**. Outro asli **165 frame / 5,5 detik**, termasuk hold 24 frame. Status: **SOURCE_READY_FOR_OWNER_REVIEW**, bukan persetujuan audiovisual/final render. Catatan kontinuitas jembatan rekonstruksi dan data 361 tetap terbuka untuk pemilik.
