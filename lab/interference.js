/* Brief, silent visual interference. Never replaces text or targets controls. */
(() => {
  const preference = matchMedia('(prefers-reduced-motion: reduce)');
  let timer, active, selected, last;
  const blocked = () => preference.matches || document.hidden || document.body.classList.contains('paused');
  const interactive = 'a,button,summary,input,select,textarea,[contenteditable],nav,[role="button"]';
  const patterns = [
    [{filter:'none',translate:'0px',textShadow:'none'},{offset:.3,filter:'blur(.7px)',translate:'2px',textShadow:'-2px 0 #ff79cd, 2px 0 #7fffee'},{offset:.55,filter:'none',translate:'-1px',textShadow:'1px 0 #7fffee'},{filter:'none',translate:'0px',textShadow:'none'}],
    [{filter:'none',translate:'0px'},{offset:.35,filter:'blur(1px)',translate:'-2px'},{offset:.6,filter:'blur(.3px)',translate:'1px'},{filter:'none',translate:'0px'}],
    [{filter:'none',textShadow:'none'},{offset:.25,filter:'blur(.4px)',textShadow:'3px 0 #ff79cd, -2px 0 #7fffee'},{offset:.65,filter:'none',textShadow:'-1px 0 #ff79cd, 1px 0 #7fffee'},{filter:'none',textShadow:'none'}]
  ];
  function eligible(el) {
    if (el.closest('.comic-glitch')) return false;
    if (el.closest('[hidden],[inert],'+interactive) || el.querySelector(interactive) || el.contains(document.activeElement) || el.matches(':hover') || el.closest('.welcome-layer') && document.body.classList.contains('welcome-dismissed')) return false;
    const box = el.getBoundingClientRect(), style = getComputedStyle(el);
    return box.width > 0 && box.height > 0 && box.top >= 0 && box.bottom <= innerHeight && box.right > 0 && box.left < innerWidth && style.visibility === 'visible' && Number(style.opacity) > .1;
  }
  function clearEffect() {
    if (active) active.cancel();
    if (selected) selected.classList.remove('signal-anomaly');
    active = selected = null;
  }
  function schedule() {
    clearTimeout(timer);
    if (!blocked()) timer = setTimeout(run, 20000 + Math.random() * 10000);
  }
  function run() {
    if (blocked()) return;
    let choices = [...document.querySelectorAll('h1,h2,h3,.eyebrow,.sc-comic,.sc-takeaway')].filter(eligible);
    if (choices.length > 1) choices = choices.filter(el => el !== last);
    if (choices.length && typeof choices[0].animate === 'function') {
      selected = choices[Math.floor(Math.random() * choices.length)];
      last = selected;
      selected.classList.add('signal-anomaly');
      active = selected.animate(patterns[Math.floor(Math.random() * patterns.length)], {duration:550 + Math.random()*350, easing:'steps(2,end)', iterations:1});
      active.onfinish = clearEffect;
    }
    schedule();
  }
  function sync() { clearEffect(); schedule(); }
  preference.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  new MutationObserver(sync).observe(document.body, {attributes:true,attributeFilter:['class']});
  // Stop immediately if the audience or presenter starts interacting with it.
  for (const event of ['pointerdown','pointerover','focusin']) document.addEventListener(event, e => {
    if (selected && selected.contains(e.target)) clearEffect();
  }, {passive:true});
  window.addEventListener('pagehide', () => {clearTimeout(timer);clearEffect();});
  window.addEventListener('pageshow', sync);
  schedule();
})();
