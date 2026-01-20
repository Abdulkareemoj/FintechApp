import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Calendar,
  Download,
  Filter,
  MoreVertical,
  Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import DashboardLayout from "@/layout/DashboardLayout";

const transactionsData = [
  {
    id: "TXN001",
    name: "Starbucks",
    category: "Food & Drink",
    amount: 15.0,
    status: "completed",
    date: "2024-07-20",
    type: "outgoing",
    method: "Card •••• 4567",
  },
  {
    id: "TXN002",
    name: "Amazon Prime",
    category: "Shopping",
    amount: 120.5,
    status: "completed",
    date: "2024-07-19",
    type: "outgoing",
    method: "Card •••• 4567",
  },
  {
    id: "TXN003",
    name: "Salary Deposit",
    category: "Income",
    amount: 5000.0,
    status: "completed",
    date: "2024-07-18",
    type: "incoming",
    method: "Bank Transfer",
  },
  {
    id: "TXN004",
    name: "Netflix",
    category: "Entertainment",
    amount: 19.99,
    status: "completed",
    date: "2024-07-17",
    type: "outgoing",
    method: "Card •••• 4567",
  },
  {
    id: "TXN005",
    name: "Freelance Payment",
    category: "Income",
    amount: 800.0,
    status: "pending",
    date: "2024-07-16",
    type: "incoming",
    method: "Bank Transfer",
  },
  {
    id: "TXN006",
    name: "Uber",
    category: "Transport",
    amount: 24.5,
    status: "completed",
    date: "2024-07-15",
    type: "outgoing",
    method: "Card •••• 9012",
  },
  {
    id: "TXN007",
    name: "Grocery Store",
    category: "Food & Drink",
    amount: 85.3,
    status: "completed",
    date: "2024-07-14",
    type: "outgoing",
    method: "Card •••• 4567",
  },
  {
    id: "TXN008",
    name: "Electric Bill",
    category: "Utilities",
    amount: 120.0,
    status: "processing",
    date: "2024-07-13",
    type: "outgoing",
    method: "Bank Transfer",
  },
  {
    id: "TXN009",
    name: "Client Payment",
    category: "Income",
    amount: 2500.0,
    status: "completed",
    date: "2024-07-12",
    type: "incoming",
    method: "Bank Transfer",
  },
  {
    id: "TXN010",
    name: "Gym Membership",
    category: "Health",
    amount: 49.99,
    status: "completed",
    date: "2024-07-11",
    type: "outgoing",
    method: "Card •••• 4567",
  },
];

const statusVariants: Record<string, string> = {
  completed: "bg-success/10 text-success border-success/20",
  pending: "bg-warning/10 text-warning border-warning/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
};

export const Route = createFileRoute("/(dashboard)/dashboard/transactions")({
  component: TransactionsPage,
});

function TransactionsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTransactions = transactionsData.filter((tx) => {
    const matchesSearch =
      tx.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || tx.status === statusFilter;
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatAmount = (amount: number, type: string) => {
    const formatted = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
    return type === "incoming" ? "+${formatted}" : "-${formatted}";
  };

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  const totalIncome = transactionsData
    .filter((t) => t.type === "incoming")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactionsData
    .filter((t) => t.type === "outgoing")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <DashboardLayout>
      <div className="min-h-screen bg-background">
        {/* Main Content */}
        <main className="mx-auto space-y-6 px-6 py-8">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
            initial={{ opacity: 0, y: 10 }}
          >
            <div>
              <h1 className="font-bold text-3xl tracking-tight">
                Transactions
              </h1>
              <p className="mt-1 text-muted-foreground">
                View and manage your transaction history
              </p>
            </div>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export CSV
            </Button>
          </motion.div>

          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm">Total Income</p>
                  <p className="number-display mt-1 font-bold text-2xl text-success">
                    +
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalIncome)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.15 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm">
                    Total Expenses
                  </p>
                  <p className="number-display mt-1 font-bold text-2xl text-destructive">
                    -
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                    }).format(totalExpenses)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="border-border/50 bg-card-gradient shadow-card">
                <CardContent className="p-6">
                  <p className="text-muted-foreground text-sm">Net Balance</p>
                  <p
                    className={`number-display mt-1 font-bold text-2xl ${totalIncome - totalExpenses >= 0 ? "text-success" : "text-destructive"}`}
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      signDisplay: "always",
                    }).format(totalIncome - totalExpenses)}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Filters */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.25 }}
          >
            <Card className="border-border/50 bg-card-gradient shadow-card">
              <CardContent className="p-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <div className="relative flex-1">
                    <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      className="bg-muted/50 pl-10"
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search transactions..."
                      value={searchQuery}
                    />
                  </div>
                  <Select onValueChange={setStatusFilter} value={statusFilter}>
                    <SelectTrigger className="w-full bg-muted/50 md:w-40">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select onValueChange={setTypeFilter} value={typeFilter}>
                    <SelectTrigger className="w-full bg-muted/50 md:w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="incoming">Income</SelectItem>
                      <SelectItem value="outgoing">Expenses</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button className="gap-2" variant="outline">
                    <Calendar className="h-4 w-4" />
                    Date Range
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Transactions Table */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="border-border/50 bg-card-gradient shadow-card">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Transaction History</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-border/50 hover:bg-transparent">
                      <TableHead className="text-muted-foreground">
                        Transaction
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Category
                      </TableHead>
                      <TableHead className="hidden text-muted-foreground md:table-cell">
                        Method
                      </TableHead>
                      <TableHead className="text-muted-foreground">
                        Status
                      </TableHead>
                      <TableHead className="hidden text-muted-foreground md:table-cell">
                        Date
                      </TableHead>
                      <TableHead className="text-right text-muted-foreground">
                        Amount
                      </TableHead>
                      <TableHead className="w-10" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredTransactions.map((tx, index) => (
                      <motion.tr
                        animate={{ opacity: 1, x: 0 }}
                        className="group border-border/30 transition-colors hover:bg-accent/50"
                        initial={{ opacity: 0, x: -10 }}
                        key={tx.id}
                        transition={{ delay: 0.3 + index * 0.03 }}
                      >
                        <TableCell className="py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`rounded-full p-2 ${tx.type === "incoming" ? "bg-success/10" : "bg-muted"}`}
                            >
                              {tx.type === "incoming" ? (
                                <ArrowDownLeft className="h-4 w-4 text-success" />
                              ) : (
                                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                              )}
                            </div>
                            <div>
                              <p className="font-medium">{tx.name}</p>
                              <p className="text-muted-foreground text-xs">
                                {tx.id}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className="font-normal" variant="secondary">
                            {tx.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {tx.method}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`capitalize ${statusVariants[tx.status]}`}
                            variant="outline"
                          >
                            {tx.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-muted-foreground md:table-cell">
                          {formatDate(tx.date)}
                        </TableCell>
                        <TableCell className="text-right">
                          <span
                            className={`number-display font-semibold ${tx.type === "incoming" ? "text-success" : ""}`}
                          >
                            {formatAmount(tx.amount, tx.type)}
                          </span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                className="h-8 w-8 opacity-0 group-hover:opacity-100"
                                size="icon"
                                variant="ghost"
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border-border bg-card"
                            >
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>
                                Download Receipt
                              </DropdownMenuItem>
                              <DropdownMenuItem>Report Issue</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </div>
    </DashboardLayout>
  );
}
