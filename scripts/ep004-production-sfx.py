from pathlib import Path
import numpy as np,wave,json,hashlib
root=Path.cwd();out=root/'public/episode004/sfx';out.mkdir(parents=True,exist_ok=True)
rate=44100;seed=400504;rng=np.random.default_rng(seed);meta=[]
def make(id,seconds,signal,peak):
 a=np.asarray(signal,dtype=float);a-=a.mean();a*=10**(peak/20)/max(1e-12,np.max(abs(a)));a[:300]*=np.linspace(0,1,300);a[-700:]*=np.linspace(1,0,700)
 pcm=(a*32767).astype('<i2');p=out/(id+'.wav')
 with wave.open(str(p),'wb')as w:w.setnchannels(1);w.setsampwidth(2);w.setframerate(rate);w.writeframes(pcm.tobytes())
 x=pcm.astype(float)/32768;meta.append({'id':id,'file':'episode004/sfx/'+id+'.wav','source':'original-procedural','seed':seed,'durationSeconds':len(x)/rate,'sampleRate':rate,
  'peakDbfs':float(20*np.log10(max(1e-12,max(abs(x))))),'rmsDbfs':float(20*np.log10(np.sqrt(np.mean(x*x)))),'sha256':hashlib.sha256(p.read_bytes()).hexdigest()})
def time(s):return np.arange(round(s*rate))/rate
t=time(1.0);noise=np.convolve(rng.standard_normal(len(t)),np.ones(120)/120,mode='same');make('earth-rumble',1,(noise+.20*np.sin(2*np.pi*47*t))*np.sin(np.pi*t)**.7,-11)
t=time(1.4);n=np.convolve(rng.standard_normal(len(t)),np.ones(6)/6,mode='same');make('leaf-rustle',1.4,n*(.3+.7*np.sin(2*np.pi*4*t)**2)*np.sin(np.pi*t/1.4),-13)
t=time(2);n=np.convolve(rng.standard_normal(len(t)),np.ones(9)/9,mode='same');make('water-flow',2,n*(.6+.15*np.sin(t*17)+.2*np.sin(t*29))*np.sin(np.pi*t/2)**.3,-14)
t=time(.12);make('wood-tok',.12,(np.sin(2*np.pi*220*t)+.5*np.sin(2*np.pi*330*t)+.10*rng.standard_normal(len(t)))*np.exp(-t*40),-9)
t=time(.5);n=np.convolve(rng.standard_normal(len(t)),np.ones(40)/40,mode='same');make('roof-drop',.5,(np.sin(2*np.pi*(75*t-38*t*t))+.9*n)*np.exp(-t*12),-9)
t=time(.7);make('chime',.7,sum(np.sin(2*np.pi*f*t)*np.exp(-t*(5+i)) for i,f in enumerate([1046,1318,1568])),-12)
t=time(.45);make('gate-creak',.45,np.sin(2*np.pi*180*t+5*np.sin(t*60))*(.4+.6*np.sin(t*18)**2)*np.sin(np.pi*t/.45),-14)
t=time(4);n=np.convolve(rng.standard_normal(len(t)),np.ones(70)/70,mode='same');make('wind-bed',4,n*(.5+.5*np.sin(t*2.2)**2),-24)
p=root/'src/episode004/production/sound.ts';p.write_text('// Original deterministic procedural audio. No third-party recordings.\nexport const EXTRA_SFX='+json.dumps(meta,separators=(',',':'))+' as const;\n',encoding='utf-8')
print(json.dumps(meta,indent=2))
