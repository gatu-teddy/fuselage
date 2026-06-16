"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { c } from "@/lib/tokens";
import { AlertTriangle, CheckCircle2, ExternalLink, ChevronDown, Snowflake, Download } from "lucide-react";
import type { DisputeStatus } from "@/lib/types";

interface DisputeRow {
  id:             string;
  deal_id:        string;
  raised_by_role: "buyer" | "seller";
  reason:         string;
  status:         DisputeStatus;
  admin_notes?:   string;
  created_at:     string;
  resolved_at?:   string;
  raiser?: { full_name: string; email: string; country?: string };
}

interface Props {
  open:    DisputeRow[];
  closed:  DisputeRow[];
  adminId: string;
}

function fmt(s: string) {
  return new Date(s).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_COLOURS: Record<DisputeStatus, { bg: string; text: string; label: string }> = {
  open:         { bg: c.redBg,   text: c.red,       label: "Open"         },
  under_review: { bg: c.amberBg, text: c.amber,     label: "Under review" },
  resolved:     { bg: c.greenBg, text: c.greenText,  label: "Resolved"     },
  closed:       { bg: c.bgDim,   text: c.muted,     label: "Closed"       },
};

export function DisputeQueue({ open, closed, adminId }: Props) {
  const router  = useRouter();
  const [acting, setActing] = useState<string | null>(null);
  const [notes,  setNotes]  = useState<Record<string, string>>({});
  const [showNotes, setShowNotes] = useState<Record<string, boolean>>({});

  async function updateDispute(id: string, status: DisputeStatus, dealId: string, freeze?: boolean) {
    setActing(id);
    const supabase = createClient();
    await supabase.from("disputes").update({
      status,
      admin_notes: notes[id]?.trim() || null,
      resolved_by: status === "resolved" || status === "closed" ? adminId : null,
      resolved_at: status === "resolved" || status === "closed" ? new Date().toISOString() : null,
    }).eq("id", id);

    if (freeze !== undefined) {
      await supabase.from("deals").update({
        is_frozen:     freeze,
        frozen_reason: freeze
          ? `This deal has been frozen by Fuselage admin pending dispute investigation. Ref: ${id.slice(0, 8).toUpperCase()}`
          : null,
      }).eq("id", dealId);
    }

    setActing(null);
    router.refresh();
  }

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1100px] mx-auto px-8 py-10">

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <AlertTriangle style={{ color: c.amber, width: "24px", height: "24px" }} />
            <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.4px" }}>
              Dispute Resolution
            </h1>
          </div>
          <p style={{ color: c.muted, fontSize: "14px" }}>
            {open.length} active · {closed.length} recently resolved
          </p>
        </div>

        {/* Active disputes */}
        <section style={{ marginBottom: "48px" }}>
          <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Active disputes ({open.length})
          </p>

          {open.length === 0 && (
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "40px", textAlign: "center" }}>
              <CheckCircle2 style={{ color: c.green, width: "32px", height: "32px", margin: "0 auto 12px" }} />
              <p style={{ color: c.muted, fontSize: "14px" }}>No active disputes.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {open.map((d) => {
              const col = STATUS_COLOURS[d.status];
              return (
                <div key={d.id} style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: "200px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                        <span style={{ color: c.primary, fontSize: "14px", fontWeight: 700 }}>{d.raiser?.full_name}</span>
                        <span style={{ backgroundColor: col.bg, color: col.text, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px" }}>
                          {col.label}
                        </span>
                        <span style={{ backgroundColor: c.bgDim, color: c.muted, fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "99px" }}>
                          {d.raised_by_role}
                        </span>
                      </div>
                      <p style={{ color: c.muted, fontSize: "12px", marginBottom: "8px" }}>{d.raiser?.email}{d.raiser?.country ? ` · ${d.raiser.country}` : ""}</p>
                      <p style={{ color: c.body, fontSize: "13px", lineHeight: 1.6, backgroundColor: c.bgDim, borderRadius: "6px", padding: "10px 12px" }}>{d.reason}</p>
                      <p style={{ color: c.muted, fontSize: "11px", marginTop: "8px" }}>
                        Raised {fmt(d.created_at)} · Deal <a href={`/admin/deals/${d.deal_id}`} style={{ color: c.blue, fontWeight: 600, textDecoration: "none" }}>{d.deal_id.slice(0, 8).toUpperCase()}</a>
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", minWidth: "160px" }}>
                      <a
                        href={`/buyer/deals/${d.deal_id}`}
                        target="_blank"
                        rel="noopener"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", padding: "0 14px", backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: c.primary, textDecoration: "none" }}
                      >
                        <ExternalLink style={{ width: "12px", height: "12px" }} /> View deal
                      </a>
                      <a
                        href={`/api/admin/deals/${d.deal_id}/export`}
                        target="_blank"
                        rel="noopener"
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", padding: "0 14px", backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: c.primary, textDecoration: "none" }}
                      >
                        <Download style={{ width: "12px", height: "12px" }} /> Export docs
                      </a>
                      <button
                        onClick={() => updateDispute(d.id, "under_review", d.deal_id, true)}
                        disabled={acting === d.id || d.status === "under_review"}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", padding: "0 14px", backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: c.amber, cursor: "pointer", opacity: (acting === d.id || d.status === "under_review") ? 0.5 : 1 }}
                      >
                        <Snowflake style={{ width: "12px", height: "12px" }} /> Freeze deal
                      </button>
                      <button
                        onClick={() => setShowNotes((p) => ({ ...p, [d.id]: !p[d.id] }))}
                        style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", height: "34px", padding: "0 14px", backgroundColor: c.greenBg, border: `1px solid #6EE7B7`, borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: c.greenText, cursor: "pointer" }}
                      >
                        <CheckCircle2 style={{ width: "12px", height: "12px" }} /> Resolve
                        <ChevronDown style={{ width: "11px", height: "11px", transform: showNotes[d.id] ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }} />
                      </button>
                    </div>
                  </div>

                  {/* Resolution notes */}
                  {showNotes[d.id] && (
                    <div style={{ borderTop: `1px solid ${c.border}`, marginTop: "14px", paddingTop: "14px" }}>
                      <label style={{ color: c.primary, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                        Admin notes (optional — visible to admin only)
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Outcome notes, actions taken…"
                        value={notes[d.id] ?? ""}
                        onChange={(e) => setNotes((p) => ({ ...p, [d.id]: e.target.value }))}
                        style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: "6px", padding: "8px 12px", fontSize: "13px", resize: "vertical", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box", color: c.primary }}
                      />
                      <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                        <button
                          onClick={() => updateDispute(d.id, "resolved", d.deal_id, false)}
                          disabled={acting === d.id}
                          style={{ height: "32px", padding: "0 16px", backgroundColor: c.green, border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: "#fff", cursor: "pointer", opacity: acting === d.id ? 0.6 : 1 }}
                        >
                          {acting === d.id ? "Saving…" : "Mark resolved & unfreeze"}
                        </button>
                        <button
                          onClick={() => updateDispute(d.id, "closed", d.deal_id, false)}
                          disabled={acting === d.id}
                          style={{ height: "32px", padding: "0 16px", backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: c.muted, cursor: "pointer" }}
                        >
                          Close without action
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Closed disputes */}
        {closed.length > 0 && (
          <section>
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
              Recently closed
            </p>
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
              {closed.map((d, i) => {
                const col = STATUS_COLOURS[d.status];
                return (
                  <div key={d.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", padding: "13px 20px", borderBottom: i < closed.length - 1 ? `1px solid ${c.border}` : "none" }}>
                    <div>
                      <span style={{ color: c.primary, fontSize: "13px", fontWeight: 600 }}>{d.raiser?.full_name}</span>
                      <span style={{ color: c.muted, fontSize: "12px", marginLeft: "8px" }}>{d.raiser?.email}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: c.muted, fontSize: "11px" }}>{fmt(d.resolved_at ?? d.created_at)}</span>
                      <span style={{ backgroundColor: col.bg, color: col.text, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px" }}>
                        {col.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
