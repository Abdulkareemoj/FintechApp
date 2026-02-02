import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";

const billers = [
  { id: "airtime", name: "Airtime" },
  { id: "data", name: "Mobile data" },
  { id: "electricity", name: "Electricity" },
  { id: "internet", name: "Internet" },
];

export default function BillsScreen() {
  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="text-3xl font-bold text-foreground">Bills</Text>
        <Text className="text-muted-foreground">Pay common bills quickly.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Billers</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          {billers.map((b) => (
            <Button key={b.id} variant="outline">
              <Text>{b.name}</Text>
            </Button>
          ))}
        </CardContent>
      </Card>
    </ScrollView>
  );
}
