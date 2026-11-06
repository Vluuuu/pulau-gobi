import React, {useMemo} from 'react';
import {Shape} from 'three';
import {BuildAnimProps, easeOutBack, easeOutCubic, resolveProgress, seg} from './anim';
import {HOUSE_BUILD_FRAMES, HOUSE_SPOT} from './buildTimeline';
import {ContactShadow, DustBurst, GroundRing, Sparkles, win} from './BuildFx';

export type GobiHouseProps = BuildAnimProps & {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
};

// Ukuran (Gobi setinggi ~2.2 dan selebar ~1.1, jadi pintu 2.1 muat).
const W = 3.2; // lebar (x)
const D = 2.6; // kedalaman (z); pintu di sisi +z
const H = 2.4; // tinggi dinding
const GH = 1.0; // tinggi segitiga atap
const FOUND_H = 0.2;
const LAYERS = 6;
const OVER = 0.25; // atap menjorok
const ROOF_T = 0.16;

const C = {
  stone: '#8b909c',
  wallA: '#e0a96d',
  wallB: '#d59b5c',
  post: '#a56a37',
  roof: '#b94a3a',
  door: '#7a4a2b',
  frame: '#5e3820',
  glass: '#bfe6ff',
  knob: '#ffd34d',
};

/** Pop 0->1 dengan overshoot untuk fase [a,b] dari progress global. */
const pop = (p: number, a: number, b: number, o = 1.7): number => easeOutBack(seg(p, a, b), o);

// Geometri atap (dihitung sekali; konstan).
const TOP = FOUND_H + H;
const RIDGE: [number, number] = [0, TOP + GH];
const EAVE: [number, number] = [W / 2 + OVER, TOP - OVER * (GH / (W / 2))];
const SLOPE_LEN = Math.hypot(RIDGE[0] - EAVE[0], RIDGE[1] - EAVE[1]);
const SLOPE_ANG = Math.atan2(RIDGE[1] - EAVE[1], EAVE[0] - RIDGE[0]);
const SLAB_CENTER: [number, number] = [
  (RIDGE[0] + EAVE[0]) / 2 + Math.sin(SLOPE_ANG) * (ROOF_T / 2),
  (RIDGE[1] + EAVE[1]) / 2 + Math.cos(SLOPE_ANG) * (ROOF_T / 2),
];

const Window: React.FC<{
  position: [number, number, number];
  rotationY?: number;
  k: number;
  size?: number;
}> = ({position, rotationY = 0, k, size = 0.75}) => {
  if (k <= 0.001) return null;
  return (
    <group position={position} rotation-y={rotationY} scale={k}>
      <mesh>
        <boxGeometry args={[size + 0.18, size + 0.18, 0.08]} />
        <meshStandardMaterial color={C.frame} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <boxGeometry args={[size, size, 0.07]} />
        <meshStandardMaterial color={C.glass} emissive={C.glass} emissiveIntensity={0.35} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[0.07, size, 0.05]} />
        <meshStandardMaterial color={C.frame} flatShading />
      </mesh>
      <mesh position={[0, 0, 0.07]}>
        <boxGeometry args={[size, 0.07, 0.05]} />
        <meshStandardMaterial color={C.frame} flatShading />
      </mesh>
    </group>
  );
};

/**
 * Rumah kayu pertama Gobi. Origin = pusat denah di permukaan tanah; pintu menghadap +z.
 * Urutan: pondasi -> dinding (balok bertumpuk) -> tiang sudut -> pintu & jendela -> atap -> settle.
 * Tanpa interior/furnitur.
 */
