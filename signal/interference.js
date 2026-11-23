(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const layer = document.createElement('div');
  layer.className = 'tracking-static';
  layer.setAttribute('aria-hidden', 'true');
  const noise = document.createElement('canvas');
  noise.width = 240;
  noise.height = 150;
  const ctx = noise.getContext('2d');
  if (!ctx) return;
  const pixels = ctx.createImageData(noise.width, noise.height);
  const portrait = new Image();
  portrait.src = 'assets/interference.jpg';
  layer.append(noise, portrait);
  let timer, frame, target;
  const enabled = () => !document.hidden && !reduced.matches && !document.body.classList.contains('no-effects');
  function schedule() {
    clearTimeout(timer);
    cancelAnimationFrame(frame);
    target?.classList.remove('tracking-torn');
    layer.remove();
    if (enabled()) timer = setTimeout(burst, 60000 + Math.random() * 120000);
  }
  function burst() {
    if (!enabled()) return;
    target = Array.from(document.querySelectorAll('dialog[open]')).pop()
      || document.getElementById(document.getElementById('frame').hidden ? 'network' : 'frame');
    target ||= document.querySelector('main:not([hidden])');
    const dialog = target?.closest('dialog');
    (dialog || document.body).append(layer);
    target?.classList.add('tracking-torn');
    const start = performance.now();
    function draw(now) {
      const elapsed = now - start;
      if (elapsed >= 420 || !enabled()) return schedule();
      for (let i = 0; i < pixels.data.length; i += 4) {
        const v = Math.random() * 175;
        pixels.data[i] = v;
        pixels.data[i + 1] = v * .91;
        pixels.data[i + 2] = v * .65;
        pixels.data[i + 3] = 255;
      }
      ctx.putImageData(pixels, 0, 0);
      portrait.style.opacity = elapsed >= 155 && elapsed < 230 ? '.21' : '0';
      frame = requestAnimationFrame(draw);
    }
    draw(start);
  }
  new MutationObserver(schedule).observe(document.body, {attributes:true, attributeFilter:['class']});
  reduced.addEventListener('change', schedule);
  document.addEventListener('visibilitychange', schedule);
  schedule();
})();

