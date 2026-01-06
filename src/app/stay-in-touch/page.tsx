'use client';

import { useState } from 'react';

export default function StayInTouchPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error('Failed to subscribe');
      }

      setStatus('success');
      setEmail('');
    } catch {
      setStatus('error');
      setErrorMessage('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-[#FDFAF6]">
      <section className="section-padding">
        <div className="container">
          <div className="max-w-xl mx-auto">
            {status === 'success' ? (
              <div className="text-center py-12">
                <div className="mb-6">
                  <svg
                    className="w-16 h-16 mx-auto text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-4">
                  Thank you
                </h1>
                <p className="text-gray-600 text-lg">
                  You&apos;re all set. We&apos;ll be in touch when we have something worth sharing.
                </p>
              </div>
            ) : (
              <>
                <h1 className="text-3xl sm:text-4xl font-semibold text-gray-800 mb-6 text-center">
                  Stay in touch with Elevatia
                </h1>
                
                <div className="text-gray-600 text-center mb-10 space-y-3">
                  <p>
                    If you&apos;d like, you can receive occasional updates and insights from us.
                  </p>
                  <p>
                    We keep it relevant, infrequent, and always optional.
                  </p>
                  <p>
                    You&apos;re in control—unsubscribe anytime with one click.
                  </p>
                </div>

                <form 
                  onSubmit={handleSubmit} 
                  className="space-y-6"
                  noValidate
                >
                  <div>
                    <label 
                      htmlFor="email" 
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      autoComplete="email"
                      required
                      aria-required="true"
                      aria-describedby="email-hint consent-text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={status === 'submitting'}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-400 focus:border-gray-400 outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      placeholder="you@example.com"
                    />
                    {errorMessage && (
                      <p 
                        className="mt-2 text-sm text-red-600" 
                        role="alert"
                        aria-live="polite"
                      >
                        {errorMessage}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'submitting' || !email}
                    aria-busy={status === 'submitting'}
                    className="w-full px-6 py-3 text-base font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'submitting' ? 'Submitting...' : 'Stay in touch'}
                  </button>

                  <p 
                    id="consent-text" 
                    className="text-sm text-gray-500 text-center"
                  >
                    By signing up, you agree to receive occasional emails from Elevatia.
                  </p>
                </form>

                <p 
                  id="email-hint"
                  className="mt-8 text-sm text-gray-400 text-center"
                >
                  We only send emails when there&apos;s something genuinely useful to share.
                </p>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

