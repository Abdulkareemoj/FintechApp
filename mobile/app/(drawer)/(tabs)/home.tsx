import { router } from "expo-router";
import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";

function formatAmount(amount: number, currency: string) {
  const sign = amount < 0 ? "-" : "+";
  const abs = Math.abs(amount);
  return `${sign} ${currency} ${abs.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export default function Home() {
  const {
    data: wallets,
    isLoading: walletsLoading,
    error: walletsError,
  } = useWallets();
  const {
    data: transactionsData,
    isLoading: transactionsLoading,
    error: transactionsError,
  } = useTransactions({
    page: 1,
    pageSize: 5,
  });

  // Debug logs
  console.log("Wallets data:", wallets);
  console.log("Wallets error:", walletsError);
  console.log("Transactions data:", transactionsData);
  console.log("Transactions error:", transactionsError);

  if (walletsLoading || transactionsLoading) {
    return <ActivityIndicator />;
  }

  if (walletsError || transactionsError) {
    return (
      <ScrollView className="flex-1 p-6">
        <Text className="text-destructive">Error loading data</Text>
        <Text>{walletsError?.message || transactionsError?.message}</Text>
      </ScrollView>
    );
  }

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Wallet</Text>
        <Text className="text-muted-foreground">
          Balances and recent activity
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Balances</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {Array.isArray(wallets) ? (
            wallets.map((wallet) => (
              <View
                className="flex-row items-center justify-between rounded-lg border border-border bg-background px-4 py-3"
                key={wallet.id}
              >
                <View>
                  <Text className="font-medium">
                    {wallet.currencyCode} Wallet
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    Available
                  </Text>
                </View>
                <Text className="font-semibold">
                  {wallet.currencyCode} {wallet.balance.toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-muted-foreground">No wallets found</Text>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent transactions</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          {transactionsData?.items && Array.isArray(transactionsData.items) ? (
            transactionsData.items.map((tx: any) => (
              <View
                className="flex-row items-start justify-between"
                key={tx.id}
              >
                <View className="flex-1 pr-3">
                  <Text className="font-medium">
                    {tx.description || "Transaction"}
                  </Text>
                  <Text className="text-muted-foreground text-sm">
                    {tx.type} · {new Date(tx.createdAt).toLocaleDateString()}
                  </Text>
                </View>
                <Text
                  className={
                    tx.direction === "outgoing"
                      ? "text-destructive"
                      : "text-emerald-600"
                  }
                >
                  {tx.direction === "outgoing" ? "-" : "+"}
                  {tx.currency} {tx.amount.toFixed(2)}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-muted-foreground">No transactions found</Text>
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
