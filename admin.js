/*==================================================
    J.Lato Admin
==================================================*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";

import {

    getFirestore,
    collection,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    doc

} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-firestore.js";

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
    Collections
==================================================*/

const flavorsCollection = collection(db, "flavors");

const categoriesCollection = collection(db, "categories");

/*==================================================
    Global Data
==================================================*/

let flavors = [];

let categories = [];

let selectedFlavor = null;

/*==================================================
    Login Elements
==================================================*/

const loginScreen = document.getElementById("loginScreen");

const appContainer = document.getElementById("app");

const passwordInput = document.getElementById("password");

const loginButton = document.getElementById("loginButton");

const loginMessage = document.getElementById("loginMessage");

const logoutButton = document.getElementById("logoutButton");

/*==================================================
    Dashboard Elements
==================================================*/

const totalFlavors = document.getElementById("totalFlavors");

const availableFlavors = document.getElementById("availableFlavors");

const featuredFlavors = document.getElementById("featuredFlavors");

const categoryCount = document.getElementById("categoryCount");

const pageTitle = document.getElementById("pageTitle");

/*==================================================
    Login
==================================================*/

function login(){

    if(passwordInput.value.trim()===ADMIN_PASSWORD){

        loginScreen.classList.add("hidden");

        appContainer.classList.remove("hidden");

        loginMessage.textContent="";

        passwordInput.value="";

        loadEverything();

    }

    else{

        loginMessage.textContent="Wrong password.";

        passwordInput.focus();

        passwordInput.select();

    }

}

loginButton.addEventListener("click",login);

passwordInput.addEventListener("keydown",(event)=>{

    if(event.key==="Enter"){

        login();

    }

});

/*==================================================
    Logout
==================================================*/

logoutButton.addEventListener("click",()=>{

    appContainer.classList.add("hidden");

    loginScreen.classList.remove("hidden");

});

/*==================================================
    Navigation
==================================================*/

const pages=document.querySelectorAll(".page");

const menuButtons=document.querySelectorAll(".menu-button");

menuButtons.forEach(button=>{

    button.addEventListener("click",()=>{

        const page=button.dataset.page;

        showPage(page);

    });

});

function showPage(page){

    pages.forEach(section=>{

        section.classList.remove("active-page");

    });

    menuButtons.forEach(button=>{

        button.classList.remove("active");

    });

    document.getElementById(page+"Page").classList.add("active-page");

    document
        .querySelector(`[data-page="${page}"]`)
        .classList.add("active");

    pageTitle.textContent=

        page.charAt(0).toUpperCase()+

        page.slice(1);

}

/*==================================================
    Dashboard
==================================================*/

function updateDashboard(){

    totalFlavors.textContent=flavors.length;

    availableFlavors.textContent=

        flavors.filter(f=>f.available).length;

    featuredFlavors.textContent=

        flavors.filter(f=>f.featured).length;

    categoryCount.textContent=

        categories.length;

}

/*==================================================
    Firestore Loading
==================================================*/

async function loadEverything(){

    await loadCategories();

    await loadFlavors();

}

async function loadCategories(){

    categories=[];

    const snapshot=await getDocs(categoriesCollection);

    snapshot.forEach(document=>{

        categories.push({

            id:document.id,

            ...document.data()

        });

    });

    updateDashboard();

}

async function loadFlavors(){

    flavors=[];

    const snapshot=await getDocs(flavorsCollection);

    snapshot.forEach(document=>{

        flavors.push({

            id:document.id,

            ...document.data()

        });

    });

    updateDashboard();

}
/*==================================================
    DOM ELEMENTS
==================================================*/

const flavorList = document.getElementById("flavorList");

const searchFlavor = document.getElementById("searchFlavor");

const addFlavorButton = document.getElementById("addFlavorButton");

const flavorModal = document.getElementById("flavorModal");

const closeFlavorModal =
document.getElementById("closeFlavorModal");

