import React, { useState } from 'react';
import { X, ArrowLeft, Send, Sparkles, PlusCircle } from 'lucide-react';
import { CATEGORIES } from '../data/contentLibrary';
import { addCustomSubmission } from '../utils/communitySubmissionManager';

export default function SubmitGMModal({ isOpen, onClose, onSubmitted }) {
  const [text, setText] = useState('');
  const [category, setCategory] = useState('crypto');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    addCustomSubmission(text, category);
    setText('');
    if (onSubmitted) onSubmitted();
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content submit-gm-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-badge">
            <PlusCircle className="star-gold" size={22} />
            <h3>EXPAND DATABASE: SUBMIT GM</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Back">
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
        </div>

        <form className="modal-body" onSubmit={handleSubmit}>
          <p className="slot-intro">
            Submit your own custom unhinged GM to permanently add it to your generator pool!
          </p>

          <div className="form-group">
            <label className="form-label">SELECT CATEGORY:</label>
            <select 
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">YOUR CUSTOM GM MESSAGE:</label>
            <textarea
              className="form-textarea"
              rows={3}
              placeholder="e.g. Gram morning to the Pedro family! Full retardio energy unlocked today! 🦝💎"
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            ></textarea>
          </div>

          <button className="modal-action-btn primary-download" type="submit">
            <Send size={18} />
            <span>Add to GM Database</span>
          </button>
        </form>
      </div>
    </div>
  );
}
