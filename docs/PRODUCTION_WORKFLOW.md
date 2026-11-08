# Workflow Produksi Pulau Gobi — 6 Spesialis

## Sumber kebenaran
- GitHub: https://github.com/Vluuuu/pulau-gobi (`main`); EP001–EP002 source sudah ada. Tag baseline `ep002-v4-approved`.
- Pemilik melakukan preview/render Windows dan persetujuan akhir. ChatGPT melakukan konsep, storyboard, brief, review/QA, koordinasi dan dapat memperbarui docs lewat GitHub.
- Claude bekerja di **Claude Browser**, menggunakan source terbaru dari GitHub. Jika konektor tidak memungkinkan write, hasilkan patch/ZIP dengan manifest; jangan buat ulang proyek.
- ElevenLabs untuk VO bahasa Indonesia. MP4 final, node_modules, cache, secret dan ZIP kerja jangan di-commit.
- **Repo saat pemeriksaan terakhir public**; hindari klaim private atau perubahan visibilitas tanpa keputusan owner.

## Spesialisasi dan pemilik perubahan
| Sesi | Peran | Pemilik utama |
| --- | --- | --- |
| Claude A | World Builder | terrain, expansion, asset bangunan, tanaman, kolam/sungai/lingkungan |
| Claude B | Episode Director | `EpisodeNNNScene`, script staging, per-shot direction, timeline dan integrasi |
| Claude C | Audio & Captions | caption timelines, timing VO, SFX, audio mix |
| Claude D | Character & NPC | Gobi/NPC meshes, reusable animation, expression, name tag visual |
| Claude E | Population & World State | registrasi/kandidat, roster, ID stabil, class biasa/spesial, snapshot state |
| Claude F | Cinematography | shot/camera presets, camera transitions, lighting presets |

**Aturan koordinasi:** tentukan file ownership sebelum tugas paralel. B tidak boleh menulis ulang sistem kamera F, rig D, roster E, environment A atau subtitles C tanpa sinkronisasi. E mendefinisikan **data** warga, D merender **visual**. B mengatur **kapan dan di mana** karakter/shot digunakan. Gunakan sesi seperlunya, bukan seluruh enam setiap episode.

## Rujukan wajib EP007 dan seterusnya

**Sebelum implementasi episode berikutnya, wajib membaca [EP006 Postmortem & Standar QA](production/EP006_POSTMORTEM_AND_FUTURE_QA.md)** bersama konteks produksi, keputusan dunia, storyboard final dan world state terbaru. EP006 sudah dipublikasikan dan tidak direvisi lagi; dokumen ini merupakan evaluasi untuk produksi mendatang.

Checklist dokumen tersebut menjadi **gate QA wajib sebelum owner render/publish**: VO bebas replay/overlap tak sengaja dan wajib listening review, subtitle dengan word-level active highlight yang sinkron, sinematografi dengan intent dan konteks jelas, blocking berdasarkan ukuran tubuh sepanjang gerakan, serta outro resmi sekali lengkap dalam world state episode aktif. Untuk EP007+, ikuti batas validasi efisien dalam dokumen tersebut: satu typecheck dan grup tes terarah, ulang hanya kasus gagal setelah diperbaiki; tidak menjalankan render, still, screenshot, preview browser otomatis atau camera sweep massal atas inisiatif sendiri. Persetujuan kualitas tetap memerlukan preview penuh oleh owner di Windows, bukan hanya tes kode.

## Alur per episode
1. ChatGPT + owner pilih komentar/kandidat, sepakati arah kreatif, hook, konsekuensi, payoff, CTA. Gunakan world snapshot episode sebelumnya.
2. Susun naskah dan storyboard **termasuk type shot kamera** serta target close-up, aktivitas warga, dan efek pembangunan. Finalkan ide dan durasi fleksibel.
3. ElevenLabs hasilkan VO final; siapkan file MP3/timing subtitle.
4. Buat brief: baseline commit/tag, file yang boleh diedit per spesialis, ketergantungan antar tugas, acceptance criteria, perkiraan timing, asset references, before/after world state.
5. A/D/E/F bisa bekerja paralel hanya bila tidak menyentuh file yang sama. C mengerjakan caption, B mengorkestrasi setelah API/komponen stabil. Setiap Claude memberi patch/manifest + test PASS/FAIL/NOT-RUN.
6. Integrasikan patch ke branch kerja dari main terbaru (jangan salin ZIP buta), jalankan test numerik/typecheck dan periksa import **case-insensitive Windows**. Laporkan yang belum dijalankan.
7. Windows: `npm install` bila dependensi berubah, `npm run test:all`, `npm run dev`, pilih komposisi, preview, kemudian `npm run render:epNNN` jika script tersedia.
8. ChatGPT/owner review MP4/frame nyata: Gobi saat berbicara menghadap kamera, zoom objek, reaksi, caption, NPC name tags, continuity objek, camera smoothness, soft shadows, VO/outro.
9. Setelah owner setuju: merge code + update docs/episode snapshots + tag rilis yang layak; publikasi dan evaluasi komentar/follow/retensi.

## Praktik Git
- Jangan menimpa Episode001/002 approved. Simpan snapshot dunia secara append-only sebagai rekam cerita.
- Cabang/patch minimal; branch per kepemilikan. Manifest wajib. Hindari editing file yang sama dari dua Claude secara paralel.
- Source repository dan nama file kompatibel Windows: jangan buat dua file yang hanya beda kapitalisasi, mis. `IslandDecor.tsx` vs `islandDecor.ts`.
- Jangan mengklaim full typecheck/render PASS tanpa bukti. Source/tes komputer terpisah dari QA visual.
