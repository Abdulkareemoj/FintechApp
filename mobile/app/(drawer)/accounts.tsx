import React from "react";
import { ActivityIndicator, ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import { useWallets } from "@/hooks/useWallets";

const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  NGN: "₦",
  KES: "KSh",
};

function formatBalance(balance: number, code: string) {
  const symbol = currencySymbols[code.toUpperCase()] ?? `${code} `;
  return `${symbol}${balance.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export default function AccountsScreen() {
  const { data: wallets, isLoading, isError, refetch } = useWallets();

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Accounts</Text>
        <Text className="text-muted-foreground">Manage your linked accounts and balances.</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator className="py-8 text-primary" />
      ) : isError ? (
        <View className="gap-3 py-4">
          <Text className="text-muted-foreground text-center">
            Couldn't load accounts.
          </Text>
          <Button variant="outline" onPress={() => refetch()}>
            <Text>Retry</Text>
          </Button>
        </View>
      ) : !wallets || wallets.length === 0 ? (
        <Text className="py-8 text-center text-muted-foreground">
          No linked accounts yet.
        </Text>
      ) : (
        (wallets as any[]).map((w) => (
          <Card key={w.id}>
            <CardHeader className="pb-2">
              <View className="flex-row items-center justify-between">
                <CardTitle>{w.currencyCode} Account</CardTitle>
                <Text className="text-muted-foreground text-sm">
                  {w.status === "Active" ? "Checking" : w.status}
                </Text>
              </View>
            </CardHeader>
            <CardContent>
              <Text className="font-bold text-2xl text-foreground">
                {formatBalance(w.balance, w.currencyCode)}
              </Text>
              <Text className="text-muted-foreground text-sm">
                •••• {w.id.slice(-4)}
              </Text>
            </CardContent>
          </Card>
        ))
      )}

      <Button variant="outline" className="flex-row items-center gap-2" disabled>
        <Icon as={Plus} size={18} className="text-foreground" />
        <Text>Link new account</Text>
      </Button>
    </ScrollView>
  );
}