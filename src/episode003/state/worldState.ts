/**
 * Snapshot dunia EP003 (DRAFT, belum final QA). Murni data + satu factory kecil.
 * TIDAK menulis docs/world/EP003_STATE.json (file resmi menunggu visual approved).
 */
import {EP003_ROSTER, EP003_POPULATION_INCLUDING_GOBI, FOLLOW_AGGREGATE} from './roster.ts';
import type {Ep003WorldState, Ep003Structure, Ep003Farm, Ep003River, Ep003Decorations} from './types.ts';

/** Radius EP002 = 11.7 (3 * 3.9). Rentang desain EP003 = 35–40; belum diputuskan. */
export const EP002_ISLAND_RADIUS = 11.7;
export const ISLAND_RADIUS_RANGE = {min: 35, max: 40} as const;
export const DEFAULT_ISLAND_RADIUS = 37.5;

export const STABLE_IDS = {
  island: 'island-main',
  house: 'house-001',
  riceField: 'rice-plot-001',
  warteg: 'warteg-001',
  river: 'river-001',
  gobi: 'gobi',
} as const;

const FACING = Math.PI / 4;

/** Dipertahankan dari EP002: posisi/rotasi/skala IDENTIK (hanya lantai bertambah). */
const house: Ep003Structure = {
  id: STABLE_IDS.house,
  type: 'wooden-house',
  islandId: 'island-main',
  position: [-5, 0, -1],
  rotationYRadians: FACING,
  scale: 1.65,
  floors: 2,
  placement: 'preserved-from-ep002',
  status: 'existing-renovated',
  renovatedFrom: {floors: 1},
  note: 'Rumah kayu LAMA direnovasi ke lantai dua; bukan rumah baru.',
};

/** Placeholder: di luar radius EP002 (11.7) agar tidak menabrak dekor lama. Claude A boleh menimpa. */
const warteg: Ep003Structure = {
  id: STABLE_IDS.warteg,
  type: 'warteg',
  islandId: 'island-main',
  position: [14, 0, 6],
  rotationYRadians: FACING + Math.PI / 2,
  scale: 1.5,
  floors: 1,
  placement: 'proposed-placeholder',
  status: 'new-built',
  note: 'Posisi usulan lapisan state; layout final milik Claude A.',
};

const field: Ep003Farm = {
  id: STABLE_IDS.riceField,
  type: 'rice-field',
  islandId: 'island-main',
  position: [4.9, 0, -2.6],
  rotationYRadians: FACING,
  scale: 1.9,
  status: 'planted-not-harvested',
};

const river: Ep003River = {
  id: STABLE_IDS.river,
  islandId: 'island-main',
  centerline: [[-22, -6], [-16, 2], [-13, 10], [-15, 20]],
  width: 3,
  placement: 'proposed-placeholder',
};

/** Hitungan snapshot EP002_STATE.json — seluruh dekor dipertahankan. */
const decorations: Ep003Decorations = {
  preserved: true,
  source: 'docs/world/EP002_STATE.json',
  trees: 6,
  shrubs: 11,
  flowers: 47,
  grassTufts: 40,
  pebbles: 14,
};

export type DraftStateOptions = {
  /** Harus dalam [35, 40]. Default 37.5. */
  islandRadius?: number;
};

export const makeEp003DraftState = (opts: DraftStateOptions = {}): Ep003WorldState => {
  const radius = opts.islandRadius ?? DEFAULT_ISLAND_RADIUS;
  if (!Number.isFinite(radius) || radius < ISLAND_RADIUS_RANGE.min || radius > ISLAND_RADIUS_RANGE.max) {
    throw new RangeError(`islandRadius ${radius} di luar rentang ${ISLAND_RADIUS_RANGE.min}–${ISLAND_RADIUS_RANGE.max}`);
  }
  return {
    schemaVersion: 1,
    episode: 'EP003',
    status: 'draft',
    finalQa: false,
    narrative:
      'Pulau membesar cepat, rumah lama direnovasi jadi dua lantai, sungai dan warteg baru dibangun, empat pendatang tiba. Sawah belum panen.',
    island: {
      id: 'island-main',
      type: 'floating-lowpoly',
      previousRadiusWorldUnits: EP002_ISLAND_RADIUS,
      radiusRange: {...ISLAND_RADIUS_RANGE},
      radiusWorldUnits: radius,
      radiusDecided: false,
      position: [0, 0, 0],
    },
    mainCharacter: {id: 'gobi', name: 'Gobi', outfit: ['orange-shirt', 'navy-shorts', 'cream-sneakers']},
    structures: [{...house}, {...warteg}],
    farms: [{...field}],
    rivers: [{...river, centerline: river.centerline.map((p) => [p[0], p[1]] as [number, number])}],
    villagers: EP003_ROSTER.map((v) => ({...v})),
    populationIncludingGobi: EP003_POPULATION_INCLUDING_GOBI,
    followAggregate: {...FOLLOW_AGGREGATE},
    decorations: {...decorations},
    storyFlags: {
      gobiHasHouse: true,
      houseRenovated: true,
      wartegBuilt: true,
      riverBuilt: true,
      riceHarvested: false,
      wartegStockLimited: true,
      moreFoodNeeded: true,
      ep004TeaserOnly: ['livestock', 'plantation'],
    },
    note: 'DRAFT EP003. Bukan runtime state otomatis, bukan docs/world/EP003_STATE.json resmi. Penempatan "proposed-placeholder" boleh ditimpa Claude A.',
  };
};

/** Snapshot default (radius 37.5). */
export const EP003_DRAFT_STATE: Ep003WorldState = makeEp003DraftState();
