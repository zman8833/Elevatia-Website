'use client';

import { useState } from 'react';

export default function JoinPage() {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <div className="min-h-screen">
      <section className="section-padding">
        <div className="container">
          <h1 className="text-5xl md:text-6xl font-bold text-center mb-12 gradient-text">
            Join Elevatia
          </h1>

          <div className="max-w-3xl mx-auto">
            <div className="card mb-8">
              <h2 className="text-2xl font-semibold mb-6 gradient-text">Why Join Elevatia?</h2>
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2">•</span>
                  <span>Access to personalized wellness paths and tracking tools</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2">•</span>
                  <span>AI-powered guidance and recommendations</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2">•</span>
                  <span>Progress tracking and achievement milestones</span>
                </li>
                <li className="flex items-start">
                  <span className="text-gray-900 mr-2">•</span>
                  <span>Regular updates and new features based on user feedback</span>
                </li>
              </ul>
            </div>

            <div className="card">
              <h2 className="text-2xl font-semibold mb-6 gradient-text">Get Started</h2>
              <p className="text-gray-600 mb-6">
                Ready to elevate your wellness journey? Download our app and join the community today.
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => setShowPopup(true)}
                  className="inline-flex items-center justify-center px-8 py-3 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
                >
                  Download for iOS
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coming Soon Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg max-w-md mx-4">
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
    </div>
  );
} 