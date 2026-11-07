# PULAU GOBI — EP005 STORYBOARD DIRECTOR V3

**Peran:** Episode Director (Claude B) · **Dasar:** naskah VO final V3, storyboard V2 (36 shot), master VO ElevenLabs v4 (135,1575 dtk), paket kontinuitas EP004.
**Status:** siap diimplementasikan setelah item validasi di bagian 8 selesai. Tidak ada kode, render, VO baru, atau outro baru dalam dokumen ini.
**Yang tidak diubah:** seluruh dialog VO, urutan kronologis, 10 chapter, roster, world state EP004, dan reuse outro EP004.

---

## 0. Cara membaca dokumen

Setiap angka waktu diberi label bukti supaya tidak ada timestamp yang tampak lebih pasti dari kenyataannya.

| Label | Arti |
|---|---|
| **[T]** | **Terukur** dengan ffprobe/ffmpeg pada master v4 (durasi, hening). Fakta. |
| **[K]** | **Kandidat.** Jendela kalimat diturunkan dari jeda hening terukur. Hening-nya fakta, pemetaan ke kalimat naskah adalah hipotesis (jumlah segmen cocok dengan jumlah kalimat). Belum forced alignment. |
| **[S]** | **Estimasi sutradara** (durasi hold, aksi, build). Bukan data audio. |
| **[V]** | **Validasi saat implementasi** (source lokal EP004 tidak ada di paket, koordinat/ukuran/aset belum terverifikasi). |

- **M** = waktu pada master v4 (detik). **G+x** = detik ke-x di dalam blok jeda tanpa VO. **E** = waktu pada timeline edit Plan A.
- Tidak ada timestamp per kata di dokumen ini. Yang ada: jendela kalimat [K] dan titik hening [T].
- Legenda kamera tetap dari V2: FB, TS, IM, 3QH, IW, IR, OTS, MS. Spesifikasi framing ada di `EP005_CLAUDE_F_HANDOFF.md`.
- Zona subtitle acuan EP004: sekitar y 1430–1680 pada 1080×1920 **[V]**. Kartu komentar EP004 berada di zona atas, sekitar y 120–280 (perkiraan dari contact sheet) **[V]**.

---

## 1. Keputusan sutradara dan perubahan V2 → V3

| # | Keputusan | Alasan |
|---|---|---|
| D1 | Semua jeda SFX disisipkan **pada hening alami**, tanpa mempercepat atau memotong VO. Total 8 blok sisipan (7 blok jeda + 1 tahan komedi). | Master adalah satu file kontinu. Antar-chapter tidak ada ruang kosong, jadi jeda V2 hanya bisa hidup bila disisipkan di titik hening. |
| D2 | **guapusingnjir tidak muncul fisik sebelum "Ini guapusingnjir…"** (S08b). Di S04–S07 hanya kartu komentar. | V2 menampilkan dia di S04–S07, padahal VO baru memperkenalkannya di chapter 3. Pengenalan jadi terasa basi. Kini air terjun selesai lalu *ta-da, ini pengusulnya*. |
| D3 | **Damia tidak muncul fisik sebelum sekolah jadi** (S22). Sebelumnya hanya kartu komentar (S18). | VO08: "Damia *sekarang* jadi guru pertama." Kedatangannya ke pintu sekolah menjadi payoff reveal. |
| D4 | Chapter 4 dipecah pada hening 41,65–42,05 **[T]** menjadi dua blok: panen dan tanam. Fallback bila ditolak: tidak dipecah, satu jeda 7 dtk setelah chapter 4. | V2 sudah mengizinkan split di hening alami. Hening itu hanya satu di chapter 4 dan memisahkan dua kalimat dengan jelas **[K]**. |
| D5 | **Lonceng dipindah ke S24**, dibunyikan Damia saat RIS dan Joy masuk kelas. Cutaway sapi S24b menunjukkan sapi mendengarnya. Lonceng di S21 hanya dipasang, tidak dibunyikan. | V2: sapi keluar (S26) setelah "suara dari luar" sudah terdengar. Akibat mendahului sebab. Kini lonceng → sapi menoleh → gerbang terangkat → sapi berjalan → pintu. |
| D6 | Jeda sapi-mendekat (G5) disisipkan di **M 93,10**, bukan di batas chapter 93,75. | Ada bunyi 0,26 dtk di 93,34–93,60 **[T]** yang identitasnya belum diketahui. Bila itu "LAH?!", ia harus jatuh *sesudah* jeda. Wajib didengarkan (bagian 8). |
| D7 | Tambah **tahan komedi CH-A (+1,0 dtk)** di hening 88,11–88,50 **[T]**, setelah "TAPI MURIDNYA BELUM ADA?!". | Hening aslinya hanya 0,39 dtk. Bubble dan kursi kosong tidak akan terbaca. Satu detik memberi punchline ruang bernapas, tanpa mengubah audio. |
| D8 | **Kait gerbang** diperlihatkan belum duduk (S15b), sapi mengangkatnya dengan hidung (S24b/S26), dan Xyree menariknya dua kali di S31. | Menggantikan "gerbang tidak tertutup rapat" yang abstrak di V2. Kesalahan jadi lelucon sapi pintar, bukan Xyree ceroboh. |
| D9 | **S32 memakai mirror shot** dari S01/S02/S10/S22a, kini dalam keadaan terpenuhi. | Menutup episode secara visual: pembuka menunjukkan kekurangan, penutup menunjukkan hasil. |
| D10 | **Padi lama berubah hijau → emas** di S10 (pulsa kematangan). Di S02 padi masih hijau. | VO04 "siap dipanen" butuh sebab visual. Pulsa juga momen satisfying pertama di pertanian. |
| D11 | **Payoff warteg (S13b):** hasil panen sampai ke Shifalina, rak yang tadinya tipis terisi. | VO05 "nggak perlu bingung cari makanan terus" butuh bukti. EP003 menyebut stok warteg awal terbatas **[V]**. |
| D12 | Komedi bubble kedua Damia ("Bang... ini murid baru?") dipindah ke blok G6, sesudah "BUKAN BUAT SAPI!". | Di dalam chapter 9 tidak ada hening cukup. Di G6 ia menjadi kalimat penutup lelucon. |
| D13 | **Bubble imajinasi "Asgard"** (S05a) dengan aula emas original dan air terjun. | VO02 menyebut Asgard. Beri gambar, tetapi desain original, bukan estetika film. |
| D14 | Interior sekolah memakai **model wall-cut**, pintu sekolah **sengaja besar** (cukup untuk sapi). | Interior terbaca tanpa kamera menembus dinding. Sapi masuk tanpa clipping. |

