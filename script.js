/**
 * Shared Data & Logic
 */

const aminoAcids = [
    { name: "Alanine", abbr3: "Ala", abbr1: "A", pka1: 2.34, pka2: 9.69, pkaR: null, smiles: "CC([NH2])C(=O)[O][H]", tags: ["nonpolar", "aliphatic"] },
    { name: "Arginine", abbr3: "Arg", abbr1: "R", pka1: 2.17, pka2: 9.04, pkaR: 12.48, smiles: "[H][N]=C([NH2])[NH]CCCNC([NH2])C(=O)[O][H]", tags: ["polar", "basic"] },
    { name: "Asparagine", abbr3: "Asn", abbr1: "N", pka1: 2.02, pka2: 8.80, pkaR: null, smiles: "[NH2]C(CC(=O)[NH2])C(=O)[O][H]", tags: ["polar"] },
    { name: "Aspartic Acid", abbr3: "Asp", abbr1: "D", pka1: 1.88, pka2: 9.60, pkaR: 3.65, smiles: "[NH2]C(CC(=O)[O][H])C(=O)[O][H]", tags: ["polar", "acidic"] },
    { name: "Cysteine", abbr3: "Cys", abbr1: "C", pka1: 1.96, pka2: 10.28, pkaR: 8.18, smiles: "[NH2]C(C[SH])C(=O)[O][H]", tags: ["polar", "sulfur"] },
    { name: "Glutamine", abbr3: "Gln", abbr1: "Q", pka1: 2.17, pka2: 9.13, pkaR: null, smiles: "[NH2]C(CCC(=O)[NH2])C(=O)[O][H]", tags: ["polar"] },
    { name: "Glutamic Acid", abbr3: "Glu", abbr1: "E", pka1: 2.19, pka2: 9.67, pkaR: 4.25, smiles: "[NH2]C(CCC(=O)[O][H])C(=O)[O][H]", tags: ["polar", "acidic"] },
    { name: "Glycine", abbr3: "Gly", abbr1: "G", pka1: 2.34, pka2: 9.60, pkaR: null, smiles: "[NH2]CC(=O)[O][H]", tags: ["nonpolar", "aliphatic"] },
    { name: "Histidine", abbr3: "His", abbr1: "H", pka1: 1.82, pka2: 9.17, pkaR: 6.00, smiles: "[NH2]C(CC1=CN=C[NH]1)C(=O)[O][H]", tags: ["polar", "basic", "aromatic"] },
    { name: "Isoleucine", abbr3: "Ile", abbr1: "I", pka1: 2.36, pka2: 9.68, pkaR: null, smiles: "CCC(C)C([NH2])C(=O)[O][H]", tags: ["nonpolar", "aliphatic"] },
    { name: "Leucine", abbr3: "Leu", abbr1: "L", pka1: 2.36, pka2: 9.60, pkaR: null, smiles: "CC(C)CC([NH2])C(=O)[O][H]", tags: ["nonpolar", "aliphatic"] },
    { name: "Lysine", abbr3: "Lys", abbr1: "K", pka1: 2.18, pka2: 8.95, pkaR: 10.53, smiles: "[NH2]CCCC([NH2])C(=O)[O][H]", tags: ["polar", "basic"] },
    { name: "Methionine", abbr3: "Met", abbr1: "M", pka1: 2.28, pka2: 9.21, pkaR: null, smiles: "CSCCC([NH2])C(=O)[O][H]", tags: ["nonpolar", "sulfur"] },
    { name: "Phenylalanine", abbr3: "Phe", abbr1: "F", pka1: 1.83, pka2: 9.13, pkaR: null, smiles: "[NH2]C(CC1=CC=CC=C1)C(=O)[O][H]", tags: ["nonpolar", "aromatic"] },
    { name: "Proline", abbr3: "Pro", abbr1: "P", pka1: 1.99, pka2: 10.60, pkaR: null, smiles: "[H][O]C(=O)C1CCCN1", tags: ["nonpolar", "aliphatic"] },
    { name: "Serine", abbr3: "Ser", abbr1: "S", pka1: 2.21, pka2: 9.15, pkaR: null, smiles: "[NH2]C(C[OH])C(=O)[O][H]", tags: ["polar", "hydroxyl"] },
    { name: "Threonine", abbr3: "Thr", abbr1: "T", pka1: 2.11, pka2: 9.62, pkaR: null, smiles: "CC([OH])C([NH2])C(=O)[O][H]", tags: ["polar", "hydroxyl"] },
    { name: "Tryptophan", abbr3: "Trp", abbr1: "W", pka1: 2.38, pka2: 9.39, pkaR: null, smiles: "[NH2]C(CC1=CNC2=C1C=CC=C2)C(=O)[O][H]", tags: ["nonpolar", "aromatic"] },
    { name: "Tyrosine", abbr3: "Tyr", abbr1: "Y", pka1: 2.20, pka2: 9.11, pkaR: 10.07, smiles: "[NH2]C(CC1=CC=C([OH])C=C1)C(=O)[O][H]", tags: ["polar", "aromatic", "hydroxyl"] },
    { name: "Valine", abbr3: "Val", abbr1: "V", pka1: 2.32, pka2: 9.62, pkaR: null, smiles: "CC(C)C([NH2])C(=O)[O][H]", tags: ["nonpolar", "aliphatic"] }
];

