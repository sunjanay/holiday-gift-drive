'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Gift } from 'lucide-react';
import GiftCard from './GiftCard';
import GiftModal from './GiftModal';
import { GiftRecipient } from '../data/giftRecipients';
import { useGiftRecipients } from '../hooks/useGiftRecipients';

export default function BrowseGifts() {
  const { recipients, loading, usingStaticData } = useGiftRecipients();
  const [selectedRecipient, setSelectedRecipient] = useState<GiftRecipient | null>(null);

  return (
    <section
      id="browse-gifts"
      className="w-full bg-gradient-to-b from-white via-gray-50/50 to-fg-light-blue/20 py-12 md:py-16 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-fg-light-blue/50 px-3 py-1.5 rounded-full mb-4">
            <Gift className="w-3.5 h-3.5 text-fg-teal" />
            <span className="text-xs font-semibold text-fg-navy">All Community Wishes</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-fg-navy mb-3 tracking-tight">
            Browse All{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-fg-teal to-fg-accent-teal">Gift Wishes</span>
          </h2>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Prefer to see everything at once? Here&apos;s the full list of gift wishes from our community members.
          </p>
        </motion.div>

        {/* Gift Cards Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fg-teal mx-auto mb-4"></div>
            <p className="text-gray-600">Loading gifts...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipients.map((recipient, index) => (
              <GiftCard
                key={recipient.id}
                recipient={recipient}
                index={index}
                onClick={() => setSelectedRecipient(recipient)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      <GiftModal
        recipient={selectedRecipient}
        onClose={() => setSelectedRecipient(null)}
        onViewAll={() => {}}
      />
    </section>
  );
}
