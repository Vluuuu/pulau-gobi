import React from 'react';
import {Composition} from 'remotion';
import {Episode001} from './Episode001';
import {Episode002, EP002_DURATION_IN_FRAMES} from './Episode002Scene';
import {BuildPreview, BUILD_PREVIEW_FRAMES} from './episode002/BuildPreview';
import {NpcPreview, NPC_PREVIEW_FRAMES} from './episode002/NpcPreview';
import {DURATION_IN_FRAMES, FPS} from './timeline';
import {Episode003,EP003_DURATION_IN_FRAMES} from './Episode003Scene';
import {Episode004VisualPilot,EP004_PILOT_DURATION} from './episode004/pilot/PilotScene';
import {Episode004,EP004_DURATION_IN_FRAMES} from './episode004/production/Episode004';

export const Root: React.FC = () => (
  <>
  <Composition id="Episode004" component={Episode004} durationInFrames={EP004_DURATION_IN_FRAMES} fps={30} width={1080} height={1920}/>
  <Composition id="Episode004VisualPilot" component={Episode004VisualPilot} durationInFrames={EP004_PILOT_DURATION} fps={30} width={1080} height={1920}/>
  <Composition id="Episode003" component={Episode003} durationInFrames={EP003_DURATION_IN_FRAMES} fps={30} width={1080} height={1920} />
  <Composition
    id="Episode002"
    component={Episode002}
    durationInFrames={EP002_DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
  <Composition
    id="Episode001"
    component={Episode001}
    durationInFrames={DURATION_IN_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
  <Composition
    id="Ep002BuildPreview"
    component={BuildPreview}
    durationInFrames={BUILD_PREVIEW_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
  <Composition
    id="Ep002NpcPreview"
    component={NpcPreview}
    durationInFrames={NPC_PREVIEW_FRAMES}
    fps={FPS}
    width={1080}
    height={1920}
  />
  </>
);