const INITIAL_SMILES = aminoAcids.map(aa => aa.smiles);
let isDarkMode = false;
const mainStrategy = { width: 250, height: 220, bondThickness: 1.6, bondLength: 18, padding: 30, terminalCarbons: false, explicitHydrogens: true, condenseNodes: false, compactDrawing: false };
const PROGRESS_STORAGE_KEY = 'aa_progress_v1';
const COMMIT_JSON_PATH = 'commit.json';
const DEFAULT_PROGRESS_ITEM = {
    correctStreak: 0,
    totalCorrect: 0,
    totalWrong: 0,
    lastSeen: null,
    mastered: false
};

const tagColors = {
    'nonpolar': 'border-gray-400 text-gray-600',
    'polar': 'border-cyan-400 text-cyan-600',
    'aliphatic': 'border-amber-400 text-amber-600',
    'aromatic': 'border-purple-400 text-purple-600',
    'acidic': 'border-red-400 text-red-600',
    'basic': 'border-blue-400 text-blue-600',
    'hydroxyl': 'border-teal-400 text-teal-600',
    'sulfur': 'border-yellow-400 text-yellow-600'
};

const colorMap = {
    'nonpolar': '#9ca3af', // gray-400
    'polar': '#22d3ee', // cyan-400
    'aliphatic': '#fbbf24', // amber-400
    'aromatic': '#c084fc', // purple-400
    'acidic': '#f87171', // red-400
    'basic': '#60a5fa', // blue-400
    'hydroxyl': '#2dd4bf', // teal-400
    'sulfur': '#facc15'  // yellow-400
};

