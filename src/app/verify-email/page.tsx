'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Extract Firebase auth parameters from URL
    const mode = searchParams.get('mode');
    const oobCode = searchParams.get('oobCode');
    const apiKey = searchParams.get('apiKey');
    const continueUrl = searchParams.get('continueUrl');
    const lang = searchParams.get('lang');

    // Build the deep link with all available parameters
    const deepLinkParams = new URLSearchParams();
    
    if (mode) deepLinkParams.set('mode', mode);
    if (oobCode) deepLinkParams.set('oobCode', oobCode);
    if (apiKey) deepLinkParams.set('apiKey', apiKey);
    if (continueUrl) deepLinkParams.set('continueUrl', continueUrl);
    if (lang) deepLinkParams.set('lang', lang);

    const deepLink = `elevatia://verify-email?${deepLinkParams.toString()}`;

    // Attempt to redirect to the app
    window.location.href = deepLink;

    // Fallback: redirect to app store if deep link doesn't work
    setTimeout(() => {
      // If user is still on this page after 3 seconds, redirect to app store
      window.location.href = 'https://apps.apple.com/app/elevatia/id6670204991';
    }, 3000);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <Logo className="mx-auto mb-4" width={80} height={80} />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Opening Elevatia...
          </h1>
          <p className="text-gray-600">
            Redirecting you to the Elevatia app to verify your email.
          </p>
        </div>

        <div className="mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
            <span className="text-blue-600 font-medium">Loading...</span>
          </div>
        </div>

        <div className="text-sm text-gray-500 space-y-2">
          <p>If the app doesn&apos;t open automatically:</p>
          <a 
            href="https://apps.apple.com/app/elevatia/id6670204991"
            className="inline-block bg-black text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Download from App Store
          </a>
        </div>
      </div>
    </div>
  );
}

