import React, { useState } from 'react';
import { Flame, Trophy, Star, Volume2, VolumeX, Dices, PlusCircle, Sparkles } from 'lucide-react';
import { getStreakBadgeTitle } from '../utils/streakManager';
import { audioEngine } from '../utils/audioEngine';

export default function Header({ 
  streakData, 
  unlockedCount, 
  totalAchievements, 
  favoritesCount,
  onOpenAchievements, 
  onOpenFavorites,
  onOpenSlotMachine,
  onOpenSubmitGM,
  onOpenStats 
}) {
  const [isMuted, setIsMuted] = useState(audioEngine.isMuted);
  const badgeTitle = getStreakBadgeTitle(streakData.currentStreak);

  const handleToggleMute = () => {
    const muted = audioEngine.toggleMute();
    setIsMuted(muted);
  };

  return (
    <header className="header-container">
      <div className="header-content">
        <div className="logo-brand">
          <div className="logo-icon">☀️</div>
          <div className="logo-text">
            <span className="brand-title">GM GENERATOR</span>
            <span className="brand-badge">POWERED BY PEDRO TEAM</span>
          </div>
        </div>

        <div className="header-actions desktop-actions">
          <button 
            className="header-tool-btn submit-btn"
            onClick={onOpenSubmitGM}
            title="Submit Custom GM to Database"
          >
            <PlusCircle size={16} className="plus-icon" />
            <span className="tool-btn-text">Submit GM</span>
          </button>

          <button 
            className="header-tool-btn slot-btn"
            onClick={onOpenSlotMachine}
            title="Launch Wildcard GM Slot Machine"
          >
            <Dices size={16} className="dice-icon" />
            <span className="tool-btn-text">Slot Machine</span>
          </button>

          <button 
            className="header-tool-btn favorites-btn"
            onClick={onOpenFavorites}
            title="Open Favorites Vault"
          >
            <Star size={16} className="star-icon" />
            <span className="fav-count">{favoritesCount}</span>
          </button>

          <button 
            className="header-tool-btn mute-btn"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute Audio Effects' : 'Mute Audio Effects'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="audio-active-icon" />}
          </button>

          <button className="streak-pill" onClick={onOpenStats} title="View Streak & Stats">
            <Flame className="flame-icon animated-flame" size={16} />
            <span className="streak-count">{streakData.currentStreak}d</span>
            <span className="streak-tag">{badgeTitle}</span>
          </button>

          <button className="achievement-btn" onClick={onOpenAchievements} title="View Achievements">
            <Trophy size={16} className="trophy-icon" />
            <span className="achievement-badge">{unlockedCount}/{totalAchievements}</span>
          </button>
        </div>

        {/* Mobile Quick Action Items */}
        <div className="mobile-header-top-right">
          <button 
            className="header-tool-btn mute-btn mobile-mute"
            onClick={handleToggleMute}
            title={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} className="audio-active-icon" />}
          </button>

          <button className="streak-pill mobile-streak" onClick={onOpenStats}>
            <Flame className="flame-icon animated-flame" size={15} />
            <span className="streak-count">{streakData.currentStreak}d</span>
          </button>

          <button className="achievement-btn mobile-trophy" onClick={onOpenAchievements}>
            <Trophy size={15} className="trophy-icon" />
            <span className="achievement-badge">{unlockedCount}</span>
          </button>
        </div>
      </div>

      {/* Mobile Dedicated Quick Navigation Strip */}
      <div className="mobile-nav-strip">
        <button className="mobile-nav-btn slot-nav" onClick={onOpenSlotMachine}>
          <Dices size={14} />
          <span>Slots</span>
        </button>

        <button className="mobile-nav-btn fav-nav" onClick={onOpenFavorites}>
          <Star size={14} />
          <span>Vault ({favoritesCount})</span>
        </button>

        <button className="mobile-nav-btn submit-nav" onClick={onOpenSubmitGM}>
          <PlusCircle size={14} />
          <span>Submit</span>
        </button>
      </div>
    </header>
  );
}
