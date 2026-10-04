(() => {
  'use strict';
  document.querySelectorAll('.virus-flip').forEach(card => {
    const button = card.querySelector('.flip-toggle');
    const front = card.querySelector('.flip-front');
    const back = card.querySelector('.flip-back');
    const text = button.querySelector('.flip-button-text');
    const photo = back.querySelector('img');
    const name = card.dataset.name;
    function setSide(showPhoto) {
      card.classList.toggle('is-flipped', showPhoto);
      front.inert = showPhoto;
      back.inert = !showPhoto;
      front.setAttribute('aria-hidden', String(showPhoto));
      back.setAttribute('aria-hidden', String(!showPhoto));
      button.setAttribute('aria-pressed', String(showPhoto));
      button.setAttribute('aria-label', showPhoto ? `Show illustration of ${name}` : `Show electron microscope photo of ${name}`);
      text.textContent = showPhoto ? 'Flip to illustration' : 'Flip to real image';
      if (showPhoto) photo.loading = 'eager';
    }
    setSide(false);
    card.classList.add('flip-ready');
    button.hidden = false;
    button.addEventListener('click', () => setSide(!card.classList.contains('is-flipped')));
    card.addEventListener('click', event => {
      if (event.target.closest('a,button') || window.getSelection()?.toString()) return;
      button.click();
    });
    card.addEventListener('keydown', event => {
      if (event.key === 'Escape' && card.classList.contains('is-flipped')) {
        setSide(false);
        button.focus();
      }
    });
    photo.addEventListener('error', () => {
      if (back.querySelector('.photo-error')) return;
      const note = document.createElement('p');
      note.className = 'photo-error';
      note.textContent = 'The image could not load. Use Image source below to see the original.';
      photo.after(note);
    });
  });
})();
