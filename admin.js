/* Global State */
let flavors = [];
let categories = [];
let currentFlavor = null;
let flavorToDelete = null;

/* API Base URL */
const API_URL = 'api.php';

/* DOM Elements */
const pages = document.querySelectorAll(".page");
const navItems = document.querySelectorAll(".nav-item");
const flavorsGrid = document.getElementById("flavorsGrid");
const categoriesList = document.getElementById("categoriesList");
const filterCategory = document.getElementById("filterCategory");
const filterStatus = document.getElementById("filterStatus");
const searchFlavor = document.getElementById("searchFlavor");

/* Modal Elements */
const flavorModal = document.getElementById("flavorModal");
const flavorForm = document.getElementById("flavorForm");
const modalTitle = document.getElementById("modalTitle");
const addFlavorButton = document.getElementById("addFlavorButton");
const closeFlavor = document.getElementById("closeFlavor");
const duplicateFlavorButton = document.getElementById("duplicateFlavorButton");
const deleteFlavorButton = document.getElementById("deleteFlavorButton");

/* Confirm Modal Elements */
const confirmModal = document.getElementById("confirmModal");
const cancelConfirm = document.getElementById("cancelConfirm");
const confirmDelete = document.getElementById("confirmDelete");

/* Category Elements */
const categoryNameInput = document.getElementById("categoryName");
const addCategoryButton = document.getElementById("addCategoryButton");

/* Dashboard Stat Elements */
const statFlavors = document.getElementById("statFlavors");
const statCategories = document.getElementById("statCategories");
const statImages = document.getElementById("statImages");

/* Image Upload Element */
const uploadImageButton = document.getElementById("uploadImageButton");

/*==================================================
    NAVIGATION SYSTEM
==================================================*/
function showPage(pageId) {
    pages.forEach(page => page.classList.remove("active"));
    navItems.forEach(item => item.classList.remove("active"));

    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add("active");
    }

    const activeNav = document.querySelector(`.nav-item[data-page="${pageId}"]`);
    if (activeNav) {
        activeNav.classList.add("active");
    }
}

navItems.forEach(item => {
    item.addEventListener("click", () => {
        const page = item.getAttribute("data-page");
        showPage(page);
    });
});

/* Sidebar Toggle */
const toggleSidebar = document.getElementById("toggleSidebar");
if (toggleSidebar) {
    toggleSidebar.addEventListener("click", () => {
        document.querySelector(".sidebar").classList.toggle("collapsed");
    });
}

/*==================================================
    FETCH DATA FROM PHP BACKEND
==================================================*/
async function loadData() {
    try {
        const response = await fetch(`${API_URL}?action=get_all`);
        const data = await response.json();

        flavors = data.flavors || [];
        categories = data.categories || [];

        renderFlavors();
        renderCategories();
        populateCategoryDropdowns();
        updateStats();
    } catch (error) {
        console.error("Error loading data from server:", error);
    }
}

/*==================================================
    DASHBOARD STATS
==================================================*/
function updateStats() {
    if (statFlavors) statFlavors.textContent = flavors.length;
    if (statCategories) statCategories.textContent = categories.length;
    if (statImages) statImages.textContent = flavors.filter(f => f.image).length;
}

/*==================================================
    RENDER FLAVORS
==================================================*/
function renderFlavors() {
    if (!flavorsGrid) return;

    const catFilter = filterCategory ? filterCategory.value : "all";
    const statusFilter = filterStatus ? filterStatus.value : "all";
    const searchQuery = searchFlavor ? searchFlavor.value.toLowerCase() : "";

    const filtered = flavors.filter(flavor => {
        const matchesCategory = (catFilter === "all" || flavor.category === catFilter);
        const matchesStatus = (statusFilter === "all" || flavor.status === statusFilter);
        const matchesSearch = flavor.name.toLowerCase().includes(searchQuery);
        return matchesCategory && matchesStatus && matchesSearch;
    });

    flavorsGrid.innerHTML = "";

    if (filtered.length === 0) {
        flavorsGrid.innerHTML = `<p class="no-results">No flavors found.</p>`;
        return;
    }

    filtered.forEach(flavor => {
        const card = document.createElement("div");
        card.className = "flavor-card";
        card.innerHTML = `
            <img class="flavor-image" src="${flavor.image || 'https://via.placeholder.com/300x180?text=No+Image'}" alt="${flavor.name}">
            <div class="flavor-content">
                <h3>${flavor.name}</h3>
                <p>${flavor.description || 'No description provided.'}</p>
                <span>${flavor.category || 'Uncategorized'}</span>
            </div>
        `;
        card.addEventListener("click", () => editFlavor(flavor));
        flavorsGrid.appendChild(card);
    });
}

