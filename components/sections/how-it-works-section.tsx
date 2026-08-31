import { CheckCircle2 } from "lucide-react";
import { c } from "@/lib/tokens";

const steps = [
  {
    n: "01",
    title: "Browse Inventory",
    body: "Filter live motorbike listings from verified Japanese exporters by make, model, price, and destination port. Every listing shows the full chassis number.",
    badge: "Live Inventory",
  },
  {
    n: "02",
    title: "Verify the Seller",
    body: "Every exporter has submitted a trade or business licence. Our team manually approves each account — only verified sellers can publish listings.",
    badge: "Manual Review",
  },
  {
    n: "03",
    title: "Check the Chassis",
    body: "Run a live chassis verification directly from the listing. Flagged units are held automatically. Upload deal documents to our neutral registry for a full audit trail.",
    badge: "Chassis Verified",
  },
  {
    n: "04",
    title: "Port Delivery",
    body: "Confirm terms on-platform, coordinate freight through our certified partner network, and track the shipment to your destination port. Every step permanently logged.",
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
            Japan to Your Port in 4 Steps
          </h2>
          <p style={{ color: c.muted }} className="text-lg max-w-lg">
            A transparent process built around verified exporters, chassis checks, and
            document-backed deals — from Osaka to Mombasa.
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
