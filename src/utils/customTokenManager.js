// Custom Memecoin Token Manager for TON Memes Category

const CUSTOM_TOKENS_KEY = 'gm_generator_custom_tokens_v2';

export const DEFAULT_MEME_TOKENS = [
  { id: 'redo', name: 'Resistance Dog', ticker: '$REDO', icon: '🐕‍🦺', desc: 'Digital resistance & Pavel Durov mascot' },
  { id: 'utya', name: 'Utya Duck', ticker: '$UTYA', icon: '🦆', desc: 'Iconic Telegram yellow duck sticker' },
  { id: 'pedro', name: 'Pedro the Trash Bandit', ticker: '$PEDRO', icon: '🦝', desc: 'Spinning audio trash bandit memecoin' },
  { id: 'buddy', name: 'Buddy the Bear', ticker: '$BUDDY', icon: '🐻', desc: 'Buddy the Bear mascot on TON' },
  { id: 'cherry', name: 'Cherry', ticker: '$CHERRY', icon: '🍒', desc: 'Juicy cherry gains & vibes' },
  { id: 'groyp', name: 'Groyp', ticker: '$GROYP', icon: '🐸', desc: 'Unhinged CT frog meme on TON' }
];

export function getCustomTokens() {
  try {
    const raw = localStorage.getItem(CUSTOM_TOKENS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function getAllTokens() {
  const custom = getCustomTokens();
  return [...DEFAULT_MEME_TOKENS, ...custom];
}

export function addCustomToken(tokenObj) {
  if (!tokenObj || !tokenObj.name || !tokenObj.ticker) return false;

  const custom = getCustomTokens();
  const id = `token_${Date.now()}`;
  const newToken = {
    id,
    name: tokenObj.name.trim(),
    ticker: tokenObj.ticker.startsWith('$') ? tokenObj.ticker.trim().toUpperCase() : `$${tokenObj.ticker.trim().toUpperCase()}`,
    icon: tokenObj.icon || '🪙',
    desc: tokenObj.desc || 'Community added TON memecoin',
    isCustom: true
  };

  custom.unshift(newToken);

  try {
    const serialized = JSON.stringify(custom);
    localStorage.setItem(CUSTOM_TOKENS_KEY, serialized);
    
    // Sync to Telegram CloudStorage if inside Telegram Mini App
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(CUSTOM_TOKENS_KEY, serialized, (err) => {
        if (err) console.warn('Telegram CloudStorage token sync:', err);
      });
    }
  } catch (e) {
    console.error('Failed to save token', e);
  }

  return newToken;
}
