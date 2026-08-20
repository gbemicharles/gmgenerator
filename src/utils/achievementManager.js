// Collectible GM Achievements System

export const ACHIEVEMENTS = [
  {
    id: 'gm_newbie',
    title: '☀️ GM Newbie',
    description: 'Generated your very first GM.',
    target: 1,
    check: (data) => data.totalGMGenerated >= 1,
    getProgress: (data) => Math.min(100, Math.floor((data.totalGMGenerated / 1) * 100))
  },
  {
    id: 'certified_gm',
    title: '🫡 Certified GM',
    description: 'Generated 25 GMs.',
    target: 25,
    check: (data) => data.totalGMGenerated >= 25,
    getProgress: (data) => Math.min(100, Math.floor((data.totalGMGenerated / 25) * 100))
  },
  {
    id: 'diamond_gm',
    title: '💎 Diamond GM',
    description: 'Maintained a 7-day GM streak or generated 50 GMs.',
    target: 7,
    check: (data) => data.longestStreak >= 7 || data.totalGMGenerated >= 50,
    getProgress: (data) => Math.min(100, Math.max(
      Math.floor((data.longestStreak / 7) * 100),
      Math.floor((data.totalGMGenerated / 50) * 100)
    ))
  },
  {
    id: 'degen_gm',
    title: '🐸 Degen GM',
    description: 'Generated 10 Degen GMs.',
    target: 10,
    check: (data) => (data.categoryCounts.degen || 0) >= 10,
    getProgress: (data) => Math.min(100, Math.floor(((data.categoryCounts.degen || 0) / 10) * 100))
  },
  {
    id: 'down_bad',
    title: '💀 Down Bad',
    description: 'Generated 5 Down Bad GMs.',
    target: 5,
    check: (data) => (data.categoryCounts.downbad || 0) >= 5,
    getProgress: (data) => Math.min(100, Math.floor(((data.categoryCounts.downbad || 0) / 5) * 100))
  },
  {
    id: 'bullish_maxi',
    title: '🚀 Bullish Maxi',
    description: 'Generated 15 Bullish or Max Bullish GMs.',
    target: 15,
    check: (data) => ((data.categoryCounts.bullish || 0) + (data.categoryCounts.max_bullish || 0)) >= 15,
    getProgress: (data) => Math.min(100, Math.floor((((data.categoryCounts.bullish || 0) + (data.categoryCounts.max_bullish || 0)) / 15) * 100))
  },
  {
    id: 'ton_believer',
    title: '💎 TON/GRAM Believer',
    description: 'Generated 5 TON/GRAM GMs.',
    target: 5,
    check: (data) => (data.categoryCounts.ton || 0) >= 5,
    getProgress: (data) => Math.min(100, Math.floor(((data.categoryCounts.ton || 0) / 5) * 100))
  },
  {
    id: 'pedro_vibe_maxi',
    title: '🦝 Pedro Vibe Maxi',
    description: 'Generated 5 Pedro the Trash Bandit GMs and vibed to the audio memecoin on TON.',
    target: 5,
    check: (data) => (data.categoryCounts.pedro || 0) >= 5,
    getProgress: (data) => Math.min(100, Math.floor(((data.categoryCounts.pedro || 0) / 5) * 100))
  },
  {
    id: 'telegram_lurker',
    title: '✈️ Telegram Lurker',
    description: 'Generated 5 Telegram GMs.',
    target: 5,
    check: (data) => (data.categoryCounts.telegram || 0) >= 5,
    getProgress: (data) => Math.min(100, Math.floor(((data.categoryCounts.telegram || 0) / 5) * 100))
  },
  {
    id: 'unhinged_overlord',
    title: '🤪 Unhinged Overlord',
    description: 'Escalated GMs to Unhinged/Final Boss level 5 times.',
    target: 5,
    check: (data) => (data.unhingedCount || 0) >= 5,
    getProgress: (data) => Math.min(100, Math.floor(((data.unhingedCount || 0) / 5) * 100))
  },
  {
    id: 'gm_final_boss',
    title: '🗿 GM Final Boss',
    description: 'Generated 100 total GMs and conquered the matrix.',
    target: 100,
    check: (data) => data.totalGMGenerated >= 100,
    getProgress: (data) => Math.min(100, Math.floor((data.totalGMGenerated / 100) * 100))
  }
];

const ACHIEVEMENTS_STORAGE_KEY = 'gm_generator_unlocked_achievements_v1';

export function getUnlockedAchievements() {
  try {
    const raw = localStorage.getItem(ACHIEVEMENTS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

export function evaluateAchievements(streakData) {
  const currentUnlocked = getUnlockedAchievements();
  const newlyUnlocked = [];

  ACHIEVEMENTS.forEach(ach => {
    if (!currentUnlocked.includes(ach.id) && ach.check(streakData)) {
      currentUnlocked.push(ach.id);
      newlyUnlocked.push(ach);
    }
  });

  if (newlyUnlocked.length > 0) {
    try {
      localStorage.setItem(ACHIEVEMENTS_STORAGE_KEY, JSON.stringify(currentUnlocked));
    } catch (e) {
      console.error('Failed to save unlocked achievements', e);
    }
  }

  return {
    unlockedIds: currentUnlocked,
    newlyUnlocked
  };
}
