import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
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

const flavorGrid = document.getElementById("flavorGrid");
const template = document.getElementById("flavorTemplate");
const emptyState = document.getElementById("emptyState");

async function loadFlavors() {

    flavorGrid.innerHTML = "";

    const q = query(
        collection(db, "flavors"),
        orderBy("name")
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        emptyState.style.display = "block";
        return;

    }

    emptyState.style.display = "none";

    snapshot.forEach((doc) => {

        const flavor = doc.data();

        if (flavor.available === false) return;

        const card = template.content.cloneNode(true);

        card.querySelector(".flavor-image").src =
            flavor.image || "placeholder.png";

        card.querySelector(".flavor-name").textContent =
            flavor.name;

        card.querySelector(".flavor-description").textContent =
            flavor.description;

        card.querySelector(".flavor-price").textContent =
            `${flavor.price} AED`;

        card.querySelector(".flavor-category").textContent =
            flavor.category;

        if (!flavor.featured) {

            card.querySelector(".featured-badge").style.display = "none";

        }

        flavorGrid.appendChild(card);

    });

}

loadFlavors();