---

## 2. Timeline dan anggaran durasi

### 2.1 Fakta terukur [T]

| Ch | Master start–end | Durasi | Batas jatuh di dalam hening? |
|---|---|---|---|
| 1 | 0,00–11,22 | 11,22 | awal file; 10,96–11,53 ✔ |
| 2 | 11,22–23,55 | 12,33 | 23,31–23,81 ✔ |
| 3 | 23,55–38,92 | 15,37 | 38,71–39,16 ✔ |
| 4 | 38,92–45,49 | 6,57 | 45,28–45,72 ✔ |
| 5 | 45,49–56,60 | 11,11 | 56,37–56,77 ✔ |
| 6 | 56,60–67,67 | 11,07 | 67,39–67,96 ✔ |
| 7 | 67,67–76,60 | 8,93 | 76,41–76,80 ✔ |
| 8 | 76,60–93,75 | 17,15 | 93,56–93,90 ✔ (lihat D6) |
| 9 | 93,75–101,34 | 7,59 | 101,06–101,58 ✔ |
| 10 | 101,34–135,16 | 33,82 | akhir file |

Master: **135,1575 dtk** (ffprobe). Setiap batas chapter kandidat berada di dalam hening ≥ 0,34 dtk, jadi aman sebagai titik potong. Isi yang jatuh di sisi kiri atau kanan titik itu tetap perlu didengarkan.

### 2.2 Timeline Plan A (nominal)

VO utuh. Total sebelum outro = 135,16 + 36,5 = **171,66 dtk [T+S]**.

| Segmen | Sumber M | Waktu E (Plan A) | Durasi |
|---|---|---|---|
| Ch1 | 0,00–11,22 | 0,00–11,22 | 11,22 |
| Ch2 | 11,22–23,55 | 11,22–23,55 | 12,33 |
| **G1** sungai + air terjun | jeda | 23,55–33,05 | 9,50 |
| Ch3 | 23,55–38,92 | 33,05–48,42 | 15,37 |
| Ch4a | 38,92–41,85 | 48,42–51,35 | 2,93 |
| **G2a** panen | jeda | 51,35–54,85 | 3,50 |
| Ch4b | 41,85–45,49 | 54,85–58,49 | 3,64 |
| **G2b** tanam | jeda | 58,49–61,99 | 3,50 |
| Ch5 | 45,49–56,60 | 61,99–73,10 | 11,11 |
| **G3** sapi datang | jeda | 73,10–76,60 | 3,50 |
| Ch6 | 56,60–67,67 | 76,60–87,67 | 11,07 |
| Ch7 | 67,67–76,60 | 87,67–96,60 | 8,93 |
| **G4** bangun sekolah | jeda | 96,60–104,60 | 8,00 |
| Ch8a | 76,60–88,30 | 104,60–116,30 | 11,70 |
| **CH-A** tahan komedi | jeda | 116,30–117,30 | 1,00 |
| Ch8b | 88,30–93,10 | 117,30–122,10 | 4,80 |
| **G5** sapi mendekat | jeda | 122,10–126,10 | 4,00 |
| Ch9 | 93,10–101,34 | 126,10–134,34 | 8,24 |
| **G6** sapi digiring | jeda | 134,34–137,84 | 3,50 |
| Ch10 | 101,34–135,16 | 137,84–171,66 | 33,82 |
| **Outro EP004 (reuse)** | **durasi belum diukur** | 171,66 → ? | ? |

### 2.3 Anggaran < 180 dtk (jujur)

- Sisa untuk outro pada Plan A: 180 − 171,66 = **8,34 dtk**.
- Durasi outro **belum diketahui** (file source tidak ada di paket). Dari contact sheet EP004: kalimat outro terlihat sejak sekitar 139,5 dtk dan video masih berjalan di 142,5 dtk. Itu menunjukkan outro **sekitar 4–7 dtk [perkiraan visual, jarak sampel 3 dtk, bukan pengukuran]**. Angka itu hanya untuk perencanaan.
- Skenario (Plan A): outro 5 dtk → 176,7 · 6,5 dtk → 178,2 · 8 dtk → 179,7 · 10 dtk → 181,7.

**Tangga trim.** Bila total melewati 180, kurangi blok jeda mulai dari atas. VO tidak disentuh.

| Blok | Nominal | Min | Prioritas trim |
|---|---|---|---|
| G6 sapi digiring | 3,5 | 2,5 | 1 |
| G3 sapi datang | 3,5 | 3,0 | 2 |
| G2a / G2b | 3,5 / 3,5 | 3,0 / 3,0 | 3 |
| G5 sapi mendekat | 4,0 | 3,0 | 4 |
| G1 sungai + air terjun | 9,5 | 8,0 | 5 |
| G4 bangun sekolah | 8,0 | 6,5 | 6 |
| CH-A | 1,0 | 0,8 | jangan dikurangi lebih dari ini |
| **Total min** | | **29,8** | → 165,0 + outro |

**Yang tidak boleh dikorbankan:** reveal air terjun (+tahan roar), urutan konstruksi sekolah, jeda sebelum "LAH?!". **Opsi lain:** bila pemilik menerima "sekitar 3 menit" sebagai ≤ 182 dtk, ladder tidak perlu dipakai penuh. Keputusan akhir setelah outro diukur.

### 2.4 Titik sisip jeda

