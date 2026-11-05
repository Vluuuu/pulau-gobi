# Workflow Produksi & Sinkronisasi GitHub

## Peran
- **ChatGPT:** creative strategy, storyboard, scripts, episode brief, review video, prompt untuk Claude, pemeliharaan dokumen.
- **ElevenLabs:** VO narasi Indonesia dan satu outro tetap. Boleh alat TTS lain bila kualitas lebih cocok.
- **Claude Browser:** membaca repo melalui GitHub integration/attachment, menulis dan merevisi source, memberikan ZIP/patch + manifest; jangan mengklaim skill CLI terpasang otomatis.
- **Windows laptop:** npm install, preview, running QA, render MP4 dan Git commit/push.
- **GitHub private:** sumber kebenaran teknis; snapshot tiap episode dan dokumentasi.

## Inisialisasi satu kali
1. Buat repo private `pulau-gobi` kosong di GitHub (jangan centang inisialisasi README bila akan push starter kit ini).
2. Ekstrak isi starter ZIP ke folder lokal `pulau-gobi`.
3. `git init`, `git add .`, `git commit -m "docs: initialize Pulau Gobi production bible"`, `git branch -M main`, `git remote add origin https://github.com/USERNAME/pulau-gobi.git`, `git push -u origin main`.
4. Hubungkan private repo dalam Claude Project melalui Project Knowledge → GitHub dan pilih README, CLAUDE.md, docs; klik Sync setelah push. Integrasi membantu baca konteks, bukan janji write access.
5. Di Project ChatGPT, masukkan isi `PROJECT_INSTRUCTIONS_CHATGPT.md` melalui menu ••• → Project settings → Instructions.

## Untuk episode baru
1. Dalam ChatGPT: pilih ide komentar, pastikan world state terakhir benar; buat naskah + storyboard + kebutuhan Gobi.
2. Siapkan MP3 ElevenLabs narasi Indonesia dan outro tetap; transkrip/timestamp jika ada.
3. Susun brief sesuai `EPISODE_BRIEF_TEMPLATE.md` dengan referensi episode/snapshot terakhir.
4. Di Claude Browser: sync GitHub, attach brief+VO, prompt **berubah seminimal mungkin**; minta source code ZIP lengkap/patch, changed-file manifest, instruksi penerapan ke clone lokal, QA transparan.
5. Di laptop: di branch kerja baru (`git checkout -b feat/epNNN`), salin hanya perubahan yang relevan, `npm install` bila lockfile berubah, jalankan checks dan Remotion Studio. Bandingkan hasil dengan sebelum.
6. Periksa subtitle, framing kamera, reaksi Gobi, kontinuitas terrain, detail visual, dan render smoke test lokal. Kembalikan umpan balik ke Claude bila perlu.
7. Setelah PASS, commit dengan pesan jelas, push branch, merge ke main setelah review, lalu sync Claude Project.
8. Render dan upload ke media sosial. Catat metrik sesudah rilis untuk evaluasi strategi.

## Aturan perubahan file
- Lebih baik **patch/diff** dari source existing daripada full regenerate.
- Jika Claude memberi ZIP penuh, jangan blind overwrite; bandingkan dengan `git diff` dan file manifest.
- Jangan menghapus perubahan user yang baru dibuat di lokal.
- `.env`, token API ElevenLabs, cache, node_modules, MP4 final, dan file sementara jangan dimasukkan ke Git.
- Buka issue untuk bug dan ide besar; satu PR/branch per tugas.

## Naming
`ep001`, `ep002`; `feat/ep002-house`; `fix/gobi-walk`; `assets/dragon-v1`; `out/ep001-final.mp4` (ignored). VO `public/audio/ep001-vo.mp3`, outro `public/audio/shared-outro.mp3` bila hak pakai aman.
