import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  MoreVertical,
  Users,
} from "lucide-react";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/(dashboard)/overview")({
  component: OverviewPage,
});

const kpiData = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    icon: DollarSign,
    description: "from last month",
  },
  {
    title: "Subscriptions",
    value: "+2,350",
    change: "+180.1%",
    icon: Users,
    description: "from last month",
  },
  {
    title: "Sales",
    value: "+12,234",
    change: "+19%",
    icon: CreditCard,
    description: "from last month",
  },
  {
    title: "Active Now",
    value: "+573",
    change: "+201 since last hour",
    icon: Activity,
    description: "in the last hour",
  },
];

const recentTransactions = [
  {
    name: "Starbucks",
    email: "coffee@starbucks.com",
    amount: "-$15.00",
    status: "Processing",
    date: "2024-07-20",
  },
  {
    name: "Amazon",
    email: "prime@amazon.com",
    amount: "-$120.50",
    status: "Completed",
    date: "2024-07-19",
  },
  {
    name: "Salary Deposit",
    email: "hr@acmeinc.com",
    amount: "+$5,000.00",
    status: "Completed",
    date: "2024-07-18",
  },
  {
    name: "Netflix",
    email: "billing@netflix.com",
    amount: "-$19.99",
    status: "Completed",
    date: "2024-07-17",
  },
  {
    name: "Freelance Payment",
    email: "client@freelance.co",
    amount: "+$800.00",
    status: "Pending",
    date: "2024-07-16",
  },
];

function OverviewPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">
          Dashboard Overview
        </h1>
        <Button>Download Report</Button>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="font-medium text-sm">{kpi.title}</CardTitle>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="font-bold text-2xl">{kpi.value}</div>
              <p className="text-muted-foreground text-xs">
                <span className="flex items-center text-green-500">
                  <ArrowUpRight className="mr-1 h-3 w-3" />
                  {kpi.change}
                </span>
                {kpi.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Recent Transactions Table */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>
              You made 5 transactions this month.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="hidden md:table-cell">Date</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="font-medium">{transaction.name}</div>
                      <div className="hidden text-muted-foreground text-sm md:inline">
                        {transaction.email}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          transaction.status === "Completed"
                            ? "default"
                            : transaction.status === "Pending"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {transaction.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {transaction.date}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {transaction.amount}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button className="h-8 w-8 p-0" variant="ghost">
                            <span className="sr-only">Open menu</span>
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Download Receipt</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Account Balances Card */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Account Balances</CardTitle>
            <CardDescription>
              Current balances across your linked accounts.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Wallet className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-sm leading-none">
                    Checking Account
                  </p>
                  <p className="text-muted-foreground text-sm">**** 1234</p>
                </div>
              </div>
              <div className="font-semibold text-lg">$15,450.20</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <CreditCard className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-sm leading-none">
                    Savings Account
                  </p>
                  <p className="text-muted-foreground text-sm">**** 5678</p>
                </div>
              </div>
              <div className="font-semibold text-lg">$32,100.55</div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <DollarSign className="h-6 w-6 text-primary" />
                <div>
                  <p className="font-medium text-sm leading-none">
                    Business Credit
                  </p>
                  <p className="text-muted-foreground text-sm">**** 9012</p>
                </div>
              </div>
              <div className="font-semibold text-lg text-red-500">
                -$1,200.00
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
