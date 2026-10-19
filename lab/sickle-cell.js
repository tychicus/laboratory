/* Without JavaScript, every section remains readable. */
(() => {
  const story = document.querySelector('.sickle-story');
  if (!story) return;
  const sections = [...story.querySelectorAll('.sc-slide')];
  const tabs = story.querySelector('.sc-tabs');
  const buttons = [...tabs.querySelectorAll('[data-section]')];

  function select(index, scroll = false) {
    sections.forEach((section, i) => { section.hidden = i !== index; });
    buttons.forEach((button, i) => {
      button.setAttribute('aria-selected', String(i === index));
      button.tabIndex = i === index ? 0 : -1;
    });
    if (scroll) tabs.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  tabs.setAttribute('role', 'tablist');
  buttons.forEach((button, index) => {
    button.setAttribute('role', 'tab');
    button.setAttribute('aria-controls', sections[index].id);
    sections[index].setAttribute('role', 'tabpanel');
    sections[index].setAttribute('aria-labelledby', button.id);
    sections[index].tabIndex = 0;
    button.addEventListener('click', () => select(index, true));
    button.addEventListener('keydown', event => {
      if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
      let target;
      if (event.key === 'ArrowRight') target = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft') target = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') target = 0;
      else if (event.key === 'End') target = buttons.length - 1;
      else return;
      event.preventDefault();
      select(target, true);
      buttons[target].focus({ preventScroll: true });
    });
  });
  select(0);
  tabs.hidden = false;
})();
