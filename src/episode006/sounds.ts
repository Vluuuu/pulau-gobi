import {E,hold,OUTRO_START,ramp,masterAt} from './timeline.ts';
import {SPLASH_FRAME} from './shots.ts';
import {SPLASH_CONTACT} from '../world/ep006/waterModel.ts';
export const CUES=[
  {frame:E(27.3),file:'episode005/sfx/bell.wav',frames:45,volume:.12},
  ...[E(29.4),E(30.5),E(31.7)].map(frame=>({frame,file:'episode006/sfx/chalk.wav',frames:13,volume:.12})),
  ...[E(39.4),E(40.4),E(41.5),E(42.5)].map(frame=>({frame,file:'episode006/sfx/earth.wav',frames:10,volume:.16})),
  ...[E(58.1),E(59.1),E(60.1),E(61.2),E(62)].map(frame=>({frame,file:'episode006/sfx/wood.wav',frames:8,volume:.15})),
  ...[E(62.94)+12,E(62.94)+33,E(62.94)+56,E(62.94)+81,E(62.94)+104].map(frame=>({frame,file:'episode006/sfx/footstep.wav',frames:6,volume:.10})),
  {frame:SPLASH_CONTACT,file:'episode006/sfx/splash-contact.wav',frames:18,volume:.34},
  {frame:E(85.2),file:'episode005/sfx/cow-moo.wav',frames:35,volume:.075},
];
export const cueGain=(cue:typeof CUES[number],local:number)=>{const splash=cue.file.endsWith('splash-contact.wav');return cue.volume*(masterAt(cue.frame+local)===null?1:splash?.75:.58)*(splash?1:ramp(local,0,2))*(1-ramp(local,cue.frames-3,cue.frames));};
