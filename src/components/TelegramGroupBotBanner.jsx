import React from 'react';
import { Bot, Sparkles, Send } from 'lucide-react';
import { triggerHaptic, openTelegramLink } from '../utils/telegramWebApp';

export default function TelegramGroupBotBanner() {
  const handleAddBotToGroup = () => {
    triggerHaptic('impact', 'medium');
    const botUrl = 'https://t.me/generategmbot?startgroup=true';
    openTelegramLink(botUrl);
  };

  return (
    <div className="telegram-bot-banner">
      <div className="banner-content">
        <div className="bot-avatar">
          <Bot size={22} className="bot-icon" />
        </div>

        <div className="bot-text-wrap">
          <div className="bot-badge-row">
            <span className="bot-tag">TELEGRAM GROUP BOT COMMANDS</span>
            <span className="bot-username">@generategmbot</span>
          </div>

          <h3 className="bot-heading">
            Add @generategmbot to Your Telegram Groups
          </h3>

          <p className="bot-description">
            Run <code className="cmd-code">/gm</code>, <code className="cmd-code">/pedro</code>, <code className="cmd-code">/unhinged</code>, or <code className="cmd-code">/redo</code> in any chat to instantly drop unhinged GM memes for your community!
          </p>
        </div>

        <button className="add-bot-group-btn" onClick={handleAddBotToGroup}>
          <Send size={16} />
          <span>ADD TO GROUP</span>
        </button>
      </div>
    </div>
  );
}
