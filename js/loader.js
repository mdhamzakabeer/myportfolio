'use strict';

export function initLoader() {
    window.addEventListener('load', () => {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        if (loaderWrapper) {
            setTimeout(() => {
                loaderWrapper.classList.add('hidden');
                setTimeout(() => {
                    loaderWrapper.style.display = 'none';

                    // 🔥 Reveal the page after loader
                    document.body.style.visibility = 'visible';
                    document.body.style.overflow = 'auto';
                }, 500); // Match CSS transition duration
            }, 1000); // Optional delay for branding feel
        }
    });
}
