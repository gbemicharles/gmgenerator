import React from 'react';
import { X, Star, Copy, Share2, Send, Trash2 } from 'lucide-react';
import { getFavorites, toggleFavorite } from '../utils/favoritesManager';
import { CATEGORIES } from '../data/contentLibrary';

export default function FavoritesModal({ isOpen, onClose, onCopy, onShareX, onShareTelegram, onFavoritesUpdated }) {
  if (!isOpen) return null;

  const favorites = getFavorites();

  const handleRemove = (favItem) => {
    toggleFavorite(favItem);
    if (onFavoritesUpdated) onFavoritesUpdated();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content favorites-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-with-badge">
            <Star className="star-gold" size={22} />
            <h3>FAVORITES VAULT</h3>
            <span className="unlocked-pill">{favorites.length} SAVED</span>
          </div>
          <button className="modal-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className="modal-body">
          {favorites.length === 0 ? (
            <div className="empty-favorites-state">
              <Star size={40} className="empty-star" />
              <p className="empty-title">Your vault is empty</p>
              <p className="empty-desc">Star any generated GM to save it here for quick copying & sharing!</p>
            </div>
          ) : (
            <div className="favorites-list">
              {favorites.map(item => {
                const catObj = CATEGORIES.find(c => c.id === item.category) || { name: 'GM', icon: '☀️', color: '#F59E0B' };

                return (
                  <div key={item.id} className="favorite-card">
                    <div className="fav-card-header">
                      <span className="fav-cat-tag" style={{ color: catObj.color, borderColor: catObj.color }}>
                        {catObj.icon} {catObj.name}
                      </span>
                      <button className="fav-delete-btn" onClick={() => handleRemove(item)} title="Remove from favorites">
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <p className="fav-text">“{item.text}”</p>

                    <div className="fav-card-actions">
                      <button className="fav-action-btn copy" onClick={() => onCopy(item.text)}>
                        <Copy size={14} /> Copy
                      </button>
                      <button className="fav-action-btn share-x" onClick={() => onShareX(item.text)}>
                        <Share2 size={14} /> Share X
                      </button>
                      <button className="fav-action-btn share-tg" onClick={() => onShareTelegram(item.text)}>
                        <Send size={14} /> Share TG
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
