/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  BookOpen,
  ShieldCheck,
  Scale,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  ArrowRight,
  Coins,
  Sparkles,
  Lock,
  Layers,
  HeartHandshake,
} from 'lucide-react';
import { SCRIPTURAL_ACCOUNTS, RESPECTFUL_DISCLAIMER } from '../data/scriptures';

interface AboutPageProps {
  onBackToDecision: () => void;
  onNavigateToProfile?: () => void;
  onReplayOnboarding?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
  onBackToDecision,
  onNavigateToProfile,
  onReplayOnboarding,
}) => {
  const [expandedScripture, setExpandedScripture] = useState<string | null>('proverbs-16-33');

  const toggleScripture = (id: string) => {
    setExpandedScripture((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* 1. TOP HEADER NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToDecision}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6f665c] hover:text-[#2a241c] transition-colors py-2 px-3 rounded-xl hover:bg-[#faf6ef] min-h-[40px] border border-transparent hover:border-[#dfd4c3] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8c6239]" />
          <span>Back to Decisions</span>
        </button>

        <span className="text-xs font-bold font-heading text-[#6f665c] uppercase tracking-wider">
          About IsabiCasta
        </span>
      </div>

      {/* 2. ILLUMINATED MASTHEAD & MISSION */}
      <div className="relative overflow-hidden rounded-3xl border border-[#dfd4c3] bg-[#faf6ef] shadow-xs p-6 sm:p-7 space-y-4">
        {/* Header Branding Row */}
        <div className="flex items-start gap-4">
          <div className="w-13 h-13 rounded-2xl bg-[#f3ece1] border-2 border-[#8c6239]/40 text-[#8c6239] flex items-center justify-center font-bold text-2xl font-heading shrink-0 shadow-2xs">
            ✦
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#2a241c] tracking-tight">
                IsabiCasta
              </h1>
              <span className="text-xs text-[#6f665c] font-mono">v1.0</span>
            </div>
            <p className="text-xs sm:text-sm text-[#8c6239] font-medium font-heading">
              A private way to choose, when you are undecided.
            </p>
          </div>
        </div>

        {/* Core Mission Reflection */}
        <p className="text-sm text-[#2a241c] leading-relaxed">
          When paralyzed by hesitation or equally weighted choices, IsabiCasta provides a quiet,
          impartial sanctuary to resolve indecision. It draws quiet inspiration from the ancient
          wisdom of casting lots to settle matters with dignity, humility, and peace.
        </p>

        {/* Featured Wisdom Quote */}
        <div className="p-4 rounded-2xl bg-[#f3ece1] border-l-4 border-l-[#8c6239] border border-[#dfd4c3] space-y-1">
          <p className="italic font-serif text-sm text-[#2a241c] leading-relaxed">
            "The lot is cast into the lap, but every decision by it is from Jehovah."
          </p>
          <span className="text-[11px] font-semibold text-[#8c6239] block uppercase tracking-wider">
            — Proverbs 16:33 · NWT
          </span>
        </div>
      </div>

      {/* 3. THE THREEFOLD DISCERNMENT PRINCIPLE */}
      <div className="rounded-3xl border border-[#dfd4c3] bg-[#faf6ef] p-6 shadow-xs space-y-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] text-[#8c6239] flex items-center justify-center">
            <Coins className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-[#2a241c]">
              The Three-Flip Principle
            </h2>
            <p className="text-xs text-[#6f665c]">
              Why IsabiCasta utilizes a threefold discernment process
            </p>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-[#2a241c] leading-relaxed">
          A single toss can feel hasty or impulsive. In biblical jurisprudence, matters of weight
          were confirmed through multiple confirmations:
        </p>

        <blockquote className="p-3 italic text-xs sm:text-sm font-serif text-[#2a241c] bg-[#f3ece1] rounded-xl border-l-2 border-[#8c6239]">
          "On the testimony of two or three witnesses every matter must be established."
          <span className="block text-[11px] font-sans font-semibold text-[#8c6239] mt-1 not-italic">
            — 2 Corinthians 13:1; Deuteronomy 19:15
          </span>
        </blockquote>

        <p className="text-xs text-[#6f665c] leading-relaxed">
          By requiring three separate casts, the lot creates space for measured reflection. The
          majority outcome (2 of 3, or unanimous 3 of 3) provides clear direction while discouraging
          endless, restless flipping.
        </p>
      </div>

      {/* 4. SCRIPTURAL ACCOUNTS OF CASTING LOTS */}
      <div className="rounded-3xl border border-[#dfd4c3] bg-[#faf6ef] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] text-[#8c6239] flex items-center justify-center">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold font-heading text-[#2a241c]">
              Biblical Accounts of Casting Lots
            </h2>
            <p className="text-xs text-[#6f665c]">
              Scripture references from the New World Translation of the Holy Scriptures
            </p>
          </div>
        </div>

        <p className="text-xs text-[#6f665c] leading-relaxed">
          In ancient times, lots (<span className="italic font-serif">goral</span> in Hebrew,{' '}
          <span className="italic font-serif">klēros</span> in Greek) served to quiet contention,
          distribute duties objectively, and remove human rivalry.
        </p>

        {/* Accordion list */}
        <div className="space-y-3 pt-1">
          {SCRIPTURAL_ACCOUNTS.map((item) => {
            const isExpanded = expandedScripture === item.id;

            return (
              <div
                key={item.id}
                className={`rounded-2xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'border-[#8c6239] bg-[#f3ece1] shadow-2xs'
                    : 'border-[#dfd4c3] bg-[#faf6ef] hover:border-[#8c6239]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleScripture(item.id)}
                  className="w-full flex items-center justify-between p-4 text-left text-xs font-semibold min-h-[48px] cursor-pointer"
                >
                  <div className="space-y-0.5">
                    <span className="font-heading font-bold text-sm text-[#2a241c] block">
                      {item.reference}
                    </span>
                    <span className="text-[11px] font-medium text-[#8c6239] block">
                      {item.purposeBadge}
                    </span>
                  </div>

                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-[#8c6239] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[#6f665c] shrink-0" />
                  )}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="px-4 pb-4 space-y-3 text-xs text-[#2a241c] border-t border-[#dfd4c3] pt-3"
                    >
                      <blockquote className="p-3.5 italic text-[#2a241c] font-serif text-xs sm:text-sm leading-relaxed bg-[#faf6ef] rounded-xl border-l-2 border-[#8c6239]">
                        "{item.verse}"
                      </blockquote>

                      <div className="space-y-2 text-xs">
                        <div>
                          <strong className="text-[#2a241c] font-bold block mb-0.5">
                            Historical Context:
                          </strong>
                          <span className="text-[#6f665c] leading-relaxed">
                            {item.historicalPurpose}
                          </span>
                        </div>

                        <div>
                          <strong className="text-[#8c6239] font-bold block mb-0.5">
                            Practical Reflection:
                          </strong>
                          <span className="text-[#2a241c] leading-relaxed">
                            {item.practicalReflection}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. RESPECTFUL GUIDANCE */}
      <div className="rounded-3xl border border-[#dfd4c3] bg-[#faf6ef] p-6 shadow-xs space-y-2.5">
        <div className="flex items-center gap-2.5 text-[#2a241c]">
          <Scale className="w-4 h-4 text-[#8c6239] shrink-0" />
          <h2 className="text-sm font-bold font-heading">{RESPECTFUL_DISCLAIMER.title}</h2>
        </div>
        <p className="text-xs text-[#6f665c] leading-relaxed">
          {RESPECTFUL_DISCLAIMER.description}
        </p>
      </div>

      {/* 6. ZERO-TELEMETRY PRIVACY ENCLAVE */}
      <div className="rounded-3xl border border-[#dfd4c3] bg-[#faf6ef] p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2.5 text-[#2a241c]">
          <ShieldCheck className="w-4 h-4 text-[#8c6239] shrink-0" />
          <h2 className="text-sm font-bold font-heading">Private & Client-Side Architecture</h2>
        </div>

        <p className="text-xs text-[#6f665c] leading-relaxed">
          Your privacy is complete. IsabiCasta operates entirely inside your web browser. No
          accounts are required, no trackers exist, and your decisions never leave this device.
        </p>

        {/* Quiet Architecture Triplet */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-center">
          <div className="p-3 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3]">
            <Lock className="w-4 h-4 text-[#8c6239] mx-auto mb-1" />
            <p className="text-[10px] font-bold text-[#6f665c] uppercase tracking-wider">Storage</p>
            <p className="text-xs font-semibold text-[#2a241c] mt-0.5">100% Local Device</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3]">
            <ShieldCheck className="w-4 h-4 text-[#8c6239] mx-auto mb-1" />
            <p className="text-[10px] font-bold text-[#6f665c] uppercase tracking-wider">Network</p>
            <p className="text-xs font-semibold text-[#2a241c] mt-0.5">Zero Telemetry</p>
          </div>

          <div className="p-3 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3]">
            <Sparkles className="w-4 h-4 text-[#8c6239] mx-auto mb-1" />
            <p className="text-[10px] font-bold text-[#6f665c] uppercase tracking-wider">Audio</p>
            <p className="text-xs font-semibold text-[#2a241c] mt-0.5">Procedural Web Audio</p>
          </div>
        </div>
      </div>

      {/* 7. QUICK ACTION CALLOUTS */}
      <div className="p-5 rounded-3xl bg-[#f3ece1] border border-[#dfd4c3] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
        <div>
          <h3 className="font-heading font-bold text-sm text-[#2a241c]">Ready to cast a decision?</h3>
          <p className="text-xs text-[#6f665c]">Overcome indecision with quiet clarity.</p>
        </div>

        <button
          type="button"
          onClick={onBackToDecision}
          className="px-5 py-2.5 rounded-2xl bg-[#8c6239] hover:bg-[#734e2b] text-[#faf6ef] text-xs font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-1.5"
        >
          <span>Begin Discernment</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
