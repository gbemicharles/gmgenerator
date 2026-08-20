import React, { useState } from 'react';
import { X, ArrowLeft, PlusCircle, Coins, Sparkles } from 'lucide-react';
import { addCustomToken } from '../utils/customTokenManager';

export default function AddTokenModal({ isOpen, onClose, onTokenAdded }) {
  const [name, setName] = useState('');
  const [ticker, setTicker] = useState('');
  const [icon, setIcon] = useState('🪙');
  const [desc, setDesc] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !ticker.trim()) return;

    const newToken = addCustomToken({
      name,
      ticker,
      icon,
      desc
    });

    setName('');
    setTicker('');
    setIcon('🪙');
    setDesc('');

    if (onTokenAdded) onTokenAdded(newToken);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content add-token-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-badge">
            <Coins className="star-gold" size={22} />
            <h3>Add Community Meme Token</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Back">
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <p className="slot-intro">
            Add your community's memecoin so everyone can generate authentic GM memes for your token.
          </p>

          <div className="form-group">
            <label className="form-label">TOKEN NAME:</label>
            <input 
              type="text"
              className="form-select"
              placeholder="e.g. Dogs"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">TICKER SYMBOL:</label>
            <input 
              type="text"
              className="form-select"
              placeholder="e.g. $DOGS"
              value={ticker}
              onChange={(e) => setTicker(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">EMOJI / ICON:</label>
            <input 
              type="text"
              className="form-select"
              placeholder="e.g. 🐶"
              value={icon}
              onChange={(e) => setIcon(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">MEME LORE / SHORT DESC:</label>
            <input
              type="text"
              className="form-select"
              placeholder="e.g. Telegram official tap token dog"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <button className="modal-action-btn primary-download" type="submit">
            <PlusCircle size={18} />
            <span>Add Token to Generator</span>
          </button>
        </form>
      </div>
    </div>
  );
}
