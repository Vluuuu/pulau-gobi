# PULAU GOBI — EP006 STORYBOARD TEKNIS V1

**Judul kerja:** Hari Pertama Sekolah Pulau Gobi!  
**Status:** DRAFT SUTRADARA — belum disetujui sebagai brief implementasi. **Tidak ada coding/render.**  
**Master VO:** `eps6.mp3` — **113,240813 detik [T]**, mono 44.100 Hz, SHA256 awalan `3c2b3ce778fdd922`.  
**Format:** 1080 × 1920, 30 fps, animasi deterministik per frame.  
**Source lokal target:** world pasca-EP005 dan World Viewer terbaru; **jangan** membangun dari `main` remote yang masih tertinggal.  
**Outro:** reuse visual+VO EP004 **persis**, ±5,5 detik berdasarkan laporan Codex EP005; periksa durasi aset aktual sebelum mengunci frame.  
**Target edit:** **±142,5 detik (±4.275 frame)**, termasuk jeda kreatif dan outro. Ini **estimasi [S]**, bukan timing audio terkunci.

## 0. Konvensi bukti & larangan

- **[T]** terukur dari file: durasi, format, jeda hening. **[S]** alokasi sutradara, belum sesuai forced alignment. **[V]** butuh verifikasi sumber/konten.
- Tabel di bawah memakai **waktu VIDEO target [S]**, **bukan timecode presisi ucapan VO**. Pengembang wajib menyelaraskan cut ke ucapan dan jeda nyata setelah mendengarkan audio.
- VO asli tidak boleh diperpendek, dipercepat, disunting kata, atau dimulai/diakhiri secara terpotong. Jika butuh hold di antara kalimat, lakukan penyisipan keheningan **non-destruktif** di jeda yang telah diperiksa lewat telinga; setiap sampel asli harus dipertahankan. Jangan mengasumsikan semua jeda 0,3–0,4 dtk adalah batas dialog.
- Jangan mengubah episode 001–005 yang sudah terbit. Semua bangunan, dekorasi, warga, jalur, dan ternak yang sudah ada tetap konsisten.
- Jumlah calon warga **belum diberi angka resmi**: tunjukkan hanya setelah diverifikasi. Jangan mengarang angka atau membuat VO angka baru.
- Delapan akun 'Jadi Murid' = 8 murid permanen baru, bukan otomatis semua komentator; identitas **persis screenshot asli**; jangan menebak username dari gambar beresolusi rendah.
- `damar_zan` = **warga lama** (jangan tambah roster duplikat). `Ghanim Miyaz` = kepala sekolah dan warga baru; `velora.nyxflare` = pengusul nama sapi/warga baru apabila terpilih sesuai keputusan. **11 komentar terpilih ≠ 11 warga baru**: prediksi **10 warga baru** (8 murid + Ghanim + Velora), dengan syarat tidak ada akun ganda.
- Nama sapi harus **identik dengan jumlah dan ejaan nama yang benar-benar diusulkan Velora** setelah pengecekan literal; jangan mengarang nama untuk sapi lain apabila komentar hanya memberi satu nama. Penamaan tidak menambah jumlah sapi.

## 1. Premis, konflik, payoff

**Hook:** 'Kemarin yang masuk sekolah malah sapi; kini murid sungguhan datang.'  
**Cerita A:** kedatangan 8 murid → Ghanim kepala sekolah → Damia mengajar tentang ikan.  
**Cerita B:** komentar lama Damar → sungai dibesarkan dan dihuni ikan; murid hendak praktikum tetapi jembatan tak memadai → jembatan lama diperpanjang/diperkuat → murid menyeberang dan belajar di tepi sungai → Ghanim terciprat ikan.  
**Cerita C:** Velora menamai tiga sapi permanen → candaan sapi salah menoleh.  
**Cliffhanger:** pulang di senja hari, jalur gelap; pertanyaan lokasi lampu untuk EP007.  
**Kesimpulan dunia:** sekolah sekarang berfungsi; sungai lebih lebar tapi tetap mengalir hingga air terjun; jembatan menghubungkan dua sisi; ada ikan, area observasi, setidaknya sapi yang disebut dalam komentar menerima nama permanen, belum ada sistem lampu baru di EP006.

