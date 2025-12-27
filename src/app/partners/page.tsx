import Link from 'next/link';
import Image from 'next/image';

export const metadata = {
  title: 'Partner with Elevatia',
  description: 'Join the Elevatia partner program and provide your community with personalized wellness tools.',
};

export default function PartnersPage() {
  return (
    <div className="min-h-screen bg-[#FDFAF6]">
      {/* Header */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
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
              href="/partners/login" 
              className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-full hover:bg-gray-800 transition-colors"
            >
              Partner Login
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-8">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              B2B Wellness Partnership Program
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-8">
              <span className="gradient-text-enhanced">Empower Your</span>
              <br />
              <span className="gradient-text-accent">Community&apos;s Wellness</span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-600 leading-relaxed mb-12 max-w-3xl mx-auto">
              Partner with Elevatia to provide your employees, members, or customers with 
              personalized wellness tools, structured paths, and AI-powered guidance.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="mailto:zackh@getelevatia.com?subject=Partnership%20Inquiry"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl text-lg"
              >
                Become a Partner
              </a>
              <Link 
                href="/partners/login"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all border border-gray-200 text-lg"
              >
                Existing Partners Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50/50 to-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text-enhanced">
              Why Partner With Us?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join leading organizations who trust Elevatia to support their wellness initiatives
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Custom Access Codes',
                description: 'Generate unique codes for your members with custom durations and usage limits. Track redemptions in real-time.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                ),
              },
              {
                title: 'Exclusive Wellness Paths',
                description: "Create custom wellness journeys tailored to your community's needs. From fitness to mindfulness.",
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                ),
              },
              {
                title: 'Analytics Dashboard',
                description: 'Track engagement, monitor user progress, and measure the impact of your wellness program.',
                icon: (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                ),
              },
            ].map((benefit, index) => (
              <div 
                key={benefit.title}
                className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text-enhanced">
              How It Works
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {[
                {
                  step: '01',
                  title: 'Reach Out',
                  description: "Email our partnerships team to discuss your organization's wellness goals and needs.",
                },
                {
                  step: '02',
                  title: 'Get Set Up',
                  description: "We'll create your organization profile, set your tier, and give you dashboard access.",
                },
                {
                  step: '03',
                  title: 'Generate Codes',
                  description: 'Create access codes for your members through your partner dashboard.',
                },
                {
                  step: '04',
                  title: 'Track & Grow',
                  description: 'Monitor engagement, create exclusive paths, and expand your wellness program.',
                },
              ].map((item, index) => (
                <div key={item.step} className="flex gap-6 items-start">
                  <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-orange-500 to-yellow-500 rounded-2xl flex items-center justify-center text-white font-bold text-xl">
                    {item.step}
                  </div>
                  <div className="pt-2">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tiers Section */}
      <section className="py-20 bg-gradient-to-br from-orange-50/30 to-yellow-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text-enhanced">
              Partnership Tiers
            </h2>
            <p className="text-xl text-gray-600">
              Flexible options for organizations of all sizes
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              {
                name: 'Starter',
                description: 'Perfect for small teams and pilot programs',
                features: ['Up to 50 active users', 'Basic analytics', 'Email support'],
              },
              {
                name: 'Growth',
                description: 'For growing organizations with active wellness programs',
                features: ['Up to 500 active users', 'Advanced analytics', 'Custom paths', 'Partner branding in-app', 'Priority support'],
                highlighted: true,
              },
              {
                name: 'Enterprise',
                description: 'Full-featured solution for large organizations',
                features: ['Unlimited users', 'Partner branding in-app', 'API access', 'Dedicated account manager'],
              },
            ].map((tier) => (
              <div 
                key={tier.name}
                className={`p-8 rounded-2xl border ${
                  tier.highlighted 
                    ? 'bg-gradient-to-br from-orange-500 to-yellow-500 text-white border-transparent shadow-xl scale-105' 
                    : 'bg-white border-gray-100'
                }`}
              >
                <h3 className={`text-2xl font-bold mb-2 ${tier.highlighted ? 'text-white' : 'text-gray-900'}`}>
                  {tier.name}
                </h3>
                <p className={`mb-6 ${tier.highlighted ? 'text-orange-100' : 'text-gray-600'}`}>
                  {tier.description}
                </p>
                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <svg className={`w-5 h-5 ${tier.highlighted ? 'text-yellow-300' : 'text-green-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className={tier.highlighted ? 'text-white' : 'text-gray-700'}>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 gradient-text-enhanced">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Contact our partnerships team to discuss how Elevatia can support your wellness initiatives.
          </p>
          <a 
            href="mailto:zackh@getelevatia.com?subject=Partnership%20Inquiry"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-semibold rounded-xl hover:from-orange-600 hover:to-yellow-600 transition-all shadow-lg hover:shadow-xl text-lg"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            zackh@getelevatia.com
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-600 mb-4">
            © 2025 Elevatia, Co. All rights reserved.
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
      </footer>
    </div>
  );
}

