import { createFileRoute } from "@tanstack/react-router";
import { ArrowDownUp, Filter } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export const Route = createFileRoute("/(dashboard)/transactions")({
  component: TransactionsPage,
});

const transactionData = [
  {
    id: 1,
    date: "2024-07-20",
    description: "Starbucks Coffee",
    category: "Food",
    amount: -15.0,
    status: "Completed",
  },
  {
    id: 2,
    date: "2024-07-19",
    description: "Amazon Prime",
    category: "Subscription",
    amount: -120.5,
    status: "Completed",
  },
  {
    id: 3,
    date: "2024-07-18",
    description: "Salary Deposit",
    category: "Income",
    amount: 5000.0,
    status: "Completed",
  },
  {
    id: 4,
    date: "2024-07-17",
    description: "Netflix Billing",
    category: "Subscription",
    amount: -19.99,
    status: "Completed",
  },
  {
    id: 5,
    date: "2024-07-16",
    description: "Freelance Payment",
    category: "Income",
    amount: 800.0,
    status: "Pending",
  },
];

function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-bold text-3xl tracking-tight">
          Transaction History
        </h1>
        <div className="flex gap-2">
          <Button size="sm" variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <Button size="sm" variant="outline">
            <ArrowDownUp className="mr-2 h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="hidden md:table-cell">Category</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactionData.map((txn) => (
                <TableRow key={txn.id}>
                  <TableCell className="font-medium">{txn.date}</TableCell>
                  <TableCell>{txn.description}</TableCell>
                  <TableCell className="hidden text-muted-foreground md:table-cell">
                    {txn.category}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        txn.status === "Completed" ? "default" : "secondary"
                      }
                    >
                      {txn.status}
                    </Badge>
                  </TableCell>
                  <TableCell
                    className={`text-right font-semibold ${txn.amount < 0 ? "text-destructive" : "text-green-500"}`}
                  >
                    {txn.amount.toLocaleString("en-US", {
                      style: "currency",
                      currency: "USD",
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
