'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Gift, ChevronDown, CheckCircle } from 'lucide-react';
import { GiftRecipient } from '../data/giftRecipients';
import { useEffect, useState } from 'react';
import { calculateProcessingFee } from '@/lib/stripe';

interface GiftModalProps {
  recipient: GiftRecipient | null;
  onClose: () => void;
  onViewAll: () => void;
}

export default function GiftModal({ recipient, onClose, onViewAll }: GiftModalProps) {
  const [coverFee, setCoverFee] = useState(false);
  const [shareEmail, setShareEmail] = useState(false);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (recipient) {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      window.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        window.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }
  }, [recipient, onClose]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (recipient) {
      setCoverFee(false);
      setShareEmail(false);
      setEmail('');
      setError(null);
    }
  }, [recipient]);

  const handlePurchase = async () => {
    if (!recipient) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftId: recipient.id,
          coverFee,
          donorEmail: shareEmail ? email : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.checkoutUrl;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsLoading(false);
    }
  };

  if (!recipient) return null;

  const fee = calculateProcessingFee(recipient.giftPrice);
  const total = coverFee ? recipient.giftPrice + fee : recipient.giftPrice;

  return (
    <AnimatePresence>
      {recipient && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-100"
              role="dialog"
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-fg-teal z-10"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 text-gray-700" />
              </button>

              {/* Content */}
              <div className="p-8 md:p-12">
                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 bg-fg-light-blue rounded-full">
                    <Gift className="w-6 h-6 text-fg-teal" />
                  </div>
                  <div>
                    <h2
                      id="modal-title"
                      className="text-3xl font-bold text-fg-navy"
                    >
                      {recipient.name}
                      {recipient.age && (
                        <span className="text-gray-500 text-2xl ml-2">
                          {recipient.age}
                        </span>
                      )}
                    </h2>
                  </div>
                </div>

                {/* Story */}
                <div className="mb-8">
                  <p
                    id="modal-description"
                    className="text-lg text-gray-700 leading-relaxed"
                  >
                    {recipient.story}
                  </p>
                </div>

                {/* Gift Details */}
                <div className="bg-gradient-to-br from-fg-light-blue/30 to-white rounded-2xl p-6 mb-6 border border-fg-teal/20">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-fg-navy mb-2">
                        {recipient.giftTitle}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {recipient.giftDescription}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2">
                    <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-fg-teal to-fg-accent-teal">
                      ${recipient.giftPrice}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  {recipient.purchased ? (
                    /* Already Sponsored */
                    <div className="bg-gray-100 text-gray-500 px-8 py-4 rounded-xl text-center border border-gray-200">
                      <p className="font-semibold text-lg mb-1">This gift has been sponsored</p>
                      <p className="text-sm">Please choose another gift to support our community</p>
                    </div>
                  ) : (
                    /* Available to Purchase */
                    <>
                      {/* Checkout Options */}
                      <div className="space-y-3 mb-4">
                        {/* Cover fee checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={coverFee}
                            onChange={(e) => setCoverFee(e.target.checked)}
                            className="mt-1 w-4 h-4 text-fg-teal border-gray-300 rounded focus:ring-fg-teal"
                          />
                          <span className="text-sm text-gray-700">
                            Add ${fee.toFixed(2)} to cover processing fee
                            <span className="block text-gray-500 text-xs">
                              100% of ${recipient.giftPrice} goes directly to the gift
                            </span>
                          </span>
                        </label>

                        {/* Share email checkbox */}
                        <label className="flex items-start gap-3 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={shareEmail}
                            onChange={(e) => setShareEmail(e.target.checked)}
                            className="mt-1 w-4 h-4 text-fg-teal border-gray-300 rounded focus:ring-fg-teal"
                          />
                          <span className="text-sm text-gray-700">
                            Share my email for a thank-you note
                            <span className="block text-gray-500 text-xs">
                              Optional - donate anonymously if unchecked
                            </span>
                          </span>
                        </label>

                        {/* Email input */}
                        {shareEmail && (
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-fg-teal focus:border-transparent"
                          />
                        )}
                      </div>

                      {/* Error message */}
                      {error && (
                        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg text-sm">
                          {error}
                        </div>
                      )}

                      {/* Purchase button */}
                      <button
                        onClick={handlePurchase}
                        disabled={isLoading || (shareEmail && !email)}
                        className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-fg-teal to-fg-accent-teal text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl hover:scale-[1.01] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        <CheckCircle className="w-5 h-5" />
                        <span>
                          {isLoading
                            ? 'Processing...'
                            : `Sponsor This Gift - $${total.toFixed(2)}`}
                        </span>
                      </button>
                    </>
                  )}

                  {/* Browse All Community Member Wishes */}
                  <button
                    onClick={() => {
                      onClose();
                      onViewAll();
                    }}
                    className="flex items-center justify-center gap-2 w-full bg-white text-fg-teal px-8 py-3.5 rounded-xl font-semibold border-2 border-fg-teal/30 hover:border-fg-teal hover:bg-fg-light-blue/50 transition-all duration-200"
                  >
                    <span>Browse All Community Member Wishes</span>
                    <ChevronDown className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
