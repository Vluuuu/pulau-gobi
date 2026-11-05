# Skill References

Skill adalah referensi instruksi untuk coding agent. **Claude Browser tidak otomatis mewarisi skills CLI** hanya karena repository punya link atau karena `npx skills add` dijalankan di laptop. Lampirkan `SKILL.md` relevan + referensi yang dibutuhkan di Claude Project, atau gunakan kemampuan lingkungan yang benar-benar tersedia.

## Prioritas pertama
- Remotion official: https://github.com/remotion-dev/skills — khususnya `remotion-best-practices`, `remotion-create`, `remotion-markup`, dan **`remotion-captions`**.
- Three.js community: https://github.com/cesartevisual/threejs-skills — `threejs-scene`, `threejs-geometry`, `threejs-materials`, `threejs-lighting`, `threejs-animation`, `threejs-r3f`.

## Ketika perlu
- `threejs-performance`, `threejs-debugging`, `threejs-testing` untuk scene makin berat dan regression visual.
- Microsoft Playwright CLI https://github.com/microsoft/playwright-cli untuk lokal screenshot/test browser (tidak wajib saat fase pertama).

## Jangan dulu
- Blender pipeline besar, physics engine penuh, WebGPU shaders kompleks, cloud render, autopost ke platform, backend Supabase, automation komentar.

Sebelum memakai repo skills pihak ketiga: periksa SKILL.md, scripts dan keamanan, serta dokumentasi terbaru dari paket asli.
