import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

import securityShield from "/security-shield.png";
import { Link } from "@tanstack/react-router";

const Security = () => {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card rounded-3xl p-8 lg:p-16 shadow-card overflow-hidden relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
                Compliant, Secure, and Always Reliable
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
                Bank-Level <span className="italic-accent">security</span> for your peace of mind
              </h2>
              <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
                Your data is encrypted with the highest standards, ensuring privacy and protection. Trusted by thousands of users worldwide, we prioritize the safety of your financial information.
              </p>
              <Button variant="hero" size="lg" asChild>
                <Link to="/security">Get started</Link>
              </Button>
            </motion.div>

            {/* Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex justify-center lg:justify-end"
            >
              <motion.img
                src={securityShield}
                alt="Security shield"
                className="w-48 lg:w-64 drop-shadow-2xl"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Security;
