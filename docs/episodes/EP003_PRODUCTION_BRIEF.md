> **UPDATE 2026-11-06:** Claude A dipecah menjadi **A1 (terrain/layout), A2 (river), A3 (house), A4 (warteg)**. B mengintegrasikan `world/index.ts`. Lihat [`docs/tasks/ep003/CLAUDE_A_SPLIT.md`](../tasks/ep003/CLAUDE_A_SPLIT.md). Sesi Claude memakai ZIP scoped lokal tanpa GitHub. Empat modul baru belum diuji/render.

# PULAU GOBI — EP003 PRODUCTION BRIEF (Handoff V1)
**Tanggal:** 2026-11-06  
**Tahap:** pra-implementasi → siap distribusi modul Claude; user sudah menyetujui konsep/naskah/cast.  
**Jangan klaim EP003 sudah diimplementasi atau visualnya telah diuji.**

## 1. Source, audio, dan output
- Source dasar: https://github.com/Vluuuu/pulau-gobi branch `main`, baca commit HEAD terbaru; **baseline ter-render** tag `ep002-v4-approved` / commit `a200877e02056c1f4f4caa24eea9505a118739fd`.
- EP003 VO user: file `eps 3.mp3`, durasi **99.552625 detik**, MP3 mono 44.1 kHz, SHA-256 `d68cce970725cceb63a2c8ac91b856f4b3f9baddcef09eef53ec3ec9fd2d1283`. File ada dalam **asset handoff lokal**, **belum di-GitHub**.
- Rencana komposisi: `Episode003`, 1080×1920, 30 FPS, **3.000 frames** = 100.000 detik. Sisanya ~0,447 s setelah audio untuk visual hold/outro; ubah hanya jika akhir VO ternyata butuh ruang lain.
- Subtitle: Bahasa Indonesia, highlight kata/frasa aktif. ElevenLabs MP3 sudah final; alignment kata/detail shot harus dilakukan Claude C berdasarkan audio asli.
- **Penting:** timecode storyboard V1 masih kasar, **bukan timestamp transkrip**; Claude C harus menyusun pemetaan VO yang disimak/ditranskripsi/di-align, tidak menyamakan estimasi dengan data audio.

## 2. Konsep dan alur yang disepakati
**Judul internal:** Pulaunya Makin Gede, Malah Disuruh Bayar Makan?!
1. Hook: Gobi frontal close-up, kaget bahwa follower gabungan IG 33 + TikTok 55 + YouTube 17 = **105 follower lintas platform**. Jangan mengklaim 105 akun unik atau 105 warga resmi. Kalimat VO masih menyebut 'seratusan'.
2. Klaster komentar: permintaan ekspansi pulau, sungai, rumah tambahan/bertingkat/kosan. **2–3 screenshot per layar**; jangan mengubah teks/atribusi screenshot asli.
3. **Pembesaran pulau cepat ~4–6 detik termasuk reveal**, bukan 20–40 detik. Target area jauh lebih luas; **radius 35–40 unit masih rentang desain, belum satu angka final**. Gunakan nilai parametrik/tuning sementara, misal 38, dan jaga skala karakter serta objek lama.
4. **Sungai pertama** dibangun close-up: tanah/tepi terbentuk, aliran air, riak; tidak memotong sawah/rumah/warga lama. Jangan mengklaim air langsung aman diminum.
5. **Rumah kayu pertama dinaikkan jadi dua lantai** (renovasi), bukan bangunan lama hilang lalu diganti tanpa alasan/animasi.
6. Komentar `shifalina_` ditampilkan **utuh**: rumah tingkat + permintaan warteg/restoran + tawaran sendiri menjadi penjual.
7. **Warteg pertama** dibangun close-up; bangunan lengkap dengan etalase dan stok awal terbatas (pasokan makanan belum berkelanjutan).
8. `shifalina_` muncul sebagai **Warga Spesial dan penjaga warteg** dengan model NPC 3D; papan nama ±2–3 detik.
9. Payoff utama: Gobi memesan makanan, `shifalina_` meminta pembayaran lewat gestur, Gobi merogoh saku kosong, jeda komedi, close-up muka Gobi: **'LAH?! INI PULAU PUNYA GUE, TAPI GUE TETEP HARUS BAYAR?!'** Tidak perlu membangun ekonomi/uang sungguhan.
10. Gobi sadar stok makanan terbatas, sawah belum panen; komentar peternakan/perkebunan tampil sebagai **teaser EP004**, **jangan bangun peternakan/perkebunan atau kosan pada EP003**.
11. Gobi mengajak follow + komentar `Jadi Warga` (untuk peluang **dipilih**, tidak otomatis terdaftar), lalu outro wajib **persis**: **'Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!'**

