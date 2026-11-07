# EP005 — visual review checkpoint, 7 November 2026

> Catatan historis sebelum QA pemilik. Revisi berikutnya dicatat di [EP005_QA_REVISI_V1_RESULT.md](docs/episodes/EP005_QA_REVISI_V1_RESULT.md). Angka timing dan status pemeriksaan di bawah tidak mewakili source revisi V1.

**WIP, not final.** Owner asked to review exactly two stills before finalization. No full MP4, push or merge has been performed.

Worktree: `D:/pulau-gobi/ep005-full` · branch: `codex/ep005-full-20261107`.
Verified parent: **76ee0c8ca6612282452286ea556798eaa2bc02f6**, local EP004 FULL. EP001–EP004 source and assets are preserved. The historical `after-ep004` JSON mentioned in the handoff does not exist in this commit; actual production World004/layout/Nature/roster/timeline are the owning continuity evidence. Do not invent a recovered historical snapshot.

## High-priority owner correction implemented

- School expanded from one classroom to a public campus: **three connected two-storey wings**, overall building footprint about **18.4 × 10.8** world units, roof height about **8.3**, multiple classrooms/windows, external corridors, balconies, main entrance canopy, **SEKOLAH PULAU GOBI** board, grass yard, fences, benches, path and animated red/white flag.
- Existing A01 classroom remains at its original coordinates with its **eight desks and blackboard**; cow door, aisle and route are retained. Upper A-wing becomes a wall-cut for the existing classroom shots. Additional wings use surveyed tree-trunk gaps. No old trees, buildings or decorations moved/deleted, and terrain radius remains **52**.
- Waterfall hero now uses a closer **side three-quarter wide**, showing river continuity, rim, cliff and falling ribbon. Moving water widens below the lip and uses per-vertex alpha over its lower third, disappearing into several drifting mist/cloud layers. The terminal row has zero alpha; no visible rectangular mesh end.

Review images (1080 × 1920):

- `out/ep005-evidence/school-exterior-scale.png`, frame **3186** / 106.20 s.
- `out/ep005-evidence/waterfall-hero.png`, frame **977** / 32.5667 s.

## Preserved implementation

Episode005 composition: **5315 frames / 177.166667 s**, 30 fps. Voice master is 135.1575 s; inserted holds total 36.5 s; exact EP004 outro interval is frames **4162–4326** inclusive (**165 frames / 5.5 s**), reused by running the original Episode004 composition at its original frame numbers.

VO master SHA-256: `1dc7e2ff95da17799f5dce0d9a3b25211a27e5883f0cccaddac7998a85316049`. Nine PCM slices rejoin bit for bit to the decoded master (see `docs/episodes/EP005_AUDIO_EVIDENCE.json`). No provisional MP3 clips, speed change, dialogue edit or newly generated outro.

Local ASR on critical windows identifies **“Lah” at approximately 93.26–93.50 s**; G5 stays before master 93.10. This is machine evidence, not a human listening claim. Local ASR also supports panen/tanam separation and the 99.70 / 110.50 shot boundaries. Captions remain **provisional phrase-level** from the approved script, not forced-aligned word captions.

All twelve permanent residents remain in CAST (nine inherited, three selected newcomers). RIS and Joy have no student status. Cows retain cow-001/002/003 IDs and walk along real coordinates; bell/latch/entry/escort chronology remains. Gate-to-class doorway route is about 20.92 units, plus 2.25 units of interior travel.

## Checks and remaining work

- Bundle and registration **PASS**; exactly the two review still outputs above were refreshed after the owner correction.
- Relevant EP004 + EP005 unit checks passed before the visual correction; campus-specific footprint/upper-storey preservation checks were added for this checkpoint.
- Typecheck has only verified baseline **TS2740** in `src/episode002/Villager.tsx:104`; no new diagnostic.
- Existing camera audit files in `out/ep005-evidence` record earlier staged passes/corrections and must **not** be described as final all-shot QA for the revised campus. One earlier S13b hand occlusion at the warteg was still pending. Final acting/camera/audio review remains open, alongside the owner's approval of these two visuals.
- Human audition of master boundaries, music/SFX mix, real-time animation playback, full final mesh/prop collision/framing review and MP4 render have **not** been completed. No final-release claim.

Open locally with `npm run dev` from this worktree, then select **Episode005**. Local node_modules is a junction to the existing dependency installation; a clean clone needs `npm ci`.
