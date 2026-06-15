"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { c } from "@/lib/tokens";

interface ChatInfo {
  dealId: string;
  otherPartyName: string;
  dealStatus: string;
  isClosed: boolean;
  role: "buyer" | "seller";
  userId?: string;
}

export function GlobalChatBubble() {
  const pathname = usePathname();
  const router   = useRouter();
  const [info, setInfo] = useState<ChatInfo | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function loadAndVerify() {
      try {
        const stored = localStorage.getItem("last-active-chat");
        if (!stored) return;

        const parsed: ChatInfo = JSON.parse(stored);

        // Verify the stored session belongs to the currently logged-in user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          // Nobody logged in — clear stale data and hide bubble
          localStorage.removeItem("last-active-chat");
          setInfo(null);
          return;
        }

        if (parsed.userId && parsed.userId !== user.id) {
          // Different user logged in — clear previous user's data
          localStorage.removeItem("last-active-chat");
          setInfo(null);
          return;
        }

        setInfo(parsed);
      } catch { /* ignore */ }
    }

    loadAndVerify();
  }, [pathname]);

  // Don't show if already on the deal page
  if (!info || pathname.includes(info.dealId)) return null;

  const statusDot = info.isClosed ? "#94A3B8" : info.dealStatus === "inquired" ? c.amber : c.green;

  // Sellers use /seller/sales/, buyers use /buyer/deals/
  const dealPath = info.role === "buyer"
    ? `/buyer/deals/${info.dealId}`
    : `/seller/sales/${info.dealId}`;

  return (
    <button
      onClick={() => router.push(dealPath)}
      style={{
        position: "fixed", bottom: "24px", right: "24px", zIndex: 200,
        backgroundColor: c.primary, color: "#fff", border: "none",
        borderRadius: "24px", height: "48px", padding: "0 20px 0 14px",
        display: "flex", alignItems: "center", gap: "10px",
        cursor: "pointer", boxShadow: "0 4px 16px rgba(0,0,0,0.18)",
        fontFamily: "Inter, sans-serif", transition: "transform 0.15s, box-shadow 0.15s",
      }}
      className="hover:scale-105 transition-all"
    >
      <MessageSquare className="h-5 w-5" />
      <div style={{ textAlign: "left" }}>
        <p style={{ fontSize: "13px", fontWeight: 600, lineHeight: 1 }}>Messages</p>
        <p style={{ fontSize: "10px", opacity: 0.55, marginTop: "2px", lineHeight: 1 }}>
          {info.otherPartyName}
        </p>
      </div>
      <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: statusDot, marginLeft: "4px", flexShrink: 0 }} />
    </button>
  );
}
