import React, {Component, Suspense, useCallback, useMemo, useState} from 'react';
import type {ErrorInfo, ReactNode} from 'react';
import {Canvas} from '@react-three/fiber';
import type {ThreeEvent} from '@react-three/fiber';
import {CurrentWorld, CURRENT_WORLD_STATE, WorldLighting, WORLD_LANDMARKS} from '../world/current';
import type {CutawayWall, SchoolAssetOptions} from '../world/postEp005/schoolLayout.ts';
import {CameraControls} from './CameraControls';
import type {FocusRequest} from './CameraControls';
import type {SchoolView} from './navigation.ts';
import './style.css';

class SceneBoundary extends Component<{children: ReactNode}, {error: string | null}> {
  state = {error: null as string | null};
  static getDerivedStateFromError(error: Error) {return {error: error.message};}
  componentDidCatch(error: Error, info: ErrorInfo) {console.error('World viewer:', error, info);}
  render() {return this.state.error ? <div className="scene-error"><h2>Dunia belum dapat dibuka</h2><p>{this.state.error}</p><p>Gunakan browser dengan WebGL aktif, lalu muat ulang halaman.</p><button onClick={() => location.reload()}>Muat ulang</button></div> : this.props.children;}
}

export const App: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [schoolView, setSchoolView] = useState<SchoolView>('campus');
  const [roof, setRoof] = useState(false);
  const [walls, setWalls] = useState<CutawayWall[]>([]);
  const [doors, setDoors] = useState(false);
  const [residents, setResidents] = useState(true);
  const [shadows, setShadows] = useState(true);
  const [detail, setDetail] = useState(false);
  const [ready, setReady] = useState(false);
  const [bounds, setBounds] = useState('');
  const [focus, setFocus] = useState<FocusRequest>({id: null, sequence: 0, schoolView: 'campus'});
  const onReady = useCallback(() => setReady(true), []);
  const onBounds = useCallback((value: string) => setBounds(value), []);
  const focusAsset = useCallback((id: string | null, view: SchoolView = 'campus') => {
    setSelected(id);
    setFocus(f => ({id, schoolView: view, sequence: f.sequence + 1}));
  }, []);
  const chooseSchoolView = (view: SchoolView) => {
    setSchoolView(view);
    setRoof(view !== 'campus');
    setWalls(view !== 'campus' ? ['front', 'east'] : []);
    setDoors(view !== 'campus');
    focusAsset('school', view);
  };
  const school = useMemo<SchoolAssetOptions>(() => ({doors: doors ? 'open' : 'closed',
    cutaway: roof || walls.length ? {room: schoolView === 'upper' ? 'A02' : 'A01', overhead: roof, walls} : undefined,
  }), [doors, roof, walls, schoolView]);
  const pick = useCallback((event: ThreeEvent<MouseEvent>) => {
    if (event.button !== 0 || event.delta > 5) return;
    for (let node = event.object; node; node = node.parent!) {
      const asset = WORLD_LANDMARKS.find(a => a.sceneNames.includes(node.name));
      if (asset) {event.stopPropagation(); focusAsset(asset.id, asset.id === 'school' ? schoolView : 'campus'); return;}
    }
  }, [focusAsset, schoolView]);
  const current = WORLD_LANDMARKS.find(a => a.id === selected);
  return <div className="viewer-shell" data-ready={ready}>
    <aside className="sidebar" aria-label="Kontrol dunia">
      <header className="brand"><span className="brand-icon" aria-hidden="true">◈</span><div><h1>Pulau Gobi</h1><p>3D WORLD VIEWER</p></div><span className="live-badge">LIVE 3D</span></header>
      <div className="world-summary"><span className="status-dot"/> Dunia pasca-EP005<span>{CURRENT_WORLD_STATE.population.residents.length} warga · {CURRENT_WORLD_STATE.population.cows.length} sapi</span></div>
      <button className="home-button" onClick={() => focusAsset(null)}><span aria-hidden="true">⌂</span> Kembali ke seluruh pulau</button>
      <section><div className="section-heading"><h2>Jelajahi dunia</h2><span>{WORLD_LANDMARKS.length} lokasi</span></div>
        <nav className="landmarks" aria-label="Pilih bangunan atau zona">{WORLD_LANDMARKS.map((asset, i) => <button key={asset.id} className={selected === asset.id ? 'landmark selected' : 'landmark'} aria-pressed={selected === asset.id} onClick={() => focusAsset(asset.id, asset.id === 'school' ? schoolView : 'campus')}><span className="landmark-number">{String(i + 1).padStart(2, '0')}</span><span><strong>{asset.name}</strong><small>{asset.description}</small></span><span className="landmark-arrow" aria-hidden="true">↗</span></button>)}</nav>
      </section>
      <section className="school-panel"><div className="section-heading"><h2>Inspeksi sekolah</h2><span>Sayap A</span></div>
        <label className="field-label" htmlFor="school-level">Area inspeksi</label>
        <select id="school-level" value={schoolView} onChange={e => chooseSchoolView(e.target.value as SchoolView)}>
          <option value="campus">Gedung & halaman utuh</option><option value="ground">Lantai 1 · Kelas A01</option><option value="upper">Lantai 2 · Kelas A02</option><option value="corridor">Foyer & koridor A</option>
        </select>
        <label className="toggle-row"><input type="checkbox" checked={roof} onChange={e => setRoof(e.target.checked)}/><span>Sembunyikan atap / plafon</span></label>
        <div className="field-label wall-label">Dinding yang disembunyikan</div>
        <div className="wall-toggles">{([['front', 'Depan'], ['east', 'Timur'], ['west', 'Barat'], ['back', 'Belakang']] as const).map(([id, label]) => <label key={id}><input type="checkbox" checked={walls.includes(id)} onChange={e => setWalls(w => e.target.checked ? [...w, id] : w.filter(a => a !== id))}/><span>{label}</span></label>)}</div>
        <label className="toggle-row"><input type="checkbox" checked={doors} onChange={e => setDoors(e.target.checked)}/><span>Buka pintu & gerbang sekolah</span></label>
        <p className="panel-note">Pilihan area memusatkan kamera. Tetap bebas orbit dan zoom untuk memeriksa bagian dalam.</p>
      </section>
      <section><div className="section-heading"><h2>Tampilan</h2><span>Untuk laptop</span></div>
        <label className="toggle-row"><input type="checkbox" checked={residents} onChange={e => setResidents(e.target.checked)}/><span>Warga, Gobi & sapi</span></label>
        <label className="toggle-row"><input type="checkbox" checked={shadows} onChange={e => setShadows(e.target.checked)}/><span>Bayangan</span></label>
        <label className="toggle-row"><input type="checkbox" checked={detail} onChange={e => setDetail(e.target.checked)}/><span>Resolusi detail (lebih berat)</span></label>
      </section>
      <footer className="sidebar-footer">Satu dunia, aset source yang sama.<br/>Perubahan tampilan hanya untuk inspeksi.</footer>
    </aside>
    <main className="viewport" aria-label="Dunia 3D interaktif" onContextMenu={e => e.preventDefault()}>
      <SceneBoundary><Canvas frameloop="demand" dpr={detail ? 1.5 : 1} shadows={shadows} camera={{position: [115, 85, 155], fov: 45, near: .08, far: 1600}} gl={{antialias: true, powerPreference: 'high-performance'}} fallback={<div className="scene-error">WebGL tidak tersedia. Aktifkan akselerasi grafis di browser.</div>}>
        <color attach="background" args={['#cce2e9']}/>
        <WorldLighting/>
        <Suspense fallback={null}><group onClick={pick}><CurrentWorld school={school} residents={residents}/></group></Suspense>
        <CameraControls focus={focus} onReady={onReady} onBounds={onBounds}/>
      </Canvas></SceneBoundary>
      {!ready && <div className="loading-world" role="status"><span className="loader"/>Membuka Pulau Gobi…</div>}
      <div className="viewport-top"><div className="view-card"><span className="eyebrow">{selected ? 'LOKASI AKTIF' : 'PETA DUNIA'}</span><h2>{current?.name ?? 'Seluruh Pulau Gobi'}</h2><p aria-live="polite">{ready ? bounds : 'Menyiapkan geometri…'}</p></div><span className="mode-badge">{detail ? 'Detail' : 'Laptop'} · {ready ? 'Siap dijelajahi' : 'Memuat'}</span></div>
      <div className="controls-guide"><span><b>Drag kiri</b> Orbit</span><span><b>Scroll</b> Zoom</span><span><b>Drag kanan</b> Pan</span><span><b>Klik bangunan</b> Fokus</span></div>
    </main>
  </div>;
};
