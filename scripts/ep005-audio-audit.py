"""Compare the owner's AAC render with the master; audit new continuous PCM and mix.
Waveform evidence is not a human phoneme-by-phoneme listening certificate.
"""
from pathlib import Path
import subprocess,json,hashlib,wave
import numpy as np
root=Path.cwd();out=root/'out/ep005-qa-v1';out.mkdir(parents=True,exist_ok=True);rate=44100
plan=json.loads((root/'tmp/ep005-mix-plan.json').read_text());cache={}
def decode(file):
 p=root/file
 if str(p)not in cache:
  b=subprocess.check_output(['ffmpeg','-v','error','-i',str(p),'-f','f32le','-ac','1','-ar',str(rate),'-'])
  cache[str(p)]=np.frombuffer(b,dtype='<f4').astype(float)
 return cache[str(p)]
master=decode('public/episode005/voice/master-v4.mp3');render=decode('out/Episode005.mp4')
oldHolds=[285,105,105,105,240,30,120,105];oldOffset=0;boundaries=[]
def corr_window(a,b,edit):
 src=master[round(a*rate):round(b*rate):4];start=round(edit*rate);lag=round(.045*rate)
 dst=render[max(0,start-lag):min(len(render),start+round((b-a)*rate)+lag):4]
 if len(dst)<len(src):return {'correlation':None}
 dots=np.correlate(dst,src,mode='valid');energies=np.convolve(dst*dst,np.ones(len(src)),mode='valid')
 scores=dots/np.sqrt(np.maximum(1e-20,energies*np.sum(src*src)));k=int(np.argmax(scores))
 return {'correlation':round(float(scores[k]),5),'lagMs':round((k*4-lag)/rate*1000,3)}
for i,s in enumerate(plan['INSERTS']):
 cut=s['sourceFrame']/30;idx=s['sourceFrame']*1470
 rms=np.sqrt(np.mean(master[max(0,idx-882):idx+882]**2));peak=np.max(np.abs(master[max(0,idx-882):idx+882]))
 left=corr_window(cut-1.0,cut-.10,cut-1.0+oldOffset/30)
 oldOffset+=oldHolds[i]
 right=corr_window(cut+.10,cut+1.1,cut+.10+oldOffset/30)
 boundaries.append({'id':s['id'],'masterCutSeconds':cut,'cutRmsDbfs':round(float(20*np.log10(max(1e-12,rms))),2),'cutPeakDbfs':round(float(20*np.log10(max(1e-12,peak))),2),'oldRenderLeft':left,'oldRenderRight':right})
voice=decode('public/episode005/voice/edited-v4.wav');mix=np.zeros(plan['DURATION']*1470);mix[:len(voice)]+=voice*.78
frames=np.arange(len(mix))/1470
def ramp(v,a,b):u=np.clip((v-a)/(b-a),0,1);return u*u*(3-2*u)
end=next(s['start']+s['frames']for s in plan['INSERTS']if s['id']=='G5')
def ambient(f):return np.where(f<end,1-ramp(f,end-12,end-9),ramp(f,end,end+6))
for c in plan['CUES']:
 a=decode('public/'+c['file']);a=a[round(c.get('trim',0)*1470):];n=min(len(a),c['frames']*1470);a=a[:n];local=np.arange(n)/1470
 gain=c['volume']*ramp(local,0,min(2,c['frames']*.15))*(1-ramp(local,c['frames']-min(5,c['frames']*.25),c['frames']))*ambient(c['frame']+local)
 at=c['frame']*1470;mix[at:at+n]+=a*gain
before=plan['OUTRO_START']*1470
def loop(file,n,offset=0):a=decode(file);return a[(np.arange(n)+offset)%len(a)]
gain=np.full(before,.28)
for s in plan['INSERTS']:
 if s['id']in ['G1','CH-A','G5']:gain*=1-ramp(frames[:before],s['start']-5,s['start']+5)*(1-ramp(frames[:before],s['start']+s['frames']-5,s['start']+s['frames']+5))*.64
mix[:before]+=loop('public/episode005/sfx/music.wav',before)*gain*ambient(frames[:before])
mix[:before]+=loop('public/episode004/sfx/wind-bed.wav',before)*.12*ambient(frames[:before])
wf=next(s['start']for s in plan['INSERTS']if s['id']=='G1')+159;at=wf*1470
mix[at:before]+=loop('public/episode005/sfx/waterfall.wav',before-at)*.09*ramp(frames[at:before]-wf,0,15)*ambient(frames[at:before])
a=decode('public/'+plan['outro']['file']);mix[before:before+len(a)]+=a*plan['VO_VOLUME']
mix[before:]+=loop('public/episode004/sfx/wind-bed.wav',len(mix)-before,4162*1470)*.16*(1-ramp(frames[before:],plan['DURATION']-18,plan['DURATION']))
peak=float(np.max(np.abs(mix)));report={'ownerRender':'out/Episode005.mp4','ownerRenderSeconds':177.173,'newFrames':plan['DURATION'],'newSeconds':len(mix)/rate,'boundaries':boundaries,'newSamplePeakDbfs':round(20*np.log10(peak),3),'sampleClipping':bool(peak>=1),'notClaimed':['human audition','true peak','LUFS','new full MP4 rendered']}
(out/'audio-audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report,indent=2));assert peak<1
