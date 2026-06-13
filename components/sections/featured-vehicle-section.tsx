import Image from "next/image";
import { CheckCircle2, Clock } from "lucide-react";
import { c } from "@/lib/tokens";

const G63_IMG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDwIeFdGZKiF_5ElpeZR65A-cloxXDBLwrgjR737hUL_qwSr2VkHo4lDQjo9hUTOT4jLAuK8khxFII0Y6ArWvo5f_1J8ACmGPbjlIz07OH4m6m9c3LN_fKBIWUX5IQHZZUS00iAnF2UpIafNr3TXGF_p2Y-jRXqM_VFC2yQ4enj6ZRwBAy0erlN7_e-H_J0PjNcL3VUq1p_4GBTkVIrlioT9cWqmyxnZ31LDXOqduw7aOzGGzjwkjye_GXzLuREdDVluwRaEUadM5Y";

const transitSteps = [
  { label: "Inspection Certified",     done: true,  active: false },
  { label: "Documentation Cleared",    done: true,  active: false },
  { label: "Customs Processed",        done: true,  active: false },
  { label: "Ocean Freight – Atlantic", done: false, active: true  },
  { label: "Destination Port",         done: false, active: false },
];

const specs = [
  { label: "Mileage",      value: "12,400 km" },
  { label: "Colour",       value: "Obsidian Black" },
  { label: "Origin Port",  value: "Jebel Ali (Dubai)" },
  { label: "Destination",  value: "Lagos (Apapa)" },
  { label: "Departure",    value: "02 Jun 2026" },
  { label: "ETA",          value: "28 Jun 2026" },
];

export function FeaturedVehicleSection() {
  return (
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
            <div className="relative w-full rounded-md overflow-hidden mb-5" style={{ aspectRatio: "16/9" }}>
              <Image
                src={G63_IMG}
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
              {specs.map(({ label, value }) => (
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

          {/* Shipment stepper */}
          <div>
            <p style={{ color: c.muted }} className="text-xs font-semibold uppercase tracking-widest mb-5">
              Shipment Progress
            </p>
            <div className="space-y-4">
              {transitSteps.map(({ label, done, active }, i) => (
                <div key={label} className="flex items-start gap-4">
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
                      {done   && <CheckCircle2 className="h-3 w-3 text-white" />}
                      {active && <Clock        className="h-3 w-3 text-white" />}
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
                      <p style={{ color: c.green }} className="text-xs mt-0.5">
                        In progress · Est. 26 days remaining
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
