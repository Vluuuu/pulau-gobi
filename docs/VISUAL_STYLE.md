# Visual Style — Pulau Gobi (mulai EP003)

## Identitas
Gaya **polished simple low-poly 3D**, bukan mesh rumit; utamakan framing, wajah/acting Gobi, shadow, warna, staging dan ritme animasi. Karakter Gobi konsisten dengan EP001/EP002.

## Sistem kamera beralasan cerita
- **IslandWide / IsometricEstablishing:** memperlihatkan ukuran dan kontinuitas pulau/posisi aset. Orthographic/isometric adalah bahasa visual utama, bukan satu-satunya sudut.
- **GobiFrontCloseup / GobiReaction:** ketika Gobi bicara/bertanya/kaget, kamera dari depan atau 3/4 sejajar wajah; mata, mulut dan gestur terbaca di layar HP.
- **ObjectDetail:** pada pembangunan satu objek (rumah/sawah/kolam/sungai/dll.), kamera mendekat ke objek, fokus tahapan, detail material/gerak dan payoff.
- **OverShoulder:** dari balik bahu Gobi saat melihat komentar atau pekerjaan.
- **ConstructionReveal / IslandReveal:** setelah aksi, kamera membuka ke medium/wide untuk menunjukkan hasil relatif bangunan lama.
- Low-angle/worm's-eye digunakan seperlunya untuk kejutan/drama, bukan setiap adegan.
- Kamera jangan diam terlalu lama saat cerita membutuhkan aksi, tetapi **jangan** melakukan zoom/pan/orbit tanpa motivasi. Atur gerak halus dan transisi tidak memotong wajah, nama warga, subtitle atau objek.

## Acting dan kehidupan
- Gobi menoleh, menunjuk, menggaruk kepala, bereaksi wajah/tubuh sesuai kata-kata; lip sync sederhana boleh bila feasible, tidak perlu sistem kompleks.
- NPC punya aktivitas sederhana yang bervariasi: jalan, berhenti, saling melihat, melambai, menyiram/mengamati tanaman bila plot mendukung. Pertahankan identitas tiap warga.
- Lingkungan bergerak halus: tanaman, awan, air, percikan/debu saat pembangunan, cahaya dan bayangan konsisten. Efek harus memperkuat cerita, bukan memenuhi layar.
- Pembangunan: anticipation → perubahan yang jelas → settle → reaksi Gobi → reveal. Gunakan efek spesifik objek yang memuaskan.
- SFX singkat dan bermakna; VO tetap dominan, subtitle kata/frasa aktif dan aman dari nama warga.

## Frame, teknis dan review
- Output standar 1080×1920 30 FPS, durasi mengikuti cerita/VO.
- Setiap shot/storyboard punya `subject`, `purpose`, `cameraPreset`, `angle`, `zoom`, `start/end`, `Gobi/NPC acting` dan `safe-area` jika relevan.
- Claude F mengelola kamera preset dan lighting reusable; Claude B menyusun shot menggunakan kontraknya. Hindari konflik pada file yang sama.
- Deterministik berbasis frame; lakukan QA Windows pada shot front close-up, detail bangunan, transisi ke wide, wajah, collision, bayangan, NPC name tag dan sinkronisasi VO.
- Pada EP003, **ukuran pulau jauh lebih besar adalah arah kreatif**, angka radius 35–40 hanya hipotesis desain sampai disetujui. Rumah/sawah/NPC EP002 jangan hilang saat kamera atau terrain berubah.
