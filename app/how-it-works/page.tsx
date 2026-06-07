import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Globe,
  Truck,
  FileCheck,
  Search,
  Video,
  Package,
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
};

// ─── Stitch images ────────────────────────────────────────────────────────────
const img = {
  // Step 01 — BMW M5 in minimalist concrete showroom
  bmwM5:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBPSPgXddMyCczflpuV_PXhTfMIzpJNRUJ5-lhrceZ94TEczZ3-DIMsOH74dq8DXetMGHSHX0ZiJ3EMI7XJW8tQTYOxlFp6rfZFP5RUkj8IZThSMOY1maC4FoLcymlbT8W6Mf6sibbEhEPkU2jhjBe7Y7XZ3LPx9boudLx4ZL10jg25UdU6NPWCwwSF8AaowzFXrQ4bQSF45y4LCAEhpcP3nHp4xouXS_akGVI-ZxZocKBXDgRWh_MhauW001NWA7njdpwergrcTe4",
  // Step 02 — Elite vehicle selection & inspection
  eliteVehicleSelection:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDqHBwPHygOTZpaQqCpzgXkG3gAXV6OX758Jg7wCXcN9gHoS0JgexJmKlpAWq5MapbIWndR3u2-KpAbZ_jxQHaLGFZmv1f6G5z8LcAW9aFEK2a87vux28gDCeQp61DzN9dftwbGZzh21xHh42KOHF3Ao7MkF7cUk9jZMr_jxDq0H33sS0R5pPhyNhx4nSaRCqBagnWo_o7b0X_D0GtoHtb7M8P6g3-0Q6vw3WjL55udo6zyDNQ0ENfdX8Priqc1cLYNK41l58EOY7U",
  // Step 03 — Logistics map interface
  logisticsMap:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAlYxiq6lCJ5BNgvKq-v2mC_EERTK60IkZXlYvT5rw7mibD362LOEWswuFBmoY2hbG3ViMcfke11tHd3c0MJht5reuIExAWTrftsHVIL1vnvwtv67DU3EN6eJFK-z8T4W0G5LuxseCu1y4KndYmu8KBDoxSAvn_MMs69pO2TA_b1EI0ICKxjFL1hkgwFBiJfOF7kAj8N-xmaj39c72P9J2X_AP4gI35FzVi7w0kEKd8QJhTF9WpvV2x69V76ShM6Os-OMO2namzmpA",
  // Step 04 — Porsche 911 being loaded into shipping container
  shipping:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaHS6gz6dJxeezM-JE2FjaLCXTZc8RZreIKQCImymQpCf51rhwcOhLgfUrOL8bpo6TU0IFRA-UmJW14RMT7C937Xh7V5kelCiD5Qc8D3n_LhCPHZ0J2GIP2vYVheCW4a3_il8_DbQoSABp21z2KjegIBn9xG42ON_-kdwwyQgWpG3PxN2c3k3mZIiE9l9cdLtFqb6bev6qjKAcGtx3_G2JdPJuN1S_HdKJ5MDe_QpTS3qNPedRgUlKq6O0SMAfOjUI0O8vQTz47s",
};

