# PULAU GOBI — EP005 HANDOFF UNTUK CLAUDE F (CINEMATOGRAPHY DIRECTOR)

Dari: Episode Director (Claude B). Dokumen induk: `EP005_STORYBOARD_DIRECTOR_V3.md` (shot, acting, timing). Catatan risiko: `EP005_DIRECTOR_NOTES.md`.
Label bukti: **[T]** terukur · **[K]** kandidat · **[S]** estimasi sutradara · **[V]** validasi saat implementasi.
Semua angka framing di bawah adalah **target awal [S]** untuk 1080×1920. Kalibrasi di preview, lalu kunci sebagai preset.

---

## 0. Tugasmu

1. Memilih sudut, framing, dan gerak kamera tiap shot **sebelum** scene dikunci, bukan memperbaikinya sesudah pohon menghalangi.
2. Memastikan Gobi bicara selalu terlihat utuh (wajah dan tangan).
3. Menjaga pembangunan terbaca penuh dan statis.
4. Menjaga ruang subtitle, kartu, tag, dan bubble.
5. Menyiapkan reveal besar: air terjun (S07b), hero sekolah (S22a), rute (S18, S26), dan mirror (S32).

**Aturan emas:** ganti staging atau sudut dulu. Jangan membuat pohon semitransparan, dan jangan mengorbit atau zoom acak.

---

## 1. Zona frame

| Zona | Y (px, 1920) | Isi | Sumber |
|---|---|---|---|
| Atas | ±120–280 | kartu komentar | perkiraan dari contact sheet EP004 **[V]** |
| Aksi | ±300–1400 | tubuh karakter, bangunan, objek utama | [S] |
| Subtitle | ±1430–1680 | subtitle word-level | acuan EP002/EP004 **[V]** |
| Bawah | ±1680–1920 | negatif, tidak boleh ada wajah | [S] |

- Wajah Gobi saat bicara: target y ±600–900. Kaki ≤ y 1340 agar tidak masuk zona subtitle.
- Headroom di atas kepala ≥ 30% tinggi karakter (untuk lompat, emote `?!`, bubble).
- Bubble NPC dan emote berada di dalam frame penuh (tidak terpotong tepi atas), tidak menimpa wajah atau subtitle.

---

## 2. Preset sudut

Elevasi = sudut kamera terhadap tanah. Azimut = putar relatif terhadap sumbu dasar proyek (keputusan proyek: kamera ortografik azimut 45°, elevasi ≈ 35°; preset EP004 aktual **[V]**).

| Preset | Pakai untuk | Elevasi | Ukuran subjek | Gerak yang diizinkan |
|---|---|---|---|---|
| **FB** full-body ¾ | dialog, acting besar | 22–30° | Gobi 520–640 px | statis, atau dorong ≤ 3% |
| **MS** | reaksi kecil, properti | 20–28° | pinggang ke atas ±760–900 px | statis |
| **TS** two-shot | dialog dua karakter | 25–32° | masing-masing 380–480 px, di sepertiga berlawanan | statis |
| **IM** iso medium | lokasi + 2–3 karakter | 30–38° | Gobi 160–240 px | statis |
| **3QH** three-quarter high | **semua konstruksi** | 45–58° | Gobi 90–140 px; objek utuh dengan margin ≥ 8% | **statis** |
| **IW** island/zone wide | rute, konteks | 40–55° | Gobi 60–110 px; zona ≤ 90% lebar | statis |
| **IR** island reveal | S07a/S07b | ±10–20° di atas bidang rim, sumbu tangen rim | pulau ≥ 80% lebar; pita air ≥ 40% tinggi frame | pull-back ≤ 8% dalam 3,5 dtk |
| **OTS** | S17a, S27 | 25–35° | bahu ≤ 18% lebar frame | statis |
| **Interior wall-cut** | S21, S23c, S27, S28 | 30–40° dari sisi pintu | meja, papan, sapi terbaca | statis |
| **Insert makro** | S15b | 25–35° | objek ≥ 40% lebar | statis, ≥ 0,5 dtk |

**Gerak kamera:** konstruksi dan dialog **tidak bergerak**. Satu-satunya gerak yang disengaja adalah pull-back S07b. Untuk lompat Gobi, beri headroom di awal, jangan tracking. Tidak ada shake, orbit, atau zoom otomatis.

