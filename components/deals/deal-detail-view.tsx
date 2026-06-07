"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import {
  DEAL_STATUS_LABELS, type Deal, type DealStatus,
} from "@/lib/types";
import { formatUSD, formatDate, getInitials } from "@/lib/utils";
import {
  Send, Upload, CheckCircle2, Clock, MapPin, FileCheck,
  AlertCircle, Ship, ChevronRight, Package,
} from "lucide-react";

// ─── Design tokens ────────────────────────────────────────────────────────────
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
  amber:     "#F59E0B",
  amberBg:   "#FEF3C7",
};

// ─── Stitch transit map image ─────────────────────────────────────────────────
const TRANSIT_MAP =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuA3RCvVB9KWdOWUlooqQyuM_O7rlwpdu-mfagKdUaQUD3ordCamGg4VHmxJDmOvJ6wsk6512pr9J0--q2axmB0CcUrDMJBEpEvYHE7Z_NjahR3FusrfWlRkwINsN1VtnHX6AAq5uM5rGLq3Fv3c2xCWPDn6As0NMJKOSJxYM6mDFmIQW21N8I7L4AIpG0PcdOYhIfeopiyrCQTKkrWyLQo25ZXlbBvu1KY_v0_wRnPuP7AXWc5IsJpiR7ggv1mNZfsbNfYUBN2iFI4";

// ─── Order lifecycle steps ────────────────────────────────────────────────────
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

// ─── Props ────────────────────────────────────────────────────────────────────
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

