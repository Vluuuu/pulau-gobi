import React, {useMemo} from 'react';
import {Villager, popScale} from './Villager';
import {VILLAGER_ROSTER, VillagerData} from './villagerRoster';
import {buildPatrol, makeObstacles, pathClearance, samplePatrol} from './villagerPath';
import {FIELD_SPOT, HOUSE_SPOT, FIELD_SCALE, HOUSE_SCALE} from './buildTimeline';
import {clamp01, easeOutBack} from './anim';
import {RevealFx} from './RevealFx';

export type VillagersProps = {
  /** Frame komposisi Remotion (useCurrentFrame()). Wajib agar gerak deterministik. */
  frame: number;
  /** Warga baru muncul (pop-in) mulai frame ini, yaitu setelah komentar terpilih dikenalkan. */
  visibleFromFrame?: number;
  /** Data warga; default = VILLAGER_ROSTER (2 warga). */
  villagers?: VillagerData[];
  /** Tampilkan nama saat diperkenalkan (hanya bila `name` terisi). Default true. */
  showName?: boolean;
  /** Lama nama tampil per warga (frame) sejak muncul, termasuk fade in/out. Default 75 (2,5 dtk @30fps). */
  nameFrames?: number;
  /** Piksel layar per unit dunia saat nama tampil (zoom kamera). Default 45 = wide shot Ep002 (64-69 dtk). */
  nameZoom?: number;
};

const FADE = 8;
/** Pantulan jatuh (0..1): mendarat di 1 dengan 2 pantulan kecil. */
const easeOutBounce = (x: number): number => {
  const n1 = 7.5625;
  const d1 = 2.75;
  if (x < 1 / d1) return n1 * x * x;
  if (x < 2 / d1) return n1 * (x -= 1.5 / d1) * x + 0.75;
  if (x < 2.5 / d1) return n1 * (x -= 2.25 / d1) * x + 0.9375;
  return n1 * (x -= 2.625 / d1) * x + 0.984375;
};
const DROP_FRAMES = 20;
const DROP_HEIGHT = 3.4;
/** Nama baru mulai muncul setelah pop-in warga hampir selesai, supaya papan tidak "melayang" saat skala kecil. */
const NAME_DELAY = 10;

/**
 * Semua warga dalam satu komponen. Posisi, arah, dan langkah murni fungsi dari
 * `frame` (lihat villagerPath.ts). Warga hanya berjalan di jalur waypoint aman.
 */
export const Villagers: React.FC<VillagersProps> = ({
  frame,
  visibleFromFrame = 0,
  villagers = VILLAGER_ROSTER,
  showName = true,
  nameFrames = 90,
  nameZoom = 45,
}) => {
  const patrols = useMemo(() => {
    const obs = makeObstacles({...HOUSE_SPOT, scale: HOUSE_SCALE}, {...FIELD_SPOT, scale: FIELD_SCALE});
    return villagers.map((v) => {
      if (pathClearance(v.path, obs) < 0) {
        // eslint-disable-next-line no-console
        console.warn(`[Villagers] jalur "${v.id}" mendekati rumah/sawah/Gobi/tepi pulau. Cek waypoint.`);
      }
      return buildPatrol(v);
    });
  }, [villagers]);

  return (
    <group>
      {villagers.map((v, i) => {
        const appear = visibleFromFrame + (v.appearDelayFrames ?? 0);
        if (frame < appear) return null;
        const s = samplePatrol(patrols[i], frame - appear);
        const since = frame - appear;
        // masing-masing warga punya jendela nama sendiri: fade in -> tahan -> fade out
        const ns = since - NAME_DELAY;
        const nameOpacity = showName && v.name
          ? clamp01(ns / FADE) * clamp01((nameFrames - ns) / FADE)
          : 0;
        // kedatangan: jatuh dengan pantulan + squash saat mendarat + lambaian singkat
        const landU = clamp01(since / DROP_FRAMES);
        const lift = (1 - easeOutBounce(landU)) * DROP_HEIGHT;
        const sq = since >= DROP_FRAMES - 2 && since < DROP_FRAMES + 8 ? 0.28 * Math.sin((Math.PI * (since - (DROP_FRAMES - 2))) / 10) : 0;
        const waveEnv = clamp01((since - (DROP_FRAMES + 4)) / 6) * clamp01((DROP_FRAMES + 70 - since) / 8);
        const wave = waveEnv * (0.85 + 0.15 * Math.sin(frame * 0.7));
        const namePop = 0.8 + 0.2 * easeOutBack(clamp01(ns / 10), 2.2);
        const home = samplePatrol(patrols[i], 0);
        return (
          <React.Fragment key={v.id}>
          <RevealFx position={[home.x, 0, home.z]} since={since} color={v.shirt} />
          <Villager
            position={[s.x, 0, s.z]}
            heading={s.heading}
            walk={s.walk}
            stride={s.stride}
            shirt={v.shirt}
            hair={v.hair}
            pants={v.pants}
            skin={v.skin}
            scale={popScale(frame, appear) * (v.scale ?? 1.65)}
            name={v.name}
            nameOpacity={nameOpacity}
            nameSide={v.nameSide}
            nameZoom={nameZoom}
            nameAccent={v.shirt}
            nameScale={namePop}
            lift={lift}
            squash={sq}
            wave={wave}
          />
          </React.Fragment>
        );
      })}
    </group>
  );
};
