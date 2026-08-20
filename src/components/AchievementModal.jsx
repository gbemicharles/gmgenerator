import React from 'react';
import { X, ArrowLeft, Trophy, Lock, CheckCircle2, Flame } from 'lucide-react';
import { ACHIEVEMENTS, getUnlockedAchievements } from '../utils/achievementManager';

export default function AchievementModal({ isOpen, onClose, streakData }) {
  if (!isOpen) return null;

  const unlockedIds = getUnlockedAchievements();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content achievements-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-badge">
            <Trophy className="trophy-gold" size={22} />
            <h3>GM ACHIEVEMENTS</h3>
            <span className="unlocked-pill">{unlockedIds.length} / {ACHIEVEMENTS.length} UNLOCKED</span>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Back">
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
        </div>

        <div className="modal-body">
          <p className="achievements-intro">
            Unlock collectible Web3 GM badges as you maintain your streak and generate unhinged GMs.
          </p>

          <div className="achievements-grid">
            {ACHIEVEMENTS.map(ach => {
              const isUnlocked = unlockedIds.includes(ach.id);
              const progressPct = ach.getProgress ? ach.getProgress(streakData) : 0;

              return (
                <div key={ach.id} className={`achievement-card ${isUnlocked ? 'is-unlocked' : 'is-locked'}`}>
                  <div className="ach-icon-container">
                    {isUnlocked ? (
                      <CheckCircle2 size={24} className="unlocked-check-icon" />
                    ) : (
                      <Lock size={20} className="locked-padlock-icon" />
                    )}
                  </div>

                  <div className="ach-details">
                    <h4 className="ach-title">{ach.title}</h4>
                    <p className="ach-desc">{ach.description}</p>
                    
                    {!isUnlocked && (
                      <div className="ach-progress-bar">
                        <div className="ach-progress-fill" style={{ width: `${progressPct}%` }}></div>
                        <span className="ach-progress-pct">{progressPct}%</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
