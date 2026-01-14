import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";  
import heroPhone from "/hero-phone.png";

const Hero = () => {
  const logos = ["Kinetic", "Grasshopper", "EatUp Eats", "Fusion & Co"];

  return (
    <section className="relative pt-24 lg:pt-32 pb-16 lg:pb-24 overflow-hidden bg-gradient-hero">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-primary text-sm font-medium mb-6"
            >
              <Sparkles className="w-4 h-4" />
              Smarter finance for changemakers
            </motion.div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
              Finance that{" "}
              <span className="italic-accent">works</span>
              <br />
              as hard as you do
            </h1>

            {/* Subheadline */}
            <p className="text-lg text-muted-foreground max-w-lg mx-auto lg:mx-0 mb-8">
              A seamless platform to track spending, set savings goals, and begin
              investing—all in one place. Take control today.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button variant="hero" size="lg" asChild>
                <Link to="/signup">
                  Get started
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
              <Button variant="hero-outline" size="lg" asChild>
                <Link to="/features">Explore features</Link>
              </Button>
            </div>

            {/* Trust Logos */}
            <div className="space-y-3">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">
                Built for real life, powered by smart finance
              </p>
              <div className="flex items-center justify-center lg:justify-start gap-6 flex-wrap">
                {logos.map((logo) => (
                  <span
                    key={logo}
                    className="text-sm font-medium text-muted-foreground/70"
                  >
                    {logo}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Content - Phone Mockup */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center lg:justify-end"
          >
            <div className="relative">
              <motion.img
                src={heroPhone}
                alt="Finova app dashboard"
                className="w-72 sm:w-80 lg:w-96 drop-shadow-2xl"
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
              {/* Decorative elements */}
              <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] rounded-full bg-blue-100/50 blur-3xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