## 2. Shot list [S] — 38 shot, total usulan 142,50 dtk

| ID | Target VIDEO [S] | Kamera | Visual, acting & fokus | Suara/teks dan kontinuitas |
|---|---|---|---|---|
| S01 | 00:00–00:03 | FB, low-height MS | Gobi frontal bereaksi kaget di depan sekolah. Wajah ±50–65% tinggi karakter di frame; gestur tangan terbaca. | Hook, bukan aerial. |
| S02 | 00:03–00:05.5 | Fast insert, angled MS | Kilas balik **sapi EP005** masuk kelas (reuse visual / reenact dari world yang sama; jangan mengubah kejadian). | Stinger singkat, SFX terkontrol. |
| S03 | 00:05.5–00:08.5 | 3Q MS | Kembali ke Gobi menunjuk gedung sekolah yang sudah berdiri. | 'Murid benerannya datang!' |
| S04 | 00:08.5–00:12.5 | MS + subtle UI | Gobi menyebut calon warga, counter di samping (hanya angka terverifikasi). | Jika VO tak menyebut angka, counter tanpa dubbing baru. |
| S05 | 00:12.5–00:15.5 | Comment montage | Screenshot komentar nyata 'Jadi Murid' berurutan, fokus dan tidak menabrak subtitle. | Tidak membuat kartu komentar palsu. |
| S06 | 00:15.5–00:18 | Medium duo | Murid #1–2 diperkenalkan di gerbang, dua tag nama muncul ±2–3 detik. | UI nama hanya sementara. |
| S07 | 00:18–00:20.5 | Medium duo | Murid #3–4 bergabung, gestur/warna variasi tetap gaya Pulau Gobi. | 2–3 detik per nama. |
| S08 | 00:20.5–00:23 | Medium duo | Murid #5–6 datang, yang satu melambaikan tangan. | Label sementara. |
| S09 | 00:23–00:25.5 | Medium duo | Murid #7–8 menyusul; full 8 murid kini terlihat. | Tidak menghilangkan NPC lama. |
| S10 | 00:25.5–00:29 | Wide 3Q → tracking | Delapan murid **melewati gerbang**, melintasi lapangan menuju pintu utama sekolah. Gobi mengantar. | Jaga urutan akses fisik. |
| S11 | 00:29–00:32 | Dolly along corridor | Pintu utama → foyer → koridor → pintu kelas. Tidak ada teleport, kamera tidak melewati dinding. | Roof/wall cutaway hanya untuk interior. |
| S12 | 00:32–00:36 | Interior 3Q wide → OTS | Delapan murid menempati **8 meja/kursi yang ada**; aksi duduk benar (translasi hingga kursi, rotasi badan, baru pose duduk). | Satu kelas utuh, dinding/plafon jelas. |
| S13 | 00:36–00:39 | Teacher MS + board insert | Damia mengajar, membuat tanda/gambar ikan di papan, minimal 3 variasi aktivitas murid. | SFX kapur/papan ringan. |
| S14 | 00:39–00:42 | Doorway 3Q + reaction | Ghanim masuk secara fisik dari koridor, kepala sekolah memeriksa kelas; Gobi memperkenalkan. | Pengenalan 'Ghanim Miyaz' 2–3 detik. |
| S15 | 00:42–00:44 | Gobi close-up + board cut | Gobi kaget karena pelajarannya 'IKAN?!' | Pop ekspresif maksimal sekali; bukan panel di semua shot. |
| S16 | 00:44–00:47 | Comment → world match-cut | Komentar asli `damar_zan`, lalu match cut ke sungai yang sudah ada. | Damar sudah warga; bukan perkenalan warga baru. |
| S17 | 00:47–00:55 | IM object detail, 3Q wide | Sungai **diperlebar** bertahap, tanah/tepi bergeser halus, tidak menenggelamkan rumah/jalur/bangunan. | Build SFX halus, tidak berdengung terus. |
| S18 | 00:55–01:01 | Water-level MS + fish tracking | Ikan muncul **di dalam air** dengan kelompok perilaku berenang, berubah arah, 1 lompat singkat; tepian batu/tanaman ditata. | Ikannya jelas terlihat di layar ponsel. |
| S19 | 01:01–01:05 | Side 3Q wide | Perlihatkan kesinambungan sungai yang melebar hingga **air terjun EP005** tanpa ujung mesh terlihat. | Hero reveal 3–4 dtk. |
| S20 | 01:05–01:08 | 3Q tracking | Murid berjalan bersama Damia dan Ghanim menuju lokasi praktikum **melewati jalur lama**. | Jangan pindahkan delapan orang instan ke sungai. |
| S21 | 01:08–01:11 | Bridge 3Q two-sided | Jembatan yang ada tampak **terlalu pendek/sempit** untuk penampang sungai baru; kelompok berhenti aman di tepian. | Perlihatkan masalah dari satu frame yang terbaca. |
| S22 | 01:11–01:14 | Gobi frontal reaction | Gobi panik, menunjuk kedua tepi dan jembatan. | Mulut dan tangan sinkron VO. |
| S23 | 01:14–01:21 | Build 3Q + inserts | **Upgrade jembatan lama**: fondasi, bentang, papan, railing, sambungan jalan dua sisi. Jangan buat jembatan kedua yang mengambang. | Animasi konstruksi satisfying; fokus dekat objek. |
| S24 | 01:21–01:25 | Low 3Q tracking | Rombongan benar-benar menyeberang satu per satu; kaki mengikuti dek, tidak clipping railing. | Langkah kaki/cicau ringan. |
| S25 | 01:25–01:28 | Exterior 3Q | Area observasi sungai kecil, pagar dan papan informasi; murid berdiri aman menghadap air. | Bangunan tambahan kecil permanen, bukan gedung baru. |
| S26 | 01:28–01:32 | OTS Damia → fish POV | Damia menunjukkan ikan; beberapa murid menunduk, menunjuk, mencatat. | Perilaku berbeda, tidak pose sinkron. |
| S27 | 01:32–01:35 | Ghanim medium | Ghanim tampak terlalu serius sambil memberi penjelasan; satu murid mengintip ikan. | Timing reaksi. |
| S28 | 01:35–01:38 | Water insert → snap MS | Ikan melompat **secara sebab-akibat** lalu ciprat air mengenai Ghanim. SFX 'plop/splash' satu kali. | Cipratan terlihat, bukan VFX bising terus. |
| S29 | 01:38–01:40 | Two-shot reaction | Ghanim kaget, Gobi tertawa; murid berbeda-beda bereaksi. | Hold komedi tanpa mengganggu VO. |
| S30 | 01:40–01:43 | Original comment card | Komentar asli `velora.nyxflare` ditampilkan. | Pastikan nama sapi dibaca persis dari screenshot. |
| S31 | 01:43–01:49 | Cow portraits / 2–3 inserts | Tampilkan tiga sapi EP005; beri nama permanen **hanya pada sapi yang didukung komentar Velora** (jika komentar satu nama, satu sapi saja). Sorot wajah dekat, berikan pembeda visual yang tetap. | Bukan sapi baru; label nama ±2–3 detik. |
| S32 | 01:49–01:52 | Barn medium/comedy | Gobi memanggil satu nama, justru sapi sebelah menoleh; Xyree bereaksi kecil. | Komedi singkat, jangan spam 'moo'. |
| S33 | 01:52–01:56 | Sunset school wide | Kegiatan selesai, murid pulang melewati koridor/pintu/gerbang; cahaya sore alami. | Kelas tidak tiba-tiba menghilang. |
| S34 | 01:56–02:00 | Bridge tracking | Warga berjalan pulang lewat jembatan; pencahayaan perlahan redup, belum ada lampu jalan baru. | Kontinuitas rute. |
| S35 | 02:00–02:04 | Gobi close-up | Gobi melihat jalan gelap, ekspresi bingung/panik. | Hook EP007: 'Lampu jalan kita mana?!' |
| S36 | 02:04–02:15 | 3Q MS + short survey inserts | Gobi bertanya lokasi lampu, ajak komentar 'Jadi Warga' sesuai VO yang memang direkam. Tunjukkan beberapa lokasi gelap potensial (jalan sekolah, jembatan, peternakan) **tanpa** memasang lampu baru. | Hindari mengklaim semua follower otomatis jadi warga. |
| S37 | 02:15–02:17 | Gentle transition | Gobi menunjuk ke arah kamera, musik/SFX turun, beri napas visual sebelum outro. | **Jangan memotong kalimat akhir**. |
| S38 | 02:17–02:22.5 | Reuse EP004 | Outro visual + VO asli EP004 (verifikasi durasi asset). | Teks wajib persis: "Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!" |

