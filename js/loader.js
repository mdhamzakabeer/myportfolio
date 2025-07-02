export function initLoader() {
  window.addEventListener('load', () => {
    const loaderWrapper = document.querySelector('.loader-wrapper');
    if (loaderWrapper) {
      // 👇 First show loader and make content visible
      document.body.style.visibility = 'visible';
      document.body.style.overflow = 'auto';

      // 👇 Now fade loader out smoothly
      setTimeout(() => {
        loaderWrapper.classList.add('hidden');
        setTimeout(() => {
          loaderWrapper.style.display = 'none';
        }, 500); // Match transition time
      }, 1000); // Show loader for 0.5s minimum
    }
  });
}
