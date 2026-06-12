"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const PLAN_STYLES: Record<string, { color: string; bg: string; border: string }> = {
  free:       { color: "#334155", bg: "#F1F5F9", border: "#CBD5E1" },
  growth:     { color: "#1D4ED8", bg: "#DBEAFE", border: "#BFDBFE" },
  enterprise: { color: "#6D28D9", bg: "#EDE9FE", border: "#DDD6FE" },
};

interface Props {
  sellerId: string;
  currentPlan: string;
}

export function PlanChanger({ sellerId, currentPlan }: Props) {
  const router  = useRouter();
  const [plan,    setPlan]    = useState(currentPlan);
  const [saving,  setSaving]  = useState(false);
  const [open,    setOpen]    = useState(false);

  const s = PLAN_STYLES[plan] ?? PLAN_STYLES.free;

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
          color: s.color,
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
            {(["free", "growth", "enterprise"] as const).map((p) => {
              const ps = PLAN_STYLES[p];
              return (
                <button
                  key={p}
                  onClick={() => changePlan(p)}
                  style={{
                    display: "block",
                    width: "100%",
                    textAlign: "left",
                    padding: "9px 14px",
                    fontSize: "13px",
                    fontWeight: p === plan ? 700 : 400,
                    color: ps.color,
                    backgroundColor: p === plan ? ps.bg : "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontFamily: "Inter, sans-serif",
                    textTransform: "capitalize",
                  }}
                  className="hover:bg-[#F8FAFC] transition-colors"
                >
                  {p === plan ? `✓ ${p}` : p}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
