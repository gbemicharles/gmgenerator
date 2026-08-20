/**
 * Native Telegram Mini App (TMA) Integration & Haptics Engine
 * Provides native Telegram WebApp lifecycle, haptic feedback, fullscreen mode,
 * vertical swipe locking, header styling, and native sharing.
 */

export function initTelegramWebApp() {
  if (typeof window !== 'undefined' && window.Telegram && window.Telegram.WebApp) {
    const tg = window.Telegram.WebApp;

    try {
      tg.ready();
      tg.expand();

      if (typeof document !== 'undefined') {
        document.body.classList.add('is-telegram-webapp');
      }

      // Request fullscreen (Telegram Bot API 8.0+)
      if (tg.requestFullscreen) {
        tg.requestFullscreen();
      }

      // Lock vertical swipes so mini app doesn't minimize when scrolling
      if (tg.disableVerticalSwipes) {
        tg.disableVerticalSwipes();
      }

      // Enable closing confirmation to prevent accidental swipes closing app
      if (tg.enableClosingConfirmation) {
        tg.enableClosingConfirmation();
      }

      // Configure Telegram theme colors
      if (tg.setHeaderColor) tg.setHeaderColor('#0b0e14');
      if (tg.setBackgroundColor) tg.setBackgroundColor('#0b0e14');
    } catch (e) {
      console.warn('Telegram WebApp init warning:', e);
    }

    return tg;
  }
  return null;
}

export function triggerHaptic(type = 'impact', style = 'medium') {
  try {
    const tg = window.Telegram?.WebApp;
    if (!tg || !tg.HapticFeedback) return;

    if (type === 'impact') {
      tg.HapticFeedback.impactOccurred(style); // 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
    } else if (type === 'notification') {
      tg.HapticFeedback.notificationOccurred(style); // 'error' | 'success' | 'warning'
    } else if (type === 'selection') {
      tg.HapticFeedback.selectionChanged();
    }
  } catch (e) {
    // Unsupported or not in Telegram
  }
}

export function isInsideTelegramWebApp() {
  return typeof window !== 'undefined' && !!(window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData);
}

export function openTelegramLink(url) {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url);
  } else {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