**Kamera:** FB = frontal/bust; MS = medium shot; 3Q = three-quarter; OTS = over-the-shoulder; IM = object macro/detail. Pilih kamera berdasarkan maksud cerita; tidak ada orbit/zoom acak. Untuk dialog Gobi, framing frontal/three-quarter dengan wajah dan tangan di depan kamera, bebas occlusion. Shot wide hanya untuk tata ruang dan hero reveal.

## 3. Rancangan timing: jangan samakan VIDEO dengan VO

- **[T]** File VO satu MP3 berdurasi **113,24 detik**. Seluruh 113,24 detik harus masuk video, **sampel tidak hilang**. Jangan `playbackRate` atau trim.
- **[S]** Total video usulan **142,5 detik** = VO **113,24** + **ruang edit ±23,76 detik** + outro EP004 **±5,5 detik**. Ini alokasi budget, bukan jadwal yang wajib dipaksakan.
- **[T]** Terdeteksi keheningan pendek di sekitar 6,4–6,75; 23,09–23,49; 38,39–38,77; 48,82–49,22; 56,65–57,07; 65,45–65,84; 77,72–78,20; 88,35–88,65; 97,28–97,65; 111,05–111,29 detik pada master. **Keheningan terukur, asosiasi dengan akhir kalimat belum diverifikasi.**
- **[V]** Saat implementasi buat **EDL sumber vs edit** (untuk setiap VO segment, exact audio in/out [detik/frame], video start frame, jumlah sampel), setelah pemetaan manual kata/kalimat. Semua perubahan shot hanya memengaruhi video, bukan transkrip master.
- Sisipan visual disarankan terutama setelah perkenalan murid, reveal kelas, sungai membesar, ikan keluar, jembatan selesai, splash komedi, dan sebelum outro; gunakan hanya jeda yang cocok dengan ucapan.
- Jika 142,5 dtk terlalu panjang untuk pacing yang bagus, **kurangi hold**, bukan mempercepat VO. Jika adegan justru memerlukan waktu lebih panjang, tidak ada kewajiban mutlak durasi 142,5, selama pacing masih kuat.