| Titik | Posisi master | Dasar | Risiko |
|---|---|---|---|
| G1 | 23,55 (tengah hening 23,31–23,81) | [T] | rendah |
| Split ch4 | 41,85 (tengah hening 41,65–42,05) | [T] | rendah; kalimat pemisah [K] |
| G2b | 45,49 | [T] | rendah |
| G3 | 56,60 | [T] | rendah |
| G4 | 76,60 | [T] | rendah |
| CH-A | 88,30 (tengah hening 88,11–88,50) | [T] | rendah |
| G5 | **93,10** (tengah hening 92,88–93,34) | [T] | **sedang**: identitas bunyi 93,34–93,60 |
| G6 | 101,34 | [T] | rendah |

---

## 3. Peta karakter dan kemunculan

Status mengikuti roster. Sistem tag/★ mengikuti implementasi EP004 apa adanya **[V]**. Tidak ada aturan tag baru.

| Karakter | Status | Pertama tampil fisik | Catatan |
|---|---|---|---|
| Gobi | protagonis | S01 | seluruh episode |
| guapusingnjir | Warga Spesial baru | **S08b** (setelah reveal) | S04–S07 hanya kartu komentar. Hijau-emas, jubah pendek, headpiece asimetris kecil. **Tanpa tanduk**, bukan salinan Loki. |
| RIS_26 | Warga Biasa terpilih | **S09a** (berjalan masuk) | bukan murid; tag tanpa ★ |
| DamiaInsyirah🫐🤍 | Warga Spesial, guru pertama | **S22a/S22b** | S18 hanya kartu komentar |
| joy.__3.15 | warga permanen, bukan Spesial | S24 | hanya melihat kelas |
| Fredrikz (fredrikz_24) | Spesial, petani | S02a | panen dan tanam |
| Xyree | Spesial, penjaga peternakan | S02b | sapi, gerbang, rute |
| Shifalina (shifalina_) | warga, warteg | S13b | penerima hasil panen |
| oktaa.blushh, Afriza SuperStore | Spesial Angkatan Pertama | S08a | penonton reveal |
| irtizadelanorillaridwan | Spesial, penghijauan | S12a/S12b | menyiram bedengan |
| Eka Agustin, damar_zan | warga permanen EP003 | S09a | menyambut RIS, lalu kru bangun sekolah (S19–S20) |

Semua 9 warga EP004 tampil minimal sekali, dengan aktivitas bermakna. **Maksimum 3 name tag aktif bersamaan** pada shot lebar. Tag tidak boleh menimpa wajah, bubble, atau subtitle.

**Sekolah belum punya murid resmi.** RIS dan Joy tidak memakai seragam, badge murid, atau kursi yang "ditandai". Overlay CTA memakai kata **calon**, bukan "terdaftar".

---

## 4. Acting bible EP005

**Gobi** (kaos oranye, celana navy, sepatu krem, semi-chibi). Resep dasar: anticipation 8–10 frame → aksi → settle 6–8 frame. Emote icon selalu bertumpuk dengan gerak tubuh, bukan menggantikannya.

| Emosi | Tubuh | Wajah | Dipakai |
|---|---|---|---|
| Kaget/kesal | lompat kecil, bahu naik, jari menunjuk | alis naik, mulut O, `?!` | S01 |
| Semangat memulai | kepal tinju, hop penuh, stomp | senyum lebar | S03, S05b, S19 |
| Ragu/khawatir | sweat drop, jempol canggung, tengok ke rumah | alis miring | S05c |
| Bangga | bakul terangkat, badan miring karena beban, dada naik | senyum miring | S13a |
| Tertawa | membungkuk, pegang perut, mundur satu langkah | mata melengkung | S16a |
| Panik komik | squash → stretch → lompat, tangan di kepala | rahang jatuh | S23b, S28 |
| Lega | bahu turun, usap dahi, embus napas | mata setengah | S31 |
| Mengajak penonton | menunjuk lensa, lambaian "sini" | senyum, kedip | S33b–S35 |

**Idle NPC menurut peran** (Walk = 0 saat berhenti; semua langkah berasal dari translasi dunia nyata):
Fredrikz memeriksa tanah dan menepuk celana · Xyree menghitung ternak dan memeriksa kait · Shifalina menata rak · Damia merapikan buku, menunjuk dengan penggaris, deadpan · guapusingnjir pose percaya diri, kibaran jubah, "aku memang sengaja" · RIS ragu lalu ceria · Joy penasaran, mengintip, menyentuh meja · oktaa/Afriza bersorak · Eka/damar_zan membawa kayu.

**Sapi (3 ekor, ID stabil, tanpa nama tampil):**
- cow-001: pemakan rakus. cow-002: pemalu, sering berkedip. **cow-003: penasaran**, ciri visual khas yang terbaca di shot lebar (tambalan kontras tinggi + jumbai ekor) **[V desain aset]**.
- Gerak wajib: kunyah, kedip, kibas ekor, telinga kedut, menoleh, berjalan dengan translasi nyata, hidung mengangkat kait.
- Moo asli dipisah dari imitasi Gobi.
- Ukuran dan tinggi pintu sekolah diselaraskan agar cow-003 bisa lewat tanpa clipping **[V]**.

---

## 5. Storyboard shot-by-shot

Kolom: **Shot · Waktu · Kamera · Blocking & acting · VFX · SFX/musik.** Detail kamera numerik ada di `EP005_CLAUDE_F_HANDOFF.md`.
Posisi dunia (koordinat, arah kompas, jarak rute) **belum terverifikasi [V]**. Arah layar dikunci saat previz: **Dir A** = arah progres sungai ke rim, **Dir B** = arah kandang → sekolah.

