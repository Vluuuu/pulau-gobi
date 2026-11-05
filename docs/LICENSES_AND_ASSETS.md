# Lisensi dan Aset (D10)

> **Catatan awal, bukan nasihat hukum.** Isi di bawah dirangkum dari halaman resmi yang dibaca pada **2026-11-05**. Syarat dapat berubah; owner memverifikasi ulang sebelum publikasi komersial dan setiap kali paket/layanan berubah.

## Layanan dan perangkat lunak

| Item | Ringkasan syarat (dari sumber resmi) | Sumber | Tindakan owner |
| --- | --- | --- | --- |
| **Remotion** | Gratis untuk individu dan organisasi/tim hingga 3 orang (termasuk penggunaan komersial dan monetisasi video yang dihasilkan). Di atas itu perlu Company License. Tidak boleh menjual Remotion itu sendiri sebagai produk. Halaman FAQ menyebut **Remotion 5.0 akan mengubah lisensi dan ketentuan** agar telemetri wajib untuk pelanggan "Automators"; tanggal rilis tidak tercantum. Telemetri server-side rendering bersifat sukarela untuk lisensi gratis dan Creators (menurut halaman tersebut). | https://www.remotion.dev/docs/license/faq | Konfirmasi kategori yang berlaku untuk Anda dan tim. Cek ulang sebelum memutakhirkan ke versi mayor baru. |
| **ElevenLabs** (VO, outro) | Paket gratis **tidak** mencakup lisensi komersial dan wajib atribusi bila dipublikasikan. Semua paket berbayar menyertakan lisensi komersial (di luar Beta Services). Konten yang dibuat di luar langganan berbayar tidak dapat dipakai komersial. | https://elevenlabs.io/docs/help-center/legal/can-i-publish-the-content-i-generate-on-the-platform | Hasilkan VO final dan outro saat berlangganan berbayar. Simpan catatan paket dan tanggal pembuatan per file. Cek Ketentuan Layanan Khusus. |
| **ElevenLabs timestamps** | Endpoint *text-to-speech with timestamps* mengembalikan alignment per karakter. Dukungan Bahasa Indonesia tidak disebut eksplisit di halaman referensi API. | https://elevenlabs.io/docs/api-reference/text-to-speech/convert-with-timestamps | Konfirmasi model dan bahasa saat VO pertama dibuat. |
| **three.js, @react-three/fiber, React, Vitest, ESLint** | **Belum diverifikasi.** Lisensi dibaca dari field `license` paket dan repositori resmi di Stage 1. | (Stage 1) | — |
| **Node.js** | Versi LTS ditentukan di Stage 1 (D6). | https://nodejs.org/about/previous-releases | Beri tahu hasil `node -v` dan `npm -v` laptop Windows. |

## Aset (font, musik, SFX, model, tekstur)

Belum ada yang dipilih. Aturan: **tidak ada aset masuk repo atau episode tanpa baris di tabel ini.**

| ID aset | Jenis | Sumber/URL | Lisensi dan syarat (kutip) | Atribusi wajib? | Boleh komersial? | Tanggal dicek | Dipakai di |
| --- | --- | --- | --- | --- | --- | --- | --- |
| _(kosong)_ | | | | | | | |

Aset buatan sendiri (procedural, termasuk Gobi) dicatat sebagai `original`, dengan pemilik hak yang jelas. Untuk audio ElevenLabs, catat file, paket langganan saat dibuat, dan tanggal.
