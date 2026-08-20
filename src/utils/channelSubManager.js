// Channel Subscription Gate Manager (@generategm)

const SUB_STORAGE_KEY = 'gm_generator_has_subscribed_channel_v1';

export function getHasSubscribedChannel() {
  try {
    const raw = localStorage.getItem(SUB_STORAGE_KEY);
    return raw === 'true';
  } catch (e) {
    return false;
  }
}

export function setHasSubscribedChannel() {
  try {
    localStorage.setItem(SUB_STORAGE_KEY, 'true');
    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(SUB_STORAGE_KEY, 'true', (err) => {
        if (err) console.warn('Telegram CloudStorage sub sync:', err);
      });
    }
  } catch (e) {
    console.error('Failed to set channel sub state', e);
  }
}
