import { CheckCircle2 } from "lucide-react";
import { c } from "@/lib/tokens";

const steps = [
  {
    n: "01",
    title: "Discovery",
    body: "Browse export-ready inventory from verified sellers across 14+ countries. Filter by make, model, price, and destination port. Every listing shows the full VIN.",
    badge: "Vetted Sellers Only",
  },
  {
    n: "02",
    title: "Exporter Vetting",
    body: "Every seller submits a trade or business licence. Our team manually reviews and approves each exporter before a single vehicle goes live. No anonymous listings.",
    badge: "Manual Review",
  },
  {
    n: "03",
    title: "Document Registry",
    body: "Both parties upload transaction documents — invoices, title deeds, shipping confirmations — to our secure registry. We act as neutral custodian for the full audit trail.",
    badge: "Neutral Custodian",
  },
  {
    n: "04",
    title: "Deal Completion",
    body: "Confirm terms on-platform, upload payment and shipping confirmations, and track your deal to the destination port. Every step is permanently logged.",
    badge: "Full Audit Trail",
  },
];

export function HowItWorksSection() {
  return (
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
            Cross-Border Trust
          </h2>
          <p style={{ color: c.muted }} className="text-lg max-w-lg">
            A transparent 4-step process — from discovery to deal completion — built around verified sellers and
            document-backed transactions.
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-6">
          {steps.map(({ n, title, body, badge }) => (
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
  );
}
