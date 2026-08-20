import React from 'react';
import { Sparkles, Trophy, Check, Share2 } from 'lucide-react';

export default function ToastNotification({ toast }) {
  if (!toast) return null;

  const { type, message, title } = toast;

  return (
    <div className={`toast-banner toast-${type}`}>
      <div className="toast-icon">
        {type === 'achievement' && <Trophy size={20} className="trophy-bounce" />}
        {type === 'copy' && <Check size={20} />}
        {type === 'share' && <Share2 size={20} />}
        {type === 'info' && <Sparkles size={20} />}
      </div>

      <div className="toast-content">
        {title && <span className="toast-title">{title}</span>}
        <span className="toast-msg">{message}</span>
      </div>
    </div>
  );
}
