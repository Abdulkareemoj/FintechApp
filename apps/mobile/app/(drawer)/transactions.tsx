import React from "react";
import { router } from "expo-router";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const transactions = [
  {
    id: "tx_1",
    title: "Transfer to Ada",
    subtitle: "P2P Transfer",
    amount: -50.0,
    currency: "USD",
    date: "2024-01-20",
    status: "completed",
  },
  {
    id: "tx_2",
    title: "Card funding",
    subtitle: "Top up",
    amount: 200.0,
    currency: "USD",
    date: "2024-01-19",
    status: "completed",
  },
  {
    id: "tx_3",
    title: "Merchant payment",
    subtitle: "Coffee Shop",
    amount: -12.5,
    currency: "USD",
    date: "2024-01-19",
    status: "pending",
  },
];

function formatAmount(amount: number, currency: string) {
  const sign = amount < 0 ? "-" : "+";
  const abs = Math.abs(amount);
  return `${sign} ${currency} ${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function TransactionsScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Transactions</Text>
        <Text className="text-muted-foreground">All your recent activity.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>History</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {transactions.map((tx) => (
            <Button
              key={tx.id}
              variant="outline"
              className="items-start"
              onPress={() =>
                router.push(
                  {
                    pathname: "/(drawer)/transactions/[id]",
                    params: { id: tx.id },
                  } as any
                )
              }
            >
              <View className="w-full flex-row items-start justify-between">
                <View className="flex-1 pr-3">
                  <Text className="font-medium">{tx.title}</Text>
                  <Text className="text-muted-foreground text-sm">
                    {tx.subtitle} · {tx.date} · {tx.status}
                  </Text>
                </View>
                <Text className={tx.amount < 0 ? "text-destructive" : "text-emerald-600"}>
                  {formatAmount(tx.amount, tx.currency)}
                </Text>
              </View>
            </Button>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
