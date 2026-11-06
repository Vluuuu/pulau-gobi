import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, Audio, Img, staticFile, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import type {OrthographicCamera} from 'three';
import {Gobi} from './Gobi';
import {Cloud} from './Island';
import {CAM_OFFSET} from './timeline';
import {ExpandedIsland, GobiHouse, RiceField, Villagers, islandRadiusScale} from './episode002';
import {FIELD_SCALE, HOUSE_SCALE, ISLAND_EXPANDED_SCALE, ISLAND_EXPAND_FRAMES} from './episode002/buildTimeline';
import {Ep002Captions} from './episode002/Ep002Captions';
import {IslandDecor} from './episode002/IslandDecor3D';
import {GobiEmotes} from './episode002/GobiEmotes';
import {ContactShadow} from './episode002/BuildFx';
import {
  EP002_FPS,
  EP002_FRAMES,
  T,
  cameraAt,
  cardAnim,
  gobiPoseAt,
  islandBob,
  islandShake,
  sec2f,
} from './episode002/ep002Direction';

export const EP002_DURATION_IN_FRAMES = EP002_FRAMES; // 2700 = 90 dtk (MP3 88.19 dtk)

const ISLAND_START = sec2f(T.expandStart);
const HOUSE_START = sec2f(T.houseStart);
const FIELD_START = sec2f(T.fieldStart);
const NPC_START = sec2f(T.npcAppear);

// Kamera isometrik (orthographic) -- diatur per frame dari cameraAt() (deterministik).
const CameraRig: React.FC<{frame: number}> = ({frame}) => {
  const camera = useThree((s) => s.camera) as OrthographicCamera;
  const t = frame / EP002_FPS;
  const scale = islandRadiusScale(Math.min(1, Math.max(0, (frame - ISLAND_START) / ISLAND_EXPAND_FRAMES)), ISLAND_EXPANDED_SCALE);
  const c = cameraAt(t, scale);
  useLayoutEffect(() => {
    camera.position.set(c.target[0] + CAM_OFFSET[0], c.target[1] + CAM_OFFSET[1], c.target[2] + CAM_OFFSET[2]);
    camera.zoom = c.zoom;
    camera.lookAt(c.target[0], c.target[1], c.target[2]);
    camera.updateProjectionMatrix();
  });
  return null;
};

// Awan kecil (koordinat layar relatif ke target kamera wide, didorong ke belakang) -- sama gaya Ep001.
const R = [1 / Math.SQRT2, 0, -1 / Math.SQRT2];
const U = [-1 / Math.sqrt(6), 2 / Math.sqrt(6), -1 / Math.sqrt(6)];
const V = [1 / Math.sqrt(3), 1 / Math.sqrt(3), 1 / Math.sqrt(3)];
const cloudAt = (sx: number, sy: number, drift: number): [number, number, number] => {
  const x = sx + drift;
  const d = 12;
  return [
    x * R[0] + sy * U[0] - d * V[0],
    -1.8 + x * R[1] + sy * U[1] - d * V[1],
    x * R[2] + sy * U[2] - d * V[2],
  ];
};

/** Kilat putih singkat di momen besar (perluasan pulau, kedatangan warga). Murni dari t. */
const FLASHES: [number, number, number][] = [[T.expandStart + 0.05, 0.22, 0.3], [T.npcAppear, 0.2, 0.28]];
const flashAt = (t: number): number => {
  let f = 0;
  for (const [t0, a, d] of FLASHES) if (t >= t0 && t < t0 + d) f += a * (1 - (t - t0) / d);
  return f;
};

const FONT = "'Segoe UI', 'Arial Rounded MT Bold', Arial, sans-serif";

/**
 * Kartu komentar: memakai PNG screenshot ASLI apa adanya (tanpa crop/edit/retype),
 * hanya dibingkai putih + bayangan. `width` = lebar tampil gambar (px).
 */
const CommentCard: React.FC<{
  file: string;
  nativeW: number;
  nativeH: number;
  width: number;
  tIn: number;
  tOut: number;
  t: number;
  top: number;
  tiltDeg: number;
}> = ({file, nativeW, nativeH, width, tIn, tOut, t, top, tiltDeg}) => {
  const a = cardAnim(t, tIn, tOut);
  if (!a.visible) return null;
  const height = (width * nativeH) / nativeW;
  const pad = 18;
  return (
    <div
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top,
        display: 'flex',
        justifyContent: 'center',
        opacity: a.opacity,
        transform: `translateY(${a.y}px) scale(${a.scale}) rotate(${tiltDeg + a.wobble}deg)`,
        transformOrigin: '50% 0%',
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          padding: pad,
          borderRadius: 30,
          background: '#ffffff',
          boxShadow: '0 14px 34px rgba(20,30,70,0.38), 0 0 0 5px rgba(255,255,255,0.65)',
          fontFamily: FONT,
        }}
      >
        <Img src={staticFile(file)} style={{display: 'block', width, height, objectFit: 'contain'}} />
      </div>
    </div>
  );
};

