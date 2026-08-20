import React, { useState, useEffect } from 'react';
import { Copy, Share2, RefreshCw, Skull, Image, Check, Star, Send } from 'lucide-react';
import { CATEGORIES } from '../data/contentLibrary';
import { ESCALATION_LEVELS } from '../utils/escalator';
import { isFavorite } from '../utils/favoritesManager';

export default function GeneratorCard({
  gmData,
  isGenerating,
  onGenerateAgain,
  onEscalate,
  onCopy,
  onShareX,
  onShareTelegram,
  onToggleFavorite,
  onOpenCardModal,
  copied
}) {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Typing effect on GM change
  useEffect(() => {
    if (!gmData || !gmData.text) return;
    
    setIsTyping(true);
    let currentIndex = 0;
    const fullText = gmData.text;
    setDisplayedText('');

    const timer = setInterval(() => {
      if (currentIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 12);

    return () => clearInterval(timer);
  }, [gmData?.text]);

  const catObj = CATEGORIES.find(c => c.id === gmData?.category) || { name: 'GM', icon: '☀️', color: '#F59E0B' };
  const escalationLevel = gmData?.level || 1;
  const escalationObj = ESCALATION_LEVELS.find(e => e.level === escalationLevel) || ESCALATION_LEVELS[0];
  const isFav = isFavorite(gmData?.text);

  return (
    <div id="gm-result-card" className={`generator-card-wrapper level-${escalationLevel} ${isGenerating ? 'is-loading' : ''}`}>
      <div className="card-glow-bg" style={{ backgroundColor: catObj.color }}></div>
      
      <div className="generator-card">
        <div className="card-header-bar">
          <div className="category-tag-badge" style={{ borderColor: catObj.color, color: catObj.color }}>
            <span>{catObj.icon}</span>
            <span>{catObj.name.toUpperCase()}</span>
          </div>

          {gmData?.pedroCharacter && (
            <div className="card-pedro-character-badge" title={gmData.pedroCharacter.title}>
              <img 
                src={gmData.pedroCharacter.nobg || gmData.pedroCharacter.image} 
                alt={gmData.pedroCharacter.name} 
                className="card-pedro-img"
              />
              <span className="card-pedro-char-name">{gmData.pedroCharacter.name}</span>
            </div>
          )}

          <div className="header-right-actions">
            <button 
              className={`fav-star-btn ${isFav ? 'is-favorite' : ''}`}
              onClick={() => onToggleFavorite(gmData)}
              title={isFav ? 'Remove from Favorites' : 'Save to Favorites Vault'}
            >
              <Star size={18} className={isFav ? 'star-fill' : ''} />
            </button>

            <div className="unhinged-indicator-badge" style={{ backgroundColor: `${escalationObj.color}22`, color: escalationObj.color, borderColor: escalationObj.color }}>
              <Skull size={14} className={escalationLevel >= 4 ? 'pulse-skull' : ''} />
              <span>LEVEL: {escalationLevel}/5 {escalationObj.emoji}</span>
            </div>
          </div>
        </div>

        {/* Main Result Display Box */}
        <div className="gm-display-box">
          {isGenerating ? (
            <div className="generating-loader">
              <div className="pulse-sun">☀️</div>
              <span className="loader-text">GENERATING UNFORGETTABLE GM...</span>
            </div>
          ) : (
            <div className="gm-text-content">
              <p className="gm-quote">
                “{displayedText}”
                {isTyping && <span className="typing-cursor">|</span>}
              </p>
            </div>
          )}
        </div>

        {/* Escalation Level Meter */}
        <div className="escalation-meter-bar">
          <div className="meter-track">
            {[1, 2, 3, 4, 5].map(lvl => (
              <div 
                key={lvl} 
                className={`meter-step ${lvl <= escalationLevel ? 'active' : ''}`}
                style={{ backgroundColor: lvl <= escalationLevel ? ESCALATION_LEVELS[lvl - 1].color : 'rgba(255,255,255,0.1)' }}
              ></div>
            ))}
          </div>

          <button 
            className={`make-it-worse-btn ${escalationLevel >= 5 ? 'max-unhinged' : ''}`}
            onClick={onEscalate}
            disabled={isGenerating}
            title="Escalate GM to a more unhinged level"
          >
            <Skull size={16} />
            <span>MAKE IT WORSE</span>
          </button>
        </div>

        {/* Primary Actions Toolbar */}
        <div className="card-action-toolbar">
          <button className="action-btn copy-btn" onClick={() => onCopy(gmData?.text)}>
            {copied ? <Check size={18} className="check-icon" /> : <Copy size={18} />}
            <span>{copied ? 'COPIED' : 'COPY GM'}</span>
          </button>

          <button className="action-btn share-x-btn" onClick={() => onShareX(gmData?.text)}>
            <Share2 size={18} />
            <span>SHARE ON X</span>
          </button>

          <button className="action-btn share-tg-btn" onClick={() => onShareTelegram(gmData?.text)}>
            <Send size={18} />
            <span>SHARE ON TG</span>
          </button>

          <button className="action-btn card-export-btn" onClick={onOpenCardModal}>
            <Image size={18} />
            <span>CARD IMAGE</span>
          </button>

          <button className="action-btn generate-again-btn" onClick={onGenerateAgain} disabled={isGenerating}>
            <RefreshCw size={18} className={isGenerating ? 'spin-icon' : ''} />
            <span>GENERATE AGAIN</span>
          </button>
        </div>
      </div>
    </div>
  );
}
