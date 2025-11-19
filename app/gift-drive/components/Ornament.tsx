'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { GiftRecipient } from '../data/giftRecipients';

interface OrnamentProps {
  recipient: GiftRecipient;
  onClick: () => void;
}

const ornamentColors = {
  red: {
    primary: '#DC2626',
    secondary: '#EF4444',
    accent: '#FCA5A5'
  },
  gold: {
    primary: '#FACA2C',
    secondary: '#FCD34D',
    accent: '#FEF3C7'
  },
  silver: {
    primary: '#94A3B8',
    secondary: '#CBD5E1',
    accent: '#F1F5F9'
  },
  green: {
    primary: '#16A34A',
    secondary: '#22C55E',
    accent: '#86EFAC'
  },
  blue: {
    primary: '#0067A2',
    secondary: '#0284C7',
    accent: '#7DD3FC'
  }
};

export default function Ornament({ recipient, onClick }: OrnamentProps) {
  const prefersReducedMotion = useReducedMotion();
  const colors = ornamentColors[recipient.ornamentColor];

  return (
    <motion.button
      onClick={onClick}
      className="relative cursor-pointer group focus:outline-none focus:ring-4 focus:ring-fg-teal focus:ring-offset-2 rounded-full"
      style={{
        width: '120px',
        height: '140px'
      }}
      initial={prefersReducedMotion ? {} : { rotate: -2 }}
      animate={prefersReducedMotion ? {} : {
        rotate: [-2, 2, -2],
      }}
      transition={prefersReducedMotion ? {} : {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: Math.random() * 2
      }}
      whileHover={prefersReducedMotion ? {} : {
        scale: 1.1,
        rotate: 0,
        transition: { duration: 0.2 }
      }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.95 }}
      aria-label={`Gift wish for ${recipient.name}: ${recipient.giftTitle}, $${recipient.giftPrice}`}
    >
      {/* Ornament Hanger */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-gray-600 rounded" />

      {/* Ornament Cap */}
      <div
        className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-3 rounded-t"
        style={{ backgroundColor: '#9CA3AF' }}
      />

      {/* Ornament Ball */}
      <motion.div
        className={`absolute top-5 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full shadow-lg flex flex-col items-center justify-center text-center p-3 overflow-hidden ${
          recipient.purchased ? 'opacity-50' : ''
        }`}
        style={{
          background: recipient.purchased
            ? 'linear-gradient(135deg, #9CA3AF 0%, #D1D5DB 100%)'
            : `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
        }}
        whileHover={{
          boxShadow: recipient.purchased ? undefined : `0 0 20px ${colors.accent}`,
        }}
      >
        {/* Shine effect */}
        {!recipient.purchased && (
          <div
            className="absolute top-2 left-2 w-6 h-6 rounded-full opacity-60"
            style={{ backgroundColor: colors.accent }}
          />
        )}

        {recipient.purchased ? (
          /* Purchased Badge */
          <div className="text-white font-bold text-xs leading-tight relative z-10">
            PURCHASED
          </div>
        ) : (
          <>
            {/* Name */}
            <div className="text-white font-bold text-sm mb-1 relative z-10">
              {recipient.name}
            </div>

            {/* Gift Title */}
            <div className="text-white text-xs leading-tight line-clamp-2 relative z-10">
              {recipient.giftTitle}
            </div>
          </>
        )}
      </motion.div>

      {/* Price Tag */}
      {!recipient.purchased && recipient.giftPrice > 0 && (
        <motion.div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-white px-2 py-1 rounded-full shadow-md border-2"
          style={{ borderColor: colors.primary }}
          whileHover={{
            scale: 1.05,
          }}
        >
          <span className="text-xs font-bold" style={{ color: colors.primary }}>
            ${recipient.giftPrice}
          </span>
        </motion.div>
      )}
    </motion.button>
  );
}
