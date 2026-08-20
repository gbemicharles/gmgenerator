import React from 'react';
import { Flame, Award, DollarSign, Zap, Hash, BarChart } from 'lucide-react';
import { getStreakBadgeTitle } from '../utils/streakManager';

export default function StatsSection({ streakData }) {
  const badgeTitle = getStreakBadgeTitle(streakData.currentStreak);

  return (
    <section className="stats-section">
      <div className="stats-header">
        <BarChart size={18} className="stats-title-icon" />
        <h2>YOUR GM INFRASTRUCTURE STATS</h2>
        <span className="stats-subtitle">Local On-Device Telemetry</span>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper flame-bg">
            <Flame size={22} className="flame-animated" />
          </div>
          <div className="stat-info">
            <span className="stat-value">{streakData.currentStreak} DAYS</span>
            <span className="stat-label">CURRENT GM STREAK</span>
            <span className="stat-sublabel">{badgeTitle}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper hash-bg">
            <Hash size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{streakData.totalGMGenerated}</span>
            <span className="stat-label">GMS GENERATED</span>
            <span className="stat-sublabel">Total CT & TG Output</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper dollar-bg">
            <DollarSign size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">$0.00</span>
            <span className="stat-label">FINANCIAL CONTRIBUTION</span>
            <span className="stat-sublabel">Zero Utility • Pure Vibes</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper zap-bg">
            <Zap size={22} />
          </div>
          <div className="stat-info">
            <span className="stat-value">100%</span>
            <span className="stat-label">COMMITMENT TO GM</span>
            <span className="stat-sublabel">Unbreakable Conviction</span>
          </div>
        </div>
      </div>
    </section>
  );
}
