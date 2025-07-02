'use strict';

export function initLoader() {
    window.addEventListener('load', () => {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        if (loaderWrapper) {
            setTimeout(() => {
                loaderWrapper.classList.add('hidden');
                setTimeout(() => {
                    loaderWrapper.style.display = 'none';
                }, 500); // Matches CSS transition duration
            }, 1000); // 2-second delay before hiding loader
        }
    });
}