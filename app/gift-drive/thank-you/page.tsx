import { CheckCircle, Gift, ArrowLeft, Share2 } from 'lucide-react';
import Link from 'next/link';

export default function ThankYouPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50 flex items-center justify-center p-4">
      <div className="max-w-lg w-full text-center">
        {/* Success Icon */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
        </div>

        {/* Header */}
        <h1 className="text-4xl font-bold text-fg-navy mb-4">
          Thank You!
        </h1>

        {/* Message */}
        <p className="text-xl text-gray-700 mb-8 leading-relaxed">
          Your generosity is making a real difference in someone&apos;s life this holiday season.
        </p>

        {/* Gift confirmation card */}
        <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8">
          <div className="flex items-center justify-center gap-2 text-fg-teal mb-3">
            <Gift className="w-5 h-5" />
            <span className="font-semibold">Gift Purchased</span>
          </div>
          <p className="text-gray-600 text-sm">
            We&apos;ll make sure this gift reaches its recipient. You&apos;re helping create moments of joy and belonging.
          </p>
        </div>

        {/* Share section */}
        <div className="mb-8">
          <p className="text-sm text-gray-500 mb-3">
            Help spread the word
          </p>
          <div className="flex items-center justify-center gap-3">
            <a
              href="https://twitter.com/intent/tweet?text=I%20just%20donated%20a%20gift%20to%20help%20foster%20youth%20this%20holiday%20season!%20%40FosterGreatness"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-700 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share
            </a>
          </div>
        </div>

        {/* Back to gifts */}
        <Link
          href="/gift-drive"
          className="inline-flex items-center gap-2 px-6 py-3 bg-fg-teal text-white rounded-lg font-semibold hover:bg-opacity-90 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          View More Gifts
        </Link>
      </div>
    </main>
  );
}
