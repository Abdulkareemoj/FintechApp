import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTransactions } from "@/hooks/useTransactions";
import type { Transaction } from "@/lib/api/transactions";

function formatAmount(amount: number, currency: string, direction: string) {
  const sign = direction === "incoming" ? "+" : "-";
  const abs = Math.abs(amount);
  return `${sign} ${currency} ${abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function humanize(value: string) {
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function statusClass(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
    case "paid":
      return "text-emerald-600";
    case "pending":
    case "processing":
      return "text-amber-500";
    default:
      return "text-destructive";
  }
}

function TransactionRow({ tx }: { tx: Transaction }) {
  return (
    <Button
      className="items-start"
      onPress={() =>
        router.push({
          pathname: "/(drawer)/transactions/[id]",
          params: { id: tx.id },
        } as any)
      }
      variant="outline"
    >
      <View className="w-full flex-row items-start justify-between">
        <View className="flex-1 pr-3">
          <Text className="font-medium">
            {tx.description || humanize(tx.type)}
          </Text>
          <Text className="text-muted-foreground text-sm">
            {humanize(tx.type)} · {formatDate(tx.createdAt)}
          </Text>
          <Text className={`text-xs ${statusClass(tx.status)}`}>
            {humanize(tx.status)}
          </Text>
        </View>
        <Text
          className={
            tx.direction === "incoming"
              ? "text-emerald-600"
              : "text-destructive"
          }
        >
          {formatAmount(tx.amount, tx.currency, tx.direction)}
        </Text>
      </View>
    </Button>
  );
}

export default function TransactionsScreen() {
  const { data, isLoading, isError, refetch } = useTransactions({
    page: 1,
    pageSize: 50,
  });

  const items = (data as any)?.items ?? [];

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Transactions</Text>
        <Text className="text-muted-foreground">All your recent activity.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {isLoading ? (
            <ActivityIndicator className="py-8 text-primary" />
          ) : isError ? (
            <View className="gap-3 py-4">
              <Text className="text-muted-foreground text-center">
                Couldn't load transactions.
              </Text>
              <Button variant="outline" onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </View>
          ) : items.length === 0 ? (
            <Text className="py-8 text-center text-muted-foreground">
              No transactions yet.
            </Text>
          ) : (
            items.map((tx: Transaction) => (
              <TransactionRow key={tx.id} tx={tx} />
            ))
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}