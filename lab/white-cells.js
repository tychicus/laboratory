(() => {
  'use strict';
  // All content is server-readable. Enhance with manual, keyboard-operable steps;
  // never autoplay a biological timeline or imply that these are the same cell.
  document.querySelectorAll('[data-maturation]').forEach(lesson => {
    const buttons = [...lesson.querySelectorAll('[data-stage]')];
    const panels = [...lesson.querySelectorAll('[data-panel]')];
    if (!buttons.length || buttons.length !== panels.length) return;
    const prev = lesson.querySelector('[data-prev]');
    const next = lesson.querySelector('[data-next]');
    const counter = lesson.querySelector('[data-stage-counter]');
    const live = lesson.querySelector('[data-stage-live]');
    let current = 0;
    function select(index, announce = true) {
      current = Math.max(0, Math.min(index, panels.length - 1));
      buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === current)));
      panels.forEach((panel, i) => { panel.hidden = i !== current; });
      prev.disabled = current === 0;
      next.textContent = current === panels.length - 1 ? 'Start again ↻' : 'Next stage →';
      counter.textContent = `${current + 1} / ${panels.length}`;
      if (announce) live.textContent = `Stage ${current + 1} of ${panels.length}. ${panels[current].querySelector('h3').textContent}. ${panels[current].querySelector('p').textContent}`;
    }
    buttons.forEach((button, i) => button.addEventListener('click', () => select(i)));
    prev.addEventListener('click', () => select(current - 1));
    next.addEventListener('click', () => select((current + 1) % panels.length));
    lesson.querySelector('[data-stage-buttons]').hidden = false;
    lesson.querySelector('[data-stage-controls]').hidden = false;
    select(0, false);
  });
})();
