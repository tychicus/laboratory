/* One familiar hero per laboratory page, in a new safe document-flow spot. */
(() => {
  const main = document.querySelector('main');
  if (!main) return;
  const oldHeroes = [...document.querySelectorAll('img[src*="assets/hero-"]')];
  const homeSlot = document.querySelector('.home-hero-slot');
  const pose = Math.floor(Math.random()*9);
  const alignment = ['start','center','end'][Math.floor(Math.random()*3)];
  const slot = homeSlot || document.createElement('div');
  slot.classList.add('lab-hero-visit');
  slot.dataset.alignment = alignment;
  slot.setAttribute('aria-hidden','true');
  slot.title = 'Your laboratory sidekick';
  const hero = document.createElement('img');
  hero.src = `assets/hero-${pose}.webp`;
  hero.alt = ''; hero.className = 'science-hero'; hero.width = 72; hero.height = 90;

  // Preserve existing static mascots if the new asset cannot load.
  hero.addEventListener('load', () => {
    oldHeroes.forEach(img => {
      const wrapper=img.closest('.hero-spot');
      img.remove();
      if(wrapper && !wrapper.textContent.trim() && !wrapper.children.length) wrapper.remove();
    });
    slot.replaceChildren(hero);
    if (!homeSlot) {
      // Only boundaries between main blocks; never inside controls, a slide,
      // a diagram, a table or a text paragraph. Normal flow reserves its space.
      const blocks = [...main.children].filter(el =>
        /^(SECTION|ARTICLE|ASIDE|FOOTER|DIV)$/.test(el.tagName) &&
        !el.hidden && !el.matches('[inert],.sc-controls')
      );
      if (blocks.length) {
        const target=blocks[Math.floor(Math.random()*blocks.length)];
        target.before(slot);
      } else main.append(slot);
    }
  }, {once:true});
})();