// ─── Component ────────────────────────────────────────────────────────────────
export function DealDetailView({ deal, currentUserId, role }: Props) {
  const router = useRouter();
  const [message, setMessage]           = useState("");
  const [sendingMsg, setSendingMsg]     = useState(false);
  const [updatingStatus, setUpdating]   = useState(false);
  const [agreedPrice, setAgreedPrice]   = useState(deal.agreed_price_usd?.toString() ?? "");
  const [trackingNo, setTrackingNo]     = useState(deal.tracking_number ?? "");
  const [paymentAmt, setPaymentAmt]     = useState("");
  const [wireRef, setWireRef]           = useState("");
  const [uploadingProof, setUploading]  = useState(false);

  const listing   = deal.listing as Deal["listing"] & { images?: { url: string; is_primary: boolean }[] };
  const buyer     = deal.buyer  as { full_name: string; country: string; email: string; phone?: string };
  const seller    = deal.seller as { company_name: string; city: string; profile: { full_name: string } };
  const primaryImage = listing?.images?.find((i) => i.is_primary)?.url ?? listing?.images?.[0]?.url;

  const currentIdx = STATUS_ORDER.indexOf(deal.status);
  const isClosed   = ["completed", "cancelled"].includes(deal.status);
  const canAdvance = role === "seller" && !!SELLER_NEXT[deal.status];

  // Doc statuses derived from deal stage
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

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSendingMsg(true);
    const supabase = createClient();
    await supabase.from("deal_messages").insert({
      deal_id: deal.id, sender_id: currentUserId, message: message.trim(),
    });
    setMessage(""); setSendingMsg(false); router.refresh();
  }

  async function advanceStatus() {
    const next = SELLER_NEXT[deal.status];
    if (!next) return;
    setUpdating(true);
    const supabase = createClient();
    const payload: Record<string, unknown> = { status: next };
    if (next === "agreed"  && agreedPrice)  payload.agreed_price_usd = parseFloat(agreedPrice);
    if (next === "shipped" && trackingNo)   payload.tracking_number  = trackingNo;
    await supabase.from("deals").update(payload).eq("id", deal.id);
    setUpdating(false); router.refresh();
  }

  async function uploadPaymentProof(e: React.FormEvent) {
    e.preventDefault();
    setUploading(true);
    const supabase = createClient();
    await supabase.from("payment_proofs").insert({
      deal_id: deal.id, uploaded_by: currentUserId,
      file_url: "#placeholder",
      amount_usd:     paymentAmt ? parseFloat(paymentAmt) : null,
      wire_reference: wireRef || null,
    });
    await supabase.from("deals").update({ status: "payment_uploaded" }).eq("id", deal.id);
    setUploading(false); router.refresh();
  }

  return (
    <div style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif" }} className="min-h-screen">
      <div className="max-w-[1280px] mx-auto px-8 md:px-16 py-10">

        {/* ── Deal header ─────────────────────────────────────────────────── */}
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
            <span
              style={{ backgroundColor: c.greenBg, color: c.greenText }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full"
            >
              {DEAL_STATUS_LABELS[deal.status]}
            </span>
            {deal.agreed_price_usd && (
              <span style={{ color: c.primary }} className="text-lg font-bold">
                {formatUSD(deal.agreed_price_usd)}
              </span>
            )}
          </div>
        </div>

        {/* ── Order Lifecycle stepper ──────────────────────────────────────── */}
        <div
          style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
          className="p-6 mb-6"
        >
          <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-5">
            Order Lifecycle
          </p>
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {LIFECYCLE.map(({ key, label }, i) => {
              const stepIdx = STATUS_ORDER.indexOf(key);
              const done    = stepIdx < currentIdx;
              const active  = stepIdx === currentIdx;
              return (
                <div key={key} className="flex items-center gap-1 shrink-0">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      style={{
                        width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                        backgroundColor: done ? c.green : active ? c.primary : c.border,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}
                    >
                      {done   && <CheckCircle2 className="h-3.5 w-3.5 text-white" />}
                      {active && <Clock        className="h-3.5 w-3.5 text-white" />}
                    </div>
                    <span
                      style={{ color: done || active ? c.primary : c.muted, whiteSpace: "nowrap" }}
                      className="text-[10px] font-medium text-center max-w-[70px] leading-tight"
                    >
                      {label}
                    </span>
                  </div>
                  {i < LIFECYCLE.length - 1 && (
                    <div
                      style={{
                        height: "2px", width: "32px", marginBottom: "18px",
                        backgroundColor: done ? c.green : c.border, flexShrink: 0,
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Main two-column layout ───────────────────────────────────────── */}
        <div className="grid md:grid-cols-3 gap-6">

          {/* Left — map + docs + vehicle + activity */}
          <div className="md:col-span-2 space-y-6">

            {/* Live Transit Map */}
            <div
              style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem", overflow: "hidden" }}
            >
              <div className="relative w-full" style={{ aspectRatio: "16/7" }}>
                <Image
                  src={TRANSIT_MAP}
                  alt="Live transit map — Atlantic corridor"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                {/* Overlay badge */}
                <div className="absolute top-3 left-3">
                  <span
                    style={{ backgroundColor: "rgba(15,23,42,0.85)", color: "#fff" }}
                    className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full"
                  >
                    <span
                      style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: c.green, display: "inline-block" }}
                      className="animate-pulse"
                    />
                    Live Transit Map
                  </span>
                </div>
                {deal.tracking_number && (
                  <div className="absolute bottom-3 left-3">
                    <span
                      style={{ backgroundColor: "rgba(15,23,42,0.85)", color: "#fff" }}
                      className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-full"
                    >
                      <Ship className="h-3 w-3" />
                      {deal.tracking_number}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Shipping & Documents */}
            <div
              style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
              className="p-6"
            >
              <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-4">
                Shipping &amp; Documents
              </p>
              <div className="space-y-3 mb-5">
                {docStatuses.map(({ label, done, pending }) => (
                  <div
                    key={label}
                    style={{ border: `1px solid ${c.border}`, borderRadius: "0.375rem" }}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <FileCheck style={{ color: done ? c.green : c.muted }} className="h-4 w-4" />
                      <span style={{ color: c.primary }} className="text-sm font-medium">{label}</span>
                    </div>
                    {done ? (
                      <span style={{ backgroundColor: c.greenBg, color: c.greenText }} className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> Verified
                      </span>
                    ) : pending ? (
                      <span style={{ backgroundColor: c.amberBg, color: c.amber }} className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <Clock className="h-3 w-3" /> In Review
                      </span>
                    ) : (
                      <span style={{ color: c.muted }} className="text-xs">Pending</span>
                    )}
                  </div>
                ))}
              </div>
              <p style={{ color: c.muted }} className="text-xs leading-relaxed">
                All legal documentation is being processed by our compliance team to ensure a smooth cross-border handover.
              </p>
            </div>

            {/* Vehicle details */}
            <div
              style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
              className="p-6 grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {[
                { label: "VIN",       value: (listing as any)?.vin ?? "—" },
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
            <div
              style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
              className="p-6"
            >
              <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-4">
                Activity Log
              </p>
              <div className="space-y-3">
                {deal.messages?.slice(-5).reverse().map((msg) => (
                  <div key={msg.id} className="flex items-start gap-3">
                    <div
                      style={{ backgroundColor: c.bgDim, width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, color: c.muted }}
                      className="flex items-center justify-center text-xs font-semibold"
                    >
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

          {/* Right sidebar — actions + parties + messages */}
          <div className="space-y-5">

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
                <p style={{ color: c.primary }} className="text-sm font-medium">{buyer?.full_name}</p>
                <p style={{ color: c.muted }} className="text-xs flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{buyer?.country}</p>
                {role === "seller" && buyer?.email && <p style={{ color: c.muted }} className="text-xs mt-0.5">{buyer.email}</p>}
              </div>
              <div style={{ borderTop: `1px solid ${c.border}` }} className="pt-3">
                <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-1.5">Exporter</p>
                <p style={{ color: c.primary }} className="text-sm font-medium">{seller?.company_name}</p>
                <p style={{ color: c.muted }} className="text-xs flex items-center gap-1 mt-0.5"><MapPin className="h-3 w-3" />{seller?.city}, UAE</p>
              </div>
            </div>

            {/* Seller action card */}
            {role === "seller" && canAdvance && !isClosed && (
              <div
                style={{ backgroundColor: c.surface, border: `2px solid ${c.green}`, borderRadius: "0.5rem" }}
                className="p-4"
              >
                <p style={{ color: c.primary }} className="font-semibold text-sm mb-3">Action Required</p>
                {deal.status === "negotiating" && (
                  <div className="mb-3">
                    <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">Agreed Price (USD)</label>
                    <input
                      type="number" placeholder="e.g. 82000" value={agreedPrice}
                      onChange={(e) => setAgreedPrice(e.target.value)}
                      style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }}
                    />
                  </div>
                )}
                {deal.status === "payment_confirmed" && (
                  <div className="mb-3">
                    <label style={{ color: c.muted }} className="text-xs font-medium block mb-1">Bill of Lading / Tracking No.</label>
                    <input
                      placeholder="BL123456789" value={trackingNo}
                      onChange={(e) => setTrackingNo(e.target.value)}
                      style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }}
                    />
                  </div>
                )}
                <button
                  onClick={advanceStatus} disabled={updatingStatus}
                  style={{ backgroundColor: c.green, color: "#fff", width: "100%", height: "38px", borderRadius: "6px", fontSize: "13px", fontWeight: 600 }}
                  className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {SELLER_LABELS[deal.status]}
                </button>
              </div>
            )}

            {/* Buyer: upload payment proof */}
            {role === "buyer" && deal.status === "agreed" && (
              <div style={{ backgroundColor: c.surface, border: `2px solid ${c.amber}`, borderRadius: "0.5rem" }} className="p-4">
                <p style={{ color: c.primary }} className="font-semibold text-sm mb-1">Upload Payment Proof</p>
                <p style={{ color: c.muted }} className="text-xs mb-3 leading-relaxed">
                  Wire payment to the exporter and confirm here. Your deal will be tracked through to delivery.
                </p>
                <form onSubmit={uploadPaymentProof} className="space-y-2">
                  <input
                    type="number" placeholder={`Amount sent (USD)`} value={paymentAmt}
                    onChange={(e) => setPaymentAmt(e.target.value)}
                    style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }}
                  />
                  <input
                    placeholder="Wire reference (TXN-…)" value={wireRef}
                    onChange={(e) => setWireRef(e.target.value)}
                    style={{ width: "100%", height: "36px", border: `1px solid ${c.border}`, borderRadius: "6px", paddingLeft: "10px", fontSize: "13px", outline: "none", color: c.primary }}
                  />
                  <button
                    type="submit" disabled={uploadingProof}
                    style={{ backgroundColor: c.primary, color: "#fff", width: "100%", height: "38px", borderRadius: "6px", fontSize: "13px", fontWeight: 600 }}
                    className="flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                  >
                    <Upload className="h-4 w-4" />
                    {uploadingProof ? "Uploading…" : "Confirm payment sent"}
                  </button>
                </form>
              </div>
            )}

            {/* Payment proofs */}
            {deal.payment_proofs && deal.payment_proofs.length > 0 && (
              <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }} className="p-4">
                <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-3">Payment Records</p>
                <div className="space-y-2">
                  {deal.payment_proofs.map((proof) => (
                    <div key={proof.id} style={{ borderBottom: `1px solid ${c.border}` }} className="flex justify-between pb-2 last:border-0 last:pb-0">
                      <div>
                        <p style={{ color: c.primary }} className="text-sm font-medium">
                          {proof.amount_usd ? formatUSD(proof.amount_usd) : "Amount not specified"}
                        </p>
                        {proof.wire_reference && <p style={{ color: c.muted }} className="text-xs">Ref: {proof.wire_reference}</p>}
                      </div>
                      <p style={{ color: c.muted }} className="text-xs">{formatDate(proof.created_at)}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }} className="p-4">
              <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-3">Messages</p>
              <div className="space-y-3 max-h-64 overflow-y-auto mb-3">
                {(!deal.messages || deal.messages.length === 0) && (
                  <p style={{ color: c.muted }} className="text-xs text-center py-4">No messages yet.</p>
                )}
                {deal.messages?.map((msg) => {
                  const isMine = msg.sender_id === currentUserId;
                  return (
                    <div key={msg.id} className={`flex gap-2 ${isMine ? "flex-row-reverse" : ""}`}>
                      <div
                        style={{ backgroundColor: c.bgDim, width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0, color: c.muted }}
                        className="flex items-center justify-center text-xs font-semibold shrink-0"
                      >
                        {getInitials(msg.sender?.full_name ?? "?")}
                      </div>
                      <div
                        style={{
                          backgroundColor: isMine ? c.primary : c.bgDim,
                          color: isMine ? "#fff" : c.body,
                          borderRadius: "8px", padding: "8px 12px",
                          maxWidth: "200px", fontSize: "12px",
                        }}
                      >
                        <p>{msg.message}</p>
                        <p style={{ opacity: 0.6, fontSize: "10px", marginTop: "2px" }}>{formatDate(msg.created_at)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {!isClosed && (
                <form onSubmit={sendMessage} className="flex gap-2 pt-2" style={{ borderTop: `1px solid ${c.border}` }}>
                  <textarea
                    placeholder="Send a message…"
                    rows={2}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={{
                      flex: 1, resize: "none", border: `1px solid ${c.border}`, borderRadius: "6px",
                      padding: "8px 10px", fontSize: "12px", outline: "none", color: c.body,
                    }}
                  />
                  <button
                    type="submit" disabled={sendingMsg || !message.trim()}
                    style={{ backgroundColor: c.primary, color: "#fff", width: "36px", height: "36px", borderRadius: "6px", flexShrink: 0 }}
                    className="flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 self-end"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
