# PULAU GOBI — EP005 DIRECTOR NOTES

Pendamping `EP005_STORYBOARD_DIRECTOR_V3.md`. Isi: temuan pacing dan durasi, risiko visual per scene, audit kontinuitas, daftar validasi.
Label bukti sama dengan V3: **[T]** terukur · **[K]** kandidat dari hening terukur · **[S]** estimasi sutradara · **[V]** validasi saat implementasi.

---

## 1. Ringkasan

V2 sudah kuat: kronologi bersih, sebab-akibat sapi jelas, dan jeda SFX memang diminta. Tiga hal perlu diperbaiki sebelum implementasi.

1. **Jeda V2 tidak punya tempat di audio.** Master v4 adalah satu file kontinu. Antar-chapter tidak ada ruang kosong, jadi setiap jeda harus *disisipkan* di hening alami. Saya mengukur hening ini, dan **semua 9 batas chapter kandidat jatuh di dalam hening ≥ 0,34 dtk [T]**.
2. **Beberapa sebab muncul setelah akibat** (lonceng setelah suara sapi) **atau pengenalan terjadi dua kali** (guapusingnjir dan Damia tampil sebelum VO memperkenalkan mereka). V3 memperbaikinya.
3. **Anggaran 180 dtk sangat tipis** dan bergantung pada durasi outro yang belum diukur. Ada tangga trim yang tidak menyentuh VO.

---

## 2. Temuan pacing dan timing

| # | Temuan | Bukti | Penanganan di V3 |
|---|---|---|---|
| P1 | Chapter bersambung tanpa ruang kosong, sedangkan V2 butuh jeda 3–6 dtk. | Manifest: ch1…ch10 menyambung 0 → 135,1575 tanpa celah. | Sisip 8 blok pada hening alami (V3 §2.4). VO tidak dipercepat atau dipotong. |
| P2 | Jumlah jeda V2 bila dijumlah: **26–43 dtk** (S06, S07, S11, S12, S15, S20, S21, S26, S30; S27 tanpa angka). | Dihitung dari tabel V2. | Plan A 36,5 dtk. Sudah memasukkan CH-A (+1,0), dan G1 sengaja dipadatkan menjadi 9,5 dtk. |
| P3 | Dengan V2 apa adanya: 135,16 + 26…43 + outro ≈ **165–185 dtk**. | Aritmetika. | Rentang atas melewati 180 dtk. Karena itu Plan A + tangga trim. |
| P4 | Chapter 4 berisi dua kalimat dengan dua aksi besar (panen, tanam). V2 menaruh dua jeda tetapi satu chapter VO. | Satu hening 0,40 dtk di 41,65–42,05, dua segmen bicara 2,50 dan 3,23 dtk **[T/K]**. | Split di hening itu (D4). Panen dan tanam masing-masing punya blok sendiri. Fallback tanpa split tersedia. |
| P5 | Hening "TAPI MURIDNYA BELUM ADA?!" → "RIS sama Joy…" hanya **0,39 dtk** **[T]**. | silencedetect: 88,11–88,50. | Tahan komedi CH-A +1,0 dtk. |
| P6 | Ada bunyi 0,26 dtk di 93,34–93,60 di antara dua hening, tepat sebelum batas ch8/ch9 **[T]**. Identitasnya tidak diketahui. | silencedetect. | G5 disisipkan di 93,10 (D6). **Harus didengarkan.** |
| P7 | Kalimat panjang chapter 10 ("Sekarang air terjun udah ada, sawah udah dipanen, peternakan…, dan sekolah…") hanya punya dua hening internal terukur (±107,1 dan 108,46–108,75). Batas klausa ketiga/keempat tidak punya hening. | 104,95–112,22 [T/K]. | Empat insert S32, tiga titik potong terukur atau berdasar hening, satu estimasi (±0,4) yang harus didengarkan. |
| P8 | VO dimulai **frame 0** ("WOI!" 0,00–0,40) **[T]**. | Hening pertama baru di 0,40. | Tidak ada pre-roll. Sting SFX di frame 0. Frame pertama adalah Gobi sudah bergerak. |
| P9 | Hening tail akhir ch10 hanya 0,26 dtk **[T]** (134,89–135,16). | silencedetect. | Cut keras ke outro. Pastikan kartu "Jadi Warga" bersih sebelum outro. |