### Chapter 1 — Hook kondisi pulau (M 0,00–11,22)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S01** | M 0,00–3,34 [K]: "WOI!" 0,00–0,40; kalimat 0,76–2,73; hening dramatis 2,73–3,34 | 3QH statis. Ujung sungai di sepertiga bawah, rim jauh dan langit di atas. Gobi kiri-bawah. | Frame 0 Gobi sudah di udara. "WOI!" mendarat dengan squash. Berjalan ke ujung air, menatap genangan. `?!` di ±0,9. Hening: bahu turun, menendang kerikil ke genangan. | air menggenang di ujung, daun berputar, `?!` | sting di frame 0 selaras "WOI!", aliran pelan lalu mengecil jadi tetes, boing, plop |
| **S02a** | M 3,34–6,38 [K] "Terus… udah kita bikin," | IM utuh lahan pertanian EP004 (bedengan kosong). Padi lama (hijau) terlihat di tepi bila layout mendukung [V]. | Fredrikz jongkok meraba tanah, meremas lalu menjatuhkan, geleng, angkat bahu. | debu tanah | angin, desah, tanah |
| **S02b** | M 6,38–8,20 [K] "tapi belum ada hasilnya!" 6,59–7,85 | IM kandang kosong, tempat pakan dan air terbaca | Xyree bersandar di pagar, bahu turun, mengetuk palang gerbang. Tempat pakan kosong. | daun terbawa angin | kayu berderit, ruang kosong. **Tanpa moo.** |
| **S03** | M 8,20–11,22 [K]: "OKE!" 8,34–8,74; "Hari ini kita beresin semuanya!" 8,99–10,96 | FB ¾, jalan setapak dengan vista pulau, bebas penghalang | "OKE!" tinju ke atas, hop penuh. Lalu tangan di pinggang, menunjuk ke Dir A, lari keluar frame (cut on action ke S04). | `!`, debu langkah | hentakan, whoosh, musik mulai naik |

### Chapter 2 — Komentar sungai (M 11,22–23,55)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S04** | M 11,22–16,00 [K] kalimat 11,53–15,75 | IM tepi sungai: ujung aliran dan dataran menuju rim. Kartu komentar di zona atas [V; komentar asli dari pemilik]. | Gobi ke ujung air, menyapu lengan sepanjang rute menuju rim, menoleh ke kartu dan nyengir. **guapusingnjir belum tampil.** | kartu slide-in, garis rute putus-putus tipis (±3 dtk, penanda geografis) | swoosh kartu, gemericik, langkah |
| **S05a** | M 16,00–18,30 [K] "Katanya biar kayak di Asgard!" 16,18–17,97 | MS Gobi, ruang atas untuk bubble | Mata berbinar, tangan membingkai langit. Bubble imajinasi: aula emas original dengan air terjun, bergoyang. | sparkle emas, bubble pop | chime/harpa ringan, pop |
| **S05b** | M 18,30–20,55 [K] "OKE! Kita terusin sungainya!" 18,50–20,30 | FB ¾ statis, tanah ujung sungai di bawah kaki | Jongkok (anticipation), telapak ke tanah, stomp. Tanah beriak. | ring riak, debu | stomp, rumble ringan, musik build |
| **S05c** | M 20,55–23,55 [K] "Tapi… rumah gue jangan sampai ikut hanyut, ya!" 20,76–23,33 | FB, rumah dua lantai terlihat jauh di latar tanpa tertutup pohon [V] | Menoleh ke rumah, sweat drop, jempol canggung. | sweat drop | gulp, ambient sepi |

### Blok G1 — Sungai diteruskan dan reveal air terjun (9,5 dtk, tanpa VO)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S06** | G1+0,0–5,5 [S] | 3QH tinggi statis, seluruh rute dari ujung sungai lama ke rim. Bukan close-up river-follow. | +0,0–0,7 Gobi anticipation (tepuk/stomp). +0,7–4,5 kanal terpahat ke depan mengikuti kelokan dari endpoint sah; kepala air menyusul ±0,6 dtk di belakang; Gobi "menggiring" air (lari kecil di samping, melambai, melompati batu). Di tikungan terdekat ke rumah (bila ada): panik lalu lega saat air melengkung menjauh. +3,5–4,8 **jembatan kayu kecil** tersusun di persilangan jalur yang logis (tiang → balok → papan, tanpa menutup air). +4,8–5,5 air menyentuh rim. | tanah memuncrat, batu kanal pop-in, tepi rumput menggeliat, foam kepala air, riak | gemuruh tanah, kerikil, kayu/paku, air mengisi, whoosh; musik build |
| **S06b** *(opsional)* | G1+2,4–3,5 | FB/MS Gobi di depan kepala air, hanya bila Gobi di 3QH terlalu kecil untuk terbaca | Mengarahkan air dengan tangan, mata mengikuti kepala air | — | langkah, air |
| **S07a** | G1+5,5–6,0 | IR dekat bibir pulau (macro) | Air menumpuk di tepi (anticipation 0,5 dtk). Musik turun. | air meninggi di lip | hening 0,3 dtk lalu tetes |
| **S07b** | G1+6,0–9,5 | IR wide sisi-atas, **pull-back lambat ±6–8% selama 3,5 dtk**, siluet tepi pulau melayang dan awan di bawah | Air jatuh sebagai pita panjang ke bawah pulau. Tahan reveal sampai akhir blok. | pita air dua lapis (inti + tepi buih), spray hilang ke bawah, foam di rim, mist; pelangi tipis opsional | whoosh → **roar crescendo, puncak tepat sebelum "WOOOO!"**. Musik duck ±10 dB. |

### Chapter 3 — Reveal air terjun dan warga (M 23,55–38,92)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S08a** | M 23,81–26,40 [K] "WOOOO! KITA PUNYA AIR TERJUN!" 23,81–26,21 | FB ¾ sedikit rendah, air terjun di latar jauh, **tanpa pohon di depan**, ruang lompat | Lompat dua kali, lengan menunjuk ke belakang pada "AIR TERJUN!". Percikan menyentuh wajah: kedip + senyum. oktaa.blushh dan Afriza berlari masuk dan bersorak di latar. | spray ringan ke arah kamera, sparkle | roar jauh (−6 dB dari S07), sorak, boing |
| **S08b** | M 26,40–30,20 [K] "Ini guapusingnjir, sekarang resmi jadi Warga Spesial!" 26,67–30,00 | TS ¾ Gobi–guapusingnjir, headroom untuk badge ★ | guapusingnjir melangkah masuk dari jalur sisi rim (±26,2). Gobi menyapu lengan; ia berpose percaya diri. Pada "Warga Spesial!" lencana ★ pop + tag. Gust spray membuat jubah dan headpiece goyah, ia menegakkan diri dengan wajah "disengaja". | cincin sparkle hijau-emas, badge pop | langkah, shimmer, ting lencana, sorak |
| **S09a** | M 30,44–35,90 [K] "Oh iya!" 30,44–30,86; "RIS_26… baru!" 31,19–34,66; "Selamat datang!" 34,96–35,82 | IM/TS jalur setapak ke lookout | Gobi menjentik jari dan menoleh. RIS_26 berjalan masuk dari jalur utama (≥4 langkah nyata di frame), melambai ragu. Eka dan damar_zan menyambut, RIS membungkuk malu. | daun-confetti kecil, tag fade | langkah, tepuk, chime halus |
| **S09b** | M 36,40–38,92 [K] "Nah, sekarang giliran pertanian!" 36,40–38,71 | FB, Gobi menghadap Dir pertanian | Lengan memutar "ayo", berbalik, mulai lari; RIS mengejar. Cut on action ke S10. | debu | whoosh, langkah, tone musik bergeser ke tema pertanian |

