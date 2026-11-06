import React from 'react';
import {BuildAnimProps, easeOutBack, hash01, resolveProgress, seg} from './anim';
import {ISLAND_EXPAND_FRAMES, ISLAND_EXPANDED_SCALE} from './buildTimeline';
import {ROCKS, polyRadius, rockPlacement} from './islandRocks';
import {GroundRing} from './BuildFx';

export type ExpandedIslandProps = BuildAnimProps & {
  /** Radius akhir relatif terhadap Ep001 (default 3.9). */
  finalScale?: number;
};

// Tiga "pulse" perluasan yang saling tumpang-tindih (tanah bertambah bertahap).
const STAGES: [number, number][] = [
  [0.0, 0.4],
  [0.3, 0.7],
  [0.6, 1.0],
];

/** Skala radius saat ini: tepat 1 di progress 0 dan tepat `final` di progress 1. */
export const islandRadiusScale = (p: number, final: number): number => {
  let sum = 0;
  for (const [a, b] of STAGES) sum += easeOutBack(seg(p, a, b), 1.2);
  return 1 + ((final - 1) * sum) / STAGES.length;
};

/**
 * Pulau Ep001 yang sama (geometri, warna, flatShading dari Island.tsx), diperbesar horizontal.
 * Batu menempel pada permukaan kerucut (islandRocks.ts).
 * Tidak menyertakan Gobi/rumah/sawah.
 */
export const ExpandedIsland: React.FC<ExpandedIslandProps> = (props) => {
  const p = resolveProgress(props, ISLAND_EXPAND_FRAMES);
  const final = props.finalScale ?? ISLAND_EXPANDED_SCALE;
  const s = islandRadiusScale(p, final);
  // Batu bawah ikut makin dalam, tapi puncaknya tetap menempel di dasar tanah (y=-1.1).
  const ys = 1 + (s - 1) * 0.45;
  const coneH = 2.7 * ys;

  return (
    <group>
      {/* rumput */}
      <mesh position={[0, -0.15, 0]} rotation-y={Math.PI / 8} scale={[s, 1, s]}>
        <cylinderGeometry args={[3, 3, 0.3, 8]} />
        <meshStandardMaterial color="#7ed957" flatShading />
      </mesh>
      {/* tanah */}
      <mesh position={[0, -0.7, 0]} rotation-y={Math.PI / 8} scale={[s, 1, s]}>
        <cylinderGeometry args={[3, 2.5, 0.8, 8]} />
        <meshStandardMaterial color="#9a6b43" flatShading />
      </mesh>
      {/* batu runcing */}
      <mesh position={[0, -1.1 - coneH / 2, 0]} rotation={[Math.PI, Math.PI / 8, 0]} scale={[s, ys, s]}>
        <coneGeometry args={[2.5, 2.7, 8]} />
        <meshStandardMaterial color="#7a7f8c" flatShading />
      </mesh>
      {/* batu: ditempel pada permukaan kerucut yang sedang tampil (lihat islandRocks.ts),
          jadi selalu menyatu dengan kontur pulau, juga saat animasi perluasan */}
      {ROCKS.map((rk, i) => {
        const grow = rk.b <= rk.a ? 1 : easeOutBack(seg(p, rk.a, rk.b), 1.6);
        if (grow <= 0.001) return null;
        const {position, size} = rockPlacement(rk, s, ys);
        const k = size * grow;
        return (
          <mesh
            key={i}
            position={position}
            rotation={rk.kind === 'spike' ? [Math.PI, rk.spin[1], 0] : rk.spin}
            scale={[k, k * rk.sy, k]}
          >
            {rk.kind === 'spike' ? <coneGeometry args={[0.6, 1, 5]} /> : <dodecahedronGeometry args={[1, 0]} />}
            <meshStandardMaterial color={rk.color} flatShading />
          </mesh>
        );
      })}

      {/* cincin cahaya di tepi tanah yang sedang tumbuh (V4): terbaca jelas dari kejauhan */}
      {STAGES.map(([a, b], k) => {
        const u = seg(p, a, b);
        if (u <= 0 || u >= 1) return null;
        return (
          <mesh key={`rim-${k}`} position={[0, 0.03, 0]} rotation-x={-Math.PI / 2} scale={3 * s * 0.9}>
            <ringGeometry args={[0.93, 1, 40]} />
            <meshBasicMaterial color="#fffbd0" transparent opacity={0.7 * Math.sin(Math.PI * u)} depthWrite={false} />
          </mesh>
        );
      })}
      {/* riak dari tengah pada pulsa pertama */}
      <GroundRing position={[0, 0.04, 0]} u={seg(p, 0, 0.5)} r0={1} r1={3 * s * 0.85} opacity={0.35} />

      {/* debu: 12 gumpalan putih di tepi tiap tahap, membesar lalu mengecil */}
      {STAGES.map(([a, b], k) =>
        Array.from({length: 12}, (_, i) => {
          const u = seg(p, a, b);
          const puff = Math.sin(Math.PI * u);
          if (u <= 0 || u >= 1 || puff < 0.01) return null;
          const ang = (i / 12) * Math.PI * 2 + Math.PI / 8 + k * 0.2;
          const rad = polyRadius(ang, 3 * s) * 0.97; // tepat di dalam tepi segi-8
          return (
            <mesh
              key={`${k}-${i}`}
              position={[Math.sin(ang) * rad, 0.15 + u * 0.5, Math.cos(ang) * rad]}
              scale={puff * (0.28 + 0.12 * hash01(i + k * 8))}
            >
              <icosahedronGeometry args={[1, 0]} />
              <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.4} flatShading />
            </mesh>
          );
        }),
      )}
    </group>
  );
};
