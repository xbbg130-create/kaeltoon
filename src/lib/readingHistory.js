/**
 * Reading History Management for localStorage
 * Menyimpan dan mengelola history baca manga
 */

const STORAGE_KEY = 'kaeltoon_reading_history';
const MAX_HISTORY_ITEMS = 50; // Batasi jumlah history untuk performa

/**
 * Simpan atau update reading history
 * @param {Object} historyItem - Item history yang akan disimpan
 * @param {string} historyItem.comicSlug - Slug komik
 * @param {string} historyItem.chapterSlug - Slug chapter
 * @param {string} historyItem.mangaTitle - Judul manga
 * @param {string} historyItem.chapterTitle - Judul chapter
 * @param {number} [historyItem.lastPage] - Halaman terakhir yang dibaca (optional)
 */
export function saveReadingHistory(historyItem) {
    if (typeof window === 'undefined') return; // Skip di server-side

    try {
        const history = getReadingHistory();

        // Cari apakah komik ini sudah ada di history
        const existingIndex = history.findIndex(
            item => item.comicSlug === historyItem.comicSlug
        );

        const newItem = {
            ...historyItem,
            timestamp: Date.now(),
        };

        if (existingIndex !== -1) {
            // Update existing item (pindahkan ke posisi teratas)
            history.splice(existingIndex, 1);
        }

        // Tambahkan item baru di awal array
        history.unshift(newItem);

        // Batasi jumlah history
        const limitedHistory = history.slice(0, MAX_HISTORY_ITEMS);

        // Simpan ke localStorage
        localStorage.setItem(STORAGE_KEY, JSON.stringify(limitedHistory));
    } catch (error) {
        console.error('Error saving reading history:', error);
    }
}

/**
 * Ambil semua reading history
 * @returns {Array} Array of history items, sorted by timestamp (newest first)
 */
export function getReadingHistory() {
    if (typeof window === 'undefined') return []; // Skip di server-side

    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return [];

        const history = JSON.parse(stored);

        // Pastikan return array dan sudah terurut
        return Array.isArray(history) ? history : [];
    } catch (error) {
        console.error('Error getting reading history:', error);
        return [];
    }
}

/**
 * Ambil history untuk komik tertentu
 * @param {string} comicSlug - Slug komik
 * @returns {Object|null} History item atau null jika tidak ditemukan
 */
export function getComicHistory(comicSlug) {
    const history = getReadingHistory();
    return history.find(item => item.comicSlug === comicSlug) || null;
}

/**
 * Hapus item tertentu dari history
 * @param {string} comicSlug - Slug komik yang akan dihapus
 */
export function removeFromHistory(comicSlug) {
    if (typeof window === 'undefined') return;

    try {
        const history = getReadingHistory();
        const filtered = history.filter(item => item.comicSlug !== comicSlug);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    } catch (error) {
        console.error('Error removing from history:', error);
    }
}

/**
 * Hapus semua reading history
 */
export function clearReadingHistory() {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
        console.error('Error clearing reading history:', error);
    }
}

/**
 * Get total number of items in history
 * @returns {number} Total items
 */
export function getHistoryCount() {
    return getReadingHistory().length;
}
