import type { Metadata } from 'next';
import InteractiveTree from './gift-drive/components/InteractiveTree';
import BrowseGifts from './gift-drive/components/BrowseGifts';
import { Sparkles, Star, Heart } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Holiday Gift Drive 2025 | Foster Greatness',
  description: 'Help make the holidays special for Foster Greatness community members. Choose a gift from our interactive Christmas tree and make a direct impact.',
  openGraph: {
    title: 'Holiday Gift Drive 2025 | Foster Greatness',
    description: 'Help make the holidays special for Foster Greatness community members',
    type: 'website',
  },
};

export default function GiftDrivePage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-fg-light-blue via-white to-fg-light-blue/50 py-12 md:py-16 px-4 overflow-hidden">
        {/* Decorative Elements - Scattered for depth */}
        <div className="absolute top-8 left-8 opacity-15 animate-pulse">
          <Sparkles className="w-24 h-24 text-fg-teal" />
        </div>
        <div className="absolute top-1/4 right-12 opacity-10">
          <Star className="w-16 h-16 text-fg-orange" />
        </div>
        <div className="absolute bottom-16 left-1/4 opacity-10">
          <Heart className="w-12 h-12 text-fg-teal" />
        </div>
        <div className="absolute bottom-8 right-8 opacity-15 animate-pulse" style={{ animationDelay: '1s' }}>
          <Sparkles className="w-20 h-20 text-fg-orange" />
        </div>
        <div className="absolute top-1/2 left-6 opacity-10">
          <Star className="w-8 h-8 text-fg-accent-teal" />
        </div>

        {/* Subtle radial gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-fg-light-blue/30 pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Event Badge */}
          <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-fg-teal/20 mb-4">
            <Sparkles className="w-4 h-4 text-fg-teal" />
            <span className="text-xs font-bold tracking-wide text-fg-navy uppercase">
              Holiday Gift Drive 2025
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-fg-navy mb-4 leading-tight tracking-tight">
            Help Make the Holidays{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fg-teal to-fg-accent-teal">Special</span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl">for Our Community</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto mb-6 leading-relaxed">
            Choose a gift from our interactive Christmas tree and bring holiday joy to a Foster Greatness community member. Every gift creates <span className="font-semibold text-fg-navy">connection</span> and celebrates <span className="font-semibold text-fg-navy">belonging</span>.
          </p>

          {/* Instructions */}
          <div className="inline-block bg-white/95 backdrop-blur-sm px-6 py-3 rounded-xl shadow-lg border-2 border-fg-teal/30 hover:border-fg-teal/50 transition-colors">
            <p className="text-base font-semibold text-fg-navy">
              Click any ornament to see gift details and sponsor a community member
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tree Section */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <InteractiveTree />
        </div>
      </section>

      {/* Browse All Gifts Section */}
      <BrowseGifts />

      {/* Thank You Section */}
      <section className="relative bg-gradient-to-br from-fg-light-blue/30 via-white to-fg-light-blue/20 py-12 md:py-16 px-4 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-8 right-8 opacity-10">
          <Heart className="w-12 h-12 text-fg-teal" />
        </div>
        <div className="absolute bottom-8 left-8 opacity-10">
          <Star className="w-10 h-10 text-fg-orange" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-fg-navy mb-4 tracking-tight">
            Thank You for Creating{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fg-teal to-fg-accent-teal">Belonging</span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 mb-6 leading-relaxed max-w-3xl mx-auto">
            Your generosity helps current and former foster youth feel <span className="font-semibold text-fg-navy">seen</span>, <span className="font-semibold text-fg-navy">valued</span>, and <span className="font-semibold text-fg-navy">connected</span> during the holiday season.
          </p>
          <div className="inline-block bg-white/80 backdrop-blur-sm px-6 py-3 rounded-lg shadow-md border border-gray-100">
            <p className="text-sm text-gray-600">
              Questions? Contact us at{' '}
              <a
                href="mailto:jordanb@doinggoodworks.com"
                className="text-fg-teal font-bold hover:text-fg-navy transition-colors"
              >
                jordanb@doinggoodworks.com
              </a>
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
