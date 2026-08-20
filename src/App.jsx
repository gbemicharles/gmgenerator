import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';

import Header from './components/Header';
import Hero from './components/Hero';
import CategorySelector from './components/CategorySelector';
import GeneratorCard from './components/GeneratorCard';
import ShareCardModal from './components/ShareCardModal';
import AchievementModal from './components/AchievementModal';
import FavoritesModal from './components/FavoritesModal';
import SlotMachineModal from './components/SlotMachineModal';
import SubmitGMModal from './components/SubmitGMModal';
import AddTokenModal from './components/AddTokenModal';
import StatsSection from './components/StatsSection';
import PedroCharactersSection from './components/PedroCharactersSection';
import EcosystemAppsSection from './components/EcosystemAppsSection';
import Footer from './components/Footer';
import ToastNotification from './components/ToastNotification';

import { getRandomGM, generateTokenGM } from './data/contentLibrary';
import { PEDRO_CHARACTERS } from './data/pedroCharacters';
import SubscribeChannelModal from './components/SubscribeChannelModal';
import { getHasSubscribedChannel, setHasSubscribedChannel } from './utils/channelSubManager';
import { escalateGM } from './utils/escalator';
import { getStreakData, registerGMGenerated } from './utils/streakManager';
import { evaluateAchievements, getUnlockedAchievements, ACHIEVEMENTS } from './utils/achievementManager';
import { getFavorites, toggleFavorite } from './utils/favoritesManager';
import { DEFAULT_MEME_TOKENS, getAllTokens } from './utils/customTokenManager';
import { audioEngine } from './utils/audioEngine';

import TelegramGroupBotBanner from './components/TelegramGroupBotBanner';
import { initTelegramWebApp, triggerHaptic } from './utils/telegramWebApp';

