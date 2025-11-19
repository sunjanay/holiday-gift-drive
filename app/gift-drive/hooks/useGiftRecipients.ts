'use client';

import { useState, useEffect } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase/client';
import type { GiftRecipient } from '../data/giftRecipients';
import { giftRecipients as staticGiftRecipients } from '../data/giftRecipients';
import type { RealtimeChannel } from '@supabase/supabase-js';

export function useGiftRecipients() {
  const [recipients, setRecipients] = useState<GiftRecipient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingStaticData, setUsingStaticData] = useState(false);

  useEffect(() => {
    // If Supabase is not configured, use static data
    if (!isSupabaseConfigured || !supabase) {
      console.warn('Supabase not configured. Using static gift data. Real-time updates disabled.');
      setRecipients(staticGiftRecipients);
      setLoading(false);
      setUsingStaticData(true);
      return;
    }

    // Fetch initial data from Supabase
    async function fetchRecipients() {
      if (!supabase) return;

      try {
        const { data, error: fetchError } = await supabase
          .from('gift_recipients')
          .select('*')
          .order('id');

        if (fetchError) throw fetchError;

        // Transform database rows to GiftRecipient format
        const transformedData: GiftRecipient[] = (data || []).map((row: any) => ({
          id: row.id,
          name: row.name,
          age: row.age || undefined,
          story: row.story,
          giftTitle: row.gift_title,
          giftDescription: row.gift_description,
          giftPrice: row.gift_price,
          amazonWishlistUrl: row.amazon_wishlist_url,
          ornamentColor: row.ornament_color as 'red' | 'gold' | 'silver' | 'green' | 'blue',
          position: {
            top: row.position_top,
            left: row.position_left,
          },
          purchased: row.purchased,
          purchasedAt: row.purchased_at || undefined,
        }));

        setRecipients(transformedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching gift recipients:', err);
        setError(err instanceof Error ? err.message : 'Failed to load gifts');
        setLoading(false);
      }
    }

    fetchRecipients();

    // Set up realtime subscription
    let channel: RealtimeChannel | undefined;

    async function setupRealtime() {
      if (!supabase) return;

      channel = supabase
        .channel('gift_recipients_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'gift_recipients',
          },
          (payload) => {
            console.log('Realtime update:', payload);

            if (payload.eventType === 'UPDATE') {
              const updatedRow = payload.new;
              setRecipients((current) =>
                current.map((recipient) =>
                  recipient.id === updatedRow.id
                    ? {
                        ...recipient,
                        purchased: updatedRow.purchased,
                        purchasedAt: updatedRow.purchased_at || undefined,
                      }
                    : recipient
                )
              );
            }
          }
        )
        .subscribe();
    }

    setupRealtime();

    // Cleanup subscription on unmount
    return () => {
      if (channel && supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return { recipients, loading, error, usingStaticData };
}

export async function markGiftAsPurchased(giftId: string): Promise<boolean> {
  // If Supabase is not configured, show message
  if (!isSupabaseConfigured || !supabase) {
    alert('Purchase tracking requires Supabase configuration. See docs/SUPABASE_SETUP.md for setup instructions.');
    return false;
  }

  try {
    const { error } = await supabase
      .from('gift_recipients')
      .update({
        purchased: true,
        purchased_at: new Date().toISOString(),
      })
      .eq('id', giftId);

    if (error) throw error;
    return true;
  } catch (err) {
    console.error('Error marking gift as purchased:', err);
    return false;
  }
}
