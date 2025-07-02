'use strict';

export function initLoader() {
    // Ensure content is hidden initially
    document.body.classList.remove('loaded');

    document.addEventListener('DOMContentLoaded', () => {
        const loaderWrapper = document.querySelector('.loader-wrapper');
        if (loaderWrapper) {
            setTimeout(() => {
                loaderWrapper.classList.add('hidden');
                setTimeout(() => {
                    loaderWrapper.style.display = 'none';
                    document.body.classList.add('loaded'); // Show content
                }, 500); // Matches CSS transition duration
            }, 1000); // 1-second delay for faster mobile experience
        } else {
            document.body.classList.add('loaded'); // Show content if no loader
        }
    });
}