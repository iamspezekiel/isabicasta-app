/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Coins, Sparkles, Clock, Info } from 'lucide-react';
import { CoinFlip } from './components/CoinFlip';
import { CastLots } from './components/CastLots';
import { OnboardingSlider } from './components/OnboardingSlider';
import { HistoryPage } from './components/HistoryPage';
import { ProfilePage } from './components/ProfilePage';
import { AboutPage } from './components/AboutPage';
import { Preloader } from './components/Preloader';
import { soundFx } from './utils/sound';
import { DecisionHistoryItem, AppSettings, UserProfile } from './types';

const DEFAULT_SETTINGS: AppSettings = {
  soundEnabled: true,
  hapticsEnabled: true,
  defaultMode: 'coin',
  animationSpeed: 'normal',
};

const DEFAULT_PROFILE: UserProfile = {
  displayName: 'Decision Maker',
  avatarInitials: 'DM',
  themePreference: 'system',
  createdAt: Date.now(),
};

export default function App() {
  const [showPreloader, setShowPreloader] = useState(true);
  const [activeTab, setActiveTab] = useState<'coin' | 'lots'>('coin');
  const [currentView, setCurrentView] = useState<'decision' | 'history' | 'profile' | 'about'>('decision');
  const [history, setHistory] = useState<DecisionHistoryItem[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);

  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const stored = localStorage.getItem('isabicasta_settings');
      return stored ? { ...DEFAULT_SETTINGS, ...JSON.parse(stored) } : DEFAULT_SETTINGS;
    } catch {
      return DEFAULT_SETTINGS;
    }
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    try {
      const stored = localStorage.getItem('isabicasta_profile');
      return stored ? { ...DEFAULT_PROFILE, ...JSON.parse(stored) } : DEFAULT_PROFILE;
    } catch {
      return DEFAULT_PROFILE;
    }
  });

  useEffect(() => {
    try {
      const hasCompleted = localStorage.getItem('isabicasta_onboarding_completed');
      if (!hasCompleted) {
        setIsFirstTimeUser(true);
        setShowOnboarding(true);
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem('isabicasta_history');
      if (stored) {
        setHistory(JSON.parse(stored));
      }
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    soundFx.setMuted(!settings.soundEnabled);
  }, [settings.soundEnabled]);

  const handleCompleteOnboarding = () => {
    try {
      localStorage.setItem('isabicasta_onboarding_completed', 'true');
    } catch {
      // ignore
    }
    setShowOnboarding(false);
  };

  const handleUpdateSettings = (partial: Partial<AppSettings>) => {
    setSettings((prev: AppSettings) => {
      const updated = { ...prev, ...partial };
      try {
        localStorage.setItem('isabicasta_settings', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleUpdateProfile = (partial: Partial<UserProfile>) => {
    setProfile((prev: UserProfile) => {
      const updated = { ...prev, ...partial };
      if (partial.displayName) {
        const words = partial.displayName.trim().split(/\s+/);
        if (words.length >= 2) {
          updated.avatarInitials = (words[0][0] + words[1][0]).toUpperCase();
        } else if (words.length === 1 && words[0].length > 0) {
          updated.avatarInitials = words[0].slice(0, 2).toUpperCase();
        }
      }
      try {
        localStorage.setItem('isabicasta_profile', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleRecordHistory = (item: Omit<DecisionHistoryItem, 'id' | 'timestamp'>) => {
    const newItem: DecisionHistoryItem = {
      ...item,
      id: 'dec_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      timestamp: Date.now(),
    };

    setHistory((prev) => {
      const updated = [newItem, ...prev].slice(0, 100);
      try {
        localStorage.setItem('isabicasta_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem('isabicasta_history');
    } catch {
      // ignore
    }
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => {
      const updated = prev.filter((item) => item.id !== id);
      try {
        localStorage.setItem('isabicasta_history', JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });
  };

  const handleResetApp = () => {
    try {
      localStorage.removeItem('isabicasta_history');
      localStorage.removeItem('isabicasta_settings');
      localStorage.removeItem('isabicasta_profile');
      localStorage.removeItem('isabicasta_onboarding_completed');
    } catch {
      // ignore
    }
    setHistory([]);
    setSettings(DEFAULT_SETTINGS);
    setProfile(DEFAULT_PROFILE);
    setCurrentView('decision');
    setShowOnboarding(true);
    setIsFirstTimeUser(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#f3ece1] text-[#2a241c] selection:bg-[#8c6239]/20 selection:text-[#2a241c] touch-pan-y relative overflow-x-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-[#faf6ef]/90 backdrop-blur-md border-b border-[#dfd4c3]">
        <div className="max-w-3xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
          {/* Brand Logo & Wordmark */}
          <button
            type="button"
            onClick={() => {
              setShowOnboarding(false);
              setCurrentView('decision');
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-[#faf6ef] border border-[#dfd4c3] text-[#8c6239] flex items-center justify-center font-bold text-base font-heading shadow-2xs">
              ✦
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold font-heading text-[#2a241c] leading-none tracking-tight">
                IsabiCasta
              </span>
              <span className="text-xs text-[#6f665c] font-normal hidden sm:block mt-0.5">
                A private way to choose, when you are undecided.
              </span>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5 text-xs font-semibold text-[#6f665c]">
            <button
              onClick={() => {
                setShowOnboarding(false);
                setCurrentView('decision');
              }}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'decision'
                  ? 'text-[#2a241c] bg-[#e8dfd2] font-bold'
                  : 'hover:text-[#2a241c] hover:bg-[#faf6ef]'
              }`}
            >
              Decide
            </button>
            <button
              onClick={() => {
                setShowOnboarding(false);
                setCurrentView('history');
              }}
              className={`px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer ${
                currentView === 'history'
                  ? 'text-[#2a241c] bg-[#e8dfd2] font-bold'
                  : 'hover:text-[#2a241c] hover:bg-[#faf6ef]'
              }`}
            >
              <span>History</span>
              {history.length > 0 && (
                <span className="text-[11px] bg-[#8c6239] text-[#faf6ef] px-1.5 py-0.2 rounded-full font-mono">
                  {history.length}
                </span>
              )}
            </button>
            <button
              onClick={() => {
                setShowOnboarding(false);
                setCurrentView('about');
              }}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                currentView === 'about'
                  ? 'text-[#2a241c] bg-[#e8dfd2] font-bold'
                  : 'hover:text-[#2a241c] hover:bg-[#faf6ef]'
              }`}
            >
              About
            </button>
          </nav>

          {/* User Profile Navigation */}
          <button
            type="button"
            onClick={() => {
              setShowOnboarding(false);
              setCurrentView(currentView === 'profile' ? 'decision' : 'profile');
            }}
            className={`flex items-center gap-2 px-2.5 py-1.5 rounded-xl transition-colors min-h-[40px] border cursor-pointer ${
              currentView === 'profile'
                ? 'bg-[#e8dfd2] border-[#8c6239] text-[#2a241c]'
                : 'bg-[#faf6ef] hover:bg-[#f3ece1] border-[#dfd4c3] text-[#2a241c]'
            }`}
            title="User Profile & Settings"
            aria-label="User Profile and Settings"
          >
            <div className="w-7 h-7 rounded-lg bg-[#8c6239] text-[#faf6ef] flex items-center justify-center font-bold text-xs font-heading">
              {(profile.displayName || 'U').slice(0, 2).toUpperCase()}
            </div>
            <span className="text-xs font-semibold max-w-[110px] truncate hidden sm:inline text-[#2a241c]">
              {profile.displayName || 'Profile'}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 pt-6 sm:pt-10 pb-24 md:pb-12 flex flex-col items-center">
        {currentView === 'profile' ? (
          <ProfilePage
            profile={profile}
            settings={settings}
            history={history}
            onUpdateProfile={handleUpdateProfile}
            onUpdateSettings={handleUpdateSettings}
            onClearHistory={handleClearHistory}
            onResetApp={handleResetApp}
            onReplayOnboarding={() => setShowOnboarding(true)}
            onBackToDecision={() => setCurrentView('decision')}
            onNavigateToAbout={() => setCurrentView('about')}
            onNavigateToHistory={() => setCurrentView('history')}
          />
        ) : currentView === 'history' ? (
          <HistoryPage
            history={history}
            onClearHistory={handleClearHistory}
            onDeleteItem={handleDeleteHistoryItem}
            onBackToDecision={() => setCurrentView('decision')}
          />
        ) : currentView === 'about' ? (
          <AboutPage
            onBackToDecision={() => setCurrentView('decision')}
            onNavigateToProfile={() => setCurrentView('profile')}
            onReplayOnboarding={() => setShowOnboarding(true)}
          />
        ) : (
          <div className="w-full space-y-6">
            {/* Title & Tagline */}
            <div className="text-center space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#2a241c] tracking-tight">
                Cast a Decision
              </h1>
              <p className="text-xs sm:text-sm text-[#6f665c]">
                A private way to choose, when you are undecided.
              </p>
            </div>

            {/* Segmented Controller */}
            <div className="w-full p-1 bg-[#eae2d6] border border-[#dfd4c3] rounded-2xl grid grid-cols-2 gap-1">
              <button
                type="button"
                onClick={() => setActiveTab('coin')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'coin'
                    ? 'bg-[#faf6ef] text-[#2a241c] border border-[#dfd4c3] shadow-xs'
                    : 'text-[#6f665c] hover:text-[#2a241c]'
                }`}
              >
                <Coins className="w-4 h-4 text-[#8c6239]" />
                <span>Three-Flip Coin</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('lots')}
                className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors min-h-[44px] flex items-center justify-center gap-2 cursor-pointer ${
                  activeTab === 'lots'
                    ? 'bg-[#faf6ef] text-[#2a241c] border border-[#dfd4c3] shadow-xs'
                    : 'text-[#6f665c] hover:text-[#2a241c]'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#8c6239]" />
                <span>Cast Lots</span>
              </button>
            </div>

            {/* Decision Card Container */}
            <div className="w-full bg-[#faf6ef] border border-[#dfd4c3] rounded-3xl p-6 sm:p-7 shadow-xs relative">
              <AnimatePresence mode="wait">
                {activeTab === 'coin' ? (
                  <motion.div
                    key="coin-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CoinFlip onRecordHistory={handleRecordHistory} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="lots-view"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <CastLots onRecordHistory={handleRecordHistory} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </main>

      {/* Fixed Bottom Navigation Bar for Mobile Thumb Ergonomics */}
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#faf6ef]/95 backdrop-blur-md border-t border-[#dfd4c3] md:hidden pb-safe shadow-xs"
        aria-label="Mobile Navigation"
      >
        <div className="grid grid-cols-4 items-center h-16 max-w-md mx-auto px-2">
          {/* Tab 1: Flip Coin */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('coin');
              setCurrentView('decision');
              setShowOnboarding(false);
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors relative cursor-pointer ${
              currentView === 'decision' && activeTab === 'coin'
                ? 'text-[#2a241c] font-bold'
                : 'text-[#6f665c] hover:text-[#2a241c]'
            }`}
          >
            <Coins className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-medium tracking-tight">Three-Flip</span>
            {currentView === 'decision' && activeTab === 'coin' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8c6239] mt-0.5" />
            )}
          </button>

          {/* Tab 2: Cast lot */}
          <button
            type="button"
            onClick={() => {
              setActiveTab('lots');
              setCurrentView('decision');
              setShowOnboarding(false);
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors relative cursor-pointer ${
              currentView === 'decision' && activeTab === 'lots'
                ? 'text-[#2a241c] font-bold'
                : 'text-[#6f665c] hover:text-[#2a241c]'
            }`}
          >
            <Sparkles className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-medium tracking-tight">Cast Lot</span>
            {currentView === 'decision' && activeTab === 'lots' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8c6239] mt-0.5" />
            )}
          </button>

          {/* Tab 3: History (Standalone Page) */}
          <button
            type="button"
            onClick={() => {
              setShowOnboarding(false);
              setCurrentView('history');
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors relative cursor-pointer ${
              currentView === 'history' ? 'text-[#2a241c] font-bold' : 'text-[#6f665c] hover:text-[#2a241c]'
            }`}
          >
            <div className="relative">
              <Clock className="w-5 h-5 mb-0.5" />
              {history.length > 0 && (
                <span className="absolute -top-1 -right-2 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-[#8c6239] text-[#faf6ef] min-w-[16px] text-center">
                  {history.length > 99 ? '99+' : history.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-medium tracking-tight">History</span>
            {currentView === 'history' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8c6239] mt-0.5" />
            )}
          </button>

          {/* Tab 4: About */}
          <button
            type="button"
            onClick={() => {
              setShowOnboarding(false);
              setCurrentView('about');
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] transition-colors relative cursor-pointer ${
              currentView === 'about' ? 'text-[#2a241c] font-bold' : 'text-[#6f665c] hover:text-[#2a241c]'
            }`}
          >
            <Info className="w-5 h-5 mb-0.5" />
            <span className="text-[11px] font-medium tracking-tight">About</span>
            {currentView === 'about' && (
              <span className="w-1.5 h-1.5 rounded-full bg-[#8c6239] mt-0.5" />
            )}
          </button>
        </div>
      </nav>

      {/* First-Time Onboarding Slider */}
      <OnboardingSlider
        isOpen={showOnboarding}
        onComplete={handleCompleteOnboarding}
        isFirstTime={isFirstTimeUser}
      />

      {/* Brand Preloader */}
      <AnimatePresence>
        {showPreloader && (
          <Preloader onFinish={() => setShowPreloader(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
