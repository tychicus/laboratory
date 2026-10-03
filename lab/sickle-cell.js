/* Progressive enhancement: without JavaScript, every section remains readable. */
(() => {
  const story = document.querySelector('.sickle-story');
  if (!story) return;
  const slides = [...story.querySelectorAll('.sc-slide')];
  const controls = story.querySelector('.sc-controls');
  const prev = controls.querySelector('[data-prev]');
  const next = controls.querySelector('[data-next]');
  const overview = controls.querySelector('[data-overview]');
  let current = 0, showAll = false;
  function render(focus = false) {
    slides.forEach((slide, i) => { slide.hidden = !showAll && i !== current; });
    prev.disabled = showAll || current === 0;
    next.disabled = showAll || current === slides.length - 1;
    controls.querySelector('.sc-progress').textContent = showAll ? 'All sections' : `${current + 1} / ${slides.length}`;
    overview.textContent = showAll ? 'Present' : 'Show all';
    overview.setAttribute('aria-pressed', String(showAll));
    if (focus) {
      slides[current].querySelector('h1, h2').focus({preventScroll: true});
      controls.scrollIntoView({block:'start', behavior:'instant'});
    }
  }
  function advance(delta) {
    const target = Math.max(0, Math.min(slides.length - 1, current + delta));
    if (target === current || showAll) return;
    current = target; render(true);
  }
  prev.addEventListener('click', () => advance(-1));
  next.addEventListener('click', () => advance(1));
  overview.addEventListener('click', () => { showAll = !showAll; render(true); });
  document.addEventListener('keydown', e => {
    if (showAll || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || e.target.closest('a,button,summary,input,textarea,select,[contenteditable]')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); advance(e.key === 'ArrowRight' ? 1 : -1); }
  });
  controls.hidden = false; render();
})();
