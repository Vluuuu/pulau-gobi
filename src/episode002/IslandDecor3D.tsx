import React from 'react';
import {easeOutBack, seg} from './anim';
import {ISLAND_EXPAND_FRAMES} from './buildTimeline';
import {ContactShadow} from './BuildFx';
import {DECOR} from './islandDecor';
import type {DecorItem} from './islandDecor';

const LEAF = ['#4fb04a', '#5cc055', '#3f9d4a', '#69c85a'];
const BUSH = ['#58b84e', '#6cc95d', '#4aa845', '#7ad060'];
const PETAL = ['#ff6b8b', '#ffd23f', '#ffffff', '#b48cff'];

const Tree: React.FC<{d: DecorItem; k: number}> = ({d, k}) => (
  <group scale={d.size * k}>
    <ContactShadow position={[0.1, 0, 0.05]} rx={1.0} rz={0.85} opacity={0.3} />
    <mesh position={[0, 0.5, 0]}>
      <cylinderGeometry args={[0.14, 0.2, 1.0, 6]} />
      <meshStandardMaterial color="#8b5a2b" flatShading />
    </mesh>
    <mesh position={[0, 1.55, 0]} rotation-y={d.rot}>
      <icosahedronGeometry args={[0.85, 0]} />
      <meshStandardMaterial color={LEAF[d.variant]} flatShading />
    </mesh>
    <mesh position={[0.05, 2.3, 0]} rotation-y={d.rot + 1}>
      <icosahedronGeometry args={[0.58, 0]} />
      <meshStandardMaterial color={LEAF[(d.variant + 1) % 4]} flatShading />
    </mesh>
  </group>
);

const Bush: React.FC<{d: DecorItem; k: number}> = ({d, k}) => (
  <group scale={d.size * k}>
    <ContactShadow position={[0.05, 0, 0.03]} rx={0.7} rz={0.6} opacity={0.26} />
    <mesh position={[0, 0.32, 0]} rotation-y={d.rot} scale={[1, 0.78, 1]}>
      <icosahedronGeometry args={[0.52, 0]} />
      <meshStandardMaterial color={BUSH[d.variant]} flatShading />
    </mesh>
    <mesh position={[0.34, 0.2, 0.1]} rotation-y={d.rot + 2} scale={[1, 0.8, 1]}>
      <icosahedronGeometry args={[0.32, 0]} />
      <meshStandardMaterial color={BUSH[(d.variant + 2) % 4]} flatShading />
    </mesh>
  </group>
);

const Flower: React.FC<{d: DecorItem; k: number; sway: number}> = ({d, k, sway}) => (
  <group scale={d.size * k} rotation={[sway, d.rot, sway * 0.6]}>
    <mesh position={[0, 0.17, 0]}>
      <cylinderGeometry args={[0.018, 0.022, 0.34, 4]} />
      <meshStandardMaterial color="#3f9d4a" flatShading />
    </mesh>
    <mesh position={[0, 0.37, 0]}>
      <icosahedronGeometry args={[0.1, 0]} />
      <meshStandardMaterial color={PETAL[d.variant]} flatShading />
    </mesh>
    <mesh position={[0, 0.4, 0.06]}>
      <sphereGeometry args={[0.04, 5, 5]} />
      <meshStandardMaterial color="#ffb300" flatShading />
    </mesh>
  </group>
);

const Tuft: React.FC<{d: DecorItem; k: number; sway: number}> = ({d, k, sway}) => (
  <group scale={d.size * k} rotation={[0, d.rot, 0]}>
    {[-0.07, 0, 0.07].map((x, i) => (
      <mesh key={i} position={[x, 0.15, 0]} rotation={[sway * (i + 1) * 0.5, 0, (i - 1) * 0.28]}>
        <coneGeometry args={[0.045, 0.32, 4]} />
        <meshStandardMaterial color={i === 1 ? '#4faa44' : '#63c257'} flatShading />
      </mesh>
    ))}
  </group>
);

const Pebble: React.FC<{d: DecorItem; k: number}> = ({d, k}) => (
  <mesh position={[0, 0.07 * d.size, 0]} rotation={[d.rot, d.rot * 2, 0]} scale={[d.size * k * 0.2, d.size * k * 0.13, d.size * k * 0.17]}>
    <dodecahedronGeometry args={[1, 0]} />
    <meshStandardMaterial color={d.variant % 2 ? '#9aa0ab' : '#858b98'} flatShading />
  </mesh>
);

/**
 * Dekorasi pulau besar (V4) agar wide shot tidak kosong. Muncul bertahap (pop + overshoot) mengikuti
 * tepi tanah yang membesar. Murni dari `frame`. Posisi dari islandDecor.ts (diuji tidak menabrak aset/aktor).
 */
export const IslandDecor: React.FC<{frame: number; startFrame: number}> = ({frame, startFrame}) => {
  if (frame < startFrame) return null;
  return (
    <group>
      {DECOR.map((d, i) => {
        const a = startFrame + d.delay * ISLAND_EXPAND_FRAMES;
        const k = easeOutBack(seg(frame, a, a + 14), 1.8);
        if (k <= 0.001) return null;
        const sway = Math.sin(frame * 0.07 + d.phase) * 0.07;
        return (
          <group key={i} position={[d.x, 0, d.z]}>
            {d.kind === 'tree' && <Tree d={d} k={k} />}
            {d.kind === 'bush' && <Bush d={d} k={k} />}
            {d.kind === 'flower' && <Flower d={d} k={k} sway={sway} />}
            {d.kind === 'tuft' && <Tuft d={d} k={k} sway={sway} />}
            {d.kind === 'pebble' && <Pebble d={d} k={k} />}
          </group>
        );
      })}
    </group>
  );
};
