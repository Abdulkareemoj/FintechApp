import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { UserPlus, Link2, Target, BarChart3, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/home")({
  component: LandingPage,
});

function LandingPage() {
      const steps = [
    {
      number: "01",
      icon: UserPlus,
      title: "Create your account",
      description: "Sign up in seconds with just your email. No credit card required, no hidden fees.",
    },
    {
      number: "02",
      icon: Link2,
      title: "Connect your accounts",
      description: "Securely link your bank accounts, credit cards, and investments. We support over 10,000 institutions.",
    },
    {
      number: "03",
      icon: Target,
      title: "Set your goals",
      description: "Whether it's saving for a vacation, paying off debt, or building an emergency fund—we'll help you get there.",
    },
    {
      number: "04",
      icon: BarChart3,
      title: "Watch your progress",
      description: "Get personalized insights, smart alerts, and beautiful visualizations of your financial journey.",
    },
  ];
  return (
    <LandingLayout>
      
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-3xl mx-auto"
            >
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                How <span className="italic-accent">Finova</span> works
              </h1>
              <p className="text-lg text-muted-foreground">
                From signup to financial freedom in four simple steps. No complexity, no confusion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Steps */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className={`flex flex-col md:flex-row items-center gap-8 mb-16 last:mb-0 ${
                    index % 2 === 1 ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Number and Icon */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                      <step.icon className="w-12 h-12 text-primary" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold flex items-center justify-center text-sm">
                      {step.number}
                    </div>
                  </div>

                  {/* Content */}
                  <div className={`text-center md:text-left ${index % 2 === 1 ? "md:text-right" : ""}`}>
                    <h3 className="text-2xl font-bold text-foreground mb-3">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-md">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-gradient-cta">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
                Ready to get started?
              </h2>
              <p className="text-primary-foreground/80 mb-8">
                Join over 500,000 users who trust Finova with their finances.
              </p>
              <Button
                size="xl"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link to="/signup">
                  Create free account
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
     
    </LandingLayout>
  );
}
