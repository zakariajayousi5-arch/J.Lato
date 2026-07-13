/*==================================================
    J.Lato Admin
==================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {

    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/*==================================================
    Firebase
==================================================*/

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

/*==================================================
    Password
==================================================*/

const ADMIN_PASSWORD = "jlato123";

/*==================================================
    Global Variables
==================================================*/

let flavors = [];

let categories = [];

let selectedFlavor = null;

/*==================================================
    Elements
==================================================*/

const loginScreen = document.getElementById("loginScreen");

const appContainer = document.getElementById("app");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

/*==================================================
    Login
==================================================*/

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        login();

    }

});

function login() {

    if (passwordInput.value.trim() === ADMIN_PASSWORD) {

        loginScreen.classList.add("hidden");

        appContainer.classList.remove("hidden");

        loginMessage.textContent = "";

        passwordInput.value = "";

        console.log("Admin logged in.");

    }

    else {

        loginMessage.textContent = "Incorrect password.";

        passwordInput.select();

    }

}

/*==================================================
    Logout
==================================================*/

logoutButton.addEventListener("click", () => {

    appContainer.classList.add("hidden");

    loginScreen.classList.remove("hidden");

});
/*==================================================
    Navigation
==================================================*/

const menuButtons = document.querySelectorAll(".menu-button");

const pageTitle = document.getElementById("pageTitle");

const pages = {

    dashboard: document.getElementById("dashboardPage"),

    flavors: document.getElementById("flavorsPage"),

    categories: document.getElementById("categoriesPage"),

    images: document.getElementById("imagesPage"),

    settings: document.getElementById("settingsPage")

};

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        openPage(button.dataset.page);

    });

});

function openPage(page) {

    document.querySelectorAll(".page").forEach(section => {

        section.classList.remove("active-page");

    });

    menuButtons.forEach(button => {

        button.classList.remove("active");

    });

    if (pages[page]) {

        pages[page].classList.add("active-page");

    }

    document.querySelector(`[data-page="${page}"]`).classList.add("active");

    pageTitle.textContent =

        page.charAt(0).toUpperCase() + page.slice(1);

}

/*==================================================
    Dashboard Elements
==================================================*/

const totalFlavors = document.getElementById("totalFlavors");

const availableFlavors = document.getElementById("availableFlavors");

const featuredFlavors = document.getElementById("featuredFlavors");

const categoryCount = document.getElementById("categoryCount");

/*==================================================
    Dashboard
==================================================*/

function updateDashboard() {

    totalFlavors.textContent = flavors.length;

    availableFlavors.textContent =

        flavors.filter(flavor => flavor.available).length;

    featuredFlavors.textContent =

        flavors.filter(flavor => flavor.featured).length;

    categoryCount.textContent = categories.length;

}

/*==================================================
    Startup
==================================================*/

openPage("dashboard");

updateDashboard();
/*==================================================
    J.Lato Admin
==================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import {

    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/*==================================================
    Firebase
==================================================*/

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

/*==================================================
    Password
==================================================*/

const ADMIN_PASSWORD = "jlato123";

/*==================================================
    Global Variables
==================================================*/

let flavors = [];

let categories = [];

let selectedFlavor = null;

/*==================================================
    Elements
==================================================*/

const loginScreen = document.getElementById("loginScreen");

const appContainer = document.getElementById("app");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

/*==================================================
    Login
==================================================*/

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keydown", (event) => {

    if (event.key === "Enter") {

        login();

    }

});

function login() {

    if (passwordInput.value.trim() === ADMIN_PASSWORD) {

        loginScreen.classList.add("hidden");

        appContainer.classList.remove("hidden");

        loginMessage.textContent = "";

        passwordInput.value = "";

        console.log("Admin logged in.");

    }

    else {

        loginMessage.textContent = "Incorrect password.";

        passwordInput.select();

    }

}

/*==================================================
    Logout
==================================================*/

logoutButton.addEventListener("click", () => {

    appContainer.classList.add("hidden");

    loginScreen.classList.remove("hidden");

});
/*==================================================
    Navigation
==================================================*/

const menuButtons = document.querySelectorAll(".menu-button");

const pageTitle = document.getElementById("pageTitle");

const pages = {

    dashboard: document.getElementById("dashboardPage"),

    flavors: document.getElementById("flavorsPage"),

    categories: document.getElementById("categoriesPage"),

    images: document.getElementById("imagesPage"),

    settings: document.getElementById("settingsPage")

};

menuButtons.forEach(button => {

    button.addEventListener("click", () => {

        openPage(button.dataset.page);

    });

});

