import React, {useMemo} from 'react';
import {CanvasTexture, LinearFilter} from 'three';
import {easeOutBack, clamp01} from './anim';

export type VillagerProps = {
  position: [number, number, number];
  heading: number; // rotation-y
  walk: number; // 0..1
  stride: number; // fase langkah (radian)
  shirt: string;
  hair: string;
  pants?: string;
  skin?: string;
  scale?: number; // skala total (termasuk pop-in)
  /** Nama + opasitas 0..1 (nama tampil bila name ada dan opacity > 0). */
  name?: string;
  nameOpacity?: number;
  /** Sisi kepala tempat papan nama condong (hindari tumpukan). */
  nameSide?: 'left' | 'right' | 'center';
  /** Piksel layar per unit dunia (zoom kamera ortografik) saat nama tampil. Default 45 = wide shot Ep002. */
  nameZoom?: number;
  /** V4 (opsional): warna aksen papan nama, skala pop papan (1 = normal). */
  nameAccent?: string;
  nameScale?: number;
  /** V4 (opsional): angkat vertikal (jatuh masuk), squash (+ pipih), lambaian 0..1. */
  lift?: number;
  squash?: number;
  wave?: number;
};

const NAME_HEIGHT_PX = 64; // tinggi papan di layar 1080x1920 (teks ~32px)
const NAME_GAP_PX = 10; // jarak papan dari puncak kepala
const HEAD_TOP = 1.34; // puncak rambut pada skala lokal
const SIDE_OFFSET_PX = 28; // geser pil menjauhi sumbu kepala (kiri/kanan) agar tidak menutupi badan Gobi

const nameTextureCache = new Map<string, {tex: CanvasTexture; aspect: number}>();
const DEFAULT_ACCENT = '#2b2b3a';

/** Papan nama dari canvas 2D (sinkron, tanpa font eksternal/asinkron => aman untuk render Remotion). */
const getNameTexture = (name: string, accent: string = DEFAULT_ACCENT) => {
  const key = `${name}|${accent}`;
  const hit = nameTextureCache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  const font = 'bold 72px "Segoe UI", Arial, system-ui, sans-serif';
  ctx.font = font;
  const w = Math.ceil(ctx.measureText(name).width) + 80;
  const H = 124;
  c.width = w;
  c.height = H;
  ctx.font = font;
  // pil putih + garis tepi gelap: terbaca di atas langit maupun rumput
  const m = 6;
  const r = (H - m * 2) / 2;
  ctx.beginPath();
  ctx.moveTo(m + r, m);
  ctx.arcTo(w - m, m, w - m, H - m, r);
  ctx.arcTo(w - m, H - m, m, H - m, r);
  ctx.arcTo(m, H - m, m, m, r);
  ctx.arcTo(m, m, w - m, m, r);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 12;
  ctx.strokeStyle = accent; // pinggir berwarna sesuai baju warga
  ctx.stroke();
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#2b2b3a';
  ctx.stroke();
  ctx.fillStyle = '#16162a';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(name, w / 2, H / 2 + 4);
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  const entry = {tex, aspect: w / H};
  nameTextureCache.set(key, entry);
  return entry;
};

/**
 * Papan nama berukuran TETAP di layar (NAME_HEIGHT_PX), terlepas dari skala warga & pop-in:
 * ukuran dunia = px / zoom, lalu dibagi skala grup induk. `side` menggeser pil ke kiri/kanan
 * kepala (sprite.center) supaya dua nama tidak menumpuk dan tidak menutupi kepala Gobi.
 */
const NameTag: React.FC<{
  name: string;
  opacity: number;
  zoom: number;
  groupScale: number;
  side: 'left' | 'right' | 'center';
  accent?: string;
  pop?: number;
}> = ({name, opacity, zoom, groupScale, side, accent, pop = 1}) => {
  const {tex, aspect} = useMemo(() => getNameTexture(name, accent), [name, accent]);
  const hWorld = (NAME_HEIGHT_PX / zoom / groupScale) * pop;
  const y = HEAD_TOP + (NAME_GAP_PX + NAME_HEIGHT_PX / 2) / zoom / groupScale;
  // 'left' = pil memanjang ke kiri kepala, 'right' = ke kanan; sprite.center boleh di luar 0..1
  const wPx = NAME_HEIGHT_PX * aspect;
  const cx = side === 'left' ? 1 + SIDE_OFFSET_PX / wPx : side === 'right' ? -SIDE_OFFSET_PX / wPx : 0.5;
  return (
    <sprite position={[0, y, 0]} scale={[hWorld * aspect, hWorld, 1]} center={[cx, 0.5]} renderOrder={10}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthTest={false} />
    </sprite>
  );
};

