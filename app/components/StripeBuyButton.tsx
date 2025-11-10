'use client';

import { useEffect, useRef } from 'react';

interface StripeBuyButtonProps {
  buyButtonId: string;
  publishableKey: string;
}

export default function StripeBuyButton({ buyButtonId, publishableKey }: StripeBuyButtonProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current && typeof window !== 'undefined') {
      const stripeBuyButton = document.createElement('stripe-buy-button');
      stripeBuyButton.setAttribute('buy-button-id', buyButtonId);
      stripeBuyButton.setAttribute('publishable-key', publishableKey);

      containerRef.current.appendChild(stripeBuyButton);

      // Add custom styles to center and style the Stripe button
      const style = document.createElement('style');
      style.textContent = `
        stripe-buy-button {
          display: flex !important;
          justify-content: center !important;
          width: 100% !important;
        }
      `;
      containerRef.current.appendChild(style);
    }
  }, [buyButtonId, publishableKey]);

  return (
    <div
      ref={containerRef}
      className="w-full flex justify-center items-center"
    />
  );
}
