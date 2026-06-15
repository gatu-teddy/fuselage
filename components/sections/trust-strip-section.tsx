import { Shield, FileCheck, Globe, Truck } from "lucide-react";
import { c } from "@/lib/tokens";

const pillars = [
  {
    icon: Shield,
    title: "Verified Exporters Only",
    body: "Every seller submits a trade licence and is manually reviewed before listing a single vehicle.",
  },
  {
    icon: FileCheck,
    title: "VIN on Every Listing",
    body: "Chassis numbers visible before you inquire. No mystery vehicles, ever.",
  },
  {
    icon: Globe,
    title: "Global Reach",
    body: "Connecting buyers and sellers across ports worldwide, with verified exporters on every continent.",
  },
  {
    icon: Truck,
    title: "Fully Tracked Deals",
    body: "From first inquiry to port arrival — every step is logged and visible to both parties.",
  },
];

export function TrustStripSection() {
  return (
    <section style={{ backgroundColor: c.bgDim, borderBottom: `1px solid ${c.border}` }} className="py-14">
      <div className="max-w-[1280px] mx-auto px-8 md:px-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {pillars.map(({ icon: Icon, title, body }) => (
            <div key={title}>
              <div
                style={{
                  backgroundColor: c.surface,
                  width: "40px",
                  height: "40px",
                  borderRadius: "0.5rem",
                  border: `1px solid ${c.border}`,
                }}
                className="flex items-center justify-center mb-4"
              >
                <Icon style={{ color: c.primary }} className="h-4 w-4" />
              </div>
              <p style={{ color: c.primary }} className="font-semibold text-sm mb-1">{title}</p>
              <p style={{ color: c.muted }} className="text-xs leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
