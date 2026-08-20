// Channel Subscription Gate Manager (@generategm)

const SUB_STORAGE_KEY = 'gm_generator_has_subscribed_channel_v2';

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

export async function checkLiveTelegramSubscription(userId) {
  if (!userId) return true; // Browser preview mode

  const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || import.meta.env.TELEGRAM_BOT_TOKEN;
  const channelUsername = '@generategm';

  if (botToken) {
    try {
      const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(channelUsername)}&user_id=${userId}`;
      const res = await fetch(url);
      const data = await res.json();

      if (data.ok && data.result) {
        const status = data.result.status;
        return ['creator', 'administrator', 'member', 'restricted'].includes(status);
      }
    } catch (e) {
      console.warn('Live Telegram API check error:', e);
    }
  }

  // Fallback to server endpoint
  try {
    const res = await fetch(`/api/verify-sub?userId=${userId}`);
    const data = await res.json();
    if (data.ok && typeof data.isSubscribed === 'boolean') {
      return data.isSubscribed;
    }
  } catch (e) {
    console.warn('Server verify-sub fallback error:', e);
  }

  return false;
}
