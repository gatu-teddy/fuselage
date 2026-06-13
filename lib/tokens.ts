// ─── TrueWagon Design Tokens — single source of truth ─────────────────────────
// Import this everywhere instead of declaring a local `const c = {...}` object.
//
// Usage:  import { c } from "@/lib/tokens";

export const c = {
  // Core palette
  primary:       "#0F172A",   // Trust Blue — headings, nav, buttons
  green:         "#10B981",   // Safety Green — CTAs, verified badges
  greenBg:       "#D1FAE5",   // Green chip background
  greenText:     "#065F46",   // Green chip text

  // Body / surface
  body:          "#334155",   // Primary body text
  bg:            "#F8FAFC",   // Page background
  bgDim:         "#F1F5F9",   // Slightly dimmer surface (inputs, aside)
  surface:       "#FFFFFF",   // Card / elevated surface
  border:        "#E2E8F0",   // Default border
  muted:         "#64748B",   // Muted / placeholder text

  // Semantic accents
  amber:         "#F59E0B",   // Warning / in-transit
  amberBg:       "#FEF3C7",   // Amber chip background
  amberBorder:   "#FDE68A",   // Amber chip border

  blue:          "#2563EB",   // Info / Growth plan
  blueBg:        "#DBEAFE",   // Blue chip background
  blueText:      "#1D4ED8",   // Blue chip text
  blueBorder:    "#BFDBFE",   // Blue chip border

  purple:        "#7C3AED",   // Enterprise plan
  purpleBg:      "#EDE9FE",   // Purple chip background
  purpleBorder:  "#DDD6FE",   // Purple chip border

  red:           "#EF4444",   // Danger / sign-out
  redBg:         "#FEF2F2",   // Danger chip background
  redBorder:     "#FECACA",   // Danger chip border

  // Form error aliases (same values, semantic names)
  error:         "#EF4444",   // Form error text
  errorBg:       "#FEF2F2",   // Form error background
} as const;

export type TokenKey = keyof typeof c;
