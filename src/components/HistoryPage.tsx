/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft,
  Clock,
  Coins,
  Sparkles,
  Download,
  Trash2,
  AlertTriangle,
  Search,
  Check,
  Copy,
  ShieldCheck,
  Calendar,
  FileText,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { DecisionHistoryItem } from '../types';

interface HistoryPageProps {
  history: DecisionHistoryItem[];
  onClearHistory: () => void;
  onDeleteItem?: (id: string) => void;
  onBackToDecision: () => void;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  history,
  onClearHistory,
  onDeleteItem,
  onBackToDecision,
}) => {
  const [filter, setFilter] = useState<'all' | 'coin' | 'lots'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedItemId, setExpandedItemId] = useState<string | null>(null);

  // Statistics
  const totalCount = history.length;
  const coinCount = history.filter((h) => h.type === 'coin').length;
  const lotsCount = history.filter((h) => h.type === 'lots').length;

  // Filtered and searched records
  const filteredHistory = useMemo(() => {
    return history.filter((item) => {
      // Type filter
      if (filter === 'coin' && item.type !== 'coin') return false;
      if (filter === 'lots' && item.type !== 'lots') return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesOutcome = item.outcome.toLowerCase().includes(q);
        const matchesQuestion = item.question?.toLowerCase().includes(q) ?? false;
        const matchesMeaning =
          (item.headsMeaning?.toLowerCase().includes(q) ?? false) ||
          (item.tailsMeaning?.toLowerCase().includes(q) ?? false);
        const matchesOptions = item.options?.some((opt) => opt.toLowerCase().includes(q)) ?? false;
        return matchesOutcome || matchesQuestion || matchesMeaning || matchesOptions;
      }

      return true;
    });
  }, [history, filter, searchQuery]);

  // Group filtered records chronologically by date
  const groupedHistory = useMemo(() => {
    const groups: { [dateKey: string]: DecisionHistoryItem[] } = {};
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    filteredHistory.forEach((item) => {
      const itemDate = new Date(item.timestamp).toDateString();
      let label = new Date(item.timestamp).toLocaleDateString([], {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });

      if (itemDate === today) {
        label = 'Today';
      } else if (itemDate === yesterday) {
        label = 'Yesterday';
      }

      if (!groups[label]) {
        groups[label] = [];
      }
      groups[label].push(item);
    });

    return groups;
  }, [filteredHistory]);

  const formatTime = (ts: number): string => {
    try {
      return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  const formatDateFull = (ts: number): string => {
    try {
      return new Date(ts).toLocaleDateString([], {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  // Export as formatted plain text chronicle
  const exportAsText = () => {
    const lines = [
      '========================================',
      '        ISABICASTA DECISION CHRONICLE    ',
      '  A private way to choose when undecided',
      `  Generated: ${new Date().toLocaleString()}`,
      `  Total Entries: ${history.length}`,
      '========================================\n',
    ];

    history.forEach((item, index) => {
      lines.push(`[${index + 1}] ${formatDateFull(item.timestamp)} · ${formatTime(item.timestamp)}`);
      lines.push(`Type: ${item.type === 'coin' ? 'Threefold Coin Discernment' : 'Cast Lots'}`);
      if (item.question) {
        lines.push(`Inquiry: "${item.question}"`);
      }
      lines.push(`Resolved Outcome: ${item.outcome}`);
      if (item.type === 'coin' && item.flips) {
        lines.push(`Flip Sequence: ${item.flips.join(' · ')}`);
        if (item.tally) lines.push(`Tally: ${item.tally}`);
      }
      if (item.type === 'lots' && item.options) {
        lines.push(`Options Pool: ${item.options.join(', ')}`);
      }
      lines.push('----------------------------------------\n');
    });

    lines.push('"The lot is cast into the lap, but its every decision is from the Lord." — Proverbs 16:33');

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', url);
    downloadAnchor.setAttribute(
      'download',
      `isabicasta-chronicle-${new Date().toISOString().slice(0, 10)}.txt`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    URL.revokeObjectURL(url);
  };

  // Export as JSON
  const exportAsJson = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(history, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `isabicasta-history-${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const copyItemText = (item: DecisionHistoryItem) => {
    const lines = [
      item.question ? `Inquiry: "${item.question}"` : null,
      `Outcome: ${item.outcome}`,
      item.tally ? `Tally: ${item.tally}` : null,
      `Decided: ${formatDateFull(item.timestamp)} at ${formatTime(item.timestamp)}`,
      `Decided via IsabiCasta`,
    ]
      .filter(Boolean)
      .join('\n');

    navigator.clipboard.writeText(lines).then(() => {
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const toggleExpandItem = (id: string) => {
    setExpandedItemId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="w-full max-w-lg mx-auto space-y-6 pb-12 animate-in fade-in duration-150">
      {/* 1. TOP BAR NAVIGATION */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBackToDecision}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6f665c] hover:text-[#2a241c] transition-colors py-2 px-3 rounded-xl hover:bg-[#faf6ef] min-h-[40px] border border-transparent hover:border-[#dfd4c3] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-[#8c6239]" />
          <span>Back to Decisions</span>
        </button>

        {history.length > 0 && (
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={exportAsText}
              title="Download text journal chronicle"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6f665c] hover:text-[#2a241c] px-2.5 py-1.5 rounded-xl bg-[#faf6ef] border border-[#dfd4c3] hover:bg-[#f3ece1] transition-colors cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5 text-[#8c6239]" />
              <span className="hidden sm:inline">Transcript</span>
            </button>

            <button
              type="button"
              onClick={exportAsJson}
              title="Export raw JSON"
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#6f665c] hover:text-[#2a241c] px-2.5 py-1.5 rounded-xl bg-[#faf6ef] border border-[#dfd4c3] hover:bg-[#f3ece1] transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-[#8c6239]" />
              <span className="hidden sm:inline">JSON</span>
            </button>

            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              title="Clear all records"
              className="inline-flex items-center gap-1 text-xs font-semibold text-rose-700 hover:text-rose-800 px-2.5 py-1.5 rounded-xl bg-[#faf6ef] border border-[#dfd4c3] hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* 2. CHRONICLE MASTHEAD & METRICS */}
      <div className="p-6 rounded-3xl bg-[#faf6ef] border border-[#dfd4c3] shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-[#8c6239] uppercase tracking-wider font-heading">
              Personal Chronicle
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-heading text-[#2a241c] tracking-tight">
              Decision Journal
            </h1>
            <p className="text-xs text-[#6f665c] leading-relaxed">
              Every lot cast and threefold determination preserved in quiet clarity.
            </p>
          </div>

          <div className="w-11 h-11 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] text-[#8c6239] flex items-center justify-center shrink-0 shadow-2xs">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Quiet 3-Metric Summary Strip */}
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#dfd4c3]">
          <div className="p-2.5 rounded-xl bg-[#f3ece1]/80 text-center">
            <span className="text-[11px] font-semibold text-[#6f665c] block">Recorded</span>
            <span className="text-xl font-bold font-mono text-[#2a241c] tabular-nums">
              {totalCount}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f3ece1]/80 text-center">
            <span className="text-[11px] font-semibold text-[#6f665c] flex items-center justify-center gap-1">
              <Coins className="w-3 h-3 text-[#8c6239]" />
              <span>Threefold</span>
            </span>
            <span className="text-xl font-bold font-mono text-[#8c6239] tabular-nums">
              {coinCount}
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-[#f3ece1]/80 text-center">
            <span className="text-[11px] font-semibold text-[#6f665c] flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-[#8c6239]" />
              <span>Lots</span>
            </span>
            <span className="text-xl font-bold font-mono text-[#2a241c] tabular-nums">
              {lotsCount}
            </span>
          </div>
        </div>
      </div>

      {/* 3. CLEAR ALL CONFIRMATION DIALOG */}
      <AnimatePresence>
        {showClearConfirm && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="p-5 rounded-2xl bg-[#faf6ef] border-2 border-rose-300 text-center space-y-3 shadow-sm"
          >
            <div className="w-9 h-9 rounded-full bg-rose-50 text-rose-700 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading font-bold text-sm text-[#2a241c]">
                Clear Decision Archive?
              </h4>
              <p className="text-xs text-[#6f665c] max-w-sm mx-auto leading-relaxed">
                This will permanently delete all {history.length} decision records stored on this
                device. This action cannot be reversed.
              </p>
            </div>
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onClearHistory();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-[#faf6ef] text-xs font-semibold transition-colors cursor-pointer"
              >
                Permanently Clear
              </button>
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#f3ece1] border border-[#dfd4c3] text-[#2a241c] text-xs font-semibold hover:bg-[#eae0d2] transition-colors cursor-pointer"
              >
                Keep Records
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. SEARCH & FILTER CONTROLS */}
      {history.length > 0 && (
        <div className="space-y-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#6f665c]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by inquiry, outcome, or meaning..."
              className="w-full pl-10 pr-16 py-2.5 rounded-2xl bg-[#faf6ef] border border-[#dfd4c3] text-sm text-[#2a241c] placeholder-[#6f665c]/50 focus:outline-none focus:border-[#8c6239] transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-2.5 px-2 py-1 text-xs text-[#6f665c] hover:text-[#2a241c] bg-[#f3ece1] rounded-lg"
              >
                Clear
              </button>
            )}
          </div>

          {/* Interactive Filter Segmented Control */}
          <div className="flex items-center gap-1.5 p-1 bg-[#eae2d6] border border-[#dfd4c3] rounded-2xl">
            <button
              type="button"
              onClick={() => setFilter('all')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                filter === 'all'
                  ? 'bg-[#faf6ef] text-[#2a241c] shadow-2xs border border-[#dfd4c3]'
                  : 'text-[#6f665c] hover:text-[#2a241c]'
              }`}
            >
              <span>All Entries</span>
              <span className="font-mono text-[11px] opacity-70">({history.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('coin')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                filter === 'coin'
                  ? 'bg-[#faf6ef] text-[#2a241c] shadow-2xs border border-[#dfd4c3]'
                  : 'text-[#6f665c] hover:text-[#2a241c]'
              }`}
            >
              <Coins className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Threefold</span>
              <span className="font-mono text-[11px] opacity-70">({coinCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilter('lots')}
              className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer ${
                filter === 'lots'
                  ? 'bg-[#faf6ef] text-[#2a241c] shadow-2xs border border-[#dfd4c3]'
                  : 'text-[#6f665c] hover:text-[#2a241c]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#8c6239]" />
              <span>Cast Lots</span>
              <span className="font-mono text-[11px] opacity-70">({lotsCount})</span>
            </button>
          </div>
        </div>
      )}

      {/* 5. CHRONOLOGICAL TIMELINE OF DECISIONS */}
      <div className="space-y-6">
        {history.length === 0 ? (
          /* Empty State */
          <div className="p-8 sm:p-10 rounded-3xl bg-[#faf6ef] border border-[#dfd4c3] text-center space-y-4 shadow-xs">
            <div className="w-16 h-16 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] text-[#8c6239] mx-auto flex items-center justify-center shadow-2xs">
              <Clock className="w-8 h-8" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-xl font-bold font-heading text-[#2a241c]">
                The Journal Awaits Your First Cast
              </h3>
              <p className="text-xs sm:text-sm text-[#6f665c] max-w-sm mx-auto leading-relaxed">
                Whenever you complete a three-flip coin discernment or draw sacred lots, your
                accepted outcomes will appear here in quiet order.
              </p>
            </div>
            <div className="pt-2">
              <button
                type="button"
                onClick={onBackToDecision}
                className="px-5 py-2.5 rounded-2xl bg-[#8c6239] hover:bg-[#734e2b] text-[#faf6ef] text-sm font-semibold transition-colors shadow-xs cursor-pointer inline-flex items-center gap-2"
              >
                <span>Cast a Decision Now</span>
              </button>
            </div>
          </div>
        ) : filteredHistory.length === 0 ? (
          /* Empty Filter Result */
          <div className="p-8 rounded-3xl bg-[#faf6ef] border border-[#dfd4c3] text-center space-y-2">
            <p className="text-sm font-semibold text-[#2a241c]">No entries match your search</p>
            <p className="text-xs text-[#6f665c]">
              No records match "{searchQuery}". Try a different keyword or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setFilter('all');
              }}
              className="text-xs text-[#8c6239] font-bold hover:underline pt-2 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          Object.entries(groupedHistory).map(([dateLabel, items]) => (
            <div key={dateLabel} className="space-y-3">
              {/* Date Group Header */}
              <div className="flex items-center gap-2 px-1">
                <Calendar className="w-3.5 h-3.5 text-[#8c6239]" />
                <h2 className="text-xs font-bold text-[#6f665c] uppercase tracking-wider font-heading">
                  {dateLabel}
                </h2>
                <div className="h-px flex-1 bg-[#dfd4c3]" />
                <span className="text-[11px] font-mono text-[#6f665c]">
                  {items.length} {items.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {/* Items in this date group */}
              <div className="space-y-3">
                {items.map((item) => {
                  const isExpanded = expandedItemId === item.id;

                  return (
                    <motion.article
                      key={item.id}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 sm:p-5 rounded-2xl bg-[#faf6ef] border border-[#dfd4c3] border-l-4 border-l-[#8c6239] space-y-3 shadow-xs hover:border-[#8c6239]/60 transition-all"
                    >
                      {/* Top Metadata Header (No pills per constitution) */}
                      <div className="flex items-center justify-between text-xs text-[#6f665c] border-b border-[#dfd4c3]/60 pb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-semibold text-[#8c6239] flex items-center gap-1">
                            {item.type === 'coin' ? (
                              <>
                                <Coins className="w-3 h-3" />
                                <span>Three-Flip Shekel</span>
                              </>
                            ) : (
                              <>
                                <Sparkles className="w-3 h-3" />
                                <span>Impartial Lot</span>
                              </>
                            )}
                          </span>

                          <span aria-hidden="true" className="opacity-40">
                            ·
                          </span>
                          <span className="font-mono text-[11px]">{formatTime(item.timestamp)}</span>

                          {item.accepted && (
                            <>
                              <span aria-hidden="true" className="opacity-40">
                                ·
                              </span>
                              <span className="text-[#8c6239] font-medium">Sealed</span>
                            </>
                          )}
                        </div>

                        {/* Quick Actions */}
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => copyItemText(item)}
                            title="Copy decision text"
                            className="p-1 rounded-lg text-[#6f665c] hover:text-[#2a241c] hover:bg-[#f3ece1] transition-colors cursor-pointer"
                          >
                            {copiedId === item.id ? (
                              <Check className="w-3.5 h-3.5 text-[#8c6239]" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>

                          {onDeleteItem && (
                            <button
                              type="button"
                              onClick={() => onDeleteItem(item.id)}
                              title="Delete this entry"
                              className="p-1 rounded-lg text-[#6f665c] hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Inquiry Question (if present) */}
                      {item.question && (
                        <div className="text-xs text-[#6f665c] italic font-heading">
                          Inquiry: <span className="font-normal text-[#2a241c] font-sans">"{item.question}"</span>
                        </div>
                      )}

                      {/* Primary Resolved Outcome */}
                      <div className="space-y-1">
                        <div className="text-base sm:text-lg font-bold font-heading text-[#2a241c] leading-tight">
                          {item.outcome}
                        </div>

                        {/* Threefold Coin Flips Visual Sequence */}
                        {item.type === 'coin' && item.flips && item.flips.length > 0 && (
                          <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                            <span className="text-[11px] font-semibold text-[#6f665c] uppercase">
                              Casts:
                            </span>
                            <div className="flex items-center gap-1.5">
                              {item.flips.map((flip, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-lg bg-[#f3ece1] border border-[#dfd4c3] font-mono font-bold text-[11px] text-[#2a241c]"
                                >
                                  {flip}
                                </span>
                              ))}
                            </div>
                            {item.tally && (
                              <span className="text-[11px] text-[#8c6239] font-medium ml-1">
                                ({item.tally})
                              </span>
                            )}
                          </div>
                        )}

                        {/* Cast Lots Options Pool */}
                        {item.type === 'lots' && item.options && item.options.length > 0 && (
                          <div className="pt-2 flex flex-wrap gap-1.5 text-xs">
                            <span className="text-[11px] font-semibold text-[#6f665c] uppercase mr-1 self-center">
                              Choices:
                            </span>
                            {item.options.map((option, idx) => (
                              <span
                                key={idx}
                                className={`text-[11px] px-2.5 py-0.5 rounded-lg transition-colors ${
                                  option === item.outcome
                                    ? 'bg-[#8c6239] text-[#faf6ef] font-semibold'
                                    : 'bg-[#f3ece1] border border-[#dfd4c3] text-[#6f665c]'
                                }`}
                              >
                                {option}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Expandable Session Insight Details */}
                      <div className="pt-1">
                        <button
                          type="button"
                          onClick={() => toggleExpandItem(item.id)}
                          className="text-[11px] font-semibold text-[#8c6239] hover:text-[#734e2b] flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <span>{isExpanded ? 'Hide Scripture & Details' : 'View Session Context'}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>

                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pt-2.5 text-xs space-y-2 border-t border-[#dfd4c3]/50 mt-2 overflow-hidden"
                            >
                              <div className="p-2.5 rounded-xl bg-[#f3ece1] text-[#6f665c] text-[11px] space-y-1">
                                {item.type === 'coin' && (
                                  <div>
                                    <span className="font-semibold text-[#2a241c]">Defined Meanings:</span>{' '}
                                    Heads ({item.headsMeaning || 'Yes'}) · Tails ({item.tailsMeaning || 'No'})
                                  </div>
                                )}
                                <div className="text-[#8c6239] italic pt-0.5">
                                  "The lot is cast into the lap, but its every decision is from the Lord." — Proverbs 16:33
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.article>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 6. PRIVACY & LOCAL ENCLAVE BADGE */}
      <div className="p-4 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] text-xs text-[#6f665c] flex items-start gap-2.5 shadow-2xs">
        <ShieldCheck className="w-4 h-4 text-[#8c6239] shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold text-[#2a241c] block">Private & Local Storage</span>
          <p className="leading-relaxed">
            All decision records remain strictly on this device. No inquiries or outcomes are ever
            transmitted or logged externally.
          </p>
        </div>
      </div>
    </div>
  );
};
