import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  ArrowRight,
  Shield,
  Globe,
  FileCheck,
  Search,
  Lock,
  UserCheck,
  ClipboardCheck,
  ShieldCheck,
  FileText,
  Scale,
} from "lucide-react";
import { c } from "@/lib/tokens";

// ─── Stitch image assets ──────────────────────────────────────────────────────
const img = {
  // Step 01 — BMW M5 in minimalist concrete showroom
  discovery:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBPSPgXddMyCczflpuV_PXhTfMIzpJNRUJ5-lhrceZ94TEczZ3-DIMsOH74dq8DXetMGHSHX0ZiJ3EMI7XJW8tQTYOxlFp6rfZFP5RUkj8IZThSMOY1maC4FoLcymlbT8W6Mf6sibbEhEPkU2jhjBe7Y7XZ3LPx9boudLx4ZL10jg25UdU6NPWCwwSF8AaowzFXrQ4bQSF45y4LCAEhpcP3nHp4xouXS_akGVI-ZxZocKBXDgRWh_MhauW001NWA7njdpwergrcTe4",
  // Step 02 — Elite vehicle selection context
  vetting:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDqHBwPHygOTZpaQqCpzgXkG3gAXV6OX758Jg7wCXcN9gHoS0JgexJmKlpAWq5MapbIWndR3u2-KpAbZ_jxQHaLGFZmv1f6G5z8LcAW9aFEK2a87vux28gDCeQp61DzN9dftwbGZzh21xHh42KOHF3Ao7MkF7cUk9jZMr_jxDq0H33sS0R5pPhyNhx4nSaRCqBagnWo_o7b0X_D0GtoHtb7M8P6g3-0Q6vw3WjL55udo6zyDNQ0ENfdX8Priqc1cLYNK41l58EOY7U",
  // Step 03 — Logistics/document context
  documents:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAlYxiq6lCJ5BNgvKq-v2mC_EERTK60IkZXlYvT5rw7mibD362LOEWswuFBmoY2hbG3ViMcfke11tHd3c0MJht5reuIExAWTrftsHVIL1vnvwtv67DU3EN6eJFK-z8T4W0G5LuxseCu1y4KndYmu8KBDoxSAvn_MMs69pO2TA_b1EI0ICKxjFL1hkgwFBiJfOF7kAj8N-xmaj39c72P9J2X_AP4gI35FzVi7w0kEKd8QJhTF9WpvV2x69V76ShM6Os-OMO2namzmpA",
  // Step 04 — Vehicle shipping
  completion:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaHS6gz6dJxeezM-JE2FjaLCXTZc8RZreIKQCImymQpCf51rhwcOhLgfUrOL8bpo6TU0IFRA-UmJW14RMT7C937Xh7V5kelCiD5Qc8D3n_LhCPHZ0J2GIP2vYVheCW4a3_il8_DbQoSABp21z2KjegIBn9xG42ON_-kdwwyQgWpG3PxN2c3k3mZIiE9l9cdLtFqb6bev6qjKAcGtx3_G2JdPJuN1S_HdKJ5MDe_QpTS3qNPedRgUlKq6O0SMAfOjUI0O8vQTz47s",
  // Security section — Atlantic shipping route map
  routeMap:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuA3RCvVB9KWdOWUlooqQyuM_O7rlwpdu-mfagKdUaQUD3ordCamGg4VHmxJDmOvJ6wsk6512pr9J0--j2axmB0CcUrDMJBEpEvYHE7Z_NjahR3FusrfWlRkwINsN1VtnHX6AAq5uM5rGLq3Fv3c2xCWPDn6As0NMJKOSJxYM6mDFmIQW21N8I7L4AIpG0PcdOYhIfeopiyrCQTKkrWyLQo25ZXlbBvu1KY_v0_wRnPuP7AXWc5IsJpiR7ggv1mNZfsbNfYUBN2iFI4",
  // Trust section — Porsche on coastal road
  trustVisual:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAuHkVfg0VUaZSNsKiLEIeD8yMNnSVXcjBYGPiPukKpxmqQbVFWB3tN9Qw0FRmp-5djgbBqTie2C91uZ9a01MtI5aeMbn3nhGlZ1SM2Dg33HGEcKR1V2kcVRWnH1lJIzIAjcBbNj_IeYZSf2U_T60hzHfdEERIEKwk0TCdQU8OaBjB842ts4fHX0pGtwFqHUrGHtysQq1SmnUNn_zeRu2-63nx4UsO99BISyyzrOTItMYMALTN0PF90gMUnnX-Cz2Mjmdo7cruBAiY",
};

