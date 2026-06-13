import Link from "next/link";
import { Heart } from "lucide-react";

import { c } from "@/lib/tokens";

export default function WishlistPage() {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 20px" }}>
      <div style={{ textAlign: "center", maxWidth: "400px" }}>
        <div style={{ width: "56px", height: "56px", borderRadius: "50%", backgroundColor: c.greenBg, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
          <Heart style={{ color: c.green, width: "24px", height: "24px" }} />
        </div>
        <h1 style={{ color: c.primary, fontSize: "22px", fontWeight: 800, letterSpacing: "-0.4px", marginBottom: "10px" }}>
          Wishlist
        </h1>
        <p style={{ color: c.muted, fontSize: "14px", lineHeight: "1.6", marginBottom: "28px" }}>
          Save listings you&apos;re interested in and compare them here. This feature is coming soon.
        </p>
        <Link
          href="/browse"
          style={{ backgroundColor: c.primary, color: "#fff", textDecoration: "none", borderRadius: "8px", padding: "10px 24px", fontSize: "14px", fontWeight: 600 }}
        >
          Browse vehicles
        </Link>
      </div>
    </div>
  );
}
