# Episode 001 — Gobi Nyasar ke Pulau Kosong

> Status: **script-ready / storyboard disetujui (2026-11-05)**. VO final ElevenLabs belum dibuat. Durasi scene masih estimasi dan harus disesuaikan dengan MP3 final. Tidak ada kode/preview/render episode.

## Identitas
- Episode ID: `ep001`
- Judul kerja: **Gobi Nyasar ke Pulau Kosong!**
- Fokus: kenalkan Gobi dan dunia pulau melayang; undang penonton menentukan pembangunan pertama.
- Komentar terpilih: **belum ada** (episode pembuka).
- World snapshot awal/akhir yang direncanakan: satu pulau melayang kecil + Gobi (`res:gobi`); nol bangunan, nol pohon, nol penghuni tambahan. Tidak ada pembangunan pada episode ini.
- Gaya: simple cozy low-poly 3D, sesuai kualitas prototipe Tiny Island sebagai target visual (bukan menyalin source prototipe).

## Naskah VO — satu suara Gobi, Bahasa Indonesia

Hah? Aku di mana ini?

Kok kosong banget? Rumah nggak ada... pohon juga nggak ada.

Eh, bentar... WOI! Ini pulaunya melayang?!

Terus aku tinggal di sini? Lah... nanti tidur di mana?

Eh, kalian bantuin aku, dong! Menurut kalian, kita harus bikin apa dulu di pulau ini?

Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!

**Catatan:** Buat satu VO karakter Gobi tanpa narator terpisah. Jeda, intonasi heran/panik/lucu mengikuti adegan. Tidak perlu lip-sync rumit. Outro harus persis seperti baris terakhir.

## Storyboard — perkiraan, bukan timing final

| Waktu kasar | Visual / kamera | Acting Gobi | Audio / teks |
| --- | --- | --- | --- |
| 0–4 dtk | Wide pulau melayang benar-benar kosong, lalu poof sederhana | Gobi tiba-tiba muncul, menoleh bingung | "Hah? Aku di mana ini?" |
| 4–10 dtk | Medium pulau bagian atas | Menoleh kiri-kanan, berjalan beberapa langkah | "Kok kosong banget?..." |
| 10–17 dtk | Sudut memperlihatkan tepi dan bawah pulau | Mengintip ke bawah, kaget, langsung mundur | "WOI! Ini pulaunya melayang?!" |
| 17–24 dtk | Medium, pulau tetap kosong | Duduk sebentar atau mencoba rebahan lalu sadar tidak ada tempat nyaman | "Terus aku tinggal di sini?..." |
| 24–akhir | Gobi menghadap kamera, gestur mengajak; kembali wide sederhana | Menunjuk/melambai kepada penonton | Pertanyaan "kita harus bikin apa dulu?" lalu outro permanen |

Tidak perlu efek kompleks: poof, body/head pose sederhana, pan/zoom seperlunya. Pastikan hook terlihat dalam 3 detik pertama. Semua scene memakai pulau dan karakter **yang sama**.

## Aturan produksi

- Visual: Gobi semi-chibi, kaos oranye, celana pendek navy, sepatu krem; satu pulau organik melayang di langit, awan dan pencahayaan sederhana. Tidak ada lautan.
- Tidak boleh ada bangunan/pohon/pembangunan sebelum komentar Episode 002 dipilih.
- Subtitle Indonesia mengikuti VO; highlight aktif boleh, keterbacaan lebih penting daripada banyak efek.
- Tidak perlu Asset Lab, character sheet multi-angle, library animasi lengkap, world simulation rumit, atau render MP4 di Claude.
- Kode Three.js/R3F + Remotion seminimal mungkin, reusable untuk episode berikutnya; animasi berdasarkan frame, bukan runtime acak.
- Voice dan timing harus dikonfirmasi dari MP3 ElevenLabs sebelum menetapkan durasi Remotion final.
- Outro wajib persis: **"Kalian yang komen, kita yang bangun. Yuk, bangun pulau ini bareng-bareng!"**

## Tahapan dan QA
- [x] Konsep cerita dan interaksi komentar disetujui.
- [x] Naskah dialog dan storyboard awal disusun.
- [ ] MP3 final Gobi dari ElevenLabs tersedia; rekaman voice outro dapat digunakan kembali.
- [ ] Timing subtitle disusun dari audio nyata.
- [ ] Claude Browser mengimplementasikan MVP.
- [ ] Preview 9:16 dan QA animasi/framing di laptop.
- [ ] Render lokal 1080×1920 30 FPS, QA PASS, publish.