/* Filter Handlers */
if (filterCategory) filterCategory.addEventListener("change", renderFlavors);
if (filterStatus) filterStatus.addEventListener("change", renderFlavors);
if (searchFlavor) searchFlavor.addEventListener("input", renderFlavors);

/*==================================================
    RENDER & MANAGE CATEGORIES
==================================================*/
function renderCategories() {
    if (!categoriesList) return;
    categoriesList.innerHTML = "";

    categories.forEach(cat => {
        const li = document.createElement("li");
        li.className = "category-item";
        li.innerHTML = `
            <span>${cat.name}</span>
            <button class="btn-icon delete-cat-btn"><i class="fa-solid fa-trash"></i></button>
        `;

        li.querySelector(".delete-cat-btn").addEventListener("click", async (e) => {
            e.stopPropagation();
            if (confirm(`Delete category "${cat.name}"?`)) {
                await fetch(`${API_URL}?action=delete_category&id=${cat.id}`, { method: 'DELETE' });
                await loadData();
            }
        });

        categoriesList.appendChild(li);
    });
}

function populateCategoryDropdowns() {
    const flavorCategorySelect = document.getElementById("flavorCategory");

    if (filterCategory) {
        const currentVal = filterCategory.value;
        filterCategory.innerHTML = `<option value="all">All Categories</option>`;
        categories.forEach(cat => {
            filterCategory.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });
        filterCategory.value = currentVal;
    }

    if (flavorCategorySelect) {
        flavorCategorySelect.innerHTML = `<option value="">Select Category</option>`;
        categories.forEach(cat => {
            flavorCategorySelect.innerHTML += `<option value="${cat.name}">${cat.name}</option>`;
        });
    }
}

if (addCategoryButton) {
    addCategoryButton.addEventListener("click", async () => {
        const name = categoryNameInput.value.trim();
        if (!name) return alert("Please enter a category name.");

        await fetch(`${API_URL}?action=add_category`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name })
        });

        categoryNameInput.value = "";
        await loadData();
    });
}

/*==================================================
    IMAGE UPLOAD HANDLER
==================================================*/
if (uploadImageButton) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";

    uploadImageButton.addEventListener("click", () => fileInput.click());

    fileInput.addEventListener("change", async () => {
        if (!fileInput.files[0]) return;

        const formData = new FormData();
        formData.append("image", fileInput.files[0]);

        try {
            const res = await fetch(`${API_URL}?action=upload_image`, {
                method: "POST",
                body: formData
            });
            const result = await res.json();

            if (result.status === "success") {
                alert("Image uploaded successfully!");
                const flavorImageInput = document.getElementById("flavorImage");
                if (flavorImageInput) flavorImageInput.value = result.url;
            } else {
                alert(result.message || "Upload failed");
            }
        } catch (err) {
            console.error("Upload error:", err);
        }
    });
}

