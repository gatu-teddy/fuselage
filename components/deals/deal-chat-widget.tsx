"use client";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { getInitials, formatDateTime } from "@/lib/utils";
import { Send, MessageSquare, ChevronDown, Lock, ExternalLink, ChevronUp } from "lucide-react";
import { c } from "@/lib/tokens";

// ── Deal stages where WhatsApp is not yet relevant ───────────────────────────
const WA_LOCKED_STATUSES = ["inquired"];
// ── Cost to unlock WhatsApp contact (USD) ────────────────────────────────────
const WA_UNLOCK_COST = 5;

// ─── Static style constants — extracted from render loop hot path (#16) ──────
const AVATAR_STYLE: React.CSSProperties = {
  width: "24px", height: "24px", borderRadius: "50%",
  backgroundColor: c.bgDim, display: "flex", alignItems: "center",
  justifyContent: "center", fontSize: "9px", fontWeight: 700,
  color: c.muted, flexShrink: 0,
};

const TIMESTAMP_STYLE: React.CSSProperties = {
  fontSize: "10px", opacity: 0.55, textAlign: "right" as const,
};

const SYSTEM_PILL_STYLE: React.CSSProperties = {
  backgroundColor: c.bgDim, color: c.muted, fontSize: "10px",
  fontWeight: 600, padding: "3px 10px", borderRadius: "99px",
  border: `1px solid ${c.border}`,
};

function WhatsAppIcon({ size = 16, className = "" }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  message: string;
  created_at: string;
  sender_id: string;
  sender: { full_name: string; avatar_url?: string };
}

interface ListingSnippet {
  year: number;
  make: string;
  model: string;
  price_usd: number;
  image?: string | null;
}

