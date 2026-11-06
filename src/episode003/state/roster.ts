/**
 * Roster EP003: 2 warga lama (diturunkan LANGSUNG dari EP002 agar ID tidak drift) + tepat 4 NPC baru.
 * Murni data, deterministik, tanpa Math.random.
 */
import {VILLAGER_ROSTER} from '../../episode002/villagerRoster.ts';
import type {VillagerData} from '../../episode002/villagerRoster.ts';
import type {Ep003Villager, FollowAggregate} from './types.ts';

export const FPS = 30;
/** Nama muncul ±2–3 detik saja. */
export const NAME_CARD_FRAMES = {min: 2 * FPS, max: 3 * FPS} as const;

export const LEGACY_VILLAGER_IDS = ['warga-1', 'warga-2'] as const;
export const NEW_VILLAGER_IDS = ['warga-3', 'warga-4', 'warga-5', 'warga-6'] as const;
export const VILLAGER_ID_BY_USERNAME = {
  'oktaa.blushh': 'warga-1',
  'Afriza SuperStore': 'warga-2',
  shifalina_: 'warga-3',
  damar_zan: 'warga-4',
  'Eka Agustin': 'warga-5',
  'joy.__3.15': 'warga-6',
} as const;

/** Agregat 33/55/17 — SENGAJA terpisah dari roster. */
export const FOLLOW_AGGREGATE: FollowAggregate = {
  instagram: 33,
  tiktok: 55,
  youtube: 17,
  totalCrossPlatformFollows: 33 + 55 + 17,
  uniquePeopleVerified: false,
  registeredNpcCount: false,
  narration: '105 follow lintas platform disebut calon warga secara naratif; bukan 105 user unik dan bukan 105 NPC.',
};

const fromLegacy = (v: VillagerData): Ep003Villager => ({
  id: v.id,
  displayName: v.name ?? v.id,
  tier: 'special',
  cohortEpisode: 2,
  isNewInEp003: false,
  eligibility: 'creator-selected',
  storyRole: 'Warga Spesial angkatan pertama (EP002).',
  nameSource: v.nameSource ?? 'episode002/villagerRoster.ts',
  nameVerifiedAgainstScreenshot: v.nameVerified === true,
  nameSide: v.nameSide ?? 'center',
  nameCardFrames: {...NAME_CARD_FRAMES},
  behavior: {
    kind: 'patrol',
    // jalur absolut EP002 dipertahankan apa adanya
    relativePath: v.path.map((p) => [p[0], p[1]] as [number, number]),
    speed: v.speed,
    pauseEndFrames: v.pauseEndFrames,
    pauseMidFrames: v.pauseMidFrames,
    offsetFrames: v.offsetFrames,
    appearDelayFrames: v.appearDelayFrames,
    note: 'Jalur absolut EP002 (bukan relatif anchor). Jika Gobi/pulau berubah tata letak, B/A yang memutuskan.',
  },
  visual: {
    seed: v.id === 'warga-1' ? 1001 : 1002,
    shirt: v.shirt,
    hair: v.hair,
    pants: v.pants ?? '#2b3a55',
    skin: v.skin ?? '#f1c9a5',
    scale: v.scale ?? 1,
    hairStyle: 0,
    accessory: null,
  },
  flags: ['legacy-ep002'],
});

const legacy = LEGACY_VILLAGER_IDS.map((id) => {
  const v = VILLAGER_ROSTER.find((r) => r.id === id);
  if (!v) throw new Error(`EP002 roster kehilangan ${id}`);
  return fromLegacy(v);
});

const NAME_SRC = 'docs/EP003_MINI_BRIEF.md (screenshot EP003 tidak ada di paket E)';

