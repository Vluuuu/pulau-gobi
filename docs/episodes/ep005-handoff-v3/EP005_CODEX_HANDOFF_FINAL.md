# Brief implementasi Codex — Pulau Gobi EP005 (Director V3)

## Tujuan
Lanjutkan source **EP004 FULL lokal pada commit `76ee0c8`** menjadi komposisi `Episode005` (1080×1920, 30 FPS). Implementasikan storyboard Director V3, bukan storyboard V2. Handoff kamera sudah tertulis; tidak perlu menunggu sesi Claude F karena kuota pengguna habis. Jangan klaim kamera sudah QA sampai preview dilakukan.

## Gate source: P0 sebelum perubahan apa pun
1. Verifikasi source kerja memuat `76ee0c8` atau keturunannya dengan semua aset EP004 dan snapshot `after-ep004` yang benar. `main` GitHub saat handoff ini masih EP002. `codex/ep004-full-20261107` **tidak ditemukan di remote**.
2. Bila source EP004 tidak ada di workspace, **jangan bangun EP005 dari main/EP002 atau file contoh**. Laporkan bahwa source lokal EP004 perlu disediakan/di-push oleh pemilik; hentikan perubahan sampai source tersedia.
3. Bila ada, buat branch EP005 dari source EP004 full; jangan ubah source episode sebelumnya secara destruktif.

## Prioritas cerita dan dunia (semua disetujui)
- Hook kronologis: sungai berhenti, pertanian belum panen, kandang kosong. Belum ada sekolah/sapi di awal.
- Kanal lanjut dari ujung sungai lama sampai bibir pulau; air terjun melayang dengan pita air, busa, spray, kabut, roar dan reveal besar. Jembatan jika ada persilangan jalur nyata, bukan dekor asal.
- `guapusingnjir`: Warga Spesial baru, karakter original fantasi trickster hijau-emas; tampil fisik pertama kali pada S08b (sesudah waterfall reveal) sesuai V3, beri satu gestur air/kilau hijau-emas + gust jubah saat intro supaya perannya terasa hidup, tanpa berpura-pura ia muncul di shot sebelumnya. Jangan menyalin Loki, siluet helm atau kostum resmi.
- `RIS_26`: Warga Biasa baru, tampil S09a; bukan murid sekolah.
- Padi lama EP002 matang lalu dipanen (tunggul, berkas); lahan pertanian EP004 diisi jagung dan wortel **hanya tumbuh/tunas, tidak dipanen**; payoff stok warteg Shifalina.
- 3 sapi dengan ID stabil dan tingkah beda, cow-003 yang penasaran menanggapi suara lonceng, mendorong gerbang, berjalan nyata sampai kelas, dituntun Xyree pulang; moo SFX sapi asli terpisah dari imitasi VO Gobi.
- Sekolah untuk Damia (Warga Spesial dan guru pertama), penempatan terpisah namun terhubung jalur; delapan meja dan papan tulis; belum ada murid resmi. RIS dan Joy cuma melihat kelas. Dua bubble NPC yang disetujui: 'Bang, muridnya mana?' dan 'Bang... ini murid baru?'.
- Seluruh warga dan struktur EP001–EP004 dipertahankan di roster/dunia. Jangan mengklaim calon warga otomatis diterima, atau calon murid otomatis menjadi siswa.
- Outro visual+audio existing EP004 dipakai **persis**, tanpa generate baru.

