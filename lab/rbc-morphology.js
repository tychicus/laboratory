/* Links remain ordinary full-image links when JavaScript is unavailable. */
(() => {
  const links = [...document.querySelectorAll('[data-smear]')];
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'rm-viewer';
  dialog.setAttribute('aria-labelledby', 'rm-viewer-title');
  dialog.innerHTML = `<div class="rm-viewer-bar"><h2 id="rm-viewer-title"></h2><button type="button" data-close autofocus>Close ×</button></div><div class="rm-viewer-tools"><button type="button" data-prev>← Previous</button><button type="button" data-zoom aria-pressed="false">Zoom in</button><button type="button" data-next>Next →</button></div><div class="rm-viewer-stage"><img alt=""></div><div class="rm-viewer-caption"></div><p class="rm-viewer-note">Use Zoom in, then scroll or swipe to explore. Escape closes the viewer.</p>`;
  document.body.append(dialog);
  const stage = dialog.querySelector('.rm-viewer-stage');
  const image = stage.querySelector('img');
  const zoom = dialog.querySelector('[data-zoom]');
  let current = 0, opener;
  function resetZoom() {
    stage.classList.remove('rm-zoomed');
    zoom.setAttribute('aria-pressed', 'false');
    zoom.textContent = 'Zoom in';
    stage.scrollTo(0, 0);
  }
  function show(index) {
    current = (index + links.length) % links.length;
    const link = links[current];
    resetZoom();
    image.src = link.href;
    image.alt = link.querySelector('img').alt;
    dialog.querySelector('h2').textContent = link.dataset.title;
    // Copy our authored caption so the original credit stays with the photograph.
    const caption = dialog.querySelector('.rm-viewer-caption');
    caption.replaceChildren(...[...link.closest('figure').querySelector('figcaption').childNodes].map(n => n.cloneNode(true)));
    dialog.scrollTop = 0;
  }
  links.forEach((link, index) => {
    link.setAttribute('aria-haspopup', 'dialog');
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault(); opener = link; show(index);
      dialog.showModal(); document.body.classList.add('rm-modal-open');
    });
  });
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-prev]').addEventListener('click', () => show(current - 1));
  dialog.querySelector('[data-next]').addEventListener('click', () => show(current + 1));
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const controls = [...dialog.querySelectorAll('button, a[href]')].filter(e => !e.hidden && e.getClientRects().length);
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  for (const control of dialog.querySelectorAll('[data-prev],[data-next]')) control.hidden = links.length < 2;
  zoom.addEventListener('click', () => {
    const enlarged = stage.classList.toggle('rm-zoomed');
    zoom.setAttribute('aria-pressed', String(enlarged)); zoom.textContent = enlarged ? 'Fit photograph' : 'Zoom in';
    stage.scrollTo(0, 0);
  });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const r = dialog.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close(); } });
  dialog.addEventListener('close', () => { document.body.classList.remove('rm-modal-open'); resetZoom(); opener?.focus(); });
})();