/**
 * Warga low-poly sederhana (primitif saja). Murni presentasional: pose dihitung
 * dari props (tidak ada state/timer/delta). Menghadap +z pada heading = 0.
 */
export const Villager: React.FC<VillagerProps> = ({
  position,
  heading,
  walk,
  stride,
  shirt,
  hair,
  pants = '#4a4e69',
  skin = '#f2c9a0',
  scale = 1,
  name,
  nameOpacity = 0,
  nameSide = 'center',
  nameZoom = 45,
  nameAccent,
  nameScale = 1,
  lift = 0,
  squash = 0,
  wave = 0,
}) => {
  if (scale < 0.01) return null;
  const swing = Math.sin(stride) * 0.7 * walk;
  const bob = Math.abs(Math.sin(stride)) * 0.04 * walk;
  const sway = Math.sin(stride * 0.5) * 0.04 * walk;

  return (
    <group
      position={[position[0], position[1] + lift, position[2]]}
      rotation-y={heading}
      scale={[scale * (1 + 0.3 * squash), scale * (1 - 0.5 * squash), scale * (1 + 0.3 * squash)]}
    >
      {/* bayangan */}
      <mesh position={[0, 0.02, 0]} rotation-x={-Math.PI / 2}>
        <circleGeometry args={[0.38, 10]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.22} />
      </mesh>

      <group position={[0, bob, 0]} rotation-z={sway}>
        {/* kaki (pivot di pinggul) */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.1, 0.42, 0]} rotation-x={s * swing}>
            <mesh position={[0, -0.2, 0]}>
              <boxGeometry args={[0.13, 0.4, 0.14]} />
              <meshStandardMaterial color={pants} flatShading />
            </mesh>
          </group>
        ))}
        {/* badan */}
        <mesh position={[0, 0.66, 0]}>
          <boxGeometry args={[0.38, 0.42, 0.24]} />
          <meshStandardMaterial color={shirt} flatShading />
        </mesh>
        {/* lengan (pivot di bahu) */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.25, 0.8, 0]} rotation-x={-s * swing * 0.9} rotation-z={s === 1 ? wave * 2.5 : 0}>
            <mesh position={[0, -0.17, 0]}>
              <boxGeometry args={[0.1, 0.34, 0.1]} />
              <meshStandardMaterial color={shirt} flatShading />
            </mesh>
            <mesh position={[0, -0.36, 0]}>
              <icosahedronGeometry args={[0.06, 0]} />
              <meshStandardMaterial color={skin} flatShading />
            </mesh>
          </group>
        ))}
        {/* kepala */}
        <group position={[0, 1.08, 0]}>
          <mesh>
            <icosahedronGeometry args={[0.22, 1]} />
            <meshStandardMaterial color={skin} flatShading />
          </mesh>
          {/* rambut: tempurung di atas & belakang kepala */}
          <mesh position={[0, 0.03, -0.02]} rotation-x={-0.25}>
            <sphereGeometry args={[0.245, 8, 5, 0, Math.PI * 2, 0, Math.PI * 0.55]} />
            <meshStandardMaterial color={hair} flatShading />
          </mesh>
          {/* mata */}
          {[-1, 1].map((s) => (
            <mesh key={s} position={[s * 0.08, 0.0, 0.2]}>
              <sphereGeometry args={[0.028, 6, 6]} />
              <meshBasicMaterial color="#1c1c28" />
            </mesh>
          ))}
        </group>
      </group>

      {name && nameOpacity > 0.001 && <NameTag name={name} opacity={clamp01(nameOpacity)} zoom={nameZoom} groupScale={scale} side={nameSide} accent={nameAccent} pop={nameScale} />}
    </group>
  );
};

export const popScale = (frame: number, appearFrame: number, popFrames = 14): number =>
  frame < appearFrame ? 0 : easeOutBack(clamp01((frame - appearFrame) / popFrames), 1.4);
