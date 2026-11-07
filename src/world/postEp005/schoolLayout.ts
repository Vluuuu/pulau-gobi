import {SCHOOL, SCHOOL_GATE, FLOOR_Y, SCHOOL_ACCESS} from '../../episode005/layout.ts';
import {SCHOOL_WINGS} from '../../episode005/campus.ts';
import type {V3} from '../../episode005/layout.ts';

// Surveyed from 3093d8b. These are asset coordinates, never episode camera targets.
export const SCHOOL_SITE = {...SCHOOL, position: [...SCHOOL.position] as V3};
export const WINGS = SCHOOL_WINGS.map(w => ({...w, width: 8.4, depth: 5.8}));
export const LEVELS = {ground: FLOOR_Y, ceiling: 3.64, upper: 3.96, upperCeiling: 7.0};
export const CLASSROOM = {
  id: 'A01', wing: 'A', xMin: -4.0, xMax: 4.0, zMin: -2.7, zMax: 2.7,
  floor: LEVELS.ground, ceiling: LEVELS.ceiling, desks: 8,
};
export const toWorld = (p: V3): V3 => [p[0] + SCHOOL_SITE.position[0], p[1], p[2] + SCHOOL_SITE.position[2]];
export const toLocal = (p: V3): V3 => [p[0] - SCHOOL_SITE.position[0], p[1], p[2] - SCHOOL_SITE.position[2]];

// Human clearances: Gobi is about 2.2 units tall in the owning character source.
// A01 is no longer a single cow-sized 2.78-wide door. The school gate is retained.
export const SCHOOL_PORTALS = [
  {id: 'school-gate', point: toLocal(SCHOOL_GATE), width: 3.2, height: 3.3},
  {id: 'main-entry', point: [0, FLOOR_Y, 5.84] as V3, width: 2.4, height: 2.8},
  {id: 'foyer', point: [0, FLOOR_Y, 4.3] as V3, width: 3.2, height: 3.1},
  {id: 'class-A01', point: [0, FLOOR_Y, 2.8] as V3, width: 1.5, height: 2.65},
] as const;
export const SCHOOL_ENTRY_ROUTE: readonly V3[] = [
  ...SCHOOL_ACCESS.slice(0, 3).map(toLocal),
  [0, .12, 6.45], [0, .24, 6.15], [0, FLOOR_Y, 5.95],
  ...SCHOOL_PORTALS.slice(1).map(p => p.point), [0, FLOOR_Y, 1.7], [0, FLOOR_Y, -1.4],
];
export const STAIR = {x: -7.35, upperX: -5.65, width: 1.3, startZ: -3.5, turnZ: -6.5, stepsPerFlight: 10};
const landingY = (LEVELS.ground + LEVELS.upper) / 2;
export const UPPER_ACCESS_ROUTE: readonly V3[] = [
  [0, FLOOR_Y, 4.3], [0, FLOOR_Y, 4.9], [-2.3, FLOOR_Y, 4.9], [-3.3, FLOOR_Y, 4.3],
  [-5.15, FLOOR_Y, 4.3], [-5.15, FLOOR_Y, 3.35],
  [-6.7, FLOOR_Y, 1.35], [-10, FLOOR_Y, 1.35], [-10, FLOOR_Y, .8],
  [-10, FLOOR_Y, -3.1], [-7.35, FLOOR_Y, -3.1],
  [STAIR.x, FLOOR_Y, STAIR.startZ], [STAIR.x, landingY, STAIR.turnZ],
  [STAIR.x, landingY, -6.95], [STAIR.upperX, landingY, -6.95],
  [STAIR.upperX, landingY, STAIR.turnZ], [STAIR.upperX, LEVELS.upper, STAIR.startZ],
  [STAIR.upperX, LEVELS.upper, -2.65], [-10, LEVELS.upper, -2.65],
  [-10, LEVELS.upper, .8], [-10, LEVELS.upper, 1.35], [-6.7, LEVELS.upper, 1.35],
  [-5.15, LEVELS.upper, 3.35], [0, LEVELS.upper, 3.35], [0, LEVELS.upper, 2.8],
];

export type CutawayWall = 'front' | 'back' | 'east' | 'west';
export type SchoolAssetOptions = {
  // Explicit static pose only. EP006 owns any future movement/timing.
  doors?: 'closed' | 'open';
  cutaway?: {room: 'A01' | 'A02'; walls?: readonly CutawayWall[]; overhead?: boolean};
};