// ─── Step data ────────────────────────────────────────────────────────────────
const steps = [
  {
    n: "01",
    phase: "Selection",
    headline: "Browse a Curated, Pre-Vetted Inventory",
    body: "Every vehicle listed on Fuselage has been screened for title authenticity and provenance before it ever reaches you. Filter by make, model, destination port, and budget. No mystery vehicles — VIN visible before you inquire.",
    highlights: [
      { icon: Search,    label: "Vetted Inventory Only" },
      { icon: Shield,    label: "Title Pre-Screened" },
      { icon: FileCheck, label: "VIN on Every Listing" },
    ],
    image: img.bmwM5,
    imageAlt: "Curated luxury vehicle — BMW M5 in minimalist showroom",
  },
  {
    n: "02",
    phase: "Verification",
    headline: "200-Point Physical Inspection by Certified Agents",
    body: "Our local agents carry out a mandatory 200-point physical inspection at the vehicle's location before export eligibility is granted. You receive a high-definition video report, direct mechanical diagnosis, and a certified condition certificate.",
    highlights: [
      { icon: Shield,       label: "200-Point Inspection" },
      { icon: Video,        label: "HD Video Report" },
      { icon: CheckCircle2, label: "Certified Condition Report" },
    ],
    image: img.eliteVehicleSelection,
    imageAlt: "Elite vehicle selection and inspection process",
  },
  {
    n: "03",
    phase: "Document & Title Transfer",
    headline: "Secure Legal Document Exchange",
    body: "Our platform manages the entire exchange of legal documents and title deeds. Every piece of paperwork — export licence, bill of lading, customs declaration, title deed — is verified and authenticated by our compliance team before ownership is formally transferred.",
    highlights: [
      { icon: FileCheck,    label: "Title & Ownership Verified" },
      { icon: Shield,       label: "Export Paperwork Audited" },
      { icon: CheckCircle2, label: "Legal Compliance Sign-off" },
    ],
    image: img.logisticsMap,
    imageAlt: "Logistics tracking and document management interface",
  },
  {
    n: "04",
    phase: "Delivery",
    headline: "Insured Global Logistics, Door-to-Door",
    body: "Insured global logistics managed by Tier-1 shipping partners including Maersk, MSC, and CMA CGM. We handle all customs documentation, export duties, port fees, and coordinate door-to-door delivery to 15+ African ports. Track your vehicle in real time throughout.",
    highlights: [
      { icon: Truck,   label: "Tier-1 Shipping Partners" },
      { icon: Globe,   label: "15+ African Ports" },
      { icon: Package, label: "Real-Time GPS Tracking" },
    ],
    image: img.shipping,
    imageAlt: "Luxury vehicle being loaded into shipping container",
  },
];

