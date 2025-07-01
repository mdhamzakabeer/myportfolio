// contact-form.js
import { auth, db } from './firebase.js';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { collection, addDoc, serverTimestamp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

// Initialize EmailJS

emailjs.init('qIkvp2V_DnOIBJM5R');

const contactForm = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const emailInput = document.getElementById('email');
const subjectInput = document.getElementById('subject'); // Added subject input
const messageInput = document.getElementById('message');
const wordCountDisplay = document.getElementById('word-count');
const avatarContainer = document.getElementById('avatar-container');
const signInButton = document.getElementById('sign-in');
const submitButton = document.getElementById('submit-button');

const MAX_WORDS = 120;
const MIN_CHARS = 5;
const MAX_NAME_LENGTH = 40;
const MAX_EMAIL_LENGTH = 30;
const DEFAULT_AVATAR = 'https://via.placeholder.com/40';

function updateAuthUI(user) {
    if (user) {
        avatarContainer.innerHTML = `
            <div class="flex items-center space-x-2">
                <img src="${user.photoURL || DEFAULT_AVATAR}" alt="User Avatar" class="w-20 h-20 rounded-full border-2 border-blue-600" onerror="this.src='${DEFAULT_AVATAR}'">
                <button id="sign-out" class="text-sm text-blue-600 hover:text-blue-700">Sign Out</button>
            </div>
        `;
        signInButton.style.display = 'none';

        // Set name and email values from the user object
        nameInput.value = user.displayName || '';
        emailInput.value = user.email || '';

        // Disable name and email inputs to prevent editing
        nameInput.disabled = true; // Changed from false to true
        emailInput.disabled = true; // Changed from false to true

        subjectInput.disabled = false; // Enable subject input
        messageInput.disabled = false;
        submitButton.disabled = false;

        subjectInput.value = ''; // Reset subject to default/empty on sign-in
        messageInput.value = ''; // Clear message on sign-in
        wordCountDisplay.textContent = `Words: 0/${MAX_WORDS}`; // Reset word count

        const signOutButton = document.getElementById('sign-out');
        if (signOutButton) {
            signOutButton.addEventListener('click', () => {
                signOut(auth).then(() => {
                    contactForm.reset();
                    wordCountDisplay.textContent = `Words: 0/${MAX_WORDS}`;
                    updateAuthUI(null);
                }).catch(error => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Sign-Out Error',
                        text: error.message,
                        customClass: {
                            popup: 'dark:bg-gray-700 dark:text-white',
                            title: 'dark:text-white',
                            content: 'dark:text-gray-300'
                        },
                        confirmButtonColor: '#2563eb'
                    });
                });
            });
        }
    } else {
        avatarContainer.innerHTML = `
            <div class="w-20 h-20 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                <span class="text-gray-500 dark:text-gray-400"></span>
            </div>
        `;
        signInButton.style.display = 'flex';
        nameInput.disabled = true;
        emailInput.disabled = true;
        subjectInput.disabled = true; // Disable subject input
        messageInput.disabled = true;
        submitButton.disabled = true;
        nameInput.value = '';
        emailInput.value = '';
        subjectInput.value = ''; // Reset subject
        messageInput.value = ''; // Clear message
        wordCountDisplay.textContent = `Words: 0/${MAX_WORDS}`; // Reset word count
    }
}

// Ensure DOM is ready before listening to auth state
document.addEventListener('DOMContentLoaded', () => {
    onAuthStateChanged(auth, user => {
        updateAuthUI(user);
    });
});

signInButton.addEventListener('click', () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
        prompt: 'select_account'
    });
    signInWithPopup(auth, provider)
        .then(() => {
            // Popup closes naturally
        })
        .catch(error => {
            Swal.fire({
                icon: 'error',
                title: 'Sign-In Error',
                text: error.message,
                customClass: {
                    popup: 'dark:bg-gray-700 dark:text-white',
                    title: 'dark:text-white',
                    content: 'dark:text-gray-300'
                },
                confirmButtonColor: '#2563eb'
            });
        });
});

function countWords(text) {
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    return words.length;
}

