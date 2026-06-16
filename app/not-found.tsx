import Link from "next/link";
import { c } from "@/lib/tokens";
import { Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      style={{
        backgroundColor: c.bg,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        padding: "40px 24px",
      }}
    >
      <div style={{ textAlign: "center", maxWidth: "480px" }}>

        {/* Logo mark */}
        <div
          style={{
            backgroundColor: c.primary,
            width: "56px",
            height: "56px",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 900, fontSize: "24px", letterSpacing: "-1px" }}>F</span>
        </div>

        {/* 404 number */}
        <p
          style={{
            fontSize: "96px",
            fontWeight: 900,
            color: c.primary,
            lineHeight: 1,
            letterSpacing: "-4px",
            marginBottom: "8px",
            opacity: 0.08,
            userSelect: "none",
          }}
        >
          404
        </p>

        {/* Heading */}
        <h1
          style={{
            color: c.primary,
            fontSize: "22px",
            fontWeight: 800,
            letterSpacing: "-0.4px",
            marginBottom: "10px",
            marginTop: "-52px",
          }}
        >
          Page not found
        </h1>

        <p style={{ color: c.muted, fontSize: "14px", lineHeight: 1.7, marginBottom: "32px" }}>
          This page doesn&apos;t exist or may have been moved.
          If you were looking for a vehicle listing or deal, it may no longer be available.
        </p>

        {/* Actions */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <Link
            href="/browse"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              backgroundColor: c.primary,
              color: "#fff",
              fontSize: "14px",
              fontWeight: 700,
              padding: "10px 22px",
              borderRadius: "8px",
              textDecoration: "none",
            }}
          >
            <Search style={{ width: "15px", height: "15px" }} />
            Browse vehicles
          </Link>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "7px",
              backgroundColor: c.surface,
              color: c.primary,
              fontSize: "14px",
              fontWeight: 600,
              padding: "10px 22px",
              borderRadius: "8px",
              textDecoration: "none",
              border: `1px solid ${c.border}`,
            }}
          >
            <ArrowLeft style={{ width: "15px", height: "15px" }} />
            Home
          </Link>
        </div>

        {/* Trust strip */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
            marginTop: "48px",
          }}
        >
          <div
            style={{
              width: "6px",
              height: "6px",
              borderRadius: "50%",
              backgroundColor: c.green,
            }}
          />
          <p style={{ color: c.muted, fontSize: "12px" }}>
            Fuselage · Verified Global Vehicle Trade
          </p>
        </div>
      </div>
    </div>
  );
}
