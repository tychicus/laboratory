const motion=document.getElementById('motion');
// Motion starts enabled on every visit; the site switch is the source of truth.
let paused=false;
function setMotion(){document.body.classList.toggle('paused',paused);motion.textContent=paused?'Resume motion':'Pause motion';motion.setAttribute('aria-pressed',String(paused));}
setMotion();motion.addEventListener('click',()=>{paused=!paused;setMotion()});
const stage=document.querySelector('.microscope-stage');
const welcome=document.querySelector('.welcome-layer');
// Anchor the power ring, rather than the whole welcome message, to the lens.
const welcomeCopy=welcome.querySelector('.intro-copy');
const powerRing=welcome.querySelector('.power-ring');
const lens=document.querySelector('.lens-surface');
function centerWelcome(){
 const field=lens.getBoundingClientRect();
 const layer=welcome.getBoundingClientRect();
 const copy=welcomeCopy.getBoundingClientRect();
 const ring=powerRing.getBoundingClientRect();
 welcome.style.setProperty('--field-x',`${field.left+field.width/2-layer.left}px`);
 welcome.style.setProperty('--field-y',`${field.top+field.height/2-layer.top}px`);
 welcomeCopy.style.setProperty('--power-offset',`${ring.top+ring.height/2-copy.top}px`);
 welcome.classList.add('field-aligned');
}
let alignmentFrame;
function queueWelcomeAlignment(){
 cancelAnimationFrame(alignmentFrame);
 alignmentFrame=requestAnimationFrame(centerWelcome);
}
const welcomeResize=new ResizeObserver(queueWelcomeAlignment);
for(const element of [document.querySelector('header'),stage,lens,welcome,welcomeCopy])welcomeResize.observe(element);
window.addEventListener('resize',queueWelcomeAlignment);
document.fonts.ready.then(queueWelcomeAlignment);
centerWelcome();
let entered=false;
function reveal(focus=false){entered=true;stage.inert=false;welcome.inert=true;document.body.classList.remove('welcoming','entering');document.body.classList.add('welcome-dismissed');if(focus)document.getElementById('field-title').focus();}
if(location.hash==='#microscope')reveal();else stage.inert=true;
document.getElementById('enter').addEventListener('click',e=>{e.preventDefault();document.body.classList.add('entering');document.body.classList.remove('welcoming');document.body.classList.add('welcome-dismissed');history.replaceState(null,'','#microscope');setTimeout(()=>reveal(true),paused?0:850)});
window.addEventListener('hashchange',()=>{if(location.hash==='#microscope')reveal(true)});
const labels=document.getElementById('labels');let showLabels=false;
function labelState(){document.body.classList.toggle('labels-visible',showLabels);labels.setAttribute('aria-pressed',String(showLabels));labels.textContent=showLabels?'Hide labels':'Show labels';}
labelState();labels.addEventListener('click',()=>{showLabels=!showLabels;labelState()});
const particles=document.querySelector('.particles');
for(let i=0;i<40;i++){const p=document.createElement('i');p.className='particle';p.style.cssText=`left:${i*47%100}%;top:${i*29%100}%;animation-delay:-${i%14}s`;particles.append(p);}
let navigating=false;
for(const a of document.querySelectorAll('.specimen,.satellite'))a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();if(navigating)return;navigating=true;const plane=document.querySelector('.specimen-plane');const p=plane.getBoundingClientRect(),r=a.getBoundingClientRect();plane.style.transformOrigin=`${r.left+r.width/2-p.left}px ${r.top+r.height/2-p.top}px`;document.body.classList.add('departing');setTimeout(()=>location.href=a.href,paused?0:800)});
window.addEventListener('pageshow',()=>{navigating=false;document.body.classList.remove('departing');});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('details[open]').forEach(d=>d.open=false)});
document.addEventListener('click',e=>document.querySelectorAll('details[open]').forEach(d=>{if(!d.contains(e.target))d.open=false}));
const title=document.getElementById('welcome-title');
if(!paused&&!entered){const words='Welcome to\nthe laboratory.';title.setAttribute('aria-label',words.replace('\n',' '));title.innerHTML='<span class="typing-space" aria-hidden="true">Welcome to<br>the laboratory.</span><span class="typed" aria-hidden="true"></span>';let n=0;const typed=title.querySelector('.typed');setTimeout(function tick(){typed.textContent=words.slice(0,++n);if(n<words.length)setTimeout(tick,43)},500);}
