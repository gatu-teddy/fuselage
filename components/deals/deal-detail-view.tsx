"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  DEAL_STATUS_LABELS, type Deal, type DealStatus,
  type DealDocument, type DocType,
  DOC_TYPE_LABELS, COUNTER_SIGN_TYPES,
} from "@/lib/types";
import { formatUSD, formatDate, getInitials } from "@/lib/utils";
import { DealChatWidget } from "@/components/deals/deal-chat-widget";
import { c } from "@/lib/tokens";
import {
  Upload, CheckCircle2, Clock, MapPin, FileCheck,
  Ship, Package, FileText, AlertTriangle, ExternalLink,
  ChevronDown, PenLine, FileBadge, Info, ShieldCheck,
} from "lucide-react";

// ─── Stitch transit map ─────────────────────────────────────────────────────
const TRANSIT_MAP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA3RCvVB9KWdOWUlooqQyuM_O7rlwpdu-mfagKdUaQUD3ordCamGg4VHmxJDmOvJ6wsk6512pr9J0--q2axmB0CcUrDMJBEpEvYHE7Z_NjahR3FusrfWlRkwINsN1VtnHX6AAq5uM5rGLq3Fv3c2xCWPDn6As0NMJKOSJxYM6mDFmIQW21N8I7L4AIpG0PcdOYhIfeopiyrCQTKkrWyLQo25ZXlbBvu1KY_v0_wRnPuP7AXWc5IsJpiR7ggv1mNZfsbNfYUBN2iFI4";

// ─── Order lifecycle ────────────────────────────────────────────────────────
const LIFECYCLE: { key: DealStatus; label: string }[] = [
  { key: "inquired",          label: "Inquiry Received" },
  { key: "negotiating",       label: "Negotiating" },
  { key: "agreed",            label: "Terms Agreed" },
  { key: "payment_uploaded",  label: "Payment Uploaded" },
  { key: "payment_confirmed", label: "Payment Confirmed" },
  { key: "shipped",           label: "Shipping in Progress" },
  { key: "delivered",         label: "Delivery Confirmed" },
  { key: "completed",         label: "Completed" },
];
const STATUS_ORDER = LIFECYCLE.map((s) => s.key);

const SELLER_NEXT: Partial<Record<DealStatus, DealStatus>> = {
  inquired:          "negotiating",
  negotiating:       "agreed",
  payment_uploaded:  "payment_confirmed",
  payment_confirmed: "shipped",
  shipped:           "delivered",
  delivered:         "completed",
};
const SELLER_LABELS: Partial<Record<DealStatus, string>> = {
  inquired:          "Start negotiation",
  negotiating:       "Mark as agreed",
  payment_uploaded:  "Confirm payment received",
  payment_confirmed: "Mark as shipped",
  shipped:           "Mark as delivered",
  delivered:         "Mark as completed",
};

// ─── Accepted file types ────────────────────────────────────────────────────
const PROOF_ACCEPT = ".pdf,.png,.jpg,.jpeg,.webp";
const DOC_ACCEPT   = ".pdf,.png,.jpg,.jpeg,.webp";

function fileTypeFromMime(file: File): "pdf" | "image" {
  return file.type === "application/pdf" ? "pdf" : "image";
}