export const Episode002: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / EP002_FPS;

  const pose = gobiPoseAt(t);
  const islandScale = islandRadiusScale(Math.min(1, Math.max(0, (frame - ISLAND_START) / ISLAND_EXPAND_FRAMES)), ISLAND_EXPANDED_SCALE);
  const cam = cameraAt(t, islandScale);
  const flash = flashAt(t);
  const shake = islandShake(t);
  const bob = islandBob(t);
  const drift = t * 0.1;

  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #8fd3ff 0%, #cfe9ff 55%, #ffe3f1 100%)'}}>
      {/* VO asli, utuh, 1x, kecepatan normal */}
      <Audio src={staticFile('episode002.mp3')} />

      <ThreeCanvas
        width={1080}
        height={1920}
        orthographic
        camera={{position: [10, 8.5, 10], zoom: 128, near: 0.1, far: 200}}
      >
        <CameraRig frame={frame} />
        {/* cahaya V4: langit-tanah (hemisphere) + matahari hangat + isi biru dari belakang agar sisi gelap tidak datar */}
        <hemisphereLight args={['#d4ebff', '#8a6a48', 0.5]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[6, 12, 4]} intensity={1.5} color="#fff3da" />
        <directionalLight position={[-8, 6, -6]} intensity={0.45} color="#9ccbff" />

        <group position={[shake, bob, 0]}>
          {/* Pulau Ep001 tumbuh dari radius 3 menjadi 11.7, sekitar 6x area dibanding EP002 versi awal */}
          <ExpandedIsland frame={frame} startFrame={ISLAND_START} />
          {/* dekorasi muncul mengikuti tepi tanah yang membesar (awal episode tetap kosong) */}
          <IslandDecor frame={frame} startFrame={ISLAND_START} />
          {/* rumah & sawah muncul bertahap lalu tetap ada sampai frame terakhir */}
          <GobiHouse frame={frame} startFrame={HOUSE_START} scale={HOUSE_SCALE} />
          <RiceField frame={frame} startFrame={FIELD_START} scale={FIELD_SCALE} />
          {/* bayangan lembut Gobi: mengecil saat melompat, melebar saat berbaring */}
          <ContactShadow
            position={[pose.x, 0, pose.z]}
            rx={(0.85 + 0.35 * (pose.lie ?? 0)) * (1 - 0.25 * Math.min(1, pose.hop ?? 0))}
            rz={(0.7 + 0.5 * (pose.lie ?? 0)) * (1 - 0.25 * Math.min(1, pose.hop ?? 0))}
            opacity={0.3 * (1 - 0.4 * Math.min(1, pose.hop ?? 0))}
          />
          <Gobi frame={frame} pose={pose} />
          <GobiEmotes t={t} pose={pose} zoom={cam.zoom} />
          {/* dua warga: pop-in saat Gobi sadar ("siapa kalian?!"), lalu terus berpatroli sampai akhir */}
          <Villagers frame={frame} visibleFromFrame={NPC_START} nameZoom={cam.zoom} />
        </group>

        <Cloud position={cloudAt(-3.3, 4.2, drift)} scale={0.8} />
        <Cloud position={cloudAt(3.0, 6.0, -drift * 0.8)} scale={0.65} />
        <Cloud position={cloudAt(-3.6, -0.6, drift * 0.6)} scale={0.6} />
        <Cloud position={cloudAt(3.5, -2.2, -drift * 0.7)} scale={0.65} />
        <Cloud position={cloudAt(-1.2, 7.4, drift * 0.5)} scale={0.7} />
        <Cloud position={cloudAt(1.8, -4.6, -drift * 0.4)} scale={0.75} />
      </ThreeCanvas>

      {/* vignette halus: mata tertarik ke tengah (V4) */}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at 50% 46%, rgba(0,0,0,0) 58%, rgba(25,35,90,0.26) 100%)', pointerEvents: 'none'}}
      />
      {flash > 0.001 && <AbsoluteFill style={{background: '#ffffff', opacity: flash, pointerEvents: 'none'}} />}

      {/* Dua screenshot komentar ASLI di bagian atas (di atas pulau, jauh dari area subtitle y>1430) */}
      <CommentCard
        file="episode002/comment_01_expand_home_food.png"
        nativeW={451}
        nativeH={53}
        width={940}
        tIn={T.card1In}
        tOut={T.card1Out}
        t={t}
        top={190}
        tiltDeg={-1.5}
      />
      <CommentCard
        file="episode002/comment_02_farm_rice.png"
        nativeW={316}
        nativeH={52}
        width={720}
        tIn={T.card2In}
        tOut={T.card2Out}
        t={t}
        top={190}
        tiltDeg={1.5}
      />

      {/* layer teratas: subtitle (placeholder `null` sampai Claude C mengganti isinya) */}
      <Ep002Captions />
    </AbsoluteFill>
  );
};
