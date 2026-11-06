import React, {useMemo} from 'react';
import {Shape} from 'three';
import type {} from '@react-three/fiber';
import {HousePartBatch} from './HousePartBatch.tsx';
import {HOUSE, HOUSE_COLORS, HOUSE_TOP, buildHouseEffects, buildOriginalHouseParts, buildOriginalRoofParts,
  buildUpperHouseParts, housePose, resolveHousePlacement} from './houseModel.ts';

export type RenovatedHouseEP003Props = {
  progress: number;
  frame?: number;
  position?: readonly [number, number, number];
  rotationY?: number;
  scale?: number;
};

/** One persistent EP002 house; one roof assembly is lifted and reused above the new floor. */
export const RenovatedHouseEP003: React.FC<RenovatedHouseEP003Props> = ({progress, frame = 0, position, rotationY, scale}) => {
  const placement = resolveHousePlacement({position, rotationY, scale});
  const pose = housePose(progress, frame);
  const original = useMemo(buildOriginalHouseParts, []);
  const roof = useMemo(buildOriginalRoofParts, []);
  const upper = useMemo(() => buildUpperHouseParts(pose.progress), [pose.progress]);
  const effects = useMemo(() => buildHouseEffects(pose.progress, frame), [pose.progress, frame]);
  const gable = useMemo(() => {
    const shape = new Shape(); shape.moveTo(-HOUSE.width / 2, 0); shape.lineTo(HOUSE.width / 2, 0);
    shape.lineTo(0, HOUSE.gableHeight); shape.closePath(); return shape;
  }, []);
  return <group name="house-001" position={[...placement.position]} rotation-y={placement.rotationY} scale={placement.scale}>
    <group name="house-contact-shadow" position={[0.25, 0.012, -0.15]}>
      {[1, 0.72].map((m, i) => <mesh key={i} rotation-x={-Math.PI / 2} position={[0, i * 0.004, 0]} scale={[2.75 * m, 2.42 * m, 1]}>
        <circleGeometry args={[1, 32]} /><meshBasicMaterial color="#1b3a22" transparent opacity={0.3 * (i === 0 ? 0.55 : 0.75)} depthWrite={false} />
      </mesh>)}
    </group>
    <group name="house-original-ground-floor"><HousePartBatch parts={original} /></group>
    <group name="house-new-upper-floor"><HousePartBatch parts={upper} /></group>
    <group name="house-original-roof" position={[0, pose.roofRise, 0]} rotation={[...pose.roofRotation]}>
      <HousePartBatch parts={roof} />
      <mesh name="house-original-gable" position={[0, HOUSE_TOP, -HOUSE.depth / 2]} castShadow receiveShadow>
        <extrudeGeometry args={[gable, {depth: HOUSE.depth, bevelEnabled: false}]} />
        <meshStandardMaterial color={HOUSE_COLORS.wallA} roughness={0.88} flatShading />
      </mesh>
    </group>
    <group name="house-renovation-fx"><HousePartBatch parts={effects} /></group>
  </group>;
};