## 4. Akting dan animasi — peningkatan wajib EP006

**Gobi:** kepala bergerak mengikuti objek/teman bicara, tangan memiliki tujuan (menunjuk, mengukur lebar sungai, menahan murid, bersorak); mouth/eye acting sesuai fonem/emosi; hindari satu loop melambai di semua kalimat.  
**8 murid:** jalur keluar-masuk nyata; paling tidak empat pola aksi dibagi tidak seragam (menulis, memperhatikan, menoleh, mengangkat tangan); kursi dan badan tidak clipping. Semua 8 tetap permanen setelah episode.  
**Damia:** menulis/demonstrasi di papan, mengarahkan kelas, memimpin field trip, mengawasi murid di tepi sungai.  
**Ghanim:** inspeksi kelas, gestur formal, reaksi lucu setelah terciprat; jangan masuk dari tembok.  
**Damar:** warga lama dapat cameo singkat sambil memeriksa tepi sungai (opsional; jangan buat identitas baru).  
**Xyree:** bekerja di kandang, respons pada sapi, tetapi tidak mengambil alih fokus cerita.  
**3 sapi:** lokasi tetap kandang, gerakan chewing, head-turn, ear/tail; identitas nama yang diperkenalkan harus sesuai komentar, jangan membuat nama lain tanpa keputusan.  
**Ikan:** sekolah/kelompok kecil di kedalaman bervariasi; 1 aksi meloncat deterministik untuk gag; air tidak menembus terrain dan tetap nyambung ke air terjun.

## 5. Geometri & dunia — source bersama