---

## 3. Protokol anti-oklusi

**Uji.** Untuk setiap shot dialog atau acting, di frame **awal, 25%, 50%, 75%, akhir, dan tiap frame emfasis**, lempar sinar dari kamera ke kepala, pusat wajah, torso, dan kedua tangan. Lolos bila:
- kepala + wajah terlihat ≥ 95%;
- tangan terlihat ≥ 90% bila gestur adalah beat-nya;
- tidak ada batang atau kanopi pohon dalam jalur sinar yang menutup wajah.

**Bila gagal, ikuti tangga ini secara berurutan:**
1. **Re-staging:** geser karakter ≤ 4 unit sepanjang jalur rencana, atau pindah ke pad bersih (§4).
2. Sudut alternatif: azimut ±20°, ±35°, ±50°.
3. Naikkan elevasi +6° lalu +12°.
4. Mundur dan perketat.
5. Ganti jenis shot (FB → MS → TS).
6. **Pilihan terakhir:** memudarkan **satu** pohon foreground selama shot itu. Catat di log ("tree fade log": shot, pohon, alasan) dan beri tahu Director. Tidak ada transparansi global.

**Dilarang:** menghapus atau memindahkan pohon lama tanpa keputusan pemilik; memotong dekor diam-diam; menurunkan kualitas kanopi agar "tembus".

---

## 4. Pad staging

Pad = area bersih yang disiapkan sebelum kamera ditentukan. **Radius dan posisi dihitung dari world state nyata [V].** Target awal: ≥ 4 unit di sekitar aktor, ≥ 6 unit di busur kamera ±60°.

| Pad | Dipakai oleh |
|---|---|
| Lookout air terjun | S08a, S08b, S09a |
| Pad pertanian | S10–S13a |
| Pad kandang | S15–S17b, S31, S33a |
| Halaman sekolah | S18, S19, S22a–S23b, S34a–S35 |
| Interior kelas | S21, S23c, S24, S27–S30d |

Lokasi sekolah harus berada di lapang yang tidak berimpit dengan warteg atau kost, dan terhubung jalur setapak ke kandang (rute terlihat di S18). Bila tidak ada lapang tanpa pohon, itu **keputusan pemilik**: jangan hapus pohon sendiri.

---

## 5. Kartu kamera per shot

Kolom risiko berisi hal yang paling mungkin gagal dan fallback-nya.

