import React, { useState } from 'react';
import { CATEGORIES } from '../data/contentLibrary';
import { Search, PlusCircle, Coins } from 'lucide-react';
import { getAllTokens } from '../utils/customTokenManager';

export default function CategorySelector({
  activeCategory,
  selectedToken,
  onSelectCategory,
  onSelectToken,
  onOpenAddToken
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const allTokens = getAllTokens();

  const filteredCategories = CATEGORIES.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="category-container">
      <div className="category-header">
        <div className="category-title">
          <span>SELECT GM STYLE</span>
          <span className="category-count">{CATEGORIES.length - 1} CATEGORIES</span>
        </div>

        <div className="category-search-box">
          <Search size={14} className="search-icon" />
          <input
            type="text"
            placeholder="Search categories (e.g. TON Memes, Pedro)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="category-pills-grid">
        {filteredCategories.map(cat => {
          const isActive = activeCategory === cat.id;
          const isSurprise = cat.id === 'all';
          const isMemeTokens = cat.id === 'meme_tokens';

          return (
            <button
              key={cat.id}
              className={`category-pill ${isActive ? 'is-active' : ''} ${isSurprise ? 'is-surprise' : ''} ${isMemeTokens ? 'is-meme-tokens' : ''}`}
              style={{
                '--pill-accent': cat.color
              }}
              onClick={() => onSelectCategory(cat.id)}
            >
              <span className="pill-icon">{cat.icon}</span>
              <span className="pill-name">{cat.name}</span>
              {isActive && <span className="pill-dot"></span>}
            </button>
          );
        })}
      </div>

      {/* Sub-bar for TON Meme Tokens when meme_tokens category is selected */}
      {activeCategory === 'meme_tokens' && (
        <div className="token-subbar-container">
          <div className="token-subbar-header">
            <span className="token-subbar-title">
              <Coins size={14} /> Select Memecoin:
            </span>
            <button className="add-token-quick-btn" onClick={onOpenAddToken}>
              <PlusCircle size={14} />
              <span>+ Add Token</span>
            </button>
          </div>

          <div className="token-pills-grid">
            {allTokens.map(token => {
              const isTokenActive = selectedToken?.id === token.id;

              return (
                <button
                  key={token.id}
                  className={`token-pill ${isTokenActive ? 'is-active' : ''}`}
                  onClick={() => onSelectToken(token)}
                  title={token.desc}
                >
                  <span className="token-icon">{token.icon}</span>
                  <span className="token-name">{token.name}</span>
                  <span className="token-ticker">{token.ticker}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
