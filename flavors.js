/*==================================================
  J.Lato Flavors
  Part 1
==================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {
    getFirestore,
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* Firebase Configuration */

const firebaseConfig = {

    apiKey: "AIzaSyBXS-qRlVntS76T56_vnbF9N3msp7djQ4g",

    authDomain: "jlato-admin-576e1.firebaseapp.com",

    projectId: "jlato-admin-576e1",

    storageBucket: "jlato-admin-576e1.firebasestorage.app",

    messagingSenderId: "989085177669",

    appId: "1:989085177669:web:9f02b633f1e8b62e85d02c"

};

/* Initialize Firebase */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

/*==================================================
  HTML Elements
==================================================*/

const flavorGrid =
    document.getElementById("flavorGrid");

const template =
    document.getElementById("flavorTemplate");

const emptyState =
    document.getElementById("emptyState");

const searchInput =
    document.getElementById("searchInput");

const filterButtons =
    document.querySelectorAll(".filter-btn");

/*==================================================
  Variables
==================================================*/

let flavors = [];

let activeCategory = "all";

let searchText = "";

/*==================================================
  Start App
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    loadFlavors();

});
/*==================================================
  Load Flavors From Firestore
==================================================*/

async function loadFlavors() {

    try {

        const q = query(
            collection(db, "flavors"),
            orderBy("name")
        );

        const snapshot = await getDocs(q);

        flavors = [];

        snapshot.forEach((doc) => {

            flavors.push({

                id: doc.id,

                ...doc.data()

            });

        });

        renderFlavors();

    }

    catch (error) {

        console.error("Error loading flavors:", error);

        flavorGrid.innerHTML = `
            <div class="empty-state">
                <h2>Unable to load flavors</h2>
                <p>Please try again later.</p>
            </div>
        `;

    }

}

/*==================================================
  Render Flavors
==================================================*/

function renderFlavors() {

    flavorGrid.innerHTML = "";

    let filtered = flavors.filter(flavor => {

        if (flavor.available === false)
            return false;

        if (
            activeCategory !== "all" &&
            flavor.category !== activeCategory
        )
            return false;

        if (
            searchText &&
            !flavor.name.toLowerCase().includes(searchText)
        )
            return false;

        return true;

    });

    if (filtered.length === 0) {

        emptyState.style.display = "block";

        return;

    }

    emptyState.style.display = "none";

    filtered.forEach(createFlavorCard);

}

/*==================================================
  Create Flavor Card
==================================================*/

function createFlavorCard(flavor) {

    const card = template.content.cloneNode(true);

    /* Image */

    const image = card.querySelector(".flavor-image");

    image.src = flavor.image || "placeholder.png";

    image.alt = flavor.name || "Flavor";

    /* Category */

    card.querySelector(".flavor-category").textContent =
        flavor.category || "Classic";

    /* Name */

    card.querySelector(".flavor-name").textContent =
        flavor.name || "Unnamed Flavor";

    /* Description */

    card.querySelector(".flavor-description").textContent =
        flavor.description || "";

    /* Price */

    card.querySelector(".flavor-price").textContent =
        `${Number(flavor.price || 0).toFixed(2)} AED`;

    /* Featured Badge */

    const featuredBadge =
        card.querySelector(".featured-badge");

    if (!flavor.featured) {

        featuredBadge.style.display = "none";

    }

    /* Availability Badge */

    const footer =
        card.querySelector(".flavor-footer");

    const availability = document.createElement("span");

    availability.className = "available-badge";

    availability.textContent =
        flavor.available === false
            ? "Unavailable"
            : "Available";

    if (flavor.available === false) {

        availability.classList.add("unavailable");

    }

    footer.appendChild(availability);

    /* Animation */

    card.querySelector(".flavor-card")
        .classList.add("fade-in");

    /* Add Card */

    flavorGrid.appendChild(card);

}
/*==================================================
  Search
==================================================*/

if (searchInput) {

    searchInput.addEventListener("input", (event) => {

        searchText = event.target.value
            .trim()
            .toLowerCase();

        renderFlavors();

    });

}

/*==================================================
  Category Filters
==================================================*/

filterButtons.forEach((button) => {

    button.addEventListener("click", () => {

        /* Remove active class */

        filterButtons.forEach((btn) => {

            btn.classList.remove("active");

        });

        /* Activate clicked button */

        button.classList.add("active");

        /* Save selected category */

        activeCategory =
            button.dataset.filter || "all";

        renderFlavors();

    });

});

/*==================================================
  Utility Functions
==================================================*/

function clearSearch() {

    searchText = "";

    if (searchInput) {

        searchInput.value = "";

    }

    renderFlavors();

}

function showAllFlavors() {

    activeCategory = "all";

    filterButtons.forEach((btn) => {

        btn.classList.remove("active");

        if (btn.dataset.filter === "all") {

            btn.classList.add("active");

        }

    });

    renderFlavors();

}

/*==================================================
  Page Ready
==================================================*/

window.clearFlavorSearch = clearSearch;

window.showAllFlavors = showAllFlavors;
/*==================================================
  Part 5
  Final Polish
==================================================*/

/* Sort Flavors Alphabetically */

function sortFlavors() {

    flavors.sort((a, b) => {

        const nameA = (a.name || "").toLowerCase();
        const nameB = (b.name || "").toLowerCase();

        return nameA.localeCompare(nameB);

    });

}

/* Fix Broken Images */

document.addEventListener("error", (event) => {

    if (event.target.tagName === "IMG") {

        event.target.src = "placeholder.png";

    }

}, true);

/* Reload */

async function refreshFlavors() {

    await loadFlavors();

}

/* Refresh every minute */

setInterval(() => {

    refreshFlavors();

}, 60000);

/* Page Loaded */

window.addEventListener("load", () => {

    sortFlavors();

    renderFlavors();

    console.log("J.Lato Flavors Loaded Successfully");

});

/* Global Access */

window.refreshFlavors = refreshFlavors;

/*==================================================
  End of File
==================================================*/
