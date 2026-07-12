import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBXS-qRlVntS76T56_vnbF9N3msp7djQ4g",
    authDomain: "jlato-admin-576e1.firebaseapp.com",
    projectId: "jlato-admin-576e1",
    storageBucket: "jlato-admin-576e1.firebasestorage.app",
    messagingSenderId: "989085177669",
    appId: "1:989085177669:web:9f02b633f1e8b62e85d02c"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

export { db };