const modalTitle =
document.getElementById("modalTitle");

const flavorName =
document.getElementById("flavorName");

const flavorPrice =
document.getElementById("flavorPrice");

const flavorDescription =
document.getElementById("flavorDescription");

const flavorCategory =
document.getElementById("flavorCategory");

const imageURL =
document.getElementById("imageURL");

const imageUpload =
document.getElementById("imageUpload");

const previewImage =
document.getElementById("previewImage");

const featuredSwitch =
document.getElementById("featuredSwitch");

const availableSwitch =
document.getElementById("availableSwitch");

/*==================================================
    MODAL
==================================================*/

function openFlavorModal(){

    flavorModal.classList.remove("hidden");

}

function closeFlavor(){

    flavorModal.classList.add("hidden");

    currentFlavor = null;

}

closeFlavorModal.addEventListener(

    "click",

    closeFlavor

);

/*==================================================
    IMAGE PREVIEW
==================================================*/

imageURL.addEventListener("input",()=>{

    if(imageURL.value.trim()===""){

        previewImage.src="placeholder.png";

        return;

    }

    previewImage.src=imageURL.value;

});

imageUpload.addEventListener("change",()=>{

    const file=imageUpload.files[0];

    if(!file) return;

    previewImage.src=

        URL.createObjectURL(file);

});

/*==================================================
    NEW FLAVOR
==================================================*/

addFlavorButton.addEventListener(

    "click",

    ()=>{

        currentFlavor=null;

        modalTitle.textContent="New Flavor";

        flavorName.value="";

        flavorPrice.value="";

        flavorDescription.value="";

        imageURL.value="";

        previewImage.src="placeholder.png";

        featuredSwitch.checked=false;

        availableSwitch.checked=true;

        openFlavorModal();

    }

);
/*==================================================
    RENDER FLAVORS
==================================================*/

function renderFlavors(list = flavors){

    flavorList.innerHTML = "";

    if(list.length === 0){

        flavorList.innerHTML = `
            <div class="empty-state">
                No flavors found.
            </div>
        `;

        return;

    }

    list.forEach(flavor=>{

        const card = document.createElement("div");

        card.className = "flavor-card";

        card.innerHTML = `

            <img
                src="${flavor.image || "placeholder.png"}"
                class="flavor-image">

            <div class="flavor-content">

                <h3>${flavor.name}</h3>

                <p>${flavor.description || ""}</p>

                <span>${flavor.category || ""}</span>

            </div>

        `;

        card.addEventListener("click",()=>{

            editFlavor(flavor);

        });

        flavorList.appendChild(card);

    });

}

/*==================================================
    EDIT FLAVOR
==================================================*/

function editFlavor(flavor){

    currentFlavor = flavor;

    modalTitle.textContent = "Edit Flavor";

    flavorName.value = flavor.name || "";

    flavorPrice.value = flavor.price || "";

    flavorDescription.value =
        flavor.description || "";

    imageURL.value =
        flavor.image || "";

    previewImage.src =
        flavor.image || "placeholder.png";

    featuredSwitch.checked =
        flavor.featured || false;

    availableSwitch.checked =
        flavor.available ?? true;

    flavorCategory.value =
        flavor.category || "";

    openFlavorModal();

}

/*==================================================
    SEARCH
==================================================*/

searchFlavor.addEventListener("input",()=>{

    const value =
        searchFlavor.value
        .toLowerCase()
        .trim();

    const filtered = flavors.filter(flavor=>{

        return (

            (flavor.name || "")
            .toLowerCase()
            .includes(value)

            ||

            (flavor.category || "")
            .toLowerCase()
            .includes(value)

        );

    });

    renderFlavors(filtered);

});
t/*==================================================
    SAVE FLAVOR
==================================================*/

const saveFlavor =
document.getElementById("saveFlavor");

