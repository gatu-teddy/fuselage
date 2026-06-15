"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { c } from "@/lib/tokens";
import { KYC_DOC_LABELS, type KycDocType } from "@/lib/types/index";
import {
  ShieldCheck, Clock, CheckCircle2, XCircle,
  ExternalLink, ChevronDown,
} from "lucide-react";

interface KycRow {
  id:                   string;
  full_name:            string;
  email:                string;
  country?:             string;
  kyc_status:           string;
  kyc_doc_type?:        string;
  kyc_doc_url?:         string;
  kyc_submitted_at?:    string;
  kyc_verified_at?:     string;
  kyc_rejection_reason?: string;
}

interface Props {
  pending: KycRow[];
  recent:  KycRow[];
}

function fmt(dateStr?: string | null) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

export function KycReviewQueue({ pending, recent }: Props) {
  const router                   = useRouter();
  const [acting, setActing]       = useState<string | null>(null);
  const [rejReason, setRejReason] = useState<Record<string, string>>({});
  const [showRej, setShowRej]     = useState<Record<string, boolean>>({});
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  async function getDocUrl(userId: string, docPath: string) {
    if (signedUrls[userId]) { window.open(signedUrls[userId], "_blank", "noopener"); return; }
    const supabase = createClient();
    const { data } = await supabase.storage.from("kyc-documents").createSignedUrl(docPath, 3600);
    if (data?.signedUrl) {
      setSignedUrls((p) => ({ ...p, [userId]: data.signedUrl }));
      window.open(data.signedUrl, "_blank", "noopener");
    }
  }

  async function approve(userId: string) {
    setActing(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({
      kyc_status:      "verified",
      kyc_verified_at: new Date().toISOString(),
    }).eq("id", userId);
    setActing(null);
    router.refresh();
  }

  async function reject(userId: string) {
    const reason = rejReason[userId]?.trim();
    if (!reason) { setShowRej((p) => ({ ...p, [userId]: true })); return; }
    setActing(userId);
    const supabase = createClient();
    await supabase.from("profiles").update({
      kyc_status:           "rejected",
      kyc_rejection_reason: reason,
    }).eq("id", userId);
    setActing(null);
    setShowRej((p) => ({ ...p, [userId]: false }));
    setRejReason((p) => ({ ...p, [userId]: "" }));
    router.refresh();
  }

  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh", fontFamily: "Inter, sans-serif" }}>
      <div className="max-w-[1100px] mx-auto px-8 py-10">

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "6px" }}>
            <ShieldCheck style={{ color: c.primary, width: "24px", height: "24px" }} />
            <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.4px" }}>
              Buyer KYC Review
            </h1>
          </div>
          <p style={{ color: c.muted, fontSize: "14px" }}>
            {pending.length} pending · {recent.filter(r => r.kyc_status === "verified").length} verified
          </p>
        </div>

        {/* Pending queue */}
        <section style={{ marginBottom: "48px" }}>
          <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
            Pending review ({pending.length})
          </p>

          {pending.length === 0 && (
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "40px", textAlign: "center" }}>
              <CheckCircle2 style={{ color: c.green, width: "32px", height: "32px", margin: "0 auto 12px" }} />
              <p style={{ color: c.muted, fontSize: "14px" }}>No pending submissions. All caught up.</p>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {pending.map((row) => (
              <div
                key={row.id}
                style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "20px" }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" }}>

                  {/* Identity */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span style={{ color: c.primary, fontSize: "15px", fontWeight: 700 }}>{row.full_name}</span>
                      <span style={{ backgroundColor: c.amberBg, color: c.amber, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <Clock style={{ width: "9px", height: "9px" }} /> Pending
                      </span>
                    </div>
                    <p style={{ color: c.muted, fontSize: "12px" }}>{row.email}{row.country ? ` · ${row.country}` : ""}</p>
                    <p style={{ color: c.muted, fontSize: "12px", marginTop: "2px" }}>
                      {row.kyc_doc_type ? KYC_DOC_LABELS[row.kyc_doc_type as KycDocType] : "—"} · Submitted {fmt(row.kyc_submitted_at)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    {row.kyc_doc_url && (
                      <button
                        onClick={() => getDocUrl(row.id, row.kyc_doc_url!)}
                        style={{ display: "flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 14px", backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "6px", fontSize: "12px", fontWeight: 600, color: c.primary, cursor: "pointer" }}
                      >
                        <ExternalLink style={{ width: "12px", height: "12px" }} /> View document
                      </button>
                    )}
                    <button
                      onClick={() => approve(row.id)}
                      disabled={acting === row.id}
                      style={{ display: "flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 16px", backgroundColor: c.green, border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: "#fff", cursor: acting === row.id ? "not-allowed" : "pointer", opacity: acting === row.id ? 0.6 : 1 }}
                    >
                      <CheckCircle2 style={{ width: "13px", height: "13px" }} /> Approve
                    </button>
                    <button
                      onClick={() => setShowRej((p) => ({ ...p, [row.id]: !p[row.id] }))}
                      style={{ display: "flex", alignItems: "center", gap: "6px", height: "34px", padding: "0 16px", backgroundColor: c.redBg, border: `1px solid ${c.redBorder}`, borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: c.red, cursor: "pointer" }}
                    >
                      <XCircle style={{ width: "13px", height: "13px" }} /> Reject
                      <ChevronDown style={{ width: "12px", height: "12px", transform: showRej[row.id] ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }} />
                    </button>
                  </div>
                </div>

                {/* Rejection reason input */}
                {showRej[row.id] && (
                  <div style={{ borderTop: `1px solid ${c.redBorder}`, marginTop: "14px", paddingTop: "14px" }}>
                    <label style={{ color: c.red, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
                      Rejection reason (shown to buyer)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Document unclear, please resubmit with a higher quality scan…"
                      value={rejReason[row.id] ?? ""}
                      onChange={(e) => setRejReason((p) => ({ ...p, [row.id]: e.target.value }))}
                      style={{ width: "100%", border: `1px solid ${c.redBorder}`, borderRadius: "6px", padding: "8px 12px", fontSize: "13px", resize: "vertical", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box", color: c.primary }}
                    />
                    <button
                      onClick={() => reject(row.id)}
                      disabled={acting === row.id}
                      style={{ marginTop: "8px", height: "32px", padding: "0 16px", backgroundColor: c.red, border: "none", borderRadius: "6px", fontSize: "12px", fontWeight: 700, color: "#fff", cursor: "pointer", opacity: acting === row.id ? 0.6 : 1 }}
                    >
                      {acting === row.id ? "Saving…" : "Confirm rejection"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Recent decisions */}
        {recent.length > 0 && (
          <section>
            <p style={{ color: c.muted, fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "12px" }}>
              Recent decisions
            </p>
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden" }}>
              {recent.map((row, i) => (
                <div
                  key={row.id}
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px",
                    padding: "14px 20px",
                    borderBottom: i < recent.length - 1 ? `1px solid ${c.border}` : "none",
                  }}
                >
                  <div>
                    <span style={{ color: c.primary, fontSize: "13px", fontWeight: 600 }}>{row.full_name}</span>
                    <span style={{ color: c.muted, fontSize: "12px", marginLeft: "8px" }}>{row.email}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: c.muted, fontSize: "11px" }}>
                      {row.kyc_doc_type ? KYC_DOC_LABELS[row.kyc_doc_type as KycDocType] : "—"}
                    </span>
                    {row.kyc_status === "verified" ? (
                      <span style={{ backgroundColor: c.greenBg, color: c.greenText, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <CheckCircle2 style={{ width: "9px", height: "9px" }} /> Verified
                      </span>
                    ) : (
                      <span style={{ backgroundColor: c.redBg, color: c.red, fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "99px", display: "flex", alignItems: "center", gap: "4px" }}>
                        <XCircle style={{ width: "9px", height: "9px" }} /> Rejected
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