**Retensi di blok jeda.** G1 (9,5 dtk) jatuh di detik 23–33, saat tidak ada suara. Risiko penonton gulir ke atas. Mitigasi: gerak kamera tidak ada, tetapi **ada tiga micro-beat visual** (Gobi menggiring air, jembatan tersusun, air menyentuh rim) dan SFX berlapis. Jangan memperpanjang G1.

---

## 3. Kelayakan target < 180 dtk

- VO: **135,1575 dtk [T]**. Plan A blok jeda: **36,5 dtk [S]**. Subtotal: **171,66 dtk**.
- Outro: **tidak diketahui [V]**. Contact sheet EP004 memperlihatkan teks outro sejak sekitar 139,5 dtk dan video masih berjalan di 142,5 dtk, jadi perkiraan visual **±4–7 dtk**. Itu bukan pengukuran.

| Outro | Total Plan A | Catatan |
|---|---|---|
| 5 dtk | 176,7 | aman |
| 6,5 dtk | 178,2 | aman |
| 8 dtk | 179,7 | sangat tipis |
| 10 dtk | 181,7 | trim 1,7+ dtk dari tangga |

**Tangga trim** (nominal → min): G6 3,5→2,5 · G3 3,5→3,0 · G2a/G2b 3,5→3,0 masing-masing · G5 4,0→3,0 · G1 9,5→8,0 · G4 8,0→6,5 · CH-A tetap ≥ 0,8. Total minimum **29,8 dtk**, sehingga durasi turun ke **165,0 + outro**.

**Tidak boleh dikorbankan:** hold roar di akhir G1, urutan konstruksi sekolah, hening 0,3 dtk sebelum "LAH?!". Bila setelah trim masih > 180 dtk, **laporkan ke pemilik** dan jangan mempercepat VO atau memotong kalimat. Opsi yang masuk akal: terima "sekitar 3 menit" sebagai ≤ 182 dtk.

---

## 4. Register risiko visual

Severity: **T** tinggi · **S** sedang · **R** rendah. Pemilik: **F** = Claude F (kamera), **C** = Codex C (implementasi/audio), **P** = pemilik.

