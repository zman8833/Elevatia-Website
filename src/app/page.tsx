'use client';

import { useState } from 'react';
import Image from 'next/image';
// import BackgroundDesign from '@/components/BackgroundDesign';

export default function Home() {
  const [showPopup, setShowPopup] = useState(false);
  // Favicon update - v3

  return (
    <div
      className="min-h-screen relative"
      style={{
        background: "#FDFAF6 url('data:image/svg+xml;utf8,%3Csvg%20width%3D%221440%22%20height%3D%22900%22%20viewBox%3D%220%200%201440%20900%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20opacity%3D%220.7%22%3E%3Cpath%20d%3D%22M0%2C250%20Q360%2C150%20720%2C250%20T1440%2C250%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C240%20Q360%2C140%20720%2C260%20T1440%2C240%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C230%20Q360%2C130%20720%2C270%20T1440%2C230%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C220%20Q360%2C120%20720%2C280%20T1440%2C220%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C210%20Q360%2C110%20720%2C290%20T1440%2C210%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C200%20Q360%2C100%20720%2C300%20T1440%2C200%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C190%20Q360%2C90%20720%2C310%20T1440%2C190%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C180%20Q360%2C80%20720%2C320%20T1440%2C180%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C170%20Q360%2C70%20720%2C330%20T1440%2C170%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3Cpath%20d%3D%22M0%2C160%20Q360%2C60%20720%2C340%20T1440%2C160%22%20stroke%3D%22%23CD7F32%22%20stroke-width%3D%221%22/%3E%3C/g%3E%3C/svg%3E') no-repeat center top",
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
    >
      {/* <BackgroundDesign /> */}
      
      {/* Hero Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-8 gradient-text">
              Your AI-Powered Wellness Companion
            </h1>
            <p className="text-xl text-gray-600 mb-12 leading-relaxed">
              Elevatia helps you track and improve various aspects of your life through structured paths. 
              Using AI and gamification, we provide personalized guidance to help you achieve your wellness goals.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowPopup(true)}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors backdrop-blur-sm"
              >
                Download for iOS
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-7xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-16 gradient-text">
              Experience Elevatia
            </h2>
            <div className="flex justify-center">
              <div className="w-full max-w-6xl">
                <Image 
                  src="/app-preview.png" 
                  alt="Elevatia App Preview - Multiple screens showing wellness tracking features" 
                  width={1400}
                  height={900}
                  className="w-full h-auto object-contain rounded-2xl shadow-2xl"
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
          <h2 className="text-3xl font-bold text-center mb-16 gradient-text">
            Core Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="card backdrop-blur-sm bg-white/50">
              <h3 className="text-xl font-semibold mb-4">Path Assist System</h3>
              <p className="text-gray-600">Track nutrition, fitness, mental wellness, and sleep through personalized paths.</p>
            </div>
            <div className="card backdrop-blur-sm bg-white/50">
              <h3 className="text-xl font-semibold mb-4">Progress Tracking</h3>
              <p className="text-gray-600">Monitor your journey with weekly tracking, streaks, and achievement milestones.</p>
            </div>
            <div className="card backdrop-blur-sm bg-white/50">
              <h3 className="text-xl font-semibold mb-4">Personalization</h3>
              <p className="text-gray-600">Get tailored guidance based on your goals and adaptive difficulty levels.</p>
            </div>
            <div className="card backdrop-blur-sm bg-white/50">
              <h3 className="text-xl font-semibold mb-4">Social Features</h3>
              <p className="text-gray-600">Connect with friends, share progress, and stay motivated together.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8 gradient-text">
              Start Your Wellness Journey Today
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Join thousands of users who are already improving their lives with Elevatia.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => setShowPopup(true)}
                className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors backdrop-blur-sm"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white/90 p-8 rounded-lg max-w-md mx-4 backdrop-blur-sm">
            <h3 className="text-2xl font-semibold mb-4 gradient-text">Coming Soon!</h3>
            <p className="text-gray-600 mb-6">
              We&apos;re working hard to bring Elevatia to iOS. Stay tuned for updates!
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="w-full inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900/95 text-gray-300 py-12 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Elevatia, Co.</h3>
              <p className="text-sm">
                Your AI-Powered Wellness Companion
              </p>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="/privacy" className="hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-sm font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm text-center">
            <p>&copy; {new Date().getFullYear()} Elevatia, Co. All rights reserved.</p>
            <div className="mt-4 flex justify-center">
              <svg width="18" height="28" viewBox="0 0 18 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="7" y="0" width="4" height="20" fill="white"/>
                <rect x="0" y="8" width="18" height="4" fill="white"/>
                <rect x="7" y="20" width="4" height="8" fill="white"/>
              </svg>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
