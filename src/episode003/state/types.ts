/**
 * EP003 state layer — tipe saja (tanpa UI, tanpa mesh, tanpa React/three).
 * Hanya sintaks TS yang bisa dihapus (erasable) supaya aman dijalankan Node langsung.
 */
import type {Waypoint} from '../../episode002/villagerPath.ts';

export type VillagerTier = 'special' | 'regular';

/** Status seleksi. `pending-verification` = syarat belum diperiksa; JANGAN dianggap lolos. */
export type EligibilityStatus = 'creator-selected' | 'pending-verification';

export type NameSide = 'left' | 'right' | 'center';

export type BehaviorKind = 'patrol' | 'stationed-at-structure' | 'wander-near-structure';

export type BehaviorHint = {
  kind: BehaviorKind;
  /** ID struktur/lokasi acuan (mis. `warteg-001`), jika ada. */
  anchorId?: string;
  /** Jalur relatif terhadap anchor (x,z) — kalau `anchorId` ada; absolut jika tidak. */
  relativePath?: Waypoint[];
  /** Gestur yang boleh dipakai Claude D/B; hanya petunjuk, bukan animasi. */
  gestures?: string[];
  speed?: number;
  pauseEndFrames?: number;
  pauseMidFrames?: number;
  offsetFrames?: number;
  appearDelayFrames?: number;
  note?: string;
};

export type VisualVariantSeed = {
  /** Seed integer deterministik untuk variasi mesh (tidak memakai Math.random). */
  seed: number;
  shirt: string;
  hair: string;
  pants: string;
  skin: string;
  scale: number;
  /** Variasi kecil 0..3 untuk bentuk rambut/aksesori; arti ditentukan Claude D. */
  hairStyle: number;
  accessory: number | null;
};

export type Ep003Villager = {
  /** ID stabil lintas episode. Warga lama = `warga-N` (tidak boleh berubah). */
  id: string;
  displayName: string;
  tier: VillagerTier;
  /** 1 = angkatan EP002, 3 = datang di EP003. */
  cohortEpisode: 2 | 3;
  isNewInEp003: boolean;
  eligibility: EligibilityStatus;
  /** Alasan/peran di cerita (narasi dari brief). */
  storyRole: string;
  /** Sumber nama. Screenshot EP003 TIDAK ada di paket ini, jadi belum diverifikasi ke gambar. */
  nameSource: string;
  nameVerifiedAgainstScreenshot: boolean;
  nameSide: NameSide;
  /** Nama tampil sebentar saja (frame, 30 FPS), bukan label permanen. */
  nameCardFrames: {min: number; max: number};
  behavior: BehaviorHint;
  visual: VisualVariantSeed;
  /** Catatan yang wajib terbawa ke downstream (mis. verifikasi pending). */
  flags: string[];
};

export type FollowAggregate = {
  instagram: number;
  tiktok: number;
  youtube: number;
  /** Penjumlahan lintas platform. BUKAN jumlah orang unik, BUKAN jumlah NPC. */
  totalCrossPlatformFollows: number;
  uniquePeopleVerified: false;
  registeredNpcCount: false;
  narration: string;
};

export type IslandConfig = {
  id: 'island-main';
  type: 'floating-lowpoly';
  previousRadiusWorldUnits: number;
  radiusRange: {min: number; max: number};
  /** Radius dipakai. Belum final: ubah lewat `makeEp003DraftState({islandRadius})`. */
  radiusWorldUnits: number;
  radiusDecided: false;
  position: [number, number, number];
};

export type Placement = 'preserved-from-ep002' | 'proposed-placeholder';

export type Ep003Structure = {
  id: string;
  type: 'wooden-house' | 'warteg';
  islandId: 'island-main';
  position: [number, number, number];
  rotationYRadians: number;
  scale: number;
  floors: number;
  placement: Placement;
  status: 'existing-renovated' | 'new-built';
  renovatedFrom?: {floors: number};
  note?: string;
};

export type Ep003Farm = {
  id: string;
  type: 'rice-field';
  islandId: 'island-main';
  position: [number, number, number];
  rotationYRadians: number;
  scale: number;
  status: 'planted-not-harvested';
};

export type Ep003River = {
  id: string;
  islandId: 'island-main';
  /** Polyline [x,z] di bidang pulau. Placeholder — Claude A boleh menimpa. */
  centerline: Waypoint[];
  width: number;
  placement: Placement;
};

export type Ep003Decorations = {
  /** Seluruh dekor EP002 dipertahankan. Hitungan = snapshot EP002_STATE. */
  preserved: true;
  source: 'docs/world/EP002_STATE.json';
  trees: number;
  shrubs: number;
  flowers: number;
  grassTufts: number;
  pebbles: number;
};

export type Ep003StoryFlags = {
  gobiHasHouse: true;
  houseRenovated: true;
  wartegBuilt: true;
  riverBuilt: true;
  riceHarvested: false;
  wartegStockLimited: true;
  moreFoodNeeded: true;
  /** Peternakan/perkebunan hanya teaser EP004 — tidak dibangun di EP003. */
  ep004TeaserOnly: readonly string[];
};

export type Ep003WorldState = {
  schemaVersion: 1;
  episode: 'EP003';
  /** Selalu `draft` sampai visual disetujui. Tidak boleh dianggap final QA. */
  status: 'draft';
  finalQa: false;
  narrative: string;
  island: IslandConfig;
  mainCharacter: {id: 'gobi'; name: 'Gobi'; outfit: readonly string[]};
  structures: Ep003Structure[];
  farms: Ep003Farm[];
  rivers: Ep003River[];
  villagers: Ep003Villager[];
  /** Gobi + warga terdaftar di roster (bukan 105). */
  populationIncludingGobi: number;
  followAggregate: FollowAggregate;
  decorations: Ep003Decorations;
  storyFlags: Ep003StoryFlags;
  note: string;
};
