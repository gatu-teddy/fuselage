"use client";
import { useState, Fragment } from "react";
import { c } from "@/lib/tokens";
import { ShieldCheck, Loader2, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Props {
  chassisNumber: string;
  listingId:     string;
}

type Result = "pending" | "valid" | "flagged" | "invalid" | null;

export function VinVerifyButton({ chassisNumber, listingId }: Props) {
  const [status,  setStatus]  = useState<"idle" | "loading" | "done">("idle");
  const [result,  setResult]  = useState<Result>(null);
  const [decoded, setDecoded] = useState<Record<string, string> | null>(null);
  const [message, setMessage] = useState("");

  async function verify() {
    setStatus("loading");
    try {
      const res = await fetch("/api/verify/vin", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ chassis_number: chassisNumber, listing_id: listingId }),
      });
      const data = await res.json();
      setResult(data.result ?? (res.ok ? "pending" : "flagged"));
      setDecoded(data.decoded ?? null);
      setMessage(data.message ?? "");
      setStatus("done");
    } catch {
      setResult("flagged");
      setMessage("Verification request failed. Please try again.");
      setStatus("done");
    }
  }

  if (status === "idle") {
    return (
      <button
        onClick={verify}
        style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          backgroundColor: c.bgDim, border: `1px solid ${c.border}`,
          color: c.primary, fontSize: "11px", fontWeight: 700,
          padding: "3px 10px", borderRadius: "6px", cursor: "pointer",
          marginLeft: "8px", verticalAlign: "middle",
        }}
      >
        <ShieldCheck style={{ width: "11px", height: "11px", color: c.green }} />
        Verify chassis
      </button>
    );
  }

  if (status === "loading") {
    return (
      <span style={{ marginLeft: "8px", display: "inline-flex", alignItems: "center", gap: "4px", color: c.muted, fontSize: "11px" }}>
        <Loader2 style={{ width: "11px", height: "11px", animation: "spin 1s linear infinite" }} />
        Checking…
      </span>
    );
  }

  // ── Done state ───────────────────────────────────────────────────────────
  const isValid   = result === "valid";
  const isPending = result === "pending";
  const isInvalid = result === "flagged" || result === "invalid";

  const chipBg   = isValid ? c.greenBg   : isPending ? c.amberBg  : c.redBg;
  const chipText = isValid ? c.greenText  : isPending ? "#92400E"  : c.red;
  const chipIcon = isValid
    ? <CheckCircle2 style={{ width: "10px", height: "10px" }} />
    : isPending
    ? <ShieldCheck style={{ width: "10px", height: "10px" }} />
    : <AlertTriangle style={{ width: "10px", height: "10px" }} />;
  const chipLabel = isValid ? "Validated" : isPending ? "Queued for review" : "Flagged";

  return (
    <div style={{ marginTop: "8px" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", backgroundColor: chipBg, color: chipText, fontSize: "10px", fontWeight: 700, padding: "3px 9px", borderRadius: "99px" }}>
        {chipIcon} {chipLabel}
      </span>
      {message && (
        <p style={{ color: c.muted, fontSize: "11px", marginTop: "4px", lineHeight: 1.5 }}>{message}</p>
      )}
      {decoded && Object.keys(decoded).length > 0 && (
        <div style={{ marginTop: "8px", backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "6px", padding: "8px 12px" }}>
          <p style={{ color: c.muted, fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "6px" }}>NHTSA decode</p>
          <dl style={{ display: "grid", gridTemplateColumns: "auto 1fr", gap: "3px 12px" }}>
            {Object.entries(decoded).map(([k, v]) => (
              <Fragment key={k}>
                <dt style={{ color: c.muted, fontSize: "11px" }}>{k}</dt>
                <dd style={{ color: c.primary, fontSize: "11px", fontWeight: 600 }}>{v}</dd>
              </Fragment>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
}
