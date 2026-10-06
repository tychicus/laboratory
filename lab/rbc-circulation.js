(() => {
  const svg = document.querySelector('.staged-circulation');
  if (!svg) return;
  const buttons = [...document.querySelectorAll('[data-select-stage]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const routes = [...svg.querySelectorAll('.stage-route')];
  const titles = ['Body → heart', 'Heart → lungs', 'Lungs → heart', 'Heart → body'];
  const descriptions = ['Oxygen-poor blood returns from the body through the venae cavae to the right heart.', 'Oxygen-poor blood leaves the right ventricle through the pulmonary arteries to both lungs.', 'Oxygen-rich blood returns from both lungs through the pulmonary veins to the left heart.', 'Oxygen-rich blood leaves the left ventricle through the aorta toward the head and the rest of the body.'];
  let selected = 0, elapsed = 0, last = null;
  const arrows = [...svg.querySelectorAll('.vessel-arrow')].map(arrow => {
    const route = svg.querySelector(`#${arrow.dataset.route}`);
    return {arrow, route, length: route.getTotalLength(), stage: Number(arrow.dataset.stage), phase: Number(arrow.dataset.phase)};
  });
  function draw() {
    for (const {arrow, route, length, stage, phase} of arrows) {
      if (stage !== selected) continue;
      const distance = ((elapsed / 6500 + phase) % 1) * length;
      const point = route.getPointAtLength(distance);
      const before = route.getPointAtLength(Math.max(0, distance - 1));
      const after = route.getPointAtLength(Math.min(length, distance + 1));
      const angle = Math.atan2(after.y - before.y, after.x - before.x) * 180 / Math.PI;
      arrow.setAttribute('transform', `translate(${point.x} ${point.y}) rotate(${angle})`);
      arrow.setAttribute('visibility', 'visible');
    }
  }
  function select(index, announce = true) {
    selected = index; elapsed = 0;
    buttons.forEach((button, i) => button.setAttribute('aria-pressed', String(i === index)));
    panels.forEach((panel, i) => { panel.hidden = i !== index; });
    routes.forEach((route, i) => { route.style.display = i === index ? '' : 'none'; });
    svg.querySelector('#flow-desc').textContent = `Stage ${index + 1}: ${descriptions[index]}`;
    document.querySelector('[data-stage-prev]').disabled = index === 0;
    document.querySelector('[data-stage-next]').textContent = index === 3 ? 'Start again ↻' : `Next: ${titles[index + 1].toLowerCase()} →`;
    if (announce) document.querySelector('.stage-announcement').textContent = `Stage ${index + 1} of 4. ${titles[index]}.`;
    draw();
  }
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => select(index));
    button.addEventListener('keydown', event => {
      if (!['ArrowRight','ArrowLeft','Home','End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? 3 : (index + (event.key === 'ArrowRight' ? 1 : 3)) % 4;
      select(next); buttons[next].focus();
    });
  });
  document.querySelector('[data-stage-prev]').addEventListener('click', () => select(Math.max(0, selected - 1)));
  document.querySelector('[data-stage-next]').addEventListener('click', () => select((selected + 1) % 4));
  document.querySelector('.stage-controls').hidden = false;
  document.querySelector('.stage-next').hidden = false;
  select(0, false);
  function tick(now) {
    if (last !== null && !document.hidden && !document.body.classList.contains('paused')) {
      elapsed += Math.min(now - last, 80); draw();
    }
    last = now; requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();
