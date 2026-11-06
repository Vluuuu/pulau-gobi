import React from 'react';
import {CanvasTexture, LinearFilter} from 'three';
import type {GobiPose} from '../Gobi';
import {emotesAt} from './ep002Direction';
import type {EmoteKind} from './ep002Direction';

/**
 * Balon emote kecil di atas kepala Gobi (?, !, hati, bintang, keroncongan).
 * Murni dari waktu `t` (tanpa state). Digambar dengan canvas 2D (path, bukan emoji/font khusus)
 * sehingga identik di Windows/Linux dan sinkron untuk render Remotion.
 */

const SIZE = 128;
const cache = new Map<EmoteKind, {tex: CanvasTexture; aspect: number}>();

const bubble = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
  const m = 8;
  const r = Math.min(h, w) / 2 - m;
  ctx.beginPath();
  ctx.moveTo(m + r, m);
  ctx.arcTo(w - m, m, w - m, h - m, r);
  ctx.arcTo(w - m, h - m, m, h - m, r);
  ctx.arcTo(m, h - m, m, m, r);
  ctx.arcTo(m, m, w - m, m, r);
  ctx.closePath();
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.lineWidth = 7;
  ctx.strokeStyle = '#2b2b3a';
  ctx.stroke();
};

const draw = (kind: EmoteKind) => {
  const hit = cache.get(kind);
  if (hit) return hit;
  const w = kind === 'rumble' ? 300 : SIZE;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = SIZE;
  const ctx = c.getContext('2d')!;
  bubble(ctx, w, SIZE);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const cx = w / 2;
  const cy = SIZE / 2;
  if (kind === 'q' || kind === 'bang' || kind === 'rumble') {
    const txt = kind === 'q' ? '?' : kind === 'bang' ? '!' : 'kruyuk~';
    ctx.font = `bold ${kind === 'rumble' ? 62 : 96}px "Segoe UI", Arial, sans-serif`;
    ctx.fillStyle = kind === 'q' ? '#2f6bff' : kind === 'bang' ? '#ff3b30' : '#d9741a';
    ctx.fillText(txt, cx, cy + 5);
  } else if (kind === 'heart') {
    ctx.fillStyle = '#ff4d79';
    ctx.beginPath();
    ctx.moveTo(cx, cy + 30);
    ctx.bezierCurveTo(cx - 52, cy - 2, cx - 34, cy - 40, cx, cy - 14);
    ctx.bezierCurveTo(cx + 34, cy - 40, cx + 52, cy - 2, cx, cy + 30);
    ctx.fill();
  } else {
    // kilau 4 sudut
    ctx.fillStyle = '#ffc61a';
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 - Math.PI / 2;
      const r = i % 2 === 0 ? 40 : 13;
      ctx[i === 0 ? 'moveTo' : 'lineTo'](cx + Math.cos(a) * r, cy + Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
  }
  const tex = new CanvasTexture(c);
  tex.minFilter = LinearFilter;
  tex.generateMipmaps = false;
  const entry = {tex, aspect: w / SIZE};
  cache.set(kind, entry);
  return entry;
};

/** Arah "kanan layar" di dunia untuk kamera isometrik (CAM_OFFSET 10,10,10). */
const RIGHT = [Math.SQRT1_2, -Math.SQRT1_2];
const EMOTE_PX = 52; // tinggi balon di layar (px)
const HEAD_Y = 2.55; // di atas kepala Gobi (tinggi ~2.2)

export const GobiEmotes: React.FC<{t: number; pose: GobiPose; zoom: number}> = ({t, pose, zoom}) => {
  const list = emotesAt(t);
  if (list.length === 0) return null;
  const h = Math.max(0.95, EMOTE_PX / zoom);
  const s = pose.scale ?? 1;
  return (
    <group>
      {list.map((e, i) => {
        const {tex, aspect} = draw(e.kind);
        const bob = 0.07 * Math.sin(t * 8 + i);
        const off = 0.85 * s + (e.kind === 'rumble' ? 0.7 : 0);
        return (
          <sprite
            key={e.kind + i}
            position={[pose.x + RIGHT[0] * off, HEAD_Y * s + (pose.hop ?? 0) + bob + h * 0.5, pose.z + RIGHT[1] * off]}
            scale={[h * aspect * e.scale, h * e.scale, 1]}
            renderOrder={11}
          >
            <spriteMaterial map={tex} transparent depthTest={false} rotation={0.12 * Math.sin(t * 6 + i)} />
          </sprite>
        );
      })}
    </group>
  );
};