| Shot | Preset | Target & framing | Risiko → fallback |
|---|---|---|---|
| S01 | 3QH | ujung sungai sepertiga bawah, rim dan langit di atas, Gobi kiri-bawah | rim terpotong → naikkan elevasi, mundur |
| S02a | IM/3QH | bedengan utuh, Fredrikz terbaca; padi hijau di tepi bila muat | padi tak muat → cukup bedengan |
| S02b | IM | kandang, tempat pakan dan air terlihat | pohon di depan kandang → geser azimut |
| S03 | FB | Gobi dengan vista pulau, ruang ke arah Dir A | pohon di latar → re-staging di jalur lain |
| S04 | IM | ujung aliran + rim, kartu di zona atas | kartu menimpa kepala Gobi → turunkan Gobi |
| S05a | MS | ruang atas untuk bubble Asgard | bubble menimpa kartu → perkecil bubble |
| S05b | FB | tanah ujung sungai di bawah kaki | kaki terpotong → mundur |
| S05c | FB | rumah dua lantai jauh, Gobi di depan | rumah tertutup pohon → pindah azimut |
| S06 | 3QH | **seluruh rute** kanal dari ujung lama ke rim, statis | kanopi menutup rute → elevasi lebih tinggi; jangan tracking |
| S06b | FB/MS | Gobi di depan kepala air (opsional) | oklusi → lewati |
| S07a | IR (macro) | bibir pulau, air menumpuk | terlalu dekat → mundur sedikit |
| S07b | IR | pita air + siluet pulau + awan; **tahan** akhir blok | pita terpotong → naikkan elevasi, kurangi tinggi frame |
| S08a | FB | Gobi besar, air terjun jauh di latar, **tanpa pohon di antara** | air terjun tertutup → ubah azimut |
| S08b | TS | Gobi + guapusingnjir, headroom untuk badge ★ | gust spray menutup wajah → jaga jarak kamera |
| S09a | IM/TS | jalur masuk RIS terlihat ≥ 4 langkah | tag bertumpuk → maks 3 tag |
| S09b | FB | Gobi menghadap Dir pertanian | arah terbalik → cek kunci Dir |
| S10 | 3QH | dua area (padi lama + bedengan baru) | tak muat sekaligus → dua framing sudut identik |
| S11 | 3QH | **sama persis dengan S10** (kontinu) | — |
| S12a | 3QH | seluruh bedengan, pagar, irigasi | kanopi → naikkan elevasi |
| S12b | 3QH | sama dengan S12a | — |
| S13a | FB | bakul padi, tanpa penghalang | bakul terpotong → MS |
| S13b | MS | rak warteg terbaca | pohon di depan warteg → geser azimut |
| S14a | FB → IW | menoleh, lalu kandang kosong di ujung pandangan | IW bergeser → kunci Dir |
| S14b | MS | Gobi memanggil, Xyree di gerbang | — |
| S15 | 3QH | gerbang + padang; semak tempat sapi muncul **terbaca** | sapi muncul dari balik pohon → pilih sudut bebas |
| S15b | Makro | kait gerbang | objek kecil → ≥ 40% lebar, ≥ 0,5 dtk |
| S16a | FB | Gobi + 2–3 sapi + Xyree, **tidak ada yang terpotong** | sapi terpotong → TS |
| S16b | MS rendah | Gobi sejajar sapi | — |
| S17a | OTS | bahu Gobi ≤ 18% lebar, wajah cow-003 terlihat penuh | bahu menutup sapi → geser kamera |
| S17b | MS/FB | cow-003 tetap menatap gerbang sampai frame akhir | — |
| S18 | IW | **gerbang kandang dan lapang sekolah dalam satu frame** (rute) | rute terlalu panjang → pilih IW tertinggi; bila tak muat, laporkan ke Director |
| S19 | FB | lapang bebas pohon, 2 warga membawa balok | — |
| S20 | 3QH | bangunan utuh, jalur kandang di tepi, tanpa pohon di antara | **lihat §6** |
| S21 | Interior wall-cut | papan, 8 meja, pintu; sinar jendela | kamera menembus dinding → pakai wall-cut |
| S22a | IW hero | sekolah, jalur, Damia berjalan masuk dari kanan | gunakan sudut yang bisa diulang di S32d |
| S22b | MS | Damia di pintu besar, papan "SEKOLAH" terbaca, tag ★ | tag menimpa papan → geser tag |
| S23a | TS | Gobi–Damia, sekolah di latar, statis | — |
| S23b | FB | ruang lompat penuh | lompatan keluar frame → mundur |
| S23c | Interior | meja kosong, bubble Damia terbaca | bubble menimpa kertas → geser |
| S24 | MS | pintu, interior terbaca, tali lonceng terlihat | — |
| S24b | MS | cow-003 di kandang, hidung dan kait terlihat | kait tak terbaca → perbesar |
| S25 | FB | Gobi, ruang kosong di depan | — |
| S26 | IW | rute kandang → sekolah | rute tertutup pohon → sudut tinggi |
| S27 | OTS interior | belakang Damia ke pintu; Gobi tidak menutup | pintu kecil di frame → perbesar |
| S28 | FB interior | Gobi + cow-003 di tengah kelas; RIS dan Joy di tepi | sapi terpotong → TS |
| S29 | FB/TS | Gobi menghadap pintu, Damia di sisi | — |
| S30a | IW | rute dengan Xyree berlari | Xyree hilang di pohon → pilih sudut tinggi |
| S30b | FB | Gobi + cow-003 | — |
| S30c | TS | Gobi–Damia, bubble terbaca | bubble ke zona subtitle → naikkan |
| S30d | IM | pintu + rute, skid Xyree | — |
| S31 | IM | tiga sapi terhitung, gerbang dan kait terlihat | sapi tumpang tindih → atur ulang |
| S32a | 3QH | **sama persis dengan S01** | — |
| S32b | 3QH | **sama persis dengan S02a/S10** | — |
| S32c | IM | **sama persis dengan S02b** | — |
| S32d | IW hero | **sama persis dengan S22a** | — |
| S33a | TS | Gobi + cow-003, wajah terlihat | sapi menutup Gobi → TS |
| S33b | FB lalu IW | Gobi menghadap lensa; lalu pulau dengan marker "?" | marker menimpa subtitle → naikkan |
| S34a | IM | halaman, meja kosong lewat pintu | — |
| S34b | FB | kartu "Jadi Murid" di luar zona subtitle | kartu menimpa Gobi → geser |
| S35 | FB | Gobi + ≤ 3–4 warga di latar kiri-kanan | tag bertumpuk → kurangi |