- Impor sekolah dari `src/world/postEp005/SchoolCampus.tsx` dan data `schoolLayout`/`schoolAsset` jika itulah model final yang dipakai di branch terbaru; pastikan sesuai `src/world/current.ts` dan World Viewer. **Tidak boleh kembali memakai interior kelas EP005 lama.**
- Gedung **dua lantai tiga sayap**, foyer, koridor, tangga, kelas 8 meja, atap utuh. `cutaway = off` di luar, `cutaway = on` terbatas interior sesuai garis pandang; kamera tidak melihat plafon hilang dari luar.
- Kembangkan/upgrade jembatan yang **sudah ada**, terhubung tepat ke dua tepian sungai dan jaringan jalan; hindari membuat jalur NPC lurus menyeberangi air.
- Perlebar hanya bagian sungai yang aman untuk terrain, sawah, rumah, kandang, dan fasilitas eksisting; periksa interaksi level air + tebing + waterfall di viewer.
- Satu dek observasi kecil dengan pagar dan akses walkway. Jangan memperkenalkan bank, Kopdes, hotel, polisi, atau lampu baru dulu; itu untuk episode berikutnya.
- Semua 10 warga baru (jika terkonfirmasi akun unik) memiliki ID permanen dan profil visual reusable. **Jumlah orang akhir = snapshot 12 warga + 10 baru = 22 warga + Gobi**, hanya apabila baseline 12 dan tidak ada akun duplikat.

## 6. Audio, captions, continuity & QA

1. VO yang dipakai benar-benar file `eps6.mp3` di atas; audit **awal dan akhir setiap kalimat**, jangan pakai penggalan yang memotong fonem. Jangan regenerasi outro.
2. SFX hanya pada aksi: bel, kapur, air, ikan/plop, papan jembatan, langkah, sedikit sapi. Hilangkan ambience/VFX dengung terus menerus; kontrol level dan ducking relatif VO. Jangan ada bunyi digital yang terdengar sebagai clipping.
3. Subtitle mengikuti **ucapan aktual**, bukan estimasi timing berbasis jumlah karakter; verifikasi manual bagian awal dan akhir kalimat. Zona aman tidak tertutup label nama/komentar.
4. Label username hanya sekitar 2–3 detik ketika diperkenalkan, tidak permanen. Screenshot komentar harus autentik dan cukup jelas dibaca di ponsel.
5. Jangan memulai cinematic scene dengan aerial tiap dialog; Gobi ekspresif front/three-quarter, NPC juga bisa close-up.
6. Periksa kamera sebelum render penuh: muka, tangan, duduk, gerbang, pintu, koridor, pagar jembatan, dek observasi, waterfall.
7. Untuk cliffhanger jangan render hitam total; jalur tetap terbaca secara visual sementara Gobi mengeluhkan penerangan. Ini **teaser**, bukan implementasi night-system EP007.
8. Outro asli masuk melalui transisi audio+visual yang tidak mendadak, tidak memotong kalimat terakhir, dan dilanjutkan beberapa frame setelah akhir suara bila dibutuhkan.
9. `tsc`, tes produksi dasar, smoke hanya **setelah integrasi**. Lulus tes tidak menggantikan preview visual nyata di Windows.

## 7. Gerbang validasi sebelum naskah/storyboard FINAL

- [ ] Verifikasi 8 username murid dari screenshot asli, urutan pemunculan, dan status apakah pernah menjadi warga sebelumnya.
- [ ] Konfirmasi **literal** berapa nama sapi yang benar-benar disebut komentar Velora dan ejaannya sebelum menampilkan label/ID.
- [ ] Pastikan angka jumlah calon warga benar-benar tersedia; bila tidak, jangan membunyikan angka palsu.
- [ ] Cocokkan kalimat naskah V1 dengan **rekaman final**: apakah ada kata diubah/dilewati, dan apakah outro termasuk di dalam MP3.
- [ ] Dengarkan dan petakan in/out setiap kalimat VO untuk EDL sebenarnya. Rencana shot 142,5 dtk bisa disesuaikan.
- [ ] Ukur ulang durasi aset outro asli EP004 (5,5 dtk hanya laporan yang diterima), cek transisinya.
- [ ] Revisi visual boleh tanpa coding sekarang; tunggu persetujuan versi sutradara.

**Status akhir:** Draft kreatif teknis siap direview; **belum** siap dikirim sebagai instruksi eksekusi Codex tanpa verifikasi audio dan username.
