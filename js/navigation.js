'use strict';

export function initNavigation() {
    const desktopNavLinks = document.querySelectorAll('.desktop-nav-item');
    const mobileNavLinks = document.querySelectorAll('.nav-link-icon');

    function setActiveLink(links, clickedLink) {
        links.forEach(link => link.classList.remove('active'));
        clickedLink.classList.add('active');
    }

    function handleNavClick(e, links, link) {
        e.preventDefault();
        setActiveLink(links, link);
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        } else {
            window.location.href = link.getAttribute('href');
        }
    }

    desktopNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, desktopNavLinks, link));
    });

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => handleNavClick(e, mobileNavLinks, link));
    });
}