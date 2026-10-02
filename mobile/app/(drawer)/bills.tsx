import React, { useState } from "react";
import { Alert, ScrollView, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import {
  BILL_CATEGORIES,
  type Bill,
  type BillStatus,
} from "@/lib/api/bills";
import {
  useBills,
  useCreateBill,
  usePayBill,
  useQuickPayBill,
} from "@/hooks/useBills";
import { useWallets } from "@/hooks/useWallets";

const STATUS_META: Record<
  BillStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  paid: { label: "Paid", variant: "secondary" },
  overdue: { label: "Overdue", variant: "destructive" },
  due: { label: "Due soon", variant: "destructive" },
  upcoming: { label: "Upcoming", variant: "outline" },
};

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString();
}

export default function BillsScreen() {
  const billsQuery = useBills();
  const createBill = useCreateBill();
  const payBill = usePayBill();
  const quickPay = useQuickPayBill();
  const { data: wallets } = useWallets();

  const wallet = wallets?.[0];

  // Quick pay (biller grid)
  const [quickCategory, setQuickCategory] = useState<string | null>(null);
  const [quickName, setQuickName] = useState("");
  const [quickAmount, setQuickAmount] = useState("");
  const [quickReference, setQuickReference] = useState("");

  // Add bill
  const [addName, setAddName] = useState("");
  const [addCategory, setAddCategory] = useState("Electricity");
  const [addAmount, setAddAmount] = useState("");
  const [addDueDate, setAddDueDate] = useState("");
  const [addReference, setAddReference] = useState("");

  const bills = billsQuery.data ?? [];
  const unpaid = bills.filter((b) => b.status !== "paid");
  const paid = bills.filter((b) => b.status === "paid");
  const totalDue = unpaid.reduce((sum, b) => sum + b.amount, 0);

  const fail = (err: unknown) =>
    Alert.alert("Failed", err instanceof Error ? err.message : "Try again later.");

  const handleQuickPay = () => {
    if (!quickCategory) return;
    const amount = Number(quickAmount);
    if (!amount || amount <= 0) {
      Alert.alert("Invalid amount", "Enter an amount greater than 0.");
      return;
    }
    if (!wallet) {
      Alert.alert("No wallet", "Add a wallet before paying bills.");
      return;
    }
    quickPay.mutate(
      {
        category: quickCategory,
        name: quickName.trim() || undefined,
        amount,
        reference: quickReference.trim() || undefined,
        walletId: wallet.id,
      },
      {
        onSuccess: () => {
          Alert.alert("Bill paid", `$${amount.toFixed(2)} paid from your ${wallet.currencyCode} wallet.`);
          setQuickCategory(null);
          setQuickName("");
          setQuickAmount("");
          setQuickReference("");
        },
        onError: fail,
      },
    );
  };

  const handlePayScheduled = (bill: Bill) => {
    if (!wallet) {
      Alert.alert("No wallet", "Add a wallet before paying bills.");
      return;
    }
    Alert.alert(
      "Pay bill",
      `${bill.name} — $${bill.amount.toFixed(2)} from your ${wallet.currencyCode} wallet?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Pay",
          onPress: () =>
            payBill.mutate(
              { id: bill.id, req: { walletId: wallet.id } },
              {
                onSuccess: () =>
                  Alert.alert("Bill paid", `${bill.name} is now marked as paid.`),
                onError: fail,
              },
            ),
        },
      ],
    );
  };

  const handleAddBill = () => {
    const amount = Number(addAmount);
    if (!addName.trim()) {
      Alert.alert("Missing name", "Enter the biller name.");
      return;
    }
    if (!amount || amount <= 0) {
      Alert.alert("Invalid amount", "Enter an amount greater than 0.");
      return;
    }
    if (!DATE_PATTERN.test(addDueDate)) {
      Alert.alert("Invalid date", "Due date must be YYYY-MM-DD.");
      return;
    }
    createBill.mutate(
      {
        name: addName.trim(),
        category: addCategory,
        amount,
        dueDate: addDueDate,
        reference: addReference.trim() || undefined,
      },
      {
        onSuccess: () => {
          Alert.alert("Bill added", `${addName.trim()} was added to your bills.`);
          setAddName("");
          setAddAmount("");
          setAddDueDate("");
          setAddReference("");
        },
        onError: fail,
      },
    );
  };

  const renderStatus = (status: BillStatus) => (
    <Badge variant={STATUS_META[status].variant}>{STATUS_META[status].label}</Badge>
  );

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Bills</Text>
        <Text className="text-muted-foreground">
          Pay utilities and manage recurring bills.
        </Text>
      </View>

      {/* Pay a biller */}
      <Card>
        <CardHeader>
          <CardTitle>Pay a biller</CardTitle>
          {wallet ? (
            <Text className="text-muted-foreground text-sm">
              Paying from your {wallet.currencyCode} wallet
            </Text>
          ) : null}
        </CardHeader>
        <CardContent className="gap-2">
          <View className="flex-row flex-wrap gap-2">
            {BILL_CATEGORIES.map((category) => (
              <View className="w-[48%]" key={category}>
                <Button
                  onPress={() => {
                    setQuickCategory(
                      quickCategory === category ? null : category,
                    );
                    setQuickName("");
                    setQuickAmount("");
                    setQuickReference("");
                  }}
                  variant={quickCategory === category ? "default" : "outline"}
                >
                  <Text>{category}</Text>
                </Button>
              </View>
            ))}
          </View>

          {quickCategory ? (
            <View className="mt-2 gap-3 rounded-xl border border-border p-3">
              <Text className="font-semibold">{quickCategory} payment</Text>
              <View className="gap-1">
                <Label>Biller name (optional)</Label>
                <Input
                  onChangeText={setQuickName}
                  placeholder={quickCategory}
                  value={quickName}
                />
              </View>
              <View className="gap-1">
                <Label>Amount</Label>
                <Input
                  keyboardType="decimal-pad"
                  onChangeText={setQuickAmount}
                  placeholder="0.00"
                  value={quickAmount}
                />
              </View>
              <View className="gap-1">
                <Label>Account / ref (optional)</Label>
                <Input
                  onChangeText={setQuickReference}
                  value={quickReference}
                />
              </View>
              <View className="flex-row gap-2">
                <View className="flex-1">
                  <Button
                    onPress={() => setQuickCategory(null)}
                    variant="ghost"
                  >
                    <Text>Cancel</Text>
                  </Button>
                </View>
                <View className="flex-1">
                  <Button
                    disabled={quickPay.isPending}
                    onPress={handleQuickPay}
                  >
                    <Text>{quickPay.isPending ? "Paying…" : "Pay now"}</Text>
                  </Button>
                </View>
              </View>
            </View>
          ) : null}
        </CardContent>
      </Card>

      {/* Upcoming bills */}
      <Card>
        <CardHeader>
          <View className="flex-row items-center justify-between">
            <CardTitle>Upcoming bills</CardTitle>
            <Text className="font-semibold text-sm text-warning">
              ${totalDue.toFixed(2)}
            </Text>
          </View>
        </CardHeader>
        <CardContent className="gap-2">
          {billsQuery.isPending ? (
            <>
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-14 w-full" />
            </>
          ) : billsQuery.isError ? (
            <View className="items-center gap-2 py-4">
              <Text className="text-muted-foreground">Failed to load bills.</Text>
              <Button onPress={() => void billsQuery.refetch()} variant="outline">
                <Text>Retry</Text>
              </Button>
            </View>
          ) : unpaid.length === 0 ? (
            <Text className="py-2 text-muted-foreground">
              No unpaid bills — pay a biller above or add one below.
            </Text>
          ) : (
            unpaid.map((bill) => (
              <View
                className="flex-row items-center justify-between gap-3 rounded-lg border border-border p-3"
                key={bill.id}
              >
                <View className="flex-1 gap-1">
                  <Text className="font-medium">{bill.name}</Text>
                  <Text className="text-muted-foreground text-xs">
                    {bill.category} · Due {fmtDate(bill.dueDate)}
                    {bill.reference ? ` · Ref: ${bill.reference}` : ""}
                  </Text>
                  <View className="flex-row items-center gap-2">
                    {renderStatus(bill.status)}
                    <Text className="font-semibold text-sm">
                      ${bill.amount.toFixed(2)}
                    </Text>
                  </View>
                </View>
                <Button
                  disabled={payBill.isPending}
                  onPress={() => handlePayScheduled(bill)}
                  size="sm"
                  variant="outline"
                >
                  <Text>Pay</Text>
                </Button>
              </View>
            ))
          )}
        </CardContent>
      </Card>

      {/* Recently paid */}
      <Card>
        <CardHeader>
          <CardTitle>Recently paid</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {billsQuery.isPending ? (
            <Skeleton className="h-14 w-full" />
          ) : paid.length === 0 ? (
            <Text className="py-2 text-muted-foreground">No bill payments yet.</Text>
          ) : (
            paid.slice(0, 6).map((bill) => (
              <View
                className="flex-row items-center justify-between gap-3 rounded-lg bg-success/10 p-3"
                key={bill.id}
              >
                <View className="flex-1 gap-1">
                  <Text className="font-medium">{bill.name}</Text>
                  <Text className="text-muted-foreground text-xs">
                    {bill.paidAt ? `Paid ${fmtDate(bill.paidAt)}` : "Paid"}
                  </Text>
                </View>
                <Text className="font-semibold text-sm">
                  ${bill.amount.toFixed(2)}
                </Text>
              </View>
            ))
          )}
        </CardContent>
      </Card>

      {/* Add a bill */}
      <Card>
        <CardHeader>
          <CardTitle>Add a bill</CardTitle>
          <Text className="text-muted-foreground text-sm">
            Schedule a bill so you can pay it later.
          </Text>
        </CardHeader>
        <CardContent className="gap-3">
          <View className="gap-1">
            <Label>Biller name</Label>
            <Input
              onChangeText={setAddName}
              placeholder="Electric Company"
              value={addName}
            />
          </View>

          <View className="gap-1">
            <Label>Category</Label>
            <View className="flex-row flex-wrap gap-2">
              {BILL_CATEGORIES.map((category) => (
                <View className="w-[48%]" key={category}>
                  <Button
                    onPress={() => setAddCategory(category)}
                    variant={addCategory === category ? "default" : "outline"}
                  >
                    <Text>{category}</Text>
                  </Button>
                </View>
              ))}
            </View>
          </View>

          <View className="flex-row gap-2">
            <View className="flex-1 gap-1">
              <Label>Amount</Label>
              <Input
                keyboardType="decimal-pad"
                onChangeText={setAddAmount}
                placeholder="0.00"
                value={addAmount}
              />
            </View>
            <View className="flex-1 gap-1">
              <Label>Due date</Label>
              <Input
                onChangeText={setAddDueDate}
                placeholder="YYYY-MM-DD"
                value={addDueDate}
              />
            </View>
          </View>

          <View className="gap-1">
            <Label>Account / ref (optional)</Label>
            <Input onChangeText={setAddReference} value={addReference} />
          </View>

          <Button disabled={createBill.isPending} onPress={handleAddBill}>
            <Text>{createBill.isPending ? "Adding…" : "Add bill"}</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
