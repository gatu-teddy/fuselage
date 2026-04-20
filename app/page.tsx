import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Shield, Truck, FileCheck, ArrowRight, Star, MapPin } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <nav className="border-b px-6 py-4 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">F</span>
          </div>
          <span className="font-bold text-xl tracking-tight">Fuselage</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <Link href="/browse" className="hover:text-foreground transition-colors">Browse</Link>
          <Link href="/how-it-works" className="hover:text-foreground transition-colors">How it works</Link>
          <Link href="/for-exporters" className="hover:text-foreground transition-colors">For exporters</Link>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-6 pt-20 pb-16 text-center">
        <Badge variant="outline" className="mb-6 px-4 py-1.5 text-xs font-medium">
          UAE Import/Export × African Markets
        </Badge>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary leading-tight mb-6">
          Premium vehicles.<br />
          <span className="text-gold-500">Verified exporters.</span><br />
          Delivered to Africa.
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
          The only marketplace connecting vetted UAE import/export companies with serious buyers across Africa.
          No hobbyists. No second-hand listings. Just high-end cars and bikes from licensed businesses.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild className="text-base px-8">
            <Link href="/browse">
              Browse inventory <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild className="text-base px-8">
            <Link href="/register?role=seller">List as exporter</Link>
          </Button>
        </div>
      </section>

      {/* Trust bar */}
      <section className="bg-primary text-primary-foreground py-6">
        <div className="max-w-7xl mx-auto px-6 flex flex-wrap justify-center gap-8 text-sm">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-gold-400" />
            <span>Trade license verified exporters only</span>
          </div>
          <div className="flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-gold-400" />
            <span>Chassis numbers on every listing</span>
          </div>
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4 text-gold-400" />
            <span>Shipping to 15+ African ports</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold-400" />
            <span>Dubai & Sharjah based companies</span>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-3">How it works</h2>
          <p className="text-muted-foreground">Simple, transparent, tracked</p>
        </div>
        <div className="grid md:grid-cols-2 gap-16">
          {/* Buyer */}
          <div>
            <Badge className="mb-6">For buyers</Badge>
            <div className="space-y-6">
              {[
                { step: "01", title: "Browse verified inventory", desc: "Filter by make, model, price, availability, and destination port. Every listing is from a UAE-licensed importer." },
                { step: "02", title: "Send an inquiry", desc: "Contact the exporter directly through the platform. No middlemen, no WhatsApp strangers." },
                { step: "03", title: "Agree on terms", desc: "Negotiate price, shipping route, and timeline. Everything is logged on the platform." },
                { step: "04", title: "Upload payment proof", desc: "Wire transfer to the exporter's account. Upload your receipt — the platform tracks the deal to delivery." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="text-2xl font-bold text-gold-500 w-8 shrink-0">{step}</div>
                  <div>
                    <div className="font-semibold mb-1">{title}</div>
                    <div className="text-sm text-muted-foreground">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Seller */}
          <div>
            <Badge variant="outline" className="mb-6">For exporters</Badge>
            <div className="space-y-6">
              {[
                { step: "01", title: "Apply to list", desc: "Submit your UAE trade license and company details. We verify every exporter before they go live." },
                { step: "02", title: "List your inventory", desc: "Add vehicles with photos, specs, chassis numbers, prices, and shipping availability by port." },
                { step: "03", title: "Receive qualified inquiries", desc: "No time-wasters. Buyers on Fuselage are serious. Respond, negotiate, and agree on terms in one place." },
                { step: "04", title: "Mark deals complete", desc: "Confirm payment received and update shipment tracking. Build your verified deal history." },
              ].map(({ step, title, desc }) => (
                <div key={step} className="flex gap-4">
                  <div className="text-2xl font-bold text-primary/30 w-8 shrink-0">{step}</div>
                  <div>
                    <div className="font-semibold mb-1">{title}</div>
                    <div className="text-sm text-muted-foreground">{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vehicle categories */}
      <section className="bg-muted/40 py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-3">What we carry</h2>
            <p className="text-muted-foreground">High-end vehicles from Dubai and Sharjah's top exporters</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { cat: "Luxury Sedans", examples: "Mercedes S-Class, BMW 7 Series, Bentley Flying Spur", icon: "🚗" },
              { cat: "Super SUVs", examples: "Range Rover, Porsche Cayenne, Lamborghini Urus", icon: "🚙" },
              { cat: "Supercars", examples: "Ferrari, Lamborghini, McLaren, Aston Martin", icon: "🏎️" },
              { cat: "American Muscle", examples: "Dodge Challenger, Mustang GT500, Cadillac Escalade", icon: "💪" },
              { cat: "High-end Trucks", examples: "Ford F-450, RAM 1500 TRX, Chevy Silverado", icon: "🛻" },
              { cat: "Premium Bikes", examples: "Ducati, Harley-Davidson, BMW Motorrad, Triumph", icon: "🏍️" },
            ].map(({ cat, examples, icon }) => (
              <div key={cat} className="bg-white rounded-xl p-6 border hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{icon}</div>
                <div className="font-semibold mb-1">{cat}</div>
                <div className="text-xs text-muted-foreground">{examples}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ports */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">Shipping to Africa</h2>
          <p className="text-muted-foreground">Our exporters ship to major ports across the continent</p>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          {[
            "Lagos (Apapa)", "Lagos (Tin Can)", "Mombasa", "Tema (Accra)",
            "Durban", "Cape Town", "Dar es Salaam", "Alexandria",
            "Casablanca", "Dakar", "Abidjan", "Douala", "Port Harcourt",
          ].map((port) => (
            <div key={port} className="flex items-center gap-1.5 border rounded-full px-4 py-1.5 text-sm">
              <MapPin className="h-3 w-3 text-gold-500" />
              {port}
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-3xl mx-auto text-center px-6">
          <Star className="h-8 w-8 text-gold-400 mx-auto mb-4" />
          <h2 className="text-4xl font-bold mb-4">Ready to import smarter?</h2>
          <p className="text-primary-foreground/70 mb-8 text-lg">
            Join the platform built for serious buyers and verified UAE exporters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="gold" asChild className="text-base px-8">
              <Link href="/browse">Browse vehicles</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-base px-8 border-white/30 text-white hover:bg-white/10">
              <Link href="/register?role=seller">Apply as exporter</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-10 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">F</span>
            </div>
            <span className="font-semibold text-foreground">Fuselage</span>
            <span>© 2026</span>
          </div>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
            <Link href="/terms" className="hover:text-foreground">Terms</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