export const GobiHouse: React.FC<GobiHouseProps> = (props) => {
  const p = resolveProgress(props, HOUSE_BUILD_FRAMES);
  const position = props.position ?? HOUSE_SPOT.position;
  const rotationY = props.rotationY ?? HOUSE_SPOT.rotationY;

  const gableShape = useMemo(() => {
    const s = new Shape();
    s.moveTo(-W / 2, 0);
    s.lineTo(W / 2, 0);
    s.lineTo(0, GH);
    s.closePath();
    return s;
  }, []);

  if (p <= 0) return null;

  const layerH = H / LAYERS;
  const found = pop(p, 0.0, 0.18, 1.4);
  const postK = easeOutCubic(seg(p, 0.5, 0.62));
  const gable = easeOutCubic(seg(p, 0.6, 0.7));
  const doorK = pop(p, 0.6, 0.72);
  const frontWin = pop(p, 0.66, 0.78);
  const sideWinR = pop(p, 0.7, 0.82);
  const sideWinL = pop(p, 0.74, 0.86);
  const roofL = seg(p, 0.7, 0.82);
  const roofR = seg(p, 0.78, 0.9);
  const ridgeK = pop(p, 0.88, 0.95, 2.2);
  // squash kecil di akhir (rumah "duduk" ke tanah)
  const settle = 1 - 0.07 * Math.sin(Math.PI * seg(p, 0.92, 1.0));
  const bulge = 0.025 * Math.sin(Math.PI * seg(p, 0.92, 1.0)); // melebar sedikit saat "duduk"
  const sc = props.scale ?? 1;

  const roofSlab = (side: 1 | -1, t: number) => {
    if (t <= 0) return null;
    const drop = (1 - easeOutBack(t, 1.3)) * 1.6;
    const sc = 0.4 + 0.6 * easeOutCubic(t);
    return (
      <group position={[side * SLAB_CENTER[0], SLAB_CENTER[1] + drop, 0]} rotation-z={-side * SLOPE_ANG} scale={sc}>
        <mesh>
          <boxGeometry args={[SLOPE_LEN, ROOF_T, D + OVER * 2]} />
          <meshStandardMaterial color={C.roof} flatShading />
        </mesh>
      </group>
    );
  };

  return (
    <group position={position} rotation-y={rotationY} scale={[sc * (1 + bulge), sc * settle, sc * (1 + bulge)]}>
      {/* bayangan kontak: tumbuh bersama pondasi */}
      <ContactShadow position={[0.25, 0, -0.15]} rx={(W / 2 + 0.9) * 1.1} rz={(D / 2 + 0.9) * 1.1} opacity={0.3} k={found} />
      {/* pondasi batu */}
      {found > 0.001 && (
        <group scale={[1, found, 1]}>
          <mesh position={[0, FOUND_H / 2, 0]}>
            <boxGeometry args={[W + 0.3, FOUND_H, D + 0.3]} />
            <meshStandardMaterial color={C.stone} flatShading />
          </mesh>
          {/* batu pijakan di depan pintu */}
          <mesh position={[0, 0.07, D / 2 + 0.45]}>
            <boxGeometry args={[1.3, 0.14, 0.5]} />
            <meshStandardMaterial color={C.stone} flatShading />
          </mesh>
        </group>
      )}

      {/* dinding: 6 lapis balok, naik satu per satu dari bawah */}
      {Array.from({length: LAYERS}, (_, i) => {
        const k = pop(p, 0.18 + i * 0.055, 0.28 + i * 0.055, 1.5);
        if (k <= 0.001) return null;
        return (
          <group key={i} position={[0, FOUND_H + i * layerH, 0]} scale={[1, k, 1]}>
            <mesh position={[0, layerH / 2, 0]}>
              <boxGeometry args={[W, layerH - 0.02, D]} />
              <meshStandardMaterial color={i % 2 ? C.wallB : C.wallA} flatShading />
            </mesh>
          </group>
        );
      })}

      {/* tiang sudut */}
      {postK > 0.001 &&
        ([[-1, -1], [1, -1], [-1, 1], [1, 1]] as [number, number][]).map(([sx, sz], i) => (
          <group key={i} position={[sx * (W / 2), FOUND_H, sz * (D / 2)]} scale={[1, postK, 1]}>
            <mesh position={[0, (H + 0.04) / 2, 0]}>
              <boxGeometry args={[0.2, H + 0.04, 0.2]} />
              <meshStandardMaterial color={C.post} flatShading />
            </mesh>
          </group>
        ))}

      {/* segitiga depan-belakang (gable) */}
      {gable > 0.001 && (
        <group position={[0, TOP, 0]} scale={[1, gable, 1]}>
          <mesh position={[0, 0, -D / 2]}>
            <extrudeGeometry args={[gableShape, {depth: D, bevelEnabled: false}]} />
            <meshStandardMaterial color={C.wallA} flatShading />
          </mesh>
        </group>
      )}

      {/* pintu */}
      {doorK > 0.001 && (
        <group position={[0, FOUND_H, D / 2]} scale={[doorK, doorK, 1]}>
          <mesh position={[0, 1.12, 0.025]}>
            <boxGeometry args={[1.4, 2.24, 0.05]} />
            <meshStandardMaterial color={C.frame} flatShading />
          </mesh>
          <mesh position={[0, 1.05, 0.06]}>
            <boxGeometry args={[1.15, 2.1, 0.07]} />
            <meshStandardMaterial color={C.door} flatShading />
          </mesh>
          <mesh position={[0.37, 1.0, 0.14]}>
            <sphereGeometry args={[0.07, 6, 6]} />
            <meshStandardMaterial color={C.knob} flatShading />
          </mesh>
        </group>
      )}

      {/* jendela: depan (loteng bulat-segi), samping kanan & kiri */}
      <Window position={[0, TOP + 0.5, D / 2 + 0.02]} k={frontWin} size={0.45} />
      <Window position={[W / 2 + 0.02, FOUND_H + 1.35, 0]} rotationY={Math.PI / 2} k={sideWinR} />
      <Window position={[-W / 2 - 0.02, FOUND_H + 1.35, 0]} rotationY={-Math.PI / 2} k={sideWinL} />

      {/* atap: dua sisi turun bergantian + bubungan */}
      {roofSlab(1, roofR)}
      {roofSlab(-1, roofL)}
      {ridgeK > 0.001 && (
        <mesh position={[0, RIDGE[1] + 0.1, 0]} rotation-z={Math.PI / 4} scale={ridgeK}>
          <boxGeometry args={[0.24, 0.24, D + OVER * 2]} />
          <meshStandardMaterial color={C.post} flatShading />
        </mesh>
      )}

      {/* efek bangun (V4): debu pondasi, debu & kilau atap, riak saat rumah "duduk" */}
      <DustBurst position={[0, 0.15, 0]} u={win(p, 0.0, 0.26)} count={12} radius={W * 0.85} size={0.34} rise={0.5} color="#f4f1ea" seed={1} />
      <DustBurst position={[0, TOP, 0]} u={win(p, 0.8, 0.94)} count={10} radius={2.1} size={0.26} rise={0.7} color="#fff6e6" seed={7} />
      <GroundRing position={[0, 0.06, 0]} u={win(p, 0.9, 1.0)} r0={W * 0.7} r1={W * 1.6} color="#fff6d0" opacity={0.5} />
      <DustBurst position={[0, 0.1, 0]} u={win(p, 0.9, 1.0)} count={12} radius={W * 1.1} size={0.3} rise={0.35} color="#ffffff" seed={13} />
      <Sparkles position={[0, TOP + 0.3, 0]} u={win(p, 0.92, 1.0)} count={9} radius={1.6} height={2.0} size={0.17} seed={3} />
    </group>
  );
};
