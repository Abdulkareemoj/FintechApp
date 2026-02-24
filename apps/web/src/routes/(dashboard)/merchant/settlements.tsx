import { createFileRoute } from "@tanstack/react-router";
import MerchantLayout from "@/layout/MerchantLayout";
import { motion } from "motion/react";
import {
  Wallet,
  Calendar,
  TrendingUp,
  Clock,
  CheckCircle2,
  ArrowUpRight,
  Download,
  BanknoteIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const settlements = [
  { id: "STL-2024-001", amount: 12450.80, fees: 124.51, net: 12326.29, status: "completed", date: "2024-01-19", bankAccount: "****4521" },
  { id: "STL-2024-002", amount: 8920.50, fees: 89.21, net: 8831.29, status: "completed", date: "2024-01-18", bankAccount: "****4521" },
  { id: "STL-2024-003", amount: 15680.00, fees: 156.80, net: 15523.20, status: "pending", date: "2024-01-20", bankAccount: "****4521" },
  { id: "STL-2024-004", amount: 6340.25, fees: 63.40, net: 6276.85, status: "completed", date: "2024-01-17", bankAccount: "****4521" },
  { id: "STL-2024-005", amount: 9875.60, fees: 98.76, net: 9776.84, status: "processing", date: "2024-01-20", bankAccount: "****4521" },
];

const upcomingSettlement = {
  amount: 15680.00,
  transactions: 234,
  expectedDate: "Jan 21, 2024",
  progress: 75,
};
export const Route = createFileRoute("/(dashboard)/merchant/settlements")({
  component: MerchantSettlements,
});

function MerchantSettlements() {
    const getStatusBadge = (status: string) => {
    const config: Record<string, string> = {
      completed: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
      pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
      processing: "bg-violet-500/10 text-violet-400 border-violet-500/20",
    };
    return config[status] || "";
  };
  return (
    <MerchantLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">{/* Header */}  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Settlements</h1>
        <p className="text-muted-foreground mt-1">Track your payouts and settlement history.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Available Balance", value: "$24,680.45", icon: Wallet, color: "violet" },
          { label: "Pending Settlement", value: "$15,680.00", icon: Clock, color: "amber" },
          { label: "This Month", value: "$89,234.50", icon: TrendingUp, color: "emerald" },
          { label: "Next Payout", value: "Jan 21", icon: Calendar, color: "blue" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className={`h-10 w-10 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-400`} />
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Upcoming Settlement */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-violet-500/10 to-purple-500/5 border-violet-500/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-xl bg-violet-500/20 flex items-center justify-center">
                  <BanknoteIcon className="h-7 w-7 text-violet-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Upcoming Settlement</h3>
                  <p className="text-sm text-muted-foreground">{upcomingSettlement.transactions} transactions • Expected {upcomingSettlement.expectedDate}</p>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-3xl font-bold">${upcomingSettlement.amount.toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Progress value={upcomingSettlement.progress} className="w-32 h-2" />
                    <span className="text-sm text-muted-foreground">{upcomingSettlement.progress}%</span>
                  </div>
                </div>
                <Button className="bg-violet-500 hover:bg-violet-600">
                  <ArrowUpRight className="h-4 w-4 mr-2" />
                  Request Early Payout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Settlement History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-semibold">Settlement History</CardTitle>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Settlement ID</TableHead>
                  <TableHead>Gross Amount</TableHead>
                  <TableHead>Fees</TableHead>
                  <TableHead>Net Amount</TableHead>
                  <TableHead>Bank Account</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {settlements.map((settlement) => (
                  <TableRow key={settlement.id} className="border-border/50 hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{settlement.id}</TableCell>
                    <TableCell>${settlement.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-red-400">-${settlement.fees.toFixed(2)}</TableCell>
                    <TableCell className="font-semibold text-emerald-400">${settlement.net.toLocaleString()}</TableCell>
                    <TableCell className="text-muted-foreground">{settlement.bankAccount}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getStatusBadge(settlement.status)}>
                        {settlement.status === "completed" && <CheckCircle2 className="h-3.5 w-3.5 mr-1" />}
                        {settlement.status === "pending" && <Clock className="h-3.5 w-3.5 mr-1" />}
                        {settlement.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{settlement.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </motion.div></main>
      </div>
    </MerchantLayout>
  );
}
