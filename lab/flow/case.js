(() => {
'use strict';
const $ = id => document.getElementById(id);
const reduced = matchMedia('(prefers-reduced-motion: reduce)');
let step = 0, paused = reduced.matches, acquiring = false, elapsed = 0, last = 0, frame = 0, count = 0;
const total = 4000, duration = 8000;
const scenes = [
 ['THE CALL TO INVESTIGATE','You’re the scientist on this case.','A flagged result is a starting point. Your mission: follow the evidence and find out what these unusual cells might be.','Examine the blood smear','SPECIMEN RECEIVED','AWAITING REVIEW'],
 ['CLUE 01 / APPEARANCE','Something looks different.','Look at the large purple-staining cells and their prominent nuclei. We can see suspicious cells—but appearance alone cannot tell us their identity.','Run flow cytometry','BLOOD SMEAR / REAL MICROSCOPY','MORPHOLOGY REVIEW'],
 ['CLUE 02 / PATTERNS','This is where my job gets interesting.','Prepared cells pass the laser one at a time. Light signals become dots. Similar measurements form populations. Watch the same cells form patterns across three linked plots.','Highlight the unusual population','FLOW CYTOMETRY / ACQUISITION','READY'],
 ['CLUE 03 / CELL IDENTITY','Read the cells’ ID badges.','The pink cells are the same selected population in every plot: low CD45 and side scatter, CD34 positive, and CD19 / CD10 dual positive.','Review the evidence','SELECTED POPULATION / MARKER RESULTS','CLUES REVEALED'],
 ['CONNECT THE EVIDENCE','What do the clues suggest?','Suspicious cells on the smear. An unusual population. Markers that suggest immature B-lineage cells. Put the clues together.','Reveal the suspected diagnosis','THE EVIDENCE / YOUR THEORY','WAITING FOR YOUR CALL'],
 ['THE REVEAL / A WORKING SUSPICION','You helped uncover the next step.','In this fictional case, the combined findings raise suspicion for B-cell acute lymphoblastic leukemia (B-ALL).','Run the case again','INVESTIGATION / FINDINGS','FOLLOW-UP TESTING NEEDED']
];
let seed = 6281;
function rand(){seed=(Math.imul(seed,1664525)+1013904223)>>>0;return (seed+.5)/4294967296;}
function normal(){return Math.sqrt(-2*Math.log(rand()))*Math.cos(2*Math.PI*rand());}
const groups = [
 {cd45:.76,ssc:.13,sx:.035,sy:.025},
 {cd45:.66,ssc:.40,sx:.045,sy:.045},
 {cd45:.56,ssc:.73,sx:.055,sy:.06},
 {cd45:.26,ssc:.19,sx:.035,sy:.028}
];
const bound = v => Math.max(.025,Math.min(.975,v));
const noise = () => Math.max(-2.3,Math.min(2.3,normal()));
const gate = {x:.26,y:.19,rx:.13,ry:.115};
// One event record carries every measurement. Gate membership is calculated
// once from plot 1 and reused unchanged on all three views.
const points = Array.from({length:total},(_,id)=>{
 const g=id%10<4?3:id%10<7?2:id%10<9?0:1, group=groups[g];
 const cd45=bound(group.cd45+noise()*group.sx), ssc=bound(group.ssc+noise()*group.sy);
 const cd34=bound((g===3?.76:.14)+noise()*.045);
 const matureB=g===0 && id%20===7;
 const cd19=bound((g===3?.74:matureB?.76:.13)+noise()*.045);
 const cd10=bound((g===3?.76:.14)+noise()*.045);
 const selected=((cd45-gate.x)/gate.rx)**2+((ssc-gate.y)/gate.ry)**2<=1;
 return {id,cd45,ssc,cd34,cd19,cd10,selected};
});
const plots = [
 {id:'plot',x:'ssc',y:'cd45',xlabel:'Side scatter →',ylabel:'CD45 intensity →',name:'Side scatter (horizontal) versus CD45 (vertical)'},
 {id:'plot-cd34',x:'cd34',y:'ssc',xlabel:'CD34 intensity →',ylabel:'Side scatter →',name:'CD34 versus side scatter'},
 {id:'plot-dual',x:'cd19',y:'cd10',xlabel:'CD19 intensity →',ylabel:'CD10 intensity →',name:'CD19 versus CD10 dual staining'}
].map(p=>({...p,canvas:$(p.id),ctx:$(p.id).getContext('2d')}));
function drawPlot(plot,index){
 const {ctx}=plot, x=77,y=35,w=495,h=380, highlighted=step>=3;
 const px=v=>x+v*w,py=v=>y+(1-v)*h;
 ctx.clearRect(0,0,600,500);ctx.fillStyle='#07151f';ctx.fillRect(0,0,600,500);
 ctx.strokeStyle='#203642';ctx.lineWidth=1;
 for(let i=0;i<=5;i++){ctx.beginPath();ctx.moveTo(px(i/5),y);ctx.lineTo(px(i/5),y+h);ctx.stroke();ctx.beginPath();ctx.moveTo(x,py(i/5));ctx.lineTo(x+w,py(i/5));ctx.stroke();}
 ctx.strokeStyle='#91aeb9';ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x,y+h);ctx.lineTo(x+w,y+h);ctx.stroke();
 ctx.fillStyle='#b9d0da';ctx.font='19px Arial';ctx.textAlign='center';ctx.fillText(plot.xlabel,x+w/2,478);
 ctx.save();ctx.translate(24,y+h/2);ctx.rotate(-Math.PI/2);ctx.fillText(plot.ylabel,0,0);ctx.restore();
 ctx.font='13px monospace';ctx.textAlign='left';ctx.fillText('LOW',x,y+h+24);ctx.textAlign='right';ctx.fillText('HIGH',x+w,y+h+24);
 if(index>0){
  ctx.strokeStyle='#5c7683';ctx.setLineDash([5,5]);ctx.beginPath();ctx.moveTo(px(.45),y);ctx.lineTo(px(.45),y+h);
  if(index===2){ctx.moveTo(x,py(.45));ctx.lineTo(x+w,py(.45));}ctx.stroke();ctx.setLineDash([]);
  ctx.font='13px monospace';ctx.textAlign='center';ctx.fillStyle='#9ab4bf';
  if(index===1){ctx.fillText('CD34 −',px(.2),y+19);ctx.fillText('CD34 +',px(.72),y+19);}
  else {ctx.fillText('CD19− / CD10+',px(.21),y+19);ctx.fillText('CD19+ / CD10+',px(.73),y+19);ctx.fillText('CD19− / CD10−',px(.21),y+h-10);ctx.fillText('CD19+ / CD10−',px(.73),y+h-10);}
 }
 // Paint highlighted events last so background events cannot obscure them.
 for(const selectedPass of highlighted?[false,true]:[false]){
  for(let i=0;i<count;i++){
   const p=points[i];if(highlighted&&p.selected!==selectedPass)continue;
   ctx.globalAlpha=highlighted?(p.selected?.85:.28):.55;
   ctx.fillStyle=highlighted&&p.selected?'#f0a1d0':'#9ab7c3';
   ctx.fillRect(px(p[plot.x]),py(p[plot.y]),2,2);
  }
 }
 ctx.globalAlpha=1;
 if(highlighted&&index===0){ctx.strokeStyle='#ffc0e3';ctx.lineWidth=2;ctx.setLineDash([7,5]);ctx.beginPath();ctx.ellipse(px(gate.y),py(gate.x),gate.ry*w,gate.rx*h,0,0,2*Math.PI);ctx.stroke();ctx.setLineDash([]);}
}
function draw(){plots.forEach(drawPlot);$('events').textContent=count.toLocaleString('en-US');}
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
 document.body.classList.toggle('flow-mode',step>=2&&step<=4);
 document.querySelectorAll('.linked-result').forEach(el=>el.hidden=step<3);
 $('linked-key').textContent=step>=3?'Pink = the same selected cells in every plot. Gray = the remaining cells.':'Select the unusual population to follow the same cells across their marker measurements.';
 plots.forEach((p,i)=>p.canvas.setAttribute('aria-label','Simulated '+p.name+' plot. '+(step>=3?['The low-CD45, low-side-scatter population is selected and colored pink.','The same selected pink cells are CD34 positive.','The same selected pink cells coexpress CD19 and CD10 in the upper-right region.'][i]:'Cell events accumulate; all cells are gray until a population is selected.')));
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
