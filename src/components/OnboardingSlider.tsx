/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ChevronLeft,
  ChevronRight,
  Scale,
  ShieldCheck,
  Sparkles,
  Coins,
  Anchor,
  Users,
  CheckCircle2
} from 'lucide-react';
import { SCRIPTURAL_ACCOUNTS, RESPECTFUL_DISCLAIMER } from '../data/scriptures';

interface OnboardingSliderProps {
  isOpen: boolean;
  onComplete: () => void;
  isFirstTime?: boolean;
}

const SLIDE_THEMES = [
  {
    tag: 'Ancient Practice',
    title: 'The Wisdom of Casting Lots',
    subtitle: 'An ancient remedy for human hesitation',
    icon: Sparkles,
  },
  {
    tag: 'Proverbs 16:33',
    title: 'Impartial Harmony',
    subtitle: 'Removing bias & settling disputes',
    icon: Scale,
  },
  {
    tag: 'Leviticus 16:8',
    title: 'Sacred Responsibility',
    subtitle: 'Objective division of duties on the Day of Atonement',
    icon: ShieldCheck,
  },
  {
    tag: 'Jonah 1:7',
    title: 'Clarity in Crisis',
    subtitle: 'Finding direction amid deep uncertainty at sea',
    icon: Anchor,
  },
  {
    tag: 'Acts 1:26',
    title: 'Unified Selection',
    subtitle: 'Selecting appointments free from human rivalry',
    icon: Users,
  },
  {
    tag: 'Begin Deciding',
    title: 'Your Decision Companion',
    subtitle: 'Overcome overthinking with simple, impartial tools',
    icon: CheckCircle2,
  },
];

