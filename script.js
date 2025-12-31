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
console.log("Runtime BUILD_COMMIT:", BUILD_COMMIT);
const mainStrategy = { width: 250, height: 220, bondThickness: 1.6, bondLength: 18, padding: 30, terminalCarbons: false, explicitHydrogens: true, condenseNodes: false, compactDrawing: false };
const PROGRESS_STORAGE_KEY = 'aa_progress_v1';
const COMMIT_POLL_MS = 300000;
const COMMIT_MESSAGE_MAX_LEN = 40;
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
let currentCommitMeta = null;
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

    document.querySelectorAll('.filter-select').forEach(select => {
        if (select.value !== currentFilter) {
            select.value = currentFilter;
        }
    });
}

function getFilteredAminoAcids() {
    return currentFilter === 'all' 
        ? aminoAcids 
        : aminoAcids.filter(aa => aa.tags && aa.tags.includes(currentFilter));
}

function setHeaderHidden(hidden) {
    const header = document.querySelector('header');
    if (!header) return;
    header.classList.toggle('header-hidden-mobile', hidden);
}

function initMobileHeaderAutoHide() {
    const header = document.querySelector('header');
    if (!header) return;
    const mobileQuery = window.matchMedia('(max-width: 640px)');
    let lastScrollY = window.scrollY;

    const onScroll = () => {
        if (!mobileQuery.matches) {
            setHeaderHidden(false);
            lastScrollY = window.scrollY;
            return;
        }
        const current = window.scrollY;
        if (current <= 0) {
            setHeaderHidden(false);
            lastScrollY = current;
            return;
        }
        if (current > lastScrollY + 6) {
            setHeaderHidden(true);
        } else if (current < lastScrollY - 6) {
            setHeaderHidden(false);
        }
        lastScrollY = current;
    };

    const onTopTap = (event) => {
        if (!mobileQuery.matches) return;
        const touch = event.touches && event.touches[0];
        const y = touch ? touch.clientY : event.clientY;
        if (y <= 24) {
            setHeaderHidden(false);
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
        if (!mobileQuery.matches) {
            setHeaderHidden(false);
        }
        lastScrollY = window.scrollY;
    });
    document.addEventListener('touchstart', onTopTap, { passive: true });
    document.addEventListener('pointerdown', onTopTap, { passive: true });
}

