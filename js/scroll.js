'use strict';

export function initScroll() {
    const scrollProgressBar = document.querySelector('.scroll-progress-bar');
    const backToTop = document.getElementById('back-to-top');
    const headerTextElements = document.querySelectorAll(
        '#desktop-header .signature, #mobile-top-header .signature, #mobile-bottom-nav .signature'
    );
    const scrollThreshold = 50;

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const updateScroll = debounce(() => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        scrollProgressBar.style.width = `${scrollPercent}%`;

        const isDarkMode = document.documentElement.classList.contains('dark');
        const desktopHeader = document.getElementById('desktop-header');
        const mobileTopHeader = document.getElementById('mobile-top-header');
        const mobileBottomNav = document.getElementById('mobile-bottom-nav');

        if (scrollTop > scrollThreshold) {
            backToTop.classList.add('visible');
            desktopHeader?.classList.add('header-scrolled');
            mobileTopHeader?.classList.add('header-scrolled');
            mobileBottomNav?.classList.add('header-scrolled');
            headerTextElements.forEach(element => {
                element.style.color = isDarkMode ? '#ffffff' : '#000000';
            });
        } else {
            backToTop.classList.remove('visible');
            desktopHeader?.classList.remove('header-scrolled');
            mobileTopHeader?.classList.remove('header-scrolled');
            mobileBottomNav?.classList.remove('header-scrolled');
            headerTextElements.forEach(element => {
                element.style.color = '#2563eb';
            });
        }
    }, 10);

    window.addEventListener('scroll', updateScroll);
}