const newcomers: Ep003Villager[] = [
  {
    id: 'warga-3',
    displayName: 'shifalina_',
    tier: 'special',
    cohortEpisode: 3,
    isNewInEp003: true,
    eligibility: 'creator-selected',
    storyRole: 'Warga Spesial; komentar rumah tingkat + warteg + ingin berjualan; penjaga warteg.',
    nameSource: NAME_SRC,
    nameVerifiedAgainstScreenshot: false,
    nameSide: 'right',
    nameCardFrames: {...NAME_CARD_FRAMES},
    behavior: {
      kind: 'stationed-at-structure',
      anchorId: 'warteg-001',
      relativePath: [[-0.6, 1.4], [0.6, 1.4]],
      gestures: ['ask-payment', 'serve-food'],
      speed: 0.012,
      pauseEndFrames: 90,
      pauseMidFrames: 30,
      note: 'Berdiri di depan warteg; gestur minta bayar saat Gobi ingin makan.',
    },
    visual: {seed: 3003, shirt: '#e85d9a', hair: '#2a1d1a', pants: '#3a3f58', skin: '#e8b98f', scale: 1, hairStyle: 2, accessory: 0},
    flags: ['special', 'warteg-keeper'],
  },
  {
    id: 'warga-4',
    displayName: 'damar_zan',
    tier: 'special',
    cohortEpisode: 3,
    isNewInEp003: true,
    eligibility: 'creator-selected',
    storyRole: 'Warga Spesial; idenya untuk ekspansi pulau/sungai diwujudkan.',
    nameSource: NAME_SRC,
    nameVerifiedAgainstScreenshot: false,
    nameSide: 'left',
    nameCardFrames: {...NAME_CARD_FRAMES},
    behavior: {
      kind: 'wander-near-structure',
      anchorId: 'river-001',
      relativePath: [[-1.5, 0], [0, 0.8], [1.5, 0]],
      speed: 0.018,
      offsetFrames: 40,
    },
    visual: {seed: 4004, shirt: '#3fae7a', hair: '#1f1a17', pants: '#5a4a3a', skin: '#d9a77d', scale: 1, hairStyle: 1, accessory: null},
    flags: ['special', 'expansion-idea'],
  },
  {
    id: 'warga-5',
    displayName: 'Eka Agustin',
    tier: 'special',
    cohortEpisode: 3,
    isNewInEp003: true,
    eligibility: 'creator-selected',
    storyRole: 'Warga Spesial; ide sungai diwujudkan.',
    nameSource: NAME_SRC,
    nameVerifiedAgainstScreenshot: false,
    nameSide: 'center',
    nameCardFrames: {...NAME_CARD_FRAMES},
    behavior: {
      kind: 'wander-near-structure',
      anchorId: 'river-001',
      relativePath: [[1.2, 1.6], [2.4, 2.2]],
      speed: 0.016,
      offsetFrames: 95,
    },
    visual: {seed: 5005, shirt: '#8e6bd8', hair: '#4a2f22', pants: '#2f4a5e', skin: '#f0c8a0', scale: 1, hairStyle: 3, accessory: 1},
    flags: ['special', 'river-idea'],
  },
  {
    id: 'warga-6',
    displayName: 'joy.__3.15',
    tier: 'regular',
    cohortEpisode: 3,
    isNewInEp003: true,
    eligibility: 'pending-verification',
    storyRole: 'Warga biasa terpilih oleh kreator.',
    nameSource: NAME_SRC,
    nameVerifiedAgainstScreenshot: false,
    nameSide: 'right',
    nameCardFrames: {...NAME_CARD_FRAMES},
    behavior: {
      kind: 'patrol',
      relativePath: [[-3.0, 5.5], [-2.0, 6.2], [-1.0, 5.5]],
      speed: 0.02,
      offsetFrames: 150,
    },
    visual: {seed: 6006, shirt: '#f2b134', hair: '#241a15', pants: '#3b3b4f', skin: '#e0b088', scale: 1, hairStyle: 0, accessory: null},
    flags: ['regular', 'PENDING: follow + komentar "Jadi Warga" belum diverifikasi'],
  },
];

/** Roster EP003 tertib: warga-1, warga-2, lalu 4 pendatang. */
export const EP003_ROSTER: readonly Ep003Villager[] = [...legacy, ...newcomers];

export const EP003_NEW_VILLAGERS: readonly Ep003Villager[] = EP003_ROSTER.filter((v) => v.isNewInEp003);

export const getVillagerById = (id: string): Ep003Villager | undefined => EP003_ROSTER.find((v) => v.id === id);
export const getVillagerByName = (name: string): Ep003Villager | undefined => EP003_ROSTER.find((v) => v.displayName === name);

/** Gobi + roster (bukan 105). */
export const EP003_POPULATION_INCLUDING_GOBI = 1 + EP003_ROSTER.length;
