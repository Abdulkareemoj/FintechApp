import { createFileRoute } from "@tanstack/react-router";
import MerchantLayout from "@/layout/MerchantLayout";
import { motion } from "motion/react";
import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  CheckCircle2,
  Clock,
  XCircle,
  MoreHorizontal,
  RefreshCw,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const payments = [
  { id: "PAY-78234", customer: "john.doe@example.com", amount: 149.99, method: "Visa ****4242", status: "completed", date: "2024-01-20 14:32" },
  { id: "PAY-78235", customer: "sarah.smith@company.co", amount: 89.00, method: "Mastercard ****8888", status: "completed", date: "2024-01-20 14:28" },
  { id: "PAY-78236", customer: "mike.johnson@business.io", amount: 299.99, method: "Apple Pay", status: "pending", date: "2024-01-20 14:15" },
  { id: "PAY-78237", customer: "anna.wilson@store.com", amount: 45.50, method: "Visa ****1234", status: "failed", date: "2024-01-20 14:08" },
  { id: "PAY-78238", customer: "david.brown@shop.net", amount: 199.00, method: "Google Pay", status: "completed", date: "2024-01-20 13:55" },
  { id: "PAY-78239", customer: "emma.davis@email.com", amount: 75.25, method: "Mastercard ****5555", status: "refunded", date: "2024-01-20 13:42" },
  { id: "PAY-78240", customer: "james.miller@corp.co", amount: 520.00, method: "Bank Transfer", status: "completed", date: "2024-01-20 13:30" },
  { id: "PAY-78241", customer: "olivia.garcia@web.io", amount: 34.99, method: "Visa ****9999", status: "pending", date: "2024-01-20 13:18" },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  completed: { color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", icon: <CheckCircle2 className="h-3.5 w-3.5" /> },
  pending: { color: "bg-amber-500/10 text-amber-400 border-amber-500/20", icon: <Clock className="h-3.5 w-3.5" /> },
  failed: { color: "bg-red-500/10 text-red-400 border-red-500/20", icon: <XCircle className="h-3.5 w-3.5" /> },
  refunded: { color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: <RefreshCw className="h-3.5 w-3.5" /> },
};

export const Route = createFileRoute("/(dashboard)/merchant/payments")({
  component: MerchantPayments,
});

function MerchantPayments() {
    const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch = payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      payment.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <MerchantLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">{/* Header */} <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground mt-1">View and manage all payment transactions.</p>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Today's Revenue", value: "$4,532.80", change: "+12%" },
          { label: "Successful", value: "156", change: "98.2%" },
          { label: "Pending", value: "8", change: "5.0%" },
          { label: "Failed", value: "3", change: "1.8%" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.05 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <span className="text-xs text-emerald-400">{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Payments Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader>
            <div className="flex flex-col md:flex-row gap-4 justify-between">
              <CardTitle className="text-lg font-semibold">All Payments</CardTitle>
              <div className="flex flex-wrap gap-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search payments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-64 bg-muted/50"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-36 bg-muted/50">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
                    <SelectItem value="refunded">Refunded</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon">
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50">
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPayments.map((payment) => (
                  <TableRow key={payment.id} className="border-border/50 hover:bg-muted/30">
                    <TableCell className="font-mono text-sm">{payment.id}</TableCell>
                    <TableCell>{payment.customer}</TableCell>
                    <TableCell className="text-muted-foreground">{payment.method}</TableCell>
                    <TableCell className="font-semibold">${payment.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`gap-1.5 ${statusConfig[payment.status].color}`}>
                        {statusConfig[payment.status].icon}
                        {payment.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{payment.date}</TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="bg-card border-border">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Refund
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" />
                            Download Receipt
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
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
