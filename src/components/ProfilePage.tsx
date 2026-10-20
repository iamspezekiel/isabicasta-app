/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sliders,
  ShieldCheck,
  Check,
  Edit3,
  Coins,
  Sparkles,
  ArrowLeft,
  RotateCcw,
  Clock,
  ChevronRight,
  BookOpen,
  Play,
  Trash2,
  Download,
  FileText,
  Volume2,
  VolumeX,
  Smartphone,
  Lock,
  Github,
} from 'lucide-react';
import { AppSettings, UserProfile, DecisionHistoryItem } from '../types';
import { soundFx } from '../utils/sound';
import { APP_VERSION, GITHUB_REPO_URL } from '../version';

interface ProfilePageProps {
  profile: UserProfile;
  settings: AppSettings;
  history: DecisionHistoryItem[];
  onUpdateProfile: (newProfile: Partial<UserProfile>) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onClearHistory: () => void;
  onResetApp: () => void;
  onReplayOnboarding: () => void;
  onBackToDecision: () => void;
  onNavigateToAbout: () => void;
  onNavigateToHistory?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  profile,
  settings,
  history,
  onUpdateProfile,
  onUpdateSettings,
  onClearHistory,
  onResetApp,
  onReplayOnboarding,
  onBackToDecision,
  onNavigateToAbout,
  onNavigateToHistory,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(profile.displayName);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Statistics
  const totalDecisions = history.length;
  const coinFlips = history.filter((h) => h.type === 'coin').length;
  const lotsCast = history.filter((h) => h.type === 'lots').length;
  const favoriteMode =
    coinFlips > lotsCast
      ? 'Three-Flip Coin'
      : lotsCast > coinFlips
      ? 'Cast Lots'
      : 'Balanced Discernment';

