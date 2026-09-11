document.addEventListener("DOMContentLoaded", () => {
    loadCustomerFlavors();
});

async function loadCustomerFlavors() {
    const grid = document.getElementById("customerFlavorsGrid");
    if (!grid) return;

    try {
        const response = await fetch("api.php?action=get_all");
        const data = await response.json();
        
        // Filter only active flavors to display to customers
        const activeFlavors = (data.flavors || []).filter(flavor => flavor.status === "active");

        if (activeFlavors.length === 0) {
            grid.innerHTML = `<p class="no-flavors">No gelato flavors available right now. Check back soon!</p>`;
            return;
        }

        grid.innerHTML = activeFlavors.map(flavor => `
            <div class="flavor-card">
                ${flavor.badge ? `<span class="badge">${flavor.badge}</span>` : ''}
                <div class="flavor-image-wrapper">
                    <img src="${flavor.image || 'https://via.placeholder.com/300x180?text=J.Lato+Gelato'}" alt="${flavor.name}">
                </div>
                <div class="flavor-info">
                    <span class="category-tag">${flavor.category || 'Specialty'}</span>
                    <h3>${flavor.name}</h3>
                    <p>${flavor.description || ''}</p>
                </div>
            </div>
        `).join("");

    } catch (error) {
        console.error("Error loading flavors for customer page:", error);
        grid.innerHTML = `<p class="error-msg">Unable to load flavors at this time.</p>`;
    }
}
