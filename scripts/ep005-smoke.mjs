import {bundle} from '@remotion/bundler';
import {openBrowser,getCompositions,renderStill} from '@remotion/renderer';
import {mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {DURATION,gap,editFrame as E} from '../src/episode005/timeline.ts';
const out=path.resolve('out/ep005-evidence');await mkdir(out,{recursive:true});
const logs=[],onBrowserLog=l=>logs.push(l);
const serveUrl=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:path.resolve('out/ep005-bundle')});
const chromiumOptions={gl:'angle'},browser=await openBrowser('chrome',{chromiumOptions});
try{
 const cs=await getCompositions(serveUrl,{puppeteerInstance:browser,chromiumOptions,onBrowserLog});
 const c=cs.find(c=>c.id==='Episode005');if(c?.durationInFrames!==DURATION)throw Error('composition metadata');
 await writeFile(path.join(out,'compositions.json'),JSON.stringify(cs,null,2));
 for(const [name,frame] of [['qa-v1-school-access-court',E(77.1)],['qa-v1-class-dialogue',gap('G5').end+30]]){
  await renderStill({serveUrl,composition:c,frame,output:path.join(out,`${name}.png`),imageFormat:'png',puppeteerInstance:browser,chromiumOptions,onBrowserLog});
  console.log(`STILL ${name} frame=${frame}`);
 }
 console.log(`PASS Episode005 ${DURATION} frames / ${DURATION/30}s; legacy compositions retained.`);
}finally{await browser.close({silent:true});await writeFile(path.join(out,'browser-logs.json'),JSON.stringify(logs,null,2));}
if(logs.some(l=>l.type==='error'))throw Error('Browser logged errors; inspect browser-logs.json');
