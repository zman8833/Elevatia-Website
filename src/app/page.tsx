'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useScrollAnimation, useStaggeredAnimation } from '@/hooks/useScrollAnimation';

export default function Home() {
  const heroAnimation = useScrollAnimation({ threshold: 0.1 });
  const processStep1Animation = useScrollAnimation({ threshold: 0.2 });
  const processStep2Animation = useScrollAnimation({ threshold: 0.2 });
  const processStep3Animation = useScrollAnimation({ threshold: 0.2 });
  const featuresAnimation = useStaggeredAnimation(4, { threshold: 0.2 });
  const statsAnimation = useStaggeredAnimation(4, { threshold: 0.2 });
  const ctaAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen relative bg-[#FDFAF6] overflow-hidden pt-16">
      
      {/* Enhanced Hero Section */}
      <section className="section-padding-large relative">
        <div className="container">
          <div 
            ref={heroAnimation.ref}
            className={`max-w-6xl mx-auto text-center scroll-reveal ${heroAnimation.isVisible ? 'visible' : ''}`}
          >
            <h1 className="hero-title mb-8 gradient-text-enhanced">
              Transform Your Wellness Journey with 
              <span className="block gradient-text-accent">
                Fully Personalized Guidance
              </span>
            </h1>
            <p className="section-subtitle max-w-4xl mx-auto mb-12">
              Elevatia helps you build lasting wellness habits through structured paths, 
              community fun, and personalized insights that adapt to your unique lifestyle.
            </p>
            <div className="flex flex-col items-center space-y-8">
              <a 
                href="https://apps.apple.com/us/app/elevatia/id6747624957"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block interactive-lift interactive-glow"
              >
                <Image
                  src="/app-store-badge-official.svg"
                  alt="Download on the App Store"
                  width={180}
                  height={60}
                  className="h-14 w-auto drop-shadow-lg"
                  priority
                />
              </a>
              
              {/* iPhone with Real App Screenshot */}
              <div className="relative">
                <Image 
                  src="/Group 2.png"
                  alt="Elevatia App Dashboard"
                  width={10000}
                  height={20000}
                  className="rounded-3xl interactive-lift max-w-4xl mx-auto w-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision Statement Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="section-title mb-8 gradient-text-enhanced">
              Your Wellness Journey, Simplified
            </h2>
            <p className="body-large text-gray-600 mb-12">
              We believe wellness shouldn&apos;t be overwhelming. That&apos;s why Elevatia transforms complex health goals 
              into clear, actionable steps that fit seamlessly into your daily routine.
            </p>
          </div>
        </div>
      </section>

      {/* 3-Step Process Section */}
      <section className="section-padding relative bg-gradient-to-br from-gray-50/50 to-white/50">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title mb-6 gradient-text-enhanced">
                How Elevatia Works
              </h2>
              <p className="section-subtitle text-gray-600">
                Three simple steps to transform your wellness journey
              </p>
            </div>
            
            <div className="space-y-24">
              {[
                {
                  step: "Step 1",
                  title: "Download & Set Your Goals",
                  description: "Choose from our curated wellness paths or create custom goals tailored to your lifestyle. Whether it's fitness, nutrition, mindfulness, or sleep - we've got you covered.",
                  image: "/Model=Silver.png",
                  alt: "Elevatia goal setting interface"
                },
                {
                  step: "Step 2", 
                  title: "Track Your Progress Daily",
                  description: "Log your activities with our intuitive interface. Our AI analyzes your patterns, celebrates your wins, and provides personalized insights to keep you motivated.",
                  image: "/Model=Gold.png",
                  alt: "Elevatia progress tracking dashboard"
                },
                {
                  step: "Step 3",
                  title: "Achieve & Compete",
                  description: "Reach your milestones, earn achievements, and compete with friends in our Crucible feature. Turn your wellness journey into an engaging, social experience.",
                  image: "/Model=Deep Purple.png",
                  alt: "Elevatia achievements and social features"
                }
              ].map((item, index) => {
                const animations = [processStep1Animation, processStep2Animation, processStep3Animation];
                const stepAnimation = animations[index];
                
                return (
                  <div 
                    key={item.step} 
                    ref={stepAnimation.ref}
                    className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}
                  >
                    <div className={`${index % 2 === 1 ? 'lg:col-start-2' : ''} ${stepAnimation.isVisible ? 'fade-in-up visible' : 'fade-in-up'}`}>
                      <div className="text-sm font-semibold text-orange-600 mb-2 tracking-wide uppercase">
                        {item.step}
                      </div>
                      <h3 className="text-3xl sm:text-4xl font-bold mb-6 gradient-text-enhanced">
                        {item.title}
                      </h3>
                      <p className="body-large text-gray-600 leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className={`${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''} ${stepAnimation.isVisible ? 'scale-in visible' : 'scale-in'}`}>
                      <div className="flex justify-center">
                        <div className="relative">
                          <Image 
                            src={item.image}
                            alt={item.alt}
                            width={300}
                            height={600}
                            className="rounded-3xl shadow-2xl interactive-lift"
                          />
                          <div className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title mb-6 gradient-text-enhanced">
                Why Choose Elevatia?
              </h2>
              <p className="section-subtitle text-gray-600">
                Powerful features designed to make wellness achievable for everyone
              </p>
            </div>
            <div 
              ref={featuresAnimation.ref}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8"
            >
              {[
                {
                  title: "Coach Chat",
                  description: "Get personalized recommendations and insights powered by advanced AI to help you make better wellness decisions every day.",
              
                },
                {
                  title: "Structured Paths",
                  description: "Follow carefully designed wellness paths that guide you step-by-step toward your health and lifestyle goals with proven methodologies.",
                
                },
                {
                  title: "Progress Tracking",
                  description: "Monitor your journey with detailed analytics, celebrate achievements, and stay motivated with our comprehensive gamification system.",
                 
                },
                {
                  title: "Crucible",
                  description: "Compete with friends, share progress, and build accountability partnerships that keep you motivated and engaged.",
                 
                }
              ].map((feature, index) => (
                <div 
                  key={feature.title}
                  className={`card-enhanced ${featuresAnimation.visibleItems[index] ? 'fade-in-up visible' : 'fade-in-up'}`}
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  <h3 className="text-2xl font-bold mb-4 gradient-text-enhanced text-center">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-center">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats Section */}
      <section className="section-padding relative bg-gradient-to-br from-orange-50/30 to-yellow-50/30">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title mb-6 gradient-text-enhanced">
                Join Thousands on Their Wellness Journey
              </h2>
              <p className="section-subtitle text-gray-600">
                Real results from real people using Elevatia every day
              </p>
            </div>
            
            <div 
              ref={statsAnimation.ref}
              className="grid grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                {
                  number: "100+",
                  label: "Active Users",
                  description: "Building better habits daily"
                },
                {
                  number: "2K+",
                  label: "Goals Achieved",
                  description: "Milestones reached and celebrated"
                },
                {
                  number: "95%",
                  label: "Success Rate",
                  description: "Users who stick with their goals"
                },
                {
                  number: "5★",
                  label: "App Store Rating",
                  description: "Loved by our community"
                }
              ].map((stat, index) => (
                <div 
                  key={stat.label}
                  className={`stat-card ${statsAnimation.visibleItems[index] ? 'scale-in visible' : 'scale-in'}`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="text-4xl sm:text-5xl font-bold mb-2 gradient-text-accent">
                    {stat.number}
                  </div>
                  <div className="text-lg font-semibold text-gray-800 mb-2">
                    {stat.label}
                  </div>
                  <div className="text-sm text-gray-600">
                    {stat.description}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section - Hidden for now */}
      {/* 
      <section className="section-padding relative">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="section-title mb-6 gradient-text-enhanced">
                What Our Users Say
              </h2>
              <p className="section-subtitle text-gray-600">
                Real stories from people who transformed their lives with Elevatia
              </p>
            </div>
            
            <div 
              ref={testimonialsAnimation.ref}
              className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
              {[
                {
                  quote: "Elevatia completely changed how I approach wellness. The AI guidance feels like having a personal coach who actually understands my lifestyle and challenges.",
                  name: "Sarah Chen",
                  role: "Marketing Manager",
                  initials: "SC",
                  achievement: "Lost 25 lbs in 4 months"
                },
                {
                  quote: "The structured paths made it so much easier to build consistent habits. I've never stuck to a wellness routine this long before - 8 months and counting!",
                  name: "Marcus Johnson",
                  role: "Software Developer", 
                  initials: "MJ",
                  achievement: "Completed 3 wellness paths"
                },
                {
                  quote: "The social features keep me motivated. Competing with friends in the Crucible turned my fitness journey into something I actually look forward to every day.",
                  name: "Emma Rodriguez",
                  role: "Teacher",
                  initials: "ER", 
                  achievement: "Top 5% in community challenges"
                }
              ].map((testimonial, index) => (
                <div 
                  key={testimonial.name}
                  className={`testimonial-card ${testimonialsAnimation.visibleItems[index] ? 'fade-in-up visible' : 'fade-in-up'}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  <div className="mb-6">
                    <div className="text-gray-400 text-2xl mb-2">&ldquo;</div>
                    <p className="text-gray-700 leading-relaxed italic">
                      {testimonial.quote}
                    </p>
                    <div className="text-gray-400 text-2xl text-right">&rdquo;</div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="profile-placeholder">
                      {testimonial.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800">{testimonial.name}</div>
                      <div className="text-sm text-gray-600">{testimonial.role}</div>
                      <div className="text-xs text-orange-600 font-medium mt-1">
                        {testimonial.achievement}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      */}

      {/* Enhanced CTA Section */}
      <section className="section-padding-large relative bg-gradient-to-br from-orange-600 to-yellow-600 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="container relative">
          <div 
            ref={ctaAnimation.ref}
            className={`max-w-4xl mx-auto text-center ${ctaAnimation.isVisible ? 'scroll-reveal visible' : 'scroll-reveal'}`}
          >
            <h2 className="hero-title mb-8 text-white">
              Ready to Transform Your 
              <span className="block text-yellow-300">
                Wellness Journey?
              </span>
            </h2>
            <p className="section-subtitle text-orange-100 mb-12 max-w-3xl mx-auto">
              Join over 100 users who have already discovered the power of personalized wellness guidance. 
              Your healthiest, happiest self is just one download away.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <a 
                href="https://apps.apple.com/us/app/elevatia/id6747624957"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block interactive-lift interactive-glow bg-white/10 backdrop-blur-sm rounded-2xl p-4"
              >
                <Image
                  src="/app-store-badge-official.svg"
                  alt="Download on the App Store"
                  width={200}
                  height={67}
                  className="h-16 w-auto"
                />
              </a>
              <div className="text-center sm:text-left">
                <div className="text-yellow-300 font-semibold mb-1">Free to start</div>
                <div className="text-orange-100 text-sm">Premium features available</div>
              </div>
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/20">
              <p className="text-orange-200 text-sm">
                Your data is secure and private • Available on iOS • 5/5 App Store rating
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-50 py-8 sm:py-12">
        <div className="container">
          <div className="max-w-6xl mx-auto text-center">
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
              <Link href="/partners" className="text-gray-600 hover:text-gray-900 transition-colors">
                Partners
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
