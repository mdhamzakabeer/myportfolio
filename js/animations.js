'use strict';

export function initAnimations() {
    const skillItems = document.querySelectorAll('.skill-item');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const timelineSection = document.getElementById('about');
    let timelineAnimated = false;

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                    const bar = entry.target.querySelector('.skill-bar-fill');
                    const width = bar.getAttribute('class').match(/w-\[(\d+%)\]/)[1];
                    bar.style.width = '0';
                    requestAnimationFrame(() => {
                        bar.style.width = width;
                    });
                }, index * 200);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    skillItems.forEach(item => skillsObserver.observe(item));

function animateTimeline() {
    if (timelineAnimated) return;
    const sectionTop = timelineSection.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight * 0.8) {
        setTimeout(() => { // Yeh outer setTimeout add karo
            timelineItems.forEach((item, index) => {
                setTimeout(() => {
                    item.classList.add('visible');
                }, index * 300);
            });
            timelineAnimated = true;
        }, 100); // 100ms ka delay
    }
}

    window.addEventListener('scroll', animateTimeline);
    window.addEventListener('load', animateTimeline);
}