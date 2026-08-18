import { Hero } from "@/components/home/Hero";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedTutors } from "@/components/home/FeaturedTutors";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <FeaturedTutors />
      <Testimonials />
      <CTASection />
    </>
  );
}
