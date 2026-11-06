import test from 'node:test';
import assert from 'node:assert/strict';
import {
  EP003_ROSTER, EP003_NEW_VILLAGERS, EP003_DRAFT_STATE, makeEp003DraftState, FOLLOW_AGGREGATE,
  LEGACY_VILLAGER_IDS, NEW_VILLAGER_IDS, STABLE_IDS, VILLAGER_ID_BY_USERNAME,
  EP003_POPULATION_INCLUDING_GOBI, getVillagerByName, ISLAND_RADIUS_RANGE, EP002_ISLAND_RADIUS,
} from '../src/episode003/state/index.ts';
import {VILLAGER_ROSTER} from '../src/episode002/villagerRoster.ts';

test('warga lama stabil dan identik dengan EP002', () => {
  for (const id of LEGACY_VILLAGER_IDS) {
    const old = VILLAGER_ROSTER.find((v) => v.id === id);
    const cur = EP003_ROSTER.find((v) => v.id === id);
    assert.ok(old && cur);
    assert.equal(cur.displayName, old.name);
    assert.equal(cur.visual.shirt, old.shirt);
    assert.deepEqual(cur.behavior.relativePath, old.path);
    assert.equal(cur.isNewInEp003, false);
  }
  assert.deepEqual(EP003_ROSTER.slice(0, 2).map((v) => v.id), ['warga-1', 'warga-2']);
});

test('tepat 4 NPC baru + 6 warga + Gobi = 7 tokoh', () => {
  assert.equal(EP003_NEW_VILLAGERS.length, 4);
  assert.deepEqual(EP003_NEW_VILLAGERS.map((v) => v.id), [...NEW_VILLAGER_IDS]);
  assert.equal(EP003_ROSTER.length, 6);
  assert.equal(EP003_POPULATION_INCLUDING_GOBI, 7);
  assert.equal(EP003_DRAFT_STATE.populationIncludingGobi, 7);
  assert.equal(new Set(EP003_ROSTER.map((v) => v.id)).size, 6);
  assert.equal(new Set(EP003_ROSTER.map((v) => v.displayName)).size, 6);
  assert.equal(new Set(EP003_ROSTER.map((v) => v.visual.seed)).size, 6);
});

test('tier, peran, dan status verifikasi', () => {
  const t = (n) => getVillagerByName(n);
  assert.equal(t('shifalina_').tier, 'special');
  assert.equal(t('shifalina_').behavior.anchorId, 'warteg-001');
  assert.equal(t('damar_zan').tier, 'special');
  assert.equal(t('Eka Agustin').tier, 'special');
  const joy = t('joy.__3.15');
  assert.equal(joy.tier, 'regular');
  assert.equal(joy.eligibility, 'pending-verification');
  assert.ok(joy.flags.some((f) => f.startsWith('PENDING')));
  for (const v of EP003_NEW_VILLAGERS) assert.equal(v.nameVerifiedAgainstScreenshot, false);
  for (const [name, id] of Object.entries(VILLAGER_ID_BY_USERNAME)) assert.equal(getVillagerByName(name).id, id);
});

test('nama tampil 2–3 detik pada 30 FPS', () => {
  for (const v of EP003_ROSTER) assert.deepEqual(v.nameCardFrames, {min: 60, max: 90});
});

test('agregat 33/55/17 terpisah dari roster dan tidak diklaim unik', () => {
  assert.equal(FOLLOW_AGGREGATE.totalCrossPlatformFollows, 105);
  assert.equal(FOLLOW_AGGREGATE.instagram + FOLLOW_AGGREGATE.tiktok + FOLLOW_AGGREGATE.youtube, 105);
  assert.equal(FOLLOW_AGGREGATE.uniquePeopleVerified, false);
  assert.equal(FOLLOW_AGGREGATE.registeredNpcCount, false);
  assert.notEqual(EP003_ROSTER.length, 105);
  assert.equal(EP003_DRAFT_STATE.followAggregate.totalCrossPlatformFollows, 105);
});

test('world state: draft, rumah direnovasi, sawah belum panen, warteg & sungai baru', () => {
  const s = EP003_DRAFT_STATE;
  assert.equal(s.status, 'draft');
  assert.equal(s.finalQa, false);
  const house = s.structures.find((x) => x.id === STABLE_IDS.house);
  assert.deepEqual(house.position, [-5, 0, -1]);
  assert.equal(house.scale, 1.65);
  assert.equal(house.floors, 2);
  assert.equal(house.renovatedFrom.floors, 1);
  assert.equal(s.structures.filter((x) => x.id === STABLE_IDS.house).length, 1); // bukan rumah kedua
  assert.ok(s.structures.find((x) => x.id === STABLE_IDS.warteg && x.status === 'new-built'));
  assert.equal(s.rivers.length, 1);
  const f = s.farms.find((x) => x.id === STABLE_IDS.riceField);
  assert.equal(f.status, 'planted-not-harvested');
  assert.deepEqual(f.position, [4.9, 0, -2.6]);
  assert.equal(s.storyFlags.riceHarvested, false);
  assert.deepEqual(s.storyFlags.ep004TeaserOnly, ['livestock', 'plantation']);
  assert.deepEqual(s.decorations, {preserved: true, source: 'docs/world/EP002_STATE.json', trees: 6, shrubs: 11, flowers: 47, grassTufts: 40, pebbles: 14});
});

test('radius: konfigurasi dalam 35–40, belum diputuskan, validasi di luar rentang', () => {
  assert.equal(EP003_DRAFT_STATE.island.radiusDecided, false);
  assert.ok(EP003_DRAFT_STATE.island.radiusWorldUnits >= 35 && EP003_DRAFT_STATE.island.radiusWorldUnits <= 40);
  assert.equal(makeEp003DraftState({islandRadius: 35}).island.radiusWorldUnits, 35);
  assert.equal(makeEp003DraftState({islandRadius: 40}).island.radiusWorldUnits, 40);
  assert.throws(() => makeEp003DraftState({islandRadius: 34.9}), RangeError);
  assert.throws(() => makeEp003DraftState({islandRadius: 41}), RangeError);
  assert.throws(() => makeEp003DraftState({islandRadius: NaN}), RangeError);
});

test('placeholder baru berada di luar pulau EP002 dan di dalam radius terkecil', () => {
  const s = EP003_DRAFT_STATE;
  const wart = s.structures.find((x) => x.id === STABLE_IDS.warteg);
  const r = Math.hypot(wart.position[0], wart.position[2]);
  assert.ok(r > EP002_ISLAND_RADIUS + 2 && r < ISLAND_RADIUS_RANGE.min - 5);
  for (const [x, z] of s.rivers[0].centerline) {
    const rr = Math.hypot(x, z);
    assert.ok(rr > EP002_ISLAND_RADIUS && rr < ISLAND_RADIUS_RANGE.min);
  }
});

test('deterministik & tidak berbagi referensi mutable antar panggilan', () => {
  const a = makeEp003DraftState();
  const b = makeEp003DraftState();
  assert.deepEqual(a, b);
  a.structures[0].floors = 99;
  a.villagers[0].flags.push('x');
  assert.equal(makeEp003DraftState().structures[0].floors, 2);
});
