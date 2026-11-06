import React, {useEffect, useMemo} from 'react';
import * as THREE from 'three';
import {EP003_WORLD_LAYOUT} from '../layout.ts';
import {buildTerrainBuffers, computeRocks, resolveRadius} from './render/terrainGeometry.ts';

export type ExpandedIslandEP003Props = {
  /** progress ekspansi lokal 0..1 (di luar rentang di-clamp). 0 = pulau EP002 (radius 11.7). */
  progress: number;
  /** diterima demi kontrak; terrain statis terhadap frame sehingga tidak dipakai. */
  frame?: number;
  /** radius circum AKHIR (default EP003_WORLD_LAYOUT.targetRadius = 37.5, sementara). */
  radius?: number;
};

/**
 * Pulau melayang EP003: satu mesh (top rumput bertrench sungai + sisi rumput + tanah + kerucut batu
 * bergerigi) dengan vertex color flat-shaded, ditambah batu menempel. Tanpa air, rumah, sawah, warteg,
 * NPC, efek ekspansi (A1c) atau overlay. Y top = 0 jauh dari sungai; parit mengikuti sampleRiverTrenchHeight.
 */
export const ExpandedIslandEP003: React.FC<ExpandedIslandEP003Props> = ({progress, radius}) => {
  const L = EP003_WORLD_LAYOUT;
  const target = radius ?? L.targetRadius;
  // radius terlihat; dikunci ke 1e-4 agar geometri tidak dibangun ulang karena noise float.
  const R = Math.round(resolveRadius(progress, L.initialRadius, target) * 1e4) / 1e4;

  const geometry = useMemo(() => {
    const b = buildTerrainBuffers(R, L.river);
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(b.positions, 3));
    g.setAttribute('color', new THREE.BufferAttribute(b.colors, 3));
    g.setIndex(new THREE.BufferAttribute(b.indices, 1));
    g.computeVertexNormals();
    g.computeBoundingSphere();
    return g;
  }, [R, L.river]);
  useEffect(() => () => geometry.dispose(), [geometry]);

  const rocks = useMemo(() => computeRocks(progress, R), [progress, R]);

  return (
    <group>
      <mesh geometry={geometry}>
        <meshStandardMaterial vertexColors flatShading />
      </mesh>
      {rocks.map((rk, i) => (
        <mesh key={i} position={rk.position} rotation={rk.rotation} scale={rk.scale}>
          {rk.kind === 'spike' ? <coneGeometry args={[0.6, 1, 5]} /> : <dodecahedronGeometry args={[1, 0]} />}
          <meshStandardMaterial color={rk.color} flatShading />
        </mesh>
      ))}
    </group>
  );
};

