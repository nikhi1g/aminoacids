/**
 * Shared Data & Logic
 */

const aminoAcids = [
    { name: "Alanine", abbr3: "Ala", abbr1: "A", pka1: 2.34, pka2: 9.69, pkaR: null, smiles: "CC([NH2])C(=O)[O][H]", tags: ["nonpolar", "aliphatic"] },
    { name: "Arginine", abbr3: "Arg", abbr1: "R", pka1: 2.17, pka2: 9.04, pkaR: 12.48, smiles: "[H][N]=C([NH2])[NH]CCCC([NH2])C(=O)[O][H]", tags: ["polar", "basic"] },
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
// This will be replaced by the build pipeline
const BUILD_COMMIT = 'DEV_VERSION'; 
const mainStrategy = { width: 250, height: 220, bondThickness: 1.6, bondLength: 18, padding: 30, terminalCarbons: false, explicitHydrogens: true, condenseNodes: false, compactDrawing: false };
const PROGRESS_STORAGE_KEY = 'aa_progress_v1';
const COMMIT_POLL_MS = 300000;
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
let initialCommitPromise = null;

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

async function fetchLocalCommitMeta() {
    try {
        const response = await fetch(`commit.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) return null;
        const data = await response.json();
        if (!data || !data.commit) return null;
        return {
            commit: data.commit,
            commit_date: data.build_time,
            message: data.message
        };
    } catch (err) {
        return null;
    }
}

async function fetchCommitMeta() {
    const prefetch = !currentCommitHash ? window.__commitMetaPromise : null;
    if (prefetch) {
        const meta = await prefetch;
        if (meta && meta.commit) return meta;
    }
    return fetchLocalCommitMeta();
}

function updateHeaderCommit(meta) {
    const el = document.getElementById('commit-hash');
    if (el) {
        el.textContent = meta && meta.commit ? meta.commit.slice(0, 7) : 'unknown';
    }
}

function createUpdateModal(oldHash, newHash, message) {
    if (document.getElementById('update-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'update-modal';
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in';
    
    modal.innerHTML = `
        <div class="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 dark:border-slate-800 transform transition-all scale-100">
            <div class="p-6">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white">Update Available</h3>
                    <span class="px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider">New Version</span>
                </div>
                
                <div class="space-y-4">
                    <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Version Change</p>
                        <div class="flex items-center gap-3 text-sm font-mono">
                            <span class="text-slate-500 line-through decoration-red-500/50">${oldHash ? oldHash.slice(0, 7) : 'xxxxxxx'}</span>
                            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/></svg>
                            <span class="text-green-600 font-bold bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">${newHash.slice(0, 7)}</span>
                        </div>
                    </div>

                    ${message ? `
                    <div class="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800">
                        <p class="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">What's New</p>
                        <p class="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed max-h-40 overflow-y-auto">${message}</p>
                    </div>
                    ` : ''}
                </div>
                
                <div class="mt-8">
                    <button onclick="window.location.reload()" class="w-full py-3.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-lg hover:shadow-blue-500/25 transition-all transform hover:scale-[1.02] active:scale-[0.98]">
                        Update Now
                    </button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

async function checkForCommitUpdate() {
    const latestMeta = await (currentCommitHash ? fetchCommitMeta() : (initialCommitPromise || fetchCommitMeta()));
    if (!latestMeta || !latestMeta.commit) return;
    if (!currentCommitHash) {
        currentCommitHash = latestMeta.commit;
        updateHeaderCommit(latestMeta);
        return;
    }
    if (latestMeta.commit !== currentCommitHash) {
        createUpdateModal(currentCommitHash, latestMeta.commit, latestMeta.message);
        currentCommitHash = latestMeta.commit;
    }
}

function initCommitWatcher() {
    if (BUILD_COMMIT !== 'DEV_VERSION') {
        currentCommitHash = BUILD_COMMIT;
        updateHeaderCommit({ commit: BUILD_COMMIT });
    } else {
        initialCommitPromise = fetchCommitMeta();
        initialCommitPromise.then((meta) => {
            if (meta && meta.commit && !currentCommitHash) {
                currentCommitHash = meta.commit;
                updateHeaderCommit(meta);
            }
        });
    }

    if (window.__commitMetaPromise) {
        window.__commitMetaPromise = null;
    }

    setInterval(() => {
        initialCommitPromise = null;
        checkForCommitUpdate();
    }, COMMIT_POLL_MS);
    window.addEventListener('focus', checkForCommitUpdate);
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            checkForCommitUpdate();
        }
    });
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
window.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    updateFilterUI();
    initCommitWatcher();
});