function openPage(page) {

    document.querySelectorAll(".page").forEach(section => {

        section.classList.remove("active-page");

    });

    menuButtons.forEach(button => {

        button.classList.remove("active");

    });

    if (pages[page]) {

        pages[page].classList.add("active-page");

    }

    document.querySelector(`[data-page="${page}"]`).classList.add("active");

    pageTitle.textContent =

        page.charAt(0).toUpperCase() + page.slice(1);

}

/*==================================================
    Dashboard Elements
==================================================*/

const totalFlavors = document.getElementById("totalFlavors");

const availableFlavors = document.getElementById("availableFlavors");

const featuredFlavors = document.getElementById("featuredFlavors");

const categoryCount = document.getElementById("categoryCount");

/*==================================================
    Dashboard
==================================================*/

function updateDashboard() {

    totalFlavors.textContent = flavors.length;

    availableFlavors.textContent =

        flavors.filter(flavor => flavor.available).length;

    featuredFlavors.textContent =

        flavors.filter(flavor => flavor.featured).length;

    categoryCount.textContent = categories.length;

}

/*==================================================
    Startup
==================================================*/

openPage("dashboard");

updateDashboard();
/*==================================================
    Flavor Rendering
==================================================*/

const flavorList = document.getElementById("flavorList");


function renderFlavors(){

    if(!flavorList) return;


    flavorList.innerHTML = "";


    if(flavors.length === 0){

        flavorList.innerHTML = `
            <p class="empty">
                No flavors added yet.
            </p>
        `;

        return;

    }


    flavors.forEach(flavor => {


        const card = document.createElement("div");

        card.className = "flavor-card";


        card.innerHTML = `

            <img src="${flavor.image || 'logo.png'}">


            <div class="flavor-info">

                <h3>${flavor.name || "Unnamed Flavor"}</h3>

                <p>
                    Category:
                    ${flavor.category || "None"}
                </p>

                <p>
                    ${flavor.description || ""}
                </p>

            </div>


            <div class="flavor-actions">

                <button onclick="editFlavor('${flavor.id}')">

                    Edit

                </button>


                <button onclick="removeFlavor('${flavor.id}')">

                    Delete

                </button>

            </div>

        `;


        flavorList.appendChild(card);


    });


}


/*==================================================
    Add Flavor
==================================================*/

const addFlavorButton =
document.getElementById("addFlavorButton");


if(addFlavorButton){

    addFlavorButton.addEventListener("click", async()=>{


        const newFlavor = {


            name:"New Flavor",

            category:"Gelato",

            description:"",

            image:"",

            available:true,

            featured:false


        };


        await addDoc(

            flavorsCollection,

            newFlavor

        );


        await loadFlavors();


    });

}


/*==================================================
    Delete Flavor
==================================================*/

window.removeFlavor = async function(id){


    const confirmDelete =
    confirm("Delete this flavor?");


    if(!confirmDelete) return;


    await deleteDoc(

        doc(db,"flavors",id)

    );


    await loadFlavors();


};
/*==================================================
    Edit Flavor
==================================================*/

const editName = document.getElementById("editName");

const editCategory = document.getElementById("editCategory");

const editDescription = document.getElementById("editDescription");

const editImage = document.getElementById("editImage");

const saveFlavorButton =
document.getElementById("saveFlavorButton");



window.editFlavor = function(id){


    selectedFlavor = flavors.find(

        flavor => flavor.id === id

    );


    if(!selectedFlavor) return;


    editName.value =
    selectedFlavor.name || "";


    editCategory.value =
    selectedFlavor.category || "";


    editDescription.value =
    selectedFlavor.description || "";


    editImage.value =
    selectedFlavor.image || "";


    openPage("flavors");


};



/*==================================================
    Save Flavor Changes
==================================================*/

if(saveFlavorButton){


    saveFlavorButton.addEventListener(
    "click",
    async()=>{


        if(!selectedFlavor){

            alert("Select a flavor first.");

            return;

        }



        const flavorRef =
        doc(
            db,
            "flavors",
            selectedFlavor.id
        );



        await updateDoc(

            flavorRef,

            {

                name:
                editName.value,


                category:
                editCategory.value,


                description:
                editDescription.value,


                image:
                editImage.value

            }

        );



        alert("Flavor saved!");



        selectedFlavor = null;


        await loadFlavors();


    });


}



/*==================================================
    Category Loading
==================================================*/

const categorySelect =
document.getElementById("editCategory");


function renderCategories(){


    if(!categorySelect) return;


    categorySelect.innerHTML = "";


    categories.forEach(category=>{


        const option =
        document.createElement("option");


        option.value =
        category.name;


        option.textContent =
        category.name;


        categorySelect.appendChild(option);


    });


}



/*==================================================
    Update category list after loading
==================================================*/

const oldLoadCategories = loadCategories;


loadCategories = async function(){


    await oldLoadCategories();


    renderCategories();


};
