'use strict';

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import { getFirestore } from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig = {
    apiKey: "AIzaSyAnuN6SK0ckwXOhs97yI0C4nC3CFDeJc8c",
    authDomain: "hamzaportfolio-e31fa.firebaseapp.com",
    projectId: "hamzaportfolio-e31fa",
    storageBucket: "hamzaportfolio-e31fa.firebasestorage.app",
    messagingSenderId: "644132393769",
    appId: "1:644132393769:web:e7080e8193dfd55a3fdd38",
    measurementId: "G-VYQVBQFE09"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);