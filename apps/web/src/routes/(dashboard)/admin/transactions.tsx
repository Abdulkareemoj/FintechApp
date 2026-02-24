import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  AlertTriangle,
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  CheckCircle,
  Clock,
  Download,
  Eye,
  Filter,
  Flag,
  MoreHorizontal,
  RefreshCw,
  Search,
  XCircle,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/transactions")({
  component: AdminTransactions,
});

interface Transaction {
  id: string;
  type: "incoming" | "outgoing";
  amount: number;
  currency: string;
  status: "completed" | "pending" | "failed" | "flagged";
  sender: { name: string; email: string };
  receiver: { name: string; email: string };
  timestamp: string;
  method: string;
  riskScore: number;
  flagReason?: string;
}

const mockTransactions: Transaction[] = [
  {
    id: "TXN-789456",
    type: "outgoing",
    amount: 15_000.0,
    currency: "USD",
    status: "flagged",
    sender: { name: "John Doe", email: "john@email.com" },
    receiver: { name: "Offshore Corp", email: "contact@offshore.com" },
    timestamp: "2024-03-15T14:32:00",
    method: "Wire Transfer",
    riskScore: 85,
    flagReason: "Large amount to high-risk region",
  },
  {
    id: "TXN-789457",
    type: "incoming",
    amount: 5250.0,
    currency: "USD",
    status: "completed",
    sender: { name: "ABC Company", email: "payments@abc.com" },
    receiver: { name: "Jane Smith", email: "jane@email.com" },
    timestamp: "2024-03-15T13:45:00",
    method: "ACH",
    riskScore: 12,
  },
  {
    id: "TXN-789458",
    type: "outgoing",
    amount: 890.5,
    currency: "USD",
    status: "completed",
    sender: { name: "Robert Johnson", email: "robert@email.com" },
    receiver: { name: "Amazon", email: "payments@amazon.com" },
    timestamp: "2024-03-15T12:20:00",
    method: "Card",
    riskScore: 5,
  },
  {
    id: "TXN-789459",
    type: "outgoing",
    amount: 25_000.0,
    currency: "USD",
    status: "pending",
    sender: { name: "Emily Brown", email: "emily@email.com" },
    receiver: { name: "Investment Ltd", email: "invest@company.com" },
    timestamp: "2024-03-15T11:15:00",
    method: "Wire Transfer",
    riskScore: 45,
  },
  {
    id: "TXN-789460",
    type: "incoming",
    amount: 1200.0,
    currency: "USD",
    status: "failed",
    sender: { name: "Unknown Sender", email: "unknown@temp.com" },
    receiver: { name: "Michael Wilson", email: "michael@email.com" },
    timestamp: "2024-03-15T10:05:00",
    method: "ACH",
    riskScore: 92,
    flagReason: "Sender verification failed",
  },
  {
    id: "TXN-789461",
    type: "outgoing",
    amount: 3500.0,
    currency: "USD",
    status: "flagged",
    sender: { name: "Sarah Davis", email: "sarah@email.com" },
    receiver: { name: "Crypto Exchange", email: "deposit@crypto.com" },
    timestamp: "2024-03-15T09:30:00",
    method: "Wire Transfer",
    riskScore: 78,
    flagReason: "Cryptocurrency transaction",
  },
];

const stats = [
  { title: "Today's Volume", value: "$4.2M", change: "+12.5%" },
  { title: "Total Transactions", value: "8,432", change: "+8.2%" },
  { title: "Flagged", value: "23", change: "-5.1%" },
  { title: "Pending Review", value: "15", change: "+2.3%" },
];

const statusColors = {
  completed: "border-success/50 text-success",
  pending: "border-warning/50 text-warning",
  failed: "border-destructive/50 text-destructive",
  flagged: "border-amber-500/50 text-amber-500",
};

function AdminTransactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");

  const filteredTransactions = mockTransactions.filter((tx) => {
    const matchesSearch =
      tx.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.sender.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receiver.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "flagged" && tx.status === "flagged") ||
      (activeTab === "pending" && tx.status === "pending");
    return matchesSearch && matchesStatus && matchesTab;
  });

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  const getRiskColor = (score: number) => {
    if (score < 30) return "text-success";
    if (score < 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <AdminLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-8 px-6 py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            initial={{ opacity: 0, y: -20 }}
          >
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                Transaction Monitoring
              </h1>
              <p className="text-muted-foreground">
                Real-time transaction oversight and fraud detection
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button size="sm" variant="outline">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 20 }}
                key={stat.title}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="border-border/50 bg-card-gradient">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-muted-foreground text-sm">
                          {stat.title}
                        </p>
                        <p className="mt-1 font-bold text-2xl">{stat.value}</p>
                      </div>
                      <ArrowLeftRight className="h-5 w-5 text-amber-500" />
                    </div>
                    <p className="mt-2 text-success text-xs">
                      {stat.change} from yesterday
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Transactions Table */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4, delay: 0.4 }}
          >
            <Card className="border-border/50 bg-card-gradient">
              <CardHeader>
                <Tabs
                  className="w-full"
                  onValueChange={setActiveTab}
                  value={activeTab}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <TabsList className="bg-muted/50">
                      <TabsTrigger value="all">All Transactions</TabsTrigger>
                      <TabsTrigger className="relative" value="flagged">
                        Flagged
                        <Badge className="ml-2 bg-amber-500/20 text-amber-500 hover:bg-amber-500/30">
                          2
                        </Badge>
                      </TabsTrigger>
                      <TabsTrigger value="pending">Pending Review</TabsTrigger>
                    </TabsList>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <div className="relative">
                        <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="w-full bg-muted/50 pl-10 sm:w-64"
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search transactions..."
                          value={searchQuery}
                        />
                      </div>
                      <Select
                        onValueChange={setStatusFilter}
                        value={statusFilter}
                      >
                        <SelectTrigger className="w-full bg-muted/50 sm:w-40">
                          <Filter className="mr-2 h-4 w-4" />
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Status</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="failed">Failed</SelectItem>
                          <SelectItem value="flagged">Flagged</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </Tabs>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-border/50 hover:bg-transparent">
                        <TableHead>Transaction ID</TableHead>
                        <TableHead>From → To</TableHead>
                        <TableHead>Method</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Risk Score</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTransactions.map((tx, index) => (
                        <motion.tr
                          animate={{ opacity: 1, x: 0 }}
                          className={`border-border/50 hover:bg-muted/30 ${
                            tx.status === "flagged" ? "bg-amber-500/5" : ""
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          key={tx.id}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.05,
                          }}
                        >
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {tx.type === "incoming" ? (
                                <ArrowDownLeft className="h-4 w-4 text-success" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-destructive" />
                              )}
                              <span className="font-mono text-sm">{tx.id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <p className="font-medium text-sm">
                                {tx.sender.name}
                              </p>
                              <p className="text-muted-foreground text-xs">
                                → {tx.receiver.name}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className="text-xs" variant="outline">
                              {tx.method}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={statusColors[tx.status]}
                              variant="outline"
                            >
                              {tx.status === "completed" && (
                                <CheckCircle className="mr-1 h-3 w-3" />
                              )}
                              {tx.status === "pending" && (
                                <Clock className="mr-1 h-3 w-3" />
                              )}
                              {tx.status === "failed" && (
                                <XCircle className="mr-1 h-3 w-3" />
                              )}
                              {tx.status === "flagged" && (
                                <Flag className="mr-1 h-3 w-3" />
                              )}
                              {tx.status}
                            </Badge>
                            {tx.flagReason && (
                              <p className="mt-1 max-w-37.5 truncate text-muted-foreground text-xs">
                                {tx.flagReason}
                              </p>
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-2 w-2 rounded-full ${
                                  tx.riskScore < 30
                                    ? "bg-success"
                                    : tx.riskScore < 60
                                      ? "bg-warning"
                                      : "bg-destructive"
                                }`}
                              />
                              <span
                                className={`font-medium ${getRiskColor(tx.riskScore)}`}
                              >
                                {tx.riskScore}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <span
                              className={`font-bold ${
                                tx.type === "incoming"
                                  ? "text-success"
                                  : "text-foreground"
                              }`}
                            >
                              {tx.type === "incoming" ? "+" : "-"}$
                              {tx.amount.toLocaleString()}
                            </span>
                            <p className="text-muted-foreground text-xs">
                              {tx.currency}
                            </p>
                          </TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {formatDate(tx.timestamp)}
                          </TableCell>
                          <TableCell className="text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button size="icon" variant="ghost">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="border-border bg-card"
                              >
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <Eye className="mr-2 h-4 w-4" />
                                  View Details
                                </DropdownMenuItem>
                                {tx.status === "flagged" && (
                                  <>
                                    <DropdownMenuItem className="text-success">
                                      <CheckCircle className="mr-2 h-4 w-4" />
                                      Approve Transaction
                                    </DropdownMenuItem>
                                    <DropdownMenuItem className="text-destructive">
                                      <XCircle className="mr-2 h-4 w-4" />
                                      Reject Transaction
                                    </DropdownMenuItem>
                                  </>
                                )}
                                {tx.status !== "flagged" && (
                                  <DropdownMenuItem className="text-warning">
                                    <Flag className="mr-2 h-4 w-4" />
                                    Flag for Review
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                  <AlertTriangle className="mr-2 h-4 w-4" />
                                  Report Fraud
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </motion.tr>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </AdminLayout>
  );
}
