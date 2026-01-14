import { motion } from "motion/react";
import { Wallet, PiggyBank, TrendingUp, Bell, ArrowUpRight, ArrowDownRight } from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: Wallet,
      title: "Budgeting",
      description: "Stay in control of your spending with smart tracking tools that categorize your expenses.",
      mockup: (
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-primary text-xs">★</span>
            </div>
            <span className="text-xs text-muted-foreground">63%</span>
          </div>
          <div className="text-2xl font-bold text-foreground mb-4">$550.00</div>
          <div className="text-xs text-muted-foreground mb-2">BALANCE $675.00</div>
          <div className="flex gap-2">
            {["Groceries", "Spa", "Shopping"].map((cat) => (
              <span key={cat} className="px-2 py-1 text-xs rounded-full bg-secondary text-secondary-foreground">
                {cat}
              </span>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: PiggyBank,
      title: "Saving",
      description: "Create personalized savings goals and automate the process. Reach your goals step-by-step.",
      mockup: (
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center justify-between mb-3">
            <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
              <ArrowUpRight className="w-3 h-3 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">$285.00</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Travel fund", amount: "$145.00" },
              { label: "Emergency", amount: "$62.00" },
              { label: "New phone", amount: "$49.00" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">{item.label}</span>
                <span className="text-foreground font-medium">{item.amount}</span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      icon: TrendingUp,
      title: "Investing",
      description: "Explore simple investment options tailored to your risk level. Start with just a few clicks.",
      mockup: (
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
              <span className="text-orange-600 font-bold text-xs">₿</span>
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">Bitcoin</div>
              <div className="text-xs text-muted-foreground">BTC</div>
            </div>
            <div className="ml-auto text-right">
              <div className="text-sm font-bold text-foreground">CA$30.46</div>
              <div className="text-xs text-green-600">↗ +30.02</div>
            </div>
          </div>
          <div className="h-12 bg-gradient-to-r from-green-100 to-green-50 rounded-lg flex items-end justify-around px-2">
            {[40, 60, 45, 80, 55, 70, 90].map((h, i) => (
              <div key={i} className="w-2 bg-green-500 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
          <div className="mt-2 inline-flex items-center gap-1 px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">
            <ArrowUpRight className="w-3 h-3" /> 5.30%
          </div>
        </div>
      ),
    },
    {
      icon: Bell,
      title: "Smart Alerts & Insights",
      description: "Get timely reminders, spending alerts, and financial tips to stay on top of your goals.",
      mockup: (
        <div className="bg-card rounded-2xl p-4 shadow-card">
          <div className="space-y-3">
            {[
              { icon: "📊", text: "Weekly spending report ready", time: "2m ago" },
              { icon: "🎯", text: "You're 80% to your savings goal!", time: "1h ago" },
              { icon: "⚠️", text: "Unusual transaction detected", time: "3h ago" },
            ].map((alert, i) => (
              <div key={i} className="flex items-start gap-3 p-2 rounded-lg bg-secondary/50">
                <span className="text-lg">{alert.icon}</span>
                <div className="flex-1">
                  <p className="text-xs text-foreground font-medium">{alert.text}</p>
                  <p className="text-xs text-muted-foreground">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ];

  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-2xl mx-auto mb-16"
        >
          <span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Powerful features for
            <br />
            <span className="italic-accent">smarter</span> financial decisions
          </h2>
          <p className="text-muted-foreground text-lg">
            Everything you need to take control of your finances—built to be simple, secure, and smart.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-10">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-secondary/30 rounded-3xl p-6 lg:p-8 hover:bg-secondary/50 transition-colors"
            >
              <div className="grid sm:grid-cols-2 gap-6 items-center">
                {/* Mockup */}
                <div className="order-2 sm:order-1">{feature.mockup}</div>

                {/* Content */}
                <div className="order-1 sm:order-2">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
