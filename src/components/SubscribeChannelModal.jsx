import React, { useState } from 'react';
import { Send, CheckCircle2, Lock, Sparkles, ArrowLeft, RefreshCw, AlertCircle } from 'lucide-react';
import { triggerHaptic } from '../utils/telegramWebApp';
import { audioEngine } from '../utils/audioEngine';

export default function SubscribeChannelModal({ isOpen, onClose, onConfirmSubscribed }) {
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  if (!isOpen) return null;

  const handleJoinChannel = () => {
    setErrorMsg(null);
    const channelUrl = 'https://t.me/generategm';
    if (window.Telegram?.WebApp?.openTelegramLink) {
      window.Telegram.WebApp.openTelegramLink(channelUrl);
    } else {
      window.open(channelUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleVerifySubscription = async () => {
    setIsVerifying(true);
    setErrorMsg(null);
    triggerHaptic('impact', 'medium');

    const tgUser = window.Telegram?.WebApp?.initDataUnsafe?.user;
    const userId = tgUser?.id;

    // If outside Telegram or no User ID (e.g. testing in desktop browser without Telegram initData)
    if (!userId) {
      setTimeout(() => {
        setIsVerifying(false);
        audioEngine.playGMChime();
        triggerHaptic('notification', 'success');
        onConfirmSubscribed();
      }, 1000);
      return;
    }

    try {
      const botToken = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || import.meta.env.TELEGRAM_BOT_TOKEN;
      let isSubscribed = false;
      let checkSuccess = false;

      if (botToken) {
        // Direct Telegram API check from client using botToken
        const channelUsername = '@generategm';
        const url = `https://api.telegram.org/bot${botToken}/getChatMember?chat_id=${encodeURIComponent(channelUsername)}&user_id=${userId}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.ok && data.result) {
          checkSuccess = true;
          const status = data.result.status;
          isSubscribed = ['creator', 'administrator', 'member', 'restricted'].includes(status);
        } else {
          console.warn('Telegram API check error:', data);
        }
      }

      // If client didn't have botToken or direct check didn't succeed, try server API
      if (!checkSuccess) {
        try {
          const res = await fetch(`/api/verify-sub?userId=${userId}`);
          const data = await res.json();
          if (data.ok || data.status) {
            isSubscribed = data.isSubscribed;
            checkSuccess = true;
          }
        } catch (e) {
          console.warn('Server sub verify endpoint error:', e);
        }
      }

      if (isSubscribed) {
        setIsVerifying(false);
        audioEngine.playGMChime();
        triggerHaptic('notification', 'success');
        onConfirmSubscribed();
      } else {
        setIsVerifying(false);
        audioEngine.playSlotSpin();
        triggerHaptic('notification', 'error');

        if (!botToken && !checkSuccess) {
          setErrorMsg('⚠️ Telegram Bot Token is missing. Please set VITE_TELEGRAM_BOT_TOKEN to enable real Telegram membership check.');
        } else {
          setErrorMsg('❌ Verification failed: You have not joined @generategm yet! Tap JOIN @generategm CHANNEL first, then tap Verify.');
        }
      }
    } catch (e) {
      console.error('Subscription verification failed:', e);
      setIsVerifying(false);
      setErrorMsg('❌ Failed to check subscription status. Please ensure you have joined @generategm channel.');
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

          {errorMsg && (
            <div className="verify-error-box" style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#FCA5A5',
              padding: '0.75rem 1rem',
              borderRadius: '12px',
              fontSize: '0.85rem',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              lineHeight: '1.4'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="subscribe-actions">
            <button className="subscribe-btn join-channel-btn" onClick={handleJoinChannel}>
              <Send size={18} />
              <span>JOIN @generategm CHANNEL</span>
            </button>

            <button 
              className="subscribe-btn confirm-sub-btn" 
              onClick={handleVerifySubscription}
              disabled={isVerifying}
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="animate-spin" size={18} />
                  <span>VERIFYING ON TELEGRAM...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  <span>VERIFY SUBSCRIPTION</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
