"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { c } from "@/lib/tokens";

// ── Inner component uses useSearchParams (must be wrapped in Suspense) ────────
function Toggle({ currentType }: { currentType?: string }) {
  const router      = useRouter();
  const searchParams = useSearchParams();

  function switchType(next: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (next) {
      params.set("type", next);
    } else {
      params.delete("type");
    }
    // Clear make when switching type — bike/car makes differ
    params.delete("make");
    router.push(`/browse?${params.toString()}`);
  }

  const active = currentType ?? "";

  const tabs = [
    { value: "car",  label: "Cars",        emoji: "🚗" },
    { value: "bike", label: "Motorbikes",   emoji: "🏍️" },
  ] as const;

  return (
    <div
      style={{
        display: "inline-flex",
        gap: "4px",
        padding: "4px",
        backgroundColor: c.bgDim,
        border: `1px solid ${c.border}`,
        borderRadius: "12px",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {tabs.map(({ value, label, emoji }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            onClick={() => switchType(isActive ? "" : value)}
            style={{
              display:       "inline-flex",
              alignItems:    "center",
              gap:           "7px",
              height:        "40px",
              padding:       "0 20px",
              borderRadius:  "9px",
              border:        "none",
              cursor:        "pointer",
              fontSize:      "14px",
              fontWeight:    isActive ? 700 : 500,
              transition:    "all 0.15s ease",
              backgroundColor: isActive ? c.primary  : "transparent",
              color:           isActive ? "#ffffff"  : c.muted,
              fontFamily:    "Inter, sans-serif",
              boxShadow:     isActive ? "0 1px 4px rgba(15,23,42,0.15)" : "none",
            }}
          >
            <span style={{ fontSize: "16px", lineHeight: 1 }}>{emoji}</span>
            {label}
            {isActive && (
              <span
                style={{
                  display:         "inline-flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                  width:           "6px",
                  height:          "6px",
                  borderRadius:    "50%",
                  backgroundColor: c.green,
                  flexShrink:      0,
                }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

// ── Public export wraps in Suspense (required for useSearchParams in RSC tree) ─
export function VehicleTypeToggle({ currentType }: { currentType?: string }) {
  return (
    <Suspense fallback={<div style={{ height: "48px" }} />}>
      <Toggle currentType={currentType} />
    </Suspense>
  );
}
