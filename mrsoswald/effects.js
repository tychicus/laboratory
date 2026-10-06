'use strict';
const canvas=document.getElementById('effects'),ctx=canvas.getContext('2d');
const reduce=matchMedia('(prefers-reduced-motion: reduce)');
let paused=reduce.matches,elapsed=0,last=0;
const motion=document.getElementById('motion');
function sync(){motion.textContent=paused?'Resume motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));}
motion.addEventListener('click',()=>{paused=!paused;sync();});reduce.addEventListener('change',e=>{paused=e.matches;sync();});sync();
// All locations use the image's coordinate system, so effects follow the room exactly.
const P={rock:{x:440,y:679},beaker:{x:705,y:585},burner:{x:908,y:603},faucet:{x:1246,y:581},sink:{x:1246,y:736}};
function glow(x,y,r,color){const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.fillRect(x-r,y-r,r*2,r*2);}
// Warm window light: slow, small changes rather than flashing or sweeping spotlights.
const beams=[{x:48,y:115,w:25,dx:705,dy:705},{x:102,y:166,w:34,dx:710,dy:650},{x:152,y:242,w:25,dx:685,dy:575}];
function sunlight(t){
 ctx.save();ctx.globalCompositeOperation='screen';
 for(let j=0;j<beams.length;j++){
  const b=beams[j],shift=Math.sin(t*.14+j*.8)*13,dx=b.dx+shift;
  const strength=.075+.018*Math.sin(t*.23+j*.9);
  const light=ctx.createLinearGradient(b.x,b.y,b.x+dx,b.y+b.dy);
  light.addColorStop(0,`rgba(255,229,164,${strength*.45})`);
  light.addColorStop(.22,`rgba(255,231,177,${strength})`);
  light.addColorStop(.7,`rgba(255,220,153,${strength*.7})`);
  light.addColorStop(1,'rgba(255,226,166,0)');
  ctx.fillStyle=light;ctx.filter='blur(12px)';ctx.beginPath();
  ctx.moveTo(b.x-b.w,b.y);ctx.lineTo(b.x+b.w,b.y);
  ctx.lineTo(b.x+dx+b.w*3.2,b.y+b.dy);ctx.lineTo(b.x+dx-b.w*3.2,b.y+b.dy);ctx.closePath();ctx.fill();ctx.filter='none';
  // Individual motes brighten inside the beam, and softly fade at either end.
  for(let i=0;i<36;i++){
   const seed=i+j*41,q=(i*.61803398875+t*(.009+(i%5)*.001))%1;
   const across=Math.sin(seed*12.3+t*.19)*.85;
   const width=b.w*(1+q*2.2);
   const x=b.x+dx*q+across*width+Math.sin(t*.31+seed)*5;
   const y=b.y+b.dy*q+Math.cos(t*.24+seed*2)*8;
   const alpha=Math.sin(q*Math.PI)*(.25+.32*(.5+.5*Math.sin(t*.7+seed)))*(1-Math.abs(across)*.55);
   glow(x,y,2.5+(i%3)*.6,`rgba(255,224,165,${alpha*.35})`);
   ctx.fillStyle=`rgba(255,242,209,${alpha})`;ctx.beginPath();ctx.arc(x,y,.65+(i%4)*.24,0,Math.PI*2);ctx.fill();
  }
 }
 ctx.restore();
}
function paint(t){ctx.clearRect(0,0,1536,1024);sunlight(t);
 ctx.save();ctx.globalCompositeOperation='screen';glow(P.rock.x,P.rock.y,112,'rgba(81,255,115,'+(.15+.07*Math.sin(t*1.5))+')');glow(P.rock.x,P.rock.y-8,45,'rgba(142,255,88,.2)');
 for(let i=0;i<12;i++){let q=(t*.13+i*.137)%1;let x=P.rock.x+Math.sin(i*19+q*3)*38;let y=P.rock.y-20-q*94;ctx.globalAlpha=Math.sin(q*Math.PI)*.6;glow(x,y,3,'#c0ffb3');}ctx.globalAlpha=1;ctx.restore();
 // Dense, softly curling steam rises from the open beaker and disperses above it.
 ctx.save();ctx.globalCompositeOperation='screen';
 for(let j=0;j<3;j++){
  for(let i=0;i<24;i++){
   const p=(t*(.13+j*.009)+i/24+j*.173)%1;
   const x=P.beaker.x+(j-1)*20+Math.sin(p*7-t*.65+j*1.7)*(6+p*28);
   const y=P.beaker.y-4-p*215;
   const r=10+p*26;
   const a=Math.pow(Math.sin(p*Math.PI),.8)*.135;
   glow(x,y,r,`rgba(244,250,248,${a})`);
  }
 }
 for(let j=0;j<5;j++){
  ctx.beginPath();
  for(let k=0;k<45;k++){
   const q=k/44,x=P.beaker.x+(j-2)*11+Math.sin(q*8-t*1.05+j*.7)*(4+q*22),y=P.beaker.y-3-q*205;
   k?ctx.lineTo(x,y):ctx.moveTo(x,y);
  }
  const vapor=ctx.createLinearGradient(0,P.beaker.y,0,P.beaker.y-205);
  vapor.addColorStop(0,'rgba(241,250,248,0)');vapor.addColorStop(.18,'rgba(241,250,248,.2)');vapor.addColorStop(.58,'rgba(241,250,248,.14)');vapor.addColorStop(1,'rgba(241,250,248,0)');
  ctx.strokeStyle=vapor;ctx.lineWidth=6+j*.8;ctx.filter='blur(4px)';ctx.stroke();ctx.filter='none';
 }
 ctx.restore();
 // A translucent falling stream and traveling highlights, with small sink splashes.
 ctx.save();const fx=P.faucet.x,fy=P.faucet.y,sy=P.sink.y;
 let water=ctx.createLinearGradient(fx-5,0,fx+5,0);water.addColorStop(0,'#a3e7f72a');water.addColorStop(.5,'#e2fcffa0');water.addColorStop(1,'#8fe5fa30');ctx.fillStyle=water;ctx.beginPath();ctx.moveTo(fx-4,fy);ctx.lineTo(fx+4,fy);ctx.lineTo(fx+6,sy);ctx.lineTo(fx-6,sy);ctx.fill();
 for(let i=0;i<15;i++){let p=(t*1.25+i/15)%1;ctx.strokeStyle='rgba(221,255,255,.48)';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(fx+Math.sin(i*27+t*7)*2,fy+p*(sy-fy));ctx.lineTo(fx+Math.sin(i*27+t*7)*2,fy+p*(sy-fy)+7);ctx.stroke();}
 for(let i=0;i<10;i++){let p=(t*1.8+i/10)%1;let d=i%2?-1:1;ctx.globalAlpha=(1-p)*.55;ctx.fillStyle='#d2faff';ctx.beginPath();ctx.ellipse(fx+d*p*(12+i),sy-Math.sin(p*Math.PI)*(10+i),1,2,0,0,7);ctx.fill();}ctx.globalAlpha=1;for(let i=0;i<3;i++){let p=(t*.9+i/3)%1;ctx.strokeStyle=`rgba(177,231,239,${(1-p)*.22})`;ctx.beginPath();ctx.ellipse(fx,sy+2,5+p*29,2+p*6,0,0,7);ctx.stroke();}ctx.restore();
 // Layered blue Bunsen flame anchored at the top of the burner.
 const bx=P.burner.x,by=P.burner.y,sway=Math.sin(t*19)*2+Math.sin(t*31),h=56+Math.sin(t*23)*4;
 ctx.save();ctx.globalCompositeOperation='screen';glow(bx,by-20,44,'rgba(19,144,255,.24)');let flame=ctx.createLinearGradient(0,by,0,by-h);flame.addColorStop(0,'#28aeffc0');flame.addColorStop(.6,'#60ccffe0');flame.addColorStop(1,'#bceaff00');ctx.fillStyle=flame;ctx.beginPath();ctx.moveTo(bx-9,by);ctx.bezierCurveTo(bx-16,by-22,bx+sway-3,by-h+12,bx+sway,by-h);ctx.bezierCurveTo(bx+sway+3,by-h+15,bx+15,by-18,bx+9,by);ctx.closePath();ctx.fill();ctx.fillStyle='#aeeeffdd';ctx.beginPath();ctx.moveTo(bx-5,by);ctx.quadraticCurveTo(bx-5,by-12,bx+sway*.4,by-29);ctx.quadraticCurveTo(bx+6,by-12,bx+5,by);ctx.fill();ctx.restore();
 // Quiet motes drifting in the light.
 for(let i=0;i<38;i++){let x=(i*237.7+t*(2+i%4))%1536,y=(i*113.7-t*(1+i%3)+2048)%1024;ctx.fillStyle=`rgba(255,237,184,${.12+.1*Math.sin(t+i)})`;ctx.beginPath();ctx.arc(x,y,.6+i%3*.35,0,7);ctx.fill();}
}
function frame(ms){if(!last)last=ms;const dt=Math.min((ms-last)/1000,.05);last=ms;if(!paused&&!document.hidden){elapsed+=dt;paint(elapsed);}requestAnimationFrame(frame);}paint(0);requestAnimationFrame(frame);
// Fit the entire 3:2 image into the available space; the canvas shares its bounds.
const viewport=document.getElementById('viewport'),scene=document.getElementById('scene');
function fitScene(){const width=Math.min(viewport.clientWidth,viewport.clientHeight*1.5);scene.style.setProperty('--scene-width',width+'px');}
new ResizeObserver(fitScene).observe(viewport);fitScene();
