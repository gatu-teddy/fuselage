import Link from "next/link";
import { CheckCircle2, Truck, Globe, MapPin, Mail, ShieldCheck } from "lucide-react";
import { c } from "@/lib/tokens";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Certified Freight Partners | TrueWagon",
  description:
    "TrueWagon-certified freight agents who handle motorbike shipments from Japan to Africa. Verified, experienced, and integrated with our deal platform.",
  openGraph: {
    title: "Certified Freight Partners | TrueWagon",
    description:
      "Certified freight agents for Japan-origin motorbike imports to Africa — vetted by TrueWagon.",
  },
};

const partners = [
  {
    name: "TransOcean Freight Ltd",
    region: "East Africa",
    ports: ["Mombasa", "Dar es Salaam", "Djibouti"],
    speciality: "Japan → East Africa RoRo & container",
    verified: true,
    contact: "freight@transocean.example",
    website: null,
  },
  {
    name: "Lagos Clearance Services",
    region: "West Africa",
    ports: ["Apapa (Lagos)", "Tema (Accra)"],
    speciality: "Japan/China → West Africa consolidation",
    verified: true,
    contact: "info@lagosclearance.example",
    website: null,
  },
  {
    name: "AfriShip Logistics",
    region: "Southern Africa",
    ports: ["Durban", "Beira", "Walvis Bay"],
    speciality: "Japan → Southern Africa, full customs brokerage",
    verified: false,
    contact: "ops@afriship.example",
    website: null,
  },
];

const requirements = [
  "Active freight forwarding or customs brokerage licence",
  "Minimum 2 years handling RoRo or container motorbike shipments",
  "Coverage of at least one major African port",
  "Willingness to integrate with TrueWagon deal tracking",
  "Response SLA of 24 hours for buyer enquiries",
];

export default function PartnersPage() {
  return (
    <div style={{ backgroundColor: c.bg, minHeight: "100vh" }}>

      {/* ── Hero ─────────────────────────────────────────────────────────────── */}
      <div style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}` }}>
        <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-16">
          <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
            Logistics Network
          </p>
          <h1
            style={{ color: c.primary, letterSpacing: "-0.02em" }}
            className="text-4xl md:text-5xl font-bold mb-4"
          >
            Certified Freight Partners
          </h1>
          <p style={{ color: c.body }} className="text-lg leading-relaxed max-w-2xl mb-8">
            Moving a motorbike from Japan to an African port requires a freight agent who knows
            the route. TrueWagon certifies logistics partners who specialise in Japan-origin
            RoRo and container shipments to Africa.
          </p>
          <div className="flex flex-wrap gap-6">
            {[
              { icon: ShieldCheck, text: "Licence verified by our team" },
              { icon: Truck,       text: "Japan → Africa specialists" },
              { icon: Globe,       text: "Multi-port coverage" },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon style={{ color: c.green }} className="h-4 w-4 shrink-0" />
                <span style={{ color: c.body }} className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-[1080px] mx-auto px-6 md:px-12 py-12">

        {/* ── Partner Directory ────────────────────────────────────────────────── */}
        <h2 style={{ color: c.primary }} className="text-xl font-bold mb-6">
          Partner Directory
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {partners.map((p) => (
            <div
              key={p.name}
              style={{
                backgroundColor: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: "12px",
                padding: "22px",
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div
                  style={{ backgroundColor: c.primary, borderRadius: "10px", width: "42px", height: "42px", flexShrink: 0 }}
                  className="flex items-center justify-center"
                >
                  <span style={{ color: "#fff", fontWeight: 900, fontSize: "18px" }}>
                    {p.name[0]}
                  </span>
                </div>
                {p.verified ? (
                  <span
                    style={{ backgroundColor: "#D1FAE5", color: "#065F46", fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "99px" }}
                    className="inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="h-3 w-3" /> Certified
                  </span>
                ) : (
                  <span
                    style={{ backgroundColor: "#FEF3C7", color: "#92400E", fontSize: "11px", fontWeight: 700, padding: "3px 9px", borderRadius: "99px" }}
                  >
                    Under Review
                  </span>
                )}
              </div>

              <h3 style={{ color: c.primary, fontSize: "15px", fontWeight: 700, marginBottom: "4px" }}>
                {p.name}
              </h3>
              <p style={{ color: c.muted, fontSize: "12px", marginBottom: "10px" }}>{p.speciality}</p>

              {/* Ports */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {p.ports.map((port) => (
                  <span
                    key={port}
                    style={{ backgroundColor: c.bgDim, color: c.body, fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "6px" }}
                    className="inline-flex items-center gap-1"
                  >
                    <MapPin className="h-2.5 w-2.5" style={{ color: c.muted }} />
                    {port}
                  </span>
                ))}
              </div>

              {/* Region */}
              <p style={{ color: c.muted, fontSize: "12px", marginBottom: "12px" }}>
                {p.region}
              </p>

              {/* Contact */}
              <a
                href={`mailto:${p.contact}`}
                style={{ color: c.green, fontSize: "12px", display: "inline-flex", alignItems: "center", gap: "5px", textDecoration: "none" }}
              >
                <Mail className="h-3 w-3" />
                {p.contact}
              </a>
            </div>
          ))}
        </div>

        {/* ── Apply Section ────────────────────────────────────────────────────── */}
        <div
          style={{
            backgroundColor: c.surface,
            border: `1px solid ${c.border}`,
            borderRadius: "14px",
            padding: "36px",
          }}
        >
          <div className="grid md:grid-cols-2 gap-10 items-start">
            <div>
              <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
                Join the Network
              </p>
              <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-2xl font-bold mb-3">
                Are you a freight agent?
              </h2>
              <p style={{ color: c.body }} className="text-sm leading-relaxed mb-6">
                If you handle motorbike shipments from Japan or Asia to Africa, apply to join the
                TrueWagon certified partner network. Certified partners appear in our directory and
                are recommended to buyers directly from their deal dashboard.
              </p>
              <Link
                href="mailto:partners@truewagon.com?subject=Freight Partner Application"
                style={{ backgroundColor: c.primary, color: "#fff" }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-7 h-11 rounded hover:opacity-90 transition-opacity"
              >
                Apply by Email
              </Link>
            </div>

            <div>
              <p style={{ color: c.primary }} className="text-sm font-bold mb-4">
                Requirements
              </p>
              <ul className="space-y-3">
                {requirements.map((r) => (
                  <li key={r} className="flex items-start gap-2.5">
                    <CheckCircle2 style={{ color: c.green, flexShrink: 0, marginTop: "2px" }} className="h-4 w-4" />
                    <span style={{ color: c.body }} className="text-sm leading-relaxed">{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