## 3. Pemeran dan aturan warga
| ID/logika | Tampilan | Status & catatan |
|---|---|---|
| `gobi` | Protagonis | Warna dan desain lama tetap |
| Dua warga lama | `oktaa.blushh`; `Afriza SuperStore` | Warga Spesial Angkatan Pertama; tidak boleh hilang dari world state |
| `shifalina_` | NPC baru penjaga warteg | **Warga Spesial**; dua usulan (rumah tingkat + warteg) tetapi satu warga; aktif di counter |
| `damar_zan` | NPC baru sekitar area perluasan/sungai | **Warga Spesial**, karena usulannya tentang ekspansi/sungai diwujudkan di EP003 |
| `Eka Agustin` | NPC baru sekitar sungai/area tengah | **Warga Spesial**, karena usulan sungai diwujudkan di EP003 |
| `joy.__3.15` | NPC baru cameo dekat lahan kosong | **Warga Biasa terpilih secara editorial, status administratif perlu cek syarat follow + komentar**; ide kebun/peternakan belum dibangun, jadi belum otomatis spesial |

- Total **7 karakter** di dunia termasuk Gobi setelah EP003 (2 lama + 4 baru + Gobi).
- Keputusan pemilik: empat warga baru **semuanya** harus punya model 3D; warga lama tetap ada. Jangan membuat hanya name tag tanpa model.
- Nama di atas kepala **tidak permanen**, 2–3 detik saat intro/fokus kamera, kemudian fade. Tampilkan karakter seperlunya dalam close-up agar adegan tidak sesak.
- **105** = jumlah follower lintas platform per info pemilik (33+55+17), bukan jumlah identitas unik atau 105 NPC yang harus dibuat.
- **Konsistensi aturan:** follow + komentar `Jadi Warga` = calon warga, kreator memilih sebagian; komentar yang idenya diwujudkan = warga spesial. Verifikasi follow tidak boleh diklaim otomatis.
- Untuk identitas `joy.__3.15`, jika belum dapat mengonfirmasi kepatuhan pendaftaran, pertahankan model/cameo sesuai pilihan kreator tetapi tandai `registrationVerification: 'pending'` dalam data, bukan data verifikasi palsu.

## 4. Aset dan komentar asli
- Media dikemas terpisah dari source GitHub dalam `EP003_MEDIA_ASSETS.zip`. `eps 3.mp3` dan screenshot **jangan diubah/ditimpa**; salin file untuk dipakai B/C.
- Screenshot set terbaru: `image(8).png`, `image(9).png`, `image(10).png`, `image(20261106-140157).png`; screenshot pendukung lebih awal: `image(2).png` … `image(7).png`. Beberapa merupakan pengambilan berulang komentar yang sama.
- Grouping: ekspansi/sungai + hunian; `shifalina_` full sendiri; peternakan/perkebunan sebagai teaser. Cocokkan username dan isi secara visual sebelum memasang; **jangan mengarang screenshot**.
- Kutipan komentar ditampilkan dengan pemotongan/crop yang tetap menjaga identitas dan konteks. Sembunyikan data tak relevan jika ada.

## 5. Timeline arahan (sementara sampai Claude C memetakan VO)
| Beat | Rentang KASAR | Jenis shot / fokus |
|---|---|---|
| 1 Hook | 0–7 s | Gobi front close-up, angka total 105, satu rumah |
| 2 Komentar | 7–23 s | OTS + grouping screenshot (maks 2–3 per layar) |
| 3 Perluasan | 23–29 s | wide isometric build/reveal cepat; Gobi reaction |
| 4 Sungai | 29–37 s | detail sungai, aliran air, kamera tracking |
| 5 Rumah 2 lantai | 37–47 s | close-up renovasi rumah **lama** |
| 6 Spotlight shifalina | 47–57 s | komentar original full + reaction |
| 7 Warteg | 57–68 s | close-up fase konstruksi |
| 8 Shifalina intro | 68–75 s | medium counter, NPC tampil + label 2–3 s |
| 9 Komedi bayar | 75–85 s | two-shot → saku kosong → front close-up |
| 10 Stok dan teaser | 85–92 s | warteg/sawah dan komentar peternakan/perkebunan |
| 11 Warga CTA + outro | 92–100 s | 7 karakter tercatat, beberapa cameo dalam reveal, Gobi bicara dan outro |

**Timecode bukan alignment audio**. Claude B menggunakan timing yang disahkan Claude C dari MP3 nyata, tetap jaga ekspansi 4–6 s saat narasi mengizinkan.