saveFlavor.addEventListener("click",async()=>{

    const data={

        name:flavorName.value.trim(),

        price:Number(flavorPrice.value)||0,

        description:flavorDescription.value.trim(),

        category:flavorCategory.value,

        image:imageURL.value.trim(),

        featured:featuredSwitch.checked,

        available:availableSwitch.checked

    };

    if(data.name===""){

        alert("Please enter a flavor name.");

        return;

    }

    if(currentFlavor){

        await updateDoc(

            doc(db,"flavors",currentFlavor.id),

            data

        );

    }else{

        await addDoc(

            flavorsRef,

            data

        );

    }

    closeFlavor();

    await loadFlavors();

    renderFlavors();

    updateDashboard();

});

/*==================================================
    DELETE FLAVOR
==================================================*/

const deleteFlavorButton =
document.getElementById("deleteFlavor");

deleteFlavorButton.addEventListener(

    "click",

    ()=>{

        if(!currentFlavor) return;

        document
        .getElementById("confirmModal")
        .classList
        .remove("hidden");

    }

);

document
.getElementById("cancelDelete")
.addEventListener("click",()=>{

    document
    .getElementById("confirmModal")
    .classList
    .add("hidden");

});

document
.getElementById("confirmDelete")
.addEventListener("click",async()=>{

    if(!currentFlavor) return;

    await deleteDoc(

        doc(db,"flavors",currentFlavor.id)

    );

    document
    .getElementById("confirmModal")
    .classList
    .add("hidden");

    closeFlavor();

    await loadFlavors();

    renderFlavors();

    updateDashboard();

});

/*==================================================
    DUPLICATE FLAVOR
==================================================*/

const duplicateFlavorButton =
document.getElementById("duplicateFlavor");

duplicateFlavorButton.addEventListener(

    "click",

    async()=>{

        if(!currentFlavor) return;

        const copy={

            ...currentFlavor,

            name:currentFlavor.name+" Copy"

        };

        delete copy.id;

        await addDoc(

            flavorsRef,

            copy

        );

        await loadFlavors();

        renderFlavors();

        updateDashboard();

    }

);
/*==================================================
    CATEGORIES
==================================================*/

function renderCategories(){

    flavorCategory.innerHTML="";

    categories.forEach(category=>{

        const option=document.createElement("option");

        option.value=category.name;

        option.textContent=category.name;

        flavorCategory.appendChild(option);

    });

}

document
.getElementById("addCategoryButton")
.addEventListener("click",async()=>{

    const name=prompt("Category name");

    if(!name) return;

    await addDoc(

        categoriesRef,

        {

            name:name.trim()

        }

    );

    await loadCategories();

    renderCategories();

    updateDashboard();

});

/*==================================================
    QUICK BUTTONS
==================================================*/

document
.getElementById("quickAddFlavor")
.onclick=()=>{

    openPage("flavors");

    addFlavorButton.click();

};

document
.getElementById("quickManageCategories")
.onclick=()=>{

    openPage("categories");

};

document
.getElementById("quickImages")
.onclick=()=>{

    openPage("images");

};

document
.getElementById("quickSettings")
.onclick=()=>{

    openPage("settings");

};

/*==================================================
    SETTINGS
==================================================*/

document
.getElementById("saveSettings")
.addEventListener("click",()=>{

    showToast("Settings saved");

});

/*==================================================
    TOAST
==================================================*/

const toast=document.getElementById("toast");

function showToast(message){

    toast.textContent=message;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}

/*==================================================
    LOADING
==================================================*/

const loading=document.getElementById("loadingOverlay");

function showLoading(){

    loading.classList.remove("hidden");

}

function hideLoading(){

    loading.classList.add("hidden");

}

/*==================================================
    INITIALIZE CMS
==================================================*/

async function initializeCMS(){

    showLoading();

    await loadCategories();

    await loadFlavors();

    renderCategories();

    renderFlavors();

    updateDashboard();

    hideLoading();

}

/*==================================================
    PAGE DEFAULT
==================================================*/

openPage("dashboard");
