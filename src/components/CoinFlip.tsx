/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  RotateCw,
  CheckCircle2,
  RotateCcw,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  FastForward,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFx } from '../utils/sound';
import { DecisionHistoryItem } from '../types';
import coinShekelImage from '../assets/images/ancient_coin_shekel_1792317607431.jpg';

interface CoinFlipProps {
  onRecordHistory: (item: Omit<DecisionHistoryItem, 'id' | 'timestamp'>) => void;
}

type FlipOutcome = 'Heads' | 'Tails';
type FlowStep = 1 | 2 | 3;

interface FlipRecord {
  flipNumber: 1 | 2 | 3;
  outcome: FlipOutcome;
  meaning: string;
}

const PRESETS = [
  { heads: 'Yes', tails: 'No' },
  { heads: 'Accept', tails: 'Decline' },
  { heads: 'Proceed', tails: 'Wait' },
];

export const CoinFlip: React.FC<CoinFlipProps> = ({ onRecordHistory }) => {
  // 3-Step Flow state
  const [currentStep, setCurrentStep] = useState<FlowStep>(1);

  // Step 1: Meaning definitions
  const [question, setQuestion] = useState('');
  const [headsMeaning, setHeadsMeaning] = useState('Yes');
  const [tailsMeaning, setTailsMeaning] = useState('No');

  // Step 2: Casting state
  const [flips, setFlips] = useState<FlipRecord[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);
  const [currentFace, setCurrentFace] = useState<FlipOutcome>('Heads');
  const [rotationDegrees, setRotationDegrees] = useState(0);

  // Step 3: Resolution & Celebration state
  const [isAccepted, setIsAccepted] = useState(false);
  const [isInvalid, setIsInvalid] = useState(false);

  // Trigger celebration animation (bronze/gold confetti burst and harmonic chime)
  const fireCelebration = () => {
    soundFx.playLotSelected();
    soundFx.triggerHaptic('success');

    // Refined bronze, gold, parchment palette
    const colors = ['#8c6239', '#c59b27', '#e5c158', '#dfd4c3', '#faf6ef', '#2a241c'];

    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors,
        ticks: 200,
        gravity: 0.8,
        scalar: 0.9,
      });

      setTimeout(() => {
        confetti({
          particleCount: 40,
          angle: 60,
          spread: 60,
          origin: { x: 0.15, y: 0.65 },
          colors,
          ticks: 220,
          gravity: 0.75,
          scalar: 0.95,
        });
        confetti({
          particleCount: 40,
          angle: 120,
          spread: 60,
          origin: { x: 0.85, y: 0.65 },
          colors,
          ticks: 220,
          gravity: 0.75,
          scalar: 0.95,
        });
      }, 200);
    } catch {
      // Fallback gracefully if canvas context is unavailable
    }
  };

  // Perform single flip in the 3-flip series
  const executeNextFlip = () => {
    if (isFlipping) return;
    if (flips.length >= 3) return; // Prevent flipping past 3

    const activeHeads = headsMeaning.trim() || 'Yes';
    const activeTails = tailsMeaning.trim() || 'No';

    setIsFlipping(true);
    soundFx.playCoinFlip();
    soundFx.triggerHaptic('medium');

    const nextOutcome: FlipOutcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const nextFlipNum = (flips.length + 1) as 1 | 2 | 3;

    // Spin animation: 4 full revolutions + face offset
    const turns = 4 * 360;
    const targetOffset = nextOutcome === 'Heads' ? 0 : 180;
    const currentBase = Math.floor(rotationDegrees / 360) * 360;
    const newTarget = currentBase + turns + targetOffset;

    setRotationDegrees(newTarget);

    setTimeout(() => {
      setCurrentFace(nextOutcome);
      setIsFlipping(false);
      soundFx.playCoinLanding();
      soundFx.triggerHaptic('light');

      const newRecord: FlipRecord = {
        flipNumber: nextFlipNum,
        outcome: nextOutcome,
        meaning: nextOutcome === 'Heads' ? activeHeads : activeTails,
      };

      const updatedFlips = [...flips, newRecord];
      setFlips(updatedFlips);

      // On completing the 3rd flip, transition to Step 3 and trigger celebration
      if (updatedFlips.length === 3) {
        const headsCount = updatedFlips.filter((f) => f.outcome === 'Heads').length;
        const tailsCount = updatedFlips.filter((f) => f.outcome === 'Tails').length;

        // Graceful validation of result integrity
        if (headsCount + tailsCount !== 3 || (headsCount < 2 && tailsCount < 2)) {
          setIsInvalid(true);
          setCurrentStep(3);
        } else {
          // Transition to Step 3 and trigger celebration
          setTimeout(() => {
            setCurrentStep(3);
            fireCelebration();
          }, 450);
        }
      }
    }, 700);
  };

  // Spacebar keyboard shortcut during Step 2
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeElement = document.activeElement;
      const isInput = activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA';
      if (isInput) return;

      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        if (currentStep === 2 && flips.length < 3 && !isFlipping) {
          executeNextFlip();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Calculate majority results for Step 3
  const headsCount = flips.filter((f) => f.outcome === 'Heads').length;
  const tailsCount = flips.filter((f) => f.outcome === 'Tails').length;
  const majorityOutcome: FlipOutcome | null =
    currentStep === 3 && !isInvalid
      ? headsCount >= 2
        ? 'Heads'
        : 'Tails'
      : null;
  const majorityMeaning =
    majorityOutcome === 'Heads'
      ? headsMeaning.trim() || 'Yes'
      : tailsMeaning.trim() || 'No';

  // Accept decision in Step 3
  const handleAcceptDecision = () => {
    if (currentStep !== 3 || !majorityOutcome || isAccepted) return;

    soundFx.playLotSelected();
    soundFx.triggerHaptic('success');
    setIsAccepted(true);

    onRecordHistory({
      type: 'coin',
      outcome: `${majorityOutcome}: ${majorityMeaning}`,
      options: [
        `Heads: ${headsMeaning.trim() || 'Yes'}`,
        `Tails: ${tailsMeaning.trim() || 'No'}`,
      ],
      question: question.trim() || undefined,
      flips: flips.map((f) => f.outcome),
      headsMeaning: headsMeaning.trim() || 'Yes',
      tailsMeaning: tailsMeaning.trim() || 'No',
      tally: `${headsCount} Heads, ${tailsCount} Tails`,
      accepted: true,
    });
  };

  // Skip setup and immediately cast lot with defaults or current values
  const handleSkipSetup = () => {
    setHeadsMeaning((prev) => prev.trim() || 'Yes');
    setTailsMeaning((prev) => prev.trim() || 'No');
    setFlips([]);
    setCurrentFace('Heads');
    setRotationDegrees(0);
    setCurrentStep(2);
  };

  // Skip remaining flips and resolve majority decision immediately
  const handleSkipToResult = () => {
    if (currentStep !== 2) return;
    const activeHeads = headsMeaning.trim() || 'Yes';
    const activeTails = tailsMeaning.trim() || 'No';

    const needed = 3 - flips.length;
    const completedRecords: FlipRecord[] = [...flips];

    for (let i = 0; i < needed; i++) {
      const nextNum = (completedRecords.length + 1) as 1 | 2 | 3;
      const outcome: FlipOutcome = Math.random() < 0.5 ? 'Heads' : 'Tails';
      completedRecords.push({
        flipNumber: nextNum,
        outcome,
        meaning: outcome === 'Heads' ? activeHeads : activeTails,
      });
    }

    setFlips(completedRecords);
    const finalOutcome = completedRecords[completedRecords.length - 1].outcome;
    setCurrentFace(finalOutcome);
    setIsFlipping(false);

    // Transition straight to Step 3 and trigger celebration
    setCurrentStep(3);
    fireCelebration();
  };

  // Start fresh 3-step decision flow
  const handleStartNewSession = () => {
    setFlips([]);
    setIsFlipping(false);
    setIsAccepted(false);
    setIsInvalid(false);
    setRotationDegrees(0);
    setCurrentFace('Heads');
    setCurrentStep(1);
  };

  return (
    <div className="flex flex-col items-center w-full space-y-5 text-[#2a241c]">
      {/* THREE-STEP FLOW STEP TRACKER HEADER */}
      <nav aria-label="Discernment flow steps" className="w-full pb-3 border-b border-[#dfd4c3]">
        <div className="flex items-center justify-between text-xs font-semibold px-1">
          {/* Step 1 Indicator */}
          <div
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 1 ? 'text-[#8c6239] font-bold' : 'text-[#6f665c]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono transition-colors ${
                currentStep === 1
                  ? 'bg-[#8c6239] text-[#faf6ef]'
                  : currentStep > 1
                  ? 'bg-[#dfd4c3] text-[#2a241c]'
                  : 'bg-[#f3ece1] text-[#6f665c]'
              }`}
            >
              {currentStep > 1 ? '✓' : '1'}
            </span>
            <span>Define</span>
          </div>

          <div className="h-0.5 flex-1 mx-3 bg-[#dfd4c3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8c6239] transition-all duration-300"
              style={{
                width: currentStep === 1 ? '0%' : currentStep === 2 ? '50%' : '100%',
              }}
            />
          </div>

          {/* Step 2 Indicator */}
          <div
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 2 ? 'text-[#8c6239] font-bold' : 'text-[#6f665c]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono transition-colors ${
                currentStep === 2
                  ? 'bg-[#8c6239] text-[#faf6ef]'
                  : currentStep > 2
                  ? 'bg-[#dfd4c3] text-[#2a241c]'
                  : 'bg-[#f3ece1] text-[#6f665c]'
              }`}
            >
              {currentStep > 2 ? '✓' : '2'}
            </span>
            <span>Cast Lot</span>
          </div>

          <div className="h-0.5 flex-1 mx-3 bg-[#dfd4c3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8c6239] transition-all duration-300"
              style={{ width: currentStep === 3 ? '100%' : '0%' }}
            />
          </div>

          {/* Step 3 Indicator */}
          <div
            className={`flex items-center gap-1.5 transition-colors ${
              currentStep === 3 ? 'text-[#8c6239] font-bold' : 'text-[#6f665c]'
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono transition-colors ${
                currentStep === 3
                  ? 'bg-[#8c6239] text-[#faf6ef]'
                  : 'bg-[#f3ece1] text-[#6f665c]'
              }`}
            >
              3
            </span>
            <span>Decision</span>
          </div>
        </div>
      </nav>

      {/* STEP 1: DEFINE MEANINGS */}
      {currentStep === 1 && (
        <motion.div
          key="step-1"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="w-full space-y-4"
        >
          {/* Optional Question Input */}
          <div className="space-y-1">
            <label
              htmlFor="coin-question-step1"
              className="block text-[11px] font-semibold text-[#6f665c] uppercase tracking-wider"
            >
              Inquiry / Matter to Discern <span className="font-normal lowercase opacity-70">(optional)</span>
            </label>
            <input
              id="coin-question-step1"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Should I proceed with the proposed plan?"
              maxLength={100}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf6ef] border border-[#dfd4c3] text-sm text-[#2a241c] placeholder-[#6f665c]/50 focus:outline-none focus:border-[#8c6239] transition-colors"
            />
          </div>

          {/* Heads and Tails Definitions Card */}
          <div className="p-3.5 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] space-y-2.5">
            {/* Header kept on strictly one line */}
            <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
              <span className="font-bold text-[#6f665c] uppercase tracking-wider text-[11px] whitespace-nowrap shrink-0">
                What each side means:
              </span>
              <div className="flex items-center gap-1 flex-wrap shrink-0">
                {PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setHeadsMeaning(p.heads);
                      setTailsMeaning(p.tails);
                    }}
                    className="px-2 py-0.5 rounded-lg text-[11px] bg-[#faf6ef] border border-[#dfd4c3] text-[#2a241c] hover:bg-[#eae0d2] transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {p.heads}/{p.tails}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-0.5">
              {/* Heads Input */}
              <div className="space-y-1">
                <label
                  htmlFor="heads-meaning-input"
                  className="block text-[11px] font-bold text-[#8c6239] flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#8c6239]" />
                  Heads (Shekel)
                </label>
                <input
                  id="heads-meaning-input"
                  type="text"
                  required
                  value={headsMeaning}
                  onChange={(e) => setHeadsMeaning(e.target.value)}
                  placeholder="Yes"
                  maxLength={40}
                  className="w-full px-2.5 py-2 rounded-lg bg-[#faf6ef] border border-[#dfd4c3] text-xs sm:text-sm font-semibold text-[#2a241c] focus:outline-none focus:border-[#8c6239] transition-colors"
                />
              </div>

              {/* Tails Input */}
              <div className="space-y-1">
                <label
                  htmlFor="tails-meaning-input"
                  className="block text-[11px] font-bold text-[#6f665c] flex items-center gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#6f665c]" />
                  Tails (Olive Sprig)
                </label>
                <input
                  id="tails-meaning-input"
                  type="text"
                  required
                  value={tailsMeaning}
                  onChange={(e) => setTailsMeaning(e.target.value)}
                  placeholder="No"
                  maxLength={40}
                  className="w-full px-2.5 py-2 rounded-lg bg-[#faf6ef] border border-[#dfd4c3] text-xs sm:text-sm font-semibold text-[#2a241c] focus:outline-none focus:border-[#8c6239] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Continue or Skip in Step 1 */}
          <div className="pt-2 flex flex-col sm:flex-row gap-2">
            <button
              type="button"
              onClick={() => {
                setFlips([]);
                setCurrentFace('Heads');
                setRotationDegrees(0);
                setCurrentStep(2);
              }}
              className="flex-1 h-13 rounded-2xl bg-[#8c6239] hover:bg-[#734e2b] active:bg-[#5e3e20] text-[#faf6ef] text-base font-semibold flex items-center justify-center gap-2 transition-colors min-h-[50px] shadow-xs cursor-pointer"
            >
              <span>Proceed to Cast Lot</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={handleSkipSetup}
              className="h-13 px-4 rounded-2xl bg-[#faf6ef] hover:bg-[#f3ece1] text-[#6f665c] hover:text-[#2a241c] border border-[#dfd4c3] text-sm font-semibold flex items-center justify-center gap-1.5 transition-colors min-h-[50px] cursor-pointer"
            >
              <FastForward className="w-4 h-4 text-[#8c6239]" />
              <span>Skip Setup</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 2: CAST THE LOT (THREE FLIPS) */}
      {currentStep === 2 && (
        <motion.div
          key="step-2"
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          className="w-full flex flex-col items-center space-y-4"
        >
          {/* Active Meanings Context Pin */}
          <div className="w-full p-2.5 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-[#8c6239]">Heads:</span>
              <span className="font-medium text-[#2a241c] truncate">{headsMeaning.trim() || 'Yes'}</span>
            </div>
            <div className="h-3 w-px bg-[#dfd4c3]" />
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-[#6f665c]">Tails:</span>
              <span className="font-medium text-[#2a241c] truncate">{tailsMeaning.trim() || 'No'}</span>
            </div>
          </div>

          {question.trim() && (
            <div className="text-xs text-center text-[#6f665c] italic">
              "{question.trim()}"
            </div>
          )}

          {/* The Ancient Coin */}
          <div className="relative my-2 perspective-1000 w-36 h-36 sm:w-40 sm:h-40 flex items-center justify-center">
            {/* Ground shadow */}
            <div
              className={`absolute -bottom-2 w-24 h-2.5 rounded-full bg-[#2a241c]/15 transition-opacity duration-300 ${
                isFlipping ? 'opacity-20' : 'opacity-60'
              }`}
            />

            <motion.div
              animate={{
                rotateY: rotationDegrees,
                y: isFlipping ? [-4, -36, 0] : 0,
              }}
              transition={{
                duration: 0.7,
                ease: 'easeInOut',
              }}
              onClick={() => {
                if (flips.length < 3 && !isFlipping) {
                  executeNextFlip();
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Cast flip ${flips.length + 1} of 3`}
              className={`w-32 h-32 sm:w-36 sm:h-36 rounded-full transform-style-3d relative select-none touch-manipulation transition-transform ${
                flips.length < 3 && !isFlipping
                  ? 'cursor-pointer hover:scale-102 active:scale-98'
                  : 'cursor-default'
              }`}
            >
              {/* Heads Face */}
              <div className="absolute inset-0 rounded-full backface-hidden bg-[#faf6ef] border-4 border-[#8c6239] shadow-md flex flex-col items-center justify-center text-[#2a241c] p-2 text-center coin-shekel-rim">
                <div className="w-14 h-14 rounded-full bg-[#f3ece1] border border-[#dfd4c3] flex items-center justify-center mb-1 overflow-hidden">
                  <img
                    src={coinShekelImage}
                    alt="Heads shekel"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover mix-blend-multiply opacity-90"
                  />
                </div>
                <span className="font-heading font-bold text-xs tracking-wider uppercase text-[#2a241c]">
                  Heads
                </span>
              </div>

              {/* Tails Face */}
              <div className="absolute inset-0 rounded-full backface-hidden rotate-y-180 bg-[#faf6ef] border-4 border-[#8c6239] shadow-md flex flex-col items-center justify-center text-[#2a241c] p-2 text-center coin-shekel-rim">
                <div className="w-14 h-14 rounded-full bg-[#f3ece1] border border-[#dfd4c3] flex items-center justify-center mb-1 text-[#8c6239]">
                  <svg
                    className="w-7 h-7"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17.5C5 15 4 12 4 8c2.5 0 5 1 6.5 3" />
                    <path d="M17 17.5C19 15 20 12 20 8c-2.5 0-5 1-6.5 3" />
                    <path d="M12 21V9" />
                    <path d="M9 13.5C8 10 9 7 12 5c3 2 4 5 3 8.5" />
                  </svg>
                </div>
                <span className="font-heading font-bold text-xs tracking-wider uppercase text-[#2a241c]">
                  Tails
                </span>
              </div>
            </motion.div>
          </div>

          {/* Flip Status Live Text */}
          <div className="min-h-[28px] flex items-center justify-center text-xs font-semibold text-[#8c6239]">
            {isFlipping ? (
              <span className="flex items-center gap-1.5 animate-pulse">
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                Flip {flips.length + 1} of 3 is in flight...
              </span>
            ) : flips.length > 0 ? (
              <span className="text-[#2a241c]">
                Last cast landed on <strong className="text-[#8c6239]">{currentFace}</strong>
              </span>
            ) : (
              <span className="text-[#6f665c]">Ready for first cast</span>
            )}
          </div>

          {/* Primary Action Button */}
          <div className="w-full space-y-2 pt-1">
            <button
              type="button"
              onClick={executeNextFlip}
              disabled={isFlipping || flips.length >= 3}
              className="w-full h-13 rounded-2xl bg-[#8c6239] hover:bg-[#734e2b] active:bg-[#5e3e20] text-[#faf6ef] text-base font-semibold flex items-center justify-center gap-2.5 transition-colors min-h-[50px] shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RotateCw className={`w-4 h-4 ${isFlipping ? 'animate-spin' : ''}`} />
              <span>
                {isFlipping
                  ? `Flipping ${flips.length + 1} of 3...`
                  : flips.length === 0
                  ? 'Cast Flip 1 of 3'
                  : flips.length === 1
                  ? 'Cast Flip 2 of 3'
                  : 'Cast Final Flip (3 of 3)'}
              </span>
            </button>

            <div className="text-center text-[11px] text-[#6f665c]">
              Tap coin or press <kbd className="px-1.5 py-0.5 bg-[#faf6ef] border border-[#dfd4c3] rounded text-[10px] font-mono">Space</kbd>
            </div>

            {/* Skip to Final Result option */}
            <button
              type="button"
              onClick={handleSkipToResult}
              disabled={isFlipping}
              className="w-full py-2 text-xs font-semibold text-[#6f665c] hover:text-[#8c6239] flex items-center justify-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
            >
              <FastForward className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Skip to Final Result</span>
            </button>
          </div>
        </motion.div>
      )}

      {/* STEP 3: ESTABLISHED DECISION & CELEBRATION ANIMATION */}
      {currentStep === 3 && (
        <motion.div
          key="step-3"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full space-y-4"
        >
          {/* Invalid / Inconclusive Result Handling */}
          {isInvalid ? (
            <div className="w-full p-5 rounded-2xl bg-[#faf6ef] border-2 border-[#6f665c] text-center space-y-3">
              <AlertCircle className="w-6 h-6 text-[#8c6239] mx-auto" />
              <h4 className="font-heading font-bold text-base text-[#2a241c]">
                Discernment Inconclusive
              </h4>
              <p className="text-xs text-[#6f665c]">
                The flips could not establish an orderly decision. You can peacefully reset and recast afresh.
              </p>
              <button
                type="button"
                onClick={handleStartNewSession}
                className="px-4 py-2 rounded-xl bg-[#8c6239] text-[#faf6ef] text-xs font-semibold hover:bg-[#734e2b] transition-colors cursor-pointer"
              >
                Start New Decision
              </button>
            </div>
          ) : (
            /* Celebration Decision Card with Golden Pulse */
            <div className="relative overflow-hidden p-5 sm:p-6 rounded-3xl bg-[#faf6ef] border-2 border-[#8c6239] text-center space-y-4 shadow-md">
              {/* Golden celebration glow aura */}
              <div className="absolute inset-0 bg-radial from-[#8c6239]/10 via-transparent to-transparent pointer-events-none" />

              {/* Celebration Badge with Sparkles */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-[#f3ece1] border border-[#8c6239] text-[#8c6239] text-xs font-bold uppercase tracking-wider shadow-2xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#c59b27] animate-pulse" />
                <span>Decision Established</span>
                <Sparkles className="w-3.5 h-3.5 text-[#c59b27] animate-pulse" />
              </motion.div>

              {/* Inquiry topic reminder */}
              {question.trim() && (
                <div className="text-xs text-[#6f665c] italic">
                  "{question.trim()}"
                </div>
              )}

              {/* Majority Outcome & Defined Meaning */}
              <motion.div
                initial={{ y: 8, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.15 }}
                className="space-y-1"
              >
                <h3 className="text-3xl sm:text-4xl font-bold font-heading text-[#2a241c] tracking-tight">
                  {majorityOutcome}
                </h3>
                <div className="text-xl sm:text-2xl font-semibold text-[#8c6239] font-heading">
                  "{majorityMeaning}"
                </div>
              </motion.div>

              {/* Scripture Reflection */}
              <div className="p-3 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] text-xs text-[#6f665c]">
                <p className="text-[11px] italic text-[#8c6239] leading-relaxed">
                  "The lot is cast into the lap, but its every decision is from the Lord." — Proverbs 16:33
                </p>
              </div>

              {/* Decision Accepted Confirmation Notice */}
              {isAccepted && (
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 rounded-xl bg-[#e8dfd2] border border-[#8c6239] text-xs text-[#2a241c] flex items-center justify-center gap-2 font-semibold"
                >
                  <ShieldCheck className="w-4 h-4 text-[#8c6239]" />
                  <span>Decision Accepted & Recorded to Device</span>
                </motion.div>
              )}
            </div>
          )}

          {/* Action Buttons: Accept Decision & Start New Decision */}
          <div className="w-full space-y-2 pt-1">
            {!isAccepted && !isInvalid && (
              <button
                type="button"
                onClick={handleAcceptDecision}
                className="w-full h-13 rounded-2xl bg-[#8c6239] hover:bg-[#734e2b] active:bg-[#5e3e20] text-[#faf6ef] text-base font-semibold flex items-center justify-center gap-2 transition-colors min-h-[50px] shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Accept Decision</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleStartNewSession}
              className="w-full h-12 rounded-2xl bg-[#faf6ef] hover:bg-[#f3ece1] active:bg-[#eae0d2] text-[#2a241c] border border-[#dfd4c3] text-sm font-semibold flex items-center justify-center gap-2 transition-colors min-h-[46px] cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-[#8c6239]" />
              <span>Start New Decision (Restart Flow)</span>
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
