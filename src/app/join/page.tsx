import Image from 'next/image';

export default function JoinPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF6] py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 gradient-text">
            Join the Elevatia Community
          </h1>
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            Ready to transform your wellness journey? Download Elevatia today and start your path to better health, 
            mindfulness, and personal growth.
          </p>
          
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 gradient-text">Track Your Progress</h3>
                <p className="text-gray-600">
                  Monitor your wellness journey with detailed analytics and celebrate your achievements.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 gradient-text">AI-Powered Insights</h3>
                <p className="text-gray-600">
                  Get personalized recommendations powered by advanced AI to optimize your wellness routine.
                </p>
              </div>
              <div className="card">
                <h3 className="text-xl font-semibold mb-4 gradient-text">Community Support</h3>
                <p className="text-gray-600">
                  Connect with like-minded individuals and share your progress in our supportive community.
                </p>
              </div>
            </div>
            
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
          
          <div className="text-center">
            <p className="text-gray-500 text-sm">
              Available on iOS. Coming soon to Android.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 