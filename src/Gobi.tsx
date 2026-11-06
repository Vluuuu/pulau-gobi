import React from 'react';
import {FACE_CAMERA, FPS, kf, Pts} from './timeline';

const SKIN = '#f6c9a0';
const HAIR = '#17171c';
const SHIRT = '#ff8a1f';
const SHORTS = '#1d2a5b';
const SHOES = '#efe0bf';

// ---- Keyframe gerakan (detik). Edit di sini untuk menyesuaikan timing. ----
const X: Pts = [[0, 0], [5.2, 0], [6.4, 0.9], [7.6, 0.9], [9.0, 2.0], [10.4, 2.0], [10.9, 0.7], [11.8, 0.7], [12.6, 0], [16.4, 0]];
const Z: Pts = [[0, 0], [5.2, 0], [6.4, 0.7], [7.6, 0.7], [9.0, 1.6], [10.4, 1.6], [10.9, 0.5], [11.8, 0.5], [12.6, 0], [16.4, 0]];
const ROT: Pts = [
  [0, FACE_CAMERA], [3.0, FACE_CAMERA], [3.8, FACE_CAMERA + 0.9], [4.6, FACE_CAMERA - 0.9], [5.3, 0.9],
  [10.9, 0.9], [11.8, FACE_CAMERA], [12.6, FACE_CAMERA],
  [13.4, FACE_CAMERA + Math.PI], [14.9, FACE_CAMERA + Math.PI], [15.8, FACE_CAMERA],
];
const SCALE: Pts = [[1.15, 0], [1.5, 1.15], [1.7, 1]];
const SIT: Pts = [[12.4, 0], [13.0, 1], [15.0, 1], [15.8, 0]];
const LIE: Pts = [[13.6, 0], [14.3, 1], [14.9, 1], [15.4, 0]];
const LEAN: Pts = [
  [8.8, 0], [9.4, 0.65], [10.1, 0.65], [10.3, -0.4], [10.8, 0],
  [16.2, 0], [16.9, 0.12], [19.6, 0.12], [20.3, 0],
];
// Ekspresi/akting tambahan (V2) -- semua sederhana, memakai model yang sama
const HEAD_YAW: Pts = [[1.7, 0], [2.1, 0.5], [2.6, -0.5], [3.1, 0], [3.5, 0], [3.9, 0.45], [4.5, -0.45], [5.0, 0.35], [5.5, 0]];
const BODY_ROLL: Pts = [[1.9, 0], [2.3, 0.06], [2.8, -0.06], [3.2, 0], [3.5, 0], [3.9, 0.07], [4.5, -0.07], [5.1, 0.06], [5.6, 0]];
const HEAD_PITCH: Pts = [
  [8.9, 0], [9.4, 0.35], [10.1, 0.35], [10.25, -0.25], [10.9, 0],
  [16.8, 0], [17.0, 0.18], [17.25, 0], [18.2, 0], [18.4, 0.18], [18.65, 0],
];
const SURPRISE: Pts = [[10.1, 0], [10.25, 1], [11.2, 1], [11.8, 0]];
const POINT: Pts = [[17.2, 0], [17.6, 1], [18.5, 1], [18.9, 0]];
const ARMS_UP: Pts = [
  [0, 0], [1.6, 0], [2.0, 0.35], [2.9, 0.35], [3.3, 0],
  [6.4, 0], [6.7, 0.5], [7.5, 0.5], [7.9, 0],
  [10.2, 0], [10.4, 1], [11.4, 1], [11.9, 0],
  [16.4, 0], [16.8, 0.45], [19.5, 0.45], [20, 0],
];
const WAVE: Pts = [[21.0, 0], [21.4, 1], [24.6, 1], [25.0, 0]];
const TILT: Pts = [[1.8, 0], [2.2, 0.2], [2.9, 0.2], [3.3, 0], [4.0, 0], [4.4, -0.18], [5.0, 0.18], [5.6, -0.1], [6.2, 0], [6.6, 0], [7.0, -0.2], [7.6, 0], [11.9, 0], [12.4, 0.2], [13.0, 0], [15.8, 0], [16.2, 0.2], [18.5, 0.2], [19.2, 0],
  [20.5, 0], [21.2, 0.12], [22.5, -0.12], [23.6, 0.12], [24.6, 0]];

export const gobiPos = (t: number) => ({x: kf(t, X), z: kf(t, Z)});

/**
 * OPSIONAL (dipakai Episode 002): pose yang dihitung dari luar. Jika prop `pose` diisi,
 * SEMUA keyframe Episode 001 di atas diabaikan dan nilai di sini yang dipakai
 * (channel yang tidak diisi = netral/0). Tanpa `pose`, perilaku Episode 001 tidak berubah.
 */
