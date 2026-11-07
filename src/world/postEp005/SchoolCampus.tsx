import React, {useEffect, useMemo} from 'react';
import {CanvasTexture} from 'three';
import {Parts} from '../../episode004/production/Parts';
import {buildSchoolAsset} from './schoolAsset.ts';
import type {SchoolLabel} from './schoolAsset.ts';
import {SCHOOL_SITE} from './schoolLayout.ts';
import type {SchoolAssetOptions} from './schoolLayout.ts';

const Label: React.FC<{label: SchoolLabel}> = ({label}) => {
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = Math.max(128, Math.round(1024 * label.size[1] / label.size[0]));
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = label.style === 'chalk' ? '#31564d' : label.style === 'poster' ? '#f5e8c6' : '#365b55';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = label.style === 'poster' ? '#b79c68' : '#c2a46a';
    ctx.lineWidth = 10;
    if (label.style !== 'chalk') ctx.strokeRect(6, 6, canvas.width - 12, canvas.height - 12);
    ctx.fillStyle = label.style === 'poster' ? '#365b55' : '#f3ebd3';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lineHeight = (canvas.height - 28) / label.lines.length;
    for (const [i, line] of label.lines.entries()) {
      let size = Math.min(116, lineHeight * .65);
      ctx.font = `bold ${size}px Arial`;
      size *= Math.min(1, 930 / Math.max(1, ctx.measureText(line).width));
      ctx.font = `bold ${size}px Arial`;
      ctx.fillText(line, 512, 14 + lineHeight * (i + .5));
    }
    return new CanvasTexture(canvas);
  }, [label]);
  useEffect(() => () => texture.dispose(), [texture]);
  return <mesh name={label.id} position={[...label.position]} rotation={label.rotation ? [...label.rotation] : undefined}>
    <planeGeometry args={[...label.size]}/><meshStandardMaterial map={texture} roughness={1}/>
  </mesh>;
};

/** Opt-in asset for EP006+. No Remotion hooks, cameras, actors, lights or audio. */
export const PostEp005School: React.FC<SchoolAssetOptions> = ({doors = 'closed', cutaway}) => {
  const asset = useMemo(() => buildSchoolAsset({doors, cutaway}), [doors, cutaway]);
  return <group name="school-001-post-ep005-v1" position={[...SCHOOL_SITE.position]} rotation-y={SCHOOL_SITE.rotation}>
    <Parts parts={asset.parts.filter(p => !p.glass)}/>
    {asset.parts.filter(p => p.glass).map(p => <mesh key={p.id} name={p.id} position={[...p.position]}>
      <boxGeometry args={[...p.size]}/>
      <meshStandardMaterial color={p.color} transparent opacity={.28} roughness={.32} depthWrite={false}/>
    </mesh>)}
    {asset.labels.map(label => <Label key={label.id} label={label}/>)}
    {[-14.35, -6.05].map(x => <mesh key={x} name={`basketball-ring-${x}`} position={[x, 2.48, 7.8]} rotation-x={Math.PI / 2}>
      <torusGeometry args={[.22, .026, 5, 16]}/><meshStandardMaterial color="#b37c49" roughness={.8}/>
    </mesh>)}
  </group>;
};
