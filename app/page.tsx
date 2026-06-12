import Link from "next/link";
import Image from "next/image";
import {
  Shield,
  FileCheck,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ArrowRight,
  Globe,
} from "lucide-react";
import { AuthNav } from "@/components/layouts/auth-nav";

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

// ─── Stitch image assets (full URLs) ─────────────────────────────────────────
const STITCH = {
  // Landing page hero — Porsche 911 being loaded into shipping container
  heroBg:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaHS6gz6dJxeezM-JE2FjaLCXTZc8RZreIKQCImymQpCf51rhwcOhLgfUrOL8bpo6TU0IFRA-UmJW14RMT7C937Xh7V5kelCiD5Qc8D3n_LhCPHZ0J2GIP2vYVheCW4a3_il8_DbQoSABp21z2KjegIBn9xG42ON_-kdwwyQgWpG3PxN2c3k3mZIiE9l9cdLtFqb6bev6qjKAcGtx3_G2JdPJuN1S_HdKJ5MDe_QpTS3qNPedRgUlKq6O0SMAfOjUI0O8vQTz47s",
  // Mercedes-AMG G63 — white, Dubai desert
  g63:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDwIeFdGZKiF_5ElpeZR65A-cloxXDBLwrgjR737hUL_qwSr2VkHo4lDQjo9hUTOT4jLAuK8khxFII0Y6ArWvo5f_1J8ACmGPbjlIz07OH4m6m9c3LN_fKBIWUX5IQHZZUS00iAnF2UpIafNr3TXGF_p2Y-jRXqM_VFC2yQ4enj6ZRwBAy0erlN7_e-H_J0PjNcL3VUq1p_4GBTkVIrlioT9cWqmyxnZ31LDXOqduw7aOzGGzjwkjye_GXzLuREdDVluwRaEUadM5Y",
  // Silver Porsche 911 Carrera on coastal road at dusk
  porsche911:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAuHkVfg0VUaZSNsKiLEIeD8yMNnSVXcjBYGPiPukKpxmqQbVFWB3tN9Qw0FRmp-5djgbBqTie2C91uZ9a01MtI5aeMbn3nhGlZ1SM2Dg33HGEcKR1V2kcVRWnH1lJIzIAjcBbNj_IeYZSf2U_T60hzHfdEERIEKwk0TCdQU8OaBjB842ts4fHX0pGtwFqHUrGHtysQq1SmnUNn_zeRu2-63nx4UsO99BISyyzrOTItMYMALTN0PF90gMUnnX-Cz2Mjmdo7cruBAiY",
  // Black BMW M5 — minimalist concrete showroom
  bmwM5:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBPSPgXddMyCczflpuV_PXhTfMIzpJNRUJ5-lhrceZ94TEczZ3-DIMsOH74dq8DXetMGHSHX0ZiJ3EMI7XJW8tQTYOxlFp6rfZFP5RUkj8IZThSMOY1maC4FoLcymlbT8W6Mf6sibbEhEPkU2jhjBe7Y7XZ3LPx9boudLx4ZL10jg25UdU6NPWCwwSF8AaowzFXrQ4bQSF45y4LCAEhpcP3nHp4xouXS_akGVI-ZxZocKBXDgRWh_MhauW001NWA7njdpwergrcTe4",
  // Ferrari F8 Tributo — red, cobblestone street
  ferrari:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAmUhwT_Qkg--4MYWFkrfdFh_QbGTMUMWjTwZ9WVhjZtnkLgIOi85cSu9W-vkwky_dcyfIEwjqLCm45Er6qyeX3QBMGhTu5YilYoU7CKeYet43h7ZOoRlIynVUSEsN7-EBQpW16Tfioz2pxSYyR6w_Fer9AN5VnkkjcuiVCQHtt9ACExiap-eWMPLQG12Y0zKIPsQLzovFtliN4xzkkFRbSmFNlsN94DICFJy35EzJAvgU35uaiSqJ8avYiaJAOxnW3f04N9y5MI98",
  // Dark blue Porsche Taycan Turbo S — Tokyo charging station
  taycan:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAR32qU3CxpLdqDlBJllf-_HfAH7Ep47oAB884bg0pJKitMNAehj1VE6fbLSL1nsrQ4SQrpoMAj-4N9xP_xxpVr1aL1_lnekVH-atRs9WltfpVIMbxhwsQq_NXbEhGEQ6f94AiGsBjRUz55CaApaSOOaIFWlfTlsG1HIHhE9JZK01AUlPMEUxVACmrPpiFkYrRd8FbY8vrvZGS81jDyomtWLi3aTPUwXxMqfcbuJDT4Zu6a99ydzz7BDDn6FCl9jdSVXRCCpI9jbwA",
  // Gray BMW M4 — suspension bridge, Hong Kong
  bmwM4:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAhuA6ULhT-NFhGxYBCcqHtfhY_qNsR-atHHz6efPB5Zg-bTNsRwAeQMBBeLYjnuUYUl4jh0ksxpj2NUGt0pkvwTGzvvlDY0i_mplSKvv5NqgQ6RJ9OUkjNxAz78YjmsijgOq1b51e-pWKAm-p14JeNH8PAmB6o9EYgm2K_FTOl-VhEuPQZ9MSspFa5L0NHydbkE5HLiiN5hXAwQSJ0pTMlfjWAfi6u_Z5qN3vFwneXVlPtHGgcmUycK6oTyi9JibBhkQ6KQTMCRBs",
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
  { n: "01", title: "Browse verified inventory",  body: "Filter by make, model, price, and destination port. Every listing is from a verified, licensed exporter." },
  { n: "02", title: "Send an inquiry",             body: "Contact the exporter directly through the platform. No WhatsApp strangers, no middlemen." },
  { n: "03", title: "Agree on terms",              body: "Negotiate price and shipping terms on-platform. Every message is logged." },
  { n: "04", title: "Track to delivery",           body: "Wire payment, upload the receipt, and track your vehicle all the way to your port." },
];

