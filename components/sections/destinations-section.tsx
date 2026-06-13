import { MapPin } from "lucide-react";
import { c } from "@/lib/tokens";

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

export function DestinationsSection() {
  return (
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
                  <span style={{ color: c.primary, fontWeight: 700, fontSize: "15px" }}>{country}</span>
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

              <p style={{ color: c.body, fontSize: "12px", lineHeight: "1.5" }}>{note}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
