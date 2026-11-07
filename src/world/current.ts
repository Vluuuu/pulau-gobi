// The viewer and future episodes consume this same entry point. Change the active
// snapshot/assembler here when EP006 adds assets; do not create viewer-only meshes.
export {PostEp005World as CurrentWorld} from './postEp005/World';
export {POST_EP005_WORLD as CURRENT_WORLD_STATE} from './postEp005/snapshot.ts';
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
  {id: 'river', name: 'Sungai', description: 'Aliran lama hingga bibir pulau', sceneNames: ['river-001', 'river-001-extension']},
  {id: 'waterfall', name: 'Air terjun', description: 'Aliran panjang & kabut di bawah', sceneNames: ['waterfall-001']},
];
