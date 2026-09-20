import { useLocalSearchParams } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTransaction } from "@/hooks/useTransactions";

function humanize(value: string) {
  return value
    .toLowerCase()
    .split(/[\s_-]+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatDate(iso: string) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatAmount(amount: number, currency: string, direction: string) {
  const sign = direction === "incoming" ? "+" : "-";
  const abs = Math.abs(amount);
  return `${sign} ${currency} ${abs.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

function Row({ label, value, valueClass }: { label: string; value: string; valueClass?: string }) {
  return (
    <View className="flex-row items-center justify-between">
      <Text className="text-muted-foreground">{label}</Text>
      <Text className={`font-medium ${valueClass ?? ""}`}>{value}</Text>
    </View>
  );
}

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data, isLoading, isError, refetch } = useTransaction(id);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator className="text-primary" />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View className="flex-1 items-center justify-center gap-3 p-6">
        <Text className="text-muted-foreground">Couldn't load this transaction.</Text>
        <Button variant="outline" onPress={() => refetch()}>
          <Text>Retry</Text>
        </Button>
      </View>
    );
  }

  const tx = data as any;
  const fromWallet = tx.fromWallet;
  const toWallet = tx.toWallet;

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">
          {formatAmount(tx.amount, tx.currency, tx.direction)}
        </Text>
        <Text className={`text-sm ${tx.direction === "incoming" ? "text-emerald-600" : "text-destructive"}`}>
          {humanize(tx.status)} · {humanize(tx.type)}
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Row label="Status" value={humanize(tx.status)} />
          <Row label="Amount" value={`${tx.currency} ${Math.abs(tx.amount).toFixed(2)}`} />
          <Row label="Type" value={humanize(tx.type)} />
          <Row label="Direction" value={humanize(tx.direction)} />
          <Row label="Created" value={formatDate(tx.createdAt)} />
          <Row label="Completed" value={formatDate(tx.completedAt)} />
          <Row label="Fee" value={`${tx.currency} 0.00`} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parties</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <Row
            label="From"
            value={
              fromWallet
                ? fromWallet.isCurrentUser
                  ? "You"
                  : fromWallet.ownerName || "User"
                : "—"
            }
          />
          <Row
            label="To"
            value={
              toWallet
                ? toWallet.isCurrentUser
                  ? "You"
                  : toWallet.ownerName || "User"
                : "—"
            }
          />
        </CardContent>
      </Card>

      {tx.description ? (
        <Card>
          <CardHeader>
            <CardTitle>Note</CardTitle>
          </CardHeader>
          <CardContent>
            <Text className="text-foreground">{tx.description}</Text>
          </CardContent>
        </Card>
      ) : null}
    </ScrollView>
  );
}