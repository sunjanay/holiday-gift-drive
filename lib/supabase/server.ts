import { createClient } from '@supabase/supabase-js';

// Server-side Supabase client with service role key
// This bypasses RLS and should only be used in server-side code (webhooks, API routes)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if server-side Supabase is configured
export const isSupabaseServerConfigured = !!(supabaseUrl && supabaseServiceKey);

// Create admin client only if configured
export const supabaseAdmin = isSupabaseServerConfigured && supabaseUrl && supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;