/*==================================================
    FLAVOR MODAL ACTIONS & SAVE
==================================================*/
function openFlavorModal(flavor = null) {
    currentFlavor = flavor;
    flavorModal.classList.add("active");

    if (flavor) {
        modalTitle.textContent = "Edit Flavor";
        document.getElementById("flavorName").value = flavor.name || "";
        document.getElementById("flavorCategory").value = flavor.category || "";
        document.getElementById("flavorDescription").value = flavor.description || "";
        document.getElementById("flavorImage").value = flavor.image || "";
        document.getElementById("flavorBadge").value = flavor.badge || "";
        document.getElementById("flavorStatus").value = flavor.status || "active";

        duplicateFlavorButton.style.display = "inline-block";
        deleteFlavorButton.style.display = "inline-block";
    } else {
        modalTitle.textContent = "Add New Flavor";
        flavorForm.reset();

        duplicateFlavorButton.style.display = "none";
        deleteFlavorButton.style.display = "none";
    }
}

function editFlavor(flavor) {
    openFlavorModal(flavor);
}

if (addFlavorButton) {
    addFlavorButton.addEventListener("click", () => openFlavorModal(null));
}

if (closeFlavor) {
    closeFlavor.addEventListener("click", () => {
        flavorModal.classList.remove("active");
        currentFlavor = null;
    });
}

/* Save Flavor Handler */
if (flavorForm) {
    flavorForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const payload = {
            name: document.getElementById("flavorName").value.trim(),
            category: document.getElementById("flavorCategory").value,
            description: document.getElementById("flavorDescription").value.trim(),
            image: document.getElementById("flavorImage").value.trim(),
            badge: document.getElementById("flavorBadge").value.trim(),
            status: document.getElementById("flavorStatus").value
        };

        if (currentFlavor) {
            payload.id = currentFlavor.id;
            await fetch(`${API_URL}?action=update_flavor`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        } else {
            await fetch(`${API_URL}?action=add_flavor`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
        }

        flavorModal.classList.remove("active");
        currentFlavor = null;
        flavorForm.reset();
        await loadData();
    });
}

/* Duplicate Flavor */
if (duplicateFlavorButton) {
    duplicateFlavorButton.addEventListener("click", async () => {
        if (!currentFlavor) return;

        const copy = {
            name: `${currentFlavor.name} (Copy)`,
            category: currentFlavor.category || "",
            description: currentFlavor.description || "",
            image: currentFlavor.image || "",
            badge: currentFlavor.badge || "",
            status: currentFlavor.status || "active"
        };

        await fetch(`${API_URL}?action=add_flavor`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(copy)
        });

        flavorModal.classList.remove("active");
        currentFlavor = null;
        await loadData();
    });
}

/* Delete Flavor Flow */
if (deleteFlavorButton) {
    deleteFlavorButton.addEventListener("click", () => {
        if (!currentFlavor) return;
        flavorToDelete = currentFlavor;
        confirmModal.classList.add("active");
    });
}

if (cancelConfirm) {
    cancelConfirm.addEventListener("click", () => {
        confirmModal.classList.remove("active");
        flavorToDelete = null;
    });
}

if (confirmDelete) {
    confirmDelete.addEventListener("click", async () => {
        if (flavorToDelete) {
            await fetch(`${API_URL}?action=delete_flavor&id=${flavorToDelete.id}`, { method: 'DELETE' });
            confirmModal.classList.remove("active");
            flavorModal.classList.remove("active");
            flavorToDelete = null;
            currentFlavor = null;
            await loadData();
        }
    });
}

/*==================================================
    QUICK ACTIONS (DASHBOARD)
==================================================*/
const quickAddFlavor = document.getElementById("quickAddFlavor");
const quickManageCategories = document.getElementById("quickManageCategories");
const quickImages = document.getElementById("quickImages");
const quickSettings = document.getElementById("quickSettings");

if (quickAddFlavor) {
    quickAddFlavor.onclick = () => {
        showPage("flavors");
        openFlavorModal(null);
    };
}

if (quickManageCategories) {
    quickManageCategories.onclick = () => showPage("categories");
}

if (quickImages) {
    quickImages.onclick = () => showPage("images");
}

if (quickSettings) {
    quickSettings.onclick = () => showPage("settings");
}

/* Initial Load & Page Setup */
showPage("dashboard");
loadData();
