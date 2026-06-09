"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { VEHICLE_MAKES, AFRICAN_COUNTRIES } from "@/lib/types";

const c = {
  primary:   "#0F172A",
  green:     "#10B981",
  greenBg:   "#D1FAE5",
  greenText: "#065F46",
  body:      "#334155",
  bg:        "#F8FAFC",
  surface:   "#FFFFFF",
  border:    "#E2E8F0",
  muted:     "#64748B",
};

interface Props {
  currentParams: {
    type?: string;
    make?: string;
    availability?: string;
    port?: string;
    min?: string;
    max?: string;
  };
  /** When true, renders only a mobile Filters button + bottom sheet */
  mobileOnly?: boolean;
}

const availabilityOptions = [
  { value: "in_stock",  label: "At Port / In Stock" },
  { value: "en_route",  label: "In Transit" },
  { value: "pre_order", label: "Pre-Order" },
];

function Checkbox({ checked, onClick }: { checked: boolean; onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      style={{
        width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
        border: `2px solid ${checked ? c.green : c.border}`,
        backgroundColor: checked ? c.green : "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer",
      }}
    >
      {checked && (
        <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
          <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}

export function BrowseFilters({ currentParams, mobileOnly }: Props) {
  const router = useRouter();
  const [mobileOpen, setMobileOpen]     = useState(false);
  const [type, setType]                 = useState(currentParams.type ?? "");
  const [make, setMake]                 = useState(currentParams.make ?? "");
  const [makeSearch, setMakeSearch]     = useState(currentParams.make ?? "");
  const [availability, setAvailability] = useState(currentParams.availability ?? "");
  const [port, setPort]                 = useState(currentParams.port ?? "");
  const [min, setMin]                   = useState(currentParams.min ?? "");
  const [max, setMax]                   = useState(currentParams.max ?? "");

  const makes = type === "bike" ? VEHICLE_MAKES.bike : VEHICLE_MAKES.car;
  const filteredMakes = makes.filter((m) =>
    m.toLowerCase().includes(makeSearch.toLowerCase())
  );

  function apply(overrides?: Record<string, string>) {
    const params = new URLSearchParams();
    const vals = { type, make, availability, port, min, max, ...overrides };
    if (vals.type)         params.set("type", vals.type);
    if (vals.make)         params.set("make", vals.make);
    if (vals.availability) params.set("availability", vals.availability);
    if (vals.port)         params.set("port", vals.port);
    if (vals.min)          params.set("min", vals.min);
    if (vals.max)          params.set("max", vals.max);
    router.push(`/browse?${params.toString()}`);
  }

  function clear() {
    setType(""); setMake(""); setMakeSearch(""); setAvailability("");
    setPort(""); setMin(""); setMax("");
    router.push("/browse");
  }

  const hasFilters = type || make || availability || port || min || max;
  const activeCount = [type, make, availability, port, min, max].filter(Boolean).length;

  // ── Shared filter sections JSX ────────────────────────────────────────────
  function FilterBody({ onApply }: { onApply?: () => void }) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif" }}>

        {/* Vetting Status */}
        <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
          <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Vetting Status
          </p>
          <div className="space-y-2.5">
            {[
              { value: "car",  label: "Elite Vetted (Cars)" },
              { value: "bike", label: "Vetted (Bikes)" },
            ].map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={type === value}
                  onClick={() => {
                    const next = type === value ? "" : value;
                    setType(next); setMake(""); setMakeSearch("");
                    apply({ type: next, make: "" });
                    onApply?.();
                  }}
                />
                <span style={{ color: c.body }} className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Logistics Status */}
        <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
          <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Logistics Status
          </p>
          <div className="space-y-2.5">
            {availabilityOptions.map(({ value, label }) => (
              <label key={value} className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={availability === value}
                  onClick={() => {
                    const next = availability === value ? "" : value;
                    setAvailability(next);
                    apply({ availability: next });
                    onApply?.();
                  }}
                />
                <span style={{ color: c.body }} className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Make / Model */}
        <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
          <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Make / Model
          </p>
          <div className="relative mb-3">
            <Search style={{ color: c.muted }} className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5" />
            <input
              type="text"
              placeholder="Search brands..."
              value={makeSearch}
              onChange={(e) => setMakeSearch(e.target.value)}
              style={{
                width: "100%", paddingLeft: "32px", paddingRight: "12px",
                height: "36px", fontSize: "14px", outline: "none",
                border: `1px solid ${c.border}`, borderRadius: "6px",
                color: c.body, backgroundColor: c.surface,
              }}
            />
          </div>
          <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
            {filteredMakes.slice(0, 12).map((m) => (
              <label key={m} className="flex items-center gap-2.5 cursor-pointer">
                <Checkbox
                  checked={make === m}
                  onClick={() => {
                    const next = make === m ? "" : m;
                    setMake(next);
                    apply({ make: next });
                    onApply?.();
                  }}
                />
                <span style={{ color: c.body }} className="text-sm">{m}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Region */}
        <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
          <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Region
          </p>
          <select
            value={port || ""}
            onChange={(e) => { setPort(e.target.value); apply({ port: e.target.value }); onApply?.(); }}
            style={{
              width: "100%", height: "36px", fontSize: "14px", outline: "none",
              border: `1px solid ${c.border}`, borderRadius: "6px",
              color: c.body, backgroundColor: c.surface, paddingLeft: "10px",
            }}
          >
            <option value="">All Regions</option>
            {AFRICAN_COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div className="pb-5 mb-5">
          <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Price Range (USD)
          </p>
          <div className="flex gap-2 mb-4">
            <input
              type="number"
              placeholder="Min"
              value={min}
              onChange={(e) => setMin(e.target.value)}
              style={{
                width: 0, flex: 1, minWidth: 0, height: "36px", fontSize: "13px", outline: "none",
                border: `1px solid ${c.border}`, borderRadius: "6px",
                color: c.body, backgroundColor: c.surface, paddingLeft: "8px",
              }}
            />
            <input
              type="number"
              placeholder="Max"
              value={max}
              onChange={(e) => setMax(e.target.value)}
              style={{
                width: 0, flex: 1, minWidth: 0, height: "36px", fontSize: "13px", outline: "none",
                border: `1px solid ${c.border}`, borderRadius: "6px",
                color: c.body, backgroundColor: c.surface, paddingLeft: "8px",
              }}
            />
          </div>
          <button
            onClick={() => { apply(); onApply?.(); }}
            style={{ backgroundColor: c.primary, color: "#fff", width: "100%", height: "38px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}
            className="hover:opacity-90 transition-opacity"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }

  // ── Mobile-only mode: trigger button + bottom sheet ───────────────────────
  if (mobileOnly) {
    return (
      <>
        {/* Trigger */}
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            height: "36px",
            padding: "0 14px",
            border: `1px solid ${activeCount > 0 ? c.green : c.border}`,
            borderRadius: "6px",
            fontSize: "13px",
            fontWeight: 600,
            color: activeCount > 0 ? c.green : c.primary,
            backgroundColor: activeCount > 0 ? c.greenBg : c.surface,
            cursor: "pointer",
            fontFamily: "Inter, sans-serif",
          }}
          className="md:hidden"
        >
          <SlidersHorizontal style={{ width: "14px", height: "14px" }} />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>

        {/* Bottom sheet */}
        {mobileOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50 }} className="md:hidden">
            {/* Backdrop */}
            <div
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileOpen(false)}
            />
            {/* Sheet */}
            <div
              style={{
                position: "absolute",
                bottom: 0, left: 0, right: 0,
                backgroundColor: "#fff",
                borderRadius: "20px 20px 0 0",
                maxHeight: "85vh",
                overflowY: "auto",
                padding: "20px",
              }}
            >
              {/* Sheet header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
                <span style={{ color: c.primary, fontWeight: 700, fontSize: "16px", fontFamily: "Inter, sans-serif" }}>Filters</span>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  {hasFilters && (
                    <button
                      onClick={() => { clear(); setMobileOpen(false); }}
                      style={{ color: c.muted, fontSize: "12px", display: "flex", alignItems: "center", gap: "4px", background: "none", border: "none", cursor: "pointer", fontFamily: "Inter, sans-serif" }}
                    >
                      <X style={{ width: "12px", height: "12px" }} /> Clear all
                    </button>
                  )}
                  <button
                    onClick={() => setMobileOpen(false)}
                    style={{ color: c.muted, background: "none", border: "none", cursor: "pointer", display: "flex" }}
                  >
                    <X style={{ width: "20px", height: "20px" }} />
                  </button>
                </div>
              </div>
              <FilterBody onApply={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Desktop sidebar mode ──────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span style={{ color: c.primary }} className="text-sm font-bold">Filters</span>
        {hasFilters && (
          <button
            onClick={clear}
            style={{ color: c.muted }}
            className="text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
          >
            <X className="h-3 w-3" /> Clear all
          </button>
        )}
      </div>
      <FilterBody />
    </div>
  );
}
