'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuth } from '@/lib/auth-context';

type AuthMethod = 'email' | 'apple' | 'phone';

export default function LoginForm() {
  const [activeMethod, setActiveMethod] = useState<AuthMethod>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { signIn, signInWithApple, sendPhoneCode, verifyPhoneCode } = useAuth();

  // Email state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Phone state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSent, setCodeSent] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement>(null);

  // Initialize reCAPTCHA
  useEffect(() => {
    if (activeMethod === 'phone' && recaptchaContainerRef.current && !recaptchaVerifierRef.current) {
      recaptchaVerifierRef.current = new RecaptchaVerifier(auth, recaptchaContainerRef.current, {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        },
      });
    }

    return () => {
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    };
  }, [activeMethod]);

  // Handle redirect after successful auth
  const handleSuccess = (slug?: string) => {
    if (slug) {
      router.push(`/partners/dashboard/${slug}`);
    } else {
      router.push('/admin/partners');
    }
  };

  // Email sign in
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await signIn(email, password);
    
    if (result.success) {
      handleSuccess(result.slug);
    } else {
      setError(result.error || 'Failed to sign in');
      setLoading(false);
    }
  };

  // Apple sign in
  const handleAppleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithApple();
    
    if (result.success) {
      handleSuccess(result.slug);
    } else {
      setError(result.error || 'Failed to sign in with Apple');
      setLoading(false);
    }
  };

  // Send phone verification code
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaVerifierRef.current) {
      setError('reCAPTCHA not initialized. Please refresh the page.');
      return;
    }

    setLoading(true);
    setError('');

    // Format phone number (add +1 if no country code)
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
      formattedPhone = '+1' + formattedPhone.replace(/\D/g, '');
    }

    const result = await sendPhoneCode(formattedPhone, recaptchaVerifierRef.current);
    
    if (result.success && result.confirmationResult) {
      setConfirmationResult(result.confirmationResult);
      setCodeSent(true);
    } else {
      setError(result.error || 'Failed to send verification code');
      // Reset reCAPTCHA on error
      if (recaptchaVerifierRef.current) {
        recaptchaVerifierRef.current.clear();
        recaptchaVerifierRef.current = null;
      }
    }
    setLoading(false);
  };

  // Verify phone code
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult) {
      setError('Please request a new verification code');
      return;
    }

    setLoading(true);
    setError('');

    const result = await verifyPhoneCode(confirmationResult, verificationCode);
    
    if (result.success) {
      handleSuccess(result.slug);
    } else {
      setError(result.error || 'Invalid verification code');
      setLoading(false);
    }
  };

  // Reset phone state when switching methods
  const handleMethodChange = (method: AuthMethod) => {
    setActiveMethod(method);
    setError('');
    setCodeSent(false);
    setVerificationCode('');
    setConfirmationResult(null);
  };

  const LoadingSpinner = () => (
    <span className="flex items-center justify-center gap-2">
      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
      </svg>
      {activeMethod === 'phone' && codeSent ? 'Verifying...' : 'Signing in...'}
    </span>
  );

  return (
    <div className="space-y-6">
      {/* Method Tabs */}
      <div className="flex rounded-xl bg-gray-100 p-1">
        {[
          { id: 'email' as AuthMethod, label: 'Email', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          )},
          { id: 'apple' as AuthMethod, label: 'Apple', icon: (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          )},
          { id: 'phone' as AuthMethod, label: 'Phone', icon: (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          )},
        ].map((method) => (
          <button
            key={method.id}
            type="button"
            onClick={() => handleMethodChange(method.id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeMethod === method.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {method.icon}
            {method.label}
          </button>
        ))}
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}

      {/* Email Form */}
      {activeMethod === 'email' && (
        <form onSubmit={handleEmailSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80"
              placeholder="you@company.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {loading ? <LoadingSpinner /> : 'Sign In with Email'}
          </button>
        </form>
      )}

      {/* Apple Sign In */}
      {activeMethod === 'apple' && (
        <div className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Sign in with the same Apple ID you use in the Elevatia app.
          </p>
          <button
            type="button"
            onClick={handleAppleSignIn}
            disabled={loading}
            className="w-full py-3 px-4 bg-black text-white font-semibold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
          >
            {loading ? (
              <LoadingSpinner />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Sign in with Apple
              </>
            )}
          </button>
        </div>
      )}

      {/* Phone Sign In */}
      {activeMethod === 'phone' && (
        <div className="space-y-4">
          {!codeSent ? (
            <form onSubmit={handleSendCode} className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Enter the phone number linked to your Elevatia account.
              </p>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80"
                  placeholder="+1 (555) 123-4567"
                />
                <p className="text-xs text-gray-500 mt-1">Include country code (e.g., +1 for US)</p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? <LoadingSpinner /> : 'Send Verification Code'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <p className="text-sm text-gray-600 text-center">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Code
                </label>
                <input
                  id="code"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  maxLength={6}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all bg-white/80 text-center text-2xl tracking-widest font-mono"
                  placeholder="000000"
                />
              </div>

              <button
                type="submit"
                disabled={loading || verificationCode.length !== 6}
                className="w-full py-3 px-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? <LoadingSpinner /> : 'Verify & Sign In'}
              </button>

              <button
                type="button"
                onClick={() => {
                  setCodeSent(false);
                  setVerificationCode('');
                  setConfirmationResult(null);
                  if (recaptchaVerifierRef.current) {
                    recaptchaVerifierRef.current.clear();
                    recaptchaVerifierRef.current = null;
                  }
                }}
                className="w-full py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Use a different phone number
              </button>
            </form>
          )}
        </div>
      )}

      {/* reCAPTCHA container (invisible) */}
      <div ref={recaptchaContainerRef} id="recaptcha-container" />
    </div>
  );
}
