'use client';

import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2">
      <Image 
        src="/elevatia-logo.png" 
        alt="Elevatia Logo" 
        width={32}
        height={32}
        className="h-8 w-auto"
        priority
      />
      <span className="text-xl font-semibold gradient-text">Elevatia</span>
    </Link>
  );
} 