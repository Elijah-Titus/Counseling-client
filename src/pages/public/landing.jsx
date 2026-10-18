    import Hero from "../../features/landing/hero";
import FeatureStrip from "../../features/landing/feature-strip";
import ServicesSection from "../../features/landing/services-section";
import Testimonials from "../../features/landing/testimonials";
import CallToAction from "../../features/landing/call-to-action";

export default function Landing() {
  return (
    <>
      <Hero />
      <FeatureStrip />
      <ServicesSection />
      <Testimonials />
      <CallToAction />
    </>
  );
}