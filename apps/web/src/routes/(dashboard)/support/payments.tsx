import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  Search,
  Filter,
  Download,
  Eye,
  AlertTriangle,
  CheckCircle2,
  Clock,
  CreditCard,
  ArrowUpDown,
  Calendar,
  User,
  DollarSign,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import SupportLayout from "@/layout/SupportLayout";

const paymentIssues = [
  {
    id: "PAY-001",
    user: "John Doe",
    email: "john@example.com",
    amount: "$250.00",
    issue: "Payment declined",
    status: "investigating",
    date: "2024-01-20",
    priority: "high",
    transactionId: "TXN-12345",
  },
  {
    id: "PAY-002",
    user: "Sarah Smith",
    email: "sarah@example.com",
    amount: "$1,500.00",
    issue: "Duplicate charge",
    status: "resolved",
    date: "2024-01-20",
    priority: "medium",
    transactionId: "TXN-12346",
  },
  {
    id: "PAY-003",
    user: "Mike Johnson",
    email: "mike@example.com",
    amount: "$75.50",
    issue: "Refund not processed",
    status: "pending",
    date: "2024-01-19",
    priority: "medium",
    transactionId: "TXN-12347",
  },
  {
    id: "PAY-004",
    user: "Emily Davis",
    email: "emily@example.com",
    amount: "$3,200.00",
    issue: "Account frozen during payment",
    status: "investigating",
    date: "2024-01-19",
    priority: "high",
    transactionId: "TXN-12348",
  },
];

const stats = [
  { label: "Total Issues", value: "47", icon: AlertTriangle, color: "amber" },
  { label: "Resolved Today", value: "12", icon: CheckCircle2, color: "emerald" },
  { label: "Pending Review", value: "8", icon: Clock, color: "blue" },
  { label: "High Priority", value: "5", icon: AlertTriangle, color: "red" },
];

export const Route = createFileRoute("/(dashboard)/support/payments")({
  component: SupportPayments,
});

function SupportPayments() {
  return (
    <SupportLayout>
      <div className="min-h-screen bg-background">
        <main className="mx-auto space-y-8 px-6 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-3xl font-bold tracking-tight">Payment Issues</h1>
            <p className="text-muted-foreground mt-1">
              Manage and resolve customer payment-related issues.
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + index * 0.05 }}
              >
                <Card className="bg-card/50 backdrop-blur-sm border-border/50">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">{stat.label}</p>
                        <p className="text-2xl font-bold">{stat.value}</p>
                      </div>
                      <div className={`h-12 w-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}>
                        <stat.icon className={`h-6 w-6 text-${stat.color}-400`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                      <Input
                        placeholder="Search by user, email, or transaction ID..."
                        className="pl-10 bg-muted/50"
                      />
                    </div>
                  </div>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="investigating">Investigating</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Priority</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button variant="outline" size="sm">
                    <Calendar className="h-4 w-4 mr-2" />
                    Date Range
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Payment Issues Table */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Payment Issues</CardTitle>
                <CardDescription>Customer payment problems requiring support attention</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Issue ID</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Issue</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paymentIssues.map((issue) => (
                      <TableRow key={issue.id}>
                        <TableCell className="font-mono text-sm">{issue.id}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{issue.user}</div>
                            <div className="text-sm text-muted-foreground">{issue.email}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{issue.amount}</TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{issue.issue}</div>
                            <div className="text-sm text-muted-foreground font-mono">{issue.transactionId}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              issue.status === "resolved"
                                ? "default"
                                : issue.status === "investigating"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {issue.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              issue.priority === "high"
                                ? "destructive"
                                : issue.priority === "medium"
                                ? "default"
                                : "secondary"
                            }
                          >
                            {issue.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>{issue.date}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <User className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </SupportLayout>
  );
}
