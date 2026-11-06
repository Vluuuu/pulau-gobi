import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import type {} from '@react-three/fiber';
import {createRiverModel} from './riverMath.ts';
import type {RiverOptions} from './riverMath.ts';
import {buildRiverBanks, buildRiverHighlights, buildRiverLining, buildRiverWater} from './riverGeometry.ts';
import type {RiverBuffers} from './riverGeometry.ts';

export type RiverEP003Props = {
  progress: number;
  frame: number;
  centerline?: readonly (readonly [number, number])[];
  width?: number;
  bedY?: number;
  waterY?: number;
};

function geometryFrom(buffers: RiverBuffers): THREE.BufferGeometry {
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.BufferAttribute(buffers.positions, 3));
  g.setAttribute('color', new THREE.BufferAttribute(buffers.colors, 3));
  g.setIndex(new THREE.BufferAttribute(buffers.indices, 1));
  g.computeVertexNormals();
  g.computeBoundingSphere();
  return g;
}

const RiverMeshes: React.FC<RiverEP003Props & {options: RiverOptions}> = ({progress, frame, options}) => {
  const model = useMemo(() => createRiverModel(options), [options]);
  const banks = useMemo(() => model ? geometryFrom(buildRiverBanks(model, progress)) : null, [model, progress]);
  const lining = useMemo(() => model ? geometryFrom(buildRiverLining(model, progress)) : null, [model, progress]);
  const water = useMemo(() => model ? geometryFrom(buildRiverWater(model, progress, frame)) : null, [model, progress, frame]);
  const highlights = useMemo(() => model ? geometryFrom(buildRiverHighlights(model, progress, frame)) : null, [model, progress, frame]);
  useEffect(() => () => { banks?.dispose(); lining?.dispose(); }, [banks, lining]);
  useEffect(() => () => { water?.dispose(); highlights?.dispose(); }, [water, highlights]);
  if (!model || !lining || !water || !banks || !highlights || !(progress > 0)) return null;
  return (
    <group name="river-001">
      <mesh name="river-bed-and-shore" geometry={lining} receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.95} />
      </mesh>
      <mesh name="river-bank-details" geometry={banks} castShadow receiveShadow>
        <meshStandardMaterial vertexColors flatShading roughness={0.9} side={THREE.DoubleSide} />
      </mesh>
      <mesh name="river-water" geometry={water} receiveShadow>
        <meshStandardMaterial vertexColors roughness={0.27} metalness={0.08} />
      </mesh>
      <mesh name="river-flow-and-ripples" geometry={highlights}>
        <meshStandardMaterial vertexColors roughness={0.44} polygonOffset polygonOffsetFactor={-1} polygonOffsetUnits={-1} />
      </mesh>
    </group>
  );
};

/** Frame-scrubbable 30 FPS river. B owns terrain expansion, shot timing and final lighting. */
export const RiverEP003: React.FC<RiverEP003Props> = ({progress, frame, centerline, width, bedY, waterY}) => {
  const options = useMemo(() => ({centerline, width, bedY, waterY}), [centerline, width, bedY, waterY]);
  return <RiverMeshes progress={progress} frame={frame} options={options} />;
};
