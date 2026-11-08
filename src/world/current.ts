// The viewer and future episodes consume this same entry point. Change the active
// snapshot/assembler here when EP006 adds assets; do not create viewer-only meshes.
export {World006 as CurrentWorld} from './ep006/World';
export {POST_EP006_WORLD as CURRENT_WORLD_STATE} from './ep006/snapshot.ts';
export {SceneLighting as WorldLighting} from '../episode003/camera/SceneCamera';

export type WorldLandmark = {id: string; name: string; description: string; sceneNames: readonly string[]};
// Names reference owning asset roots, so focus bounds come from real geometry.
// New root assets still render automatically; add a landmark only for quick focus.
export const WORLD_LANDMARKS: readonly WorldLandmark[] = [
  {id: 'school', name: 'Sekolah Pulau Gobi', description: '3 sayap · 2 lantai · A01 & A02', sceneNames: ['school-001-post-ep005-v1']},
  {id: 'house', name: 'Rumah Gobi', description: 'Rumah tingkat dari dunia lama', sceneNames: ['house-001']},
  {id: 'kost', name: 'Kost', description: '2 lantai · 6 kamar', sceneNames: ['ep004-kost-six-rooms']},
  {id: 'warteg', name: 'Warteg', description: 'Etalase & persediaan EP005', sceneNames: ['warteg-001']},
  {id: 'ranch', name: 'Kandang sapi', description: '3 sapi permanen · pakan & air', sceneNames: ['ranch-004']},
  {id: 'farm', name: 'Kebun', description: 'Tunas jagung & wortel · irigasi', sceneNames: ['farm-004']},
  {id: 'rice', name: 'Sawah lama', description: 'Kondisi setelah panen', sceneNames: ['rice-plot-001']},
  {id: 'river', name: 'Sungai', description: 'Sungai EP006 lebih lebar · ikan', sceneNames: ['river-001', 'river-fish-006']},
  {id: 'bridge', name: 'Jembatan', description: 'Bentang diperpanjang · railing · jalan terhubung', sceneNames: ['bridge-001']},
  {id: 'observation', name: 'Belajar alam', description: 'Dek observasi ikan · pagar', sceneNames: ['river-observation-006']},
  {id: 'waterfall', name: 'Air terjun', description: 'Aliran panjang & kabut di bawah', sceneNames: ['waterfall-001']},
];
