import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

/* ==========================================
   DATABASE
========================================== */

const flavorsCollection = collection(db, "flavors");

let flavors = [];

let editingFlavor = null;

/* ==========================================
   LOGIN
========================================== */

const loginScreen = document.getElementById("loginScreen");
const dashboard = document.getElementById("dashboard");

const passwordInput = document.getElementById("password");
const loginButton = document.getElementById("loginButton");

const PASSWORD = "JLato2026";

/* ==========================================
   MAIN ELEMENTS
========================================== */

const flavorContainer =
document.getElementById("flavorContainer");

const addFlavorButton =
document.getElementById("addFlavor");

const addFlavorModal =
document.getElementById("addFlavorModal");

const deleteModal =
document.getElementById("deleteModal");

const saveButton =
document.getElementById("saveButton");

const floatingSave =
document.getElementById("floatingSave");

const toast =
document.getElementById("toast");

/* ==========================================
   NEW FLAVOR INPUTS
========================================== */

const newFlavorName =
document.getElementById("newFlavorName");

const newFlavorPrice =
document.getElementById("newFlavorPrice");

const newFlavorDescription =
document.getElementById("newFlavorDescription");

const newFlavorCategory =
document.getElementById("newFlavorCategory");

/* ==========================================
   LOGIN
========================================== */

loginButton.addEventListener("click", login);

passwordInput.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){

        login();

    }

});

function login(){

    if(passwordInput.value!==PASSWORD){

        alert("Wrong password.");

        return;

    }

    loginScreen.classList.add("hidden");

    dashboard.classList.remove("hidden");

    loadFlavors();

}

/* ==========================================
   TOAST
========================================== */

function showToast(text){

    toast.innerHTML=text;

    toast.classList.add("show");

    setTimeout(()=>{

        toast.classList.remove("show");

    },2500);

}
/* ==========================================
   LOAD FLAVORS FROM FIREBASE
========================================== */

async function loadFlavors() {

    flavors = [];

    const q = query(
        flavorsCollection,
        orderBy("name")
    );

    const snapshot = await getDocs(q);

    snapshot.forEach((document)=>{

        flavors.push({

            id:document.id,

            ...document.data()

        });

    });

    renderFlavors();

}

/* ==========================================
   RENDER FLAVORS
========================================== */

function renderFlavors(){

    flavorContainer.innerHTML="";

    flavors.forEach((flavor)=>{

        const card=document.createElement("div");

        card.className="flavor-card";

        card.dataset.id=flavor.id;

        card.innerHTML=`

<div class="image-section">

<img
src="${flavor.image || "placeholder.png"}"
class="flavor-image"
alt="${flavor.name}">

</div>

<div class="flavor-details">

<div class="row">

<div class="field">

<label>Flavor Name</label>

<input
class="edit-name"
type="text"
value="${flavor.name}">

</div>

<div class="field small">

<label>Price</label>

<input
class="edit-price"
type="number"
value="${flavor.price}">

</div>

</div>

<div class="field">

<label>Description</label>

<textarea
class="edit-description"
rows="4">${flavor.description}</textarea>

</div>

<div class="row">

<div class="field">

<label>Category</label>

<select class="edit-category">

<option ${flavor.category==="Popular"?"selected":""}>Popular</option>

<option ${flavor.category==="Must Try"?"selected":""}>Must Try</option>

<option ${flavor.category==="Our Creation"?"selected":""}>Our Creation</option>

<option ${flavor.category==="Classic"?"selected":""}>Classic</option>

<option ${flavor.category==="Seasonal"?"selected":""}>Seasonal</option>

</select>

</div>

</div>

</div>

<div class="actions">

<button class="save-card">

💾 Save

</button>

<button class="delete-card">

🗑 Delete

</button>

</div>

`;

        flavorContainer.appendChild(card);

    });

    updateStats();

    attachCardEvents();

}
/* ==========================================
   CARD EVENTS
========================================== */

function attachCardEvents(){

    document.querySelectorAll(".save-card")
    .forEach((button)=>{

        button.onclick=saveCard;

    });

    document.querySelectorAll(".delete-card")
    .forEach((button)=>{

        button.onclick=deleteCard;

    });

}

/* ==========================================
   SAVE CARD
========================================== */

