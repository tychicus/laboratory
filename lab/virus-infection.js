(() => {
  'use strict';
  const stages = [["A compatible contact", "A viral capsid binds a receptor on a susceptible cell. Receptor matching and other cell factors determine whether infection can proceed."], ["The cell takes the particle in", "In this simplified picornavirus-style route, the cell takes the particle into an endosome: a small compartment surrounded by membrane."], ["RNA crosses into the cytoplasm", "The capsid changes shape and releases its RNA across the endosome membrane. This non-enveloped virus has no lipid envelope to fuse with the cell."], ["Copy the RNA. Build the parts.", "Host ribosomes read positive-sense viral RNA to make proteins, including viral copying enzymes. Those enzymes make new genomes through a complementary RNA template. Watch RNA copies and capsid parts accumulate using the cell’s materials and energy."], ["Assemble many new viruses", "Capsid proteins form protective shells around new RNA genomes. Many complete particles now occupy the cytoplasm. Viruses are assembled from parts; they do not divide like bacteria."], ["Lysis: the cell breaks open", "In this lytic pathway, infection damages the cell and its membrane ruptures. Newly assembled viruses escape into surrounding fluid. The burst illustrates membrane damage, not a cell simply becoming too full."], ["The infection can spread", "Released viruses can reach nearby susceptible cells, where another round of copying and assembly may begin. The two small cells illustrate possible new infections. Many particles never establish an infection; immune defenses can block or clear them."]];
  const $ = id => document.getElementById(id);
  const ns = 'http://www.w3.org/2000/svg';
  const scene = $('infection-scene');
  if (!scene) return;
  let stage = 0, fraction = 0, playing = false, previousTime = null, frame = null;
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let reduced = reducedMotion.matches;
  const play = $('play-cycle');
  const buttons = [...document.querySelectorAll('[data-stage]')];
  const positions = Array.from({length:24},(_,i)=>i>=16&&i%6>=4 ? [285+((Math.floor(i/6)-2)*2+i%6-4)*67,416] : [285+(i%6)*67,200+Math.floor(i/6)*59]);
  const copies=[], proteins=[], cores=[], offspring=[], neighbors=[];
  const fragments=[...$('membrane-fragments').children];
  function use(parent,symbol) { const el=document.createElementNS(ns,'use'); el.setAttribute('href','#'+symbol); $(parent).appendChild(el); return el; }
  positions.forEach(()=>{copies.push(use('rna-copies','rna-symbol'));proteins.push(use('proteins','protein-symbol'));cores.push(use('cores','particle'));offspring.push(use('offspring','particle'));});
  for(let i=0;i<12;i++)neighbors.push(use('neighbor-viruses','particle'));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const clamp=t=>Math.max(0,Math.min(1,t));
  function move(el,x,y,scale=1){el.setAttribute('transform',`translate(${x} ${y}) scale(${scale})`);}
  function visible(id,yes,opacity=1){$(id).style.display=yes?'':'none';$(id).style.opacity=opacity;}
  function draw(){
    const t=fraction, burst=stage===5?clamp((t-.2)/.8):stage===6?1:0;
    visible('cell-membrane',stage<5||(stage===5&&t<.2));
    visible('cell-body',true,1-burst*.82);
    visible('membrane-fragments',stage>=5&&t>=.2||stage===6,1-burst*.5);
    fragments.forEach((el,i)=>move(el,Math.cos(i*Math.PI/4-2.3)*burst*55,Math.sin(i*Math.PI/4-2.3)*burst*40));
    $('cell-label').textContent=stage>=5?'DAMAGED HOST CELL':'HOST CELL / CYTOPLASM';
    visible('neighbor-cells',true,stage===6?1:.38);
    visible('incoming',stage<=2,stage===2?1-t:1);
    move($('incoming'),stage===0?lerp(80,205,t):stage===1?lerp(205,320,t):320,220,1.1);
    visible('uptake',stage===1&&t<.85);
    const depth=lerp(230,385,clamp(t/.85));
    $('uptake-membrane').setAttribute('d',`M230 175C${depth} 175 ${depth} 270 230 270`);
    visible('endosome',stage===1||stage===2,stage===1?clamp((t-.65)/.35):1-t*.7);
    visible('entry-pore',stage===2,t);
    visible('released-rna',stage===2,t);move($('released-rna'),lerp(320,435,t),220);
    visible('incoming-label',stage===0);visible('receptor-label',stage===0);visible('receptor-line',stage===0);
    visible('factory',stage===3);
    visible('rna-copies',stage===3||stage===4);visible('proteins',stage===3||stage===4);
    visible('cores',stage===4||(stage===5&&t<.2));
    visible('offspring',stage===5&&t>=.2||stage===6);
    visible('release-label',stage>=5);visible('spread-label',stage===6);
    visible('neighbor-viruses',stage===6);
    const genomes=stage<3?0:stage===3?Math.floor(t*24):24;
    const assembled=stage<4?0:stage===4?Math.floor(t*24):24;
    $('genome-count').textContent=`New RNA copies: ${genomes}`;
    $('particle-count').textContent=`Assembled viruses: ${assembled}`;
    positions.forEach(([x,y],i)=>{
      const built=clamp(t*24-i), appear=clamp(t*24-i);
      move(copies[i],x,y,.5);copies[i].style.opacity=stage===3?appear:1-built;
      move(proteins[i],x+lerp(21,0,stage===4?built:0),y+17,.6);proteins[i].style.opacity=stage===3?appear:1-built;
      move(cores[i],x,y,.8);cores[i].style.opacity=stage===4?built:1;
      const angle=i*Math.PI*2/24;
      const ex=460+Math.cos(angle)*(255+(i*37%85)),ey=270+Math.sin(angle)*(175+(i*29%50));
      if(stage===5){move(offspring[i],lerp(x,ex,burst),lerp(y,ey,burst),.8);offspring[i].style.opacity=1;}
      else if(stage===6){
        const reaches=i<8, travel=clamp(t/.65), targetY=i%2?401:171;
        move(offspring[i],reaches?lerp(ex,833+(i%3)*24,travel):lerp(ex,ex+45,t),reaches?lerp(ey,targetY+(i%3-1)*16,travel):ey,.8);
        offspring[i].style.opacity=reaches?1-clamp((t-.6)/.15):1-t*.5;
      }
    });
    neighbors.forEach((el,i)=>{move(el,834+(i%3)*33,(i<6?137:367)+(Math.floor(i/3)%2)*40,.55);el.style.opacity=clamp((t-.68)*4-(i%6)*.055);});
    $('cycle-progress').value=stage+t;
  }
  function caption() {
    $('stage-counter').textContent=`Stage ${String(stage+1).padStart(2,'0')} / 07`;
    $('stage-title').textContent=stages[stage][0];
    $('stage-text').textContent=stages[stage][1];
    $('scene-title').textContent=`Stage ${stage+1}: ${stages[stage][0]}`;
    $('scene-desc').textContent=stages[stage][1];
    buttons.forEach((b,i)=>i===stage?b.setAttribute('aria-current','step'):b.removeAttribute('aria-current'));
    $('previous-step').disabled=stage===0;
    $('next-step').disabled=stage===6;
  }
  function stop() {
    playing=false;
    cancelAnimationFrame(frame);
    previousTime=null;
    play.textContent=stage===6&&fraction===1?'Replay animation':'Play animation';
    play.setAttribute('aria-pressed','false');
  }
  function select(n) {
    stop(); stage=Math.max(0,Math.min(6,n)); fraction=1;
    caption(); draw();
    play.textContent=stage===6?'Replay animation':'Play animation';
  }
  function tick(now) {
    if(!playing) return;
    if(previousTime!==null) fraction+=Math.min(now-previousTime,100)/5500*Number($('cycle-speed').value);
    previousTime=now;
    if(fraction>=1) {
      fraction=1;
      draw();
      if(stage===6) { stop(); return; }
      stage++; fraction=0; caption();
    }
    draw(); frame=requestAnimationFrame(tick);
  }
  function motionHint() {
    $('motion-hint').textContent=reduced
      ?'Reduced motion is enabled. Use the numbered stages or Back / Next to explore still frames.'
      :'The animation starts only when you press Play. Each stage takes about 5.5 seconds at 1× speed.';
    play.disabled=reduced;
  }
  play.addEventListener('click',()=>{
    if(playing){stop();return;}
    if(reduced)return;
    // A deliberate Play request resumes the site's global motion toggle too.
    if(document.body.classList.contains('paused')) $('motion').click();
    if(stage===6&&fraction===1)stage=0;
    if(fraction===1)fraction=0;
    playing=true; previousTime=null;
    play.textContent='Pause animation'; play.setAttribute('aria-pressed','true');
    caption(); frame=requestAnimationFrame(tick);
  });
  $('previous-step').addEventListener('click',()=>select(stage-1));
  $('next-step').addEventListener('click',()=>select(stage+1));
  $('restart-cycle').addEventListener('click',()=>{stop();stage=0;fraction=reduced?1:0;caption();draw();play.textContent='Play animation';});
  buttons.forEach(b=>b.addEventListener('click',()=>select(Number(b.dataset.stage))));
  $('motion').addEventListener('click',()=>{if(document.body.classList.contains('paused'))stop();});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();});
  reducedMotion.addEventListener('change',event=>{reduced=event.matches;stop();if(reduced)fraction=1;motionHint();draw();});
  window.addEventListener('pagehide',stop);
  $('animation-controls').hidden=false;
  if(reduced)fraction=1;
  play.setAttribute('aria-pressed','false');
  caption();draw();motionHint();
})();
