/**
 * @license
 * SPDX-License-Identifier: MIT
 */

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Download, X } from 'lucide-react';
import { BeforeInstallPromptEvent } from '../types';

const DISMISS_KEY = 'isabicasta_install_prompt_dismissed';

interface InstallAppModalProps {
  /** Hold the popup while the preloader or onboarding slider is visible. */
  holdOff?: boolean;
}

export const InstallAppModal: React.FC<InstallAppModalProps> = ({ holdOff = false }) => {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISS_KEY) === 'true';
    } catch {
      return false;
    }
  });

  // Capture the install prompt and suppress the browser's own mini-infobar.
  useEffect(() => {
    const handlePrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
    };
    const handleInstalled = () => {
      setPromptEvent(null);
      setIsVisible(false);
    };
    window.addEventListener('beforeinstallprompt', handlePrompt);
    window.addEventListener('appinstalled', handleInstalled);
    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt);
      window.removeEventListener('appinstalled', handleInstalled);
    };
  }, []);

  // Show shortly after the browser deems the app installable, once things settle
  // and only if the user has not declined before.
  useEffect(() => {
    if (holdOff || isDismissed || !promptEvent || isVisible) return;
    const timer = setTimeout(() => setIsVisible(true), 3500);
    return () => clearTimeout(timer);
  }, [holdOff, isDismissed, promptEvent, isVisible]);

  const dismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    try {
      localStorage.setItem(DISMISS_KEY, 'true');
    } catch {
      // ignore
    }
  };

  const handleInstall = async () => {
    if (!promptEvent) return;
    setIsVisible(false);
    promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    if (choice.outcome === 'dismissed') {
      // The user declined in the native dialog — do not nag again.
      setIsDismissed(true);
      try {
        localStorage.setItem(DISMISS_KEY, 'true');
      } catch {
        // ignore
      }
    }
    setPromptEvent(null);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="install-app-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[70] flex items-end sm:items-center justify-center bg-[#2a241c]/40 backdrop-blur-sm p-4"
          onClick={dismiss}
          role="dialog"
          aria-modal="true"
          aria-label="Install IsabiCasta"
        >
          <motion.div
            initial={{ y: 24, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 16, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-full max-w-sm rounded-3xl border border-[#dfd4c3] bg-[#faf6ef] p-6 shadow-xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#f3ece1] border border-[#dfd4c3] flex items-center justify-center text-[#8c6239] shadow-xs shrink-0">
                <span className="font-heading font-serif text-xl font-semibold select-none">✦</span>
              </div>
              <button
                type="button"
                onClick={dismiss}
                aria-label="Close install prompt"
                className="p-2 -m-1 text-[#6f665c] hover:text-[#2a241c] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-lg font-bold font-heading text-[#2a241c]">Install IsabiCasta</h2>
              <p className="text-sm text-[#6f665c] leading-relaxed">
                Add IsabiCasta to your home screen for quick, app-like access — private,
                on-device, and ready even when you are offline.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                type="button"
                onClick={handleInstall}
                className="w-full flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl bg-[#8c6239] hover:bg-[#734e2b] text-[#faf6ef] text-sm font-semibold transition-colors min-h-[44px] cursor-pointer shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>Install</span>
              </button>
              <button
                type="button"
                onClick={dismiss}
                className="w-full px-4 py-3 rounded-xl text-[#6f665c] hover:text-[#2a241c] text-sm font-semibold transition-colors min-h-[44px] cursor-pointer"
              >
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
