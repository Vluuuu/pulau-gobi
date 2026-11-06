import React from 'react';
import {Sparkles, GroundRing, DustBurst} from './BuildFx';
import {clamp01, easeOutCubic} from './anim';

/** Lama efek kedatangan warga (frame @30fps). */
export const REVEAL_FX_FRAMES = 34;

/**
 * Efek kedatangan warga (V4): tiang cahaya turun, riak di tanah, debu & kilau.
 * Murni dari `since` (frame sejak warga muncul). Ditaruh di koordinat dunia (bukan di grup warga),
 * jadi tidak ikut skala pop-in.
 */
export const RevealFx: React.FC<{position: [number, number, number]; since: number; color: string}> = ({position, since, color}) => {
  const u = since / REVEAL_FX_FRAMES;
  if (u < 0 || u >= 1) return null;
  const beamIn = easeOutCubic(clamp01(u / 0.3));
  const beamOut = clamp01((u - 0.35) / 0.65);
  const radius = 0.95 * (1 - 0.6 * beamOut);
  const opacity = 0.55 * (1 - beamOut) * beamIn;
  return (
    <group position={position}>
      <mesh position={[0, 3.6, 0]}>
        <cylinderGeometry args={[radius * 0.7, radius, 7.2, 14, 1, true]} />
        <meshBasicMaterial color="#fffbd8" transparent opacity={opacity} depthWrite={false} />
      </mesh>
      <GroundRing position={[0, 0.05, 0]} u={u} r0={0.5} r1={2.6} color="#ffffff" opacity={0.7} />
      <GroundRing position={[0, 0.06, 0]} u={clamp01(u * 1.3 - 0.1) || -1} r0={0.4} r1={1.9} color={color} opacity={0.6} />
      <DustBurst position={[0, 0.1, 0]} u={clamp01((u - 0.3) / 0.6) || -1} count={10} radius={1.5} size={0.28} rise={0.5} color="#ffffff" seed={21} />
      <Sparkles position={[0, 0.3, 0]} u={u} count={10} radius={0.9} height={2.8} size={0.16} color="#fff0a0" seed={4} />
    </group>
  );
};
