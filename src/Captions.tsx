import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {CAPTIONS, FPS} from './timeline';

const YELLOW = '#FFD464';
const ENTER_F = 4; // ~133 ms
const EXIT_F = 3;
const FONT = "'Segoe UI', 'Arial Rounded MT Bold', Arial, sans-serif";

// Outline gelap tipis lewat text-shadow (andal di Chromium), + bayangan lembut
const OUTLINE = (() => {
  const r = 4;
  const dirs: string[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    dirs.push(`${(Math.cos(a) * r).toFixed(1)}px ${(Math.sin(a) * r).toFixed(1)}px 0 rgba(22,26,56,0.95)`);
  }
  dirs.push('0 6px 14px rgba(10,14,40,0.45)');
  return dirs.join(', ');
})();

export const Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  // cue terakhir yang sudah mulai dan belum selesai fade-out
  let cue = null as (typeof CAPTIONS)[number] | null;
  for (const c of CAPTIONS) {
    if (t >= c.start && t < c.end + EXIT_F / FPS) cue = c;
  }
  if (!cue) return null;

  const f0 = cue.start * FPS;
  const f1 = cue.end * FPS;
  const enter = interpolate(frame, [f0, f0 + ENTER_F], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const exit = interpolate(frame, [f1, f1 + EXIT_F], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const opacity = Math.min(enter, exit);
  const scale = 0.94 + 0.06 * enter;
  const lift = (1 - enter) * 10;

  // kata aktif = kata terakhir yang sudah dimulai
  let active = 0;
  cue.words.forEach((w, i) => {
    if (t >= w.start) active = i;
  });

  return (
    <AbsoluteFill>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: 1430,
          height: 240,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            opacity,
            transform: `translateY(${lift}px) scale(${scale})`,
            maxWidth: 860,
            textAlign: 'center',
            fontFamily: FONT,
            fontWeight: 900,
            fontSize: 80,
            lineHeight: 1.16,
            letterSpacing: 0.5,
            color: '#fff',
            textShadow: OUTLINE,
            textWrap: 'balance' as React.CSSProperties['textWrap'],
          }}
        >
          {cue.words.map((w, i) => {
            const isActive = i === active && t < cue!.end + 0.05;
            const k = isActive ? Math.min(1, (t - w.start) / 0.08) : 0;
            return (
              <React.Fragment key={i}>
                <span
                  style={{
                    display: 'inline-block',
                    color: isActive ? YELLOW : '#fff',
                    transform: `scale(${1 + 0.08 * k})`,
                    transformOrigin: '50% 80%',
                  }}
                >
                  {w.text}
                </span>
                {i < cue!.words.length - 1 ? ' ' : null}
              </React.Fragment>
            );
          })}
        </div>
      </div>
    </AbsoluteFill>
  );
};