// ─── Process steps ────────────────────────────────────────────────────────────
const steps = [
  {
    n: "01",
    phase: "Discovery",
    headline: "Browse Verified Inventory from Exporters Worldwide",
    body: "Every vehicle on TrueWagon comes from a manually verified, licensed exporter. Filter by make, model, price range, destination port, or steering configuration. The full VIN is visible on every listing — no mystery vehicles, no hidden history.",
    highlights: [
      { icon: Search,    label: "Verified Exporters Only" },
      { icon: Shield,    label: "VIN on Every Listing" },
      { icon: Globe,     label: "14+ Exporter Countries" },
    ],
    image: img.discovery,
    imageAlt: "Curated vehicle inventory from verified global exporters",
  },
  {
    n: "02",
    phase: "Exporter Vetting",
    headline: "Every Seller is Manually Reviewed Before Listing",
    body: "To list on TrueWagon, sellers must submit their trade or business licence and pass a manual review by our team. We do not allow self-certification — every exporter is individually verified. Approved exporters carry a visible verified badge and a deal history buyers can review.",
    highlights: [
      { icon: UserCheck,    label: "Trade Licence Required" },
      { icon: ClipboardCheck, label: "Manual Review Process" },
      { icon: ShieldCheck,  label: "Zero Unverified Sellers" },
    ],
    image: img.vetting,
    imageAlt: "Seller vetting and licence review process",
  },
  {
    n: "03",
    phase: "Document Registry",
    headline: "Secure Document Custody for Every Transaction",
    body: "When a deal begins, both buyer and seller upload their transaction documents — purchase agreements, invoices, title deeds, shipping confirmations — to TrueWagon's secure document registry. We act as a neutral document custodian. We are not a party to your transaction, but we hold the record. If a dispute arises or legal proceedings require it, we cooperate fully.",
    highlights: [
      { icon: FileCheck, label: "Neutral Document Custodian" },
      { icon: Lock,      label: "GDPR-Compliant Storage" },
      { icon: FileText,  label: "7-Year Retention Policy" },
    ],
    image: img.documents,
    imageAlt: "Secure transaction document registry and custody",
  },
  {
    n: "04",
    phase: "Deal Completion",
    headline: "On-Platform Negotiation, Logging, and Tracking",
    body: "All communication, payment confirmations, and shipping updates happen inside the platform. Every message exchanged, every document uploaded, and every status change is permanently logged. When your shipment moves, you update the deal. When it arrives, the record is complete.",
    highlights: [
      { icon: ShieldCheck, label: "Immutable Audit Trail" },
      { icon: FileText,    label: "On-Platform Messaging" },
      { icon: CheckCircle2, label: "Dispute Support Available" },
    ],
    image: img.completion,
    imageAlt: "Deal completion and shipment confirmation",
  },
];

// ─── Buyer / Seller steps ─────────────────────────────────────────────────────
const buyerSteps = [
  { n: "01", title: "Browse verified inventory",  body: "Filter by make, model, price, and destination port. Every listing is from a verified, licensed exporter." },
  { n: "02", title: "Send an inquiry",             body: "Contact the exporter directly through the platform. No WhatsApp strangers, no middlemen." },
  { n: "03", title: "Agree on terms",              body: "Negotiate price and shipping terms on-platform. Every message is logged and cannot be edited." },
  { n: "04", title: "Upload & track",              body: "Upload payment confirmation and transaction documents. Track your deal through to the destination port." },
];

const sellerSteps = [
  { n: "01", title: "Apply to list",              body: "Submit your trade or business licence. We verify every exporter manually before approval — no shortcuts." },
  { n: "02", title: "List your inventory",         body: "Add vehicles with photos, specs, VIN, FOB pricing, and available destination ports." },
  { n: "03", title: "Respond to qualified leads",  body: "Serious buyers only. Negotiate and agree on terms in one centralised, logged thread." },
  { n: "04", title: "Close and document",          body: "Confirm the deal, upload shipping and export documents to the registry, and build your verified history." },
];

