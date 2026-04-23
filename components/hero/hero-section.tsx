"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MapPin, Car, Bike } from "lucide-react";
import { Button } from "@/components/ui/button";

const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.6, ease: "easeOut" as const },
  }),
};

const fadeRight = {
  hidden: { opacity: 0, x: 60 },
  show: {
    opacity: 1,
    x: 0,
    transition: { delay: 0.3, duration: 0.8, ease: "easeOut" as const },
  },
};

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-background">

      {/* ── Nav ── */}
      <nav className="relative z-50 flex items-center justify-between px-8 md:px-14 pt-8">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-black text-sm">F</span>
          </div>
          <span className="font-bold text-lg tracking-tight">Fuselage</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          {["Browse", "How it works", "Destinations"].map((item) => (
            <Link key={item} href="#" className="hover:text-foreground transition-colors">
              {item}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="text-muted-foreground" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" className="font-semibold" asChild>
            <Link href="/register">Sign up</Link>
          </Button>
        </div>
      </nav>

      {/* ── Main split layout ── */}
      <div className="relative flex-1 flex items-center px-8 md:px-14 py-12 gap-10">

        {/* LEFT — text */}
        <div className="relative z-10 flex-1 max-w-xl">

          {/* Tag */}
          <motion.div
            custom={0}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-full px-4 py-1.5 text-xs text-primary font-medium mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            UAE Export × African Markets
          </motion.div>

          {/* Headline */}
          <motion.h1
            custom={1}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter leading-[1] mb-6"
          >
            Looking to import a{" "}
            <span className="text-primary">premium vehicle</span>{" "}
            from UAE?
          </motion.h1>

          {/* Subtext */}
          <motion.p
            custom={2}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="text-muted-foreground text-base md:text-lg leading-relaxed mb-8 max-w-md"
          >
            Connect directly with verified UAE import/export companies.
            Browse luxury cars and high-end bikes — tracked from Dubai to your port.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-wrap gap-3 mb-12"
          >
            <Button size="lg" className="font-semibold px-7 gap-2 h-12" asChild>
              <Link href="/browse">
                Browse inventory <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-7 h-12 border-border hover:border-primary/40 hover:text-primary"
              asChild
            >
              <Link href="/register?role=seller">List as exporter</Link>
            </Button>
          </motion.div>

          {/* Stats row */}
          <motion.div
            custom={4}
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex items-center gap-8"
          >
            {[
              { value: "UAE only", label: "Verified exporters" },
              { value: "15+", label: "African ports" },
              { value: "100%", label: "VIN tracked" },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="text-xl font-black text-primary">{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — car image */}
        <div className="relative flex-1 flex items-center justify-center min-h-[420px]">

          {/* Gold blob shape behind the car */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="absolute right-0 top-1/2 -translate-y-1/2 w-[480px] h-[380px] bg-primary/15 rounded-[60px] rotate-6"
          />

          {/* Smaller accent circle */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="absolute right-8 top-16 w-20 h-20 rounded-full border border-primary/20 bg-primary/5"
          />
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="absolute left-8 bottom-12 w-12 h-12 rounded-full border border-primary/15 bg-primary/5"
          />

          {/* Floating car placeholder */}
          <motion.div
            variants={fadeRight}
            initial="hidden"
            animate="show"
            className="relative z-10 w-full max-w-[560px]"
          >
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            >
              {/* Placeholder car graphic */}
              <div className="w-full aspect-[16/9] rounded-2xl bg-gradient-to-br from-secondary to-card border border-border flex flex-col items-center justify-center gap-4 relative overflow-hidden">

                {/* Grid lines for depth */}
                <div className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage: "linear-gradient(hsl(var(--border)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />

                {/* Ground reflection line */}
                <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

                {/* Car icon */}
                <div className="relative z-10 flex flex-col items-center gap-3">
                  <Car className="h-24 w-24 text-primary/40" strokeWidth={0.8} />
                  <div className="text-xs text-muted-foreground font-medium tracking-widest uppercase">
                    Your vehicle here
                  </div>
                  <div className="text-[10px] text-muted-foreground/50">
                    Replace with a real photo
                  </div>
                </div>

                {/* Corner accents */}
                <div className="absolute top-3 left-3 w-6 h-6 border-l border-t border-primary/30 rounded-tl-md" />
                <div className="absolute top-3 right-3 w-6 h-6 border-r border-t border-primary/30 rounded-tr-md" />
                <div className="absolute bottom-3 left-3 w-6 h-6 border-l border-b border-primary/30 rounded-bl-md" />
                <div className="absolute bottom-3 right-3 w-6 h-6 border-r border-b border-primary/30 rounded-br-md" />
              </div>

              {/* Drop shadow beneath car */}
              <div className="mx-auto mt-3 w-4/5 h-4 bg-primary/10 blur-xl rounded-full" />
            </motion.div>

            {/* Floating badge — exporter verified */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="absolute -top-4 -right-4 bg-card border border-border rounded-xl px-3 py-2 shadow-xl flex items-center gap-2"
            >
              <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary text-xs">✓</span>
              </div>
              <div>
                <div className="text-xs font-semibold">Verified Exporter</div>
                <div className="text-[10px] text-muted-foreground">UAE Trade License</div>
              </div>
            </motion.div>

            {/* Floating badge — destination */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: 1.1, duration: 0.5 }}
              className="absolute -bottom-4 -left-4 bg-card border border-border rounded-xl px-3 py-2 shadow-xl flex items-center gap-2"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <div>
                <div className="text-xs font-semibold">Ships to 15+ ports</div>
                <div className="text-[10px] text-muted-foreground">Lagos · Mombasa · Durban</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* ── Bottom search bar ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 mx-8 md:mx-14 mb-10"
      >
        <div className="bg-card border border-border rounded-2xl px-6 py-4 flex flex-wrap md:flex-nowrap items-center gap-4">
          {/* Type */}
          <div className="flex items-center gap-3 flex-1 min-w-[140px]">
            <Car className="h-4 w-4 text-primary shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Type</div>
              <select className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer mt-0.5">
                <option value="">All vehicles</option>
                <option value="car">Cars</option>
                <option value="bike">Bikes</option>
              </select>
            </div>
          </div>

          <div className="w-px h-8 bg-border hidden md:block" />

          {/* Destination */}
          <div className="flex items-center gap-3 flex-1 min-w-[160px]">
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Destination</div>
              <select className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer mt-0.5">
                <option value="">Any country</option>
                {["Nigeria","Kenya","Ghana","South Africa","Ethiopia","Tanzania","Uganda","Egypt","Morocco","Senegal"].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="w-px h-8 bg-border hidden md:block" />

          {/* Budget */}
          <div className="flex items-center gap-3 flex-1 min-w-[160px]">
            <span className="text-primary text-sm font-bold shrink-0">$</span>
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Max budget (USD)</div>
              <select className="bg-transparent text-sm font-medium text-foreground outline-none cursor-pointer mt-0.5">
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
            className="shrink-0 bg-primary text-primary-foreground font-semibold text-sm px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
          >
            Search
          </Link>
        </div>
      </motion.div>

      {/* ── Partner/brand logos bar ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="px-8 md:px-14 pb-10"
      >
        <div className="flex flex-wrap items-center gap-6 md:gap-10">
          <span className="text-xs text-muted-foreground/50 uppercase tracking-widest">Ships from</span>
          {["Jebel Ali", "Sharjah Port", "Port Rashid", "Abu Dhabi Port"].map((port) => (
            <span key={port} className="text-sm text-muted-foreground/40 font-semibold tracking-wide">
              {port}
            </span>
          ))}
        </div>
      </motion.div>

    </section>
  );
}
