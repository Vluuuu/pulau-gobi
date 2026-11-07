"""Prepare PCM slices of the authoritative v4 master; never use provisional MP3 clips.
Concatenating slice samples reproduces the decoded master bit for bit. No speed changes.
Python standard library + ffmpeg only. Run from the EP005 worktree.
"""
from pathlib import Path
import array,hashlib,json,math,random,shutil,subprocess,urllib.request,wave
root=Path.cwd(); handoff=Path(r'D:/pulau-gobi/handoff-ep005-v3-readonly')
out=root/'public/episode005'; (out/'voice').mkdir(parents=True,exist_ok=True); (out/'sfx').mkdir(exist_ok=True); (out/'comments').mkdir(exist_ok=True)
master=handoff/'02_AUDIO/master/ep005_vo_master_v4.mp3'; shutil.copyfile(master,out/'voice/master-v4.mp3')
for i in [1,2]:shutil.copyfile(handoff/f'05_VISUAL_REFERENCE/comment_{i}_as_uploaded.png',out/f'comments/comment-{i}.png')
tmp=root/'tmp';tmp.mkdir(exist_ok=True)
subprocess.run(['ffmpeg','-v','error','-y','-i',str(master),'-ac','1','-ar','44100',str(tmp/'master.wav')],check=True)
with wave.open(str(tmp/'master.wav'),'rb') as w:pcm=w.readframes(w.getnframes());rate=w.getframerate()
cuts=[0]+[round(t*30)*1470 for t in [23.55,41.85,45.49,56.6,76.6,88.3,93.1,101.34]]+[len(pcm)//2]
joined=b'';meta=[]
for i,(a,b) in enumerate(zip(cuts,cuts[1:])):
 data=pcm[a*2:b*2];joined+=data;p=out/f'voice/part-{i}.wav'
 with wave.open(str(p),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(data)
 meta.append({'file':p.relative_to(root/'public').as_posix(),'startSample':a,'endSample':b,'samples':len(data)//2})
assert joined==pcm
evidence={'masterSha256':hashlib.sha256(master.read_bytes()).hexdigest(),'sourceSeconds':135.1575,'decodedSamples':len(pcm)//2,'decodedPcmSha256':hashlib.sha256(pcm).hexdigest(),'rejoinedPcmSha256':hashlib.sha256(joined).hexdigest(),'sampleExact':True,'segments':meta}
(root/'docs/episodes/EP005_AUDIO_EVIDENCE.json').write_text(json.dumps(evidence,indent=2),encoding='utf-8')
rng=random.Random(5005)
def synth(name,duration,fn,peak=.5):
 n=round(duration*rate);a=[fn(i/rate,rng.uniform(-1,1)) for i in range(n)];mx=max(map(abs,a)) or 1
 pcm=array.array('h',(round(v/mx*peak*32767*min(1,i/180,(n-1-i)/450)) for i,v in enumerate(a)))
 with wave.open(str(out/f'sfx/{name}.wav'),'wb') as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(pcm.tobytes())
synth('waterfall',6,lambda t,n:n*(.60+.12*math.sin(t*19))+.15*math.sin(t*2*math.pi*61),.32)
synth('bell',1.5,lambda t,n:sum(math.sin(2*math.pi*f*t)*math.exp(-t*(2+i)) for i,f in enumerate([740,1113,1822])),.48)
synth('hoof',.14,lambda t,n:(math.sin(2*math.pi*135*t)+n*.5)*math.exp(-t*35),.48)
synth('sprout',.32,lambda t,n:math.sin(2*math.pi*(350*t+700*t*t))*math.exp(-t*10),.26)
synth('latch',.18,lambda t,n:(n+math.sin(t*2*math.pi*2100)) * math.exp(-t*45),.4)
synth('music',8,lambda t,n:sum(math.sin(2*math.pi*f*t)*(.3+.7*math.sin(math.pi*(t%2)/2)**2) for f in [130.81,164.81,196.0])*.2,.08)
# The downloadable Freesound preview is a CC0 field recording, not a voice imitation.
moo_url='https://cdn.freesound.org/previews/233/233145_4056007-hq.mp3'
urllib.request.urlretrieve(moo_url,tmp/'cow-source.mp3')
subprocess.run(['ffmpeg','-v','error','-y','-i',str(tmp/'cow-source.mp3'),'-af','highpass=f=90,alimiter=limit=0.8:level=false','-ac','1','-ar','44100',str(out/'sfx/cow-moo.wav')],check=True)
print(json.dumps({'pcmExact':True,'decodedSeconds':len(pcm)/2/rate,'masterSha256':evidence['masterSha256'],'segments':len(meta)},indent=2))
