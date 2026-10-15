'use strict';
(() => {
  const scientists = window.SCIENTISTS;
  const sky = document.getElementById('sky');
  const pauseButton = document.getElementById('pause');
  const credits = document.getElementById('credits');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reducedMotion.matches;
  let items = [];
  let frameId = 0;
  let lastTime = null;
  let nextKind = 'portrait';
  let resizeTimer;
  let refillElapsed = 0;
  const bags = {portrait: [], quotation: []};

  function random(min, max) { return min + Math.random() * (max - min); }
  function shuffled(values) {
    const result = [...values];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }
  // Each bag visits every scientist before repeating. Never duplicate a visible item.
  function nextScientist(kind) {
    const visible = new Set(items.filter(item => item.kind === kind).map(item => item.person.id));
    if (!bags[kind].length) bags[kind] = shuffled(scientists);
    let index = bags[kind].findIndex(person => !visible.has(person.id));
    if (index < 0) return null;
    return bags[kind].splice(index, 1)[0];
  }
  function capacity() {
    const width = sky.clientWidth, height = sky.clientHeight;
    if (width < 440 && height < 330) return 1;
    if (width < 600 || height < 340) return 2;
    return width * height > 750000 ? 5 : 4;
  }
  function overlaps(a, b) {
    const gap = sky.clientWidth < 600 ? 15 : 28;
    return a.x < b.x + b.width + gap && a.x + a.width + gap > b.x &&
      a.y < b.y + b.height + gap && a.y + a.height + gap > b.y;
  }
  function findPosition(width, height) {
    const padding = 12;
    // Small screens keep two randomized zones so both a face and a quote fit.
    // Positions still vary within each zone, and the zones trade roles.
    if (capacity() === 2) {
      const stacked = sky.clientWidth < 600 && sky.clientHeight >= 330;
      const cells = stacked
        ? [{x:0,y:0,width:sky.clientWidth,height:sky.clientHeight/2}, {x:0,y:sky.clientHeight/2,width:sky.clientWidth,height:sky.clientHeight/2}]
        : [{x:0,y:0,width:sky.clientWidth/2,height:sky.clientHeight}, {x:sky.clientWidth/2,y:0,width:sky.clientWidth/2,height:sky.clientHeight}];
      for (const cell of shuffled(cells)) {
        if (width + padding * 2 > cell.width || height + padding * 2 > cell.height) continue;
        const rect = {x:random(cell.x+padding,cell.x+cell.width-width-padding),y:random(cell.y+padding,cell.y+cell.height-height-padding),width,height};
        if (items.every(item => !overlaps(rect, item.rect))) return rect;
      }
      return null;
    }
    const maxX = sky.clientWidth - width - padding;
    const maxY = sky.clientHeight - height - padding;
    if (maxX < padding || maxY < padding) return null;
    // Random placements have breathing room; content never obscures another item.
    for (let attempt = 0; attempt < 120; attempt++) {
      const rect = {x: random(padding, maxX), y: random(padding, maxY), width, height};
      if (items.every(item => !overlaps(rect, item.rect))) return rect;
    }
    return null;
  }
  function createItem(kind, delay = 0) {
    const person = nextScientist(kind);
    if (!person) return false;
    const figure = document.createElement('figure');
    figure.className = `mote ${kind}`;
    const short = sky.clientHeight < 450;
    const narrow = sky.clientWidth < 600;
    const width = kind === 'portrait'
      ? (short ? random(100, 120) : narrow ? random(130, 160) : random(160, 205))
      : Math.min(sky.clientWidth - 36, capacity() === 2 && !narrow ? sky.clientWidth / 2 - 40 : Infinity, short ? 260 : narrow ? 285 : random(290, 365));
    figure.style.width = `${width}px`;
    if (kind === 'portrait') {
      const img = document.createElement('img');
      img.src = person.image;
      img.alt = `Portrait of ${person.name}`;
      img.width = 400;
      img.height = 500;
      img.decoding = 'async';
      if (person.position) img.style.objectPosition = person.position;
      figure.append(img);
    } else {
      const quote = document.createElement('blockquote');
      quote.textContent = person.quote;
      figure.append(quote);
    }
    const caption = document.createElement('figcaption');
    caption.textContent = person.name;
    figure.append(caption);
    sky.append(figure);
    const height = figure.getBoundingClientRect().height;
    const rect = findPosition(width, height);
    if (!rect) {
      figure.remove();
      bags[kind].push(person);
      return false;
    }
    figure.style.left = `${rect.x}px`;
    figure.style.top = `${rect.y}px`;
    const fade = 2400;
    const item = {element:figure, kind, person, rect, fade, age: paused ? fade : -delay, duration:random(17500, 24000)};
    items.push(item);
    paint(item);
    return true;
  }
  function fillScene(stagger = false) {
    let attempts = 0;
    while (items.length < capacity() && attempts < 14) {
      const kind = items.length && !items.some(item => item.kind === 'quotation') ? 'quotation'
        : items.length && !items.some(item => item.kind === 'portrait') ? 'portrait' : nextKind;
      if (createItem(kind, stagger ? items.length * 850 : 0)) nextKind = kind === 'portrait' ? 'quotation' : 'portrait';
      attempts++;
    }
  }
  function paint(item) {
    const opacity = Math.max(0, Math.min(1, item.age / item.fade, (item.duration - item.age) / item.fade));
    item.element.style.opacity = String(opacity);
    // Faded-out content is excluded from the accessibility tree.
    item.element.setAttribute('aria-hidden', String(opacity < 0.1));
  }
  function isRunning() { return !paused && !document.hidden && !credits.open; }
  function frame(time) {
    frameId = 0;
    if (!isRunning()) { lastTime = null; return; }
    const delta = lastTime === null ? 0 : Math.min(time - lastTime, 100);
    lastTime = time;
    refillElapsed += delta;
    items = items.filter(item => {
      item.age += delta;
      if (item.age >= item.duration) { item.element.remove(); return false; }
      paint(item);
      return true;
    });
    // Replace completed items immediately at a new random location.
    if (items.length < capacity() && refillElapsed > 1600) { fillScene(); refillElapsed = 0; }
    frameId = requestAnimationFrame(frame);
  }
  function syncMotion() {
    pauseButton.textContent = paused ? 'Resume' : 'Pause';
    pauseButton.setAttribute('aria-pressed', String(paused));
    pauseButton.setAttribute('aria-label', paused ? 'Resume fading portraits and quotations' : 'Pause fading portraits and quotations');
    if (frameId) cancelAnimationFrame(frameId);
    frameId = 0;
    lastTime = null;
    if (isRunning()) frameId = requestAnimationFrame(frame);
  }
  function arrange() {
    for (const item of items) item.element.remove();
    items = [];
    sky.classList.toggle('compact', sky.clientHeight < 450);
    nextKind = Math.random() < 0.5 ? 'portrait' : 'quotation';
    fillScene(!paused);
    syncMotion();
  }
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    if (paused) { for (const item of items) { item.age = Math.max(item.fade, Math.min(item.age, item.duration - item.fade)); paint(item); } }
    syncMotion();
  });
  document.getElementById('shuffle').addEventListener('click', arrange);
  reducedMotion.addEventListener('change', event => {
    paused = event.matches;
    if (paused) { for (const item of items) { item.age = item.fade; paint(item); } }
    syncMotion();
  });
  document.addEventListener('visibilitychange', syncMotion);
  document.getElementById('sources').addEventListener('click', () => { credits.showModal(); syncMotion(); });
  document.getElementById('close-credits').addEventListener('click', () => credits.close());
  credits.addEventListener('close', syncMotion);
  credits.addEventListener('click', event => { if (event.target === credits) {
    const rect = credits.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) credits.close();
  }});
  const list = document.getElementById('source-list');
  for (const person of scientists) {
    const section = document.createElement('section');
    section.className = 'source-entry';
    const name = document.createElement('h3'); name.textContent = person.name;
    const quotation = document.createElement('blockquote'); quotation.textContent = `“${person.quote}”`;
    const quoteCredit = document.createElement('p');
    const quoteLink = document.createElement('a'); quoteLink.href = person.source; quoteLink.textContent = person.sourceLabel; quoteLink.target = '_blank'; quoteLink.rel = 'noopener noreferrer';
    quoteCredit.append('Quotation: ', quoteLink);
    const imageCredit = document.createElement('p');
    const imageLink = document.createElement('a'); imageLink.href = person.imageSource; imageLink.textContent = person.imageCredit; imageLink.target = '_blank'; imageLink.rel = 'noopener noreferrer';
    imageCredit.append('Portrait: ', imageLink);
    section.append(name, quotation, quoteCredit, imageCredit);
    list.append(section);
  }
  // Decode portraits early so the first fade does not wait for a network request.
  for (const person of scientists) { const image = new Image(); image.src = person.image; }
  let lastSize = '';
  new ResizeObserver(() => {
    const size = `${sky.clientWidth}x${sky.clientHeight}`;
    if (size === lastSize) return;
    lastSize = size;
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(arrange, 120);
  }).observe(sky);
  arrange();
})();