const sellerSteps = [
  { n: "01", title: "Apply to list",              body: "Submit your trade or business license. We verify every exporter manually before approval." },
  { n: "02", title: "List your inventory",         body: "Add vehicles with photos, specs, VIN, FOB pricing, and available shipping routes." },
  { n: "03", title: "Receive qualified leads",     body: "Serious buyers only. Respond and negotiate in one centralised place." },
  { n: "04", title: "Close the deal",              body: "Confirm payment and update shipment tracking to build your verified history." },
];

const destinations = [
  {
    country: "Nigeria",
    flag: "🇳🇬",
    demand: "Highest",
    demandColor: "#DC2626",
    demandBg: "#FEF2F2",
    port: "Apapa & Tin Can Island",
    note: "Insatiable demand for Toyota, Lexus, Mercedes",
  },
  {
    country: "Ghana",
    flag: "🇬🇭",
    demand: "Very High",
    demandColor: "#DC2626",
    demandBg: "#FEF2F2",
    port: "Tema (Accra)",
    note: "Strong middle class growth",
  },
  {
    country: "Kenya",
    flag: "🇰🇪",
    demand: "Very High",
    demandColor: "#DC2626",
    demandBg: "#FEF2F2",
    port: "Mombasa",
    note: "East Africa gateway — re-exports to Uganda, Rwanda, Ethiopia",
  },
  {
    country: "Tanzania",
    flag: "🇹🇿",
    demand: "High",
    demandColor: "#EA580C",
    demandBg: "#FFF7ED",
    port: "Dar es Salaam",
    note: "Fast growing market",
  },
  {
    country: "Libya",
    flag: "🇱🇾",
    demand: "High",
    demandColor: "#EA580C",
    demandBg: "#FFF7ED",
    port: "Tripoli & Misrata",
    note: "LHD market, post-conflict reconstruction demand",
  },
  {
    country: "Ethiopia",
    flag: "🇪🇹",
    demand: "High",
    demandColor: "#EA580C",
    demandBg: "#FFF7ED",
    port: "Djibouti (landlocked)",
    note: "Large population, rapidly growing middle class",
  },
  {
    country: "Pakistan",
    flag: "🇵🇰",
    demand: "High",
    demandColor: "#EA580C",
    demandBg: "#FFF7ED",
    port: "Karachi",
    note: "Growing market for Japanese & Korean used vehicles",
  },
];

const partners = ["Maersk", "MSC", "CMA CGM", "Hapag-Lloyd", "Evergreen"];