## Audio/timeline — jangan mengarang kepastian
- Master VO v4 **135,1575 dtk**. Klip 10 bagian adalah kandidat hasil potong di hening; MASTER adalah sumber sebenarnya, jangan memotong dialog atau mempercepat suara.
- Plan A Claude B: tambahan jeda 36,5 dtk = **171,6575 dtk sebelum outro**. Durasi outro EP004 belum diukur. Ukur dulu dari source dan pilih blok jeda yang muat.
- TARGET KERAS untuk versi YouTube Shorts: video **maksimum 180,0 dtk termasuk semua outro**, ideal <=179,5 dtk untuk margin. Anggapan '182 dtk masih sekitar 3 menit' TIDAK diterima sebagai versi Shorts. Bila tak bisa, ringkas blok jeda menurut tangga V3, bukan memotong dialog; jika tetap gagal, laporkan kebutuhan versi lebih panjang, jangan diam-diam melebihi batas.
- Dengarkan secara manual sebelum kunci timeline: master 41,65–42,05 (split panen/tanam); 88,11–88,50 (tahan komedi); **93,10 dan bunyi 93,34–93,60** (mungkin awal 'LAH?!'); 99,70; sekitar 110,4; serta 9 batas chapter. Identitas bunyi 93,34–93,60 **belum terbukti**.
- Gunakan word-level captions bila forced alignment tersedia; jangan klaim akurat tanpa pemeriksaan. Fallback phrase-level sesuai V3 dengan label provisional.
- Render animasi deterministik berdasarkan frame; jangan sisip jeda dengan menambahkan hening ke akhir master tanpa mengubah offset caption/shot.

## Kamera dan acting (anti-occlusion P0)
- Ikuti semua 36 shot (beberapa ber-subshot) pada storyboard V3; `EP005_CLAUDE_F_HANDOFF.md` sebagai spesifikasi kamera yang harus dikalibrasi terhadap world state aktual.
- Sebelum shot dialog dikunci, periksa occlusion pada awal, 25%, 50%, 75%, akhir, dan beat emfasis: kepala/wajah Gobi >=95% terlihat, tangan gestur >=90%. Prioritaskan re-staging, azimut, elevasi, focal framing, jenis shot; fade SATU pohon sementara adalah langkah terakhir yang dicatat. Jangan menghapus/memindahkan dekor lama.
- Shot konstruksi statis, objek utuh; shot dialog full-body atau 3/4 yang memperlihatkan ekspresi, tangan dan gestur, bukan selalu dari atas. Reveals air terjun, sekolah dan mirror shot S32 harus terbaca. Pertahankan ruang subtitle dan 2–3 dtk name tags intro; maks 3 name tags simultan, bukan tag permanen.
- NPC bergerak karena perubahan posisi nyata dan tindakan bermakna. Sapi kunyah, kedip, telinga, ekor, badan/head turn, hidung kait dan langkah nyata; hindari clipping pintu, pagar, hewan. SFX air, moo, langkah, dentang, konstruksi harus benar-benar terdengar.

## QA hemat
- Cukup targeted tests yang ada + build/smoke check seperlunya. Jangan menghabiskan waktu pada mass stills, semua typechecks berulang, atau render MP4 lengkap di Codex; user render lokal Windows.
- Pada EP004 sebelumnya ada error baseline `TS2740` Episode002/Villager.tsx:104; laporkan sebagai baseline **hanya jika masih sama dan terbukti**, dan jangan memperkenalkan error baru.
- Uji beberapa spot dialog pohon padat, view full island-air terjun, konstruksi sekolah, sapi masuk pintu, subtitle+tag, reveal, serta shot mirror. Laporan hasil nyata PASS/FAIL/NOT RUN, bukan klaim generik.
- Output akhir: branch, commit, composition, durasi total termasuk outro, daftar source terpakai, 1–2 file still diagnostik bila diperlukan, instruksi `npm run dev`, catatan mana yang belum di-preview.
- Jangan push/merge ke main sebelum approval.

## Konflik / prioritas sumber
1. Naskah dan VO master v4 milik pemilik
2. Storyboard Director V3
3. Director Notes dan Handoff Claude F
4. World state/source EP004 nyata (untuk koordinat, aset, ID); bila tidak sesuai dengan V3, pertahankan kontinuitas dan laporkan revisi staging tanpa mengubah naskah
5. Storyboard V2 hanya referensi sejarah, tidak menimpa V3