### Chapter 4 + G2 — Panen dan tanam (M 38,92–45,49 + 7 dtk jeda)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S10** | M 38,92–41,85 [K] "Sawah lama kita akhirnya siap dipanen!" 39,15–41,65 | 3QH statis. Padi lama dan bedengan baru sebagai dua area terpisah dalam satu frame bila layout mendukung [V]. | **Pulsa kematangan** hijau → emas menyapu baris (±0,9 dtk). Fredrikz di pematang menunjuk padi emas, Gobi jempol. Bedengan baru kosong sebagai kontras. | color lerp hijau → emas, kilau butir | rustle padi naik, chime halus |
| **S11** | **G2a** G+0,0–3,5 [S] | sudut sama dengan S10 (kontinu) | Fredrikz memotong per baris, RIS membawa bakul, Gobi mengikat berkas. Baris berganti emas → tunggul pucat tiap ±0,5 dtk. Akhir: tumpukan berkas, dua bakul penuh, tiga pose puas. **Bedengan baru tetap kosong.** | batang melayang, serbuk padi, squash bakul | swish–thump berirama, jerami, bakul fwump |
| **S12a** | M 42,05–45,49 [K] "Terus, di lahan baru kita tanam jagung sama wortel!" 42,05–45,29 | 3QH statis, seluruh bedengan EP004 (pagar, irigasi) | Gobi membawa dua kantong benih (ikon jagung, wortel). Fredrikz membuat alur, irtizadelanorillaridwan menyiram. Gobi menabur bergantian. | benih melengkung, ikon kecil | benih jatuh, tanah pup |
| **S12b** | **G2b** G+0,0–3,5 [S] | sama | Tanah menutup dengan pop. Irigasi mandiri mengalir [V]. Tunas tumbuh bergelombang dari dekat ke jauh: jagung (sedang), wortel (daun + puncak oranye). Akhir: baris selang-seling bersih. **Tidak dipanen.** | growth pulse, tetes air | pop, tetes, sprout boing, chime |

### Chapter 5 + G3 — Panen dan sapi datang (M 45,49–56,60 + 3,5 dtk)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S13a** | M 45,72–48,30 [K] "NAH! Akhirnya kita punya hasil panen!" | FB ¾ di depan hasil panen, tanpa penghalang | Bakul diangkat tinggi, bobot membuat badan miring ke belakang lalu stabil. Fredrikz tersenyum, RIS tepuk kecil. | kilau butir | chime, tepuk |
| **S13b** | M 48,57–50,80 [K] "Jadi nggak perlu bingung cari makanan terus!" | MS warteg, rak terlihat | Shifalina menerima karung beras dan menata rak yang tadinya tipis [V]. Gobi menepuk perut, Shifalina jempol. | — | karung thud, kasir ting |
| **S14a** | M 51,06–53,80 [K] "Eh," 51,06–51,23; "tapi peternakan kita masih kosong." 51,58–53,62 | FB → IW kandang kosong | Senyum Gobi luntur, kepala menoleh lambat, `?`. Cut IW: kandang kosong, Xyree memandang balik. | — | angin, musik turun |
| **S14b** | M 54,07–56,60 [K] "Xyree! Kita datengin sapi pertama!" 54,07–56,37 | MS Gobi, lalu Xyree di gerbang | Memanggil dengan dua tangan di mulut. Xyree hormat, melompat, lari membuka gerbang. | — | gema suara, langkah |
| **S15** | **G3** G+0,0–3,0 [S] | 3QH statis, gerbang dan padang kandang | Xyree membuka gerbang. Semak bergoyang (0,4 dtk). **Tiga sapi keluar dari semak satu per satu (jarak ±0,7 dtk)**, berjalan nyata ke tempat pakan. cow-003 paling belakang, berhenti di ambang, menoleh ke luar 0,4 dtk, lalu menyusul. Xyree menghitung 1-2-3. | debu kuku, semak goyang | derap kuku bertahap, gemerisik, **moo asli** |
| **S15b** | G3 G+3,0–3,5 [S] | insert makro kait gerbang | Kait belum duduk di ring, bergoyang. | — | tik-tik kait |

### Chapter 6 — Sapi pertama (M 56,60–67,67)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S16a** | M 56,77–60,90 [K] "MOOOO!" 56,77–58,0; jeda kecil 58,01–58,28 [T]; "HAHAHA! AKHIRNYA ADA SAPI!" 58,28–60,78 | FB ¾ Gobi dengan 2–3 sapi dan Xyree di belakang, semua tak terpotong | "MOOOO!": leher memanjang, tangan jadi tanduk. **Sapi asli menyahut di jeda 58,05.** Gobi terpingkal, pegang perut, mundur satu langkah. cow-001 mengunyah, cow-002 berkedip, cow-003 mengibas ekor. | ikon senang kecil | moo asli terpisah, tawa, kunyah, ekor |
| **S16b** | M 61,15–62,80 [K] "Wih, lucu banget!" | MS rendah ¾, Gobi jongkok sejajar sapi | Menyodorkan tangan, sapi mengendus, mata melengkung. | — | dengus, tawa kecil |
| **S17a** | M 63,00–65,40 [K] "Eh," 63,00–63,13; "yang satu kok ngeliatin gerbang terus?" 63,44–65,26 | OTS dari belakang bahu Gobi ke cow-003 (bahu tidak menutup wajah sapi). Tanpa orbit. | Gobi menoleh, mata mengikuti garis pandang sapi. cow-003 tegak, telinga kedut, kepala miring, menatap gerbang (Dir B). | — | telinga flick, angin |
| **S17b** | M 65,65–67,67 [K] "Ah, paling cuma penasaran!" 65,65–67,40 | MS/FB Gobi + cow-003 | Angkat bahu, menepuk kepala sapi, berjalan pergi. **cow-003 tetap menatap gerbang sampai frame akhir.** | — | tepukan, langkah menjauh |

