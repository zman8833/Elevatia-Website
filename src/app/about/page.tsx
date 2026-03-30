'use client';

import Image from 'next/image';
import { useScrollAnimation } from '@/hooks/useScrollAnimation';

export default function AboutPage() {
  const storyAnimation = useScrollAnimation({ threshold: 0.1 });
  const founderAnimation = useScrollAnimation({ threshold: 0.2 });

  return (
    <div className="min-h-screen relative bg-[#FDFAF6] overflow-hidden pt-16">

      {/* Hero */}
      <section className="section-padding-large relative">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="hero-title mb-8 gradient-text-enhanced">
              About Elevatia
            </h1>
            <p className="section-subtitle text-gray-600 max-w-3xl mx-auto">
              We&apos;re building the future of wellness, powered by highly tailored insights,
              guided by science, demographic knowledge, and designed for real life.
            </p>
          </div>
        </div>
      </section>

      {/* Origin Story */}
      <section className="section-padding relative bg-gradient-to-br from-gray-50/50 to-white/50">
        <div className="container">
          <div
            ref={storyAnimation.ref}
            className={`max-w-3xl mx-auto ${storyAnimation.isVisible ? 'scroll-reveal visible' : 'scroll-reveal'}`}
          >
            <h2 className="section-title mb-8 gradient-text-enhanced text-center">
              Our Story
            </h2>
            <div className="space-y-6 text-gray-600 body-large leading-relaxed">
              <p>
                Elevatia started with a simple observation: the wellness industry is full of
                information, but short on guidance. There are countless apps that track your steps,
                log your meals, or monitor your sleep, but very few that actually help you figure
                out what to do next.
              </p>
              <p>
                As someone who experienced this firsthand, I kept running into the same problem.
                I had the data, the motivation, the abilities, and the goals, but no clear path
                connecting them. Every wellness journey felt like starting from scratch, piecing
                together advice from different sources and hoping it all fit together.
              </p>
              <p>
                That&apos;s why I built Elevatia. Not just another tracking app, but a true wellness
                companion, one that combines consistency coaching with structured paths, community
                accountability, and personalized insights that actually adapt to how you live. The goal
                was always to make real, lasting wellness progress feel achievable for everyone, not just
                people who can afford a personal trainer or nutritionist.
              </p>
              <p>
                Today, Elevatia helps users set meaningful goals, follow proven wellness paths,
                and stay motivated through features like Coach Chat and Crucible. We&apos;re just
                getting started, but the mission has never changed: make wellness simpler, smarter,
                and more personal.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder / Leadership */}
      <section className="section-padding relative">
        <div className="container">
          <div
            ref={founderAnimation.ref}
            className={`max-w-3xl mx-auto text-center ${founderAnimation.isVisible ? 'scroll-reveal visible' : 'scroll-reveal'}`}
          >
            <h2 className="section-title mb-8 gradient-text-enhanced">
              Leadership
            </h2>
            <div className="card-enhanced">
              <div className="w-28 h-28 rounded-full mx-auto mb-6 overflow-hidden">
                <Image
                  src="/zackh-francois.png"
                  alt="Zackhary Francois"
                  width={112}
                  height={112}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold mb-2 gradient-text-enhanced">
                Zackhary Francois
              </h3>
              <p className="text-orange-600 font-semibold mb-4">Founder & CEO</p>
              <p className="text-gray-600 leading-relaxed max-w-xl mx-auto">
                Zackh founded Elevatia with the belief that world-class wellness guidance
                shouldn&apos;t be a luxury. With a background in Neuroscience and a passion for health
                optimization, he set out to build the platform he wished existed - lasting wellness
                habits accessible to everyone.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