| # | Scene | Risiko | Sev | Mitigasi / fallback | Pemilik |
|---|---|---|---|---|---|
| R1 | Semua dialog | **Oklusi pohon.** Contact sheet EP004 menunjukkan Gobi di balik kanopi (±58,5 dtk), Xyree setengah tertutup (±64,5 dtk), dan pinus di depan Gobi di kost (±109,5 dtk). Penghijauan makin lebat di EP005. | T | Protokol anti-oklusi di handoff F. Staging di pad bersih lebih dulu, kamera belakangan. Transparansi pohon hanya pilihan terakhir dan dicatat. | F + C |
| R2 | Durasi | Outro belum diukur, anggaran tipis. | T | Tangga trim (§3). Ukur outro sebelum mengunci G-blok. | C |
| R3 | S07 reveal | Air terjun harus terbaca megah: pita jatuh ke bawah pulau dengan awan, bukan mesh air beku di tepi. Sudut samping-atas bisa menabrak bagian bawah pulau. | T | IR dari sumbu tangen rim, pita dua lapis, spray. Fallback: sedikit naikkan elevasi, geser kamera menjauh, kurangi detail latar. | F + C |
| R4 | S06 kanal | Rute tidak boleh menembus bangunan atau menimpa tanaman lama. Endpoint dan jarak ke rim belum terverifikasi. | T | Hitung dari data nyata. Bila route melewati rumah, pakai gag panik; bila tidak, gag dibuang. Jembatan hanya di persilangan jalur nyata. | C |
| R5 | G5/G6 | Sapi: jalan, trot, tail, telinga, hidung mengangkat kait, dorong pintu, berdiri diam, dituntun. Banyak animasi sekaligus. Clipping perut/ekor di pintu. | T | Prioritas: (1) berjalan + kepala/telinga, (2) kait, (3) dorong pintu, (4) tail/kunyah. Pintu besar. Sederhanakan "dorong" jadi pintu terbuka sendiri sedikit bila clipping. | C + F |
| R6 | S20/S21 sekolah | Konstruksi yang terlalu cepat atau tidak terbaca. Interior terhalang dinding. | S | 3QH tinggi statis. Tahap berurutan ≥ 0,4 dtk. Model wall-cut. Hindari kamera menembus dinding. | F + C |
| R7 | Rute kandang → sekolah | Jarak terlalu jauh (sapi terlalu lama) atau terlalu dekat (tak ada perjalanan). | S | Target 14–22 unit **[S, V]**. Geser lokasi sekolah, bukan percepat sapi atau VO. | C |
| R8 | Tag nama | Contact sheet EP004 memperlihatkan tag bertumpuk di shot lebar (±22,5–25,5, ±82,5–97,5 dtk). | S | Maks 3 tag aktif, LOD di IW/IR, tag tidak boleh di atas subtitle atau bubble. | F |
| R9 | Kartu komentar | Isi komentar tidak ada di paket. | S | Pemilik menyediakan screenshot. Kartu tidak dikarang. | P |
| R10 | CTA S34b/S35 | Kata "Jadi Murid" bisa terbaca sebagai pendaftaran otomatis. | S | Tulis "calon", format kartu EP004 ("Kreator memilih beberapa"). Tidak ada seragam atau badge murid. | F + C |
| R11 | guapusingnjir | Desain bisa meniru Loki. | S | Hijau-emas, jubah pendek, headpiece asimetris kecil, **tanpa tanduk**, tanpa palet atau siluet yang menyalin. | C |
| R12 | S05a Asgard | Bubble imajinasi bisa meniru estetika film. | R | Aula emas generik, atap runcing, air terjun. Tidak memakai desain khas. | C |
| R13 | S32c/S32d | Batas klausa ≈110,4 tidak punya hening. | R | Dengarkan. Geser ±0,4 dtk bila perlu. Tidak mempengaruhi cerita. | C |
| R14 | S28 | Bunyi 93,34–93,60 bisa "LAH". Bila salah menaruh G5, kata muncul sebelum sapi masuk. | S | Dengarkan dulu (§2). Pindahkan G5 bila perlu. | C |
| R15 | Radius pulau | Radius ±52 adalah usulan, **TUNING PROVISIONAL**. | S | Semua jarak dihitung dari data nyata. | C |
| R16 | Source | Branch EP004 tidak ada di remote. `main` masih baseline EP002. | S | Periksa `after-ep004` dan world state sebelum menulis kode. | C |
| R17 | Musik/SFX | Tidak ada aset SFX atau musik di paket. | R | Prosedural atau aset berlisensi. Jangan mengklaim aset tersedia. | C |
| R18 | Subtitle | Alignment word-level belum ada. | R | Fallback phrase-level dari jendela [K], lalu forced alignment. | C |

---

## 5. Audit kontinuitas

| Rantai | Status di V3 | Catatan |
|---|---|---|
| sungai lama → kanal → rim → air terjun | ✔ dirancang | endpoint nyata [V] |
| sawah lama → matang → panen | ✔ | S02a hijau, S10 pulsa emas, S11 tunggul |
| bedengan baru → jagung + wortel | ✔ | hanya bertunas, tidak dipanen |
| kandang lama → 3 sapi | ✔ | tiga ekor terhitung di S15, S31, S32c |
| sekolah baru → belum ada murid | ✔ | RIS dan Joy hanya melihat kelas; CTA memakai "calon" |
| lonceng → cow-003 keluar → masuk sekolah → Xyree mengantar pulang | ✔ diperbaiki | urutan sebab-akibat bersih (D5) |
| warga lama tetap ada | ✔ | semua 9 tampil minimal sekali (V3 §3) |
| outro EP004 reuse | ✔ | tidak dianimasi ulang |

---

## 6. Beat sheet komedi sekolah

Tujuan: satu lelucon yang berkembang, bukan beberapa lelucon terpisah.