let currentCommitHash = null;
const DEFAULT_HEADER_HTML = `
<header class="bg-white dark:bg-slate-900 border-b dark:border-slate-800 sticky top-0 z-20 shadow-sm transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col space-y-4 py-4">
            <div class="flex justify-between items-center h-16">
                <div class="flex flex-col">
                    <span class="text-xs font-semibold uppercase tracking-widest text-slate-400">Amino Acid Explorer</span>
                    <span class="text-[10px] text-slate-500">Deployed Commit: <span id="commit-hash">loading...</span></span>
                </div>
                <div class="flex items-center space-x-6">
                    <nav class="flex space-x-8">
                        <a href="index.html" data-page="show" class="nav-link py-5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Show</a>
                        <a href="learn.html" data-page="learn" class="nav-link py-5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Learn</a>
                        <a href="recall.html" data-page="recall" class="nav-link py-5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Recall</a>
                        <a href="draw.html" data-page="draw" class="nav-link py-5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Draw</a>
                        <a href="progress.html" data-page="progress" class="nav-link py-5 text-sm font-medium text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">Progress</a>
                    </nav>
                    <button onclick="toggleDarkMode()" class="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0" title="Toggle Dark/Light Mode">
                        <svg id="sun-icon" class="hidden dark:block w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 0 000-8z"></path>
                        </svg>
                        <svg id="moon-icon" class="block dark:hidden w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                        </svg>
                    </button>
                </div>
            </div>
            <div id="filter-bar" class="flex flex-wrap gap-2 justify-center pb-2">
                <button onclick="applyFilter('all')" class="filter-btn active px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:opacity-80">All</button>
                <button onclick="applyFilter('nonpolar')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-gray-400 text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-900/30">Non-polar</button>
                <button onclick="applyFilter('polar')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-cyan-400 text-cyan-600 hover:bg-cyan-50 dark:hover:bg-cyan-900/30">Polar</button>
                <button onclick="applyFilter('aliphatic')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-amber-400 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/30">Aliphatic</button>
                <button onclick="applyFilter('aromatic')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-purple-400 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30">Aromatic</button>
                <button onclick="applyFilter('acidic')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-red-400 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30">Acidic</button>
                <button onclick="applyFilter('basic')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-blue-400 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30">Basic</button>
                <button onclick="applyFilter('hydroxyl')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-teal-400 text-teal-600 hover:bg-teal-50 dark:hover:bg-teal-900/30">Hydroxyl</button>
                <button onclick="applyFilter('sulfur')" class="filter-btn px-3 py-1.5 rounded-full text-[10px] font-bold transition-all border bg-white dark:bg-slate-900 border-yellow-400 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-900/30">Sulfur</button>
            </div>
        </div>
    </div>
</header>
`;
const DEFAULT_FOOTER_HTML = `
<div id="update-banner" class="hidden fixed inset-x-0 bottom-4 z-50 flex justify-center px-4">
    <div class="bg-slate-900 text-white rounded-2xl shadow-2xl px-5 py-3 flex flex-col sm:flex-row items-center gap-3">
        <span class="text-sm font-semibold">New version available (<span data-commit></span>). Refresh to update.</span>
        <button id="refresh-site-btn" class="px-3 py-1.5 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors">Refresh</button>
    </div>
</div>
`;

// --- Shared Functions ---

function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    }
    
    // Dispatch custom event for page-specific handling
    window.dispatchEvent(new CustomEvent('themeChanged'));
}

async function loadShell() {
    const headerHost = document.getElementById('site-header');
    const footerHost = document.getElementById('site-footer');
    if (headerHost) {
        try {
            const res = await fetch(`partials/header.html?t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                headerHost.innerHTML = await res.text();
            } else {
                headerHost.innerHTML = DEFAULT_HEADER_HTML;
            }
        } catch (err) {
            headerHost.innerHTML = DEFAULT_HEADER_HTML;
        }
    }
    if (footerHost) {
        try {
            const res = await fetch(`partials/footer.html?t=${Date.now()}`, { cache: 'no-store' });
            if (res.ok) {
                footerHost.innerHTML = await res.text();
            } else {
                footerHost.innerHTML = DEFAULT_FOOTER_HTML;
            }
        } catch (err) {
            footerHost.innerHTML = DEFAULT_FOOTER_HTML;
        }
    }

    const page = document.body.getAttribute('data-page');
    if (page) {
        document.querySelectorAll('a[data-page]').forEach((link) => {
            if (link.getAttribute('data-page') === page) {
                link.classList.add('active', 'text-blue-600', 'border-b-2', 'border-blue-600');
                link.classList.remove('text-slate-500', 'dark:text-slate-400');
            }
        });
    }

    const showFilters = document.body.getAttribute('data-show-filters');
    const filterBar = document.getElementById('filter-bar');
    if (filterBar && showFilters === 'false') {
        filterBar.classList.add('hidden');
    }
}

function initializeTheme() {
    // Check localStorage first, then system preference
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        isDarkMode = true;
        document.documentElement.classList.add('dark');
    } else {
        isDarkMode = false;
        document.documentElement.classList.remove('dark');
    }
}

function handleSmilesEdit(index, newSmiles) {
    aminoAcids[index].smiles = newSmiles;
    const canvasId = `canvas-${index}`;
    const SmiDrawer = window.SmiDrawer || SmilesDrawer.SmiDrawer;
    const smilesDrawer = new SmiDrawer(mainStrategy);
    try {
        smilesDrawer.draw(newSmiles, `#${canvasId}`, isDarkMode ? 'dark' : 'light');
    } catch (err) {
        console.warn("Invalid SMILES string:", newSmiles);
    }
}

function resetSmiles(index) {
    const original = INITIAL_SMILES[index];
    const input = document.getElementById(`input-${index}`);
    if (input) {
        input.value = original;
        handleSmilesEdit(index, original);
    }
}

// Global Filter State (managed via URL params or session storage could be better, but variable for now)
// Since we are splitting pages, we can use sessionStorage to persist filter across pages
let currentFilter = sessionStorage.getItem('aa_filter') || 'all';

function applyFilter(filter) {
    currentFilter = filter;
    sessionStorage.setItem('aa_filter', filter);
    updateFilterUI();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('filterChanged', { detail: { filter } }));
}

function updateFilterUI() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const btnFilter = btn.textContent.toLowerCase().replace('-', '');
        btn.style.backgroundColor = '';
        btn.style.color = '';
        
        if (btnFilter === currentFilter || (currentFilter === 'all' && btn.textContent === 'All')) {
            if (currentFilter === 'all') {
                btn.style.backgroundColor = '#e2e8f0'; 
                btn.style.color = '#475569'; 
            } else {
                btn.style.backgroundColor = colorMap[currentFilter] || '#e2e8f0';
                btn.style.color = 'white';
            }
        }
    });
}

