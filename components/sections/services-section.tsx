import { Shield, FileCheck, Truck, CheckCircle2 } from "lucide-react";
import { c } from "@/lib/tokens";

const services = [
  {
    icon: Shield,
    title: "Seller Vetting",
    description:
      "Every exporter submits a trade or business licence. Our team manually reviews and approves each account before they can list a single vehicle. No anonymous sellers.",
    features: [
      "Trade licence required to list",
      "Manual account review process",
      "Zero unverified sellers on platform",
    ],
  },
  {
    icon: FileCheck,
    title: "Document Registry",
    description:
      "Both parties upload transaction documents to our secure registry. We act as a neutral custodian — not a party to the deal — cooperating with legal proceedings if required.",
    features: [
      "Neutral document custodian role",
      "7-year GDPR-compliant retention",
      "Full audit trail for every deal",
    ],
  },
  {
    icon: Truck,
    title: "Deal Transparency",
    description:
      "All negotiation, payment confirmations, and shipping updates happen on-platform. Every message and document upload is permanently logged. Nothing happens off the record.",
    features: [
      "On-platform negotiation & messaging",
      "VIN visible on every listing",
      "Immutable deal history log",
    ],
  },
];

export function ServicesSection() {
  return (
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
  );
}
