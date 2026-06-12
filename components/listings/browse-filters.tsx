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
  bgDim:     "#F1F5F9",
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
    steering?: string;
    q?: string;
  };
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

  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [type,        setType]        = useState(currentParams.type ?? "");
  const [make,        setMake]        = useState(currentParams.make ?? "");
  const [makeSearch,  setMakeSearch]  = useState(currentParams.make ?? "");
  const [availability,setAvailability]= useState(currentParams.availability ?? "");
  const [port,        setPort]        = useState(currentParams.port ?? "");
  const [min,         setMin]         = useState(currentParams.min ?? "");
  const [max,         setMax]         = useState(currentParams.max ?? "");
  const [steering,    setSteering]    = useState(currentParams.steering ?? "");
  const [q,           setQ]           = useState(currentParams.q ?? "");

  const makes = type === "bike" ? VEHICLE_MAKES.bike : VEHICLE_MAKES.car;
  const filteredMakes = makes.filter((m) =>
    m.toLowerCase().includes(makeSearch.toLowerCase())
  );

  function apply(overrides?: Record<string, string>) {
    const params = new URLSearchParams();
    const vals = { type, make, availability, port, min, max, steering, q, ...overrides };
    if (vals.type)         params.set("type",         vals.type);
    if (vals.make)         params.set("make",         vals.make);
    if (vals.availability) params.set("availability", vals.availability);
    if (vals.port)         params.set("port",         vals.port);
    if (vals.min)          params.set("min",          vals.min);
    if (vals.max)          params.set("max",          vals.max);
    if (vals.steering)     params.set("steering",     vals.steering);
    if (vals.q)            params.set("q",            vals.q);
    router.push(`/browse?${params.toString()}`);
  }

  function clear() {
    setType(""); setMake(""); setMakeSearch(""); setAvailability("");
    setPort(""); setMin(""); setMax(""); setSteering(""); setQ("");
    router.push("/browse");
  }

  const hasFilters = type || make || availability || port || min || max || steering || q;
  const activeCount = [type, make, availability, port, min, max, steering, q].filter(Boolean).length;

  // ── Type toggle (Cars / Motorbikes) ────────────────────────────────────────
  function TypeToggle({ onApply }: { onApply?: () => void }) {
    return (
      <div
        style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3px",
          padding: "3px", backgroundColor: c.bgDim,
          borderRadius: "8px", marginBottom: "14px",
          border: `1px solid ${c.border}`,
        }}
      >
        {([
          { value: "car",  label: "Cars" },
          { value: "bike", label: "Motorbikes" },
        ] as const).map(({ value, label }) => {
          const isActive = type === value;
          return (
            <button
              key={value}
              type="button"
              onClick={() => {
                const next = isActive ? "" : value;
                setType(next); setMake(""); setMakeSearch("");
                apply({ type: next, make: "" });
                onApply?.();
              }}
              style={{
                height: "34px", border: "none", borderRadius: "6px",
                fontSize: "13px", fontWeight: isActive ? 700 : 500,
                cursor: "pointer", transition: "all 0.12s ease",
                backgroundColor: isActive ? c.primary : "transparent",
                color: isActive ? "#ffffff" : c.muted,
                fontFamily: "Inter, sans-serif",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>
    );
  }

  // ── Global search bar ──────────────────────────────────────────────────────
  function SearchBar({ onApply }: { onApply?: () => void }) {
    return (
      <div style={{ position: "relative", marginBottom: "20px" }}>
        <Search
          style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)", color: c.muted, width: "14px", height: "14px", pointerEvents: "none" }}
        />
        <input
          type="text"
          placeholder="Search make, model..."
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") { apply({ q }); onApply?.(); }
          }}
          style={{
            width: "100%", paddingLeft: "32px", paddingRight: q ? "32px" : "10px",
            height: "38px", fontSize: "13px", outline: "none",
            border: `1px solid ${q ? c.primary : c.border}`,
            borderRadius: "7px", color: c.body, backgroundColor: c.surface,
            fontFamily: "Inter, sans-serif", boxSizing: "border-box",
          }}
        />
        {q && (
          <button
            type="button"
            onClick={() => { setQ(""); apply({ q: "" }); onApply?.(); }}
            style={{
              position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", padding: "2px",
              display: "flex", alignItems: "center", color: c.muted,
            }}
          >
            <X style={{ width: "13px", height: "13px" }} />
          </button>
        )}
      </div>
    );
  }

  // ── Filter sections (steering, logistics, make, region, price) ─────────────
  function FilterBody({ onApply }: { onApply?: () => void }) {
    return (
      <div style={{ fontFamily: "Inter, sans-serif" }}>

        {/* Steering */}
        <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
          <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Steering
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "6px" }}>
            {[
              { value: "",    label: "Any"  },
              { value: "RHD", label: "RHD" },
              { value: "LHD", label: "LHD" },
            ].map(({ value, label }) => (
              <button
                key={label}
                type="button"
                onClick={() => {
                  setSteering(value);
                  apply({ steering: value });
                  onApply?.();
                }}
                style={{
                  height: "34px",
                  border: `2px solid ${steering === value ? c.green : c.border}`,
                  borderRadius: "7px", fontSize: "12px", fontWeight: 700,
                  backgroundColor: steering === value ? c.greenBg : c.surface,
                  color: steering === value ? c.greenText : c.muted,
                  cursor: "pointer", fontFamily: "Inter, sans-serif",
                }}
              >
                {label}
              </button>
            ))}
          </div>
          {steering === "" && (
            <p style={{ color: c.muted, fontSize: "11px", marginTop: "8px" }}>
              Tip: East Africa requires <strong>RHD</strong>
            </p>
          )}
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
              type="number" placeholder="Min" value={min}
              onChange={(e) => setMin(e.target.value)}
              style={{
                width: 0, flex: 1, minWidth: 0, height: "36px", fontSize: "13px", outline: "none",
                border: `1px solid ${c.border}`, borderRadius: "6px",
                color: c.body, backgroundColor: c.surface, paddingLeft: "8px",
              }}
            />
            <input
              type="number" placeholder="Max" value={max}
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
            style={{
              backgroundColor: c.primary, color: "#fff", width: "100%", height: "38px",
              borderRadius: "6px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer",
            }}
            className="hover:opacity-90 transition-opacity"
          >
            Apply Filters
          </button>
        </div>
      </div>
    );
  }

  // ── Mobile-only mode ───────────────────────────────────────────────────────
  if (mobileOnly) {
    return (
      <>
        <button
          onClick={() => setMobileOpen(true)}
          style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            height: "36px", padding: "0 14px",
            border: `1px solid ${activeCount > 0 ? c.green : c.border}`,
            borderRadius: "6px", fontSize: "13px", fontWeight: 600,
            color: activeCount > 0 ? c.green : c.primary,
            backgroundColor: activeCount > 0 ? c.greenBg : c.surface,
            cursor: "pointer", fontFamily: "Inter, sans-serif",
          }}
          className="md:hidden"
        >
          <SlidersHorizontal style={{ width: "14px", height: "14px" }} />
          Filters{activeCount > 0 ? ` (${activeCount})` : ""}
        </button>

        {mobileOpen && (
          <div style={{ position: "fixed", inset: 0, zIndex: 50 }} className="md:hidden">
            <div
              style={{ position: "absolute", inset: 0, backgroundColor: "rgba(0,0,0,0.5)" }}
              onClick={() => setMobileOpen(false)}
            />
            <div
              style={{
                position: "absolute", bottom: 0, left: 0, right: 0,
                backgroundColor: "#fff", borderRadius: "20px 20px 0 0",
                maxHeight: "90vh", overflowY: "auto", padding: "20px",
              }}
            >
              {/* Sheet header */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
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

              {/* Toggle + search inside sheet */}
              <TypeToggle onApply={() => setMobileOpen(false)} />
              <SearchBar onApply={() => setMobileOpen(false)} />
              <FilterBody onApply={() => setMobileOpen(false)} />
            </div>
          </div>
        )}
      </>
    );
  }

  // ── Desktop sidebar mode ───────────────────────────────────────────────────
  return (
    <div style={{ fontFamily: "Inter, sans-serif" }}>

      {/* Toggle — above "Filters" title */}
      <TypeToggle />

      {/* Search bar */}
      <SearchBar />

      {/* Filters header */}
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
