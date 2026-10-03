const intro=document.querySelector('.intro');
const explorer=document.querySelector('.explorer');
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const toggle=document.getElementById('motion');
let paused=reduced;
function updateMotion(){document.body.classList.toggle('paused',paused);toggle.textContent=paused?'Resume motion':'Pause motion';toggle.setAttribute('aria-pressed',String(paused));}
updateMotion();toggle.addEventListener('click',()=>{paused=!paused;updateMotion()});
function showField(focus=false){if(!intro)return;intro.hidden=true;explorer.hidden=false;document.querySelector('.boot-curtain')?.remove();if(focus)document.getElementById('explore-title').focus();}
if(intro){if(location.hash==='#microscope')showField();document.getElementById('enter').addEventListener('click',e=>{e.preventDefault();document.body.classList.add('zooming');setTimeout(()=>{history.replaceState(null,'','#microscope');showField(true);document.body.classList.remove('zooming')},reduced?0:650)});window.addEventListener('hashchange',()=>{if(location.hash==='#microscope')showField();});}
for(const container of document.querySelectorAll('.particles')){for(let i=0;i<25;i++){const p=document.createElement('i');p.className='particle';p.style.cssText=`left:${(i*47)%100}%;top:${(i*29)%100}%;animation-delay:-${i%14}s`;container.append(p)}}
let navigating=false;
document.querySelectorAll('.object').forEach(a=>a.addEventListener('click',e=>{if(e.ctrlKey||e.metaKey||e.shiftKey||e.altKey)return;e.preventDefault();if(navigating)return;navigating=true;const field=document.querySelector('.field');field.style.transformOrigin=`${a.offsetLeft+a.offsetWidth/2}px ${a.offsetTop+a.offsetHeight/2}px`;document.body.classList.add('zooming');setTimeout(()=>{location.href=a.href},reduced?0:650)}));
window.addEventListener('pageshow',()=>{navigating=false;document.body.classList.remove('zooming')});
document.addEventListener('keydown',e=>{if(e.key==='Escape')document.querySelectorAll('details[open]').forEach(d=>d.open=false)});
document.addEventListener('click',e=>{document.querySelectorAll('details[open]').forEach(d=>{if(!d.contains(e.target))d.open=false})});
// Keep the complete heading available to assistive technology while it types visually.
const welcome=document.getElementById('welcome-title');
if(welcome && !reduced && !intro.hidden){
 const words='Welcome to\nthe laboratory.';welcome.setAttribute('aria-label',words.replace('\n',' '));
 welcome.innerHTML='<span class="typing-space" aria-hidden="true">Welcome to<br>the laboratory.</span><span class="typed" aria-hidden="true"></span>';
 const typed=welcome.querySelector('.typed');let n=0;
 setTimeout(function tick(){typed.textContent=words.slice(0,++n);if(n<words.length)setTimeout(tick,43)},500);
}
