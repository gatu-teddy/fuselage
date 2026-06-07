import Link from "next/link";
import {
  Shield,
  FileCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  ChevronRight,
  Star,
  Globe,
} from "lucide-react";

// ─── Stitch design tokens ───────────────────────────────────────────────────
const c = {
  primary:     "#0F172A",   // Trust Blue
  green:       "#10B981",   // Safety Green
  greenBg:     "#D1FAE5",   // Verification chip background
  greenText:   "#065F46",   // Verification chip text
  body:        "#334155",   // Slate gray body
  bg:          "#F8FAFC",   // Page background
  bgDim:       "#F1F5F9",   // Slightly dimmer surface
  surface:     "#FFFFFF",   // Card / elevated surface
  border:      "#E2E8F0",   // Default border
  muted:       "#64748B",   // Muted / placeholder text
};

// ─── Data ────────────────────────────────────────────────────────────────────
const services = [
  {
    icon: Shield,
    title: "Vetting & Inspection",
    description:
      "Every vehicle undergoes a 250-point physical inspection by certified independent inspectors before listing. No exceptions.",
    features: [
      "Certified independent inspectors",
      "250-point condition checklist",
      "Full inspection report issued",
    ],
  },
  {
    icon: FileCheck,
    title: "Documentation & Compliance",
    description:
      "Our compliance team audits all export documentation and title transfers before transit begins. Every paper in order.",
    features: [
      "Title & ownership verification",
      "Export paperwork audit",
      "Legal compliance sign-off",
    ],
  },
  {
    icon: Truck,
    title: "Logistics & Tracking",
    description:
      "Real-time GPS monitoring and door-to-door delivery management, including customs clearance through our shipping partners.",
    features: [
      "Real-time GPS tracking",
      "Customs clearance handling",
      "Door-to-door delivery",
    ],
  },
];

const transitSteps = [
  { label: "Inspection Certified",    done: true,  active: false },
  { label: "Documentation Cleared",   done: true,  active: false },
  { label: "Customs Processed",       done: true,  active: false },
  { label: "Ocean Freight – Atlantic", done: false, active: true  },
  { label: "Destination Port",        done: false, active: false },
];

const buyerSteps = [
  { n: "01", title: "Browse verified inventory",  body: "Filter by make, model, price, and destination port. Every listing is from a UAE-licensed exporter." },
  { n: "02", title: "Send an inquiry",             body: "Contact the exporter directly through the platform. No WhatsApp strangers, no middlemen." },
  { n: "03", title: "Agree on terms",              body: "Negotiate price and shipping terms on-platform. Every message is logged." },
  { n: "04", title: "Track to delivery",           body: "Wire payment, upload the receipt, and track your vehicle all the way to your port." },
];

const sellerSteps = [
  { n: "01", title: "Apply to list",              body: "Submit your UAE trade license. We verify every exporter manually before approval." },
  { n: "02", title: "List your inventory",         body: "Add vehicles with photos, specs, VIN, FOB pricing, and available shipping routes." },
  { n: "03", title: "Receive qualified leads",     body: "Serious buyers only. Respond and negotiate in one centralised place." },
  { n: "04", title: "Close the deal",              body: "Confirm payment and update shipment tracking to build your verified history." },
];

const ports = [
  "Lagos (Apapa)", "Lagos (Tin Can)", "Mombasa", "Tema (Accra)",
  "Durban", "Cape Town", "Dar es Salaam", "Alexandria",
  "Casablanca", "Dakar", "Abidjan", "Douala", "Port Harcourt",
];

