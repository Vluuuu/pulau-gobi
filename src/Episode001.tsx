import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import type {OrthographicCamera} from 'three';
import {Captions} from './Captions';
import {Gobi, Poof, gobiPos} from './Gobi';
import {Cloud, Island} from './Island';
import {CAM_OFFSET, FPS, kf, Pts} from './timeline';

// Bobot wide shot: 1 = wide (pulau utuh), 0 = medium (Gobi besar)
const WIDE: Pts = [[0, 1], [1.7, 1], [2.5, 0], [8.1, 0], [9.0, 1], [10.8, 1], [11.7, 0]];
const WIDE_ZOOM = 128;
const MED_ZOOM: Pts = [[0, 178], [21, 178], [26, 158]]; // medium ~ +32% dari V1 (135)

const CameraRig: React.FC<{frame: number}> = ({frame}) => {
  const camera = useThree((s) => s.camera) as OrthographicCamera;
  const t = frame / FPS;

  useLayoutEffect(() => {
    const w = kf(t, WIDE);
    const g = gobiPos(t);
    // wide: setengah mengikuti Gobi, target rendah agar sisi bawah pulau terlihat
    // medium: mengikuti Gobi, Gobi berada di atas tengah (subtitle di bawah)
    const tx = w * (0.45 * g.x) + (1 - w) * (0.9 * g.x);
    const tz = w * (0.45 * g.z) + (1 - w) * (0.9 * g.z);
    const ty = w * -1.6 + (1 - w) * -0.2;
    const zoom = w * WIDE_ZOOM + (1 - w) * kf(t, MED_ZOOM);
    camera.position.set(tx + CAM_OFFSET[0], ty + CAM_OFFSET[1], tz + CAM_OFFSET[2]);
    camera.zoom = zoom;
    camera.lookAt(tx, ty, tz);
    camera.updateProjectionMatrix();
  });
  return null;
};

// Awan kecil di sisi/atas/belakang pulau. Posisi diberikan dalam koordinat layar
// (sx kanan, sy atas) relatif ke target kamera wide, lalu didorong jauh ke belakang.
const R = [1 / Math.SQRT2, 0, -1 / Math.SQRT2];
const U = [-1 / Math.sqrt(6), 2 / Math.sqrt(6), -1 / Math.sqrt(6)];
const V = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];
const cloudAt = (sx: number, sy: number, drift: number): [number, number, number] => {
  const x = sx + drift;
  const d = 12;
  return [
    x * R[0] + sy * U[0] - d * V[0],
    -1.6 + x * R[1] + sy * U[1] - d * V[1],
    x * R[2] + sy * U[2] - d * V[2],
  ];
};

export const Episode001: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // Pulau mengambang pelan + gemetar singkat saat Gobi kaget (scene 3)
  const bob = Math.sin(t * 1.6) * 0.12;
  const shake = kf(t, [[10.2, 0], [10.35, 1], [10.9, 0]]) * Math.sin(t * 60) * 0.05;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #8fd3ff 0%, #cfe9ff 55%, #ffe3f1 100%)'}}>
      <Audio src={staticFile('1.mp3')} />

      <ThreeCanvas
        width={1080}
        height={1920}
        orthographic
        camera={{position: [10, 8.5, 10], zoom: 135, near: 0.1, far: 200}}
      >
        <CameraRig frame={frame} />
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 12, 4]} intensity={1.6} />

        <group position={[shake, bob, 0]}>
          <Island />
          <Gobi frame={frame} />
          <Poof frame={frame} />
        </group>

        {/* awan: sedikit, kecil, di atas/samping pulau; tidak di bagian bawah layar */}
        <Cloud position={cloudAt(-3.3, 4.2, t * 0.1)} scale={0.8} />
        <Cloud position={cloudAt(3.0, 6.0, -t * 0.08)} scale={0.65} />
        <Cloud position={cloudAt(-3.6, -0.6, t * 0.06)} scale={0.6} />
        <Cloud position={cloudAt(3.5, -2.2, -t * 0.07)} scale={0.65} />
      </ThreeCanvas>

      <Captions />
    </AbsoluteFill>
  );
};