const stats = [
  { value: "7",         label: "Markets served" },
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
        <div className="max-w-[1280px] mx-auto px-4 md:px-16 h-16 flex items-center justify-between relative">
          <div className="flex items-center gap-2.5">
            <div style={{ backgroundColor: c.primary }} className="w-7 h-7 rounded flex items-center justify-center">
              <span className="text-white font-black text-xs">F</span>
            </div>
            <span style={{ color: c.primary }} className="font-bold text-lg tracking-tight">Fuselage</span>
          </div>

          {/* Desktop nav links — always visible on md+ */}
          <div className="hidden md:flex items-center gap-7">
            {[
              { label: "Browse",          href: "/browse"       },
              { label: "Vetting Process", href: "#services"     },
              { label: "How It Works",    href: "/how-it-works" },
              { label: "Destinations",    href: "#destinations" },
            ].map(({ label, href }) => (
              <Link key={label} href={href} style={{ color: c.body }}
                className="text-sm font-medium hover:opacity-70 transition-opacity">
                {label}
              </Link>
            ))}
          </div>

          {/* Auth-aware right side + mobile hamburger */}
          <AuthNav />
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[640px]">
        {/* Full-bleed Stitch background image */}
        <div className="absolute inset-0">
          <Image
            src={STITCH.heroBg}
            alt="Premium luxury vehicle in transit"
            fill
            className="object-cover object-center"
            priority
            sizes="100vw"
          />
          {/* Dark gradient — left-heavy so text stays readable */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(to right, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.85) 45%, rgba(15,23,42,0.5) 70%, rgba(15,23,42,0.2) 100%)",
            }}
          />
          {/* Bottom fade to surface */}
          <div
            className="absolute inset-x-0 bottom-0 h-24"
            style={{ background: `linear-gradient(to bottom, transparent, ${c.bg})` }}
          />
        </div>

        <div className="relative max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-36">

          {/* Copy — full width, left-aligned */}
          <div className="max-w-2xl">
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
              Connect with verified exporters across Africa and the Middle East. Every vehicle is inspected, documented,
              and tracked in real time — straight to your port.
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
              {/* G63 — Stitch image */}
              <div className="relative w-full rounded-md overflow-hidden mb-5" style={{ aspectRatio: "16/9" }}>
                <Image
                  src={STITCH.g63}
                  alt="Mercedes-AMG G63 — white, Dubai desert"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
              </div>
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
                VIN: WDC4636251X123456 &nbsp;·&nbsp; RHD
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Mileage",      value: "12,400 km" },
                  { label: "Colour",       value: "Obsidian Black" },
                  { label: "Origin Port",  value: "Jebel Ali (Dubai)" },
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
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
            <div>
              <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
                Process
              </p>
              <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-4xl font-bold mb-2">
                Cross-Border Trust
              </h2>
              <p style={{ color: c.muted }} className="text-lg max-w-lg">
                Your global car purchase, secured. A rigorous 4-step process designed for absolute transparency.
              </p>
            </div>
            <Link
              href="/how-it-works"
              style={{ color: c.green, borderColor: c.green }}
              className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-10 rounded border whitespace-nowrap hover:opacity-80 transition-opacity"
            >
              See full process <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                n: "01",
                title: "Selection",
                body: "Browse our curated inventory of high-performance and luxury vehicles, each pre-vetted for title authenticity and provenance.",
                badge: "Vetted Inventory Only",
              },
              {
                n: "02",
                title: "Verification",
                body: "Our local agents perform a mandatory 200-point physical inspection. You receive an HD video report and direct mechanical diagnosis.",
                badge: "200-Point Inspection",
              },
              {
                n: "03",
                title: "Document & Title Transfer",
                body: "Our platform manages the secure exchange of legal documents and title deeds, verified and authenticated before ownership is transferred.",
                badge: "Fully Authenticated",
              },
              {
                n: "04",
                title: "Delivery",
                body: "Insured global logistics managed by Tier-1 shipping partners. We handle customs documentation, export duties, and door-to-door delivery.",
                badge: "Door-to-Door",
              },
            ].map(({ n, title, body, badge }) => (
              <div
                key={n}
                style={{ border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
                className="p-6 relative"
              >
                <div style={{ color: c.border }} className="text-5xl font-black mb-4 leading-none select-none">{n}</div>
                <h3 style={{ color: c.primary }} className="font-semibold text-base mb-2">{title}</h3>
                <p style={{ color: c.body }} className="text-sm leading-relaxed mb-4">{body}</p>
                <span
                  style={{ backgroundColor: c.greenBg, color: c.greenText }}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full"
                >
                  <CheckCircle2 className="h-3 w-3" /> {badge}
                </span>
              </div>
            ))}
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {destinations.map(({ country, flag, demand, demandColor, demandBg, port, note }) => (
              <div
                key={country}
                style={{
                  backgroundColor: c.surface,
                  border: `1px solid ${c.border}`,
                  borderRadius: "0.75rem",
                  padding: "20px",
                }}
                className="hover:shadow-md transition-shadow"
              >
                {/* Country + demand badge */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{flag}</span>
                    <span style={{ color: c.primary, fontWeight: 700, fontSize: "15px" }}>
                      {country}
                    </span>
                  </div>
                  <span
                    style={{
                      backgroundColor: demandBg,
                      color: demandColor,
                      fontSize: "10px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "20px",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {demand}
                  </span>
                </div>

                {/* Port */}
                <div className="flex items-center gap-1.5 mb-2">
                  <MapPin style={{ color: c.green }} className="h-3 w-3 shrink-0" />
                  <span style={{ color: c.muted, fontSize: "12px", fontWeight: 500 }}>{port}</span>
                </div>

                {/* Note */}
                <p style={{ color: c.body, fontSize: "12px", lineHeight: "1.5" }}>{note}</p>
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
              { icon: Shield,    title: "Verified Exporters Only",    body: "Every seller submits a trade licence and is manually reviewed before listing a single vehicle." },
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
            Join the platform built for serious buyers and verified exporters from across Africa and the Middle East.
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
