/**
 * @license
 * SPDX-License-Identifier: MIT
 */

export type DecisionType = 'coin' | 'lots';

export interface DecisionHistoryItem {
  id: string;
  type: DecisionType;
  outcome: string;
  options?: string[];
  timestamp: number;
  question?: string;
  flips?: ('Heads' | 'Tails')[];
  headsMeaning?: string;
  tailsMeaning?: string;
  tally?: string;
  accepted?: boolean;
}

export interface ScripturalAccount {
  id: string;
  reference: string;
  translation: string;
  verse: string;
  purposeBadge: string;
  historicalPurpose: string;
  practicalReflection: string;
}

export interface UserSettings {
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  defaultMode: DecisionType;
  animationSpeed: 'normal' | 'fast';
  autoSaveHistory?: boolean;
}

export type AppSettings = UserSettings;

export interface UserProfile {
  displayName: string;
  avatarInitials?: string;
  themePreference?: 'light' | 'dark' | 'system';
  createdAt?: number;
  joinedDate?: number;
}

/** Deferred `beforeinstallprompt` event used by the PWA install flows. */
export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
};
