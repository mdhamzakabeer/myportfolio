'use strict';

import { initTheme } from './theme.js';
import { initMenu } from './menu.js';
import { initScroll } from './scroll.js';
import { initAnimations } from './animations.js';
import { initModal } from './modal.js';
import { initNavigation } from './navigation.js';
import { initTestimonials } from './testimonials.js';
import { initSignature } from './signature.js';
// import { initLoader } from './loader.js';

// Initialize all modules
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initMenu();
    initScroll();
    initAnimations();
    initModal();
    initNavigation();
    initTestimonials();
    initSignature();
    // initLoader();
});