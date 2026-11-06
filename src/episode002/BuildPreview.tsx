import React, {useLayoutEffect} from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {useThree} from '@react-three/fiber';
import type {OrthographicCamera} from 'three';
import {Gobi} from '../Gobi';
import {CAM_OFFSET} from '../timeline';
import {BuildAssets} from './BuildAssets';
import {FIELD_BUILD_FRAMES, HOUSE_BUILD_FRAMES, ISLAND_EXPAND_FRAMES} from './buildTimeline';

/** Hanya untuk pratinjau/uji aset di Remotion Studio; BUKAN episode dan tidak punya audio/subtitle. */
export const PREVIEW_START = 15; // jeda awal agar pulau lama terlihat dulu
export const BUILD_PREVIEW_FRAMES =
  PREVIEW_START + ISLAND_EXPAND_FRAMES + HOUSE_BUILD_FRAMES + FIELD_BUILD_FRAMES + 45;

const PreviewCamera: React.FC = () => {
  const camera = useThree((s) => s.camera) as OrthographicCamera;
  useLayoutEffect(() => {
    const target: [number, number, number] = [0, -0.4, -0.6];
    camera.position.set(target[0] + CAM_OFFSET[0], target[1] + CAM_OFFSET[1], target[2] + CAM_OFFSET[2]);
    camera.zoom = 42;
    camera.lookAt(...target);
    camera.updateProjectionMatrix();
  });
  return null;
};

export const BuildPreview: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: 'linear-gradient(180deg, #8fd3ff 0%, #cfe9ff 55%, #ffe3f1 100%)'}}>
      <ThreeCanvas width={1080} height={1920} orthographic camera={{position: [10, 8.5, 10], zoom: 100, near: 0.1, far: 200}}>
        <PreviewCamera />
        <ambientLight intensity={0.9} />
        <directionalLight position={[6, 12, 4]} intensity={1.6} />
        <BuildAssets
          frame={frame}
          islandStart={PREVIEW_START}
          houseStart={PREVIEW_START + ISLAND_EXPAND_FRAMES}
          fieldStart={PREVIEW_START + ISLAND_EXPAND_FRAMES + HOUSE_BUILD_FRAMES}
        />
        {/* Gobi hanya sebagai pembanding skala (pose diam pada frame 60 Ep001) */}
        <Gobi frame={60} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
