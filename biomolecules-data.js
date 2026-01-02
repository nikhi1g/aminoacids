/**
 * Biomolecules Specific Data & Logic
 */

const biomolecules = [
    // Placeholder data
    { name: "Glucose", type: "Carbohydrate", details: "Simple sugar" },
    { name: "ATP", type: "Nucleotide", details: "Energy currency" }
];

// Basic logic placeholder
function renderBiomolecules() {
    console.log("Rendering biomolecules...", biomolecules);
    const grid = document.getElementById('biomolecule-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    if (biomolecules.length === 0) {
        grid.innerHTML = '<div class="col-span-full text-center text-slate-500 py-10">No biomolecules found.</div>';
        return;
    }

    biomolecules.forEach(bio => {
        const card = document.createElement('div');
        card.className = `bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm`;
        card.innerHTML = `
            <h3 class="text-lg font-bold text-slate-900 dark:text-white">${bio.name}</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">${bio.type}</p>
            <p class="mt-2 text-slate-600 dark:text-slate-300">${bio.details}</p>
        `;
        grid.appendChild(card);
    });
}

// Init
if (document.readyState === 'loading') {
    window.addEventListener('DOMContentLoaded', renderBiomolecules);
} else {
    renderBiomolecules();
}
