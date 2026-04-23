"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Car } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.65, ease: "easeOut" as const },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.25, duration: 0.8, ease: "easeOut" as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: "#050206" }}>

      {/* Nav */}
      <nav className="relative z-50 flex items-center justify-between px-8 md:px-14 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#9A8174" }}>
            <span className="font-black text-sm" style={{ color: "#FBFFF4" }}>F</span>
          </div>
          <span className="font-bold text-lg tracking-tight" style={{ color: "#FBFFF4" }}>Fuselage</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm" style={{ color: "#9A8174" }}>
          {[
            { label: "Browse", href: "/browse" },
            { label: "How it works", href: "#how-it-works" },
            { label: "Destinations", href: "#ports" },
          ].map(({ label, href }) => (
            <Link key={label} href={href} className="hover:opacity-100 opacity-70 transition-opacity" style={{ color: "#FBFFF4" }}>
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="text-sm px-4 py-2 rounded-lg transition-colors"
            style={{ color: "#9A8174" }}
          >
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
      <div className="relative flex-1 flex items-center px-8 md:px-14 py-12 gap-10">

        {/* LEFT — text */}
        <div className="relative z-10 flex-1 max-w-xl">

          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium mb-6 border"
            style={{ borderColor: "#9A8174", color: "#9A8174", backgroundColor: "rgba(154,129,116,0.08)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#9A8174" }} />
            UAE Export × African Markets
          </motion.div>

          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1.02] mb-6"
            style={{ color: "#FBFFF4" }}
          >
            Looking to import a{" "}
            <span style={{ color: "#9A8174" }}>premium vehicle</span>{" "}
            from UAE?
          </motion.h1>

          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-base md:text-lg leading-relaxed mb-8 max-w-md"
            style={{ color: "rgba(251,255,244,0.55)" }}
          >
            Connect directly with verified UAE import/export companies.
            Browse luxury cars and high-end bikes — tracked from Dubai to your port.
          </motion.p>

          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
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
              className="inline-flex items-center gap-2 text-sm font-semibold px-7 h-12 rounded-xl border transition-colors"
              style={{ borderColor: "#3B3B3B", color: "#FBFFF4" }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = "#9A8174")}
              onMouseLeave={e => (e.currentTarget.style.borderColor = "#3B3B3B")}
            >
              List as exporter
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center gap-10"
          >
            {[
              { value: "UAE only", label: "Verified exporters" },
              { value: "15+", label: "African ports" },
              { value: "100%", label: "VIN tracked" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl font-black" style={{ color: "#9A8174" }}>{value}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(251,255,244,0.4)" }}>{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — car placeholder */}
        <div className="relative flex-1 flex items-center justify-center min-h-[420px]">

          {/* Taupe blob behind car */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.9, ease: "easeOut" }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[460px] h-[360px] rounded-[60px] rotate-6"
            style={{ backgroundColor: "rgba(154,129,116,0.12)" }}
          />

          {/* Accent rings */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="absolute right-6 top-14 w-16 h-16 rounded-full border"
            style={{ borderColor: "rgba(154,129,116,0.2)" }}
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="absolute left-6 bottom-10 w-10 h-10 rounded-full border"
            style={{ borderColor: "rgba(154,129,116,0.15)" }}
          />

          {/* Car */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="show"
            className="relative z-10 w-full max-w-[560px]"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut" }}
            >
              {/* Placeholder */}
              <div
                className="w-full aspect-[16/9] rounded-2xl flex flex-col items-center justify-center gap-4 relative overflow-hidden border"
                style={{ backgroundColor: "#0D0B0E", borderColor: "#3B3B3B" }}
              >
                {/* Subtle grid */}
                <div className="absolute inset-0 opacity-[0.06]"
                  style={{
                    backgroundImage: `linear-gradient(#9A8174 1px, transparent 1px), linear-gradient(90deg, #9A8174 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Ground line */}
                <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(154,129,116,0.4), transparent)" }} />

                <div className="relative z-10 flex flex-col items-center gap-3">
                  <Car className="h-24 w-24" style={{ color: "rgba(154,129,116,0.3)" }} strokeWidth={0.8} />
                  <span className="text-xs font-medium tracking-widest uppercase" style={{ color: "rgba(251,255,244,0.3)" }}>
                    Your vehicle here
                  </span>
                </div>

                {/* Corner accents */}
                {[
                  "top-3 left-3 border-l border-t rounded-tl-md",
                  "top-3 right-3 border-r border-t rounded-tr-md",
                  "bottom-3 left-3 border-l border-b rounded-bl-md",
                  "bottom-3 right-3 border-r border-b rounded-br-md",
                ].map((cls) => (
                  <div key={cls} className={`absolute w-5 h-5 ${cls}`} style={{ borderColor: "rgba(154,129,116,0.35)" }} />
                ))}
              </div>

              {/* Shadow */}
              <div className="mx-auto mt-3 w-3/4 h-3 rounded-full blur-xl" style={{ backgroundColor: "rgba(154,129,116,0.12)" }} />
            </motion.div>

            {/* Badge — Verified */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -top-4 -right-4 rounded-xl px-3 py-2 shadow-2xl flex items-center gap-2 border"
              style={{ backgroundColor: "#0D0B0E", borderColor: "#3B3B3B" }}
            >
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(154,129,116,0.15)" }}>
                <span className="text-xs" style={{ color: "#9A8174" }}>✓</span>
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: "#FBFFF4" }}>Verified Exporter</div>
                <div className="text-[10px]" style={{ color: "rgba(251,255,244,0.4)" }}>UAE Trade License</div>
              </div>
            </motion.div>

            {/* Badge — Ports */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 rounded-xl px-3 py-2 shadow-2xl flex items-center gap-2 border"
              style={{ backgroundColor: "#0D0B0E", borderColor: "#3B3B3B" }}
            >
              <MapPin className="h-4 w-4 shrink-0" style={{ color: "#9A8174" }} />
              <div>
                <div className="text-xs font-semibold" style={{ color: "#FBFFF4" }}>Ships to 15+ ports</div>
                <div className="text-[10px]" style={{ color: "rgba(251,255,244,0.4)" }}>Lagos · Mombasa · Durban</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Bottom search bar */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: "easeOut" }}
        className="relative z-10 mx-8 md:mx-14 mb-10"
      >
        <div className="rounded-2xl px-6 py-4 flex flex-wrap md:flex-nowrap items-center gap-4 border" style={{ backgroundColor: "#0D0B0E", borderColor: "#3B3B3B" }}>
          <div className="flex items-center gap-3 flex-1 min-w-[140px]">
            <Car className="h-4 w-4 shrink-0" style={{ color: "#9A8174" }} />
            <div>
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(251,255,244,0.4)" }}>Type</div>
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
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(251,255,244,0.4)" }}>Destination</div>
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
              <div className="text-[10px] uppercase tracking-wider" style={{ color: "rgba(251,255,244,0.4)" }}>Max budget (USD)</div>
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
        transition={{ delay: 1.2, duration: 0.6 }}
        className="px-8 md:px-14 pb-10 flex flex-wrap items-center gap-6 md:gap-10"
      >
        <span className="text-xs uppercase tracking-widest" style={{ color: "rgba(251,255,244,0.25)" }}>Ships from</span>
        {["Jebel Ali", "Sharjah Port", "Port Rashid", "Abu Dhabi Port"].map((port) => (
          <span key={port} className="text-sm font-semibold tracking-wide" style={{ color: "rgba(251,255,244,0.25)" }}>
            {port}
          </span>
        ))}
      </motion.div>

    </section>
  );
}
