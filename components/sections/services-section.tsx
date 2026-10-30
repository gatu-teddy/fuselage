import { Shield, FileCheck, Truck, CheckCircle2 } from "lucide-react";
import { c } from "@/lib/tokens";

const services = [
  {
    icon: Shield,
    title: "Exporters you can trust",
    description:
      "Sending money abroad to a seller you've never met is the hardest part of importing. Every exporter on TrueWagon has submitted a trade licence and passed manual review before publishing a single listing.",
    features: [
      "Trade licence verified before approval",
      "Manual review — no self-serve accounts",
      "Zero anonymous sellers",
    ],
  },
  {
    icon: FileCheck,
    title: "Chassis checked upfront",
    description:
      "Every listing carries the full chassis number. Run a live JDM verification before you commit — flagged units are blocked automatically and held for review. What you see is what ships.",
    features: [
      "Chassis number on every listing",
      "Live check available to buyers",
      "Flagged units cannot proceed to sale",
    ],
  },
  {
    icon: Truck,
    title: "A paper trail for everything",
    description:
      "All communication, documents, and shipping confirmations happen on-platform. Nothing goes off the record — so if something goes wrong, you have everything you need to resolve it.",
    features: [
      "On-platform messaging and documents",
      "Full audit trail per transaction",
      "Certified freight partner connections",
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
            The trust layer between you and Japan
          </h2>
          <p style={{ color: c.muted }} className="text-lg max-w-xl mx-auto leading-relaxed">
            Importing a specific model from Japan means dealing with exporters you can't visit
            and paperwork you can't see in person. We fix that.
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