export const OnboardingSlider: React.FC<OnboardingSliderProps> = ({
  isOpen,
  onComplete,
  isFirstTime = false,
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const totalSlides = 6;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        goToNext();
      } else if (e.key === 'ArrowLeft') {
        goToPrev();
      } else if (e.key === 'Escape' && !isFirstTime) {
        onComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide, isFirstTime, onComplete]);

  if (!isOpen) return null;

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 40 && currentSlide > 0) {
      goToPrev();
    } else if (deltaX < -40 && currentSlide < totalSlides - 1) {
      goToNext();
    }
    touchStartX.current = null;
  };

  const goToNext = () => {
    if (currentSlide < totalSlides - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      onComplete();
    }
  };

  const goToPrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const jumpToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  const currentTheme = SLIDE_THEMES[currentSlide];
  const ThemeIcon = currentTheme.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#2a241c]/50 p-0 sm:p-4 overflow-y-auto">
      <div
        className="relative w-full sm:max-w-lg bg-[#faf6ef] border-t sm:border border-[#dfd4c3] rounded-t-3xl sm:rounded-3xl shadow-xl overflow-hidden flex flex-col max-h-[92vh] sm:max-h-[88vh] pb-safe"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Mobile Grab Handle */}
        <div className="w-10 h-1 bg-[#dfd4c3] rounded-full mx-auto my-2.5 sm:hidden shrink-0" />

        {/* Top Header & Segmented Progress Bar */}
        <div className="px-5 sm:px-6 pt-3 sm:pt-4 pb-3 border-b border-[#dfd4c3] bg-[#faf6ef]">
          <div className="flex items-center justify-between gap-3 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#f3ece1] border border-[#dfd4c3] flex items-center justify-center text-[#8c6239]">
                <ThemeIcon className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-[#8c6239] font-heading tracking-wide uppercase">
                {currentTheme.tag}
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-xs font-mono text-[#6f665c] font-medium">
                {currentSlide + 1} / {totalSlides}
              </span>
              <button
                onClick={onComplete}
                className="text-xs font-semibold text-[#6f665c] hover:text-[#2a241c] px-2.5 py-1.5 rounded-lg hover:bg-[#eae2d6] transition-colors cursor-pointer"
                title="Skip to app"
              >
                Skip
              </button>
            </div>
          </div>

          {/* Segmented Progress Bar */}
          <div className="grid grid-cols-6 gap-1.5">
            {Array.from({ length: totalSlides }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => jumpToSlide(idx)}
                className="h-1 rounded-full transition-all overflow-hidden bg-[#dfd4c3] hover:bg-[#8c6239]/40 cursor-pointer"
                aria-label={`Jump to step ${idx + 1}`}
              >
                <div
                  className={`h-full transition-all duration-200 ${
                    idx <= currentSlide ? 'bg-[#8c6239] w-full' : 'w-0'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Slide Body */}
        <div className="relative flex-1 p-5 sm:p-6 overflow-y-auto">
          <AnimatePresence mode="wait">
            {/* Slide 0: Welcome & Heritage */}
            {currentSlide === 0 && (
              <motion.div
                key="slide-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="w-full h-44 rounded-2xl overflow-hidden border border-[#dfd4c3] relative bg-[#f3ece1] shadow-2xs">
                  <img
                    src="/src/assets/images/ancient_casting_lots_1792317606582.jpg"
                    alt="Ancient casting lots carved stones resting in an olive wood bowl"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a241c]/90 via-[#2a241c]/30 to-transparent flex items-end p-4">
                    <p className="text-xs text-[#faf6ef] font-serif italic">
                      Inscribed stone lots resting in an ancient olive wood vessel
                    </p>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#2a241c]">
                    Welcome to IsabiCasta
                  </h3>
                  <p className="text-sm text-[#2a241c] leading-relaxed font-normal">
                    Throughout ancient history, people practiced <span className="font-semibold">casting lots</span> (Hebrew: <span className="italic font-serif">goral</span>; Greek: <span className="italic font-serif">klēros</span>) to overcome indecisiveness, divide tasks fairly, and resolve disputes peacefully without human partiality.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] text-xs text-[#2a241c] space-y-1">
                  <span className="font-bold text-[#2a241c] font-heading block">How lots were cast:</span>
                  <p className="text-[#6f665c] leading-relaxed">
                    Pebbles or pottery shards were cast into a garment fold or urn and drawn impartially, allowing matters to be settled peacefully.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Slides 1-4: Scripture Accounts */}
            {currentSlide >= 1 && currentSlide <= 4 && (
              <motion.div
                key={`slide-${currentSlide}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                {(() => {
                  const account = SCRIPTURAL_ACCOUNTS[currentSlide - 1];

                  return (
                    <div className="space-y-3.5">
                      {/* Slide Title */}
                      <div>
                        <h3 className="text-xl font-bold font-heading text-[#2a241c]">
                          {currentTheme.title}
                        </h3>
                        <p className="text-xs text-[#6f665c] font-normal">
                          {currentTheme.subtitle}
                        </p>
                      </div>

                      {/* Scripture Box */}
                      <div className="p-4 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] space-y-2">
                        <blockquote className="text-base sm:text-lg font-serif italic text-[#2a241c] leading-relaxed">
                          "{account.verse}"
                        </blockquote>
                        <div className="flex items-center justify-between text-xs text-[#8c6239] pt-1.5 border-t border-[#dfd4c3]">
                          <span className="font-bold font-heading text-[#2a241c]">{account.reference}</span>
                          <span className="text-[11px] text-[#6f665c]">New World Translation</span>
                        </div>
                      </div>

                      {/* Historical Context */}
                      <div className="p-3.5 rounded-xl bg-[#faf6ef] border border-[#dfd4c3] space-y-1">
                        <h4 className="text-xs font-bold text-[#2a241c] uppercase tracking-wider font-heading">
                          Biblical Account & Purpose
                        </h4>
                        <p className="text-xs sm:text-sm text-[#6f665c] leading-relaxed font-normal">
                          {account.historicalPurpose}
                        </p>
                      </div>

                      {/* Practical Takeaway */}
                      <div className="p-3.5 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] space-y-1">
                        <h4 className="text-xs font-bold text-[#8c6239] uppercase tracking-wider font-heading">
                          Overcoming Indecision
                        </h4>
                        <p className="text-xs sm:text-sm text-[#2a241c] leading-relaxed">
                          {account.practicalReflection}
                        </p>
                      </div>
                    </div>
                  );
                })()}
              </motion.div>
            )}

            {/* Slide 5: Ready to Decide */}
            {currentSlide === 5 && (
              <motion.div
                key="slide-5"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="space-y-4"
              >
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-xl sm:text-2xl font-bold font-heading text-[#2a241c]">
                    Ready to Choose Peacefully
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6f665c] font-normal leading-relaxed">
                    {RESPECTFUL_DISCLAIMER.description}
                  </p>
                </div>

                {/* The 2 tools preview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="p-4 rounded-2xl border border-[#dfd4c3] bg-[#faf6ef] space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] text-[#8c6239] flex items-center justify-center">
                      <Coins className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm font-heading text-[#2a241c]">
                      Flip a Coin
                    </h4>
                    <p className="text-xs text-[#6f665c] leading-relaxed">
                      For binary choices: Yes/No, A/B, or quick simple coin cast.
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl border border-[#dfd4c3] bg-[#faf6ef] space-y-1.5">
                    <div className="w-8 h-8 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] text-[#8c6239] flex items-center justify-center">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm font-heading text-[#2a241c]">
                      Cast Lot
                    </h4>
                    <p className="text-xs text-[#6f665c] leading-relaxed">
                      Enter multiple choices. The lot selects one impartially to end overthinking.
                    </p>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] flex items-center gap-2 text-xs text-[#6f665c]">
                  <CheckCircle2 className="w-4 h-4 text-[#8c6239] shrink-0" />
                  <span>Runs entirely on your device with complete local privacy.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex items-center justify-between px-5 sm:px-6 py-3.5 border-t border-[#dfd4c3] bg-[#f3ece1]">
          {/* Previous Button */}
          <button
            type="button"
            onClick={goToPrev}
            disabled={currentSlide === 0}
            className={`flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-xl min-h-[44px] transition-colors cursor-pointer ${
              currentSlide === 0
                ? 'text-[#6f665c]/40 cursor-not-allowed'
                : 'text-[#6f665c] hover:text-[#2a241c] hover:bg-[#eae2d6]'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Next or Get Started Button */}
          {currentSlide === totalSlides - 1 ? (
            <button
              type="button"
              onClick={onComplete}
              className="flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-xl bg-[#8c6239] text-[#faf6ef] hover:bg-[#734e2b] min-h-[44px] shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>Get Started</span>
              <CheckCircle2 className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={goToNext}
              className="flex items-center gap-1.5 text-xs font-semibold px-5 py-2.5 rounded-xl bg-[#8c6239] text-[#faf6ef] hover:bg-[#734e2b] min-h-[44px] shadow-xs cursor-pointer whitespace-nowrap"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
