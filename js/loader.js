'use strict';

export function initLoader() {
  window.addEventListener('load', () => {
    const loader = document.querySelector('.loader-wrapper');
    document.body.classList.add('visible'); // Show page & enable scroll

    setTimeout(() => {
      loader.classList.add('hidden');
      setTimeout(() => {
        loader.style.display = 'none';
      }, 500);
    }, 1500);
  });
}
