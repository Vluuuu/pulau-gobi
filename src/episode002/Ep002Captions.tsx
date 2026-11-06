import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {EP002_CAPTIONS, EP002_OUTRO_CUES, EP002_OUTRO_TEXT, type CaptionCue} from './captionTimeline';

/**
 * Subtitle Episode 002 -- overlay frame-based (tanpa props), @30 FPS.
 * Gaya mengikuti Ep001 V2: kata aktif kuning, lainnya putih, outline gelap tipis,
 * tanpa kotak gelap, area bawah (top 1430 / height 240).
 * Timing = ESTIMASI, lihat captionTimeline.ts.
 */
const FPS = 30;
const YELLOW = '#FFD464';
const FONT = "'Segoe UI', 'Arial Rounded MT Bold', Arial, sans-serif";

const ENTER_F = 5; // fade/scale masuk (~167 ms)
const EXIT_F = 4; // fade keluar (~133 ms)
const LEAD_S = 0.04; // muncul sedikit sebelum kata pertama
const HOLD_S = 0.14; // tahan sedikit setelah kata terakhir
const WORD_HL_S = 0.07; // durasi "pop" highlight kata

// Outline gelap tipis lewat text-shadow (andal di Chromium) + bayangan lembut
const makeOutline = (r: number) => {
  const parts: string[] = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    parts.push(`${(Math.cos(a) * r).toFixed(1)}px ${(Math.sin(a) * r).toFixed(1)}px 0 rgba(22,26,56,0.95)`);
  }
  parts.push('0 5px 12px rgba(10,14,40,0.45)');
  return parts.join(', ');
};
const OUTLINE = makeOutline(4);
const OUTLINE_OUTRO = makeOutline(3);

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;

