/**
 * Stripe singleton — import `stripe` from here wherever you need the SDK.
 *
 * Required env vars:
 *   STRIPE_SECRET_KEY          — from Stripe dashboard (sk_live_... / sk_test_...)
 *   STRIPE_WEBHOOK_SECRET      — from Stripe CLI or webhook endpoint settings
 *   STRIPE_GROWTH_PRICE_ID     — recurring Price ID for the Growth plan
 *   STRIPE_ENTERPRISE_PRICE_ID — recurring Price ID for the Enterprise plan
 */

import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  // Hard error at module-load time so misconfiguration is caught immediately
  // in development; in production the server will refuse to start.
  throw new Error(
    "[stripe] STRIPE_SECRET_KEY is not set. Add it to your .env.local / deployment environment."
  );
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Pin the API version so upgrades are explicit and auditable.
  apiVersion: "2025-02-24.acacia",
  // Identify requests in Stripe's dashboard for easier debugging.
  appInfo: {
    name: "TrueWagon",
    version: "1.0.0",
  },
});
