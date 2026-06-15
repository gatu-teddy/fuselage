"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { c } from "@/lib/tokens";
import { KYC_DOC_LABELS, type KycStatus, type KycDocType } from "@/lib/types/index";
import {
  ShieldCheck, Clock, XCircle, CheckCircle2,
  Upload, FileText, ChevronDown, AlertTriangle,
} from "lucide-react";

interface Props {
  userId:              string;
  kycStatus:           KycStatus;
  kycDocType:          KycDocType | null;
  kycSubmittedAt:      string | null;
  kycVerifiedAt:       string | null;
  kycRejectionReason:  string | null;
}

const DOC_TYPES: KycDocType[] = ["passport", "national_id", "drivers_licence", "business_reg"];

export function KycForm({ userId, kycStatus, kycDocType, kycSubmittedAt, kycVerifiedAt, kycRejectionReason }: Props) {
  const router   = useRouter();
  const fileRef  = useRef<HTMLInputElement>(null);

  const [docType,    setDocType]    = useState<KycDocType | "">(kycDocType ?? "");
  const [file,       setFile]       = useState<File | null>(null);
  const [uploading,  setUploading]  = useState(false);
  const [error,      setError]      = useState("");
  const [submitted,  setSubmitted]  = useState(false);

  // If already submitted this session
  const status = submitted ? "pending" : kycStatus;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file)    { setError("Please select a document to upload."); return; }
    if (!docType) { setError("Please select a document type.");      return; }
    setUploading(true); setError("");

    const supabase = createClient();
    const ext  = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${userId}/${Date.now()}.${ext}`;

    const { error: storageErr } = await supabase.storage
      .from("kyc-documents")
      .upload(path, file, { contentType: file.type, upsert: true });

    if (storageErr) {
      setError("Upload failed — please try again.");
      setUploading(false);
      return;
    }

    const { error: dbErr } = await supabase
      .from("profiles")
      .update({
        kyc_status:       "pending",
        kyc_doc_type:     docType,
        kyc_doc_url:      path,
        kyc_submitted_at: new Date().toISOString(),
      })
      .eq("id", userId);

    if (dbErr) {
      setError("Failed to save submission — please try again.");
      setUploading(false);
      return;
    }

    setSubmitted(true);
    setUploading(false);
    router.refresh();
  }

  // ── Verified ──────────────────────────────────────────────────────────────
  if (status === "verified") {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div style={{ backgroundColor: c.greenBg, border: `1px solid #6EE7B7`, borderRadius: "16px", padding: "40px", textAlign: "center" }}>
          <div style={{ backgroundColor: "#fff", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 4px 12px rgba(16,185,129,0.2)" }}>
            <ShieldCheck style={{ color: c.green, width: "32px", height: "32px" }} />
          </div>
          <h1 style={{ color: c.greenText, fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>
            Identity Verified
          </h1>
          <p style={{ color: c.greenText, fontSize: "14px", lineHeight: 1.6, marginBottom: "24px" }}>
            Your identity has been verified. Sellers on Fuselage can see your Verified Buyer badge,
            giving you credibility and priority responses.
          </p>
          <div style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#fff", borderRadius: "8px", padding: "10px 20px" }}>
            <CheckCircle2 style={{ color: c.green, width: "16px", height: "16px" }} />
            <span style={{ color: c.greenText, fontSize: "13px", fontWeight: 700 }}>
              Verified Buyer · {kycVerifiedAt ? new Date(kycVerifiedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }) : ""}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // ── Pending ───────────────────────────────────────────────────────────────
  if (status === "pending") {
    return (
      <div className="max-w-xl mx-auto px-6 py-16">
        <div style={{ backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "16px", padding: "40px", textAlign: "center" }}>
          <div style={{ backgroundColor: "#fff", width: "64px", height: "64px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Clock style={{ color: c.amber, width: "32px", height: "32px" }} />
          </div>
          <h1 style={{ color: "#92400E", fontSize: "22px", fontWeight: 800, marginBottom: "8px" }}>
            Verification In Review
          </h1>
          <p style={{ color: "#92400E", fontSize: "14px", lineHeight: 1.6, marginBottom: "8px" }}>
            Your {kycDocType ? KYC_DOC_LABELS[kycDocType] : "document"} was submitted and is being reviewed by our team.
            This typically takes 1–2 business days.
          </p>
          {kycSubmittedAt && (
            <p style={{ color: c.amber, fontSize: "12px" }}>
              Submitted {new Date(kycSubmittedAt).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
            </p>
          )}
        </div>
      </div>
    );
  }

  // ── Rejected ──────────────────────────────────────────────────────────────
  const isRejected = status === "rejected";

  // ── Unverified / Rejected — show form ────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto px-6 py-12">

      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
          <div style={{ backgroundColor: c.bgDim, width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${c.border}` }}>
            <ShieldCheck style={{ color: c.primary, width: "22px", height: "22px" }} />
          </div>
          <div>
            <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.4px" }}>
              {isRejected ? "Resubmit Verification" : "Verify Your Identity"}
            </h1>
            <p style={{ color: c.muted, fontSize: "13px", marginTop: "2px" }}>
              One-time check · takes less than 2 minutes
            </p>
          </div>
        </div>

        {/* Rejection notice */}
        {isRejected && kycRejectionReason && (
          <div style={{ backgroundColor: c.redBg, border: `1px solid ${c.redBorder}`, borderRadius: "8px", padding: "14px 16px", marginBottom: "20px", display: "flex", gap: "10px" }}>
            <XCircle style={{ color: c.red, width: "16px", height: "16px", flexShrink: 0, marginTop: "1px" }} />
            <div>
              <p style={{ color: c.red, fontSize: "13px", fontWeight: 700, marginBottom: "4px" }}>Previous submission rejected</p>
              <p style={{ color: c.red, fontSize: "12px", lineHeight: 1.6 }}>{kycRejectionReason}</p>
            </div>
          </div>
        )}

        {/* Why verify */}
        <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "10px", padding: "16px 18px" }}>
          <p style={{ color: c.primary, fontSize: "12px", fontWeight: 700, marginBottom: "10px" }}>Why verify?</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {[
              ["Verified Buyer badge", "Displayed to sellers on every deal — builds instant credibility"],
              ["Priority responses", "Verified buyers receive faster replies from exporters"],
              ["Trust agent protection", "Fuselage can mediate disputes on your behalf with verified identity on file"],
              ["One time only",  "Consent is stored. You won't be asked again"],
            ].map(([title, body]) => (
              <div key={title} style={{ display: "flex", gap: "8px" }}>
                <CheckCircle2 style={{ color: c.green, width: "13px", height: "13px", flexShrink: 0, marginTop: "3px" }} />
                <p style={{ color: c.body, fontSize: "12px", lineHeight: 1.5 }}>
                  <strong>{title}</strong> — {body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>

        {/* Document type */}
        <div>
          <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Document type <span style={{ color: c.red }}>*</span>
          </label>
          <div style={{ position: "relative" }}>
            <select
              value={docType}
              onChange={(e) => { setDocType(e.target.value as KycDocType); setError(""); }}
              required
              style={{
                width: "100%", height: "44px",
                border: `1px solid ${c.border}`, borderRadius: "8px",
                paddingLeft: "12px", paddingRight: "32px",
                fontSize: "14px", color: docType ? c.primary : c.muted,
                backgroundColor: c.surface, appearance: "none", outline: "none",
                fontFamily: "Inter, sans-serif",
              }}
            >
              <option value="" disabled>Select document type…</option>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>{KYC_DOC_LABELS[t]}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-3 h-4 w-4 pointer-events-none" style={{ color: c.muted }} />
          </div>
          {docType === "business_reg" && (
            <p style={{ color: c.muted, fontSize: "11px", marginTop: "5px" }}>
              For company registration, please upload your certificate of incorporation or equivalent trade licence.
            </p>
          )}
        </div>

        {/* File upload */}
        <div>
          <label style={{ color: c.primary, fontSize: "13px", fontWeight: 600, display: "block", marginBottom: "6px" }}>
            Upload document <span style={{ color: c.red }}>*</span>
          </label>
          <div
            onClick={() => fileRef.current?.click()}
            style={{
              border: `2px dashed ${file ? c.green : c.border}`,
              borderRadius: "10px", padding: "24px",
              cursor: "pointer", backgroundColor: file ? c.greenBg : c.bgDim,
              display: "flex", flexDirection: "column", alignItems: "center", gap: "10px",
              transition: "border-color 0.15s, background-color 0.15s",
            }}
          >
            {file ? (
              <>
                <CheckCircle2 style={{ color: c.green, width: "28px", height: "28px" }} />
                <p style={{ color: c.primary, fontSize: "13px", fontWeight: 600, textAlign: "center" }}>{file.name}</p>
                <p style={{ color: c.muted, fontSize: "11px" }}>Click to change file</p>
              </>
            ) : (
              <>
                <div style={{ backgroundColor: c.surface, width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", border: `1px solid ${c.border}` }}>
                  <Upload style={{ color: c.muted, width: "20px", height: "20px" }} />
                </div>
                <div style={{ textAlign: "center" }}>
                  <p style={{ color: c.primary, fontSize: "13px", fontWeight: 600 }}>Click to upload</p>
                  <p style={{ color: c.muted, fontSize: "12px", marginTop: "2px" }}>PDF, JPG, PNG, WEBP · max 10 MB</p>
                </div>
              </>
            )}
          </div>
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            className="hidden"
            onChange={(e) => { setFile(e.target.files?.[0] ?? null); setError(""); }}
          />
        </div>

        {/* Privacy note */}
        <div style={{ backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "8px", padding: "12px 14px", display: "flex", gap: "10px" }}>
          <FileText style={{ color: c.muted, width: "14px", height: "14px", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: c.muted, fontSize: "12px", lineHeight: 1.6 }}>
            Your document is stored in an encrypted, private vault. It is never shared with sellers
            or third parties. Fuselage staff access it only to verify your identity and for legal
            cooperation if required. See our{" "}
            <a href="/privacy" style={{ color: c.blue, textDecoration: "none" }}>Privacy Policy</a>.
          </p>
        </div>

        {/* Warning */}
        <div style={{ display: "flex", gap: "8px", alignItems: "flex-start" }}>
          <AlertTriangle style={{ color: c.amber, width: "14px", height: "14px", flexShrink: 0, marginTop: "2px" }} />
          <p style={{ color: c.muted, fontSize: "12px", lineHeight: 1.6 }}>
            Submitting false or third-party documents is a violation of Fuselage&apos;s Terms of Service
            and may result in permanent account suspension and referral to relevant authorities.
          </p>
        </div>

        {error && (
          <p style={{ color: c.red, fontSize: "13px" }}>{error}</p>
        )}

        <button
          type="submit"
          disabled={uploading}
          style={{
            backgroundColor: uploading ? c.muted : c.primary,
            color: "#fff", border: "none", borderRadius: "8px",
            height: "48px", fontSize: "15px", fontWeight: 700,
            cursor: uploading ? "not-allowed" : "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            transition: "opacity 0.15s",
          }}
        >
          <ShieldCheck style={{ width: "18px", height: "18px" }} />
          {uploading ? "Uploading…" : "Submit for verification"}
        </button>
      </form>
    </div>
  );
}
