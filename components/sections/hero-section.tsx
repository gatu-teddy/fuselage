import Link from "next/link";
import Image from "next/image";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { c } from "@/lib/tokens";

const HERO_BG =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCGaHS6gz6dJxeezM-JE2FjaLCXTZc8RZreIKQCImymQpCf51rhwcOhLgfUrOL8bpo6TU0IFRA-UmJW14RMT7C937Xh7V5kelCiD5Qc8D3n_LhCPHZ0J2GIP2vYVheCW4a3_il8_DbQoSABp21z2KjegIBn9xG42ON_-kdwwyQgWpG3PxN2c3k3mZIiE9l9cdLtFqb6bev6qjKAcGtx3_G2JdPJuN1S_HdKJ5MDe_QpTS3qNPedRgUlKq6O0SMAfOjUI0O8vQTz47s";

const stats = [
  { value: "Japan",  label: "Primary source market" },
  { value: "100%",   label: "Verified exporters" },
  { value: "100%",   label: "Chassis tracked" },
  { value: "0",      label: "Anonymous listings" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[640px]">
      <div className="absolute inset-0">
        <Image
          src={HERO_BG}
          alt="Motorbike ready for export"
          fill
          className="object-cover object-center"
          priority
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(15,23,42,0.97) 0%, rgba(15,23,42,0.85) 45%, rgba(15,23,42,0.5) 70%, rgba(15,23,42,0.2) 100%)",
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-24"
          style={{ background: `linear-gradient(to bottom, transparent, ${c.bg})` }}
        />
      </div>

      <div className="relative max-w-[1280px] mx-auto px-5 md:px-16 py-16 md:py-36">
        <div className="max-w-2xl">
          <div
            style={{ backgroundColor: c.greenBg, color: c.greenText }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-6"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Verified Exporters · Live Inventory
          </div>

          <h1
            className="text-4xl md:text-5xl font-bold text-white leading-tight mb-5"
            style={{ letterSpacing: "-0.02em" }}
          >
            Import Motorbikes Direct<br />
            <span style={{ color: c.green }}>From Japan to Your Port</span>
          </h1>

          <p style={{ color: "rgba(255,255,255,0.65)" }} className="text-lg leading-relaxed mb-8 max-w-lg">
            Browse verified Japanese exporters with live inventory. Every chassis number checked,
            every deal documented — from Osaka to Mombasa, Lagos to Dar es Salaam.
          </p>

          <div className="flex flex-wrap gap-3 mb-12">
            <Link
              href="/browse"
              style={{ backgroundColor: c.green, color: "#fff" }}
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 h-12 rounded hover:opacity-90 transition-opacity"
            >
              Browse Motorbikes <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register?role=seller"
              style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
              className="inline-flex items-center gap-2 text-sm font-semibold px-8 h-12 rounded border hover:border-white/40 transition-colors"
            >
              List as Exporter
            </Link>
          </div>

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
  );
}
