import Link from "next/link";
import { Headphones, Mail, MessageCircle } from "lucide-react";

import { c } from "@/lib/tokens";

export default function SupportPage() {
  return (
    <div style={{ padding: "60px 20px" }}>
      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
            <Headphones style={{ color: c.green, width: "24px", height: "24px" }} />
          </div>
          <h1 style={{ color: c.primary, fontSize: "26px", fontWeight: 800, letterSpacing: "-0.5px", marginBottom: "10px" }}>
            Customer Support
          </h1>
          <p style={{ color: c.muted, fontSize: "15px" }}>
            Our team typically responds within a few hours.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {[
            {
              icon: Mail,
              title: "Email us",
              body: "For general enquiries, document questions, and account issues.",
              href: "mailto:support@truewagon.com",
              label: "support@truewagon.com",
            },
            {
              icon: MessageCircle,
              title: "Logistics enquiries",
              body: "Shipping timelines, port queries, and tracking assistance.",
              href: "mailto:logistics@truewagon.com",
              label: "logistics@truewagon.com",
            },
          ].map(({ icon: Icon, title, body, href, label }) => (
            <div key={title} style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "12px", padding: "22px 24px", display: "flex", gap: "16px" }}>
              <div style={{ backgroundColor: c.greenBg, width: "40px", height: "40px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Icon style={{ color: c.green, width: "18px", height: "18px" }} />
              </div>
              <div>
                <p style={{ color: c.primary, fontWeight: 700, fontSize: "14px", marginBottom: "4px" }}>{title}</p>
                <p style={{ color: c.muted, fontSize: "13px", marginBottom: "10px" }}>{body}</p>
                <a href={href} style={{ color: c.green, fontSize: "13px", fontWeight: 600, textDecoration: "none" }}>{label}</a>
              </div>
            </div>
          ))}
        </div>

        <p style={{ textAlign: "center", color: c.muted, fontSize: "13px", marginTop: "32px" }}>
          <Link href="/browse" style={{ color: c.primary, textDecoration: "none", fontWeight: 600 }}>← Back to Browse</Link>
        </p>
      </div>
    </div>
  );
}
