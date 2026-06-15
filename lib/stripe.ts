/**
 * Stripe singleton — import `stripe` from here wherever you need the SDK.
 *
 * Required env vars (set when you're ready to go live):
 *   STRIPE_SECRET_KEY          — from Stripe dashboard (sk_live_... / sk_test_...)
 *   STRIPE_WEBHOOK_SECRET      — from Stripe CLI or webhook endpoint settings
 *   STRIPE_GROWTH_PRICE_ID     — recurring Price ID for the Growth plan
 *   STRIPE_ENTERPRISE_PRICE_ID — recurring Price ID for the Enterprise plan
 *
 * While these are unset the app runs in mock mode — billing routes return a
 * "coming soon" response instead of throwing at startup.
 */

import Stripe from "stripe";

export const STRIPE_ENABLED = !!process.env.STRIPE_SECRET_KEY;

// Lazy — only instantiated when STRIPE_SECRET_KEY is present.
// Routes that call `getStripe()` must guard with `STRIPE_ENABLED` first.
export function getStripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "[stripe] STRIPE_SECRET_KEY is not set. Add it to .env.local or your deployment environment."
    );
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2025-02-24.acacia",
    appInfo: { name: "Fuselage", version: "1.0.0" },
  });
}
