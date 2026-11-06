import React, {useLayoutEffect, useMemo, useRef} from 'react';
import {Euler, InstancedMesh, Matrix4, Quaternion, Vector3} from 'three';
import type {} from '@react-three/fiber';
import {HOUSE_COLORS} from './houseModel.ts';
import type {HousePart} from './houseModel.ts';

const Instances: React.FC<{parts: readonly HousePart[]}> = ({parts}) => {
  const ref = useRef<InstancedMesh>(null);
  const material = parts[0].material, kind = parts[0].kind ?? 'box';
  useLayoutEffect(() => {
    if (!ref.current) return;
    const matrix = new Matrix4(), q = new Quaternion(), euler = new Euler(), position = new Vector3(), scale = new Vector3();
    parts.forEach((part, i) => {
      position.fromArray(part.position); scale.fromArray(part.size);
      euler.set(...(part.rotation ?? [0, 0, 0])); q.setFromEuler(euler);
      matrix.compose(position, q, scale); ref.current!.setMatrixAt(i, matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
    ref.current.computeBoundingSphere(); ref.current.computeBoundingBox();
  }, [parts]);
  return <instancedMesh ref={ref} args={[undefined, undefined, parts.length]} castShadow receiveShadow
    name={`house-parts-${material}-${kind}`} userData={{partIds: parts.map((p) => p.id)}}>
    {kind === 'sphere' ? <sphereGeometry args={[1, 6, 6]} /> : kind === 'octahedron' ? <octahedronGeometry args={[1, 0]} /> : <boxGeometry args={[1, 1, 1]} />}
    <meshStandardMaterial color={HOUSE_COLORS[material]} roughness={material === 'glass' ? 0.34 : 0.88}
      metalness={material === 'knob' ? 0.18 : 0} flatShading
      emissive={material === 'glass' ? HOUSE_COLORS.glass : material === 'sparkle' ? HOUSE_COLORS.sparkle : '#000000'}
      emissiveIntensity={material === 'glass' ? 0.35 : material === 'sparkle' ? 0.25 : 0} />
  </instancedMesh>;
};

/** Batches every material/primitive, including moving construction pieces, into instanced draws. */
export const HousePartBatch: React.FC<{parts: readonly HousePart[]}> = ({parts}) => {
  const groups = useMemo(() => {
    const batches = new Map<string, HousePart[]>();
    parts.forEach((part) => { const key = `${part.material}-${part.kind ?? 'box'}`;
      if (!batches.has(key)) batches.set(key, []); batches.get(key)!.push(part); });
    return [...batches.entries()];
  }, [parts]);
  return <>{groups.map(([key, batch]) => <Instances key={`${key}-${batch.length}`} parts={batch} />)}</>;
};
