'use strict';

export function initLoader() {
    window.addEventListener('load', () => {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        if (loaderWrapper) {
            // 👇 Show the page (scroll + visibility)
            document.documentElement.style.visibility = 'visible';
            document.body.style.visibility = 'visible';
            document.body.style.overflow = 'auto'; // ✅ scroll allow again

            // 👇 Fade out the loader
            setTimeout(() => {
                loaderWrapper.classList.add('hidden');
                setTimeout(() => {
                    loaderWrapper.style.display = 'none';
                }, 500); // matches CSS transition
            }, 1000); // at least show loader for 0.5s
        }
    });
}
