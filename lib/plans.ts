// ─── Plan definitions ─────────────────────────────────────────────────────────
export const PLANS = {
  free: {
    label:        "Free",
    listingLimit: 10,
    bulkImport:   false,
    color:        "#64748B",
    bg:           "#F1F5F9",
    border:       "#CBD5E1",
    textColor:    "#334155",
    badge:        "Free",
  },
  growth: {
    label:        "Growth",
    listingLimit: 50,
    bulkImport:   true,
    color:        "#2563EB",
    bg:           "#DBEAFE",
    border:       "#BFDBFE",
    textColor:    "#1D4ED8",
    badge:        "Growth",
  },
  enterprise: {
    label:        "Enterprise",
    listingLimit: Infinity,
    bulkImport:   true,
    color:        "#7C3AED",
    bg:           "#EDE9FE",
    border:       "#DDD6FE",
    textColor:    "#6D28D9",
    badge:        "Enterprise",
  },
} as const;

export type PlanKey = keyof typeof PLANS;

/** Returns the plan object, falling back to free for unknown values */
export function getPlan(key: string | null | undefined): typeof PLANS[PlanKey] {
  return PLANS[(key ?? "free") as PlanKey] ?? PLANS.free;
}
