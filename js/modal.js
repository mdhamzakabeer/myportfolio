'use strict';

export function initModal() {
    const projectCards = document.querySelectorAll('.project-card');
    const modal = document.getElementById('project-modal');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const modalLinks = document.getElementById('modal-links');
    const modalClose = document.querySelector('.modal-close');

    const projectData = [
        {
            title: 'E-Commerce Platform',
            description: 'A responsive e-commerce website built using React, Tailwind CSS, and Firebase for real-time data management. Features include user authentication, product filtering, and a secure checkout system.',
            image: 'https://via.placeholder.com/300x200',
            links: [
                { text: 'Live Demo', url: 'https://example.com/demo1' },
                { text: 'GitHub', url: 'https://github.com/yourprofile/project1' }
            ]
        },
        {
            title: 'Portfolio Website',
            description: 'A modern portfolio site showcasing my work, built with vanilla JavaScript and Tailwind CSS. Optimized for performance and accessibility across all devices.',
            image: 'https://via.placeholder.com/300x200',
            links: [
                { text: 'Live Demo', url: 'https://example.com/demo2' },
                { text: 'GitHub', url: 'https://github.com/yourprofile/project2' }
            ]
        },
        {
            title: 'UI/UX Prototype',
            description: 'A high-fidelity UI/UX design prototype created with Figma for a mobile app concept. Focused on user experience and interactive design elements.',
            image: 'https://via.placeholder.com/300x200',
            links: [
                { text: 'View Figma', url: 'https://www.figma.com/proto/yourprototype' }
            ]
        }
    ];

    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const projectId = card.dataset.project - 1;
            const project = projectData[projectId];
            modalImage.src = project.image;
            modalTitle.textContent = project.title;
            modalDescription.textContent = project.description;
            modalLinks.innerHTML = project.links.map(link => `<a href="${link.url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 hover:underline">${link.text}</a>`).join('');
            modal.style.display = 'flex';
        });
    });

    modalClose.addEventListener('click', () => modal.style.display = 'none');
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.style.display = 'none';
    });
}