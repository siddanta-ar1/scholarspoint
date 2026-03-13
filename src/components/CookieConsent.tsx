'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';

export default function CookieConsent() {
  const [consentGiven, setConsentGiven] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if consent has already been given or declined
    const storedConsent = localStorage.getItem('cookie-consent');
    if (storedConsent === 'true') {
      setConsentGiven(true);
    } else if (storedConsent === 'false') {
      setConsentGiven(false);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setConsentGiven(true);
  };

  const declineCookies = () => {
    localStorage.setItem('cookie-consent', 'false');
    setConsentGiven(false);
  };

  // Only render conditionally so there are no hydration mismatch issues on first load
  // Actually, we can return null if consentGiven is null from server, but we need
  // to show the banner. We'll use a mounted state.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <>
      {consentGiven && (
        <Script
          id="adsense-init"
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6531423360862071"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      )}

      {consentGiven === null && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl z-50 p-4 md:p-6 pb-8 md:pb-6">
          <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 max-w-3xl">
              <p className="font-semibold text-gray-900 mb-1 text-base">Cookie Consent</p>
              <p>
                We and our partners (like Google AdSense) use cookies to personalize content and ads, provide social media features, and analyze our traffic. By clicking &quot;Accept&quot;, you consent to the use of these cookies. Please review our <a href="/privacy" className="text-sky-600 hover:underline">Privacy Policy</a> for more details.
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 w-full md:w-auto">
              <button
                onClick={declineCookies}
                className="w-full md:w-auto px-6 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors focus:ring-2 focus:ring-gray-200 outline-none"
              >
                Decline
              </button>
              <button
                onClick={acceptCookies}
                className="w-full md:w-auto px-6 py-2.5 text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors focus:ring-2 focus:ring-sky-500 outline-none"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