// ─── Accurate stats ───────────────────────────────────────────────────────────
const stats = [
  { value: "14+",   label: "Exporter Countries" },
  { value: "0",     label: "Unverified Sellers" },
  { value: "100%",  label: "VIN-Tracked Deals" },
  { value: "7yr",   label: "Document Retention" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function HowItWorksPage() {
  return (
    <>

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
        <div className="relative max-w-[1280px] mx-auto px-8 md:px-16 text-center flex flex-col items-center">
          <div
            style={{ backgroundColor: c.greenBg, color: c.greenText }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Transparent by Design
          </div>
          <h1
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Cross-Border Vehicle Trade,{" "}
            <span style={{ color: c.green }}>Done Right.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-lg leading-relaxed max-w-xl mb-10">
            TrueWagon is a verified marketplace — not a broker, not a logistics company. We connect buyers with licensed exporters and provide the infrastructure to make every deal traceable, documented, and trustworthy.
          </p>

          {/* Step pills */}
          <div className="flex flex-wrap justify-center gap-3">
            {["01 Discovery", "02 Exporter Vetting", "03 Document Registry", "04 Deal Completion"].map((s) => (
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
          {steps.map(({ n, phase, headline, body, highlights, image, imageAlt }, idx) => (
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
              <div className={idx % 2 === 1 ? "md:order-2" : ""}>
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
                    alt={imageAlt}
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

      {/* ── BUYER / SELLER STEPS ────────────────────────────────────────────── */}
      <section
        id="process"
        style={{ backgroundColor: c.surface, borderTop: `1px solid ${c.border}`, borderBottom: `1px solid ${c.border}` }}
        className="py-20"
      >
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="text-center mb-14">
            <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
              Your journey
            </p>
            <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-4xl font-bold mb-3">
              Whether you're buying or selling
            </h2>
            <p style={{ color: c.muted }} className="text-lg max-w-lg mx-auto">
              The platform works the same way for both sides — transparent, logged, and documented from start to finish.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Buyer steps */}
            <div
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
              className="p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div style={{ backgroundColor: c.greenBg, borderRadius: "0.375rem" }} className="w-9 h-9 flex items-center justify-center shrink-0">
                  <Search style={{ color: c.green }} className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest">For Buyers</p>
                  <h3 style={{ color: c.primary }} className="font-bold text-lg">Finding your vehicle</h3>
                </div>
              </div>
              <div className="space-y-6">
                {buyerSteps.map(({ n, title, body }, i) => (
                  <div key={n} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          backgroundColor: c.primary,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <span className="text-white text-xs font-bold">{n}</span>
                      </div>
                      {i < buyerSteps.length - 1 && (
                        <div style={{ width: "2px", flex: 1, minHeight: "20px", backgroundColor: c.border, marginTop: "4px", marginBottom: "-4px" }} />
                      )}
                    </div>
                    <div className="pb-2">
                      <p style={{ color: c.primary }} className="font-semibold text-sm mb-1">{title}</p>
                      <p style={{ color: c.muted }} className="text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/browse"
                  style={{ backgroundColor: c.green, color: "#fff" }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-10 rounded hover:opacity-90 transition-opacity"
                >
                  Browse Inventory <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>

            {/* Seller steps */}
            <div
              style={{ backgroundColor: c.bg, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
              className="p-8"
            >
              <div className="flex items-center gap-3 mb-8">
                <div style={{ backgroundColor: c.greenBg, borderRadius: "0.375rem" }} className="w-9 h-9 flex items-center justify-center shrink-0">
                  <Globe style={{ color: c.green }} className="h-4.5 w-4.5" />
                </div>
                <div>
                  <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest">For Exporters</p>
                  <h3 style={{ color: c.primary }} className="font-bold text-lg">Listing and selling</h3>
                </div>
              </div>
              <div className="space-y-6">
                {sellerSteps.map(({ n, title, body }, i) => (
                  <div key={n} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div
                        style={{
                          width: "28px", height: "28px", borderRadius: "50%", flexShrink: 0,
                          backgroundColor: c.primary,
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}
                      >
                        <span className="text-white text-xs font-bold">{n}</span>
                      </div>
                      {i < sellerSteps.length - 1 && (
                        <div style={{ width: "2px", flex: 1, minHeight: "20px", backgroundColor: c.border, marginTop: "4px", marginBottom: "-4px" }} />
                      )}
                    </div>
                    <div className="pb-2">
                      <p style={{ color: c.primary }} className="font-semibold text-sm mb-1">{title}</p>
                      <p style={{ color: c.muted }} className="text-xs leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  href="/register?role=seller"
                  style={{ border: `1px solid ${c.border}`, color: c.primary }}
                  className="inline-flex items-center gap-2 text-sm font-semibold px-6 h-10 rounded hover:border-[#10B981] transition-colors"
                >
                  Apply as Exporter <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST CALLOUT (dark) ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.primary }} className="py-16">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
                Our Role
              </p>
              <h2 style={{ color: "#fff", letterSpacing: "-0.01em" }} className="text-2xl font-bold mb-3">
                A Platform Built on Accountability
              </h2>
              <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-sm leading-relaxed">
                We do not manage logistics, we do not hold funds, and we are not a party to any transaction. What we do is verify who you are dealing with and hold a complete record of the deal — so that if something goes wrong, there is always a paper trail.
              </p>
            </div>
            {[
              {
                icon: Shield,
                title: "Verified Exporters Only",
                body: "All sellers submit a trade licence and are manually reviewed before listing. No anonymous sellers, ever.",
              },
              {
                icon: Scale,
                title: "Document Custodian",
                body: "We hold transaction documents in our secure registry for 7 years. We cooperate fully with legal proceedings and disputes.",
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} style={{ borderLeft: "2px solid rgba(255,255,255,0.1)" }} className="pl-8">
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

      {/* ── SECURITY PILLARS ────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: c.bg, borderTop: `1px solid ${c.border}` }} className="py-20">
        <div className="max-w-[1280px] mx-auto px-8 md:px-16">

          <div className="text-center mb-14">
            <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-3">
              Trust Infrastructure
            </p>
            <h2 style={{ color: c.primary, letterSpacing: "-0.01em" }} className="text-4xl font-bold mb-3">
              Multi-Layer Accountability
            </h2>
            <p style={{ color: c.muted }} className="text-lg max-w-xl mx-auto leading-relaxed">
              Every deal on TrueWagon passes through four accountability layers — designed to protect both sides of every transaction.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 items-center mb-16">
            <div className="relative w-full rounded-md overflow-hidden" style={{ aspectRatio: "4/3" }}>
              <Image
                src={img.routeMap}
                alt="Global shipping route map"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 600px"
              />
            </div>
            <div className="grid grid-cols-1 gap-5">
              {[
                {
                  icon: UserCheck,
                  title: "Seller Identity Verification",
                  body: "Every exporter submits their trade or business licence. We manually verify each business before they can list a single vehicle. No self-certification, no anonymous sellers.",
                },
                {
                  icon: ClipboardCheck,
                  title: "VIN & Provenance Transparency",
                  body: "Every listing displays the vehicle's full VIN. Buyers can verify ownership history and title authenticity before making any inquiry.",
                },
                {
                  icon: FileText,
                  title: "Secure Document Registry",
                  body: "Transaction documents uploaded by both parties are held in our secure registry under GDPR-compliant storage for 7 years. TrueWagon cooperates with legal proceedings upon valid request.",
                },
                {
                  icon: Lock,
                  title: "Immutable Deal Logging",
                  body: "Every message exchanged, document uploaded, status update, and payment confirmation is permanently logged. Full audit trail, always — for both parties.",
                },
              ].map(({ icon: Icon, title, body }) => (
                <div
                  key={title}
                  style={{ backgroundColor: c.surface, border: `1px solid ${c.border}`, borderRadius: "0.5rem" }}
                  className="flex gap-4 p-5"
                >
                  <div
                    style={{ backgroundColor: c.greenBg, width: "40px", height: "40px", borderRadius: "0.375rem", flexShrink: 0 }}
                    className="flex items-center justify-center"
                  >
                    <Icon style={{ color: c.green }} className="h-4 w-4" />
                  </div>
                  <div>
                    <p style={{ color: c.primary }} className="font-semibold text-sm mb-1">{title}</p>
                    <p style={{ color: c.muted }} className="text-xs leading-relaxed">{body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Document trust callout panel */}
          <div
            style={{
              backgroundColor: c.primary,
              borderRadius: "0.75rem",
              overflow: "hidden",
            }}
            className="grid md:grid-cols-2"
          >
            <div className="relative" style={{ minHeight: "320px" }}>
              <Image
                src={img.trustVisual}
                alt="Verified vehicle export ready for delivery"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
              />
              <div
                className="absolute inset-0 hidden md:block"
                style={{ background: "linear-gradient(to right, transparent 60%, rgba(15,23,42,0.6) 100%)" }}
              />
            </div>
            <div className="p-10 flex flex-col justify-center">
              <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-4">
                Document Trust
              </p>
              <h3 className="text-2xl font-bold text-white mb-4" style={{ letterSpacing: "-0.01em" }}>
                The more you document, the more protected you are.
              </h3>
              <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-sm leading-relaxed mb-6">
                The security and evidentiary value of any transaction is directly proportional to the completeness of documentation uploaded by both parties. Gaps in the record leave gaps in your protection. Uploading thorough documents is not optional — it is your insurance.
              </p>
              <ul className="space-y-3">
                {[
                  "Upload invoices, title deeds, and shipping confirmations",
                  "Both parties should contribute complete documentation",
                  "Missing documents mean limited platform support in disputes",
                  "All uploads stored for 7 years under GDPR-compliant terms",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5">
                    <CheckCircle2 style={{ color: c.green }} className="h-4 w-4 mt-0.5 shrink-0" />
                    <span style={{ color: "rgba(255,255,255,0.75)" }} className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
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
            Join the network of serious buyers and verified exporters moving vehicles safely across borders.
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

    </>
  );
}
