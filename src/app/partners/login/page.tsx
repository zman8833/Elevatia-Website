'use client';

export const dynamic = 'force-dynamic';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthProvider, useAuth } from '@/lib/auth-context';
import LoginForm from '@/components/partners/LoginForm';

function LoginContent() {
  const { user, organization, loading, isSuperAdmin } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      if (isSuperAdmin) {
        router.push('/admin/partners');
      } else if (organization) {
        router.push(`/partners/dashboard/${organization.slug}`);
      }
    }
  }, [user, organization, loading, isSuperAdmin, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF6]">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFAF6] flex flex-col">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center space-x-2">
              <Image 
                src="/elevatia-logo.png" 
                alt="Elevatia Logo" 
                width={32}
                height={32}
                className="h-8 w-auto"
              />
              <span className="text-xl font-semibold gradient-text">Elevatia</span>
            </Link>
            <Link 
              href="/partners" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              ← Back to Partners
            </Link>
          </div>
        </div>
      </nav>

      {/* Login Form */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Partner Dashboard</h1>
              <p className="text-gray-600 mt-2">Sign in to manage your Elevatia partnership</p>
            </div>
            
            <LoginForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Not a partner yet?{' '}
                <Link href="/partners" className="text-orange-600 hover:text-orange-700 font-medium">
                  Learn more
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PartnersLoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}

