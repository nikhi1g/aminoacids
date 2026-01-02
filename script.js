/**
 * Shared Logic (Theme, Navigation, Versioning)
 */

let isDarkMode = false;
// This will be replaced by the build pipeline
const BUILD_COMMIT = '116866d573c00ab89e92afe5c1df2e26746f0acd'; 
console.log("Runtime BUILD_COMMIT:", BUILD_COMMIT);

const COMMIT_POLL_MS = 300000;
const COMMIT_MESSAGE_MAX_LEN = 40;

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
    const hashEl = document.getElementById('commit-hash');
    if (!hashEl) return;
    const trigger = hashEl.closest('.rounded-xl') || hashEl.parentElement;
    const existing = document.getElementById('version-details');
    if (existing) {
        closeVersionInfo();
        return;
    }

    let wrapper = trigger.querySelector('.trigger-content-wrapper');
    if (!wrapper) {
        wrapper = document.createElement('div');
        wrapper.className = 'trigger-content-wrapper flex flex-col justify-center';
        while (trigger.firstChild) {
            wrapper.appendChild(trigger.firstChild);
        }
        trigger.appendChild(wrapper);
    }

    trigger.classList.add('expanded', 'flex', 'flex-row', 'items-center', 'gap-3', 'pr-4', 'transition-all', 'duration-300', 'ease-out');
    trigger.style.position = 'relative';
    trigger.style.zIndex = '50';

    const details = document.createElement('div');
    details.id = 'version-details';
    details.className = 'flex items-center gap-4 text-[10px] pl-3 border-l border-slate-300 dark:border-slate-600 animate-fade-in whitespace-nowrap overflow-hidden';
    details.innerHTML = `
        <div class="flex items-center gap-2">
            <span class="font-mono text-slate-600 dark:text-slate-300 select-all">${meta.commit}</span>
            <a href="https://github.com/nikhi1g/mcat/commit/${meta.commit}" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center p-1 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 transition-colors" title="View Commit">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
            </a>
        </div>
        <div class="text-slate-500 dark:text-slate-400 border-l border-slate-300 dark:border-slate-600 pl-3 hidden sm:block">${meta.commit_date || 'Unknown'}</div>
        ${meta.message ? `
        <div class="text-slate-400 dark:text-slate-500 italic max-w-[150px] md:max-w-[250px] truncate border-l border-slate-300 dark:border-slate-600 pl-3 hidden md:block" title="${meta.message}">${meta.message}</div>
        ` : ''}
    `;

    details.onclick = (e) => {
        e.stopPropagation();
        if (e.target.closest('a')) {
            return;
        }
        e.preventDefault();
    };

    trigger.appendChild(details);

    window.addEventListener('scroll', closeVersionInfo, { capture: true, once: true });
    window.addEventListener('resize', closeVersionInfo, { capture: true, once: true });
    
    setTimeout(() => {
        document.addEventListener('click', closeVersionInfoOutside);
    }, 10);
}

function closeVersionInfo() {
    const details = document.getElementById('version-details');
    if (!details) return;
    const trigger = details.parentElement;
    if (trigger) {
        trigger.classList.remove('expanded', 'pr-4');
        trigger.style.zIndex = '';
        trigger.style.position = '';
    }
    details.remove();
    cleanupVersionListeners();
}

function closeVersionInfoOutside(e) {
    const details = document.getElementById('version-details');
    const hashEl = document.getElementById('commit-hash');
    const trigger = hashEl ? (hashEl.closest('.rounded-xl') || hashEl.parentElement) : null;
    if (trigger && !trigger.contains(e.target)) {
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
        setTimeout(() => {
            if (!currentCommitHash) {
                updateHeaderCommit({ commit: 'DEV' });
            }
        }, 2000);
    }

    fetchLocalCommitMeta().then(meta => {
        if (meta && meta.commit) {
            if (!currentCommitHash) currentCommitHash = meta.commit;
            if (meta.commit === currentCommitHash) {
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

// Init
window.addEventListener('DOMContentLoaded', () => {
    initializeTheme();
    // updateFilterUI is now in amino-data.js, so we don't call it here
    initCommitWatcher();
    initMobileHeaderAutoHide();
});