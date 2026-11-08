# PULAU GOBI EP006 — Mulai dari sini (Handoff Source)

## Tujuan
Implementasi source Episode006 berdasarkan storyboard director 38 shot dan MP3 master. **Jangan lakukan render, screenshot, still frame, preview export, video output, browser automation, atau camera-audit massal di sesi Codex ini.** User akan melihat hasil di Windows via World Viewer/Remotion Studio.

## Baca file berikut berurutan
1. `PULAU_GOBI_EP006_CODEX_HANDOFF_README.md` — instruksi prioritas dan batasan proses.
2. `PULAU_GOBI_EP006_STORYBOARD_TEKNIS_V1.md` — 38 shot / camera / blocking; timecode masih estimasi, bukan audio EDL final.
3. `audio/eps6.mp3` — VO asli 113,24 dtk; utuh tanpa speed-up/trim.
4. `comments/` — delapan screenshot 'Jadi Murid' + tiga ide terpilih (damar_zan, velora.nyxflare, Ghanim Miyaz).

## Source baseline lokal
`D:\pulau-gobi\world-viewer`, branch `codex/world-viewer`, commit `3759f2e`. Gunakan semua perbaikan sekolah pasca-EP005 dan komponen viewer/world source bersama, terutama `src/world/current.ts`. Cek git status dan ancestry lokal. Jangan mengambil baseline EP002 `main` remote atau asset kelas EP005 lama. Buat branch EP006 terpisah.

## Larangan komputasi panjang (tegas)
- **Nol render:** tidak render MP4, still PNG, Remotion still, screenshot otomatis, contact sheet, ataupun full preview.
- **Nol loop audit:** jangan mengulang `ep005-camera-audit`/`ep006-camera-audit` berkali-kali, per-shot Node probes, smoke browser berulang, ataupun tes massal.
- Tidak perlu `npm install` bila dependensi sudah tersedia; jangan menjalankan server terus-menerus.
- Setelah perubahan source selesai, maksimal satu pemeriksaan TypeScript dan satu grup tes terarah. Jika ada kesalahan baru, hanya ulang pemeriksaan yang gagal setelah diperbaiki. Catat error baseline `Villager.tsx:104 TS2740` terpisah.
- Tidak push/merge; tidak sentuh Episode001–005 yang dipublikasikan.

## Data wajib diverifikasi, jangan ditebak
- 8 username murid harus persis screenshot dan unik di roster.
- `damar_zan` adalah warga lama, bukan warga baru; nama cow dari komentar Velora harus persis yang tertera, bisa jadi cuma satu nama.
- `Ghanim Miyaz` adalah kepala sekolah pertama.
- Jumlah calon warga belum diberikan oleh user; jangan mengarang angka atau menyisipkan VO palsu.
- Cocokkan apakah MP3 final menyebut outro; bila ya jangan mendobel audio saat reuse outro EP004.

## Output Codex yang diinginkan
Satu commit hasil implementasi source EP006 di branch baru, file list, catatan data yang belum diverifikasi, EDL audio per kalimat/shot apabila dapat dipastikan, status tes minimal, dan perintah preview Windows yang bisa dijalankan oleh user. **Tidak ada file video/render dari Codex.**