const BOX: React.CSSProperties = {
  position: 'absolute',
  left: 0,
  right: 0,
  top: 1430,
  height: 240,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const NORMAL_CUES = EP002_CAPTIONS.slice(0, EP002_CAPTIONS.length - EP002_OUTRO_CUES);
const OUTRO_CUES = EP002_CAPTIONS.slice(EP002_CAPTIONS.length - EP002_OUTRO_CUES);
const OUTRO_START = OUTRO_CUES[0].start;

/** Waktu tampil cue: dari start-LEAD sampai end+HOLD, tapi tidak melewati awal cue berikutnya. */
const visibleUntil = (list: CaptionCue[], i: number) => {
  const next = list[i + 1];
  const hold = list[i].end + HOLD_S;
  return next ? Math.min(hold, next.start - LEAD_S) : hold;
};

const Words: React.FC<{cue: CaptionCue; t: number}> = ({cue, t}) => {
  let active = -1;
  cue.words.forEach((w, i) => {
    if (t >= w.start) active = i;
  });
  const done = t >= cue.end;
  return (
    <>
      {cue.words.map((w, i) => {
        const isActive = i === active && !done;
        const k = isActive ? Math.min(1, Math.max(0, (t - w.start) / WORD_HL_S)) : 0;
        return (
          <React.Fragment key={i}>
            <span
              style={{
                display: 'inline-block',
                color: isActive ? YELLOW : '#fff',
                transform: `scale(${1 + 0.08 * k})`,
                transformOrigin: '50% 80%',
                marginRight: i < cue.words.length - 1 ? '0.3em' : 0,
              }}
            >
              {w.text}
            </span>
          </React.Fragment>
        );
      })}
    </>
  );
};

const CueLayer: React.FC<{cue: CaptionCue; t: number; frame: number; fadeOutAt: number}> = ({cue, t, frame, fadeOutAt}) => {
  const f0 = (cue.start - LEAD_S) * FPS;
  const enter = interpolate(frame, [f0, f0 + ENTER_F], [0, 1], clamp);
  const exit = interpolate(frame, [fadeOutAt * FPS, fadeOutAt * FPS + EXIT_F], [1, 0], clamp);
  const e = 1 - Math.pow(1 - enter, 3); // ease-out cubic
  return (
    <div
      style={{
        opacity: Math.min(enter, exit),
        transform: `translateY(${(1 - e) * 12 - (1 - exit) * 6}px) scale(${0.94 + 0.06 * e})`,
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
        position: 'absolute',
      }}
    >
      <Words cue={cue} t={t} />
    </div>
  );
};

/**
 * Outro permanen: dua baris tetap, kata muncul bertahap saat diucapkan lalu TETAP tampil
 * sampai akhir video. Teks persis = EP002_OUTRO_TEXT (lihat guard di bawah).
 * Baris 1 = frasa 1+2, baris 2 = frasa 3+4. Tiap frasa tetap 2-5 kata.
 */
const OutroBlock: React.FC<{t: number; frame: number}> = ({t, frame}) => {
  const f0 = (OUTRO_START - LEAD_S) * FPS;
  const enter = interpolate(frame, [f0, f0 + ENTER_F], [0, 1], clamp);
  const lines = [OUTRO_CUES.slice(0, 2), OUTRO_CUES.slice(2)];
  const lastEnd = OUTRO_CUES[OUTRO_CUES.length - 1].end;
  return (
    <div
      style={{
        opacity: enter,
        textAlign: 'center',
        fontFamily: FONT,
        fontWeight: 900,
        fontSize: 48,
        lineHeight: 1.22,
        letterSpacing: 0.3,
        color: '#fff',
        textShadow: OUTLINE_OUTRO,
        whiteSpace: 'nowrap',
      }}
    >
      {lines.map((line, li) => (
        <div key={li}>
          {line.map((cue, ci) => (
            <React.Fragment key={ci}>
              {cue.words.map((w, wi) => {
                const shown = interpolate(frame, [w.start * FPS, w.start * FPS + 4], [0, 1], clamp);
                // kata aktif = sudah mulai & belum lewat akhir; highlight mati setelah ucapan outro selesai
                const isActive = t >= w.start && t < w.end && t < lastEnd;
                const k = isActive ? Math.min(1, (t - w.start) / WORD_HL_S) : 0;
                const last = ci === line.length - 1 && wi === cue.words.length - 1;
                return (
                  <React.Fragment key={wi}>
                    <span
                      style={{
                        display: 'inline-block',
                        opacity: shown,
                        color: isActive ? YELLOW : '#fff',
                        transform: `translateY(${(1 - shown) * 8}px) scale(${1 + 0.08 * k})`,
                        transformOrigin: '50% 80%',
                        marginRight: last ? 0 : '0.3em',
                      }}
                    >
                      {w.text}
                    </span>
                  </React.Fragment>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      ))}
    </div>
  );
};

// Guard: outro harus persis seperti permintaan (gagal keras jika timeline diedit salah).
const OUTRO_JOINED = OUTRO_CUES.map((c) => c.words.map((w) => w.text).join(' ')).join(' ');
if (OUTRO_JOINED !== EP002_OUTRO_TEXT) {
  throw new Error(`Ep002Captions: outro tidak persis. Dapat: "${OUTRO_JOINED}"`);
}

export const Ep002Captions: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame / FPS;

  if (t >= OUTRO_START - LEAD_S) {
    return (
      <AbsoluteFill>
        <div style={BOX}>
          <OutroBlock t={t} frame={frame} />
        </div>
      </AbsoluteFill>
    );
  }

  // cue terakhir yang sudah mulai (dengan lead); cue sebelumnya ikut dirender selama fade-out singkat
  let idx = -1;
  for (let i = 0; i < NORMAL_CUES.length; i++) {
    if (t >= NORMAL_CUES[i].start - LEAD_S) idx = i;
  }
  const layers: {i: number; fadeOutAt: number}[] = [];
  if (idx >= 0) {
    layers.push({i: idx, fadeOutAt: visibleUntil(NORMAL_CUES, idx)});
    if (idx > 0) layers.push({i: idx - 1, fadeOutAt: Math.min(visibleUntil(NORMAL_CUES, idx - 1), NORMAL_CUES[idx].start - LEAD_S)});
  }
  const visible = layers.filter((l) => t < l.fadeOutAt + EXIT_F / FPS);
  if (visible.length === 0) return null;

  return (
    <AbsoluteFill>
      <div style={BOX}>
        {visible.map((l) => (
          <CueLayer key={l.i} cue={NORMAL_CUES[l.i]} t={t} frame={frame} fadeOutAt={l.fadeOutAt} />
        ))}
      </div>
    </AbsoluteFill>
  );
};
