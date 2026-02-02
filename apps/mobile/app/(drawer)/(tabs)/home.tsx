import React from "react";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const wallets = [
  { currency: "USD", balance: 2450.75 },
  { currency: "NGN", balance: 1250000 },
];

const transactions = [
  { id: "tx_1", title: "Transfer to Ada", subtitle: "P2P Transfer", amount: -50.0, currency: "USD", date: "Today" },
  { id: "tx_2", title: "Card funding", subtitle: "Top up", amount: 200.0, currency: "USD", date: "Yesterday" },
  { id: "tx_3", title: "Merchant payment", subtitle: "Coffee Shop", amount: -12.5, currency: "USD", date: "Yesterday" },
];

function formatAmount(amount: number, currency: string) {
  const sign = amount < 0 ? "-" : "+";
  const abs = Math.abs(amount);
  return `${sign} ${currency} ${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Home() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Wallet</Text>
        <Text className="text-muted-foreground">Balances and recent activity</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {wallets.map((w) => (
            <View
              key={w.currency}
              className="flex-row items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
            >
              <View>
                <Text className="font-medium">{w.currency} Wallet</Text>
                <Text className="text-muted-foreground text-sm">Available</Text>
              </View>
              <Text className="font-semibold">
                {w.currency} {w.balance.toLocaleString()}
              </Text>
            </View>
          ))}

          <View className="flex-row gap-2">
            <Button
              className="flex-1"
              onPress={() => router.push("/(drawer)/(tabs)/transfers")}
            >
              <Text>Send</Text>
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onPress={() => router.push("/(drawer)/top-up" as any)}
            >
              <Text>Add money</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <View className="flex-row gap-2">
            <Button
              className="flex-1"
              variant="secondary"
              onPress={() => router.push("/(drawer)/bills" as any)}
            >
              <Text>Pay bills</Text>
            </Button>
            <Button className="flex-1" variant="secondary">
              <Text>Request money</Text>
            </Button>
          </View>
          <View className="flex-row gap-2">
            <Button className="flex-1" variant="secondary">
              <Text>Exchange</Text>
            </Button>
            <Button
              className="flex-1"
              variant="secondary"
              onPress={() => router.push("/(drawer)/statements" as any)}
            >
              <Text>Statements</Text>
            </Button>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {transactions.map((tx) => (
            <View key={tx.id} className="flex-row items-start justify-between">
              <View className="flex-1 pr-3">
                <Text className="font-medium">{tx.title}</Text>
                <Text className="text-muted-foreground text-sm">
                  {tx.subtitle} · {tx.date}
                </Text>
              </View>
              <Text className={tx.amount < 0 ? "text-destructive" : "text-emerald-600"}>
                {formatAmount(tx.amount, tx.currency)}
              </Text>
            </View>
          ))}

          <Button
            variant="outline"
            onPress={() => router.push("/(drawer)/transactions" as any)}
          >
            <Text>View all</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