### Chapter 7 — Bangun sekolah (M 67,67–76,60)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S18** | M 67,96–73,30 [K] 67,96–70,57 + 70,82–73,10 | IW jalur kandang → lapang calon sekolah. **Wajib memperlihatkan rute dan gerbang kandang** (establishing route). Kartu komentar Damia di zona atas [komentar asli, V]. | Gobi berjalan di jalur (translasi nyata), berhenti di lapang. Pada "gurunya!" bergaya guru dengan papan imajiner. Empat patok pojok pop. **Damia belum tampil.** | patok pop, garis denah tipis | langkah, tok patok, swoosh kartu |
| **S19** | M 73,54–76,60 [K] "OKE! Kita bikin sekolah pertama Pulau Gobi!" 73,54–76,41 | FB, lapang bebas pohon | Mengikat lengan baju, tepuk, stomp di patok tengah. damar_zan dan Eka datang membawa balok. Stomp akhir memicu pondasi pop; overlap ke G4 maksimal 0,3 dtk. | — | tepuk, stomp, musik build |

### Blok G4 — Konstruksi sekolah (8,0 dtk)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S20** | G4+0,0–5,2 [S] | 3QH tinggi statis, bangunan utuh dalam frame, jalur dari kandang terlihat, tanpa pohon di antara | **Urutan terbaca:** pondasi pop (0,4) → lantai papan berurutan (0,8) → dinding panel naik (1,2) → jendela dan **pintu besar** pop (0,8) → rangka atap lalu genteng (1,2) → lonceng terpasang di tiang depan (0,5) → debu settle (0,3). Gobi, Eka, damar_zan bekerja, pose akhir. | debu, serpihan kayu, settle-bounce per tahap | batu, papan, palu, panel, atap, ting lonceng (**tanpa dibunyikan**), klimaks kecil |
| **S21** | G4+5,2–8,0 [S] | cutaway interior (wall-cut) 3QH dari sudut pintu | Papan tulis muncul, lalu **8 meja** berkaskade tiap 0,15 dtk, kursi, buku di meja guru. Sinar jendela dengan debu. Hening 0,5 dtk di akhir (ruang kosong). | partikel debu cahaya | klik furnitur berirama, hening ruang |

### Chapter 8 — Sekolah dan murid kosong (M 76,60–93,10)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S22a** | M 76,80–79,00 [K] "YES! SEKOLAHNYA JADI!" 76,80–78,65 | IW **hero** sekolah + jalur; Gobi kiri-tengah | Lompat dan tinju, sorak, dua warga bersorak. **Damia muncul kecil di jalur kanan di ±77,8 dan berjalan ke pintu.** | daun-confetti kecil | sorak, hit musik hero |
| **S22b** | M 79,00–81,70 [K] "Damia sekarang jadi guru pertama kita!" 79,00–81,26 | MS Damia di pintu besar; papan "SEKOLAH" terbaca (gaya papan KOST EP004) | Merapikan buku di dada, mengangguk formal, menunjuk dengan penggaris. Gobi di tepi frame menyapu lengan. Tag ★ dan lencana pop. | lencana ★ | ting, tepuk |
| **S23a** | M 81,70–85,90 [K] "Eh, bentar…" 81,70–82,48; "…gurunya juga udah ada…" 82,85–85,90 | TS ¾ Gobi–Damia di halaman, sekolah di latar, headroom, statis | Tangan terangkat "tunggu". Menghitung: tunjuk sekolah → tunjuk Damia → **jari ketiga menggantung kosong**. Damia menyimak datar. | ikon "…" tipis | ketukan jari, hening berpikir |
| **S23b** | M 86,36–88,30 [K] "TAPI MURIDNYA BELUM ADA?!" 86,36–88,11 | FB, mundur sedikit untuk ruang lompat | Squash → stretch → lompat, tangan di kepala, `?!`, mendarat. Damia melirik datar. | emote `?!` | boing, landing |
| **S23c** *(CH-A)* | M 88,30 + **1,0 dtk** | Cutaway interior statis, meja kosong | Angin meniup selembar kertas melintas, kursi berderit. Damia menoleh ke Gobi. **Bubble Damia: "Bang, muridnya mana?"** | bubble pop | angin, hening |
| **S24** | M 88,50–90,60 [K] "RIS sama Joy, coba lihat kelasnya dulu!" 88,50–90,44 | MS pintu sekolah, interior terbaca | Gobi menunjuk pintu. RIS_26 dan joy.__3.15 (**tanpa seragam/badge**) masuk melihat-lihat. **Damia menarik tali lonceng** (dua dentang) sebagai "bel masuk kelas". | getaran lonceng | dentang lonceng, langkah |
| **S24b** | M 90,60–91,40 [S] (menutup "Eh…" 90,88–91,13) | cutaway MS kandang | **cow-003 menoleh tajam, telinga naik, hidung mengangkat kait gerbang.** Gerbang terbuka sedikit. | — | dentang lonceng jauh, tik kait |
| **S25** | M 91,40–93,10 [K] "kok ada suara dari luar?" 91,40–92,88 | FB Gobi depan kelas, ruang kosong di depan | Memiringkan kepala, tangan di telinga. Damia menoleh ke pintu. Moo dan derap jauh naik di bawah VO. | — | moo jauh, derap samar, musik duck |

