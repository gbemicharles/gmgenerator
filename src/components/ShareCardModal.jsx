import React, { useRef, useState } from 'react';
import { X, ArrowLeft, Download, Share2, Copy, Sparkles, Check, Send, Palette } from 'lucide-react';
import html2canvas from 'html2canvas';
import { CATEGORIES } from '../data/contentLibrary';
import { ESCALATION_LEVELS } from '../utils/escalator';

const CARD_THEMES = [
  { id: 'cyber', name: 'Cyber Dark 🌌', bg: 'linear-gradient(135deg, #0F172A 0%, #020617 100%)', border: '#38BDF8' },
  { id: 'pedro', name: 'Pedro Gold 🦝', bg: 'linear-gradient(135deg, #1C1300 0%, #3B2400 100%)', border: '#FF7D00' },
  { id: 'matrix', name: 'Matrix Green 🟢', bg: 'linear-gradient(135deg, #022C22 0%, #064E3B 100%)', border: '#00E676' },
  { id: 'solana', name: 'Solana Purple 💜', bg: 'linear-gradient(135deg, #2E1065 0%, #1E1B4B 100%)', border: '#9945FF' }
];

export default function ShareCardModal({ isOpen, onClose, gmData, onShareX, onShareTelegram }) {
  const cardRef = useRef(null);
  const [selectedTheme, setSelectedTheme] = useState('cyber');
  const [isExporting, setIsExporting] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);

  if (!isOpen || !gmData) return null;

  const catObj = CATEGORIES.find(c => c.id === gmData.category) || { name: 'GM', icon: '☀️', color: '#F59E0B' };
  const levelObj = ESCALATION_LEVELS.find(l => l.level === (gmData.level || 1)) || ESCALATION_LEVELS[0];
  const themeObj = CARD_THEMES.find(t => t.id === selectedTheme) || CARD_THEMES[0];

  const handleDownloadPNG = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });

      const imageURI = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = `gm-generator-${Date.now()}.png`;
      link.href = imageURI;
      link.click();
    } catch (err) {
      console.error('Failed to generate PNG image', err);
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyImageToClipboard = async () => {
    if (!cardRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 3,
        useCORS: true,
        backgroundColor: null,
        logging: false
      });

      canvas.toBlob(async (blob) => {
        if (blob && navigator.clipboard && navigator.clipboard.write) {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopiedImage(true);
          setTimeout(() => setCopiedImage(false), 2500);
        }
      });
    } catch (err) {
      console.error('Failed to copy image to clipboard', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content card-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Shareable GM Card</h3>
          <button className="modal-close-btn" onClick={onClose} title="Back">
            <ArrowLeft size={16} /> <span>Back</span>
          </button>
        </div>

        <div className="modal-body">
          {/* Card Theme Picker */}
          <div className="card-theme-picker">
            <span className="theme-picker-label">
              <Palette size={14} /> CARD THEME:
            </span>
            <div className="theme-pills">
              {CARD_THEMES.map(theme => (
                <button
                  key={theme.id}
                  className={`theme-pill ${selectedTheme === theme.id ? 'active' : ''}`}
                  onClick={() => setSelectedTheme(theme.id)}
                >
                  {theme.name}
                </button>
              ))}
            </div>
          </div>

          {/* Rendered Shareable Card Target */}
          <div className="shareable-card-preview-area">
            <div 
              ref={cardRef} 
              className="export-card-canvas"
              style={{
                background: themeObj.bg,
                borderColor: themeObj.border,
                '--card-accent': themeObj.border
              }}
            >
              <div className="card-top-row">
                <div className="card-sun-logo">
                  <span className="sun-icon-lg">☀️</span>
                  <span className="card-brand-title">GM</span>
                </div>

                <div className="card-tag" style={{ backgroundColor: `${catObj.color}25`, color: catObj.color, borderColor: catObj.color }}>
                  <span>{catObj.icon} {catObj.name}</span>
                </div>
              </div>

              {gmData?.pedroCharacter && (
                <div className="card-pedro-character-badge">
                  <img 
                    src={gmData.pedroCharacter.nobg || gmData.pedroCharacter.image} 
                    alt={gmData.pedroCharacter.name} 
                    className="card-pedro-img"
                  />
                  <span className="card-pedro-char-name">{gmData.pedroCharacter.name}</span>
                </div>
              )}

              <div className="card-main-quote">
                “{gmData.text}”
              </div>

              <div className="card-bottom-row">
                <div className="card-watermark">
                  <Sparkles size={12} />
                  <span>GM GENERATOR • @generategmbot • POWERED BY PEDRO TEAM 🦝</span>
                </div>

                {gmData.level > 1 && (
                  <div className="card-level-badge">
                    <span>UNHINGED L{gmData.level} {levelObj.emoji}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="card-modal-actions">
            <button 
              className="modal-action-btn primary-download" 
              onClick={handleDownloadPNG}
              disabled={isExporting}
            >
              <Download size={18} />
              <span>{isExporting ? 'EXPORTING PNG...' : 'DOWNLOAD CARD (.PNG)'}</span>
            </button>

            <button 
              className="modal-action-btn copy-img"
              onClick={handleCopyImageToClipboard}
              disabled={isExporting}
            >
              {copiedImage ? <Check size={18} /> : <Copy size={18} />}
              <span>{copiedImage ? 'COPIED 🫡' : 'COPY IMAGE'}</span>
            </button>

            <button 
              className="modal-action-btn share-x"
              onClick={() => onShareX(gmData.text)}
            >
              <Share2 size={18} />
              <span>SHARE X</span>
            </button>

            <button 
              className="modal-action-btn share-tg"
              onClick={() => onShareTelegram(gmData.text)}
            >
              <Send size={18} />
              <span>SHARE TG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
