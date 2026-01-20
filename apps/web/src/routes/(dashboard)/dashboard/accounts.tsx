import { createFileRoute } from "@tanstack/react-router";
import {
  Building2,
  ExternalLink,
  Eye,
  EyeOff,
  MoreVertical,
  PiggyBank,
  PlusCircle,
  Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DashboardLayout from "@/layout/DashboardLayout";

const accountsData = [
  {
    id: "1",
    name: "Checking Account",
    type: "checking",
    balance: 15_450.2,
    lastFour: "1234",
    currency: "USD",
    status: "active",
  },
  {
    id: "2",
    name: "Savings Account",
    type: "savings",
    balance: 32_100.55,
    lastFour: "5678",
    currency: "USD",
    status: "active",
  },
  {
    id: "3",
    name: "Business Account",
    type: "business",
    balance: 8750.0,
    lastFour: "9012",
    currency: "USD",
    status: "active",
  },
  {
    id: "4",
    name: "Euro Account",
    type: "checking",
    balance: 2500.0,
    lastFour: "3456",
    currency: "EUR",
    status: "active",
  },
];

const accountIcons = {
  checking: Wallet,
  savings: PiggyBank,
  business: Building2,
};

export const Route = createFileRoute("/(dashboard)/dashboard/accounts")({
  component: AccountsPage,
});

function AccountsPage() {
  const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());

  const toggleBalance = (id: string) => {
    const newSet = new Set(hiddenBalances);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setHiddenBalances(newSet);
  };

  const formatBalance = (amount: number, currency: string) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
    }).format(amount);

  const totalBalance = accountsData.reduce((sum, acc) => sum + acc.balance, 0);

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
              <h1 className="font-bold text-3xl tracking-tight">My Accounts</h1>
              <p className="mt-1 text-muted-foreground">
                Manage all your connected accounts
              </p>
            </div>
            <Button className="bg-primary-gradient">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New Account
            </Button>
          </motion.div>

          {/* Total Balance Card */}
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-border/50 bg-card-gradient shadow-card">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-muted-foreground text-sm">
                      Total Balance Across All Accounts
                    </p>
                    <p className="number-display mt-2 font-bold text-4xl">
                      {formatBalance(totalBalance, "USD")}
                    </p>
                  </div>
                  <div className="hidden gap-4 md:flex">
                    <div className="text-center">
                      <p className="font-bold text-2xl text-success">+$5,800</p>
                      <p className="text-muted-foreground text-xs">
                        This Month
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="font-bold text-2xl">4</p>
                      <p className="text-muted-foreground text-xs">Accounts</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Accounts Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {accountsData.map((account, index) => {
              const Icon =
                accountIcons[account.type as keyof typeof accountIcons] ||
                Wallet;
              const isHidden = hiddenBalances.has(account.id);

              return (
                <motion.div
                  animate={{ opacity: 1, y: 0 }}
                  initial={{ opacity: 0, y: 20 }}
                  key={account.id}
                  transition={{ delay: 0.1 + index * 0.05 }}
                >
                  <Card className="group border-border/50 bg-card-gradient shadow-card transition-all duration-300 hover:shadow-elevated">
                    <CardHeader className="flex flex-row items-start justify-between pb-2">
                      <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-primary/10 p-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">
                            {account.name}
                          </CardTitle>
                          <p className="text-muted-foreground text-sm">
                            •••• {account.lastFour}
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            className="h-8 w-8 opacity-0 transition-opacity group-hover:opacity-100"
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
                            Transaction History
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Download Statement
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            Remove Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="mb-1 text-muted-foreground text-sm">
                            Available Balance
                          </p>
                          <p className="number-display font-bold text-3xl">
                            {isHidden
                              ? "••••••"
                              : formatBalance(
                                  account.balance,
                                  account.currency
                                )}
                          </p>
                        </div>
                        <Button
                          onClick={() => toggleBalance(account.id)}
                          size="icon"
                          variant="ghost"
                        >
                          {isHidden ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                      <div className="mt-4 flex gap-2">
                        <Button
                          className="flex-1"
                          size="sm"
                          variant="secondary"
                        >
                          Transfer
                        </Button>
                        <Button className="flex-1" size="sm" variant="outline">
                          <ExternalLink className="mr-1 h-3 w-3" />
                          Details
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {/* Add Account Card */}
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="h-full min-h-[220px] border-2 border-border border-dashed transition-colors hover:border-primary/50">
                <CardContent className="flex h-full flex-col items-center justify-center p-6">
                  <Button
                    className="flex h-auto flex-col gap-3 py-8"
                    variant="ghost"
                  >
                    <div className="rounded-full bg-muted p-4">
                      <PlusCircle className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <span className="font-medium">Link External Account</span>
                    <span className="text-muted-foreground text-xs">
                      Connect your bank accounts
                    </span>
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
