import { CheckCircle2 } from "lucide-react";
import { c } from "@/lib/tokens";

const steps = [
  {
    n: "01",
    title: "Find the model",
    body: "Search live listings by make, model, year, and displacement. Whether you're after a Kawasaki Z400, a Honda CB400 Super Four, or a Yamaha SR — if it's in Japan, it's here.",
    badge: "Live Inventory",
  },
  {
    n: "02",
    title: "Know who you're buying from",
    body: "Every exporter on the platform has been manually approved — trade licence submitted, identity confirmed. You see their verified profile before you send a single message.",
    badge: "Seller Verified",
  },
  {
    n: "03",
    title: "Check the chassis",
    body: "Run a live JDM chassis check directly from the listing page. Flagged units are blocked before the deal can proceed. Your documents are held in our neutral registry.",
    badge: "Chassis Checked",
  },
  {
    n: "04",
    title: "Connect to freight",
    body: "Once you're ready, we connect you to certified freight partners who know this corridor. You manage the relationship — we make sure you're starting with someone credible.",
    badge: "Freight Matched",
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
            From search to shipment
          </h2>
          <p style={{ color: c.muted }} className="text-lg max-w-lg">
            We don't handle your money or your freight — we make sure the people you deal with are
            worth trusting, and that everything is documented if they aren't.
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
