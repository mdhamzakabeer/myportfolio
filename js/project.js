// Theme toggle functionality
const themeToggleDesktop = document.getElementById('theme-toggle-desktop');
const themeToggleMobile = document.getElementById('theme-toggle-mobile');
const themeIconDesktop = document.getElementById('theme-icon-desktop');
const themeIconMobile = document.getElementById('theme-icon-mobile');


// Theme toggle functionality
function setTheme(isDarkMode) {
    const signature = document.querySelector('.signature');
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        if (themeIconDesktop) themeIconDesktop.classList.replace('fa-moon', 'fa-sun');
        if (themeIconMobile) themeIconMobile.classList.replace('fa-moon', 'fa-sun');
        signature.style.color = '#2563eb'; // Default blue in dark mode
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        if (themeIconDesktop) themeIconDesktop.classList.replace('fa-sun', 'fa-moon');
        if (themeIconMobile) themeIconMobile.classList.replace('fa-sun', 'fa-moon');
        signature.style.color = '#2563eb'; // Default blue in light mode
        localStorage.setItem('theme', 'light');
    }
}
const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
    setTheme(true);
} else {
    setTheme(false);
}

if (themeToggleDesktop) {
    themeToggleDesktop.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
}
if (themeToggleMobile) {
    themeToggleMobile.addEventListener('click', () => setTheme(!document.documentElement.classList.contains('dark')));
}

// Mobile menu toggle
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

// Scroll progress and back-to-top
const scrollProgressBar = document.querySelector('.scroll-progress-bar');
const backToTop = document.getElementById('back-to-top');
const scrollThreshold = 50;

// Header text elements (excluding nav links)
const headerTextElements = document.querySelectorAll(
    '#desktop-header .signature, #mobile-top-header .signature, #mobile-bottom-nav .signature'
);

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    scrollProgressBar.style.width = `${scrollPercent}%`;

    const isDarkMode = document.documentElement.classList.contains('dark');

    if (scrollTop > scrollThreshold) {
        backToTop.classList.add('visible');
        document.getElementById('desktop-header')?.classList.add('header-scrolled');
        document.getElementById('mobile-top-header')?.classList.add('header-scrolled');
        document.getElementById('mobile-bottom-nav')?.classList.add('header-scrolled');

        // Change header text color (excluding nav links) based on theme when scrolled
        headerTextElements.forEach((element) => {
            element.style.color = isDarkMode ? '#ffffff' : '#000000';
        });
    } else {
        backToTop.classList.remove('visible');
        document.getElementById('desktop-header')?.classList.remove('header-scrolled');
        document.getElementById('mobile-top-header')?.classList.remove('header-scrolled');
        document.getElementById('mobile-bottom-nav')?.classList.remove('header-scrolled');

        // Reset header text color when not scrolled
        headerTextElements.forEach((element) => {
            element.style.color = '#2563eb'; // Default blue color
        });
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const signature = document.querySelector('.signature');
    signature.addEventListener('mouseover', () => {
        signature.style.color = '#2563eb'; // Blue on hover
    });
    signature.addEventListener('mouseout', () => {
        if (document.documentElement.classList.contains('dark')) {
            signature.style.color = '#ffffff'; // White in dark theme
        } else {
            signature.style.color = '#2c3e50'; // Black in light theme
        }
    });

    // Set initial color to blue on page load
    signature.style.color = '#2563eb';
});