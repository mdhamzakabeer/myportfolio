'use strict';

import { db, auth } from './firebase.js';
import { collection, addDoc, getDocs, query, orderBy, where, doc, updateDoc } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';

export function initTestimonials() {
    const form = document.getElementById('testimonial-form');
    const testimonialsContainer = document.getElementById('testimonials-container');
    const authStatus = document.getElementById('auth-status');
    const formContainer = document.getElementById('testimonial-form-container');
    let currentUser = null;
    let currentUserReviewId = null;

    function updateStars(event) {
        const selectedValue = event.target.value;
        const stars = document.querySelectorAll('.rating-container i');
        stars.forEach((star, index) => {
            star.classList.toggle('text-yellow-400', index < selectedValue);
            star.classList.toggle('text-gray-300', index >= selectedValue);
            star.classList.toggle('dark:text-gray-600', index >= selectedValue && document.documentElement.classList.contains('dark'));
        });
    }

    document.querySelectorAll('.rating-container input').forEach(input => {
        input.addEventListener('change', updateStars);
    });

    function validateForm(name, title, review, rating) {
        if (!name) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Name is required.',
                confirmButtonColor: '#3b82f6',
            });
            return false;
        }
        if (!title || title.length < 3 || title.length > 25) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Title/Company must be between 3 and 25 characters.',
                confirmButtonColor: '#3b82f6',
            });
            return false;
        }
        const wordCount = review.trim().split(/\s+/).length;
        const charCount = review.trim().length;
        if (!review || charCount < 6 || wordCount > 30) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Review must be at least 6 characters and no more than 30 words.',
                confirmButtonColor: '#3b82f6',
            });
            return false;
        }
        if (!rating || isNaN(rating) || rating < 1 || rating > 5) {
            Swal.fire({
                icon: 'error',
                title: 'Validation Error',
                text: 'Please select a rating between 1 and 5 stars.',
                confirmButtonColor: '#3b82f6',
            });
            return false;
        }
        return true;
    }

    function generateStarRating(rating) {
        let stars = '';
        for (let i = 1; i <= 5; i++) {
            stars += `<i class="fas fa-star ${i <= rating ? '' : 'empty'}"></i>`;
        }
        return stars;
    }

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

    async function checkExistingReview(uid) {
        const q = query(collection(db, 'testimonials'), where('uid', '==', uid));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            currentUserReviewId = querySnapshot.docs[0].id;
            return querySnapshot.docs[0].data();
        }
        return null;
    }

    onAuthStateChanged(auth, async (user) => {
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
            const existingReview = await checkExistingReview(user.uid);
            if (existingReview) {
                document.getElementById('title').value = existingReview.title;
                document.getElementById('review').value = existingReview.review;
                const ratingInput = document.querySelector(`input[name="rating"][value="${existingReview.rating}"]`);
                if (ratingInput) {
                    ratingInput.checked = true;
                    updateStars({ target: ratingInput });
                }
            }
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
        await fetchTestimonials();
    });

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
}