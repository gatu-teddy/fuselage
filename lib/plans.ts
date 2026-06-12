// ─── Plan definitions — single source of truth for all feature limits ─────────

export type PlanKey = "free" | "growth" | "enterprise";

export type PortPolicy = "proof_required" | "unrestricted_with_liability";

export interface Plan {
  id:             PlanKey;
  label:          string;
  price:          number;          // USD/month; 0 = free
  description:    string;
  // Limits
  listingLimit:   number;          // Infinity = unlimited
  imageLimit:     number;          // per listing
  videoLimit:     number;          // per listing (0 = not available yet)
  featuredBoosts: number;          // included per month
  // Features
  bulkImport:     boolean;
  analytics:      boolean;
  prioritySearch: boolean;
  portPolicy:     PortPolicy;
  support:        string;
  // UI tokens
  color:          string;
  bg:             string;
  border:         string;
  textColor:      string;
  // Stripe (populated from env at runtime)
  stripePriceId:  string | null;
}

export const PLANS: Record<PlanKey, Plan> = {
  free: {
    id:             "free",
    label:          "Free",
    price:          0,
    description:    "List your inventory and start getting discovered.",
    listingLimit:   25,
    imageLimit:     5,
    videoLimit:     0,
    featuredBoosts: 0,
    bulkImport:     false,
    analytics:      false,
    prioritySearch: false,
    portPolicy:     "proof_required",
    support:        "Email",
    color:          "#64748B",
    bg:             "#F1F5F9",
    border:         "#CBD5E1",
    textColor:      "#334155",
    stripePriceId:  null,
  },

  growth: {
    id:             "growth",
    label:          "Growth",
    price:          99,
    description:    "Scale your exports with more listings and better tools.",
    listingLimit:   65,
    imageLimit:     10,
    videoLimit:     0,
    featuredBoosts: 2,
    bulkImport:     true,
    analytics:      true,
    prioritySearch: false,
    portPolicy:     "proof_required",
    support:        "Email",
    color:          "#2563EB",
    bg:             "#DBEAFE",
    border:         "#BFDBFE",
    textColor:      "#1D4ED8",
    stripePriceId:  process.env.STRIPE_GROWTH_PRICE_ID ?? null,
  },

  enterprise: {
    id:             "enterprise",
    label:          "Enterprise",
    price:          299,
    description:    "No limits. Ship to any destination, full control.",
    listingLimit:   Infinity,
    imageLimit:     10,
    videoLimit:     2,             // placeholder — video upload not yet built
    featuredBoosts: 5,
    bulkImport:     true,
    analytics:      true,
    prioritySearch: true,
    portPolicy:     "unrestricted_with_liability",
    support:        "Dedicated",
    color:          "#7C3AED",
    bg:             "#EDE9FE",
    border:         "#DDD6FE",
    textColor:      "#6D28D9",
    stripePriceId:  process.env.STRIPE_ENTERPRISE_PRICE_ID ?? null,
  },
};

/** Returns the plan object, falling back to free for unknown values. */
export function getPlan(key: string | null | undefined): Plan {
  return PLANS[(key ?? "free") as PlanKey] ?? PLANS.free;
}

/** Returns true if the seller's active listing count is within their plan limit. */
export function withinListingLimit(plan: Plan, activeCount: number): boolean {
  return activeCount < plan.listingLimit;
}

/** Returns true if the image count is within the plan's per-listing image limit. */
export function withinImageLimit(plan: Plan, imageCount: number): boolean {
  return imageCount < plan.imageLimit;
}
