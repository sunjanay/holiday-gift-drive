'use client';

import { motion } from 'framer-motion';
import GiftCard from './GiftCard';
import { useGiftRecipients } from '../hooks/useGiftRecipients';

export default function BrowseGifts() {
  const { recipients, loading, usingStaticData } = useGiftRecipients();

  return (
    <section
      id="browse-gifts"
      className="w-full bg-gradient-to-b from-white to-gray-50 py-20 px-4"
    >
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-fg-navy mb-4">
            Browse All Gifts
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Prefer to see everything at once? Here's the full list of gift wishes from our community members.
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
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
