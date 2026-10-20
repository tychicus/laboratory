(() => {
'use strict';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let step = 0, paused = reduced.matches, acquiring = false, elapsed = 0, last = 0, frame = 0, count = 0;
const total = 4000, duration = 8000;
const scenes = [
 ['THE CALL TO INVESTIGATE','You’re the scientist on this case.','A flagged result is a starting point. Your mission: follow the evidence and find out what these unusual cells might be.','Examine the blood smear','SPECIMEN RECEIVED','AWAITING REVIEW'],
 ['CLUE 01 / APPEARANCE','Something looks different.','Look at the large purple-staining cells and their prominent nuclei. We can see suspicious cells—but appearance alone cannot tell us their identity.','Run flow cytometry','BLOOD SMEAR / REAL MICROSCOPY','MORPHOLOGY REVIEW'],
 ['CLUE 02 / PATTERNS','This is where my job gets interesting.','Prepared cells pass the laser one at a time. Light signals become dots. Similar measurements form populations. Watch the patterns emerge.','Highlight the unusual population','FLOW CYTOMETRY / ACQUISITION','READY'],
 ['CLUE 03 / CELL IDENTITY','Read the cells’ ID badges.','We select a low-CD45, low-side-scatter population to investigate. Additional fluorescence measurements reveal three important clues.','Review the evidence','SELECTED POPULATION / MARKER RESULTS','CLUES REVEALED'],
 ['CONNECT THE EVIDENCE','What do the clues suggest?','Suspicious cells on the smear. An unusual population. Markers that suggest immature B-lineage cells. Put the clues together.','Reveal the suspected diagnosis','THE EVIDENCE / YOUR THEORY','WAITING FOR YOUR CALL'],
 ['THE REVEAL / A WORKING SUSPICION','You helped uncover the next step.','In this fictional case, the combined findings raise suspicion for B-cell acute lymphoblastic leukemia (B-ALL).','Run the case again','INVESTIGATION / FINDINGS','FOLLOW-UP TESTING NEEDED']
];
let seed = 6281;
function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed+.5)/4294967296;}
function normal(){return Math.sqrt(-2*Math.log(rand()))*Math.cos(2*Math.PI*rand());}
const groups = [
 {x:.73,y:.13,sx:.05,sy:.035,color:'#83dacf'},
 {x:.63,y:.40,sx:.06,sy:.065,color:'#8eb8e8'},
 {x:.53,y:.72,sx:.075,sy:.085,color:'#d5bc82'},
 {x:.26,y:.19,sx:.045,sy:.04,color:'#f0a1d0'}
];
const points = Array.from({length:total},(_,i)=>{const g=i%10<4?3:i%10<7?2:i%10<9?0:1;const p=groups[g];return {x:Math.max(.025,Math.min(.975,p.x+normal()*p.sx)),y:Math.max(.025,Math.min(.975,p.y+normal()*p.sy)),g};});
const canvas=$('plot'),ctx=canvas.getContext('2d');
function draw(){
 ctx.clearRect(0,0,900,540);ctx.fillStyle='#07151f';ctx.fillRect(0,0,900,540);
 const x=85,y=28,w=775,h=430;
 ctx.strokeStyle='#24414d';ctx.lineWidth=1;
 for(let i=0;i<=5;i++){ctx.beginPath();ctx.moveTo(x+w*i/5,y);ctx.lineTo(x+w*i/5,y+h);ctx.stroke();ctx.beginPath();ctx.moveTo(x,y+h*i/5);ctx.lineTo(x+w,y+h*i/5);ctx.stroke();}
 ctx.strokeStyle='#91aeb9';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();
 ctx.fillStyle='#a8c2ce';ctx.font='17px Arial';ctx.textAlign='center';ctx.fillText('CD45 intensity →',x+w/2,518);
 ctx.save();ctx.translate(24,y+h/2);ctx.rotate(-Math.PI/2);ctx.fillText('Side scatter / internal complexity →',0,0);ctx.restore();
 ctx.font='12px monospace';ctx.textAlign='left';ctx.fillText('LOW',x,y+h+24);ctx.textAlign='right';ctx.fillText('HIGH',x+w,y+h+24);
 for(let i=0;i<count;i++){const p=points[i];ctx.globalAlpha=step>=3&&p.g!==3?.23:.7;ctx.fillStyle=groups[p.g].color;ctx.fillRect(x+p.x*w,y+(1-p.y)*h,2.2,2.2);}
 ctx.globalAlpha=1;
 if(step>=3){ctx.strokeStyle='#ffc0e3';ctx.lineWidth=2;ctx.setLineDash([8,5]);ctx.beginPath();ctx.ellipse(x+.26*w,y+.81*h,.13*w,.135*h,0,0,2*Math.PI);ctx.stroke();ctx.setLineDash([]);}
 $('events').textContent=count.toLocaleString('en-US');
}
function tick(now){
 if(!acquiring)return;
 if(!paused)elapsed+=now-last;
 last=now;count=Math.min(total,Math.floor(elapsed/duration*total));draw();
 if(count===total){finish();return;}frame=requestAnimationFrame(tick);
}
function finish(){cancelAnimationFrame(frame);acquiring=false;count=total;elapsed=duration;$('flow').classList.remove('running');$('visual-state').textContent='4,000 EVENTS ACQUIRED';$('next').innerHTML=scenes[2][3]+' <span>→</span>';draw();}
function start(){count=0;elapsed=0;if(reduced.matches){finish();return;}acquiring=true;$('flow').classList.toggle('running',!paused);$('visual-state').textContent=paused?'ACQUISITION PAUSED':'ACQUIRING CELLS';$('next').textContent='Skip animation →';last=performance.now();frame=requestAnimationFrame(tick);}
function render(){
 cancelAnimationFrame(frame);acquiring=false;
 const s=scenes[step];$('kicker').textContent=s[0];$('step-title').textContent=s[1];$('description').textContent=s[2];$('next').innerHTML=s[3]+' <span>→</span>';$('visual-title').textContent=s[4];$('visual-state').textContent=s[5];$('step-number').textContent=`0${step+1} / 06`;
 $('sample').hidden=step!==0;$('smear').hidden=step!==1;$('flow').hidden=step<2||step>4;$('conclusion').hidden=step!==5;
 $('markers').hidden=step!==3;$('theory').hidden=step!==4;$('caution').hidden=step!==5;$('gate-label').hidden=step<3;
 $('back').disabled=step===0;
 document.querySelectorAll('.steps li').forEach((li,i)=>{li.className=i===step?'active':i<step?'done':'';if(i===step)li.setAttribute('aria-current','step');else li.removeAttribute('aria-current');});
 canvas.setAttribute('aria-label',step>=3?'Simulated CD45 versus side-scatter plot with 4,000 cells. A low-CD45, low-side-scatter population is outlined for investigation.':'Simulated CD45 versus side-scatter plot. Four cell populations form during acquisition.');
 if(step===2)start();else if(step===3||step===4){count=total;draw();}
}
function syncMotion(){document.body.classList.toggle('paused',paused);$('motion').setAttribute('aria-pressed',String(paused));$('motion').textContent=paused?'Resume animation':'Pause animation';$('flow').classList.toggle('running',acquiring&&!paused);if(acquiring)$('visual-state').textContent=paused?'ACQUISITION PAUSED':'ACQUIRING CELLS';}
$('next').addEventListener('click',()=>{if(acquiring){finish();return;}step=step===5?0:step+1;render();});
$('back').addEventListener('click',()=>{if(step>0){step--;render();}});
$('restart').addEventListener('click',()=>{step=0;count=0;render();});
$('motion').addEventListener('click',()=>{paused=!paused;syncMotion();});
reduced.addEventListener('change',()=>{paused=reduced.matches;if(reduced.matches&&acquiring)finish();syncMotion();});
syncMotion();render();
})();