interface Props {
  dealId: string;
  messages: Message[];
  currentUserId: string;
  otherPartyName: string;
  isClosed: boolean;
  dealStatus: string;
  /** Whether WhatsApp contact has already been paid for on this deal */
  whatsappUnlocked: boolean;
  /** The role of the current viewer */
  role: "buyer" | "seller";
  /** Listing details shown as pinned card in thread */
  listing?: ListingSnippet | null;
  /** Buyer's initial inquiry notes — shown as first message */
  buyerNotes?: string | null;
  /** Buyer's name for the first notes message attribution */
  buyerName?: string;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function DealChatWidget({
  dealId, messages, currentUserId, otherPartyName,
  isClosed, dealStatus, whatsappUnlocked, role,
  listing, buyerNotes, buyerName,
}: Props) {
  const bodyRef    = useRef<HTMLDivElement>(null);
  const widgetRef  = useRef<HTMLDivElement>(null);

  const [isOpen,        setIsOpen]        = useState(false);
  const [message,       setMessage]       = useState("");
  const [sending,       setSending]       = useState(false);
  const [lastSeen,      setLastSeen]      = useState<number>(() => {
    // Read localStorage once at mount — avoids a useEffect + setState cascade
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(`chat-seen-${dealId}`);
    return stored ? parseInt(stored, 10) : 0;
  });
  const [waPanel,       setWaPanel]       = useState<"closed" | "gate" | "unlocked">("closed");
  // unlockDone mirrors the server prop; setter wired up when Stripe integration lands
  const unlockDone = whatsappUnlocked;

  // ── Live messages state — seeded from SSR prop, updated via Realtime (#12) ─
  const [liveMessages,   setLiveMessages]   = useState<Message[]>(messages);
  // ── Pagination state (#13) ────────────────────────────────────────────────
  const [hasEarlier,     setHasEarlier]     = useState(true);
  const [loadingEarlier, setLoadingEarlier] = useState(false);

  const lsKey = `chat-seen-${dealId}`;

  // ── Write global chat info to localStorage for the global bubble ─────────
  useEffect(() => {
    localStorage.setItem("last-active-chat", JSON.stringify({
      dealId, otherPartyName, dealStatus, isClosed, role,
      userId: currentUserId,
    }));
  }, [dealId, otherPartyName, dealStatus, isClosed, role, currentUserId]);

  // ── Supabase Realtime subscription — append new messages without reload ───
  // (#12) — replaces the router.refresh() pattern for live updates
  useEffect(() => {
    const supabase = createClient();
    const channel = supabase
      .channel(`deal-messages-${dealId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "deal_messages", filter: `deal_id=eq.${dealId}` },
        async (payload) => {
          // Fetch the full row including the sender join (realtime payload lacks joins)
          const { data: fullMsg } = await supabase
            .from("deal_messages")
            .select("*, sender:profiles(full_name, avatar_url)")
            .eq("id", payload.new.id)
            .single();
          if (!fullMsg) return;
          setLiveMessages((prev) => {
            // Deduplicate by id in case of any double-delivery
            if (prev.some((m) => m.id === fullMsg.id)) return prev;
            return [...prev, fullMsg as Message];
          });
        }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [dealId]);

  // ── Click outside to minimize ────────────────────────────────────────────
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (isOpen && widgetRef.current && !widgetRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [isOpen]);

  // ── Unread count ─────────────────────────────────────────────────────────
  // lastSeen is initialized from localStorage in useState() above — no effect needed

  const unread = liveMessages.filter(
    (m) => m.sender_id !== currentUserId &&
           new Date(m.created_at).getTime() > lastSeen,
  ).length;

  function openWidget() {
    setIsOpen(true);
    const now = Date.now();
    setLastSeen(now);
    localStorage.setItem(lsKey, String(now));
    setTimeout(() => {
      if (bodyRef.current) bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }, 60);
  }

  // Auto-scroll when new live messages arrive or widget opens
  useEffect(() => {
    if (isOpen && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [liveMessages.length, isOpen]);

  // ── Send message ─────────────────────────────────────────────────────────
  // Realtime subscription handles appending the new message to liveMessages,
  // so router.refresh() is no longer needed here.
  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) return;
    setSending(true);
    const supabase = createClient();
    await supabase.from("deal_messages").insert({
      deal_id: dealId, sender_id: currentUserId, message: message.trim(),
    });
    setMessage(""); setSending(false);
    const now = Date.now();
    setLastSeen(now);
    localStorage.setItem(lsKey, String(now));
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  }

  // ── Load earlier messages (pagination — #13) ──────────────────────────────
  async function loadEarlierMessages() {
    if (!liveMessages.length || loadingEarlier) return;
    setLoadingEarlier(true);
    const oldest = liveMessages[0];
    const supabase = createClient();
    const { data: earlier } = await supabase
      .from("deal_messages")
      .select("*, sender:profiles(full_name, avatar_url)")
      .eq("deal_id", dealId)
      .lt("created_at", oldest.created_at)
      .order("created_at", { ascending: true })
      .limit(50);
    if (!earlier || earlier.length === 0) {
      setHasEarlier(false);
    } else {
      setLiveMessages((prev) => [...(earlier as Message[]), ...prev]);
    }
    setLoadingEarlier(false);
  }

  // ── WhatsApp unlock ──────────────────────────────────────────────────────
  const waIsLockedByStatus = WA_LOCKED_STATUSES.includes(dealStatus);

  function handleWaClick() {
    if (waIsLockedByStatus) return;
    if (unlockDone) { setWaPanel((p) => p === "unlocked" ? "closed" : "unlocked"); return; }
    setWaPanel((p) => p === "gate" ? "closed" : "gate");
  }

  // ── Status dot colour ────────────────────────────────────────────────────
  const statusDot =
    isClosed                  ? "#94A3B8" :
    WA_LOCKED_STATUSES.includes(dealStatus) ? c.amber :
    c.green;

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div ref={widgetRef} style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 200, fontFamily: "Inter, sans-serif" }}>

      {/* ── Expanded panel ──────────────────────────────────────────────── */}
      {isOpen && (
        <div style={{
          width: "360px",
          backgroundColor: c.surface,
          border: `1px solid ${c.border}`,
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0,0,0,0.14), 0 2px 8px rgba(0,0,0,0.08)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          marginBottom: "12px",
        }}>

          {/* Header */}
          <div style={{ backgroundColor: c.primary, padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                {getInitials(otherPartyName)}
              </div>
              <div>
                <p style={{ color: "#fff", fontSize: "13px", fontWeight: 600, lineHeight: 1 }}>{otherPartyName}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginTop: "3px" }}>
                  <span style={{ width: "7px", height: "7px", borderRadius: "50%", backgroundColor: statusDot, flexShrink: 0 }} />
                  <span style={{ color: "rgba(255,255,255,0.55)", fontSize: "11px", textTransform: "capitalize" }}>
                    {isClosed ? "deal closed" : dealStatus.replace(/_/g, " ")}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              {/* WhatsApp button */}
              <button
                onClick={handleWaClick}
                disabled={waIsLockedByStatus}
                title={
                  waIsLockedByStatus
                    ? "Available once negotiation begins"
                    : unlockDone
                    ? "View WhatsApp contact"
                    : `Unlock direct contact — $${WA_UNLOCK_COST}`
                }
                style={{
                  backgroundColor: unlockDone ? c.wa : "rgba(255,255,255,0.08)",
                  border: `1px solid ${unlockDone ? c.wa : "rgba(255,255,255,0.12)"}`,
                  borderRadius: "6px",
                  width: "30px", height: "30px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: waIsLockedByStatus ? "not-allowed" : "pointer",
                  color: unlockDone ? "#fff" : waIsLockedByStatus ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.55)",
                  transition: "all 0.15s",
                  position: "relative",
                }}
              >
                {!unlockDone && !waIsLockedByStatus && (
                  <Lock style={{ position: "absolute", top: "2px", right: "2px", width: "8px", height: "8px", color: c.amber }} />
                )}
                <WhatsAppIcon size={14} />
              </button>

              <button onClick={() => setIsOpen(false)} style={{ backgroundColor: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "6px", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "rgba(255,255,255,0.6)" }}>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── WhatsApp gate panel ────────────────────────────────────── */}
          {waPanel === "gate" && (
            <div style={{ backgroundColor: c.amberBg, borderBottom: `1px solid ${c.amberBorder}`, padding: "14px 16px", flexShrink: 0 }}>
              <p style={{ color: "#92400E", fontSize: "13px", fontWeight: 700, marginBottom: "6px" }}>
                Direct contact — coming soon
              </p>
              <p style={{ color: "#92400E", fontSize: "12px", lineHeight: 1.55, marginBottom: "12px" }}>
                The ability to unlock direct WhatsApp contact for a one-time fee will be available shortly. All formal steps — price agreement, payment confirmation, and shipping — must remain on-platform to retain dispute protection.
              </p>
              <button
                onClick={() => setWaPanel("closed")}
                style={{ backgroundColor: "#fff", color: c.muted, border: `1px solid ${c.amberBorder}`, borderRadius: "6px", height: "34px", padding: "0 16px", fontSize: "13px", cursor: "pointer", width: "100%" }}
              >
                Got it
              </button>
            </div>
          )}

          {/* ── WhatsApp unlocked panel ────────────────────────────────── */}
          {waPanel === "unlocked" && unlockDone && (
            <div style={{ backgroundColor: c.waBg, borderBottom: `1px solid ${c.waBorder}`, padding: "14px 16px", flexShrink: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <WhatsAppIcon size={14} />
                <p style={{ color: c.waText, fontSize: "13px", fontWeight: 700 }}>Direct contact unlocked</p>
              </div>
              <p style={{ color: "#166534", fontSize: "12px", lineHeight: 1.55, marginBottom: "10px" }}>
                Contact details have been shared with the other party. Remember: all binding steps must remain on-platform.
              </p>
              <a
                href={`https://wa.me/`}
                target="_blank"
                rel="noopener noreferrer"
                style={{ display: "inline-flex", alignItems: "center", gap: "6px", backgroundColor: c.wa, color: "#fff", borderRadius: "6px", padding: "7px 14px", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open WhatsApp
              </a>
              <p style={{ color: "#166534", fontSize: "10px", marginTop: "8px", lineHeight: 1.4, opacity: 0.8 }}>
                Phone number sharing coming soon — the other party will be notified to share theirs.
              </p>
              <button onClick={() => setWaPanel("closed")} style={{ marginTop: "8px", background: "none", border: "none", color: c.waText, fontSize: "11px", cursor: "pointer", textDecoration: "underline" }}>
                Close
              </button>
            </div>
          )}

          {/* ── Message thread ────────────────────────────────────────── */}
          <div
            ref={bodyRef}
            style={{ flex: 1, overflowY: "auto", padding: "10px 12px 8px", display: "flex", flexDirection: "column", gap: "10px", minHeight: "260px", maxHeight: "320px" }}
          >
            {/* ── Load earlier button (#13) ────────────────────────────── */}
            {liveMessages.length > 0 && hasEarlier && (
              <div style={{ display: "flex", justifyContent: "center", flexShrink: 0 }}>
                <button
                  onClick={loadEarlierMessages}
                  disabled={loadingEarlier}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: "4px",
                    backgroundColor: "transparent", border: `1px solid ${c.border}`,
                    borderRadius: "99px", padding: "3px 12px",
                    fontSize: "11px", color: c.muted, cursor: "pointer",
                    opacity: loadingEarlier ? 0.5 : 1,
                  }}
                >
                  <ChevronUp className="h-3 w-3" />
                  {loadingEarlier ? "Loading…" : "Load earlier"}
                </button>
              </div>
            )}

            {/* ── Pinned listing card ──────────────────────────────────── */}
            {listing && (
              <div style={{ backgroundColor: c.bgDim, border: `1px solid ${c.border}`, borderRadius: "10px", overflow: "hidden", flexShrink: 0, marginBottom: "4px" }}>
                <div style={{ display: "flex", gap: "0" }}>
                  {listing.image ? (
                    <div style={{ width: "72px", flexShrink: 0, position: "relative", backgroundColor: "#E2E8F0" }}>
                      <Image src={listing.image} alt={`${listing.year} ${listing.make}`} fill style={{ objectFit: "cover" }} sizes="72px" />
                    </div>
                  ) : (
                    <div style={{ width: "72px", flexShrink: 0, backgroundColor: c.border, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: "18px" }}>🚗</span>
                    </div>
                  )}
                  <div style={{ padding: "10px 12px", flex: 1, minWidth: 0 }}>
                    <p style={{ color: c.primary, fontSize: "12px", fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                      {listing.year} {listing.make} {listing.model}
                    </p>
                    <p style={{ color: c.green, fontSize: "13px", fontWeight: 700, marginTop: "2px" }}>
                      ${listing.price_usd.toLocaleString()}
                    </p>
                    <p style={{ color: c.muted, fontSize: "10px", marginTop: "2px" }}>Inquiry</p>
                  </div>
                </div>
              </div>
            )}

            {/* ── Buyer notes as first message ─────────────────────────── */}
            {buyerNotes && (
              <div style={{ display: "flex", flexDirection: role === "buyer" ? "row-reverse" : "row", alignItems: "flex-end", gap: "6px" }}>
                <div style={AVATAR_STYLE}>
                  {getInitials(buyerName ?? "B")}
                </div>
                <div style={{ maxWidth: "220px", backgroundColor: role === "buyer" ? c.primary : c.bgDim, color: role === "buyer" ? "#fff" : c.body, borderRadius: role === "buyer" ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "8px 11px", fontSize: "12px", lineHeight: 1.55 }}>
                  <p style={{ fontSize: "9px", fontWeight: 700, opacity: 0.6, marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Inquiry note</p>
                  <p style={{ marginBottom: "3px" }}>{buyerNotes}</p>
                </div>
              </div>
            )}

            {liveMessages.length === 0 && !buyerNotes && (
              <div style={{ textAlign: "center", marginTop: "24px" }}>
                <MessageSquare style={{ color: c.border, margin: "0 auto 10px" }} className="h-8 w-8" />
                <p style={{ color: c.muted, fontSize: "13px" }}>No messages yet.</p>
                <p style={{ color: c.muted, fontSize: "11px", marginTop: "4px" }}>Start the conversation below.</p>
              </div>
            )}

            {/* ── Message list ─────────────────────────────────────────── */}
            {liveMessages.map((msg) => {
              // System events render as centred status pills
              if ((msg as { message_type?: string }).message_type === "system_event") {
                const meta = (msg as { metadata?: { to_status?: string } }).metadata;
                return (
                  <div key={msg.id} style={{ display: "flex", justifyContent: "center", margin: "4px 0" }}>
                    <span style={SYSTEM_PILL_STYLE}>
                      {meta?.to_status ? `Status → ${meta.to_status.replace(/_/g, " ")}` : msg.message}
                    </span>
                  </div>
                );
              }
              const isMine = msg.sender_id === currentUserId;
              return (
                <div key={msg.id} style={{ display: "flex", flexDirection: isMine ? "row-reverse" : "row", alignItems: "flex-end", gap: "6px" }}>
                  <div style={AVATAR_STYLE}>
                    {getInitials(msg.sender?.full_name ?? "?")}
                  </div>
                  <div style={{ maxWidth: "220px", backgroundColor: isMine ? c.primary : c.bgDim, color: isMine ? "#fff" : c.body, borderRadius: isMine ? "12px 12px 2px 12px" : "12px 12px 12px 2px", padding: "8px 11px", fontSize: "12px", lineHeight: 1.55 }}>
                    <p style={{ marginBottom: "3px" }}>{msg.message}</p>
                    <p style={TIMESTAMP_STYLE}>{formatDateTime(msg.created_at)}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Input ─────────────────────────────────────────────────── */}
          {!isClosed ? (
            <form onSubmit={handleSend} style={{ borderTop: `1px solid ${c.border}`, padding: "10px 12px", display: "flex", gap: "8px", alignItems: "flex-end", flexShrink: 0 }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Message… (Enter to send)"
                rows={1}
                style={{ flex: 1, resize: "none", border: `1px solid ${c.border}`, borderRadius: "20px", padding: "8px 14px", fontSize: "12px", outline: "none", color: c.body, lineHeight: 1.5, fontFamily: "Inter, sans-serif", maxHeight: "80px", overflowY: "auto" }}
              />
              <button type="submit" disabled={sending || !message.trim()} style={{ backgroundColor: c.primary, color: "#fff", width: "34px", height: "34px", borderRadius: "50%", border: "none", cursor: message.trim() ? "pointer" : "not-allowed", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }} className="disabled:opacity-35 hover:opacity-90 transition-opacity">
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <div style={{ borderTop: `1px solid ${c.border}`, padding: "12px", textAlign: "center" }}>
              <p style={{ color: c.muted, fontSize: "12px" }}>This deal is closed.</p>
            </div>
          )}
        </div>
      )}

      {/* ── Collapsed pill ────────────────────────────────────────────────── */}
      {!isOpen && (
        <button
          onClick={openWidget}
          style={{ backgroundColor: c.primary, color: "#fff", border: "none", borderRadius: "24px", height: "48px", padding: "0 20px 0 14px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.18)", transition: "transform 0.15s, box-shadow 0.15s" }}
          className="hover:scale-105 transition-all"
        >
          <div style={{ position: "relative" }}>
            <MessageSquare className="h-5 w-5" />
            {unread > 0 && (
              <span style={{ position: "absolute", top: "-6px", right: "-6px", backgroundColor: "#EF4444", color: "#fff", fontSize: "9px", fontWeight: 800, width: "16px", height: "16px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", border: `2px solid ${c.primary}` }}>
                {unread > 9 ? "9+" : unread}
              </span>
            )}
          </div>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1 }}>Messages</p>
            <p style={{ fontSize: "10px", opacity: 0.55, marginTop: "2px", lineHeight: 1 }}>{otherPartyName}</p>
          </div>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: statusDot, marginLeft: "4px", flexShrink: 0 }} />
        </button>
      )}
    </div>
  );
}
