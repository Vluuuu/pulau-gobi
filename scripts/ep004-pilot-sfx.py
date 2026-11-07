# Original deterministic SFX generator; no third-party audio. Requires NumPy.
from pathlib import Path
import json,wave,hashlib,numpy as np
root=Path.cwd();out=root/'public/episode004/pilot';out.mkdir(parents=True,exist_ok=True)
rate=44100;seed=4004;rng=np.random.default_rng(seed)
manifest=[]
def save(id,seconds,signal,peak_db):
 a=np.asarray(signal,dtype=np.float64);a-=np.mean(a);a*=10**(peak_db/20)/max(1e-12,np.max(np.abs(a)))
 a[:80]*=np.linspace(0,1,80);a[-180:]*=np.linspace(1,0,180)
 pcm=(a*32767).astype('<i2')
 with wave.open(str(out/(id+'.wav')),'wb')as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(pcm.tobytes())
 actual=pcm.astype(float)/32768
 manifest.append({'id':id,'file':'episode004/pilot/'+id+'.wav','source':'original-procedural','seed':seed,'sampleRate':rate,'durationSeconds':len(a)/rate,
  'peakDbfs':float(20*np.log10(np.max(np.abs(actual)))),'rmsDbfs':float(20*np.log10(np.sqrt(np.mean(actual**2)))),'sha256':hashlib.sha256((out/(id+'.wav')).read_bytes()).hexdigest()})
def time(seconds):return np.arange(round(seconds*rate))/rate
t=time(.12);noise=rng.standard_normal(len(t));low=np.convolve(noise,np.ones(23)/23,mode='same');save('footstep',.12,(np.sin(2*np.pi*(105*t-170*t*t))*.6+low*1.8)*np.exp(-t*36),-10)
t=time(.07);save('bubble-pop',.07,(np.sin(2*np.pi*(650*t-2300*t*t))+.2*rng.standard_normal(len(t)))*np.exp(-t*65),-9)
t=time(.35);freq=180+340*(1-np.exp(-t*30))+35*np.sin(t*2*np.pi*19)*np.exp(-t*8);save('boing',.35,np.sin(2*np.pi*np.cumsum(freq)/rate)*np.exp(-t*11),-8)
t=time(.16);low=np.convolve(rng.standard_normal(len(t)),np.ones(45)/45,mode='same');save('landing-thump',.16,(np.sin(2*np.pi*(90*t-130*t*t))+.8*low)*np.exp(-t*24),-8)
t=time(.6);env=np.sin(np.pi*t/.6)**.6;save('panic-rattle',.6,(np.sin(2*np.pi*150*t+3*np.sin(2*np.pi*23*t))+.35*rng.standard_normal(len(t)))*env*(.25+.75*np.maximum(0,np.sin(2*np.pi*18*t))),-11)
t=time(.24);low=np.convolve(rng.standard_normal(len(t)),np.ones(31)/31,mode='same');save('fall-thud',.24,(np.sin(2*np.pi*(68*t-85*t*t))+.8*low)*np.exp(-t*19),-7)

print(json.dumps(manifest,indent=2))