### Blok G5 — Sapi mendekat (4,0 dtk, tanpa VO)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S26** | G5+0,0–1,6 [S] | IW rute kandang → sekolah, statis | cow-003 keluar dari gerbang dan berjalan/trot **mengikuti jalur nyata**. Xyree kecil di latar, membelakangi, menyiapkan ember, tidak sadar. | debu kuku | kuku, moo mendekat bertahap |
| **S27** | G5+1,6–4,0 [S] | OTS dari belakang Damia ke pintu (Gobi tidak menutup), interior terbaca | Semua membeku. Gelas pensil di meja guru bergetar tiap derap. Pintu terdorong dengan derit, moncong cow-003 masuk, ia melangkah ke tengah, berhenti, mengunyah. Damia freeze mata melebar, RIS dan Joy mundur. **Hening 0,3 dtk di akhir blok** sebelum "LAH?!". | getar properti, debu pintu | derap mendekat, derit, moo rendah, hening |

### Chapter 9 — Sapi masuk kelas (M 93,10–101,34)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S28** | M 93,34–95,60 [K] "LAH?! ITU SAPI KENAPA MASUK KELAS?!" 93,90–95,51. Bunyi 93,34–93,60 [T], identitas [V] | FB Gobi di depan cow-003 di tengah kelas, RIS dan Joy menempel ke dinding di tepi, ruang lompat | Squash → hop → stretch, rahang jatuh, menunjuk sapi dengan seluruh lengan, geleng. cow-003 menoleh pelan, mengunyah, berkedip. | `?!` | boing, landing, kunyah |
| **S29** | M 95,84–98,30 [K] "XYREEEEE! TOLONG AMBIL SAPINYA!" 95,84–98,13 | FB/TS Gobi menghadap pintu, Damia deadpan di sisi, cow-003 di belakang | Tangan di mulut seperti megafon, badan condong ke belakang, menunjuk ke arah kandang. | garis suara tipis | gema jauh |
| **S30a** | M 98,43–99,70 [K+S] awal "INI SEKOLAH BUAT WARGA," | IW rute | Xyree menjatuhkan ember dan **berlari sepanjang rute nyata**, burung beterbangan. Suara Gobi terdengar di atasnya. | debu lari | lari cepat, burung |
| **S30b** | M 99,70–101,34 [S] "BUKAN BUAT SAPI!" | FB Gobi | Stomp dan tunjuk. cow-003 menjawab moo santai, Damia tenang. Batas a/b tidak punya hening terukur (±0,3). | emote kesal | stomp, moo |

### Blok G6 — Sapi digiring (3,5 dtk)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S30c** | G6+0,0–1,4 [S] | TS Gobi–Damia, cow-003 di belakang | Damia deadpan. **Bubble: "Bang... ini murid baru?"** cow-003 moo dan mengunyah. | bubble pop | moo, kunyah |
| **S30d** | G6+1,4–3,5 [S] | IM pintu sekolah, rute terlihat | Xyree tiba terengah (skid), memasang tali, menuntun cow-003. Di ambang sapi menoleh ke papan tulis (enggan), lalu menurut. RIS dan Joy menahan tawa, Gobi bertolak pinggang. | debu skid | napas, tali, kuku menjauh |

### Chapter 10 — Penutup dan CTA (M 101,34–135,16)

| Shot | Waktu | Kamera | Blocking & acting | VFX | SFX |
|---|---|---|---|---|---|
| **S31** | M 101,57–104,80 [K] "Fiuh… akhirnya sapinya balik ke kandang!" 101,57–104,40 | IM kandang, tiga sapi bisa dihitung | cow-003 masuk gerbang bersama Xyree. Xyree menutup gerbang, **menekan kait ke ring "klik" dan menariknya dua kali**. Gobi mengusap dahi "fiuh". cow-003 menatap gerbang sekali lagi, lalu makan. | uap lega | klik kait, napas |
| **S32a** | M 104,95–107,10 [K] "Sekarang air terjun udah ada," | **mirror S01** | Air kini mengalir sampai rim dan jatuh. | air hidup | air/roar ringan |
| **S32b** | M 107,24–108,60 [K] "sawah udah dipanen," 107,24–108,46 | mirror S02a/S10 | Tunggul dan berkas, bedengan baru bertunas. Fredrikz dan RIS menumpuk karung. | — | rustle |
| **S32c** | M 108,75–≈110,4 [K+S] "peternakan udah punya sapi," | mirror S02b | Tiga sapi di kandang, Xyree menghitung dan tersenyum. **Batas c/d ≈ 110,4 ± 0,4 tidak punya hening terukur [V].** | — | moo |
| **S32d** | M ≈110,4–112,22 [S] "dan sekolah juga udah buka!" | sudut hero S22a | Damia melambai di pintu, lonceng bergoyang (tidak berdentang). | — | angin, ting halus |
| **S33a** | M 112,68–114,90 [K] "Tapi sapi kita belum punya nama!" | TS Gobi–cow-003 di pagar kandang | Jongkok menunjuk sapi, cow-003 menyenggol bahunya. `?` melayang di atas sapi (**bukan nama**). | `?` | moo kecil |
| **S33b** | M 115,26–119,09 [K] "Menurut kalian, namanya siapa?" 115,26–116,98; "Dan kita harus bangun apa lagi?" 117,38–119,09 | FB menghadap lensa ¾, lalu IW pulau pada 117,38 dengan penanda "?" di kapling kosong (format EP004) | Menunjuk ke penonton "kalian!", angkat bahu, lalu mengedarkan lengan ke pulau. | marker "?" | pop ringan |
| **S34a** | M 119,64–122,83 [K] "Oh iya! Sekolah kita juga masih belum punya murid!" 119,64–122,40 | IM halaman sekolah, meja kosong terbaca via pintu/jendela | Menepuk dahi, menunjuk sekolah. Damia di ambang menatap kelas kosong, menghela napas, menghapus papan. | — | angin, kapur |
| **S34b** | M 122,83–128,50 [K] "…komen 'Jadi Murid' ya!" 122,83–126,45; "Nanti aku pilih beberapa!" 126,74–128,35 | FB Gobi, sekolah di latar, kartu CTA "Jadi Murid" (format EP004) di luar zona subtitle. Status **calon**. | Lambaian "sini", Damia menunjuk bangku kosong dengan penggaris. Pada "pilih beberapa" Gobi kedip + jempol. **Tidak ada murid atau seragam.** | kartu muncul | pop kartu, ting |
| **S35** | M 128,75–135,16 [K] "Buat yang mau… 'Jadi Warga'!" 128,75–132,95; "Nanti aku pilih beberapa!" 133,24–134,89 | FB Gobi dengan ≤ 3–4 warga di latar kiri-kanan (area subtitle bebas), kartu "Jadi Warga" format EP004 | Menunjuk penonton, warga melambai/bersorak. Akhir: semua menghadap lensa, tahan. | kartu | musik CTA, ting |
| **S36** | outro | **reuse penuh EP004** | Tidak dianimasi ulang, tidak ada VO baru. Teks persis: "Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!" | — | audio outro existing |

