import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

export default function RequestMoney() {
  const [email, setEmail] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">
          Request money
        </Text>
        <Text className="text-muted-foreground">
          Send a payment request to another user
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Request details</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Label htmlFor="email">From</Label>
            <Input
              autoCapitalize="none"
              id="email"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="Enter email address"
              value={email}
            />
          </View>

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

          <View className="gap-2">
            <Label htmlFor="note">Note (optional)</Label>
            <Input
              id="note"
              onChangeText={setNote}
              placeholder="What’s this for?"
              value={note}
            />
          </View>

          <Button disabled={!(email && amount)}>
            <Text>Send request</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
