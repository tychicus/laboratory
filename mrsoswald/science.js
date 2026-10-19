'use strict';
(() => {
  const scientists = window.SCIENTISTS;
  const sky = document.getElementById('sky');
  const credits = document.getElementById('credits');
  const FADE_MS = 1000;
  const CYCLE_MS = 5000; // One second in, three seconds to read, one second out.
  let bag = [];
  let current = null;
  let frameId = 0;
  let lastTime = null;
  let viewingPhoto = false;
  const quotePositions = new Map();

  function shuffled(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  function quotations(person) {
    return person.quotes || [{text: person.quote, source: person.source, sourceLabel: person.sourceLabel}];
  }
  function nextPerson() {
    // Visit every scientist before repeating; avoid a repeat at the bag boundary.
    if (!bag.length) {
      bag = shuffled(scientists);
      if (bag.length > 1 && bag[0].id === current?.person.id) [bag[0], bag[1]] = [bag[1], bag[0]];
    }
    return bag.shift();
  }
  function showNext() {
    const person = nextPerson();
    const quotes = quotations(person);
    const position = quotePositions.get(person.id) || 0;
    const quote = quotes[position % quotes.length];
    quotePositions.set(person.id, position + 1);
    const figure = document.createElement('figure');
    figure.className = 'scientist-pair';
    figure.dataset.scientist = person.id;
    const image = document.createElement('img');
    image.className = 'portrait-image';
    image.src = person.image;
    image.alt = `Portrait of ${person.name}`;
    image.width = 400;
    image.height = 500;
    image.decoding = 'async';
    if (person.position) image.style.objectPosition = person.position;
    const caption = document.createElement('figcaption');
    const blockquote = document.createElement('blockquote');
    blockquote.textContent = quote.text;
    const name = document.createElement('cite');
    name.textContent = person.name;
    caption.append(blockquote, name);
    figure.append(image, caption);
    if (current) current.element.remove();
    sky.append(figure);
    current = {person, quote, element:figure, age: 0};
    paint();
    // Only the matching portrait and quote share this fade; neither rotates alone.
    if (bag.length) { const upcoming = new Image(); upcoming.src = bag[0].image; }
  }
  function paint() {
    if (!current) return;
    const opacity = Math.max(0, Math.min(1, current.age / FADE_MS, (CYCLE_MS - current.age) / FADE_MS));
    current.element.style.opacity = String(opacity);
    current.element.setAttribute('aria-hidden', String(opacity < 0.1));
  }
  function isRunning() { return !document.hidden && !viewingPhoto; }
  function frame(time) {
    frameId = 0;
    if (!isRunning()) { lastTime = null; return; }
    const delta = lastTime === null ? 0 : Math.min(time - lastTime, 100);
    lastTime = time;
    current.age += delta;
    if (current.age >= CYCLE_MS) showNext();
    else paint();
    frameId = requestAnimationFrame(frame);
  }
  function syncMotion() {
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = null;
    if (isRunning()) frameId = requestAnimationFrame(frame);
  }
  document.getElementById('shuffle').addEventListener('click', () => { showNext(); syncMotion(); });
  document.addEventListener('visibilitychange', syncMotion);
  document.addEventListener('photo-viewer:change', event => {
    viewingPhoto = event.detail.open;
    if (viewingPhoto && current) { current.age = FADE_MS; paint(); }
    syncMotion();
  });
  document.getElementById('sources').addEventListener('click', () => { credits.showModal(); });
  document.getElementById('close-credits').addEventListener('click', () => credits.close());
  credits.addEventListener('click', event => {
    if (event.target !== credits) return;
    const rect = credits.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) credits.close();
  });
  function link(url, label) {
    const anchor = document.createElement('a');
    anchor.href = url; anchor.textContent = label;
    anchor.target = '_blank'; anchor.rel = 'noopener noreferrer';
    return anchor;
  }
  const list = document.getElementById('source-list');
  for (const person of scientists) {
    const section = document.createElement('section');
    section.className = 'source-entry';
    const name = document.createElement('h3'); name.textContent = person.name;
    section.append(name);
    for (const quote of quotations(person)) {
      const words = document.createElement('blockquote'); words.textContent = `“${quote.text}”`;
      const credit = document.createElement('p');
      credit.append('Quotation: ', link(quote.source, quote.sourceLabel));
      section.append(words, credit);
    }
    const imageCredit = document.createElement('p');
    imageCredit.append('Portrait: ', link(person.imageSource, person.imageCredit));
    if (person.imageLicense) imageCredit.append(' · ', link(person.imageLicense, 'License'));
    imageCredit.append(' · Resized for display.');
    section.append(imageCredit);
    list.append(section);
  }
  // Local, credited assets only. No unmoderated quote feed or remote image dependency.
  showNext();
  syncMotion();
})();
