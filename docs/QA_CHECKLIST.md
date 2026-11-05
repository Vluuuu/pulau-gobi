# QA Checklist — Pulau Gobi

## Teknis
- [ ] npm install atau npm ci sukses, lockfile valid
- [ ] lint/typecheck/unit test PASS
- [ ] state transition dan snapshot deterministic PASS
- [ ] semua komposisi Remotion terdaftar, durasi audio/frame benar
- [ ] aset audio/font/model resolved; tidak ada missing asset
- [ ] render lokal smoke-test berhasil, lalu final render jika siap

## Visual
- [ ] kamera memuat subjek penting di frame 9:16
- [ ] Gobi tidak berubah proporsi, warna, desain, atau skala
- [ ] animasi tubuh natural sesuai narasi
- [ ] bukan scene hampir statis > beberapa detik tanpa tujuan cerita
- [ ] objek baru tidak menembus rumah, Gobi, tanah atau objek lain
- [ ] lighting directional, cast shadows, contact shadow dan ambient jelas
- [ ] background/terrain/props koheren di semua scene
- [ ] objek lama dan penduduk lama tetap ada sesudah episode
- [ ] subtitle terbaca dan tidak overlap dengan Gobi/objek
- [ ] hook dan CTA rapi, tidak dipotong oleh crop platform

## Audio/editorial
- [ ] VO Indonesia pas dengan timing dan tidak putus
- [ ] BGM/SFX tidak menutup VO
- [ ] CTA di akhir tepat sama
- [ ] cerita memberi payoff serta alasan berkomentar
- [ ] kalau menampilkan komentar asli, sensitif/privasi dicek

## Pelaporan
- [ ] tangkapan frame penting sudah ditinjau
- [ ] status yang belum diuji dijelaskan apa adanya
- [ ] changelog, dokumentasi, snapshot, commit mengikuti hasil
