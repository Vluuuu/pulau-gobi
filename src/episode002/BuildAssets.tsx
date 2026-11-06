import React from 'react';
import {ExpandedIsland} from './ExpandedIsland';
import {GobiHouse} from './GobiHouse';
import {RiceField} from './RiceField';
import {FIELD_BUILD_FRAMES, HOUSE_BUILD_FRAMES, ISLAND_EXPAND_FRAMES, HOUSE_SCALE, FIELD_SCALE} from './buildTimeline';

export type BuildAssetsProps = {
  /** Frame komposisi Remotion. */
  frame: number;
  islandStart?: number;
  houseStart?: number;
  fieldStart?: number;
  islandFrames?: number;
  houseFrames?: number;
  fieldFrames?: number;
};

/**
 * Opsional: ketiga aset sekaligus pada penempatan bawaan. Taruh di dalam <ThreeCanvas>
 * (menggantikan <Island /> pada adegan Episode 002). Tidak termasuk Gobi/kamera/cahaya.
 */
export const BuildAssets: React.FC<BuildAssetsProps> = ({
  frame,
  islandStart = 0,
  houseStart = ISLAND_EXPAND_FRAMES,
  fieldStart = ISLAND_EXPAND_FRAMES + HOUSE_BUILD_FRAMES,
  islandFrames = ISLAND_EXPAND_FRAMES,
  houseFrames = HOUSE_BUILD_FRAMES,
  fieldFrames = FIELD_BUILD_FRAMES,
}) => (
  <group>
    <ExpandedIsland frame={frame} startFrame={islandStart} durationFrames={islandFrames} />
    <GobiHouse frame={frame} startFrame={houseStart} durationFrames={houseFrames} scale={HOUSE_SCALE} />
    <RiceField frame={frame} startFrame={fieldStart} durationFrames={fieldFrames} scale={FIELD_SCALE} />
  </group>
);
