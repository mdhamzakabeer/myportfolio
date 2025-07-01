'use strict';

// Signature hover effect
const initSignature = () => {
    const signature = document.querySelector('.signature');
    if (signature) {
        signature.style.color = '#2563eb'; // Initial blue color
        signature.addEventListener('mouseover', () => {
            signature.style.color = '#2563eb';
        });
        signature.addEventListener('mouseout', () => {
            signature.style.color = document.documentElement.classList.contains('dark') ? '#ffffff' : '#2c3e50';
        });
    }
};

export { initSignature };