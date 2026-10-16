/* Enlarge specimen photographs without leaving the lesson. */
(() => {
  const links = [...document.querySelectorAll('.specimen-photo > a')].filter(a => a.querySelector('img'));
  if (!links.length || typeof HTMLDialogElement === 'undefined') return;
  const dialog = document.createElement('dialog');
  dialog.className = 'parasite-viewer';
  dialog.setAttribute('aria-label', 'Enlarged specimen photograph');
  dialog.innerHTML = '<div class="pv-tools"><strong>Specimen photograph</strong><button type="button" data-zoom>Zoom in</button><button type="button" data-fit>Fit to screen</button><button type="button" data-close autofocus>Close ✕</button></div><div class="pv-stage"><img alt=""></div><p class="pv-caption"></p><p class="pv-quality"></p>';
  document.body.append(dialog);
  const image = dialog.querySelector('img');
  const stage = dialog.querySelector('.pv-stage');
  const caption = dialog.querySelector('.pv-caption');
  const quality = dialog.querySelector('.pv-quality');
  const zoomButton = dialog.querySelector('[data-zoom]');
  let origin, savedOverflow, baseWidth = 0, zoom = 1;
  function fit() {
    if (!image.naturalWidth) return;
    baseWidth = Math.min(stage.clientWidth - 24, stage.clientHeight * image.naturalWidth / image.naturalHeight - 24, image.naturalWidth * 2);
    zoom = 1;
    size();
  }
  function size() {
    image.style.width = `${Math.max(1, baseWidth * zoom)}px`;
    zoomButton.disabled = zoom >= 3;
    stage.scrollTop = stage.scrollLeft = 0;
  }
  function loaded() {
    quality.textContent = `Original: ${image.naturalWidth} × ${image.naturalHeight} pixels.${image.naturalWidth < 700 ? ' This small source image may look softer when enlarged.' : ''}`;
    fit();
  }
  image.addEventListener('load', loaded);
  image.addEventListener('error', () => { quality.textContent = 'This photograph could not load. Close the viewer and try again.'; });
  links.forEach(link => {
    const thumb = link.querySelector('img');
    link.removeAttribute('target');
    link.setAttribute('aria-haspopup', 'dialog');
    link.setAttribute('aria-label', `Enlarge photograph: ${thumb.alt}`);
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      origin = link;
      savedOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      image.removeAttribute('style');
      image.alt = thumb.alt;
      caption.textContent = link.closest('figure').querySelector('figcaption')?.textContent || thumb.alt;
      quality.textContent = 'Loading photograph…';
      zoomButton.disabled = true;
      dialog.showModal();
      image.src = link.href;
      if (image.complete && image.naturalWidth) loaded();
    });
  });
  dialog.querySelector('[data-close]').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-fit]').addEventListener('click', fit);
  zoomButton.addEventListener('click', () => { zoom = Math.min(3, zoom * 1.5); size(); });
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  dialog.addEventListener('close', () => { document.body.style.overflow = savedOverflow; origin?.focus({preventScroll:true}); });
  window.addEventListener('resize', () => { if (dialog.open) fit(); });
})();
