const STORAGE_KEY = 'placement-readiness-history';

export function getHistoryInfo() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return { history: [], corruptedCount: 0 };
        const parsed = JSON.parse(raw);
        if (!Array.isArray(parsed)) return { history: [], corruptedCount: 1 };

        const valid = parsed.filter(e => e && typeof e === 'object' && e.id);
        return {
            history: valid,
            corruptedCount: parsed.length - valid.length
        };
    } catch {
        return { history: [], corruptedCount: 0 };
    }
}

export function getHistory() {
    return getHistoryInfo().history;
}

export function saveAnalysis(entry) {
    const history = getHistory();
    // Prepend newest first
    history.unshift(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function getAnalysisById(id) {
    const history = getHistory();
    return history.find(e => e.id === id) || null;
}

export function deleteAnalysis(id) {
    const history = getHistory().filter(e => e.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
}

export function updateAnalysis(id, updates) {
    const history = getHistory();
    const idx = history.findIndex(e => e.id === id);
    if (idx !== -1) {
        history[idx] = { ...history[idx], ...updates };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
        return history[idx];
    }
    return null;
}

export function getLatestAnalysis() {
    const history = getHistory();
    return history.length > 0 ? history[0] : null;
}