const stats = [
  { value: "2,400+", label: "Vehicles Delivered" },
  { value: "200",    label: "Point Inspection" },
  { value: "15+",    label: "African Ports" },
  { value: "24/7",   label: "Logistics Tracking" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <div style={{ backgroundColor: c.bg, fontFamily: "Inter, sans-serif" }} className="min-h-screen">

      {/* ── NAV ─────────────────────────────────────────────────────────────── */}
      <nav
        style={{ backgroundColor: "rgba(255,255,255,0.97)", borderBottom: `1px solid ${c.border}` }}
        className="sticky top-0 z-50 backdrop-blur-sm"
      >
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div style={{ backgroundColor: c.primary }} className="w-7 h-7 rounded flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span style={{ color: c.primary }} className="font-bold text-lg tracking-tight">Fuselage</span>
          </Link>

          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Browse",          href: "/browse" },
              { label: "Vetting Process", href: "/#services" },
              { label: "How It Works",    href: "/how-it-works" },
              { label: "Destinations",    href: "/#destinations" },
            ].map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                style={{
                  color: href === "/how-it-works" ? c.primary : c.body,
                  fontWeight: href === "/how-it-works" ? "600" : "500",
                }}
                className="text-sm hover:opacity-70 transition-opacity"
              >
                {label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" style={{ color: c.body }} className="text-sm font-medium px-4 py-2 hover:opacity-70 transition-opacity">
              Sign In
            </Link>
            <Link href="/register" style={{ backgroundColor: c.primary, color: "#fff" }} className="text-sm font-semibold px-5 py-2 rounded hover:opacity-90 transition-opacity">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.primary }} className="relative overflow-hidden py-20 md:py-28">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="relative max-w-[1280px] mx-auto px-8 md:px-16">
          <div
            style={{ backgroundColor: c.greenBg, color: c.greenText }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Cross-Border Trust
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5 max-w-2xl"
            style={{ letterSpacing: "-0.02em" }}
          >
            Your Global Car Purchase,{" "}
            <span style={{ color: c.green }}>Secured.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-lg leading-relaxed max-w-xl mb-10">
            We bridge the gap between continents with a rigorous 4-step process designed for absolute transparency and safety — from selection to door-to-door delivery.
          </p>

          {/* Step pills */}
          <div className="flex flex-wrap gap-3">
            {["01 Selection", "02 Verification", "03 Document & Title", "04 Delivery"].map((s) => (
              <div
                key={s}
                style={{ borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.75)" }}
                className="border rounded-full px-4 py-1.5 text-xs font-semibold"
              >
                {s}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STEPS ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.bg }} className="py-20">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16 space-y-6">
          {steps.map(({ n, phase, headline, body, highlights, image, imageAlt = phase }, idx) => (
            <div
              key={n}
              style={{
                backgroundColor: c.surface,
                border: `1px solid ${c.border}`,
                borderRadius: "0.5rem",
                borderLeft: `4px solid ${c.green}`,
              }}
              className="p-8 grid md:grid-cols-2 gap-10 items-center"
            >
              {/* Text — alternate left/right */}
              <div className={idx % 2 === 1 && image ? "md:order-2" : ""}>
                <div className="flex items-center gap-3 mb-4">
                  <span style={{ color: c.border }} className="text-5xl font-black leading-none select-none">{n}</span>
                  <span
                    style={{ backgroundColor: c.greenBg, color: c.greenText }}
                    className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  >
                    {phase}
                  </span>
                </div>
                <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-2xl font-bold mb-3">
                  {headline}
                </h2>
                <p style={{ color: c.body }} className="text-base leading-relaxed mb-6">{body}</p>
                <ul className="space-y-3">
                  {highlights.map(({ icon: Icon, label }) => (
                    <li key={label} className="flex items-center gap-3">
                      <div
                        style={{ backgroundColor: c.greenBg, width: "32px", height: "32px", borderRadius: "0.375rem" }}
                        className="flex items-center justify-center shrink-0"
                      >
                        <Icon style={{ color: c.green }} className="h-4 w-4" />
                      </div>
                      <span style={{ color: c.body }} className="text-sm font-medium">{label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Image */}
              <div className={idx % 2 === 1 ? "md:order-1" : ""}>
                <div className="relative w-full rounded-md overflow-hidden" style={{ aspectRatio: "4/3" }}>
                  <Image
                    src={image}
                    alt={imageAlt ?? phase}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 600px"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── QUALITY ASSURANCE CALLOUT ────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.primary }} className="py-16">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
                Phase 01–02
              </p>
              <h2 style={{ color: "#fff", letterSpacing: "-0.01em" }} className="text-2xl font-bold mb-3">
                Quality Assurance
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-sm leading-relaxed">
                Every vehicle undergoes rigorous multi-layer verification before export eligibility is granted. No vehicle ships without a certified inspection report.
              </p>
            </div>
            {[
              { icon: Shield, title: "Verified Exporters Only",  body: "All sellers submit a UAE trade licence and are manually reviewed before listing a single vehicle." },
              { icon: Globe,  title: "Global Reach",             body: "Operating across 15+ African ports with established logistics hubs in Dubai, Hamburg, and New Jersey." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ borderLeft: `2px solid rgba(255,255,255,0.1)` }} className="pl-8">
                <div
                  style={{ backgroundColor: "rgba(255,255,255,0.07)", width: "40px", height: "40px", borderRadius: "0.5rem" }}
                  className="flex items-center justify-center mb-4"
                >
                  <Icon style={{ color: c.green }} className="h-5 w-5" />
                </div>
                <p className="text-white font-semibold text-sm mb-2">{title}</p>
                <p style={{ color: "rgba(255,255,255,0.55)" }} className="text-xs leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.surface, borderBottom: `1px solid ${c.border}` }} className="py-14">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div style={{ color: c.primary }} className="text-4xl font-bold mb-1">{value}</div>
                <div style={{ color: c.muted }} className="text-sm">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.bg }} className="py-24">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-5">
            Ready to start?
          </p>
          <h2 style={{ color: c.primary, letterSpacing: "-0.02em" }} className="text-4xl md:text-5xl font-bold mb-5">
            Source your next vehicle<br />the right way.
          </h2>
          <p style={{ color: c.muted }} className="text-lg mb-10 max-w-lg mx-auto leading-relaxed">
            Join the network of serious buyers and UAE-verified exporters moving vehicles safely across borders.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/browse"
              style={{ backgroundColor: c.green, color: "#fff" }}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-10 h-12 rounded hover:opacity-90 transition-opacity"
            >
              Browse Inventory <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register?role=seller"
              style={{ border: `1px solid ${c.border}`, color: c.primary }}
              className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-10 h-12 rounded hover:border-[#10B981] transition-colors"
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
              { label: "Privacy",    href: "/privacy" },
              { label: "Terms",      href: "/terms" },
              { label: "Contact",    href: "/contact" },
              { label: "Browse",     href: "/browse" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ color: c.muted }} className="text-sm hover:text-[#0F172A] transition-colors">
                {label}
              </Link>
            ))}
          </div>
          <div style={{ color: c.muted }} className="text-xs">logistics@fuselage.io</div>
        </div>
      </footer>

    </div>
  );
}
