// Custom Hook to manage PWA Installation & Platform Detection

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

function checkIsStandalone(): boolean {
  if (typeof window === 'undefined') return false;
  const isStandaloneMedia = window.matchMedia('(display-mode: standalone)').matches;
  const isNavigatorStandalone = (window.navigator as unknown as { standalone?: boolean }).standalone === true;
  const isAndroidApp = typeof document !== 'undefined' && document.referrer.startsWith('android-app://');
  return isStandaloneMedia || isNavigatorStandalone || isAndroidApp;
}

function checkIsIOS(): boolean {
  if (typeof window === 'undefined') return false;
  const userAgent = window.navigator.userAgent.toLowerCase();
  return (
    /iphone|ipad|ipod/.test(userAgent) ||
    (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1)
  );
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(() => checkIsStandalone());
  const [isIOS] = useState<boolean>(() => checkIsIOS());
  const [isIOSModalOpen, setIsIOSModalOpen] = useState(false);

  useEffect(() => {
    // Listen for display mode changes (e.g. if installed in current window)
    const mediaQuery = window.matchMedia('(display-mode: standalone)');
    const handleMediaChange = () => {
      setIsInstalled(checkIsStandalone());
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleMediaChange);
    } else {
      mediaQuery.addListener(handleMediaChange);
    }

    // Handle Chromium `beforeinstallprompt` event
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent browser's automatic mini-infobar prompt
      e.preventDefault();
      // Store event for manual triggering
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    // Handle `appinstalled` event
    const handleAppInstalled = () => {
      setDeferredPrompt(null);
      setIsInstalled(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleMediaChange);
      } else {
        mediaQuery.removeListener(handleMediaChange);
      }
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  // Trigger installation
  const promptInstall = useCallback(async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choiceResult = await deferredPrompt.userChoice;
        if (choiceResult.outcome === 'accepted') {
          setDeferredPrompt(null);
          setIsInstalled(true);
        } else {
          setDeferredPrompt(null);
        }
      } catch (err) {
        console.error('PWA install prompt error:', err);
      }
    } else if (isIOS && !isInstalled) {
      setIsIOSModalOpen(true);
    }
  }, [deferredPrompt, isIOS, isInstalled]);

  // Install is available if deferredPrompt exists (Chromium/Android/Windows/macOS) OR on iOS (when not already installed)
  const isInstallable = !isInstalled && (deferredPrompt !== null || isIOS);

  return {
    isInstallable,
    isInstalled,
    isIOS,
    promptInstall,
    isIOSModalOpen,
    setIsIOSModalOpen,
  };
}
