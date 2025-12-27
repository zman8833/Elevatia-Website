import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import MainNav from "@/components/layout/MainNav";

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
        <MainNav />
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
