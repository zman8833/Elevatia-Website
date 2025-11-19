import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Logo from "@/components/Logo";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "Elevatia - Your AI-Powered Wellness Companion",
    template: "%s | Elevatia"
  },
  description: "Elevatia helps you track and improve various aspects of your life through structured paths. Using AI and gamification, we provide personalized guidance to help you achieve your wellness goals.",
  icons: {
    icon: [
      { url: '/favicon.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' }
    ],
    apple: '/apple-icon.png',
  },
  manifest: '/site.webmanifest',
  metadataBase: new URL('https://getelevatia.com'),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Logo />
              </div>
              <div className="hidden md:flex items-center space-x-8">
                <Link href="/about" className="nav-link">About Us</Link>
                <Link href="/join" className="nav-link">Join</Link>
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
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
