import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, query, orderBy, where, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

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

// Skills animation with Intersection Observer
const skillItems = document.querySelectorAll('.skill-item');
const skillsObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
                const bar = entry.target.querySelector('.skill-bar-fill');
                const width = bar.getAttribute('class').match(/w-\[(\d+%)\]/)[1];
                bar.style.width = '0';
                setTimeout(() => bar.style.width = width, 100);
            }, index * 200);
            observer.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.3
});

skillItems.forEach(item => {
    skillsObserver.observe(item);
});

// Timeline animation
const timelineItems = document.querySelectorAll('.timeline-item');
const timelineSection = document.getElementById('about');
let timelineAnimated = false;

function animateTimeline() {
    if (timelineAnimated) return;
    const sectionTop = timelineSection.getBoundingClientRect().top;
    if (sectionTop < window.innerHeight * 0.8) {
        timelineItems.forEach((item, index) => {
            setTimeout(() => {
                item.classList.add('visible');
            }, index * 300);
        });
        timelineAnimated = true;
    }
}

window.addEventListener('scroll', animateTimeline);
window.addEventListener('load', animateTimeline);

// Project modal
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

// Navigation link activation with smooth scroll
const desktopNavLinks = document.querySelectorAll('.desktop-nav-item');
const mobileNavLinks = document.querySelectorAll('.nav-link-icon');

function setActiveLink(links, clickedLink) {
    links.forEach(link => link.classList.remove('active'));
    clickedLink.classList.add('active');
}

desktopNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(desktopNavLinks, link);
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
    });
});

mobileNavLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(mobileNavLinks, link);
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
    });
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

// Testimonials functionality
const form = document.getElementById('testimonial-form');
const testimonialsContainer = document.getElementById('testimonials-container');
const authStatus = document.getElementById('auth-status');
const formContainer = document.getElementById('testimonial-form-container');
let currentUser = null;
let currentUserReviewId = null;


onAuthStateChanged(auth, (user) => {
    currentUser = user;
    if (user) {
        document.getElementById('name').value = user.displayName || 'Anonymous';
        authStatus.innerHTML = `
             <div class="auth-card flex items-center justify-center space-x-4 p-2 rounded-lg shadow-sm">
                <span class="text-grey-700 font-medium">WELCOME, ${user.displayName}</span>
                <button id="logout-btn" class="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition duration-200">Logout</button>
            </div>
        `;
        formContainer.style.display = 'block';
        document.getElementById('logout-btn').addEventListener('click', () => auth.signOut());
        checkExistingReview(user.uid).then(existingReview => {
            if (existingReview) {
                document.getElementById('title').value = existingReview.title;
                document.getElementById('review').value = existingReview.review;
                const ratingInput = document.querySelector(`input[name="rating"][value="${existingReview.rating}"]`);
                if (ratingInput) {
                    ratingInput.checked = true;
                    updateStars({ target: ratingInput });
                }
            }
        });
    } else {
        authStatus.innerHTML = `
            <div class="auth-card flex items-center justify-center space-x-4 p-2 rounded-lg shadow-sm">
                <span class="text-red-700 font-medium">Please log in</span>
                <button id="login-btn" class="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600 transition duration-200 flex items-center">
                    <i class="fab fa-google mr-1"></i> Login with Google
                </button>
            </div>
        `;
        formContainer.style.display = 'none';
        document.getElementById('login-btn').addEventListener('click', () => {
            const provider = new GoogleAuthProvider();
            signInWithPopup(auth, provider);
        });
    }
    fetchTestimonials();
});
// Update star visuals on click
function updateStars(event) {
    const selectedValue = event.target.value;
    const stars = document.querySelectorAll('.rating-container i');
    stars.forEach((star, index) => {
        if (index < selectedValue) {
            star.classList.remove('text-gray-300', 'dark:text-gray-600');
            star.classList.add('text-yellow-400');
        } else {
            star.classList.remove('text-yellow-400');
            star.classList.add('text-gray-300', 'dark:text-gray-600');
        }
    });
}

// Add event listeners to rating stars
document.querySelectorAll('.rating-container input').forEach(input => {
    input.addEventListener('change', updateStars);
});

// Validation function
function validateForm(name, title, review, rating) {
    let hasError = false;

    // Name validation (handled by auth, so skip length check)
    if (!name) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Name is required.',
            confirmButtonColor: '#3b82f6',
        });
        hasError = true;
        return false;
    }

    // Title/Company validation
    if (!title || title.length < 3 || title.length > 25) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Title/Company must be between 3 and 25 characters.',
            confirmButtonColor: '#3b82f6',
        });
        hasError = true;
        return false;
    }

    // Review validation (min 6 chars, max 30 words)
    const wordCount = review.trim().split(/\s+/).length;
    const charCount = review.trim().length;
    if (!review || charCount < 6 || wordCount > 30) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Review must be at least 6 characters and no more than 30 words.',
            confirmButtonColor: '#3b82f6',
        });
        hasError = true;
        return false;
    }

    // Rating validation
    if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please select a rating between 1 and 5 stars.',
            confirmButtonColor: '#3b82f6',
        });
        hasError = true;
        return false;
    }

    return !hasError;
}

