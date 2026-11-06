import type {Waypoint} from './villagerPath';

export type VillagerData = {
  /** ID tetap untuk roster lintas episode. */
  id: string;
  /** Nama di layar (opsional). Diambil persis dari screenshot komentar asli. */
  name?: string;
  /** Sumber nama (file screenshot) dan status verifikasi baca. */
  nameSource?: string;
  nameVerified?: boolean;
  /** Papan nama condong ke sisi ini dari kepala agar tidak menumpuk dengan warga lain / Gobi. */
  nameSide?: 'left' | 'right' | 'center';
  shirt: string;
  hair: string;
  pants?: string;
  skin?: string;
  /** Waypoint [x,z] aman; berjalan bolak-balik. */
  path: Waypoint[];
  speed?: number;
  pauseEndFrames?: number;
  pauseMidFrames?: number;
  /** Geser fase patroli (frame) supaya tidak sinkron dengan warga lain. */
  offsetFrames?: number;
  /** Jeda muncul relatif terhadap `visibleFromFrame` (frame). */
  appearDelayFrames?: number;
  scale?: number;
};

/**
 * Roster 2 warga = 2 komentator terpilih Ep002. Nama dibaca dari screenshot asli
 * di public/episode002/ (diperbesar 4x untuk memastikan ejaan). Jalur dicek oleh test/villagerPath.test.mjs.
 * warga-1 = komentar "perbesar pulau, rumah, makanan minuman"; warga-2 = "pertenakan atau nanem padi".
 */
export const VILLAGER_ROSTER: VillagerData[] = [
  {
    id: 'warga-1',
    name: 'oktaa.blushh',
    nameSource: 'public/episode002/comment_01_expand_home_food.png',
    nameVerified: true,
    nameSide: 'left',
    shirt: '#ff7a59',
    hair: '#3b2a20',
    path: [[-1.1, 2.6], [0.1, 2.9], [1.3, 2.6]],
    offsetFrames: 0,
  },
  {
    id: 'warga-2',
    name: 'Afriza SuperStore',
    nameSource: 'public/episode002/comment_02_farm_rice.png',
    nameVerified: true,
    nameSide: 'right',
    shirt: '#4aa8ff',
    hair: '#e8c35a',
    path: [[3.5, 3.8], [3.7, 2.5], [3.8, 1.6]],
    offsetFrames: 70,
    appearDelayFrames: 20,
  },
];