  const joinedDateFormatted = new Date(profile.createdAt || Date.now()).toLocaleDateString([], {
    month: 'short',
    year: 'numeric',
  });

  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateProfile({ displayName: tempName.trim() });
    }
    setIsEditingName(false);
  };

  const handleExportJson = () => {
    try {
      const dataStr =
        'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute(
        'download',
        `isabicasta_decisions_${new Date().toISOString().slice(0, 10)}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setExportNotice('Exported decisions as JSON file.');
      setTimeout(() => setExportNotice(null), 3000);
    } catch {
      // fallback
    }
  };

  const handleExportText = () => {
    try {
      const lines = [
        '========================================',
        '        ISABICASTA DECISION ARCHIVE     ',
        `  Owner: ${profile.displayName}`,
        `  Export Date: ${new Date().toLocaleString()}`,
        `  Total Entries: ${history.length}`,
        '========================================\n',
      ];

      history.forEach((item, index) => {
        lines.push(`[#${index + 1}] ${new Date(item.timestamp).toLocaleString()}`);
        lines.push(`Type: ${item.type === 'coin' ? 'Threefold Coin' : 'Cast Lot'}`);
        if (item.question) lines.push(`Inquiry: "${item.question}"`);
        lines.push(`Outcome: ${item.outcome}`);
        if (item.tally) lines.push(`Tally: ${item.tally}`);
        lines.push('----------------------------------------\n');
      });

      const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', url);
      downloadAnchor.setAttribute(
        'download',
        `isabicasta_decisions_${new Date().toISOString().slice(0, 10)}.txt`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      URL.revokeObjectURL(url);

      setExportNotice('Exported plain-text journal archive.');
      setTimeout(() => setExportNotice(null), 3000);
    } catch {
      // fallback
    }
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
          Profile & Preferences
        </span>
      </div>

      {/* 2. ILLUMINATED IDENTITY CARD */}
      <div className="relative overflow-hidden rounded-3xl border border-[#dfd4c3] bg-[#faf6ef] shadow-xs">
        {/* Ancient signet seal banner */}
        <div className="h-24 bg-gradient-to-r from-[#8c6239] via-[#734e2b] to-[#8c6239] relative flex items-center justify-between px-6 border-b border-[#dfd4c3]">
          <div className="text-[11px] font-semibold text-[#faf6ef]/70 tracking-widest uppercase font-mono">
            IsabiCasta · Personal Enclave
          </div>
          <span className="text-4xl text-[#faf6ef]/15 font-serif select-none">✦</span>
        </div>

        <div className="px-5 sm:px-6 pb-6 pt-0 relative">
          {/* Signet Avatar overlapping banner */}
          <div className="flex items-end justify-between -mt-12 mb-3">
            <div className="w-22 h-22 rounded-2xl bg-[#faf6ef] p-1.5 shadow-md border-2 border-[#8c6239]/30">
              <div className="w-full h-full rounded-xl bg-[#2a241c] text-[#faf6ef] flex items-center justify-center font-bold text-2xl font-heading tracking-wider shadow-inner">
                {profile.avatarInitials || (profile.displayName || 'U').slice(0, 2).toUpperCase()}
              </div>
            </div>

            {/* Unboxed Metadata (Zero-pill discipline) */}
            <div className="flex items-center gap-1.5 text-xs text-[#6f665c] font-medium pb-1">
              <Lock className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Offline & Device-Bound</span>
            </div>
          </div>

          {/* User Info & Editable Name */}
          <div className="space-y-1.5">
            {isEditingName ? (
              <div className="flex items-center gap-2 max-w-sm pt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  maxLength={24}
                  className="px-3 py-1.5 rounded-xl border-2 border-[#8c6239] text-base font-bold text-[#2a241c] bg-[#faf6ef] focus:outline-hidden w-full font-heading"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveName();
                    if (e.key === 'Escape') setIsEditingName(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="p-2 rounded-xl bg-[#8c6239] text-[#faf6ef] hover:bg-[#734e2b] min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer shadow-xs"
                  aria-label="Save display name"
                >
                  <Check className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold font-heading text-[#2a241c] tracking-tight">
                  {profile.displayName}
                </h2>
                <button
                  type="button"
                  onClick={() => setIsEditingName(true)}
                  className="p-1.5 text-[#6f665c] hover:text-[#2a241c] hover:bg-[#f3ece1] rounded-lg transition-colors cursor-pointer"
                  aria-label="Edit display name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-[#6f665c]">
              <span>Joined {joinedDateFormatted}</span>
              <span aria-hidden="true" className="opacity-40">
                ·
              </span>
              <span className="text-[#8c6239] font-medium">{favoriteMode}</span>
            </div>
          </div>

          {/* Decision Summary Strip */}
          <div className="grid grid-cols-3 gap-2.5 pt-5 mt-4 border-t border-[#dfd4c3]">
            <div className="p-3 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] text-center space-y-0.5">
              <span className="text-[11px] text-[#6f665c] font-semibold block">Total Casts</span>
              <span className="text-2xl font-bold font-mono text-[#2a241c] tabular-nums">
                {totalDecisions}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] text-center space-y-0.5">
              <span className="text-[11px] text-[#6f665c] font-semibold flex items-center justify-center gap-1">
                <Coins className="w-3.5 h-3.5 text-[#8c6239]" />
                <span>Threefold</span>
              </span>
              <span className="text-2xl font-bold font-mono text-[#8c6239] tabular-nums">
                {coinFlips}
              </span>
            </div>

            <div className="p-3 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] text-center space-y-0.5">
              <span className="text-[11px] text-[#6f665c] font-semibold flex items-center justify-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-[#8c6239]" />
                <span>Lots</span>
              </span>
              <span className="text-2xl font-bold font-mono text-[#2a241c] tabular-nums">
                {lotsCast}
              </span>
            </div>
          </div>

          {/* Link to Standalone History Journal */}
          {onNavigateToHistory && (
            <button
              type="button"
              onClick={onNavigateToHistory}
              className="w-full mt-3 py-3 px-4 rounded-2xl bg-[#f3ece1] hover:bg-[#eae0d2] text-[#2a241c] text-xs font-semibold flex items-center justify-between transition-colors border border-[#dfd4c3] cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#8c6239]" />
                <span>Open Full Decision Journal</span>
              </div>
              <div className="flex items-center gap-1 text-[#6f665c]">
                <span className="font-mono font-bold text-[#8c6239]">{totalDecisions} entries</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </button>
          )}
        </div>
      </div>

      {/* 3. PREFERENCES & EXPERIENCE CONTROLS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#faf6ef] border border-[#dfd4c3] shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#dfd4c3] pb-3">
          <Sliders className="w-4 h-4 text-[#8c6239]" />
          <h3 className="text-xs font-bold text-[#2a241c] uppercase tracking-wider font-heading">
            Preferences & Experience
          </h3>
        </div>

        <div className="space-y-4 divide-y divide-[#dfd4c3]">
          {/* Sound Effects Toggle */}
          <div className="pt-3 first:pt-0 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                {settings.soundEnabled ? (
                  <Volume2 className="w-4 h-4 text-[#8c6239]" />
                ) : (
                  <VolumeX className="w-4 h-4 text-[#6f665c]" />
                )}
                <span className="text-sm font-semibold text-[#2a241c]">Sound Effects</span>
              </div>
              <p className="text-xs text-[#6f665c] leading-relaxed">
                Metallic shekel spin ringing and ceramic lots rattling
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !settings.soundEnabled;
                onUpdateSettings({ soundEnabled: nextVal });
                soundFx.setMuted(!nextVal);
                if (nextVal) soundFx.playCoinLanding();
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                settings.soundEnabled ? 'bg-[#8c6239]' : 'bg-[#dfd4c3]'
              }`}
              aria-label="Toggle sound effects"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#faf6ef] shadow-xs transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Haptic Vibrations Toggle */}
          <div className="pt-3 flex items-center justify-between gap-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-[#8c6239]" />
                <span className="text-sm font-semibold text-[#2a241c]">Haptic Touch</span>
              </div>
              <p className="text-xs text-[#6f665c] leading-relaxed">
                Sensory tactile buzz on supported mobile browsers
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                const nextVal = !settings.hapticsEnabled;
                onUpdateSettings({ hapticsEnabled: nextVal });
                if (nextVal) soundFx.triggerHaptic('light');
              }}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer shrink-0 ${
                settings.hapticsEnabled ? 'bg-[#8c6239]' : 'bg-[#dfd4c3]'
              }`}
              aria-label="Toggle tactile haptics"
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#faf6ef] shadow-xs transition-transform ${
                  settings.hapticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Default Opening Screen */}
          <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-sm font-semibold text-[#2a241c] block">Default Tool</span>
              <p className="text-xs text-[#6f665c] leading-relaxed">
                Screen displayed automatically when opening IsabiCasta
              </p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-[#f3ece1] rounded-xl border border-[#dfd4c3] self-start sm:self-auto">
              <button
                type="button"
                onClick={() => onUpdateSettings({ defaultMode: 'coin' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  settings.defaultMode === 'coin'
                    ? 'bg-[#faf6ef] text-[#2a241c] shadow-2xs font-bold border border-[#dfd4c3]'
                    : 'text-[#6f665c] hover:text-[#2a241c]'
                }`}
              >
                Three-Flip Coin
              </button>
              <button
                type="button"
                onClick={() => onUpdateSettings({ defaultMode: 'lots' })}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  settings.defaultMode === 'lots'
                    ? 'bg-[#faf6ef] text-[#2a241c] shadow-2xs font-bold border border-[#dfd4c3]'
                    : 'text-[#6f665c] hover:text-[#2a241c]'
                }`}
              >
                Cast Lots
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4. DATA & ARCHIVE BACKUP */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#faf6ef] border border-[#dfd4c3] shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-[#dfd4c3] pb-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#8c6239]" />
            <h3 className="text-xs font-bold text-[#2a241c] uppercase tracking-wider font-heading">
              Data & Device Storage
            </h3>
          </div>
          <span className="text-[11px] font-mono text-[#6f665c]">
            {history.length} {history.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Export Transcript */}
          <button
            type="button"
            onClick={handleExportText}
            disabled={history.length === 0}
            className={`p-3.5 rounded-2xl border border-[#dfd4c3] flex items-center gap-3 text-xs font-semibold transition-all min-h-[48px] cursor-pointer ${
              history.length === 0
                ? 'bg-[#f3ece1] text-[#6f665c]/60 cursor-not-allowed'
                : 'bg-[#faf6ef] hover:bg-[#f3ece1] text-[#2a241c]'
            }`}
          >
            <FileText className="w-4 h-4 text-[#8c6239] shrink-0" />
            <div className="text-left">
              <span>Export Text Chronicle</span>
              <span className="block text-[11px] text-[#6f665c] font-normal">
                Formatted reading transcript
              </span>
            </div>
          </button>

          {/* Export JSON */}
          <button
            type="button"
            onClick={handleExportJson}
            disabled={history.length === 0}
            className={`p-3.5 rounded-2xl border border-[#dfd4c3] flex items-center gap-3 text-xs font-semibold transition-all min-h-[48px] cursor-pointer ${
              history.length === 0
                ? 'bg-[#f3ece1] text-[#6f665c]/60 cursor-not-allowed'
                : 'bg-[#faf6ef] hover:bg-[#f3ece1] text-[#2a241c]'
            }`}
          >
            <Download className="w-4 h-4 text-[#8c6239] shrink-0" />
            <div className="text-left">
              <span>Export Raw JSON</span>
              <span className="block text-[11px] text-[#6f665c] font-normal">
                Full backup of records
              </span>
            </div>
          </button>
        </div>

        {/* Clear History Action */}
        {showClearConfirm ? (
          <div className="p-3.5 rounded-2xl border-2 border-rose-300 bg-[#f3ece1] flex flex-col sm:flex-row items-center justify-between gap-3">
            <span className="text-xs font-semibold text-[#2a241c]">
              Permanently delete all {history.length} decision records?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-3.5 py-1.5 bg-rose-700 text-[#faf6ef] rounded-xl text-xs font-semibold hover:bg-rose-800 transition-colors cursor-pointer"
              >
                Confirm Delete
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-3 py-1.5 text-[#6f665c] text-xs font-medium hover:text-[#2a241c] cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowClearConfirm(true)}
            disabled={history.length === 0}
            className={`w-full p-3 rounded-2xl border border-[#dfd4c3] flex items-center justify-between text-xs font-semibold transition-all cursor-pointer ${
              history.length === 0
                ? 'bg-[#f3ece1] text-[#6f665c]/50 cursor-not-allowed'
                : 'bg-[#faf6ef] hover:bg-rose-50 hover:text-rose-700 text-[#6f665c]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Trash2 className="w-4 h-4 shrink-0" />
              <span>Clear Decision Records</span>
            </div>
            <span className="text-[11px] font-normal">Wipe local log</span>
          </button>
        )}

        {exportNotice && (
          <div className="p-2.5 rounded-xl bg-[#e8dfd2] border border-[#8c6239] text-xs text-[#2a241c] flex items-center gap-2 font-medium">
            <Check className="w-3.5 h-3.5 text-[#8c6239]" />
            <span>{exportNotice}</span>
          </div>
        )}
      </div>

      {/* 5. EXPLORATION & BIBLICAL ACCOUNTS */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#faf6ef] border border-[#dfd4c3] shadow-xs space-y-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8c6239]" />
            <h3 className="text-sm font-bold text-[#2a241c] font-heading">
              Biblical Accounts & Historical Context
            </h3>
          </div>
          <p className="text-xs text-[#6f665c] leading-relaxed">
            Examine how biblical accounts across centuries (Proverbs, Leviticus, Jonah, Acts)
            utilized casting lots to resolve uncertainty without human strife.
          </p>
        </div>

        <div className="pt-1 flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={onNavigateToAbout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#8c6239] hover:bg-[#734e2b] text-[#faf6ef] text-xs font-semibold transition-colors min-h-[42px] cursor-pointer shadow-xs"
          >
            <span>Read Biblical Accounts</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={onReplayOnboarding}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#f3ece1] hover:bg-[#eae0d2] text-[#2a241c] border border-[#dfd4c3] text-xs font-semibold transition-colors min-h-[42px] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#8c6239]" />
            <span>Replay Guide</span>
          </button>
        </div>
      </div>

      {/* 6. APP RESET & ENCLAVE INTEGRITY FOOTER */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#dfd4c3] bg-[#faf6ef] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#6f665c]">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-[#2a241c] font-heading text-sm">IsabiCasta</span>
          <span>·</span>
          <span className="font-mono text-[11px]">v{APP_VERSION}</span>
          <span>·</span>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-[#8c6239] hover:text-[#734e2b] transition-colors cursor-pointer"
          >
            <Github className="w-3.5 h-3.5" />
            <span>View Code</span>
          </a>
        </div>

        {showResetConfirm ? (
          <div className="flex items-center gap-2">
            <span className="text-rose-700 font-medium text-xs">Reset entire app?</span>
            <button
              type="button"
              onClick={() => {
                onResetApp();
                setShowResetConfirm(false);
              }}
              className="px-3 py-1 bg-rose-700 text-[#faf6ef] rounded-lg text-xs font-semibold hover:bg-rose-800 transition-colors cursor-pointer"
            >
              Reset All
            </button>
            <button
              type="button"
              onClick={() => setShowResetConfirm(false)}
              className="text-[#6f665c] text-xs px-2 hover:text-[#2a241c] cursor-pointer"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-1.5 text-[#6f665c] hover:text-[#2a241c] transition-colors py-1 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#8c6239]" />
            <span>Factory Reset</span>
          </button>
        )}
      </div>
    </div>
  );
};
