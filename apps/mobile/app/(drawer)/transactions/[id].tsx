import React from "react";
import { useLocalSearchParams } from "expo-router";
import { ScrollView, View } from "react-native";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function TransactionDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Transaction</Text>
        <Text className="text-muted-foreground">Reference: {id}</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Status</Text>
            <Text className="font-medium">Completed</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Amount</Text>
            <Text className="font-medium">USD 50.00</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Type</Text>
            <Text className="font-medium">Transfer</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Created</Text>
            <Text className="font-medium">2024-01-20</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">Fee</Text>
            <Text className="font-medium">USD 0.00</Text>
          </View>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Parties</CardTitle>
        </CardHeader>
        <CardContent className="gap-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">From</Text>
            <Text className="font-medium">You</Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-muted-foreground">To</Text>
            <Text className="font-medium">Ada</Text>
          </View>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