---

## 6. Matriks sebab–akibat dan world state

| Sebab | Akibat | Ditunjukkan di |
|---|---|---|
| `river-001` berhenti di dataran (EP003) | kanal diteruskan dari endpoint sah ke rim → air terjun | S01 → S06 → S07 |
| padi lama hijau | pulsa kematangan → panen → tunggul | S02a → S10 → S11 |
| hasil panen | stok warteg terisi | S11 → S13b |
| bedengan EP004 kosong | jagung + wortel bertunas, belum panen | S02a → S12b |
| kandang kosong | 3 sapi masuk | S02b → S15 |
| kait gerbang belum duduk | cow-003 mengangkatnya | S15b → S24b |
| lonceng dibunyikan Damia | cow-003 menoleh, keluar, berjalan | S24 → S24b → S26 |
| cow-003 di kelas | Gobi memanggil, Xyree berlari, menuntun pulang | S28 → S30 → S31 |
| semua hasil | mirror shot penutup | S32 |

**Delta world state setelah EP005 (append-only):** kanal + air terjun + jembatan kecil (bila ada persilangan) · padi lama tunggul/berkas · bedengan jagung + wortel bertunas · 3 sapi ber-ID tetap · sekolah dengan lonceng dan 8 meja kosong · +3 warga (guapusingnjir ★, Damia ★, RIS). Total rencana: 12 warga permanen + Gobi. RIS dan Joy bukan murid.

---

## 7. Aturan mixing ringkas

- Musik duck ±8–12 dB pada reveal (S07b), saat bunyi sapi mendekat (S25–S27), dan pada tahan komedi (S23c). Nilai dB adalah estimasi sutradara **[S]**.
- Moo asli selalu terpisah dari imitasi VO Gobi.
- Overlap SFX di bawah VO diperbolehkan; overlap VO dengan VO tidak ada.
- SFX adalah prosedural atau aset berlisensi. Tidak ada klaim aset yang sudah tersedia.
- Pada blok jeda yang sepi (G1, G5) jangan memberi subtitle kosong. Cukup SFX dan emote.

---

## 8. Pending: validasi dan alignment

**Untuk audio / Codex C**
1. Dengarkan 9 batas chapter dan titik sisip: **41,85, 88,30, 93,10**.
2. Identifikasi bunyi **93,34–93,60** (kata "LAH"? napas? klik?). Bila bagian ch8, pindahkan G5 ke 93,75.
3. Dengarkan batas kalimat **99,70** (koma "INI SEKOLAH BUAT WARGA, / BUKAN BUAT SAPI") dan **≈110,4** (S32c/S32d).
4. Jalankan forced alignment untuk caption word-level. Sampai selesai, pakai caption phrase-level dari jendela [K] di atas.
5. Ukur durasi outro EP004 dari source (frame, termasuk pre-roll/tail) lalu pilih nilai blok jeda final.

**Untuk implementasi [V]**
6. Cek `after-ep004` dan world state aktual. Branch `codex/ep004-full-20261107` (commit `76ee0c8`) belum ada di remote saat paket dibuat. `main` masih baseline EP002.
7. Radius pulau (laporan: ±52) adalah **TUNING PROVISIONAL**. Jarak endpoint sungai ke rim, rute kanal, lokasi persilangan jembatan, dan lokasi lapang sekolah harus dihitung dari data nyata.
8. Panjang jalur kandang → sekolah dan kecepatan jalan/trot sapi. Target awal 14–22 unit **[S]**; bila di luar itu, geser lokasi sekolah, bukan percepat VO.
9. Lebar pintu sekolah vs collider sapi. Desain visual cow-003.
10. Mekanik build EP004 (kost "Yes! Kostnya jadi!") diikuti untuk sekolah dan kanal.
11. Sistem tag ★ dan format kartu CTA EP004.

**Untuk pemilik (input yang tidak ada di paket)**
12. Screenshot komentar asli: guapusingnjir (sungai ke ujung pulau, "kayak Asgard"), DamiaInsyirah🫐🤍 (sekolah dan jadi guru), dan bukti RIS_26 terpilih. Isi dan atribusi kartu tidak boleh dikarang atau diubah.
13. Persetujuan dua teks bubble NPC non-VO: **"Bang, muridnya mana?"** dan **"Bang... ini murid baru?"**. Keduanya dari V2, bukan dialog VO final.

---

## 9. Checklist akseptansi V3

1. Tiga shot awal menunjukkan kekurangan (sungai buntu, pertanian dan kandang kosong); belum ada sapi atau sekolah.
2. guapusingnjir, Damia, dan RIS tampil fisik tepat pada shot yang tercatat di bagian 3, bukan lebih awal.
3. Air terjun terbaca penuh dalam satu frame wide; aliran kontinu dari sungai lama sampai rim.
4. Padi lama dipanen; bedengan baru hanya bertunas.
5. Ada tiga sapi ber-ID tetap dengan moo asli, langkah nyata, dan cow-003 identik di kandang dan di sekolah.
6. Rantai lonceng → sapi → rute nyata → pintu → Xyree terbaca tanpa dijelaskan VO.
7. Tahan komedi CH-A dan hening 0,3 dtk sebelum "LAH?!" terasa disengaja.
8. Setiap shot Gobi bicara bebas halangan (lihat handoff Claude F).
9. Subtitle, tag, bubble, dan kartu tidak saling menimpa.
10. Dialog VO tidak berubah, tidak dipercepat, tidak dipotong. Outro persis reuse EP004.
