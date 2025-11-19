'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift, ShoppingCart } from 'lucide-react';
import { GiftRecipient } from '../data/giftRecipients';

interface GiftCardProps {
  recipient: GiftRecipient;
  index: number;
  onClick?: () => void;
}

export default function GiftCard({ recipient, index, onClick }: GiftCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click from triggering
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
      onClick={onClick}
      className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-fg-teal/30 flex flex-col h-full cursor-pointer"
    >
      {/* Card Header */}
      <div className="p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-fg-light-blue rounded-lg group-hover:bg-fg-teal/10 transition-colors">
              <Gift className="w-4 h-4 text-fg-teal" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-fg-navy group-hover:text-fg-teal transition-colors">
                {recipient.name}
                {recipient.age && (
                  <span className="text-gray-500 text-sm ml-1.5 font-normal">
                    {recipient.age}
                  </span>
                )}
              </h3>
            </div>
          </div>
          <div className="bg-gradient-to-r from-fg-teal to-fg-accent-teal text-white px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap shadow-sm">
            ${recipient.giftPrice}
          </div>
        </div>

        {/* Story */}
        <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
          {recipient.story}
        </p>

        {/* Gift Info */}
        <div className="bg-gradient-to-br from-gray-50 to-fg-light-blue/20 rounded-lg p-3 mb-3 border border-gray-100">
          <h4 className="font-bold text-fg-navy text-sm mb-0.5">
            {recipient.giftTitle}
          </h4>
          <p className="text-xs text-gray-600 line-clamp-2">
            {recipient.giftDescription}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-4 pt-0 mt-auto">
        {recipient.purchased ? (
          <div className="bg-gray-100 text-gray-500 px-4 py-2.5 rounded-lg text-center border border-gray-200">
            <span className="font-semibold text-sm">Already Sponsored</span>
          </div>
        ) : (
          <button
            onClick={handlePurchase}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-fg-teal to-fg-accent-teal text-white px-4 py-2.5 rounded-lg font-bold text-sm hover:shadow-lg hover:scale-[1.02] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>{isLoading ? 'Processing...' : `Sponsor Gift - $${recipient.giftPrice}`}</span>
          </button>
        )}
      </div>
    </motion.div>
  );
}