// Generate star rating HTML for display
function generateStarRating(rating) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        stars += `<i class="fas fa-star ${i <= rating ? '' : 'empty'}"></i>`;
    }
    return stars;
}

// Fetch and display testimonials
async function fetchTestimonials() {
    testimonialsContainer.innerHTML = '<div class="col-span-full text-center"><i class="fas fa-spinner fa-spin text-blue-600 text-3xl"></i></div>';
    try {
        const q = query(collection(db, 'testimonials'), orderBy('timestamp', 'desc'));
        const querySnapshot = await getDocs(q);
        testimonialsContainer.innerHTML = '';
        if (querySnapshot.empty) {
            testimonialsContainer.innerHTML = '<p class="col-span-full text-center text-gray-500 dark:text-gray-400">No testimonials yet. Be the first to share!</p>';
        } else {
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                const avatar = data.photoURL ? `<img src="${data.photoURL}" alt="${data.name} avatar" class="avatar w-20 h-20 rounded-full object-cover">` : `<div class="avatar">${data.name.split(' ').map(n => n[0]).join('').toUpperCase()}</div>`;
                const testimonialCard = `
                    <div class="testimonial-card animate-slideIn">
                        ${avatar}
                        <div class="star-display">${generateStarRating(data.rating)}</div>
                        <p class="review-text">"${data.review}"</p>
                        <p class="name-title">${data.name}<span>, ${data.title}</span></p>
                    </div>
                `;
                testimonialsContainer.innerHTML += testimonialCard;
            });
        }
    } catch (error) {
        console.error('Error fetching testimonials:', error);
        testimonialsContainer.innerHTML = '<p class="col-span-full text-center text-red-500">Failed to load testimonials. Please try again later.</p>';
    }
}

// Check if user already submitted a review
async function checkExistingReview(uid) {
    const q = query(collection(db, 'testimonials'), where('uid', '==', uid));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        currentUserReviewId = querySnapshot.docs[0].id;
        return querySnapshot.docs[0].data();
    }
    return null;
}

// Form submission handler
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!currentUser) {
        Swal.fire({
            icon: 'error',
            title: 'Authentication Required',
            text: 'Please log in to submit a review.',
            confirmButtonColor: '#3b82f6',
        });
        return;
    }

    const title = document.getElementById('title').value.trim();
    const review = document.getElementById('review').value.trim();
    const rating = document.querySelector('input[name="rating"]:checked')?.value;

    // Check if all fields are empty
    if (!title && !review && !rating) {
        Swal.fire({
            icon: 'warning',
            title: 'Incomplete Form',
            text: 'Please fill all fields to submit your review.',
            confirmButtonColor: '#3b82f6',
        });
        return;
    }

    if (validateForm(currentUser.displayName, title, review, rating)) {
        try {
            if (await checkExistingReview(currentUser.uid)) {
                // Update existing review
                const reviewRef = doc(db, 'testimonials', currentUserReviewId);
                await updateDoc(reviewRef, {
                    title,
                    review,
                    rating: parseInt(rating),
                    timestamp: new Date()
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Success!',
                    text: 'Your review has been updated.',
                    confirmButtonColor: '#3b82f6',
                });
            } else {
                // Create new review
                await addDoc(collection(db, 'testimonials'), {
                    uid: currentUser.uid,
                    name: currentUser.displayName,
                    title,
                    review,
                    rating: parseInt(rating),
                    photoURL: currentUser.photoURL,
                    timestamp: new Date()
                });
                Swal.fire({
                    icon: 'success',
                    title: 'Thank You!',
                    text: 'Your review has been submitted and is now displayed.',
                    confirmButtonColor: '#3b82f6',
                });
            }

            form.reset();
            document.querySelectorAll('input[name="rating"]').forEach(radio => radio.checked = false);
            document.querySelectorAll('.rating-container i').forEach(star => {
                star.classList.remove('text-yellow-400');
                star.classList.add('text-gray-300', 'dark:text-gray-600');
            });
            await fetchTestimonials();
        } catch (error) {
            console.error('Error submitting review:', error);
            Swal.fire({
                icon: 'error',
                title: 'Submission Failed',
                text: 'An error occurred while submitting your review. Please try again.',
                confirmButtonColor: '#3b82f6',
            });
        }
    }
});