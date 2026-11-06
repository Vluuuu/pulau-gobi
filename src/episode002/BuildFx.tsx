import React from 'react';
import {easeOutCubic, hash01} from './anim';

/**
 * Efek ringan untuk animasi pembangunan (V4). Semua MURNI dari progress `u` 0..1
 * (tanpa state/timer) sehingga aman di frame mana pun. Primitif three saja, tanpa partikel engine.
 */

/** Progres lokal 0..1 untuk jendela [a,b] dari progress global p; -1 bila di luar jendela. */
export const win = (p: number, a: number, b: number): number => (p <= a || p >= b ? -1 : (p - a) / (b - a));

type V3 = [number, number, number];

/** Letupan debu: gumpalan terlempar keluar sambil naik, membesar lalu mengecil. */
export const DustBurst: React.FC<{
  position: V3;
  u: number;
  count?: number;
  radius?: number;
  size?: number;
  rise?: number;
  color?: string;
  seed?: number;
}> = ({position, u, count = 8, radius = 1.2, size = 0.3, rise = 0.5, color = '#ffffff', seed = 0}) => {
  if (u <= 0 || u >= 1) return null;
  const out = easeOutCubic(u);
  const life = Math.sin(Math.PI * Math.pow(u, 0.7));
  return (
    <group position={position}>
      {Array.from({length: count}, (_, i) => {
        const a = (i / count) * Math.PI * 2 + hash01(i + seed) * 0.8;
        const d = radius * out * (0.65 + 0.5 * hash01(i + seed + 40));
        const k = size * life * (0.6 + 0.6 * hash01(i + seed + 80));
        return (
          <mesh key={i} position={[Math.cos(a) * d, rise * u * (0.5 + hash01(i + seed + 20)), Math.sin(a) * d]} scale={k}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.25} flatShading />
          </mesh>
        );
      })}
    </group>
  );
};

/** Kilau emas yang naik dan berkedip (tanda "selesai"). */
export const Sparkles: React.FC<{
  position: V3;
  u: number;
  count?: number;
  radius?: number;
  height?: number;
  size?: number;
  color?: string;
  seed?: number;
}> = ({position, u, count = 7, radius = 1.2, height = 1.4, size = 0.14, color = '#ffd84a', seed = 0}) => {
  if (u <= 0 || u >= 1) return null;
  return (
    <group position={position}>
      {Array.from({length: count}, (_, i) => {
        const a = (i / count) * Math.PI * 2 + hash01(i + seed) * 1.2;
        const d = radius * (0.35 + 0.65 * hash01(i + seed + 10));
        const phase = hash01(i + seed + 30);
        const tw = Math.abs(Math.sin((u * 3 + phase) * Math.PI));
        const k = size * tw * Math.sin(Math.PI * u) * (0.8 + 0.6 * hash01(i + seed + 50));
        return (
          <mesh
            key={i}
            position={[Math.cos(a) * d, height * easeOutCubic(u) * (0.4 + 0.6 * phase), Math.sin(a) * d]}
            rotation={[u * 4 + i, u * 6, 0]}
            scale={k}
          >
            <octahedronGeometry args={[1, 0]} />
            <meshBasicMaterial color={color} />
          </mesh>
        );
      })}
    </group>
  );
};

/** Riak datar di tanah yang melebar dan memudar. */
export const GroundRing: React.FC<{position: V3; u: number; r0: number; r1: number; color?: string; opacity?: number}> = ({
  position,
  u,
  r0,
  r1,
  color = '#ffffff',
  opacity = 0.55,
}) => {
  if (u <= 0 || u >= 1) return null;
  const r = r0 + (r1 - r0) * easeOutCubic(u);
  return (
    <mesh position={position} rotation-x={-Math.PI / 2} scale={r}>
      <ringGeometry args={[0.86, 1, 40]} />
      <meshBasicMaterial color={color} transparent opacity={opacity * (1 - u)} depthWrite={false} />
    </mesh>
  );
};

/** Bayangan kontak lembut (dua lapis elips), tanpa shadow map => aman & deterministik. */
export const ContactShadow: React.FC<{
  position: V3;
  rx: number;
  rz: number;
  rotationY?: number;
  opacity?: number;
  /** 0..1 untuk muncul bertahap bersama objeknya. */
  k?: number;
}> = ({position, rx, rz, rotationY = 0, opacity = 0.22, k = 1}) => {
  if (k <= 0.001) return null;
  return (
    <group position={[position[0], position[1] + 0.012, position[2]]} rotation-y={rotationY}>
      {[1, 0.72].map((m, i) => (
        <mesh key={i} rotation-x={-Math.PI / 2} scale={[rx * m * k, rz * m * k, 1]} position={[0, i * 0.004, 0]}>
          <circleGeometry args={[1, 32]} />
          <meshBasicMaterial color="#1b3a22" transparent opacity={opacity * (i === 0 ? 0.55 : 0.75)} depthWrite={false} />
        </mesh>
      ))}
    </group>
  );
};
