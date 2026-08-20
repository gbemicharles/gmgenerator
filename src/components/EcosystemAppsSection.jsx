import React from 'react';
import { ECOSYSTEM_APPS } from '../data/ecosystemApps';
import { Sparkles, ExternalLink, Rocket, ShieldCheck } from 'lucide-react';
import { triggerHaptic, openTelegramLink } from '../utils/telegramWebApp';

export default function EcosystemAppsSection() {
  const handleLaunchApp = (app) => {
    triggerHaptic('impact', 'medium');
    openTelegramLink(app.link);
  };

  return (
    <section className="ecosystem-section" id="ecosystem-apps-anchor">
      <div className="ecosystem-header">
        <div className="ecosystem-badge-row">
          <span className="ecosystem-team-badge">
            <Sparkles size={14} /> MORE PRODUCTS BY THE MAKER
          </span>
        </div>
        <h2 className="ecosystem-title">
          EXPLORE <span className="ecosystem-glow-text">MORE FUN MINI APPS</span>
        </h2>
        <p className="ecosystem-subtitle">
          Check out other unhinged Web3 Mini Apps and Telegram bots built by <strong>Gbemicharles</strong> & the <strong>Pedro Team</strong>.
        </p>
      </div>

      <div className="ecosystem-grid">
        {ECOSYSTEM_APPS.map((app) => (
          <div 
            key={app.id}
            className={`ecosystem-card ${!app.isAvailable ? 'is-disabled' : ''}`}
            style={{ '--app-accent': app.color }}
          >
            <div className="ecosystem-card-glow" style={{ backgroundColor: app.color }}></div>

            <div className="ecosystem-card-header">
              <div className="app-icon-wrap" style={{ borderColor: app.color }}>
                <span className="app-emoji">{app.icon}</span>
              </div>

              <div className="app-title-group">
                <div className="app-badge-row">
                  <span className="app-badge" style={{ backgroundColor: `${app.color}22`, color: app.color, borderColor: app.color }}>
                    {app.badge}
                  </span>
                  <span className="app-bot-tag">{app.botUsername}</span>
                </div>
                <h3 className="app-name">{app.name}</h3>
                <span className="app-tagline">{app.tagline}</span>
              </div>
            </div>

            <p className="app-description">{app.description}</p>

            <div className="ecosystem-card-footer">
              {app.isAvailable ? (
                <button className="launch-app-btn" onClick={() => handleLaunchApp(app)}>
                  <span>LAUNCH MINI APP</span>
                  <ExternalLink size={16} />
                </button>
              ) : (
                <button className="launch-app-btn disabled-btn" disabled>
                  <span>IN DEVELOPMENT</span>
                  <Rocket size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
