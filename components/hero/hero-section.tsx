"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Car } from "lucide-react";
import { CarCarousel } from "./car-carousel";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: "easeOut" as const },
  }),
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#050206" }}>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 md:px-14 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#9A8174" }}>
            <span className="font-black text-sm" style={{ color: "#FBFFF4" }}>T</span>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "#FBFFF4" }}>TrueWagon</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm">
          {[
            { label: "Browse", href: "/browse" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Destinations", href: "#ports" },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="transition-opacity hover:opacity-100 opacity-60" style={{ color: "#FBFFF4" }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 rounded-lg transition-opacity hover:opacity-80" style={{ color: "#9A8174" }}>
            Sign in
          </Link>
          <Link
            href="/register"
            className="text-sm px-5 py-2 rounded-lg font-semibold transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#9A8174", color: "#FBFFF4" }}
          >
            Sign up
          </Link>
        </div>
      </nav>

      {/* Main split */}
      <div className="relative flex-1 flex items-stretch gap-0">

        {/* LEFT — text */}
        <div className="relative z-10 w-full max-w-xl shrink-0 flex flex-col justify-center px-8 md:px-14 py-12">

          <motion.div
            custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-6 border"
            style={{ borderColor: "#9A8174", color: "#9A8174", backgroundColor: "rgba(154,129,116,0.08)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#9A8174" }} />
            UAE Export × African Markets
          </motion.div>

          <motion.h1
            custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="text-4xl md:text-5xl lg:text-[3.6rem] font-black tracking-tighter leading-[1.02] mb-6"
            style={{ color: "#FBFFF4" }}
          >
            Looking to import a{" "}
            <span style={{ color: "#9A8174" }}>premium vehicle</span>{" "}
            from UAE?
          </motion.h1>

          <motion.p
            custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="text-base md:text-lg leading-relaxed mb-8"
            style={{ color: "rgba(251,255,244,0.5)" }}
          >
            Connect directly with verified UAE import/export companies.
            Browse luxury cars and high-end bikes — tracked from Dubai to your port.
          </motion.p>

          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="show"
            className="flex flex-wrap gap-3 mb-12"
          >
            <Link
              href="/browse"
              className="inline-flex items-center gap-2 text-sm font-semibold px-7 h-12 rounded-xl transition-opacity hover:opacity-90"
              style={{ backgroundColor: "#9A8174", color: "#FBFFF4" }}
            >
              Browse inventory <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/register?role=seller"
              className="inline-flex items-center gap-2 text-sm font-semibold px-7 h-12 rounded-xl border transition-all hover:border-[#9A8174] hover:text-[#9A8174]"
              style={{ borderColor: "#3B3B3B", color: "#FBFFF4" }}
            >
              List as exporter
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4} variants={fadeUp} initial="hidden" animate="show"
            className="flex items-center gap-10"
          >
            {[
              { value: "UAE only", label: "Verified exporters" },
              { value: "15+",      label: "African ports" },
              { value: "100%",     label: "VIN tracked" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl font-black" style={{ color: "#9A8174" }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(251,255,244,0.35)" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — full-bleed image slideshow */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex-1 min-w-0 relative py-[5vh] pr-[3vw]"
        >
          <CarCarousel />
        </motion.div>
      </div>

      {/* Bottom search bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-8 md:mx-14 mb-10"
      >
        <div
          className="rounded-2xl px-6 py-4 flex flex-wrap md:flex-nowrap items-center gap-4 border"
          style={{ backgroundColor: "#0D0B0E", borderColor: "#3B3B3B" }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-[140px]">
            <Car className="h-4 w-4 shrink-0" style={{ color: "#9A8174" }} />
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(251,255,244,0.35)" }}>Type</div>
              <select className="text-sm font-medium outline-none cursor-pointer mt-0.5" style={{ backgroundColor: "transparent", color: "#FBFFF4" }}>
                <option value="">All vehicles</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>
          </div>

          <div className="w-px h-8 hidden md:block" style={{ backgroundColor: "#3B3B3B" }} />

          <div className="flex items-center gap-3 flex-1 min-w-[160px]">
            <MapPin className="h-4 w-4 shrink-0" style={{ color: "#9A8174" }} />
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(251,255,244,0.35)" }}>Destination</div>
              <select className="text-sm font-medium outline-none cursor-pointer mt-0.5" style={{ backgroundColor: "transparent", color: "#FBFFF4" }}>
                <option value="">Any country</option>
                {["Nigeria","Kenya","Ghana","South Africa","Ethiopia","Tanzania","Egypt","Morocco","Senegal","Ivory Coast"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-px h-8 hidden md:block" style={{ backgroundColor: "#3B3B3B" }} />

          <div className="flex items-center gap-3 flex-1 min-w-[160px]">
            <span className="text-sm font-bold shrink-0" style={{ color: "#9A8174" }}>$</span>
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(251,255,244,0.35)" }}>Max budget (USD)</div>
              <select className="text-sm font-medium outline-none cursor-pointer mt-0.5" style={{ backgroundColor: "transparent", color: "#FBFFF4" }}>
                <option value="">Any price</option>
                <option value="50000">Up to $50,000</option>
                <option value="100000">Up to $100,000</option>
                <option value="200000">Up to $200,000</option>
                <option value="500000">Up to $500,000</option>
              </select>
            </div>
          </div>

          <Link
            href="/browse"
            className="shrink-0 text-sm font-semibold px-8 py-3 rounded-xl transition-opacity hover:opacity-90"
            style={{ backgroundColor: "#9A8174", color: "#FBFFF4" }}
          >
            Search
          </Link>
        </div>
      </motion.div>

      {/* UAE ports strip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.0, duration: 0.6 }}
        className="px-8 md:px-14 pb-10 flex flex-wrap items-center gap-6 md:gap-10"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(251,255,244,0.2)" }}>Ships from</span>
        {["Jebel Ali", "Sharjah Port", "Port Rashid", "Abu Dhabi Port"].map((port) => (
          <span key={port} className="text-sm font-semibold tracking-wide" style={{ color: "rgba(251,255,244,0.2)" }}>
            {port}
          </span>
        ))}
      </motion.div>

    </section>
  );
}