---

## 6. Konstruksi: aturan khusus

- Kamera **tidak bergerak** selama build. Kamera dipilih supaya **seluruh objek** masuk, bukan detail.
- Tahap berurutan ≥ 0,4 dtk dan terbaca sebagai langkah terpisah. Urutan sekolah di V3 §5 (S20).
- Gobi dan kru terlihat bekerja, bukan sekadar menonton.
- Insert detail hanya singkat (makro kait, tali lonceng); tidak menggantikan 3QH.

---

## 7. Reveal dan establishing

| Reveal | Syarat |
|---|---|
| **S07b air terjun** | satu frame: bibir pulau, pita air, bawah pulau, awan; hening 0,3 dtk sebelum roar; pull-back 6–8%; tanpa pohon di depan; pelangi opsional |
| **S22a hero sekolah** | sekolah, papan "SEKOLAH", jalur dari kandang, Gobi; **sudut diulang di S32d** |
| **S18 rute** | gerbang kandang dan lapang sekolah terlihat bersama |
| **S26 rute** | jalur berdebu yang sama dengan S18, dari sudut sama |
| **S32 mirror** | **simpan numerik** kamera S01, S02a, S02b, S22a dan pakai ulang apa adanya |

---

## 8. Transisi dan arah layar

- Hard cut dominan. Tanpa dissolve, kecuali transisi yang memang sudah ada di EP004.
- **Cut on action:** S03 → S04 (Gobi berlari keluar frame), S09b → S10 (Gobi berlari menuju pertanian).
- **Potong ke S08a ±0,1 dtk sebelum kata pertama** ("WOOOO!" mulai di M 23,81, sekitar 0,26 dtk setelah awal klip ch3), supaya roar S07b menggema di bawah kata pertama.
- **J-cut suara:** moo dan derap di S25 mulai sebelum gambar S26 muncul.
- **Kunci arah layar** saat previz dan jangan diubah:
  - **Dir A** = progres sungai menuju rim (S03, S04, S06).
  - **Dir B** = kandang → sekolah (S14a, S17a, S24b, S26, S29, S30a).
  - Gobi menunjuk Dir A pada S03 dan Dir pertanian pada S09b. Sapi yang menatap gerbang di S17a menatap Dir B.
- Bila sebuah shot menyeberangi garis tindakan, ganti sudut, jangan balik arah.

---

## 9. Ruang subtitle, tag, bubble, kartu

- Tidak ada tag, bubble, atau kartu di zona subtitle. Kartu komentar hanya di zona atas.
- **Maks 3 tag aktif** bersamaan; pada IW/IR tag di-LOD atau disembunyikan.
- Bubble Damia ("Bang, muridnya mana?" S23c; "Bang... ini murid baru?" S30c) harus terbaca penuh ≥ 1,2 dtk dan berada di atas kepala Damia, tidak di zona subtitle.
- Kartu CTA S34b/S35 memakai format EP004 dan tidak menutup wajah Gobi.

---

## 10. QA kamera

Sebelum menyerahkan shot, laporkan untuk tiap shot dialog: frame yang diuji (awal, 25%, 50%, 75%, akhir, emfasis), hasil uji sinar (lolos/gagal), dan langkah tangga yang dipakai bila gagal. Laporkan juga:
- shot mana yang memakai fade pohon (log);
- shot mana yang menyentuh zona subtitle;
- apakah mirror S32 identik dengan S01/S02a/S02b/S22a.

---

## 11. Di luar wewenangmu

- Mengubah dialog, timing VO, atau urutan cerita.
- Mengganti desain karakter atau bangunan EP004.
- Menghapus atau memindahkan dekor lama.
- Mengubah outro.

Pertanyaan yang butuh jawaban Codex C: koordinat dan ukuran nyata dari `after-ep004`, panjang rute kandang → sekolah, lebar pintu sekolah vs collider sapi, dan perilaku name tag EP004.
