import React, { useState, useEffect } from 'react';
import { X, ArrowLeft, Dices, RefreshCw, Copy, Share2, Send, Sparkles } from 'lucide-react';
import { COMBINATOR } from '../data/contentLibrary';
import { audioEngine } from '../utils/audioEngine';

export default function SlotMachineModal({ isOpen, onClose, onCopy, onShareX, onShareTelegram }) {
  const [reel1, setReel1] = useState('GM');
  const [reel2, setReel2] = useState('to all degens & chads');
  const [reel3, setReel3] = useState('vibes are 1000%');
  const [isSpinning, setIsSpinning] = useState(false);

  if (!isOpen) return null;

  const handleSpin = () => {
    if (isSpinning) return;
    setIsSpinning(true);

    let spinsLeft = 12;
    const interval = setInterval(() => {
      const g = COMBINATOR.greetings[Math.floor(Math.random() * COMBINATOR.greetings.length)];
      const s = COMBINATOR.subjects[Math.floor(Math.random() * COMBINATOR.subjects.length)];
      const p = COMBINATOR.punchlines[Math.floor(Math.random() * COMBINATOR.punchlines.length)];

      setReel1(g);
      setReel2(s);
      setReel3(p);

      audioEngine.playSlotSpin();

      spinsLeft--;
      if (spinsLeft <= 0) {
        clearInterval(interval);
        setIsSpinning(false);
        audioEngine.playGMChime();
      }
    }, 80);
  };

  const compiledText = `${reel1} ${reel2}. ${reel3.charAt(0).toUpperCase() + reel3.slice(1)}.`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content slot-machine-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-badge">
            <Dices className="dice-gold" size={22} />
            <h3>Wildcard GM Slot Machine</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Back">
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
        </div>

        <div className="modal-body">
          <p className="slot-intro">
            Spin the 3-reel slot machine to construct randomized procedural GM combinations.
          </p>

          <div className="slot-machine-frame">
            <div className="slot-reels-container">
              <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
                <span className="reel-label">GREETING</span>
                <div className="reel-box">{reel1}</div>
              </div>

              <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
                <span className="reel-label">SUBJECT</span>
                <div className="reel-box">{reel2}</div>
              </div>

              <div className={`slot-reel ${isSpinning ? 'spinning' : ''}`}>
                <span className="reel-label">PUNCHLINE</span>
                <div className="reel-box">{reel3}</div>
              </div>
            </div>

            <button 
              className={`spin-slot-btn ${isSpinning ? 'is-spinning' : ''}`}
              onClick={handleSpin}
              disabled={isSpinning}
            >
              <RefreshCw size={20} className={isSpinning ? 'spin-icon' : ''} />
              <span>{isSpinning ? 'Spinning Reels...' : 'Spin Slot Machine'}</span>
            </button>
          </div>

          <div className="slot-result-preview">
            <span className="slot-result-label">RESULT GM:</span>
            <p className="slot-result-text">“{compiledText}”</p>

            <div className="slot-result-actions">
              <button className="fav-action-btn copy" onClick={() => onCopy(compiledText)}>
                <Copy size={14} /> Copy
              </button>
              <button className="fav-action-btn share-x" onClick={() => onShareX(compiledText)}>
                <Share2 size={14} /> Share X
              </button>
              <button className="fav-action-btn share-tg" onClick={() => onShareTelegram(compiledText)}>
                <Send size={14} /> Share TG
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
