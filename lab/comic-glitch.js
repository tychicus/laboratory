/* Decorative copies keep the original lettering readable by assistive technology. */
(() => {
  document.querySelectorAll('.sc-comic, .sc-number, .field-heading h1').forEach(label => {
    label.classList.add('comic-glitch');
    const text = label.textContent;
    for (const layer of ['cyan', 'pink']) {
      const copy = document.createElement('span');
      copy.className = `comic-glitch-copy comic-glitch-${layer}`;
      copy.setAttribute('aria-hidden', 'true');
      copy.textContent = text;
      label.append(copy);
    }
  });
})();
