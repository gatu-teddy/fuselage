import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { c } from "@/lib/tokens";

export function CtaSection() {
  return (
    <section style={{ backgroundColor: c.primary }} className="py-24 relative overflow-hidden">
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative max-w-3xl mx-auto px-8 text-center">
        <p style={{ color: c.green }} className="text-xs font-semibold uppercase tracking-widest mb-5">
          Ready to start?
        </p>
        <h2
          className="text-4xl md:text-5xl font-bold text-white mb-5"
          style={{ letterSpacing: "-0.02em" }}
        >
          Import the right way.
        </h2>
        <p style={{ color: "rgba(255,255,255,0.6)" }} className="text-lg mb-10 max-w-lg mx-auto leading-relaxed">
          The platform built for serious buyers and verified exporters — wherever you are in the world.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/browse"
            style={{ backgroundColor: c.green, color: "#fff" }}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-10 h-12 rounded hover:opacity-90 transition-opacity"
          >
            Browse Vehicles <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/register?role=seller"
            style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
            className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-10 h-12 rounded border hover:border-white/40 transition-colors"
          >
            Apply as Exporter
          </Link>
        </div>
      </div>
    </section>
  );
}
