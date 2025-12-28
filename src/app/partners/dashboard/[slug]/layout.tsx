'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AuthProvider, useAuth } from '@/lib/auth-context';

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const { user, organization, partnerAdmin, loading, signOut, isSuperAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/partners/login');
        return;
      }
      
      // Verify user has access to this org
      if (organization && organization.slug !== slug && !isSuperAdmin) {
        router.push(`/partners/dashboard/${organization.slug}`);
      }
    }
  }, [user, organization, loading, slug, router, isSuperAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDFAF6]">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!user || (!organization && !isSuperAdmin)) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push('/partners/login');
  };

  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-6">
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
              
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-gray-400">/</span>
                <Link href="/partners" className="text-gray-600 hover:text-orange-600 transition-colors">
                  Partners
                </Link>
                <span className="text-gray-400">/</span>
                <span className="font-medium text-gray-900">{organization?.name || 'Admin'}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {isSuperAdmin && (
                <Link 
                  href="/admin/partners"
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                >
                  Super Admin
                </Link>
              )}
              
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-2 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-200 to-yellow-200 rounded-full flex items-center justify-center text-orange-700 font-semibold text-sm">
                    {(partnerAdmin?.displayName || partnerAdmin?.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showUserMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-10" 
                      onClick={() => setShowUserMenu(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-20">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {partnerAdmin?.displayName || partnerAdmin?.email}
                        </p>
                        <p className="text-xs text-gray-500 capitalize">{partnerAdmin?.role}</p>
                      </div>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Organization Status Banner */}
      {organization?.status === 'suspended' && (
        <div className="bg-red-500 text-white text-center py-2 text-sm">
          Your organization is suspended. Please contact support.
        </div>
      )}
      {organization?.status === 'pending' && (
        <div className="bg-yellow-500 text-white text-center py-2 text-sm">
          Your organization is pending approval.
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </AuthProvider>
  );
}

