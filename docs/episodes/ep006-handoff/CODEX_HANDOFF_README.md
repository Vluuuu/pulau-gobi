# PULAU GOBI — EP006 CODEX HANDOFF

Status: **PRODUCTION HANDOFF — CODE ONLY / NO RENDER**. Story direction approved; exact source/VO timing and usernames still require verification. **Do not alter/publish already released EP001–EP005.**

## Primary source and entry point

- Latest user-approved **local** branch: `codex/world-viewer`, commit `3759f2e`, working directory `D:\pulau-gobi\world-viewer`.
- That branch derives from post-EP005 world polish commit `9b0a22b`, with approved school, interactive 3D World Viewer and `src/world/current.ts`.
- Check actual local git status, working tree, commit ancestry, and imports; **do not switch to stale `main` or older EP005 school**. Do not assume the branch exists in GitHub remote.
- Treat `PULAU_GOBI_EP006_STORYBOARD_TEKNIS_V1.md` as the 38-shot *director draft*, not locked audio EDL. Exact shot times only become valid once mapped to the real VO.
- Input VO: `audio/eps6.mp3`, duration **113.240813 seconds** (ffprobe, mono 44.1 kHz).
- Original screenshots in `comments/`, 8 'Jadi Murid' plus 3 other comments. Do not create fake comment screenshots or invent usernames, and avoid assigning resident IDs before checking literal usernames and existing roster for duplication.

## Mandatory pre-flight BEFORE implementation

1. **Check source**: inspect local `src/world/current.ts`, `src/world/postEp005/*`, `World Viewer`, school asset/layout, resident roster, old bridge and river/waterfall geometry, existing cows, EP004 outro audiovisual asset, and assets available to reuse.
2. **Build a literal comment manifest**: 8 student username strings copied from original screenshots with exact spelling/case, one idea from `damar_zan` (already an old resident), `Ghanim Miyaz` as new headmaster, `velora.nyxflare` as naming contributor. For low-resolution ambiguity, report the alternatives and wait for user correction before writing an identity to permanent data. **11 selected comments are not 11 new residents**; likely 10 new subject to duplicate check. Do not claim automatic follower verification.
3. **Cow name check**: copy the exact names *actually specified* by Velora, and map only those names to actual existing cows (3 cows total). Do not invent other names.
4. **Listen/align the actual MP3 with the spoken words**: write a sentence/phrase-level EDL: original audio source in/out and destination timeline start (frame). Preserve every original voice sample; avoid cuts at phoneme boundaries and unneeded audio overlaps. Investigate whether the master includes outro speech before appending reused EP004 outro (never double-play it).
5. **Number of applicant citizens**: do not invent the number. If not available, omit the numeric overlay and use only what the actual voice says. If recorded VO claims an unspecified number, flag it rather than patching a random number.
6. After preflight, **report any blockers/identity ambiguity before making an irreversible roster change**. For unblocked work, continue EP006 implementation in new branch `codex/ep006-production` (or safe nonconflicting variant), preserving the baseline.

## Narrative sequence (approved)

1. Hook: cow entered class in EP005, but now 8 actual students arrive.
2. Introduce 8 student residents, real school arrival path, teacher Damia teaching and new headmaster Ghanim.
3. Damar's old comment: widen the existing river safely and add swimming fish; maintain the stream-to-waterfall continuity.
4. Field-trip obstacle: existing bridge now doesn't fit widened river. **Upgrade the same bridge** with railing and connected footpaths, don't create floating duplicate bridge. NPCs traverse it physically.
5. River observation with eight students, Damia and Ghanim; fish splash comedy gag with reaction shot.
6. Velora's cow naming comment: same 3 cows, name only as the actual evidence permits; comical wrong cow reaction.
7. Sunset: walking home becomes dark; **tease street lighting for EP007**; do not build new lamps during EP006. Reuse full exact EP004 outro with a deliberate transition.

## Cinema and animation quality gate

- 1080x1920, 30FPS, deterministic animation by frame.
- During Gobi dialogue: frontal/3Q medium or closer; face, eyes, mouth, hands visible, no occlusion. Wide only when motivated by place/scale. **Camera audit metrics are not a substitute for aesthetic review.**
- Students must walk physically from gate → courtyard → main door → foyer/corridor → classroom and sit in eight actual chairs (no jump/teleport), with distinct behaviors and readable close-up action. Classroom is the latest polished full building: exterior intact, cutaway ONLY for interior shot.
- Ghanim follows doors/corridors; Damia actually writes/teaches; fish move through water and splash plausibly; Gobi reacts. Cow/NPC/hand animation should not be stiff looping poses.
- Construction needs readable progression, human scale and shot framing. Water and objects should not visibly clip. Tree/road/field/building continuity must remain permanent.
- Sound: source VO dominant, subtle purposeful SFX, no constant electronic/buzzing overlays, no cut words. Captions from actual spoken words with safe area and 2–3s name labels only during introduction.
- Outro: use original EP004 visual and VO complete; don't use the flawed EP005 end timing or regenerate words. Provide intentional audio/video transition and post-audio visual hold.

## Process and deliverables

- **ABSOLUTE: DO NOT RENDER** in this Codex run: no Remotion MP4, still frame, screenshots/contact sheets, browser screenshots, preview exports, or automated visual capture. Prepare `Episode006` code for the user to preview locally at their discretion.
- **AVOID LONG/REPEATED COMMANDS**: no repeated camera audits, no per-shot test loops, no full-browser smoke loops, no benchmarking, no repeated `npm run build`, no repeated `tsc`, and no redundant dependency installs. Read files with selective inspection rather than scanning the entire repository repeatedly.
- Run **one minimal verification pass at the end**: TypeScript check once and only the most relevant targeted test(s) once, if feasible. If a new error is caused by the patch, fix it and rerun only the failed targeted check; do not cycle tests indefinitely. Known `Villager.tsx:104` `TS2740` must be labeled baseline unless code actually fixes it.
- **Do not leave long-running development servers/browser automation running**. Do not do automatic previews on Codex side. The user will run World Viewer and Remotion Studio on Windows.
- First implement architecture/world changes and reuse assets; user checks world expansion in their 3D World Viewer, and then `Episode006` in local Remotion Studio. Full MP4 renders require a new explicit request from the user.
- Limit automated tests to those needed for changes: TS, targeted logic and smoke, no endless camera audit loops. Test actual source, do not claim full video quality from tests.
- Expose status/commit hash/file list, world snapshot and student roster, final shot/audio EDL, what passed/failed, and explicit Windows commands for (a) World Viewer, (b) Remotion Studio.
- No pushes or merge unless user explicitly requests.

## Included source files

- `PULAU_GOBI_EP006_STORYBOARD_TEKNIS_V1.md`: director's 38-shot storyboard, provisional timeline.
- `audio/eps6.mp3`: approved voice master; **do not speed up or rewrite**.
- `comments/`: original 11 screenshot crops; tiny screenshots need visual verification.

## Outstanding producer data

- Confirm exact eight student usernames from screenshots.
- Confirm Velora's cow name suggestion literally.
- Confirm count of candidate citizens if mentioned in final VO (do not assume count from prior episodes).
- Confirm final VO wording and whether outro spoken content is present in MP3.
- Confirm actual EP004 outro asset length and reuse path in local source.
