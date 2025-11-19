'use client';

import { useState } from 'react';
import ChristmasTree from './ChristmasTree';
import Ornament from './Ornament';
import GiftModal from './GiftModal';
import { GiftRecipient } from '../data/giftRecipients';
import { useGiftRecipients } from '../hooks/useGiftRecipients';

export default function InteractiveTree() {
  const { recipients, loading, error, usingStaticData } = useGiftRecipients();
  const [selectedRecipient, setSelectedRecipient] = useState<GiftRecipient | null>(null);

  const handleViewAll = () => {
    const browseSection = document.getElementById('browse-gifts');
    if (browseSection) {
      browseSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (loading) {
    return (
      <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center" style={{ height: '700px' }}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-fg-teal mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gifts...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative w-full max-w-4xl mx-auto flex items-center justify-center" style={{ height: '700px' }}>
        <div className="text-center bg-red-50 border border-red-200 rounded-lg p-8 max-w-md">
          <p className="text-red-800 font-semibold mb-2">Failed to load gifts</p>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-full max-w-4xl mx-auto">
        {/* Tree with Ornaments */}
        <div className="relative" style={{ height: '700px' }}>
          {/* Tree SVG Background */}
          <div className="absolute inset-0 flex items-center justify-center">
            <ChristmasTree />
          </div>

          {/* Tree-shaped Ornament Grid - positioned over tree */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
          {/* Row 1: 1 ornament (top of tree) */}
          <div className="flex justify-center">
            {recipients[0] && (
              <Ornament
                key={recipients[0].id}
                recipient={recipients[0]}
                onClick={() => setSelectedRecipient(recipients[0])}
              />
            )}
          </div>

          {/* Row 2: 2 ornaments */}
          <div className="flex justify-center gap-8">
            {recipients[1] && (
              <Ornament
                key={recipients[1].id}
                recipient={recipients[1]}
                onClick={() => setSelectedRecipient(recipients[1])}
              />
            )}
            {recipients[2] && (
              <Ornament
                key={recipients[2].id}
                recipient={recipients[2]}
                onClick={() => setSelectedRecipient(recipients[2])}
              />
            )}
          </div>

          {/* Row 3: 1 ornament (bottom center) */}
          <div className="flex justify-center">
            {recipients[3] && (
              <Ornament
                key={recipients[3].id}
                recipient={recipients[3]}
                onClick={() => setSelectedRecipient(recipients[3])}
              />
            )}
          </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <GiftModal
        recipient={selectedRecipient}
        onClose={() => setSelectedRecipient(null)}
        onViewAll={handleViewAll}
      />
    </>
  );
}
