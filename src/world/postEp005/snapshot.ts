import {CAST, COW_IDS} from '../../episode005/direction.ts';
import {L, FARM, RANCH, CHANNEL, COW_HOME, ROUTE} from '../../episode005/layout.ts';
import {KOST} from '../../episode004/production/layout.ts';
import {SCHOOL_SITE, WINGS, SCHOOL_PORTALS, SCHOOL_ENTRY_ROUTE, UPPER_ACCESS_ROUTE} from './schoolLayout.ts';

function freezeCopy<T>(source: T): Readonly<T> {
  const copy = JSON.parse(JSON.stringify(source));
  const freeze = (value: unknown): void => {
    if (value && typeof value === 'object') {
      Object.values(value).forEach(freeze);
      Object.freeze(value);
    }
  };
  freeze(copy);
  return copy;
}

// Asset/continuity manifest, not a newly directed episode or an actor pose timeline.
// Copy before freezing, so importing this file cannot mutate legacy modules.
export const POST_EP005_WORLD = freezeCopy({
  id: 'post-ep005-world-v1',
  schemaVersion: 1,
  basedOnCommit: '3093d8bfcfe5adb3ec35e1980d2868fdba619043',
  firstConsumerEpisode: 6,
  publishedEpisode005: {historical: true, modifyComposition: false},
  island: {radius: 52, house: L.house, ricePlot: L.riceField, warteg: L.warteg, farm: FARM, ranch: RANCH, kost: KOST},
  water: {riverId: 'river-001', original: L.river, extension: CHANNEL, waterfallId: 'waterfall-001', built: true},
  school: {
    id: 'school-001', variant: 'school-001-post-ep005-v1', component: 'PostEp005School',
    placement: SCHOOL_SITE, wings: WINGS, floors: 2,
    firstTeacherId: 'warga-11', selectedStudentIds: [] as string[],
    classroomA01: {desks: 8, enclosedByDefault: true, cutawayDefault: false},
    portals: SCHOOL_PORTALS, pedestrianRoute: SCHOOL_ENTRY_ROUTE, upperAccessRoute: UPPER_ACCESS_ROUTE,
  },
  population: {
    gobi: {id: 'gobi', countedInResidents: false},
    residents: CAST.map(r => ({...r})),
    cows: COW_IDS.map((id, i) => ({id, home: COW_HOME[i], location: 'ranch-004', returnedAfterSchoolVisit: id === 'cow-003'})),
  },
  progress: {
    rice: 'post-harvest stubble and three retained bundles; no second harvest',
    farm: 'corn and carrot sprouts from EP005; no mature produce or new growth stage',
    ranch: 'three permanent cows, feed stocked, cow-003 returned, gate latch retained',
    kost: {roomCount: 6, floors: 2},
    warteg: 'existing shop and EP005 rice stock retained',
  },
  retainedAssets: [
    {id: 'terrain-and-rocks', source: 'episode003/world/terrain/render/terrainGeometry.ts', state: 'radius 52; full EP005 channel carve'},
    {id: 'house-001', source: 'episode003/world/house/RenovatedHouseEP003.tsx', state: 'built; original placement'},
    {id: 'river-001', source: 'episode003/world/river/RiverEP003.tsx', state: 'original river plus complete CHANNEL'},
    {id: 'waterfall-001', source: 'episode005/World.tsx', state: 'retain EP005 asset; no waterfall polish in this patch'},
    {id: 'warteg-001', source: 'episode003/world/warteg/WartegEP003.tsx', state: 'built plus EP005 stock shelf'},
    {id: 'kost-004', source: 'episode004/pilot/KostProxy.tsx', state: 'progress 1; enhanced; six rooms'},
    {id: 'farm-004', source: 'episode004/production/buildModels.ts + episode005/models.ts', state: 'full irrigation and retained EP005 sprouts'},
    {id: 'rice-plot-001', source: 'episode005/models.ts', state: 'post-harvest'},
    {id: 'ranch-004', source: 'episode004/production/buildModels.ts + episode005/World.tsx', state: 'troughs, hay, shelter, feed stock and closed latched gate'},
    {id: 'decor-legacy', source: 'episode002/IslandDecor3D.tsx + episode004/production/Nature.tsx', state: 'all plants, paths, trees and decorations retained'},
    {id: 'school-approach', source: 'episode005/layout.ts', state: ROUTE},
  ],
});