export default function App() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedToken, setSelectedToken] = useState(DEFAULT_MEME_TOKENS[0]); // Resistance Dog $REDO
  const [currentGM, setCurrentGM] = useState(null);
  const [activePedroCharacter, setActivePedroCharacter] = useState(null);
  const [recentHistory, setRecentHistory] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [userGenCount, setUserGenCount] = useState(0);
  const [hasSubscribedChannel, setHasSubscribedChannelState] = useState(() => getHasSubscribedChannel());

  // Stats & Achievements state
  const [streakData, setStreakData] = useState(() => getStreakData());
  const [unlockedIds, setUnlockedIds] = useState(() => getUnlockedAchievements());
  const [favoritesList, setFavoritesList] = useState(() => getFavorites());

  // Modals state
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [isAchievementModalOpen, setIsAchievementModalOpen] = useState(false);
  const [isFavoritesModalOpen, setIsFavoritesModalOpen] = useState(false);
  const [isSlotMachineOpen, setIsSlotMachineOpen] = useState(false);
  const [isSubmitGMOpen, setIsSubmitGMOpen] = useState(false);
  const [isAddTokenOpen, setIsAddTokenOpen] = useState(false);
  const [isSubscribeModalOpen, setIsSubscribeModalOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const toastTimeoutRef = useRef(null);

  const showToast = (type, message, title = null) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToast({ type, message, title });
    toastTimeoutRef.current = setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  // Initial Telegram WebApp initialization and load generation
  useEffect(() => {
    initTelegramWebApp();
    generateNewGM('all', null, false);
  }, []);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } catch (e) {}
  };

  const handleRegisterAndCheckAchievements = (catId, level) => {
    const updatedData = registerGMGenerated(catId, level);
    setStreakData(updatedData);

    const { unlockedIds: newUnlocked, newlyUnlocked } = evaluateAchievements(updatedData);
    setUnlockedIds(newUnlocked);

    if (newlyUnlocked.length > 0) {
      triggerConfetti();
      const first = newlyUnlocked[0];
      showToast('achievement', `You unlocked "${first.title}"!`, 'ACHIEVEMENT UNLOCKED! 🏆');
    }
  };

  const checkChannelSubscriptionGate = () => {
    if (userGenCount >= 1 && !hasSubscribedChannel) {
      setIsSubscribeModalOpen(true);
      return false;
    }
    return true;
  };

  const handleConfirmSubscribedChannel = () => {
    setHasSubscribedChannel();
    setHasSubscribedChannelState(true);
    setIsSubscribeModalOpen(false);
    showToast('info', 'Subscription verified! Full access unlocked 🚀', 'WELCOME TO @generategm');
  };

  const handleSelectPedroCharacter = (char) => {
    if (!checkChannelSubscriptionGate()) return;
    triggerHaptic('impact', 'rigid');

    setActivePedroCharacter(char);
    const quotes = char.gms;
    const chosenQuote = quotes[Math.floor(Math.random() * quotes.length)];
    const pedroTokenObj = DEFAULT_MEME_TOKENS.find(t => t.id === 'pedro');

    const newGM = {
      text: chosenQuote,
      category: 'pedro',
      token: pedroTokenObj,
      pedroCharacter: char,
      level: 1
    };

    setCurrentGM(newGM);
    setActiveCategory('pedro');
    audioEngine.playPedroBeat();
    setUserGenCount(prev => prev + 1);

    showToast('info', `${char.name} activated! GM generated 🦝🎶`, 'PEDRO CHARACTER ACTIVATED');

    handleRegisterAndCheckAchievements('pedro', 1);

    const cardEl = document.querySelector('.generator-card-wrapper');
    if (cardEl) {
      cardEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const generateNewGM = (catId = activeCategory, tokenTarget = selectedToken, playSound = true) => {
    if (playSound && !checkChannelSubscriptionGate()) {
      return;
    }

    triggerHaptic('impact', 'medium');
    setIsGenerating(true);
    setCopied(false);
    setUserGenCount(prev => prev + 1);

    setTimeout(() => {
      let gmText = '';
      let targetCat = catId;

      if (catId === 'meme_tokens') {
        gmText = generateTokenGM(tokenTarget || selectedToken);
      } else {
        const result = getRandomGM(catId, recentHistory);
        gmText = result.text;
        targetCat = result.category;
      }
      
      let matchedToken = null;
      if (catId === 'meme_tokens') {
        matchedToken = tokenTarget || selectedToken;
      } else if (targetCat === 'pedro') {
        matchedToken = DEFAULT_MEME_TOKENS.find(t => t.id === 'pedro') || null;
      }

      // Preserve or match Pedro character if available
      let charForGM = activePedroCharacter;
      if (targetCat === 'pedro' && !charForGM) {
        charForGM = PEDRO_CHARACTERS[Math.floor(Math.random() * PEDRO_CHARACTERS.length)];
      } else if (targetCat !== 'pedro') {
        charForGM = null;
      }
      
      const newGM = {
        text: gmText,
        category: targetCat,
        token: matchedToken,
        pedroCharacter: charForGM,
        level: 1
      };

      setCurrentGM(newGM);

      if (playSound) {
        if (targetCat === 'pedro' || tokenTarget?.id === 'pedro') {
          audioEngine.playPedroBeat();
        } else {
          audioEngine.playGMChime();
        }
      }

      setRecentHistory(prev => [gmText, ...prev].slice(0, 15));
      setIsGenerating(false);

      handleRegisterAndCheckAchievements(targetCat, 1);
    }, 280);
  };

  const handleSelectCategory = (catId) => {
    triggerHaptic('selection');
    setActiveCategory(catId);
    if (catId === 'pedro') {
      const pedroTokenObj = DEFAULT_MEME_TOKENS.find(t => t.id === 'pedro');
      setSelectedToken(pedroTokenObj);
    }
    generateNewGM(catId, selectedToken, true);
  };

  const handleSelectToken = (tokenObj) => {
    triggerHaptic('selection');
    setSelectedToken(tokenObj);
    generateNewGM('meme_tokens', tokenObj, true);
  };

  const handleEscalate = () => {
    if (!currentGM) return;
    if (!checkChannelSubscriptionGate()) return;

    triggerHaptic('impact', 'heavy');

    const currentLevel = currentGM.level || 1;
    const result = escalateGM(currentGM.text, currentLevel, currentGM.token, currentGM.category);

    const updatedGM = {
      ...currentGM,
      text: result.text,
      level: result.level
    };

    setCurrentGM(updatedGM);
    audioEngine.playEscalatedSound(result.level);

    if (result.level >= 5) {
      triggerConfetti();
      triggerHaptic('notification', 'warning');
      showToast('unhinged', 'MAXIMUM UNHINGED FINAL BOSS LEVEL REACHED! 🗿⚡', 'SYSTEM OVERLOAD');
    } else {
      showToast('info', `Escalated to Level ${result.level}! 💀`);
    }

    handleRegisterAndCheckAchievements(currentGM.category, result.level);
  };

  const handleToggleFav = (gmDataTarget) => {
    triggerHaptic('selection');
    const isFavNow = toggleFavorite(gmDataTarget || currentGM);
    setFavoritesList(getFavorites());
    audioEngine.playCopySound();
    
    if (isFavNow) {
      showToast('info', 'Saved to Favorites Vault! ⭐');
    } else {
      showToast('info', 'Removed from Favorites Vault.');
    }
  };

  const handleCopyText = (text) => {
    if (!text) return;
    triggerHaptic('notification', 'success');
    navigator.clipboard.writeText(text);
    audioEngine.playCopySound();
    setCopied(true);
    showToast('copy', 'GM copied to clipboard! 🫡');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleShareX = (text) => {
    if (!text) return;
    showToast('share', 'Opening X (Twitter)... 🚀');
    const tweetText = `${text} ☀️\n\nGenerated with @generategmbot`;
    const shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareTelegram = (text) => {
    if (!text) return;
    showToast('share', 'Opening Telegram... ✈️');
    const tgText = `${text} ☀️\n\nGenerated with @generategmbot`;
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent('https://t.me/generategmbot')}&text=${encodeURIComponent(tgText)}`;
    window.open(shareUrl, '_blank', 'noopener,noreferrer');
  };

  const scrollToStats = () => {
    const el = document.getElementById('stats-section-anchor');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="app-wrapper">
      <div className="app-container">
        <ToastNotification toast={toast} />

        <Header 
          streakData={streakData}
          unlockedCount={unlockedIds.length}
          totalAchievements={ACHIEVEMENTS.length}
          favoritesCount={favoritesList.length}
          onOpenAchievements={() => setIsAchievementModalOpen(true)}
          onOpenFavorites={() => setIsFavoritesModalOpen(true)}
          onOpenSlotMachine={() => setIsSlotMachineOpen(true)}
          onOpenSubmitGM={() => setIsSubmitGMOpen(true)}
          onOpenStats={scrollToStats}
        />

        <main className="main-content">
          <Hero 
            onPrimaryGenerate={() => generateNewGM(activeCategory, selectedToken, true)}
            isGenerating={isGenerating}
          />

          <CategorySelector 
            activeCategory={activeCategory}
            selectedToken={selectedToken}
            onSelectCategory={handleSelectCategory}
            onSelectToken={handleSelectToken}
            onOpenAddToken={() => setIsAddTokenOpen(true)}
          />

          <GeneratorCard 
            gmData={currentGM}
            isGenerating={isGenerating}
            onGenerateAgain={() => generateNewGM(activeCategory, selectedToken, true)}
            onEscalate={handleEscalate}
            onCopy={handleCopyText}
            onShareX={handleShareX}
            onShareTelegram={handleShareTelegram}
            onToggleFavorite={handleToggleFav}
            onOpenCardModal={() => setIsCardModalOpen(true)}
            copied={copied}
          />

          <TelegramGroupBotBanner />

          <PedroCharactersSection 
            onSelectPedroCharacter={handleSelectPedroCharacter}
            activeCharacterId={activePedroCharacter?.id}
          />

          <EcosystemAppsSection />

          <div id="stats-section-anchor">
            <StatsSection streakData={streakData} />
          </div>
        </main>
      </div>

      <Footer />

      <ShareCardModal 
        isOpen={isCardModalOpen}
        onClose={() => setIsCardModalOpen(false)}
        gmData={currentGM}
        onShareX={handleShareX}
        onShareTelegram={handleShareTelegram}
      />

      <AchievementModal 
        isOpen={isAchievementModalOpen}
        onClose={() => setIsAchievementModalOpen(false)}
        streakData={streakData}
      />

      <FavoritesModal 
        isOpen={isFavoritesModalOpen}
        onClose={() => setIsFavoritesModalOpen(false)}
        onCopy={handleCopyText}
        onShareX={handleShareX}
        onShareTelegram={handleShareTelegram}
        onFavoritesUpdated={() => setFavoritesList(getFavorites())}
      />

      <SlotMachineModal 
        isOpen={isSlotMachineOpen}
        onClose={() => setIsSlotMachineOpen(false)}
        onCopy={handleCopyText}
        onShareX={handleShareX}
        onShareTelegram={handleShareTelegram}
      />

      <SubmitGMModal 
        isOpen={isSubmitGMOpen}
        onClose={() => setIsSubmitGMOpen(false)}
        onSubmitted={() => {
          showToast('info', 'Custom GM added to your generator pool! 🚀');
          generateNewGM(activeCategory, selectedToken, true);
        }}
      />

      <AddTokenModal 
        isOpen={isAddTokenOpen}
        onClose={() => setIsAddTokenOpen(false)}
        onTokenAdded={(newToken) => {
          setSelectedToken(newToken);
          setActiveCategory('meme_tokens');
          showToast('info', `Token ${newToken.ticker} added to community list! 🚀`);
          generateNewGM('meme_tokens', newToken, true);
        }}
      />

      <SubscribeChannelModal 
        isOpen={isSubscribeModalOpen}
        onClose={() => setIsSubscribeModalOpen(false)}
        onConfirmSubscribed={handleConfirmSubscribedChannel}
      />
    </div>
  );
}
