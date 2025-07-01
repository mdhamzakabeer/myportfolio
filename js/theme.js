'use strict';

export function initTheme() {
    const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
    const themeToggleMobile = document.getElementById('theme-toggle-mobile');
    const themeIconDesktop = document.getElementById('theme-icon-desktop');
    const themeIconMobile = document.getElementById('theme-icon-mobile');
    const signature = document.querySelector('.signature');

    function setTheme(isDarkMode) {
        if (isDarkMode) {
            document.documentElement.classList.add('dark');
            if (themeIconDesktop) themeIconDesktop.classList.replace('fa-moon', 'fa-sun');
            if (themeIconMobile) themeIconMobile.classList.replace('fa-moon', 'fa-sun');
            signature.style.color = '#2563eb';
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            if (themeIconDesktop) themeIconDesktop.classList.replace('fa-sun', 'fa-moon');
            if (themeIconMobile) themeIconMobile.classList.replace('fa-sun', 'fa-moon');
            signature.style.color = '#2563eb';
            localStorage.setItem('theme', 'light');
        }
    }

    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme');
    setTheme(savedTheme === 'dark' || (!savedTheme && prefersDarkMode));

    if (themeToggleDesktop) {
        themeToggleDesktop.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
    }
    if (themeToggleMobile) {
        themeToggleMobile.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
    }
}