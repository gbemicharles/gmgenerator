import React from 'react';
import { Sun, Sparkles } from 'lucide-react';

export default function Hero({ onPrimaryGenerate, isGenerating }) {
  return (
    <section className="hero-section">
      <div className="hero-badge">
        <Sparkles size={14} className="sparkle-icon" />
        <span>0% Utility • 100% Vibes • Native Web3 & Telegram</span>
      </div>

      <h1 className="hero-title">
        GM GENERATOR
      </h1>

      <p className="hero-subtitle">
        Generate the most unnecessary GM you've ever posted.
      </p>

      <div className="hero-cta-wrapper">
        <button 
          className={`hero-primary-cta ${isGenerating ? 'is-cooking' : ''}`}
          onClick={onPrimaryGenerate}
          disabled={isGenerating}
        >
          <Sun size={24} className={isGenerating ? 'spin-sun' : ''} />
          <span>{isGenerating ? 'COOKING...' : 'GENERATE GM'}</span>
        </button>
      </div>

      <p className="hero-explanation">
        For builders, bagholders, degens, lurkers, and everyone who says GM before checking their portfolio.
      </p>
    </section>
  );
}
