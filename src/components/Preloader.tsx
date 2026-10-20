/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';

interface PreloaderProps {
  onFinish?: () => void;
  minDuration?: number;
}

export const Preloader: React.FC<PreloaderProps> = ({ onFinish, minDuration = 1000 }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = 25;

    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / minDuration) * 100));
      setProgress(pct);

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
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#f3ece1] text-[#2a241c] p-6 select-none"
    >
      {/* Brand Emblem */}
      <div className="w-14 h-14 rounded-2xl bg-[#faf6ef] border border-[#dfd4c3] flex items-center justify-center text-[#8c6239] mb-4 shadow-xs">
        <span className="font-heading font-serif text-2xl font-semibold select-none">✦</span>
      </div>

      {/* Wordmark */}
      <h1 className="text-3xl font-heading font-bold text-[#2a241c] mb-1 tracking-tight">
        IsabiCasta
      </h1>

      {/* Tagline */}
      <p className="text-sm text-[#6f665c] leading-relaxed max-w-xs text-center mb-6">
        A private way to choose, when you are undecided.
      </p>

      {/* Simple progress bar */}
      <div className="w-48 h-1.5 bg-[#dfd4c3] rounded-full overflow-hidden">
        <div
          className="h-full bg-[#8c6239] rounded-full transition-all duration-75"
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};
