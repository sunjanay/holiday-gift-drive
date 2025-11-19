-- Create gift_recipients table for Holiday Gift Drive
CREATE TABLE IF NOT EXISTS gift_recipients (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  age INTEGER,
  story TEXT NOT NULL,
  gift_title TEXT NOT NULL,
  gift_description TEXT NOT NULL,
  gift_price NUMERIC(10, 2) NOT NULL,
  amazon_wishlist_url TEXT NOT NULL,
  ornament_color TEXT NOT NULL CHECK (ornament_color IN ('red', 'gold', 'silver', 'green', 'blue')),
  position_top TEXT NOT NULL,
  position_left TEXT NOT NULL,
  purchased BOOLEAN DEFAULT FALSE,
  purchased_at TIMESTAMPTZ,
  stripe_session_id TEXT,
  donor_email TEXT,
  amount_paid INTEGER,
  fee_covered BOOLEAN,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE gift_recipients ENABLE ROW LEVEL SECURITY;

-- Allow public read access (anyone can view gifts)
CREATE POLICY "Anyone can view gifts"
ON gift_recipients FOR SELECT
TO anon, authenticated
USING (true);

-- Only service role can update (for webhook)
CREATE POLICY "Service role can update gifts"
ON gift_recipients FOR UPDATE
TO service_role
USING (true);

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE gift_recipients;

-- Insert initial gift data
INSERT INTO gift_recipients (id, name, story, gift_title, gift_description, gift_price, amazon_wishlist_url, ornament_color, position_top, position_left, purchased)
VALUES
  ('1', 'Rimy', 'Rimy wants to honor her emotional support hero Papa who passed earlier this year. This meaningful gift will help her keep his memory close during the holiday season.', 'Pet Memorial Frame', 'Dog memorial frame with collar holder - a beautiful way to honor and remember Papa', 29, 'https://a.co/d/2oPvhRE', 'red', '22%', '46%', false),
  ('2', 'Chyenne', 'Chyenne loves music and has a record player. This gift will help her build her vinyl collection and enjoy great music during the holidays.', 'The Best of Sade LP', 'Vinyl record to enjoy great music on her record player', 38, 'https://a.co/d/bfkoLw1', 'gold', '38%', '57%', false),
  ('3', 'Abril', 'Abril would love a YETI mug to keep their drinks cool. This durable, high-quality mug will be a daily companion for staying hydrated.', 'YETI Travel Mug', 'YETI Rambler 20 oz stainless steel travel mug with vacuum insulation', 42, 'https://www.amazon.com/dp/B0B3SHFPB6/ref=cm_sw_r_as_gl_api_gl_i_9FCY23PGCBR7TYZSWD5V?linkCode=ml1&tag=mobile044cd38-20&linkId=36624d1d230be8b62bc2df8f89326e37', 'blue', '52%', '40%', false),
  ('4', 'Jennifer', 'Jennifer needs a massage gun to help with shoulder pain after a car accident. This therapeutic tool will provide relief and support her recovery.', 'Deep Tissue Massage Gun', 'OLsky massage gun with 9 attachments & 30 speeds for pain relief', 33, 'https://a.co/d/aCC0hiV', 'green', '65%', '54%', false)
ON CONFLICT (id) DO NOTHING;

-- Create function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updated_at
CREATE TRIGGER update_gift_recipients_updated_at
  BEFORE UPDATE ON gift_recipients
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
