import { createFileRoute } from "@tanstack/react-router";
import {
  CheckCircle2,
  Clock,
  CreditCard,
  Droplets,
  Flame,
  Phone,
  Receipt,
  Search,
  Tv,
  Wifi,
  Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/layout/DashboardLayout";

const billCategories = [
  {
    icon: Zap,
    label: "Electricity",
    color: "bg-yellow-500/10 text-yellow-500",
  },
  { icon: Droplets, label: "Water", color: "bg-blue-500/10 text-blue-500" },
  { icon: Flame, label: "Gas", color: "bg-orange-500/10 text-orange-500" },
  { icon: Wifi, label: "Internet", color: "bg-primary/10 text-primary" },
  { icon: Phone, label: "Phone", color: "bg-green-500/10 text-green-500" },
  { icon: Tv, label: "TV & Cable", color: "bg-purple-500/10 text-purple-500" },
  {
    icon: CreditCard,
    label: "Insurance",
    color: "bg-pink-500/10 text-pink-500",
  },
  { icon: Receipt, label: "Other", color: "bg-muted text-muted-foreground" },
];

const upcomingBills = [
  {
    id: "1",
    name: "Electric Company",
    category: "Electricity",
    amount: 145.5,
    dueDate: "2024-07-25",
    status: "due",
  },
  {
    id: "2",
    name: "Comcast Internet",
    category: "Internet",
    amount: 89.99,
    dueDate: "2024-07-28",
    status: "due",
  },
  {
    id: "3",
    name: "AT&T Mobile",
    category: "Phone",
    amount: 75.0,
    dueDate: "2024-08-01",
    status: "upcoming",
  },
];

const paidBills = [
  {
    id: "4",
    name: "Water Utility",
    category: "Water",
    amount: 45.0,
    paidDate: "2024-07-15",
    status: "paid",
  },
  {
    id: "5",
    name: "Netflix",
    category: "TV & Cable",
    amount: 19.99,
    paidDate: "2024-07-10",
    status: "paid",
  },
  {
    id: "6",
    name: "Gas Company",
    category: "Gas",
    amount: 65.0,
    paidDate: "2024-07-05",
    status: "paid",
  },
];

export const Route = createFileRoute("/(dashboard)/dashboard/bills")({
  component: BillsPage,
});

function BillsPage() {
  const totalDue = upcomingBills
    .filter((b) => b.status === "due")
    .reduce((sum, b) => sum + b.amount, 0);
  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-6 px-6 py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="gap-4 pb-4 md:flex-row md:items-center"
            initial={{ opacity: 0, y: 10 }}
          >
            <h1 className="font-bold text-3xl tracking-tight">
              Bills & Utilities
            </h1>
            <p className="mt-1 text-muted-foreground">
              Pay your bills and manage recurring payments
            </p>
          </motion.div>

          {/* Bill Categories */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50 bg-card-gradient shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Pay a Bill</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-4 md:grid-cols-8">
                  {billCategories.map((category) => (
                    <motion.button
                      className="flex flex-col items-center gap-2 rounded-xl p-4 transition-colors hover:bg-accent/50"
                      key={category.label}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className={`rounded-xl p-3 ${category.color}`}>
                        <category.icon className="h-5 w-5" />
                      </div>
                      <span className="text-center font-medium text-xs">
                        {category.label}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Upcoming Bills */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-2"
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardHeader className="flex flex-row items-center justify-between pb-4">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <Clock className="h-5 w-5 text-warning" />
                      Upcoming Bills
                    </CardTitle>
                    <p className="mt-1 text-muted-foreground text-sm">
                      Total due:{" "}
                      <span className="font-semibold text-warning">
                        ${totalDue.toFixed(2)}
                      </span>
                    </p>
                  </div>
                  <div className="relative hidden w-64 md:block">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="bg-muted/50 pl-10"
                      placeholder="Search bills..."
                    />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingBills.map((bill, index) => (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-xl bg-accent/30 p-4 transition-colors hover:bg-accent/50"
                      initial={{ opacity: 0, x: -10 }}
                      key={bill.id}
                      transition={{ delay: 0.2 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-xl p-3 ${bill.status === "due" ? "bg-warning/10" : "bg-muted"}`}
                        >
                          <Receipt
                            className={`h-5 w-5 ${bill.status === "due" ? "text-warning" : "text-muted-foreground"}`}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{bill.name}</p>
                          <p className="text-muted-foreground text-sm">
                            Due: {new Date(bill.dueDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="number-display font-semibold">
                            ${bill.amount.toFixed(2)}
                          </p>
                          <Badge
                            className="text-xs"
                            variant={
                              bill.status === "due"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {bill.status === "due" ? "Due Soon" : "Upcoming"}
                          </Badge>
                        </div>
                        <Button className="bg-primary-gradient" size="sm">
                          Pay Now
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment History */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                    Recently Paid
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {paidBills.map((bill, index) => (
                    <motion.div
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center justify-between rounded-lg p-3 transition-colors hover:bg-accent/30"
                      initial={{ opacity: 0, x: 10 }}
                      key={bill.id}
                      transition={{ delay: 0.3 + index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-success/10 p-2">
                          <CheckCircle2 className="h-4 w-4 text-success" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{bill.name}</p>
                          <p className="text-muted-foreground text-xs">
                            Paid {new Date(bill.paidDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <p className="number-display font-medium text-sm">
                        ${bill.amount.toFixed(2)}
                      </p>
                    </motion.div>
                  ))}
                  <Button className="w-full text-primary" variant="ghost">
                    View All History
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  );
}