function getFilteredAminoAcids() {
    return currentFilter === 'all' 
        ? aminoAcids 
        : aminoAcids.filter(aa => aa.tags && aa.tags.includes(currentFilter));
}

async function fetchCommitHash() {
    try {
        const response = await fetch(`${COMMIT_JSON_PATH}?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) return null;
        const data = await response.json();
        if (!data || typeof data.commit !== 'string') return null;
        return data.commit;
    } catch (err) {
        return null;
    }
}

function updateFooterCommit(hash) {
    const el = document.getElementById('commit-hash');
    if (!el) return;
    el.textContent = hash ? hash.slice(0, 7) : 'unknown';
}

function showUpdateBanner(newHash) {
    const banner = document.getElementById('update-banner');
    if (!banner) return;
    const hashEl = banner.querySelector('[data-commit]');
    if (hashEl) {
        hashEl.textContent = newHash ? newHash.slice(0, 7) : '';
    }
    banner.classList.remove('hidden');
}

async function checkForCommitUpdate() {
    const latestHash = await fetchCommitHash();
    if (!latestHash) return;
    if (!currentCommitHash) {
        currentCommitHash = latestHash;
        updateFooterCommit(currentCommitHash);
        return;
    }
    if (latestHash !== currentCommitHash) {
        updateFooterCommit(latestHash);
        showUpdateBanner(latestHash);
        currentCommitHash = latestHash;
    }
}

function initCommitWatcher() {
    const refreshBtn = document.getElementById('refresh-site-btn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            window.location.reload();
        });
    }
    checkForCommitUpdate();
    setInterval(checkForCommitUpdate, 30000);
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
        if (!raw) return { version: 1, items: {} };
        const parsed = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object') return { version: 1, items: {} };
        if (!parsed.items || typeof parsed.items !== 'object') parsed.items = {};
        return parsed;
    } catch (err) {
        return { version: 1, items: {} };
    }
}

function saveProgress(progress) {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(progress));
}

function getProgressItem(progress, abbr3) {
    if (!progress.items[abbr3]) {
        progress.items[abbr3] = { ...DEFAULT_PROGRESS_ITEM };
    } else {
        progress.items[abbr3] = { ...DEFAULT_PROGRESS_ITEM, ...progress.items[abbr3] };
    }
    return progress.items[abbr3];
}

// Init
window.addEventListener('DOMContentLoaded', async () => {
    await loadShell();
    initializeTheme();
    updateFilterUI();
    initCommitWatcher();
    window.dispatchEvent(new CustomEvent('shellLoaded'));
});
