import type { Metadata } from 'next';
import InteractiveTree from './components/InteractiveTree';
import BrowseGifts from './components/BrowseGifts';
import { Sparkles } from 'lucide-react';

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
      <section className="relative bg-gradient-to-b from-fg-light-blue to-white py-20 px-4 overflow-hidden">
        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 opacity-20">
          <Sparkles className="w-20 h-20 text-fg-teal" />
        </div>
        <div className="absolute bottom-10 right-10 opacity-20">
          <Sparkles className="w-16 h-16 text-fg-orange" />
        </div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          {/* Event Badge */}
          <div className="inline-flex items-center gap-2 bg-white px-6 py-3 rounded-full shadow-md mb-8">
            <Sparkles className="w-5 h-5 text-fg-teal" />
            <span className="text-sm font-semibold text-fg-navy">
              Holiday Gift Drive 2025
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-fg-navy mb-6 leading-tight">
            Help Make the Holidays{' '}
            <span className="text-fg-teal">Special</span>
            <br />
            for Our Community
          </h1>

          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-8 leading-relaxed">
            Choose a gift from our interactive Christmas tree and bring holiday joy to a Foster Greatness community member. Every gift creates connection and celebrates belonging.
          </p>

          {/* Instructions */}
          <div className="inline-block bg-white px-8 py-4 rounded-xl shadow-lg border-2 border-fg-teal">
            <p className="text-lg font-semibold text-fg-navy">
              🎄 Click any ornament to learn more and purchase a gift 🎁
            </p>
          </div>
        </div>
      </section>

      {/* Interactive Tree Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <InteractiveTree />
        </div>
      </section>

      {/* Browse All Gifts Section */}
      <BrowseGifts />

      {/* Thank You Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-6">
            Thank You for Creating Belonging
          </h2>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            Your generosity helps current and former foster youth feel seen, valued, and connected during the holiday season. Every gift reminds our community members that they belong and are celebrated.
          </p>
          <p className="text-gray-600">
            Questions? Contact us at{' '}
            <a
              href="mailto:jordanb@doinggoodworks.com"
              className="text-fg-teal font-semibold hover:underline"
            >
              jordanb@doinggoodworks.com
            </a>
          </p>
        </div>
      </section>
    </main>
  );
}
