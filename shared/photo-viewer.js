/* One same-page viewer for teaching photographs and illustrations. */
(() => {
  'use strict';
  const candidates = 'main figure img[alt], main .wc-card-image img[alt], main .bc-case-img img[alt], main .parasite-card img[alt], main .wc-stage-photo img[alt], main .micrograph-image img[alt], main .portrait-image, main .scene > img[alt], main .signal > img[alt]';
  const entries = new Map();
  const imageFile = /\.(?:avif|gif|jpe?g|png|svg|webp)$/i;
  let dialog, stage, image, caption, status, count, zoomIn, zoomOut, previous, next;
  let gallery = [], current = 0, opener, oldOverflow = '', baseWidth = 0, scale = 1, ready = false;

  function isImageLink(link) {
    return link && imageFile.test(new URL(link.href, document.baseURI).pathname)
      && new URL(link.href, document.baseURI).origin === location.origin;
  }
  function cleanCaption(element) {
    const copy = element.cloneNode(true);
    copy.querySelectorAll('.photo-hint, button').forEach(node => node.remove());
    copy.querySelectorAll('a[href]').forEach(link => { if (isImageLink(link)) link.remove(); });
    return copy;
  }
  function captionFor(photo) {
    const figure = photo.closest('figure');
    const figureCaption = figure?.querySelector('figcaption');
    if (figureCaption) return cleanCaption(figureCaption);
    const credit = photo.closest('.flip-back')?.querySelector('.photo-credit')
      || photo.closest('.wc-card')?.querySelector('.wc-card-credit');
    if (!credit) return null;
    const result = document.createElement('div');
    const description = document.createElement('p');
    description.textContent = photo.alt;
    result.append(description, cleanCaption(credit));
    return result;
  }
  function visible(photo) {
    return photo.isConnected && photo.getClientRects().length > 0
      && !photo.closest('[hidden], [inert], [aria-hidden="true"]')
      && getComputedStyle(photo).visibility !== 'hidden';
  }
  function createViewer() {
    if (dialog) return;
    dialog = document.createElement('dialog');
    dialog.className = 'photo-viewer';
    dialog.setAttribute('aria-labelledby', 'photo-viewer-title');
    dialog.innerHTML = '<div class="photo-viewer-header"><h2 id="photo-viewer-title">Photo viewer</h2><button type="button" data-photo-close autofocus>Close ✕</button></div><div class="photo-viewer-tools"><div class="photo-viewer-sequence"><button type="button" data-photo-prev aria-label="Previous photo">← Previous</button><span data-photo-count></span><button type="button" data-photo-next aria-label="Next photo">Next →</button></div><div class="photo-viewer-zoom"><button type="button" data-photo-out>Zoom out</button><button type="button" data-photo-fit>Fit to screen</button><button type="button" data-photo-in>Zoom in</button></div></div><div class="photo-viewer-stage" tabindex="0" aria-label="Enlarged image. When zoomed, scroll or swipe to explore."><div class="photo-viewer-canvas"><img alt="" draggable="false"></div></div><div class="photo-viewer-notes"><div class="photo-viewer-caption"></div><p class="photo-viewer-status" role="status" aria-live="polite"></p></div>';
    document.body.append(dialog);
    stage = dialog.querySelector('.photo-viewer-stage');
    image = stage.querySelector('img');
    caption = dialog.querySelector('.photo-viewer-caption');
    status = dialog.querySelector('.photo-viewer-status');
    count = dialog.querySelector('[data-photo-count]');
    zoomIn = dialog.querySelector('[data-photo-in]');
    zoomOut = dialog.querySelector('[data-photo-out]');
    previous = dialog.querySelector('[data-photo-prev]');
    next = dialog.querySelector('[data-photo-next]');
    dialog.querySelector('[data-photo-close]').addEventListener('click', () => dialog.close());
    dialog.querySelector('[data-photo-fit]').addEventListener('click', fit);
    zoomIn.addEventListener('click', () => resize(Math.min(4, scale * 1.5)));
    zoomOut.addEventListener('click', () => resize(Math.max(1, scale / 1.5)));
    previous.addEventListener('click', () => show(current - 1));
    next.addEventListener('click', () => show(current + 1));
    image.addEventListener('load', loaded);
    image.addEventListener('error', () => {
      ready = false;
      image.hidden = true;
      zoomIn.disabled = zoomOut.disabled = true;
      status.textContent = 'This image could not load. Close the viewer and try again.';
    });
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
    });
    // Keep presentation shortcuts from moving the lesson behind an open image.
    dialog.addEventListener('keydown', event => event.stopPropagation());
    dialog.addEventListener('close', () => {
      document.body.style.overflow = oldOverflow;
      document.dispatchEvent(new CustomEvent('photo-viewer:change', {detail: {open: false}}));
      if (opener?.isConnected) opener.focus({preventScroll: true});
    });
    window.addEventListener('resize', () => { if (dialog.open) fit(); });
  }
  function qualityNote() {
    const enlarged = baseWidth * scale > image.naturalWidth * 1.4;
    status.textContent = enlarged ? 'This image is enlarged beyond its original size and may look softer.' : 'Escape closes the viewer. Scroll or swipe to explore when zoomed.';
  }
  function resize(value, keepCenter = true) {
    if (!ready) return;
    const oldWidth = baseWidth * scale;
    const centerX = (stage.scrollLeft + stage.clientWidth / 2) / Math.max(oldWidth, stage.clientWidth);
    const centerY = (stage.scrollTop + stage.clientHeight / 2) / Math.max(oldWidth * image.naturalHeight / image.naturalWidth, stage.clientHeight);
    scale = value;
    const width = baseWidth * scale;
    image.style.width = `${width}px`;
    zoomIn.disabled = scale >= 4;
    zoomOut.disabled = scale <= 1;
    stage.scrollLeft = keepCenter ? centerX * Math.max(width, stage.clientWidth) - stage.clientWidth / 2 : 0;
    stage.scrollTop = keepCenter ? centerY * Math.max(width * image.naturalHeight / image.naturalWidth, stage.clientHeight) - stage.clientHeight / 2 : 0;
    qualityNote();
  }
  function fit() {
    if (!ready) return;
    baseWidth = Math.max(1, Math.min(stage.clientWidth - 24, (stage.clientHeight - 24) * image.naturalWidth / image.naturalHeight));
    resize(1, false);
  }
  function loaded() {
    if (!dialog.open || !image.naturalWidth) return;
    ready = true;
    image.hidden = false;
    fit();
  }
  function show(index) {
    current = Math.max(0, Math.min(index, gallery.length - 1));
    const entry = gallery[current];
    ready = false;
    image.hidden = true;
    image.removeAttribute('style');
    image.alt = entry.photo?.alt || entry.label;
    caption.replaceChildren();
    const credit = entry.photo && captionFor(entry.photo);
    if (credit) [...credit.childNodes].forEach(node => caption.append(node, document.createTextNode(' ')));
    else caption.textContent = image.alt;
    count.textContent = `${current + 1} / ${gallery.length}`;
    previous.disabled = current === 0;
    next.disabled = current === gallery.length - 1;
    dialog.querySelector('.photo-viewer-sequence').hidden = gallery.length < 2;
    zoomIn.disabled = zoomOut.disabled = true;
    status.textContent = 'Loading image…';
    image.src = entry.source;
    if (image.complete && image.naturalWidth) loaded();
  }
  function open(entry, trigger) {
    createViewer();
    opener = trigger;
    gallery = [...entries.values()].filter(item => visible(item.photo));
    if (!gallery.includes(entry)) gallery = [entry];
    oldOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.dispatchEvent(new CustomEvent('photo-viewer:change', {detail: {open: true}}));
    dialog.showModal();
    show(gallery.indexOf(entry));
  }
  function activate(event, entry, trigger) {
    event.preventDefault();
    event.stopPropagation();
    open(entry, trigger);
  }
  function prepare(photo) {
    if (!photo.alt?.trim() || entries.has(photo) || photo.closest('.photo-viewer')) return;
    const anchor = photo.closest('a[href]');
    const entry = {photo, source: isImageLink(anchor) ? anchor.href : photo.currentSrc || photo.src};
    entries.set(photo, entry);
    photo.dataset.photoReady = '';
    photo.title = 'Click to enlarge';
    const label = `Enlarge image: ${photo.alt}`;
    if (isImageLink(anchor)) {
      anchor.removeAttribute('target');
      anchor.setAttribute('aria-haspopup', 'dialog');
      anchor.setAttribute('aria-label', label);
      anchor.addEventListener('click', event => activate(event, entry, anchor));
    } else if (anchor) {
      // Keep the card's lesson link and give the image a separate keyboard control.
      const frame = document.createElement('div');
      frame.className = 'photo-card-preview';
      anchor.before(frame);
      frame.append(anchor);
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'photo-card-enlarge';
      button.textContent = '⤢';
      button.title = 'Enlarge image';
      button.setAttribute('aria-label', label);
      button.setAttribute('aria-haspopup', 'dialog');
      frame.append(button);
      button.addEventListener('click', event => activate(event, entry, button));
      photo.addEventListener('click', event => activate(event, entry, button));
    } else {
      photo.tabIndex = 0;
      photo.setAttribute('role', 'button');
      photo.setAttribute('aria-label', label);
      photo.setAttribute('aria-haspopup', 'dialog');
      photo.addEventListener('click', event => activate(event, entry, photo));
      photo.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') activate(event, entry, photo);
      });
    }
    const figure = photo.closest('figure');
    const credit = figure?.querySelector('figcaption');
    if (credit && !credit.querySelector('.photo-hint')) {
      const hint = document.createElement('span');
      hint.className = 'photo-hint';
      hint.textContent = '⤢ Click image to enlarge';
      credit.prepend(hint);
    }
  }
  function scan(root = document) {
    if (root.matches?.(candidates)) prepare(root);
    root.querySelectorAll?.(candidates).forEach(prepare);
  }
  scan();
  // Portraits and archive records can appear after the initial page load.
  new MutationObserver(changes => {
    for (const [photo] of entries) if (!photo.isConnected) entries.delete(photo);
    changes.forEach(change => change.addedNodes.forEach(node => { if (node.nodeType === 1 && !node.closest('.photo-viewer')) scan(node); }));
  }).observe(document.body, {childList: true, subtree: true});
  document.querySelectorAll('[data-open-slide]').forEach(button => {
    button.hidden = false;
    button.setAttribute('aria-haspopup', 'dialog');
    button.addEventListener('click', event => {
      const source = new URL(button.dataset.openSlide, document.baseURI).href;
      const entry = [...entries.values()].find(item => item.source === source)
        || {source, label: button.dataset.slideAlt || button.dataset.slideTitle || 'Photograph'};
      activate(event, entry, button);
    });
  });
  // Text-only full-image links use the same viewer, too.
  document.addEventListener('click', event => {
    const link = event.target.closest('a[href]');
    if (!isImageLink(link) || link.closest('.photo-viewer')) return;
    const entry = [...entries.values()].find(item => item.source === link.href)
      || {source: link.href, label: link.textContent.trim() || 'Image'};
    activate(event, entry, link);
  });
})();
