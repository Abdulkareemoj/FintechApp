import React from "react";
import { ScrollView, View } from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";

export default function Transfers() {
  const [recipient, setRecipient] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [note, setNote] = React.useState("");

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Send money</Text>
        <Text className="text-muted-foreground">
          Transfer to another user instantly.
        </Text>
      </View>

      <Card>
        <CardHeader>
          <CardTitle>Transfer details</CardTitle>
        </CardHeader>
        <CardContent className="gap-4">
          <View className="gap-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              autoCapitalize="none"
              id="recipient"
              onChangeText={setRecipient}
              placeholder="Email, username, or phone"
              value={recipient}
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
            <Text className="text-muted-foreground text-xs">
              Fees and FX (if any) will show on review.
            </Text>
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

          <Button disabled={!(recipient && amount)}>
            <Text>Review transfer</Text>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent recipients</CardTitle>
        </CardHeader>
        <CardContent className="gap-2">
          <Button
            onPress={() => setRecipient("ada@example.com")}
            variant="outline"
          >
            <Text>Ada (ada@example.com)</Text>
          </Button>
          <Button
            onPress={() => setRecipient("sam@example.com")}
            variant="outline"
          >
            <Text>Sam (sam@example.com)</Text>
          </Button>
        </CardContent>
      </Card>
    </ScrollView>
  );
}
