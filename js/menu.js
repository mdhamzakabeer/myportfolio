'use strict';

export function initMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuLinks = mobileMenu ? mobileMenu.querySelectorAll('a') : [];

    function closeMobileMenu() {
        if (menuToggle) menuToggle.classList.remove('open');
        if (mobileMenu) {
            mobileMenu.classList.remove('opacity-100', 'scale-100', 'pointer-events-auto');
            mobileMenu.classList.add('opacity-0', 'scale-95', 'pointer-events-none');
        }
    }

    if (menuToggle) {
        menuToggle.addEventListener('click', (event) => {
            event.stopPropagation();
            menuToggle.classList.toggle('open');
            if (mobileMenu) {
                if (mobileMenu.classList.contains('opacity-0')) {
                    mobileMenu.classList.remove('opacity-0', 'scale-95', 'pointer-events-none');
                    mobileMenu.classList.add('opacity-100', 'scale-100', 'pointer-events-auto');
                } else {
                    closeMobileMenu();
                }
            }
        });
    }

    document.body.addEventListener('click', (event) => {
        if (menuToggle && mobileMenu && !menuToggle.contains(event.target) && !mobileMenu.contains(event.target) && mobileMenu.classList.contains('opacity-100')) {
            closeMobileMenu();
        }
    });

    mobileMenuLinks.forEach(link => link.addEventListener('click', closeMobileMenu));
}