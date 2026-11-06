import React from 'react';

/** Pulau melayang low-poly: rumput, tanah, batu runcing di bawah. Kosong (tanpa rumah/pohon). */
export const Island: React.FC = () => (
  <group>
    {/* rumput */}
    <mesh position={[0, -0.15, 0]} rotation-y={Math.PI / 8}>
      <cylinderGeometry args={[3, 3, 0.3, 8]} />
      <meshStandardMaterial color="#7ed957" flatShading />
    </mesh>
    {/* tanah */}
    <mesh position={[0, -0.7, 0]} rotation-y={Math.PI / 8}>
      <cylinderGeometry args={[3, 2.5, 0.8, 8]} />
      <meshStandardMaterial color="#9a6b43" flatShading />
    </mesh>
    {/* batu runcing */}
    <mesh position={[0, -2.45, 0]} rotation={[Math.PI, Math.PI / 8, 0]}>
      <coneGeometry args={[2.5, 2.7, 8]} />
      <meshStandardMaterial color="#7a7f8c" flatShading />
    </mesh>
    {/* bongkahan kecil menggantung */}
    <mesh position={[1.6, -2.6, 0.8]}>
      <dodecahedronGeometry args={[0.35, 0]} />
      <meshStandardMaterial color="#8b909c" flatShading />
    </mesh>
    <mesh position={[-1.2, -3.1, -0.6]}>
      <dodecahedronGeometry args={[0.25, 0]} />
      <meshStandardMaterial color="#8b909c" flatShading />
    </mesh>
  </group>
);

export const Cloud: React.FC<{position: [number, number, number]; scale?: number}> = ({
  position,
  scale = 1,
}) => (
  <group position={position} scale={[scale, scale * 0.7, scale]}>
    {[
      [0, 0, 0, 1],
      [0.9, -0.15, 0.2, 0.75],
      [-0.9, -0.2, -0.1, 0.7],
      [0.3, 0.35, -0.2, 0.6],
    ].map(([x, y, z, r], i) => (
      <mesh key={i} position={[x, y, z]}>
        <icosahedronGeometry args={[r, 0]} />
        <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.45} flatShading />
      </mesh>
    ))}
  </group>
);