const partners = ["Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "Evergreen"];

const stats = [
  { value: "UAE Only",  label: "Verified exporters" },
  { value: "15+",       label: "African ports served" },
  { value: "100%",      label: "VIN tracked deals" },
  { value: "0",         label: "Unverified sellers" },
];

// ─── Component ───────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif" }} className="min-h-screen">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        style={{ backgroundColor: "rgba(255,255,255,0.97)", borderBottom: `1px solid ${c.border}` }}
        className="sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div style={{ backgroundColor: c.primary }} className="w-7 h-7 rounded flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span style={{ color: c.primary }} className="font-bold text-lg tracking-tight">Fuselage</span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Browse",           href: "/browse" },
              { label: "Vetting Process",  href: "#services" },
              { label: "How It Works",     href: "#process" },
              { label: "Destinations",     href: "#destinations" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ color: c.body }}
                className="text-sm font-medium hover:opacity-70 transition-opacity"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              style={{ color: c.body }}
              className="text-sm font-medium px-4 py-2 hover:opacity-70 transition-opacity"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              style={{ backgroundColor: c.primary, color: "#fff" }}
              className="text-sm font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity"
            >
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.primary }} className="relative overflow-hidden">
        {/* subtle grid texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <div className="relative max-w-[1280px] mx-auto px-8 md:px-16 py-20 md:py-28 flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

          {/* Left — copy */}
          <div className="flex-1 min-w-0">
            <div
              style={{ backgroundColor: c.greenBg, color: c.greenText }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              250-Point Inspection Standard
            </div>

            <h1
              className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
              style={{ letterSpacing: "-0.02em" }}
            >
              The Secure Cross-Border<br />
              <span style={{ color: c.green }}>Vehicle Marketplace</span>
            </h1>

            <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-lg leading-relaxed mb-8 max-w-lg">
              Connect with verified UAE exporters. Every vehicle is inspected, documented,
              and tracked in real time — from Dubai to your port across Africa.
            </p>

            <div className="flex flex-wrap gap-3 mb-12">
              <Link
                href="/browse"
                style={{ backgroundColor: c.green, color: "#fff" }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-8 h-12 rounded hover:opacity-90 transition-opacity"
              >
                Browse Vehicles <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/register?role=seller"
                style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                className="inline-flex items-center gap-2 text-sm font-semibold px-8 h-12 rounded border hover:border-white/40 transition-colors"
              >
                List as Exporter
              </Link>
            </div>

            {/* Stats row */}
            <div className="flex flex-wrap items-center gap-8">
              {stats.map(({ value, label }) => (
                <div key={label}>
                  <div style={{ color: c.green }} className="text-2xl font-bold">{value}</div>
                  <div style={{ color: "rgba(255,255,255,0.45)" }} className="text-xs mt-0.5">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — in-transit vehicle card */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div style={{ backgroundColor: c.surface, borderRadius: "0.5rem" }} className="p-6 shadow-2xl">
              {/* Placeholder image */}
              <div
                style={{ backgroundColor: c.bgDim, borderRadius: "0.375rem" }}
                className="aspect-video flex items-center justify-center mb-5"
              >
                <span style={{ color: c.muted }} className="text-sm font-medium">Vehicle Image</span>
              </div>

              {/* Title row */}
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <h3 style={{ color: c.primary }} className="font-semibold text-base leading-snug">
                    2023 Mercedes-Benz G63 AMG
                  </h3>
                  <p style={{ color: c.muted }} className="text-xs mt-0.5">VIN: WDC4636251X123456</p>
                </div>
                <span
                  style={{ backgroundColor: c.greenBg, color: c.greenText, whiteSpace: "nowrap" }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  In Transit
                </span>
              </div>

              {/* Shipment stepper */}
              <div style={{ borderTop: `1px solid ${c.border}` }} className="pt-4 space-y-3">
                <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-3">
                  Shipment Status
                </p>
                {transitSteps.map(({ label, done, active }) => (
                  <div key={label} className="flex items-center gap-3">
                    <div
                      style={{
                        width: "8px",
                        height: "8px",
                        borderRadius: "50%",
                        flexShrink: 0,
                        backgroundColor: done ? c.green : active ? c.primary : c.border,
                      }}
                    />
                    <span
                      style={{ color: done || active ? c.body : c.muted }}
                      className="text-xs flex-1"
                    >
                      {label}
                    </span>
                    {done   && <CheckCircle2 style={{ color: c.green }}   className="h-3.5 w-3.5 shrink-0" />}
                    {active && <Clock        style={{ color: c.primary }} className="h-3.5 w-3.5 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SERVICES ────────────────────────────────────────────────────────── */}
      <section
        id="services"
        style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}` }}
        className="py-20"
      >
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="text-center mb-14">
            <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
              What We Offer
            </p>
            <h2
              style={{ color: c.primary, letterSpacing: "-0.01em" }}
              className="text-4xl font-bold mb-3"
            >
              End-to-End Vehicle Protection
            </h2>
            <p style={{ color: c.muted }} className="text-lg max-w-xl mx-auto leading-relaxed">
              Every transaction is backed by rigorous standards — from the inspection bay to your driveway.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {services.map(({ icon: Icon, title, description, features }) => (
              <div
                key={title}
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  borderRadius: "0.5rem",
                }}
                className="p-7 hover:shadow-md transition-shadow"
              >
                <div
                  style={{
                    backgroundColor: c.bgDim,
                    width: "44px",
                    height: "44px",
                    borderRadius: "0.5rem",
                  }}
                  className="flex items-center justify-center mb-5"
                >
                  <Icon style={{ color: c.primary }} className="h-5 w-5" />
                </div>
                <h3 style={{ color: c.primary }} className="font-semibold text-lg mb-3">{title}</h3>
                <p style={{ color: c.body }} className="text-sm leading-relaxed mb-5">{description}</p>
                <ul className="space-y-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <CheckCircle2 style={{ color: c.green }} className="h-4 w-4 shrink-0" />
                      <span style={{ color: c.muted }} className="text-xs">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED VEHICLE ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.bg, borderBottom: `1px solid ${c.border}` }} className="py-20">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="mb-10">
            <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
              Live Example
            </p>
            <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-3xl font-bold">
              Currently In Transit
            </h2>
            <p style={{ color: c.muted }} className="text-base mt-2">
              A real example of how a deal moves through our platform.
            </p>
          </div>

          <div
            style={{
              backgroundColor: c.surface,
              border: `1px solid ${c.border}`,
              borderRadius: "0.5rem",
              borderLeft: `4px solid ${c.green}`,
            }}
            className="p-8 grid md:grid-cols-2 gap-8"
          >
            {/* Vehicle info */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span
                  style={{ backgroundColor: c.greenBg, color: c.greenText }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  ✓ Inspection Certified
                </span>
                <span
                  style={{ backgroundColor: c.greenBg, color: c.greenText }}
                  className="text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  ✓ Docs Cleared
                </span>
              </div>
              <h3 style={{ color: c.primary }} className="text-2xl font-bold mb-1">
                2023 Mercedes-Benz G63 AMG
              </h3>
              <p style={{ color: c.muted }} className="text-sm mb-6">
                VIN: WDC4636251X123456 &nbsp;·&nbsp; UAE Origin &nbsp;·&nbsp; RHD
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Mileage",      value: "12,400 km" },
                  { label: "Colour",       value: "Obsidian Black" },
                  { label: "Origin Port",  value: "Jebel Ali, UAE" },
                  { label: "Destination", value: "Lagos (Apapa)" },
                  { label: "Departure",   value: "02 Jun 2026" },
                  { label: "ETA",         value: "28 Jun 2026" },
                ].map(({ label, value }) => (
                  <div
                    key={label}
                    style={{ backgroundColor: c.bgDim, borderRadius: "0.375rem" }}
                    className="px-4 py-3"
                  >
                    <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-wider mb-0.5">
                      {label}
                    </p>
                    <p style={{ color: c.primary }} className="text-sm font-medium">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Stepper */}
            <div>
              <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-5">
                Shipment Progress
              </p>
              <div className="space-y-4">
                {transitSteps.map(({ label, done, active }, i) => (
                  <div key={label} className="flex items-start gap-4">
                    {/* dot + line */}
                    <div className="flex flex-col items-center">
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          flexShrink: 0,
                          backgroundColor: done ? c.green : active ? c.primary : c.border,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {done && <CheckCircle2 className="h-3 w-3 text-white" />}
                        {active && <Clock className="h-3 w-3 text-white" />}
                      </div>
                      {i < transitSteps.length - 1 && (
                        <div style={{ width: "2px", height: "24px", backgroundColor: done ? c.green : c.border }} />
                      )}
                    </div>
                    <div className="pt-0.5">
                      <p
                        style={{ color: done || active ? c.primary : c.muted }}
                        className="text-sm font-medium"
                      >
                        {label}
                      </p>
                      {active && (
                        <p style={{ color: c.green }} className="text-xs mt-0.5">In progress · Est. 26 days remaining</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
      <section
        id="process"
        style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}` }}
        className="py-20"
      >
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="mb-14">
            <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
              Process
            </p>
            <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-4xl font-bold mb-2">
              How It Works
            </h2>
            <p style={{ color: c.muted }} className="text-lg">Simple, transparent, and fully tracked.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Buyers */}
            <div>
              <div
                style={{ backgroundColor: c.greenBg, color: c.greenText, borderRadius: "9999px" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold mb-8"
              >
                For Buyers
              </div>
              <div className="space-y-8">
                {buyerSteps.map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5">
                    <div style={{ color: c.primary }} className="font-black text-2xl w-10 shrink-0">{n}</div>
                    <div>
                      <p style={{ color: c.primary }} className="font-semibold mb-1">{title}</p>
                      <p style={{ color: c.body }} className="text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exporters */}
            <div>
              <div
                style={{ border: `1px solid ${c.border}`, color: c.muted, borderRadius: "9999px" }}
                className="inline-flex items-center gap-2 px-4 py-1.5 text-xs font-semibold mb-8"
              >
                For Exporters
              </div>
              <div className="space-y-8">
                {sellerSteps.map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5">
                    <div style={{ color: c.muted }} className="font-black text-2xl w-10 shrink-0">{n}</div>
                    <div>
                      <p style={{ color: c.primary }} className="font-semibold mb-1">{title}</p>
                      <p style={{ color: c.body }} className="text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SHIPPING PARTNERS ───────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.bg, borderBottom: `1px solid ${c.border}` }} className="py-14">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest text-center mb-8">
            Shipping Partners
          </p>
          <div className="flex flex-wrap justify-center items-center gap-10">
            {partners.map((name) => (
              <div key={name} style={{ color: c.muted }} className="text-lg font-bold tracking-tight opacity-60">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DESTINATIONS ────────────────────────────────────────────────────── */}
      <section
        id="destinations"
        style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}` }}
        className="py-20"
      >
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="mb-10">
            <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
              Destinations
            </p>
            <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-3xl font-bold mb-2">
              Shipping Across Africa
            </h2>
            <p style={{ color: c.muted }} className="text-base">
              Our exporters ship to major ports continent-wide.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ports.map((port) => (
              <div
                key={port}
                style={{
                  border: `1px solid ${c.border}`,
                  borderRadius: "9999px",
                  color: c.body,
                }}
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm hover:border-[#10B981] hover:text-[#0F172A] transition-colors cursor-default"
              >
                <MapPin style={{ color: c.green }} className="h-3 w-3" />
                {port}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.bgDim, borderBottom: `1px solid ${c.border}` }} className="py-14">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Shield,    title: "Verified Exporters Only",    body: "Every seller submits a UAE trade licence and is manually reviewed before listing." },
              { icon: FileCheck, title: "VIN on Every Listing",       body: "Chassis numbers visible before you inquire. No mystery vehicles, ever." },
              { icon: Globe,     title: "Global Reach",               body: "Operating across 15+ African ports with established logistics hubs in key markets." },
              { icon: Truck,     title: "Fully Tracked Deals",        body: "From first inquiry to port arrival — every step is logged and visible to both parties." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div
                  style={{ backgroundColor: c.surface, width: "40px", height: "40px", borderRadius: "0.5rem", border: `1px solid ${c.border}` }}
                  className="flex items-center justify-center mb-4"
                >
                  <Icon style={{ color: c.primary }} className="h-4.5 w-4.5" />
                </div>
                <p style={{ color: c.primary }} className="font-semibold text-sm mb-1">{title}</p>
                <p style={{ color: c.muted }} className="text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.primary }} className="py-24 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-3xl mx-auto px-8 text-center">
          <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-5">
            Ready to start?
          </p>
          <h2
            className="text-4xl md:text-5xl font-bold text-white mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Import the right way.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Join the platform built for serious buyers and UAE-verified exporters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              style={{ backgroundColor: c.green, color: "#fff" }}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-10 h-12 rounded hover:opacity-90 transition-opacity"
            >
              Browse Vehicles <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register?role=seller"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-10 h-12 rounded border hover:border-white/40 transition-colors"
            >
              Apply as Exporter
            </Link>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
      <footer style={{ backgroundColor: c.surface, borderTop: `1px solid ${c.border}` }} className="py-10">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div style={{ backgroundColor: c.primary }} className="w-6 h-6 rounded flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span style={{ color: c.primary }} className="font-bold text-sm">Fuselage</span>
            <span style={{ color: c.muted }} className="text-sm">© 2026</span>
          </div>
          <div className="flex items-center gap-6">
            {[
              { label: "Privacy",  href: "/privacy" },
              { label: "Terms",    href: "/terms" },
              { label: "Contact",  href: "/contact" },
              { label: "Browse",   href: "/browse" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{ color: c.muted }}
                className="text-sm hover:text-[#0F172A] transition-colors"
              >
                {label}
              </Link>
            ))}
          </div>
          <div style={{ color: c.muted }} className="text-xs text-center md:text-right">
            logistics@fuselage.io
          </div>
        </div>
      </footer>

    </div>
  );
}
