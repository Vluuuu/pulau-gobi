// Mesh raycasts in a single reusable headless page. No screenshots or movie rendering.
import {createRequire} from 'node:module';
import {createServer} from 'node:http';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {bundle} from '@remotion/bundler';
import {openBrowser} from '@remotion/renderer';
import {SHOTS} from '../src/episode005/shots.ts';
import {DURATION} from '../src/episode005/timeline.ts';
const require=createRequire(import.meta.url),dist=path.dirname(require.resolve('@remotion/renderer'));
const {setPropsAndEnv}=require(path.join(dist,'set-props-and-env.js'));
const {seekToFrame}=require(path.join(dist,'seek-to-frame.js'));
const dir=await bundle({entryPoint:path.resolve('src/index.ts'),outDir:path.resolve('out/ep005-bundle')});
const server=createServer(async(req,res)=>{try{const p=path.resolve(dir,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!p.startsWith(dir))throw Error();const file=p===dir||p===dir+path.sep?path.join(dir,'index.html'):p;const bytes=await readFile(file);const ext=path.extname(file);res.setHeader('Content-Type',({'.html':'text/html','.js':'application/javascript','.json':'application/json','.png':'image/png','.mp3':'audio/mpeg','.wav':'audio/wav'})[ext]||'application/octet-stream');res.end(bytes);}catch{res.statusCode=404;res.end('not found');}});
await new Promise(r=>server.listen(0,'127.0.0.1',r));const serveUrl=`http://127.0.0.1:${server.address().port}`;
const logs=[],browser=await openBrowser('chrome',{chromiumOptions:{gl:'angle'}}),out=path.resolve('out/ep005-evidence');await mkdir(out,{recursive:true});
try{
 const page=await browser.newPage({context:()=>null,logLevel:'error',indent:false,pageIndex:0,onBrowserLog:l=>logs.push(l),onLog:()=>{}});
 await page.setViewport({width:1080,height:1920,deviceScaleFactor:1});
 await setPropsAndEnv({serializedInputPropsWithCustomSchema:JSON.stringify({ep005Audit:true}),envVariables:{},page,serveUrl,initialFrame:0,timeoutInMilliseconds:60000,proxyPort:0,retriesRemaining:0,audioEnabled:false,videoEnabled:true,indent:false,logLevel:'error',onServeUrlVisited:()=>{},isMainTab:true,mediaCacheSizeInBytes:null,preferredEffectBackend:'auto',initialMemoryAvailable:null,darkMode:false,sampleRate:44100});
 await page.evaluate((duration)=>window.remotion_setBundleMode({type:'composition',compositionName:'Episode005',serializedResolvedPropsWithSchema:JSON.stringify({ep005Audit:true}),compositionDurationInFrames:duration,compositionFps:30,compositionHeight:1920,compositionWidth:1080}),DURATION);
 const rows=[];const selected=process.env.EP005_SHOTS?new Set(process.env.EP005_SHOTS.split(',')):null;
 for(const shot of SHOTS.filter(s=>s.dialog&&(!selected||selected.has(s.id)))){
  const frames=[...new Set([0,.25,.5,.75,.999].map(u=>Math.floor(shot.start+(shot.end-shot.start)*u)).concat([Math.min(shot.end-1,shot.start+14),Math.min(shot.end-1,shot.start+25)]))];
  for(const frame of frames){
   await seekToFrame({frame,page,composition:'Episode005',timeoutInMilliseconds:60000,logLevel:'error',indent:false,attempt:0});
   const row=await page.evaluate(()=>window.ep005Inspect());rows.push(row);
  }
  const rs=rows.filter(r=>r.shot===shot.id);console.log(`${shot.id} face=${Math.min(...rs.map(r=>r.faceVisible))} hands=${Math.min(...rs.map(r=>r.handsVisible))}`);
 }
 await writeFile(path.join(out,selected?'camera-mesh-targeted.json':'camera-mesh.json'),JSON.stringify(rows,null,2));
 const fail=rows.filter(r=>r.faceVisible<.95||r.handsVisible<.90||!r.faceInFrame||r.facePixels<50||r.frontFacing<.78);
 console.log(JSON.stringify({frames:rows.length,failures:fail.length,shots:[...new Set(fail.map(r=>r.shot))]}));
 if(fail.length)process.exitCode=1;
}finally{await browser.close({silent:true});await new Promise(r=>server.close(r));await writeFile(path.join(out,'camera-browser-logs.json'),JSON.stringify(logs,null,2));}
