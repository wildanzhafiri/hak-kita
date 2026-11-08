'use client';

import { useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import type { TurnstileProps } from './types';

interface TurnstileApi {
  render: (
    container: HTMLElement,
    options: {
      sitekey: string;
      callback: (token: string) => void;
      'expired-callback': () => void;
      'error-callback': () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function Turnstile({ siteKey, resetKey, label, onToken }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null);
  const [isScriptReady, setIsScriptReady] = useState(false);

  useEffect(() => {
    const turnstile = window.turnstile;
    if (!isScriptReady || !container.current || !turnstile) return;
    const widgetId = turnstile.render(container.current, {
      sitekey: siteKey,
      callback: onToken,
      'expired-callback': () => onToken(''),
      'error-callback': () => onToken(''),
    });
    return () => turnstile.remove(widgetId);
  }, [isScriptReady, onToken, resetKey, siteKey]);

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={() => setIsScriptReady(true)}
      />
      <div ref={container} aria-label={label} role="group" />
    </>
  );
}
