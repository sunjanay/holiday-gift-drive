'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, ShoppingCart } from 'lucide-react';
import { GiftRecipient } from '../data/giftRecipients';

interface GiftCardProps {
  recipient: GiftRecipient;
  index: number;
}

export default function GiftCard({ recipient, index }: GiftCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          giftId: recipient.id,
          coverFee: false,
          donorEmail: null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      window.location.href = data.checkoutUrl;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout. Please try again.');
      setIsLoading(false);
    }
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col h-full"
    >
      {/* Card Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-fg-light-blue rounded-lg">
              <Gift className="w-5 h-5 text-fg-teal" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-fg-navy">
                {recipient.name}
                {recipient.age && (
                  <span className="text-gray-500 text-base ml-2">
                    {recipient.age}
                  </span>
                )}
              </h3>
            </div>
          </div>
          <div className="bg-fg-teal text-white px-3 py-1 rounded-full text-sm font-bold whitespace-nowrap">
            ${recipient.giftPrice}
          </div>
        </div>

        {/* Story */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-4">
          {recipient.story}
        </p>

        {/* Gift Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-bold text-fg-navy mb-1">
            {recipient.giftTitle}
          </h4>
          <p className="text-sm text-gray-600 line-clamp-2">
            {recipient.giftDescription}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 pt-0 mt-auto">
        {recipient.purchased ? (
          <div className="bg-gray-100 text-gray-600 px-6 py-3 rounded-lg text-center border-2 border-gray-200">
            <span className="font-semibold">Already Purchased</span>
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full bg-fg-teal text-white px-6 py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>{isLoading ? 'Processing...' : `Purchase Gift - $${recipient.giftPrice}`}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
