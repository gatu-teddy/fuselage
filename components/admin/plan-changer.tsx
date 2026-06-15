"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getPlan } from "@/lib/plans";

interface Props {
  sellerId: string;
  currentPlan: string;
}

export function PlanChanger({ sellerId, currentPlan }: Props) {
  const router  = useRouter();
  const [plan,    setPlan]    = useState(currentPlan);
  const [saving,  setSaving]  = useState(false);
  const [open,    setOpen]    = useState(false);

  // Derive styles directly from the plan definitions — no local duplicate map needed
  const s = getPlan(plan);

  async function changePlan(next: string) {
    if (next === plan) { setOpen(false); return; }
    setSaving(true);
    setOpen(false);
    await fetch("/api/admin/update-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sellerId, plan: next }),
    });
    setPlan(next);
    setSaving(false);
    router.refresh();
  }

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={saving}
        style={{
          backgroundColor: s.bg,
          color: s.textColor,
          border: `1px solid ${s.border}`,
          borderRadius: "99px",
          fontSize: "11px",
          fontWeight: 700,
          padding: "3px 10px",
          cursor: saving ? "not-allowed" : "pointer",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {saving ? "Saving…" : plan}
      </button>

      {open && (
        <>
          <div
            style={{ position: "fixed", inset: 0, zIndex: 40 }}
            onClick={() => setOpen(false)}
          />
          <div
            style={{
              position: "absolute",
              top: "calc(100% + 6px)",
              right: 0,
              zIndex: 50,
              backgroundColor: "#fff",
              border: "1px solid #E2E8F0",
              borderRadius: "8px",
              boxShadow: "0 4px 16px rgba(0,0,0,0.10)",
              overflow: "hidden",
              minWidth: "130px",
              fontFamily: "Inter, sans-serif",
            }}
          >
            {(["free", "growth", "enterprise"] as const).map((pk) => {
              const ps = getPlan(pk);
              return (
                <button
                  key={pk}
                  onClick={() => changePlan(pk)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 14px",
                    fontSize: "13px",
                    fontWeight: pk === plan ? 700 : 400,
                    color: ps.textColor,
                    backgroundColor: pk === plan ? ps.bg : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    textTransform: "capitalize",
                  }}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  {pk === plan ? `✓ ${pk}` : pk}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