// ─── Legal hold panel ───────────────────────────────────────────────────────
// ─── Dispute panel ─────────────────────────────────────────────────────────
function DisputePanel({ dealId, currentUserId, role }: { dealId: string; currentUserId: string; role: "buyer" | "seller" }) {
  const [open,       setOpen]       = useState(false);
  const [reason,     setReason]     = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) { setError("Please describe your dispute."); return; }
    setSubmitting(true); setError("");
    const supabase = createClient();
    const { error: err } = await supabase.from("disputes").insert({
      deal_id:        dealId,
      raised_by:      currentUserId,
      raised_by_role: role,
      reason:         reason.trim(),
    });
    if (err) { setError(err.message); setSubmitting(false); return; }
    setSubmitted(true); setSubmitting(false);
  }

  return (
    <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem", marginTop: "16px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "none", border: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <AlertTriangle className="h-4 w-4" style={{ color: c.amber }} />
          <p style={{ color: c.primary, fontSize: "13px", fontWeight: 700 }}>Raise a dispute</p>
        </div>
        <ChevronDown className="h-4 w-4" style={{ color: c.muted, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${c.border}`, padding: "18px 20px" }}>
          <div style={{ backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ color: "#92400E", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>Before raising a dispute</p>
            <p style={{ color: "#92400E", fontSize: "12px", lineHeight: 1.65 }}>
              Try to resolve the issue through the deal chat first. If you cannot reach an agreement, raising a dispute will flag this deal for Fuselage admin review. The deal may be frozen while the dispute is investigated.
            </p>
          </div>

          {submitted ? (
            <div style={{ backgroundColor: c.greenBg, border: `1px solid #6EE7B7`, borderRadius: "8px", padding: "14px 16px", textAlign: "center" }}>
              <p style={{ color: c.greenText, fontWeight: 700, fontSize: "13px" }}>Dispute raised</p>
              <p style={{ color: c.greenText, fontSize: "12px", marginTop: "4px" }}>A Fuselage admin will review your case and be in touch within 2 business days.</p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {error && <p style={{ color: c.red, fontSize: "12px" }}>{error}</p>}
              <div>
                <label style={{ color: c.body, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                  Describe your dispute <span style={{ color: c.red }}>*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={4}
                  placeholder="What went wrong? What outcome are you seeking?"
                  style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: "6px", padding: "9px 12px", fontSize: "13px", color: c.body, resize: "vertical", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>
              <p style={{ color: c.muted, fontSize: "11px", lineHeight: 1.6 }}>
                By submitting you confirm that the information is accurate. False disputes may result in account suspension.
              </p>
              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: c.amber, color: "#fff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", alignSelf: "flex-start", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Submitting…" : "Raise dispute"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

function LegalPanel({ dealId, currentUserId, role }: { dealId: string; currentUserId: string; role: "buyer" | "seller" }) {
  const [open,       setOpen]       = useState(false);
  const [reason,     setReason]     = useState("");
  const [refNo,      setRefNo]      = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [error,      setError]      = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason.trim()) { setError("Please describe the reason for this request."); return; }
    setSubmitting(true); setError("");

    const supabase = createClient();
    const { error: err } = await supabase.from("legal_hold_requests").insert({
      deal_id:        dealId,
      requested_by:   currentUserId,
      requester_role: role,
      reason:         reason.trim(),
      reference_number: refNo.trim() || null,
    });

    if (err) { setError(err.message); setSubmitting(false); return; }
    setSubmitted(true); setSubmitting(false);
  }

  return (
    <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem", marginTop: "24px" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", background: "none", border: "none", cursor: "pointer" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <FileText className="h-4 w-4" style={{ color: c.muted }} />
          <p style={{ color: c.primary, fontSize: "13px", fontWeight: 700 }}>Legal request / dispute</p>
        </div>
        <ChevronDown className="h-4 w-4" style={{ color: c.muted, transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
      </button>

      {open && (
        <div style={{ borderTop: `1px solid ${c.border}`, padding: "18px 20px" }}>
          {/* Info block */}
          <div style={{ backgroundColor: "#F0F9FF", border: "1px solid #BAE6FD", borderRadius: "8px", padding: "12px 16px", marginBottom: "16px" }}>
            <p style={{ color: "#0369A1", fontSize: "12px", fontWeight: 700, marginBottom: "4px" }}>How conversation records work</p>
            <p style={{ color: "#0369A1", fontSize: "12px", lineHeight: 1.65 }}>
              Every message, status change, payment event, and document upload on this deal is stored in TrueWagon&apos;s immutable audit log and cannot be altered or deleted by either party.
              If you are involved in a legal dispute or have received a request from an authority, submit a legal hold request below.
              TrueWagon will acknowledge within 5 business days and, upon valid legal authority, provide a certified conversation export.
            </p>
          </div>

          {submitted ? (
            <div style={{ backgroundColor: c.greenBg, border: `1px solid #6EE7B7`, borderRadius: "8px", padding: "14px 16px", textAlign: "center" }}>
              <p style={{ color: c.greenText, fontWeight: 700, fontSize: "13px" }}>Request submitted</p>
              <p style={{ color: c.greenText, fontSize: "12px", marginTop: "4px" }}>TrueWagon will acknowledge your request within 5 business days. Reference ID: <strong>LHR-{dealId.slice(-8).toUpperCase()}</strong></p>
            </div>
          ) : (
            <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              {error && <p style={{ color: c.red, fontSize: "12px" }}>{error}</p>}

              <div>
                <label style={{ color: c.body, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                  Reason for legal hold / dispute <span style={{ color: c.red }}>*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  rows={3}
                  placeholder="Describe the nature of the dispute or the legal authority requiring this record…"
                  style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: "6px", padding: "9px 12px", fontSize: "13px", color: c.body, resize: "vertical", fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div>
                <label style={{ color: c.body, fontSize: "12px", fontWeight: 600, display: "block", marginBottom: "5px" }}>
                  Court / authority reference number <span style={{ color: c.muted, fontWeight: 400 }}>(optional)</span>
                </label>
                <input
                  type="text"
                  value={refNo}
                  onChange={(e) => setRefNo(e.target.value)}
                  placeholder="e.g. DIFC-2026-001234"
                  style={{ width: "100%", border: `1px solid ${c.border}`, borderRadius: "6px", padding: "9px 12px", fontSize: "13px", color: c.body, fontFamily: "Inter, sans-serif", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <p style={{ color: c.muted, fontSize: "11px", lineHeight: 1.6 }}>
                By submitting this request you confirm that the information provided is accurate and that you are a party to this deal or acting on behalf of a recognised legal authority.
                False requests may result in account suspension.
              </p>

              <button
                type="submit"
                disabled={submitting}
                style={{ backgroundColor: c.primary, color: "#fff", border: "none", borderRadius: "6px", padding: "10px 20px", fontSize: "13px", fontWeight: 600, cursor: submitting ? "not-allowed" : "pointer", alignSelf: "flex-start", opacity: submitting ? 0.6 : 1 }}
              >
                {submitting ? "Submitting…" : "Submit legal hold request"}
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Props ──────────────────────────────────────────────────────────────────
interface Props {
  deal: Deal & {
    messages: Array<{
      id: string; message: string; created_at: string;
      sender_id: string; sender: { full_name: string; avatar_url?: string };
    }>;
  };
  currentUserId: string;
  role: "buyer" | "seller";
}

// ────────────────────────────────────────────────────────────────────────────
export function DealDetailView({ deal, currentUserId, role }: Props) {
  const router = useRouter();

  // ── message state
  // ── status advance
  const [updatingStatus, setUpdating] = useState(false);
  const [agreedPrice, setAgreedPrice] = useState(deal.agreed_price_usd?.toString() ?? "");
  const [trackingNo, setTrackingNo]   = useState(deal.tracking_number ?? "");

  // ── payment proof upload (buyer)
  const [paymentAmt, setPaymentAmt]       = useState("");
  const [wireRef, setWireRef]             = useState("");
  const [proofFile, setProofFile]         = useState<File | null>(null);
  const [proofIsImage, setProofIsImage]   = useState(false);
  const [uploadingProof, setUploadingProof] = useState(false);
  const [proofError, setProofError]       = useState("");
  const proofFileRef = useRef<HTMLInputElement>(null);

  // ── seller confirm payment disclaimer
  const [confirmChecked, setConfirmChecked] = useState(false);

  // ── GDPR document consent
  const [gdprConsented, setGdprConsented]           = useState<boolean | null>(null); // null = unchecked
  const [showGdprModal, setShowGdprModal]           = useState(false);
  const [gdprChecked, setGdprChecked]               = useState(false);
  const [savingConsent, setSavingConsent]            = useState(false);

  // ── deal documents
  const [docFile, setDocFile]                       = useState<File | null>(null);
  const [docType, setDocType]                       = useState<DocType | "">("");
  const [docCustomLabel, setDocCustomLabel]         = useState("");
  const [docNotes, setDocNotes]                     = useState("");
  const [docRequiresCounter, setDocRequiresCounter] = useState(false);
  const [docRequestCounterpart, setDocRequestCounterpart] = useState(false);
  const [uploadingDoc, setUploadingDoc]             = useState(false);
  const [docError, setDocError]                     = useState("");
  const [showDocForm, setShowDocForm]               = useState(false);
  const docFileRef = useRef<HTMLInputElement>(null);

  // ── counter-signature
  const [counterFile, setCounterFile]       = useState<File | null>(null);
  const [counterDocId, setCounterDocId]     = useState<string | null>(null);
  const [counterUploading, setCounterUploading] = useState(false);
  const counterFileRef = useRef<HTMLInputElement>(null);

  // ── signed URL cache  { storagePath → signedUrl }
  const [signedUrls, setSignedUrls] = useState<Record<string, string>>({});

  const listing      = deal.listing as Deal["listing"] & { images?: { url: string; is_primary: boolean }[] };
  const buyer        = deal.buyer  as { full_name: string; country: string; email: string; phone?: string; kyc_status?: string };
  const seller       = deal.seller as { company_name: string; city: string; profile: { full_name: string; email?: string } };
  const primaryImage = listing?.images?.find((i) => i.is_primary)?.url ?? listing?.images?.[0]?.url;

  const currentIdx = STATUS_ORDER.indexOf(deal.status);
  const isClosed   = ["completed", "cancelled"].includes(deal.status);
  const canAdvance = role === "seller" && !!SELLER_NEXT[deal.status];

  const docStatuses = [
    {
      label: "Title Transfer",
      done:    currentIdx >= STATUS_ORDER.indexOf("agreed"),
      pending: currentIdx === STATUS_ORDER.indexOf("negotiating"),
    },
    {
      label: "Export Permits",
      done:    currentIdx >= STATUS_ORDER.indexOf("payment_confirmed"),
      pending: currentIdx === STATUS_ORDER.indexOf("payment_uploaded"),
    },
    {
      label: "Customs Paperwork",
      done:    currentIdx >= STATUS_ORDER.indexOf("delivered"),
      pending: currentIdx >= STATUS_ORDER.indexOf("shipped"),
    },
  ];

  // ── helpers ──────────────────────────────────────────────────────────────

  async function getSignedUrl(storagePath: string, bucket: string): Promise<string> {
    if (signedUrls[storagePath]) return signedUrls[storagePath];
    const supabase = createClient();
    const { data } = await supabase.storage
      .from(bucket)
      .createSignedUrl(storagePath, 3600); // 1 hour
    const url = data?.signedUrl ?? "#";
    setSignedUrls((prev) => ({ ...prev, [storagePath]: url }));
    return url;
  }

  async function openFile(storagePath: string, bucket: string) {
    const url = await getSignedUrl(storagePath, bucket);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  // ── GDPR consent check — lazy, cached after first DB read ───────────────
  async function ensureGdprConsent(): Promise<boolean> {
    if (gdprConsented === true) return true;
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("gdpr_doc_consent_at")
      .eq("id", currentUserId)
      .single();
    const already = !!data?.gdpr_doc_consent_at;
    setGdprConsented(already);
    return already;
  }

  async function handleAddDocumentClick() {
    const consented = await ensureGdprConsent();
    if (consented) {
      setShowDocForm(true);
    } else {
      setShowGdprModal(true);
    }
  }

  async function confirmGdprConsent() {
    if (!gdprChecked) return;
    setSavingConsent(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ gdpr_doc_consent_at: new Date().toISOString() })
      .eq("id", currentUserId);
    setGdprConsented(true);
    setSavingConsent(false);
    setShowGdprModal(false);
    setGdprChecked(false);
    setShowDocForm(true);
  }

  async function notifyBackend(event: string, meta?: Record<string, string | number | null>) {
    try {
      await fetch("/api/deals/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ dealId: deal.id, event, meta }),
      });
    } catch { /* non-fatal — email failure shouldn't block the action */ }
  }

  // ── status advance ────────────────────────────────────────────────────────

  async function advanceStatus() {
    if (deal.status === "payment_uploaded" && !confirmChecked) return;
    const next = SELLER_NEXT[deal.status];
    if (!next) return;
    setUpdating(true);
    const supabase = createClient();
    const payload: Record<string, unknown> = { status: next };
    if (next === "agreed"  && agreedPrice) payload.agreed_price_usd = parseFloat(agreedPrice);
    if (next === "shipped" && trackingNo)  payload.tracking_number  = trackingNo;
    await supabase.from("deals").update(payload).eq("id", deal.id);

    // Notify the other party
    if (next === "agreed")            await notifyBackend("deal_agreed", { agreed_price_usd: agreedPrice ? parseFloat(agreedPrice) : null });
    if (next === "payment_confirmed") await notifyBackend("payment_confirmed");
    if (next === "shipped")           await notifyBackend("shipped", { tracking_number: trackingNo || null, destination_country: deal.destination_country });
    if (next === "delivered")         await notifyBackend("delivered");

    setUpdating(false);
    router.refresh();
  }

  // ── payment proof upload (buyer) ──────────────────────────────────────────

  function handleProofFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setProofFile(file);
    setProofIsImage(file ? fileTypeFromMime(file) === "image" : false);
    setProofError("");
  }

  async function uploadPaymentProof(e: React.FormEvent) {
    e.preventDefault();
    if (!proofFile) { setProofError("Please select a file to upload."); return; }
    setUploadingProof(true);
    setProofError("");

    const supabase = createClient();
    const ext  = proofFile.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${deal.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: storageErr } = await supabase.storage
      .from("payment-proofs")
      .upload(path, proofFile, { contentType: proofFile.type, upsert: false });

    if (storageErr) {
      setProofError("Upload failed — please try again.");
      setUploadingProof(false);
      return;
    }

    await supabase.from("payment_proofs").insert({
      deal_id:        deal.id,
      uploaded_by:    currentUserId,
      file_url:       path,
      file_name:      proofFile.name,
      file_type:      fileTypeFromMime(proofFile),
      amount_usd:     paymentAmt ? parseFloat(paymentAmt) : null,
      wire_reference: wireRef || null,
    });

    await supabase.from("deals").update({ status: "payment_uploaded" }).eq("id", deal.id);

    // Notify seller (mock)
    await notifyBackend("payment_uploaded");

    setUploadingProof(false);
    router.refresh();
  }

  // ── deal document upload ──────────────────────────────────────────────────

  function handleDocTypeChange(val: DocType) {
    setDocType(val);
    setDocRequiresCounter(COUNTER_SIGN_TYPES.includes(val));
    if (val !== "other") { setDocCustomLabel(""); setDocRequestCounterpart(false); }
  }

  async function uploadDocument(e: React.FormEvent) {
    e.preventDefault();
    if (!docFile)  { setDocError("Please select a file."); return; }
    if (!docType)  { setDocError("Please select a document type."); return; }
    setUploadingDoc(true);
    setDocError("");

    const supabase = createClient();
    const ext  = docFile.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${deal.id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: storageErr } = await supabase.storage
      .from("deal-documents")
      .upload(path, docFile, { contentType: docFile.type, upsert: false });

    if (storageErr) {
      setDocError("Upload failed — please try again.");
      setUploadingDoc(false);
      return;
    }

    const resolvedLabel = docType === "other" && docCustomLabel.trim()
      ? docCustomLabel.trim()
      : DOC_TYPE_LABELS[docType];

    await supabase.from("deal_documents").insert({
      deal_id:                    deal.id,
      uploaded_by:                currentUserId,
      uploader_role:              role,
      doc_type:                   docType,
      doc_label:                  resolvedLabel,
      file_url:                   path,
      file_name:                  docFile.name,
      file_type:                  fileTypeFromMime(docFile),
      notes:                      docNotes || null,
      requires_counter_sign:      docRequiresCounter,
      requires_counterpart_upload: docRequestCounterpart,
      counterpart_upload_label:   docRequestCounterpart ? resolvedLabel : null,
    });

    // Notify other party
    const otherRole = role === "seller" ? "buyer" : "seller";
    await notifyBackend(
      docRequiresCounter ? "counter_sign_requested" : "document_uploaded",
      { docLabel: resolvedLabel, role: otherRole },
    );

    setDocFile(null); setDocType(""); setDocCustomLabel(""); setDocNotes("");
    setDocRequiresCounter(false); setDocRequestCounterpart(false);
    setShowDocForm(false);
    setUploadingDoc(false);
    router.refresh();
  }

  // ── counter-signature upload ──────────────────────────────────────────────

  async function uploadCounterSign(docId: string) {
    if (!counterFile) return;
    setCounterUploading(true);

    const supabase = createClient();
    const ext  = counterFile.name.split(".").pop()?.toLowerCase() ?? "pdf";
    const path = `${deal.id}/counter-${docId}-${Date.now()}.${ext}`;

    const { error: storageErr } = await supabase.storage
      .from("deal-documents")
      .upload(path, counterFile, { contentType: counterFile.type });

    if (!storageErr) {
      await supabase.from("deal_documents").update({
        counter_sign_file_url:  path,
        counter_sign_file_name: counterFile.name,
        counter_signed_by:      currentUserId,
        counter_signed_at:      new Date().toISOString(),
      }).eq("id", docId);
    }

    setCounterFile(null); setCounterDocId(null);
    setCounterUploading(false);
    router.refresh();
  }

  // ── sub-renders ─────────────────────────────────────────────────────────

  function FileBadgeTag({ type }: { type?: "pdf" | "image" | null }) {
    if (!type) return null;
    const isPdf = type === "pdf";
    return (
      <span style={{
        backgroundColor: isPdf ? c.blueBg : c.bgDim,
        color: isPdf ? c.blue : c.muted,
        border: `1px solid ${isPdf ? "#BFDBFE" : c.border}`,
        fontSize: "10px", fontWeight: 700, padding: "2px 7px",
        borderRadius: "99px", letterSpacing: "0.04em",
      }}>
        {isPdf ? "PDF" : "IMAGE"}
      </span>
    );
  }

  const docs = (deal.deal_documents ?? []) as DealDocument[];
  const proofs = deal.payment_proofs ?? [];

  // ── Contact disclaimer: show once payment is confirmed ─────────────────
  const CONTACT_SHARE_STATUSES: DealStatus[] = [
    "payment_confirmed", "shipped", "delivered", "completed",
  ];
  const contactShared = CONTACT_SHARE_STATUSES.includes(deal.status as DealStatus);
  const [disclaimerDismissed, setDisclaimerDismissed] = useState(false);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif" }} className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-10">

        {/* ── Frozen deal banner ────────────────────────────────────────── */}
        {deal.is_frozen && (
          <div style={{
            backgroundColor: c.redBg, border: `1px solid ${c.redBorder}`,
            borderRadius: "10px", padding: "14px 18px", marginBottom: "16px",
            display: "flex", alignItems: "flex-start", gap: "12px",
          }}>
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: c.red }} />
            <div>
              <p style={{ color: c.red, fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>This deal has been frozen</p>
              <p style={{ color: c.red, fontSize: "12px", lineHeight: 1.6 }}>
                {deal.frozen_reason
                  ? deal.frozen_reason
                  : "A dispute or admin action has frozen this deal. No status changes can be made until the matter is resolved. A Fuselage admin will be in touch."}
              </p>
            </div>
          </div>
        )}

        {/* ── Contact disclaimer banner ──────────────────────────────────── */}
        {contactShared && !disclaimerDismissed && (
          <div style={{
            backgroundColor: "#FFF7ED",
            border: "1px solid #FED7AA",
            borderRadius: "0.5rem",
            padding: "14px 18px",
            marginBottom: "16px",
            display: "flex",
            alignItems: "flex-start",
            gap: "12px",
          }}>
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" style={{ color: "#EA580C" }} />
            <div style={{ flex: 1 }}>
              <p style={{ color: "#9A3412", fontSize: "13px", fontWeight: 700, marginBottom: "2px" }}>
                Contact details have been shared
              </p>
              <p style={{ color: "#9A3412", fontSize: "12px", lineHeight: 1.6 }}>
                Payment has been confirmed and both parties now have access to each other&apos;s contact information.
                {" "}<strong>Any negotiation or agreement made outside this platform removes TrueWagon&apos;s ability to mediate disputes, verify documents, or protect either party.</strong>
                {" "}Your on-platform deal record is the only recognised record of this transaction.
              </p>
            </div>
            <button
              onClick={() => setDisclaimerDismissed(true)}
              style={{ background: "none", border: "none", color: "#9A3412", cursor: "pointer", fontSize: "16px", lineHeight: 1, padding: "0 2px", flexShrink: 0 }}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {/* ── Deal header ───────────────────────────────────────────────── */}
        <div
          style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
          className="p-6 mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
        >
          <div>
            <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-1">
              Deal · {formatDate(deal.created_at)}
            </p>
            <h1 style={{ color: c.primary }} className="text-xl font-bold">
              {listing?.year} {listing?.make} {listing?.model}
            </h1>
            <p style={{ color: c.muted }} className="text-sm mt-0.5">
              {deal.destination_country}{deal.destination_port ? ` · ${deal.destination_port}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span style={{ backgroundColor: c.greenBg, color: c.greenText }} className="text-xs font-semibold px-3 py-1.5 rounded-full">
              {DEAL_STATUS_LABELS[deal.status]}
            </span>
            {deal.agreed_price_usd && (
              <span style={{ color: c.primary }} className="text-lg font-bold">{formatUSD(deal.agreed_price_usd)}</span>
            )}
          </div>
        </div>

        {/* ── Order lifecycle stepper ────────────────────────────────────── */}
        <div
          style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
          className="p-6 mb-6"
        >
          <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-5">Order Lifecycle</p>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {LIFECYCLE.map(({ key, label }, i) => {
              const stepIdx = STATUS_ORDER.indexOf(key);
              const done    = stepIdx < currentIdx;
              const active  = stepIdx === currentIdx;
              return (
                <div key={key} className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <div style={{
                      width: "28px", height: "28px", borderRadius: "50%",
                      backgroundColor: done ? c.green : active ? c.primary : c.border,
                      display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {done   && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      {active && <Clock        className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span style={{ color: done || active ? c.primary : c.muted, whiteSpace: "nowrap" }}
                      className="text-[10px] font-medium text-center max-w-[70px] leading-tight">
                      {label}
                    </span>
                  </div>
                  {i < LIFECYCLE.length - 1 && (
                    <div style={{ height: "2px", width: "32px", marginBottom: "18px",
                      backgroundColor: done ? c.green : c.border, flexShrink: 0 }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Main two-column layout ─────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* ── LEFT COLUMN ─────────────────────────────────────────────── */}
          <div className="md:col-span-2 space-y-6">

            {/* Transit map */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem", overflow: "hidden" }}>
              <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
                <Image src={TRANSIT_MAP} alt="Live transit map" fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
                <div className="absolute top-3 left-3">
                  <span style={{ backgroundColor: "rgba(15,23,42,0.85)", color: "#fff" }}
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full">
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: c.green, display: "inline-block" }} className="animate-pulse" />
                    Live Transit Map
                  </span>
                </div>
                {deal.tracking_number && (
                  <div className="absolute bottom-3 left-3">
                    <span style={{ backgroundColor: "rgba(15,23,42,0.85)", color: "#fff" }}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full">
                      <Ship className="h-3 w-3" />{deal.tracking_number}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping & Documents status */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }} className="p-6">
              <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-4">Shipping &amp; Documents</p>
              <div className="space-y-3 mb-5">
                {docStatuses.map(({ label, done, pending }) => (
                  <div key={label} style={{ border: `1px solid ${c.border}`, borderRadius: "0.375rem" }}
                    className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <FileCheck style={{ color: done ? c.green : c.muted }} className="h-4 w-4" />
                      <span style={{ color: c.primary }} className="text-sm font-medium">{label}</span>
                    </div>
                    {done    ? <span style={{ backgroundColor: c.greenBg, color: c.greenText }} className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> Verified</span>
                    : pending ? <span style={{ backgroundColor: c.amberBg, color: c.amber }} className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="h-3 w-3" /> In Review</span>
                    :           <span style={{ color: c.muted }} className="text-xs">Pending</span>}
                  </div>
                ))}
              </div>
              <p style={{ color: c.muted }} className="text-xs leading-relaxed">
                All legal documentation is being processed to ensure a smooth cross-border handover.
              </p>
            </div>

            {/* ── Transaction Documents ──────────────────────────────────── */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }} className="p-6">
              <div className="flex items-center justify-between mb-1">
                <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest">Transaction Documents</p>
                {!isClosed && (
                  <button
                    onClick={handleAddDocumentClick}
                    style={{ backgroundColor: c.primary, color: "#fff", fontSize: "12px", fontWeight: 600, padding: "5px 12px", borderRadius: "6px", border: "none", cursor: "pointer" }}
                    className="flex items-center gap-1.5 hover:opacity-90 transition-opacity"
                  >
                    <Upload className="h-3 w-3" />
                    Add document
                  </button>
                )}
              </div>

              {/* What documents apply — info callout */}
              <div style={{ backgroundColor: c.blueBg, border: `1px solid #BFDBFE`, borderRadius: "0.375rem" }} className="flex gap-2.5 p-3 mb-4 mt-3">
                <Info className="h-4 w-4 shrink-0 mt-0.5" style={{ color: c.blue }} />
                <p style={{ color: "#1E40AF" }} className="text-xs leading-relaxed">
                  <strong>Common documents for this deal:</strong> Purchase Agreement (signed by both parties),
                  Export Certificate / MLIT Form (Japan imports), Port Handling Receipt, Insurance Certificate,
                  Pre-Shipment Inspection Report, Power of Attorney for port agent, Bill of Lading.
                  Documents requiring a counter-signature from the other party will prompt them automatically.
                </p>
              </div>

              {/* Upload form */}
              {showDocForm && (
                <form onSubmit={uploadDocument} className="mb-5 space-y-3"
                  style={{ backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "0.375rem", padding: "16px" }}>
                  <p style={{ color: c.primary }} className="text-sm font-semibold mb-2">Upload a document</p>

                  {/* Doc type */}
                  <div>
                    <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">Document type</label>
                    <div style={{ position: "relative" }}>
                      <select
                        value={docType}
                        onChange={(e) => handleDocTypeChange(e.target.value as DocType)}
                        required
                        style={{
                          width: "100%", height: "36px", border: `1px solid ${c.border}`,
                          borderRadius: "6px", paddingLeft: "10px", paddingRight: "28px",
                          fontSize: "13px", outline: "none", color: docType ? c.primary : c.muted,
                          backgroundColor: c.surface, appearance: "none",
                        }}
                      >
                        <option value="" disabled>Select document type…</option>
                        {(Object.keys(DOC_TYPE_LABELS) as DocType[]).map((k) => (
                          <option key={k} value={k}>{DOC_TYPE_LABELS[k]}</option>
                        ))}
                      </select>
                      <ChevronDown className="h-4 w-4 absolute right-2 top-2.5 pointer-events-none" style={{ color: c.muted }} />
                    </div>
                  </div>

                  {/* Custom label for "Other Document" */}
                  {docType === "other" && (
                    <div>
                      <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">
                        Document name <span style={{ color: c.red }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={docCustomLabel}
                        onChange={(e) => setDocCustomLabel(e.target.value)}
                        placeholder="e.g. Customs declaration form, Bank draft…"
                        required
                        style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary, backgroundColor: c.surface }}
                      />
                    </div>
                  )}

                  {/* File picker */}
                  <div>
                    <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">File (PDF preferred)</label>
                    <div
                      onClick={() => docFileRef.current?.click()}
                      style={{
                        border: `2px dashed ${docFile ? c.green : c.border}`,
                        borderRadius: "6px", padding: "12px 14px",
                        cursor: "pointer", backgroundColor: c.surface,
                        display: "flex", alignItems: "center", gap: "10px",
                      }}
                      className="hover:border-gray-400 transition-colors"
                    >
                      <FileText style={{ color: docFile ? c.green : c.muted }} className="h-5 w-5 shrink-0" />
                      <span style={{ color: docFile ? c.primary : c.muted, fontSize: "13px" }}>
                        {docFile ? docFile.name : "Click to select file…"}
                      </span>
                    </div>
                    <input ref={docFileRef} type="file" accept={DOC_ACCEPT} className="hidden"
                      onChange={(e) => { setDocFile(e.target.files?.[0] ?? null); setDocError(""); }} />
                  </div>

                  {/* Notes */}
                  <div>
                    <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">Notes (optional)</label>
                    <input value={docNotes} onChange={(e) => setDocNotes(e.target.value)} placeholder="e.g. Signed copy — awaiting buyer counter-signature"
                      style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary, backgroundColor: c.surface }} />
                  </div>

                  {/* Counter-sign toggle */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={docRequiresCounter}
                      onChange={(e) => setDocRequiresCounter(e.target.checked)}
                      style={{ width: "14px", height: "14px", accentColor: c.primary }} />
                    <span style={{ color: c.body, fontSize: "12px" }}>
                      This document requires a counter-signature from the other party
                    </span>
                  </label>

                  {/* Counterpart upload request */}
                  <label className="flex items-center gap-2.5 cursor-pointer">
                    <input type="checkbox" checked={docRequestCounterpart}
                      onChange={(e) => setDocRequestCounterpart(e.target.checked)}
                      style={{ width: "14px", height: "14px", accentColor: c.amber }} />
                    <span style={{ color: c.body, fontSize: "12px" }}>
                      {role === "buyer" ? "Seller" : "Buyer"} must upload a matching document
                    </span>
                  </label>

                  {docError && <p style={{ color: c.red, fontSize: "12px" }}>{docError}</p>}

                  <div className="flex gap-2 pt-1">
                    <button type="submit" disabled={uploadingDoc}
                      style={{ backgroundColor: c.primary, color: "#fff", flex: 1, height: "36px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, border: "none", cursor: uploadingDoc ? "not-allowed" : "pointer" }}
                      className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                      <Upload className="h-3.5 w-3.5" />
                      {uploadingDoc ? "Uploading…" : "Upload document"}
                    </button>
                    <button type="button" onClick={() => setShowDocForm(false)}
                      style={{ backgroundColor: c.bgDim, color: c.muted, width: "80px", height: "36px", borderRadius: "6px", fontSize: "13px", border: `1px solid ${c.border}`, cursor: "pointer" }}>
                      Cancel
                    </button>
                  </div>
                </form>
              )}

              {/* Document list */}
              {docs.length === 0 && !showDocForm && (
                <p style={{ color: c.muted }} className="text-xs py-4 text-center">No documents uploaded yet.</p>
              )}
              <div className="space-y-3">
                {docs.map((doc) => {
                  const isMyDoc         = doc.uploaded_by === currentUserId;
                  const needsMySign     = doc.requires_counter_sign && !doc.counter_signed_at && !isMyDoc;
                  const bothSigned      = doc.requires_counter_sign && !!doc.counter_signed_at;
                  const awaitingOther   = doc.requires_counter_sign && !doc.counter_signed_at && isMyDoc;
                  const needsMyUpload   = doc.requires_counterpart_upload && !doc.counterpart_upload_fulfilled && !isMyDoc;
                  const awaitingUpload  = doc.requires_counterpart_upload && !doc.counterpart_upload_fulfilled && isMyDoc;

                  return (
                    <div key={doc.id}
                      style={{
                        border: `1px solid ${needsMySign ? c.amberBorder : c.border}`,
                        backgroundColor: needsMySign ? c.amberBg : c.surface,
                        borderRadius: "0.375rem", padding: "12px 14px",
                      }}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3 min-w-0">
                          <FileBadge style={{ color: c.muted, flexShrink: 0, marginTop: "2px" }} className="h-4 w-4" />
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span style={{ color: c.primary, fontSize: "13px", fontWeight: 600 }}>
                                {doc.doc_label ?? DOC_TYPE_LABELS[doc.doc_type]}
                              </span>
                              <FileBadgeTag type={doc.file_type} />
                              {bothSigned && (
                                <span style={{ backgroundColor: c.greenBg, color: c.greenText, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px" }}>
                                  ✓ Both parties signed
                                </span>
                              )}
                              {awaitingOther && (
                                <span style={{ backgroundColor: c.amberBg, color: c.amber, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px" }}>
                                  Awaiting counter-signature
                                </span>
                              )}
                              {needsMyUpload && (
                                <span style={{ backgroundColor: c.redBg, color: c.red, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px" }}>
                                  Upload required
                                </span>
                              )}
                              {awaitingUpload && !doc.counterpart_upload_fulfilled && (
                                <span style={{ backgroundColor: c.amberBg, color: c.amber, fontSize: "10px", fontWeight: 700, padding: "2px 7px", borderRadius: "99px" }}>
                                  Awaiting counterpart upload
                                </span>
                              )}
                            </div>
                            <p style={{ color: c.muted, fontSize: "11px", marginTop: "2px" }}>
                              Uploaded by {doc.uploader_role} · {formatDate(doc.created_at)}
                            </p>
                            {doc.notes && <p style={{ color: c.body, fontSize: "12px", marginTop: "3px" }}>{doc.notes}</p>}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => openFile(doc.file_url, "deal-documents")}
                            style={{ color: c.blue, fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                            <ExternalLink className="h-3.5 w-3.5" /> View
                          </button>
                          {doc.counter_sign_file_url && (
                            <button
                              onClick={() => openFile(doc.counter_sign_file_url!, "deal-documents")}
                              style={{ color: c.green, fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                              <ExternalLink className="h-3.5 w-3.5" /> Counter-sign
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Counterpart upload action */}
                      {needsMyUpload && (
                        <div style={{ borderTop: `1px solid ${c.redBorder}`, marginTop: "10px", paddingTop: "10px" }}>
                          <p style={{ color: c.red, fontSize: "12px", fontWeight: 600, marginBottom: "8px" }}>
                            Action required: upload your copy of &quot;{doc.counterpart_upload_label ?? doc.doc_label ?? DOC_TYPE_LABELS[doc.doc_type]}&quot;
                          </p>
                          <button
                            onClick={() => setShowDocForm(true)}
                            style={{ backgroundColor: c.red, color: "#fff", width: "100%", height: "34px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}
                            className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                          >
                            <Upload className="h-3.5 w-3.5" />
                            Upload matching document
                          </button>
                        </div>
                      )}

                      {/* Counter-sign action */}
                      {needsMySign && (
                        <div style={{ borderTop: `1px solid ${c.amberBorder}`, marginTop: "10px", paddingTop: "10px" }}>
                          {counterDocId === doc.id ? (
                            <div className="space-y-2">
                              <div
                                onClick={() => counterFileRef.current?.click()}
                                style={{ border: `2px dashed ${counterFile ? c.green : c.amberBorder}`, borderRadius: "6px", padding: "10px 12px", cursor: "pointer", backgroundColor: "#fff", display: "flex", alignItems: "center", gap: "8px" }}>
                                <FileText style={{ color: counterFile ? c.green : c.amber }} className="h-4 w-4 shrink-0" />
                                <span style={{ color: counterFile ? c.primary : c.amber, fontSize: "12px" }}>
                                  {counterFile ? counterFile.name : "Select your signed copy…"}
                                </span>
                              </div>
                              <input ref={counterFileRef} type="file" accept={DOC_ACCEPT} className="hidden"
                                onChange={(e) => setCounterFile(e.target.files?.[0] ?? null)} />
                              <div className="flex gap-2">
                                <button onClick={() => uploadCounterSign(doc.id)} disabled={!counterFile || counterUploading}
                                  style={{ backgroundColor: c.green, color: "#fff", flex: 1, height: "34px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, border: "none", cursor: (!counterFile || counterUploading) ? "not-allowed" : "pointer" }}
                                  className="flex items-center justify-center gap-2 disabled:opacity-50">
                                  <PenLine className="h-3.5 w-3.5" />
                                  {counterUploading ? "Uploading…" : "Submit counter-signature"}
                                </button>
                                <button onClick={() => { setCounterDocId(null); setCounterFile(null); }}
                                  style={{ backgroundColor: c.bgDim, color: c.muted, width: "70px", height: "34px", borderRadius: "6px", fontSize: "12px", border: `1px solid ${c.border}`, cursor: "pointer" }}>
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button onClick={() => { setCounterDocId(doc.id); setCounterFile(null); }}
                              style={{ backgroundColor: c.amber, color: "#fff", width: "100%", height: "34px", borderRadius: "6px", fontSize: "12px", fontWeight: 600, border: "none", cursor: "pointer" }}
                              className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                              <PenLine className="h-3.5 w-3.5" />
                              Upload your signed copy
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vehicle details */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
              className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: "VIN",       value: (listing as unknown as Record<string, unknown>)?.vin as string ?? "—" },
                { label: "Origin",    value: `${seller?.city ?? "UAE"}, UAE` },
                { label: "Condition", value: "Verified Excellent" },
                { label: "Make",      value: listing?.make ?? "—" },
                { label: "Year",      value: listing?.year?.toString() ?? "—" },
                { label: "Colour",    value: listing?.color ?? "—" },
              ].map(({ label, value }) => (
                <div key={label} style={{ backgroundColor: c.bgDim, borderRadius: "0.375rem" }} className="px-4 py-3">
                  <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-wider mb-0.5">{label}</p>
                  <p style={{ color: c.primary }} className="text-sm font-medium">{value}</p>
                </div>
              ))}
            </div>

            {/* Activity log */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }} className="p-6">
              <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-4">Activity Log</p>
              <div className="space-y-3">
                {deal.messages?.slice(-5).reverse().map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div style={{ backgroundColor: c.bgDim, width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, color: c.muted }}
                      className="flex items-center justify-center text-xs font-semibold">
                      {getInitials(msg.sender?.full_name ?? "?")}
                    </div>
                    <div>
                      <p style={{ color: c.primary }} className="text-xs font-medium">{msg.sender?.full_name}</p>
                      <p style={{ color: c.body }} className="text-xs leading-relaxed">{msg.message}</p>
                      <p style={{ color: c.muted }} className="text-[10px] mt-0.5">{formatDate(msg.created_at)}</p>
                    </div>
                  </div>
                ))}
                {(!deal.messages || deal.messages.length === 0) && (
                  <p style={{ color: c.muted }} className="text-xs">No activity yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* ── RIGHT SIDEBAR ───────────────────────────────────────────── */}
          <div className="space-y-5">

            {/* Deal Certificate — shown only when completed */}
            {deal.status === "completed" && (
              <a
                href={`/api/deals/${deal.id}/certificate`}
                download
                style={{
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  backgroundColor: c.greenBg, border: `1px solid #6EE7B7`,
                  borderRadius: "10px", padding: "14px 20px",
                  textDecoration: "none",
                  transition: "opacity 0.15s",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.8")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
              >
                <FileBadge style={{ color: c.greenText, width: "18px", height: "18px" }} />
                <span style={{ color: c.greenText, fontSize: "13px", fontWeight: 700 }}>
                  Download Deal Certificate
                </span>
              </a>
            )}

            {/* Vehicle card */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem", overflow: "hidden" }}>
              {primaryImage ? (
                <div className="relative w-full" style={{ aspectRatio: "4/3" }}>
                  <Image src={primaryImage} alt="Vehicle" fill className="object-cover" sizes="300px" />
                </div>
              ) : (
                <div style={{ backgroundColor: c.bgDim, aspectRatio: "4/3" } as React.CSSProperties} className="flex items-center justify-center">
                  <Package style={{ color: c.muted }} className="h-8 w-8" />
                </div>
              )}
              <div className="p-4">
                <p style={{ color: c.primary }} className="font-semibold text-sm">{listing?.year} {listing?.make} {listing?.model}</p>
                {listing?.color && <p style={{ color: c.muted }} className="text-xs mt-0.5">{listing.color}</p>}
                {deal.agreed_price_usd && (
                  <p style={{ color: c.primary }} className="font-bold text-base mt-2">{formatUSD(deal.agreed_price_usd)}</p>
                )}
              </div>
            </div>

            {/* Parties */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }} className="p-4 space-y-4">
              <div>
                <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-1.5">Buyer</p>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
                  <p style={{ color: c.primary }} className="text-sm font-medium">{buyer?.full_name}</p>
                  {buyer?.kyc_status === "verified" && (
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", backgroundColor: c.greenBg, color: c.greenText, fontSize: "9px", fontWeight: 700, padding: "2px 6px", borderRadius: "99px", letterSpacing: "0.03em" }}>
                      <ShieldCheck style={{ width: "9px", height: "9px" }} /> Verified
                    </span>
                  )}
                </div>
                <p style={{ color: c.muted }} className="text-xs flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{buyer?.country}</p>
                {role === "seller" && buyer?.email && <p style={{ color: c.muted }} className="text-xs mt-0.5">{buyer.email}</p>}
              </div>
              <div style={{ borderTop: `1px solid ${c.border}` }} className="pt-3">
                <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-1.5">Exporter</p>
                <p style={{ color: c.primary }} className="text-sm font-medium">{seller?.company_name}</p>
                <p style={{ color: c.muted }} className="text-xs flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{seller?.city}</p>
                {role === "buyer" && (
                  <a href={`/sellers/${deal.seller_id}`} style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: c.blue, fontSize: "11px", fontWeight: 600, marginTop: "6px", textDecoration: "none" }}>
                    View seller profile →
                  </a>
                )}
              </div>
            </div>

            {/* ── Seller action card ───────────────────────────────────── */}
            {role === "seller" && canAdvance && !isClosed && (
              <div style={{ backgroundColor: c.surface, border: `2px solid ${c.green}`, borderRadius: "0.5rem" }} className="p-4">
                <p style={{ color: c.primary }} className="font-semibold text-sm mb-3">Action Required</p>

                {deal.status === "negotiating" && (
                  <div className="mb-3">
                    <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">Agreed Price (USD)</label>
                    <input type="number" placeholder="e.g. 82000" value={agreedPrice}
                      onChange={(e) => setAgreedPrice(e.target.value)}
                      style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }} />
                  </div>
                )}

                {deal.status === "payment_confirmed" && (
                  <div className="mb-3">
                    <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">Bill of Lading / Tracking No.</label>
                    <input placeholder="BL123456789" value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }} />
                  </div>
                )}

                {/* Binding disclaimer — only shown when confirming payment receipt */}
                {deal.status === "payment_uploaded" && (
                  <div style={{ backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "0.375rem" }} className="p-3 mb-3">
                    <div className="flex gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: c.amber }} />
                      <p style={{ color: "#92400E", fontSize: "12px", lineHeight: "1.5" }}>
                        <strong>Binding confirmation.</strong> By confirming receipt you are acknowledging that
                        you have received the buyer&apos;s payment and are actively engaged in a binding transaction.
                        You are legally obligated to complete the export or return the funds.
                      </p>
                    </div>
                    <label className="flex items-start gap-2.5 cursor-pointer">
                      <input type="checkbox" checked={confirmChecked} onChange={(e) => setConfirmChecked(e.target.checked)}
                        style={{ marginTop: "2px", width: "14px", height: "14px", accentColor: c.primary, flexShrink: 0 }} />
                      <span style={{ color: "#92400E", fontSize: "12px" }}>
                        I confirm I have received the payment and understand this creates a binding obligation.
                      </span>
                    </label>
                  </div>
                )}

                <button
                  onClick={advanceStatus}
                  disabled={updatingStatus || (deal.status === "payment_uploaded" && !confirmChecked)}
                  style={{ backgroundColor: c.green, color: "#fff", width: "100%", height: "38px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, border: "none", cursor: "pointer" }}
                  className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {SELLER_LABELS[deal.status]}
                </button>
              </div>
            )}

            {/* ── Buyer: upload payment proof ──────────────────────────── */}
            {role === "buyer" && deal.status === "agreed" && (
              <div style={{ backgroundColor: c.surface, border: `2px solid ${c.amber}`, borderRadius: "0.5rem" }} className="p-4">
                <p style={{ color: c.primary }} className="font-semibold text-sm mb-1">Upload Payment Proof</p>
                <p style={{ color: c.muted }} className="text-xs mb-3 leading-relaxed">
                  Wire payment to the exporter then upload your proof here. PDF bank receipts are preferred.
                </p>

                <form onSubmit={uploadPaymentProof} className="space-y-3">
                  {/* File picker */}
                  <div>
                    <div
                      onClick={() => proofFileRef.current?.click()}
                      style={{
                        border: `2px dashed ${proofFile ? c.green : c.border}`,
                        borderRadius: "6px", padding: "12px 10px",
                        cursor: "pointer", backgroundColor: c.bgDim,
                        display: "flex", alignItems: "center", gap: "8px",
                      }}
                      className="hover:border-gray-400 transition-colors"
                    >
                      <FileText style={{ color: proofFile ? c.green : c.muted }} className="h-5 w-5 shrink-0" />
                      <div className="min-w-0">
                        <p style={{ color: proofFile ? c.primary : c.muted, fontSize: "12px", fontWeight: proofFile ? 500 : 400 }}>
                          {proofFile ? proofFile.name : "Click to select file"}
                        </p>
                        <p style={{ color: c.muted, fontSize: "10px" }}>PDF, PNG, JPG, WEBP · max 10 MB</p>
                      </div>
                    </div>
                    <input ref={proofFileRef} type="file" accept={PROOF_ACCEPT} className="hidden"
                      onChange={handleProofFileChange} />
                  </div>

                  {/* Image disclaimer */}
                  {proofIsImage && (
                    <div style={{ backgroundColor: c.amberBg, border: `1px solid ${c.amberBorder}`, borderRadius: "6px" }}
                      className="flex gap-2 p-2.5">
                      <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" style={{ color: c.amber }} />
                      <p style={{ color: "#92400E", fontSize: "11px", lineHeight: "1.5" }}>
                        <strong>Note:</strong> Screenshots and images may not be accepted as legally binding proof of transfer.
                        A PDF receipt directly from your bank or payment provider is strongly preferred
                        and may be required in the event of a dispute.
                      </p>
                    </div>
                  )}

                  <input type="number" placeholder="Amount sent (USD)" value={paymentAmt}
                    onChange={(e) => setPaymentAmt(e.target.value)}
                    style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }} />

                  <input placeholder="Wire / transfer reference (TXN-…)" value={wireRef}
                    onChange={(e) => setWireRef(e.target.value)}
                    style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }} />

                  {proofError && <p style={{ color: c.red, fontSize: "12px" }}>{proofError}</p>}

                  <button type="submit" disabled={uploadingProof}
                    style={{ backgroundColor: c.primary, color: "#fff", width: "100%", height: "38px", borderRadius: "6px", fontSize: "13px", fontWeight: 600, border: "none", cursor: uploadingProof ? "not-allowed" : "pointer" }}
                    className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
                    <Upload className="h-4 w-4" />
                    {uploadingProof ? "Uploading…" : "Submit payment proof"}
                  </button>
                </form>
              </div>
            )}

            {/* ── Payment records ──────────────────────────────────────── */}
            {proofs.length > 0 && (
              <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }} className="p-4">
                <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-3">Payment Records</p>
                <div className="space-y-3">
                  {proofs.map((proof) => (
                    <div key={proof.id} style={{ borderBottom: `1px solid ${c.border}` }}
                      className="pb-3 last:border-0 last:pb-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <p style={{ color: c.primary }} className="text-sm font-medium">
                              {proof.amount_usd ? formatUSD(proof.amount_usd) : "Amount not specified"}
                            </p>
                            <FileBadgeTag type={proof.file_type} />
                          </div>
                          {proof.wire_reference && (
                            <p style={{ color: c.muted }} className="text-xs">Ref: {proof.wire_reference}</p>
                          )}
                          {proof.file_name && (
                            <p style={{ color: c.muted }} className="text-xs">{proof.file_name}</p>
                          )}
                          <p style={{ color: c.muted }} className="text-xs">{formatDate(proof.created_at)}</p>
                        </div>
                        {proof.file_url && proof.file_url !== "#placeholder" && (
                          <button
                            onClick={() => openFile(proof.file_url, "payment-proofs")}
                            style={{ color: c.blue, fontSize: "12px", fontWeight: 600, background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                            <ExternalLink className="h-3.5 w-3.5" /> View
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* ── Dispute + Legal section ───────────────────────────────────── */}
          {!isClosed && <DisputePanel dealId={deal.id} currentUserId={currentUserId} role={role} />}
          <LegalPanel dealId={deal.id} currentUserId={currentUserId} role={role} />

        </div>
      </div>

      {/* ── GDPR Document Consent Modal ───────────────────────────────── */}
      {showGdprModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            backgroundColor: "rgba(15,23,42,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "24px",
          }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowGdprModal(false); }}
        >
          <div
            style={{
              backgroundColor: c.surface,
              borderRadius: "12px",
              padding: "32px",
              maxWidth: "500px",
              width: "100%",
              boxShadow: "0 24px 48px rgba(0,0,0,0.2)",
            }}
          >
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ backgroundColor: c.blueBg, width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <FileCheck style={{ color: c.blue, width: "20px", height: "20px" }} />
              </div>
              <div>
                <p style={{ color: c.primary, fontWeight: 800, fontSize: "16px", lineHeight: 1.2 }}>
                  Document Registry Consent
                </p>
                <p style={{ color: c.muted, fontSize: "12px", marginTop: "2px" }}>
                  Required before your first upload
                </p>
              </div>
            </div>

            {/* Body */}
            <div style={{ backgroundColor: c.bgDim, borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
              <p style={{ color: c.primary, fontSize: "13px", fontWeight: 700, marginBottom: "10px" }}>
                How Fuselage handles your documents
              </p>
              {[
                ["Neutral custodian", "Fuselage acts as a neutral third-party custodian. We are not a party to this deal and will not share your documents with anyone except as required by law."],
                ["7-year retention", "Documents are retained for 7 years from the date of upload in line with international trade document standards and GDPR Article 17(3)(b)."],
                ["Legal cooperation", "In the event of a valid legal request, Fuselage will cooperate with recognised authorities and provide certified document exports upon proper authority."],
                ["Your rights", "You may request a copy of your stored documents or raise a data subject request at any time by contacting logistics@fuselage.io."],
              ].map(([title, body]) => (
                <div key={title} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
                  <CheckCircle2 style={{ color: c.green, width: "14px", height: "14px", flexShrink: 0, marginTop: "2px" }} />
                  <div>
                    <p style={{ color: c.primary, fontSize: "12px", fontWeight: 600 }}>{title}</p>
                    <p style={{ color: c.muted, fontSize: "12px", lineHeight: 1.6 }}>{body}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Consent checkbox */}
            <label
              style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer", marginBottom: "20px" }}
            >
              <input
                type="checkbox"
                checked={gdprChecked}
                onChange={(e) => setGdprChecked(e.target.checked)}
                style={{ width: "16px", height: "16px", marginTop: "2px", accentColor: c.primary, flexShrink: 0 }}
              />
              <span style={{ color: c.body, fontSize: "13px", lineHeight: 1.6 }}>
                I have read and understood how Fuselage stores and handles transaction documents.
                I consent to my uploaded documents being held in the Fuselage secure registry
                for up to <strong>7 years</strong> and used as described above.
              </span>
            </label>

            {/* Actions */}
            <div style={{ display: "flex", gap: "10px" }}>
              <button
                onClick={confirmGdprConsent}
                disabled={!gdprChecked || savingConsent}
                style={{
                  flex: 1, height: "42px", backgroundColor: gdprChecked ? c.primary : c.border,
                  color: "#fff", border: "none", borderRadius: "8px",
                  fontSize: "14px", fontWeight: 600,
                  cursor: gdprChecked && !savingConsent ? "pointer" : "not-allowed",
                  transition: "background-color 0.15s",
                }}
              >
                {savingConsent ? "Saving…" : "Confirm & upload document"}
              </button>
              <button
                onClick={() => { setShowGdprModal(false); setGdprChecked(false); }}
                style={{ height: "42px", padding: "0 20px", backgroundColor: c.bgDim, color: c.muted, border: `1px solid ${c.border}`, borderRadius: "8px", fontSize: "14px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>

            <p style={{ color: c.muted, fontSize: "11px", textAlign: "center", marginTop: "14px", lineHeight: 1.5 }}>
              This consent is stored against your account and applies to all future uploads on this platform.
              It will not be shown again.
            </p>
          </div>
        </div>
      )}

      {/* ── Floating chat widget (LinkedIn-style) ─────────────────────── */}
      <DealChatWidget
        dealId={deal.id}
        messages={deal.messages ?? []}
        currentUserId={currentUserId}
        otherPartyName={
          role === "buyer"
            ? (seller?.company_name ?? "Exporter")
            : (buyer?.full_name ?? "Buyer")
        }
        isClosed={isClosed}
        dealStatus={deal.status}
        whatsappUnlocked={!!(deal as unknown as Record<string, unknown>).whatsapp_unlocked}
        role={role}
        listing={listing ? {
          year:      listing.year as number,
          make:      listing.make as string,
          model:     listing.model as string,
          price_usd: listing.price_usd as number,
          image:     primaryImage ?? null,
        } : null}
        buyerNotes={deal.buyer_notes ?? null}
        buyerName={buyer?.full_name ?? "Buyer"}
      />
    </div>
  );
}
