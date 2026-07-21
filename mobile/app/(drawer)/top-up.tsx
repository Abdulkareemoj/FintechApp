import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

export default function TopUpScreen() {
  const [amount, setAmount] = React.useState("");

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Add money</Text>
        <Text className="text-muted-foreground">Top up your wallet.</Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Top up</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              keyboardType="decimal-pad"
              onChangeText={setAmount}
              placeholder="0.00"
              value={amount}
            />
          </View>

          <View className="flex-row gap-2">
            <Button
              className="flex-1"
              onPress={() => setAmount("25")}
              variant="secondary"
            >
              <Text>25</Text>
            </Button>
            <Button
              className="flex-1"
              onPress={() => setAmount("50")}
              variant="secondary"
            >
              <Text>50</Text>
            </Button>
            <Button
              className="flex-1"
              onPress={() => setAmount("100")}
              variant="secondary"
            >
              <Text>100</Text>
            </Button>
          </View>

          <Button disabled={!amount}>
            <Text>Continue</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
