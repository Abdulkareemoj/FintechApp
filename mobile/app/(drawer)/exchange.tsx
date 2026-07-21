import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

export default function Exchange() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Exchange</Text>
        <Text className="text-muted-foreground">
          Convert between currencies at real-time rates
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Currency converter</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="rounded-lg border border-border bg-background px-4 py-3">
            <Text className="text-muted-foreground text-sm">From</Text>
            <Text className="font-medium text-lg">USD</Text>
            <Text className="font-semibold">1,000.00</Text>
          </View>
          
          <View className="rounded-lg border border-border bg-background px-4 py-3">
            <Text className="text-muted-foreground text-sm">To</Text>
            <Text className="font-medium text-lg">NGN</Text>
            <Text className="font-semibold">1,525,000.00</Text>
          </View>

          <View className="rounded-lg border border-border bg-muted px-4 py-3">
            <Text className="text-muted-foreground text-sm">Rate</Text>
            <Text className="font-medium">1 USD = 1,525 NGN</Text>
          </View>

          <Button className="w-full">
            <Text>Exchange now</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
