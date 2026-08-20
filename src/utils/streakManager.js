// Daily GM Streak and Stats Manager

const STREAK_STORAGE_KEY = 'gm_generator_streak_data_v1';

export function getStreakData() {
  const defaultData = {
    currentStreak: 1,
    longestStreak: 1,
    lastGMDate: new Date().toISOString().split('T')[0],
    totalGMGenerated: 0,
    categoryCounts: {},
    unhingedCount: 0
  };

  try {
    const raw = localStorage.getItem(STREAK_STORAGE_KEY);
    if (!raw) return defaultData;
    const parsed = JSON.parse(raw);
    
    // Check if streak broke (missed yesterday)
    const todayStr = new Date().toISOString().split('T')[0];
    const lastDate = parsed.lastGMDate;

    if (lastDate !== todayStr) {
      const today = new Date(todayStr);
      const last = new Date(lastDate);
      const diffTime = Math.abs(today - last);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Missed more than 1 day, reset current streak
        parsed.currentStreak = 1;
      }
    }

    return { ...defaultData, ...parsed };
  } catch (e) {
    return defaultData;
  }
}

export function registerGMGenerated(categoryId = 'normal', level = 1) {
  const data = getStreakData();
  const todayStr = new Date().toISOString().split('T')[0];

  data.totalGMGenerated += 1;

  // Track category counts
  data.categoryCounts[categoryId] = (data.categoryCounts[categoryId] || 0) + 1;

  if (level >= 4) {
    data.unhingedCount = (data.unhingedCount || 0) + 1;
  }

  // Update streak if today is a new day
  if (data.lastGMDate !== todayStr) {
    const today = new Date(todayStr);
    const last = new Date(data.lastGMDate);
    const diffTime = Math.abs(today - last);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      data.currentStreak += 1;
    } else {
      data.currentStreak = 1;
    }

    if (data.currentStreak > data.longestStreak) {
      data.longestStreak = data.currentStreak;
    }

    data.lastGMDate = todayStr;
  }

  try {
    const serialized = JSON.stringify(data);
    localStorage.setItem(STREAK_STORAGE_KEY, serialized);

    if (window.Telegram?.WebApp?.CloudStorage) {
      window.Telegram.WebApp.CloudStorage.setItem(STREAK_STORAGE_KEY, serialized, (err) => {
        if (err) console.warn('Telegram CloudStorage streak sync:', err);
      });
    }
  } catch (e) {
    console.error('Failed to save streak data', e);
  }

  return data;
}

export function getStreakBadgeTitle(streakDays) {
  if (streakDays >= 365) return '🗿 GM Final Boss';
  if (streakDays >= 100) return '⭐ GM Veteran';
  if (streakDays >= 30) return '💎 GM Maxi';
  if (streakDays >= 7) return '🫡 Certified GM';
  return '☀️ GM Newbie';
}
