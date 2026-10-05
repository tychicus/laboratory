(() => {
  // Manual teaching stages: no autoplay, simulated patient data, or real growth rates.
  const dna = document.querySelector('[data-dna-lesson]');
  if (dna) {
    const tabs = [...dna.querySelectorAll('[data-dna-stage]')];
    const panels = [...dna.querySelectorAll('[data-dna-panel]')];
    const sizes = [[1, 1], [2, 2], [4, 8], [4, 16]];
    const population = (target, number, altered) => {
      target.replaceChildren(...Array.from({length:number}, () => {
        const cell = document.createElement('span');
        cell.className = 'bc-cell' + (altered ? ' altered' : '');
        cell.setAttribute('aria-hidden', 'true');
        return cell;
      }));
    };
    let current = 0;
    function select(index, announce = true) {
      current = index;
      tabs.forEach((b, i) => b.setAttribute('aria-pressed', String(i === index)));
      panels.forEach((p, i) => p.hidden = i !== index);
      population(dna.querySelector('[data-normal-population]'), sizes[index][0], false);
      population(dna.querySelector('[data-altered-population]'), sizes[index][1], true);
      dna.querySelector('[data-dna-prev]').disabled = index === 0;
      dna.querySelector('[data-dna-next]').textContent = index === 3 ? 'Restart lesson ↻' : 'Next stage →';
      if (announce) dna.querySelector('[data-dna-live]').textContent = `Stage ${index + 1} of 4. ${tabs[index].textContent}. ${panels[index].querySelector('p').textContent}`;
    }
    tabs.forEach((button, index) => button.addEventListener('click', () => select(index)));
    dna.querySelector('[data-dna-prev]').addEventListener('click', () => select(Math.max(0, current - 1)));
    dna.querySelector('[data-dna-next]').addEventListener('click', () => select((current + 1) % 4));
    dna.querySelector('[data-dna-controls]').hidden = false;
    select(0, false);
  }
  const count = document.querySelector('[data-count-lesson]');
  if (count) {
    const buttons = [...count.querySelectorAll('[data-count-value]')];
    const dots = count.querySelector('[data-count-dots]');
    const values = {
      7000: ['Within this example range', 'A count of 7,000 WBCs/µL falls within the adult interval used here. The cell types and the rest of the CBC still matter.'],
      21000: ['Higher than this example range', '21,000 WBCs/µL is three times this demonstration’s baseline. Infection, inflammation, medicines, and blood disorders are among the possibilities.'],
      70000: ['Much higher — investigate the cause', '70,000 WBCs/µL is ten times this demonstration’s baseline. A markedly high count requires evaluation; the number alone cannot identify a leukemia or distinguish every reactive process.']
    };
    dots.replaceChildren(...Array.from({length:70}, () => { const dot=document.createElement('i'); dot.className='bc-dot'; return dot; }));
    function select(value, announce = true) {
      count.querySelector('[data-count-number]').textContent = value.toLocaleString('en-US');
      count.querySelector('[data-count-meter]').style.width = `${value / 700}%`;
      count.querySelector('[data-count-heading]').textContent = values[value][0];
      count.querySelector('[data-count-copy]').textContent = values[value][1];
      [...dots.children].forEach((dot, i) => dot.classList.toggle('on', i < value / 1000));
      buttons.forEach(button => button.setAttribute('aria-pressed', String(Number(button.dataset.countValue) === value)));
      if (announce) count.querySelector('[data-count-live]').textContent = `${value.toLocaleString('en-US')} white blood cells per microliter. ${values[value][0]}.`;
    }
    buttons.forEach(button => button.addEventListener('click', () => select(Number(button.dataset.countValue))));
    count.querySelector('[data-count-buttons]').hidden = false;
    select(7000, false);
  }
  const dialog = document.querySelector('.bc-lightbox');
  if (dialog) {
    let opener;
    document.querySelectorAll('[data-open-slide]').forEach(button => {
      button.hidden = false;
      button.addEventListener('click', () => {
        opener=button;
        dialog.querySelector('img').src = button.dataset.openSlide;
        dialog.querySelector('img').alt = button.dataset.slideAlt;
        dialog.querySelector('h2').textContent = button.dataset.slideTitle;
        dialog.querySelector('a').href = button.dataset.openSlide;
        dialog.showModal();
      });
    });
    dialog.querySelector('[data-close-slide]').addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', event => { if (event.target === dialog) { const r=dialog.getBoundingClientRect(); if (event.clientX<r.left || event.clientX>r.right || event.clientY<r.top || event.clientY>r.bottom) dialog.close(); } });
    dialog.addEventListener('close', () => opener?.focus());
  }
})();