async function saveCard(e){

    const card=e.target.closest(".flavor-card");

    const id=card.dataset.id;

    await updateDoc(

        doc(db,"flavors",id),

        {

            name:card.querySelector(".edit-name").value,

            price:Number(

                card.querySelector(".edit-price").value

            ),

            description:

                card.querySelector(".edit-description").value,

            category:

                card.querySelector(".edit-category").value,

            updatedAt:Date.now()

        }

    );

    showToast("Flavor Updated");

    loadFlavors();

}

/* ==========================================
   DELETE CARD
========================================== */

async function deleteCard(e){

    if(!confirm("Delete this flavor?")){

        return;

    }

    const card=e.target.closest(".flavor-card");

    const id=card.dataset.id;

    await deleteDoc(

        doc(db,"flavors",id)

    );

    showToast("Flavor Deleted");

    loadFlavors();

}

/* ==========================================
   UPDATE STATS
========================================== */

function updateStats(){

    document.getElementById("flavorCount")
        .innerText=flavors.length;

    document.getElementById("categoryCount")
        .innerText=
        new Set(
            flavors.map(f=>f.category)
        ).size;

    document.getElementById("featuredCount")
        .innerText=
        flavors.filter(f=>f.featured).length;

    document.getElementById("availableCount")
        .innerText=
        flavors.filter(f=>f.available!==false).length;

}
/* ==========================================
   ADD FLAVOR MODAL
========================================== */

addFlavorButton.addEventListener("click",()=>{

    addFlavorModal.classList.remove("hidden");

});

document.querySelectorAll(".close-modal").forEach((button)=>{

    button.onclick=()=>{

        addFlavorModal.classList.add("hidden");

        deleteModal.classList.add("hidden");

    };

});

document.querySelectorAll(".cancel-button").forEach((button)=>{

    button.onclick=()=>{

        addFlavorModal.classList.add("hidden");

        deleteModal.classList.add("hidden");

    };

});

/* ==========================================
   ADD NEW FLAVOR
========================================== */

document.querySelector(".save-button")
.addEventListener("click",addFlavor);

async function addFlavor(){

    const name=newFlavorName.value.trim();

    const price=Number(newFlavorPrice.value);

    const description=
    newFlavorDescription.value.trim();

    const category=
    newFlavorCategory.value;

    if(name===""){

        alert("Please enter a flavor name.");

        return;

    }

    await addDoc(

        flavorsCollection,

        {

            name,

            price,

            description,

            category,

            image:"placeholder.png",

            featured:false,

            available:true,

            createdAt:Date.now(),

            updatedAt:Date.now()

        }

    );

    newFlavorName.value="";
    newFlavorPrice.value="";
    newFlavorDescription.value="";
    newFlavorCategory.selectedIndex=0;

    addFlavorModal.classList.add("hidden");

    showToast("Flavor Added");

    loadFlavors();

}

/* ==========================================
   GLOBAL SAVE BUTTON
========================================== */

saveButton.onclick=()=>{

    showToast("Everything is already saved.");

};

floatingSave.onclick=()=>{

    showToast("Everything is already saved.");

};
/* ==========================================
   SEARCH
========================================== */

const searchInput = document.getElementById("searchInput");

searchInput.addEventListener("input", () => {

    const text = searchInput.value.toLowerCase();

    document.querySelectorAll(".flavor-card").forEach((card) => {

        const name = card.querySelector(".edit-name")
            .value
            .toLowerCase();

        card.style.display =
            name.includes(text) ? "" : "none";

    });

});

/* ==========================================
   FEATURED
========================================== */

async function toggleFeatured(id, value) {

    await updateDoc(

        doc(db, "flavors", id),

        {

            featured: value,

            updatedAt: Date.now()

        }

    );

}

/* ==========================================
   AVAILABLE
========================================== */

async function toggleAvailable(id, value) {

    await updateDoc(

        doc(db, "flavors", id),

        {

            available: value,

            updatedAt: Date.now()

        }

    );

}

/* ==========================================
   LIVE REFRESH
========================================== */

setInterval(loadFlavors,30000);

/* ==========================================
   IMAGE URL
========================================== */

async function updateImage(id,url){

    await updateDoc(

        doc(db,"flavors",id),

        {

            image:url,

            updatedAt:Date.now()

        }

    );

}

/* ==========================================
   STARTUP
========================================== */

console.log("J.Lato Admin Ready");

showToast("Connected to Firebase");