import { createFileRoute } from "@tanstack/react-router";
import { Activity, CreditCard, DollarSign, Users } from "lucide-react";
import { motion } from "motion/react";

import { AccountsList } from "@/components/user-dashboard/AccountsList";
import { BalanceCard } from "@/components/user-dashboard/BalanceCard";
import { KPICard } from "@/components/user-dashboard/KPICard";
import { QuickActions } from "@/components/user-dashboard/QuickActions";
import { SpendingChart } from "@/components/user-dashboard/SpendingChart";
import { TransactionsTable } from "@/components/user-dashboard/TransactionsTable";
import DashboardLayout from "@/layout/DashboardLayout";

export const Route = createFileRoute("/(dashboard)/dashboard/")({
  component: DashboardPage,
});

const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    changeType: "positive" as const,
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    change: "+180.1%",
    changeType: "positive" as const,
    icon: Users,
    description: "from last month",
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19%",
    changeType: "positive" as const,
    icon: CreditCard,
    description: "from last month",
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+201",
    changeType: "positive" as const,
    icon: Activity,
    description: "since last hour",
  },
];

const transactions = [
  {
    id: "1",
    name: "Starbucks",
    email: "coffee@starbucks.com",
    amount: 15.0,
    status: "processing" as const,
    date: "2024-07-20",
    type: "outgoing" as const,
  },
  {
    id: "2",
    name: "Amazon",
    email: "prime@amazon.com",
    amount: 120.5,
    status: "completed" as const,
    date: "2024-07-19",
    type: "outgoing" as const,
  },
  {
    id: "3",
    name: "Salary Deposit",
    email: "hr@acmeinc.com",
    amount: 5000.0,
    status: "completed" as const,
    date: "2024-07-18",
    type: "incoming" as const,
  },
  {
    id: "4",
    name: "Netflix",
    email: "billing@netflix.com",
    amount: 19.99,
    status: "completed" as const,
    date: "2024-07-17",
    type: "outgoing" as const,
  },
  {
    id: "5",
    name: "Freelance Payment",
    email: "client@freelance.co",
    amount: 800.0,
    status: "pending" as const,
    date: "2024-07-16",
    type: "incoming" as const,
  },
];

const accounts = [
  {
    id: "1",
    name: "Checking Account",
    type: "checking" as const,
    balance: 15_450.2,
    lastFour: "1234",
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings" as const,
    balance: 32_100.55,
    lastFour: "5678",
  },
  {
    id: "3",
    name: "Business Credit",
    type: "credit" as const,
    balance: -1200.0,
    lastFour: "9012",
  },
];

function DashboardPage() {
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-6 px-6 py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
          >
            <h1 className="font-bold text-3xl tracking-tight">
              Good morning, John 👋
            </h1>
            <p className="mt-1 text-muted-foreground">
              Here's what's happening with your finances today.
            </p>
          </motion.div>

          {/* Balance and Quick Actions Row */}
          <div className="mb-6 grid gap-6 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <BalanceCard totalBalance={totalBalance} />
            </div>
            <div className="lg:col-span-2">
              <QuickActions />
            </div>
          </div>

          {/* KPI Cards */}
          <div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {kpiData.map((kpi, index) => (
              <KPICard key={kpi.title} {...kpi} delay={0.1 + index * 0.05} />
            ))}
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-7">
            {/* Transactions Table */}
            <div className="lg:col-span-4">
              <TransactionsTable transactions={transactions} />
            </div>

            {/* Right Column */}
            <div className="space-y-6 lg:col-span-3">
              <AccountsList accounts={accounts} />
              <SpendingChart />
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