export type GobiPose = {
  x: number;
  z: number;
  rotY: number;
  scale?: number;
  /** 0..1 intensitas ayunan langkah; `phase` = fase langkah (radian). */
  walk?: number;
  phase?: number;
  sit?: number;
  lie?: number;
  lean?: number;
  up?: number;
  wave?: number;
  tilt?: number;
  headYaw?: number;
  headPitch?: number;
  roll?: number;
  surprise?: number;
  point?: number;
  /** Tinggi lompatan total (sudah termasuk semua pulsa). */
  hop?: number;
  /** Kedua lengan terayun ke depan (memegang perut / memohon). 0..1 */
  armFwd?: number;
  /** Akting V4 (opsional, default 0 = persis Episode 001). */
  /** Squash & stretch badan: + = pipih (antisipasi/mendarat), - = memanjang (di udara). */
  squash?: number;
  /** Kedip 0..1 (mata menutup). */
  blink?: number;
  /** Senang 0..1: mata menyipit gembira, mulut lebar. */
  happy?: number;
  /** Bingung 0..1: mata tidak sama besar, mulut miring kecil. */
  confuse?: number;
  /** Lapar 0..1: mata sayu, mulut datar bergetar. */
  hungry?: number;
};

export const Gobi: React.FC<{frame: number; pose?: GobiPose}> = ({frame, pose}) => {
  const t = frame / FPS;
  const {x: x0, z: z0} = gobiPos(t);
  const prev = gobiPos(Math.max(0, t - 1 / FPS));
  const speed = Math.hypot(x0 - prev.x, z0 - prev.z) * FPS;
  const walk0 = Math.min(1, speed / 1.0);

  const P = pose;
  const x = P ? P.x : x0;
  const z = P ? P.z : z0;
  const walk = P ? P.walk ?? 0 : walk0;
  const phase = P ? P.phase ?? t * 11 : t * 11;

  const scale = P ? P.scale ?? 1 : kf(t, SCALE);
  const sit = P ? P.sit ?? 0 : kf(t, SIT);
  const lie = P ? P.lie ?? 0 : kf(t, LIE);
  const lean = P ? P.lean ?? 0 : kf(t, LEAN);
  const up = P ? P.up ?? 0 : kf(t, ARMS_UP);
  const wave = P ? P.wave ?? 0 : kf(t, WAVE);
  const tilt = P ? P.tilt ?? 0 : kf(t, TILT);
  const rotY = P ? P.rotY : kf(t, ROT);
  const headYaw = P ? P.headYaw ?? 0 : kf(t, HEAD_YAW);
  const headPitch = P ? P.headPitch ?? 0 : kf(t, HEAD_PITCH);
  const roll = P ? P.roll ?? 0 : kf(t, BODY_ROLL);
  const surprise = P ? P.surprise ?? 0 : kf(t, SURPRISE);
  const point = P ? P.point ?? 0 : kf(t, POINT);
  const armFwd = P ? P.armFwd ?? 0 : 0;
  const squash = P ? P.squash ?? 0 : 0;
  const blink = P ? P.blink ?? 0 : 0;
  const happy = P ? P.happy ?? 0 : 0;
  const confuse = P ? P.confuse ?? 0 : 0;
  const hungry = P ? P.hungry ?? 0 : 0;
  const eyeOpen = Math.max(0.08, 1 - 0.92 * blink - 0.5 * happy - 0.3 * hungry);
  const eyeL = (1 + 0.8 * surprise) * (1 + 0.35 * confuse);
  const eyeR = (1 + 0.8 * surprise) * (1 - 0.2 * confuse);
  const mouthX = (1 + 0.6 * surprise) * (1 + 1.3 * happy) * (1 + 0.5 * hungry) * (1 - 0.3 * confuse);
  const mouthY = Math.max(0.25, 0.6 + up * 0.8 + 0.8 * surprise + 0.9 * happy - 0.3 * hungry - 0.2 * confuse);
  const mouthRot = 0.5 * confuse + Math.sin(t * 9) * 0.1 * hungry;

  const hop = P
    ? (P.hop ?? 0) + walk * Math.abs(Math.sin(phase)) * 0.06
    : kf(t, [[10.2, 0], [10.45, 0.6], [10.7, 0]]) +
      kf(t, [[20.6, 0], [20.8, 0.25], [21, 0]]) +
      kf(t, [[22.0, 0], [22.2, 0.3], [22.45, 0]]) +
      walk * Math.abs(Math.sin(phase)) * 0.06;

  const hipY = 0.58 + (0.15 - 0.58) * sit + 0.1 * lie + hop;
  const swing = Math.sin(phase) * 0.8 * walk;
  const bodyPitch = lean - lie * (Math.PI / 2) * 0.97;

  const angL = up * 2.2;
  const angR = (up * 2.2 * (1 - wave) + wave * (2.6 + Math.sin(t * 14) * 0.35)) * (1 - point) + 0.3 * point;
  const armSwing = -swing * 0.7;

  if (scale < 0.01) return null;

  return (
    <group position={[x, 0, z]} rotation-y={rotY} scale={[scale * (1 + 0.3 * squash), scale * (1 - 0.5 * squash), scale * (1 + 0.3 * squash)]}>
      {/* bayangan */}
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.55 + lie * 0.3, 12]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>

      <group position={[0, hipY, 0]}>
        <group rotation={[bodyPitch, 0, roll]}>
          {/* torso */}
          <mesh position={[0, 0.3, 0]}>
            <boxGeometry args={[0.7, 0.6, 0.45]} />
            <meshStandardMaterial color={SHIRT} flatShading />
          </mesh>
          <mesh position={[0, 0.05, 0]}>
            <boxGeometry args={[0.72, 0.22, 0.47]} />
            <meshStandardMaterial color={SHORTS} flatShading />
          </mesh>

          {/* kepala */}
          <group position={[0, 1.05, 0]} rotation={[headPitch, headYaw, tilt]}>
            <mesh>
              <sphereGeometry args={[0.5, 8, 6]} />
              <meshStandardMaterial color={SKIN} flatShading />
            </mesh>
            <mesh position={[0, 0.06, -0.04]}>
              <sphereGeometry args={[0.54, 8, 6, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
              <meshStandardMaterial color={HAIR} flatShading />
            </mesh>
            <mesh position={[0, 0.3, 0.36]}>
              <boxGeometry args={[0.8, 0.16, 0.2]} />
              <meshStandardMaterial color={HAIR} flatShading />
            </mesh>
            <mesh position={[-0.17, -0.02, 0.46]} scale={[eyeL, eyeL * eyeOpen, eyeL]}>
              <sphereGeometry args={[0.065, 6, 6]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0.17, -0.02, 0.46]} scale={[eyeR, eyeR * eyeOpen, eyeR]}>
              <sphereGeometry args={[0.065, 6, 6]} />
              <meshBasicMaterial color="#111111" />
            </mesh>
            <mesh position={[0, -0.2, 0.47]} rotation-z={mouthRot} scale={[mouthX, mouthY, 1]}>
              <boxGeometry args={[0.12, 0.07, 0.04]} />
              <meshBasicMaterial color="#7a2e2e" />
            </mesh>
          </group>

          {/* lengan kiri (x-) & kanan (x+) */}
          <group position={[-0.46, 0.52, 0]} rotation={[armSwing - armFwd * 1.25, 0, -angL]}>
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.2, 0.5, 0.2]} />
              <meshStandardMaterial color={SKIN} flatShading />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.25, 0.2, 0.25]} />
              <meshStandardMaterial color={SHIRT} flatShading />
            </mesh>
          </group>
          <group position={[0.46, 0.52, 0]} rotation={[-armSwing - point * 1.45 - armFwd * 1.25, 0, angR]}>
            <mesh position={[0, -0.25, 0]}>
              <boxGeometry args={[0.2, 0.5, 0.2]} />
              <meshStandardMaterial color={SKIN} flatShading />
            </mesh>
            <mesh position={[0, -0.08, 0]}>
              <boxGeometry args={[0.25, 0.2, 0.25]} />
              <meshStandardMaterial color={SHIRT} flatShading />
            </mesh>
          </group>
        </group>

        {/* kaki */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.18, 0, 0]} rotation-x={s * swing - sit * (Math.PI / 2)}>
            <mesh position={[0, -0.12, 0]}>
              <boxGeometry args={[0.28, 0.25, 0.3]} />
              <meshStandardMaterial color={SHORTS} flatShading />
            </mesh>
            <mesh position={[0, -0.3, 0]}>
              <boxGeometry args={[0.2, 0.2, 0.2]} />
              <meshStandardMaterial color={SKIN} flatShading />
            </mesh>
            <mesh position={[0, -0.5, 0.06]}>
              <boxGeometry args={[0.26, 0.15, 0.4]} />
              <meshStandardMaterial color={SHOES} flatShading />
            </mesh>
          </group>
        ))}
      </group>
    </group>
  );
};

/** Efek "poof" ringan saat Gobi muncul. */
export const Poof: React.FC<{frame: number}> = ({frame}) => {
  const t = frame / FPS;
  const p = (t - 1.15) / 0.8;
  if (p < 0 || p > 1) return null;
  const r = 0.4 + p * 1.1;
  return (
    <group position={[0, 0.8, 0]}>
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const a = (i / 6) * Math.PI * 2;
        return (
          <mesh key={i} position={[Math.cos(a) * r, (i % 2) * 0.3, Math.sin(a) * r]} scale={0.35 + p * 0.3}>
            <icosahedronGeometry args={[0.6, 0]} />
            <meshStandardMaterial color="#ffffff" flatShading transparent opacity={1 - p} />
          </mesh>
        );
      })}
    </group>
  );
};
