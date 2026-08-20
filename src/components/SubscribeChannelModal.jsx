import React from 'react';
import { Send, CheckCircle2, Lock, Sparkles, X, ArrowLeft } from 'lucide-react';

export default function SubscribeChannelModal({ isOpen, onClose, onConfirmSubscribed }) {
  if (!isOpen) return null;

  const handleJoinChannel = () => {
    const channelUrl = 'https://t.me/generategm';
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(channelUrl);
    } else {
      window.open(channelUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content subscribe-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header subscribe-header">
          <div className="modal-title-with-badge">
            <Lock className="lock-icon" size={22} />
            <h3>JOIN @generategm TO CONTINUE</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} title="Back">
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
        </div>

        <div className="modal-body subscribe-body">
          <div className="subscribe-banner">
            <div className="banner-badge">
              <Sparkles size={14} /> COMPULSORY TELEGRAM CHANNEL JOIN
            </div>
            <h4 className="banner-title">
              Unlock Unlimited GM Memes & Pedro Mascot Drops
            </h4>
            <p className="banner-desc">
              Subscribe to the official Telegram channel <strong>@generategm</strong> to continue generating unhinged GMs, escalating levels, and unlocking exclusive mascot cards.
            </p>
          </div>

          <div className="subscribe-actions">
            <button className="subscribe-btn join-channel-btn" onClick={handleJoinChannel}>
              <Send size={18} />
              <span>JOIN @generategm CHANNEL</span>
            </button>

            <button className="subscribe-btn confirm-sub-btn" onClick={onConfirmSubscribed}>
              <CheckCircle2 size={18} />
              <span>I HAVE SUBSCRIBED</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
