/**
 * EP003 world layout (A1a). Murni data, tanpa import runtime.
 * Sumber: EP003_A_SHARED_CONTRACT.md + A1_MINI_CONTRACT.md.
 * Radius target 37.5 bersifat SEMENTARA (rentang desain 35-40), bukan keputusan final.
 */
type Vec3 = readonly [number, number, number];
type Placement = {position: Vec3; rotationY: number; scale: number};

type WorldLayout = {
  initialRadius: number;
  targetRadius: number;
  house: Placement;
  riceField: Placement;
  warteg: Placement;
  river: {
    centerline: readonly (readonly [number, number])[];
    width: number;
    bedY: number;
    waterY: number;
  };
};

export const EP003_WORLD_LAYOUT: WorldLayout = {
  initialRadius: 11.7,
  targetRadius: 37.5,
  house: {position: [-5, 0, -1], rotationY: Math.PI / 4, scale: 1.65},
  riceField: {position: [4.9, 0, -2.6], rotationY: Math.PI / 4, scale: 1.9},
  warteg: {position: [14, 0, 6], rotationY: (3 * Math.PI) / 4, scale: 1.5},
  river: {
    centerline: [
      [-22, -6],
      [-16, 2],
      [-13, 10],
      [-15, 20],
    ],
    width: 3,
    bedY: -0.35,
    waterY: -0.15,
  },
};
