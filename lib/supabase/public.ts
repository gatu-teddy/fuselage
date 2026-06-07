/**
 * A lightweight Supabase client for public (unauthenticated) server-side queries.
 * Does NOT touch cookies or validate sessions — Next.js can cache responses freely.
 * Use this for browse/listing pages that need no auth.
 */
import { createClient } from "@supabase/supabase-js";

export function createPublicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}
