import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Truck, FileCheck, MapPin, ChevronRight } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-sm">F</span>
            </div>
            <span className="font-bold text-lg tracking-tight">Fuselage</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
            <Link href="/browse" className="hover:text-foreground transition-colors">Browse</Link>
            <Link href="#how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
            <Link href="#ports" className="hover:text-foreground transition-colors">Destinations</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground" asChild>
              <Link href="/login">Sign in</Link>
            </Button>
            <Button size="sm" className="font-semibold" asChild>
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/5 rounded-full blur-[120px]" />
          <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-primary/3 rounded-full blur-[80px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          {/* Tag */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-full px-4 py-1.5 text-xs text-primary font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              UAE Export × African Markets
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-center text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-[0.9] mb-8">
            <span className="block text-foreground">Premium vehicles.</span>
            <span className="block text-primary">Verified exporters.</span>
            <span className="block text-foreground">Delivered.</span>
          </h1>

          <p className="text-center text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
            The only marketplace connecting licensed UAE import/export companies
            with serious buyers across Africa. No hobbyists. No second-hand listings.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
            <Button size="lg" className="text-base px-8 font-semibold gap-2 h-12" asChild>
              <Link href="/browse">
                Browse inventory <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-8 h-12 border-border hover:border-primary/50 hover:text-primary transition-colors" asChild>
              <Link href="/register?role=seller">Apply as exporter</Link>
            </Button>
          </div>

          {/* Trust stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {[
              { stat: "UAE only", label: "Licensed exporters" },
              { stat: "15+", label: "African ports" },
              { stat: "VIN visible", label: "On every listing" },
              { stat: "Deal tracked", label: "Inquiry to delivery" },
            ].map(({ stat, label }) => (
              <div key={label} className="bg-card px-6 py-5 text-center">
                <div className="text-primary font-bold text-lg">{stat}</div>
                <div className="text-muted-foreground text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vehicle categories */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Inventory</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What we carry</h2>
            <p className="text-muted-foreground mt-2">High-end vehicles from Dubai and Sharjah's top exporters</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { cat: "Luxury Sedans", examples: "Mercedes S-Class · BMW 7 Series · Bentley", icon: "🚗" },
              { cat: "Super SUVs", examples: "Range Rover · Porsche Cayenne · Lamborghini Urus", icon: "🚙" },
              { cat: "Supercars", examples: "Ferrari · McLaren · Aston Martin", icon: "🏎️" },
              { cat: "American Muscle", examples: "Dodge · Cadillac Escalade · Ford F-450", icon: "💪" },
              { cat: "Heavy Trucks", examples: "RAM TRX · Silverado · F-Series", icon: "🛻" },
              { cat: "Premium Bikes", examples: "Ducati · Harley-Davidson · BMW Motorrad", icon: "🏍️" },
            ].map(({ cat, examples, icon }) => (
              <Link key={cat} href={`/browse?type=${cat.toLowerCase().includes("bike") ? "bike" : "car"}`}>
                <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/40 hover:bg-card/80 transition-all cursor-pointer">
                  <div className="text-2xl mb-3">{icon}</div>
                  <div className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{cat}</div>
                  <div className="text-xs text-muted-foreground leading-relaxed">{examples}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 px-6 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Process</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="text-muted-foreground mt-2">Simple, transparent, fully tracked</p>
          </div>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Buyers */}
            <div>
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-full px-3 py-1 text-xs text-primary font-medium mb-8">
                For buyers
              </div>
              <div className="space-y-8">
                {[
                  { n: "01", title: "Browse verified inventory", body: "Filter by make, model, price, and destination port. Every listing is from a UAE-licensed importer." },
                  { n: "02", title: "Send an inquiry", body: "Contact the exporter directly through the platform. No WhatsApp strangers, no middlemen." },
                  { n: "03", title: "Agree on terms", body: "Negotiate price and shipping on the platform. Everything is logged." },
                  { n: "04", title: "Track to delivery", body: "Wire your payment, upload the receipt. The deal is tracked all the way to your port." },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5">
                    <div className="text-primary font-black text-2xl w-10 shrink-0 leading-tight">{n}</div>
                    <div>
                      <div className="font-semibold mb-1">{title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Exporters */}
            <div>
              <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground font-medium mb-8">
                For exporters
              </div>
              <div className="space-y-8">
                {[
                  { n: "01", title: "Apply to list", body: "Submit your UAE trade license. We verify every exporter before they go live on the platform." },
                  { n: "02", title: "List your inventory", body: "Add vehicles with photos, specs, VIN numbers, FOB pricing, and shipping availability by port." },
                  { n: "03", title: "Receive qualified leads", body: "Serious buyers only. Respond, negotiate, and agree on terms — all in one place." },
                  { n: "04", title: "Close the deal", body: "Confirm payment received and update shipment tracking. Build your verified deal history." },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5">
                    <div className="text-muted-foreground/40 font-black text-2xl w-10 shrink-0 leading-tight">{n}</div>
                    <div>
                      <div className="font-semibold mb-1">{title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust pillars */}
      <section className="py-24 px-6 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Why Fuselage</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built on trust</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Verified exporters only", body: "Every seller submits their UAE trade license and is manually reviewed before they can list a single vehicle." },
              { icon: FileCheck, title: "VIN on every listing", body: "Chassis numbers are visible before you inquire. No mystery vehicles, no altered odometers." },
              { icon: Truck, title: "Tracked deals", body: "From your first inquiry to the car arriving at your port — every step is logged and visible to both parties." },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="bg-card border border-border rounded-xl p-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <div className="font-semibold mb-2">{title}</div>
                <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ports */}
      <section id="ports" className="py-24 px-6 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Destinations</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shipping to Africa</h2>
            <p className="text-muted-foreground mt-2">Our exporters ship to major ports across the continent</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {[
              "Lagos (Apapa)", "Lagos (Tin Can)", "Mombasa", "Tema (Accra)",
              "Durban", "Cape Town", "Dar es Salaam", "Alexandria",
              "Casablanca", "Dakar", "Abidjan", "Douala", "Port Harcourt",
            ].map((port) => (
              <div key={port} className="flex items-center gap-1.5 border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
                <MapPin className="h-3 w-3 text-primary" />
                {port}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-6 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Ready to import<br />
            <span className="text-primary">the right way?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join the platform built for serious buyers and verified UAE exporters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-base px-10 h-12 font-semibold gap-2" asChild>
              <Link href="/browse">Browse vehicles <ArrowRight className="h-4 w-4" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="text-base px-10 h-12 border-border hover:border-primary/50 hover:text-primary" asChild>
              <Link href="/register?role=seller">Apply as exporter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-primary-foreground font-black text-xs">F</span>
            </div>
            <span className="font-bold text-sm">Fuselage</span>
            <span className="text-muted-foreground text-sm">© 2026</span>
          </div>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/contact" className="hover:text-foreground transition-colors">Contact</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
