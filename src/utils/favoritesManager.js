// Favorites Vault Storage Manager

const FAVORITES_STORAGE_KEY = 'gm_generator_favorites_v1';

export function getFavorites() {
  try {
    const raw = localStorage.getItem(FAVORITES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function isFavorite(gmText) {
  if (!gmText) return false;
  const favs = getFavorites();
  return favs.some(f => f.text === gmText);
}

export function toggleFavorite(gmData) {
  if (!gmData || !gmData.text) return false;

  const favs = getFavorites();
  const index = favs.findIndex(f => f.text === gmData.text);
  let isNowFavorite = false;

  if (index >= 0) {
    favs.splice(index, 1);
    isNowFavorite = false;
  } else {
    favs.unshift({
      id: `fav_${Date.now()}`,
      text: gmData.text,
      category: gmData.category || 'crypto',
      savedAt: new Date().toISOString()
    });
    isNowFavorite = true;
  }

  try {
    const serialized = JSON.stringify(favs);
    localStorage.setItem(FAVORITES_STORAGE_KEY, serialized);

    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(FAVORITES_STORAGE_KEY, serialized, (err) => {
        if (err) console.warn('Telegram CloudStorage fav sync:', err);
      });
    }
  } catch (e) {
    console.error('Failed to save favorites', e);
  }

  return isNowFavorite;
}
