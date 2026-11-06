import React from 'react';
import {Color} from 'three';
import {
  BuildAnimProps,
  easeInOutCubic,
  easeOutBack,
  easeOutCubic,
  hash01,
  lerp,
  resolveProgress,
  seg,
} from './anim';
import {FIELD_BUILD_FRAMES, FIELD_SPOT} from './buildTimeline';
import {ContactShadow, DustBurst, Sparkles, win} from './BuildFx';

export type RiceFieldProps = BuildAnimProps & {
  position?: [number, number, number];
  rotationY?: number;
  scale?: number;
};

const W = 2.6; // sumbu x
const D = 2.0; // sumbu z
const ROWS = 5;
const COLS = 6;
const ROW_GAP = 0.35;
const COL_GAP = 0.4;
const BED_H = 0.1;
const RIDGE_H = 0.08;
const BASE_Y = BED_H + RIDGE_H; // dasar rumpun padi (di atas guludan)

const C = {
  border: '#a56a37',
  bed: '#6b4423',
  ridge: '#835630',
};
const SEEDLING = new Color('#a8e86a');
const MATURE = new Color('#58b448');
const TMP = new Color();

// Urutan tanam deterministik: baris demi baris, sedikit teracak per rumpun.
const CLUMPS = Array.from({length: ROWS * COLS}, (_, n) => {
  const row = Math.floor(n / COLS);
  const col = n % COLS;
  const colOrdered = row % 2 ? COLS - 1 - col : col; // zig-zag seperti orang menanam
  return {
    x: (col - (COLS - 1) / 2) * COL_GAP,
    z: (row - (ROWS - 1) / 2) * ROW_GAP,
    order: row * COLS + colOrdered,
    jit: hash01(n + 3),
    rot: hash01(n + 17) * Math.PI * 2,
  };
});

const Blade: React.FC<{angle: number; h: number; tilt: number; color: Color; sway: number}> = ({
  angle,
  h,
  tilt,
  color,
  sway,
}) => (
  <group rotation-y={angle}>
    <group position={[0.03, 0, 0]} rotation={[sway, 0, -tilt]}>
      <mesh position={[0, h / 2, 0]} scale={[1, h, 1]}>
        <coneGeometry args={[0.05, 1, 4]} />
        <meshStandardMaterial color={color} flatShading />
      </mesh>
    </group>
  </group>
);

/**
 * Petak sawah mini. Origin = pusat petak di permukaan tanah.
 * Urutan: pematang kayu + tanah -> guludan -> bibit ditanam satu per satu -> padi tumbuh.
 * 30 rumpun, tanpa air/simulasi.
 */
export const RiceField: React.FC<RiceFieldProps> = (props) => {
  const p = resolveProgress(props, FIELD_BUILD_FRAMES);
  if (p <= 0) return null;
  const position = props.position ?? FIELD_SPOT.position;
  const rotationY = props.rotationY ?? FIELD_SPOT.rotationY;
  const sc = props.scale ?? 1;

  const borderK = easeOutCubic(seg(p, 0.0, 0.12));
  const bedK = easeOutBack(seg(p, 0.0, 0.2), 1.2);
  const N = CLUMPS.length;

  return (
    <group position={position} rotation-y={rotationY} scale={sc}>
      <ContactShadow position={[0.12, 0, -0.08]} rx={W * 0.62} rz={D * 0.66} opacity={0.26} k={borderK} />
      {/* efek tanam (V4): tanah terangkat saat petak disiapkan; kilau saat padi tumbuh */}
      <DustBurst position={[0, 0.1, 0]} u={win(p, 0.0, 0.22)} count={10} radius={W * 0.8} size={0.2} rise={0.35} color="#b88a5a" seed={5} />
      <Sparkles position={[0, 0.4, 0]} u={win(p, 0.86, 1.0)} count={8} radius={W * 0.45} height={1.0} size={0.11} color="#fff2a0" seed={9} />
      {/* pematang kayu (4 sisi) */}
      {borderK > 0.001 &&
        (
          [
            [0, -D / 2, W + 0.12, 0.12],
            [0, D / 2, W + 0.12, 0.12],
            [-W / 2, 0, 0.12, D],
            [W / 2, 0, 0.12, D],
          ] as [number, number, number, number][]
        ).map(([x, z, w, d], i) => (
          <group key={i} position={[x, 0, z]} scale={[1, borderK, 1]}>
            <mesh position={[0, 0.08, 0]}>
              <boxGeometry args={[w, 0.16, d]} />
              <meshStandardMaterial color={C.border} flatShading />
            </mesh>
          </group>
        ))}

      {/* tanah disiapkan: melebar dari tengah */}
      {bedK > 0.001 && (
        <group scale={[bedK, 1, bedK]}>
          <mesh position={[0, BED_H / 2, 0]}>
            <boxGeometry args={[W - 0.1, BED_H, D - 0.1]} />
            <meshStandardMaterial color={C.bed} flatShading />
          </mesh>
        </group>
      )}

      {/* guludan: tiap baris melebar dari tengah, bergantian */}
      {Array.from({length: ROWS}, (_, r) => {
        const k = easeOutBack(seg(p, 0.14 + r * 0.05, 0.28 + r * 0.05), 1.4);
        if (k <= 0.001) return null;
        return (
          <group key={r} position={[0, BED_H, (r - (ROWS - 1) / 2) * ROW_GAP]} scale={[k, k, 1]}>
            <mesh position={[0, RIDGE_H / 2, 0]}>
              <boxGeometry args={[W - 0.35, RIDGE_H, 0.2]} />
              <meshStandardMaterial color={C.ridge} flatShading />
            </mesh>
          </group>
        );
      })}

      {/* bibit -> tumbuh */}
      {CLUMPS.map((c, i) => {
        const plantStart = 0.38 + (c.order / N) * 0.28;
        const plant = easeOutBack(seg(p, plantStart, plantStart + 0.08), 2.0);
        if (plant <= 0.001) return null;
        const grow = easeInOutCubic(seg(p, 0.62 + c.jit * 0.08, 0.92 + c.jit * 0.08));
        const h = lerp(0.16, 0.6, grow) * plant;
        const tilt = lerp(0.18, 0.32, grow);
        const sway = Math.sin(p * 50 + i * 1.7) * 0.05 * grow; // deterministik, hanya dari progress
        const color = TMP.copy(SEEDLING).lerp(MATURE, grow).clone();
        return (
          <group key={i} position={[c.x, BASE_Y, c.z]} rotation-y={c.rot}>
            {/* percikan tanah kecil saat tiap rumpun ditanam */}
            <DustBurst position={[0, 0.02, 0]} u={win(p, plantStart, plantStart + 0.09)} count={4} radius={0.28} size={0.07} rise={0.22} color="#8a5a30" seed={i * 3} />
            {[0, 1, 2].map((b) => (
              <Blade
                key={b}
                angle={(b / 3) * Math.PI * 2}
                h={h * (b === 0 ? 1 : 0.8)}
                tilt={tilt + b * 0.05}
                color={color}
                sway={sway}
              />
            ))}
          </group>
        );
      })}
    </group>
  );
};