async function fetchLocalCommitMeta() {
    try {
        const response = await fetch(`commit.json?t=${Date.now()}`, { cache: 'no-store' });
        if (!response.ok) {
            console.warn("Failed to fetch commit.json");
            return null;
        }
        const text = await response.text();
        const data = parseCommitJson(text);
        if (!data || !isValidCommitHash(data.commit)) return null;
        const normalized = {
            commit: data.commit.trim(),
            commit_date: data.build_time || data.commit_date,
            message: data.message
        };
        console.log("Local commit meta:", normalized);
        return {
            commit: normalized.commit,
            commit_date: normalized.commit_date,
            message: normalized.message
        };
    } catch (err) {
        console.error("Error fetching local commit meta:", err);
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

function getShortCommitHash(meta) {
    if (!meta || !meta.commit) return 'unknown';
    return meta.commit.slice(0, 7);
}

function isValidCommitHash(value) {
    if (typeof value !== 'string') return false;
    const trimmed = value.trim();
    return /^[0-9a-f]{7,40}$/i.test(trimmed);
}

function parseCommitJson(text) {
    if (!text) return null;
    const cleanedText = text.replace(/\uFEFF/g, '').trim();
    if (!cleanedText) return null;
    try {
        const parsed = JSON.parse(cleanedText);
        if (Array.isArray(parsed)) {
            return parsed.length ? parsed[parsed.length - 1] : null;
        }
        return parsed;
    } catch (err) {
        const lines = cleanedText.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
        for (let i = lines.length - 1; i >= 0; i -= 1) {
            try {
                return JSON.parse(lines[i]);
            } catch (lineErr) {
                continue;
            }
        }
        const commitMatches = [...cleanedText.matchAll(/"commit"\s*:\s*"([^"]+)"/g)];
        if (commitMatches.length) {
            const buildMatches = [...cleanedText.matchAll(/"build_time"\s*:\s*"([^"]+)"/g)];
            const messageMatches = [...cleanedText.matchAll(/"message"\s*:\s*"([^"]+)"/g)];
            return {
                commit: commitMatches[commitMatches.length - 1][1],
                build_time: buildMatches.length ? buildMatches[buildMatches.length - 1][1] : null,
                message: messageMatches.length ? messageMatches[messageMatches.length - 1][1] : null
            };
        }
        console.error("JSON Parse Error. Raw text:", text);
        return null;
    }
}

function formatCommitMessage(meta, maxLen = COMMIT_MESSAGE_MAX_LEN) {
    if (!meta || typeof meta.message !== 'string') return 'no message';
    const cleaned = meta.message.replace(/\s+/g, ' ').trim();
    if (!cleaned) return 'no message';
    if (cleaned.length <= maxLen) return cleaned;
    const clipped = cleaned.slice(0, Math.max(0, maxLen - 3));
    return `${clipped}...`;
}

function formatCommitDate(meta) {
    if (!meta || !meta.commit_date) return null;
    return meta.commit_date;
}

function updateHeaderCommit(meta) {
    const el = document.getElementById('commit-hash');
    if (el) {
        const hash = getShortCommitHash(meta);
        const date = formatCommitDate(meta) || (hash !== 'unknown' ? 'Unknown' : null);
        currentCommitMeta = meta;
        el.textContent = '';
        el.className = 'inline-flex flex-wrap items-center gap-2';

        const hashSpan = document.createElement('span');
        hashSpan.textContent = hash;
        hashSpan.className = 'font-mono text-slate-600 dark:text-slate-300';
        el.appendChild(hashSpan);

        if (date) {
            const dateSpan = document.createElement('span');
            dateSpan.textContent = date;
            dateSpan.className = 'text-slate-400';
            el.appendChild(dateSpan);
        }

        if (hash !== 'unknown') {
            el.title = meta && meta.message ? meta.message : 'View version info';
            el.style.cursor = 'pointer';
            el.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                showVersionInfo(meta);
            };
            el.classList.add('underline', 'decoration-dotted', 'decoration-slate-400', 'underline-offset-4');
        } else {
            el.style.cursor = 'default';
            el.onclick = null;
            el.removeAttribute('title');
            el.classList.remove('underline', 'decoration-dotted', 'decoration-slate-400', 'underline-offset-4');
        }
    }
}

function showVersionInfo(meta) {
    const existing = document.getElementById('version-popover');
    if (existing) {
        closeVersionInfo();
        return;
    }

    const hashEl = document.getElementById('commit-hash');
    if (!hashEl) return;
    const trigger = hashEl.closest('.rounded-xl') || hashEl.parentElement;
    const rect = trigger.getBoundingClientRect();

    const popover = document.createElement('div');
    popover.id = 'version-popover';
    popover.className = 'absolute z-50 mt-1 w-72 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden p-4 text-xs shadow-slate-200/50 dark:shadow-black/50 origin-top-left transition-all';
    
    // Position directly below the trigger
    popover.style.top = `${rect.bottom + window.scrollY + 4}px`;
    popover.style.left = `${rect.left + window.scrollX}px`;

    popover.innerHTML = `
                    <div class="space-y-3">
                        <div class="font-mono text-slate-600 dark:text-slate-300 select-all break-all">${meta.commit}</div>
                        <div class="text-slate-600 dark:text-slate-300">${meta.commit_date || 'Unknown'}</div>
                        ${meta.message ? `
                        <div class="text-slate-600 dark:text-slate-300 leading-relaxed max-h-32 overflow-y-auto scrollbar-thin">${meta.message}</div>
                        ` : ''}
                    </div>    `;

    document.body.appendChild(popover);

    // Add listeners to close
    window.addEventListener('scroll', closeVersionInfo, { capture: true, once: true });
    window.addEventListener('resize', closeVersionInfo, { capture: true, once: true });
    
    // Slight delay to prevent immediate closing if the click event bubbles up
    setTimeout(() => {
        document.addEventListener('click', closeVersionInfoOutside);
    }, 10);
}

function closeVersionInfo() {
    const el = document.getElementById('version-popover');
    if (el) el.remove();
    cleanupVersionListeners();
}

function closeVersionInfoOutside(e) {
    const popover = document.getElementById('version-popover');
    const hashEl = document.getElementById('commit-hash');
    // If click is not inside popover and not on the hash element (trigger)
    if (popover && !popover.contains(e.target) && hashEl && !hashEl.contains(e.target)) {
        closeVersionInfo();
    }
}

function cleanupVersionListeners() {
    window.removeEventListener('scroll', closeVersionInfo, { capture: true });
    window.removeEventListener('resize', closeVersionInfo, { capture: true });
    document.removeEventListener('click', closeVersionInfoOutside);
}

function showInlineCommitUpdate(oldMeta, newMeta) {
    const el = document.getElementById('commit-hash');
    if (!el) return;

    const oldLabel = `${getShortCommitHash(oldMeta)} (${formatCommitMessage(oldMeta)})`;
    const newLabel = `${getShortCommitHash(newMeta)} (${formatCommitMessage(newMeta)})`;

    el.textContent = '';
    el.className = 'inline-flex flex-wrap items-center gap-2';

    const textSpan = document.createElement('span');
    textSpan.textContent = `${oldLabel} --> ${newLabel}`;
    textSpan.className = 'text-slate-600 dark:text-slate-300';
    el.appendChild(textSpan);

    const badge = document.createElement('span');
    badge.textContent = 'New';
    badge.className = 'inline-flex items-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-widest';
    el.appendChild(badge);

    const refreshButton = document.createElement('button');
    refreshButton.type = 'button';
    refreshButton.textContent = 'Refresh';
    refreshButton.className = 'px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-600 text-white hover:bg-blue-700 transition-colors';
    refreshButton.addEventListener('click', (event) => {
        event.stopPropagation();
        window.location.reload();
    });
    el.appendChild(refreshButton);

    el.title = 'New version available. Refresh to update.';
    el.style.cursor = 'pointer';
    el.onclick = () => showVersionInfo(oldMeta);
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
        const oldMeta = currentCommitMeta || (currentCommitHash ? { commit: currentCommitHash } : null);
        showInlineCommitUpdate(oldMeta, latestMeta);
        currentCommitHash = latestMeta.commit;
    }
}

function initCommitWatcher() {
    if (BUILD_COMMIT !== 'DEV_VERSION') {
        currentCommitHash = BUILD_COMMIT;
        updateHeaderCommit({ commit: BUILD_COMMIT });
    } else {
        // Fallback for dev mode or failed injection
        // If we can't fetch commit.json within 2 seconds, show 'DEV'
        setTimeout(() => {
            if (!currentCommitHash) {
                updateHeaderCommit({ commit: 'DEV' });
            }
        }, 2000);
    }

    // Always fetch full metadata (for message/date) to populate tooltip/modal info
    fetchLocalCommitMeta().then(meta => {
        if (meta && meta.commit) {
            // If we are in dev mode or somehow hash mismatches (shouldn't happen if built correctly)
            if (!currentCommitHash) currentCommitHash = meta.commit;
            if (meta.commit === currentCommitHash) {
                // Update header with full info (message)
                updateHeaderCommit(meta);
            }
        }
    });

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
    initMobileHeaderAutoHide();
});
