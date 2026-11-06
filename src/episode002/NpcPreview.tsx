import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import type {OrthographicCamera} from 'three';
import {Gobi} from '../Gobi';
import {CAM_OFFSET} from '../timeline';
import {ExpandedIsland} from './ExpandedIsland';
import {GobiHouse} from './GobiHouse';
import {RiceField} from './RiceField';
import {Villagers} from './Villagers';
import {VILLAGER_ROSTER} from './villagerRoster';
import {HOUSE_SCALE, FIELD_SCALE} from './buildTimeline';

/** Hanya alat uji NPC (bukan episode, tanpa audio/subtitle). Pulau, rumah, sawah dalam kondisi selesai. */
export const NPC_PREVIEW_FRAMES = 600; // 20 dtk
const APPEAR = 30;

const Cam: React.FC = () => {
  const camera = useThree((s) => s.camera) as OrthographicCamera;
  useLayoutEffect(() => {
    const t: [number, number, number] = [0, -0.4, -0.6];
    camera.position.set(t[0] + CAM_OFFSET[0], t[1] + CAM_OFFSET[1], t[2] + CAM_OFFSET[2]);
    camera.zoom = 42;
    camera.lookAt(...t);
    camera.updateProjectionMatrix();
  });
  return null;
};

export const NpcPreview: React.FC = () => {
  const frame = useCurrentFrame();
  // nama contoh HANYA untuk uji tampilan; roster asli tidak diubah
  const demo = VILLAGER_ROSTER.map((v, i) => ({...v, name: v.name ?? `Warga ${i + 1}`}));
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #8fd3ff 0%, #cfe9ff 55%, #ffe3f1 100%)'}}>
      <ThreeCanvas width={1080} height={1920} orthographic camera={{position: [10, 8.5, 10], zoom: 100, near: 0.1, far: 200}}>
        <Cam />
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 12, 4]} intensity={1.6} />
        <ExpandedIsland />
        <GobiHouse scale={HOUSE_SCALE} />
        <RiceField scale={FIELD_SCALE} />
        <Gobi frame={60} />
        <Villagers frame={frame} visibleFromFrame={APPEAR} villagers={demo} showName nameFrames={90} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
