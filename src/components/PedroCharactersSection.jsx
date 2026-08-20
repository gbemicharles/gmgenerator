import React, { useState } from 'react';
import { PEDRO_CHARACTERS } from '../data/pedroCharacters';
import { Sparkles, Music, Zap, Flame, Crown, Play } from 'lucide-react';
import { audioEngine } from '../utils/audioEngine';

export default function PedroCharactersSection({ onSelectPedroCharacter, activeCharacterId }) {
  const [hoveredId, setHoveredId] = useState(null);

  const handleCardClick = (char) => {
    audioEngine.playPedroBeat();
    if (onSelectPedroCharacter) {
      onSelectPedroCharacter(char);
    }
  };

  return (
    <section className="pedro-characters-section">
      <div className="pedro-section-header">
        <div className="pedro-badge-row">
          <span className="pedro-team-badge">
            <Sparkles size={14} /> OFFICIAL PEDRO TEAM WEB3 MASCOTS
          </span>
        </div>
        <h2 className="pedro-section-title">
          MEET THE <span className="pedro-glow-text">PEDRO CHARACTERS</span>
        </h2>
        <p className="pedro-section-subtitle">
          Select any Pedro Web3 character card below to unlock its signature GM vibe, custom audio beats, and unhinged lore.
        </p>
      </div>

      <div className="pedro-cards-grid">
        {PEDRO_CHARACTERS.map((char) => {
          const isActive = activeCharacterId === char.id;
          const isHovered = hoveredId === char.id;

          return (
            <div
              key={char.id}
              className={`pedro-card-item ${isActive ? 'is-active' : ''} ${isHovered ? 'is-hovered' : ''}`}
              style={{
                '--char-accent': char.color,
                borderColor: isActive ? char.color : 'rgba(255, 255, 255, 0.12)'
              }}
              onMouseEnter={() => setHoveredId(char.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => handleCardClick(char)}
            >
              <div className="pedro-card-glow" style={{ backgroundColor: char.color }}></div>

              <div className="pedro-card-image-wrap">
                <img
                  src={char.image}
                  alt={char.name}
                  className="pedro-card-img"
                  loading="lazy"
                />
                <div className="pedro-vibe-tag" style={{ backgroundColor: `${char.color}33`, color: char.color, borderColor: char.color }}>
                  <span>{char.vibe}</span>
                </div>
              </div>

              <div className="pedro-card-content">
                <div className="pedro-card-header">
                  <h3 className="pedro-char-name">{char.name}</h3>
                  <span className="pedro-char-title">{char.title}</span>
                </div>

                <p className="pedro-char-lore">{char.lore}</p>

                <div className="pedro-card-footer">
                  <button
                    className={`pedro-activate-btn ${isActive ? 'active-btn' : ''}`}
                    style={{ backgroundColor: isActive ? char.color : 'rgba(255, 255, 255, 0.08)' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCardClick(char);
                    }}
                  >
                    <Play size={14} className={isActive ? 'play-icon-active' : ''} />
                    <span>{isActive ? 'ACTIVE VIBE' : 'GENERATE GM'}</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
