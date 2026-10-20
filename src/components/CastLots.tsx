/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Edit3, RotateCw, AlertCircle, X } from 'lucide-react';
import { soundFx } from '../utils/sound';
import { DecisionHistoryItem } from '../types';

interface CastLotsProps {
  onRecordHistory: (item: Omit<DecisionHistoryItem, 'id' | 'timestamp'>) => void;
}

const QUICK_EXAMPLES = [
  { label: 'Meals', items: ['Cook fresh meal', 'Simple soup & bread', 'Dine out locally'] },
  { label: 'Priorities', items: ['Deep focused work', 'Tackle backlog tasks', 'Plan upcoming week'] },
  { label: 'Quiet Hour', items: ['Read scripture', 'Take an evening walk', 'Rest without screens'] },
  { label: 'Chores', items: ['Tidy study & desk', 'Laundry & linens', 'Organize kitchen'] },
];

export const CastLots: React.FC<CastLotsProps> = ({ onRecordHistory }) => {
  const [text, setText] = useState<string>('Option A\nOption B\nOption C');
  const [error, setError] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState<boolean>(false);
  const [outcome, setOutcome] = useState<string | null>(null);
  const [optionsPool, setOptionsPool] = useState<string[]>([]);
  const [isResultView, setIsResultView] = useState<boolean>(false);
  const [shufflePreview, setShufflePreview] = useState<string>('');

  const getValidOptions = (input: string) => {
    return input
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  };

  const handleCast = () => {
    const valid = getValidOptions(text);

    if (valid.length < 2) {
      setError('Please provide at least two distinct options to cast lots.');
      return;
    }

    setError(null);
    setOptionsPool(valid);
    performLotSelection(valid);
  };

  const performLotSelection = (options: string[]) => {
    setIsCasting(true);
    setIsResultView(true);
    soundFx.playLotTumble();

    let step = 0;
    const interval = setInterval(() => {
      setShufflePreview(options[step % options.length]);
      step++;
    }, 80);

    const chosen = options[Math.floor(Math.random() * options.length)];

    setTimeout(() => {
      clearInterval(interval);
      setOutcome(chosen);
      setIsCasting(false);
      soundFx.playLotSelected();

      onRecordHistory({
        type: 'lots',
        outcome: chosen,
        options,
      });
    }, 600);
  };

  const handleCastAgain = () => {
    if (optionsPool.length >= 2) {
      performLotSelection(optionsPool);
    } else {
      handleCast();
    }
  };

  const currentCount = getValidOptions(text).length;

  return (
    <div className="w-full">
      <AnimatePresence mode="wait">
        {!isResultView ? (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {/* Header info with counter & clear */}
            <div className="flex items-center justify-between text-xs text-[#6f665c]">
              <label htmlFor="lot-options" className="font-semibold text-[#2a241c]">
                Options (one per line):
              </label>
              {text.trim() && (
                <button
                  type="button"
                  onClick={() => {
                    setText('');
                    setError(null);
                  }}
                  className="text-[#6f665c] hover:text-[#2a241c] flex items-center gap-1 transition-colors min-h-[32px] px-2"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Input Textarea with parchment aesthetic */}
            <div className="relative">
              <textarea
                id="lot-options"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError(null);
                }}
                rows={4}
                placeholder="Option one&#10;Option two&#10;Option three"
                className="w-full p-4 rounded-2xl border border-[#dfd4c3] focus:border-[#8c6239] focus:ring-2 focus:ring-[#8c6239]/20 bg-[#faf6ef] text-[#2a241c] placeholder:text-[#6f665c]/60 text-base leading-relaxed resize-none transition-all outline-hidden font-normal"
              />
              <div className="absolute right-3 bottom-3 text-xs font-medium text-[#6f665c] bg-[#f3ece1] px-2.5 py-1 rounded-md border border-[#dfd4c3]">
                {currentCount} {currentCount === 1 ? 'option' : 'options'}
              </div>
            </div>

            {/* Validation Notice */}
            {error && (
              <div className="flex items-center gap-2 p-3 text-xs sm:text-sm text-[#2a241c] bg-[#e8dfd2] border border-[#dfd4c3] rounded-xl">
                <AlertCircle className="w-4 h-4 text-[#8c6239] shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Prompts */}
            <div className="space-y-1.5 pt-1">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#6f665c]">
                Quick Prompts
              </span>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_EXAMPLES.map((ex) => (
                  <button
                    key={ex.label}
                    type="button"
                    onClick={() => {
                      setText(ex.items.join('\n'));
                      setError(null);
                    }}
                    className="px-3 py-1.5 rounded-xl border border-[#dfd4c3] bg-[#faf6ef] hover:border-[#8c6239] hover:text-[#8c6239] text-[#2a241c] text-xs font-medium transition-colors"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Thumb-Zone Primary Action Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCast}
                className="w-full h-13 rounded-2xl bg-[#8c6239] hover:bg-[#734e2b] active:bg-[#5e3e20] text-[#faf6ef] text-base font-semibold flex items-center justify-center gap-2 transition-colors min-h-[50px] shadow-xs cursor-pointer"
              >
                <span>Cast Lot ({currentCount} {currentCount === 1 ? 'option' : 'options'})</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6 text-center py-1"
          >
            {/* Outcome Display Card */}
            <div className="p-6 sm:p-8 rounded-2xl bg-[#faf6ef] border border-[#dfd4c3] space-y-3 relative overflow-hidden shadow-xs">
              <span className="text-xs font-semibold tracking-wider text-[#8c6239] uppercase">
                The Lot Has Fallen On
              </span>

              {isCasting ? (
                <div className="py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-semibold text-[#6f665c] font-heading">
                    Drawing lot...
                  </span>
                  <span className="text-lg font-bold text-[#2a241c] font-heading">
                    {shufflePreview || '...'}
                  </span>
                </div>
              ) : (
                <div className="space-y-2 py-2">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#2a241c] font-heading break-words px-2 leading-tight">
                    "{outcome}"
                  </h3>
                  <p className="text-xs text-[#6f665c]">
                    Decided impartially from {optionsPool.length} choices
                  </p>
                </div>
              )}

              {/* Candidates pool overview */}
              {!isCasting && optionsPool.length > 0 && (
                <div className="pt-3 border-t border-[#dfd4c3] flex flex-wrap justify-center gap-1.5">
                  {optionsPool.map((opt, i) => (
                    <span
                      key={i}
                      className={`text-xs px-3 py-1 rounded-lg transition-colors ${
                        opt === outcome
                          ? 'bg-[#8c6239] text-[#faf6ef] font-semibold'
                          : 'bg-[#f3ece1] border border-[#dfd4c3] text-[#6f665c]'
                      }`}
                    >
                      {opt}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Thumb-Zone Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-1">
              <button
                type="button"
                onClick={handleCastAgain}
                disabled={isCasting}
                className="flex-1 h-13 rounded-2xl bg-[#8c6239] hover:bg-[#734e2b] active:bg-[#5e3e20] text-[#faf6ef] text-base font-semibold flex items-center justify-center gap-2 transition-colors min-h-[50px] shadow-xs cursor-pointer disabled:opacity-50"
              >
                <RotateCw className={`w-4 h-4 ${isCasting ? 'animate-spin' : ''}`} />
                <span>Cast Again</span>
              </button>

              <button
                type="button"
                onClick={() => setIsResultView(false)}
                disabled={isCasting}
                className="flex-1 h-13 rounded-2xl border border-[#dfd4c3] bg-[#faf6ef] hover:bg-[#f3ece1] text-[#2a241c] text-base font-semibold flex items-center justify-center gap-2 transition-colors min-h-[50px] cursor-pointer"
              >
                <Edit3 className="w-4 h-4 text-[#6f665c]" />
                <span>Edit Options</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
