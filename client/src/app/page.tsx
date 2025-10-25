import Navbar from "@/components/ui-elements/landing/navbar";
import Hero from "@/components/ui-elements/landing/Hero";
import { DashboardPreview } from "@/components/ui-elements/landing/DashboardPreview";
import { Features } from "@/components/ui-elements/landing/Features";
import { Benefits } from "@/components/ui-elements/landing/Benefits";
import { HowItWorks } from "@/components/ui-elements/landing/HowItWorks";
import { WhyAxomaSection } from "@/components/ui-elements/landing/WhyAxoma";
import Footer from "@/components/ui-elements/landing/footer";

export default function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <section id="hero">
        <Hero />
      </section>
      <DashboardPreview />
      <section id="features">
        <Features />
      </section>
      <section id="benefits">
        <Benefits />
      </section>
      <section id="how-it-works">
        <HowItWorks />
      </section>
      <section id="why-axoma">
        <WhyAxomaSection />
      </section>
      <Footer />
    </div>
  );
}