| Beat | Waktu | Fungsi | Aturan |
|---|---|---|---|
| Setup | S23a (M 81,70–85,90) | Gobi menghitung: sekolah, guru, jari ketiga menggantung | statis, jangan memotong terlalu cepat |
| Punch 1 | S23b (M 86,36–88,11) | "TAPI MURIDNYA BELUM ADA?!" | squash-stretch penuh, kepala tidak terpotong |
| Hold | S23c (CH-A +1,0) | kursi kosong, angin, bubble Damia | **tidak ada VO, tidak ada musik keras** |
| Eskalasi | S24 → S24b | lonceng dibunyikan, sapi menoleh | pemirsa tahu sebabnya sebelum karakter tahu |
| Hening | G5 | derap makin dekat, gelas pensil bergetar | **0,3 dtk hening total sebelum "LAH?!"** |
| Punch 2 | S28 | "LAH?! ITU SAPI…" | sapi sudah di tengah kelas, mengunyah, tenang |
| Panggil | S29, S30a | "XYREEEEE!" → Xyree berlari | pemirsa melihat rute nyata |
| Tombol | S30b → S30c | "BUKAN BUAT SAPI!" → Damia deadpan: "Bang... ini murid baru?" | kontras amarah lawan datar |
| Penutup | S30d | sapi enggan meninggalkan papan tulis | satu sentuhan kecil, bukan lelucon baru |

**Jangan:** menambah lelucon kelima, menjelaskan sebab-akibat lewat teks, atau membuat RIS/Joy bereaksi terlalu besar dan mencuri fokus dari Gobi dan sapi.

---

## 7. Pelajaran dari contact sheet EP004

Dibaca dari `04_VISUAL_REFERENCE/contact_1.jpg` dan `contact_2.jpg` (interval 3 dtk, jadi hanya acuan kasar):
- Kartu komentar di bagian atas dengan avatar + username; subtitle di bawah dengan kata aktif berwarna kuning; kartu CTA "FOLLOW + KOMEN 'Jadi Warga'" sebelum outro; shot lebar pulau dengan penanda di kapling kosong untuk pertanyaan "kita harus isi apa". V3 memakai format yang sama.
- Banyak shot dialog dekat berformat Gobi di depan pintu atau dinding. Itu menimbulkan kesan statis. V3 lebih banyak memakai FB/TS dengan latar dunia dan mengalihkan tiap beat ke sudut baru.
- Tag nama menumpuk di shot lebar yang ramai. V3 membatasi tag.
- Panjang EP004 setidaknya 142,5 dtk. EP005 dengan Plan A sekitar 176–180 dtk, jadi **kira-kira 30–38 dtk lebih panjang** (perkiraan, karena panjang pasti EP004 belum diukur). Kenaikan itu hampir seluruhnya blok jeda: tuntutan produksi, bukan padding.

---

## 8. Keputusan yang saya ambil dan alternatifnya

| Keputusan | Alternatif bila pemilik tidak setuju |
|---|---|
| guapusingnjir dan Damia muncul fisik terlambat (D2, D3) | Kembalikan V2: guapusingnjir tampil di S04–S06 dan Damia di S18–S19. Biayanya, pengenalan VO jadi pengulangan. |
| Split ch4 (D4) | Satu blok jeda 7 dtk setelah ch4 penuh (panen lalu tanam berurutan tanpa VO di tengah). |
| CH-A +1,0 dtk (D7) | Hilangkan CH-A dan pindahkan bubble "Bang, muridnya mana?" ke G5 awal. Bubble akan lebih sulit terbaca. |
| Bubble NPC non-VO (D12, S23c) | Hapus dua bubble dan ganti dengan ekspresi saja. Kehilangan satu kalimat kunci komedi. |
| G1 dipadatkan 9,5 dtk | Perpanjang ke 11 dtk bila outro pendek. |

---

## 9. Yang tidak saya lakukan

Tidak mengubah dialog, tidak menyentuh audio atau menggeser kecepatan, tidak membuat ulang outro, tidak menulis kode, tidak merender. Tidak mengarang timestamp per kata. Tidak menyatakan koordinat atau ukuran source sebagai terverifikasi.
