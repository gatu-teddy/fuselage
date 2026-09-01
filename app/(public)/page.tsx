import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TrueWagon — Import Motorbikes Direct from Japan",
  description:
    "Browse verified Japanese exporters with live motorbike inventory. Every chassis checked, every deal documented — from Osaka to Mombasa, Lagos to Dar es Salaam.",
  openGraph: {
    title: "TrueWagon — Import Motorbikes Direct from Japan",
    description:
      "Verified exporters. Live inventory. Chassis-checked deals tracked from Japan to your African port.",
    url: "https://fuselage.vercel.app",
    siteName: "TrueWagon",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TrueWagon — Import Motorbikes Direct from Japan",
    description: "Verified Japanese exporters. Every chassis checked. Japan → Africa.",
  },
};

import { HeroSection }            from "@/components/sections/hero-section";
import { ServicesSection }         from "@/components/sections/services-section";
import { FeaturedVehicleSection }  from "@/components/sections/featured-vehicle-section";
import { HowItWorksSection }       from "@/components/sections/how-it-works-section";
import { ShippingPartnersSection } from "@/components/sections/shipping-partners-section";
import { DestinationsSection }     from "@/components/sections/destinations-section";
import { TrustStripSection }       from "@/components/sections/trust-strip-section";
import { CtaSection }              from "@/components/sections/cta-section";

export default function LandingPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <FeaturedVehicleSection />
      <HowItWorksSection />
      <ShippingPartnersSection />
      <DestinationsSection />
      <TrustStripSection />
      <CtaSection />
    </>
  );
}
