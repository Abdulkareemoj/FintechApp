import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Plus } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";

const accounts = [
  { id: "1", name: "Main Account", balance: "$24,850.00", type: "Checking", number: "**** 4521" },
  { id: "2", name: "Savings", balance: "$67,200.00", type: "Savings", number: "**** 7890" },
  { id: "3", name: "Business Account", balance: "$12,430.00", type: "Business", number: "**** 3367" },
  { id: "4", name: "Euro Account", balance: "€3,200.00", type: "Multi-Currency", number: "**** 1104" },
];

export default function AccountsScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Accounts</Text>
        <Text className="text-muted-foreground">Manage your linked accounts and balances.</Text>
      </View>

      {accounts.map((a) => (
        <Card key={a.id}>
          <CardHeader className="pb-2">
            <View className="flex-row items-center justify-between">
              <CardTitle>{a.name}</CardTitle>
              <Text className="text-muted-foreground text-sm">{a.type}</Text>
            </View>
          </CardHeader>
          <CardContent>
            <Text className="font-bold text-2xl text-foreground">{a.balance}</Text>
            <Text className="text-muted-foreground text-sm">{a.number}</Text>
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" className="flex-row items-center gap-2">
        <Icon as={Plus} size={18} className="text-foreground" />
        <Text>Link new account</Text>
      </Button>
    </ScrollView>
  );
}
