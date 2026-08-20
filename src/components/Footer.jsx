import React from 'react';

export default function Footer() {
  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-compact-row">
          <div className="footer-brand-meta">
            <span className="footer-sun">☀️</span>
            <span className="footer-title">GM GENERATOR</span>
            <span className="footer-divider">•</span>
            <span className="creator-text">Made by <strong>Gbemicharles</strong></span>
          </div>

          <div className="footer-social-links">
            <a 
              href="https://x.com/gbemicharles_" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              X / Twitter
            </a>
            <span className="dot-divider">•</span>
            <a 
              href="https://t.me/gbemicharles" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              Telegram
            </a>
            <span className="dot-divider">•</span>
            <a 
              href="https://gbemicharles.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="social-link"
            >
              Website
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
