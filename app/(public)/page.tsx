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