messageInput.addEventListener('input', () => {
    const message = messageInput.value;
    const wordCount = countWords(message);

    wordCountDisplay.textContent = `Words: ${wordCount}/${MAX_WORDS}`;

    if (wordCount > MAX_WORDS) {
        wordCountDisplay.classList.remove('text-gray-600', 'dark:text-gray-400');
        wordCountDisplay.classList.add('text-red-500', 'dark:text-red-400');
        messageInput.classList.add('border-red-500');
    } else {
        wordCountDisplay.classList.remove('text-red-500', 'dark:text-red-400');
        wordCountDisplay.classList.add('text-gray-600', 'dark:text-gray-400');
        messageInput.classList.remove('border-red-500');
    }

    if (wordCount > MAX_WORDS) {
        const words = message.trim().split(/\s+/).slice(0, MAX_WORDS).join(' ');
        messageInput.value = words;
        wordCountDisplay.textContent = `Words: ${MAX_WORDS}/${MAX_WORDS}`;
        Swal.fire({
            icon: 'warning',
            title: 'Word Limit Reached',
            text: `Your message cannot exceed ${MAX_WORDS} words.`,
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
    }
});

contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
        // If no user is signed in, prevent submission
        Swal.fire({
            icon: 'warning',
            title: 'Authentication Required',
            text: 'Please sign in with your Google account to send a message.',
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    // Get values directly from the user object for name and email,
    // as the inputs are now disabled and shouldn't be edited.
    const name = user.displayName || ''; // Use user.displayName
    const email = user.email || '';     // Use user.email
    const subject = subjectInput.value.trim();
    const message = messageInput.value.trim();
    const wordCount = countWords(message);

    // Validate essential fields (name, email, message) - still important even if disabled
    if (!name || !email || !message) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please ensure your Name and Email are provided by your Google account, and fill in the Message.',
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    // *** Specific validation for the subject dropdown ***
    // Ensure the subject is not empty or the placeholder text
    if (subject === "" || subject === "Please Select") { // Adjust "Please Select" if your default option's text is different
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: 'Please select a subject from the dropdown list.',
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    // You can keep the regex validations for name and email here,
    // even though the fields are disabled. This acts as a safeguard
    // in case the user's Google account provides unusual data,
    // though it's less critical now that they can't manually edit.
    const nameRegex = /^[a-zA-Z\s]{3,40}$/;
    if (name && !nameRegex.test(name)) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: `Your Google Name must be between 3 and ${MAX_NAME_LENGTH} characters and contain only letters and spaces.`,
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]{1,30}@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email && !emailRegex.test(email)) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: `Your Google Email address is invalid. Please ensure it's a valid email (max ${MAX_EMAIL_LENGTH} characters before @, e.g., example@domain.com).`,
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    if (message.length < MIN_CHARS) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: `Message must contain at least ${MIN_CHARS} characters.`,
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    if (wordCount > MAX_WORDS) {
        Swal.fire({
            icon: 'error',
            title: 'Validation Error',
            text: `Your message cannot exceed ${MAX_WORDS} words. Current word count: ${wordCount}.`,
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
        return;
    }

    // Show a loading SweetAlert while processing
    Swal.fire({
        title: 'Sending Message...',
        text: 'Please wait while your message is being sent and notifications are being processed.',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
        customClass: {
            popup: 'dark:bg-gray-700 dark:text-white',
            title: 'dark:text-white',
            content: 'dark:text-gray-300'
        }
    });

    try {
        // 1. Save message to Firestore
        await addDoc(collection(db, "messages"), {
            name: name,
            email: email,
            subject: subject,
            message: message,
            uid: user.uid,
            timestamp: serverTimestamp()
        });

        // 2. Send email to owner (you)
        const ownerEmailParams = {
            from_name: name,
            from_email: email,
            subject: subject,
            message_html: message,
            to_name: 'Hamza', // Replace with your name
            to_email: 'hamzakabeer021@gmail.com' // Replace with your email
        };
        await emailjs.send('service_cystcap', 'template_1wtcizm', ownerEmailParams);

        // 3. Send confirmation email to user
        const userConfirmationParams = {
            to_name: name,
            to_email: email,
            subject: subject,
            message_html: message,
            reply_to: 'hamzakabeer021@gmail.com' // Replace with your email for user replies
        };
        await emailjs.send('service_cystcap', 'template_gp759md', userConfirmationParams);

        // Success message
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Your message has been successfully sent to Muhammad Hamza Kabeer and a confirmation email has been sent to you.',
            timer: 3000,
            timerProgressBar: true,
            showConfirmButton: false,
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            }
        });

        // Clear the form after successful submission
        contactForm.reset();
        wordCountDisplay.textContent = `Words: 0/${MAX_WORDS}`;
        // Re-set name and email values as they are now cleared by contactForm.reset()
        // and should remain disabled and show the user's info.
        if (user) {
            nameInput.value = user.displayName || '';
            emailInput.value = user.email || '';
        }
    } catch (error) {
        console.error("Error during message submission or email sending: ", error);
        Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'There was an error sending your message or the confirmation email. Please try again or contact directly.',
            customClass: {
                popup: 'dark:bg-gray-700 dark:text-white',
                title: 'dark:text-white',
                content: 'dark:text-gray-300'
            },
            confirmButtonColor: '#2563eb'
        });
    }
});