"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { MessageSquare } from "lucide-react";

interface ChatInfo {
  dealId: string;
  otherPartyName: string;
  dealStatus: string;
  isClosed: boolean;
  role: "buyer" | "seller";
}

const c = {
  primary: "#0F172A",
  green:   "#10B981",
  amber:   "#D97706",
};

export function GlobalChatBubble() {
  const pathname = usePathname();
  const router   = useRouter();
  const [info, setInfo] = useState<ChatInfo | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("last-active-chat");
      if (stored) setInfo(JSON.parse(stored));
    } catch { /* ignore */ }
  }, [pathname]);

  // Don't show if already on the deal page
  if (!info || pathname.includes(info.dealId)) return null;

  const statusDot = info.isClosed ? "#94A3B8" : info.dealStatus === "inquired" ? c.amber : c.green;
  const dealPath  = `/${info.role === "buyer" ? "buyer" : "seller"}/deals/${info.dealId}`;

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
