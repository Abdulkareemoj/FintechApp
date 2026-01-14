import { createFileRoute, Link } from "@tanstack/react-router";
import { LandingLayout } from "@/layout/LandingLayout";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Shield, Lock, Eye, Server, CheckCircle, ArrowRight } from "lucide-react";
import securityShield from "../../../public/security-shield.png";  
export const Route = createFileRoute("/(landing)/pricing")({
  component: PricingPage,
});

function PricingPage() {
      const features = [
    {
      icon: Lock,
      title: "256-bit Encryption",
      description: "All data is encrypted in transit and at rest using bank-level encryption standards.",
    },
    {
      icon: Eye,
      title: "Biometric Authentication",
      description: "Secure your account with Face ID, Touch ID, or fingerprint authentication.",
    },
    {
      icon: Server,
      title: "SOC 2 Type II Certified",
      description: "Our security practices are regularly audited by independent third parties.",
    },
    {
      icon: Shield,
      title: "Fraud Protection",
      description: "Advanced AI-powered fraud detection monitors for suspicious activity 24/7.",
    },
  ];

  const certifications = [
    "SOC 2 Type II",
    "GDPR Compliant",
    "CCPA Compliant",
    "PCI DSS Level 1",
    "ISO 27001",
  ];
  return (
    <LandingLayout>
    
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 lg:py-28 bg-gradient-hero">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
                  Your <span className="italic-accent">security</span> is our priority
                </h1>
                <p className="text-lg text-muted-foreground mb-8">
                  We protect your financial data with the same level of security used by major banks and financial institutions worldwide.
                </p>
                <Button variant="hero" size="lg" asChild>
                  <Link to="/signup">
                    Start secure banking
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex justify-center"
              >
                <motion.img
                  src={securityShield}
                  alt="Security shield"
                  className="w-48 lg:w-72"
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Security Features */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-16"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Enterprise-grade <span className="italic-accent">protection</span>
              </h2>
              <p className="text-muted-foreground">
                Multiple layers of security to keep your money and data safe.
              </p>
            </motion.div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card rounded-2xl p-6 shadow-card text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Certifications */}
        <section className="py-20 bg-secondary/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
                Trusted & <span className="italic-accent">certified</span>
              </h2>
            </motion.div>
            <div className="flex flex-wrap justify-center gap-4">
              {certifications.map((cert, index) => (
                <motion.div
                  key={cert}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-6 py-3 bg-card rounded-full shadow-sm"
                >
                  <CheckCircle className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">{cert}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Security Promise */}
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-cta rounded-3xl p-8 lg:p-16 text-center"
            >
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-6">
                Our Security Promise
              </h2>
              <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
                If unauthorized transactions occur due to a security breach on our end, we guarantee 100% reimbursement. Your trust is our most valuable asset.
              </p>
              <Button
                size="xl"
                className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                asChild
              >
                <Link to="/contact">Learn more</Link>
              </Button>
            </motion.div>
          </div>
        </section>
      </main>
       </LandingLayout>
  );
}
