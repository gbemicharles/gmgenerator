import React from 'react';

export default function Footer() {
  const MICROCOPY = [
    "Your daily contribution to Crypto Twitter & Telegram.",
    "Zero utility. Maximum vibes.",
    "Powered by Pedro Team audio memecoin culture.",
    "Because saying GM wasn't unhinged enough.",
    "Your portfolio may be down. Your GM doesn't have to be."
  ];

  const randomCopy = MICROCOPY[Math.floor(Math.random() * MICROCOPY.length)];

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-top-row">
          <div className="footer-brand">
            <span className="footer-sun">☀️</span>
            <span className="footer-title">GM GENERATOR</span>
            <span className="footer-pedro-tag">POWERED BY PEDRO TEAM 🦝</span>
          </div>

          <p className="footer-tagline">“{randomCopy}”</p>
        </div>

        {/* CREATOR BRANDING & SOCIAL LINKS */}
        <div className="creator-footer-card">
          <div className="creator-info-group">
            <span className="creator-text">Made by <strong className="creator-name">Gbemicharles</strong></span>
            <span className="creator-divider">|</span>

            <div className="creator-social-links">
              <a 
                href="https://x.com/gbemicharles_" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link x-link"
              >
                <span>X / Twitter</span>
              </a>

              <span className="dot-divider">•</span>

              <a 
                href="https://t.me/gbemicharles" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link tg-link"
              >
                <span>Telegram</span>
              </a>

              <span className="dot-divider">•</span>

              <a 
                href="https://gbemicharles.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link web-link"
              >
                <span>Website 🌐</span>
              </a>
            </div>
          </div>

          <div className="disclaimer-text">
            <span>Entertainment & Meme Utility Only</span>
          </div>
        </div>

        <div className="footer-copyright">
          © {new Date().getFullYear()} GM Generator. WAGMI frens. 🫡
        </div>
      </div>
    </footer>
  );
}
