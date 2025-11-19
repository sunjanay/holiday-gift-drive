export interface GiftRecipient {
  id: string;
  name: string;
  age?: number;
  story: string;
  giftTitle: string;
  giftDescription: string;
  giftPrice: number;
  amazonWishlistUrl: string;
  ornamentColor: 'red' | 'gold' | 'silver' | 'green' | 'blue';
  position: {
    top: string;
    left: string;
  };
  purchased: boolean;
  purchasedAt?: string;
  // New fields for Stripe integration
  stripeSessionId?: string;
  donorEmail?: string;
  amountPaid?: number;
  feeCovered?: boolean;
}

export const giftRecipients: GiftRecipient[] = [
  {
    id: '1',
    name: 'Rimy',
    story: 'Rimy wants to honor her emotional support hero Papa who passed earlier this year. This meaningful gift will help her keep his memory close during the holiday season.',
    giftTitle: 'Pet Memorial Frame',
    giftDescription: 'Dog memorial frame with collar holder - a beautiful way to honor and remember Papa',
    giftPrice: 29,
    amazonWishlistUrl: 'https://a.co/d/2oPvhRE',
    ornamentColor: 'red',
    purchased: false,
    position: { top: '22%', left: '46%' }
  },
  {
    id: '2',
    name: 'Chyenne',
    story: 'Chyenne loves music and has a record player. This gift will help her build her vinyl collection and enjoy great music during the holidays.',
    giftTitle: 'The Best of Sade LP',
    giftDescription: 'Vinyl record to enjoy great music on her record player',
    giftPrice: 38,
    amazonWishlistUrl: 'https://a.co/d/bfkoLw1',
    ornamentColor: 'gold',
    purchased: false,
    position: { top: '38%', left: '57%' }
  },
  {
    id: '3',
    name: 'Abril',
    story: 'Abril would love a YETI mug to keep their drinks cool. This durable, high-quality mug will be a daily companion for staying hydrated.',
    giftTitle: 'YETI Travel Mug',
    giftDescription: 'YETI Rambler 20 oz stainless steel travel mug with vacuum insulation',
    giftPrice: 42,
    amazonWishlistUrl: 'https://www.amazon.com/dp/B0B3SHFPB6/ref=cm_sw_r_as_gl_api_gl_i_9FCY23PGCBR7TYZSWD5V?linkCode=ml1&tag=mobile044cd38-20&linkId=36624d1d230be8b62bc2df8f89326e37',
    ornamentColor: 'blue',
    purchased: false,
    position: { top: '52%', left: '40%' }
  },
  {
    id: '4',
    name: 'Jennifer',
    story: 'Jennifer needs a massage gun to help with shoulder pain after a car accident. This therapeutic tool will provide relief and support her recovery.',
    giftTitle: 'Deep Tissue Massage Gun',
    giftDescription: 'OLsky massage gun with 9 attachments & 30 speeds for pain relief',
    giftPrice: 33,
    amazonWishlistUrl: 'https://a.co/d/aCC0hiV',
    ornamentColor: 'green',
    purchased: false,
    position: { top: '65%', left: '54%' }
  }
];