## 6. Kontrak kepemilikan file & dependensi
| Pemilik | Folder eksklusif | Kontrak ekspor / pemakaian |
|---|---|---|
| **Claude A — World** | `src/episode003/world/**` | Menyediakan geometry pulau baru, sungai, rumah dua lantai, warteg, layout titik dunia. Export bersih lewat `world/index.ts`; jangan edit `src/episode002/**`. |
| **Claude E — Data** | `src/episode003/state/**` | Roster dan stable ID, referensi warga EP002, atribut baru + world state draft; UI/NPC mesh bukan milik E. |
| **Claude D — Characters** | `src/episode003/characters/**` | Visual NPC 3D dan reusable acting; konsumsi data dari kontrak E (jangan mengedit roster E). |
| **Claude F — Camera** | `src/episode003/camera/**` | Reusable camera presets dan lighting, konsumsi titik fokus dari kontrak A, expose shot parameter ke B. |
| **Claude C — Captions** | `src/episode003/audio/**`, `src/episode003/captions/**` | Align VO yang sebenarnya, subtitle Indonesia dan SFX; jangan edit timeline scene B. |
| **Claude B — Director** | `src/Episode003Scene.tsx`, `src/Root.tsx`, `package.json` (script bila perlu), `src/episode003/direction/**` | Integrasi semua modul, scene/VO/timing/komentar dan visual polish. Jangan menulis ulang modul A/C/D/E/F. |

- Tes baru masing-masing role di `test/ep003-<role>-*.test.mjs`, tanpa dua role menulis file yang sama.
- **A** memutuskan titik world/layout sementara dan mengirim kontrak koordinat ke **F** dan **B**. **E** mengunci ID dan status warga lalu **D** konsumsinya. **C** menghasilkan timing yang dapat dipakai **B**. **B** terakhir mengedit komposisi/timeline.
- Progres kerja paralel boleh selama file ownership disiplin; jangan minta B memulai scene integrasi saat kontrak belum tersedia.
- B tetap mengimpor model lama dengan backward compatibility; bukan rewrite Gobi atau Episode 002.

## 7. Acceptance checklist
- EP001/002 tetap bekerja dan source tidak berubah.
- EP003 berdurasi cukup untuk **MP3 99.552625 s**, output 1080×1920 30 FPS.
- Follower stat 105 benar sebagai agregat akun (bukan 105 warga unik).
- Screenshot komentar nyata muncul pada momen yang terkait; `shifalina_` tampil utuh.
- Ekspansi pulau cepat, **semua properti EP002 masih ada**; batu tidak melayang/clipping; rumah lama benar-benar jadi bertingkat.
- Close-up Gobi ketika dialog; object detail close-up untuk sungai, rumah, warteg; wide shot untuk reveal.
- Warteg ada stok awal terbatas, `shifalina_` di belakang counter, gesture minta bayar, Gobi merogoh saku dan reaksinya terbaca.
- 4 warga baru benar-benar tampil sebagai model 3D; 2 warga lama masih ada di dunia; label tidak menumpuk subtitle.
- Sawah tetap belum panen, peternakan/perkebunan **belum dibangun** tetapi komentarnya ditampilkan sebagai teaser.
- Caption VO sinkron, safe area, sound design tidak menenggelamkan VO, outro wajib tepat.
- Tes code PASS dan pemeriksaan visual Windows dilakukan; jangan klaim render lulus sebelum pengguna merender.

## 8. Urutan kerja yang efisien
1. Owner membagikan **MP3 + screenshot** hanya kepada role yang memerlukan. A/F bisa mulai dari GitHub + brief, E perlu komentar/roster, D perlu screenshot identitas; C/B butuh MP3.
2. A dan E membuat kontrak/world layout + roster. F dan D dapat berjalan paralel berdasarkan kontrak mereka; C menyiapkan subtitle/timing MP3.
3. Integrasikan patch A/C/D/E/F dengan audit import Windows. Setelah modul tersedia, B menyusun scene dan menghubungkan semuanya.
4. Tes numerik/typecheck, lalu user preview dan render Windows. ChatGPT melakukan review visual aktual; setelah approved, commit kode dan snapshot final.

## 9. Batas status
**Yang sudah:** EP001/EP002 source approved, naskah/storyboard EP003, VO MP3 final dari owner, 10 screenshot komentar yang diserahkan, cast baru diputuskan.  
**Yang belum:** EP003 source, shader/assets baru, exact caption alignment, render, evaluasi skala akhir, verifikasi teknis follower dan status registrasi Joy, world snapshot final.
