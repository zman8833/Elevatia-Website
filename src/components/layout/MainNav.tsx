'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Logo from '@/components/Logo';

export default function MainNav() {
  const pathname = usePathname();
  
  // Hide nav on partner and admin routes (they have their own layouts)
  if (pathname?.startsWith('/partners') || pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Logo />
          </div>
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/contact" 
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

