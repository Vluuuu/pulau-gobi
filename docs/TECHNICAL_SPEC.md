# Technical Contract — Engine Pulau Gobi (Rencana)

> Dokumen ini adalah kontrak desain; saat repository pertama dibuat belum ada runtime/source final. Claude perlu memverifikasi versi dependency dan kemampuan lingkungan implementasi.
>
> Rincian arsitektur (modul, skema world state, rig Gobi, timeline, strategi Remotion/R3F, roadmap) ada di [`ARCHITECTURE.md`](ARCHITECTURE.md); keputusan final ada di [`DECISIONS.md`](DECISIONS.md). Dokumen ini sengaja ringkas agar tidak menduplikasi keduanya.

## Stack awal
React, TypeScript, Three.js, @react-three/fiber, Remotion, @remotion/three, pengelolaan data world/episode terstruktur JSON atau TS. Paket captions `@remotion/captions` bila diperlukan.

## Layer arsitektur
1. **Domain/world state**: stable IDs untuk island/terrain/resident/prop/creature/structure.
2. **Commands/events**: `addStructure`, `expandIsland`, `addResident`, `createIsland`, `addCreature`, `updateEnvironment`. Validasi terhadap state.
3. **Episode snapshots**: immutable before/after plus input komentar, sumber VO, timing.
4. **Asset registry**: geometry/material/scale/pivot/model metadata.
5. **3D renderer**: scene, lighting, orthographic camera, rig Gobi, object components.
6. **Timeline**: frame-based deterministic animation (Remotion).
7. **Sound/captions**: VO (MP3) + SFX + optional BGM, word timing.
8. **Render/export**: 9:16 composition, preview/final modes, local MP4.
9. **QA**: typecheck, unit tests state transitions, collision/bounds, snapshot regression, framing, still frames, audio timing, real render smoke test locally.

## Penting
- Gunakan `useCurrentFrame()`/`interpolate()` untuk animasi frame-based; hindari `Math.random()` tanpa seed, timer real-time, atau state yang tidak deterministik.
- Jangan memaksakan semua geometri menjadi satu scene monolitik; perkenalkan pulau baru melalui transform/world coordinates yang terstruktur.
- Jangan hardcode 1 pulau selamanya: desain multi-island sejak awal, implementasi awal hanya satu pulau.
- User render sendiri di Windows, Claude browser mengembalikan source/patch.
- Verifikasi dependency API terbaru dan konsistensi versi Remotion.

## Output tahap pertama
Urutan tahap ada di `ROADMAP.md`. Sebelum engine dibootstrap, dilakukan **Visual Pre-Production** (desain Gobi, palet, style pulau, kamera dan lighting lewat still) hingga standar visual dikunci. Output engine tahap pertama (setelah itu): proyek baru dengan lint/typecheck, satu model Gobi, satu pulau kecil kosong tanpa struktur/vegetasi, kamera dan lighting, satu komposisi episode berbasis VO Indonesia **final**, outro permanen, dan script preview/render lokal.
