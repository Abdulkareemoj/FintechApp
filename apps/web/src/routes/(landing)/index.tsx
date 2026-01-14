import { createFileRoute } from '@tanstack/react-router'
import Hero from "@/components/landing/Hero";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import Security from "@/components/landing/Security";
import Testimonials from "@/components/landing/Testimonials";
import CTA from "@/components/landing/CTA";
import { LandingLayout } from '@/layout/LandingLayout';


export const Route = createFileRoute('/(landing)/')({ component: App })

function App() {


  return (
  <LandingLayout>
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Security />
        <Testimonials />
        <CTA />
      </main>
      </LandingLayout>
  );
}
