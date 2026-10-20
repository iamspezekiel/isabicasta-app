/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';

interface PreloaderProps {
  onFinish?: () => void;
  minDuration?: number;
}

const PHASES = [
  'Preparing a quiet space...',
  'Setting aside hesitation...',
  'Ready to choose.',
];

export const Preloader: React.FC<PreloaderProps> = ({ onFinish, minDuration = 1000 }) => {
  const [progress, setProgress] = useState(0);
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = 25;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setProgress(pct);

      if (pct < 45) {
        setPhaseIndex(0);
      } else if (pct < 85) {
        setPhaseIndex(1);
      } else {
        setPhaseIndex(2);
      }

      if (elapsed >= minDuration) {
        clearInterval(timer);
        setTimeout(() => {
          onFinish?.();
        }, 120);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [minDuration, onFinish]);

  return (
    <motion.div
      key="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-[#f3ece1] text-[#2a241c] p-6 sm:p-8 select-none"
    >
      {/* Top subtle privacy note */}
      <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#faf6ef] border border-[#dfd4c3] text-[#6f665c] text-xs font-medium">
        <ShieldCheck className="w-3.5 h-3.5 text-[#8c6239]" />
        <span>Private & On-Device</span>
      </div>

      {/* Center Brand Emblem & Restrained Biblical Demeanor */}
      <div className="flex flex-col items-center text-center max-w-sm w-full px-4 -mt-6">
        {/* Calm Bronze Casting Lot Emblem */}
        <div className="w-16 h-16 rounded-2xl bg-[#faf6ef] border border-[#dfd4c3] flex items-center justify-center text-[#8c6239] mb-5 shadow-xs">
          <span className="font-heading font-serif text-2xl font-semibold select-none">✦</span>
        </div>

        {/* Wordmark */}
        <h1 className="text-3xl font-heading font-bold text-[#2a241c] mb-1.5 tracking-tight">
          IsabiCasta
        </h1>

        {/* Tagline */}
        <p className="text-sm text-[#6f665c] leading-relaxed max-w-xs mb-8">
          A private way to choose, when you are undecided.
        </p>

        {/* Restrained progress bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="w-full h-1.5 bg-[#dfd4c3] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#8c6239] rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-[#6f665c] pt-0.5">
            <span className="font-normal">{PHASES[phaseIndex]}</span>
            <span className="font-semibold tabular-nums text-[#8c6239]">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Footer scripture motto */}
      <div className="text-center text-xs text-[#6f665c] italic max-w-xs">
        "The lot causes contentions to cease and decides between the mighty."
      </div>
    </motion.div>
  );
};
