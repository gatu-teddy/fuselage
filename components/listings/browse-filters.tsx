"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, X } from "lucide-react";
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
}

const availabilityOptions = [
  { value: "in_stock",  label: "At Port / In Stock" },
  { value: "en_route",  label: "In Transit" },
  { value: "pre_order", label: "Pre-Order" },
];

export function BrowseFilters({ currentParams }: Props) {
  const router = useRouter();
  const [type, setType]               = useState(currentParams.type ?? "");
  const [make, setMake]               = useState(currentParams.make ?? "");
  const [makeSearch, setMakeSearch]   = useState(currentParams.make ?? "");
  const [availability, setAvailability] = useState(currentParams.availability ?? "");
  const [port, setPort]               = useState(currentParams.port ?? "");
  const [min, setMin]                 = useState(currentParams.min ?? "");
  const [max, setMax]                 = useState(currentParams.max ?? "");

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

      {/* ── Vetting Status ─────────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
        <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
          Vetting Status
        </p>
        <div className="space-y-2.5">
          {[
            { value: "car",  label: "Elite Vetted (Cars)" },
            { value: "bike", label: "Vetted (Bikes)" },
          ].map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer group">
              <div
                onClick={() => {
                  const next = type === value ? "" : value;
                  setType(next);
                  setMake("");
                  setMakeSearch("");
                  apply({ type: next, make: "" });
                }}
                style={{
                  width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
                  border: `2px solid ${type === value ? c.green : c.border}`,
                  backgroundColor: type === value ? c.green : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {type === value && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ color: c.body }} className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Logistics Status ───────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
        <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
          Logistics Status
        </p>
        <div className="space-y-2.5">
          {availabilityOptions.map(({ value, label }) => (
            <label key={value} className="flex items-center gap-2.5 cursor-pointer">
              <div
                onClick={() => {
                  const next = availability === value ? "" : value;
                  setAvailability(next);
                  apply({ availability: next });
                }}
                style={{
                  width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
                  border: `2px solid ${availability === value ? c.green : c.border}`,
                  backgroundColor: availability === value ? c.green : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {availability === value && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ color: c.body }} className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Make / Model ───────────────────────────────────────────────── */}
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
              <div
                onClick={() => {
                  const next = make === m ? "" : m;
                  setMake(next);
                  apply({ make: next });
                }}
                style={{
                  width: "16px", height: "16px", borderRadius: "4px", flexShrink: 0,
                  border: `2px solid ${make === m ? c.green : c.border}`,
                  backgroundColor: make === m ? c.green : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer",
                }}
              >
                {make === m && (
                  <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                    <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </div>
              <span style={{ color: c.body }} className="text-sm">{m}</span>
            </label>
          ))}
        </div>
      </div>

      {/* ── Region ─────────────────────────────────────────────────────── */}
      <div style={{ borderBottom: `1px solid ${c.border}` }} className="pb-5 mb-5">
        <p style={{ color: c.primary }} className="text-xs font-semibold uppercase tracking-widest mb-3">
          Region
        </p>
        <select
          value={port || ""}
          onChange={(e) => { setPort(e.target.value); apply({ port: e.target.value }); }}
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

      {/* ── Price Range ────────────────────────────────────────────────── */}
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
              flex: 1, height: "36px", fontSize: "14px", outline: "none",
              border: `1px solid ${c.border}`, borderRadius: "6px",
              color: c.body, backgroundColor: c.surface, paddingLeft: "10px",
            }}
          />
          <input
            type="number"
            placeholder="Max"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            style={{
              flex: 1, height: "36px", fontSize: "14px", outline: "none",
              border: `1px solid ${c.border}`, borderRadius: "6px",
              color: c.body, backgroundColor: c.surface, paddingLeft: "10px",
            }}
          />
        </div>
        <button
          onClick={() => apply()}
          style={{ backgroundColor: c.primary, color: "#fff", width: "100%", height: "38px", borderRadius: "6px", fontSize: "13px", fontWeight: 600 }}
          className="hover:opacity-90 transition-opacity"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
}
