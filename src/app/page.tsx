'use client';

import Image from 'next/image';
// import BackgroundDesign from '@/components/BackgroundDesign';
import Link from 'next/link';

export default function Home() {
  // Favicon update - v3

  return (
    <div className="min-h-screen relative bg-[#FDFAF6]">
      {/* <BackgroundDesign /> */}
      
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 sm:mb-8 gradient-text">
              Your AI-Powered Wellness Companion
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed max-w-3xl mx-auto">
              Elevatia helps you track and improve various aspects of your life through structured paths. 
              Using AI and gamification, we provide personalized guidance to help you achieve your wellness goals.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://apps.apple.com/us/app/elevatia/id6747624957"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:scale-105 transition-transform duration-200 hover:opacity-90"
              >
                <Image
                  src="/app-store-badge-official.svg"
                  alt="Download on the App Store"
                  width={160}
                  height={53}
                  className="h-12 w-auto"
                  priority
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-8 sm:py-12 relative">
        <div className="container">
          <div className="max-w-6xl mx-auto text-center">
            <div className="flex justify-center">
              <div className="w-full max-w-5xl">
                <Image 
                  src="/app-preview.png" 
                  alt="Elevatia App Preview" 
                  width={1200} 
                  height={800}
                  className="w-full h-auto rounded-2xl shadow-2xl"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 sm:mb-16 gradient-text">
              Why Choose Elevatia?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 lg:gap-8">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 gradient-text">AI-Powered Guidance</h3>
                <p className="text-gray-600 leading-relaxed">
                  Get personalized recommendations and insights powered by advanced AI to help you make better wellness decisions.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 gradient-text">Structured Paths</h3>
                <p className="text-gray-600 leading-relaxed">
                  Follow carefully designed wellness paths that guide you step-by-step toward your health and lifestyle goals.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 gradient-text">Progress Tracking</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monitor your journey with detailed analytics and celebrate your achievements with our gamification features.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 gradient-text">Crucible</h3>
                <p className="text-gray-600 leading-relaxed">
                  Compete with friends, share progress, and stay motivated together.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6 sm:mb-8 gradient-text">
              Start Your Wellness Journey Today
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 mb-8 sm:mb-12 leading-relaxed">
              Join thousands of users who are already improving their lives with Elevatia.
            </p>
            <div className="flex justify-center">
              <a 
                href="https://apps.apple.com/us/app/elevatia/id6747624957"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block hover:scale-105 transition-transform duration-200 hover:opacity-90"
              >
                <Image
                  src="/app-store-badge-official.svg"
                  alt="Download on the App Store"
                  width={160}
                  height={53}
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 sm:py-12">
        <div className="container">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-gray-600 mb-4">
              © 2024 Elevatia. All rights reserved.
            </p>
            <div className="flex justify-center space-x-6">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </Link>
              <Link href="/contact" className="text-gray-600 hover:text-gray-900 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
