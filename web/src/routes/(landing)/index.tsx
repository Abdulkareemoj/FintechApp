import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRightIcon,
  BarChart3,
  Bell,
  PiggyBank,
  Shield,
  Smartphone,
  TrendingUp,
  Wallet,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/")({ component: LandingPage });

function LandingPage() {
  return (
    <LandingLayout>
      <HeroSection />
      <TrustedBySection />
      <FeaturesSection />
      <StatsSection />
      <FeatureHighlightSection />
      <DarkFeaturesSection />
      <TestimonialSection />
      <CTASection />
    </LandingLayout>
  );
}

function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-background py-16 md:py-28">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-4 py-1.5 text-sm text-foreground shadow-xs">
              <span className="h-2 w-2 rounded-full bg-primary" />
              Trusted by 10,000+ businesses
            </div>
            <h1 className="font-extrabold text-4xl tracking-tight sm:text-5xl lg:text-6xl text-foreground">
              Smarter banking for
              <br />
              <span className="text-primary">modern businesses</span>
            </h1>
            <p className="max-w-lg text-lg text-muted-foreground sm:text-xl">
              Finova helps you manage payments, automate finances, and grow
              revenue — all from one powerful platform.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button asChild size="lg">
                <Link to="/signup">
                  Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/features">View Demo</Link>
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative"
          >
            <div className="absolute -inset-4 rounded-3xl bg-primary/10 blur-3xl" />
            <div className="relative rounded-2xl border-border bg-card p-4 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                    <div className="h-3 w-3 rounded-full bg-green-400" />
                    <div className="h-3 w-3 rounded-full bg-amber-400" />
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Dashboard Overview
                  </span>
                </div>
                <div className="flex gap-1">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                </div>
              </div>
              <div className="mb-4 grid grid-cols-3 gap-3">
                {[
                  { label: "Balance", value: "$48,250", up: true },
                  { label: "Revenue", value: "$12,380", up: true },
                  { label: "Expenses", value: "$3,940", up: false },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="rounded-lg bg-muted p-3"
                  >
                    <div className="text-[10px] text-muted-foreground">
                      {s.label}
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-sm text-foreground">
                      {s.value}
                      <span
                        className={
                          s.up ? "text-green-500" : "text-red-500"
                        }
                      >
                        {s.up ? "↑" : "↓"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Recent Transactions
                  </span>
                  <span className="text-primary font-medium">View all →</span>
                </div>
                {[
                  {
                    name: "Stripe",
                    date: "Today",
                    amount: "+$2,450",
                    up: true,
                  },
                  {
                    name: "AWS",
                    date: "Yesterday",
                    amount: "-$340",
                    up: false,
                  },
                  {
                    name: "Client Pay",
                    date: "2 days ago",
                    amount: "+$5,000",
                    up: true,
                  },
                ].map((t) => (
                  <div
                    key={t.name}
                    className="flex items-center justify-between rounded-lg px-2 py-1.5 transition-colors hover:bg-accent/10"
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-bold ${
                          t.up
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {t.name[0]}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-foreground">
                          {t.name}
                        </div>
                        <div className="text-[10px] text-muted-foreground">
                          {t.date}
                        </div>
                      </div>
                    </div>
                    <span
                      className={
                        t.up
                          ? "text-xs font-medium text-green-600"
                          : "text-xs font-medium text-foreground"
                      }
                    >
                      {t.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function TrustedBySection() {
  return (
    <section className="border-t border-border bg-card py-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="mb-6 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Trusted by innovative companies
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4 opacity-50 grayscale">
          {["TechCorp", "FinFlow", "DataSync", "CloudBase", "PayPro"].map(
            (name) => (
              <span
                key={name}
                className="font-bold text-lg tracking-tight text-foreground"
              >
                {name}
              </span>
            ),
          )}
        </div>
      </div>
    </section>
  );
}

const features = [
  {
    icon: Zap,
    title: "Instant Transfers",
    description:
      "Send and receive money in seconds, globally, with zero hidden fees.",
  },
  {
    icon: Shield,
    title: "Bank-Grade Security",
    description:
      "Your funds are protected with the latest encryption and fraud detection technology.",
  },
  {
    icon: TrendingUp,
    title: "Smart Analytics",
    description:
      "AI-powered insights help you track spending and save more effortlessly.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 space-y-4 text-center"
        >
          <span className="inline-block text-sm font-medium uppercase tracking-wider text-primary">
            Why Finova
          </span>
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl text-foreground">
            Built for modern finances
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We combine cutting-edge technology with a human-centric approach to
            redefine your financial experience.
          </p>
        </motion.div>
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="group space-y-4 border-0 bg-background p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold text-xl text-foreground">
                  {item.title}
                </h3>
                <p className="text-muted-foreground">{item.description}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const stats = [
  { value: "10M+", label: "Active Users" },
  { value: "99.9%", label: "Uptime Guarantee" },
  { value: "$5B+", label: "Processed" },
  { value: "24/7", label: "Support" },
];

function StatsSection() {
  return (
    <section className="bg-muted py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-2"
            >
              <p className="font-bold text-4xl text-primary">{stat.value}</p>
              <p className="font-medium text-muted-foreground text-sm">
                {stat.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const highlightFeatures = [
  {
    icon: Wallet,
    title: "Smart Budgeting",
    description:
      "Automatically categorize expenses and set smart budgets that adapt to your spending patterns.",
    color: "bg-primary/10",
  },
  {
    icon: PiggyBank,
    title: "Goal-Based Saving",
    description:
      "Create multiple savings goals and watch your progress with beautiful visualizations.",
    color: "bg-primary/10",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Detailed reports and insights that help you understand your financial behavior.",
    color: "bg-primary/10",
  },
  {
    icon: Smartphone,
    title: "Mobile-First",
    description:
      "A beautiful, intuitive mobile app that puts your finances at your fingertips.",
    color: "bg-primary/10",
  },
];

function FeatureHighlightSection() {
  return (
    <section className="bg-muted/50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <h2 className="font-bold text-3xl tracking-tight sm:text-4xl text-foreground">
            Everything you need to
            <br />
            <span className="text-primary">grow your business</span>
          </h2>
        </motion.div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {highlightFeatures.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="group rounded-2xl bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
            >
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${item.color}`}
              >
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

const darkFeatures = [
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "256-bit encryption, biometric authentication, and SOC 2 Type II compliance keep your data safe.",
  },
  {
    icon: Zap,
    title: "Real-Time Sync",
    description:
      "Connect to over 10,000 financial institutions with real-time transaction updates across all devices.",
  },
  {
    icon: Bell,
    title: "Smart Notifications",
    description:
      "Get proactive alerts for unusual activity, upcoming bills, and personalized financial insights.",
  },
];

function DarkFeaturesSection() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 text-center"
        >
          <span className="inline-block text-sm font-medium uppercase tracking-wider text-primary">
            Platform
          </span>
          <h2 className="mt-2 font-bold text-3xl tracking-tight sm:text-4xl text-foreground">
            Built for scale and security
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Our platform handles millions of transactions daily while keeping
            your data protected.
          </p>
        </motion.div>
        <div className="grid gap-6 md:grid-cols-3">
          {darkFeatures.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="rounded-2xl border border-border/50 bg-card p-6 backdrop-blur-sm transition-all hover:border-primary/30 hover:bg-card"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold text-lg text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialSection() {
  return (
    <section className="bg-card py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mb-8 flex justify-center gap-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="h-5 w-5 text-amber-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <blockquote className="text-xl leading-relaxed text-foreground sm:text-2xl">
            "Finova has completely transformed how we handle our finances. The
            platform is intuitive, secure, and the insights are invaluable."
          </blockquote>
          <div className="mt-6">
            <p className="font-semibold text-foreground">Sarah Mitchell</p>
            <p className="text-sm text-muted-foreground">
              CEO, TechVentures Inc.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-muted py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <Card className="border-0 bg-primary p-8 text-center text-primary-foreground shadow-xl md:p-12">
            <h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
              Ready to transform your finances?
            </h2>
            <p className="mt-4 text-lg opacity-90">
              Join thousands of businesses that trust Finova to manage their
              money smarter.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                className="bg-white text-primary hover:bg-white/90"
                size="lg"
              >
                <Link to="/signup">
                  Open Your Account{" "}
                  <ArrowRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border-2 border-white/30 text-white hover:bg-white/10"
                variant="outline"
              >
                <Link to="/features">Learn More</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
