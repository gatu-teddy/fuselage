import { HeroSection } from "@/components/hero/hero-section";
import Link from "next/link";
import { Shield, FileCheck, Truck, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* Hero — contains its own nav */}
      <HeroSection />

      {/* Vehicle categories */}
      <section className="py-24 px-8 md:px-14 border-t border-border">
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
              { cat: "American Muscle", examples: "Dodge · Cadillac Escalade · Ford F-Series", icon: "💪" },
              { cat: "Heavy Trucks", examples: "RAM TRX · Silverado · F-450", icon: "🛻" },
              { cat: "Premium Bikes", examples: "Ducati · Harley-Davidson · BMW Motorrad", icon: "🏍️" },
            ].map(({ cat, examples, icon }) => (
              <Link key={cat} href="/browse">
                <div className="group bg-card border border-border rounded-xl p-5 hover:border-primary/40 transition-all cursor-pointer">
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
      <section className="py-24 px-8 md:px-14 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-16">
            <div className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Process</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How it works</h2>
            <p className="text-muted-foreground mt-2">Simple, transparent, fully tracked</p>
          </div>
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <div className="inline-flex items-center gap-2 border border-primary/30 bg-primary/5 rounded-full px-3 py-1 text-xs text-primary font-medium mb-8">For buyers</div>
              <div className="space-y-8">
                {[
                  { n: "01", title: "Browse verified inventory", body: "Filter by make, model, price, and destination port. Every listing is from a UAE-licensed importer." },
                  { n: "02", title: "Send an inquiry", body: "Contact the exporter directly. No WhatsApp strangers, no middlemen." },
                  { n: "03", title: "Agree on terms", body: "Negotiate price and shipping on the platform. Everything is logged." },
                  { n: "04", title: "Track to delivery", body: "Wire your payment, upload the receipt. Tracked all the way to your port." },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5">
                    <div className="text-primary font-black text-2xl w-10 shrink-0">{n}</div>
                    <div>
                      <div className="font-semibold mb-1">{title}</div>
                      <div className="text-sm text-muted-foreground leading-relaxed">{body}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-2 border border-border rounded-full px-3 py-1 text-xs text-muted-foreground font-medium mb-8">For exporters</div>
              <div className="space-y-8">
                {[
                  { n: "01", title: "Apply to list", body: "Submit your UAE trade license. We verify every exporter manually." },
                  { n: "02", title: "List your inventory", body: "Add vehicles with photos, specs, VIN, FOB pricing, and shipping availability." },
                  { n: "03", title: "Receive qualified leads", body: "Serious buyers only. Respond and negotiate in one place." },
                  { n: "04", title: "Close the deal", body: "Confirm payment and update shipment tracking. Build your verified history." },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-5">
                    <div className="text-muted-foreground/40 font-black text-2xl w-10 shrink-0">{n}</div>
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
      <section className="py-24 px-8 md:px-14 border-t border-border">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Why Fuselage</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built on trust</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: "Verified exporters only", body: "Every seller submits their UAE trade license and is manually reviewed before listing." },
              { icon: FileCheck, title: "VIN on every listing", body: "Chassis numbers visible before you inquire. No mystery vehicles." },
              { icon: Truck, title: "Tracked deals", body: "From your first inquiry to the car arriving at your port — every step is logged." },
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
      <section className="py-24 px-8 md:px-14 border-t border-border bg-card/30">
        <div className="max-w-7xl mx-auto">
          <div className="mb-10">
            <div className="text-xs text-primary font-medium uppercase tracking-widest mb-3">Destinations</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Shipping to Africa</h2>
            <p className="text-muted-foreground mt-2">Our exporters ship to major ports across the continent</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {["Lagos (Apapa)","Lagos (Tin Can)","Mombasa","Tema (Accra)","Durban","Cape Town","Dar es Salaam","Alexandria","Casablanca","Dakar","Abidjan","Douala","Port Harcourt"].map((port) => (
              <div key={port} className="flex items-center gap-1.5 border border-border rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:border-primary/40 hover:text-foreground transition-colors">
                <MapPin className="h-3 w-3 text-primary" />
                {port}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 px-8 md:px-14 border-t border-border relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Ready to import<br /><span className="text-primary">the right way?</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-10 max-w-xl mx-auto">
            Join the platform built for serious buyers and verified UAE exporters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/browse" className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold text-base px-10 h-12 rounded-xl hover:bg-primary/90 transition-colors">
              Browse vehicles
            </Link>
            <Link href="/register?role=seller" className="inline-flex items-center justify-center gap-2 border border-border text-foreground font-semibold text-base px-10 h-12 rounded-xl hover:border-primary/50 hover:text-primary transition-colors">
              Apply as exporter
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-10 px-8 md:px-14">
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
